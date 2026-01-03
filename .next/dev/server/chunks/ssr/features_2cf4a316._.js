module.exports = [
"[project]/features/settings/inventory/brand-store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useBrandStore",
    ()=>useBrandStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
;
;
;
const generateSystemId = (currentCounter)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(`BRAND${String(currentCounter + 1).padStart(6, '0')}`);
};
const generateBusinessId = (currentCounter)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(`TH${String(currentCounter + 1).padStart(6, '0')}`);
};
// Sample brand data
const rawData = [
    {
        systemId: 'BRAND000001',
        id: 'HOCO',
        name: 'Hoco',
        description: 'Thương hiệu phụ kiện điện thoại cao cấp từ Hồng Kông',
        website: 'https://hoco.com.vn',
        logo: '',
        isActive: true,
        isDeleted: false,
        createdAt: '2024-01-15T08:00:00.000Z',
        updatedAt: '2024-01-15T08:00:00.000Z',
        websiteSeo: {
            pkgx: {
                seoTitle: 'Hoco - Phụ kiện điện thoại cao cấp Hồng Kông | Phụ Kiện Giá Xưởng',
                metaDescription: 'Mua phụ kiện Hoco chính hãng: sạc, cáp, tai nghe, ốp lưng điện thoại chất lượng cao. Bảo hành 12 tháng, giao hàng toàn quốc.',
                seoKeywords: 'hoco, phụ kiện hoco, sạc hoco, cáp hoco, tai nghe hoco',
                slug: 'hoco',
                shortDescription: 'Hoco - Thương hiệu phụ kiện điện thoại cao cấp từ Hồng Kông',
                longDescription: 'Hoco là thương hiệu phụ kiện điện thoại nổi tiếng đến từ Hồng Kông, chuyên cung cấp các sản phẩm chất lượng cao như sạc, cáp, tai nghe, ốp lưng với thiết kế sang trọng và độ bền vượt trội.'
            },
            trendtech: {
                seoTitle: 'Hoco - Phụ kiện điện thoại chính hãng | Trendtech',
                metaDescription: 'Khám phá bộ sưu tập phụ kiện Hoco tại Trendtech. Sản phẩm chính hãng, giá tốt nhất.',
                seoKeywords: 'hoco trendtech, phụ kiện hoco',
                slug: 'hoco'
            }
        }
    },
    {
        systemId: 'BRAND000002',
        id: 'BASEUS',
        name: 'Baseus',
        description: 'Thương hiệu phụ kiện công nghệ hàng đầu Trung Quốc',
        website: 'https://baseus.com',
        logo: '',
        isActive: true,
        isDeleted: false,
        createdAt: '2024-01-15T08:00:00.000Z',
        updatedAt: '2024-01-15T08:00:00.000Z',
        websiteSeo: {
            pkgx: {
                seoTitle: 'Baseus - Thương hiệu phụ kiện công nghệ #1 | Phụ Kiện Giá Xưởng',
                metaDescription: 'Phụ kiện Baseus chính hãng: sạc nhanh, cáp type-c, tai nghe bluetooth, pin dự phòng. Thiết kế đẹp, công nghệ tiên tiến. Freeship đơn từ 300k.',
                seoKeywords: 'baseus, phụ kiện baseus, sạc baseus, pin dự phòng baseus',
                slug: 'baseus',
                shortDescription: 'Baseus - Thương hiệu phụ kiện công nghệ hàng đầu từ Trung Quốc',
                longDescription: 'Baseus là thương hiệu phụ kiện công nghệ hàng đầu Trung Quốc với hơn 10 năm kinh nghiệm. Sản phẩm Baseus nổi tiếng với thiết kế hiện đại, công nghệ sạc nhanh tiên tiến và chất lượng vượt trội.'
            },
            trendtech: {
                seoTitle: 'Baseus Việt Nam - Phụ kiện công nghệ cao cấp | Trendtech',
                metaDescription: 'Mua phụ kiện Baseus chính hãng tại Trendtech. Đa dạng sản phẩm, giá cạnh tranh.',
                seoKeywords: 'baseus vietnam, baseus trendtech',
                slug: 'baseus'
            }
        }
    },
    {
        systemId: 'BRAND000003',
        id: 'REMAX',
        name: 'Remax',
        description: 'Thương hiệu phụ kiện di động phổ biến',
        website: 'https://remax.com',
        logo: '',
        isActive: true,
        isDeleted: false,
        createdAt: '2024-01-15T08:00:00.000Z',
        updatedAt: '2024-01-15T08:00:00.000Z',
        websiteSeo: {
            pkgx: {
                seoTitle: 'Remax - Phụ kiện di động giá tốt | Phụ Kiện Giá Xưởng',
                metaDescription: 'Phụ kiện Remax chính hãng giá rẻ: cáp sạc, tai nghe, loa bluetooth, giá đỡ điện thoại. Bảo hành 6 tháng.',
                seoKeywords: 'remax, phụ kiện remax, cáp remax, tai nghe remax',
                slug: 'remax'
            }
        }
    },
    {
        systemId: 'BRAND000004',
        id: 'BOROFONE',
        name: 'Borofone',
        description: 'Thương hiệu phụ kiện điện tử từ châu Âu',
        website: 'https://borofone.com',
        logo: '',
        isActive: true,
        isDeleted: false,
        createdAt: '2024-01-15T08:00:00.000Z',
        updatedAt: '2024-01-15T08:00:00.000Z',
        websiteSeo: {
            pkgx: {
                seoTitle: 'Borofone - Phụ kiện điện tử châu Âu | Phụ Kiện Giá Xưởng',
                metaDescription: 'Phụ kiện Borofone thiết kế châu Âu: sạc, cáp, tai nghe cao cấp. Chất lượng đảm bảo, bảo hành chính hãng.',
                seoKeywords: 'borofone, phụ kiện borofone, sạc borofone',
                slug: 'borofone',
                shortDescription: 'Borofone - Phụ kiện điện tử phong cách châu Âu'
            }
        }
    },
    {
        systemId: 'BRAND000005',
        id: 'WEKOME',
        name: 'WK Wekome',
        description: 'Thương hiệu phụ kiện thời trang cho giới trẻ',
        website: 'https://wekome.com',
        logo: '',
        isActive: true,
        isDeleted: false,
        createdAt: '2024-01-15T08:00:00.000Z',
        updatedAt: '2024-01-15T08:00:00.000Z'
    },
    {
        systemId: 'BRAND000006',
        id: 'MAXITECH',
        name: 'Maxitech',
        description: 'Thương hiệu phụ kiện công nghệ Việt Nam',
        website: 'https://maxitech.vn',
        logo: '',
        isActive: true,
        isDeleted: false,
        createdAt: '2024-01-15T08:00:00.000Z',
        updatedAt: '2024-01-15T08:00:00.000Z'
    }
];
const initialData = rawData.map((item)=>({
        ...item,
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(item.systemId),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(item.id)
    }));
const INITIAL_COUNTER = rawData.length;
const useBrandStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        data: initialData,
        counter: INITIAL_COUNTER,
        add: (brand)=>{
            const currentCounter = get().counter;
            const { id, ...rest } = brand;
            const businessId = id && id.trim() ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(id.trim()) : generateBusinessId(currentCounter);
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
        isBusinessIdExists: (id)=>get().data.some((item)=>String(item.id) === id)
    }), {
    name: 'brand-storage'
}));
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally only validate once on mount
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
"[project]/features/settings/pkgx/types.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

// Re-export all PKGX types from central prisma-extended
__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2f$prisma$2d$extended$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/types/prisma-extended.ts [app-ssr] (ecmascript)");
;
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/features/settings/pkgx/types.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2f$prisma$2d$extended$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/types/prisma-extended.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/constants.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/pkgx/api-service.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-ssr] (ecmascript)");
;
;
;
;
;
;
const usePkgxSettingsStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        // === Initial State ===
        settings: {
            ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2f$prisma$2d$extended$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_PKGX_SETTINGS"],
            categories: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PKGX_CATEGORIES"],
            brands: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PKGX_BRANDS"]
        },
        isLoading: false,
        isSaving: false,
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
                    ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2f$prisma$2d$extended$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_PKGX_SETTINGS"],
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
        }
    }), {
    name: 'pkgx-settings',
    storage: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createJSONStorage"])(()=>localStorage),
    version: 6,
    migrate: (persistedState, _version)=>{
        const state = persistedState;
        // Ensure pkgxProducts exists
        return {
            ...state,
            settings: {
                ...state?.settings,
                pkgxProducts: state?.settings?.pkgxProducts || [],
                pkgxProductsLastFetch: state?.settings?.pkgxProductsLastFetch || undefined
            }
        };
    },
    partialize: (state)=>{
        // Persist toàn bộ settings bao gồm pkgxProducts (giới hạn 100 SP)
        return {
            settings: state.settings
        };
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
        confirmAction
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
                    {
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
                    }
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
        } catch (_error) {
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
        } catch (_error) {
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
        } catch (_error) {
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
        confirmAction
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
"[project]/features/settings/pkgx/components/pkgx-sync-confirm-dialog.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PkgxSyncConfirmDialog",
    ()=>PkgxSyncConfirmDialog
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-ssr] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/alert-dialog.tsx [app-ssr] (ecmascript)");
;
;
;
function PkgxSyncConfirmDialog({ confirmAction, isSyncing, onConfirm, onCancel }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialog"], {
        open: confirmAction.open,
        onOpenChange: (open)=>!open && onCancel(),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogContent"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogHeader"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogTitle"], {
                            children: confirmAction.title
                        }, void 0, false, {
                            fileName: "[project]/features/settings/pkgx/components/pkgx-sync-confirm-dialog.tsx",
                            lineNumber: 27,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogDescription"], {
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogFooter"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogCancel"], {
                            children: "Hủy"
                        }, void 0, false, {
                            fileName: "[project]/features/settings/pkgx/components/pkgx-sync-confirm-dialog.tsx",
                            lineNumber: 31,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogAction"], {
                            onClick: onConfirm,
                            disabled: isSyncing,
                            children: [
                                isSyncing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
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
"[project]/features/brands/pkgx-brand-actions-cell.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * PkgxBrandActionsCell - Shared dropdown component for PKGX brand sync actions
 * 
 * Uses usePkgxEntitySync hook for consistent sync behavior
 */ __turbopack_context__.s([
    "PkgxBrandActionsCell",
    ()=>PkgxBrandActionsCell
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis.js [app-ssr] (ecmascript) <export default as MoreHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-ssr] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/globe.js [app-ssr] (ecmascript) <export default as Globe>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-ssr] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$text$2d$align$2d$start$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlignLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/text-align-start.js [app-ssr] (ecmascript) <export default as AlignLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-ssr] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Link2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/link-2.js [app-ssr] (ecmascript) <export default as Link2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$unlink$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Unlink$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/unlink.js [app-ssr] (ecmascript) <export default as Unlink>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dropdown-menu.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$hooks$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/features/settings/pkgx/hooks/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$hooks$2f$use$2d$pkgx$2d$entity$2d$sync$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/hooks/use-pkgx-entity-sync.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$components$2f$pkgx$2d$sync$2d$confirm$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/components/pkgx-sync-confirm-dialog.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/store.ts [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
function PkgxBrandActionsCell({ brand, hasPkgxMapping, pkgxBrandId, onPkgxLink, onPkgxUnlink, onPkgxViewDetail }) {
    const { addLog } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePkgxSettingsStore"])();
    // Use shared entity sync hook
    const entitySync = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$hooks$2f$use$2d$pkgx$2d$entity$2d$sync$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePkgxEntitySync"])({
        entityType: 'brand',
        onLog: addLog
    });
    // Build HRM brand data for sync
    const buildHrmData = ()=>({
            systemId: brand.systemId,
            name: brand.name,
            website: brand.website,
            seoKeywords: brand.websiteSeo?.pkgx?.seoKeywords || brand.seoKeywords,
            seoTitle: brand.websiteSeo?.pkgx?.seoTitle || brand.seoTitle,
            metaDescription: brand.websiteSeo?.pkgx?.metaDescription || brand.metaDescription,
            shortDescription: brand.websiteSeo?.pkgx?.shortDescription || brand.shortDescription,
            longDescription: brand.websiteSeo?.pkgx?.longDescription || brand.longDescription || brand.description,
            websiteSeo: brand.websiteSeo
        });
    // Helper to trigger sync
    const triggerSync = (actionKey)=>{
        if (!pkgxBrandId) return;
        const hrmData = buildHrmData();
        entitySync.triggerSyncAction(actionKey, pkgxBrandId, hrmData, brand.name);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-center",
                onClick: (e)=>e.stopPropagation(),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenu"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                            asChild: true,
                            onClick: (e)=>e.stopPropagation(),
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "ghost",
                                className: `h-8 w-8 p-0 ${hasPkgxMapping ? "text-primary" : "text-muted-foreground"}`,
                                onClick: (e)=>e.stopPropagation(),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "sr-only",
                                        children: "PKGX menu"
                                    }, void 0, false, {
                                        fileName: "[project]/features/brands/pkgx-brand-actions-cell.tsx",
                                        lineNumber: 72,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__["MoreHorizontal"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/features/brands/pkgx-brand-actions-cell.tsx",
                                        lineNumber: 73,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/brands/pkgx-brand-actions-cell.tsx",
                                lineNumber: 67,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/features/brands/pkgx-brand-actions-cell.tsx",
                            lineNumber: 66,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                            align: "end",
                            onClick: (e)=>e.stopPropagation(),
                            children: hasPkgxMapping ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                        onSelect: ()=>triggerSync('sync_all'),
                                        className: "font-medium",
                                        title: "Đồng bộ: Tên, Website, Keywords, Meta Title, Meta Desc, Mô tả ngắn, Mô tả dài",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                                className: "mr-2 h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/features/brands/pkgx-brand-actions-cell.tsx",
                                                lineNumber: 85,
                                                columnNumber: 19
                                            }, this),
                                            "Đồng bộ tất cả"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/brands/pkgx-brand-actions-cell.tsx",
                                        lineNumber: 80,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                                        fileName: "[project]/features/brands/pkgx-brand-actions-cell.tsx",
                                        lineNumber: 88,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                        onSelect: ()=>triggerSync('sync_basic'),
                                        title: "Đồng bộ: Tên thương hiệu, Website URL",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__["Globe"], {
                                                className: "mr-2 h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/features/brands/pkgx-brand-actions-cell.tsx",
                                                lineNumber: 95,
                                                columnNumber: 19
                                            }, this),
                                            "Thông tin cơ bản"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/brands/pkgx-brand-actions-cell.tsx",
                                        lineNumber: 91,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                        onSelect: ()=>triggerSync('sync_seo'),
                                        title: "Đồng bộ: Keywords, Meta Title, Meta Desc",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                className: "mr-2 h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/features/brands/pkgx-brand-actions-cell.tsx",
                                                lineNumber: 102,
                                                columnNumber: 19
                                            }, this),
                                            "SEO"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/brands/pkgx-brand-actions-cell.tsx",
                                        lineNumber: 98,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                        onSelect: ()=>triggerSync('sync_description'),
                                        title: "Đồng bộ: Mô tả ngắn (Short Desc), Mô tả dài (Long Desc)",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$text$2d$align$2d$start$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlignLeft$3e$__["AlignLeft"], {
                                                className: "mr-2 h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/features/brands/pkgx-brand-actions-cell.tsx",
                                                lineNumber: 109,
                                                columnNumber: 19
                                            }, this),
                                            "Mô tả"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/brands/pkgx-brand-actions-cell.tsx",
                                        lineNumber: 105,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                                        fileName: "[project]/features/brands/pkgx-brand-actions-cell.tsx",
                                        lineNumber: 113,
                                        columnNumber: 17
                                    }, this),
                                    onPkgxViewDetail && pkgxBrandId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                        onSelect: ()=>onPkgxViewDetail(brand, pkgxBrandId),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                className: "mr-2 h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/features/brands/pkgx-brand-actions-cell.tsx",
                                                lineNumber: 118,
                                                columnNumber: 21
                                            }, this),
                                            "Xem trên PKGX"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/brands/pkgx-brand-actions-cell.tsx",
                                        lineNumber: 115,
                                        columnNumber: 19
                                    }, this),
                                    onPkgxUnlink && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                                                fileName: "[project]/features/brands/pkgx-brand-actions-cell.tsx",
                                                lineNumber: 126,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                onSelect: ()=>entitySync.handleConfirm('Hủy liên kết PKGX', `Bạn có chắc muốn hủy liên kết thương hiệu "${brand.name}" với PKGX?`, ()=>onPkgxUnlink(brand)),
                                                className: "text-destructive",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$unlink$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Unlink$3e$__["Unlink"], {
                                                        className: "mr-2 h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/brands/pkgx-brand-actions-cell.tsx",
                                                        lineNumber: 135,
                                                        columnNumber: 23
                                                    }, this),
                                                    "Hủy liên kết"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/brands/pkgx-brand-actions-cell.tsx",
                                                lineNumber: 127,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true)
                                ]
                            }, void 0, true) : /* Not linked - show link option */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: onPkgxLink && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                    onSelect: ()=>onPkgxLink(brand),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Link2$3e$__["Link2"], {
                                            className: "mr-2 h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/features/brands/pkgx-brand-actions-cell.tsx",
                                            lineNumber: 146,
                                            columnNumber: 21
                                        }, this),
                                        "Liên kết với PKGX"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/brands/pkgx-brand-actions-cell.tsx",
                                    lineNumber: 145,
                                    columnNumber: 19
                                }, this)
                            }, void 0, false)
                        }, void 0, false, {
                            fileName: "[project]/features/brands/pkgx-brand-actions-cell.tsx",
                            lineNumber: 76,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/brands/pkgx-brand-actions-cell.tsx",
                    lineNumber: 65,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/brands/pkgx-brand-actions-cell.tsx",
                lineNumber: 64,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$components$2f$pkgx$2d$sync$2d$confirm$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PkgxSyncConfirmDialog"], {
                confirmAction: entitySync.confirmAction,
                isSyncing: entitySync.isSyncing,
                onConfirm: entitySync.executeAction,
                onCancel: entitySync.cancelConfirm
            }, void 0, false, {
                fileName: "[project]/features/brands/pkgx-brand-actions-cell.tsx",
                lineNumber: 157,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
}),
"[project]/features/products/data.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "data",
    ()=>data
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
;
const SEED_AUTHOR = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000001');
const buildAuditFields = (createdAt, createdBy = SEED_AUTHOR)=>({
        createdAt,
        updatedAt: createdAt,
        createdBy,
        updatedBy: createdBy
    });
const data = [
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000001'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000001'),
        name: 'Laptop Dell Inspiron 15',
        thumbnailImage: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=600&q=80',
        unit: 'Chiếc',
        costPrice: 12000000,
        prices: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PP000001')]: 15000000
        },
        inventoryByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 50,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 30
        },
        committedByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 1,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        inTransitByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 0,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        ...buildAuditFields('2024-01-01T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000002'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000002'),
        name: 'Chuột Logitech MX Master 3',
        thumbnailImage: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=600&q=80',
        unit: 'Chiếc',
        costPrice: 1500000,
        prices: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PP000001')]: 2000000
        },
        inventoryByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 100,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 80
        },
        committedByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 1,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        inTransitByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 0,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        ...buildAuditFields('2024-01-02T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000003'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000003'),
        name: 'Điện thoại iPhone 15 Pro',
        thumbnailImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
        unit: 'Chiếc',
        costPrice: 25000000,
        prices: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PP000001')]: 28000000
        },
        inventoryByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 20,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 15
        },
        committedByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 1,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        inTransitByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 0,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        ...buildAuditFields('2024-01-03T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000004'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000004'),
        name: 'Ốp lưng iPhone 15 Pro',
        thumbnailImage: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80',
        unit: 'Chiếc',
        costPrice: 200000,
        prices: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PP000001')]: 300000
        },
        inventoryByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 200,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 150
        },
        committedByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 2,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        inTransitByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 0,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        ...buildAuditFields('2024-01-04T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000005'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000005'),
        name: 'Máy tính bảng iPad Air',
        thumbnailImage: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&q=80',
        unit: 'Chiếc',
        costPrice: 15000000,
        prices: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PP000001')]: 18000000
        },
        inventoryByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 30,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 20
        },
        committedByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 1,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        inTransitByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 0,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        ...buildAuditFields('2024-01-05T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000006'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000006'),
        name: 'Đồng hồ Apple Watch Series 9',
        thumbnailImage: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=600&q=80',
        unit: 'Chiếc',
        costPrice: 10000000,
        prices: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PP000001')]: 12000000
        },
        inventoryByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 40,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 25
        },
        committedByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 1,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        inTransitByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 0,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        ...buildAuditFields('2024-01-06T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000007'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000007'),
        name: 'Tai nghe AirPods Pro',
        thumbnailImage: 'https://images.unsplash.com/photo-1519671282429-b44660ead0a7?auto=format&fit=crop&w=600&q=80',
        unit: 'Chiếc',
        costPrice: 5000000,
        prices: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PP000001')]: 6000000
        },
        inventoryByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 60,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 40
        },
        committedByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 1,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        inTransitByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 0,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        ...buildAuditFields('2024-01-07T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000008'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000008'),
        name: 'Bàn phím cơ Keychron K2',
        thumbnailImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
        unit: 'Chiếc',
        costPrice: 2000000,
        prices: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PP000001')]: 2500000
        },
        inventoryByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 35,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 25
        },
        committedByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 1,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        inTransitByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 0,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        ...buildAuditFields('2024-01-08T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000009'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000009'),
        name: 'Keycap custom',
        thumbnailImage: 'https://images.unsplash.com/photo-1505740106531-4243f3831c78?auto=format&fit=crop&w=600&q=80',
        unit: 'Bộ',
        costPrice: 600000,
        prices: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PP000001')]: 800000
        },
        inventoryByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 50,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 30
        },
        committedByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 1,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        inTransitByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 0,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        ...buildAuditFields('2024-01-09T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000010'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000010'),
        name: 'Switch Gateron Yellow',
        thumbnailImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80',
        unit: 'Cái',
        costPrice: 3000,
        prices: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PP000001')]: 5000
        },
        inventoryByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 500,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 300
        },
        committedByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 90,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        inTransitByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 0,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        ...buildAuditFields('2024-01-10T08:00:00Z')
    },
    // ═══════════════════════════════════════════════════════════════
    // COMBO PRODUCTS - Sản phẩm bundle
    // ═══════════════════════════════════════════════════════════════
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000011'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('COMBO001'),
        name: 'Combo Bàn phím + Keycap + Switch',
        thumbnailImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
        shortDescription: 'Bộ combo custom keyboard siêu hot',
        type: 'combo',
        unit: 'Bộ',
        costPrice: 0,
        prices: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PP000001')]: 3000000
        },
        inventoryByBranch: {},
        committedByBranch: {},
        inTransitByBranch: {},
        // Combo items: Bàn phím (1) + Keycap (1) + Switch (90 cái)
        comboItems: [
            {
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000008'),
                quantity: 1
            },
            {
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000009'),
                quantity: 1
            },
            {
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000010'),
                quantity: 90
            }
        ],
        comboPricingType: 'sum_discount_percent',
        comboDiscount: 10,
        status: 'active',
        ...buildAuditFields('2024-06-01T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000012'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('COMBO002'),
        name: 'Combo iPhone + Ốp lưng',
        thumbnailImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
        shortDescription: 'Mua iPhone kèm ốp lưng giá ưu đãi',
        type: 'combo',
        unit: 'Bộ',
        costPrice: 0,
        prices: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PP000001')]: 27500000
        },
        inventoryByBranch: {},
        committedByBranch: {},
        inTransitByBranch: {},
        comboItems: [
            {
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000003'),
                quantity: 1
            },
            {
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000004'),
                quantity: 1
            }
        ],
        comboPricingType: 'sum_discount_amount',
        comboDiscount: 800000,
        status: 'active',
        ...buildAuditFields('2024-06-15T08:00:00Z')
    }
];
}),
"[project]/features/products/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useProductStore",
    ()=>useProductStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/products/data.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/fuse.js/dist/fuse.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/activity-history-helper.ts [app-ssr] (ecmascript)");
