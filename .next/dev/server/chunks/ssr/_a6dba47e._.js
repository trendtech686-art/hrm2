module.exports = [
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
"[project]/hooks/use-debounce.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useDebounce",
    ()=>useDebounce
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
function useDebounce(value, delay) {
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
"[project]/app/(authenticated)/settings/pkgx/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$pkgx$2d$settings$2d$page$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/pkgx-settings-page.tsx [app-ssr] (ecmascript)");
'use client';
;
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$pkgx$2d$settings$2d$page$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PkgxSettingsPage"];
}),
];

//# sourceMappingURL=_a6dba47e._.js.map