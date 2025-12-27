module.exports = [
"[project]/lib/id-types.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Type-safe ID System
 * 
 * Prevents mixing systemId with business ID at compile time
 */ // Branded types for type safety
__turbopack_context__.s([
    "asBusinessId",
    ()=>asBusinessId,
    "asSystemId",
    ()=>asSystemId,
    "buildEntityLink",
    ()=>buildEntityLink,
    "ensureBusinessId",
    ()=>ensureBusinessId,
    "ensureSystemId",
    ()=>ensureSystemId,
    "getDisplayId",
    ()=>getDisplayId,
    "isBusinessIdFormat",
    ()=>isBusinessIdFormat,
    "isSystemIdFormat",
    ()=>isSystemIdFormat,
    "parseId",
    ()=>parseId
]);
function asSystemId(id) {
    return id;
}
function asBusinessId(id) {
    return id;
}
function isSystemIdFormat(id) {
    // SystemId: 8 digits + prefix (e.g., NV00000001, VOUCHER00000123)
    return /^[A-Z]+\d{8}$/.test(id);
}
function isBusinessIdFormat(id) {
    // Business ID: shorter, variable length (e.g., NV001, PT000001)
    return /^[A-Z]+\d{3,6}$/.test(id);
}
function parseId(id) {
    if (isSystemIdFormat(id)) {
        return {
            type: 'system',
            value: asSystemId(id)
        };
    }
    if (isBusinessIdFormat(id)) {
        return {
            type: 'business',
            value: asBusinessId(id)
        };
    }
    throw new Error(`Invalid ID format: ${id}`);
}
function buildEntityLink(path, entity) {
    return path.replace(':systemId', entity.systemId);
}
function getDisplayId(entity) {
    return entity.id;
}
function ensureSystemId(id, context) {
    if (!isSystemIdFormat(id)) {
        console.warn(`[ensureSystemId] Invalid SystemId format: "${id}"${context ? ` in ${context}` : ''}`);
    }
    return asSystemId(id);
}
function ensureBusinessId(id, context) {
    if (!isBusinessIdFormat(id)) {
        console.warn(`[ensureBusinessId] Invalid BusinessId format: "${id}"${context ? ` in ${context}` : ''}`);
    }
    return asBusinessId(id);
}
}),
"[project]/lib/pkgx/api-service.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createProduct",
    ()=>createProduct,
    "getAllProducts",
    ()=>getAllProducts,
    "getBrandById",
    ()=>getBrandById,
    "getBrands",
    ()=>getBrands,
    "getCategories",
    ()=>getCategories,
    "getCategoryById",
    ()=>getCategoryById,
    "getMemberRanks",
    ()=>getMemberRanks,
    "getProductById",
    ()=>getProductById,
    "getProductGallery",
    ()=>getProductGallery,
    "getProducts",
    ()=>getProducts,
    "processHtmlImagesForPkgx",
    ()=>processHtmlImagesForPkgx,
    "testConnection",
    ()=>testConnection,
    "updateBrand",
    ()=>updateBrand,
    "updateCategory",
    ()=>updateCategory,
    "updateCategoryBasic",
    ()=>updateCategoryBasic,
    "updateMemberPrice",
    ()=>updateMemberPrice,
    "updateMemberPriceSingle",
    ()=>updateMemberPriceSingle,
    "updateProduct",
    ()=>updateProduct,
    "updateProductPrice",
    ()=>updateProductPrice,
    "updateProductSeo",
    ()=>updateProductSeo,
    "updateProductStock",
    ()=>updateProductStock,
    "uploadImageFromUrl",
    ()=>uploadImageFromUrl,
    "uploadProductImage",
    ()=>uploadProductImage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/constants.ts [app-ssr] (ecmascript)");