;
;
;
;
;
;
const baseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createCrudStore"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["data"], 'products', {
    businessIdField: 'id',
    persistKey: 'hrm-products',
    getCurrentUser: __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserSystemId"]
});
// Helper to check if product tracks stock
const canModifyStock = (product)=>{
    if (!product) return false;
    // Services, digital products, and combos don't track stock directly
    if (product.type === 'service' || product.type === 'digital' || product.type === 'combo') return false;
    // Explicitly disabled stock tracking
    if (product.isStockTracked === false) return false;
    return true;
};
// Define custom methods
const updateInventory = (productSystemId, branchSystemId, quantityChange)=>{
    baseStore.setState((state)=>{
        const product = state.data.find((p)=>p.systemId === productSystemId);
        if (!product) return state;
        // Skip if product doesn't track stock
        if (!canModifyStock(product)) {
            console.warn(`[updateInventory] Skipped: Product ${productSystemId} does not track stock`);
            return state;
        }
        const oldQuantity = product.inventoryByBranch?.[branchSystemId] || 0;
        const newQuantity = oldQuantity + quantityChange;
        // ✅ Removed COMPLAINT_ADJUSTMENT stock history creation
        // Stock history will be created by inventory check balance instead
        return {
            data: state.data.map((p)=>{
                if (p.systemId === productSystemId) {
                    const newInventoryByBranch = {
                        ...p.inventoryByBranch
                    };
                    newInventoryByBranch[branchSystemId] = newQuantity;
                    return {
                        ...p,
                        inventoryByBranch: newInventoryByBranch
                    };
                }
                return p;
            })
        };
    });
};
const commitStock = (productSystemId, branchSystemId, quantity)=>{
    baseStore.setState((state)=>{
        const product = state.data.find((p)=>p.systemId === productSystemId);
        if (!canModifyStock(product)) {
            console.warn(`[commitStock] Skipped: Product ${productSystemId} does not track stock`);
            return state;
        }
        return {
            data: state.data.map((p)=>{
                if (p.systemId === productSystemId) {
                    const newCommitted = {
                        ...p.committedByBranch
                    };
                    newCommitted[branchSystemId] = (newCommitted[branchSystemId] || 0) + quantity;
                    return {
                        ...p,
                        committedByBranch: newCommitted
                    };
                }
                return p;
            })
        };
    });
};
const uncommitStock = (productSystemId, branchSystemId, quantity)=>{
    baseStore.setState((state)=>{
        const product = state.data.find((p)=>p.systemId === productSystemId);
        if (!canModifyStock(product)) {
            console.warn(`[uncommitStock] Skipped: Product ${productSystemId} does not track stock`);
            return state;
        }
        return {
            data: state.data.map((p)=>{
                if (p.systemId === productSystemId) {
                    const newCommitted = {
                        ...p.committedByBranch
                    };
                    newCommitted[branchSystemId] = Math.max(0, (newCommitted[branchSystemId] || 0) - quantity);
                    return {
                        ...p,
                        committedByBranch: newCommitted
                    };
                }
                return p;
            })
        };
    });
};
const dispatchStock = (productSystemId, branchSystemId, quantity)=>{
    console.log('🔴 [dispatchStock] Called with:', {
        productSystemId,
        branchSystemId,
        quantity
    });
    baseStore.setState((state)=>{
        const product = state.data.find((p)=>p.systemId === productSystemId);
        if (!product) {
            console.error('❌ [dispatchStock] Product not found:', productSystemId);
            return state;
        }
        // Skip if product doesn't track stock
        if (!canModifyStock(product)) {
            console.warn(`[dispatchStock] Skipped: Product ${productSystemId} does not track stock`);
            return state;
        }
        console.log('📦 [dispatchStock] Current inventory:', product.inventoryByBranch);
        console.log('📦 [dispatchStock] Current committed:', product.committedByBranch);
        return {
            data: state.data.map((product)=>{
                if (product.systemId === productSystemId) {
                    const newInventory = {
                        ...product.inventoryByBranch
                    };
                    const oldInventory = newInventory[branchSystemId] || 0;
                    newInventory[branchSystemId] = oldInventory - quantity;
                    const newCommitted = {
                        ...product.committedByBranch
                    };
                    newCommitted[branchSystemId] = Math.max(0, (newCommitted[branchSystemId] || 0) - quantity);
                    const newInTransit = {
                        ...product.inTransitByBranch
                    };
                    newInTransit[branchSystemId] = (newInTransit[branchSystemId] || 0) + quantity;
                    console.log('✅ [dispatchStock] Updated inventory:', {
                        old: oldInventory,
                        new: newInventory[branchSystemId],
                        change: -quantity
                    });
                    return {
                        ...product,
                        inventoryByBranch: newInventory,
                        committedByBranch: newCommitted,
                        inTransitByBranch: newInTransit
                    };
                }
                return product;
            })
        };
    });
    console.log('✅ [dispatchStock] Completed');
};
const completeDelivery = (productSystemId, branchSystemId, quantity)=>{
    baseStore.setState((state)=>{
        const product = state.data.find((p)=>p.systemId === productSystemId);
        if (!canModifyStock(product)) {
            return state;
        }
        return {
            data: state.data.map((p)=>{
                if (p.systemId === productSystemId) {
                    const newInTransit = {
                        ...p.inTransitByBranch
                    };
                    newInTransit[branchSystemId] = Math.max(0, (newInTransit[branchSystemId] || 0) - quantity);
                    return {
                        ...p,
                        inTransitByBranch: newInTransit
                    };
                }
                return p;
            })
        };
    });
};
const returnStockFromTransit = (productSystemId, branchSystemId, quantity)=>{
    baseStore.setState((state)=>{
        const product = state.data.find((p)=>p.systemId === productSystemId);
        if (!canModifyStock(product)) {
            return state;
        }
        return {
            data: state.data.map((p)=>{
                if (p.systemId === productSystemId) {
                    const newInTransit = {
                        ...p.inTransitByBranch
                    };
                    newInTransit[branchSystemId] = Math.max(0, (newInTransit[branchSystemId] || 0) - quantity);
                    const newInventory = {
                        ...p.inventoryByBranch
                    };
                    newInventory[branchSystemId] = (newInventory[branchSystemId] || 0) + quantity;
                    return {
                        ...p,
                        inventoryByBranch: newInventory,
                        inTransitByBranch: newInTransit
                    };
                }
                return p;
            })
        };
    });
};
const updateLastPurchasePrice = (productSystemId, price, date)=>{
    baseStore.setState((state)=>({
            data: state.data.map((product)=>{
                if (product.systemId === productSystemId) {
                    // Only update if the new date is newer or equal to the existing lastPurchaseDate
                    const existingDate = product.lastPurchaseDate ? new Date(product.lastPurchaseDate).getTime() : 0;
                    const newDateTs = new Date(date).getTime();
                    if (newDateTs >= existingDate) {
                        return {
                            ...product,
                            lastPurchasePrice: price,
                            lastPurchaseDate: date
                        };
                    }
                }
                return product;
            })
        }));
};
const searchProducts = async (query, page = 1, limit = 10)=>{
    const allProducts = baseStore.getState().data;
    // ✅ Create fresh Fuse instance with current data (avoid stale data)
    const fuse = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"](allProducts, {
        keys: [
            'name',
            'id',
            'sku',
            'barcode'
        ],
        threshold: 0.3
    });
    const results = fuse.search(query);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedResults = results.slice(startIndex, endIndex);
    return {
        items: paginatedResults.map((result)=>({
                value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(result.item.systemId),
                label: `${result.item.name} (${result.item.id})`
            })),
        hasNextPage: endIndex < results.length
    };
};
// Wrapped add method with activity history logging
const addProduct = (product)=>{
    const userInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserInfo"])();
    const newProduct = baseStore.getState().add(product);
    // Add activity history entry
    const historyEntry = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createCreatedEntry"])(userInfo, `${userInfo.name} đã tạo sản phẩm ${newProduct.name} (${newProduct.id})`);
    baseStore.getState().update(newProduct.systemId, {
        ...newProduct,
        activityHistory: [
            historyEntry
        ]
    });
    return newProduct;
};
// Wrapped update method with activity history logging
const updateProduct = (systemId, updatedProduct)=>{
    const userInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserInfo"])();
    const existingProduct = baseStore.getState().data.find((p)=>p.systemId === systemId);
    const historyEntries = [];
    if (existingProduct) {
        // Track status changes
        if (existingProduct.status !== updatedProduct.status) {
            const statusLabels = {
                'active': 'Đang kinh doanh',
                'inactive': 'Ngừng kinh doanh',
                'discontinued': 'Ngừng sản xuất'
            };
            historyEntries.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createStatusChangedEntry"])(userInfo, statusLabels[existingProduct.status || 'active'], statusLabels[updatedProduct.status || 'active'], `${userInfo.name} đã đổi trạng thái từ "${statusLabels[existingProduct.status || 'active']}" sang "${statusLabels[updatedProduct.status || 'active']}"`));
        }
        // Track field changes
        const fieldsToTrack = [
            {
                key: 'name',
                label: 'Tên sản phẩm'
            },
            {
                key: 'id',
                label: 'Mã SKU'
            },
            {
                key: 'description',
                label: 'Mô tả'
            },
            {
                key: 'shortDescription',
                label: 'Mô tả ngắn'
            },
            {
                key: 'type',
                label: 'Loại sản phẩm'
            },
            {
                key: 'categorySystemId',
                label: 'Danh mục'
            },
            {
                key: 'brandSystemId',
                label: 'Thương hiệu'
            },
            {
                key: 'unit',
                label: 'Đơn vị tính'
            },
            {
                key: 'costPrice',
                label: 'Giá vốn'
            },
            {
                key: 'minPrice',
                label: 'Giá tối thiểu'
            },
            {
                key: 'barcode',
                label: 'Mã vạch'
            },
            {
                key: 'primarySupplierSystemId',
                label: 'Nhà cung cấp chính'
            },
            {
                key: 'warrantyPeriodMonths',
                label: 'Thời hạn bảo hành'
            },
            {
                key: 'reorderLevel',
                label: 'Mức đặt hàng lại'
            },
            {
                key: 'safetyStock',
                label: 'Tồn kho an toàn'
            },
            {
                key: 'maxStock',
                label: 'Tồn kho tối đa'
            }
        ];
        const changes = [];
        for (const field of fieldsToTrack){
            const oldVal = existingProduct[field.key];
            const newVal = updatedProduct[field.key];
            if (oldVal !== newVal && !(oldVal === undefined && newVal === undefined)) {
                if (field.key === 'status') continue;
                const oldDisplay = oldVal !== undefined && oldVal !== null && oldVal !== '' ? String(oldVal) : '(trống)';
                const newDisplay = newVal !== undefined && newVal !== null && newVal !== '' ? String(newVal) : '(trống)';
                changes.push(`${field.label}: ${oldDisplay} → ${newDisplay}`);
            }
        }
        // Track price changes separately
        if (existingProduct.costPrice !== updatedProduct.costPrice) {
            changes.push(`Giá vốn: ${existingProduct.costPrice?.toLocaleString('vi-VN')} → ${updatedProduct.costPrice?.toLocaleString('vi-VN')}`);
        }
        if (changes.length > 0) {
            historyEntries.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createUpdatedEntry"])(userInfo, `${userInfo.name} đã cập nhật: ${changes.join(', ')}`));
        }
    }
    const productWithHistory = {
        ...updatedProduct,
        activityHistory: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["appendHistoryEntry"])(existingProduct?.activityHistory, ...historyEntries)
    };
    baseStore.getState().update(systemId, productWithHistory);
};
const useProductStore = ()=>{
    const state = baseStore();
    return {
        ...state,
        add: addProduct,
        update: updateProduct,
        updateInventory,
        commitStock,
        uncommitStock,
        dispatchStock,
        completeDelivery,
        returnStockFromTransit,
        updateLastPurchasePrice,
        searchProducts
    };
};
// Export getState method for non-hook usage
useProductStore.getState = ()=>{
    const state = baseStore.getState();
    return {
        ...state,
        add: addProduct,
        update: updateProduct,
        updateInventory,
        commitStock,
        uncommitStock,
        dispatchStock,
        completeDelivery,
        returnStockFromTransit,
        updateLastPurchasePrice,
        searchProducts
    };
};
useProductStore.subscribe = baseStore.subscribe;
}),
"[project]/features/brands/columns.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getColumns",
    ()=>getColumns
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/checkbox.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$column$2d$header$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/data-table/data-table-column-header.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/badge.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis.js [app-ssr] (ecmascript) <export default as MoreHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/globe.js [app-ssr] (ecmascript) <export default as Globe>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/image.js [app-ssr] (ecmascript) <export default as Image>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-ssr] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-ssr] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/package.js [app-ssr] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pencil.js [app-ssr] (ecmascript) <export default as Pencil>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-ssr] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-ssr] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-x.js [app-ssr] (ecmascript) <export default as XCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/external-link.js [app-ssr] (ecmascript) <export default as ExternalLink>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$switch$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/switch.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$brands$2f$pkgx$2d$brand$2d$actions$2d$cell$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/brands/pkgx-brand-actions-cell.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dropdown-menu.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/avatar.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$inline$2d$editable$2d$cell$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/shared/inline-editable-cell.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/products/store.ts [app-ssr] (ecmascript)");
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
const formatDate = (dateString)=>{
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(date);
};
// SEO Score calculation for Brand
const calculateSeoScore = (brand, website)=>{
    const seo = brand.websiteSeo?.[website];
    if (!seo) return 0;
    let score = 0;
    if (seo.seoTitle && seo.seoTitle.length >= 30) score += 25;
    if (seo.metaDescription && seo.metaDescription.length >= 100) score += 25;
    if (seo.seoKeywords) score += 15;
    if (seo.shortDescription) score += 15;
    if (seo.longDescription && seo.longDescription.length >= 200) score += 20;
    return score;
};
const getSeoStatusBadge = (score)=>{
    if (score >= 80) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
        variant: "default",
        className: "bg-green-100 text-green-800 hover:bg-green-100",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                className: "h-3 w-3 mr-1"
            }, void 0, false, {
                fileName: "[project]/features/brands/columns.tsx",
                lineNumber: 42,
                columnNumber: 111
            }, ("TURBOPACK compile-time value", void 0)),
            " ",
            score,
            "%"
        ]
    }, void 0, true, {
        fileName: "[project]/features/brands/columns.tsx",
        lineNumber: 42,
        columnNumber: 27
    }, ("TURBOPACK compile-time value", void 0));
    if (score >= 50) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
        variant: "secondary",
        className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                className: "h-3 w-3 mr-1"
            }, void 0, false, {
                fileName: "[project]/features/brands/columns.tsx",
                lineNumber: 43,
                columnNumber: 116
            }, ("TURBOPACK compile-time value", void 0)),
            " ",
            score,
            "%"
        ]
    }, void 0, true, {
        fileName: "[project]/features/brands/columns.tsx",
        lineNumber: 43,
        columnNumber: 27
    }, ("TURBOPACK compile-time value", void 0));
    if (score > 0) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
        variant: "secondary",
        className: "bg-red-100 text-red-800 hover:bg-red-100",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"], {
                className: "h-3 w-3 mr-1"
            }, void 0, false, {
                fileName: "[project]/features/brands/columns.tsx",
                lineNumber: 44,
                columnNumber: 105
            }, ("TURBOPACK compile-time value", void 0)),
            " ",
            score,
            "%"
        ]
    }, void 0, true, {
        fileName: "[project]/features/brands/columns.tsx",
        lineNumber: 44,
        columnNumber: 25
    }, ("TURBOPACK compile-time value", void 0));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
        variant: "outline",
        className: "text-muted-foreground",
        children: "—"
    }, void 0, false, {
        fileName: "[project]/features/brands/columns.tsx",
        lineNumber: 45,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
const getColumns = (onDelete, onToggleActive, navigate, onUpdateName, // PKGX handlers - used by PkgxBrandActionsCell
hasPkgxMapping, getPkgxBrandId, onPkgxLink, onPkgxUnlink, onPkgxViewDetail)=>{
    // Get product counts per brand
    const productStore = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState();
    const productCountByBrand = {};
    productStore.data.forEach((p)=>{
        if (p.brandSystemId && !p.isDeleted) {
            productCountByBrand[String(p.brandSystemId)] = (productCountByBrand[String(p.brandSystemId)] || 0) + 1;
        }
    });
    return [
        {
            id: "select",
            header: ({ isAllPageRowsSelected, isSomePageRowsSelected, onToggleAll })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Checkbox"], {
                    checked: isAllPageRowsSelected ? true : isSomePageRowsSelected ? "indeterminate" : false,
                    onCheckedChange: (value)=>onToggleAll?.(!!value),
                    "aria-label": "Select all"
                }, void 0, false, {
                    fileName: "[project]/features/brands/columns.tsx",
                    lineNumber: 73,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            cell: ({ onToggleSelect, isSelected })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Checkbox"], {
                    checked: isSelected,
                    onCheckedChange: onToggleSelect,
                    "aria-label": "Select row"
                }, void 0, false, {
                    fileName: "[project]/features/brands/columns.tsx",
                    lineNumber: 80,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            size: 48,
            meta: {
                displayName: "Chọn",
                sticky: "left"
            }
        },
        // Logo
        {
            id: "logo",
            accessorKey: "logo",
            header: "Logo",
            cell: ({ row })=>{
                const brand = row;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Avatar"], {
                    className: "h-10 w-10",
                    children: [
                        brand.logo ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AvatarImage"], {
                            src: brand.logo,
                            alt: brand.name
                        }, void 0, false, {
                            fileName: "[project]/features/brands/columns.tsx",
                            lineNumber: 102,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)) : null,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AvatarFallback"], {
                            className: "bg-muted",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__["Image"], {
                                className: "h-4 w-4 text-muted-foreground"
                            }, void 0, false, {
                                fileName: "[project]/features/brands/columns.tsx",
                                lineNumber: 105,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/features/brands/columns.tsx",
                            lineNumber: 104,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/brands/columns.tsx",
                    lineNumber: 100,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0));
            },
            size: 60,
            meta: {
                displayName: "Logo",
                group: "Thông tin cơ bản"
            }
        },
        // Tên thương hiệu với inline editing
        {
            id: "name",
            accessorKey: "name",
            header: ({ sorting, setSorting })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$column$2d$header$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DataTableColumnHeader"], {
                    title: "Tên thương hiệu",
                    sortKey: "name",
                    isSorted: sorting?.id === 'name',
                    sortDirection: sorting?.desc ? 'desc' : 'asc',
                    onSort: ()=>setSorting?.((s)=>({
                                id: 'name',
                                desc: s.id === 'name' ? !s.desc : false
                            }))
                }, void 0, false, {
                    fileName: "[project]/features/brands/columns.tsx",
                    lineNumber: 121,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            cell: ({ row })=>{
                const brand = row;
                const hasMapping = hasPkgxMapping?.(brand) ?? false;
                const _pkgxId = getPkgxBrandId?.(brand);
                if (onUpdateName) {
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$inline$2d$editable$2d$cell$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["InlineEditableCell"], {
                        value: brand.name,
                        onSave: (newName)=>onUpdateName(String(brand.systemId), newName),
                        inputClassName: "h-7 text-sm w-48",
                        renderDisplay: (value, onEdit)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-medium cursor-pointer hover:text-primary",
                                                onClick: ()=>navigate(`/brands/${brand.systemId}`),
                                                children: value
                                            }, void 0, false, {
                                                fileName: "[project]/features/brands/columns.tsx",
                                                lineNumber: 143,
                                                columnNumber: 19
                                            }, void 0),
                                            hasMapping && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                                variant: "secondary",
                                                className: "text-xs",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__["Globe"], {
                                                        className: "h-3 w-3 mr-1"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/brands/columns.tsx",
                                                        lineNumber: 151,
                                                        columnNumber: 23
                                                    }, void 0),
                                                    "PKGX"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/brands/columns.tsx",
                                                lineNumber: 150,
                                                columnNumber: 21
                                            }, void 0),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                variant: "ghost",
                                                size: "icon",
                                                className: "h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0",
                                                onClick: (e)=>{
                                                    e.stopPropagation();
                                                    onEdit();
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__["Pencil"], {
                                                    className: "h-3 w-3"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/brands/columns.tsx",
                                                    lineNumber: 164,
                                                    columnNumber: 21
                                                }, void 0)
                                            }, void 0, false, {
                                                fileName: "[project]/features/brands/columns.tsx",
                                                lineNumber: 155,
                                                columnNumber: 19
                                            }, void 0)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/brands/columns.tsx",
                                        lineNumber: 142,
                                        columnNumber: 17
                                    }, void 0),
                                    brand.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs text-muted-foreground truncate max-w-[200px]",
                                        title: brand.description,
                                        children: brand.description
                                    }, void 0, false, {
                                        fileName: "[project]/features/brands/columns.tsx",
                                        lineNumber: 168,
                                        columnNumber: 19
                                    }, void 0)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/brands/columns.tsx",
                                lineNumber: 141,
                                columnNumber: 15
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/brands/columns.tsx",
                        lineNumber: 136,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0));
                }
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col cursor-pointer hover:text-primary",
                    onClick: ()=>navigate(`/brands/${brand.systemId}`),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-medium",
                                    children: brand.name
                                }, void 0, false, {
                                    fileName: "[project]/features/brands/columns.tsx",
                                    lineNumber: 184,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                hasMapping && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                    variant: "secondary",
                                    className: "text-xs",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__["Globe"], {
                                            className: "h-3 w-3 mr-1"
                                        }, void 0, false, {
                                            fileName: "[project]/features/brands/columns.tsx",
                                            lineNumber: 187,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        "PKGX"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/brands/columns.tsx",
                                    lineNumber: 186,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/brands/columns.tsx",
                            lineNumber: 183,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        brand.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-xs text-muted-foreground truncate max-w-[200px]",
                            title: brand.description,
                            children: brand.description
                        }, void 0, false, {
                            fileName: "[project]/features/brands/columns.tsx",
                            lineNumber: 193,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/brands/columns.tsx",
                    lineNumber: 179,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0));
            },
            meta: {
                displayName: "Tên thương hiệu",
                group: "Thông tin cơ bản"
            }
        },
        // Mã thương hiệu
        {
            id: "id",
            accessorKey: "id",
            header: ({ sorting, setSorting })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$column$2d$header$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DataTableColumnHeader"], {
                    title: "Mã",
                    sortKey: "id",
                    isSorted: sorting?.id === 'id',
                    sortDirection: sorting?.desc ? 'desc' : 'asc',
                    onSort: ()=>setSorting?.((s)=>({
                                id: 'id',
                                desc: s.id === 'id' ? !s.desc : false
                            }))
                }, void 0, false, {
                    fileName: "[project]/features/brands/columns.tsx",
                    lineNumber: 210,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            cell: ({ row })=>{
                const brand = row;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "font-mono text-xs text-muted-foreground",
                    children: brand.id
                }, void 0, false, {
                    fileName: "[project]/features/brands/columns.tsx",
                    lineNumber: 221,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0));
            },
            size: 100,
            meta: {
                displayName: "Mã thương hiệu",
                group: "Thông tin cơ bản"
            }
        },
        // Số sản phẩm
        {
            id: "productCount",
            header: "SP",
            cell: ({ row })=>{
                const brand = row;
                const count = productCountByBrand[String(brand.systemId)] || 0;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                    variant: "outline",
                    className: "font-mono text-xs gap-1",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                            className: "h-3 w-3"
                        }, void 0, false, {
                            fileName: "[project]/features/brands/columns.tsx",
                            lineNumber: 241,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        count
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/brands/columns.tsx",
                    lineNumber: 240,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0));
            },
            size: 70,
            meta: {
                displayName: "Số sản phẩm",
                group: "Thống kê"
            }
        },
        // Website
        {
            id: "website",
            accessorKey: "website",
            header: "Website",
            cell: ({ row })=>{
                const brand = row;
                if (!brand.website) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-muted-foreground",
                    children: "—"
                }, void 0, false, {
                    fileName: "[project]/features/brands/columns.tsx",
                    lineNumber: 259,
                    columnNumber: 34
                }, ("TURBOPACK compile-time value", void 0));
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                    href: brand.website,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "flex items-center gap-1 text-primary hover:underline text-sm",
                    onClick: (e)=>e.stopPropagation(),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__["Globe"], {
                            className: "h-3 w-3"
                        }, void 0, false, {
                            fileName: "[project]/features/brands/columns.tsx",
                            lineNumber: 268,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "truncate max-w-[150px]",
                            children: brand.website.replace(/^https?:\/\//, '')
                        }, void 0, false, {
                            fileName: "[project]/features/brands/columns.tsx",
                            lineNumber: 269,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                            className: "h-3 w-3"
                        }, void 0, false, {
                            fileName: "[project]/features/brands/columns.tsx",
                            lineNumber: 270,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/brands/columns.tsx",
                    lineNumber: 261,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0));
            },
            meta: {
                displayName: "Website",
                group: "Thông tin cơ bản"
            }
        },
        // SEO PKGX với điểm số
        {
            id: "seoPkgx",
            accessorKey: "websiteSeo",
            header: "SEO PKGX",
            cell: ({ row })=>{
                const brand = row;
                const score = calculateSeoScore(brand, 'pkgx');
                return getSeoStatusBadge(score);
            },
            size: 100,
            meta: {
                displayName: "SEO PKGX",
                group: "SEO"
            }
        },
        // SEO Trendtech với điểm số
        {
            id: "seoTrendtech",
            accessorKey: "websiteSeo",
            header: "SEO Trendtech",
            cell: ({ row })=>{
                const brand = row;
                const score = calculateSeoScore(brand, 'trendtech');
                return getSeoStatusBadge(score);
            },
            size: 100,
            meta: {
                displayName: "SEO Trendtech",
                group: "SEO"
            }
        },
        // PKGX Status - Hiển thị trạng thái liên kết
        {
            id: "pkgxStatus",
            header: "Liên kết PKGX",
            cell: ({ row })=>{
                const brand = row;
                const hasMapping = hasPkgxMapping?.(brand) ?? false;
                const pkgxId = getPkgxBrandId?.(brand);
                return hasMapping ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                    variant: "default",
                    className: "bg-green-500 text-xs",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__["Globe"], {
                            className: "h-3 w-3 mr-1"
                        }, void 0, false, {
                            fileName: "[project]/features/brands/columns.tsx",
                            lineNumber: 322,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        pkgxId
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/brands/columns.tsx",
                    lineNumber: 321,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                    variant: "secondary",
                    className: "text-xs",
                    children: "Chưa liên kết"
                }, void 0, false, {
                    fileName: "[project]/features/brands/columns.tsx",
                    lineNumber: 326,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0));
            },
            size: 110,
            meta: {
                displayName: "Liên kết PKGX",
                group: "PKGX"
            }
        },
        // Trạng thái
        {
            id: "isActive",
            accessorKey: "isActive",
            header: "Trạng thái",
            cell: ({ row })=>{
                const brand = row;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center",
                    onClick: (e)=>e.stopPropagation(),
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$switch$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Switch"], {
                        checked: brand.isActive !== false,
                        onCheckedChange: (checked)=>onToggleActive(brand.systemId, checked),
                        "aria-label": "Toggle status"
                    }, void 0, false, {
                        fileName: "[project]/features/brands/columns.tsx",
                        lineNumber: 344,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/features/brands/columns.tsx",
                    lineNumber: 343,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0));
            },
            size: 80,
            meta: {
                displayName: "Trạng thái",
                group: "Hệ thống"
            }
        },
        // Ngày tạo
        {
            id: "createdAt",
            accessorKey: "createdAt",
            header: ({ sorting, setSorting })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$column$2d$header$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DataTableColumnHeader"], {
                    title: "Ngày tạo",
                    sortKey: "createdAt",
                    isSorted: sorting?.id === 'createdAt',
                    sortDirection: sorting?.desc ? 'desc' : 'asc',
                    onSort: ()=>setSorting?.((s)=>({
                                id: 'createdAt',
                                desc: s.id === 'createdAt' ? !s.desc : false
                            }))
                }, void 0, false, {
                    fileName: "[project]/features/brands/columns.tsx",
                    lineNumber: 363,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            cell: ({ row })=>{
                const brand = row;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-sm text-muted-foreground",
                    children: formatDate(brand.createdAt)
                }, void 0, false, {
                    fileName: "[project]/features/brands/columns.tsx",
                    lineNumber: 374,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0));
            },
            meta: {
                displayName: "Ngày tạo",
                group: "Hệ thống"
            }
        },
        // Ngày cập nhật
        {
            id: "updatedAt",
            accessorKey: "updatedAt",
            header: ({ sorting, setSorting })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$column$2d$header$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DataTableColumnHeader"], {
                    title: "Cập nhật",
                    sortKey: "updatedAt",
                    isSorted: sorting?.id === 'updatedAt',
                    sortDirection: sorting?.desc ? 'desc' : 'asc',
                    onSort: ()=>setSorting?.((s)=>({
                                id: 'updatedAt',
                                desc: s.id === 'updatedAt' ? !s.desc : false
                            }))
                }, void 0, false, {
                    fileName: "[project]/features/brands/columns.tsx",
                    lineNumber: 389,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            cell: ({ row })=>{
                const brand = row;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-sm text-muted-foreground",
                    children: formatDate(brand.updatedAt)
                }, void 0, false, {
                    fileName: "[project]/features/brands/columns.tsx",
                    lineNumber: 400,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0));
            },
            meta: {
                displayName: "Ngày cập nhật",
                group: "Hệ thống"
            }
        },
        // PKGX Actions Column
        {
            id: "pkgx",
            header: "PKGX",
            cell: ({ row })=>{
                const brand = row;
                const hasMapping = hasPkgxMapping?.(brand) ?? false;
                const pkgxId = getPkgxBrandId?.(brand);
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$brands$2f$pkgx$2d$brand$2d$actions$2d$cell$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PkgxBrandActionsCell"], {
                    brand: brand,
                    hasPkgxMapping: hasMapping,
                    pkgxBrandId: pkgxId,
                    onPkgxLink: onPkgxLink,
                    onPkgxUnlink: onPkgxUnlink,
                    onPkgxViewDetail: onPkgxViewDetail
                }, void 0, false, {
                    fileName: "[project]/features/brands/columns.tsx",
                    lineNumber: 420,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0));
            },
            size: 70,
            meta: {
                displayName: "PKGX",
                group: "PKGX"
            }
        },
        // Actions
        {
            id: "actions",
            header: "Hành động",
            cell: ({ row })=>{
                const brand = row;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-end gap-1",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenu"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                                asChild: true,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "ghost",
                                    size: "icon",
                                    className: "h-7 w-7 p-0",
                                    onClick: (e)=>e.stopPropagation(),
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__["MoreHorizontal"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/features/brands/columns.tsx",
                                        lineNumber: 453,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/features/brands/columns.tsx",
                                    lineNumber: 447,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/features/brands/columns.tsx",
                                lineNumber: 446,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                                align: "end",
                                className: "w-48",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                        onClick: (e)=>{
                                            e.stopPropagation();
                                            navigate(`/brands/${brand.systemId}`);
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                className: "h-4 w-4 mr-2"
                                            }, void 0, false, {
                                                fileName: "[project]/features/brands/columns.tsx",
                                                lineNumber: 463,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            "Xem chi tiết"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/brands/columns.tsx",
                                        lineNumber: 457,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                        onClick: (e)=>{
                                            e.stopPropagation();
                                            navigate(`/brands/${brand.systemId}/edit`);
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__["Pencil"], {
                                                className: "h-4 w-4 mr-2"
                                            }, void 0, false, {
                                                fileName: "[project]/features/brands/columns.tsx",
                                                lineNumber: 472,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            "Chỉnh sửa"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/brands/columns.tsx",
                                        lineNumber: 466,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                                        fileName: "[project]/features/brands/columns.tsx",
                                        lineNumber: 475,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                        className: "text-destructive focus:text-destructive",
                                        onClick: (e)=>{
                                            e.stopPropagation();
                                            onDelete(brand.systemId);
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                className: "h-4 w-4 mr-2"
                                            }, void 0, false, {
                                                fileName: "[project]/features/brands/columns.tsx",
                                                lineNumber: 483,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            "Xóa thương hiệu"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/brands/columns.tsx",
                                        lineNumber: 476,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/brands/columns.tsx",
                                lineNumber: 456,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/brands/columns.tsx",
                        lineNumber: 445,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/features/brands/columns.tsx",
                    lineNumber: 444,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0));
            },
            size: 80,
            meta: {
                displayName: "Hành động",
                sticky: "right"
            }
        }
    ];
};
}),
"[project]/features/brands/card.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MobileBrandCard",
    ()=>MobileBrandCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/badge.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/avatar.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$mobile$2f$touch$2d$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/mobile/touch-button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dropdown-menu.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis.js [app-ssr] (ecmascript) <export default as MoreHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/globe.js [app-ssr] (ecmascript) <export default as Globe>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/external-link.js [app-ssr] (ecmascript) <export default as ExternalLink>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$power$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Power$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/power.js [app-ssr] (ecmascript) <export default as Power>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-ssr] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pencil.js [app-ssr] (ecmascript) <export default as Pencil>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-ssr] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/image.js [app-ssr] (ecmascript) <export default as Image>");
;
;
;
;
;
;
;
const formatDate = (dateString)=>{
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(date);
};
const MobileBrandCard = ({ brand, onDelete, onToggleActive, navigate, handleRowClick })=>{
    const getInitials = (name)=>{
        return name.split(' ').map((n)=>n[0]).join('').toUpperCase().slice(0, 2);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
        className: "hover:shadow-md transition-shadow cursor-pointer",
        onClick: ()=>handleRowClick(brand),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
            className: "p-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-start justify-between gap-3 mb-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3 flex-1 min-w-0",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Avatar"], {
                                    className: "h-12 w-12 flex-shrink-0",
                                    children: [
                                        brand.logo ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AvatarImage"], {
                                            src: brand.logo,
                                            alt: brand.name
                                        }, void 0, false, {
                                            fileName: "[project]/features/brands/card.tsx",
                                            lineNumber: 44,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)) : null,
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AvatarFallback"], {
                                            className: "bg-muted",
                                            children: brand.logo ? getInitials(brand.name) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__["Image"], {
                                                className: "h-5 w-5 text-muted-foreground"
                                            }, void 0, false, {
                                                fileName: "[project]/features/brands/card.tsx",
                                                lineNumber: 47,
                                                columnNumber: 57
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/features/brands/card.tsx",
                                            lineNumber: 46,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/brands/card.tsx",
                                    lineNumber: 42,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col min-w-0",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardTitle"], {
                                                    className: "font-semibold text-sm truncate",
                                                    children: brand.name
                                                }, void 0, false, {
                                                    fileName: "[project]/features/brands/card.tsx",
                                                    lineNumber: 52,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                brand.isActive !== false ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                                    variant: "default",
                                                    className: "bg-green-100 text-green-800 hover:bg-green-100 text-[10px] h-5",
                                                    children: "Hoạt động"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/brands/card.tsx",
                                                    lineNumber: 54,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                                    variant: "secondary",
                                                    className: "bg-gray-100 text-gray-600 text-[10px] h-5",
                                                    children: "Tạm tắt"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/brands/card.tsx",
                                                    lineNumber: 58,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/brands/card.tsx",
                                            lineNumber: 51,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xs text-muted-foreground font-mono",
                                            children: [
                                                "#",
                                                brand.id
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/brands/card.tsx",
                                            lineNumber: 63,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/brands/card.tsx",
                                    lineNumber: 50,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/brands/card.tsx",
                            lineNumber: 41,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenu"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                                    asChild: true,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$mobile$2f$touch$2d$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TouchButton"], {
                                        variant: "ghost",
                                        size: "sm",
                                        className: "h-9 w-10 p-0 flex-shrink-0",
                                        onClick: (e)=>e.stopPropagation(),
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__["MoreHorizontal"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/features/brands/card.tsx",
                                            lineNumber: 75,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/features/brands/card.tsx",
                                        lineNumber: 69,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/features/brands/card.tsx",
                                    lineNumber: 68,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                                    align: "end",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                            onClick: (e)=>{
                                                e.stopPropagation();
                                                navigate(`/brands/${brand.systemId}`);
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                    className: "mr-2 h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/brands/card.tsx",
                                                    lineNumber: 80,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                "Xem chi tiết"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/brands/card.tsx",
                                            lineNumber: 79,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                            onClick: (e)=>{
                                                e.stopPropagation();
                                                navigate(`/brands/${brand.systemId}/edit`);
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__["Pencil"], {
                                                    className: "mr-2 h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/brands/card.tsx",
                                                    lineNumber: 84,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                "Chỉnh sửa"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/brands/card.tsx",
                                            lineNumber: 83,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                                            fileName: "[project]/features/brands/card.tsx",
                                            lineNumber: 87,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                            onClick: (e)=>{
                                                e.stopPropagation();
                                                onToggleActive(brand.systemId, !brand.isActive);
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$power$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Power$3e$__["Power"], {
                                                    className: "mr-2 h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/brands/card.tsx",
                                                    lineNumber: 92,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                brand.isActive !== false ? 'Tắt hoạt động' : 'Bật hoạt động'
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/brands/card.tsx",
                                            lineNumber: 88,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                                            fileName: "[project]/features/brands/card.tsx",
                                            lineNumber: 95,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                            className: "text-destructive focus:text-destructive",
                                            onClick: (e)=>{
                                                e.stopPropagation();
                                                onDelete(brand.systemId);
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                    className: "mr-2 h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/brands/card.tsx",
                                                    lineNumber: 100,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                "Xóa thương hiệu"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/brands/card.tsx",
                                            lineNumber: 96,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/brands/card.tsx",
                                    lineNumber: 78,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/brands/card.tsx",
                            lineNumber: 67,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/brands/card.tsx",
                    lineNumber: 40,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                brand.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-xs text-muted-foreground mb-3 line-clamp-2",
                    children: brand.description
                }, void 0, false, {
                    fileName: "[project]/features/brands/card.tsx",
                    lineNumber: 109,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)),
                brand.website && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-1.5 text-xs mb-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__["Globe"], {
                            className: "h-3 w-3 text-muted-foreground flex-shrink-0"
                        }, void 0, false, {
                            fileName: "[project]/features/brands/card.tsx",
                            lineNumber: 117,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: brand.website,
                            target: "_blank",
                            rel: "noopener noreferrer",
                            className: "text-primary hover:underline truncate",
                            onClick: (e)=>e.stopPropagation(),
                            children: brand.website.replace(/^https?:\/\//, '')
                        }, void 0, false, {
                            fileName: "[project]/features/brands/card.tsx",
                            lineNumber: 118,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                            className: "h-3 w-3 text-muted-foreground flex-shrink-0"
                        }, void 0, false, {
                            fileName: "[project]/features/brands/card.tsx",
                            lineNumber: 127,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/brands/card.tsx",
                    lineNumber: 116,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between pt-3 border-t",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2",
                            children: [
                                (brand.websiteSeo?.pkgx?.seoTitle || brand.websiteSeo?.pkgx?.metaDescription || brand.websiteSeo?.pkgx?.slug) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                    variant: "outline",
                                    className: "text-[10px] bg-red-50 text-red-700 border-red-200",
                                    children: "PKGX"
                                }, void 0, false, {
                                    fileName: "[project]/features/brands/card.tsx",
                                    lineNumber: 136,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                (brand.websiteSeo?.trendtech?.seoTitle || brand.websiteSeo?.trendtech?.metaDescription || brand.websiteSeo?.trendtech?.slug) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                    variant: "outline",
                                    className: "text-[10px] bg-blue-50 text-blue-700 border-blue-200",
                                    children: "Trendtech"
                                }, void 0, false, {
                                    fileName: "[project]/features/brands/card.tsx",
                                    lineNumber: 142,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/brands/card.tsx",
                            lineNumber: 133,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-[10px] text-muted-foreground",
                            children: [
                                "Tạo: ",
                                formatDate(brand.createdAt)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/brands/card.tsx",
                            lineNumber: 147,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/brands/card.tsx",
                    lineNumber: 132,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/features/brands/card.tsx",
            lineNumber: 38,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/features/brands/card.tsx",
        lineNumber: 34,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/features/brands/hooks/use-pkgx-brand-sync.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePkgxBrandSync",
    ()=>usePkgxBrandSync
]);
/**
 * Hook chứa tất cả các handlers để đồng bộ thương hiệu (Brand) với PKGX
 * Tương tự như use-pkgx-sync.ts của products
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/pkgx/api-service.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/store.ts [app-ssr] (ecmascript)");
;
;
;
;
/**
 * Lấy pkgxBrandId từ brand mapping
 */ function getPkgxBrandId(brand, brandMappings) {
    if (!brandMappings) return undefined;
    const mapping = brandMappings.find((m)=>m.hrmBrandSystemId === brand.systemId);
    return mapping?.pkgxBrandId;
}
function usePkgxBrandSync({ addPkgxLog } = {}) {
    const { settings: pkgxSettings, updateBrand: updateBrandInStore } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePkgxSettingsStore"])();
    // Default log function if not provided
    const logAction = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useCallback((entry)=>{
        if (addPkgxLog) {
            addPkgxLog(entry);
        }
        console.log('[PKGX Brand Sync]', entry.action, entry.status, entry.message);
    }, [
        addPkgxLog
    ]);
    // ═══════════════════════════════════════════════════════════════
    // HELPER: Refresh brand data từ PKGX sau khi sync thành công
    // ═══════════════════════════════════════════════════════════════
    const refreshBrandFromPkgx = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useCallback(async (pkgxBrandId)=>{
        try {
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getBrandById"])(pkgxBrandId);
            if (response.success && response.data) {
                // Cập nhật vào store
                updateBrandInStore(pkgxBrandId, {
                    id: response.data.brand_id,
                    name: response.data.brand_name,
                    logo: response.data.brand_logo || '',
                    description: response.data.brand_desc || '',
                    shortDescription: response.data.short_desc || '',
                    longDescription: response.data.long_desc || '',
                    keywords: response.data.keywords || '',
                    metaTitle: response.data.meta_title || '',
                    metaDesc: response.data.meta_desc || '',
                    siteUrl: response.data.site_url || '',
                    sortOrder: response.data.sort_order || 0,
                    isShow: response.data.is_show ?? 1
                });
                console.log('[PKGX Brand Sync] Auto-refreshed brand data from PKGX:', pkgxBrandId);
            }
        } catch (error) {
            console.warn('[PKGX Brand Sync] Failed to refresh brand data:', error);
        }
    }, [
        updateBrandInStore
    ]);
    // ═══════════════════════════════════════════════════════════════
    // 1. SYNC THÔNG TIN CƠ BẢN (brand_name, site_url)
    // ═══════════════════════════════════════════════════════════════
    const handleSyncBasicInfo = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useCallback(async (brand)=>{
        const pkgxBrandId = getPkgxBrandId(brand, pkgxSettings?.brandMappings);
        if (!pkgxBrandId) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Thương hiệu chưa được liên kết với PKGX. Vui lòng mapping trong Cài đặt > PKGX.');
            return;
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].loading(`Đang đồng bộ thông tin cơ bản...`, {
            id: 'pkgx-brand-sync-basic'
        });
        try {
            const basicPayload = {
                brand_name: brand.name,
                site_url: brand.website || ''
            };
            console.log('[PKGX Brand Basic Sync] Payload:', basicPayload);
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateBrand"])(pkgxBrandId, basicPayload);
            if (response.success) {
                // Auto-refresh để cập nhật store
                await refreshBrandFromPkgx(pkgxBrandId);
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success(`Đã đồng bộ thông tin cơ bản: ${brand.name}`, {
                    id: 'pkgx-brand-sync-basic'
                });
                logAction({
                    action: 'sync_brand_basic_info',
                    status: 'success',
                    message: `Đã đồng bộ thông tin cơ bản: ${brand.name}`,
                    details: {
                        brandId: brand.systemId,
                        pkgxBrandId,
                        payload: basicPayload
                    }
                });
            } else {
                throw new Error(response.error);
            }
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(`Lỗi đồng bộ thông tin cơ bản: ${error instanceof Error ? error.message : 'Unknown error'}`, {
                id: 'pkgx-brand-sync-basic'
            });
            logAction({
                action: 'sync_brand_basic_info',
                status: 'error',
                message: `Lỗi đồng bộ thông tin cơ bản: ${brand.name}`,
                details: {
                    brandId: brand.systemId,
                    error: error instanceof Error ? error.message : String(error)
                }
            });
        }
    }, [
        pkgxSettings?.brandMappings,
        logAction,
        refreshBrandFromPkgx
    ]);
    // ═══════════════════════════════════════════════════════════════
    // 2. SYNC SEO (keywords, meta_title, meta_desc)
    // ═══════════════════════════════════════════════════════════════
    const handleSyncSeo = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useCallback(async (brand)=>{
        const pkgxBrandId = getPkgxBrandId(brand, pkgxSettings?.brandMappings);
        if (!pkgxBrandId) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Thương hiệu chưa được liên kết với PKGX. Vui lòng mapping trong Cài đặt > PKGX.');
            return;
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].loading(`Đang đồng bộ SEO thương hiệu...`, {
            id: 'pkgx-brand-sync-seo'
        });
        try {
            const pkgxSeo = brand.websiteSeo?.pkgx;
            // Fallback chain: SEO PKGX → SEO Chung → name
            // SEO chỉ gồm: keywords, meta_title, meta_desc
            const seoPayload = {
                keywords: pkgxSeo?.seoKeywords || brand.seoKeywords || brand.name,
                meta_title: pkgxSeo?.seoTitle || brand.seoTitle || brand.name,
                meta_desc: pkgxSeo?.metaDescription || brand.metaDescription || ''
            };
            // DEBUG
            console.log('[PKGX Brand SEO Sync] Brand:', brand.name);
            console.log('[PKGX Brand SEO Sync] websiteSeo.pkgx:', pkgxSeo);
            console.log('[PKGX Brand SEO Sync] SEO Chung - seoKeywords:', brand.seoKeywords);
            console.log('[PKGX Brand SEO Sync] Payload:', seoPayload);
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateBrand"])(pkgxBrandId, seoPayload);
            if (response.success) {
                // Auto-refresh để cập nhật store
                await refreshBrandFromPkgx(pkgxBrandId);
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success(`Đã đồng bộ SEO cho thương hiệu: ${brand.name}`, {
                    id: 'pkgx-brand-sync-seo'
                });
                logAction({
                    action: 'sync_brand_seo',
                    status: 'success',
                    message: `Đã đồng bộ SEO: ${brand.name}`,
                    details: {
                        brandId: brand.systemId,
                        pkgxBrandId,
                        payload: seoPayload
                    }
                });
            } else {
                throw new Error(response.error);
            }
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(`Lỗi đồng bộ SEO thương hiệu: ${error instanceof Error ? error.message : 'Unknown error'}`, {
                id: 'pkgx-brand-sync-seo'
            });
            logAction({
                action: 'sync_brand_seo',
                status: 'error',
                message: `Lỗi đồng bộ SEO: ${brand.name}`,
                details: {
                    brandId: brand.systemId,
                    error: error instanceof Error ? error.message : String(error)
                }
            });
        }
    }, [
        pkgxSettings?.brandMappings,
        logAction,
        refreshBrandFromPkgx
    ]);
    // ═══════════════════════════════════════════════════════════════
    // 3. SYNC MÔ TẢ (short_desc, long_desc)
    // ═══════════════════════════════════════════════════════════════
    const handleSyncDescription = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useCallback(async (brand)=>{
        const pkgxBrandId = getPkgxBrandId(brand, pkgxSettings?.brandMappings);
        if (!pkgxBrandId) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Thương hiệu chưa được liên kết với PKGX. Vui lòng mapping trong Cài đặt > PKGX.');
            return;
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].loading(`Đang đồng bộ mô tả thương hiệu...`, {
            id: 'pkgx-brand-sync-desc'
        });
        try {
            const pkgxSeo = brand.websiteSeo?.pkgx;
            // Mô tả chỉ gồm: short_desc, long_desc
            const descPayload = {
                short_desc: pkgxSeo?.shortDescription || brand.shortDescription || '',
                long_desc: pkgxSeo?.longDescription || brand.longDescription || ''
            };
            console.log('[PKGX Brand Desc Sync] Payload:', descPayload);
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateBrand"])(pkgxBrandId, descPayload);
            if (response.success) {
                // Auto-refresh để cập nhật store
                await refreshBrandFromPkgx(pkgxBrandId);
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success(`Đã đồng bộ mô tả cho thương hiệu: ${brand.name}`, {
                    id: 'pkgx-brand-sync-desc'
                });
                logAction({
                    action: 'sync_brand_description',
                    status: 'success',
                    message: `Đã đồng bộ mô tả: ${brand.name}`,
                    details: {
                        brandId: brand.systemId,
                        pkgxBrandId
                    }
                });
            } else {
                throw new Error(response.error);
            }
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(`Lỗi đồng bộ mô tả thương hiệu: ${error instanceof Error ? error.message : 'Unknown error'}`, {
                id: 'pkgx-brand-sync-desc'
            });
            logAction({
                action: 'sync_brand_description',
                status: 'error',
                message: `Lỗi đồng bộ mô tả: ${brand.name}`,
                details: {
                    brandId: brand.systemId,
                    error: error instanceof Error ? error.message : String(error)
                }
            });
        }
    }, [
        pkgxSettings?.brandMappings,
        logAction,
        refreshBrandFromPkgx
    ]);
    // ═══════════════════════════════════════════════════════════════
    // 4. SYNC TẤT CẢ (Thông tin cơ bản + SEO + Mô tả)
    // ═══════════════════════════════════════════════════════════════
    const handleSyncAll = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useCallback(async (brand)=>{
        const pkgxBrandId = getPkgxBrandId(brand, pkgxSettings?.brandMappings);
        if (!pkgxBrandId) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Thương hiệu chưa được liên kết với PKGX. Vui lòng mapping trong Cài đặt > PKGX.');
            return;
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].loading(`Đang đồng bộ tất cả thông tin thương hiệu...`, {
            id: 'pkgx-brand-sync-all'
        });
        try {
            const pkgxSeo = brand.websiteSeo?.pkgx;
            // Build full payload
            const fullPayload = {
                // Basic info
                brand_name: brand.name,
                site_url: brand.website || '',
                // SEO fields - Fallback chain: SEO PKGX → SEO Chung → name
                keywords: pkgxSeo?.seoKeywords || brand.seoKeywords || brand.name,
                meta_title: pkgxSeo?.seoTitle || brand.seoTitle || brand.name,
                meta_desc: pkgxSeo?.metaDescription || brand.metaDescription || '',
                // Descriptions
                brand_desc: brand.description || '',
                short_desc: pkgxSeo?.shortDescription || brand.shortDescription || '',
                long_desc: pkgxSeo?.longDescription || brand.longDescription || ''
            };
            console.log('[PKGX Brand Sync All] Payload:', fullPayload);
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateBrand"])(pkgxBrandId, fullPayload);
            if (response.success) {
                // Auto-refresh để cập nhật store
                await refreshBrandFromPkgx(pkgxBrandId);
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success(`Đã đồng bộ tất cả thông tin thương hiệu: ${brand.name}`, {
                    id: 'pkgx-brand-sync-all'
                });
                logAction({
                    action: 'sync_brand_all',
                    status: 'success',
                    message: `Đã đồng bộ tất cả: ${brand.name}`,
                    details: {
                        brandId: brand.systemId,
                        pkgxBrandId
                    }
                });
            } else {
                throw new Error(response.error);
            }
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(`Lỗi đồng bộ thương hiệu: ${error instanceof Error ? error.message : 'Unknown error'}`, {
                id: 'pkgx-brand-sync-all'
            });
            logAction({
                action: 'sync_brand_all',
                status: 'error',
                message: `Lỗi đồng bộ: ${brand.name}`,
                details: {
                    brandId: brand.systemId,
                    error: error instanceof Error ? error.message : String(error)
                }
            });
        }
    }, [
        pkgxSettings?.brandMappings,
        logAction,
        refreshBrandFromPkgx
    ]);
    // ═══════════════════════════════════════════════════════════════
    // HELPER: Kiểm tra brand có mapping với PKGX không
    // ═══════════════════════════════════════════════════════════════
    const hasPkgxMapping = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useCallback((brand)=>{
        return !!getPkgxBrandId(brand, pkgxSettings?.brandMappings);
    }, [
        pkgxSettings?.brandMappings
    ]);
    return {
        handleSyncBasicInfo,
        handleSyncSeo,
        handleSyncDescription,
        handleSyncAll,
        hasPkgxMapping,
        getPkgxBrandId: (brand)=>getPkgxBrandId(brand, pkgxSettings?.brandMappings)
    };
}
}),
"[project]/features/settings/pkgx/components/pkgx-bulk-sync-confirm-dialog.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * PkgxBulkSyncConfirmDialog - Shared confirmation dialog for bulk PKGX sync actions
 */ __turbopack_context__.s([
    "PkgxBulkSyncConfirmDialog",
    ()=>PkgxBulkSyncConfirmDialog
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-ssr] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/alert-dialog.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$progress$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/progress.tsx [app-ssr] (ecmascript)");
;
;
;
;
function PkgxBulkSyncConfirmDialog({ confirmAction, progress, onConfirm, onCancel }) {
    const progressPercent = progress.total > 0 ? Math.round(progress.completed / progress.total * 100) : 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialog"], {
        open: confirmAction.open || progress.isRunning,
        onOpenChange: (open)=>!open && !progress.isRunning && onCancel(),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogContent"], {
            onClick: (e)=>e.stopPropagation(),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogHeader"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogTitle"], {
                            children: progress.isRunning ? 'Đang đồng bộ...' : confirmAction.title
                        }, void 0, false, {
                            fileName: "[project]/features/settings/pkgx/components/pkgx-bulk-sync-confirm-dialog.tsx",
                            lineNumber: 44,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogDescription"], {
                            className: "whitespace-pre-line",
                            children: progress.isRunning ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-3 pt-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$progress$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Progress"], {
                                        value: progressPercent,
                                        className: "h-2"
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/pkgx/components/pkgx-bulk-sync-confirm-dialog.tsx",
                                        lineNumber: 50,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between text-sm",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: [
                                                    progress.completed,
                                                    "/",
                                                    progress.total
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/settings/pkgx/components/pkgx-bulk-sync-confirm-dialog.tsx",
                                                lineNumber: 52,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: [
                                                    progressPercent,
                                                    "%"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/settings/pkgx/components/pkgx-bulk-sync-confirm-dialog.tsx",
                                                lineNumber: 53,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/settings/pkgx/components/pkgx-bulk-sync-confirm-dialog.tsx",
                                        lineNumber: 51,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-4 text-sm",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-green-600",
                                                children: [
                                                    "✓ ",
                                                    progress.success
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/settings/pkgx/components/pkgx-bulk-sync-confirm-dialog.tsx",
                                                lineNumber: 56,
                                                columnNumber: 19
                                            }, this),
                                            progress.error > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-red-600",
                                                children: [
                                                    "✗ ",
                                                    progress.error
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/settings/pkgx/components/pkgx-bulk-sync-confirm-dialog.tsx",
                                                lineNumber: 58,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/settings/pkgx/components/pkgx-bulk-sync-confirm-dialog.tsx",
                                        lineNumber: 55,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/settings/pkgx/components/pkgx-bulk-sync-confirm-dialog.tsx",
                                lineNumber: 49,
                                columnNumber: 15
                            }, this) : confirmAction.description
                        }, void 0, false, {
                            fileName: "[project]/features/settings/pkgx/components/pkgx-bulk-sync-confirm-dialog.tsx",
                            lineNumber: 47,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/settings/pkgx/components/pkgx-bulk-sync-confirm-dialog.tsx",
                    lineNumber: 43,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogFooter"], {
                    children: [
                        !progress.isRunning && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogCancel"], {
                                    onClick: (e)=>{
                                        e.stopPropagation();
                                        onCancel();
                                    },
                                    children: "Hủy"
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/pkgx/components/pkgx-bulk-sync-confirm-dialog.tsx",
                                    lineNumber: 70,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogAction"], {
                                    onClick: (e)=>{
                                        e.stopPropagation();
                                        onConfirm();
                                    },
                                    children: [
                                        "Xác nhận (",
                                        confirmAction.itemCount,
                                        ")"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/settings/pkgx/components/pkgx-bulk-sync-confirm-dialog.tsx",
                                    lineNumber: 73,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true),
                        progress.isRunning && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2 text-muted-foreground",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                    className: "h-4 w-4 animate-spin"
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/pkgx/components/pkgx-bulk-sync-confirm-dialog.tsx",
                                    lineNumber: 80,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "Đang xử lý..."
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/pkgx/components/pkgx-bulk-sync-confirm-dialog.tsx",
                                    lineNumber: 81,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/settings/pkgx/components/pkgx-bulk-sync-confirm-dialog.tsx",
                            lineNumber: 79,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/settings/pkgx/components/pkgx-bulk-sync-confirm-dialog.tsx",
                    lineNumber: 67,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/features/settings/pkgx/components/pkgx-bulk-sync-confirm-dialog.tsx",
            lineNumber: 42,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/features/settings/pkgx/components/pkgx-bulk-sync-confirm-dialog.tsx",
        lineNumber: 38,
        columnNumber: 5
    }, this);
}
}),
"[project]/features/brands/components/pkgx-link-dialog.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PkgxBrandLinkDialog",
    ()=>PkgxBrandLinkDialog
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Link2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/link-2.js [app-ssr] (ecmascript) <export default as Link2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dialog.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$virtualized$2d$combobox$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/virtualized-combobox.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/pkgx/api-service.ts [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
;
;
function PkgxBrandLinkDialog({ open, onOpenChange, brand, onSuccess }) {
    const pkgxSettingsStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePkgxSettingsStore"])();
    const cachedPkgxBrands = pkgxSettingsStore.settings.brands;
    const brandMappings = pkgxSettingsStore.settings.brandMappings;
    const addBrandMapping = pkgxSettingsStore.addBrandMapping;
    const setBrands = pkgxSettingsStore.setBrands;
    const [selectedPkgxBrand, setSelectedPkgxBrand] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](null);
    const [pkgxBrands, setPkgxBrandsLocal] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]([]);
    const [isLoading, setIsLoading] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](false);
    const [isSyncing, setIsSyncing] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](false);
    const [hasFetched, setHasFetched] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](false);
    const loadPkgxBrands = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](async ()=>{
        setIsLoading(true);
        try {
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getBrands"])();
            if (response.success && response.data && response.data.data) {
                // API trả về { error, message, total, data: PkgxBrandFromApi[] }
                // Cần map từ PkgxBrandFromApi -> PkgxBrand
                const brandsArray = response.data.data.map((b)=>({
                        id: b.brand_id,
                        name: b.brand_name,
                        brand_logo: b.brand_logo,
                        brand_desc: b.brand_desc,
                        site_url: b.site_url,
                        sort_order: b.sort_order
                    }));
                setPkgxBrandsLocal(brandsArray);
                setBrands(brandsArray); // Lưu vào store để dùng chung
                setHasFetched(true);
            }
        } catch (error) {
            console.error('Failed to load PKGX brands:', error);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Không thể tải danh sách thương hiệu PKGX');
        } finally{
            setIsLoading(false);
        }
    }, [
        setBrands
    ]);
    // Load PKGX brands khi mở dialog - chỉ chạy 1 lần
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        if (open && !hasFetched) {
            if (cachedPkgxBrands && cachedPkgxBrands.length > 0) {
                setPkgxBrandsLocal(cachedPkgxBrands);
                setHasFetched(true);
            } else {
                loadPkgxBrands();
            }
        }
    }, [
        open,
        hasFetched,
        cachedPkgxBrands,
        loadPkgxBrands
    ]);
    // Reset state khi đóng dialog
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        if (!open) {
            setSelectedPkgxBrand(null);
        }
    }, [
        open
    ]);
    // Filter out brands that are already linked
    const linkedPkgxBrandIds = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        return new Set(brandMappings.map((m)=>m.pkgxBrandId));
    }, [
        brandMappings
    ]);
    // Convert PKGX brands to combobox options
    const pkgxOptions = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        return pkgxBrands.filter((b)=>!linkedPkgxBrandIds.has(b.id)) // Exclude already linked
        .map((b)=>({
                value: String(b.id),
                label: b.name,
                subtitle: `ID: ${b.id}`,
                metadata: b
            }));
    }, [
        pkgxBrands,
        linkedPkgxBrandIds
    ]);
    const handleConfirmLink = async ()=>{
        if (!brand || !selectedPkgxBrand) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Vui lòng chọn thương hiệu PKGX để liên kết');
            return;
        }
        setIsSyncing(true);
        try {
            const pkgxBrandId = Number(selectedPkgxBrand.value);
            // Add mapping to store
            addBrandMapping({
                id: `brand-mapping-${brand.systemId}-${pkgxBrandId}`,
                hrmBrandSystemId: brand.systemId,
                hrmBrandName: brand.name,
                pkgxBrandId: pkgxBrandId,
                pkgxBrandName: selectedPkgxBrand.label
            });
            // Log to console
            console.log('[PKGX Brand Link]', {
                action: 'link_brand',
                status: 'success',
                brandId: brand.systemId,
                pkgxBrandId,
                pkgxBrandName: selectedPkgxBrand.label
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success(`Đã liên kết với thương hiệu PKGX: ${selectedPkgxBrand.label}`);
            onSuccess?.(pkgxBrandId);
            onOpenChange(false);
        } catch (error) {
            console.error('[PKGX Brand Link Error]', error);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Lỗi khi liên kết thương hiệu');
        } finally{
            setIsSyncing(false);
        }
    };
    if (!brand) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Dialog"], {
        open: open,
        onOpenChange: onOpenChange,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogContent"], {
            className: "sm:max-w-[500px]",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogHeader"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogTitle"], {
                            children: "Liên kết với thương hiệu PKGX"
                        }, void 0, false, {
                            fileName: "[project]/features/brands/components/pkgx-link-dialog.tsx",
                            lineNumber: 152,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogDescription"], {
                            children: "Chọn thương hiệu PKGX để liên kết với thương hiệu HRM này"
                        }, void 0, false, {
                            fileName: "[project]/features/brands/components/pkgx-link-dialog.tsx",
                            lineNumber: 153,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/brands/components/pkgx-link-dialog.tsx",
                    lineNumber: 151,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-4 py-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-lg bg-muted p-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm font-medium",
                                    children: "Thương hiệu HRM:"
                                }, void 0, false, {
                                    fileName: "[project]/features/brands/components/pkgx-link-dialog.tsx",
                                    lineNumber: 161,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm",
                                    children: brand.name
                                }, void 0, false, {
                                    fileName: "[project]/features/brands/components/pkgx-link-dialog.tsx",
                                    lineNumber: 162,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-muted-foreground",
                                    children: [
                                        "Mã: ",
                                        brand.id,
                                        " | SystemID: ",
                                        brand.systemId
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/brands/components/pkgx-link-dialog.tsx",
                                    lineNumber: 163,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/brands/components/pkgx-link-dialog.tsx",
                            lineNumber: 160,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "text-sm font-medium",
                                    children: "Chọn thương hiệu PKGX"
                                }, void 0, false, {
                                    fileName: "[project]/features/brands/components/pkgx-link-dialog.tsx",
                                    lineNumber: 170,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$virtualized$2d$combobox$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VirtualizedCombobox"], {
                                    value: selectedPkgxBrand,
                                    onChange: setSelectedPkgxBrand,
                                    options: pkgxOptions,
                                    placeholder: "Tìm và chọn thương hiệu PKGX...",
                                    searchPlaceholder: "Tìm theo tên...",
                                    emptyPlaceholder: isLoading ? 'Đang tải...' : 'Không tìm thấy thương hiệu PKGX',
                                    isLoading: isLoading,
                                    disabled: isLoading
                                }, void 0, false, {
                                    fileName: "[project]/features/brands/components/pkgx-link-dialog.tsx",
                                    lineNumber: 171,
                                    columnNumber: 13
                                }, this),
                                pkgxOptions.length === 0 && !isLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-muted-foreground",
                                    children: "Tất cả thương hiệu PKGX đã được liên kết. Hãy đồng bộ danh sách mới từ PKGX."
                                }, void 0, false, {
                                    fileName: "[project]/features/brands/components/pkgx-link-dialog.tsx",
                                    lineNumber: 182,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/brands/components/pkgx-link-dialog.tsx",
                            lineNumber: 169,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/brands/components/pkgx-link-dialog.tsx",
                    lineNumber: 158,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogFooter"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "outline",
                            onClick: ()=>onOpenChange(false),
                            disabled: isSyncing,
                            children: "Hủy"
                        }, void 0, false, {
                            fileName: "[project]/features/brands/components/pkgx-link-dialog.tsx",
                            lineNumber: 190,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                            onClick: handleConfirmLink,
                            disabled: !selectedPkgxBrand || isSyncing,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Link2$3e$__["Link2"], {
                                    className: "h-4 w-4 mr-2"
                                }, void 0, false, {
                                    fileName: "[project]/features/brands/components/pkgx-link-dialog.tsx",
                                    lineNumber: 201,
                                    columnNumber: 13
                                }, this),
                                isSyncing ? 'Đang liên kết...' : 'Liên kết'
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/brands/components/pkgx-link-dialog.tsx",
                            lineNumber: 197,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/brands/components/pkgx-link-dialog.tsx",
                    lineNumber: 189,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/features/brands/components/pkgx-link-dialog.tsx",
            lineNumber: 150,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/features/brands/components/pkgx-link-dialog.tsx",
        lineNumber: 149,
        columnNumber: 5
    }, this);
}
}),
"[project]/features/brands/components/pkgx-brand-detail-dialog.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PkgxBrandDetailDialog",
    ()=>PkgxBrandDetailDialog
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * Dialog hiển thị chi tiết thương hiệu từ PKGX
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dialog.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/badge.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$scroll$2d$area$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/scroll-area.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$separator$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/separator.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/external-link.js [app-ssr] (ecmascript) <export default as ExternalLink>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-ssr] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/globe.js [app-ssr] (ecmascript) <export default as Globe>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-ssr] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$text$2d$align$2d$start$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlignLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/text-align-start.js [app-ssr] (ecmascript) <export default as AlignLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/pkgx/api-service.ts [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
;
;
function PkgxBrandDetailDialog({ open, onOpenChange, brand, pkgxBrandId }) {
    const [loading, setLoading] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](false);
    const [pkgxData, setPkgxData] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](null);
    const [error, setError] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](null);
    // Fetch PKGX brand data
    const fetchPkgxData = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](async ()=>{
        if (!pkgxBrandId) return;
        setLoading(true);
        setError(null);
        try {
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getBrandById"])(pkgxBrandId);
            if (response.success && response.data) {
                setPkgxData(response.data);
            } else {
                setError(response.error || 'Không thể tải thông tin từ PKGX');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Lỗi kết nối');
        } finally{
            setLoading(false);
        }
    }, [
        pkgxBrandId
    ]);
    // Fetch when dialog opens
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        if (open && pkgxBrandId) {
            fetchPkgxData();
        }
    }, [
        open,
        pkgxBrandId,
        fetchPkgxData
    ]);
    // Reset when dialog closes
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        if (!open) {
            setPkgxData(null);
            setError(null);
        }
    }, [
        open
    ]);
    const handleOpenAdmin = ()=>{
        if (pkgxBrandId) {
            window.open(`https://phukiengiaxuong.com.vn/admin/brand.php?act=edit&id=${pkgxBrandId}`, '_blank');
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Dialog"], {
        open: open,
        onOpenChange: onOpenChange,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogContent"], {
            className: "max-w-2xl max-h-[85vh]",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogHeader"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogTitle"], {
                            className: "flex items-center gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "Thông tin trên PKGX"
                                }, void 0, false, {
                                    fileName: "[project]/features/brands/components/pkgx-brand-detail-dialog.tsx",
                                    lineNumber: 87,
                                    columnNumber: 13
                                }, this),
                                brand && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                    variant: "outline",
                                    children: brand.name
                                }, void 0, false, {
                                    fileName: "[project]/features/brands/components/pkgx-brand-detail-dialog.tsx",
                                    lineNumber: 88,
                                    columnNumber: 23
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/brands/components/pkgx-brand-detail-dialog.tsx",
                            lineNumber: 86,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogDescription"], {
                            children: "Dữ liệu hiện tại của thương hiệu trên website PKGX"
                        }, void 0, false, {
                            fileName: "[project]/features/brands/components/pkgx-brand-detail-dialog.tsx",
                            lineNumber: 90,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/brands/components/pkgx-brand-detail-dialog.tsx",
                    lineNumber: 85,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$scroll$2d$area$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ScrollArea"], {
                    className: "max-h-[60vh] pr-4",
                    children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-center py-12",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                className: "h-8 w-8 animate-spin text-muted-foreground"
                            }, void 0, false, {
                                fileName: "[project]/features/brands/components/pkgx-brand-detail-dialog.tsx",
                                lineNumber: 98,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "ml-2 text-muted-foreground",
                                children: "Đang tải..."
                            }, void 0, false, {
                                fileName: "[project]/features/brands/components/pkgx-brand-detail-dialog.tsx",
                                lineNumber: 99,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/brands/components/pkgx-brand-detail-dialog.tsx",
                        lineNumber: 97,
                        columnNumber: 13
                    }, this) : error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center py-12 text-destructive",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: error
                        }, void 0, false, {
                            fileName: "[project]/features/brands/components/pkgx-brand-detail-dialog.tsx",
                            lineNumber: 103,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/features/brands/components/pkgx-brand-detail-dialog.tsx",
                        lineNumber: 102,
                        columnNumber: 13
                    }, this) : pkgxData ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "font-medium flex items-center gap-2 text-sm text-muted-foreground",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__["Globe"], {
                                                className: "h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/features/brands/components/pkgx-brand-detail-dialog.tsx",
                                                lineNumber: 110,
                                                columnNumber: 19
                                            }, this),
                                            "Thông tin cơ bản"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/brands/components/pkgx-brand-detail-dialog.tsx",
                                        lineNumber: 109,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-2 gap-3 p-3 bg-muted/50 rounded-lg",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-muted-foreground",
                                                        children: "ID PKGX"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/brands/components/pkgx-brand-detail-dialog.tsx",
                                                        lineNumber: 115,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "font-medium",
                                                        children: pkgxData.brand_id
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/brands/components/pkgx-brand-detail-dialog.tsx",
                                                        lineNumber: 116,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/brands/components/pkgx-brand-detail-dialog.tsx",
                                                lineNumber: 114,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-muted-foreground",
                                                        children: "Tên thương hiệu"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/brands/components/pkgx-brand-detail-dialog.tsx",
                                                        lineNumber: 119,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "font-medium",
                                                        children: pkgxData.brand_name || '—'
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/brands/components/pkgx-brand-detail-dialog.tsx",
                                                        lineNumber: 120,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/brands/components/pkgx-brand-detail-dialog.tsx",
                                                lineNumber: 118,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "col-span-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-muted-foreground",
                                                        children: "Website URL"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/brands/components/pkgx-brand-detail-dialog.tsx",
                                                        lineNumber: 123,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "font-medium",
                                                        children: pkgxData.site_url || '—'
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/brands/components/pkgx-brand-detail-dialog.tsx",
                                                        lineNumber: 124,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/brands/components/pkgx-brand-detail-dialog.tsx",
                                                lineNumber: 122,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/brands/components/pkgx-brand-detail-dialog.tsx",
                                        lineNumber: 113,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/brands/components/pkgx-brand-detail-dialog.tsx",
                                lineNumber: 108,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$separator$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Separator"], {}, void 0, false, {
                                fileName: "[project]/features/brands/components/pkgx-brand-detail-dialog.tsx",
                                lineNumber: 129,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "font-medium flex items-center gap-2 text-sm text-muted-foreground",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                className: "h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/features/brands/components/pkgx-brand-detail-dialog.tsx",
                                                lineNumber: 134,
                                                columnNumber: 19
                                            }, this),
                                            "SEO"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/brands/components/pkgx-brand-detail-dialog.tsx",
                                        lineNumber: 133,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-3 p-3 bg-muted/50 rounded-lg",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-muted-foreground",
                                                        children: "Keywords"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/brands/components/pkgx-brand-detail-dialog.tsx",
                                                        lineNumber: 139,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm",
                                                        children: pkgxData.keywords || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-muted-foreground italic",
                                                            children: "Chưa có"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/brands/components/pkgx-brand-detail-dialog.tsx",
                                                            lineNumber: 140,
                                                            columnNumber: 66
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/brands/components/pkgx-brand-detail-dialog.tsx",
                                                        lineNumber: 140,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/brands/components/pkgx-brand-detail-dialog.tsx",
                                                lineNumber: 138,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-muted-foreground",
                                                        children: "Meta Title"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/brands/components/pkgx-brand-detail-dialog.tsx",
                                                        lineNumber: 143,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm",
                                                        children: pkgxData.meta_title || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-muted-foreground italic",
                                                            children: "Chưa có"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/brands/components/pkgx-brand-detail-dialog.tsx",
                                                            lineNumber: 144,
                                                            columnNumber: 68
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/brands/components/pkgx-brand-detail-dialog.tsx",
                                                        lineNumber: 144,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/brands/components/pkgx-brand-detail-dialog.tsx",
                                                lineNumber: 142,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-muted-foreground",
                                                        children: "Meta Description"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/brands/components/pkgx-brand-detail-dialog.tsx",
                                                        lineNumber: 147,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm",
                                                        children: pkgxData.meta_desc || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-muted-foreground italic",
                                                            children: "Chưa có"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/brands/components/pkgx-brand-detail-dialog.tsx",
                                                            lineNumber: 148,
                                                            columnNumber: 67
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/brands/components/pkgx-brand-detail-dialog.tsx",
                                                        lineNumber: 148,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/brands/components/pkgx-brand-detail-dialog.tsx",
                                                lineNumber: 146,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/brands/components/pkgx-brand-detail-dialog.tsx",
                                        lineNumber: 137,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/brands/components/pkgx-brand-detail-dialog.tsx",
                                lineNumber: 132,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$separator$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Separator"], {}, void 0, false, {
                                fileName: "[project]/features/brands/components/pkgx-brand-detail-dialog.tsx",
                                lineNumber: 153,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "font-medium flex items-center gap-2 text-sm text-muted-foreground",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$text$2d$align$2d$start$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlignLeft$3e$__["AlignLeft"], {
                                                className: "h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/features/brands/components/pkgx-brand-detail-dialog.tsx",
                                                lineNumber: 158,
                                                columnNumber: 19
                                            }, this),
                                            "Mô tả"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/brands/components/pkgx-brand-detail-dialog.tsx",
                                        lineNumber: 157,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-3 p-3 bg-muted/50 rounded-lg",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-muted-foreground",
                                                        children: "Mô tả ngắn (Short Desc)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/brands/components/pkgx-brand-detail-dialog.tsx",
                                                        lineNumber: 163,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-sm prose prose-sm max-w-none",
                                                        dangerouslySetInnerHTML: {
                                                            __html: pkgxData.short_desc || '<span class="text-muted-foreground italic">Chưa có</span>'
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/brands/components/pkgx-brand-detail-dialog.tsx",
                                                        lineNumber: 164,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/brands/components/pkgx-brand-detail-dialog.tsx",
                                                lineNumber: 162,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$separator$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Separator"], {}, void 0, false, {
                                                fileName: "[project]/features/brands/components/pkgx-brand-detail-dialog.tsx",
                                                lineNumber: 169,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-muted-foreground",
                                                        children: "Mô tả dài (Long Desc)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/brands/components/pkgx-brand-detail-dialog.tsx",
                                                        lineNumber: 171,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-sm prose prose-sm max-w-none max-h-40 overflow-y-auto",
                                                        dangerouslySetInnerHTML: {
                                                            __html: pkgxData.long_desc || '<span class="text-muted-foreground italic">Chưa có</span>'
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/brands/components/pkgx-brand-detail-dialog.tsx",
                                                        lineNumber: 172,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/brands/components/pkgx-brand-detail-dialog.tsx",
                                                lineNumber: 170,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/brands/components/pkgx-brand-detail-dialog.tsx",
                                        lineNumber: 161,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/brands/components/pkgx-brand-detail-dialog.tsx",
                                lineNumber: 156,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/brands/components/pkgx-brand-detail-dialog.tsx",
                        lineNumber: 106,
                        columnNumber: 13
                    }, this) : null
                }, void 0, false, {
                    fileName: "[project]/features/brands/components/pkgx-brand-detail-dialog.tsx",
                    lineNumber: 95,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-end gap-2 pt-4 border-t",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "outline",
                            onClick: ()=>onOpenChange(false),
                            children: "Đóng"
                        }, void 0, false, {
                            fileName: "[project]/features/brands/components/pkgx-brand-detail-dialog.tsx",
                            lineNumber: 184,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                            onClick: handleOpenAdmin,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                                    className: "mr-2 h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/features/brands/components/pkgx-brand-detail-dialog.tsx",
                                    lineNumber: 188,
                                    columnNumber: 13
                                }, this),
                                "Mở trang Admin PKGX"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/brands/components/pkgx-brand-detail-dialog.tsx",
                            lineNumber: 187,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/brands/components/pkgx-brand-detail-dialog.tsx",
                    lineNumber: 183,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/features/brands/components/pkgx-brand-detail-dialog.tsx",
            lineNumber: 84,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/features/brands/components/pkgx-brand-detail-dialog.tsx",
        lineNumber: 83,
        columnNumber: 5
    }, this);
}
}),
"[project]/features/settings/provinces/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useProvinceStore",
    ()=>useProvinceStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-ssr] (ecmascript)");