;
;
// ========================================
// Helper Functions
// ========================================
function getApiConfig() {
    const { settings } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePkgxSettingsStore"].getState();
    return {
        apiUrl: settings.apiUrl || __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PKGX_API_CONFIG"].baseUrl,
        apiKey: settings.apiKey,
        enabled: settings.enabled
    };
}
async function fetchWithAuth(url, options = {}) {
    const { apiKey, enabled } = getApiConfig();
    if (!enabled) {
        return {
            success: false,
            error: 'Tích hợp PKGX chưa được bật'
        };
    }
    if (!apiKey) {
        return {
            success: false,
            error: 'Chưa cấu hình API Key'
        };
    }
    // DEBUG: Log request details
    console.log('[PKGX fetchWithAuth] URL:', url);
    console.log('[PKGX fetchWithAuth] Method:', options.method || 'GET');
    console.log('[PKGX fetchWithAuth] Headers:', options.headers);
    if (options.body) {
        console.log('[PKGX fetchWithAuth] Body (raw):', options.body);
        console.log('[PKGX fetchWithAuth] Body type:', typeof options.body);
    }
    try {
        const fetchOptions = {
            ...options,
            mode: 'cors',
            credentials: 'omit',
            headers: {
                'X-API-KEY': apiKey,
                'Content-Type': 'application/json',
                ...options.headers
            }
        };
        console.log('[PKGX fetchWithAuth] Full fetch options:', JSON.stringify(fetchOptions, null, 2));
        const response = await fetch(url, fetchOptions);
        const responseText = await response.text();
        console.log('[PKGX fetchWithAuth] Response text:', responseText);
        const data = JSON.parse(responseText);
        // DEBUG: Log response
        console.log('[PKGX fetchWithAuth] Response status:', response.status);
        console.log('[PKGX fetchWithAuth] Response data:', data);
        if (data.error) {
            return {
                success: false,
                error: data.message || 'Lỗi từ server PKGX'
            };
        }
        return {
            success: true,
            data
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Không thể kết nối đến server PKGX'
        };
    }
}
async function getCategories() {
    const { apiUrl } = getApiConfig();
    const url = `${apiUrl}?action=get_categories`;
    return fetchWithAuth(url, {
        method: 'GET'
    });
}
async function getBrands() {
    const { apiUrl } = getApiConfig();
    const url = `${apiUrl}?action=get_brands`;
    return fetchWithAuth(url, {
        method: 'GET'
    });
}
async function getBrandById(brandId) {
    const { apiUrl } = getApiConfig();
    const url = `${apiUrl}?action=get_brands&brand_id=${brandId}`;
    const response = await fetchWithAuth(url, {
        method: 'GET'
    });
    if (!response.success || !response.data) {
        return {
            success: false,
            error: response.error
        };
    }
    return {
        success: true,
        data: response.data.data
    };
}
async function getProducts(page = 1, limit = 50) {
    const { apiUrl } = getApiConfig();
    const url = `${apiUrl}?action=get_products&page=${page}&limit=${limit}`;
    return fetchWithAuth(url, {
        method: 'GET'
    });
}
async function getAllProducts() {
    const allProducts = [];
    let currentPage = 1;
    let totalPages = 1;
    while(currentPage <= totalPages){
        const response = await getProducts(currentPage, 100);
        if (!response.success || !response.data) {
            return {
                success: false,
                error: response.error
            };
        }
        allProducts.push(...response.data.data);
        totalPages = response.data.pagination.total_pages;
        currentPage++;
    }
    return {
        success: true,
        data: allProducts
    };
}
async function getProductById(goodsId) {
    const { apiUrl } = getApiConfig();
    // API không có action=get_product, dùng get_products với goods_id filter
    const url = `${apiUrl}?action=get_products&goods_id=${goodsId}`;
    const response = await fetchWithAuth(url, {
        method: 'GET'
    });
    if (!response.success || !response.data) {
        return {
            success: false,
            error: response.error
        };
    }
    // Trả về sản phẩm đầu tiên nếu có
    const product = response.data.data?.[0] || null;
    return {
        success: true,
        data: product
    };
}
async function getProductGallery(goodsId) {
    const { apiUrl } = getApiConfig();
    const url = `${apiUrl}?action=get_gallery&goods_id=${goodsId}`;
    try {
        const response = await fetchWithAuth(url, {
            method: 'GET'
        });
        // Debug log
        console.log('Gallery API response:', response);
        if (!response.success) {
            // Nếu API chưa có hoặc lỗi, trả về mảng rỗng
            console.log('Gallery API error:', response.error);
            return {
                success: true,
                data: []
            };
        }
        // response.data chứa toàn bộ response từ API: { error, message, goods_id, total, data }
        const galleryData = response.data;
        return {
            success: true,
            data: galleryData.data || []
        };
    } catch (error) {
        console.error('Gallery API exception:', error);
        return {
            success: true,
            data: []
        }; // Fallback to empty array
    }
}
async function createProduct(payload) {
    const { apiUrl } = getApiConfig();
    const url = `${apiUrl}?action=create_product`;
    return fetchWithAuth(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
}
async function updateProduct(goodsId, payload) {
    const { apiUrl } = getApiConfig();
    const url = `${apiUrl}?action=update_product&goods_id=${goodsId}`;
    return fetchWithAuth(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
}
async function updateProductPrice(goodsId, prices) {
    return updateProduct(goodsId, prices);
}
async function updateProductSeo(goodsId, seo) {
    return updateProduct(goodsId, seo);
}
async function updateProductStock(goodsId, goodsNumber) {
    return updateProduct(goodsId, {
        goods_number: goodsNumber
    });
}
async function uploadProductImage(imageFile, options) {
    const { apiUrl, apiKey, enabled } = getApiConfig();
    if (!enabled) {
        return {
            success: false,
            error: 'Tích hợp PKGX chưa được bật'
        };
    }
    if (!apiKey) {
        return {
            success: false,
            error: 'Chưa cấu hình API Key'
        };
    }
    const url = `${apiUrl}?action=upload_product_image`;
    const formData = new FormData();
    formData.append('image_file', imageFile);
    if (options?.filenameSlug) {
        formData.append('filename_slug', options.filenameSlug);
    }
    if (options?.goodsId) {
        formData.append('goods_id', options.goodsId.toString());
    }
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'X-API-KEY': apiKey
            },
            body: formData
        });
        const data = await response.json();
        if (data.error) {
            return {
                success: false,
                error: data.message
            };
        }
        return {
            success: true,
            data
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Không thể upload ảnh'
        };
    }
}
async function uploadImageFromUrl(imageUrl, options) {
    const { apiUrl, apiKey, enabled } = getApiConfig();
    if (!enabled) {
        return {
            success: false,
            error: 'Tích hợp PKGX chưa được bật'
        };
    }
    if (!apiKey) {
        return {
            success: false,
            error: 'Chưa cấu hình API Key'
        };
    }
    const url = `${apiUrl}?action=upload_image_from_url`;
    const payload = {
        image_url: imageUrl
    };
    if (options?.filenameSlug) {
        payload.filename_slug = options.filenameSlug;
    }
    if (options?.goodsId) {
        payload.goods_id = options.goodsId;
    }
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'X-API-KEY': apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (data.error) {
            return {
                success: false,
                error: data.message
            };
        }
        return {
            success: true,
            data
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Không thể upload ảnh từ URL'
        };
    }
}
async function getCategoryById(catId) {
    const { apiUrl } = getApiConfig();
    const url = `${apiUrl}?action=get_categories&cat_id=${catId}`;
    return fetchWithAuth(url, {
        method: 'GET'
    });
}
async function updateCategory(catId, payload) {
    const { apiUrl } = getApiConfig();
    // Add timestamp to bust cache
    const timestamp = Date.now();
    const url = `${apiUrl}?action=update_category&cat_id=${catId}&_t=${timestamp}`;
    console.log('[updateCategory] Calling with catId:', catId, 'payload:', payload);
    return fetchWithAuth(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
}
async function updateCategoryBasic(catId, payload) {
    const { apiUrl } = getApiConfig();
    const timestamp = Date.now();
    const url = `${apiUrl}?action=update_category_basic&cat_id=${catId}&_t=${timestamp}`;
    console.log('[updateCategoryBasic] Calling with catId:', catId, 'payload:', payload);
    return fetchWithAuth(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
}
async function updateBrand(brandId, payload) {
    const { apiUrl } = getApiConfig();
    const url = `${apiUrl}?action=update_brand&brand_id=${brandId}`;
    return fetchWithAuth(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
}
async function testConnection() {
    const response = await getProducts(1, 1);
    if (!response.success) {
        return {
            success: false,
            error: response.error
        };
    }
    return {
        success: true,
        data: {
            productCount: response.data?.pagination.total_items || 0
        }
    };
}
async function getMemberRanks() {
    const { apiUrl } = getApiConfig();
    const url = `${apiUrl}?action=get_member_ranks`;
    return fetchWithAuth(url, {
        method: 'GET'
    });
}
async function updateMemberPrice(goodsId, memberPrices) {
    const { apiUrl } = getApiConfig();
    const url = `${apiUrl}?action=update_member_price&goods_id=${goodsId}`;
    return fetchWithAuth(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            member_prices: memberPrices
        })
    });
}
async function updateMemberPriceSingle(goodsId, userRank, userPrice) {
    return updateMemberPrice(goodsId, [
        {
            user_rank: userRank,
            user_price: userPrice
        }
    ]);
}
// ========================================
// HTML Image Processing
// ========================================
/**
 * Kiểm tra URL có phải là URL công khai không (không phải localhost/internal)
 */ function isPublicUrl(url) {
    try {
        const parsed = new URL(url);
        const hostname = parsed.hostname.toLowerCase();
        // Loại bỏ các URL nội bộ
        if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.') || hostname.startsWith('10.') || hostname.endsWith('.local')) {
            return false;
        }
        return true;
    } catch  {
        return false;
    }
}
/**
 * Kiểm tra xem URL có phải là ảnh base64 không
 */ function isBase64Image(url) {
    return url.startsWith('data:image/');
}
/**
 * Kiểm tra xem URL đã là URL của PKGX CDN chưa
 */ function isPkgxCdnUrl(url) {
    return url.includes('phukiengiaxuong.com.vn/cdn/');
}
async function processHtmlImagesForPkgx(html, filenamePrefix) {
    if (!html) {
        return {
            processedHtml: html,
            uploadedCount: 0,
            skippedCount: 0,
            errors: []
        };
    }
    // Regex để tìm tất cả <img> tags
    const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
    let processedHtml = html;
    let uploadedCount = 0;
    let skippedCount = 0;
    const errors = [];
    // Tìm tất cả các ảnh
    const matches = [];
    let match;
    while((match = imgRegex.exec(html)) !== null){
        matches.push({
            fullMatch: match[0],
            src: match[1]
        });
    }
    // Xử lý từng ảnh
    for(let i = 0; i < matches.length; i++){
        const { fullMatch, src } = matches[i];
        // Skip base64 images
        if (isBase64Image(src)) {
            skippedCount++;
            errors.push(`Bỏ qua ảnh base64 (không hỗ trợ upload base64)`);
            continue;
        }
        // Skip if already on PKGX CDN
        if (isPkgxCdnUrl(src)) {
            skippedCount++;
            continue;
        }
        // Skip localhost/internal URLs
        if (!isPublicUrl(src)) {
            skippedCount++;
            errors.push(`Bỏ qua URL nội bộ: ${src.substring(0, 50)}...`);
            continue;
        }
        // Upload to PKGX
        try {
            const slug = filenamePrefix ? `${filenamePrefix}-desc-img-${i + 1}` : `desc-img-${Date.now()}-${i + 1}`;
            const uploadResult = await uploadImageFromUrl(src, {
                filenameSlug: slug
            });
            if (uploadResult.success && uploadResult.data?.data?.full_urls?.original) {
                // Replace src in HTML
                const newSrc = uploadResult.data.data.full_urls.original;
                const newImgTag = fullMatch.replace(src, newSrc);
                processedHtml = processedHtml.replace(fullMatch, newImgTag);
                uploadedCount++;
            } else {
                errors.push(`Lỗi upload ảnh: ${uploadResult.error || 'Unknown error'}`);
                skippedCount++;
            }
        } catch (error) {
            errors.push(`Exception upload ảnh: ${error instanceof Error ? error.message : String(error)}`);
            skippedCount++;
        }
    }
    return {
        processedHtml,
        uploadedCount,
        skippedCount,
        errors
    };
}
}),
"[project]/lib/smart-prefix.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Smart Prefix System
 * Mapping entity types to their unique prefixes
 */ __turbopack_context__.s([
    "ENTITY_PREFIXES",
    ()=>ENTITY_PREFIXES,
    "getAllEntityTypes",
    ()=>getAllEntityTypes,
    "getEntityTypeFromPrefix",
    ()=>getEntityTypeFromPrefix,
    "getPrefix",
    ()=>getPrefix,
    "isValidEntityType",
    ()=>isValidEntityType
]);
const ENTITY_PREFIXES = {
    // ========================================
    // NHÂN SỰ & TỔ CHỨC (HR & ORGANIZATION)
    // ========================================
    'employees': 'NV',
    'departments': 'PB',
    'branches': 'CN',
    'job-titles': 'CV',
    // ========================================
    // KHÁCH HÀNG & ĐỐI TÁC (CUSTOMERS & PARTNERS)
    // ========================================
    'customers': 'KH',
    'suppliers': 'NCC',
    'shipping-partners': 'DVVC',
    // ========================================
    // SẢN PHẨM & KHO (PRODUCTS & INVENTORY)
    // ========================================
    'products': 'SP',
    'brands': 'TH',
    'categories': 'DM',
    'units': 'DVT',
    'stock-locations': 'KHO',
    'inventory-receipts': 'NK',
    'inventory-checks': 'PKK',
    'stock-transfers': 'PCK',
    'stock-history': 'LS',
    // ========================================
    // BÁN HÀNG (SALES)
    // ========================================
    'orders': 'DH',
    'sales-returns': 'TH',
    'sales-channels': 'KENH',
    'shipments': 'VC',
    // ========================================
    // MUA HÀNG (PURCHASING)
    // ========================================
    'purchase-orders': 'PO',
    'purchase-returns': 'TM',
    // ========================================
    // TÀI CHÍNH (FINANCE)
    // ========================================
    'receipts': 'PT',
    'payments': 'PC',
    'voucher-receipt': 'PT',
    'voucher-payment': 'PC',
    'cashbook': 'SCT',
    'reconciliation': 'DT',
    // Cài đặt tài chính
    'receipt-types': 'LT',
    'payment-types': 'LC',
    'cash-accounts': 'TK',
    'payment-methods': 'PTTT',
    'pricing-settings': 'GIA',
    'taxes': 'TAX',
    // ========================================
    // LƯƠNG & NHÂN SỰ (PAYROLL & HR)
    // ========================================
    'payroll': 'BL',
    'payslips': 'PL',
    'payroll-audit-log': 'PAL',
    'payroll-templates': 'BTP',
    'penalties': 'PF',
    'leaves': 'PN',
    'attendance': 'CC',
    'duty-schedule': 'PC',
    // ========================================
    // KPI & MỤC TIÊU (KPI & TARGETS)
    // ========================================
    'kpi': 'KPI',
    'target-groups': 'NHOM',
    'other-targets': 'MT',
    // ========================================
    // CÔNG VIỆC & DỊCH VỤ (TASKS & SERVICES)
    // ========================================
    'internal-tasks': 'CVNB',
    'task-templates': 'TMPL',
    'custom-fields': 'FIELD',
    'warranty': 'BH',
    'complaints': 'PKN',
    // ========================================
    // CÀI ĐẶT & DANH MỤC (SETTINGS & CATEGORIES)
    // ========================================
    'provinces': 'TP',
    'districts': 'QH',
    'wards': 'PX',
    'wiki': 'TL',
    'packaging': 'DG',
    'audit-log': 'LOG',
    // ========================================
    // CÀI ĐẶT KHÁCH HÀNG (CUSTOMER SETTINGS)
    // ========================================
    'customer-types': 'LKH',
    'customer-groups': 'NHKH',
    'customer-sources': 'NKH',
    'payment-terms': 'HTTT',
    'credit-ratings': 'XHTD',
    'lifecycle-stages': 'GDL',
    'sla-settings': 'SLA',
    // ========================================
    // CÀI ĐẶT NHÂN VIÊN (EMPLOYEE SETTINGS)
    // ========================================
    'employee-types': 'LNV',
    'employee-statuses': 'TTNV',
    'contract-types': 'LHD',
    'work-shifts': 'CA',
    'leave-types': 'LP',
    'salary-components': 'SC',
    // ========================================
    // CÀI ĐẶT KHÁC (OTHER SETTINGS)
    // ========================================
    'settings': 'CFG',
    // ========================================
    // AUTHENTICATION & USERS
    // ========================================
    'users': 'USER',
    // ========================================
    // PKGX INTEGRATION (phukiengiaxuong.com.vn)
    // ========================================
    'pkgx-categories': 'PKGXCAT',
    'pkgx-brands': 'PKGXBRAND',
    'pkgx-category-mappings': 'CATMAP',
    'pkgx-brand-mappings': 'BRANDMAP',
    'pkgx-price-mappings': 'PRICEMAP',
    'pkgx-sync-logs': 'PKGXLOG'
};
function getPrefix(entityType) {
    return ENTITY_PREFIXES[entityType];
}
function getAllEntityTypes() {
    return Object.keys(ENTITY_PREFIXES);
}
function isValidEntityType(entityType) {
    return entityType in ENTITY_PREFIXES;
}
function getEntityTypeFromPrefix(prefix) {
    const entry = Object.entries(ENTITY_PREFIXES).find(([_, p])=>p === prefix);
    return entry ? entry[0] : null;
}
}),
"[project]/lib/id-config.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ID_CONFIG",
    ()=>ID_CONFIG,
    "allowsCustomId",
    ()=>allowsCustomId,
    "createBusinessId",
    ()=>createBusinessId,
    "createSystemId",
    ()=>createSystemId,
    "exportConfig",
    ()=>exportConfig,
    "formatCounterInfo",
    ()=>formatCounterInfo,
    "getCategoryLabel",
    ()=>getCategoryLabel,
    "getEntitiesByCategory",
    ()=>getEntitiesByCategory,
    "getEntityCategories",
    ()=>getEntityCategories,
    "getEntityConfig",
    ()=>getEntityConfig,
    "getIDSystemStats",
    ()=>getIDSystemStats,
    "getStoreFactoryEntities",
    ()=>getStoreFactoryEntities,
    "getTotalEntityCount",
    ()=>getTotalEntityCount,
    "searchEntities",
    ()=>searchEntities,
    "validateIdFormat",
    ()=>validateIdFormat
]);
/**
 * ⚡ ENTERPRISE ID MANAGEMENT SYSTEM v2.0
 * 
 * SINGLE SOURCE OF TRUTH - Synced with smart-prefix.ts
 * 
 * Features:
 * - 60+ entity configurations
 * - TypeScript branded types (SystemId, BusinessId)
 * - Category grouping for UI
 * - Validation rules
 * - Store factory integration
 * - Backward compatibility
 * 
 * @version 2.0.0
 * @date 2025-11-10
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/smart-prefix.ts [app-ssr] (ecmascript)");
;
function createSystemId(id) {
    return id;
}
function createBusinessId(id) {
    return id;
}
function formatCounterInfo(entityType, counters) {
    const config = ID_CONFIG[entityType];
    if (!config) {
        throw new Error(`Unknown entity type: ${entityType}`);
    }
    const currentBusinessCounter = Math.max(0, counters?.business ?? 0);
    const currentSystemCounter = Math.max(0, counters?.system ?? currentBusinessCounter);
    const nextBusinessCounter = currentBusinessCounter + 1;
    const nextSystemCounter = currentSystemCounter + 1;
    const paddedBusiness = String(nextBusinessCounter).padStart(config.digitCount, '0');
    const paddedSystem = String(nextSystemCounter).padStart(config.digitCount, '0');
    return {
        currentBusinessCounter,
        currentSystemCounter,
        nextBusinessId: createBusinessId(`${config.prefix}${paddedBusiness}`),
        nextSystemId: createSystemId(`${config.systemIdPrefix}${paddedSystem}`),
        digitCount: config.digitCount,
        prefix: config.prefix,
        systemIdPrefix: config.systemIdPrefix,
        displayName: config.displayName
    };
}
const ID_CONFIG = {
    // ========================================
    // 👥 HR & ORGANIZATION (NHÂN SỰ)
    // ========================================
    'employees': {
        entityType: 'employees',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['employees'],
        systemIdPrefix: 'EMP',
        digitCount: 6,
        displayName: 'Nhân viên',
        category: 'hr',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'departments': {
        entityType: 'departments',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['departments'],
        systemIdPrefix: 'DEPT',
        digitCount: 6,
        displayName: 'Phòng ban',
        category: 'hr',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'branches': {
        entityType: 'branches',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['branches'],
        systemIdPrefix: 'BRANCH',
        digitCount: 6,
        displayName: 'Chi nhánh',
        category: 'hr',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'job-titles': {
        entityType: 'job-titles',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['job-titles'],
        systemIdPrefix: 'JOB',
        digitCount: 6,
        displayName: 'Chức vụ',
        category: 'hr',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'attendance': {
        entityType: 'attendance',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['attendance'],
        systemIdPrefix: 'ATTEND',
        digitCount: 6,
        displayName: 'Chấm công',
        category: 'hr',
        usesStoreFactory: false
    },
    'duty-schedule': {
        entityType: 'duty-schedule',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['duty-schedule'],
        systemIdPrefix: 'DUTY',
        digitCount: 6,
        displayName: 'Phân công',
        category: 'hr',
        notes: 'Prefix conflict with "payments" (PC)'
    },
    'payroll': {
        entityType: 'payroll',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['payroll'],
        systemIdPrefix: 'PAYROLL',
        digitCount: 6,
        displayName: 'Bảng lương',
        category: 'hr',
        usesStoreFactory: false
    },
    'payslips': {
        entityType: 'payslips',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['payslips'],
        systemIdPrefix: 'PAYSLIP',
        digitCount: 6,
        displayName: 'Phiếu lương',
        category: 'hr',
        usesStoreFactory: false,
        notes: 'Sinh từ payroll batch store'
    },
    'payroll-audit-log': {
        entityType: 'payroll-audit-log',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['payroll-audit-log'],
        systemIdPrefix: 'PAYROLLLOG',
        digitCount: 6,
        displayName: 'Nhật ký payroll',
        category: 'hr',
        usesStoreFactory: false
    },
    'payroll-templates': {
        entityType: 'payroll-templates',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['payroll-templates'],
        systemIdPrefix: 'PAYTPL',
        digitCount: 6,
        displayName: 'Mẫu bảng lương',
        category: 'hr',
        usesStoreFactory: false,
        notes: 'Dùng cho trang template payroll Phase 3'
    },
    'penalties': {
        entityType: 'penalties',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['penalties'],
        systemIdPrefix: 'PENALTY',
        digitCount: 6,
        displayName: 'Phiếu phạt',
        category: 'hr',
        usesStoreFactory: true
    },
    'leaves': {
        entityType: 'leaves',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['leaves'],
        systemIdPrefix: 'LEAVE',
        digitCount: 6,
        displayName: 'Nghỉ phép',
        category: 'hr',
        usesStoreFactory: true
    },
    // ========================================
    // 👤 CUSTOMERS & PARTNERS (KHÁCH HÀNG)
    // ========================================
    'customers': {
        entityType: 'customers',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['customers'],
        systemIdPrefix: 'CUSTOMER',
        digitCount: 6,
        displayName: 'Khách hàng',
        category: 'sales',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'suppliers': {
        entityType: 'suppliers',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['suppliers'],
        systemIdPrefix: 'SUPPLIER',
        digitCount: 6,
        displayName: 'Nhà cung cấp',
        category: 'purchasing',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'shipping-partners': {
        entityType: 'shipping-partners',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['shipping-partners'],
        systemIdPrefix: 'SHIPPING',
        digitCount: 6,
        displayName: 'Đơn vị vận chuyển',
        category: 'settings',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    // ========================================
    // 📦 PRODUCTS & INVENTORY (SẢN PHẨM & KHO)
    // ========================================
    'products': {
        entityType: 'products',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['products'],
        systemIdPrefix: 'PRODUCT',
        digitCount: 6,
        displayName: 'Sản phẩm',
        category: 'inventory',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'brands': {
        entityType: 'brands',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['brands'],
        systemIdPrefix: 'BRAND',
        digitCount: 6,
        displayName: 'Thương hiệu',
        category: 'inventory',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'categories': {
        entityType: 'categories',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['categories'],
        systemIdPrefix: 'CATEGORY',
        digitCount: 6,
        displayName: 'Danh mục',
        category: 'inventory',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'units': {
        entityType: 'units',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['units'],
        systemIdPrefix: 'UNIT',
        digitCount: 6,
        displayName: 'Đơn vị tính',
        category: 'inventory',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'stock-locations': {
        entityType: 'stock-locations',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['stock-locations'],
        systemIdPrefix: 'STOCK',
        digitCount: 6,
        displayName: 'Vị trí kho',
        category: 'inventory',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'inventory-receipts': {
        entityType: 'inventory-receipts',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['inventory-receipts'],
        systemIdPrefix: 'INVRECEIPT',
        digitCount: 6,
        displayName: 'Nhập kho',
        category: 'inventory',
        usesStoreFactory: true
    },
    'inventory-checks': {
        entityType: 'inventory-checks',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['inventory-checks'],
        systemIdPrefix: 'INVCHECK',
        digitCount: 6,
        displayName: 'Phiếu kiểm kho',
        category: 'inventory',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'stock-transfers': {
        entityType: 'stock-transfers',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['stock-transfers'],
        systemIdPrefix: 'TRANSFER',
        digitCount: 6,
        displayName: 'Phiếu chuyển kho',
        category: 'inventory',
        usesStoreFactory: true,
        notes: 'systemId: TRANSFER000001, Business ID: PCK000001'
    },
    'stock-history': {
        entityType: 'stock-history',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['stock-history'],
        systemIdPrefix: 'HISTORY',
        digitCount: 6,
        displayName: 'Lịch sử kho',
        category: 'inventory',
        usesStoreFactory: false
    },
    // ========================================
    // 🛒 SALES (BÁN HÀNG)
    // ========================================
    'orders': {
        entityType: 'orders',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['orders'],
        systemIdPrefix: 'ORDER',
        digitCount: 6,
        displayName: 'Đơn hàng',
        category: 'sales',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'sales-returns': {
        entityType: 'sales-returns',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['sales-returns'],
        systemIdPrefix: 'RETURN',
        digitCount: 6,
        displayName: 'Trả hàng',
        category: 'sales',
        usesStoreFactory: true
    },
    'sales-channels': {
        entityType: 'sales-channels',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['sales-channels'],
        systemIdPrefix: 'CHANNEL',
        digitCount: 6,
        displayName: 'Kênh bán hàng',
        category: 'sales',
        usesStoreFactory: true
    },
    'shipments': {
        entityType: 'shipments',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['shipments'],
        systemIdPrefix: 'SHIPMENT',
        digitCount: 6,
        displayName: 'Vận chuyển',
        category: 'sales',
        usesStoreFactory: false
    },
    // ========================================
    // 🏭 PURCHASING (MUA HÀNG)
    // ========================================
    'purchase-orders': {
        entityType: 'purchase-orders',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['purchase-orders'],
        systemIdPrefix: 'PURCHASE',
        digitCount: 6,
        displayName: 'Đơn mua hàng',
        category: 'purchasing',
        usesStoreFactory: true
    },
    'purchase-returns': {
        entityType: 'purchase-returns',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['purchase-returns'],
        systemIdPrefix: 'PRETURN',
        digitCount: 6,
        displayName: 'Trả hàng NCC',
        category: 'purchasing',
        usesStoreFactory: true
    },
    // ========================================
    // 💰 FINANCE (TÀI CHÍNH)
    // ========================================
    'receipts': {
        entityType: 'receipts',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['receipts'],
        systemIdPrefix: 'RECEIPT',
        digitCount: 6,
        displayName: 'Phiếu thu',
        category: 'finance',
        usesStoreFactory: true
    },
    'payments': {
        entityType: 'payments',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['payments'],
        systemIdPrefix: 'PAYMENT',
        digitCount: 6,
        displayName: 'Phiếu chi',
        category: 'finance',
        usesStoreFactory: true
    },
    'voucher-receipt': {
        entityType: 'voucher-receipt',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['voucher-receipt'],
        systemIdPrefix: 'RECEIPT',
        digitCount: 6,
        displayName: 'Phiếu thu (Voucher)',
        category: 'finance',
        usesStoreFactory: true,
        notes: 'Alias dùng cho các workflow voucher-only hoặc màn hình tổng hợp phiếu thu/chi.'
    },
    'voucher-payment': {
        entityType: 'voucher-payment',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['voucher-payment'],
        systemIdPrefix: 'PAYMENT',
        digitCount: 6,
        displayName: 'Phiếu chi (Voucher)',
        category: 'finance',
        usesStoreFactory: true,
        notes: 'Alias dùng cho các workflow voucher-only hoặc màn hình tổng hợp phiếu thu/chi.'
    },
    'cashbook': {
        entityType: 'cashbook',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['cashbook'],
        systemIdPrefix: 'CASHBOOK',
        digitCount: 6,
        displayName: 'Sổ quỹ tiền mặt',
        category: 'finance',
        usesStoreFactory: false
    },
    'reconciliation': {
        entityType: 'reconciliation',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['reconciliation'],
        systemIdPrefix: 'RECON',
        digitCount: 6,
        displayName: 'Đối chiếu',
        category: 'finance',
        usesStoreFactory: false
    },
    // Finance Settings
    'receipt-types': {
        entityType: 'receipt-types',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['receipt-types'],
        systemIdPrefix: 'RECTYPE',
        digitCount: 6,
        displayName: 'Loại thu',
        category: 'finance',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'payment-types': {
        entityType: 'payment-types',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['payment-types'],
        systemIdPrefix: 'PAYTYPE',
        digitCount: 6,
        displayName: 'Loại chi',
        category: 'finance',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'cash-accounts': {
        entityType: 'cash-accounts',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['cash-accounts'],
        systemIdPrefix: 'ACCOUNT',
        digitCount: 6,
        displayName: 'Tài khoản',
        category: 'finance',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'payment-methods': {
        entityType: 'payment-methods',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['payment-methods'],
        systemIdPrefix: 'METHOD',
        digitCount: 6,
        displayName: 'Phương thức thanh toán',
        category: 'finance',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'pricing-settings': {
        entityType: 'pricing-settings',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['pricing-settings'],
        systemIdPrefix: 'PRICING',
        digitCount: 6,
        displayName: 'Cài đặt giá',
        category: 'settings',
        usesStoreFactory: false
    },
    'taxes': {
        entityType: 'taxes',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['taxes'],
        systemIdPrefix: 'TAX',
        digitCount: 6,
        displayName: 'Thuế',
        category: 'settings',
        usesStoreFactory: true
    },
    // ========================================
    // 🎯 KPI & TARGETS (MỤC TIÊU)
    // ========================================
    'kpi': {
        entityType: 'kpi',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['kpi'],
        systemIdPrefix: 'KPI',
        digitCount: 6,
        displayName: 'KPI',
        category: 'hr',
        usesStoreFactory: false
    },
    'target-groups': {
        entityType: 'target-groups',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['target-groups'],
        systemIdPrefix: 'TARGET',
        digitCount: 6,
        displayName: 'Nhóm mục tiêu',
        category: 'settings',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'other-targets': {
        entityType: 'other-targets',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['other-targets'],
        systemIdPrefix: 'OTHERTARGET',
        digitCount: 6,
        displayName: 'Mục tiêu khác',
        category: 'sales',
        usesStoreFactory: false
    },
    // ========================================
    // CUSTOMER SERVICE (DỊCH VỤ)
    // ========================================
    'internal-tasks': {
        entityType: 'internal-tasks',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['internal-tasks'],
        systemIdPrefix: 'TASK',
        digitCount: 6,
        displayName: 'Công việc nội bộ',
        category: 'system',
        usesStoreFactory: true,
        validation: {
            allowCustomId: true
        }
    },
    'task-templates': {
        entityType: 'task-templates',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['task-templates'],
        systemIdPrefix: 'TMPL',
        digitCount: 6,
        displayName: 'Mẫu công việc',
        category: 'system',
        usesStoreFactory: false
    },
    'custom-fields': {
        entityType: 'custom-fields',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['custom-fields'],
        systemIdPrefix: 'FIELD',
        digitCount: 6,
        displayName: 'Trường tùy chỉnh',
        category: 'settings',
        usesStoreFactory: false
    },
    'warranty': {
        entityType: 'warranty',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['warranty'],
        systemIdPrefix: 'WARRANTY',
        digitCount: 6,
        displayName: 'Bảo hành',
        category: 'service',
        usesStoreFactory: true,
        notes: 'systemId: WARRANTY000001, Business ID: BH000001'
    },
    'complaints': {
        entityType: 'complaints',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['complaints'],
        systemIdPrefix: 'COMPLAINT',
        digitCount: 6,
        displayName: 'Khiếu nại',
        category: 'service',
        usesStoreFactory: true,
        notes: 'systemId: COMPLAINT000001, Business ID: PKN000001'
    },
    // ========================================
    // ⚙️ SETTINGS & CATEGORIES
    // ========================================
    'provinces': {
        entityType: 'provinces',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['provinces'],
        systemIdPrefix: 'PROVINCE',
        digitCount: 6,
        displayName: 'Tỉnh/Thành phố',
        category: 'settings',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'districts': {
        entityType: 'districts',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['districts'],
        systemIdPrefix: 'DISTRICT',
        digitCount: 6,
        displayName: 'Quận/Huyện',
        category: 'settings',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'wards': {
        entityType: 'wards',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['wards'],
        systemIdPrefix: 'WARD',
        digitCount: 6,
        displayName: 'Phường/Xã',
        category: 'settings',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'wiki': {
        entityType: 'wiki',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['wiki'],
        systemIdPrefix: 'WIKI',
        digitCount: 6,
        displayName: 'Tài liệu',
        category: 'system',
        usesStoreFactory: false
    },
    'packaging': {
        entityType: 'packaging',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['packaging'],
        systemIdPrefix: 'PACKAGE',
        digitCount: 6,
        displayName: 'Đóng gói',
        category: 'inventory',
        usesStoreFactory: false
    },
    'audit-log': {
        entityType: 'audit-log',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['audit-log'],
        systemIdPrefix: 'LOG',
        digitCount: 10,
        displayName: 'Nhật ký',
        category: 'system',
        usesStoreFactory: false
    },
    // Customer Settings
    'customer-types': {
        entityType: 'customer-types',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['customer-types'],
        systemIdPrefix: 'CUSTTYPE',
        digitCount: 6,
        displayName: 'Loại khách hàng',
        category: 'settings',
        usesStoreFactory: false
    },
    'customer-groups': {
        entityType: 'customer-groups',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['customer-groups'],
        systemIdPrefix: 'CUSTGROUP',
        digitCount: 6,
        displayName: 'Nhóm khách hàng',
        category: 'settings',
        usesStoreFactory: false
    },
    'customer-sources': {
        entityType: 'customer-sources',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['customer-sources'],
        systemIdPrefix: 'CUSTSOURCE',
        digitCount: 6,
        displayName: 'Nguồn khách hàng',
        category: 'settings',
        usesStoreFactory: false
    },
    'payment-terms': {
        entityType: 'payment-terms',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['payment-terms'],
        systemIdPrefix: 'PAYTERM',
        digitCount: 6,
        displayName: 'Hình thức thanh toán',
        category: 'settings',
        usesStoreFactory: false
    },
    'credit-ratings': {
        entityType: 'credit-ratings',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['credit-ratings'],
        systemIdPrefix: 'CREDIT',
        digitCount: 6,
        displayName: 'Xếp hạng tín dụng',
        category: 'settings',
        usesStoreFactory: false
    },
    'lifecycle-stages': {
        entityType: 'lifecycle-stages',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['lifecycle-stages'],
        systemIdPrefix: 'LIFECYCLE',
        digitCount: 6,
        displayName: 'Giai đoạn vòng đời khách hàng',
        category: 'sales',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'sla-settings': {
        entityType: 'sla-settings',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['sla-settings'],
        systemIdPrefix: 'SLACFG',
        digitCount: 6,
        displayName: 'Cài đặt SLA khách hàng',
        category: 'sales',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    // Employee Settings
    'employee-types': {
        entityType: 'employee-types',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['employee-types'],
        systemIdPrefix: 'EMPTYPE',
        digitCount: 6,
        displayName: 'Loại nhân viên',
        category: 'settings',
        usesStoreFactory: false
    },
    'employee-statuses': {
        entityType: 'employee-statuses',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['employee-statuses'],
        systemIdPrefix: 'EMPSTATUS',
        digitCount: 6,
        displayName: 'Trạng thái nhân viên',
        category: 'settings',
        usesStoreFactory: false
    },
    'contract-types': {
        entityType: 'contract-types',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['contract-types'],
        systemIdPrefix: 'CONTRACT',
        digitCount: 6,
        displayName: 'Loại hợp đồng',
        category: 'settings',
        usesStoreFactory: false
    },
    'work-shifts': {
        entityType: 'work-shifts',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['work-shifts'],
        systemIdPrefix: 'WSHIFT',
        digitCount: 6,
        displayName: 'Ca làm việc',
        category: 'settings',
        usesStoreFactory: false,
        notes: 'Dùng cho cài đặt ca làm việc & Dual ID trong attendance'
    },
    'leave-types': {
        entityType: 'leave-types',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['leave-types'],
        systemIdPrefix: 'LEAVETYPE',
        digitCount: 6,
        displayName: 'Loại nghỉ phép',
        category: 'settings',
        usesStoreFactory: false,
        notes: 'Quản lý danh mục phép năm/phép đặc biệt'
    },
    'salary-components': {
        entityType: 'salary-components',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['salary-components'],
        systemIdPrefix: 'SALCOMP',
        digitCount: 6,
        displayName: 'Thành phần lương',
        category: 'settings',
        usesStoreFactory: false,
        notes: 'Dùng cho cấu hình payroll engine'
    },
    // ========================================
    // 🔐 SYSTEM & AUTH
    // ========================================
    'settings': {
        entityType: 'settings',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['settings'],
        systemIdPrefix: 'CONFIG',
        digitCount: 6,
        displayName: 'Cấu hình',
        category: 'system',
        usesStoreFactory: false
    },
    'users': {
        entityType: 'users',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['users'],
        systemIdPrefix: 'USER',
        digitCount: 6,
        displayName: 'Người dùng',
        category: 'system',
        usesStoreFactory: false
    },
    // ========================================
    // 🌐 PKGX INTEGRATION (phukiengiaxuong.com.vn)
    // ========================================
    'pkgx-categories': {
        entityType: 'pkgx-categories',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['pkgx-categories'],
        systemIdPrefix: 'PKGXCAT',
        digitCount: 6,
        displayName: 'Danh mục PKGX',
        category: 'settings',
        usesStoreFactory: false,
        notes: 'Danh mục từ website phukiengiaxuong.com.vn'
    },
    'pkgx-brands': {
        entityType: 'pkgx-brands',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['pkgx-brands'],
        systemIdPrefix: 'PKGXBRAND',
        digitCount: 6,
        displayName: 'Thương hiệu PKGX',
        category: 'settings',
        usesStoreFactory: false,
        notes: 'Thương hiệu từ website phukiengiaxuong.com.vn'
    },
    'pkgx-category-mappings': {
        entityType: 'pkgx-category-mappings',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['pkgx-category-mappings'],
        systemIdPrefix: 'CATMAP',
        digitCount: 6,
        displayName: 'Mapping danh mục PKGX',
        category: 'settings',
        usesStoreFactory: false,
        notes: 'Mapping danh mục HRM ↔ PKGX'
    },
    'pkgx-brand-mappings': {
        entityType: 'pkgx-brand-mappings',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['pkgx-brand-mappings'],
        systemIdPrefix: 'BRANDMAP',
        digitCount: 6,
        displayName: 'Mapping thương hiệu PKGX',
        category: 'settings',
        usesStoreFactory: false,
        notes: 'Mapping thương hiệu HRM ↔ PKGX'
    },
    'pkgx-price-mappings': {
        entityType: 'pkgx-price-mappings',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['pkgx-price-mappings'],
        systemIdPrefix: 'PRICEMAP',
        digitCount: 6,
        displayName: 'Mapping giá PKGX',
        category: 'settings',
        usesStoreFactory: false,
        notes: 'Mapping bảng giá HRM → PKGX price fields'
    },
    'pkgx-sync-logs': {
        entityType: 'pkgx-sync-logs',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['pkgx-sync-logs'],
        systemIdPrefix: 'PKGXLOG',
        digitCount: 6,
        displayName: 'Log đồng bộ PKGX',
        category: 'system',
        usesStoreFactory: false,
        notes: 'Lưu lịch sử đồng bộ với PKGX'
    }
};
function getEntityConfig(entityType) {
    const config = ID_CONFIG[entityType];
    if (!config) {
        throw new Error(`No configuration found for entity type: ${entityType}`);
    }
    return config;
}
function getEntitiesByCategory(category) {
    return Object.values(ID_CONFIG).filter((config)=>config.category === category).map((config)=>config.entityType);
}
function getEntityCategories() {
    const categories = {
        'hr': [],
        'finance': [],
        'inventory': [],
        'sales': [],
        'purchasing': [],
        'service': [],
        'settings': [],
        'system': []
    };
    Object.values(ID_CONFIG).forEach((config)=>{
        categories[config.category].push(config.entityType);
    });
    return categories;
}
function validateIdFormat(id, entityType) {
    const config = getEntityConfig(entityType);
    // Check prefix
    if (!id.startsWith(config.prefix)) {
        return {
            valid: false,
            error: `Invalid prefix. Expected "${config.prefix}", got "${id.slice(0, config.prefix.length)}"`
        };
    }
    // Check digit count
    const numberPart = id.substring(config.prefix.length);
    if (numberPart.length !== config.digitCount) {
        const expectedLength = config.prefix.length + config.digitCount;
        return {
            valid: false,
            error: `Invalid length. Expected ${expectedLength} characters, got ${id.length}`
        };
    }
    // Check if numeric
    if (!/^\d+$/.test(numberPart)) {
        return {
            valid: false,
            error: 'Numeric part must contain only digits'
        };
    }
    // Custom pattern validation
    if (config.validation?.pattern && !config.validation.pattern.test(id)) {
        return {
            valid: false,
            error: 'ID does not match required pattern'
        };
    }
    return {
        valid: true
    };
}
function allowsCustomId(entityType) {
    return getEntityConfig(entityType).validation?.allowCustomId ?? false;
}
function getStoreFactoryEntities() {
    return Object.values(ID_CONFIG).filter((config)=>config.usesStoreFactory === true).map((config)=>config.entityType);
}
function getCategoryLabel(category) {
    const labels = {
        'hr': 'Nhân sự & Tổ chức',
        'finance': 'Tài chính',
        'inventory': 'Kho hàng',
        'sales': 'Bán hàng',
        'purchasing': 'Mua hàng',
        'service': 'Dịch vụ khách hàng',
        'settings': 'Cài đặt',
        'system': 'Hệ thống'
    };
    return labels[category];
}
function searchEntities(query) {
    const lowerQuery = query.toLowerCase();
    return Object.values(ID_CONFIG).filter((config)=>config.displayName.toLowerCase().includes(lowerQuery) || config.prefix.toLowerCase().includes(lowerQuery) || config.entityType.includes(lowerQuery));
}
function getTotalEntityCount() {
    return Object.keys(ID_CONFIG).length;
}
function exportConfig() {
    return JSON.stringify(ID_CONFIG, null, 2);
}
function getIDSystemStats() {
    const configs = Object.values(ID_CONFIG);
    const byCategory = {};
    let storeFactoryEnabled = 0;
    let customIdAllowed = 0;
    let totalDigits = 0;
    configs.forEach((config)=>{
        // Count by category
        byCategory[config.category] = (byCategory[config.category] || 0) + 1;
        // Count features
        if (config.usesStoreFactory) storeFactoryEnabled++;
        if (config.validation?.allowCustomId) customIdAllowed++;
        totalDigits += config.digitCount;
    });
    return {
        totalEntities: configs.length,
        byCategory,
        storeFactoryEnabled,
        customIdAllowed,
        averageDigitCount: Math.round(totalDigits / configs.length * 10) / 10
    };
}
}),
"[project]/lib/id-utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "extractCounterFromBusinessId",
    ()=>extractCounterFromBusinessId,
    "extractCounterFromSystemId",
    ()=>extractCounterFromSystemId,
    "findNextAvailableBusinessId",
    ()=>findNextAvailableBusinessId,
    "formatIdForDisplay",
    ()=>formatIdForDisplay,
    "generateBusinessId",
    ()=>generateBusinessId,
    "generateSuggestedIds",
    ()=>generateSuggestedIds,
    "generateSystemId",
    ()=>generateSystemId,
    "getMaxBusinessIdCounter",
    ()=>getMaxBusinessIdCounter,
    "getMaxSystemIdCounter",
    ()=>getMaxSystemIdCounter,
    "isBusinessIdUnique",
    ()=>isBusinessIdUnique,
    "isValidIdFormat",
    ()=>isValidIdFormat,
    "sanitizeBusinessId",
    ()=>sanitizeBusinessId
]);
/**
 * ID Utilities
 * Helpers for generating and validating IDs (systemId & business id)
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/smart-prefix.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-config.ts [app-ssr] (ecmascript)");
;
;
function generateSystemId(entityType, counter) {
    const config = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ID_CONFIG"][entityType];
    if (!config) {
        throw new Error(`No configuration found for entity type: ${entityType}`);
    }
    const prefix = config.systemIdPrefix;
    const digitCount = config.digitCount || 6;
    return `${prefix}${String(counter).padStart(digitCount, '0')}`;
}
function generateBusinessId(entityType, counter, customId) {
    // If user provided custom ID, validate and return it
    if (customId && customId.trim()) {
        const sanitized = sanitizeBusinessId(customId);
        if (!sanitized) {
            throw new Error('Mã không hợp lệ! Chỉ được phép sử dụng chữ cái và số.');
        }
        return sanitized;
    }
    // Otherwise, auto-generate
    const prefix = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getPrefix"])(entityType);
    return `${prefix}${String(counter).padStart(6, '0')}`;
}
function sanitizeBusinessId(id) {
    if (!id || typeof id !== 'string') return null;
    // Remove all special characters, keep only alphanumeric
    const cleaned = id.trim().replace(/[^a-zA-Z0-9]/g, '');
    if (!cleaned) return null;
    // Convert to uppercase for consistency
    return cleaned.toUpperCase();
}
function isBusinessIdUnique(id, existingIds, currentId) {
    if (!id) return false;
    const normalizedId = id.toUpperCase();
    const normalizedCurrentId = currentId?.toUpperCase();
    return !existingIds.some((existingId)=>{
        // ✅ Filter out empty/undefined IDs
        if (!existingId || existingId.trim() === '') return false;
        const normalizedExisting = existingId.toUpperCase();
        // Skip self-comparison in edit mode
        if (normalizedCurrentId && normalizedExisting === normalizedCurrentId) {
            return false;
        }
        return normalizedExisting === normalizedId;
    });
}
function extractCounterFromSystemId(systemId, prefix) {
    if (!systemId || typeof systemId !== 'string') return 0;
    // Try different digit counts (most entities use 6 digits, some use 7-8)
    const regex8 = new RegExp(`^${prefix}(\\d{8})$`);
    const regex7 = new RegExp(`^${prefix}(\\d{7})$`);
    const regex6 = new RegExp(`^${prefix}(\\d{6})$`);
    const match8 = systemId.match(regex8);
    if (match8) return parseInt(match8[1], 10);
    const match7 = systemId.match(regex7);
    if (match7) return parseInt(match7[1], 10);
    const match6 = systemId.match(regex6);
    if (match6) return parseInt(match6[1], 10);
    return 0;
}
function extractCounterFromBusinessId(businessId, prefix) {
    if (!businessId || typeof businessId !== 'string') return 0;
    const regex = new RegExp(`^${prefix}(\\d+)$`);
    const match = businessId.match(regex);
    return match ? parseInt(match[1], 10) : 0;
}
function getMaxSystemIdCounter(items, prefix) {
    if (!items || !Array.isArray(items)) return 0;
    let maxCounter = 0;
    items.forEach((item)=>{
        if (!item || !item.systemId) return;
        const counter = extractCounterFromSystemId(item.systemId, prefix);
        if (counter > maxCounter) {
            maxCounter = counter;
        }
    });
    return maxCounter;
}
function getMaxBusinessIdCounter(items, prefix) {
    if (!items || !Array.isArray(items)) return 0;
    let maxCounter = 0;
    items.forEach((item)=>{
        if (!item || !item.id) return;
        const counter = extractCounterFromBusinessId(item.id, prefix);
        if (counter > maxCounter) {
            maxCounter = counter;
        }
    });
    return maxCounter;
}
function formatIdForDisplay(id) {
    // Match pattern: PREFIX followed by numbers
    const match = id.match(/^([A-Z]+)(\d+)$/);
    if (!match) return id;
    const [, prefix, numbers] = match;
    return `${prefix}-${numbers}`;
}
function isValidIdFormat(id) {
    if (!id || typeof id !== 'string') return false;
    // Only alphanumeric characters allowed
    const regex = /^[A-Z0-9]+$/i;
    return regex.test(id);
}
function generateSuggestedIds(entityType, counter, count = 3) {
    const suggestions = [];
    const prefix = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getPrefix"])(entityType);
    for(let i = 0; i < count; i++){
        suggestions.push(`${prefix}${String(counter + i + 1).padStart(6, '0')}`);
    }
    return suggestions;
}
function findNextAvailableBusinessId(prefix, existingIds, startCounter, digitCount = 6) {
    let counter = startCounter;
    let nextId;
    // Keep incrementing until we find a unique ID
    do {
        counter++;
        nextId = `${prefix}${String(counter).padStart(digitCount, '0')}`;
    }while (existingIds.some((id)=>id === nextId))
    return {
        nextId,
        updatedCounter: counter
    };
}
}),
"[project]/lib/store-factory.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createCrudStore",
    ()=>createCrudStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
// persist, createJSONStorage removed - database is now source of truth
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/smart-prefix.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-config.ts [app-ssr] (ecmascript)");
;
;
;
;
const SYSTEM_FALLBACK_ID = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createSystemId"])('SYS000000');
const asSystemIdFallback = ()=>SYSTEM_FALLBACK_ID;
// ✅ API Sync helper for store-factory
async function syncToAPI(apiEndpoint, action, data, systemId) {
    try {
        const endpoint = action === 'create' ? apiEndpoint : `${apiEndpoint}/${systemId || data.systemId}`;
        const method = action === 'create' ? 'POST' : action === 'update' ? 'PATCH' : action === 'delete' ? 'DELETE' : 'PATCH'; // restore uses PATCH
        const response = await fetch(endpoint, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: action !== 'delete' ? JSON.stringify(data) : undefined
        });
        if (!response.ok) {
            console.warn(`[Store Factory API] ${action} failed for ${apiEndpoint}:`, response.status);
        }
        return response.ok;
    } catch (error) {
        console.error(`[Store Factory API] ${action} error for ${apiEndpoint}:`, error);
        return false;
    }
}
const createCrudStore = (_initialData, entityType, options)=>{
    const businessPrefix = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getPrefix"])(entityType); // Vietnamese prefix for Business ID (NV, KH, DH)
    const config = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ID_CONFIG"][entityType];
    const systemIdPrefix = config?.systemIdPrefix || entityType.toUpperCase(); // English prefix for SystemId (EMP, CUSTOMER, ORDER)
    const businessIdField = options?.businessIdField ?? 'id';
    // const persistKey = options?.persistKey; // @deprecated - No longer used
    const getCurrentUser = options?.getCurrentUser;
    const apiEndpoint = options?.apiEndpoint;
    // ✅ CHANGED: Start with empty array - database is source of truth
    // Mock data files (data.ts) are NO LONGER USED for runtime
    const normalizedInitialData = [];
    const storeConfig = (set, get)=>({
            data: normalizedInitialData,
            // ✅ Counters start at 0 - will be initialized from API via loadFromAPI()
            _counters: {
                systemId: 0,
                businessId: 0
            },
            _initialized: false,
            add: (item)=>{
                // ✅ Get counters from state (persisted)
                const currentCounters = get()._counters;
                const newSystemIdCounter = currentCounters.systemId + 1;
                const newSystemId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createSystemId"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateSystemId"])(entityType, newSystemIdCounter));
                // Generate or validate Business ID (if field exists)
                let finalItem = {
                    ...item
                };
                let newBusinessIdCounter = currentCounters.businessId;
                if (businessIdField in item) {
                    const customId = item[businessIdField];
                    const existingIds = get().data.map((d)=>d[businessIdField]);
                    // ✅ If customId provided, validate uniqueness
                    if (customId && customId.trim()) {
                        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isBusinessIdUnique"])(customId, existingIds)) {
                            throw new Error(`Mã "${customId}" đã tồn tại! Vui lòng sử dụng mã khác.`);
                        }
                        finalItem[businessIdField] = customId.trim().toUpperCase();
                    } else {
                        // ✅ Auto-generate with findNextAvailableBusinessId
                        const digitCount = 6; // All entities use 6 digits
                        const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findNextAvailableBusinessId"])(businessPrefix, existingIds, newBusinessIdCounter, digitCount);
                        finalItem[businessIdField] = result.nextId;
                        newBusinessIdCounter = result.updatedCounter;
                    }
                }
                const now = new Date().toISOString();
                const currentUser = getCurrentUser?.();
                const newItem = {
                    ...finalItem,
                    systemId: newSystemId,
                    createdAt: finalItem.createdAt || now,
                    updatedAt: now,
                    createdBy: finalItem.createdBy || currentUser,
                    updatedBy: currentUser
                };
                // ✅ Update both data and counters atomically
                set((state)=>({
                        data: [
                            ...state.data,
                            newItem
                        ],
                        _counters: {
                            systemId: newSystemIdCounter,
                            businessId: newBusinessIdCounter
                        }
                    }));
                // ✅ Sync to API in background
                if (apiEndpoint) {
                    syncToAPI(apiEndpoint, 'create', newItem).catch(console.error);
                }
                return newItem;
            },
            addMultiple: (items)=>set((state)=>{
                    const now = new Date().toISOString();
                    const currentUser = getCurrentUser?.();
                    const newItems = [];
                    const digitCount = 6; // All entities use 6 digits
                    // ✅ Start from current counters
                    let currentSystemIdCounter = state._counters.systemId;
                    let currentBusinessIdCounter = state._counters.businessId;
                    items.forEach((item)=>{
                        // ✅ Generate SystemId from current counter
                        currentSystemIdCounter++;
                        const newSystemId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createSystemId"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateSystemId"])(entityType, currentSystemIdCounter));
                        // Generate or validate Business ID (if field exists)
                        let finalItem = {
                            ...item
                        };
                        if (businessIdField in item) {
                            const customId = item[businessIdField];
                            // Collect existing IDs (from state + already added in this batch)
                            const existingIds = [
                                ...state.data.map((d)=>d[businessIdField]),
                                ...newItems.map((d)=>d[businessIdField])
                            ];
                            // ✅ If customId provided, validate uniqueness
                            if (customId && customId.trim()) {
                                if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isBusinessIdUnique"])(customId, existingIds)) {
                                    throw new Error(`Mã "${customId}" đã tồn tại! Vui lòng sử dụng mã khác.`);
                                }
                                finalItem[businessIdField] = customId.trim().toUpperCase();
                            } else {
                                // ✅ Auto-generate with findNextAvailableBusinessId
                                const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findNextAvailableBusinessId"])(businessPrefix, existingIds, currentBusinessIdCounter, digitCount);
                                finalItem[businessIdField] = result.nextId;
                                currentBusinessIdCounter = result.updatedCounter;
                            }
                        }
                        newItems.push({
                            ...finalItem,
                            systemId: newSystemId,
                            createdAt: now,
                            updatedAt: now,
                            createdBy: currentUser,
                            updatedBy: currentUser
                        });
                    });
                    // ✅ Update both data and counters
                    const result = {
                        data: [
                            ...state.data,
                            ...newItems
                        ],
                        _counters: {
                            systemId: currentSystemIdCounter,
                            businessId: currentBusinessIdCounter
                        }
                    };
                    // ✅ Sync to API in background (batch)
                    if (apiEndpoint) {
                        newItems.forEach((item)=>{
                            syncToAPI(apiEndpoint, 'create', item).catch(console.error);
                        });
                    }
                    return result;
                }),
            update: (systemId, updatedItem)=>{
                // Validate unique business ID (case-insensitive, skip self)
                if (businessIdField in updatedItem) {
                    const businessId = updatedItem[businessIdField];
                    const existingIds = get().data.filter((d)=>d.systemId !== systemId).map((d)=>d[businessIdField]);
                    if (businessId && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isBusinessIdUnique"])(businessId, existingIds)) {
                        throw new Error(`Mã "${businessId}" đã tồn tại! Vui lòng sử dụng mã khác.`);
                    }
                }
                const now = new Date().toISOString();
                const currentUser = getCurrentUser?.();
                set((state)=>({
                        data: state.data.map((item)=>item.systemId === systemId ? {
                                ...item,
                                ...updatedItem,
                                updatedAt: now,
                                updatedBy: currentUser
                            } : item)
                    }));
                // ✅ Sync to API in background
                if (apiEndpoint) {
                    const fullItem = get().data.find((item)=>item.systemId === systemId);
                    if (fullItem) {
                        syncToAPI(apiEndpoint, 'update', fullItem, systemId).catch(console.error);
                    }
                }
            },
            remove: (systemId)=>{
                // Soft delete - mark as deleted
                const now = new Date().toISOString();
                set((state)=>({
                        data: state.data.map((item)=>item.systemId === systemId ? {
                                ...item,
                                isDeleted: true,
                                deletedAt: now
                            } : item)
                    }));
                // ✅ Sync to API in background
                if (apiEndpoint) {
                    const item = get().data.find((item)=>item.systemId === systemId);
                    if (item) {
                        syncToAPI(apiEndpoint, 'update', {
                            ...item,
                            isDeleted: true,
                            deletedAt: now
                        }, systemId).catch(console.error);
                    }
                }
            },
            hardDelete: (systemId)=>{
                // Permanent delete - remove from array
                set((state)=>({
                        data: state.data.filter((item)=>item.systemId !== systemId)
                    }));
                // ✅ Sync to API in background
                if (apiEndpoint) {
                    syncToAPI(apiEndpoint, 'delete', {
                        systemId
                    }, systemId).catch(console.error);
                }
            },
            restore: (systemId)=>{
                // Restore soft-deleted item
                set((state)=>({
                        data: state.data.map((item)=>item.systemId === systemId ? {
                                ...item,
                                isDeleted: false,
                                deletedAt: null
                            } : item)
                    }));
                // ✅ Sync to API in background
                if (apiEndpoint) {
                    const item = get().data.find((item)=>item.systemId === systemId);
                    if (item) {
                        syncToAPI(apiEndpoint, 'restore', {
                            ...item,
                            isDeleted: false,
                            deletedAt: null
                        }, systemId).catch(console.error);
                    }
                }
            },
            getActive: ()=>get().data.filter((item)=>!item.isDeleted),
            getDeleted: ()=>get().data.filter((item)=>item.isDeleted),
            findById: (id)=>get().data.find((item)=>item.systemId === id || item.id === id),
            // ✅ Load data from database API - OPTIMIZED: No more limit=10000!
            // This is now only used for counter initialization, NOT for loading all data
            // Use React Query hooks for data fetching with proper pagination
            loadFromAPI: async ()=>{
                if (!apiEndpoint) return;
                if (get()._initialized) return;
                try {
                    // Only fetch minimal data needed to initialize counters
                    // Actual data loading should be done via React Query hooks
                    const response = await fetch(`${apiEndpoint}?limit=1&sortBy=systemId&sortOrder=desc`, {
                        credentials: 'include'
                    });
                    if (response.ok) {
                        const json = await response.json();
                        const pagination = json.pagination || {};
                        const lastItem = json.data?.[0];
                        // Initialize counters from the latest item (highest IDs)
                        const newCounters = {
                            systemId: lastItem ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getMaxSystemIdCounter"])([
                                lastItem
                            ], systemIdPrefix) : 0,
                            businessId: lastItem && options?.businessIdField ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getMaxBusinessIdCounter"])([
                                lastItem
                            ], businessPrefix) : 0
                        };
                        set({
                            data: [],
                            _counters: newCounters,
                            _initialized: true
                        });
                        console.log(`[Store Factory] ${apiEndpoint} initialized. Total records: ${pagination.total || 'unknown'}`);
                    }
                } catch (error) {
                    console.error(`[Store Factory] loadFromAPI error for ${apiEndpoint}:`, error);
                    // Still mark as initialized to prevent infinite retry
                    set({
                        _initialized: true
                    });
                }
            }
        });
    // ✅ SIMPLIFIED: No localStorage persistence, database is source of truth
    // Data is loaded via ApiSyncProvider on app init
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])(storeConfig);
};
}),
"[project]/lib/activity-history-helper.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Activity History Helper
 * 
 * Helper để tạo các entry lịch sử hoạt động một cách nhất quán
 * Dùng chung cho tất cả các modules trong hệ thống
 * 
 * NOTE: Đã remove import useEmployeeStore để tránh circular dependency
 * và cải thiện compile time
 */ __turbopack_context__.s([
    "appendHistoryEntry",
    ()=>appendHistoryEntry,
    "createAssignedEntry",
    ()=>createAssignedEntry,
    "createBulkUpdateEntries",
    ()=>createBulkUpdateEntries,
    "createCancelledEntry",
    ()=>createCancelledEntry,
    "createCommentEntry",
    ()=>createCommentEntry,
    "createCreatedEntry",
    ()=>createCreatedEntry,
    "createDeletedEntry",
    ()=>createDeletedEntry,
    "createEndedEntry",
    ()=>createEndedEntry,
    "createHistoryEntry",
    ()=>createHistoryEntry,
    "createPaymentEntry",
    ()=>createPaymentEntry,
    "createProductEntry",
    ()=>createProductEntry,
    "createReopenedEntry",
    ()=>createReopenedEntry,
    "createStatusChangedEntry",
    ()=>createStatusChangedEntry,
    "createUpdatedEntry",
    ()=>createUpdatedEntry,
    "createVerifiedEntry",
    ()=>createVerifiedEntry,
    "getCurrentUserInfo",
    ()=>getCurrentUserInfo,
    "getEmployeeInfo",
    ()=>getEmployeeInfo,
    "getEmployeeInfoFromData",
    ()=>getEmployeeInfoFromData
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-ssr] (ecmascript)");
;
function getCurrentUserInfo() {
    const authInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserInfo"])();
    return {
        systemId: authInfo.systemId || 'SYSTEM',
        name: authInfo.name || 'Hệ thống',
        avatar: undefined
    };
}
function getEmployeeInfoFromData(employeeSystemId, employees) {
    const employee = employees.find((e)=>e.systemId === employeeSystemId);
    if (employee) {
        return {
            systemId: employee.systemId,
            name: employee.fullName,
            avatar: employee.avatarUrl
        };
    }
    // Fallback to system
    return {
        systemId: String(employeeSystemId) || 'SYSTEM',
        name: 'Hệ thống'
    };
}
function getEmployeeInfo(employeeSystemId) {
    // Return minimal info without employee store lookup
    return {
        systemId: String(employeeSystemId) || 'SYSTEM',
        name: 'Hệ thống'
    };
}
function createHistoryEntry(action, userOrDescription, descriptionOrMetadata, metadata) {
    const hasUserObject = typeof userOrDescription === 'object' && userOrDescription !== null;
    const user = hasUserObject ? userOrDescription : getCurrentUserInfo();
    const description = hasUserObject ? descriptionOrMetadata : userOrDescription;
    const meta = hasUserObject ? metadata : descriptionOrMetadata;
    return {
        id: `history-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        action,
        timestamp: new Date(),
        user: {
            systemId: user.systemId,
            name: user.name,
            avatar: user.avatar
        },
        description: description ?? '',
        metadata: meta
    };
}
function createCreatedEntry(user, description) {
    return createHistoryEntry('created', user, description);
}
function createUpdatedEntry(user, description) {
    return createHistoryEntry('updated', user, description);
}
function createStatusChangedEntry(user, oldStatus, newStatus, description) {
    return createHistoryEntry('status_changed', user, description, {
        field: 'status',
        oldValue: oldStatus,
        newValue: newStatus
    });
}
function createDeletedEntry(user, description) {
    return createHistoryEntry('deleted', user, description);
}
function createAssignedEntry(user, description) {
    return createHistoryEntry('assigned', user, description);
}
function createPaymentEntry(user, description) {
    return createHistoryEntry('payment_made', user, description);
}
function createCommentEntry(user, description) {
    return createHistoryEntry('comment_added', user, description);
}
function createCancelledEntry(user, description) {
    return createHistoryEntry('cancelled', user, description);
}
function createVerifiedEntry(user, description) {
    return createHistoryEntry('verified', user, description);
}
function createEndedEntry(user, description) {
    return createHistoryEntry('ended', user, description);
}
function createReopenedEntry(user, description) {
    return createHistoryEntry('reopened', user, description);
}
function createProductEntry(user, action, description) {
    return createHistoryEntry(action, user, description);
}
function appendHistoryEntry(existingHistory, ...newEntries) {
    return [
        ...existingHistory || [],
        ...newEntries
    ];
}
function createBulkUpdateEntries(user, changes) {
    return changes.map((change)=>createHistoryEntry('updated', user, change.description));
}
}),
"[project]/lib/import-export/import-export-store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "selectExportLogs",
    ()=>selectExportLogs,
    "selectExportLogsByEntity",
    ()=>selectExportLogsByEntity,
    "selectImportLogs",
    ()=>selectImportLogs,
    "selectImportLogsByEntity",
    ()=>selectImportLogsByEntity,
    "useImportExportStore",
    ()=>useImportExportStore
]);
/**
 * Import/Export Store
 * 
 * Lưu lịch sử import/export với Zustand persist (localStorage)
 * Khi migrate sang Next.js, sẽ chuyển sang API
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
;
const MAX_LOGS = 200; // Giới hạn để tránh localStorage quá tải
// Generate simple ID
const generateLogId = (prefix)=>{
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `${prefix}_${timestamp}_${random}`;
};
const useImportExportStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((set, get)=>({
        importLogs: [],
        exportLogs: [],
        initialized: false,
        addImportLog: (log)=>{
            const id = generateLogId('IMP');
            const newLog = {
                ...log,
                id
            };
            set((state)=>({
                    importLogs: [
                        newLog,
                        ...state.importLogs
                    ].slice(0, MAX_LOGS)
                }));
            return id;
        },
        addExportLog: (log)=>{
            const id = generateLogId('EXP');
            const newLog = {
                ...log,
                id
            };
            set((state)=>({
                    exportLogs: [
                        newLog,
                        ...state.exportLogs
                    ].slice(0, MAX_LOGS)
                }));
            return id;
        },
        getLogsByEntity: (entityType)=>({
                imports: get().importLogs.filter((l)=>l.entityType === entityType),
                exports: get().exportLogs.filter((l)=>l.entityType === entityType)
            }),
        getRecentLogs: (limit = 50)=>{
            const all = [
                ...get().importLogs.map((l)=>({
                        ...l,
                        _type: 'import'
                    })),
                ...get().exportLogs.map((l)=>({
                        ...l,
                        _type: 'export'
                    }))
            ];
            return all.sort((a, b)=>new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime()).slice(0, limit);
        },
        getImportLogById: (id)=>{
            return get().importLogs.find((l)=>l.id === id);
        },
        getExportLogById: (id)=>{
            return get().exportLogs.find((l)=>l.id === id);
        },
        deleteLog: (id, type)=>{
            if (type === 'import') {
                set((state)=>({
                        importLogs: state.importLogs.filter((l)=>l.id !== id)
                    }));
            } else {
                set((state)=>({
                        exportLogs: state.exportLogs.filter((l)=>l.id !== id)
                    }));
            }
        },
        clearLogs: (entityType)=>{
            if (entityType) {
                set((state)=>({
                        importLogs: state.importLogs.filter((l)=>l.entityType !== entityType),
                        exportLogs: state.exportLogs.filter((l)=>l.entityType !== entityType)
                    }));
            } else {
                set({
                    importLogs: [],
                    exportLogs: []
                });
            }
        },
        loadFromAPI: async ()=>{
            if (get().initialized) return;
            try {
                const response = await fetch('/api/import-export-logs?limit=500');
                if (response.ok) {
                    const json = await response.json();
                    const data = json.data || {};
                    set({
                        importLogs: data.importLogs || [],
                        exportLogs: data.exportLogs || [],
                        initialized: true
                    });
                }
            } catch (error) {
                console.error('[Import Export Store] loadFromAPI error:', error);
            }
        }
    }));
const selectImportLogs = (state)=>state.importLogs;
const selectExportLogs = (state)=>state.exportLogs;
const selectImportLogsByEntity = (entityType)=>(state)=>state.importLogs.filter((l)=>l.entityType === entityType);
const selectExportLogsByEntity = (entityType)=>(state)=>state.exportLogs.filter((l)=>l.entityType === entityType); // ============================================
 // FUTURE: API Service (Next.js migration)
 // ============================================
 // 
 // export async function saveImportLog(log: Omit<ImportLogEntry, 'id'>) {
 //   return fetch('/api/import-export/logs', {
 //     method: 'POST',
 //     headers: { 'Content-Type': 'application/json' },
 //     body: JSON.stringify({ type: 'import', ...log }),
 //   }).then(r => r.json());
 // }
 // 
 // export async function getImportExportLogs(params: {
 //   entityType?: string;
 //   type?: 'import' | 'export';
 //   limit?: number;
 // }) {
 //   const query = new URLSearchParams(params as Record<string, string>);
 //   return fetch(`/api/import-export/logs?${query}`).then(r => r.json());
 // }
}),
"[project]/lib/import-export/employee-mapping-store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "saveMappingsFromAutoMap",
    ()=>saveMappingsFromAutoMap,
    "useEmployeeMappingStore",
    ()=>useEmployeeMappingStore
]);
/**
 * Employee Mapping Store
 * 
 * Lưu mapping giữa tên NV máy chấm công → Mã NV hệ thống
 * Mapping được lưu để tái sử dụng cho các lần import sau
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
;
// Generate simple ID
const generateMappingId = ()=>{
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 6);
    return `MAP_${timestamp}_${random}`;
};
/**
 * Normalize tên để so sánh (lowercase, remove diacritics, trim)
 */ function normalizeName(name) {
    return name.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/đ/g, 'd').replace(/Đ/g, 'D').replace(/\s+/g, ' '); // Normalize spaces
}
/**
 * Check if two names match (fuzzy matching)
 */ function namesMatch(machineName, systemName) {
    const normalizedMachine = normalizeName(machineName);
    const normalizedSystem = normalizeName(systemName);
    // Exact match
    if (normalizedMachine === normalizedSystem) return true;
    // Machine name is part of system name
    if (normalizedSystem.includes(normalizedMachine)) return true;
    // System name parts match machine name
    const systemParts = normalizedSystem.split(' ');
    const machineParts = normalizedMachine.split(' ');
    // Check if all machine parts are in system name
    const allPartsMatch = machineParts.every((part)=>systemParts.some((sp)=>sp === part || sp.includes(part) || part.includes(sp)));
    if (allPartsMatch && machineParts.length >= 2) return true;
    // Check last name + first name match
    // VD: "duc dat" matches "Nguyễn Đức Đạt" (đức đạt)
    if (systemParts.length >= 2 && machineParts.length >= 2) {
        const systemLastParts = systemParts.slice(-2).join(' ');
        if (normalizedMachine === systemLastParts) return true;
    }
    return false;
}
const useEmployeeMappingStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((set, get)=>({
        mappings: [],
        initialized: false,
        addMapping: (entry)=>{
            const id = generateMappingId();
            const now = new Date().toISOString();
            const newEntry = {
                ...entry,
                id,
                createdAt: now,
                updatedAt: now
            };
            set((state)=>({
                    mappings: [
                        ...state.mappings,
                        newEntry
                    ]
                }));
            return id;
        },
        updateMapping: (id, updates)=>{
            set((state)=>({
                    mappings: state.mappings.map((m)=>m.id === id ? {
                            ...m,
                            ...updates,
                            updatedAt: new Date().toISOString()
                        } : m)
                }));
        },
        deleteMapping: (id)=>{
            set((state)=>({
                    mappings: state.mappings.filter((m)=>m.id !== id)
                }));
        },
        addMappings: (entries)=>{
            const now = new Date().toISOString();
            const newEntries = entries.map((entry)=>({
                    ...entry,
                    id: generateMappingId(),
                    createdAt: now,
                    updatedAt: now
                }));
            set((state)=>({
                    mappings: [
                        ...state.mappings,
                        ...newEntries
                    ]
                }));
        },
        clearMappings: ()=>{
            set({
                mappings: []
            });
        },
        findByMachineName: (machineName)=>{
            const normalized = normalizeName(machineName);
            return get().mappings.find((m)=>normalizeName(m.machineName) === normalized);
        },
        findByMachineId: (machineId)=>{
            return get().mappings.find((m)=>m.machineEmployeeId === machineId);
        },
        findBySystemId: (systemId)=>{
            return get().mappings.find((m)=>m.systemEmployeeId === systemId);
        },
        autoMapEmployees: (machineNames, systemEmployees)=>{
            const mapped = [];
            const unmapped = [];
            const existingMappings = get().mappings;
            for (const machineName of machineNames){
                // 1. Check existing mapping first
                const existingMapping = existingMappings.find((m)=>normalizeName(m.machineName) === normalizeName(machineName));
                if (existingMapping) {
                    mapped.push({
                        machineName,
                        systemId: existingMapping.systemEmployeeId,
                        systemName: existingMapping.systemEmployeeName
                    });
                    continue;
                }
                // 2. Try to auto-match with system employees
                const matchedEmployee = systemEmployees.find((emp)=>namesMatch(machineName, emp.fullName));
                if (matchedEmployee) {
                    mapped.push({
                        machineName,
                        systemId: matchedEmployee.businessId,
                        systemName: matchedEmployee.fullName
                    });
                } else {
                    unmapped.push(machineName);
                }
            }
            return {
                mapped,
                unmapped
            };
        },
        loadFromAPI: async ()=>{
            if (get().initialized) return;
            try {
                // NOTE: Employee mappings are typically small dataset
                const response = await fetch('/api/employee-mappings?limit=100');
                if (response.ok) {
                    const json = await response.json();
                    const data = json.data || [];
                    if (data.length > 0) {
                        set({
                            mappings: data,
                            initialized: true
                        });
                    } else {
                        set({
                            initialized: true
                        });
                    }
                }
            } catch (error) {
                console.error('[Employee Mapping Store] loadFromAPI error:', error);
            }
        }
    }));
function saveMappingsFromAutoMap(autoMapResult, machineIds) {
    const store = useEmployeeMappingStore.getState();
    const newMappings = autoMapResult.mapped.filter((m)=>!store.findByMachineName(m.machineName)) // Skip existing
    .map((m)=>({
            machineEmployeeId: machineIds.get(m.machineName) || 0,
            machineName: m.machineName,
            systemEmployeeId: m.systemId,
            systemEmployeeName: m.systemName
        }));
    if (newMappings.length > 0) {
        store.addMappings(newMappings);
    }
}
}),
"[project]/lib/import-export/utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Import/Export Utilities
 * 
 * Các hàm tiện ích cho import/export:
 * - Preview (rà soát) dữ liệu trước khi import
 * - Validate fields và rows
 * - Transform data
 */ __turbopack_context__.s([
    "checkUniqueFields",
    ()=>checkUniqueFields,
    "formatFileSize",
    ()=>formatFileSize,
    "generateExportFileName",
    ()=>generateExportFileName,
    "previewImportData",
    ()=>previewImportData,
    "transformExportRow",
    ()=>transformExportRow,
    "transformImportRow",
    ()=>transformImportRow,
    "validateField",
    ()=>validateField
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-ssr] (ecmascript)");
;
function previewImportData(rawRows, config, existingData, mode = 'upsert', branchSystemId) {
    const rows = [];
    let validCount = 0;
    let warningCount = 0;
    let errorCount = 0;
    let duplicateCount = 0;
    // 0. Pre-process all rows if defined (for fill-down logic, multi-row grouping)
    let processedRawRows = rawRows;
    if (config.preProcessRows) {
        processedRawRows = config.preProcessRows(rawRows);
    }
    processedRawRows.forEach((rawData, index)=>{
        const rowErrors = [];
        const rowWarnings = [];
        // 0.5. Apply preTransformRawRow if defined (normalize/merge raw columns)
        let normalizedRawData = rawData;
        if (config.preTransformRawRow) {
            normalizedRawData = config.preTransformRawRow(rawData);
        }
        // 1. Transform raw data to typed data
        let transformedData = transformImportRow(normalizedRawData, config.fields);
        // 1.5. Apply postTransformRow if defined (enrich data, lookup IDs, etc.)
        if (config.postTransformRow) {
            transformedData = config.postTransformRow(transformedData, index, branchSystemId);
        }
        // 2. Validate từng field theo config
        for (const field of config.fields){
            if (field.hidden) continue; // Skip hidden fields
            const value = transformedData[field.key];
            const fieldErrors = validateField(value, field, transformedData);
            // Separate warnings from errors (warnings start with [Warning])
            fieldErrors.forEach((err)=>{
                if (err.message.startsWith('[Warning]')) {
                    rowWarnings.push({
                        ...err,
                        message: err.message.replace('[Warning] ', '')
                    });
                } else {
                    rowErrors.push(err);
                }
            });
        }
        // 3. Validate row-level (custom validation) - pass mode so it can skip duplicate checks in upsert
        if (config.validateRow) {
            const rowLevelErrors = config.validateRow(transformedData, index, existingData, mode);
            rowLevelErrors.forEach((err)=>{
                if (err.message.startsWith('[Warning]')) {
                    rowWarnings.push({
                        ...err,
                        message: err.message.replace('[Warning] ', '')
                    });
                } else {
                    rowErrors.push(err);
                }
            });
        }
        // 4. Check existing record (upsert logic)
        let existingRecord = null;
        let isExisting = false;
        let status = 'valid';
        if (config.findExisting) {
            existingRecord = config.findExisting(transformedData, existingData);
        } else if (config.upsertKey) {
            // Default: find by upsertKey
            const businessId = transformedData[config.upsertKey];
            existingRecord = existingData.find((e)=>e[config.upsertKey] === businessId) || null;
        }
        isExisting = existingRecord !== null;
        // 5. Determine status based on mode and validation
        if (rowErrors.length > 0) {
            status = 'error';
            errorCount++;
        } else if (isExisting) {
            if (mode === 'insert-only') {
                status = 'duplicate';
                duplicateCount++;
            } else if (mode === 'update-only' || mode === 'upsert') {
                status = 'will-update';
                if (rowWarnings.length > 0) {
                    status = 'warning';
                    warningCount++;
                } else {
                    validCount++;
                }
            }
        } else {
            if (mode === 'update-only') {
                status = 'error';
                errorCount++;
                rowErrors.push({
                    message: 'Không tìm thấy record để cập nhật'
                });
            } else if (mode === 'insert-only' || mode === 'upsert') {
                status = 'will-insert';
                if (rowWarnings.length > 0) {
                    status = 'warning';
                    warningCount++;
                } else {
                    validCount++;
                }
            }
        }
        rows.push({
            rowNumber: index + 2,
            rawData,
            transformedData: rowErrors.length > 0 ? null : transformedData,
            status,
            errors: rowErrors,
            warnings: rowWarnings,
            isExisting,
            existingRecord: existingRecord || undefined
        });
    });
    return {
        rows,
        totalRows: rawRows.length,
        validCount,
        warningCount,
        errorCount,
        duplicateCount,
        isValid: validCount + warningCount > 0
    };
}
function validateField(value, field, row) {
    const errors = [];
    const fieldKey = field.key;
    // Check required
    if (field.required && (value === undefined || value === null || value === '')) {
        errors.push({
            field: fieldKey,
            message: `${field.label} là bắt buộc`
        });
        return errors; // Skip other validations if required field is empty
    }
    // Skip validation if value is empty and not required
    if (value === undefined || value === null || value === '') {
        return errors;
    }
    // Type-specific validation
    switch(field.type){
        case 'email':
            if (typeof value === 'string' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                errors.push({
                    field: fieldKey,
                    message: `${field.label} không đúng định dạng email`
                });
            }
            break;
        case 'phone':
            if (typeof value === 'string') {
                const cleaned = value.replace(/\s/g, '');
                if (!/^0\d{9,10}$/.test(cleaned)) {
                    errors.push({
                        field: fieldKey,
                        message: `${field.label} không đúng định dạng SĐT`
                    });
                }
            }
            break;
        case 'number':
            if (typeof value !== 'number' && isNaN(Number(value))) {
                errors.push({
                    field: fieldKey,
                    message: `${field.label} phải là số`
                });
            }
            break;
        case 'date':
            if (typeof value === 'string') {
                const date = new Date(value);
                if (isNaN(date.getTime())) {
                    errors.push({
                        field: fieldKey,
                        message: `${field.label} không đúng định dạng ngày`
                    });
                }
            }
            break;
        case 'enum':
            if (field.enumValues && !field.enumValues.includes(String(value))) {
                errors.push({
                    field: fieldKey,
                    message: `${field.label} phải là một trong: ${field.enumValues.join(', ')}`
                });
            }
            break;
        case 'boolean':
            const boolValues = [
                'true',
                'false',
                '1',
                '0',
                'yes',
                'no',
                'có',
                'không'
            ];
            if (typeof value === 'string' && !boolValues.includes(value.toLowerCase())) {
                errors.push({
                    field: fieldKey,
                    message: `${field.label} phải là Có/Không`
                });
            }
            break;
    }
    // Custom validator
    if (field.validator) {
        const customError = field.validator(value, row);
        if (customError && customError !== true) {
            errors.push({
                field: fieldKey,
                message: customError
            });
        }
    }
    return errors;
}
// ============================================
// DATA TRANSFORMATION
// ============================================
/**
 * Set nested value in object using dot notation key
 * e.g., setNestedValue(obj, 'permanentAddress.street', '123 ABC')
 */ function setNestedValue(obj, path, value) {
    const keys = path.split('.');
    let current = obj;
    for(let i = 0; i < keys.length - 1; i++){
        const key = keys[i];
        if (current[key] === undefined) {
            current[key] = {};
        }
        current = current[key];
    }
    current[keys[keys.length - 1]] = value;
}
/**
 * Get nested value from object using dot notation key
 * e.g., getNestedValue(obj, 'permanentAddress.street')
 */ function getNestedValue(obj, path) {
    if (!obj || typeof obj !== 'object') return undefined;
    const keys = path.split('.');
    let current = obj;
    for (const key of keys){
        if (current === undefined || current === null) return undefined;
        current = current[key];
    }
    return current;
}
function transformImportRow(row, fields) {
    const result = {};
    for (const field of fields){
        const key = field.key;
        let value = row[field.label] ?? row[key]; // Try label first, then key
        // Apply import transform
        if (field.importTransform && value !== undefined) {
            value = field.importTransform(value);
        } else {
            // Default transforms
            switch(field.type){
                case 'number':
                    value = value !== undefined && value !== '' ? Number(value) || 0 : undefined;
                    break;
                case 'boolean':
                    if (typeof value === 'string') {
                        value = [
                            'true',
                            '1',
                            'yes',
                            'có'
                        ].includes(value.toLowerCase());
                    }
                    break;
                case 'date':
                    // Excel serial date → ISO string
                    if (typeof value === 'number') {
                        const date = new Date((value - 25569) * 86400 * 1000);
                        value = date.toISOString().split('T')[0];
                    }
                    break;
            }
        }
        // Apply default value if empty
        if ((value === undefined || value === null || value === '') && field.defaultValue !== undefined) {
            value = field.defaultValue;
        }
        if (value !== undefined && value !== '') {
            // Support nested keys like 'permanentAddress.street'
            if (key.includes('.')) {
                setNestedValue(result, key, value);
            } else {
                result[key] = value;
            }
        }
    }
    return result;
}
function transformExportRow(row, fields, selectedColumns) {
    const result = {};
    for (const field of fields){
        // Skip if not selected
        if (selectedColumns && !selectedColumns.includes(field.key)) {
            continue;
        }
        // Skip if not exportable
        if (field.exportable === false) {
            continue;
        }
        const key = field.key;
        // Support nested keys like 'permanentAddress.street'
        let value = key.includes('.') ? getNestedValue(row, key) : row[key];
        // Apply export transform
        if (field.exportTransform && value !== undefined) {
            value = field.exportTransform(value);
        } else if (field.transform && value !== undefined) {
            // Also use 'transform' for display purposes
            value = field.transform(value);
        } else {
            // Default transforms
            switch(field.type){
                case 'date':
                    if (value) {
                        value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDateForDisplay"])(value);
                    }
                    break;
                case 'boolean':
                    value = value ? 'Có' : 'Không';
                    break;
            }
        }
        result[field.label] = value;
    }
    return result;
}
function checkUniqueFields(row, uniqueFields, existingData, currentBusinessId) {
    const errors = [];
    for (const field of uniqueFields){
        const value = row[field];
        if (!value) continue;
        const duplicate = existingData.find((e)=>{
            // Skip if same record (updating)
            if (currentBusinessId && e[field] === currentBusinessId) {
                return false;
            }
            return e[field] === value;
        });
        if (duplicate) {
            errors.push({
                field: field,
                message: `${field} đã được sử dụng`
            });
        }
    }
    return errors;
}
function generateExportFileName(entityDisplayName, scope) {
    const date = new Date().toISOString().split('T')[0];
    const scopeLabel = scope === 'all' ? 'TatCa' : scope === 'current-page' ? 'TrangHienTai' : 'DaLoc';
    return `${entityDisplayName.replace(/\s+/g, '_')}_${scopeLabel}_${date}.xlsx`;
}
function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = [
        'B',
        'KB',
        'MB',
        'GB'
    ];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
}),
"[project]/lib/import-export/attendance-parser.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getAvailableSheets",
    ()=>getAvailableSheets,
    "parseAttendanceFile",
    ()=>parseAttendanceFile,
    "parseWorkDays",
    ()=>parseWorkDays,
    "previewSheet",
    ()=>previewSheet
]);
/**
 * Attendance Parser
 * 
 * Parser riêng cho file từ máy chấm công
 * File có format đặc biệt: header phức tạp, merged cells, etc.
 * 
 * Cấu trúc file t11.xls:
 * - Sheet "Bảng tổng hợp chấm công": Tổng hợp theo tháng (DÙNG CHÍNH)
 * - Row 0: Tiêu đề
 * - Row 1: Ngày thống kê (VD: "Ngày thống kê:2025-11-01~2025-11-30")
 * - Row 2-3: Headers
 * - Row 4+: Dữ liệu nhân viên
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/xlsx/xlsx.mjs [app-ssr] (ecmascript)");
;
function parseAttendanceFile(file) {
    try {
        const workbook = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["read"](file, {
            type: 'array'
        });
        // Tìm sheet "Bảng tổng hợp chấm công"
        const sheetName = 'Bảng tổng hợp chấm công';
        const sheet = workbook.Sheets[sheetName];
        if (!sheet) {
            return {
                success: false,
                data: [],
                month: 0,
                year: 0,
                dateRange: {
                    from: '',
                    to: ''
                },
                errors: [
                    {
                        row: 0,
                        message: `Không tìm thấy sheet "${sheetName}"`
                    }
                ]
            };
        }
        // Convert to array
        const rawData = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["utils"].sheet_to_json(sheet, {
            header: 1
        });
        // Parse date range từ row 1
        const dateRangeRow = rawData[1];
        const dateRange = parseDateRange(dateRangeRow?.[0] || '');
        // Parse data từ row 4 trở đi
        const data = [];
        const errors = [];
        for(let i = 4; i < rawData.length; i++){
            const row = rawData[i];
            if (!row || row.length === 0) continue;
            // Skip if no employee ID
            const machineId = row[0];
            if (machineId === undefined || machineId === null || machineId === '') continue;
            try {
                const parsed = parseAttendanceRow(row, i + 1); // Excel row = index + 1
                data.push(parsed);
            } catch (err) {
                errors.push({
                    row: i + 1,
                    message: err instanceof Error ? err.message : 'Lỗi không xác định'
                });
            }
        }
        return {
            success: errors.length === 0,
            data,
            month: dateRange.month,
            year: dateRange.year,
            dateRange: {
                from: dateRange.from,
                to: dateRange.to
            },
            errors
        };
    } catch (err) {
        return {
            success: false,
            data: [],
            month: 0,
            year: 0,
            dateRange: {
                from: '',
                to: ''
            },
            errors: [
                {
                    row: 0,
                    message: `Lỗi đọc file: ${err instanceof Error ? err.message : 'Unknown'}`
                }
            ]
        };
    }
}
/**
 * Parse date range từ string "Ngày thống kê:2025-11-01~2025-11-30"
 */ function parseDateRange(text) {
    const match = text.match(/(\d{4}-\d{2}-\d{2})~(\d{4}-\d{2}-\d{2})/);
    if (match) {
        const from = match[1];
        const to = match[2];
        const [year, month] = from.split('-').map(Number);
        return {
            from,
            to,
            month,
            year
        };
    }
    // Default to current month
    const now = new Date();
    return {
        from: '',
        to: '',
        month: now.getMonth() + 1,
        year: now.getFullYear()
    };
}
/**
 * Parse một dòng dữ liệu nhân viên
 * 
 * Cột trong file:
 * A (0): Mã NV (máy)
 * B (1): Họ tên
 * C (2): Phòng ban
 * D (3): TG làm việc chuẩn
 * E (4): TG làm việc thực tế
 * F (5): Đến muộn (lần)
 * G (6): Đến muộn (phút)
 * H (7): Về sớm (lần)
 * I (8): Về sớm (phút)
 * J (9): Tăng ca bình thường
 * K (10): Tăng ca đặc biệt
 * L (11): Số ngày (chuẩn/thực)
 * M (12): Công tác
 * N (13): Nghỉ không phép
 * O (14): Nghỉ phép
 */ function parseAttendanceRow(row, excelRow) {
    const getNumber = (value)=>{
        if (value === undefined || value === null || value === '') return 0;
        const num = Number(value);
        return isNaN(num) ? 0 : num;
    };
    const getString = (value)=>{
        if (value === undefined || value === null) return '';
        return String(value).trim();
    };
    return {
        machineEmployeeId: getNumber(row[0]),
        employeeName: getString(row[1]),
        department: getString(row[2]),
        standardHours: getNumber(row[3]),
        actualHours: getNumber(row[4]),
        lateCount: getNumber(row[5]),
        lateMinutes: getNumber(row[6]),
        earlyLeaveCount: getNumber(row[7]),
        earlyLeaveMinutes: getNumber(row[8]),
        overtimeNormal: getNumber(row[9]),
        overtimeSpecial: getNumber(row[10]),
        workDays: getString(row[11]),
        businessTrip: getNumber(row[12]),
        absentWithoutLeave: getNumber(row[13]),
        paidLeave: getNumber(row[14])
    };
}
function parseWorkDays(workDays) {
    const cleaned = workDays.replace(/\s/g, '');
    const match = cleaned.match(/(\d+)\/(\d+)/);
    if (match) {
        return {
            standard: parseInt(match[1], 10),
            actual: parseInt(match[2], 10)
        };
    }
    return {
        standard: 0,
        actual: 0
    };
}
function getAvailableSheets(file) {
    const workbook = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["read"](file, {
        type: 'array'
    });
    return workbook.SheetNames;
}
function previewSheet(file, sheetName, maxRows = 10) {
    const workbook = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["read"](file, {
        type: 'array'
    });
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) return [];
    const data = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["utils"].sheet_to_json(sheet, {
        header: 1
    });
    return data.slice(0, maxRows);
}
}),
"[project]/lib/seed-audit.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_SEED_AUTHOR",
    ()=>DEFAULT_SEED_AUTHOR,
    "buildSeedAuditFields",
    ()=>buildSeedAuditFields
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
;
const DEFAULT_SEED_AUTHOR = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000001');
const buildSeedAuditFields = ({ createdAt, createdBy = DEFAULT_SEED_AUTHOR, updatedAt, updatedBy })=>({
        createdAt,
        updatedAt: updatedAt ?? createdAt,
        createdBy,
        updatedBy: updatedBy ?? createdBy
    });
}),
"[project]/lib/import-export/address-lookup.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "enrichEmployeeAddresses",
    ()=>enrichEmployeeAddresses,
    "findDistrictByName",
    ()=>findDistrictByName,
    "findProvinceByName",
    ()=>findProvinceByName,
    "findWardByName",
    ()=>findWardByName,
    "lookupAddressIds",
    ()=>lookupAddressIds
]);
/**
 * Address Lookup Helper for Import
 * 
 * Chuyển đổi tên địa chỉ thành ID để form edit có thể populate đúng dropdown
 * 
 * LƯU Ý QUAN TRỌNG:
 * - Dữ liệu 2-level: 34 tỉnh mới (provinces-data) + wards-2level-data
 * - Dữ liệu 3-level: 63 tỉnh cũ (wards-3level-data có provinceName riêng)
 * - Cần lookup từ WARD trước để lấy đúng provinceId/districtId từ ward data
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$provinces$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/provinces/store.ts [app-ssr] (ecmascript)");
;
// Common aliases for provinces
// KEY = name in provinces-data (TP HCM, Hà Nội, etc.)
// VALUES = all possible variants including 3-level names
const PROVINCE_ALIASES = {
    'TP HCM': [
        'tp hcm',
        'tphcm',
        'hcm',
        'sai gon',
        'saigon',
        'thanh pho ho chi minh',
        'tp ho chi minh',
        'ho chi minh',
        'thành phố hồ chí minh'
    ],
    'Hà Nội': [
        'ha noi',
        'hanoi',
        'hn',
        'thanh pho ha noi',
        'tp ha noi',
        'thành phố hà nội'
    ],
    'Đà Nẵng': [
        'da nang',
        'danang',
        'thanh pho da nang',
        'tp da nang',
        'thành phố đà nẵng'
    ],
    'Hải Phòng': [
        'hai phong',
        'haiphong',
        'hp',
        'thanh pho hai phong',
        'tp hai phong',
        'thành phố hải phòng'
    ],
    'Cần Thơ': [
        'can tho',
        'cantho',
        'thanh pho can tho',
        'tp can tho',
        'thành phố cần thơ'
    ]
};
/**
 * Normalize tên để so sánh (bỏ dấu, lowercase)
 */ function normalizeText(text) {
    return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').trim();
}
/**
 * So sánh 2 string đã normalize
 */ function matchText(a, b) {
    return normalizeText(a) === normalizeText(b);
}
function findProvinceByName(provinceName) {
    if (!provinceName) return null;
    const store = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$provinces$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProvinceStore"].getState();
    const provinces = store.data;
    // Exact match first
    let found = provinces.find((p)=>p.name === provinceName);
    if (found) return {
        id: found.id,
        name: found.name
    };
    // Normalized match
    found = provinces.find((p)=>matchText(p.name, provinceName));
    if (found) return {
        id: found.id,
        name: found.name
    };
    // Try alias match
    const normalizedInput = normalizeText(provinceName);
    for (const [standardName, aliases] of Object.entries(PROVINCE_ALIASES)){
        if (aliases.some((alias)=>alias === normalizedInput || normalizedInput.includes(alias) || alias.includes(normalizedInput))) {
            found = provinces.find((p)=>p.name === standardName);
            if (found) return {
                id: found.id,
                name: found.name
            };
        }
    }
    // Partial match (contains) - last resort
    found = provinces.find((p)=>normalizeText(p.name).includes(normalizedInput) || normalizedInput.includes(normalizeText(p.name)));
    return found ? {
        id: found.id,
        name: found.name
    } : null;
}
/**
 * Remove common prefixes from district/ward names for better matching
 */ function removeCommonPrefixes(text) {
    const prefixes = [
        'quan ',
        'huyen ',
        'thi xa ',
        'thanh pho ',
        'tp ',
        'phuong ',
        'xa ',
        'thi tran ',
        'tt '
    ];
    const normalized = normalizeText(text);
    for (const prefix of prefixes){
        if (normalized.startsWith(prefix)) {
            return normalized.slice(prefix.length);
        }
    }
    return normalized;
}
function findDistrictByName(districtName, provinceId) {
    if (!districtName || !provinceId) return null;
    const store = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$provinces$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProvinceStore"].getState();
    const districts = store.districts.filter((d)=>d.provinceId === provinceId);
    // Exact match first
    let found = districts.find((d)=>d.name === districtName);
    if (found) return {
        id: found.id,
        name: found.name
    };
    // Normalized match
    found = districts.find((d)=>matchText(d.name, districtName));
    if (found) return {
        id: found.id,
        name: found.name
    };
    // Try matching without prefixes
    const inputWithoutPrefix = removeCommonPrefixes(districtName);
    found = districts.find((d)=>{
        const dbWithoutPrefix = removeCommonPrefixes(d.name);
        return dbWithoutPrefix === inputWithoutPrefix;
    });
    if (found) return {
        id: found.id,
        name: found.name
    };
    // Partial match - last resort
    const normalizedInput = normalizeText(districtName);
    found = districts.find((d)=>normalizeText(d.name).includes(normalizedInput) || normalizedInput.includes(normalizeText(d.name)));
    return found ? {
        id: found.id,
        name: found.name
    } : null;
}
function findWardByName(wardName, provinceId, districtId, inputLevel) {
    if (!wardName || !provinceId) return null;
    const store = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$provinces$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProvinceStore"].getState();
    let wards = store.wards.filter((w)=>w.provinceId === provinceId);
    // Filter by level
    if (inputLevel === '3-level' && districtId) {
        wards = wards.filter((w)=>w.level === '3-level' && w.districtId === districtId);
    } else if (inputLevel === '2-level') {
        wards = wards.filter((w)=>w.level === '2-level');
    }
    // Exact match first
    let found = wards.find((w)=>w.name === wardName);
    if (found) {
        return {
            id: found.id,
            name: found.name,
            districtId: found.districtId,
            districtName: found.districtName
        };
    }
    // Normalized match
    found = wards.find((w)=>matchText(w.name, wardName));
    if (found) {
        return {
            id: found.id,
            name: found.name,
            districtId: found.districtId,
            districtName: found.districtName
        };
    }
    // Try matching without prefixes
    const inputWithoutPrefix = removeCommonPrefixes(wardName);
    found = wards.find((w)=>{
        const dbWithoutPrefix = removeCommonPrefixes(w.name);
        return dbWithoutPrefix === inputWithoutPrefix;
    });
    if (found) {
        return {
            id: found.id,
            name: found.name,
            districtId: found.districtId,
            districtName: found.districtName
        };
    }
    // Partial match - last resort
    const normalizedInput = normalizeText(wardName);
    found = wards.find((w)=>normalizeText(w.name).includes(normalizedInput) || normalizedInput.includes(normalizeText(w.name)));
    return found ? {
        id: found.id,
        name: found.name,
        districtId: found.districtId,
        districtName: found.districtName
    } : null;
}
function lookupAddressIds(address) {
    if (!address) return null;
    if (!address.street && !address.province && !address.ward) return null;
    const inputLevel = address.inputLevel || '3-level';
    const store = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$provinces$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProvinceStore"].getState();
    console.log('[lookupAddressIds] Input address:', address);
    console.log('[lookupAddressIds] inputLevel:', inputLevel);
    let provinceId = address.provinceId || '';
    let provinceName = address.province || '';
    let districtId = address.districtId || 0;
    let districtName = address.district || '';
    let wardId = address.wardId || '';
    let wardName = address.ward || '';
    // === STRATEGY: Lookup từ ward trước (có đầy đủ thông tin) ===
    if (address.ward) {
        const allWards = store.wards;
        const normalizedWardInput = normalizeText(address.ward);
        const wardWithoutPrefix = removeCommonPrefixes(address.ward);
        // Filter wards by level
        const wardsOfLevel = allWards.filter((w)=>inputLevel === '2-level' ? w.level === '2-level' : w.level === '3-level');
        // Try to find ward matching name AND province/district context
        let foundWard = wardsOfLevel.find((w)=>{
            const nameMatch = w.name === address.ward || matchText(w.name, address.ward) || removeCommonPrefixes(w.name) === wardWithoutPrefix;
            if (!nameMatch) return false;
            // If province name provided, check if it matches ward's province
            if (address.province) {
                const normalizedProvince = normalizeText(address.province);
                const wardProvince = normalizeText(w.provinceName || '');
                // Check various matching patterns
                if (!wardProvince.includes(normalizedProvince) && !normalizedProvince.includes(wardProvince) && !matchProvinceAlias(address.province, w.provinceName || '')) {
                    return false;
                }
            }
            // If district name provided (3-level), check if it matches
            if (inputLevel === '3-level' && address.district && w.districtName) {
                const normalizedDistrict = normalizeText(address.district);
                const wardDistrict = normalizeText(w.districtName);
                const districtWithoutPrefix = removeCommonPrefixes(address.district);
                const wardDistrictWithoutPrefix = removeCommonPrefixes(w.districtName);
                if (!wardDistrict.includes(normalizedDistrict) && !normalizedDistrict.includes(wardDistrict) && wardDistrictWithoutPrefix !== districtWithoutPrefix) {
                    return false;
                }
            }
            return true;
        });
        // If not found with context, try just by ward name
        if (!foundWard) {
            foundWard = wardsOfLevel.find((w)=>w.name === address.ward || matchText(w.name, address.ward) || removeCommonPrefixes(w.name) === wardWithoutPrefix);
        }
        if (foundWard) {
            console.log('[lookupAddressIds] Found ward:', foundWard);
            wardId = foundWard.id;
            wardName = foundWard.name;
            // IMPORTANT: Get provinceId from provinces-data (not from ward's provinceId)
            // because ward data might have different provinceId (e.g. "00" vs "24" for HCM)
            const provinceFromData = findProvinceByName(foundWard.provinceName || address.province || '');
            if (provinceFromData) {
                provinceId = provinceFromData.id;
                provinceName = provinceFromData.name;
            } else {
                // Fallback to ward's data if not found in provinces-data
                provinceId = foundWard.provinceId;
                provinceName = foundWard.provinceName || address.province || '';
            }
            if (foundWard.districtId) {
                districtId = foundWard.districtId;
                districtName = foundWard.districtName || address.district || '';
            }
        } else {
            console.log('[lookupAddressIds] Ward NOT FOUND for:', address.ward);
        }
    }
    // === Fallback: If no ward found, try province lookup ===
    if (!wardId && address.province) {
        const province = findProvinceByName(address.province);
        if (province) {
            provinceId = province.id;
            provinceName = province.name;
        }
        // Try district lookup if province found
        if (provinceId && address.district && inputLevel === '3-level') {
            const district = findDistrictByName(address.district, provinceId);
            if (district) {
                districtId = district.id;
                districtName = district.name;
            }
        }
    }
    console.log('[lookupAddressIds] Result:', {
        provinceId,
        provinceName,
        districtId,
        districtName,
        wardId,
        wardName
    });
    return {
        street: address.street || '',
        province: provinceName,
        provinceId: provinceId,
        district: districtName,
        districtId: districtId,
        ward: wardName,
        wardId: wardId,
        inputLevel: inputLevel
    };
}
/**
 * Check if province names match (including aliases)
 */ function matchProvinceAlias(input, dbName) {
    const normalizedInput = normalizeText(input);
    const normalizedDb = normalizeText(dbName);
    // Direct match
    if (normalizedInput === normalizedDb) return true;
    // Check aliases
    for (const [standardName, aliases] of Object.entries(PROVINCE_ALIASES)){
        const normalizedStandard = normalizeText(standardName);
        const inputIsAlias = aliases.some((a)=>a === normalizedInput || normalizedInput.includes(a));
        const dbIsStandard = normalizedDb === normalizedStandard || normalizedDb.includes(normalizedStandard);
        const dbIsAlias = aliases.some((a)=>normalizedDb.includes(a));
        if (inputIsAlias && (dbIsStandard || dbIsAlias)) return true;
        if (dbIsAlias && normalizedInput === normalizedStandard) return true;
    }
    return false;
}
function enrichEmployeeAddresses(data) {
    const result = {
        ...data
    };
    console.log('[Address Lookup] Input:', {
        permanentAddress: data.permanentAddress,
        temporaryAddress: data.temporaryAddress
    });
    if (data.permanentAddress) {
        const enriched = lookupAddressIds(data.permanentAddress);
        console.log('[Address Lookup] permanentAddress enriched:', enriched);
        if (enriched) {
            result.permanentAddress = enriched;
        }
    }
    if (data.temporaryAddress) {
        const enriched = lookupAddressIds(data.temporaryAddress);
        console.log('[Address Lookup] temporaryAddress enriched:', enriched);
        if (enriched) {
            result.temporaryAddress = enriched;
        }
    }
    return result;
}
}),
"[project]/lib/import-export/configs/employee.config.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "employeeConfig",
    ()=>employeeConfig,
    "employeeFields",
    ()=>employeeFields,
    "employeeImportExportConfig",
    ()=>employeeImportExportConfig
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$export$2f$address$2d$lookup$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/import-export/address-lookup.ts [app-ssr] (ecmascript)");
;
function parseEmployeeAddresses(rawRow) {
    const addresses = [];
    // Địa chỉ thường trú
    const permanentProvince = rawRow['Tỉnh/TP thường trú'];
    const permanentWard = rawRow['Phường/Xã thường trú'];
    const permanentStreet = rawRow['Số nhà, đường thường trú'];
    if (permanentProvince || permanentWard || permanentStreet) {
        addresses.push({
            type: 'permanent',
            province: String(permanentProvince || ''),
            ward: String(permanentWard || ''),
            street: String(permanentStreet || '')
        });
    }
    // Địa chỉ tạm trú
    const temporaryProvince = rawRow['Tỉnh/TP tạm trú'];
    const temporaryWard = rawRow['Phường/Xã tạm trú'];
    const temporaryStreet = rawRow['Số nhà, đường tạm trú'];
    if (temporaryProvince || temporaryWard || temporaryStreet) {
        addresses.push({
            type: 'temporary',
            province: String(temporaryProvince || ''),
            ward: String(temporaryWard || ''),
            street: String(temporaryStreet || '')
        });
    }
    return addresses;
}
/**
 * Normalize raw row từ template
 * Convert địa chỉ thường trú/tạm trú thành permanentAddress/temporaryAddress
 */ function normalizeEmployeeRawRow(rawRow) {
    const result = {
        ...rawRow
    };
    const parsedAddresses = parseEmployeeAddresses(rawRow);
    for (const addr of parsedAddresses){
        if (addr.type === 'permanent') {
            // Địa chỉ thường trú -> permanentAddress
            result['__permanentAddress__'] = {
                province: addr.province,
                ward: addr.ward,
                street: addr.street,
                inputLevel: '2-level'
            };
        } else if (addr.type === 'temporary') {
            // Địa chỉ tạm trú -> temporaryAddress
            result['__temporaryAddress__'] = {
                province: addr.province,
                ward: addr.ward,
                street: addr.street,
                inputLevel: '2-level'
            };
        }
    }
    return result;
}
// Field definitions cho Employee - ĐẦY ĐỦ tất cả fields
// CHỈ BẮT BUỘC: id (Mã nhân viên) và fullName (Họ và tên)
const employeeFields = [
    // ===== THÔNG TIN CƠ BẢN =====
    {
        key: 'id',
        label: 'Mã nhân viên (*)',
        required: true,
        type: 'string',
        exportGroup: 'Thông tin cơ bản',
        example: 'NV001'
    },
    {
        key: 'fullName',
        label: 'Họ và tên (*)',
        required: true,
        type: 'string',
        exportGroup: 'Thông tin cơ bản',
        example: 'Nguyễn Văn A'
    },
    {
        key: 'gender',
        label: 'Giới tính',
        required: false,
        type: 'string',
        exportGroup: 'Thông tin cơ bản',
        example: 'male'
    },
    {
        key: 'dateOfBirth',
        label: 'Ngày sinh',
        required: false,
        type: 'date',
        exportGroup: 'Thông tin cơ bản',
        example: '1990-01-15'
    },
    {
        key: 'placeOfBirth',
        label: 'Nơi sinh',
        required: false,
        type: 'string',
        exportGroup: 'Thông tin cơ bản',
        example: 'Hà Nội'
    },
    {
        key: 'nationality',
        label: 'Quốc tịch',
        required: false,
        type: 'string',
        exportGroup: 'Thông tin cơ bản',
        example: 'Việt Nam'
    },
    {
        key: 'religion',
        label: 'Tôn giáo',
        required: false,
        type: 'string',
        exportGroup: 'Thông tin cơ bản',
        example: 'Không'
    },
    {
        key: 'maritalStatus',
        label: 'Tình trạng hôn nhân',
        required: false,
        type: 'string',
        exportGroup: 'Thông tin cơ bản',
        example: 'single'
    },
    {
        key: 'avatar',
        label: 'Ảnh đại diện',
        required: false,
        type: 'string',
        exportGroup: 'Thông tin cơ bản',
        hidden: true
    },
    // ===== THÔNG TIN ĐĂNG NHẬP =====
    {
        key: 'workEmail',
        label: 'Email công ty',
        required: false,
        type: 'string',
        exportGroup: 'Thông tin đăng nhập',
        example: 'nguyenvana@company.com',
        validator: (value)=>{
            if (!value) return true;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(String(value)) || 'Email không hợp lệ';
        }
    },
    {
        key: 'password',
        label: 'Mật khẩu',
        required: false,
        type: 'string',
        exportGroup: 'Thông tin đăng nhập',
        example: '********',
        hidden: true
    },
    {
        key: 'role',
        label: 'Vai trò hệ thống (*Mặc định: employee)',
        required: false,
        type: 'string',
        exportGroup: 'Thông tin đăng nhập',
        example: 'employee',
        defaultValue: 'employee'
    },
    // ===== GIẤY TỜ TÙY THÂN =====
    {
        key: 'nationalId',
        label: 'CMND/CCCD',
        required: false,
        type: 'string',
        exportGroup: 'Giấy tờ tùy thân',
        example: '012345678901'
    },
    {
        key: 'nationalIdIssueDate',
        label: 'Ngày cấp CMND/CCCD',
        required: false,
        type: 'date',
        exportGroup: 'Giấy tờ tùy thân',
        example: '2020-01-15'
    },
    {
        key: 'nationalIdIssuePlace',
        label: 'Nơi cấp CMND/CCCD',
        required: false,
        type: 'string',
        exportGroup: 'Giấy tờ tùy thân',
        example: 'CA TP Hà Nội'
    },
    {
        key: 'personalTaxId',
        label: 'Mã số thuế cá nhân',
        required: false,
        type: 'string',
        exportGroup: 'Giấy tờ tùy thân',
        example: '0123456789'
    },
    {
        key: 'socialInsuranceNumber',
        label: 'Số sổ BHXH',
        required: false,
        type: 'string',
        exportGroup: 'Giấy tờ tùy thân',
        example: '1234567890'
    },
    // ===== LIÊN HỆ =====
    {
        key: 'personalEmail',
        label: 'Email cá nhân',
        required: false,
        type: 'string',
        exportGroup: 'Liên hệ',
        example: 'nguyenvana@gmail.com',
        validator: (value)=>{
            if (!value) return true;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(String(value)) || 'Email không hợp lệ';
        }
    },
    {
        key: 'phone',
        label: 'Số điện thoại',
        required: false,
        type: 'string',
        exportGroup: 'Liên hệ',
        example: '0901234567'
    },
    // ===== ĐỊA CHỈ THƯỜNG TRÚ (hệ thống 2 cấp) =====
    {
        key: 'permanentAddress.province',
        label: 'Tỉnh/TP thường trú',
        required: false,
        type: 'string',
        exportGroup: 'Địa chỉ thường trú',
        example: 'Hà Nội'
    },
    {
        key: 'permanentAddress.ward',
        label: 'Phường/Xã thường trú',
        required: false,
        type: 'string',
        exportGroup: 'Địa chỉ thường trú',
        example: 'Phường Điện Biên'
    },
    {
        key: 'permanentAddress.street',
        label: 'Số nhà, đường thường trú',
        required: false,
        type: 'string',
        exportGroup: 'Địa chỉ thường trú',
        example: '123 Đường ABC'
    },
    // ===== ĐỊA CHỈ TẠM TRÚ (hệ thống 2 cấp) =====
    {
        key: 'temporaryAddress.province',
        label: 'Tỉnh/TP tạm trú',
        required: false,
        type: 'string',
        exportGroup: 'Địa chỉ tạm trú',
        example: 'Hà Nội'
    },
    {
        key: 'temporaryAddress.ward',
        label: 'Phường/Xã tạm trú',
        required: false,
        type: 'string',
        exportGroup: 'Địa chỉ tạm trú',
        example: 'Phường Cống Vị'
    },
    {
        key: 'temporaryAddress.street',
        label: 'Số nhà, đường tạm trú',
        required: false,
        type: 'string',
        exportGroup: 'Địa chỉ tạm trú',
        example: '456 Đường XYZ'
    },
    // ===== LIÊN HỆ KHẨN CẤP =====
    {
        key: 'emergencyContactName',
        label: 'Người liên hệ khẩn cấp',
        required: false,
        type: 'string',
        exportGroup: 'Liên hệ khẩn cấp',
        example: 'Nguyễn Văn B'
    },
    {
        key: 'emergencyContactPhone',
        label: 'SĐT khẩn cấp',
        required: false,
        type: 'string',
        exportGroup: 'Liên hệ khẩn cấp',
        example: '0908765432'
    },
    // ===== CÔNG VIỆC =====
    {
        key: 'departmentId',
        label: 'Mã phòng ban',
        required: false,
        type: 'string',
        exportGroup: 'Công việc',
        example: 'PB001'
    },
    {
        key: 'departmentName',
        label: 'Tên phòng ban',
        required: false,
        type: 'string',
        exportGroup: 'Công việc',
        example: 'Phòng Kinh doanh'
    },
    {
        key: 'department',
        label: 'Bộ phận',
        required: false,
        type: 'string',
        exportGroup: 'Công việc',
        example: 'Kinh doanh'
    },
    {
        key: 'positionId',
        label: 'Mã chức vụ',
        required: false,
        type: 'string',
        exportGroup: 'Công việc',
        example: 'CV001'
    },
    {
        key: 'positionName',
        label: 'Tên chức vụ',
        required: false,
        type: 'string',
        exportGroup: 'Công việc',
        example: 'Trưởng phòng'
    },
    {
        key: 'jobTitle',
        label: 'Chức danh',
        required: false,
        type: 'string',
        exportGroup: 'Công việc',
        example: 'Nhân viên kinh doanh'
    },
    {
        key: 'employeeType',
        label: 'Loại nhân viên',
        required: false,
        type: 'string',
        exportGroup: 'Công việc',
        example: 'Chính thức'
    },
    {
        key: 'employmentStatus',
        label: 'Trạng thái làm việc (*Mặc định: Đang làm việc)',
        required: false,
        type: 'string',
        exportGroup: 'Công việc',
        example: 'Đang làm việc',
        defaultValue: 'Đang làm việc'
    },
    {
        key: 'status',
        label: 'Trạng thái (*Mặc định: active)',
        required: false,
        type: 'string',
        exportGroup: 'Công việc',
        example: 'active',
        defaultValue: 'active'
    },
    {
        key: 'hireDate',
        label: 'Ngày tuyển dụng',
        required: false,
        type: 'date',
        exportGroup: 'Công việc',
        example: '2023-01-01'
    },
    {
        key: 'startDate',
        label: 'Ngày bắt đầu làm việc',
        required: false,
        type: 'date',
        exportGroup: 'Công việc',
        example: '2023-01-15'
    },
    {
        key: 'endDate',
        label: 'Ngày kết thúc',
        required: false,
        type: 'date',
        exportGroup: 'Công việc',
        example: ''
    },
    {
        key: 'terminationDate',
        label: 'Ngày nghỉ việc',
        required: false,
        type: 'date',
        exportGroup: 'Công việc',
        example: ''
    },
    {
        key: 'reasonForLeaving',
        label: 'Lý do nghỉ việc',
        required: false,
        type: 'string',
        exportGroup: 'Công việc',
        example: ''
    },
    {
        key: 'branchSystemId',
        label: 'Mã chi nhánh',
        required: false,
        type: 'string',
        exportGroup: 'Công việc',
        example: 'CN001'
    },
    // ===== THỬ VIỆC & HỢP ĐỒNG =====
    {
        key: 'probationEndDate',
        label: 'Ngày kết thúc thử việc',
        required: false,
        type: 'date',
        exportGroup: 'Thử việc & Hợp đồng',
        example: '2023-03-31'
    },
    {
        key: 'contractNumber',
        label: 'Số hợp đồng',
        required: false,
        type: 'string',
        exportGroup: 'Thử việc & Hợp đồng',
        example: 'HD-2023-001'
    },
    {
        key: 'contractType',
        label: 'Loại hợp đồng',
        required: false,
        type: 'string',
        exportGroup: 'Thử việc & Hợp đồng',
        example: 'definite'
    },
    {
        key: 'contractStartDate',
        label: 'Ngày bắt đầu HĐ',
        required: false,
        type: 'date',
        exportGroup: 'Thử việc & Hợp đồng',
        example: '2023-04-01'
    },
    {
        key: 'contractEndDate',
        label: 'Ngày kết thúc HĐ',
        required: false,
        type: 'date',
        exportGroup: 'Thử việc & Hợp đồng',
        example: '2024-03-31'
    },
    // ===== THỜI GIAN LÀM VIỆC =====
    {
        key: 'workingHoursPerDay',
        label: 'Số giờ/ngày (*Mặc định: 8)',
        required: false,
        type: 'number',
        exportGroup: 'Thời gian làm việc',
        example: '8',
        defaultValue: 8
    },
    {
        key: 'workingDaysPerWeek',
        label: 'Số ngày/tuần (*Mặc định: 5)',
        required: false,
        type: 'number',
        exportGroup: 'Thời gian làm việc',
        example: '5',
        defaultValue: 5
    },
    {
        key: 'shiftType',
        label: 'Ca làm việc',
        required: false,
        type: 'string',
        exportGroup: 'Thời gian làm việc',
        example: 'day'
    },
    // ===== LƯƠNG & THU NHẬP =====
    {
        key: 'baseSalary',
        label: 'Lương cơ bản',
        required: false,
        type: 'number',
        exportGroup: 'Lương & Thu nhập',
        example: '15000000'
    },
    {
        key: 'socialInsuranceSalary',
        label: 'Lương đóng BHXH',
        required: false,
        type: 'number',
        exportGroup: 'Lương & Thu nhập',
        example: '10000000'
    },
    {
        key: 'positionAllowance',
        label: 'Phụ cấp chức vụ',
        required: false,
        type: 'number',
        exportGroup: 'Lương & Thu nhập',
        example: '2000000'
    },
    {
        key: 'mealAllowance',
        label: 'Phụ cấp ăn trưa',
        required: false,
        type: 'number',
        exportGroup: 'Lương & Thu nhập',
        example: '730000'
    },
    {
        key: 'otherAllowances',
        label: 'Phụ cấp khác',
        required: false,
        type: 'number',
        exportGroup: 'Lương & Thu nhập',
        example: '500000'
    },
    {
        key: 'numberOfDependents',
        label: 'Số người phụ thuộc',
        required: false,
        type: 'number',
        exportGroup: 'Lương & Thu nhập',
        example: '1'
    },
    // ===== NGÂN HÀNG =====
    {
        key: 'bankAccountNumber',
        label: 'Số tài khoản',
        required: false,
        type: 'string',
        exportGroup: 'Ngân hàng',
        example: '1234567890123'
    },
    {
        key: 'bankName',
        label: 'Ngân hàng',
        required: false,
        type: 'string',
        exportGroup: 'Ngân hàng',
        example: 'Vietcombank'
    },
    {
        key: 'bankBranch',
        label: 'Chi nhánh',
        required: false,
        type: 'string',
        exportGroup: 'Ngân hàng',
        example: 'CN Hà Nội'
    },
    // ===== NGHỈ PHÉP =====
    {
        key: 'annualLeaveBalance',
        label: 'Số ngày phép còn',
        required: false,
        type: 'number',
        exportGroup: 'Nghỉ phép',
        example: '12'
    },
    {
        key: 'leaveTaken',
        label: 'Số ngày đã nghỉ (*Mặc định: 0)',
        required: false,
        type: 'number',
        exportGroup: 'Nghỉ phép',
        example: '3',
        defaultValue: 0
    },
    {
        key: 'paidLeaveTaken',
        label: 'Nghỉ phép có lương',
        required: false,
        type: 'number',
        exportGroup: 'Nghỉ phép',
        example: '2'
    },
    {
        key: 'unpaidLeaveTaken',
        label: 'Nghỉ phép không lương',
        required: false,
        type: 'number',
        exportGroup: 'Nghỉ phép',
        example: '1'
    },
    {
        key: 'annualLeaveTaken',
        label: 'Nghỉ phép năm đã dùng',
        required: false,
        type: 'number',
        exportGroup: 'Nghỉ phép',
        example: '5'
    },
    // ===== ĐÁNH GIÁ =====
    {
        key: 'performanceRating',
        label: 'Đánh giá hiệu suất',
        required: false,
        type: 'number',
        exportGroup: 'Đánh giá',
        example: '4'
    },
    {
        key: 'lastReviewDate',
        label: 'Ngày đánh giá gần nhất',
        required: false,
        type: 'date',
        exportGroup: 'Đánh giá',
        example: '2023-12-15'
    },
    {
        key: 'nextReviewDate',
        label: 'Ngày đánh giá tiếp theo',
        required: false,
        type: 'date',
        exportGroup: 'Đánh giá',
        example: '2024-06-15'
    },
    // ===== KỸ NĂNG & CHỨNG CHỈ =====
    {
        key: 'skills',
        label: 'Kỹ năng',
        required: false,
        type: 'string',
        exportGroup: 'Kỹ năng & Chứng chỉ',
        example: 'Excel, PowerPoint, Quản lý dự án',
        transform: (value)=>{
            if (Array.isArray(value)) return value.join(', ');
            return value;
        },
        reverseTransform: (value)=>{
            if (typeof value === 'string') {
                return value.split(',').map((s)=>s.trim()).filter(Boolean);
            }
            return value;
        }
    },
    {
        key: 'certifications',
        label: 'Chứng chỉ',
        required: false,
        type: 'string',
        exportGroup: 'Kỹ năng & Chứng chỉ',
        example: 'PMP, IELTS 7.0',
        transform: (value)=>{
            if (Array.isArray(value)) return value.join(', ');
            return value;
        },
        reverseTransform: (value)=>{
            if (typeof value === 'string') {
                return value.split(',').map((s)=>s.trim()).filter(Boolean);
            }
            return value;
        }
    },
    // ===== SƠ ĐỒ TỔ CHỨC =====
    {
        key: 'managerId',
        label: 'Mã quản lý trực tiếp',
        required: false,
        type: 'string',
        exportGroup: 'Sơ đồ tổ chức',
        example: 'NV000'
    },
    // ===== HỌC VẤN =====
    {
        key: 'educationLevel',
        label: 'Trình độ học vấn',
        required: false,
        type: 'string',
        exportGroup: 'Học vấn',
        example: 'Đại học'
    },
    {
        key: 'major',
        label: 'Chuyên ngành',
        required: false,
        type: 'string',
        exportGroup: 'Học vấn',
        example: 'Quản trị kinh doanh'
    },
    {
        key: 'graduationYear',
        label: 'Năm tốt nghiệp',
        required: false,
        type: 'number',
        exportGroup: 'Học vấn',
        example: '2018'
    },
    {
        key: 'school',
        label: 'Trường',
        required: false,
        type: 'string',
        exportGroup: 'Học vấn',
        example: 'Đại học Kinh tế Quốc dân'
    },
    // ===== GHI CHÚ =====
    {
        key: 'notes',
        label: 'Ghi chú',
        required: false,
        type: 'string',
        exportGroup: 'Khác',
        example: ''
    },
    // ===== DỮ LIỆU HỆ THỐNG (hidden, không import) =====
    {
        key: 'systemId',
        label: 'System ID',
        required: false,
        type: 'string',
        exportGroup: 'Hệ thống',
        hidden: true
    },
    {
        key: 'avatarUrl',
        label: 'URL ảnh đại diện',
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
/**
 * Post-transform để xử lý địa chỉ thường trú và tạm trú
 * Được tạo bởi normalizeEmployeeRawRow từ các cột:
 * - __permanentAddress__: Địa chỉ thường trú
 * - __temporaryAddress__: Địa chỉ tạm trú
 */ function processEmployeeAddresses(row) {
    const result = {
        ...row
    };
    const rawData = row;
    // Xử lý địa chỉ thường trú
    const permanentRaw = rawData['__permanentAddress__'];
    if (permanentRaw && (permanentRaw.province || permanentRaw.ward || permanentRaw.street)) {
        // Enrich with IDs using address lookup
        const enriched = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$export$2f$address$2d$lookup$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["enrichEmployeeAddresses"])({
            permanentAddress: {
                province: permanentRaw.province || '',
                ward: permanentRaw.ward || '',
                street: permanentRaw.street || '',
                inputLevel: permanentRaw.inputLevel || '2-level'
            }
        });
        if (enriched.permanentAddress) {
            result.permanentAddress = enriched.permanentAddress;
        }
        // Remove temporary field
        delete result['__permanentAddress__'];
    }
    // Xử lý địa chỉ tạm trú
    const temporaryRaw = rawData['__temporaryAddress__'];
    if (temporaryRaw && (temporaryRaw.province || temporaryRaw.ward || temporaryRaw.street)) {
        // Enrich with IDs using address lookup
        const enriched = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$export$2f$address$2d$lookup$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["enrichEmployeeAddresses"])({
            temporaryAddress: {
                province: temporaryRaw.province || '',
                ward: temporaryRaw.ward || '',
                street: temporaryRaw.street || '',
                inputLevel: temporaryRaw.inputLevel || '2-level'
            }
        });
        if (enriched.temporaryAddress) {
            result.temporaryAddress = enriched.temporaryAddress;
        }
        // Remove temporary field
        delete result['__temporaryAddress__'];
    }
    return result;
}
const employeeConfig = {
    entityType: 'employees',
    entityDisplayName: 'Nhân viên',
    fields: employeeFields,
    upsertKey: 'id',
    templateFileName: 'mau-import-nhan-vien.xlsx',
    // Pre-transform: Normalize raw row từ template mới (merge 2-level/3-level columns)
    preTransformRawRow: normalizeEmployeeRawRow,
    // Post-transform: Process addresses and lookup IDs
    postTransformRow: processEmployeeAddresses
};
const employeeImportExportConfig = employeeConfig;
;
const __TURBOPACK__default__export__ = employeeConfig;
}),
"[project]/lib/import-export/configs/attendance.config.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Attendance Import/Export Config
 * 
 * Cấu hình import chấm công từ máy CC
 * 
 * ⚠️ LƯU Ý: File từ máy CC có format đặc biệt
 * - Sheet "Bảng tổng hợp chấm công"
 * - Header phức tạp (2 dòng, merged cells)
 * - Mã NV máy CC khác mã NV hệ thống → cần mapping
 */ __turbopack_context__.s([
    "attendanceFields",
    ()=>attendanceFields,
    "attendanceImportExportConfig",
    ()=>attendanceImportExportConfig
]);
// ============================================
// FIELD DEFINITIONS
// ============================================
const attendanceFields = [
    {
        key: 'machineEmployeeId',
        label: 'Mã NV (máy) (*)',
        required: true,
        type: 'number',
        example: '1',
        exportGroup: 'Thông tin NV',
        defaultSelected: true
    },
    {
        key: 'employeeName',
        label: 'Họ tên (*)',
        required: true,
        type: 'string',
        example: 'nguyen van a',
        exportGroup: 'Thông tin NV',
        defaultSelected: true
    },
    {
        key: 'department',
        label: 'Phòng ban',
        type: 'string',
        example: 'CÔNG TY',
        exportGroup: 'Thông tin NV'
    },
    {
        key: 'standardHours',
        label: 'Giờ chuẩn',
        type: 'number',
        example: '160',
        exportGroup: 'Thời gian',
        defaultSelected: true
    },
    {
        key: 'actualHours',
        label: 'Giờ thực tế',
        type: 'number',
        example: '145.28',
        exportGroup: 'Thời gian',
        defaultSelected: true
    },
    {
        key: 'lateCount',
        label: 'Đến muộn (lần)',
        type: 'number',
        example: '3',
        exportGroup: 'Đến muộn/Về sớm',
        defaultSelected: true
    },
    {
        key: 'lateMinutes',
        label: 'Đến muộn (phút)',
        type: 'number',
        example: '97',
        exportGroup: 'Đến muộn/Về sớm',
        defaultSelected: true
    },
    {
        key: 'earlyLeaveCount',
        label: 'Về sớm (lần)',
        type: 'number',
        example: '2',
        exportGroup: 'Đến muộn/Về sớm'
    },
    {
        key: 'earlyLeaveMinutes',
        label: 'Về sớm (phút)',
        type: 'number',
        example: '36',
        exportGroup: 'Đến muộn/Về sớm'
    },
    {
        key: 'overtimeNormal',
        label: 'Tăng ca thường (giờ)',
        type: 'number',
        example: '6.55',
        exportGroup: 'Tăng ca',
        defaultSelected: true
    },
    {
        key: 'overtimeSpecial',
        label: 'Tăng ca đặc biệt (giờ)',
        type: 'number',
        example: '43.5',
        exportGroup: 'Tăng ca'
    },
    {
        key: 'workDays',
        label: 'Ngày công (chuẩn/thực)',
        type: 'string',
        example: '20/19',
        exportGroup: 'Ngày công',
        defaultSelected: true
    },
    {
        key: 'businessTrip',
        label: 'Công tác (ngày)',
        type: 'number',
        example: '2',
        exportGroup: 'Nghỉ phép'
    },
    {
        key: 'absentWithoutLeave',
        label: 'Nghỉ không phép (ngày)',
        type: 'number',
        example: '1',
        exportGroup: 'Nghỉ phép',
        defaultSelected: true
    },
    {
        key: 'paidLeave',
        label: 'Nghỉ phép (ngày)',
        type: 'number',
        example: '0',
        exportGroup: 'Nghỉ phép'
    }
];
const attendanceImportExportConfig = {
    entityType: 'attendance',
    entityDisplayName: 'Chấm công (từ máy CC)',
    // Template - dùng file gốc từ máy CC
    templateFileName: 'Mau_ChamCong_MayCC.xls',
    templateDownloadUrl: '/templates/Mau_ChamCong_MayCC.xls',
    // ⚠️ SPECIAL: Custom parser
    customParser: true,
    sourceSheetName: 'Bảng tổng hợp chấm công',
    headerRowIndex: 2,
    dataStartRowIndex: 4,
    // Fields
    fields: attendanceFields,
    // ⚠️ KHÔNG dùng upsertKey thông thường
    // Vì máy CC dùng mã 1,2,3... không phải NV000001
    upsertKey: undefined,
    // Thay vào đó: Composite key cho upsert
    compositeKey: [
        'employeeSystemId',
        'month',
        'year'
    ],
    // Employee mapping
    requireEmployeeMapping: true,
    mappingField: 'employeeName',
    // Upsert config
    allowUpdate: true,
    allowInsert: true,
    // Preview config
    requirePreview: true,
    stopOnFirstError: false,
    maxErrorsAllowed: 0,
    maxRows: 100,
    // Validation
    validateRow: (row, _index, _existingData)=>{
        const errors = [];
        // Check tên không rỗng
        if (!row.employeeName || row.employeeName.trim() === '') {
            errors.push({
                field: 'employeeName',
                message: 'Họ tên không được trống'
            });
        }
        // Check giờ thực tế không âm
        if (row.actualHours < 0) {
            errors.push({
                field: 'actualHours',
                message: 'Giờ thực tế không được âm'
            });
        }
        // Check giờ thực tế không vượt quá chuẩn + tăng ca quá nhiều
        const maxHours = row.standardHours + 100; // Tối đa 100 giờ tăng ca/tháng
        if (row.actualHours > maxHours) {
            errors.push({
                field: 'actualHours',
                message: `Giờ thực tế (${row.actualHours}h) vượt quá giới hạn (${maxHours}h)`
            });
        }
        // Check số phút đến muộn hợp lý
        if (row.lateMinutes > 0 && row.lateCount === 0) {
            errors.push({
                field: 'lateCount',
                message: 'Có phút đến muộn nhưng số lần = 0'
            });
        }
        return errors;
    },
    // After import hook
    afterImport: (results)=>{
        console.log(`Import chấm công hoàn tất:
      - Thêm mới: ${results.inserted.length}
      - Cập nhật: ${results.updated.length}
      - Lỗi: ${results.failed.length}
      - Bỏ qua: ${results.skipped.length}`);
    }
};
;
}),
"[project]/lib/import-export/configs/customer.config.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "customerFields",
    ()=>customerFields,
    "customerImportExportConfig",
    ()=>customerImportExportConfig,
    "default",
    ()=>__TURBOPACK__default__export__
]);
const customerFields = [
    // ===== THÔNG TIN CƠ BẢN =====
    {
        key: 'id',
        label: 'Mã khách hàng',
        required: false,
        type: 'string',
        exportGroup: 'Thông tin cơ bản',
        example: 'KH000001'
    },
    {
        key: 'name',
        label: 'Tên khách hàng (*)',
        required: true,
        type: 'string',
        exportGroup: 'Thông tin cơ bản',
        example: 'Công ty TNHH ABC'
    },
    {
        key: 'status',
        label: 'Trạng thái',
        required: false,
        type: 'enum',
        enumValues: [
            'Đang giao dịch',
            'Ngừng Giao Dịch'
        ],
        enumLabels: {
            'Đang giao dịch': 'Đang giao dịch',
            'Ngừng Giao Dịch': 'Ngừng giao dịch'
        },
        exportGroup: 'Thông tin cơ bản',
        example: 'Đang giao dịch',
        defaultValue: 'Đang giao dịch'
    },
    {
        key: 'phone',
        label: 'Số điện thoại',
        required: false,
        type: 'phone',
        exportGroup: 'Thông tin cơ bản',
        example: '0901234567',
        validator: (value)=>{
            if (!value) return null;
            const phone = String(value).replace(/\s/g, '');
            if (!/^0\d{9,10}$/.test(phone)) {
                return '[Warning] Số điện thoại không đúng định dạng';
            }
            return null;
        }
    },
    {
        key: 'email',
        label: 'Email',
        required: false,
        type: 'email',
        exportGroup: 'Thông tin cơ bản',
        example: 'contact@abc.com',
        validator: (value)=>{
            if (!value) return null;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(String(value))) {
                return 'Email không hợp lệ';
            }
            return null;
        }
    },
    {
        key: 'type',
        label: 'Loại khách hàng',
        required: false,
        type: 'string',
        exportGroup: 'Thông tin cơ bản',
        example: 'Doanh nghiệp'
    },
    {
        key: 'customerGroup',
        label: 'Nhóm khách hàng',
        required: false,
        type: 'string',
        exportGroup: 'Thông tin cơ bản',
        example: 'Khách sỉ'
    },
    {
        key: 'lifecycleStage',
        label: 'Giai đoạn vòng đời',
        required: false,
        type: 'string',
        exportGroup: 'Thông tin cơ bản',
        example: 'Khách mới'
    },
    {
        key: 'source',
        label: 'Nguồn khách hàng',
        required: false,
        type: 'string',
        exportGroup: 'Thông tin cơ bản',
        example: 'Facebook'
    },
    {
        key: 'notes',
        label: 'Ghi chú',
        required: false,
        type: 'string',
        exportGroup: 'Thông tin cơ bản',
        example: 'Khách hàng tiềm năng'
    },
    // ===== THÔNG TIN DOANH NGHIỆP =====
    {
        key: 'company',
        label: 'Tên công ty / HKD',
        required: false,
        type: 'string',
        exportGroup: 'Thông tin doanh nghiệp',
        example: 'Công ty TNHH ABC'
    },
    {
        key: 'taxCode',
        label: 'Mã số thuế',
        required: false,
        type: 'string',
        exportGroup: 'Thông tin doanh nghiệp',
        example: '0123456789',
        validator: (value)=>{
            if (!value) return null;
            const taxCode = String(value);
            if (!/^\d{10}(\d{3})?$/.test(taxCode)) {
                return '[Warning] Mã số thuế phải có 10 hoặc 13 số';
            }
            return null;
        }
    },
    {
        key: 'representative',
        label: 'Người đại diện',
        required: false,
        type: 'string',
        exportGroup: 'Thông tin doanh nghiệp',
        example: 'Nguyễn Văn A'
    },
    {
        key: 'position',
        label: 'Chức vụ',
        required: false,
        type: 'string',
        exportGroup: 'Thông tin doanh nghiệp',
        example: 'Giám đốc'
    },
    {
        key: 'bankName',
        label: 'Ngân hàng',
        required: false,
        type: 'string',
        exportGroup: 'Thông tin doanh nghiệp',
        example: 'Vietcombank'
    },
    {
        key: 'bankAccount',
        label: 'Số tài khoản',
        required: false,
        type: 'string',
        exportGroup: 'Thông tin doanh nghiệp',
        example: '0123456789'
    },
    // ===== THANH TOÁN & GIÁ =====
    {
        key: 'paymentTerms',
        label: 'Hạn thanh toán',
        required: false,
        type: 'string',
        exportGroup: 'Thanh toán & Giá',
        example: 'NET15'
    },
    {
        key: 'creditRating',
        label: 'Xếp hạng tín dụng',
        required: false,
        type: 'string',
        exportGroup: 'Thanh toán & Giá',
        example: 'AAA'
    },
    {
        key: 'currentDebt',
        label: 'Công nợ hiện tại',
        required: false,
        type: 'number',
        exportGroup: 'Thanh toán & Giá',
        example: '0',
        importTransform: (value)=>{
            if (!value) return 0;
            const num = Number(String(value).replace(/[,.\s]/g, ''));
            return isNaN(num) ? 0 : num;
        },
        exportTransform: (value)=>{
            if (!value) return '0';
            return Number(value).toLocaleString('vi-VN');
        }
    },
    {
        key: 'maxDebt',
        label: 'Hạn mức công nợ',
        required: false,
        type: 'number',
        exportGroup: 'Thanh toán & Giá',
        example: '50000000',
        importTransform: (value)=>{
            if (!value) return undefined;
            const num = Number(String(value).replace(/[,.\s]/g, ''));
            return isNaN(num) ? undefined : num;
        },
        exportTransform: (value)=>{
            if (!value) return '';
            return Number(value).toLocaleString('vi-VN');
        }
    },
    {
        key: 'allowCredit',
        label: 'Cho phép công nợ',
        required: false,
        type: 'boolean',
        exportGroup: 'Thanh toán & Giá',
        example: 'Có',
        importTransform: (value)=>{
            if (!value) return undefined;
            const str = String(value).toLowerCase();
            return str === 'có' || str === 'yes' || str === 'true' || str === '1';
        },
        exportTransform: (value)=>value ? 'Có' : 'Không'
    },
    {
        key: 'pricingLevel',
        label: 'Bảng giá áp dụng',
        required: false,
        type: 'enum',
        enumValues: [
            'Retail',
            'Wholesale',
            'VIP',
            'Partner'
        ],
        enumLabels: {
            'Retail': 'Bán lẻ',
            'Wholesale': 'Bán sỉ',
            'VIP': 'VIP',
            'Partner': 'Đối tác'
        },
        exportGroup: 'Thanh toán & Giá',
        example: 'Retail'
    },
    {
        key: 'defaultDiscount',
        label: 'Chiết khấu mặc định (%)',
        required: false,
        type: 'number',
        exportGroup: 'Thanh toán & Giá',
        example: '5',
        validator: (value)=>{
            if (!value) return null;
            const num = Number(value);
            if (num < 0 || num > 100) {
                return 'Chiết khấu phải từ 0 đến 100%';
            }
            return null;
        }
    },
    // ===== PHÂN LOẠI & QUẢN LÝ =====
    {
        key: 'accountManagerName',
        label: 'Nhân viên phụ trách',
        required: false,
        type: 'string',
        exportGroup: 'Phân loại & Quản lý',
        example: 'Nguyễn Văn B'
    },
    {
        key: 'campaign',
        label: 'Chiến dịch',
        required: false,
        type: 'string',
        exportGroup: 'Phân loại & Quản lý',
        example: 'Summer Sale 2024'
    },
    {
        key: 'tags',
        label: 'Thẻ (Tags)',
        required: false,
        type: 'string',
        exportGroup: 'Phân loại & Quản lý',
        example: 'VIP, Ưu tiên',
        importTransform: (value)=>{
            if (!value) return undefined;
            return String(value).split(',').map((s)=>s.trim()).filter(Boolean);
        },
        exportTransform: (value)=>{
            if (!value || !Array.isArray(value)) return '';
            return value.join(', ');
        }
    },
    // ===== SOCIAL MEDIA =====
    {
        key: 'zaloPhone',
        label: 'Zalo',
        required: false,
        type: 'phone',
        exportGroup: 'Social Media',
        example: '0901234567'
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
const customerImportExportConfig = {
    entityType: 'customers',
    entityDisplayName: 'Khách hàng',
    fields: customerFields,
    upsertKey: 'id',
    templateFileName: 'mau-import-khach-hang.xlsx',
    requireBranch: false,
    // Pre-transform raw row (normalize column names)
    preTransformRawRow: (rawRow)=>{
        const normalized = {};
        // Map từ label tiếng Việt sang key
        const labelToKey = {};
        customerFields.forEach((field)=>{
            labelToKey[field.label.toLowerCase()] = field.key;
            // Also map without (*) marker
            const labelWithoutStar = field.label.replace(/\s*\(\*\)\s*$/, '').toLowerCase();
            labelToKey[labelWithoutStar] = field.key;
        });
        Object.entries(rawRow).forEach(([key, value])=>{
            // Normalize Excel header: strip (*) marker and lowercase
            const normalizedExcelHeader = key.replace(/\s*\(\*\)\s*$/, '').toLowerCase();
            const normalizedKey = labelToKey[normalizedExcelHeader] || labelToKey[key.toLowerCase()] || key;
            normalized[normalizedKey] = value;
        });
        return normalized;
    },
    // Post-transform row (set defaults, enrich data)
    postTransformRow: (row)=>{
        return {
            ...row,
            status: row.status || 'Đang giao dịch',
            pricingLevel: row.pricingLevel || 'Retail',
            currentDebt: row.currentDebt ?? 0,
            defaultDiscount: row.defaultDiscount ?? 0,
            tags: row.tags || []
        };
    },
    // Validate row level (check duplicate taxCode)
    // Skip duplicate check in upsert/update mode since we're updating existing records
    validateRow: (row, _index, existingData, mode)=>{
        const errors = [];
        // Check unique taxCode - only in insert-only mode
        // In upsert/update mode, duplicate is expected and allowed
        if (row.taxCode && mode === 'insert-only') {
            const duplicate = existingData.find((c)=>c.taxCode === row.taxCode && c.id !== row.id);
            if (duplicate) {
                errors.push({
                    field: 'taxCode',
                    message: `Mã số thuế đã được sử dụng bởi ${duplicate.name} (${duplicate.id})`
                });
            }
        }
        return errors;
    }
};
const __TURBOPACK__default__export__ = customerImportExportConfig;
}),
"[project]/lib/import-export/configs/product.config.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "productFields",
    ()=>productFields,
    "productImportExportConfig",
    ()=>productImportExportConfig
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pricing$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pricing/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$inventory$2f$product$2d$type$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/inventory/product-type-store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
;
;
;
/**
 * Product Import/Export Configuration
 * Theo chuẩn ImportExportConfig để dùng với GenericImportDialogV2 và GenericExportDialogV2
 */ // Helper: Get all pricing policies
const getAllPricingPolicies = ()=>{
    return __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pricing$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePricingPolicyStore"].getState().data;
};
// ===== PRODUCT TYPE HELPERS =====
// Helper: Get all active product types from settings
const getAllProductTypes = ()=>{
    return __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$inventory$2f$product$2d$type$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductTypeStore"].getState().getActive();
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
const getPricingPolicyCode = (systemId)=>{
    const policies = getAllPricingPolicies();
    const policy = policies.find((p)=>p.systemId === systemId);
    return policy?.id || systemId;
};
// Helper: Get pricing policy name from systemId  
const getPricingPolicyName = (systemId)=>{
    const policies = getAllPricingPolicies();
    const policy = policies.find((p)=>p.systemId === systemId);
    return policy?.name || systemId;
};
// Helper: Check if a column name matches a pricing policy (by id or name)
const isPricingPolicyColumn = (columnName)=>{
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
        const productTypeSystemId = productTypeSystemIdStr ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(productTypeSystemIdStr) : undefined;
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
}),
"[project]/lib/import-export/configs/brand.config.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "brandFieldGroups",
    ()=>brandFieldGroups,
    "brandFields",
    ()=>brandFields,
    "brandImportExportConfig",
    ()=>brandImportExportConfig
]);
const brandFields = [
    // === Basic Info ===
    {
        key: 'id',
        label: 'Mã thương hiệu (*)',
        type: 'string',
        required: true,
        exportGroup: 'Thông tin cơ bản',
        exportable: true,
        example: 'BRAND001',
        validator: (value)=>{
            if (!value || String(value).trim() === '') {
                return 'Mã thương hiệu là bắt buộc';
            }
            return null;
        }
    },
    {
        key: 'name',
        label: 'Tên thương hiệu (*)',
        type: 'string',
        required: true,
        exportGroup: 'Thông tin cơ bản',
        exportable: true,
        example: 'Apple',
        validator: (value)=>{
            if (!value || String(value).trim() === '') {
                return 'Tên thương hiệu là bắt buộc';
            }
            return null;
        }
    },
    {
        key: 'description',
        label: 'Mô tả',
        type: 'string',
        required: false,
        exportGroup: 'Thông tin cơ bản',
        exportable: true,
        example: 'Thương hiệu công nghệ hàng đầu thế giới'
    },
    {
        key: 'website',
        label: 'Website',
        type: 'string',
        required: false,
        exportGroup: 'Thông tin cơ bản',
        exportable: true,
        example: 'https://www.apple.com',
        validator: (value)=>{
            if (value && typeof value === 'string') {
                const trimmed = value.trim();
                if (trimmed && !trimmed.match(/^https?:\/\/.+/i)) {
                    return 'Website phải bắt đầu bằng http:// hoặc https://';
                }
            }
            return null;
        }
    },
    {
        key: 'logo',
        label: 'Logo URL',
        type: 'string',
        required: false,
        exportGroup: 'Thông tin cơ bản',
        exportable: true,
        example: 'https://example.com/logo.png'
    },
    // === SEO Fields ===
    {
        key: 'seoTitle',
        label: 'SEO Title',
        type: 'string',
        required: false,
        exportGroup: 'SEO & Mô tả',
        exportable: true,
        example: 'Apple - Thương hiệu công nghệ cao cấp'
    },
    {
        key: 'metaDescription',
        label: 'Meta Description',
        type: 'string',
        required: false,
        exportGroup: 'SEO & Mô tả',
        exportable: true,
        example: 'Apple Inc. là tập đoàn công nghệ đa quốc gia...'
    },
    {
        key: 'seoKeywords',
        label: 'SEO Keywords',
        type: 'string',
        required: false,
        exportGroup: 'SEO & Mô tả',
        exportable: true,
        example: 'apple, iphone, macbook, công nghệ'
    },
    {
        key: 'shortDescription',
        label: 'Mô tả ngắn',
        type: 'string',
        required: false,
        exportGroup: 'SEO & Mô tả',
        exportable: true,
        example: 'Thương hiệu công nghệ hàng đầu từ Mỹ'
    },
    {
        key: 'longDescription',
        label: 'Mô tả chi tiết',
        type: 'string',
        required: false,
        exportGroup: 'SEO & Mô tả',
        exportable: true,
        example: '<p>Apple Inc. được thành lập năm 1976...</p>'
    },
    // === Settings ===
    {
        key: 'isActive',
        label: 'Trạng thái',
        type: 'boolean',
        required: false,
        exportGroup: 'Cài đặt',
        exportable: true,
        example: 'Hoạt động',
        importTransform: (value)=>{
            if (typeof value === 'boolean') return value;
            if (typeof value === 'number') return value === 1;
            const strValue = String(value).toLowerCase().trim();
            return strValue === 'true' || strValue === '1' || strValue === 'hoạt động' || strValue === 'hoat dong' || strValue === 'có' || strValue === 'co' || strValue === 'yes' || strValue === 'active';
        },
        exportTransform: (value)=>value ? 'Hoạt động' : 'Ngừng'
    }
];
const brandFieldGroups = {
    'Thông tin cơ bản': 'Thông tin cơ bản',
    'SEO & Mô tả': 'SEO & Mô tả',
    'Cài đặt': 'Cài đặt'
};
const brandImportExportConfig = {
    entityType: 'brands',
    entityDisplayName: 'Thương hiệu',
    fields: brandFields,
    // Template file
    templateFileName: 'Mau_Nhap_Thuong_Hieu.xlsx',
    sheetName: 'Thương hiệu',
    // Upsert config - dùng id làm key
    upsertKey: 'id',
    allowUpdate: true,
    allowInsert: true,
    // Max rows
    maxRows: 500,
    // Row-level transform after all field transforms
    postTransformRow: (row)=>{
        // Ensure isActive defaults to true for new brands
        if (row.isActive === undefined) {
            row.isActive = true;
        }
        return row;
    },
    // Validate entire row
    validateRow: (row, _index, _existingData, _mode)=>{
        const errors = [];
        if (!row.id || String(row.id).trim() === '') {
            errors.push({
                field: 'id',
                message: 'Mã thương hiệu là bắt buộc'
            });
        }
        if (!row.name || String(row.name).trim() === '') {
            errors.push({
                field: 'name',
                message: 'Tên thương hiệu là bắt buộc'
            });
        }
        return errors;
    }
};
}),
"[project]/lib/import-export/configs/category.config.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "categoryFieldGroups",
    ()=>categoryFieldGroups,
    "categoryFields",
    ()=>categoryFields,
    "categoryImportExportConfig",
    ()=>categoryImportExportConfig
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$inventory$2f$product$2d$category$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/inventory/product-category-store.ts [app-ssr] (ecmascript)");
;
/**
 * Product Category Import/Export Configuration
 * Theo chuẩn ImportExportConfig để dùng với GenericImportDialogV2 và GenericExportDialogV2
 */ // ===== CATEGORY HELPERS =====
// Helper: Get all categories for parent lookup
const getAllCategories = ()=>{
    return __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$inventory$2f$product$2d$category$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductCategoryStore"].getState().data.filter((c)=>!c.isDeleted);
};
// Helper: Get parent category systemId from name or path
const getParentCategorySystemId = (value)=>{
    if (!value || String(value).trim() === '') return null;
    const categories = getAllCategories();
    const normalizedValue = String(value).trim().toLowerCase();
    // Try exact match by name first
    const byName = categories.find((c)=>c.name.toLowerCase() === normalizedValue || c.id.toLowerCase() === normalizedValue);
    if (byName) return byName.systemId;
    // Try match by path (e.g., "Điện tử > Máy tính")
    const byPath = categories.find((c)=>c.path?.toLowerCase() === normalizedValue);
    if (byPath) return byPath.systemId;
    return null;
};
// Helper: Get parent category display name from systemId
const getParentCategoryName = (systemId)=>{
    if (!systemId) return '';
    const categories = getAllCategories();
    const parent = categories.find((c)=>c.systemId === systemId);
    return parent?.name || '';
};
const categoryFields = [
    // === Basic Info ===
    {
        key: 'id',
        label: 'Mã danh mục (*)',
        type: 'string',
        required: true,
        exportGroup: 'Thông tin cơ bản',
        exportable: true,
        example: 'CAT001',
        validator: (value)=>{
            if (!value || String(value).trim() === '') {
                return 'Mã danh mục là bắt buộc';
            }
            return null;
        }
    },
    {
        key: 'name',
        label: 'Tên danh mục (*)',
        type: 'string',
        required: true,
        exportGroup: 'Thông tin cơ bản',
        exportable: true,
        example: 'Điện thoại',
        validator: (value)=>{
            if (!value || String(value).trim() === '') {
                return 'Tên danh mục là bắt buộc';
            }
            return null;
        }
    },
    {
        key: 'slug',
        label: 'Slug',
        type: 'string',
        required: false,
        exportGroup: 'Thông tin cơ bản',
        exportable: true,
        example: 'dien-thoai'
    },
    // === Hierarchy ===
    {
        key: 'parentId',
        label: 'Danh mục cha',
        type: 'string',
        required: false,
        exportGroup: 'Phân cấp',
        exportable: true,
        example: 'Điện tử',
        importTransform: (value)=>{
            if (!value) return undefined;
            const systemId = getParentCategorySystemId(String(value));
            return systemId || undefined;
        },
        exportTransform: (value)=>{
            // Value is the parentId systemId
            return getParentCategoryName(value);
        }
    },
    {
        key: 'path',
        label: 'Đường dẫn',
        type: 'string',
        required: false,
        exportGroup: 'Phân cấp',
        exportable: true,
        hidden: true,
        example: 'Điện tử > Điện thoại'
    },
    {
        key: 'level',
        label: 'Cấp độ',
        type: 'number',
        required: false,
        exportGroup: 'Phân cấp',
        exportable: true,
        hidden: true,
        example: '1'
    },
    // === Display ===
    {
        key: 'color',
        label: 'Màu sắc',
        type: 'string',
        required: false,
        exportGroup: 'Hiển thị',
        exportable: true,
        example: '#3b82f6'
    },
    {
        key: 'icon',
        label: 'Icon',
        type: 'string',
        required: false,
        exportGroup: 'Hiển thị',
        exportable: true,
        example: '📱'
    },
    {
        key: 'thumbnailImage',
        label: 'Ảnh đại diện',
        type: 'string',
        required: false,
        exportGroup: 'Hiển thị',
        exportable: true,
        example: 'https://example.com/category.jpg'
    },
    {
        key: 'sortOrder',
        label: 'Thứ tự',
        type: 'number',
        required: false,
        exportGroup: 'Hiển thị',
        exportable: true,
        example: '1',
        importTransform: (value)=>{
            if (value === undefined || value === null || value === '') return 0;
            const num = Number(value);
            return isNaN(num) ? 0 : num;
        }
    },
    // === SEO Fields ===
    {
        key: 'seoTitle',
        label: 'SEO Title',
        type: 'string',
        required: false,
        exportGroup: 'SEO & Mô tả',
        exportable: true,
        example: 'Điện thoại chính hãng - Giá tốt nhất'
    },
    {
        key: 'metaDescription',
        label: 'Meta Description',
        type: 'string',
        required: false,
        exportGroup: 'SEO & Mô tả',
        exportable: true,
        example: 'Mua điện thoại chính hãng giá tốt nhất...'
    },
    {
        key: 'seoKeywords',
        label: 'SEO Keywords',
        type: 'string',
        required: false,
        exportGroup: 'SEO & Mô tả',
        exportable: true,
        example: 'điện thoại, smartphone, iphone, samsung'
    },
    {
        key: 'shortDescription',
        label: 'Mô tả ngắn',
        type: 'string',
        required: false,
        exportGroup: 'SEO & Mô tả',
        exportable: true,
        example: 'Danh mục điện thoại di động các hãng'
    },
    {
        key: 'longDescription',
        label: 'Mô tả chi tiết',
        type: 'string',
        required: false,
        exportGroup: 'SEO & Mô tả',
        exportable: true,
        example: '<p>Điện thoại di động từ các thương hiệu...</p>'
    },
    // === Settings ===
    {
        key: 'isActive',
        label: 'Trạng thái',
        type: 'boolean',
        required: false,
        exportGroup: 'Cài đặt',
        exportable: true,
        example: 'Hoạt động',
        importTransform: (value)=>{
            if (typeof value === 'boolean') return value;
            if (typeof value === 'number') return value === 1;
            const strValue = String(value).toLowerCase().trim();
            return strValue === 'true' || strValue === '1' || strValue === 'hoạt động' || strValue === 'hoat dong' || strValue === 'có' || strValue === 'co' || strValue === 'yes' || strValue === 'active';
        },
        exportTransform: (value)=>value ? 'Hoạt động' : 'Ngừng'
    }
];
const categoryFieldGroups = {
    'Thông tin cơ bản': 'Thông tin cơ bản',
    'Phân cấp': 'Phân cấp',
    'Hiển thị': 'Hiển thị',
    'SEO & Mô tả': 'SEO & Mô tả',
    'Cài đặt': 'Cài đặt'
};
const categoryImportExportConfig = {
    entityType: 'categories',
    entityDisplayName: 'Danh mục sản phẩm',
    fields: categoryFields,
    // Template file
    templateFileName: 'Mau_Nhap_Danh_Muc.xlsx',
    sheetName: 'Danh mục',
    // Upsert config - dùng id làm key
    upsertKey: 'id',
    allowUpdate: true,
    allowInsert: true,
    // Max rows
    maxRows: 500,
    // Row-level transform after all field transforms
    postTransformRow: (row)=>{
        // Ensure isActive defaults to true for new categories
        if (row.isActive === undefined) {
            row.isActive = true;
        }
        // Default sortOrder to 0
        if (row.sortOrder === undefined) {
            row.sortOrder = 0;
        }
        // Generate slug from name if not provided
        if (!row.slug && row.name) {
            row.slug = String(row.name).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove diacritics
            .replace(/đ/g, 'd').replace(/Đ/g, 'D').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
        }
        return row;
    },
    // Validate entire row
    validateRow: (row, _index, _existingData, _mode)=>{
        const errors = [];
        if (!row.id || String(row.id).trim() === '') {
            errors.push({
                field: 'id',
                message: 'Mã danh mục là bắt buộc'
            });
        }
        if (!row.name || String(row.name).trim() === '') {
            errors.push({
                field: 'name',
                message: 'Tên danh mục là bắt buộc'
            });
        }
        return errors;
    }
};
}),
"[project]/lib/breadcrumb-generator.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearBreadcrumbStores",
    ()=>clearBreadcrumbStores,
    "generateBreadcrumb",
    ()=>generateBreadcrumb,
    "generateDetailBreadcrumb",
    ()=>generateDetailBreadcrumb,
    "generateFormBreadcrumb",
    ()=>generateFormBreadcrumb,
    "getEntityDisplayInfo",
    ()=>getEntityDisplayInfo,
    "getRegisteredStores",
    ()=>getRegisteredStores,
    "registerBreadcrumbStore",
    ()=>registerBreadcrumbStore,
    "useBreadcrumb",
    ()=>useBreadcrumb
]);
/**
 * 🍞 BREADCRUMB AUTO-GENERATION SYSTEM
 * 
 * Automatically generates breadcrumbs from route metadata + entity data
 * 
 * Features:
 * - Auto-lookup entity name from systemId
 * - Falls back to route metadata if entity not found
 * - Type-safe with SystemId branded types
 * - Supports all entity types from id-config.ts
 * 
 * @example
 * ```typescript
 * // Route: /receipts/VOUCHER00000123
 * const crumbs = generateBreadcrumb(location.pathname);
 * // Result: ['Phiếu thu/chi', 'PT000051']
 * ```
 * 
 * @version 1.0.0
 * @date 2025-11-11
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-config.ts [app-ssr] (ecmascript)");
;
let storeRegistry = {};
function registerBreadcrumbStore(entityType, getStore) {
    storeRegistry[entityType] = getStore;
}
/**
 * Find entity by systemId and return display name
 */ function findEntityDisplayName(entityType, systemId) {
    const getStore = storeRegistry[entityType];
    if (!getStore) return null;
    try {
        const store = getStore();
        const item = store.data.find((d)=>d.systemId === systemId);
        if (!item) return null;
        // Priority: name > title > id (business ID) > systemId
        return item.name || item.title || item.id || systemId;
    } catch (error) {
        console.warn(`[Breadcrumb] Failed to lookup ${entityType}:`, error);
        return null;
    }
}
function parseRouteEntity(pathname) {
    // Pattern: /{entity-type}/{systemId}
    const match = pathname.match(/^\/([^/]+)\/([^/]+)$/);
    if (!match) {
        return {
            entityType: null,
            systemId: null,
            displayName: null
        };
    }
    const [, routeType, id] = match;
    // Map route type to entity type
    const routeToEntityMap = {
        'receipts': 'voucher-receipt',
        'payments': 'voucher-payment',
        'employees': 'employees',
        'customers': 'customers',
        'products': 'products',
        'orders': 'orders',
        'suppliers': 'suppliers',
        'complaints': 'complaints',
        'warranty': 'warranty',
        'purchase-orders': 'purchase-orders',
        'sales-returns': 'sales-returns',
        'purchase-returns': 'purchase-returns',
        'inventory-checks': 'inventory-checks'
    };
    const entityType = routeToEntityMap[routeType] || null;
    if (!entityType) {
        return {
            entityType: null,
            systemId: id,
            displayName: null
        };
    }
    // Lookup display name
    const displayName = findEntityDisplayName(entityType, id);
    return {
        entityType,
        systemId: id,
        displayName
    };
}
function generateBreadcrumb(pathname, routeMeta) {
    // If route has static breadcrumb metadata, use it as base
    const baseCrumbs = routeMeta?.breadcrumb || [];
    // Try to enhance with entity data
    const entityInfo = parseRouteEntity(pathname);
    if (entityInfo.displayName) {
        // Replace last breadcrumb with entity display name
        return [
            ...baseCrumbs.slice(0, -1),
            entityInfo.displayName
        ];
    }
    // Fallback to route metadata
    return baseCrumbs;
}
function generateDetailBreadcrumb(entityType, systemId, listPageLabel) {
    const displayName = findEntityDisplayName(entityType, systemId);
    return [
        listPageLabel,
        displayName || systemId
    ];
}
function generateFormBreadcrumb(entityType, systemId, listPageLabel) {
    if (!systemId) {
        return [
            listPageLabel,
            'Thêm mới'
        ];
    }
    const displayName = findEntityDisplayName(entityType, systemId);
    return [
        listPageLabel,
        displayName || 'Chỉnh sửa'
    ];
}
function useBreadcrumb(entityType, systemId, listPageLabel) {
    if (!systemId) {
        return [
            listPageLabel,
            'Thêm mới'
        ];
    }
    return generateDetailBreadcrumb(entityType, systemId, listPageLabel);
}
function getEntityDisplayInfo(entityType) {
    try {
        const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getEntityConfig"])(entityType);
        return {
            displayName: config.displayName,
            prefix: config.prefix,
            category: config.category
        };
    } catch  {
        return null;
    }
}
function clearBreadcrumbStores() {
    storeRegistry = {};
}
function getRegisteredStores() {
    return Object.keys(storeRegistry);
}
}),
"[project]/lib/import-export/configs/order.config.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Order Import/Export Configuration
 * 
 * Import đơn hàng với các đặc điểm:
 * - Multi-line: Mỗi sản phẩm 1 dòng, các dòng cùng Mã đơn sẽ được gộp thành 1 Order
 * - Lookup khách hàng theo Mã KH (id field)
 * - Lookup sản phẩm theo SKU
 * - Trạng thái mặc định: "Đặt hàng"
 * - Lấy địa chỉ giao hàng từ khách hàng
 * - Không import phí ship, chiết khấu
 */ __turbopack_context__.s([
    "flattenOrdersForExport",
    ()=>flattenOrdersForExport,
    "orderFieldGroups",
    ()=>orderFieldGroups,
    "orderFields",
    ()=>orderFields,
    "orderImportExportConfig",
    ()=>orderImportExportConfig
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/customers/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/products/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/branches/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/employees/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
;
;
;
;
;
// ============================================
// HELPER FUNCTIONS
// ============================================
/**
 * Lookup khách hàng theo Mã KH (id field)
 */ const findCustomerById = (customerId)=>{
    if (!customerId) return undefined;
    const customers = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCustomerStore"].getState().data;
    const normalizedId = String(customerId).trim().toUpperCase();
    return customers.find((c)=>c.id.toUpperCase() === normalizedId || c.systemId.toUpperCase() === normalizedId);
};
/**
 * Lookup sản phẩm theo SKU
 */ const findProductBySku = (sku)=>{
    if (!sku) return undefined;
    const products = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState().data;
    const normalizedSku = String(sku).trim().toUpperCase();
    return products.find((p)=>p.id.toUpperCase() === normalizedSku || p.sku?.toUpperCase() === normalizedSku || p.systemId.toUpperCase() === normalizedSku);
};
/**
 * Lookup chi nhánh theo tên hoặc mã
 */ const findBranch = (branchIdOrName)=>{
    if (!branchIdOrName) return undefined;
    const branches = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useBranchStore"].getState().data;
    const normalized = String(branchIdOrName).trim().toLowerCase();
    return branches.find((b)=>b.id.toLowerCase() === normalized || b.name.toLowerCase() === normalized || b.systemId.toLowerCase() === normalized);
};
/**
 * Lookup nhân viên theo tên hoặc mã
 */ const findEmployee = (employeeIdOrName)=>{
    if (!employeeIdOrName) return undefined;
    const employees = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmployeeStore"].getState().data;
    const normalized = String(employeeIdOrName).trim().toLowerCase();
    return employees.find((e)=>e.id.toLowerCase() === normalized || e.fullName.toLowerCase() === normalized || e.systemId.toLowerCase() === normalized);
};
/**
 * Get default branch
 */ const getDefaultBranch = ()=>{
    const branches = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useBranchStore"].getState().data;
    return branches.find((b)=>b.isDefault) || branches[0];
};
/**
 * Get default shipping address from customer
 */ const getCustomerShippingAddress = (customer)=>{
    if (!customer) return undefined;
    // Tìm địa chỉ mặc định hoặc địa chỉ đầu tiên
    const defaultAddr = customer.addresses?.find((a)=>a.isDefault || a.isDefaultShipping) || customer.addresses?.[0];
    if (defaultAddr) {
        const formattedAddress = [
            defaultAddr.street,
            defaultAddr.ward,
            defaultAddr.district,
            defaultAddr.province
        ].filter(Boolean).join(', ');
        return {
            street: defaultAddr.street,
            ward: defaultAddr.ward,
            district: defaultAddr.district,
            province: defaultAddr.province,
            contactName: customer.name,
            phone: customer.phone,
            formattedAddress
        };
    }
    return undefined;
};
const orderFields = [
    // ===== Thông tin đơn hàng =====
    {
        key: 'orderId',
        label: 'Mã đơn hàng (*)',
        type: 'string',
        required: true,
        example: 'DH001',
        group: 'Đơn hàng',
        defaultSelected: true
    },
    {
        key: 'customerId',
        label: 'Mã khách hàng (*)',
        type: 'string',
        required: true,
        example: 'KH001',
        group: 'Đơn hàng',
        defaultSelected: true
    },
    {
        key: 'branchName',
        label: 'Chi nhánh',
        type: 'string',
        required: false,
        example: 'Chi nhánh Hà Nội',
        group: 'Đơn hàng',
        defaultSelected: true,
        validator: (value)=>{
            if (value && String(value).trim() !== '') {
                const branch = findBranch(String(value));
                if (!branch) {
                    return `Không tìm thấy chi nhánh "${value}"`;
                }
            }
            return true;
        }
    },
    {
        key: 'salespersonName',
        label: 'Nhân viên bán hàng',
        type: 'string',
        required: false,
        example: 'Nguyễn Văn A',
        group: 'Đơn hàng',
        defaultSelected: true,
        validator: (value)=>{
            if (value && String(value).trim() !== '') {
                const employee = findEmployee(String(value));
                if (!employee) {
                    return `Không tìm thấy nhân viên "${value}"`;
                }
            }
            return true;
        }
    },
    {
        key: 'orderDate',
        label: 'Ngày đặt hàng',
        type: 'date',
        required: false,
        example: '19/12/2024',
        group: 'Đơn hàng',
        defaultSelected: true
    },
    {
        key: 'source',
        label: 'Nguồn đơn',
        type: 'string',
        required: false,
        example: 'Website',
        group: 'Đơn hàng',
        defaultSelected: false
    },
    {
        key: 'tags',
        label: 'Tags',
        type: 'string',
        required: false,
        example: 'VIP, Gấp',
        group: 'Đơn hàng',
        defaultSelected: false
    },
    {
        key: 'orderNote',
        label: 'Ghi chú đơn hàng',
        type: 'string',
        required: false,
        example: 'Giao buổi sáng',
        group: 'Đơn hàng',
        defaultSelected: true
    },
    // ===== Thông tin sản phẩm =====
    {
        key: 'productSku',
        label: 'SKU sản phẩm (*)',
        type: 'string',
        required: true,
        example: 'SP001',
        group: 'Sản phẩm',
        defaultSelected: true,
        validator: (value)=>{
            if (!value || String(value).trim() === '') {
                return 'SKU sản phẩm không được để trống';
            }
            const product = findProductBySku(String(value));
            if (!product) {
                return `Không tìm thấy sản phẩm với SKU "${value}"`;
            }
            return true;
        }
    },
    {
        key: 'quantity',
        label: 'Số lượng (*)',
        type: 'number',
        required: true,
        example: '2',
        group: 'Sản phẩm',
        defaultSelected: true,
        validator: (value)=>{
            const qty = Number(value);
            if (isNaN(qty) || qty <= 0) {
                return 'Số lượng phải là số dương';
            }
            return true;
        },
        importTransform: (value)=>{
            const num = Number(value);
            return isNaN(num) ? 1 : Math.max(1, Math.floor(num));
        }
    },
    {
        key: 'unitPrice',
        label: 'Đơn giá',
        type: 'number',
        required: false,
        example: '150000',
        group: 'Sản phẩm',
        defaultSelected: true,
        importTransform: (value)=>{
            if (value === undefined || value === null || value === '') return undefined;
            const num = Number(value);
            return isNaN(num) ? undefined : Math.max(0, num);
        }
    },
    {
        key: 'lineNote',
        label: 'Ghi chú SP',
        type: 'string',
        required: false,
        example: 'Màu đỏ',
        group: 'Sản phẩm',
        defaultSelected: false
    }
];
const orderFieldGroups = [
    {
        id: 'order-info',
        label: 'Thông tin đơn hàng',
        columns: [
            {
                key: 'id',
                label: 'Mã đơn hàng',
                defaultSelected: true
            },
            {
                key: 'orderDate',
                label: 'Ngày đặt',
                defaultSelected: true
            },
            {
                key: 'status',
                label: 'Trạng thái',
                defaultSelected: true
            },
            {
                key: 'source',
                label: 'Nguồn đơn',
                defaultSelected: false
            },
            {
                key: 'tags',
                label: 'Tags',
                defaultSelected: false
            },
            {
                key: 'notes',
                label: 'Ghi chú',
                defaultSelected: false
            }
        ]
    },
    {
        id: 'customer-info',
        label: 'Thông tin khách hàng',
        columns: [
            {
                key: 'customerId',
                label: 'Mã KH',
                defaultSelected: true
            },
            {
                key: 'customerName',
                label: 'Tên khách hàng',
                defaultSelected: true
            },
            {
                key: 'customerPhone',
                label: 'SĐT khách',
                defaultSelected: true
            },
            {
                key: 'shippingAddress',
                label: 'Địa chỉ giao',
                defaultSelected: true
            }
        ]
    },
    {
        id: 'product-info',
        label: 'Thông tin sản phẩm',
        columns: [
            {
                key: 'productSku',
                label: 'SKU',
                defaultSelected: true
            },
            {
                key: 'productName',
                label: 'Tên sản phẩm',
                defaultSelected: true
            },
            {
                key: 'quantity',
                label: 'Số lượng',
                defaultSelected: true
            },
            {
                key: 'unitPrice',
                label: 'Đơn giá',
                defaultSelected: true
            },
            {
                key: 'lineTotal',
                label: 'Thành tiền',
                defaultSelected: true
            },
            {
                key: 'lineNote',
                label: 'Ghi chú SP',
                defaultSelected: false
            }
        ]
    },
    {
        id: 'payment-info',
        label: 'Thanh toán',
        columns: [
            {
                key: 'subtotal',
                label: 'Tạm tính',
                defaultSelected: true
            },
            {
                key: 'shippingFee',
                label: 'Phí ship',
                defaultSelected: false
            },
            {
                key: 'orderDiscount',
                label: 'Chiết khấu',
                defaultSelected: false
            },
            {
                key: 'grandTotal',
                label: 'Tổng tiền',
                defaultSelected: true
            },
            {
                key: 'paidAmount',
                label: 'Đã thanh toán',
                defaultSelected: true
            },
            {
                key: 'paymentStatus',
                label: 'Trạng thái TT',
                defaultSelected: true
            }
        ]
    },
    {
        id: 'delivery-info',
        label: 'Vận chuyển',
        columns: [
            {
                key: 'deliveryMethod',
                label: 'Phương thức giao',
                defaultSelected: true
            },
            {
                key: 'deliveryStatus',
                label: 'Trạng thái giao',
                defaultSelected: true
            },
            {
                key: 'trackingCode',
                label: 'Mã vận đơn',
                defaultSelected: false
            },
            {
                key: 'carrier',
                label: 'ĐVVC',
                defaultSelected: false
            }
        ]
    },
    {
        id: 'branch-staff',
        label: 'Chi nhánh & Nhân viên',
        columns: [
            {
                key: 'branchName',
                label: 'Chi nhánh',
                defaultSelected: true
            },
            {
                key: 'salesperson',
                label: 'Nhân viên bán',
                defaultSelected: true
            }
        ]
    }
];
const orderImportExportConfig = {
    entityType: 'orders',
    entityDisplayName: 'Đơn hàng',
    fields: orderFields,
    templateFileName: 'Mau_Nhap_Don_Hang.xlsx',
    sheetName: 'Đơn hàng',
    // Import settings
    upsertKey: 'id',
    allowUpdate: false,
    allowInsert: true,
    requirePreview: true,
    maxRows: 1000,
    maxErrorsAllowed: 0,
    // Pre-process: Fill empty orderId/customerId from previous row
    // User must fill orderId + customerId on first row of each order
    // Subsequent product rows can leave them empty → will inherit from previous row
    preProcessRows: (rows)=>{
        const importRows = rows;
        let currentOrderId = '';
        let currentCustomerId = '';
        for (const row of importRows){
            // If orderId is provided, use it and update current
            if (row.orderId?.trim()) {
                currentOrderId = row.orderId.trim();
                // Also update customerId if provided on the same row
                if (row.customerId?.trim()) {
                    currentCustomerId = row.customerId.trim();
                }
            } else if (currentOrderId) {
                // Fill from previous row's orderId (for subsequent product lines)
                row.orderId = currentOrderId;
            }
            // Note: if orderId is empty and no previous orderId → validation will catch it
            // Fill customerId if empty (inherit from previous row)
            if (!row.customerId?.trim() && currentCustomerId) {
                row.customerId = currentCustomerId;
            } else if (row.customerId?.trim()) {
                currentCustomerId = row.customerId.trim();
            }
        }
        return importRows;
    },
    // Validate row (after pre-processing)
    validateRow: (row, _index, existingData, mode)=>{
        const errors = [];
        const importRow = row;
        // Check required fields - orderId must be filled on first row of each order
        if (!importRow.orderId) {
            errors.push({
                field: 'orderId',
                message: 'Mã đơn hàng không được để trống (bắt buộc điền ở dòng đầu của mỗi đơn)'
            });
        }
        if (!importRow.customerId) {
            errors.push({
                field: 'customerId',
                message: 'Mã khách hàng không được để trống (điền ở dòng đầu của mỗi đơn)'
            });
        }
        if (!importRow.productSku) {
            errors.push({
                field: 'productSku',
                message: 'SKU sản phẩm không được để trống'
            });
        }
        // Validate customer
        if (importRow.customerId) {
            const customer = findCustomerById(importRow.customerId);
            if (!customer) {
                errors.push({
                    field: 'customerId',
                    message: `Không tìm thấy khách hàng "${importRow.customerId}"`
                });
            }
        }
        // Validate product
        if (importRow.productSku) {
            const product = findProductBySku(importRow.productSku);
            if (!product) {
                errors.push({
                    field: 'productSku',
                    message: `Không tìm thấy sản phẩm "${importRow.productSku}"`
                });
            }
        }
        // Validate branch if provided
        if (importRow.branchName) {
            const branch = findBranch(importRow.branchName);
            if (!branch) {
                errors.push({
                    field: 'branchName',
                    message: `Không tìm thấy chi nhánh "${importRow.branchName}"`
                });
            }
        }
        // Validate salesperson if provided
        if (importRow.salespersonName) {
            const employee = findEmployee(importRow.salespersonName);
            if (!employee) {
                errors.push({
                    field: 'salespersonName',
                    message: `Không tìm thấy nhân viên "${importRow.salespersonName}"`
                });
            }
        }
        // Validate quantity
        if (importRow.quantity !== undefined) {
            const qty = Number(importRow.quantity);
            if (isNaN(qty) || qty <= 0) {
                errors.push({
                    field: 'quantity',
                    message: 'Số lượng phải là số dương'
                });
            }
        }
        // Check duplicate order ID in existing data (only in insert-only mode)
        if (mode === 'insert-only' && importRow.orderId) {
            const duplicate = existingData.find((o)=>o.id.toUpperCase() === importRow.orderId.toUpperCase());
            if (duplicate) {
                errors.push({
                    field: 'orderId',
                    message: `Mã đơn hàng "${importRow.orderId}" đã tồn tại`
                });
            }
        }
        return errors;
    },
    // Transform: Group rows by orderId and build Order objects
    // This is handled in postTransformRow and beforeImport
    beforeImport: async (data)=>{
        // data here is actually OrderImportRow[] after field transforms
        const importRows = data;
        // Group rows by orderId
        const orderMap = new Map();
        for (const row of importRows){
            const orderId = row.orderId?.trim().toUpperCase();
            if (!orderId) continue;
            if (!orderMap.has(orderId)) {
                const customer = findCustomerById(row.customerId);
                const branch = row.branchName ? findBranch(row.branchName) : getDefaultBranch();
                const employee = row.salespersonName ? findEmployee(row.salespersonName) : undefined;
                orderMap.set(orderId, {
                    rows: [],
                    customer,
                    branch,
                    employee
                });
            }
            orderMap.get(orderId).rows.push(row);
        }
        // Build Order objects
        const orders = [];
        const now = new Date().toISOString();
        for (const [orderId, { rows, customer, branch, employee }] of orderMap.entries()){
            if (!customer || rows.length === 0) continue;
            // Build line items
            const lineItems = [];
            for (const row of rows){
                const product = findProductBySku(row.productSku);
                if (!product) continue;
                const quantity = Math.max(1, Math.floor(Number(row.quantity) || 1));
                const unitPrice = row.unitPrice ?? product.sellingPrice ?? product.costPrice ?? 0;
                lineItems.push({
                    productSystemId: product.systemId,
                    productId: product.id,
                    productName: product.name,
                    quantity,
                    unitPrice,
                    discount: 0,
                    discountType: 'fixed',
                    note: row.lineNote
                });
            }
            if (lineItems.length === 0) continue;
            // Calculate totals
            const subtotal = lineItems.reduce((sum, item)=>{
                return sum + item.unitPrice * item.quantity;
            }, 0);
            // Get first row for order-level data
            const firstRow = rows[0];
            // Parse order date
            let orderDate = now;
            if (firstRow.orderDate) {
                const parsed = new Date(firstRow.orderDate);
                if (!isNaN(parsed.getTime())) {
                    orderDate = parsed.toISOString();
                }
            }
            // Build shipping address from customer
            const shippingAddress = getCustomerShippingAddress(customer);
            // Parse tags
            const tags = firstRow.tags ? firstRow.tags.split(',').map((t)=>t.trim()).filter(Boolean) : undefined;
            const order = {
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(''),
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(orderId),
                customerSystemId: customer.systemId,
                customerName: customer.name,
                branchSystemId: branch?.systemId || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(''),
                branchName: branch?.name || '',
                salespersonSystemId: employee?.systemId || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(''),
                salesperson: employee?.fullName || '',
                orderDate,
                // Statuses - all new orders start with "Đặt hàng"
                status: 'Đặt hàng',
                paymentStatus: 'Chưa thanh toán',
                deliveryStatus: 'Chờ đóng gói',
                printStatus: 'Chưa in',
                stockOutStatus: 'Chưa xuất kho',
                returnStatus: 'Chưa trả hàng',
                deliveryMethod: 'Dịch vụ giao hàng',
                // Address
                shippingAddress,
                // Line items
                lineItems,
                // Totals (no discount, no shipping fee from import)
                subtotal,
                shippingFee: 0,
                tax: 0,
                grandTotal: subtotal,
                paidAmount: 0,
                codAmount: 0,
                // Arrays
                payments: [],
                packagings: [],
                // Optional fields
                notes: firstRow.orderNote,
                source: firstRow.source,
                tags,
                // Timestamps
                createdAt: now,
                updatedAt: now
            };
            orders.push(order);
        }
        return orders;
    }
};
function flattenOrdersForExport(orders) {
    const rows = [];
    for (const order of orders){
        // Get customer info
        const customer = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCustomerStore"].getState().findById(order.customerSystemId);
        // Get latest packaging for tracking info
        const latestPackaging = order.packagings?.[order.packagings.length - 1];
        for (const item of order.lineItems){
            rows.push({
                // Order info
                id: order.id,
                orderDate: order.orderDate,
                status: order.status,
                source: order.source || '',
                tags: order.tags?.join(', ') || '',
                notes: order.notes || '',
                // Customer info
                customerId: customer?.id || '',
                customerName: order.customerName,
                customerPhone: customer?.phone || '',
                shippingAddress: typeof order.shippingAddress === 'string' ? order.shippingAddress : order.shippingAddress?.formattedAddress || '',
                // Product info
                productSku: item.productId,
                productName: item.productName,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                lineTotal: item.unitPrice * item.quantity,
                lineNote: item.note || '',
                // Payment info
                subtotal: order.subtotal,
                shippingFee: order.shippingFee,
                orderDiscount: order.orderDiscount || 0,
                grandTotal: order.grandTotal,
                paidAmount: order.paidAmount,
                paymentStatus: order.paymentStatus,
                // Delivery info
                deliveryMethod: order.deliveryMethod,
                deliveryStatus: order.deliveryStatus,
                trackingCode: latestPackaging?.trackingCode || '',
                carrier: latestPackaging?.carrier || '',
                // Branch & Staff
                branchName: order.branchName,
                salesperson: order.salesperson
            });
        }
    }
    return rows;
}
}),
"[project]/lib/import-export/configs/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
/**
 * Import/Export Configs - Index
 * 
 * Re-export tất cả configs
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$export$2f$configs$2f$employee$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/import-export/configs/employee.config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$export$2f$configs$2f$attendance$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/import-export/configs/attendance.config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$export$2f$configs$2f$customer$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/import-export/configs/customer.config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$export$2f$configs$2f$product$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/import-export/configs/product.config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$export$2f$configs$2f$brand$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/import-export/configs/brand.config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$export$2f$configs$2f$category$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/import-export/configs/category.config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$export$2f$configs$2f$order$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/import-export/configs/order.config.ts [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
}),
"[project]/lib/import-export/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * Import/Export System - Main Exports
 */ // Types
__turbopack_context__.s([]);
// Store
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$export$2f$import$2d$export$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/import-export/import-export-store.ts [app-ssr] (ecmascript)");
// Employee Mapping Store
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$export$2f$employee$2d$mapping$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/import-export/employee-mapping-store.ts [app-ssr] (ecmascript)");
// Utils
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$export$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/import-export/utils.ts [app-ssr] (ecmascript)");
// Attendance Parser
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$export$2f$attendance$2d$parser$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/import-export/attendance-parser.ts [app-ssr] (ecmascript)");
// Configs
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$export$2f$configs$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/import-export/configs/index.ts [app-ssr] (ecmascript) <locals>");
;
;
;
;
;
}),
"[project]/lib/api-config.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * API Configuration Utilities
 * 
 * Centralized configuration for API endpoints.
 * All API URLs should use these utilities instead of hardcoding.
 */ /**
 * Get the API base URL from environment variables
 * Falls back to localhost:3001 for development
 */ __turbopack_context__.s([
    "getApiBaseUrl",
    ()=>getApiBaseUrl,
    "getApiUrl",
    ()=>getApiUrl,
    "getBaseUrl",
    ()=>getBaseUrl,
    "getFileUrl",
    ()=>getFileUrl
]);
const __TURBOPACK__import$2e$meta__ = {
    get url () {
        return `file://${__turbopack_context__.P("lib/api-config.ts")}`;
    }
};
function getApiBaseUrl() {
    // Use relative path to leverage Vite proxy in development
    // This avoids CORS issues when frontend (5173) talks to backend (3001)
    if (__TURBOPACK__import$2e$meta__.env?.DEV) {
        return '/api';
    }
    return __TURBOPACK__import$2e$meta__.env?.VITE_API_BASE_URL || 'http://localhost:3001/api';
}
function getBaseUrl() {
    const apiUrl = getApiBaseUrl();
    return apiUrl.replace('/api', '');
}
function getFileUrl(relativePath) {
    if (!relativePath) return '';
    // If already a full URL, return as is
    if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
        return relativePath;
    }
    // Build full URL
    const baseUrl = getBaseUrl();
    return `${baseUrl}${relativePath}`;
}
function getApiUrl(endpoint) {
    const apiBaseUrl = getApiBaseUrl();
    return `${apiBaseUrl}${endpoint}`;
}
}),
"[project]/lib/file-upload-api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FileUploadAPI",
    ()=>FileUploadAPI
]);
// API client để giao tiếp với server - Staging System
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-config.ts [app-ssr] (ecmascript)");
;
const API_BASE_URL = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getApiBaseUrl"])();
class FileUploadAPI {
    // Upload files vào staging (tạm thời)
    static async uploadToStaging(files, sessionId) {
        const formData = new FormData();
        files.forEach((file)=>{
            formData.append('files', file);
        });
        // CRITICAL FIX: sessionId in FormData doesn't work with multer
        // Send via query params instead
        const url = sessionId ? `${API_BASE_URL}/staging/upload?sessionId=${encodeURIComponent(sessionId)}` : `${API_BASE_URL}/staging/upload`;
        console.log('📤 Uploading to:', url);
        console.log('📦 Files:', files.map((f)=>`${f.name} (${(f.size / 1024).toFixed(1)}KB)`));
        let response;
        try {
            response = await fetch(url, {
                method: 'POST',
                body: formData
            });
        } catch (fetchError) {
            console.error('❌ Network fetch failed:', fetchError);
            throw new Error(`Không thể kết nối đến server (${API_BASE_URL}). Vui lòng kiểm tra server có đang chạy.`);
        }
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Server error:', response.status, errorText);
            throw new Error(`Server error (${response.status}): ${errorText}`);
        }
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || 'Staging upload failed');
        }
        return {
            files: result.files,
            sessionId: result.sessionId
        };
    }
    // Confirm staging files → permanent với smart filename
    // NOTE: entitySystemId MUST be immutable (systemId) to avoid broken references
    static async confirmStagingFiles(sessionId, entitySystemId, documentType, documentName, metadata) {
        const response = await fetch(`${API_BASE_URL}/staging/confirm/${sessionId}/${entitySystemId}/${documentType}/${encodeURIComponent(documentName)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                metadata
            })
        });
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || 'Confirm failed');
        }
        return result.files;
    }
    // Lấy staging files theo session
    static async getStagingFiles(sessionId) {
        const response = await fetch(`${API_BASE_URL}/staging/files/${sessionId}`);
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || 'Failed to fetch staging files');
        }
        return result.files;
    }
    // Xóa staging files (cancel)
    static async deleteStagingFiles(sessionId) {
        const response = await fetch(`${API_BASE_URL}/staging/${sessionId}`, {
            method: 'DELETE'
        });
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || 'Delete staging failed');
        }
    }
    // Upload files lên server (legacy - direct permanent)
    // NOTE: employeeId MUST be the systemId (immutable), NOT the business ID
    static async uploadFiles(employeeId, documentType, documentName, files) {
        const formData = new FormData();
        files.forEach((file)=>{
            formData.append('files', file);
        });
        const response = await fetch(`${API_BASE_URL}/upload/${employeeId}/${documentType}/${encodeURIComponent(documentName)}`, {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || 'Upload failed');
        }
        return result.files;
    }
    // Lấy danh sách file permanent
    // NOTE: employeeId MUST be the systemId (immutable), NOT the business ID
    static async getFiles(employeeId, documentType) {
        try {
            const url = documentType ? `${API_BASE_URL}/files/${employeeId}/${documentType}` : `${API_BASE_URL}/files/${employeeId}`;
            const response = await fetch(url);
            // Check if response is ok
            if (!response.ok) {
                return []; // Return empty array instead of throwing
            }
            const result = await response.json();
            if (!result.success) {
                return []; // Return empty array instead of throwing
            }
            return result.files || [];
        } catch (error) {
            return []; // Return empty array on network error
        }
    }
    // Xóa file permanent
    static async deleteFile(fileId) {
        const response = await fetch(`${API_BASE_URL}/files/${fileId}`, {
            method: 'DELETE'
        });
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || 'Delete failed');
        }
    }
    // Lấy URL file để hiển thị (bao gồm staging và permanent)
    static getFileUrl(file) {
        // ✅ Return relative path to use Vite proxy - avoid CORS
        // Server already returns relative path like /api/staging/files/...
        return file.url;
    }
    // Thống kê storage (chỉ permanent files)
    static async getStorageInfo() {
        const response = await fetch(`${API_BASE_URL}/storage/info`);
        const result = await response.json();
        if (!result.success) {
            throw new Error('Failed to get storage info');
        }
        return result.stats;
    }
    // Helper: Generate session ID cho staging
    static generateSessionId() {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    static async getProductFiles(productId) {
        return this.getFiles(productId, 'products');
    }
    // Get customer files (images)
    static async getCustomerFiles(customerId) {
        try {
            const response = await fetch(`${API_BASE_URL}/files/customers/${customerId}`);
            if (!response.ok) {
                return [];
            }
            const result = await response.json();
            if (!result.success) {
                return [];
            }
            return result.files || [];
        } catch (error) {
            console.error('Failed to get customer files:', error);
            return [];
        }
    }
    // Get customer contract files
    static async getCustomerContractFiles(customerId) {
        try {
            const response = await fetch(`${API_BASE_URL}/files/customers/${customerId}/contracts`);
            if (!response.ok) {
                return [];
            }
            const result = await response.json();
            if (!result.success) {
                return [];
            }
            return result.files || [];
        } catch (error) {
            console.error('Failed to get customer contract files:', error);
            return [];
        }
    }
    // Confirm customer contract files from staging to permanent
    static async confirmCustomerContractFiles(sessionId, customerId, customerData) {
        const response = await fetch(`${API_BASE_URL}/staging/confirm/${sessionId}/customers/${customerId}/contracts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                customerData
            })
        });
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || 'Confirm customer contract files failed');
        }
        return result.files;
    }
    // Confirm customer images from staging to permanent
    static async confirmCustomerImages(sessionId, customerId, customerData) {
        const response = await fetch(`${API_BASE_URL}/staging/confirm/${sessionId}/customers/${customerId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                customerData
            })
        });
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || 'Confirm customer images failed');
        }
        return result.files;
    }
    // Confirm warranty images from staging to permanent
    static async confirmWarrantyImages(sessionId, warrantyId, imageType, warrantyData) {
        const response = await fetch(`${API_BASE_URL}/staging/confirm/${sessionId}/warranty/${warrantyId}/${imageType}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                warrantyData
            })
        });
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || 'Confirm warranty images failed');
        }
        return result.files;
    }
    // Delete staging session (cleanup on cancel)
    static async deleteStagingSession(sessionId) {
        const response = await fetch(`${API_BASE_URL}/staging/${sessionId}`, {
            method: 'DELETE'
        });
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || 'Delete staging session failed');
        }
    }
    /**
   * Upload ảnh từ TipTap Editor vào STAGING
   * Ảnh sẽ được move sang permanent khi entity được save
   * 
   * @param file - File ảnh cần upload
   * @param sessionId - Session ID để group các ảnh cùng editor
   * @returns StagingFile với URL tạm thời
   */ static async uploadEditorImageToStaging(file, sessionId) {
        const result = await FileUploadAPI.uploadToStaging([
            file
        ], sessionId);
        return {
            file: result.files[0],
            sessionId: result.sessionId
        };
    }
    /**
   * Confirm ảnh editor từ staging sang permanent
   * Đồng thời replace staging URLs trong HTML content bằng permanent URLs
   * 
   * @param sessionId - Editor staging session
   * @param entityId - ID của entity (category, product, etc.)
   * @param entityType - Loại entity ('categories', 'products', etc.)
   * @param htmlContent - Nội dung HTML cần update URLs
   * @returns Updated HTML với permanent URLs
   */ static async confirmEditorImages(sessionId, entityId, entityType, htmlContent) {
        // Confirm staging files
        const confirmedFiles = await FileUploadAPI.confirmStagingFiles(sessionId, entityId, entityType, 'editor-images', {
            source: 'tiptap-editor'
        });
        // Replace staging URLs with permanent URLs in HTML
        let updatedHtml = htmlContent;
        for (const file of confirmedFiles){
            // Staging URL pattern: /api/staging/preview/{sessionId}/{filename}
            // Find and replace with permanent URL
            const stagingPattern = new RegExp(`/api/staging/preview/[^/]+/${file.filename.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g');
            updatedHtml = updatedHtml.replace(stagingPattern, file.url);
        }
        return {
            html: updatedHtml,
            files: confirmedFiles
        };
    }
    static async uploadCommentImage(file) {
        const formData = new FormData();
        formData.append('image', file);
        const response = await fetch(`${API_BASE_URL}/comments/upload-image`, {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        if (!response.ok || !result.success) {
            throw new Error(result.message || 'Upload ảnh bình luận thất bại');
        }
        return FileUploadAPI.mapDirectUpload(result.file, file.name);
    }
    static async uploadPrintTemplateImage(file) {
        const formData = new FormData();
        formData.append('image', file);
        const response = await fetch(`${API_BASE_URL}/print-templates/upload-image`, {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        if (!response.ok || !result.success) {
            throw new Error(result.message || 'Upload ảnh mẫu in thất bại');
        }
        return FileUploadAPI.mapDirectUpload(result.file, file.name);
    }
    static async uploadComplaintCommentImage(complaintId, file) {
        const formData = new FormData();
        formData.append('image', file);
        const response = await fetch(`${API_BASE_URL}/complaints/${complaintId}/comments/upload`, {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        if (!response.ok || !result.success) {
            throw new Error(result.message || 'Upload ảnh khiếu nại thất bại');
        }
        return FileUploadAPI.mapDirectUpload(result.file, file.name);
    }
    static async uploadTaskEvidence(taskId, files) {
        if (files.length === 0) {
            return [];
        }
        const formData = new FormData();
        files.forEach((file)=>formData.append('files', file));
        const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/evidence`, {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        if (!response.ok || !result.success) {
            throw new Error(result.message || 'Upload bằng chứng công việc thất bại');
        }
        return (result.files || []).map((file, index)=>FileUploadAPI.mapDirectUpload(file, files[index]?.name || `evidence-${index}`));
    }
    static mapDirectUpload(file, fallbackName) {
        return {
            id: file.id,
            name: file.originalName || file.name || fallbackName,
            size: file.size || file.filesize || 0,
            type: file.mimetype || file.type || 'application/octet-stream',
            url: file.url,
            uploadedAt: file.uploadedAt || new Date().toISOString()
        };
    }
}
}),
];

//# sourceMappingURL=lib_d7875627._.js.map