;
;
;
// Data is now loaded from API instead of static files to reduce bundle size (~3MB)
const API_BASE = '/api/administrative-units';
// Initialize with empty arrays - data will be loaded from API
const normalizedProvinces = [];
const normalizedDistricts = [];
const normalizedWards = [];
// Track loading state across all data types
let dataLoadedState = {
    provinces: false,
    districts: false,
    wards: false
};
const provinceBaseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createCrudStore"])(normalizedProvinces, 'provinces', {
    businessIdField: 'id',
    persistKey: 'hrm-provinces',
    getCurrentUser: __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserSystemId"]
});
const districtBaseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createCrudStore"])(normalizedDistricts, 'districts', {
    persistKey: 'hrm-districts',
    getCurrentUser: __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserSystemId"]
});
const wardBaseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createCrudStore"])(normalizedWards, 'wards', {
    persistKey: 'hrm-wards',
    getCurrentUser: __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserSystemId"]
});
function resetProvinceData(next) {
    provinceBaseStore.setState((state)=>({
            ...state,
            data: [],
            _counters: {
                systemId: 0,
                businessId: 0
            }
        }));
    if (next.length) {
        provinceBaseStore.getState().addMultiple(next);
    }
}
function replaceTwoLevelWards(next) {
    const retained = wardBaseStore.getState().data.filter((ward)=>ward.level !== '2-level');
    wardBaseStore.setState((state)=>({
            ...state,
            data: retained
        }));
    if (next.length) {
        const sanitized = next.map((ward)=>({
                ...ward,
                level: '2-level'
            }));
        wardBaseStore.getState().addMultiple(sanitized);
    }
}
function applyAdministrativeImport(payload) {
    resetProvinceData(payload.provinces);
    replaceTwoLevelWards(payload.wards);
}
// Track loading state
let loadingPromise = null;
const useProvinceStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((set, get)=>{
    provinceBaseStore.subscribe((state)=>set({
            data: state.data
        }));
    districtBaseStore.subscribe((state)=>set({
            districts: state.data
        }));
    wardBaseStore.subscribe((state)=>set({
            wards: state.data
        }));
    return {
        data: provinceBaseStore.getState().data,
        districts: districtBaseStore.getState().data,
        wards: wardBaseStore.getState().data,
        isLoading: false,
        isLoaded: false,
        // Load data from API (database) instead of static files
        loadData: async ()=>{
            // Return existing promise if already loading
            if (loadingPromise) return loadingPromise;
            // Skip if already loaded
            if (dataLoadedState.provinces && dataLoadedState.districts && dataLoadedState.wards) {
                set({
                    isLoaded: true
                });
                return;
            }
            set({
                isLoading: true
            });
            loadingPromise = (async ()=>{
                try {
                    // Fetch all data from API in parallel
                    const [provincesRes, districtsRes, wardsRes] = await Promise.all([
                        fetch(`${API_BASE}/provinces`),
                        fetch(`${API_BASE}/districts`),
                        // Fetch wards with large limit to get all
                        fetch(`${API_BASE}/wards?limit=20000`)
                    ]);
                    if (!provincesRes.ok || !districtsRes.ok || !wardsRes.ok) {
                        throw new Error('Failed to fetch administrative data from API');
                    }
                    const [provincesJson, districtsJson, wardsJson] = await Promise.all([
                        provincesRes.json(),
                        districtsRes.json(),
                        wardsRes.json()
                    ]);
                    const provinces = provincesJson.data || [];
                    const districts = districtsJson.data || [];
                    const wards = wardsJson.data || [];
                    // Update base stores with loaded data
                    provinceBaseStore.setState((state)=>({
                            ...state,
                            data: provinces
                        }));
                    districtBaseStore.setState((state)=>({
                            ...state,
                            data: districts
                        }));
                    wardBaseStore.setState((state)=>({
                            ...state,
                            data: wards
                        }));
                    // Mark all data as loaded
                    dataLoadedState = {
                        provinces: true,
                        districts: true,
                        wards: true
                    };
                    set({
                        isLoading: false,
                        isLoaded: true
                    });
                } catch (error) {
                    console.error('Failed to load administrative data from API:', error);
                    set({
                        isLoading: false
                    });
                } finally{
                    loadingPromise = null;
                }
            })();
            return loadingPromise;
        },
        add: (province)=>provinceBaseStore.getState().add(province),
        addMultiple: (provinces)=>provinceBaseStore.getState().addMultiple(provinces),
        update: (systemId, province)=>provinceBaseStore.getState().update(systemId, province),
        remove: (systemId)=>provinceBaseStore.getState().remove(systemId),
        findById: (systemId)=>provinceBaseStore.getState().findById(systemId),
        addWard: (ward)=>wardBaseStore.getState().add(ward),
        updateWard: (systemId, ward)=>wardBaseStore.getState().update(systemId, ward),
        removeWard: (systemId)=>wardBaseStore.getState().remove(systemId),
        addDistrict: (district)=>districtBaseStore.getState().add(district),
        updateDistrict: (systemId, district)=>districtBaseStore.getState().update(systemId, district),
        removeDistrict: (systemId)=>districtBaseStore.getState().remove(systemId),
        getWards2Level: ()=>get().wards.filter((ward)=>ward.level === '2-level'),
        getWards2LevelByProvinceId: (provinceId)=>get().wards.filter((ward)=>ward.level === '2-level' && ward.provinceId === provinceId),
        getWards3Level: ()=>get().wards.filter((ward)=>ward.level === '3-level'),
        getWards3LevelByProvinceId: (provinceId)=>get().wards.filter((ward)=>ward.level === '3-level' && ward.provinceId === provinceId),
        getWards3LevelByDistrictId: (districtId)=>get().wards.filter((ward)=>ward.level === '3-level' && ward.districtId === districtId),
        getDistricts3LevelByProvinceId: (provinceId)=>get().districts.filter((district)=>district.provinceId === provinceId),
        getWardsByProvinceId: (provinceId)=>get().wards.filter((ward)=>ward.provinceId === provinceId),
        getDistrictsByProvinceId: (provinceId)=>get().districts.filter((district)=>district.provinceId === provinceId),
        getWardsByDistrictId: (districtId)=>get().wards.filter((ward)=>ward.districtId === districtId),
        getDistrictById: (districtId)=>get().districts.find((district)=>district.id === districtId),
        getProvinceById: (provinceId)=>get().data.find((province)=>province.id === provinceId),
        getWardById: (wardId)=>get().wards.find((ward)=>ward.id === wardId),
        importAdministrativeUnits: (payload)=>applyAdministrativeImport(payload)
    };
});
}),
"[project]/features/settings/pricing/data.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "data",
    ()=>data
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/seed-audit.ts [app-ssr] (ecmascript)");
;
;
const data = [
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PP000001'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('10'),
        name: '10',
        description: 'Giá mặc định',
        type: 'Bán hàng',
        isDefault: true,
        isActive: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-05T08:00:00Z'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PP000002'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('GIANHAP'),
        name: 'Giá nhập',
        description: 'Giá nhập hàng từ nhà cung cấp',
        type: 'Nhập hàng',
        isDefault: true,
        isActive: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-06T08:00:00Z'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PP000003'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('BANLE'),
        name: 'Giá bán lẻ',
        description: 'Giá bán cho khách lẻ',
        type: 'Bán hàng',
        isDefault: false,
        isActive: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-07T08:00:00Z'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PP000004'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('BANBUON'),
        name: 'Giá bán buôn',
        description: 'Giá bán sỉ cho đại lý',
        type: 'Bán hàng',
        isDefault: false,
        isActive: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-08T08:00:00Z'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PP000005'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SHOPEE'),
        name: 'shopee',
        description: 'Giá bán trên Shopee',
        type: 'Bán hàng',
        isDefault: false,
        isActive: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-09T08:00:00Z'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PP000006'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('TIKTOK'),
        name: 'tiktok',
        description: 'Giá bán trên TikTok',
        type: 'Bán hàng',
        isDefault: false,
        isActive: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-10T08:00:00Z'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PP000007'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('ACE'),
        name: 'ace',
        description: 'Giá bán ACE',
        type: 'Bán hàng',
        isDefault: false,
        isActive: false,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-11T08:00:00Z'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PP000008'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('IDWEB'),
        name: 'idweb',
        description: 'Giá bán web',
        type: 'Bán hàng',
        isDefault: false,
        isActive: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-12T08:00:00Z'
        })
    }
];
}),
"[project]/features/settings/pricing/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePricingPolicyStore",
    ()=>usePricingPolicyStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pricing$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pricing/data.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-ssr] (ecmascript)");
;
;
;
const baseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createCrudStore"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pricing$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["data"], 'pricing-settings', {
    businessIdField: 'id',
    persistKey: 'hrm-pricing-policy-storage',
    getCurrentUser: __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserSystemId"]
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
"[project]/features/settings/inventory/product-type-store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useProductTypeStore",
    ()=>useProductTypeStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
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
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(item.systemId),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(item.id)
    }));
const useProductTypeStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        data: initialData,
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
}),
"[project]/features/settings/inventory/product-category-store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useProductCategoryStore",
    ()=>useProductCategoryStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
;
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
const rawData = [
    // Level 0 - Root categories
    {
        systemId: 'CATEGORY000001',
        id: 'DM000001',
        name: 'Điện tử',
        description: 'Thiết bị điện tử, phụ kiện điện thoại',
        color: '#3b82f6',
        sortOrder: 1,
        path: 'Điện tử',
        level: 0,
        isActive: true,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        systemId: 'CATEGORY000002',
        id: 'DM000002',
        name: 'Phụ kiện điện thoại',
        description: 'Ốp lưng, cường lực, sạc cáp',
        color: '#6366f1',
        sortOrder: 1,
        parentId: 'CATEGORY000001',
        path: 'Điện tử > Phụ kiện điện thoại',
        level: 1,
        isActive: true,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        systemId: 'CATEGORY000003',
        id: 'DM000003',
        name: 'Ốp lưng',
        description: 'Ốp lưng các loại',
        color: '#8b5cf6',
        sortOrder: 1,
        parentId: 'CATEGORY000002',
        path: 'Điện tử > Phụ kiện điện thoại > Ốp lưng',
        level: 2,
        isActive: true,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        systemId: 'CATEGORY000004',
        id: 'DM000004',
        name: 'Cường lực',
        description: 'Kính cường lực, dán màn hình',
        color: '#a855f7',
        sortOrder: 2,
        parentId: 'CATEGORY000002',
        path: 'Điện tử > Phụ kiện điện thoại > Cường lực',
        level: 2,
        isActive: true,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        systemId: 'CATEGORY000005',
        id: 'DM000005',
        name: 'Sạc & Cáp',
        description: 'Củ sạc, dây cáp các loại',
        color: '#c084fc',
        sortOrder: 3,
        parentId: 'CATEGORY000002',
        path: 'Điện tử > Phụ kiện điện thoại > Sạc & Cáp',
        level: 2,
        isActive: true,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        systemId: 'CATEGORY000006',
        id: 'DM000006',
        name: 'Tai nghe',
        description: 'Tai nghe có dây, bluetooth',
        color: '#22d3ee',
        sortOrder: 2,
        parentId: 'CATEGORY000001',
        path: 'Điện tử > Tai nghe',
        level: 1,
        isActive: true,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        systemId: 'CATEGORY000007',
        id: 'DM000007',
        name: 'Tai nghe Bluetooth',
        description: 'Airpods, TWS các loại',
        color: '#06b6d4',
        sortOrder: 1,
        parentId: 'CATEGORY000006',
        path: 'Điện tử > Tai nghe > Tai nghe Bluetooth',
        level: 2,
        isActive: true,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        systemId: 'CATEGORY000008',
        id: 'DM000008',
        name: 'Tai nghe có dây',
        description: 'Tai nghe jack 3.5mm, Type-C',
        color: '#14b8a6',
        sortOrder: 2,
        parentId: 'CATEGORY000006',
        path: 'Điện tử > Tai nghe > Tai nghe có dây',
        level: 2,
        isActive: true,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        systemId: 'CATEGORY000009',
        id: 'DM000009',
        name: 'Loa & Âm thanh',
        description: 'Loa bluetooth, soundbar',
        color: '#10b981',
        sortOrder: 3,
        parentId: 'CATEGORY000001',
        path: 'Điện tử > Loa & Âm thanh',
        level: 1,
        isActive: true,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    // Level 0 - Thời trang
    {
        systemId: 'CATEGORY000010',
        id: 'DM000010',
        name: 'Thời trang',
        description: 'Quần áo, giày dép, phụ kiện',
        color: '#ec4899',
        sortOrder: 2,
        path: 'Thời trang',
        level: 0,
        isActive: true,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        systemId: 'CATEGORY000011',
        id: 'DM000011',
        name: 'Đồng hồ',
        description: 'Đồng hồ nam, nữ, smartwatch',
        color: '#f472b6',
        sortOrder: 1,
        parentId: 'CATEGORY000010',
        path: 'Thời trang > Đồng hồ',
        level: 1,
        isActive: true,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        systemId: 'CATEGORY000012',
        id: 'DM000012',
        name: 'Túi xách',
        description: 'Túi xách, balo',
        color: '#f9a8d4',
        sortOrder: 2,
        parentId: 'CATEGORY000010',
        path: 'Thời trang > Túi xách',
        level: 1,
        isActive: true,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    // Level 0 - Gia dụng
    {
        systemId: 'CATEGORY000013',
        id: 'DM000013',
        name: 'Gia dụng',
        description: 'Đồ gia dụng, nội thất',
        color: '#f97316',
        sortOrder: 3,
        path: 'Gia dụng',
        level: 0,
        isActive: true,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        systemId: 'CATEGORY000014',
        id: 'DM000014',
        name: 'Đèn chiếu sáng',
        description: 'Đèn bàn, đèn LED',
        color: '#fb923c',
        sortOrder: 1,
        parentId: 'CATEGORY000013',
        path: 'Gia dụng > Đèn chiếu sáng',
        level: 1,
        isActive: true,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        systemId: 'CATEGORY000015',
        id: 'DM000015',
        name: 'Quạt',
        description: 'Quạt mini, quạt bàn',
        color: '#fdba74',
        sortOrder: 2,
        parentId: 'CATEGORY000013',
        path: 'Gia dụng > Quạt',
        level: 1,
        isActive: true,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];
const initialData = rawData.map((item)=>({
        ...item,
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(item.systemId),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(item.id),
        parentId: 'parentId' in item && item.parentId ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(item.parentId) : undefined
    }));
const INITIAL_COUNTER = rawData.length;
const useProductCategoryStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        data: initialData,
        counter: INITIAL_COUNTER,
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
        isBusinessIdExists: (id)=>get().data.some((item)=>String(item.id) === id)
    }), {
    name: 'product-category-storage'
}));
}),
"[project]/features/customers/data.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "data",
    ()=>data
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
;
const data = [
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("CUST000001"),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])("KH000001"),
        name: "Công ty Cổ phần Bất động sản Hưng Thịnh",
        email: "info@hungthinhcorp.vn",
        phone: "0901112233",
        company: "Hưng Thịnh Corp",
        status: "Đang giao dịch",
        taxCode: "0301234567",
        zaloPhone: "0901112233",
        currentDebt: 30000000,
        maxDebt: 50000000,
        accountManagerId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000002"),
        accountManagerName: "Trần Thị Bình",
        createdAt: "2024-03-10",
        updatedAt: "2025-10-21T09:30:00Z",
        createdBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000002"),
        updatedBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000002"),
        totalOrders: 2,
        totalSpent: 42000000,
        totalQuantityPurchased: 5,
        totalQuantityReturned: 0,
        lastPurchaseDate: "2025-09-20",
        failedDeliveries: 3,
        lastContactDate: "2025-10-18",
        nextFollowUpDate: "2025-11-05",
        followUpReason: "Đôn đốc ký phụ lục hợp đồng",
        followUpAssigneeId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000002"),
        followUpAssigneeName: "Trần Thị Bình",
        // New fields
        source: "Referral",
        campaign: "Q3-2024-Real-Estate",
        paymentTerms: "NET30",
        creditRating: "AA",
        allowCredit: true,
        defaultDiscount: 5,
        pricingLevel: "Wholesale",
        tags: [
            "VIP",
            "Bất động sản",
            "Khách hàng lớn"
        ],
        contacts: [
            {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])("KHCT000001"),
                name: "Nguyễn Văn A",
                role: "Giám đốc",
                phone: "0901112233",
                email: "a.nguyen@hungthinhcorp.vn",
                isPrimary: true
            },
            {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])("KHCT000002"),
                name: "Trần Thị B",
                role: "Kế toán",
                phone: "0901112244",
                email: "b.tran@hungthinhcorp.vn",
                isPrimary: false
            }
        ],
        social: {
            website: "https://hungthinhcorp.vn",
            facebook: "HungThinhCorp"
        },
        contract: {
            number: "HĐ-2024-001",
            startDate: "2024-01-01",
            endDate: "2025-12-31",
            value: 500000000,
            status: "Active"
        },
        // Debt Tracking
        debtTransactions: [
            {
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("DT000001"),
                orderId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])("ORD000123"),
                orderDate: "2025-09-20",
                amount: 30000000,
                dueDate: "2025-10-20",
                isPaid: false,
                remainingAmount: 30000000,
                notes: "Đơn hàng thiết bị văn phòng"
            }
        ],
        debtReminders: [
            {
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("REM000001"),
                reminderDate: "2025-10-21",
                reminderType: "Gọi điện",
                reminderBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000002"),
                reminderByName: "Trần Thị Bình",
                customerResponse: "Hứa trả",
                promisePaymentDate: "2025-10-27",
                notes: "KH đang chờ thanh toán từ khách của họ, hứa trả trong tuần này",
                createdAt: "2025-10-21T09:30:00Z"
            }
        ]
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("CUST000002"),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])("KH000002"),
        name: "Chuỗi cà phê The Coffee House",
        email: "contact@thecoffeehouse.vn",
        phone: "02871087088",
        company: "The Coffee House",
        status: "Đang giao dịch",
        taxCode: "0313222173",
        zaloPhone: "0902888999",
        currentDebt: 0,
        maxDebt: 100000000,
        accountManagerId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000007"),
        accountManagerName: "Đỗ Hùng",
        createdAt: "2024-01-25",
        updatedAt: "2025-10-10T08:15:00Z",
        createdBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000007"),
        updatedBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000007"),
        totalOrders: 5,
        totalSpent: 156000000,
        totalQuantityPurchased: 15,
        totalQuantityReturned: 0,
        lastPurchaseDate: "2025-10-10",
        failedDeliveries: 0,
        lastContactDate: "2025-10-15",
        nextFollowUpDate: "2025-12-01",
        followUpAssigneeId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000007"),
        followUpAssigneeName: "Đỗ Hùng",
        // New fields
        source: "Website",
        campaign: "Online-Marketing-2024",
        paymentTerms: "NET15",
        creditRating: "AAA",
        allowCredit: true,
        defaultDiscount: 10,
        pricingLevel: "VIP",
        tags: [
            "F&B",
            "Chuỗi",
            "Khách hàng thân thiết"
        ],
        contacts: [
            {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])("KHCT000003"),
                name: "Nguyễn Thị Thu",
                role: "Purchasing Manager",
                phone: "0902888999",
                email: "thu.nguyen@thecoffeehouse.vn",
                isPrimary: true
            }
        ],
        social: {
            website: "https://thecoffeehouse.vn",
            facebook: "TheCoffeeHouseVN",
            linkedin: "the-coffee-house"
        },
        // Debt Tracking - Không có nợ
        debtTransactions: [],
        debtReminders: []
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("CUST000003"),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])("KH000003"),
        name: "Anh Trần Minh Hoàng",
        email: "tmhoang.dev@gmail.com",
        phone: "0987123456",
        company: "Khách lẻ",
        status: "Đang giao dịch",
        zaloPhone: "0987123456",
        currentDebt: 0,
        maxDebt: 10000000,
        accountManagerId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000006"),
        accountManagerName: "Vũ Thị Giang",
        createdAt: "2025-08-01",
        updatedAt: "2025-08-01T10:00:00Z",
        createdBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000006"),
        updatedBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000006"),
        totalOrders: 1,
        totalSpent: 8000000,
        totalQuantityPurchased: 1,
        totalQuantityReturned: 0,
        lastPurchaseDate: "2025-08-01",
        failedDeliveries: 0,
        // New fields
        source: "Social",
        paymentTerms: "COD",
        allowCredit: false,
        pricingLevel: "Retail",
        tags: [
            "Khách lẻ"
        ],
        // Debt Tracking - Không có nợ
        debtTransactions: [],
        debtReminders: []
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("CUST000004"),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])("KH000004"),
        name: "Shop thời trang GenZ Style",
        email: "genzstyle@fashion.com",
        phone: "0918765432",
        company: "GenZ Style",
        status: "Ngừng Giao Dịch",
        taxCode: "0398765432",
        zaloPhone: "0918765432",
        currentDebt: 500000,
        maxDebt: 20000000,
        accountManagerId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000009"),
        accountManagerName: "Trịnh Văn Khoa",
        createdAt: "2023-11-15",
        updatedAt: "2024-09-20T16:30:00Z",
        createdBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000009"),
        updatedBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000009"),
        totalOrders: 3,
        totalSpent: 12500000,
        totalQuantityPurchased: 8,
        totalQuantityReturned: 2,
        lastPurchaseDate: "2024-06-30",
        failedDeliveries: 1,
        // New fields
        source: "Partner",
        campaign: "Fashion-Partner-2023",
        paymentTerms: "NET7",
        creditRating: "C",
        allowCredit: false,
        pricingLevel: "Retail",
        tags: [
            "Thời trang",
            "Nợ xấu",
            "Tạm ngưng"
        ],
        // Debt Tracking - Nợ xấu 490 ngày!
        debtTransactions: [
            {
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("DT000002"),
                orderId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])("ORD000045"),
                orderDate: "2024-06-15",
                amount: 500000,
                dueDate: "2024-06-22",
                isPaid: false,
                remainingAmount: 500000,
                notes: "Đơn hàng phụ kiện thời trang"
            }
        ],
        debtReminders: [
            {
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("REM000002"),
                reminderDate: "2024-07-01",
                reminderType: "Gọi điện",
                reminderBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000009"),
                reminderByName: "Trịnh Văn Khoa",
                customerResponse: "Không liên lạc được",
                notes: "Gọi nhiều lần không nghe máy",
                createdAt: "2024-07-01T14:00:00Z"
            },
            {
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("REM000003"),
                reminderDate: "2024-08-15",
                reminderType: "Email",
                reminderBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000009"),
                reminderByName: "Trịnh Văn Khoa",
                customerResponse: "Không liên lạc được",
                notes: "Email gửi nhưng không phản hồi",
                createdAt: "2024-08-15T10:00:00Z"
            },
            {
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("REM000004"),
                reminderDate: "2024-09-20",
                reminderType: "Gặp trực tiếp",
                reminderBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000009"),
                reminderByName: "Trịnh Văn Khoa",
                customerResponse: "Từ chối",
                notes: "KH gặp khó khăn tài chính, từ chối thanh toán. Đề xuất xử lý pháp lý",
                createdAt: "2024-09-20T16:30:00Z"
            }
        ]
    }
];
}),
"[project]/features/customers/lifecycle-utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "calculateLifecycleStage",
    ()=>calculateLifecycleStage,
    "getLifecycleStageVariant",
    ()=>getLifecycleStageVariant,
    "updateAllCustomerLifecycleStages",
    ()=>updateAllCustomerLifecycleStages
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-ssr] (ecmascript)");
;
const calculateLifecycleStage = (customer)=>{
    const totalOrders = customer.totalOrders || 0;
    const totalSpent = customer.totalSpent || 0;
    const lastPurchaseDate = customer.lastPurchaseDate;
    // Nếu chưa mua lần nào
    if (totalOrders === 0) {
        return "Khách tiềm năng";
    }
    // Tính số ngày từ lần mua cuối
    const daysSinceLastPurchase = lastPurchaseDate ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDaysDiff"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentDate"])(), new Date(lastPurchaseDate)) : Infinity;
    // Khách đã mất (không mua > 365 ngày)
    if (daysSinceLastPurchase > 365) {
        return "Mất khách";
    }
    // Không hoạt động (không mua > 180 ngày)
    if (daysSinceLastPurchase > 180) {
        return "Không hoạt động";
    }
    // Khách VIP: Top 10% spending (>= 50 triệu) và mua >= 5 lần
    if (totalSpent >= 50_000_000 && totalOrders >= 5) {
        return "Khách VIP";
    }
    // Khách thân thiết: Mua >= 5 lần
    if (totalOrders >= 5) {
        return "Khách thân thiết";
    }
    // Khách quay lại: Mua 2-4 lần
    if (totalOrders >= 2) {
        return "Khách quay lại";
    }
    // Khách mới: Mua lần đầu
    return "Khách mới";
};
const getLifecycleStageVariant = (stage)=>{
    switch(stage){
        case "Khách VIP":
            return "success";
        case "Khách thân thiết":
            return "success";
        case "Khách quay lại":
            return "default";
        case "Khách mới":
            return "secondary";
        case "Khách tiềm năng":
            return "secondary";
        case "Không hoạt động":
            return "warning";
        case "Mất khách":
            return "destructive";
        default:
            return "secondary";
    }
};
const updateAllCustomerLifecycleStages = (customers)=>{
    return customers.map((customer)=>({
            ...customer,
            lifecycleStage: calculateLifecycleStage(customer)
        }));
};
}),
"[project]/features/customers/credit-utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "canCreateOrder",
    ()=>canCreateOrder,
    "getCreditAlertBadgeVariant",
    ()=>getCreditAlertBadgeVariant,
    "getCreditAlertLevel",
    ()=>getCreditAlertLevel,
    "getCreditAlertText",
    ()=>getCreditAlertText,
    "getHighRiskDebtCustomers",
    ()=>getHighRiskDebtCustomers
]);
const getCreditAlertLevel = (customer)=>{
    const currentDebt = customer.currentDebt || 0;
    const maxDebt = customer.maxDebt || 0;
    // Nếu không có hạn mức hoặc hạn mức = 0, không cảnh báo
    if (maxDebt === 0) return 'safe';
    const debtRatio = currentDebt / maxDebt * 100;
    if (debtRatio >= 100) return 'exceeded'; // Vượt hạn mức
    if (debtRatio >= 90) return 'danger'; // >= 90%
    if (debtRatio >= 70) return 'warning'; // >= 70%
    return 'safe'; // < 70%
};
const getCreditAlertBadgeVariant = (level)=>{
    switch(level){
        case 'exceeded':
        case 'danger':
            return 'destructive';
        case 'warning':
            return 'warning';
        case 'safe':
            return 'success';
        default:
            return 'secondary';
    }
};
const getCreditAlertText = (level)=>{
    switch(level){
        case 'exceeded':
            return 'Vượt hạn mức';
        case 'danger':
            return 'Sắp vượt hạn';
        case 'warning':
            return 'Cần theo dõi';
        case 'safe':
            return 'An toàn';
        default:
            return '';
    }
};
const canCreateOrder = (customer, orderAmount)=>{
    const currentDebt = customer.currentDebt || 0;
    const maxDebt = customer.maxDebt || 0;
    // Nếu không cho phép công nợ và có công nợ hiện tại
    if (!customer.allowCredit && currentDebt > 0) {
        return {
            allowed: false,
            reason: 'Khách hàng không được phép công nợ và còn nợ cũ'
        };
    }
    // Nếu có hạn mức công nợ
    if (maxDebt > 0) {
        const newDebt = currentDebt + orderAmount;
        if (newDebt > maxDebt) {
            return {
                allowed: false,
                reason: `Đơn hàng này sẽ vượt hạn mức công nợ (${formatCurrency(newDebt)} / ${formatCurrency(maxDebt)})`
            };
        }
    }
    return {
        allowed: true
    };
};
const getHighRiskDebtCustomers = (customers)=>{
    return customers.filter((customer)=>{
        const level = getCreditAlertLevel(customer);
        return level === 'danger' || level === 'exceeded';
    }).sort((a, b)=>{
        const ratioA = (a.currentDebt || 0) / (a.maxDebt || 1) * 100;
        const ratioB = (b.currentDebt || 0) / (b.maxDebt || 1) * 100;
        return ratioB - ratioA; // Sort by ratio descending
    });
};
/**
 * Helper format currency
 */ const formatCurrency = (value)=>{
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(value);
};
}),
"[project]/features/customers/intelligence-utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "calculateChurnRisk",
    ()=>calculateChurnRisk,
    "calculateHealthScore",
    ()=>calculateHealthScore,
    "calculateRFMScores",
    ()=>calculateRFMScores,
    "getCustomerSegment",
    ()=>getCustomerSegment,
    "getHealthScoreLevel",
    ()=>getHealthScoreLevel,
    "getSegmentBadgeVariant",
    ()=>getSegmentBadgeVariant,
    "getSegmentLabel",
    ()=>getSegmentLabel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-ssr] (ecmascript)");
;
const calculateRFMScores = (customer, allCustomers)=>{
    // Recency: Số ngày từ lần mua cuối
    const daysSinceLastPurchase = customer.lastPurchaseDate ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDaysDiff"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentDate"])(), new Date(customer.lastPurchaseDate)) : 999999;
    // Frequency: Tổng số đơn hàng
    const frequency = customer.totalOrders || 0;
    // Monetary: Tổng chi tiêu
    const monetary = customer.totalSpent || 0;
    // Calculate percentiles for scoring
    const allRecencies = allCustomers.map((c)=>c.lastPurchaseDate ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDaysDiff"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentDate"])(), new Date(c.lastPurchaseDate)) : 999999).sort((a, b)=>a - b);
    const allFrequencies = allCustomers.map((c)=>c.totalOrders || 0).sort((a, b)=>b - a);
    const allMonetary = allCustomers.map((c)=>c.totalSpent || 0).sort((a, b)=>b - a);
    // Score Recency (lower is better, so invert)
    const recencyScore = getScore(daysSinceLastPurchase, allRecencies, true);
    // Score Frequency (higher is better)
    const frequencyScore = getScore(frequency, allFrequencies, false);
    // Score Monetary (higher is better)
    const monetaryScore = getScore(monetary, allMonetary, false);
    return {
        recency: recencyScore,
        frequency: frequencyScore,
        monetary: monetaryScore
    };
};
/**
 * Helper: Tính score 1-5 dựa trên percentile
 */ const getScore = (value, sortedValues, invert)=>{
    const index = sortedValues.indexOf(value);
    if (index === -1) return 1;
    const percentile = index / sortedValues.length * 100;
    let score;
    if (percentile >= 80) score = 5;
    else if (percentile >= 60) score = 4;
    else if (percentile >= 40) score = 3;
    else if (percentile >= 20) score = 2;
    else score = 1;
    // Invert for recency (lower days = better)
    if (invert) {
        score = 6 - score;
    }
    return score;
};
const getCustomerSegment = (rfm)=>{
    const { recency: R, frequency: F, monetary: M } = rfm;
    // Champions: RFM 5-5-5, 5-4-5, 4-5-5, 5-5-4
    if (R >= 4 && F >= 4 && M >= 4 && (R === 5 || F === 5)) {
        return 'Champions';
    }
    // Loyal Customers: RFM 4-4-4, 4-5-4, 5-4-4, 4-4-5
    if (R >= 4 && F >= 4 && M >= 4) {
        return 'Loyal Customers';
    }
    // Potential Loyalist: High frequency, good recency
    if (R >= 3 && F >= 3 && M >= 3) {
        return 'Potential Loyalist';
    }
    // New Customers: High recency, low frequency
    if (R >= 4 && F <= 2) {
        return 'New Customers';
    }
    // Promising: Good recency, moderate frequency
    if (R >= 3 && F >= 2 && F <= 3) {
        return 'Promising';
    }
    // Need Attention: Moderate scores
    if (R === 3 && F === 2) {
        return 'Need Attention';
    }
    // About To Sleep: Low frequency, moderate recency
    if ((R === 3 || R === 2) && F <= 2) {
        return 'About To Sleep';
    }
    // Cannot Lose Them: Low recency but high value
    if (R === 1 && F >= 4 && M >= 4) {
        return 'Cannot Lose Them';
    }
    // At Risk: Low recency, good history
    if (R <= 2 && F >= 3) {
        return 'At Risk';
    }
    // Hibernating: Low recency and frequency
    if (R <= 2 && F <= 2 && M >= 2) {
        return 'Hibernating';
    }
    // Lost: Lowest scores
    return 'Lost';
};
const getSegmentBadgeVariant = (segment)=>{
    switch(segment){
        case 'Champions':
        case 'Loyal Customers':
            return 'success';
        case 'Potential Loyalist':
        case 'Promising':
            return 'default';
        case 'New Customers':
            return 'secondary';
        case 'Need Attention':
        case 'About To Sleep':
            return 'warning';
        case 'At Risk':
        case 'Cannot Lose Them':
        case 'Hibernating':
        case 'Lost':
            return 'destructive';
        default:
            return 'secondary';
    }
};
const getSegmentLabel = (segment)=>{
    const labels = {
        'Champions': 'Xuất sắc',
        'Loyal Customers': 'Trung thành',
        'Potential Loyalist': 'Tiềm năng cao',
        'New Customers': 'Khách mới',
        'Promising': 'Hứa hẹn',
        'Need Attention': 'Cần quan tâm',
        'About To Sleep': 'Sắp ngủ đông',
        'At Risk': 'Có nguy cơ',
        'Cannot Lose Them': 'Không thể mất',
        'Hibernating': 'Ngủ đông',
        'Lost': 'Đã mất'
    };
    return labels[segment];
};
const calculateHealthScore = (customer)=>{
    let score = 0;
    // 1. Recency - Thời gian mua gần nhất (30 points)
    const daysSinceLastPurchase = customer.lastPurchaseDate ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDaysDiff"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentDate"])(), new Date(customer.lastPurchaseDate)) : Infinity;
    if (daysSinceLastPurchase <= 7) score += 30;
    else if (daysSinceLastPurchase <= 30) score += 25;
    else if (daysSinceLastPurchase <= 60) score += 20;
    else if (daysSinceLastPurchase <= 90) score += 15;
    else if (daysSinceLastPurchase <= 180) score += 10;
    else if (daysSinceLastPurchase <= 365) score += 5;
    // 2. Frequency - Tần suất mua (25 points)
    const totalOrders = customer.totalOrders || 0;
    if (totalOrders >= 20) score += 25;
    else if (totalOrders >= 10) score += 20;
    else if (totalOrders >= 5) score += 15;
    else if (totalOrders >= 3) score += 10;
    else if (totalOrders >= 1) score += 5;
    // 3. Monetary - Tổng chi tiêu (30 points)
    const totalSpent = customer.totalSpent || 0;
    if (totalSpent >= 500_000_000) score += 30;
    else if (totalSpent >= 200_000_000) score += 25;
    else if (totalSpent >= 100_000_000) score += 20;
    else if (totalSpent >= 50_000_000) score += 15;
    else if (totalSpent >= 20_000_000) score += 10;
    else if (totalSpent >= 5_000_000) score += 5;
    // 4. Payment Behavior - Hành vi thanh toán (15 points)
    // Dựa trên tỷ lệ nợ hiện tại so với hạn mức
    if (customer.maxDebt && customer.maxDebt > 0) {
        const debtRatio = (customer.currentDebt || 0) / customer.maxDebt;
        if (debtRatio <= 0.2) score += 15;
        else if (debtRatio <= 0.4) score += 12;
        else if (debtRatio <= 0.6) score += 8;
        else if (debtRatio <= 0.8) score += 4;
    // > 80% = 0 điểm
    } else {
        // Không có hạn mức công nợ → xem như thanh toán tốt
        score += 15;
    }
    return Math.min(100, score);
};
const getHealthScoreLevel = (score)=>{
    if (score >= 80) return {
        level: 'excellent',
        label: 'Xuất sắc',
        variant: 'success'
    };
    if (score >= 60) return {
        level: 'good',
        label: 'Tốt',
        variant: 'default'
    };
    if (score >= 40) return {
        level: 'fair',
        label: 'Trung bình',
        variant: 'warning'
    };
    if (score >= 20) return {
        level: 'poor',
        label: 'Yếu',
        variant: 'destructive'
    };
    return {
        level: 'critical',
        label: 'Nguy hiểm',
        variant: 'destructive'
    };
};
const calculateChurnRisk = (customer)=>{
    const daysSinceLastPurchase = customer.lastPurchaseDate ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDaysDiff"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentDate"])(), new Date(customer.lastPurchaseDate)) : Infinity;
    const totalOrders = customer.totalOrders || 0;
    // Nếu khách mới (chưa có đơn hoặc chỉ 1 đơn), dùng default 30 ngày
    // Nếu khách cũ, tính dựa trên thời gian từ createdAt đến lastPurchaseDate / số đơn
    let avgDaysBetweenOrders = 30; // Default
    if (totalOrders > 1 && customer.createdAt && customer.lastPurchaseDate) {
        const customerAge = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDaysDiff"])(new Date(customer.lastPurchaseDate), new Date(customer.createdAt));
        avgDaysBetweenOrders = Math.max(7, customerAge / (totalOrders - 1)); // Tối thiểu 7 ngày
    }
    // Khách vừa mua hàng gần đây (< 7 ngày) = low risk
    if (daysSinceLastPurchase <= 7) {
        return {
            risk: 'low',
            label: 'Nguy cơ thấp',
            variant: 'success',
            reason: 'Khách hàng đang hoạt động tốt'
        };
    }
    // High risk: Không mua > 2x thời gian trung bình hoặc > 365 ngày
    if (daysSinceLastPurchase > avgDaysBetweenOrders * 2 || daysSinceLastPurchase > 365) {
        return {
            risk: 'high',
            label: 'Nguy cơ cao',
            variant: 'destructive',
            reason: `Không mua hàng ${Math.floor(daysSinceLastPurchase)} ngày, vượt quá 2x chu kỳ trung bình`
        };
    }
    // Medium risk: Không mua > 1.5x thời gian trung bình hoặc > 180 ngày
    if (daysSinceLastPurchase > avgDaysBetweenOrders * 1.5 || daysSinceLastPurchase > 180) {
        return {
            risk: 'medium',
            label: 'Nguy cơ trung bình',
            variant: 'warning',
            reason: `Không mua hàng ${Math.floor(daysSinceLastPurchase)} ngày, đang giảm tần suất`
        };
    }
    // Low risk
    return {
        risk: 'low',
        label: 'Nguy cơ thấp',
        variant: 'success',
        reason: 'Khách hàng đang hoạt động tốt'
    };
};
}),
"[project]/features/customers/debt-tracking-utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "calculateDaysOverdue",
    ()=>calculateDaysOverdue,
    "calculateDaysUntilDue",
    ()=>calculateDaysUntilDue,
    "calculateDebtTrackingInfo",
    ()=>calculateDebtTrackingInfo,
    "calculateDueDate",
    ()=>calculateDueDate,
    "calculateTotalDueSoonDebt",
    ()=>calculateTotalDueSoonDebt,
    "calculateTotalOverdueDebt",
    ()=>calculateTotalOverdueDebt,
    "formatCurrency",
    ()=>formatCurrency,
    "formatDebtDate",
    ()=>formatDebtDate,
    "getDebtStatus",
    ()=>getDebtStatus,
    "getDebtStatusVariant",
    ()=>getDebtStatusVariant,
    "getDueSoonCustomers",
    ()=>getDueSoonCustomers,
    "getOverdueDebtCustomers",
    ()=>getOverdueDebtCustomers,
    "parsePaymentTerms",
    ()=>parsePaymentTerms
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-ssr] (ecmascript)");
;
const calculateDueDate = (orderDate, paymentTermsDays)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODate"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["addDays"])(new Date(orderDate), paymentTermsDays));
};
const parsePaymentTerms = (paymentTerms)=>{
    if (!paymentTerms) return 0;
    const match = paymentTerms.match(/NET(\d+)/i);
    if (match) {
        return parseInt(match[1], 10);
    }
    if (paymentTerms.toUpperCase() === 'COD') {
        return 0; // COD = thanh toán ngay
    }
    return 30; // Default 30 ngày
};
const calculateDaysOverdue = (dueDate)=>{
    const days = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDaysDiff"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentDate"])(), new Date(dueDate));
    return days > 0 ? days : 0;
};
const calculateDaysUntilDue = (dueDate)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDaysDiff"])(new Date(dueDate), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentDate"])());
};
const getDebtStatus = (dueDate, hasDebt)=>{
    if (!hasDebt) return null;
    const daysUntilDue = calculateDaysUntilDue(dueDate);
    // Chưa đến hạn
    if (daysUntilDue > 3) return "Chưa đến hạn";
    // Sắp đến hạn (1-3 ngày)
    if (daysUntilDue >= 1 && daysUntilDue <= 3) return "Sắp đến hạn";
    // Đến hạn hôm nay
    if (daysUntilDue === 0) return "Đến hạn hôm nay";
    // Quá hạn
    const daysOverdue = Math.abs(daysUntilDue);
    if (daysOverdue >= 1 && daysOverdue <= 7) return "Quá hạn 1-7 ngày";
    if (daysOverdue >= 8 && daysOverdue <= 15) return "Quá hạn 8-15 ngày";
    if (daysOverdue >= 16 && daysOverdue <= 30) return "Quá hạn 16-30 ngày";
    return "Quá hạn > 30 ngày";
};
const getDebtStatusVariant = (status)=>{
    if (!status) return 'secondary';
    switch(status){
        case "Chưa đến hạn":
            return "secondary";
        case "Sắp đến hạn":
            return "default";
        case "Đến hạn hôm nay":
            return "warning";
        case "Quá hạn 1-7 ngày":
            return "warning";
        case "Quá hạn 8-15 ngày":
        case "Quá hạn 16-30 ngày":
        case "Quá hạn > 30 ngày":
            return "destructive";
        default:
            return "secondary";
    }
};
const calculateDebtTrackingInfo = (customer)=>{
    const debtTransactions = customer.debtTransactions || [];
    const unpaidTransactions = debtTransactions.filter((t)=>!t.isPaid);
    if (unpaidTransactions.length === 0 || !customer.currentDebt || customer.currentDebt === 0) {
        return {
            maxDaysOverdue: 0,
            debtStatus: null
        };
    }
    // Tìm giao dịch có dueDate sớm nhất (nợ lâu nhất)
    const oldestTransaction = unpaidTransactions.reduce((oldest, current)=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isDateBefore"])(new Date(current.dueDate), new Date(oldest.dueDate)) ? current : oldest;
    });
    const oldestDebtDueDate = oldestTransaction.dueDate;
    const maxDaysOverdue = calculateDaysOverdue(oldestDebtDueDate);
    const debtStatus = getDebtStatus(oldestDebtDueDate, true);
    return {
        oldestDebtDueDate,
        maxDaysOverdue,
        debtStatus
    };
};
const getOverdueDebtCustomers = (customers)=>{
    return customers.filter((c)=>{
        const info = calculateDebtTrackingInfo(c);
        return info.maxDaysOverdue > 0; // Chỉ lấy KH quá hạn
    }).sort((a, b)=>{
        const infoA = calculateDebtTrackingInfo(a);
        const infoB = calculateDebtTrackingInfo(b);
        // Sắp xếp theo số ngày quá hạn (giảm dần)
        return (infoB.maxDaysOverdue || 0) - (infoA.maxDaysOverdue || 0);
    });
};
const getDueSoonCustomers = (customers)=>{
    return customers.filter((c)=>{
        const info = calculateDebtTrackingInfo(c);
        if (!info.oldestDebtDueDate) return false;
        const daysUntil = calculateDaysUntilDue(info.oldestDebtDueDate);
        return daysUntil >= 1 && daysUntil <= 3;
    }).sort((a, b)=>{
        const infoA = calculateDebtTrackingInfo(a);
        const infoB = calculateDebtTrackingInfo(b);
        const daysA = infoA.oldestDebtDueDate ? calculateDaysUntilDue(infoA.oldestDebtDueDate) : 999;
        const daysB = infoB.oldestDebtDueDate ? calculateDaysUntilDue(infoB.oldestDebtDueDate) : 999;
        return daysA - daysB; // Sắp xếp theo ngày đến hạn (tăng dần)
    });
};
const calculateTotalOverdueDebt = (customers)=>{
    return getOverdueDebtCustomers(customers).reduce((sum, c)=>sum + (c.currentDebt || 0), 0);
};
const calculateTotalDueSoonDebt = (customers)=>{
    return getDueSoonCustomers(customers).reduce((sum, c)=>sum + (c.currentDebt || 0), 0);
};
const formatDebtDate = (dateString)=>{
    if (!dateString) return '-';
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(dateString);
};
const formatCurrency = (value)=>{
    if (typeof value !== 'number') return '0 ₫';
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(value);
};
}),
"[project]/features/customers/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCustomerStore",
    ()=>useCustomerStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/customers/data.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$lifecycle$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/customers/lifecycle-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$credit$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/customers/credit-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$intelligence$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/customers/intelligence-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$debt$2d$tracking$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/customers/debt-tracking-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/fuse.js/dist/fuse.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-ssr] (ecmascript)");
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
const baseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createCrudStore"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["data"], 'customers', {
    businessIdField: 'id',
    persistKey: 'hrm-customers',
    getCurrentUser: __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserSystemId"]
});
// Augmented methods
const augmentedMethods = {
    searchCustomers: async (query, page, limit = 20)=>{
        return new Promise((resolve)=>{
            setTimeout(()=>{
                const allCustomers = baseStore.getState().data;
                // Create fresh Fuse instance with current data (avoid stale data)
                const fuse = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"](allCustomers, {
                    keys: [
                        'name',
                        'id',
                        'phone'
                    ],
                    threshold: 0.3
                });
                const results = query ? fuse.search(query).map((r)=>r.item) : allCustomers;
                const start = (page - 1) * limit;
                const end = start + limit;
                const paginatedItems = results.slice(start, end);
                resolve({
                    items: paginatedItems.map((c)=>({
                            value: c.systemId,
                            label: c.name
                        })),
                    hasNextPage: end < results.length
                });
            }, 300);
        });
    },
    updateDebt: (systemId, amountChange)=>{
        baseStore.setState((state)=>({
                data: state.data.map((customer)=>{
                    if (customer.systemId === systemId) {
                        return {
                            ...customer,
                            currentDebt: (customer.currentDebt || 0) + amountChange
                        };
                    }
                    return customer;
                })
            }));
    },
    incrementOrderStats: (systemId, orderValue)=>{
        const allCustomers = baseStore.getState().getActive();
        baseStore.setState((state)=>({
                data: state.data.map((customer)=>{
                    if (customer.systemId === systemId) {
                        const updatedCustomer = {
                            ...customer,
                            totalOrders: (customer.totalOrders || 0) + 1,
                            totalSpent: (customer.totalSpent || 0) + orderValue,
                            lastPurchaseDate: new Date().toISOString().split('T')[0]
                        };
                        // Auto-update intelligence after order stats change
                        const rfmScores = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$intelligence$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateRFMScores"])(updatedCustomer, allCustomers);
                        const segment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$intelligence$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCustomerSegment"])(rfmScores);
                        const healthScore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$intelligence$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateHealthScore"])(updatedCustomer);
                        const churnRisk = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$intelligence$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateChurnRisk"])(updatedCustomer).risk;
                        const lifecycleStage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$lifecycle$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateLifecycleStage"])(updatedCustomer);
                        return {
                            ...updatedCustomer,
                            rfmScores,
                            segment,
                            healthScore,
                            churnRisk,
                            lifecycleStage
                        };
                    }
                    return customer;
                })
            }));
    },
    decrementOrderStats: (systemId, orderValue)=>{
        const allCustomers = baseStore.getState().getActive();
        baseStore.setState((state)=>({
                data: state.data.map((customer)=>{
                    if (customer.systemId === systemId) {
                        const updatedCustomer = {
                            ...customer,
                            totalOrders: Math.max(0, (customer.totalOrders || 0) - 1),
                            totalSpent: Math.max(0, (customer.totalSpent || 0) - orderValue)
                        };
                        // Auto-update intelligence after order stats change
                        const rfmScores = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$intelligence$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateRFMScores"])(updatedCustomer, allCustomers);
                        const segment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$intelligence$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCustomerSegment"])(rfmScores);
                        const healthScore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$intelligence$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateHealthScore"])(updatedCustomer);
                        const churnRisk = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$intelligence$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateChurnRisk"])(updatedCustomer).risk;
                        const lifecycleStage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$lifecycle$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateLifecycleStage"])(updatedCustomer);
                        return {
                            ...updatedCustomer,
                            rfmScores,
                            segment,
                            healthScore,
                            churnRisk,
                            lifecycleStage
                        };
                    }
                    return customer;
                })
            }));
    },
    incrementReturnStats: (systemId, quantity)=>{
        baseStore.setState((state)=>({
                data: state.data.map((customer)=>{
                    if (customer.systemId === systemId) {
                        return {
                            ...customer,
                            totalQuantityReturned: (customer.totalQuantityReturned || 0) + quantity
                        };
                    }
                    return customer;
                })
            }));
    },
    incrementFailedDeliveryStats: (systemId)=>{
        baseStore.setState((state)=>({
                data: state.data.map((customer)=>{
                    if (customer.systemId === systemId) {
                        return {
                            ...customer,
                            failedDeliveries: (customer.failedDeliveries || 0) + 1
                        };
                    }
                    return customer;
                })
            }));
    },
    addDebtTransaction: (systemId, transaction)=>{
        baseStore.setState((state)=>({
                data: state.data.map((customer)=>{
                    if (customer.systemId === systemId) {
                        const currentTransactions = customer.debtTransactions || [];
                        // Avoid duplicates
                        if (currentTransactions.some((t)=>t.orderId === transaction.orderId)) {
                            return customer;
                        }
                        const outstandingAmount = Math.max(transaction.remainingAmount ?? transaction.amount ?? 0, 0);
                        return {
                            ...customer,
                            currentDebt: Math.max(0, (customer.currentDebt || 0) + outstandingAmount),
                            debtTransactions: [
                                ...currentTransactions,
                                transaction
                            ]
                        };
                    }
                    return customer;
                })
            }));
    },
    updateDebtTransactionPayment: (systemId, orderId, amountPaid)=>{
        baseStore.setState((state)=>({
                data: state.data.map((customer)=>{
                    if (customer.systemId === systemId && customer.debtTransactions) {
                        let debtDelta = 0;
                        const updatedTransactions = customer.debtTransactions.map((t)=>{
                            if (t.orderId !== orderId) {
                                return t;
                            }
                            const currentPaid = t.paidAmount || 0;
                            const currentRemaining = t.remainingAmount ?? Math.max(t.amount - currentPaid, 0);
                            let appliedAmount = amountPaid;
                            if (appliedAmount > 0) {
                                appliedAmount = Math.min(appliedAmount, currentRemaining);
                            } else if (appliedAmount < 0) {
                                appliedAmount = Math.max(appliedAmount, -currentPaid);
                            }
                            const newPaidAmount = currentPaid + appliedAmount;
                            const recalculatedRemaining = Math.max(t.amount - newPaidAmount, 0);
                            debtDelta -= appliedAmount;
                            return {
                                ...t,
                                paidAmount: newPaidAmount,
                                remainingAmount: recalculatedRemaining,
                                isPaid: recalculatedRemaining <= 0,
                                paidDate: recalculatedRemaining <= 0 ? new Date().toISOString().split('T')[0] : t.paidDate
                            };
                        });
                        return {
                            ...customer,
                            currentDebt: Math.max(0, (customer.currentDebt || 0) + debtDelta),
                            debtTransactions: updatedTransactions
                        };
                    }
                    return customer;
                })
            }));
    },
    removeDebtTransaction: (systemId, orderId)=>{
        baseStore.setState((state)=>({
                data: state.data.map((customer)=>{
                    if (customer.systemId === systemId && customer.debtTransactions) {
                        const transaction = customer.debtTransactions.find((t)=>t.orderId === orderId);
                        const outstanding = transaction ? Math.max(transaction.remainingAmount ?? transaction.amount - (transaction.paidAmount || 0), 0) : 0;
                        return {
                            ...customer,
                            currentDebt: Math.max(0, (customer.currentDebt || 0) - outstanding),
                            debtTransactions: customer.debtTransactions.filter((t)=>t.orderId !== orderId)
                        };
                    }
                    return customer;
                })
            }));
    },
    // Add debt reminder (3.3)
    addDebtReminder: (systemId, reminder)=>{
        baseStore.setState((state)=>({
                data: state.data.map((customer)=>{
                    if (customer.systemId === systemId) {
                        const currentReminders = customer.debtReminders || [];
                        return {
                            ...customer,
                            debtReminders: [
                                ...currentReminders,
                                reminder
                            ]
                        };
                    }
                    return customer;
                })
            }));
    },
    // Update debt reminder (3.3)
    updateDebtReminder: (systemId, reminderId, updates)=>{
        baseStore.setState((state)=>({
                data: state.data.map((customer)=>{
                    if (customer.systemId === systemId && customer.debtReminders) {
                        return {
                            ...customer,
                            debtReminders: customer.debtReminders.map((r)=>r.systemId === reminderId ? {
                                    ...r,
                                    ...updates
                                } : r)
                        };
                    }
                    return customer;
                })
            }));
    },
    // Remove debt reminder (3.3)
    removeDebtReminder: (systemId, reminderId)=>{
        baseStore.setState((state)=>({
                data: state.data.map((customer)=>{
                    if (customer.systemId === systemId && customer.debtReminders) {
                        return {
                            ...customer,
                            debtReminders: customer.debtReminders.filter((r)=>r.systemId !== reminderId)
                        };
                    }
                    return customer;
                })
            }));
    },
    // Override add to auto-calculate lifecycle stage and log activity
    add: (customer)=>{
        const userInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserInfo"])();
        const customerWithLifecycle = {
            ...customer,
            lifecycleStage: (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$lifecycle$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateLifecycleStage"])(customer)
        };
        const newCustomer = baseStore.getState().add(customerWithLifecycle);
        // Add activity history entry
        const historyEntry = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createCreatedEntry"])(userInfo, `${userInfo.name} đã tạo khách hàng ${newCustomer.name} (${newCustomer.id})`);
        baseStore.getState().update(newCustomer.systemId, {
            ...newCustomer,
            activityHistory: [
                historyEntry
            ]
        });
        return newCustomer;
    },
    // Override update to auto-calculate lifecycle stage and log activity
    update: (systemId, updatedCustomer)=>{
        console.log('[CustomerStore] update called:', {
            systemId,
            updatedCustomer
        });
        const userInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserInfo"])();
        const existingCustomer = baseStore.getState().data.find((c)=>c.systemId === systemId);
        const historyEntries = [];
        if (existingCustomer) {
            // Track status changes
            if (existingCustomer.status !== updatedCustomer.status) {
                historyEntries.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createStatusChangedEntry"])(userInfo, existingCustomer.status, updatedCustomer.status, `${userInfo.name} đã đổi trạng thái từ "${existingCustomer.status}" sang "${updatedCustomer.status}"`));
            }
            // Track field changes
            const fieldsToTrack = [
                {
                    key: 'name',
                    label: 'Tên khách hàng'
                },
                {
                    key: 'email',
                    label: 'Email'
                },
                {
                    key: 'phone',
                    label: 'Số điện thoại'
                },
                {
                    key: 'company',
                    label: 'Công ty'
                },
                {
                    key: 'taxCode',
                    label: 'Mã số thuế'
                },
                {
                    key: 'representative',
                    label: 'Người đại diện'
                },
                {
                    key: 'type',
                    label: 'Loại khách hàng'
                },
                {
                    key: 'customerGroup',
                    label: 'Nhóm khách hàng'
                },
                {
                    key: 'lifecycleStage',
                    label: 'Giai đoạn vòng đời'
                },
                {
                    key: 'maxDebt',
                    label: 'Hạn mức công nợ'
                },
                {
                    key: 'paymentTerms',
                    label: 'Điều khoản thanh toán'
                },
                {
                    key: 'creditRating',
                    label: 'Xếp hạng tín dụng'
                },
                {
                    key: 'pricingLevel',
                    label: 'Mức giá'
                },
                {
                    key: 'defaultDiscount',
                    label: 'Chiết khấu mặc định'
                },
                {
                    key: 'accountManagerId',
                    label: 'Nhân viên phụ trách'
                }
            ];
            const changes = [];
            for (const field of fieldsToTrack){
                const oldVal = existingCustomer[field.key];
                const newVal = updatedCustomer[field.key];
                if (oldVal !== newVal && !(oldVal === undefined && newVal === undefined)) {
                    // Skip if it's the status field (already tracked above)
                    if (field.key === 'status') continue;
                    const oldDisplay = oldVal !== undefined && oldVal !== null && oldVal !== '' ? String(oldVal) : '(trống)';
                    const newDisplay = newVal !== undefined && newVal !== null && newVal !== '' ? String(newVal) : '(trống)';
                    changes.push(`${field.label}: ${oldDisplay} → ${newDisplay}`);
                }
            }
            if (changes.length > 0) {
                historyEntries.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createUpdatedEntry"])(userInfo, `${userInfo.name} đã cập nhật: ${changes.join(', ')}`));
            }
        }
        const customerWithLifecycle = {
            ...updatedCustomer,
            lifecycleStage: (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$lifecycle$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateLifecycleStage"])(updatedCustomer),
            activityHistory: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["appendHistoryEntry"])(existingCustomer?.activityHistory, ...historyEntries)
        };
        console.log('[CustomerStore] Calling baseStore.update with:', customerWithLifecycle);
        // Call the update function from baseStore directly
        baseStore.getState().update(systemId, customerWithLifecycle);
        console.log('[CustomerStore] State after update:', baseStore.getState().data.find((c)=>c.systemId === systemId));
    },
    // Get customers with high debt risk
    getHighRiskDebtCustomers: ()=>{
        const activeCustomers = baseStore.getState().getActive();
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$credit$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getHighRiskDebtCustomers"])(activeCustomers);
    },
    // Batch update customer intelligence (RFM, health score, churn risk)
    updateCustomerIntelligence: ()=>{
        const allCustomers = baseStore.getState().getActive();
        baseStore.setState((state)=>({
                data: state.data.map((customer)=>{
                    if (customer.isDeleted) return customer;
                    // Calculate RFM
                    const rfmScores = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$intelligence$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateRFMScores"])(customer, allCustomers);
                    const segment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$intelligence$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCustomerSegment"])(rfmScores);
                    // Calculate health score
                    const healthScore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$intelligence$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateHealthScore"])(customer);
                    // Calculate churn risk
                    const churnRisk = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$intelligence$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateChurnRisk"])(customer).risk;
                    // Calculate lifecycle stage
                    const lifecycleStage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$lifecycle$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateLifecycleStage"])(customer);
                    return {
                        ...customer,
                        rfmScores,
                        segment,
                        healthScore,
                        churnRisk,
                        lifecycleStage
                    };
                })
            }));
    },
    // Get customers by segment
    getCustomersBySegment: (segment)=>{
        return baseStore.getState().getActive().filter((c)=>c.segment === segment);
    },
    // Get customers with overdue debt
    getOverdueDebtCustomers: ()=>{
        const activeCustomers = baseStore.getState().getActive();
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$debt$2d$tracking$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getOverdueDebtCustomers"])(activeCustomers);
    },
    // Get customers with debt due soon
    getDueSoonCustomers: ()=>{
        const activeCustomers = baseStore.getState().getActive();
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$debt$2d$tracking$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDueSoonCustomers"])(activeCustomers);
    },
    removeMany: (systemIds)=>{
        if (!systemIds.length) return;
        const deletedAtTimestamp = new Date().toISOString();
        baseStore.setState((state)=>({
                data: state.data.map((customer)=>systemIds.includes(customer.systemId) ? {
                        ...customer,
                        isDeleted: true,
                        deletedAt: deletedAtTimestamp
                    } : customer)
            }));
    },
    updateManyStatus: (systemIds, status)=>{
        if (!systemIds.length) return;
        baseStore.setState((state)=>({
                data: state.data.map((customer)=>systemIds.includes(customer.systemId) ? {
                        ...customer,
                        status
                    } : customer)
            }));
    },
    restoreMany: (systemIds)=>{
        if (!systemIds.length) return;
        baseStore.setState((state)=>({
                data: state.data.map((customer)=>systemIds.includes(customer.systemId) ? {
                        ...customer,
                        isDeleted: false,
                        deletedAt: null
                    } : customer)
            }));
    }
};
let cachedBaseState = null;
let cachedCombinedState = null;
const getCombinedState = (state)=>{
    if (cachedBaseState !== state || !cachedCombinedState) {
        cachedBaseState = state;
        cachedCombinedState = {
            ...state,
            ...augmentedMethods
        };
    }
    return cachedCombinedState;
};
const boundStore = baseStore;
const useCustomerStore = (selector, equalityFn)=>{
    if (selector) {
        if (equalityFn) {
            return boundStore((state)=>selector(getCombinedState(state)), equalityFn);
        }
        return boundStore((state)=>selector(getCombinedState(state)));
    }
    return boundStore((state)=>getCombinedState(state));
};
useCustomerStore.getState = ()=>{
    return getCombinedState(baseStore.getState());
};
}),
"[project]/features/settings/branches/data.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "data",
    ()=>data
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/seed-audit.ts [app-ssr] (ecmascript)");
;
;
const data = [
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('CN000001'),
        name: 'Trụ sở chính',
        address: '123 Đường ABC, Quận 1, TP.HCM',
        phone: '02833334444',
        managerId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000001'),
        isDefault: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-01T08:00:00Z'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('CN000002'),
        name: 'Chi nhánh Hà Nội',
        address: '456 Đường XYZ, Quận Hai Bà Trưng, Hà Nội',
        phone: '02488889999',
        managerId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000002'),
        isDefault: false,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-02T08:00:00Z'
        })
    }
];
}),
"[project]/features/settings/branches/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useBranchStore",
    ()=>useBranchStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/branches/data.ts [app-ssr] (ecmascript)");
;
;
const baseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createCrudStore"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["data"], 'branches');
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
"[project]/features/employees/data.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "data",
    ()=>data
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
;
/**
 * Helper functions to create EmployeeAddress
 * - 2-cấp: Tỉnh/TP → Phường/Xã (bỏ Quận/Huyện)
 * - 3-cấp: Tỉnh/TP → Quận/Huyện → Phường/Xã (đầy đủ)
 */ const createAddress2Level = (street, ward, province, provinceId = '79', wardId = '')=>({
        street,
        province,
        provinceId,
        district: '',
        districtId: 0,
        ward,
        wardId,
        inputLevel: '2-level'
    });
const createAddress3Level = (street, district, ward, province, provinceId = '79', districtId = 0, wardId = '')=>({
        street,
        province,
        provinceId,
        district,
        districtId,
        ward,
        wardId,
        inputLevel: '3-level'
    });
const SEED_AUTHOR = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000001');
const buildAuditFields = (createdAt, createdBy = SEED_AUTHOR)=>({
        createdAt,
        updatedAt: createdAt,
        createdBy,
        updatedBy: createdBy
    });
const data = [
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000001')),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('1'),
        fullName: 'Nguyễn Văn A',
        workEmail: 'nva@example.com',
        personalEmail: 'nva.personal@gmail.com',
        phone: '0901234567',
        gender: 'Nam',
        dob: '1990-01-01',
        permanentAddress: createAddress2Level('123 ABC', 'Phường Bến Nghé', 'TP.HCM', '79'),
        temporaryAddress: null,
        jobTitle: 'Giám đốc',
        department: 'Kinh doanh',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        hireDate: '2020-01-01',
        baseSalary: 35000000,
        numberOfDependents: 2,
        employmentStatus: 'Đang làm việc',
        employeeType: 'Chính thức',
        leaveTaken: 0,
        paidLeaveTaken: 0,
        unpaidLeaveTaken: 0,
        annualLeaveTaken: 0,
        annualLeaveBalance: 12,
        role: 'Admin',
        password: 'admin123',
        ...buildAuditFields('2024-01-05T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000002')),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('2'),
        fullName: 'Trần Thị B',
        workEmail: 'ttb@example.com',
        personalEmail: 'ttb.personal@gmail.com',
        phone: '0912345678',
        gender: 'Nữ',
        dob: '1992-02-02',
        permanentAddress: createAddress2Level('456 XYZ', 'Phường Thảo Điền', 'TP.HCM', '79'),
        temporaryAddress: null,
        jobTitle: 'Trưởng phòng',
        department: 'Kinh doanh',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        hireDate: '2019-01-01',
        baseSalary: 25000000,
        numberOfDependents: 1,
        employmentStatus: 'Đang làm việc',
        employeeType: 'Chính thức',
        leaveTaken: 5,
        paidLeaveTaken: 4,
        unpaidLeaveTaken: 1,
        annualLeaveTaken: 4,
        annualLeaveBalance: 8,
        role: 'Manager',
        password: 'manager123',
        ...buildAuditFields('2024-02-05T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000003')),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('3'),
        fullName: 'Lê Văn C',
        workEmail: 'lvc@example.com',
        personalEmail: 'lvc.personal@gmail.com',
        phone: '0923456789',
        gender: 'Nam',
        dob: '1995-03-03',
        permanentAddress: createAddress3Level('789 DEF', 'Quận 3', 'Phường 9', 'TP.HCM', '79', 762),
        temporaryAddress: null,
        jobTitle: 'Kỹ sư',
        department: 'Kỹ thuật',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000002'),
        hireDate: '2021-01-01',
        baseSalary: 18000000,
        numberOfDependents: 0,
        employmentStatus: 'Đang làm việc',
        employeeType: 'Chính thức',
        leaveTaken: 2,
        paidLeaveTaken: 2,
        unpaidLeaveTaken: 0,
        annualLeaveTaken: 2,
        annualLeaveBalance: 10,
        role: 'Warehouse',
        password: 'warehouse123',
        ...buildAuditFields('2024-03-05T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000004')),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('4'),
        fullName: 'Võ Thị F',
        workEmail: 'vtf@example.com',
        personalEmail: 'vtf.personal@gmail.com',
        phone: '0934567890',
        gender: 'Nữ',
        dob: '1993-04-04',
        permanentAddress: createAddress2Level('321 GHI', 'Phường Tân Phú', 'TP.HCM', '79'),
        temporaryAddress: null,
        jobTitle: 'Trưởng nhóm',
        department: 'Kinh doanh',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        hireDate: '2020-06-01',
        baseSalary: 20000000,
        numberOfDependents: 1,
        employmentStatus: 'Đang làm việc',
        employeeType: 'Chính thức',
        leaveTaken: 3,
        paidLeaveTaken: 2,
        unpaidLeaveTaken: 1,
        annualLeaveTaken: 2,
        annualLeaveBalance: 9,
        role: 'Sales',
        password: 'sales123',
        ...buildAuditFields('2024-04-05T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000005'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('5'),
        fullName: 'Lê Văn Kho',
        workEmail: 'lvk@example.com',
        personalEmail: 'lvk.personal@gmail.com',
        phone: '0945678901',
        gender: 'Nam',
        dob: '1991-05-15',
        permanentAddress: createAddress3Level('45 Nguyễn Trãi', 'Quận 5', 'Phường 3', 'TP.HCM', '79', 763),
        temporaryAddress: null,
        jobTitle: 'Nhân viên kho',
        department: 'Kỹ thuật',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        hireDate: '2021-03-01',
        baseSalary: 12000000,
        numberOfDependents: 0,
        employmentStatus: 'Đang làm việc',
        employeeType: 'Chính thức',
        leaveTaken: 1,
        paidLeaveTaken: 1,
        unpaidLeaveTaken: 0,
        annualLeaveTaken: 1,
        annualLeaveBalance: 11,
        role: 'Warehouse',
        password: 'warehouse123',
        ...buildAuditFields('2024-05-05T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000006'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('6'),
        fullName: 'Phạm Văn D',
        workEmail: 'pvd@example.com',
        personalEmail: 'pvd.personal@gmail.com',
        phone: '0956789012',
        gender: 'Nam',
        dob: '1988-06-20',
        permanentAddress: createAddress2Level('78 Lê Lợi', 'Phường Bến Thành', 'TP.HCM', '79'),
        temporaryAddress: null,
        jobTitle: 'Nhân viên bán hàng',
        department: 'Kinh doanh',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000002'),
        hireDate: '2019-08-15',
        baseSalary: 15000000,
        numberOfDependents: 2,
        employmentStatus: 'Đang làm việc',
        employeeType: 'Chính thức',
        leaveTaken: 4,
        paidLeaveTaken: 3,
        unpaidLeaveTaken: 1,
        annualLeaveTaken: 3,
        annualLeaveBalance: 9,
        role: 'Sales',
        password: 'sales123',
        ...buildAuditFields('2024-06-05T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('7'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('NV000007'),
        fullName: 'Hoàng Thị E',
        workEmail: 'hte@example.com',
        personalEmail: 'hte.personal@gmail.com',
        phone: '0967890123',
        gender: 'Nữ',
        dob: '1994-07-10',
        permanentAddress: createAddress3Level('112 Hai Bà Trưng', 'Quận 1', 'Phường Đa Kao', 'TP.HCM', '79', 760),
        temporaryAddress: null,
        jobTitle: 'Kế toán',
        department: 'Nhân sự',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        hireDate: '2020-02-01',
        baseSalary: 16000000,
        numberOfDependents: 0,
        employmentStatus: 'Đang làm việc',
        employeeType: 'Chính thức',
        leaveTaken: 2,
        paidLeaveTaken: 2,
        unpaidLeaveTaken: 0,
        annualLeaveTaken: 2,
        annualLeaveBalance: 10,
        role: 'Admin',
        password: 'accountant123',
        ...buildAuditFields('2024-07-05T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000008'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('8'),
        fullName: 'Nguyễn Văn G',
        workEmail: 'nvg@example.com',
        personalEmail: 'nvg.personal@gmail.com',
        phone: '0978901234',
        gender: 'Nam',
        dob: '1996-08-25',
        permanentAddress: createAddress2Level('234 Võ Văn Tần', 'Phường 5', 'TP.HCM', '79'),
        temporaryAddress: null,
        jobTitle: 'Nhân viên IT',
        department: 'Kỹ thuật',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        hireDate: '2022-01-10',
        baseSalary: 18000000,
        numberOfDependents: 0,
        employmentStatus: 'Đang làm việc',
        employeeType: 'Chính thức',
        leaveTaken: 0,
        paidLeaveTaken: 0,
        unpaidLeaveTaken: 0,
        annualLeaveTaken: 0,
        annualLeaveBalance: 12,
        role: 'Admin',
        password: 'staff123',
        ...buildAuditFields('2024-08-05T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000009'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('9'),
        fullName: 'Trần Thị H',
        workEmail: 'tth@example.com',
        personalEmail: 'tth.personal@gmail.com',
        phone: '0989012345',
        gender: 'Nữ',
        dob: '1997-09-05',
        permanentAddress: createAddress3Level('567 Nguyễn Đình Chiểu', 'Quận 3', 'Phường 5', 'TP.HCM', '79', 762),
        temporaryAddress: null,
        jobTitle: 'Nhân viên CSKH',
        department: 'Kinh doanh',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000002'),
        hireDate: '2021-06-01',
        baseSalary: 13000000,
        numberOfDependents: 0,
        employmentStatus: 'Đang làm việc',
        employeeType: 'Chính thức',
        leaveTaken: 3,
        paidLeaveTaken: 2,
        unpaidLeaveTaken: 1,
        annualLeaveTaken: 2,
        annualLeaveBalance: 10,
        role: 'Sales',
        password: 'staff123',
        ...buildAuditFields('2024-09-05T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000010'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('10'),
        fullName: 'Đỗ Văn I',
        workEmail: 'dvi@example.com',
        personalEmail: 'dvi.personal@gmail.com',
        phone: '0990123456',
        gender: 'Nam',
        dob: '1989-10-12',
        permanentAddress: createAddress2Level('890 Cách Mạng Tháng 8', 'Phường 12', 'TP.HCM', '79'),
        temporaryAddress: null,
        jobTitle: 'Trưởng kho',
        department: 'Kỹ thuật',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        hireDate: '2018-04-01',
        baseSalary: 22000000,
        numberOfDependents: 3,
        employmentStatus: 'Đang làm việc',
        employeeType: 'Chính thức',
        leaveTaken: 6,
        paidLeaveTaken: 5,
        unpaidLeaveTaken: 1,
        annualLeaveTaken: 5,
        annualLeaveBalance: 7,
        role: 'Warehouse',
        password: 'warehouse123',
        ...buildAuditFields('2024-10-05T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000011'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('11'),
        fullName: 'Lý Thị K',
        workEmail: 'ltk@example.com',
        personalEmail: 'ltk.personal@gmail.com',
        phone: '0901234568',
        gender: 'Nữ',
        dob: '1995-11-18',
        permanentAddress: createAddress3Level('123 Trần Hưng Đạo', 'Quận 5', 'Phường 7', 'TP.HCM', '79', 763),
        temporaryAddress: null,
        jobTitle: 'Nhân viên Marketing',
        department: 'Marketing',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        hireDate: '2022-03-15',
        baseSalary: 14000000,
        numberOfDependents: 0,
        employmentStatus: 'Đang làm việc',
        employeeType: 'Chính thức',
        leaveTaken: 1,
        paidLeaveTaken: 1,
        unpaidLeaveTaken: 0,
        annualLeaveTaken: 1,
        annualLeaveBalance: 11,
        role: 'Sales',
        password: 'staff123',
        ...buildAuditFields('2024-11-05T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000012'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('12'),
        fullName: 'Bùi Văn L',
        workEmail: 'bvl@example.com',
        personalEmail: 'bvl.personal@gmail.com',
        phone: '0912345679',
        gender: 'Nam',
        dob: '1993-12-22',
        permanentAddress: createAddress2Level('456 Lý Thường Kiệt', 'Phường 14', 'TP.HCM', '79'),
        temporaryAddress: null,
        jobTitle: 'Nhân viên giao hàng',
        department: 'Kinh doanh',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000002'),
        hireDate: '2020-09-01',
        baseSalary: 11000000,
        numberOfDependents: 1,
        employmentStatus: 'Đang làm việc',
        employeeType: 'Chính thức',
        leaveTaken: 2,
        paidLeaveTaken: 2,
        unpaidLeaveTaken: 0,
        annualLeaveTaken: 2,
        annualLeaveBalance: 10,
        role: 'Warehouse',
        password: 'delivery123',
        ...buildAuditFields('2024-12-05T08:00:00Z')
    }
];
}),
"[project]/features/employees/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "employeeRepository",
    ()=>employeeRepository,
    "useEmployeeStore",
    ()=>useEmployeeStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/employees/data.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/fuse.js/dist/fuse.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$breadcrumb$2d$generator$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/breadcrumb-generator.ts [app-ssr] (ecmascript)"); // ✅ NEW
var __TURBOPACK__imported__module__$5b$project$5d2f$repositories$2f$in$2d$memory$2d$repository$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/repositories/in-memory-repository.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/activity-history-helper.ts [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
const baseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createCrudStore"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["data"], 'employees', {
    businessIdField: 'id',
    persistKey: 'hrm-employees',
    getCurrentUser: __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserSystemId"]
});
// ✅ Wrap add method to include activity history
const originalAdd = baseStore.getState().add;
const wrappedAdd = (item)=>{
    const userInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserInfo"])();
    const historyEntry = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHistoryEntry"])('created', `${userInfo.name} đã tạo hồ sơ nhân viên ${item.fullName} (${item.id})`, userInfo);
    const newEmployee = originalAdd({
        ...item,
        activityHistory: [
            historyEntry
        ]
    });
    return newEmployee;
};
// ✅ Wrap update method to include activity history
const originalUpdate = baseStore.getState().update;
const wrappedUpdate = (systemId, updates)=>{
    const currentEmployee = baseStore.getState().data.find((e)=>e.systemId === systemId);
    if (!currentEmployee) return;
    const userInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserInfo"])();
    const historyEntries = [];
    // Track important field changes
    const trackedFields = [
        {
            key: 'fullName',
            label: 'họ tên'
        },
        {
            key: 'jobTitle',
            label: 'chức danh'
        },
        {
            key: 'department',
            label: 'phòng ban'
        },
        {
            key: 'employmentStatus',
            label: 'trạng thái làm việc'
        },
        {
            key: 'employeeType',
            label: 'loại nhân viên'
        },
        {
            key: 'baseSalary',
            label: 'lương cơ bản'
        },
        {
            key: 'phone',
            label: 'số điện thoại'
        },
        {
            key: 'workEmail',
            label: 'email công việc'
        },
        {
            key: 'role',
            label: 'vai trò'
        }
    ];
    trackedFields.forEach(({ key, label })=>{
        if (updates[key] !== undefined && updates[key] !== currentEmployee[key]) {
            const oldValue = currentEmployee[key];
            const newValue = updates[key];
            // Format values for display
            let oldDisplay = oldValue;
            let newDisplay = newValue;
            if (key === 'baseSalary') {
                oldDisplay = new Intl.NumberFormat('vi-VN').format(oldValue) + 'đ';
                newDisplay = new Intl.NumberFormat('vi-VN').format(newValue) + 'đ';
            }
            historyEntries.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHistoryEntry"])('updated', `${userInfo.name} đã cập nhật ${label}: "${oldDisplay || '(trống)'}" → "${newDisplay}"`, userInfo, {
                field: key,
                oldValue,
                newValue
            }));
        }
    });
    // If status changed specifically
    if (updates.employmentStatus && updates.employmentStatus !== currentEmployee.employmentStatus) {
        historyEntries.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHistoryEntry"])('status_changed', `${userInfo.name} đã thay đổi trạng thái làm việc từ "${currentEmployee.employmentStatus}" thành "${updates.employmentStatus}"`, userInfo, {
            field: 'employmentStatus',
            oldValue: currentEmployee.employmentStatus,
            newValue: updates.employmentStatus
        }));
    }
    // If no specific changes tracked, add generic update entry
    if (historyEntries.length === 0) {
        historyEntries.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHistoryEntry"])('updated', `${userInfo.name} đã cập nhật thông tin nhân viên`, userInfo));
    }
    const updatedHistory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["appendHistoryEntry"])(currentEmployee.activityHistory, ...historyEntries);
    originalUpdate(systemId, {
        ...updates,
        activityHistory: updatedHistory
    });
};
// ✅ Override base store methods
baseStore.setState({
    add: wrappedAdd,
    update: wrappedUpdate
});
const employeeRepository = (0, __TURBOPACK__imported__module__$5b$project$5d2f$repositories$2f$in$2d$memory$2d$repository$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createInMemoryRepository"])(()=>baseStore.getState());
const persistence = {
    create: (payload)=>employeeRepository.create(payload),
    update: (systemId, payload)=>employeeRepository.update(systemId, payload),
    softDelete: (systemId)=>employeeRepository.softDelete(systemId),
    restore: (systemId)=>employeeRepository.restore(systemId),
    hardDelete: (systemId)=>employeeRepository.hardDelete(systemId)
};
// ✅ Register for breadcrumb auto-generation
(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$breadcrumb$2d$generator$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["registerBreadcrumbStore"])('employees', ()=>baseStore.getState());
// Augmented methods
const augmentedMethods = {
    // FIX: Changed `page: number = 1` to `page: number` to make it a required parameter, matching Combobox prop type.
    // ✅ CRITICAL FIX: Create fresh Fuse instance on each search to avoid stale data
    searchEmployees: async (query, page, limit = 20)=>{
        return new Promise((resolve)=>{
            setTimeout(()=>{
                const allEmployees = baseStore.getState().data;
                // ✅ Create fresh Fuse instance with current data
                const fuse = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"](allEmployees, {
                    keys: [
                        'fullName',
                        'id',
                        'phone',
                        'personalEmail',
                        'workEmail'
                    ],
                    threshold: 0.3
                });
                const results = query ? fuse.search(query).map((r)=>r.item) : allEmployees;
                const start = (page - 1) * limit;
                const end = start + limit;
                const paginatedItems = results.slice(start, end);
                resolve({
                    items: paginatedItems.map((e)=>({
                            value: e.systemId,
                            label: e.fullName
                        })),
                    hasNextPage: end < results.length
                });
            }, 300);
        });
    },
    permanentDelete: async (systemId)=>{
        await persistence.hardDelete(systemId);
    }
};
const useEmployeeStoreHook = ()=>{
    const state = baseStore();
    return {
        ...state,
        ...augmentedMethods,
        persistence
    };
};
const useEmployeeStore = useEmployeeStoreHook;
// Export getState for non-hook usage
useEmployeeStore.getState = ()=>{
    const state = baseStore.getState();
    return {
        ...state,
        ...augmentedMethods,
        persistence
    };
};
useEmployeeStore.persistence = persistence;
}),
"[project]/features/brands/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BrandsPage",
    ()=>BrandsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2f$shallow$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react/shallow.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-ssr] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$power$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Power$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/power.js [app-ssr] (ecmascript) <export default as Power>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$power$2d$off$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PowerOff$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/power-off.js [app-ssr] (ecmascript) <export default as PowerOff>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-ssr] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-ssr] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-ssr] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$text$2d$align$2d$start$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlignLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/text-align-start.js [app-ssr] (ecmascript) <export default as AlignLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-up.js [app-ssr] (ecmascript) <export default as FileUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.js [app-ssr] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/external-link.js [app-ssr] (ecmascript) <export default as ExternalLink>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$unlink$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Unlink$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/unlink.js [app-ssr] (ecmascript) <export default as Unlink>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$column$2d$visibility$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/use-column-visibility.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$page$2d$header$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/page-header-context.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$inventory$2f$brand$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/inventory/brand-store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$responsive$2d$data$2d$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/data-table/responsive-data-table.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/alert-dialog.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$column$2d$toggle$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/data-table/data-table-column-toggle.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$faceted$2d$filter$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/data-table/data-table-faceted-filter.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$page$2d$toolbar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/layout/page-toolbar.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$page$2d$filters$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/layout/page-filters.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$media$2d$query$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/use-media-query.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/fuse.js/dist/fuse.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$brands$2f$columns$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/brands/columns.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$brands$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/brands/card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$brands$2f$hooks$2f$use$2d$pkgx$2d$brand$2d$sync$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/brands/hooks/use-pkgx-brand-sync.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$hooks$2f$use$2d$pkgx$2d$bulk$2d$sync$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/hooks/use-pkgx-bulk-sync.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$components$2f$pkgx$2d$bulk$2d$sync$2d$confirm$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/components/pkgx-bulk-sync-confirm-dialog.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$brands$2f$components$2f$pkgx$2d$link$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/brands/components/pkgx-link-dialog.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$brands$2f$components$2f$pkgx$2d$brand$2d$detail$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/brands/components/pkgx-brand-detail-dialog.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$generic$2d$import$2d$dialog$2d$v2$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/shared/generic-import-dialog-v2.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$generic$2d$export$2d$dialog$2d$v2$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/shared/generic-export-dialog-v2.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$export$2f$configs$2f$brand$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/import-export/configs/brand.config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-ssr] (ecmascript)");
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
function BrandsPage() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const isMobile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$media$2d$query$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMediaQuery"])("(max-width: 768px)");
    const { employee: authEmployee } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    // ✅ Use shallow comparison to prevent unnecessary re-renders
    const { data, add, update, remove } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$inventory$2f$brand$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useBrandStore"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2f$shallow$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useShallow"])((state)=>({
            data: state.data,
            add: state.add,
            update: state.update,
            remove: state.remove
        })));
    const activeBrands = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>data.filter((b)=>!b.isDeleted), [
        data
    ]);
    // State
    const [rowSelection, setRowSelection] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]({});
    const [isAlertOpen, setIsAlertOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](false);
    const [idToDelete, setIdToDelete] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](null);
    const [isBulkDeleteAlertOpen, setIsBulkDeleteAlertOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](false);
    const [sorting, setSorting] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]({
        id: 'name',
        desc: false
    });
    const [globalFilter, setGlobalFilter] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]('');
    const [debouncedGlobalFilter, setDebouncedGlobalFilter] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]('');
    const [pagination, setPagination] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]({
        pageIndex: 0,
        pageSize: 20
    });
    const [mobileLoadedCount, setMobileLoadedCount] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](20);
    const defaultColumnVisibility = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        const cols = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$brands$2f$columns$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getColumns"])(()=>{}, ()=>{}, ()=>{});
        const initial = {};
        cols.forEach((c)=>{
            if (c.id) initial[c.id] = true;
        });
        return initial;
    }, []);
    const [columnVisibility, setColumnVisibility] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$column$2d$visibility$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useColumnVisibility"])('brands', defaultColumnVisibility);
    const [columnOrder, setColumnOrder] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]([]);
    const [pinnedColumns, setPinnedColumns] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]([
        'select',
        'logo',
        'name'
    ]);
    // Filters
    const [statusFilter, setStatusFilter] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](new Set());
    // Debounce search
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        const timer = setTimeout(()=>{
            setDebouncedGlobalFilter(globalFilter);
        }, 300);
        return ()=>clearTimeout(timer);
    }, [
        globalFilter
    ]);
    // Handlers
    const handleDelete = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((systemId)=>{
        setIdToDelete(systemId);
        setIsAlertOpen(true);
    }, []);
    const handleToggleActive = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((systemId, isActive)=>{
        update((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(systemId), {
            isActive
        });
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success(isActive ? 'Đã kích hoạt thương hiệu' : 'Đã tắt thương hiệu');
    }, [
        update
    ]);
    // Inline edit handlers
    const handleUpdateName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((systemId, name)=>{
        update((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(systemId), {
            name
        });
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success('Đã cập nhật tên thương hiệu');
    }, [
        update
    ]);
    // Bulk actions
    const handleBulkActivate = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](()=>{
        const ids = Object.keys(rowSelection);
        ids.forEach((id)=>update((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(id), {
                isActive: true
            }));
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success(`Đã kích hoạt ${ids.length} thương hiệu`);
        setRowSelection({});
    }, [
        rowSelection,
        update
    ]);
    const handleBulkDeactivate = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](()=>{
        const ids = Object.keys(rowSelection);
        ids.forEach((id)=>update((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(id), {
                isActive: false
            }));
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success(`Đã tắt ${ids.length} thương hiệu`);
        setRowSelection({});
    }, [
        rowSelection,
        update
    ]);
    const handleRowClick = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((brand)=>{
        router.push(`/brands/${brand.systemId}`);
    }, [
        router
    ]);
    // PKGX Sync Hook
    const { handleSyncBasicInfo: _handleSyncBasicInfo, handleSyncSeo: _handleSyncSeo, handleSyncDescription: _handleSyncDescription, handleSyncAll: _handleSyncAll, hasPkgxMapping, getPkgxBrandId } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$brands$2f$hooks$2f$use$2d$pkgx$2d$brand$2d$sync$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePkgxBrandSync"])();
    const _pkgxSettings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePkgxSettingsStore"])((s)=>s.settings);
    const deleteBrandMapping = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePkgxSettingsStore"])((s)=>s.deleteBrandMapping);
    const getBrandMappingByHrmId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePkgxSettingsStore"])((s)=>s.getBrandMappingByHrmId);
    // Bulk sync hook for PKGX brands
    const { confirmAction: bulkConfirmAction, progress: bulkProgress, triggerBulkSync, executeAction: executeBulkAction, cancelConfirm: cancelBulkConfirm, getPkgxBrandId: _hookGetPkgxBrandId } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$hooks$2f$use$2d$pkgx$2d$bulk$2d$sync$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePkgxBulkSync"])({
        entityType: 'brand'
    });
    // PKGX Link Dialog state
    const [pkgxLinkDialogOpen, setPkgxLinkDialogOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](false);
    const [brandToLink, setBrandToLink] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](null);
    // PKGX Detail Dialog state
    const [pkgxDetailDialogOpen, setPkgxDetailDialogOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](false);
    const [brandToViewDetail, setBrandToViewDetail] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](null);
    const [pkgxBrandIdToView, setPkgxBrandIdToView] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](null);
    // Import/Export Dialog states
    const [isImportOpen, setIsImportOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](false);
    const [isExportOpen, setIsExportOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](false);
    // PKGX Link handlers
    const handlePkgxLink = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((brand)=>{
        setBrandToLink(brand);
        setPkgxLinkDialogOpen(true);
    }, []);
    const handlePkgxUnlink = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((brand)=>{
        const mapping = getBrandMappingByHrmId(brand.systemId);
        if (mapping) {
            deleteBrandMapping(mapping.id);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success(`Đã hủy liên kết thương hiệu "${brand.name}" với PKGX`);
        }
    }, [
        getBrandMappingByHrmId,
        deleteBrandMapping
    ]);
    const handlePkgxLinkSuccess = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](()=>{
    // Refresh handled by store update
    }, []);
    // PKGX View Detail handler
    const handlePkgxViewDetail = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((brand, pkgxBrandId)=>{
        setBrandToViewDetail(brand);
        setPkgxBrandIdToView(pkgxBrandId);
        setPkgxDetailDialogOpen(true);
    }, []);
    const columns = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$brands$2f$columns$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getColumns"])(handleDelete, handleToggleActive, router.push, handleUpdateName, // PKGX handlers - used by PkgxBrandActionsCell
        hasPkgxMapping, getPkgxBrandId, handlePkgxLink, handlePkgxUnlink, handlePkgxViewDetail), [
        handleDelete,
        handleToggleActive,
        router,
        handleUpdateName,
        hasPkgxMapping,
        getPkgxBrandId,
        handlePkgxLink,
        handlePkgxUnlink,
        handlePkgxViewDetail
    ]);
    // Bulk actions config
    const bulkActions = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>[
            {
                label: 'Kích hoạt',
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$power$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Power$3e$__["Power"],
                onSelect: handleBulkActivate
            },
            {
                label: 'Tắt hoạt động',
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$power$2d$off$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PowerOff$3e$__["PowerOff"],
                onSelect: handleBulkDeactivate
            },
            {
                label: 'Xóa',
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"],
                onSelect: ()=>setIsBulkDeleteAlertOpen(true)
            }
        ], [
        handleBulkActivate,
        handleBulkDeactivate
    ]);
    // ═══════════════════════════════════════════════════════════════
    // PKGX Bulk Actions - Using shared usePkgxBulkSync hook
    // ═══════════════════════════════════════════════════════════════
    const pkgxBulkActions = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>[
            {
                label: "Đồng bộ tất cả",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"],
                onSelect: (selectedRows)=>{
                    triggerBulkSync(selectedRows, 'sync_all');
                }
            },
            {
                label: "SEO",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"],
                onSelect: (selectedRows)=>{
                    triggerBulkSync(selectedRows, 'sync_seo');
                }
            },
            {
                label: "Mô tả",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$text$2d$align$2d$start$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlignLeft$3e$__["AlignLeft"],
                onSelect: (selectedRows)=>{
                    triggerBulkSync(selectedRows, 'sync_description');
                }
            },
            {
                label: "Xem trên PKGX",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"],
                onSelect: (selectedRows)=>{
                    const linkedBrands = selectedRows.filter((b)=>hasPkgxMapping(b));
                    if (linkedBrands.length === 0) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Không có thương hiệu nào đã liên kết PKGX');
                        return;
                    }
                    const firstBrand = linkedBrands[0];
                    const pkgxId = getPkgxBrandId(firstBrand);
                    if (pkgxId) {
                        window.open(`https://phukiengiaxuong.com.vn/admin/brand.php?act=edit&id=${pkgxId}`, '_blank');
                    }
                }
            },
            {
                label: "Hủy liên kết",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$unlink$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Unlink$3e$__["Unlink"],
                variant: "destructive",
                onSelect: (selectedRows)=>{
                    const linkedBrands = selectedRows.filter((b)=>hasPkgxMapping(b));
                    if (linkedBrands.length === 0) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Không có thương hiệu nào đã liên kết PKGX');
                        return;
                    }
                    if (!confirm(`Bạn có chắc muốn hủy liên kết ${linkedBrands.length} thương hiệu với PKGX?`)) {
                        return;
                    }
                    let count = 0;
                    for (const brand of linkedBrands){
                        const mapping = getBrandMappingByHrmId(brand.systemId);
                        if (mapping) {
                            deleteBrandMapping(mapping.id);
                            count++;
                        }
                    }
                    setRowSelection({});
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success(`Đã hủy liên kết ${count} thương hiệu`);
                }
            }
        ], [
        triggerBulkSync,
        hasPkgxMapping,
        getPkgxBrandId,
        getBrandMappingByHrmId,
        deleteBrandMapping
    ]);
    // Import handler
    const handleImport = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](async (data, mode, _branchId)=>{
        const _currentEmployeeSystemId = authEmployee?.systemId ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SYSTEM');
        const results = {
            success: 0,
            failed: 0,
            inserted: 0,
            updated: 0,
            skipped: 0,
            errors: []
        };
        try {
            for(let i = 0; i < data.length; i++){
                const item = data[i];
                try {
                    // Check if brand exists (by id)
                    const existingBrand = activeBrands.find((b)=>item.id && b.id === item.id);
                    if (existingBrand) {
                        // Brand exists
                        if (mode === 'insert-only') {
                            // Skip in insert-only mode
                            results.skipped++;
                            continue;
                        }
                        // Update existing brand
                        const updatedFields = {
                            ...item,
                            updatedAt: new Date().toISOString()
                        };
                        // Remove fields that shouldn't be overwritten
                        delete updatedFields.systemId;
                        delete updatedFields.createdAt;
                        update(existingBrand.systemId, updatedFields);
                        results.updated++;
                        results.success++;
                    } else {
                        // Brand does not exist
                        if (mode === 'update-only') {
                            // Skip in update-only mode
                            results.skipped++;
                            continue;
                        }
                        // Insert new brand
                        const newBrand = {
                            ...item,
                            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(item.id || `BRAND-${Date.now()}`),
                            name: item.name || '',
                            isActive: item.isActive !== false,
                            isDeleted: false,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString()
                        };
                        add(newBrand);
                        results.inserted++;
                        results.success++;
                    }
                } catch (err) {
                    results.failed++;
                    results.errors.push({
                        row: i + 1,
                        message: err instanceof Error ? err.message : 'Lỗi không xác định'
                    });
                }
            }
            return results;
        } catch (error) {
            console.error('[Brands Importer] Lỗi nhập thương hiệu', error);
            throw error;
        }
    }, [
        activeBrands,
        add,
        update,
        authEmployee?.systemId
    ]);
    // Export config
    const _exportConfig = {
        fileName: 'Thuong_hieu',
        columns
    };
    // Set default column visibility - only on mount
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        // Skip if visibility is already set
        if (Object.keys(columnVisibility).length > 0) return;
        const defaultVisibleColumns = [
            'logo',
            'name',
            'id',
            'productCount',
            'website',
            'seoPkgx',
            'seoTrendtech',
            'pkgxStatus',
            'pkgx',
            'isActive',
            'createdAt'
        ];
        const columnIds = [
            'select',
            'logo',
            'name',
            'id',
            'productCount',
            'website',
            'seoPkgx',
            'seoTrendtech',
            'pkgxStatus',
            'pkgx',
            'isActive',
            'createdAt',
            'updatedAt',
            'actions'
        ];
        const initialVisibility = {};
        columnIds.forEach((id)=>{
            if (id === 'select' || id === 'actions') {
                initialVisibility[id] = true;
            } else {
                initialVisibility[id] = defaultVisibleColumns.includes(id);
            }
        });
        setColumnVisibility(initialVisibility);
        setColumnOrder(columnIds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        columnVisibility
    ]);
    const fuse = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"](activeBrands, {
            keys: [
                "id",
                "name",
                "description",
                "website"
            ],
            threshold: 0.3,
            ignoreLocation: true
        }), [
        activeBrands
    ]);
    const confirmDelete = ()=>{
        if (idToDelete) {
            remove((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(idToDelete));
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success("Đã xóa thương hiệu");
        }
        setIsAlertOpen(false);
        setIdToDelete(null);
    };
    const confirmBulkDelete = ()=>{
        const idsToDelete = Object.keys(rowSelection);
        idsToDelete.forEach((id)=>remove((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(id)));
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success(`Đã xóa ${idsToDelete.length} thương hiệu`);
        setRowSelection({});
        setIsBulkDeleteAlertOpen(false);
    };
    // Filter options
    const statusOptions = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>[
            {
                value: 'active',
                label: 'Hoạt động'
            },
            {
                value: 'inactive',
                label: 'Tạm tắt'
            }
        ], []);
    // Apply all filters
    const filteredData = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        let result = activeBrands;
        // Status filter
        if (statusFilter.size > 0) {
            result = result.filter((b)=>{
                const status = b.isActive !== false ? 'active' : 'inactive';
                return statusFilter.has(status);
            });
        }
        // Text search (debounced)
        if (debouncedGlobalFilter) {
            const searchResults = fuse.search(debouncedGlobalFilter);
            const searchIds = new Set(searchResults.map((r)=>r.item.systemId));
            result = result.filter((b)=>searchIds.has(b.systemId));
        }
        return result;
    }, [
        activeBrands,
        statusFilter,
        debouncedGlobalFilter,
        fuse
    ]);
    const sortedData = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        const sorted = [
            ...filteredData
        ];
        if (sorting.id) {
            sorted.sort((a, b)=>{
                const aValue = a[sorting.id];
                const bValue = b[sorting.id];
                if (sorting.id === 'createdAt') {
                    const aTime = aValue ? new Date(aValue).getTime() : 0;
                    const bTime = bValue ? new Date(bValue).getTime() : 0;
                    return sorting.desc ? bTime - aTime : aTime - bTime;
                }
                const aStr = String(aValue ?? '');
                const bStr = String(bValue ?? '');
                if (aStr < bStr) return sorting.desc ? 1 : -1;
                if (aStr > bStr) return sorting.desc ? -1 : 1;
                return 0;
            });
        }
        return sorted;
    }, [
        filteredData,
        sorting
    ]);
    const allSelectedRows = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>activeBrands.filter((b)=>rowSelection[b.systemId]), [
        activeBrands,
        rowSelection
    ]);
    // Mobile infinite scroll
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        if (!isMobile) return;
        const handleScroll = ()=>{
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight;
            const clientHeight = window.innerHeight;
            const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
            if (scrollPercentage > 0.8 && mobileLoadedCount < sortedData.length) {
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
    // Reset mobile loaded count when filters change
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        setMobileLoadedCount(20);
    }, [
        debouncedGlobalFilter,
        statusFilter
    ]);
    const pageCount = Math.ceil(sortedData.length / pagination.pageSize);
    const paginatedData = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>sortedData.slice(pagination.pageIndex * pagination.pageSize, (pagination.pageIndex + 1) * pagination.pageSize), [
        sortedData,
        pagination
    ]);
    // Header actions
    const headerActions = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>[
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                size: "sm",
                className: "h-9",
                onClick: ()=>router.push('/brands/new'),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                        className: "mr-2 h-4 w-4"
                    }, void 0, false, {
                        fileName: "[project]/features/brands/page.tsx",
                        lineNumber: 493,
                        columnNumber: 7
                    }, this),
                    "Thêm thương hiệu"
                ]
            }, "add", true, {
                fileName: "[project]/features/brands/page.tsx",
                lineNumber: 492,
                columnNumber: 5
            }, this)
        ], [
        router
    ]);
    // Dùng auto-generated title từ PATH_PATTERNS
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$page$2d$header$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePageHeader"])({
        actions: headerActions,
        showBackButton: false
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-4 h-full flex flex-col",
        children: [
            !isMobile && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$page$2d$toolbar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PageToolbar"], {
                leftActions: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "outline",
                            size: "sm",
                            onClick: ()=>setIsImportOpen(true),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileUp$3e$__["FileUp"], {
                                    className: "mr-2 h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/features/brands/page.tsx",
                                    lineNumber: 512,
                                    columnNumber: 17
                                }, void 0),
                                "Nhập file"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/brands/page.tsx",
                            lineNumber: 511,
                            columnNumber: 15
                        }, void 0),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "outline",
                            size: "sm",
                            onClick: ()=>setIsExportOpen(true),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                    className: "mr-2 h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/features/brands/page.tsx",
                                    lineNumber: 516,
                                    columnNumber: 17
                                }, void 0),
                                "Xuất Excel"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/brands/page.tsx",
                            lineNumber: 515,
                            columnNumber: 15
                        }, void 0)
                    ]
                }, void 0, true),
                rightActions: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$column$2d$toggle$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DataTableColumnCustomizer"], {
                        columns: columns,
                        columnVisibility: columnVisibility,
                        setColumnVisibility: setColumnVisibility,
                        columnOrder: columnOrder,
                        setColumnOrder: setColumnOrder,
                        pinnedColumns: pinnedColumns,
                        setPinnedColumns: setPinnedColumns
                    }, "customizer", false, {
                        fileName: "[project]/features/brands/page.tsx",
                        lineNumber: 522,
                        columnNumber: 13
                    }, void 0)
                ]
            }, void 0, false, {
                fileName: "[project]/features/brands/page.tsx",
                lineNumber: 508,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$page$2d$filters$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PageFilters"], {
                searchValue: globalFilter,
                onSearchChange: setGlobalFilter,
                searchPlaceholder: "Tìm theo mã, tên thương hiệu...",
                rightFilters: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$faceted$2d$filter$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DataTableFacetedFilter"], {
                    title: "Trạng thái",
                    options: statusOptions,
                    selectedValues: statusFilter,
                    onSelectedValuesChange: setStatusFilter
                }, void 0, false, {
                    fileName: "[project]/features/brands/page.tsx",
                    lineNumber: 542,
                    columnNumber: 11
                }, void 0)
            }, void 0, false, {
                fileName: "[project]/features/brands/page.tsx",
                lineNumber: 537,
                columnNumber: 7
            }, this),
            isMobile ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-2 flex-1 overflow-y-auto",
                children: sortedData.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                        className: "p-8 text-center text-muted-foreground",
                        children: "Không tìm thấy thương hiệu nào"
                    }, void 0, false, {
                        fileName: "[project]/features/brands/page.tsx",
                        lineNumber: 556,
                        columnNumber: 15
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/features/brands/page.tsx",
                    lineNumber: 555,
                    columnNumber: 13
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        sortedData.slice(0, mobileLoadedCount).map((brand)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$brands$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MobileBrandCard"], {
                                brand: brand,
                                onDelete: handleDelete,
                                onToggleActive: handleToggleActive,
                                navigate: router.push,
                                handleRowClick: handleRowClick
                            }, brand.systemId, false, {
                                fileName: "[project]/features/brands/page.tsx",
                                lineNumber: 563,
                                columnNumber: 17
                            }, this)),
                        mobileLoadedCount < sortedData.length && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                                className: "p-4 text-center text-muted-foreground",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "animate-spin rounded-full h-4 w-4 border-b-2 border-primary"
                                        }, void 0, false, {
                                            fileName: "[project]/features/brands/page.tsx",
                                            lineNumber: 576,
                                            columnNumber: 23
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Đang tải thêm..."
                                        }, void 0, false, {
                                            fileName: "[project]/features/brands/page.tsx",
                                            lineNumber: 577,
                                            columnNumber: 23
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/brands/page.tsx",
                                    lineNumber: 575,
                                    columnNumber: 21
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/features/brands/page.tsx",
                                lineNumber: 574,
                                columnNumber: 19
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/features/brands/page.tsx",
                            lineNumber: 573,
                            columnNumber: 17
                        }, this),
                        mobileLoadedCount >= sortedData.length && sortedData.length > 20 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                                className: "p-4 text-center text-muted-foreground text-sm",
                                children: [
                                    "Đã hiển thị tất cả ",
                                    sortedData.length,
                                    " thương hiệu"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/brands/page.tsx",
                                lineNumber: 584,
                                columnNumber: 19
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/features/brands/page.tsx",
                            lineNumber: 583,
                            columnNumber: 17
                        }, this)
                    ]
                }, void 0, true)
            }, void 0, false, {
                fileName: "[project]/features/brands/page.tsx",
                lineNumber: 553,
                columnNumber: 9
            }, this) : /* Desktop View - Table */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full py-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$responsive$2d$data$2d$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ResponsiveDataTable"], {
                    columns: columns,
                    data: paginatedData,
                    pageCount: pageCount,
                    pagination: pagination,
                    setPagination: setPagination,
                    rowCount: sortedData.length,
                    rowSelection: rowSelection,
                    setRowSelection: setRowSelection,
                    onBulkDelete: ()=>setIsBulkDeleteAlertOpen(true),
                    sorting: sorting,
                    setSorting: setSorting,
                    allSelectedRows: allSelectedRows,
                    bulkActions: bulkActions,
                    pkgxBulkActions: pkgxBulkActions,
                    expanded: {},
                    setExpanded: ()=>{},
                    columnVisibility: columnVisibility,
                    setColumnVisibility: setColumnVisibility,
                    columnOrder: columnOrder,
                    setColumnOrder: setColumnOrder,
                    pinnedColumns: pinnedColumns,
                    setPinnedColumns: setPinnedColumns,
                    onRowClick: handleRowClick,
                    renderMobileCard: (brand)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$brands$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MobileBrandCard"], {
                            brand: brand,
                            onDelete: handleDelete,
                            onToggleActive: handleToggleActive,
                            navigate: router.push,
                            handleRowClick: handleRowClick
                        }, void 0, false, {
                            fileName: "[project]/features/brands/page.tsx",
                            lineNumber: 620,
                            columnNumber: 15
                        }, void 0)
                }, void 0, false, {
                    fileName: "[project]/features/brands/page.tsx",
                    lineNumber: 595,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/brands/page.tsx",
                lineNumber: 594,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialog"], {
                open: isAlertOpen,
                onOpenChange: setIsAlertOpen,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogContent"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogHeader"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogTitle"], {
                                    children: "Xóa thương hiệu?"
                                }, void 0, false, {
                                    fileName: "[project]/features/brands/page.tsx",
                                    lineNumber: 636,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogDescription"], {
                                    children: "Thương hiệu sẽ bị xóa khỏi hệ thống. Hành động này không thể hoàn tác."
                                }, void 0, false, {
                                    fileName: "[project]/features/brands/page.tsx",
                                    lineNumber: 637,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/brands/page.tsx",
                            lineNumber: 635,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogFooter"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogCancel"], {
                                    children: "Đóng"
                                }, void 0, false, {
                                    fileName: "[project]/features/brands/page.tsx",
                                    lineNumber: 642,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogAction"], {
                                    onClick: confirmDelete,
                                    children: "Xóa"
                                }, void 0, false, {
                                    fileName: "[project]/features/brands/page.tsx",
                                    lineNumber: 643,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/brands/page.tsx",
                            lineNumber: 641,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/brands/page.tsx",
                    lineNumber: 634,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/brands/page.tsx",
                lineNumber: 633,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialog"], {
                open: isBulkDeleteAlertOpen,
                onOpenChange: setIsBulkDeleteAlertOpen,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogContent"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogHeader"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogTitle"], {
                                    children: [
                                        "Xóa ",
                                        Object.keys(rowSelection).length,
                                        " thương hiệu?"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/brands/page.tsx",
                                    lineNumber: 652,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogDescription"], {
                                    children: "Các thương hiệu sẽ bị xóa khỏi hệ thống. Hành động này không thể hoàn tác."
                                }, void 0, false, {
                                    fileName: "[project]/features/brands/page.tsx",
                                    lineNumber: 653,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/brands/page.tsx",
                            lineNumber: 651,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogFooter"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogCancel"], {
                                    children: "Đóng"
                                }, void 0, false, {
                                    fileName: "[project]/features/brands/page.tsx",
                                    lineNumber: 658,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogAction"], {
                                    onClick: confirmBulkDelete,
                                    children: "Xóa tất cả"
                                }, void 0, false, {
                                    fileName: "[project]/features/brands/page.tsx",
                                    lineNumber: 659,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/brands/page.tsx",
                            lineNumber: 657,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/brands/page.tsx",
                    lineNumber: 650,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/brands/page.tsx",
                lineNumber: 649,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$brands$2f$components$2f$pkgx$2d$link$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PkgxBrandLinkDialog"], {
                open: pkgxLinkDialogOpen,
                onOpenChange: setPkgxLinkDialogOpen,
                brand: brandToLink,
                onSuccess: handlePkgxLinkSuccess
            }, void 0, false, {
                fileName: "[project]/features/brands/page.tsx",
                lineNumber: 665,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$brands$2f$components$2f$pkgx$2d$brand$2d$detail$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PkgxBrandDetailDialog"], {
                open: pkgxDetailDialogOpen,
                onOpenChange: setPkgxDetailDialogOpen,
                brand: brandToViewDetail,
                pkgxBrandId: pkgxBrandIdToView
            }, void 0, false, {
                fileName: "[project]/features/brands/page.tsx",
                lineNumber: 673,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$components$2f$pkgx$2d$bulk$2d$sync$2d$confirm$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PkgxBulkSyncConfirmDialog"], {
                confirmAction: bulkConfirmAction,
                progress: bulkProgress,
                onConfirm: executeBulkAction,
                onCancel: cancelBulkConfirm
            }, void 0, false, {
                fileName: "[project]/features/brands/page.tsx",
                lineNumber: 681,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$generic$2d$import$2d$dialog$2d$v2$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GenericImportDialogV2"], {
                open: isImportOpen,
                onOpenChange: setIsImportOpen,
                config: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$export$2f$configs$2f$brand$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["brandImportExportConfig"],
                existingData: activeBrands,
                onImport: handleImport,
                currentUser: authEmployee ? {
                    systemId: authEmployee.systemId,
                    name: authEmployee.fullName || authEmployee.id
                } : undefined
            }, void 0, false, {
                fileName: "[project]/features/brands/page.tsx",
                lineNumber: 689,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$generic$2d$export$2d$dialog$2d$v2$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GenericExportDialogV2"], {
                open: isExportOpen,
                onOpenChange: setIsExportOpen,
                config: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$export$2f$configs$2f$brand$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["brandImportExportConfig"],
                allData: activeBrands,
                filteredData: sortedData,
                currentPageData: paginatedData,
                selectedData: allSelectedRows,
                currentUser: authEmployee ? {
                    systemId: authEmployee.systemId,
                    name: authEmployee.fullName || authEmployee.id
                } : {
                    systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SYSTEM'),
                    name: 'System'
                }
            }, void 0, false, {
                fileName: "[project]/features/brands/page.tsx",
                lineNumber: 702,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/brands/page.tsx",
        lineNumber: 505,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=features_2cf4a316._.js.map