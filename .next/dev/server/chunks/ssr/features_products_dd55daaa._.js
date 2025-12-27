module.exports = [
"[project]/features/products/api/products-api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Products API - Isolated API functions
 * 
 * ⚠️ IMPORTANT: This file should ONLY contain:
 * - Fetch functions
 * - Type imports from ../types
 * - NO store imports
 * - NO cross-feature imports
 */ __turbopack_context__.s([
    "createProduct",
    ()=>createProduct,
    "deleteProduct",
    ()=>deleteProduct,
    "fetchProduct",
    ()=>fetchProduct,
    "fetchProductInventory",
    ()=>fetchProductInventory,
    "fetchProducts",
    ()=>fetchProducts,
    "searchProducts",
    ()=>searchProducts,
    "updateProduct",
    ()=>updateProduct
]);
const API_BASE = '/api/products';
async function fetchProducts(params = {}) {
    const { page = 1, limit = 50, ...rest } = params;
    const searchParams = new URLSearchParams({
        page: String(page),
        limit: String(limit)
    });
    // Add optional params
    Object.entries(rest).forEach(([key, value])=>{
        if (value != null && value !== '') {
            searchParams.set(key, String(value));
        }
    });
    const res = await fetch(`${API_BASE}?${searchParams}`, {
        credentials: 'include'
    });
    if (!res.ok) {
        throw new Error(`Failed to fetch products: ${res.statusText}`);
    }
    return res.json();
}
async function fetchProduct(id) {
    const res = await fetch(`${API_BASE}/${id}`, {
        credentials: 'include'
    });
    if (!res.ok) {
        throw new Error(`Failed to fetch product ${id}: ${res.statusText}`);
    }
    return res.json();
}
async function createProduct(data) {
    const res = await fetch(API_BASE, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(data)
    });
    if (!res.ok) {
        const error = await res.json().catch(()=>({}));
        throw new Error(error.message || `Failed to create product: ${res.statusText}`);
    }
    return res.json();
}
async function updateProduct({ systemId, ...data }) {
    const res = await fetch(`${API_BASE}/${systemId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(data)
    });
    if (!res.ok) {
        const error = await res.json().catch(()=>({}));
        throw new Error(error.message || `Failed to update product: ${res.statusText}`);
    }
    return res.json();
}
async function deleteProduct(id) {
    const res = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    });
    if (!res.ok) {
        const error = await res.json().catch(()=>({}));
        throw new Error(error.message || `Failed to delete product: ${res.statusText}`);
    }
}
async function searchProducts(query, limit = 20) {
    const res = await fetch(`${API_BASE}?search=${encodeURIComponent(query)}&limit=${limit}`, {
        credentials: 'include'
    });
    if (!res.ok) {
        throw new Error(`Failed to search products: ${res.statusText}`);
    }
    const json = await res.json();
    return json.data || [];
}
async function fetchProductInventory(productId) {
    const res = await fetch(`${API_BASE}/${productId}/inventory`, {
        credentials: 'include'
    });
    if (!res.ok) {
        throw new Error(`Failed to fetch product inventory: ${res.statusText}`);
    }
    return res.json();
}
}),
"[project]/features/products/hooks/use-products.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "productKeys",
    ()=>productKeys,
    "useActiveProducts",
    ()=>useActiveProducts,
    "useProduct",
    ()=>useProduct,
    "useProductInventory",
    ()=>useProductInventory,
    "useProductMutations",
    ()=>useProductMutations,
    "useProductSearch",
    ()=>useProductSearch,
    "useProducts",
    ()=>useProducts,
    "useProductsByBrand",
    ()=>useProductsByBrand,
    "useProductsByCategory",
    ()=>useProductsByCategory
]);
/**
 * useProducts - React Query hooks for products
 * 
 * ⚠️ IMPORTANT: Direct import pattern
 * - Import this file directly: import { useProducts } from '@/features/products/hooks/use-products'
 * - NEVER import from '@/features/products' or '@/features/products/store'
 * 
 * This hook is ISOLATED - it only depends on:
 * - @tanstack/react-query
 * - Local API functions
 * - Local types
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/query-core/build/modern/utils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$api$2f$products$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/products/api/products-api.ts [app-ssr] (ecmascript)");
;
;
const productKeys = {
    all: [
        'products'
    ],
    lists: ()=>[
            ...productKeys.all,
            'list'
        ],
    list: (params)=>[
            ...productKeys.lists(),
            params
        ],
    details: ()=>[
            ...productKeys.all,
            'detail'
        ],
    detail: (id)=>[
            ...productKeys.details(),
            id
        ],
    search: (query)=>[
            ...productKeys.all,
            'search',
            query
        ],
    inventory: (id)=>[
            ...productKeys.all,
            'inventory',
            id
        ]
};
function useProducts(params = {}) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: productKeys.list(params),
        queryFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$api$2f$products$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchProducts"])(params),
        staleTime: 60_000,
        gcTime: 10 * 60 * 1000,
        placeholderData: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["keepPreviousData"]
    });
}
function useProduct(id) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: productKeys.detail(id),
        queryFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$api$2f$products$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchProduct"])(id),
        enabled: !!id,
        staleTime: 60_000,
        gcTime: 10 * 60 * 1000
    });
}
function useProductSearch(query, limit = 20) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: productKeys.search(query),
        queryFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$api$2f$products$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["searchProducts"])(query, limit),
        enabled: query.length >= 2,
        staleTime: 30_000
    });
}
function useProductInventory(productId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: productKeys.inventory(productId),
        queryFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$api$2f$products$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchProductInventory"])(productId),
        enabled: !!productId,
        staleTime: 30_000
    });
}
function useProductMutations(options = {}) {
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const create = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$api$2f$products$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createProduct"],
        onSuccess: (data)=>{
            queryClient.invalidateQueries({
                queryKey: productKeys.lists()
            });
            options.onCreateSuccess?.(data);
        },
        onError: options.onError
    });
    const update = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$api$2f$products$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateProduct"],
        onSuccess: (data, variables)=>{
            queryClient.invalidateQueries({
                queryKey: productKeys.detail(variables.systemId)
            });
            queryClient.invalidateQueries({
                queryKey: productKeys.lists()
            });
            options.onUpdateSuccess?.(data);
        },
        onError: options.onError
    });
    const remove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$api$2f$products$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deleteProduct"],
        onSuccess: ()=>{
            queryClient.invalidateQueries({
                queryKey: productKeys.all
            });
            options.onDeleteSuccess?.();
        },
        onError: options.onError
    });
    return {
        create,
        update,
        remove,
        isCreating: create.isPending,
        isUpdating: update.isPending,
        isDeleting: remove.isPending,
        isMutating: create.isPending || update.isPending || remove.isPending
    };
}
function useProductsByCategory(categoryId) {
    return useProducts({
        categoryId: categoryId || undefined,
        limit: 100
    });
}
function useProductsByBrand(brandId) {
    return useProducts({
        brandId: brandId || undefined,
        limit: 100
    });
}
function useActiveProducts(params = {}) {
    return useProducts({
        ...params,
        status: 'active'
    });
}
}),
"[project]/features/products/hooks/use-all-products.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useActiveProducts",
    ()=>useActiveProducts,
    "useAllProducts",
    ()=>useAllProducts,
    "useProductFinder",
    ()=>useProductFinder
]);
/**
 * useAllProducts - Convenience hook for components needing all products as flat array
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$hooks$2f$use$2d$products$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/products/hooks/use-products.ts [app-ssr] (ecmascript)");
;
;
function useAllProducts() {
    const query = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$hooks$2f$use$2d$products$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProducts"])({
        limit: 50
    });
    return {
        data: query.data?.data || [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error
    };
}
function useActiveProducts() {
    const { data, isLoading } = useAllProducts();
    const activeProducts = data.filter((p)=>!p.isDeleted && p.isActive !== false);
    return {
        data: activeProducts,
        isLoading
    };
}
function useProductFinder() {
    const { data } = useAllProducts();
    const findById = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((systemId)=>{
        if (!systemId) return undefined;
        return data.find((p)=>p.systemId === systemId);
    }, [
        data
    ]);
    return {
        findById
    };
}
}),
"[project]/features/products/image-store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getProductImageUrl",
    ()=>getProductImageUrl,
    "useImageStore",
    ()=>useImageStore
]);
/**
 * Product Image Store
 * 
 * Quản lý staging images và permanent images cho products
 * Tương tự như document-store.ts của Employee
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
;
const useImageStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])((set, get)=>({
        stagingImages: {},
        permanentImages: {},
        permanentMeta: {},
        updateStagingImage: (productSystemId, type, files, sessionId)=>{
            const key = `${productSystemId}-${type}`;
            set((state)=>({
                    stagingImages: {
                        ...state.stagingImages,
                        [key]: {
                            type,
                            sessionId,
                            files
                        }
                    }
                }));
        },
        clearStagingImages: (productSystemId)=>{
            if (productSystemId) {
                set((state)=>{
                    const filtered = Object.entries(state.stagingImages).filter(([key])=>!key.startsWith(productSystemId));
                    return {
                        stagingImages: Object.fromEntries(filtered)
                    };
                });
            } else {
                set({
                    stagingImages: {}
                });
            }
        },
        updatePermanentImages: (productSystemId, type, files, fetchedAt)=>{
            set((state)=>{
                const existing = state.permanentImages[productSystemId] || {
                    thumbnail: [],
                    gallery: []
                };
                const timestamp = fetchedAt ?? Date.now();
                return {
                    permanentImages: {
                        ...state.permanentImages,
                        [productSystemId]: {
                            ...existing,
                            [type]: files
                        }
                    },
                    permanentMeta: {
                        ...state.permanentMeta,
                        [productSystemId]: {
                            lastFetched: timestamp
                        }
                    }
                };
            });
        },
        clearPermanentImages: (productSystemId)=>{
            set((state)=>{
                const { [productSystemId]: _, ...rest } = state.permanentImages;
                const { [productSystemId]: __, ...restMeta } = state.permanentMeta;
                return {
                    permanentImages: rest,
                    permanentMeta: restMeta
                };
            });
        },
        getStagingImages: (productSystemId, type)=>{
            const key = `${productSystemId}-${type}`;
            return get().stagingImages[key]?.files || [];
        },
        getPermanentImages: (productSystemId, type)=>{
            return get().permanentImages[productSystemId]?.[type] || [];
        },
        getSessionId: (productSystemId, type)=>{
            const key = `${productSystemId}-${type}`;
            return get().stagingImages[key]?.sessionId;
        }
    }));
function getProductImageUrl(product, serverThumbnail, serverGallery) {
    // Ưu tiên 1: Ảnh từ server (upload thực)
    if (serverThumbnail) return serverThumbnail;
    if (serverGallery) return serverGallery;
    // Ưu tiên 2: Ảnh từ product data
    if (!product) return undefined;
    return product.thumbnailImage || product.galleryImages?.[0] || product.images?.[0];
}
}),
"[project]/features/products/hooks/use-pkgx-sync.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePkgxSync",
    ()=>usePkgxSync
]);
/**
 * Hook chứa tất cả các handlers để đồng bộ sản phẩm với PKGX
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/pkgx/api-service.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$image$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/products/image-store.ts [app-ssr] (ecmascript)");
;
;
;
;
;
function usePkgxSync({ addPkgxLog }) {
    const { settings: pkgxSettings } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePkgxSettingsStore"])();
    // ═══════════════════════════════════════════════════════════════
    // HELPER: Get price by mapping
    // ═══════════════════════════════════════════════════════════════
    const getPriceByMapping = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useCallback((product, pkgxPriceField)=>{
        const { priceMapping } = pkgxSettings;
        if (!priceMapping) return undefined;
        // priceMapping is PkgxPriceMapping { shopPrice, marketPrice, partnerPrice, acePrice, dealPrice }
        // Each field contains SystemId of HRM pricing policy
        let hrmPriceSystemId = null;
        switch(pkgxPriceField){
            case 'shopPrice':
                hrmPriceSystemId = priceMapping.shopPrice;
                break;
            case 'marketPrice':
                hrmPriceSystemId = priceMapping.marketPrice;
                break;
            case 'partnerPrice':
                hrmPriceSystemId = priceMapping.partnerPrice;
                break;
            case 'acePrice':
                hrmPriceSystemId = priceMapping.acePrice;
                break;
            case 'dealPrice':
                hrmPriceSystemId = priceMapping.dealPrice;
                break;
        }
        if (!hrmPriceSystemId) return undefined;
        return product.prices?.[hrmPriceSystemId];
    }, [
        pkgxSettings
    ]);
    // ═══════════════════════════════════════════════════════════════
    // HELPER: Check if has price mapping
    // ═══════════════════════════════════════════════════════════════
    const hasPriceMapping = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useMemo(()=>{
        const { priceMapping } = pkgxSettings;
        return priceMapping && (priceMapping.shopPrice || priceMapping.marketPrice || priceMapping.partnerPrice || priceMapping.acePrice || priceMapping.dealPrice);
    }, [
        pkgxSettings
    ]);
    // ═══════════════════════════════════════════════════════════════
    // HELPER: Get mapped category ID
    // ═══════════════════════════════════════════════════════════════
    const getMappedCategoryId = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useCallback((product)=>{
        if (!pkgxSettings?.categoryMappings || !product.categorySystemId) return undefined;
        const mapping = pkgxSettings.categoryMappings.find((m)=>m.hrmCategorySystemId === product.categorySystemId);
        return mapping?.pkgxCatId;
    }, [
        pkgxSettings?.categoryMappings
    ]);
    // ═══════════════════════════════════════════════════════════════
    // HELPER: Get mapped brand ID
    // ═══════════════════════════════════════════════════════════════
    const getMappedBrandId = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useCallback((product)=>{
        if (!pkgxSettings?.brandMappings || !product.brandSystemId) return undefined;
        const mapping = pkgxSettings.brandMappings.find((m)=>m.hrmBrandSystemId === product.brandSystemId);
        return mapping?.pkgxBrandId;
    }, [
        pkgxSettings?.brandMappings
    ]);
    // ═══════════════════════════════════════════════════════════════
    // 1. SYNC GIÁ (bao gồm cả giá thành viên ace)
    // ═══════════════════════════════════════════════════════════════
    const handlePkgxUpdatePrice = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useCallback(async (product)=>{
        if (!product.pkgxId) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Sản phẩm chưa được liên kết với PKGX');
            return;
        }
        if (!hasPriceMapping) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Chưa cấu hình mapping giá. Vui lòng vào Cài đặt > PKGX > Mapping Giá để thiết lập.');
            return;
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].loading(`Đang đồng bộ giá...`, {
            id: 'pkgx-sync-price'
        });
        try {
            const payload = {};
            const shopPrice = getPriceByMapping(product, 'shopPrice');
            if (shopPrice !== undefined) payload.shop_price = shopPrice;
            const marketPrice = getPriceByMapping(product, 'marketPrice');
            if (marketPrice !== undefined) payload.market_price = marketPrice;
            const partnerPrice = getPriceByMapping(product, 'partnerPrice');
            if (partnerPrice !== undefined) payload.partner_price = partnerPrice;
            const acePrice = getPriceByMapping(product, 'acePrice');
            if (acePrice !== undefined) payload.ace_price = acePrice;
            const dealPrice = getPriceByMapping(product, 'dealPrice');
            if (dealPrice !== undefined) payload.deal_price = dealPrice;
            if (Object.keys(payload).length === 0) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Không có giá nào được mapping. Vui lòng kiểm tra cấu hình.', {
                    id: 'pkgx-sync-price'
                });
                return;
            }
            // 1. Sync giá vào bảng goods
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateProduct"])(product.pkgxId, payload);
            if (!response.success) {
                throw new Error(response.error);
            }
            // 2. Sync giá ace vào member_price table (ace = rank_id 8)
            let memberPriceSynced = false;
            if (acePrice !== undefined && acePrice > 0) {
                const memberPriceResponse = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateMemberPrice"])(product.pkgxId, [
                    {
                        user_rank: 8,
                        user_price: acePrice
                    }
                ]);
                memberPriceSynced = memberPriceResponse.success;
            }
            const successMsg = memberPriceSynced ? `Đã đồng bộ giá + giá ace thành viên: ${product.name}` : `Đã đồng bộ giá: ${product.name}`;
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success(successMsg, {
                id: 'pkgx-sync-price'
            });
            addPkgxLog({
                action: 'sync_price',
                status: 'success',
                message: successMsg,
                details: {
                    productId: product.systemId,
                    pkgxId: product.pkgxId,
                    prices: payload,
                    memberPriceSynced,
                    acePrice: acePrice
                }
            });
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(`Lỗi đồng bộ giá: ${error instanceof Error ? error.message : 'Unknown error'}`, {
                id: 'pkgx-sync-price'
            });
            addPkgxLog({
                action: 'sync_price',
                status: 'error',
                message: `Lỗi đồng bộ giá: ${product.name}`,
                details: {
                    productId: product.systemId,
                    error: error instanceof Error ? error.message : String(error)
                }
            });
        }
    }, [
        hasPriceMapping,
        getPriceByMapping,
        addPkgxLog
    ]);
    // ═══════════════════════════════════════════════════════════════
    // 2. SYNC TỒN KHO
    // ═══════════════════════════════════════════════════════════════
    const handlePkgxSyncInventory = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useCallback(async (product)=>{
        if (!product.pkgxId) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Sản phẩm chưa được liên kết với PKGX');
            return;
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].loading(`Đang đồng bộ tồn kho...`, {
            id: 'pkgx-sync-inventory'
        });
        try {
            const totalInventory = product.inventoryByBranch ? Object.values(product.inventoryByBranch).reduce((sum, qty)=>sum + (qty || 0), 0) : 0;
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateProduct"])(product.pkgxId, {
                goods_number: totalInventory
            });
            if (response.success) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success(`Đã đồng bộ tồn kho: ${totalInventory} sản phẩm`, {
                    id: 'pkgx-sync-inventory'
                });
                addPkgxLog({
                    action: 'sync_inventory',
                    status: 'success',
                    message: `Đã đồng bộ tồn kho: ${product.name} (${totalInventory})`,
                    details: {
                        productId: product.systemId,
                        pkgxId: product.pkgxId,
                        inventory: totalInventory
                    }
                });
            } else {
                throw new Error(response.error);
            }
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(`Lỗi đồng bộ tồn kho: ${error instanceof Error ? error.message : 'Unknown error'}`, {
                id: 'pkgx-sync-inventory'
            });
            addPkgxLog({
                action: 'sync_inventory',
                status: 'error',
                message: `Lỗi đồng bộ tồn kho: ${product.name}`,
                details: {
                    productId: product.systemId,
                    error: error instanceof Error ? error.message : String(error)
                }
            });
        }
    }, [
        addPkgxLog
    ]);
    // ═══════════════════════════════════════════════════════════════
    // 3. SYNC SEO
    // ═══════════════════════════════════════════════════════════════
    const handlePkgxUpdateSeo = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useCallback(async (product)=>{
        if (!product.pkgxId) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Sản phẩm chưa được liên kết với PKGX');
            return;
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].loading(`Đang đồng bộ SEO...`, {
            id: 'pkgx-sync-seo'
        });
        try {
            const pkgxSeo = product.seoPkgx;
            // Fallback chain: SEO PKGX → SEO Chung → tags → name
            const seoPayload = {
                keywords: pkgxSeo?.seoKeywords || product.seoKeywords || product.tags?.join(', ') || product.name,
                meta_title: pkgxSeo?.seoTitle || product.ktitle || product.name,
                meta_desc: pkgxSeo?.metaDescription || product.seoDescription || ''
            };
            // DEBUG: Log payload để kiểm tra
            console.log('[PKGX SEO Sync] Product:', product.name);
            console.log('[PKGX SEO Sync] seoPkgx:', product.seoPkgx);
            console.log('[PKGX SEO Sync] SEO Chung - seoKeywords:', product.seoKeywords);
            console.log('[PKGX SEO Sync] Payload being sent:', seoPayload);
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateProduct"])(product.pkgxId, seoPayload);
            if (response.success) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success(`Đã đồng bộ SEO cho sản phẩm: ${product.name}`, {
                    id: 'pkgx-sync-seo'
                });
                addPkgxLog({
                    action: 'sync_seo',
                    status: 'success',
                    message: `Đã đồng bộ SEO: ${product.name}`,
                    details: {
                        productId: product.systemId,
                        pkgxId: product.pkgxId
                    }
                });
            } else {
                throw new Error(response.error);
            }
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(`Lỗi đồng bộ SEO: ${error instanceof Error ? error.message : 'Unknown error'}`, {
                id: 'pkgx-sync-seo'
            });
            addPkgxLog({
                action: 'sync_seo',
                status: 'error',
                message: `Lỗi đồng bộ SEO: ${product.name}`,
                details: {
                    productId: product.systemId,
                    error: error instanceof Error ? error.message : String(error)
                }
            });
        }
    }, [
        addPkgxLog
    ]);
    // ═══════════════════════════════════════════════════════════════
    // 4. SYNC MÔ TẢ (với xử lý ảnh trong HTML)
    // ═══════════════════════════════════════════════════════════════
    const handlePkgxSyncDescription = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useCallback(async (product)=>{
        if (!product.pkgxId) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Sản phẩm chưa được liên kết với PKGX');
            return;
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].loading(`Đang đồng bộ mô tả...`, {
            id: 'pkgx-sync-desc'
        });
        try {
            const pkgxSeo = product.seoPkgx;
            // Get raw descriptions
            const rawLongDesc = pkgxSeo?.longDescription || product.description || '';
            const rawShortDesc = pkgxSeo?.shortDescription || product.shortDescription || '';
            // Process images in long description (upload to PKGX and replace URLs)
            let processedLongDesc = rawLongDesc;
            let imageStats = {
                uploadedCount: 0,
                skippedCount: 0,
                errors: []
            };
            if (rawLongDesc.includes('<img')) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].loading(`Đang xử lý ảnh trong mô tả...`, {
                    id: 'pkgx-sync-desc'
                });
                const filenamePrefix = product.sku || product.id || `product-${product.pkgxId}`;
                const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["processHtmlImagesForPkgx"])(rawLongDesc, filenamePrefix);
                processedLongDesc = result.processedHtml;
                imageStats = result;
                if (result.uploadedCount > 0) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].loading(`Đã upload ${result.uploadedCount} ảnh, đang cập nhật mô tả...`, {
                        id: 'pkgx-sync-desc'
                    });
                }
            }
            // Sync to PKGX
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateProduct"])(product.pkgxId, {
                goods_desc: processedLongDesc,
                goods_brief: rawShortDesc
            });
            if (response.success) {
                const message = imageStats.uploadedCount > 0 ? `Đã đồng bộ mô tả (${imageStats.uploadedCount} ảnh đã upload)` : `Đã đồng bộ mô tả`;
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success(message, {
                    id: 'pkgx-sync-desc'
                });
                addPkgxLog({
                    action: 'sync_description',
                    status: imageStats.errors.length > 0 ? 'partial' : 'success',
                    message: `${message}: ${product.name}`,
                    details: {
                        productId: product.systemId,
                        pkgxId: product.pkgxId,
                        imagesUploaded: imageStats.uploadedCount,
                        imagesSkipped: imageStats.skippedCount,
                        imageErrors: imageStats.errors
                    }
                });
            } else {
                throw new Error(response.error);
            }
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(`Lỗi đồng bộ mô tả: ${error instanceof Error ? error.message : 'Unknown error'}`, {
                id: 'pkgx-sync-desc'
            });
            addPkgxLog({
                action: 'sync_description',
                status: 'error',
                message: `Lỗi đồng bộ mô tả: ${product.name}`,
                details: {
                    productId: product.systemId,
                    error: error instanceof Error ? error.message : String(error)
                }
            });
        }
    }, [
        addPkgxLog
    ]);
    // ═══════════════════════════════════════════════════════════════
    // 5. SYNC FLAGS (best, hot, new, ishome, is_on_sale)
    // ═══════════════════════════════════════════════════════════════
    const handlePkgxSyncFlags = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useCallback(async (product)=>{
        if (!product.pkgxId) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Sản phẩm chưa được liên kết với PKGX');
            return;
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].loading(`Đang đồng bộ flags...`, {
            id: 'pkgx-sync-flags'
        });
        try {
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateProduct"])(product.pkgxId, {
                best: product.isFeatured || false,
                hot: product.isBestSeller || false,
                new: product.isNewArrival || false,
                ishome: product.isFeatured || false,
                is_on_sale: product.isPublished ?? product.status === 'active'
            });
            if (response.success) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success(`Đã đồng bộ flags`, {
                    id: 'pkgx-sync-flags'
                });
                addPkgxLog({
                    action: 'sync_flags',
                    status: 'success',
                    message: `Đã đồng bộ flags: ${product.name}`,
                    details: {
                        productId: product.systemId,
                        pkgxId: product.pkgxId
                    }
                });
            } else {
                throw new Error(response.error);
            }
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(`Lỗi đồng bộ flags: ${error instanceof Error ? error.message : 'Unknown error'}`, {
                id: 'pkgx-sync-flags'
            });
            addPkgxLog({
                action: 'sync_flags',
                status: 'error',
                message: `Lỗi đồng bộ flags: ${product.name}`,
                details: {
                    productId: product.systemId,
                    error: error instanceof Error ? error.message : String(error)
                }
            });
        }
    }, [
        addPkgxLog
    ]);
    // ═══════════════════════════════════════════════════════════════
    // 6. SYNC THÔNG TIN CƠ BẢN (tên, SKU, category, brand, seller_note)
    // ═══════════════════════════════════════════════════════════════
    const handlePkgxSyncBasicInfo = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useCallback(async (product)=>{
        if (!product.pkgxId) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Sản phẩm chưa được liên kết với PKGX');
            return;
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].loading(`Đang đồng bộ thông tin cơ bản...`, {
            id: 'pkgx-sync-basic'
        });
        try {
            const payload = {
                goods_name: product.name,
                goods_sn: product.id,
                seller_note: product.sellerNote || ''
            };
            // Map category nếu có
            const catId = getMappedCategoryId(product);
            if (catId) payload.cat_id = catId;
            // Map brand nếu có  
            const brandId = getMappedBrandId(product);
            if (brandId) payload.brand_id = brandId;
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateProduct"])(product.pkgxId, payload);
            if (response.success) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success(`Đã đồng bộ thông tin cơ bản`, {
                    id: 'pkgx-sync-basic'
                });
                addPkgxLog({
                    action: 'sync_basic_info',
                    status: 'success',
                    message: `Đã đồng bộ thông tin cơ bản: ${product.name}`,
                    details: {
                        productId: product.systemId,
                        pkgxId: product.pkgxId,
                        payload
                    }
                });
            } else {
                throw new Error(response.error);
            }
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(`Lỗi đồng bộ thông tin cơ bản: ${error instanceof Error ? error.message : 'Unknown error'}`, {
                id: 'pkgx-sync-basic'
            });
            addPkgxLog({
                action: 'sync_basic_info',
                status: 'error',
                message: `Lỗi đồng bộ thông tin cơ bản: ${product.name}`,
                details: {
                    productId: product.systemId,
                    error: error instanceof Error ? error.message : String(error)
                }
            });
        }
    }, [
        getMappedCategoryId,
        getMappedBrandId,
        addPkgxLog
    ]);
    // ═══════════════════════════════════════════════════════════════
    // 7. SYNC HÌNH ẢNH (ảnh đại diện + album gallery)
    // Logic: Fetch ảnh từ HRM server trước, upload lên PKGX, rồi sync đường dẫn
    // ═══════════════════════════════════════════════════════════════
    const handlePkgxSyncImages = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useCallback(async (product)=>{
        if (!product.pkgxId) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Sản phẩm chưa được liên kết với PKGX');
            return;
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].loading('Đang lấy thông tin hình ảnh...', {
            id: 'pkgx-sync-images'
        });
        // ===== STEP 1: Fetch ảnh từ HRM server =====
        let thumbnailUrls = [];
        let galleryUrls = [];
        // Helper: Kiểm tra URL có thể truy cập từ internet không
        const isPublicUrl = (url)=>{
            if (!url) return false;
            // Bỏ qua localhost, 127.0.0.1, hoặc internal IP
            if (url.includes('localhost') || url.includes('127.0.0.1') || url.includes('192.168.')) {
                console.log('[PKGX Sync Images] Skipping local URL:', url);
                return false;
            }
            return true;
        };
        try {
            // Import động để tránh circular dependency
            const { FileUploadAPI } = await __turbopack_context__.A("[project]/lib/file-upload-api.ts [app-ssr] (ecmascript, async loader)");
            const files = await FileUploadAPI.getProductFiles(product.systemId);
            console.log('[PKGX Sync Images] Files from HRM server:', files);
            // Phân loại ảnh theo documentName - CHỈ lấy URL public
            for (const file of files){
                if (file.documentName === 'thumbnail' && file.url && isPublicUrl(file.url)) {
                    thumbnailUrls.push(file.url);
                } else if (file.documentName === 'gallery' && file.url && isPublicUrl(file.url)) {
                    galleryUrls.push(file.url);
                }
            }
        } catch (fetchError) {
            console.warn('[PKGX Sync Images] Không thể lấy ảnh từ HRM server:', fetchError);
        }
        // ===== STEP 2: Fallback về product object nếu server không có ảnh =====
        console.log('[PKGX Sync Images] Product:', product.name, 'systemId:', product.systemId);
        console.log('[PKGX Sync Images] Thumbnails from server:', thumbnailUrls);
        console.log('[PKGX Sync Images] Gallery from server:', galleryUrls);
        console.log('[PKGX Sync Images] product.thumbnailImage:', product.thumbnailImage);
        console.log('[PKGX Sync Images] product.galleryImages:', product.galleryImages);
        console.log('[PKGX Sync Images] product.images (legacy):', product.images);
        // Nếu server không có, dùng từ product object - CHỈ lấy URL public
        if (thumbnailUrls.length === 0 && product.thumbnailImage && isPublicUrl(product.thumbnailImage)) {
            thumbnailUrls.push(product.thumbnailImage);
        }
        if (galleryUrls.length === 0 && product.galleryImages?.length) {
            galleryUrls.push(...product.galleryImages.filter(isPublicUrl));
        }
        // Legacy fallback
        if (thumbnailUrls.length === 0 && galleryUrls.length === 0 && product.images?.length) {
            const publicImages = product.images.filter(isPublicUrl);
            if (publicImages.length > 0) {
                thumbnailUrls.push(publicImages[0]);
                if (publicImages.length > 1) {
                    galleryUrls.push(...publicImages.slice(1));
                }
            }
        }
        // Cũng check image-store (ảnh đã upload vào HRM nhưng chưa fetch từ server)
        const imageStoreState = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$image$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useImageStore"].getState();
        const permanentThumbnails = imageStoreState.getPermanentImages(product.systemId, 'thumbnail');
        const permanentGallery = imageStoreState.getPermanentImages(product.systemId, 'gallery');
        // Merge với image-store nếu có - CHỈ lấy URL public
        if (permanentThumbnails.length > 0 && thumbnailUrls.length === 0) {
            thumbnailUrls.push(...permanentThumbnails.map((f)=>f.url).filter((url)=>url && isPublicUrl(url)));
        }
        if (permanentGallery.length > 0 && galleryUrls.length === 0) {
            galleryUrls.push(...permanentGallery.map((f)=>f.url).filter((url)=>url && isPublicUrl(url)));
        }
        console.log('[PKGX Sync Images] permanentThumbnails from imageStore:', permanentThumbnails);
        console.log('[PKGX Sync Images] permanentGallery from imageStore:', permanentGallery);
        // Final main image và gallery
        const mainImage = thumbnailUrls[0] || null;
        const galleryImages = galleryUrls;
        console.log('[PKGX Sync Images] Final mainImage:', mainImage);
        console.log('[PKGX Sync Images] Final galleryImages to sync:', galleryImages);
        if (!mainImage && galleryImages.length === 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Sản phẩm chưa có hình ảnh', {
                id: 'pkgx-sync-images'
            });
            return;
        }
        const totalImages = (mainImage ? 1 : 0) + galleryImages.length;
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].loading(`Đang đồng bộ ${totalImages} hình ảnh...`, {
            id: 'pkgx-sync-images'
        });
        try {
            // Tạo slug từ tên sản phẩm cho filename
            const baseSlug = (product.name || 'product').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 50);
            let uploadedMainImg = null;
            const uploadedGalleryPaths = [];
            let errorCount = 0;
            // Helper function: Upload ảnh từ URL qua server PKGX (tránh CORS)
            const uploadFromUrl = async (imageUrl, slugSuffix)=>{
                try {
                    // Kiểm tra nếu là đường dẫn local trên PKGX (đã upload trước đó)
                    if (imageUrl.startsWith('images/') || imageUrl.includes('/cdn/images/')) {
                        // Đã là path trên PKGX, không cần upload lại
                        const cleanPath = imageUrl.replace(/.*\/cdn\//, '').replace(/^cdn\//, '');
                        return cleanPath;
                    }
                    // Gọi API server-to-server để tránh CORS
                    const uploadResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["uploadImageFromUrl"])(imageUrl, {
                        filenameSlug: `${baseSlug}-${slugSuffix}`
                    });
                    if (!uploadResult.success || !uploadResult.data) {
                        throw new Error(uploadResult.error || 'Upload thất bại');
                    }
                    // Trả về đường dẫn original_img
                    return uploadResult.data.data?.original_img || null;
                } catch (err) {
                    console.error(`Lỗi upload ảnh ${imageUrl}:`, err);
                    return null;
                }
            };
            // Upload ảnh đại diện
            if (mainImage) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].loading(`Đang upload ảnh đại diện...`, {
                    id: 'pkgx-sync-images'
                });
                uploadedMainImg = await uploadFromUrl(mainImage, 'main');
                if (!uploadedMainImg) {
                    errorCount++;
                }
            }
            // Upload gallery images
            if (galleryImages.length > 0) {
                for(let i = 0; i < galleryImages.length; i++){
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].loading(`Đang upload ảnh ${i + 1}/${galleryImages.length}...`, {
                        id: 'pkgx-sync-images'
                    });
                    const galleryPath = await uploadFromUrl(galleryImages[i], `gallery-${i + 1}`);
                    if (galleryPath) {
                        uploadedGalleryPaths.push(galleryPath);
                    } else {
                        errorCount++;
                    }
                }
            }
            // Kiểm tra có gì để sync không
            if (!uploadedMainImg && uploadedGalleryPaths.length === 0) {
                throw new Error('Không thể upload bất kỳ ảnh nào');
            }
            // Build payload để sync vào sản phẩm
            const payload = {};
            if (uploadedMainImg) {
                payload.original_img = uploadedMainImg;
            }
            if (uploadedGalleryPaths.length > 0) {
                payload.gallery_images = uploadedGalleryPaths;
            }
            // Sync đường dẫn vào sản phẩm
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].loading(`Đang cập nhật sản phẩm...`, {
                id: 'pkgx-sync-images'
            });
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateProduct"])(product.pkgxId, payload);
            if (response.success) {
                const syncedCount = (uploadedMainImg ? 1 : 0) + uploadedGalleryPaths.length;
                const message = errorCount > 0 ? `Đã đồng bộ ${syncedCount} hình ảnh (${errorCount} lỗi)` : `Đã đồng bộ ${syncedCount} hình ảnh`;
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success(message, {
                    id: 'pkgx-sync-images'
                });
                addPkgxLog({
                    action: 'sync_images',
                    status: errorCount > 0 ? 'partial' : 'success',
                    message: `${message}: ${product.name}`,
                    details: {
                        productId: product.systemId,
                        pkgxId: product.pkgxId,
                        uploadedMainImg,
                        galleryCount: uploadedGalleryPaths.length,
                        uploadedGalleryPaths,
                        errorCount
                    }
                });
            } else {
                throw new Error(response.error);
            }
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(`Lỗi đồng bộ hình ảnh: ${error instanceof Error ? error.message : 'Unknown error'}`, {
                id: 'pkgx-sync-images'
            });
            addPkgxLog({
                action: 'sync_images',
                status: 'error',
                message: `Lỗi đồng bộ hình ảnh: ${product.name}`,
                details: {
                    productId: product.systemId,
                    error: error instanceof Error ? error.message : String(error)
                }
            });
        }
    }, [
        addPkgxLog
    ]);
    // ═══════════════════════════════════════════════════════════════
    // 8. SYNC TẤT CẢ (Full sync, bao gồm xử lý ảnh trong mô tả)
    // ═══════════════════════════════════════════════════════════════
    const handlePkgxSyncAll = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useCallback(async (product)=>{
        if (!product.pkgxId) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Sản phẩm chưa được liên kết với PKGX');
            return;
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].loading(`Đang đồng bộ tất cả thông tin...`, {
            id: 'pkgx-sync-all'
        });
        try {
            const pkgxSeo = product.seoPkgx;
            // Get raw descriptions
            const rawLongDesc = pkgxSeo?.longDescription || product.description || '';
            const rawShortDesc = pkgxSeo?.shortDescription || product.shortDescription || '';
            // Process images in long description
            let processedLongDesc = rawLongDesc;
            let imageStats = {
                uploadedCount: 0,
                skippedCount: 0,
                errors: []
            };
            if (rawLongDesc.includes('<img')) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].loading(`Đang xử lý ảnh trong mô tả...`, {
                    id: 'pkgx-sync-all'
                });
                const filenamePrefix = product.sku || product.id || `product-${product.pkgxId}`;
                const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["processHtmlImagesForPkgx"])(rawLongDesc, filenamePrefix);
                processedLongDesc = result.processedHtml;
                imageStats = result;
            }
            // Build full payload
            const payload = {
                // Thông tin cơ bản
                goods_name: product.name,
                goods_sn: product.id,
                // Tồn kho
                goods_number: product.inventoryByBranch ? Object.values(product.inventoryByBranch).reduce((sum, qty)=>sum + (qty || 0), 0) : 0,
                // SEO
                keywords: pkgxSeo?.seoKeywords || product.tags?.join(', ') || product.name,
                meta_title: pkgxSeo?.seoTitle || product.ktitle || product.name,
                meta_desc: pkgxSeo?.metaDescription || product.seoDescription || '',
                // Mô tả (đã xử lý ảnh)
                goods_desc: processedLongDesc,
                goods_brief: rawShortDesc,
                // Flags
                best: product.isFeatured || false,
                hot: product.isBestSeller || false,
                new: product.isNewArrival || false,
                ishome: product.isFeatured || false,
                is_on_sale: product.isPublished ?? product.status === 'active',
                // Image - ảnh đại diện
                ...product.thumbnailImage && {
                    original_img: product.thumbnailImage
                }
            };
            // Gallery images (album ảnh) - update toàn bộ
            const galleryImages = product.galleryImages || product.images || [];
            if (galleryImages.length > 0) {
                payload.gallery_images = galleryImages;
            }
            // Map category
            const catId = getMappedCategoryId(product);
            if (catId) payload.cat_id = catId;
            // Map brand
            const brandId = getMappedBrandId(product);
            if (brandId) payload.brand_id = brandId;
            // Map prices
            const shopPrice = getPriceByMapping(product, 'shopPrice');
            if (shopPrice !== undefined) payload.shop_price = shopPrice;
            const marketPrice = getPriceByMapping(product, 'marketPrice');
            if (marketPrice !== undefined) payload.market_price = marketPrice;
            const partnerPrice = getPriceByMapping(product, 'partnerPrice');
            if (partnerPrice !== undefined) payload.partner_price = partnerPrice;
            const acePrice = getPriceByMapping(product, 'acePrice');
            if (acePrice !== undefined) payload.ace_price = acePrice;
            const dealPrice = getPriceByMapping(product, 'dealPrice');
            if (dealPrice !== undefined) payload.deal_price = dealPrice;
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateProduct"])(product.pkgxId, payload);
            if (response.success) {
                const message = imageStats.uploadedCount > 0 ? `Đã đồng bộ tất cả (${imageStats.uploadedCount} ảnh trong mô tả đã upload)` : `Đã đồng bộ tất cả thông tin`;
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success(message, {
                    id: 'pkgx-sync-all'
                });
                addPkgxLog({
                    action: 'sync_all',
                    status: imageStats.errors.length > 0 ? 'partial' : 'success',
                    message: `${message}: ${product.name}`,
                    details: {
                        productId: product.systemId,
                        pkgxId: product.pkgxId,
                        imagesUploaded: imageStats.uploadedCount,
                        imagesSkipped: imageStats.skippedCount,
                        imageErrors: imageStats.errors
                    }
                });
            } else {
                throw new Error(response.error);
            }
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(`Lỗi đồng bộ: ${error instanceof Error ? error.message : 'Unknown error'}`, {
                id: 'pkgx-sync-all'
            });
            addPkgxLog({
                action: 'sync_all',
                status: 'error',
                message: `Lỗi đồng bộ tất cả: ${product.name}`,
                details: {
                    productId: product.systemId,
                    error: error instanceof Error ? error.message : String(error)
                }
            });
        }
    }, [
        getMappedCategoryId,
        getMappedBrandId,
        getPriceByMapping,
        addPkgxLog
    ]);
    return {
        // Sync handlers
        handlePkgxUpdatePrice,
        handlePkgxSyncInventory,
        handlePkgxUpdateSeo,
        handlePkgxSyncDescription,
        handlePkgxSyncFlags,
        handlePkgxSyncBasicInfo,
        handlePkgxSyncImages,
        handlePkgxSyncAll,
        // Helpers
        hasPriceMapping
    };
}
}),
"[project]/features/products/pkgx-product-actions-cell.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * PkgxProductActionsCell - Shared dropdown component for PKGX product sync actions
 * 
 * Uses usePkgxEntitySync hook for consistent sync behavior
 */ __turbopack_context__.s([
    "PkgxProductActionsCell",
    ()=>PkgxProductActionsCell
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis.js [app-ssr] (ecmascript) <export default as MoreHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-ssr] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-ssr] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/dollar-sign.js [app-ssr] (ecmascript) <export default as DollarSign>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/package.js [app-ssr] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-ssr] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$text$2d$align$2d$start$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlignLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/text-align-start.js [app-ssr] (ecmascript) <export default as AlignLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tag$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Tag$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/tag.js [app-ssr] (ecmascript) <export default as Tag>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/image.js [app-ssr] (ecmascript) <export default as Image>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/external-link.js [app-ssr] (ecmascript) <export default as ExternalLink>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/upload.js [app-ssr] (ecmascript) <export default as Upload>");
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
function PkgxProductActionsCell({ product, onPkgxPublish, onPkgxLink, onPkgxUnlink, onPkgxSyncImages }) {
    const { addLog } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePkgxSettingsStore"])();
    // Use shared entity sync hook
    const entitySync = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$hooks$2f$use$2d$pkgx$2d$entity$2d$sync$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePkgxEntitySync"])({
        entityType: 'product',
        onLog: addLog
    });
    // Don't show for deleted items
    if (product.deletedAt) return null;
    const hasPkgxId = !!product.pkgxId;
    // Build HRM product data for sync
    const buildHrmData = ()=>{
        // Calculate total inventory across all branches
        const totalInventory = Object.values(product.inventoryByBranch || {}).reduce((sum, qty)=>sum + qty, 0);
        return {
            systemId: product.systemId,
            name: product.name,
            sku: product.id,
            sellingPrice: product.sellingPrice,
            costPrice: product.costPrice,
            dealPrice: undefined,
            quantity: totalInventory,
            seoKeywords: product.seoPkgx?.seoKeywords || product.seoKeywords,
            ktitle: product.seoPkgx?.seoTitle || product.ktitle,
            seoDescription: product.seoPkgx?.metaDescription || product.seoDescription,
            shortDescription: product.seoPkgx?.shortDescription || product.shortDescription,
            description: product.seoPkgx?.longDescription || product.description,
            isBest: product.isFeatured,
            isNew: product.isNewArrival,
            isHot: product.isBestSeller,
            isHome: product.isPublished,
            categorySystemId: product.categorySystemId,
            brandSystemId: product.brandSystemId
        };
    };
    // Helper to trigger sync
    const triggerSync = (actionKey)=>{
        if (!product.pkgxId) return;
        const hrmData = buildHrmData();
        entitySync.triggerSyncAction(actionKey, product.pkgxId, hrmData, product.name);
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
                                className: `h-8 w-8 p-0 ${hasPkgxId ? "text-primary" : "text-muted-foreground"}`,
                                onClick: (e)=>e.stopPropagation(),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "sr-only",
                                        children: "PKGX menu"
                                    }, void 0, false, {
                                        fileName: "[project]/features/products/pkgx-product-actions-cell.tsx",
                                        lineNumber: 89,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__["MoreHorizontal"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/features/products/pkgx-product-actions-cell.tsx",
                                        lineNumber: 90,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/products/pkgx-product-actions-cell.tsx",
                                lineNumber: 84,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/features/products/pkgx-product-actions-cell.tsx",
                            lineNumber: 83,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                            align: "end",
                            onClick: (e)=>e.stopPropagation(),
                            children: hasPkgxId ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                        onSelect: ()=>triggerSync('sync_all'),
                                        className: "font-medium",
                                        title: "Đồng bộ tên, SKU, giá, tồn kho, SEO, mô tả, flags",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                                className: "mr-2 h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/features/products/pkgx-product-actions-cell.tsx",
                                                lineNumber: 102,
                                                columnNumber: 19
                                            }, this),
                                            "Đồng bộ tất cả"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/products/pkgx-product-actions-cell.tsx",
                                        lineNumber: 97,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                                        fileName: "[project]/features/products/pkgx-product-actions-cell.tsx",
                                        lineNumber: 105,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                        onSelect: ()=>triggerSync('sync_basic'),
                                        title: "Tên sản phẩm, mã SKU, danh mục, thương hiệu",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                className: "mr-2 h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/features/products/pkgx-product-actions-cell.tsx",
                                                lineNumber: 112,
                                                columnNumber: 19
                                            }, this),
                                            "Thông tin cơ bản"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/products/pkgx-product-actions-cell.tsx",
                                        lineNumber: 108,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                        onSelect: ()=>triggerSync('sync_price'),
                                        title: "Giá bán, giá thị trường, giá khuyến mãi",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__["DollarSign"], {
                                                className: "mr-2 h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/features/products/pkgx-product-actions-cell.tsx",
                                                lineNumber: 119,
                                                columnNumber: 19
                                            }, this),
                                            "Giá"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/products/pkgx-product-actions-cell.tsx",
                                        lineNumber: 115,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                        onSelect: ()=>triggerSync('sync_inventory'),
                                        title: "Tổng số lượng tồn kho từ tất cả chi nhánh",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                                                className: "mr-2 h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/features/products/pkgx-product-actions-cell.tsx",
                                                lineNumber: 126,
                                                columnNumber: 19
                                            }, this),
                                            "Tồn kho"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/products/pkgx-product-actions-cell.tsx",
                                        lineNumber: 122,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                        onSelect: ()=>triggerSync('sync_seo'),
                                        title: "Keywords, Meta Title, Meta Description",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                className: "mr-2 h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/features/products/pkgx-product-actions-cell.tsx",
                                                lineNumber: 133,
                                                columnNumber: 19
                                            }, this),
                                            "SEO"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/products/pkgx-product-actions-cell.tsx",
                                        lineNumber: 129,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                        onSelect: ()=>triggerSync('sync_description'),
                                        title: "Mô tả ngắn (goods_brief), mô tả chi tiết (goods_desc)",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$text$2d$align$2d$start$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlignLeft$3e$__["AlignLeft"], {
                                                className: "mr-2 h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/features/products/pkgx-product-actions-cell.tsx",
                                                lineNumber: 140,
                                                columnNumber: 19
                                            }, this),
                                            "Mô tả"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/products/pkgx-product-actions-cell.tsx",
                                        lineNumber: 136,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                        onSelect: ()=>triggerSync('sync_flags'),
                                        title: "Nổi bật (best), Hot, Mới (new), Trang chủ, Đang bán",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tag$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Tag$3e$__["Tag"], {
                                                className: "mr-2 h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/features/products/pkgx-product-actions-cell.tsx",
                                                lineNumber: 147,
                                                columnNumber: 19
                                            }, this),
                                            "Flags"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/products/pkgx-product-actions-cell.tsx",
                                        lineNumber: 143,
                                        columnNumber: 17
                                    }, this),
                                    onPkgxSyncImages && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                        onSelect: ()=>entitySync.handleConfirm('Đồng bộ hình ảnh', `Đồng bộ hình ảnh đại diện và album ảnh của "${product.name}" lên PKGX?`, ()=>onPkgxSyncImages(product)),
                                        title: "Hình ảnh đại diện (original_img) + Album ảnh (goods_gallery)",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__["Image"], {
                                                className: "mr-2 h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/features/products/pkgx-product-actions-cell.tsx",
                                                lineNumber: 161,
                                                columnNumber: 21
                                            }, this),
                                            "Hình ảnh"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/products/pkgx-product-actions-cell.tsx",
                                        lineNumber: 153,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                                        fileName: "[project]/features/products/pkgx-product-actions-cell.tsx",
                                        lineNumber: 166,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                        onSelect: ()=>window.open(`https://phukiengiaxuong.com.vn/admin/goods.php?act=edit&goods_id=${product.pkgxId}`, '_blank'),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                                                className: "mr-2 h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/features/products/pkgx-product-actions-cell.tsx",
                                                lineNumber: 170,
                                                columnNumber: 19
                                            }, this),
                                            "Xem trên PKGX"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/products/pkgx-product-actions-cell.tsx",
                                        lineNumber: 167,
                                        columnNumber: 17
                                    }, this),
                                    onPkgxUnlink && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                                                fileName: "[project]/features/products/pkgx-product-actions-cell.tsx",
                                                lineNumber: 177,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                onSelect: ()=>entitySync.handleConfirm('Hủy liên kết PKGX', `Bạn có chắc muốn hủy liên kết sản phẩm "${product.name}" với PKGX? (Sản phẩm vẫn tồn tại trên PKGX)`, ()=>onPkgxUnlink(product)),
                                                className: "text-destructive",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$unlink$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Unlink$3e$__["Unlink"], {
                                                        className: "mr-2 h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/products/pkgx-product-actions-cell.tsx",
                                                        lineNumber: 186,
                                                        columnNumber: 23
                                                    }, this),
                                                    "Hủy liên kết"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/products/pkgx-product-actions-cell.tsx",
                                                lineNumber: 178,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true)
                                ]
                            }, void 0, true) : /* Actions for products WITHOUT pkgxId */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    onPkgxPublish && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                        onSelect: ()=>entitySync.handleConfirm('Đăng lên PKGX', `Bạn có chắc muốn đăng sản phẩm "${product.name}" lên PKGX?`, ()=>onPkgxPublish(product)),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                                                className: "mr-2 h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/features/products/pkgx-product-actions-cell.tsx",
                                                lineNumber: 204,
                                                columnNumber: 21
                                            }, this),
                                            "Đăng lên PKGX"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/products/pkgx-product-actions-cell.tsx",
                                        lineNumber: 197,
                                        columnNumber: 19
                                    }, this),
                                    onPkgxLink && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                        onSelect: ()=>onPkgxLink(product),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Link2$3e$__["Link2"], {
                                                className: "mr-2 h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/features/products/pkgx-product-actions-cell.tsx",
                                                lineNumber: 212,
                                                columnNumber: 21
                                            }, this),
                                            "Liên kết với PKGX"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/products/pkgx-product-actions-cell.tsx",
                                        lineNumber: 211,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true)
                        }, void 0, false, {
                            fileName: "[project]/features/products/pkgx-product-actions-cell.tsx",
                            lineNumber: 93,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/products/pkgx-product-actions-cell.tsx",
                    lineNumber: 82,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/products/pkgx-product-actions-cell.tsx",
                lineNumber: 81,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$components$2f$pkgx$2d$sync$2d$confirm$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PkgxSyncConfirmDialog"], {
                confirmAction: entitySync.confirmAction,
                isSyncing: entitySync.isSyncing,
                onConfirm: entitySync.executeAction,
                onCancel: entitySync.cancelConfirm
            }, void 0, false, {
                fileName: "[project]/features/products/pkgx-product-actions-cell.tsx",
                lineNumber: 223,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
}),
"[project]/features/products/stock-alert-utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "STOCK_ALERT_CONFIG",
    ()=>STOCK_ALERT_CONFIG,
    "getMostSevereAlert",
    ()=>getMostSevereAlert,
    "getProductStockAlerts",
    ()=>getProductStockAlerts,
    "getProductStockAlertsByBranch",
    ()=>getProductStockAlertsByBranch,
    "getSuggestedOrderQuantity",
    ()=>getSuggestedOrderQuantity,
    "getTotalAvailableStock",
    ()=>getTotalAvailableStock,
    "getTotalOnHandStock",
    ()=>getTotalOnHandStock,
    "isOutOfStock",
    ()=>isOutOfStock,
    "needsReorder",
    ()=>needsReorder
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$inventory$2f$sla$2d$settings$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/inventory/sla-settings-store.ts [app-ssr] (ecmascript)");
;
const isDefinedNumber = (value)=>typeof value === 'number' && !Number.isNaN(value);
const getEffectiveThresholds = (product)=>{
    const { settings } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$inventory$2f$sla$2d$settings$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSlaSettingsStore"].getState();
    const thresholds = {};
    const reorderLevel = product.reorderLevel ?? settings.defaultReorderLevel;
    if (isDefinedNumber(reorderLevel)) {
        thresholds.reorderLevel = reorderLevel;
    }
    const safetyStock = product.safetyStock ?? settings.defaultSafetyStock;
    if (isDefinedNumber(safetyStock)) {
        thresholds.safetyStock = safetyStock;
    }
    const maxStock = product.maxStock ?? settings.defaultMaxStock;
    if (isDefinedNumber(maxStock)) {
        thresholds.maxStock = maxStock;
    }
    return thresholds;
};
const STOCK_ALERT_CONFIG = {
    out_of_stock: {
        label: 'Hết hàng',
        severity: 'critical',
        badgeVariant: 'destructive',
        icon: '🔴'
    },
    low_stock: {
        label: 'Sắp hết hàng',
        severity: 'warning',
        badgeVariant: 'warning',
        icon: '🟡'
    },
    below_safety: {
        label: 'Dưới mức an toàn',
        severity: 'warning',
        badgeVariant: 'warning',
        icon: '🟠'
    },
    over_stock: {
        label: 'Tồn kho cao',
        severity: 'info',
        badgeVariant: 'secondary',
        icon: '🔵'
    }
};
function getTotalAvailableStock(product) {
    const totalOnHand = Object.values(product.inventoryByBranch || {}).reduce((sum, qty)=>sum + qty, 0);
    const totalCommitted = Object.values(product.committedByBranch || {}).reduce((sum, qty)=>sum + qty, 0);
    return totalOnHand - totalCommitted;
}
function getTotalOnHandStock(product) {
    return Object.values(product.inventoryByBranch || {}).reduce((sum, qty)=>sum + qty, 0);
}
function getProductStockAlerts(product) {
    const alerts = [];
    // Skip combo products (they have virtual stock)
    if (product.type === 'combo') return alerts;
    // Skip non-stock-tracked products (services, digital)
    if (product.isStockTracked === false) return alerts;
    const totalOnHand = getTotalOnHandStock(product);
    const totalAvailable = getTotalAvailableStock(product);
    const { reorderLevel, safetyStock, maxStock } = getEffectiveThresholds(product);
    // Check out of stock
    if (totalAvailable <= 0) {
        alerts.push({
            type: 'out_of_stock',
            severity: 'critical',
            label: STOCK_ALERT_CONFIG.out_of_stock.label,
            description: 'Sản phẩm đã hết hàng có thể bán'
        });
        return alerts; // If out of stock, don't show other alerts
    }
    // Check low stock (below reorder level)
    if (isDefinedNumber(reorderLevel) && totalAvailable < reorderLevel) {
        alerts.push({
            type: 'low_stock',
            severity: 'warning',
            label: STOCK_ALERT_CONFIG.low_stock.label,
            description: `Tồn kho (${totalAvailable}) dưới mức đặt hàng lại (${reorderLevel})`
        });
    }
    // Check below safety stock
    if (isDefinedNumber(safetyStock) && totalAvailable < safetyStock && !alerts.some((a)=>a.type === 'low_stock')) {
        alerts.push({
            type: 'below_safety',
            severity: 'warning',
            label: STOCK_ALERT_CONFIG.below_safety.label,
            description: `Tồn kho (${totalAvailable}) dưới mức an toàn (${safetyStock})`
        });
    }
    // Check over stock
    if (isDefinedNumber(maxStock) && totalOnHand > maxStock) {
        alerts.push({
            type: 'over_stock',
            severity: 'info',
            label: STOCK_ALERT_CONFIG.over_stock.label,
            description: `Tồn kho (${totalOnHand}) vượt mức tối đa (${maxStock})`
        });
    }
    return alerts;
}
function getProductStockAlertsByBranch(product, branchSystemId, branchName) {
    const alerts = [];
    // Skip combo products
    if (product.type === 'combo') return alerts;
    // Skip non-stock-tracked products
    if (product.isStockTracked === false) return alerts;
    const onHand = product.inventoryByBranch?.[branchSystemId] || 0;
    const committed = product.committedByBranch?.[branchSystemId] || 0;
    const available = onHand - committed;
    const { reorderLevel } = getEffectiveThresholds(product);
    // Check out of stock at branch
    if (available <= 0) {
        alerts.push({
            type: 'out_of_stock',
            severity: 'critical',
            label: STOCK_ALERT_CONFIG.out_of_stock.label,
            description: `Hết hàng tại ${branchName}`,
            branchSystemId,
            branchName
        });
        return alerts;
    }
    // Check low stock at branch (using product-level thresholds)
    if (isDefinedNumber(reorderLevel) && available < reorderLevel) {
        alerts.push({
            type: 'low_stock',
            severity: 'warning',
            label: STOCK_ALERT_CONFIG.low_stock.label,
            description: `Tồn (${available}) < mức đặt hàng (${reorderLevel}) tại ${branchName}`,
            branchSystemId,
            branchName
        });
    }
    return alerts;
}
function getMostSevereAlert(alerts) {
    if (alerts.length === 0) return null;
    // Priority: critical > warning > info
    const critical = alerts.find((a)=>a.severity === 'critical');
    if (critical) return critical;
    const warning = alerts.find((a)=>a.severity === 'warning');
    if (warning) return warning;
    return alerts[0];
}
function needsReorder(product) {
    if (product.type === 'combo') return false;
    if (product.isStockTracked === false) return false;
    const { reorderLevel } = getEffectiveThresholds(product);
    if (!isDefinedNumber(reorderLevel)) return false;
    const totalAvailable = getTotalAvailableStock(product);
    return totalAvailable < reorderLevel;
}
function isOutOfStock(product) {
    if (product.type === 'combo') return false;
    if (product.isStockTracked === false) return false;
    const totalAvailable = getTotalAvailableStock(product);
    return totalAvailable <= 0;
}
function getSuggestedOrderQuantity(product) {
    if (product.type === 'combo') return 0;
    if (product.isStockTracked === false) return 0;
    const { safetyStock, reorderLevel } = getEffectiveThresholds(product);
    const totalOnHand = getTotalOnHandStock(product);
    const targetLevel = safetyStock ?? reorderLevel ?? 0;
    if (targetLevel <= totalOnHand) return 0;
    return targetLevel - totalOnHand;
}
}),
"[project]/features/products/components/stock-alert-badges.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StockAlertBadge",
    ()=>StockAlertBadge,
    "StockAlertBadges",
    ()=>StockAlertBadges
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/badge.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/tooltip.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-ssr] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-ssr] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2d$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PackageX$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/package-x.js [app-ssr] (ecmascript) <export default as PackageX>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trending-up.js [app-ssr] (ecmascript) <export default as TrendingUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$stock$2d$alert$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/products/stock-alert-utils.ts [app-ssr] (ecmascript)");
;
;
;
;
;
;
const AlertIcon = ({ type })=>{
    switch(type){
        case 'out_of_stock':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2d$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PackageX$3e$__["PackageX"], {
                className: "h-3.5 w-3.5"
            }, void 0, false, {
                fileName: "[project]/features/products/components/stock-alert-badges.tsx",
                lineNumber: 11,
                columnNumber: 14
            }, ("TURBOPACK compile-time value", void 0));
        case 'low_stock':
        case 'below_safety':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                className: "h-3.5 w-3.5"
            }, void 0, false, {
                fileName: "[project]/features/products/components/stock-alert-badges.tsx",
                lineNumber: 14,
                columnNumber: 14
            }, ("TURBOPACK compile-time value", void 0));
        case 'over_stock':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"], {
                className: "h-3.5 w-3.5"
            }, void 0, false, {
                fileName: "[project]/features/products/components/stock-alert-badges.tsx",
                lineNumber: 16,
                columnNumber: 14
            }, ("TURBOPACK compile-time value", void 0));
        default:
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                className: "h-3.5 w-3.5"
            }, void 0, false, {
                fileName: "[project]/features/products/components/stock-alert-badges.tsx",
                lineNumber: 18,
                columnNumber: 14
            }, ("TURBOPACK compile-time value", void 0));
    }
};
function StockAlertBadges({ product, showDescription = false, className }) {
    const alerts = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$stock$2d$alert$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getProductStockAlerts"])(product), [
        product
    ]);
    if (alerts.length === 0) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `flex flex-wrap gap-1.5 ${className || ''}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TooltipProvider"], {
                children: alerts.map((alert, index)=>{
                    const config = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$stock$2d$alert$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["STOCK_ALERT_CONFIG"][alert.type];
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Tooltip"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TooltipTrigger"], {
                                asChild: true,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                    variant: config.badgeVariant,
                                    className: "gap-1 cursor-help",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AlertIcon, {
                                            type: alert.type
                                        }, void 0, false, {
                                            fileName: "[project]/features/products/components/stock-alert-badges.tsx",
                                            lineNumber: 50,
                                            columnNumber: 19
                                        }, this),
                                        config.label
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/products/components/stock-alert-badges.tsx",
                                    lineNumber: 46,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/features/products/components/stock-alert-badges.tsx",
                                lineNumber: 45,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TooltipContent"], {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: alert.description
                                }, void 0, false, {
                                    fileName: "[project]/features/products/components/stock-alert-badges.tsx",
                                    lineNumber: 55,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/features/products/components/stock-alert-badges.tsx",
                                lineNumber: 54,
                                columnNumber: 15
                            }, this)
                        ]
                    }, `${alert.type}-${index}`, true, {
                        fileName: "[project]/features/products/components/stock-alert-badges.tsx",
                        lineNumber: 44,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/features/products/components/stock-alert-badges.tsx",
                lineNumber: 39,
                columnNumber: 7
            }, this),
            showDescription && alerts.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full mt-1 text-body-sm text-muted-foreground",
                children: alerts.map((alert, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "• ",
                            alert.description
                        ]
                    }, i, true, {
                        fileName: "[project]/features/products/components/stock-alert-badges.tsx",
                        lineNumber: 65,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/features/products/components/stock-alert-badges.tsx",
                lineNumber: 63,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/products/components/stock-alert-badges.tsx",
        lineNumber: 38,
        columnNumber: 5
    }, this);
}
function StockAlertBadge({ product, className }) {
    const alerts = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$stock$2d$alert$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getProductStockAlerts"])(product), [
        product
    ]);
    if (alerts.length === 0) return null;
    // Show most critical alert
    const alert = alerts[0]; // Already sorted by severity in getProductStockAlerts
    const config = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$stock$2d$alert$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["STOCK_ALERT_CONFIG"][alert.type];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TooltipProvider"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Tooltip"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TooltipTrigger"], {
                    asChild: true,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                        variant: config.badgeVariant,
                        className: `gap-1 cursor-help ${className || ''}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AlertIcon, {
                                type: alert.type
                            }, void 0, false, {
                                fileName: "[project]/features/products/components/stock-alert-badges.tsx",
                                lineNumber: 93,
                                columnNumber: 13
                            }, this),
                            config.label
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/products/components/stock-alert-badges.tsx",
                        lineNumber: 89,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/features/products/components/stock-alert-badges.tsx",
                    lineNumber: 88,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TooltipContent"], {
                    children: alerts.length === 1 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: alert.description
                    }, void 0, false, {
                        fileName: "[project]/features/products/components/stock-alert-badges.tsx",
                        lineNumber: 99,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: alerts.map((a, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: [
                                    "• ",
                                    a.description
                                ]
                            }, i, true, {
                                fileName: "[project]/features/products/components/stock-alert-badges.tsx",
                                lineNumber: 103,
                                columnNumber: 17
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/features/products/components/stock-alert-badges.tsx",
                        lineNumber: 101,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/features/products/components/stock-alert-badges.tsx",
                    lineNumber: 97,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/features/products/components/stock-alert-badges.tsx",
            lineNumber: 87,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/features/products/components/stock-alert-badges.tsx",
        lineNumber: 86,
        columnNumber: 5
    }, this);
}
}),
"[project]/features/products/columns.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getColumns",
    ()=>getColumns
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/checkbox.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/badge.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$switch$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/switch.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dropdown-menu.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis.js [app-ssr] (ecmascript) <export default as MoreHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/rotate-ccw.js [app-ssr] (ecmascript) <export default as RotateCcw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/globe.js [app-ssr] (ecmascript) <export default as Globe>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shopping-cart.js [app-ssr] (ecmascript) <export default as ShoppingCart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wrench$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Wrench$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/wrench.js [app-ssr] (ecmascript) <export default as Wrench>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$digit$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileDigit$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-digit.js [app-ssr] (ecmascript) <export default as FileDigit>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layers.js [app-ssr] (ecmascript) <export default as Layers>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-ssr] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-ssr] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-x.js [app-ssr] (ecmascript) <export default as XCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pricing$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pricing/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$inventory$2f$product$2d$category$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/inventory/product-category-store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$pkgx$2d$product$2d$actions$2d$cell$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/products/pkgx-product-actions-cell.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$inventory$2f$brand$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/inventory/brand-store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$suppliers$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/suppliers/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/employees/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$components$2f$stock$2d$alert$2d$badges$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/products/components/stock-alert-badges.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$inline$2d$editable$2d$cell$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/shared/inline-editable-cell.tsx [app-ssr] (ecmascript)");
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
const formatCurrency = (value)=>{
    if (typeof value !== 'number' || isNaN(value)) return '-';
    return new Intl.NumberFormat('vi-VN').format(value);
};
const formatDateTime = (dateStr)=>{
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};
const getStatusBadgeVariant = (status)=>{
    switch(status){
        case 'active':
            return 'success';
        case 'inactive':
            return 'secondary';
        case 'discontinued':
            return 'destructive';
        default:
            return 'secondary';
    }
};
const getStatusLabel = (status)=>{
    switch(status){
        case 'active':
            return 'Đang bán';
        case 'inactive':
            return 'Ngừng bán';
        case 'discontinued':
            return 'Ngừng SX';
        default:
            return 'Không rõ';
    }
};
const calculateSeoScore = (seo)=>{
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
                fileName: "[project]/features/products/columns.tsx",
                lineNumber: 90,
                columnNumber: 111
            }, ("TURBOPACK compile-time value", void 0)),
            " ",
            score,
            "%"
        ]
    }, void 0, true, {
        fileName: "[project]/features/products/columns.tsx",
        lineNumber: 90,
        columnNumber: 27
    }, ("TURBOPACK compile-time value", void 0));
    if (score >= 50) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
        variant: "secondary",
        className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                className: "h-3 w-3 mr-1"
            }, void 0, false, {
                fileName: "[project]/features/products/columns.tsx",
                lineNumber: 91,
                columnNumber: 116
            }, ("TURBOPACK compile-time value", void 0)),
            " ",
            score,
            "%"
        ]
    }, void 0, true, {
        fileName: "[project]/features/products/columns.tsx",
        lineNumber: 91,
        columnNumber: 27
    }, ("TURBOPACK compile-time value", void 0));
    if (score > 0) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
        variant: "secondary",
        className: "bg-red-100 text-red-800 hover:bg-red-100",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"], {
                className: "h-3 w-3 mr-1"
            }, void 0, false, {
                fileName: "[project]/features/products/columns.tsx",
                lineNumber: 92,
                columnNumber: 105
            }, ("TURBOPACK compile-time value", void 0)),
            " ",
            score,
            "%"
        ]
    }, void 0, true, {
        fileName: "[project]/features/products/columns.tsx",
        lineNumber: 92,
        columnNumber: 25
    }, ("TURBOPACK compile-time value", void 0));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
        variant: "outline",
        className: "text-muted-foreground",
        children: "—"
    }, void 0, false, {
        fileName: "[project]/features/products/columns.tsx",
        lineNumber: 93,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
const getColumns = (onDelete, onRestore, router, onPrintLabel, // PKGX handlers - used by PkgxProductActionsCell
onPkgxPublish, onPkgxLink, onPkgxUnlink, onPkgxSyncImages, // Status & Inline edit handlers
onStatusChange, onInventoryChange, // Field update handler for inline editing
onFieldUpdate)=>{
    const { data: pricingPolicies } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pricing$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePricingPolicyStore"].getState();
    const activePricingPolicies = pricingPolicies.filter((p)=>p.isActive);
    const defaultSellingPolicy = pricingPolicies.find((p)=>p.type === 'Bán hàng' && p.isDefault);
    // Pre-fetch lookup data to avoid repeated store access in cell renders
    const categoryStore = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$inventory$2f$product$2d$category$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductCategoryStore"].getState();
    const brandStore = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$inventory$2f$brand$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useBrandStore"].getState();
    const supplierStore = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$suppliers$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSupplierStore"].getState();
    const employeeStore = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmployeeStore"].getState();
    return [
        {
            id: "select",
            header: ({ isAllPageRowsSelected, isSomePageRowsSelected, onToggleAll })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Checkbox"], {
                        checked: isAllPageRowsSelected ? true : isSomePageRowsSelected ? "indeterminate" : false,
                        onCheckedChange: (value)=>onToggleAll?.(!!value),
                        "aria-label": "Select all"
                    }, void 0, false, {
                        fileName: "[project]/features/products/columns.tsx",
                        lineNumber: 128,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/features/products/columns.tsx",
                    lineNumber: 127,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
            cell: ({ isSelected, onToggleSelect })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Checkbox"], {
                        checked: isSelected,
                        onCheckedChange: onToggleSelect,
                        "aria-label": "Select row"
                    }, void 0, false, {
                        fileName: "[project]/features/products/columns.tsx",
                        lineNumber: 137,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/features/products/columns.tsx",
                    lineNumber: 136,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
            size: 48,
            meta: {
                displayName: "Select",
                sticky: "left"
            }
        },
        {
            id: "id",
            accessorKey: "id",
            header: "Mã SP (SKU)",
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-body-sm font-medium",
                    children: row.id
                }, void 0, false, {
                    fileName: "[project]/features/products/columns.tsx",
                    lineNumber: 154,
                    columnNumber: 26
                }, ("TURBOPACK compile-time value", void 0)),
            meta: {
                displayName: "Mã SP (SKU)"
            },
            size: 150
        },
        {
            id: "name",
            accessorKey: "name",
            header: "Tên sản phẩm/dịch vụ",
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-body-sm font-medium flex items-center gap-2 flex-wrap",
                        children: [
                            row.name,
                            row.type === 'combo' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                variant: "secondary",
                                className: "text-body-xs",
                                children: "Combo"
                            }, void 0, false, {
                                fileName: "[project]/features/products/columns.tsx",
                                lineNumber: 167,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            row.pkgxId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                variant: "secondary",
                                className: "text-body-xs",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__["Globe"], {
                                        className: "h-3 w-3"
                                    }, void 0, false, {
                                        fileName: "[project]/features/products/columns.tsx",
                                        lineNumber: 171,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    "PKGX"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/products/columns.tsx",
                                lineNumber: 170,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$components$2f$stock$2d$alert$2d$badges$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StockAlertBadge"], {
                                product: row
                            }, void 0, false, {
                                fileName: "[project]/features/products/columns.tsx",
                                lineNumber: 175,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/products/columns.tsx",
                        lineNumber: 164,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/features/products/columns.tsx",
                    lineNumber: 163,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
            meta: {
                displayName: "Tên sản phẩm/dịch vụ"
            }
        },
        {
            id: "category",
            accessorKey: "categorySystemId",
            header: "Danh mục",
            cell: ({ row })=>{
                const categoryId = row.categorySystemId;
                if (!categoryId) return row.category || '-';
                const category = categoryStore.findById(categoryId);
                return category ? category.path || category.name : row.category || '-';
            },
            meta: {
                displayName: "Danh mục"
            }
        },
        {
            id: "type",
            accessorKey: "type",
            header: "Loại",
            cell: ({ row })=>{
                const typeConfig = {
                    physical: {
                        label: 'Hàng hóa',
                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__["ShoppingCart"],
                        variant: 'secondary'
                    },
                    service: {
                        label: 'Dịch vụ',
                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wrench$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Wrench$3e$__["Wrench"],
                        variant: 'secondary'
                    },
                    digital: {
                        label: 'Sản phẩm số',
                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$digit$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileDigit$3e$__["FileDigit"],
                        variant: 'secondary'
                    },
                    combo: {
                        label: 'Combo',
                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__["Layers"],
                        variant: 'secondary'
                    }
                };
                const type = row.type || 'physical';
                const config = typeConfig[type] || typeConfig.physical;
                const Icon = config.icon;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                    variant: config.variant,
                    className: "gap-1",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                            className: "h-3 w-3"
                        }, void 0, false, {
                            fileName: "[project]/features/products/columns.tsx",
                            lineNumber: 209,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        config.label
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/products/columns.tsx",
                    lineNumber: 208,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0));
            },
            meta: {
                displayName: "Loại"
            }
        },
        {
            id: "barcode",
            accessorKey: "barcode",
            header: "Mã vạch",
            cell: ({ row })=>row.barcode || '-',
            meta: {
                displayName: "Mã vạch"
            }
        },
        {
            id: "status",
            accessorKey: "status",
            header: "Trạng thái",
            cell: ({ row })=>{
                const isActive = row.status === 'active';
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-2",
                    onClick: (e)=>e.stopPropagation(),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$switch$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Switch"], {
                            checked: isActive,
                            onCheckedChange: (checked)=>{
                                onStatusChange?.(row, checked ? 'active' : 'inactive');
                            }
                        }, void 0, false, {
                            fileName: "[project]/features/products/columns.tsx",
                            lineNumber: 231,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: `text-xs ${isActive ? 'text-foreground' : 'text-muted-foreground'}`,
                            children: isActive
                        }, void 0, false, {
                            fileName: "[project]/features/products/columns.tsx",
                            lineNumber: 237,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/products/columns.tsx",
                    lineNumber: 230,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0));
            },
            meta: {
                displayName: "Trạng thái"
            }
        },
        {
            id: "costPrice",
            accessorKey: "costPrice",
            header: "Giá vốn",
            cell: ({ row })=>{
                if (onFieldUpdate) {
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        onClick: (e)=>e.stopPropagation(),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$inline$2d$editable$2d$cell$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["InlineEditableNumberCell"], {
                            value: row.costPrice || 0,
                            onSave: (newValue)=>onFieldUpdate(row, 'costPrice', newValue)
                        }, void 0, false, {
                            fileName: "[project]/features/products/columns.tsx",
                            lineNumber: 253,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/features/products/columns.tsx",
                        lineNumber: 252,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0));
                }
                return formatCurrency(row.costPrice);
            },
            meta: {
                displayName: "Giá vốn"
            }
        },
        {
            id: "inventory",
            // FIX: Correct accessorKey to match the property in the Product type.
            accessorKey: "inventoryByBranch",
            header: "Tồn kho",
            // FIX: Correctly calculate the total inventory from the inventoryByBranch object.
            cell: ({ row })=>{
                // Combo không có tồn kho thực tế
                if (row.type === 'combo') {
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-muted-foreground italic",
                        children: "Ảo"
                    }, void 0, false, {
                        fileName: "[project]/features/products/columns.tsx",
                        lineNumber: 273,
                        columnNumber: 18
                    }, ("TURBOPACK compile-time value", void 0));
                }
                const totalInventory = Object.values(row.inventoryByBranch).reduce((sum, qty)=>sum + qty, 0);
                if (onInventoryChange) {
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        onClick: (e)=>e.stopPropagation(),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$inline$2d$editable$2d$cell$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["InlineEditableNumberCell"], {
                            value: totalInventory,
                            onSave: (newValue)=>onInventoryChange(row, newValue)
                        }, void 0, false, {
                            fileName: "[project]/features/products/columns.tsx",
                            lineNumber: 280,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/features/products/columns.tsx",
                        lineNumber: 279,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0));
                }
                return totalInventory;
            },
            meta: {
                displayName: "Tồn kho"
            }
        },
        {
            id: "unit",
            accessorKey: "unit",
            header: "Đơn vị tính",
            cell: ({ row })=>row.unit,
            meta: {
                displayName: "Đơn vị tính"
            }
        },
        {
            id: "tags",
            accessorKey: "tags",
            header: "Tags",
            cell: ({ row })=>{
                if (!row.tags || row.tags.length === 0) return '-';
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-wrap gap-1",
                    children: [
                        row.tags.slice(0, 2).map((tag)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                variant: "outline",
                                className: "text-body-xs",
                                children: tag
                            }, tag, false, {
                                fileName: "[project]/features/products/columns.tsx",
                                lineNumber: 308,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))),
                        row.tags.length > 2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-body-xs text-muted-foreground",
                            children: [
                                "+",
                                row.tags.length - 2
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/products/columns.tsx",
                            lineNumber: 311,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/products/columns.tsx",
                    lineNumber: 306,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0));
            },
            meta: {
                displayName: "Tags"
            }
        },
        {
            id: "committed",
            header: "Đang giao dịch",
            cell: ({ row })=>Object.values(row.committedByBranch || {}).reduce((sum, qty)=>sum + qty, 0),
            meta: {
                displayName: "Đang giao dịch"
            }
        },
        {
            id: "inTransit",
            header: "Đang về",
            cell: ({ row })=>Object.values(row.inTransitByBranch || {}).reduce((sum, qty)=>sum + qty, 0),
            meta: {
                displayName: "Đang về"
            }
        },
        {
            id: "totalSold",
            accessorKey: "totalSold",
            header: "Đã bán",
            cell: ({ row })=>row.totalSold || 0,
            meta: {
                displayName: "Đã bán"
            }
        },
        {
            id: "createdAt",
            accessorKey: "createdAt",
            header: "Ngày tạo",
            cell: ({ row })=>{
                if (!row.createdAt) return '-';
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDateForDisplay"])(row.createdAt);
            },
            meta: {
                displayName: "Ngày tạo"
            }
        },
        // ═══════════════════════════════════════════════════════════════
        // THÊM CÁC CỘT MỚI - Thương hiệu
        // ═══════════════════════════════════════════════════════════════
        {
            id: "brand",
            accessorKey: "brandSystemId",
            header: "Thương hiệu",
            cell: ({ row })=>{
                const brandId = row.brandSystemId;
                if (!brandId) return '-';
                const brand = brandStore.findById(brandId);
                return brand ? brand.name : '-';
            },
            meta: {
                displayName: "Thương hiệu"
            }
        },
        {
            id: "pkgxId",
            accessorKey: "pkgxId",
            header: "ID PKGX",
            cell: ({ row })=>{
                if (onFieldUpdate) {
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        onClick: (e)=>e.stopPropagation(),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$inline$2d$editable$2d$cell$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["InlineEditableNumberCell"], {
                            value: row.pkgxId || 0,
                            onSave: (newValue)=>onFieldUpdate(row, 'pkgxId', newValue)
                        }, void 0, false, {
                            fileName: "[project]/features/products/columns.tsx",
                            lineNumber: 370,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/features/products/columns.tsx",
                        lineNumber: 369,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0));
                }
                return row.pkgxId || '-';
            },
            meta: {
                displayName: "ID PKGX"
            }
        },
        // SEO PKGX Score
        {
            id: "seoPkgx",
            accessorKey: "seoPkgx",
            header: "SEO PKGX",
            cell: ({ row })=>{
                const score = calculateSeoScore(row.seoPkgx);
                return getSeoStatusBadge(score);
            },
            size: 100,
            meta: {
                displayName: "SEO PKGX",
                group: "SEO"
            }
        },
        {
            id: "warrantyPeriodMonths",
            accessorKey: "warrantyPeriodMonths",
            header: "Bảo hành",
            cell: ({ row })=>{
                if (!row.warrantyPeriodMonths) return '-';
                return `${row.warrantyPeriodMonths} tháng`;
            },
            meta: {
                displayName: "Bảo hành"
            }
        },
        // ═══════════════════════════════════════════════════════════════
        // SEO & MÔ TẢ
        // ═══════════════════════════════════════════════════════════════
        {
            id: "ktitle",
            accessorKey: "ktitle",
            header: "Tiêu đề SEO",
            cell: ({ row })=>row.ktitle || '-',
            meta: {
                displayName: "Tiêu đề SEO"
            }
        },
        {
            id: "seoDescription",
            accessorKey: "seoDescription",
            header: "Mô tả SEO",
            cell: ({ row })=>{
                if (!row.seoDescription) return '-';
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "line-clamp-1",
                    children: row.seoDescription
                }, void 0, false, {
                    fileName: "[project]/features/products/columns.tsx",
                    lineNumber: 419,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            },
            meta: {
                displayName: "Mô tả SEO"
            }
        },
        {
            id: "shortDescription",
            accessorKey: "shortDescription",
            header: "Mô tả ngắn",
            cell: ({ row })=>{
                if (!row.shortDescription) return '-';
                // Strip HTML tags for display
                const text = row.shortDescription.replace(/<[^>]*>/g, '');
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "line-clamp-1",
                    children: text
                }, void 0, false, {
                    fileName: "[project]/features/products/columns.tsx",
                    lineNumber: 431,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            },
            meta: {
                displayName: "Mô tả ngắn"
            }
        },
        {
            id: "description",
            accessorKey: "description",
            header: "Mô tả chi tiết",
            cell: ({ row })=>{
                if (!row.description) return '-';
                // Strip HTML tags for display
                const text = row.description.replace(/<[^>]*>/g, '');
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "line-clamp-1",
                    children: text
                }, void 0, false, {
                    fileName: "[project]/features/products/columns.tsx",
                    lineNumber: 443,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            },
            meta: {
                displayName: "Mô tả chi tiết"
            }
        },
        // ═══════════════════════════════════════════════════════════════
        // GIÁ & NHẬP HÀNG
        // ═══════════════════════════════════════════════════════════════
        {
            id: "lastPurchasePrice",
            accessorKey: "lastPurchasePrice",
            header: "Giá nhập gần nhất",
            cell: ({ row })=>formatCurrency(row.lastPurchasePrice),
            meta: {
                displayName: "Giá nhập gần nhất"
            }
        },
        {
            id: "primarySupplier",
            accessorKey: "primarySupplierSystemId",
            header: "Nhà cung cấp chính",
            cell: ({ row })=>{
                const supplierId = row.primarySupplierSystemId;
                if (!supplierId) return '-';
                const supplier = supplierStore.findById(supplierId);
                return supplier ? supplier.name : '-';
            },
            meta: {
                displayName: "Nhà cung cấp chính"
            }
        },
        {
            id: "lastPurchaseDate",
            accessorKey: "lastPurchaseDate",
            header: "Ngày nhập gần nhất",
            cell: ({ row })=>{
                if (!row.lastPurchaseDate) return '-';
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDateForDisplay"])(row.lastPurchaseDate);
            },
            meta: {
                displayName: "Ngày nhập gần nhất"
            }
        },
        {
            id: "minPrice",
            accessorKey: "minPrice",
            header: "Giá tối thiểu",
            cell: ({ row })=>formatCurrency(row.minPrice),
            meta: {
                displayName: "Giá tối thiểu"
            }
        },
        // ═══════════════════════════════════════════════════════════════
        // KHO - Mức đặt hàng, tồn kho an toàn, tối đa
        // ═══════════════════════════════════════════════════════════════
        {
            id: "reorderLevel",
            accessorKey: "reorderLevel",
            header: "Mức đặt hàng lại",
            cell: ({ row })=>{
                if (onFieldUpdate) {
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        onClick: (e)=>e.stopPropagation(),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$inline$2d$editable$2d$cell$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["InlineEditableNumberCell"], {
                            value: row.reorderLevel ?? 0,
                            onSave: (newValue)=>onFieldUpdate(row, 'reorderLevel', newValue)
                        }, void 0, false, {
                            fileName: "[project]/features/products/columns.tsx",
                            lineNumber: 497,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/features/products/columns.tsx",
                        lineNumber: 496,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0));
                }
                return row.reorderLevel ?? 0;
            },
            meta: {
                displayName: "Mức đặt hàng lại"
            }
        },
        {
            id: "safetyStock",
            accessorKey: "safetyStock",
            header: "Tồn kho an toàn",
            cell: ({ row })=>{
                if (onFieldUpdate) {
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        onClick: (e)=>e.stopPropagation(),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$inline$2d$editable$2d$cell$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["InlineEditableNumberCell"], {
                            value: row.safetyStock ?? 0,
                            onSave: (newValue)=>onFieldUpdate(row, 'safetyStock', newValue)
                        }, void 0, false, {
                            fileName: "[project]/features/products/columns.tsx",
                            lineNumber: 516,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/features/products/columns.tsx",
                        lineNumber: 515,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0));
                }
                return row.safetyStock ?? 0;
            },
            meta: {
                displayName: "Tồn kho an toàn"
            }
        },
        {
            id: "maxStock",
            accessorKey: "maxStock",
            header: "Mức tồn tối đa",
            cell: ({ row })=>{
                if (onFieldUpdate) {
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        onClick: (e)=>e.stopPropagation(),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$inline$2d$editable$2d$cell$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["InlineEditableNumberCell"], {
                            value: row.maxStock ?? 0,
                            onSave: (newValue)=>onFieldUpdate(row, 'maxStock', newValue)
                        }, void 0, false, {
                            fileName: "[project]/features/products/columns.tsx",
                            lineNumber: 535,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/features/products/columns.tsx",
                        lineNumber: 534,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0));
                }
                return row.maxStock ?? 0;
            },
            meta: {
                displayName: "Mức tồn tối đa"
            }
        },
        // ═══════════════════════════════════════════════════════════════
        // LOGISTICS - Khối lượng, Kích thước
        // ═══════════════════════════════════════════════════════════════
        {
            id: "weight",
            accessorKey: "weight",
            header: "Khối lượng",
            cell: ({ row })=>{
                if (row.weight === undefined) return '-';
                return `${row.weight} ${row.weightUnit || 'g'}`;
            },
            meta: {
                displayName: "Khối lượng"
            }
        },
        {
            id: "dimensions",
            accessorKey: "dimensions",
            header: "Kích thước (D×R×C)",
            cell: ({ row })=>{
                if (!row.dimensions) return '-';
                const { length = 0, width = 0, height = 0 } = row.dimensions;
                return `${length}×${width}×${height} cm`;
            },
            meta: {
                displayName: "Kích thước (D×R×C)"
            }
        },
        // ═══════════════════════════════════════════════════════════════
        // E-COMMERCE - Bán hàng online
        // ═══════════════════════════════════════════════════════════════
        {
            id: "pkgxStatus",
            header: "PKGX",
            cell: ({ row })=>row.pkgxId ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                    variant: "default",
                    className: "bg-green-500 text-xs",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__["Globe"], {
                            className: "h-3 w-3 mr-1"
                        }, void 0, false, {
                            fileName: "[project]/features/products/columns.tsx",
                            lineNumber: 579,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        row.pkgxId
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/products/columns.tsx",
                    lineNumber: 578,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                    variant: "secondary",
                    className: "text-xs",
                    children: "Chưa liên kết"
                }, void 0, false, {
                    fileName: "[project]/features/products/columns.tsx",
                    lineNumber: 583,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)),
            meta: {
                displayName: "Trạng thái PKGX"
            }
        },
        {
            id: "pkgxSlug",
            accessorKey: "pkgxSlug",
            header: "Slug PKGX",
            cell: ({ row })=>row.pkgxSlug || '-',
            meta: {
                displayName: "Slug PKGX"
            }
        },
        {
            id: "isPublished",
            accessorKey: "isPublished",
            header: "Đăng web",
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    onClick: (e)=>e.stopPropagation(),
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$switch$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Switch"], {
                        checked: row.isPublished ?? false,
                        onCheckedChange: (checked)=>onFieldUpdate?.(row, 'isPublished', checked)
                    }, void 0, false, {
                        fileName: "[project]/features/products/columns.tsx",
                        lineNumber: 601,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/features/products/columns.tsx",
                    lineNumber: 600,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
            meta: {
                displayName: "Đăng web"
            }
        },
        {
            id: "isFeatured",
            accessorKey: "isFeatured",
            header: "Nổi bật",
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    onClick: (e)=>e.stopPropagation(),
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$switch$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Switch"], {
                        checked: row.isFeatured ?? false,
                        onCheckedChange: (checked)=>onFieldUpdate?.(row, 'isFeatured', checked)
                    }, void 0, false, {
                        fileName: "[project]/features/products/columns.tsx",
                        lineNumber: 615,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/features/products/columns.tsx",
                    lineNumber: 614,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
            meta: {
                displayName: "Nổi bật"
            }
        },
        {
            id: "isNewArrival",
            accessorKey: "isNewArrival",
            header: "Mới về",
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    onClick: (e)=>e.stopPropagation(),
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$switch$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Switch"], {
                        checked: row.isNewArrival ?? false,
                        onCheckedChange: (checked)=>onFieldUpdate?.(row, 'isNewArrival', checked)
                    }, void 0, false, {
                        fileName: "[project]/features/products/columns.tsx",
                        lineNumber: 629,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/features/products/columns.tsx",
                    lineNumber: 628,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
            meta: {
                displayName: "Mới về"
            }
        },
        {
            id: "isBestSeller",
            accessorKey: "isBestSeller",
            header: "Bán chạy",
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    onClick: (e)=>e.stopPropagation(),
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$switch$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Switch"], {
                        checked: row.isBestSeller ?? false,
                        onCheckedChange: (checked)=>onFieldUpdate?.(row, 'isBestSeller', checked)
                    }, void 0, false, {
                        fileName: "[project]/features/products/columns.tsx",
                        lineNumber: 643,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/features/products/columns.tsx",
                    lineNumber: 642,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
            meta: {
                displayName: "Bán chạy"
            }
        },
        {
            id: "isOnSale",
            accessorKey: "isOnSale",
            header: "Đang giảm giá",
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    onClick: (e)=>e.stopPropagation(),
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$switch$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Switch"], {
                        checked: row.isOnSale ?? false,
                        onCheckedChange: (checked)=>onFieldUpdate?.(row, 'isOnSale', checked)
                    }, void 0, false, {
                        fileName: "[project]/features/products/columns.tsx",
                        lineNumber: 657,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/features/products/columns.tsx",
                    lineNumber: 656,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
            meta: {
                displayName: "Đang giảm giá"
            }
        },
        {
            id: "sortOrder",
            accessorKey: "sortOrder",
            header: "Thứ tự",
            cell: ({ row })=>{
                if (onFieldUpdate) {
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        onClick: (e)=>e.stopPropagation(),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$inline$2d$editable$2d$cell$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["InlineEditableNumberCell"], {
                            value: row.sortOrder ?? 0,
                            onSave: (newValue)=>onFieldUpdate(row, 'sortOrder', newValue)
                        }, void 0, false, {
                            fileName: "[project]/features/products/columns.tsx",
                            lineNumber: 673,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/features/products/columns.tsx",
                        lineNumber: 672,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0));
                }
                return row.sortOrder ?? '-';
            },
            meta: {
                displayName: "Thứ tự"
            }
        },
        {
            id: "publishedAt",
            accessorKey: "publishedAt",
            header: "Ngày đăng web",
            cell: ({ row })=>row.publishedAt ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDateForDisplay"])(row.publishedAt) : '-',
            meta: {
                displayName: "Ngày đăng web"
            }
        },
        // ═══════════════════════════════════════════════════════════════
        // MEDIA - Hình ảnh & Video
        // ═══════════════════════════════════════════════════════════════
        {
            id: "thumbnailImage",
            accessorKey: "thumbnailImage",
            header: "Ảnh đại diện",
            cell: ({ row })=>{
                if (!row.thumbnailImage) return '-';
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                    src: row.thumbnailImage,
                    alt: row.name,
                    className: "w-10 h-10 object-cover rounded"
                }, void 0, false, {
                    fileName: "[project]/features/products/columns.tsx",
                    lineNumber: 701,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0));
            },
            meta: {
                displayName: "Ảnh đại diện"
            },
            size: 80
        },
        {
            id: "galleryImages",
            accessorKey: "galleryImages",
            header: "Album ảnh",
            cell: ({ row })=>{
                const images = row.galleryImages;
                if (!images || images.length === 0) return '-';
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                    variant: "outline",
                    children: [
                        images.length,
                        " ảnh"
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/products/columns.tsx",
                    lineNumber: 718,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            },
            meta: {
                displayName: "Album ảnh"
            }
        },
        {
            id: "videoLinks",
            accessorKey: "videoLinks",
            header: "Video",
            cell: ({ row })=>{
                const videos = row.videoLinks;
                if (!videos || videos.length === 0) return '-';
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                    variant: "outline",
                    children: [
                        videos.length,
                        " video"
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/products/columns.tsx",
                    lineNumber: 729,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            },
            meta: {
                displayName: "Video"
            }
        },
        // ═══════════════════════════════════════════════════════════════
        // THUẾ
        // ═══════════════════════════════════════════════════════════════
        {
            id: "taxRate",
            accessorKey: "taxRate",
            header: "Thuế suất",
            cell: ({ row })=>{
                if (row.taxRate === undefined) return '-';
                return `${row.taxRate}%`;
            },
            meta: {
                displayName: "Thuế suất"
            }
        },
        // ═══════════════════════════════════════════════════════════════
        // KHO - Theo dõi tồn kho & Vị trí
        // ═══════════════════════════════════════════════════════════════
        {
            id: "isStockTracked",
            accessorKey: "isStockTracked",
            header: "Theo dõi kho",
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    onClick: (e)=>e.stopPropagation(),
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$switch$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Switch"], {
                        checked: row.isStockTracked !== false,
                        onCheckedChange: (checked)=>onFieldUpdate?.(row, 'isStockTracked', checked)
                    }, void 0, false, {
                        fileName: "[project]/features/products/columns.tsx",
                        lineNumber: 755,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/features/products/columns.tsx",
                    lineNumber: 754,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
            meta: {
                displayName: "Theo dõi kho"
            }
        },
        {
            id: "warehouseLocation",
            accessorKey: "warehouseLocation",
            header: "Vị trí kho",
            cell: ({ row })=>row.warehouseLocation || '-',
            meta: {
                displayName: "Vị trí kho"
            }
        },
        // ═══════════════════════════════════════════════════════════════
        // TEM PHỤ - Thông tin in tem
        // ═══════════════════════════════════════════════════════════════
        {
            id: "nameVat",
            accessorKey: "nameVat",
            header: "Tên VAT",
            cell: ({ row })=>row.nameVat || '-',
            meta: {
                displayName: "Tên VAT"
            }
        },
        {
            id: "origin",
            accessorKey: "origin",
            header: "Xuất xứ",
            cell: ({ row })=>row.origin || '-',
            meta: {
                displayName: "Xuất xứ"
            }
        },
        {
            id: "usageGuide",
            accessorKey: "usageGuide",
            header: "HDSD",
            cell: ({ row })=>{
                if (!row.usageGuide) return '-';
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "line-clamp-1",
                    children: row.usageGuide
                }, void 0, false, {
                    fileName: "[project]/features/products/columns.tsx",
                    lineNumber: 793,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            },
            meta: {
                displayName: "HDSD"
            }
        },
        {
            id: "sellerNote",
            accessorKey: "sellerNote",
            header: "Ghi chú",
            cell: ({ row })=>{
                if (onFieldUpdate) {
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        onClick: (e)=>e.stopPropagation(),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$inline$2d$editable$2d$cell$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["InlineEditableCell"], {
                            value: row.sellerNote || '',
                            onSave: (newValue)=>onFieldUpdate(row, 'sellerNote', newValue)
                        }, void 0, false, {
                            fileName: "[project]/features/products/columns.tsx",
                            lineNumber: 805,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/features/products/columns.tsx",
                        lineNumber: 804,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0));
                }
                if (!row.sellerNote) return '-';
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "line-clamp-1",
                    children: row.sellerNote
                }, void 0, false, {
                    fileName: "[project]/features/products/columns.tsx",
                    lineNumber: 813,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            },
            meta: {
                displayName: "Ghi chú"
            }
        },
        // ═══════════════════════════════════════════════════════════════
        // SEO - Keywords
        // ═══════════════════════════════════════════════════════════════
        {
            id: "seoKeywords",
            accessorKey: "seoKeywords",
            header: "Keywords SEO",
            cell: ({ row })=>{
                if (!row.seoKeywords) return '-';
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "line-clamp-1",
                    children: row.seoKeywords
                }, void 0, false, {
                    fileName: "[project]/features/products/columns.tsx",
                    lineNumber: 826,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            },
            meta: {
                displayName: "Keywords SEO"
            }
        },
        // ═══════════════════════════════════════════════════════════════
        // VARIANTS - Biến thể sản phẩm
        // ═══════════════════════════════════════════════════════════════
        {
            id: "hasVariants",
            accessorKey: "hasVariants",
            header: "Có biến thể",
            cell: ({ row })=>row.hasVariants ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                    variant: "default",
                    children: "Có"
                }, void 0, false, {
                    fileName: "[project]/features/products/columns.tsx",
                    lineNumber: 837,
                    columnNumber: 44
                }, ("TURBOPACK compile-time value", void 0)) : '-',
            meta: {
                displayName: "Có biến thể"
            }
        },
        {
            id: "variantsCount",
            header: "Số biến thể",
            cell: ({ row })=>{
                if (!row.variants || row.variants.length === 0) return '-';
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                    variant: "outline",
                    children: [
                        row.variants.length,
                        " biến thể"
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/products/columns.tsx",
                    lineNumber: 845,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            },
            meta: {
                displayName: "Số biến thể"
            }
        },
        // ═══════════════════════════════════════════════════════════════
        // COMBO - Thông tin combo
        // ═══════════════════════════════════════════════════════════════
        {
            id: "comboItemsCount",
            header: "SP trong combo",
            cell: ({ row })=>{
                if (row.type !== 'combo' || !row.comboItems || row.comboItems.length === 0) return '-';
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                    variant: "secondary",
                    children: [
                        row.comboItems.length,
                        " SP"
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/products/columns.tsx",
                    lineNumber: 857,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            },
            meta: {
                displayName: "SP trong combo"
            }
        },
        // ═══════════════════════════════════════════════════════════════
        // SALES ANALYTICS - Phân tích bán hàng
        // ═══════════════════════════════════════════════════════════════
        {
            id: "totalRevenue",
            accessorKey: "totalRevenue",
            header: "Tổng doanh thu",
            cell: ({ row })=>formatCurrency(row.totalRevenue),
            meta: {
                displayName: "Tổng doanh thu"
            }
        },
        {
            id: "lastSoldDate",
            accessorKey: "lastSoldDate",
            header: "Ngày bán cuối",
            cell: ({ row })=>{
                if (!row.lastSoldDate) return '-';
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDateForDisplay"])(row.lastSoldDate);
            },
            meta: {
                displayName: "Ngày bán cuối"
            }
        },
        {
            id: "viewCount",
            accessorKey: "viewCount",
            header: "Lượt xem",
            cell: ({ row })=>row.viewCount ?? '-',
            meta: {
                displayName: "Lượt xem"
            }
        },
        // ═══════════════════════════════════════════════════════════════
        // LIFECYCLE - Vòng đời sản phẩm
        // ═══════════════════════════════════════════════════════════════
        {
            id: "launchedDate",
            accessorKey: "launchedDate",
            header: "Ngày ra mắt",
            cell: ({ row })=>{
                if (!row.launchedDate) return '-';
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDateForDisplay"])(row.launchedDate);
            },
            meta: {
                displayName: "Ngày ra mắt"
            }
        },
        {
            id: "discontinuedDate",
            accessorKey: "discontinuedDate",
            header: "Ngày ngừng KD",
            cell: ({ row })=>{
                if (!row.discontinuedDate) return '-';
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDateForDisplay"])(row.discontinuedDate);
            },
            meta: {
                displayName: "Ngày ngừng KD"
            }
        },
        // ═══════════════════════════════════════════════════════════════
        // TRENDTECH - Website Trendtech
        // ═══════════════════════════════════════════════════════════════
        {
            id: "trendtechId",
            accessorKey: "trendtechId",
            header: "ID Trendtech",
            cell: ({ row })=>{
                if (onFieldUpdate) {
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        onClick: (e)=>e.stopPropagation(),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$inline$2d$editable$2d$cell$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["InlineEditableNumberCell"], {
                            value: row.trendtechId || 0,
                            onSave: (newValue)=>onFieldUpdate(row, 'trendtechId', newValue)
                        }, void 0, false, {
                            fileName: "[project]/features/products/columns.tsx",
                            lineNumber: 922,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/features/products/columns.tsx",
                        lineNumber: 921,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0));
                }
                return row.trendtechId || '-';
            },
            meta: {
                displayName: "ID Trendtech"
            }
        },
        // SEO Trendtech Score
        {
            id: "seoTrendtech",
            accessorKey: "seoTrendtech",
            header: "SEO Trendtech",
            cell: ({ row })=>{
                const score = calculateSeoScore(row.seoTrendtech);
                return getSeoStatusBadge(score);
            },
            size: 100,
            meta: {
                displayName: "SEO Trendtech",
                group: "SEO"
            }
        },
        {
            id: "trendtechSlug",
            accessorKey: "trendtechSlug",
            header: "Slug Trendtech",
            cell: ({ row })=>row.trendtechSlug || '-',
            meta: {
                displayName: "Slug Trendtech"
            }
        },
        // ═══════════════════════════════════════════════════════════════
        // THÔNG TIN HỆ THỐNG - Người tạo, cập nhật
        // ═══════════════════════════════════════════════════════════════
        {
            id: "updatedAt",
            accessorKey: "updatedAt",
            header: "Cập nhật lần cuối",
            cell: ({ row })=>formatDateTime(row.updatedAt),
            meta: {
                displayName: "Cập nhật lần cuối"
            }
        },
        {
            id: "createdBy",
            accessorKey: "createdBy",
            header: "Người tạo",
            cell: ({ row })=>{
                const employeeId = row.createdBy;
                if (!employeeId) return '-';
                const employee = employeeStore.findById(employeeId);
                return employee ? employee.fullName : '-';
            },
            meta: {
                displayName: "Người tạo"
            }
        },
        {
            id: "updatedBy",
            accessorKey: "updatedBy",
            header: "Người cập nhật",
            cell: ({ row })=>{
                const employeeId = row.updatedBy;
                if (!employeeId) return '-';
                const employee = employeeStore.findById(employeeId);
                return employee ? employee.fullName : '-';
            },
            meta: {
                displayName: "Người cập nhật"
            }
        },
        // ═══════════════════════════════════════════════════════════════
        // CỘT PKGX - Riêng cho đồng bộ PKGX
        // ═══════════════════════════════════════════════════════════════
        {
            id: "pkgxActions",
            header: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center",
                    children: "PKGX"
                }, void 0, false, {
                    fileName: "[project]/features/products/columns.tsx",
                    lineNumber: 991,
                    columnNumber: 21
                }, ("TURBOPACK compile-time value", void 0)),
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$pkgx$2d$product$2d$actions$2d$cell$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PkgxProductActionsCell"], {
                    product: row,
                    onPkgxPublish: onPkgxPublish,
                    onPkgxLink: onPkgxLink,
                    onPkgxUnlink: onPkgxUnlink,
                    onPkgxSyncImages: onPkgxSyncImages
                }, void 0, false, {
                    fileName: "[project]/features/products/columns.tsx",
                    lineNumber: 993,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
            meta: {
                displayName: "PKGX",
                sticky: "right"
            },
            size: 70
        },
        // ═══════════════════════════════════════════════════════════════
        // CỘT HÀNH ĐỘNG - Các thao tác chung
        // ═══════════════════════════════════════════════════════════════
        {
            id: "actions",
            header: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center",
                    children: "Hành động"
                }, void 0, false, {
                    fileName: "[project]/features/products/columns.tsx",
                    lineNumber: 1012,
                    columnNumber: 21
                }, ("TURBOPACK compile-time value", void 0)),
            cell: ({ row })=>{
                // ✅ Show restore button for deleted items
                if (row.deletedAt) {
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-center",
                        onClick: (e)=>e.stopPropagation(),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "ghost",
                            size: "sm",
                            onClick: (e)=>{
                                e.stopPropagation();
                                onRestore(row.systemId);
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__["RotateCcw"], {
                                    className: "mr-2 h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/features/products/columns.tsx",
                                    lineNumber: 1023,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)),
                                "Khôi phục"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/products/columns.tsx",
                            lineNumber: 1018,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/features/products/columns.tsx",
                        lineNumber: 1017,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0));
                }
                // ✅ Show edit/delete for active items
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-center",
                    onClick: (e)=>e.stopPropagation(),
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenu"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                                asChild: true,
                                onClick: (e)=>e.stopPropagation(),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "ghost",
                                    className: "h-8 w-8 p-0",
                                    onClick: (e)=>e.stopPropagation(),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "sr-only",
                                            children: "Mở menu"
                                        }, void 0, false, {
                                            fileName: "[project]/features/products/columns.tsx",
                                            lineNumber: 1036,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__["MoreHorizontal"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/features/products/columns.tsx",
                                            lineNumber: 1037,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/products/columns.tsx",
                                    lineNumber: 1035,
                                    columnNumber: 19
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/features/products/columns.tsx",
                                lineNumber: 1034,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                                align: "end",
                                onClick: (e)=>e.stopPropagation(),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                        onSelect: ()=>router.push(`/products/${row.systemId}/edit`),
                                        children: "Sửa"
                                    }, void 0, false, {
                                        fileName: "[project]/features/products/columns.tsx",
                                        lineNumber: 1041,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    onPrintLabel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                        onSelect: ()=>onPrintLabel(row),
                                        children: "In tem phụ"
                                    }, void 0, false, {
                                        fileName: "[project]/features/products/columns.tsx",
                                        lineNumber: 1045,
                                        columnNumber: 21
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                                        fileName: "[project]/features/products/columns.tsx",
                                        lineNumber: 1049,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                        className: "text-destructive",
                                        onSelect: ()=>onDelete(row.systemId),
                                        children: "Chuyển vào thùng rác"
                                    }, void 0, false, {
                                        fileName: "[project]/features/products/columns.tsx",
                                        lineNumber: 1050,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/products/columns.tsx",
                                lineNumber: 1040,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/products/columns.tsx",
                        lineNumber: 1033,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/features/products/columns.tsx",
                    lineNumber: 1032,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0));
            },
            meta: {
                displayName: "Hành động",
                sticky: "right"
            },
            size: 90
        },
        // ═══════════════════════════════════════════════════════════════
        // DYNAMIC PRICE COLUMNS - Tự động tạo cột cho mỗi bảng giá
        // ═══════════════════════════════════════════════════════════════
        ...activePricingPolicies.map((policy)=>({
                id: `price_${policy.systemId}`,
                header: `Giá: ${policy.name}`,
                cell: ({ row })=>{
                    const price = row.prices?.[policy.systemId];
                    if (onFieldUpdate) {
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            onClick: (e)=>e.stopPropagation(),
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$inline$2d$editable$2d$cell$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["InlineEditableNumberCell"], {
                                value: price || 0,
                                onSave: (newValue)=>onFieldUpdate(row, `prices.${policy.systemId}`, newValue)
                            }, void 0, false, {
                                fileName: "[project]/features/products/columns.tsx",
                                lineNumber: 1075,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/features/products/columns.tsx",
                            lineNumber: 1074,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0));
                    }
                    return formatCurrency(price);
                },
                meta: {
                    displayName: `Giá: ${policy.name}`
                }
            }))
    ];
};
}),
"[project]/features/products/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useProductStore",
    ()=>useProductStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/fuse.js/dist/fuse.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/activity-history-helper.ts [app-ssr] (ecmascript)");
;
;
;
;
;
const baseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createCrudStore"])([], 'products', {
    businessIdField: 'id',
    getCurrentUser: __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserSystemId"],
    apiEndpoint: '/api/products'
});
// ✅ API Sync helpers
const API_ENDPOINT = '/api/products';
const syncToApi = {
    create: async (product)=>{
        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(product)
            });
            if (!response.ok) console.warn('[Product API] Create sync failed');
            else console.log('[Product API] Created:', product.systemId);
        } catch (e) {
            console.warn('[Product API] Create sync error:', e);
        }
    },
    update: async (systemId, updates)=>{
        try {
            const response = await fetch(`${API_ENDPOINT}/${systemId}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updates)
            });
            if (!response.ok) console.warn('[Product API] Update sync failed');
            else console.log('[Product API] Updated:', systemId);
        } catch (e) {
            console.warn('[Product API] Update sync error:', e);
        }
    },
    delete: async (systemId, hard = false)=>{
        try {
            const response = await fetch(`${API_ENDPOINT}/${systemId}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    hard
                })
            });
            if (!response.ok) console.warn('[Product API] Delete sync failed');
            else console.log('[Product API] Deleted:', systemId);
        } catch (e) {
            console.warn('[Product API] Delete sync error:', e);
        }
    },
    restore: async (systemId)=>{
        try {
            const response = await fetch(`${API_ENDPOINT}/${systemId}/restore`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) console.warn('[Product API] Restore sync failed');
            else console.log('[Product API] Restored:', systemId);
        } catch (e) {
            console.warn('[Product API] Restore sync error:', e);
        }
    }
};
// ✅ Wrap base store methods with API sync
const originalAdd = baseStore.getState().add;
const originalUpdate = baseStore.getState().update;
const originalRemove = baseStore.getState().remove;
const originalHardDelete = baseStore.getState().hardDelete;
const originalRestore = baseStore.getState().restore;
baseStore.setState({
    add: (item)=>{
        const result = originalAdd(item);
        syncToApi.create(result);
        return result;
    },
    update: (systemId, updates)=>{
        originalUpdate(systemId, updates);
        syncToApi.update(systemId, updates);
    },
    remove: (systemId)=>{
        originalRemove(systemId);
        syncToApi.delete(systemId, false);
    },
    hardDelete: (systemId)=>{
        originalHardDelete(systemId);
        syncToApi.delete(systemId, true);
    },
    restore: (systemId)=>{
        originalRestore(systemId);
        syncToApi.restore(systemId);
    }
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
"[project]/features/products/product-importer.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FALLBACK_INVENTORY_KEYS",
    ()=>FALLBACK_INVENTORY_KEYS,
    "INVENTORY_FIELD_PREFIXES",
    ()=>INVENTORY_FIELD_PREFIXES,
    "normalizeFieldKey",
    ()=>normalizeFieldKey,
    "transformImportedRows",
    ()=>transformImportedRows
]);
const INVENTORY_FIELD_PREFIXES = [
    'inventory',
    'tonkho',
    'stock'
];
const FALLBACK_INVENTORY_KEYS = [
    'inventory',
    'tonkho',
    'stock',
    'qty',
    'quantity',
    'soluong',
    'tongton',
    'totalsoluong'
];
function normalizeFieldKey(value) {
    if (value === undefined || value === null) return '';
    return value.toString().normalize('NFD').replace(/[\u0300-\u036f]/gu, '').toLowerCase().replace(/[^a-z0-9]/g, '');
}
function buildNormalizedRowKeyMap(row) {
    return Object.keys(row).reduce((acc, key)=>{
        const normalizedKey = normalizeFieldKey(key);
        if (normalizedKey && !(normalizedKey in acc)) {
            acc[normalizedKey] = key;
        }
        return acc;
    }, {});
}
function parseNumericValue(value) {
    if (value === null || value === undefined || value === '') return null;
    if (typeof value === 'number' && !Number.isNaN(value)) return value;
    if (typeof value === 'string') {
        const sanitized = value.replace(/\s+/g, '').replace(/,/g, '').replace(/[^0-9.-]/g, '');
        if (!sanitized) return null;
        const parsed = Number(sanitized);
        return Number.isNaN(parsed) ? null : parsed;
    }
    return null;
}
function findMatchingKeyForIdentifier(normalizedRowKeyMap, identifier) {
    if (!identifier) return null;
    if (normalizedRowKeyMap[identifier]) {
        return normalizedRowKeyMap[identifier];
    }
    for (const prefix of INVENTORY_FIELD_PREFIXES){
        const prefixed = normalizedRowKeyMap[`${prefix}${identifier}`];
        if (prefixed) return prefixed;
    }
    const fallback = Object.entries(normalizedRowKeyMap).find(([normalizedKey])=>normalizedKey.endsWith(identifier) || normalizedKey.startsWith(identifier));
    return fallback?.[1] ?? null;
}
function getBranchInventoryValue(row, normalizedRowKeyMap, identifiers) {
    for (const identifier of identifiers){
        const originalKey = findMatchingKeyForIdentifier(normalizedRowKeyMap, identifier);
        if (originalKey) {
            const parsed = parseNumericValue(row[originalKey]);
            if (parsed !== null) {
                return parsed;
            }
        }
    }
    return 0;
}
function getFallbackInventoryValue(row, normalizedRowKeyMap) {
    for (const key of FALLBACK_INVENTORY_KEYS){
        const originalKey = normalizedRowKeyMap[key];
        if (!originalKey) continue;
        const parsed = parseNumericValue(row[originalKey]);
        if (parsed !== null) {
            return parsed;
        }
    }
    return null;
}
function transformImportedRows(rows, options) {
    return rows.map((item, index)=>{
        if (!item.name) {
            throw new Error(`Dòng ${index + 1} thiếu tên sản phẩm`);
        }
        const normalizedRowKeyMap = buildNormalizedRowKeyMap(item);
        const inventoryByBranch = {};
        options.branchIdentifiers.forEach(({ systemId, identifiers })=>{
            inventoryByBranch[systemId] = getBranchInventoryValue(item, normalizedRowKeyMap, identifiers);
        });
        const totalBranchInventory = Object.values(inventoryByBranch).reduce((sum, qty)=>sum + (Number(qty) || 0), 0);
        const fallbackInventory = getFallbackInventoryValue(item, normalizedRowKeyMap);
        if (fallbackInventory !== null && totalBranchInventory === 0 && options.defaultBranchSystemId) {
            inventoryByBranch[options.defaultBranchSystemId] = fallbackInventory;
        }
        return {
            id: item.id || item.sku || '',
            name: item.name,
            sku: item.sku || '',
            type: item.type || 'physical',
            status: item.status || 'active',
            unit: item.unit || '',
            defaultPrice: Number(item.defaultPrice) || 0,
            costPrice: Number(item.costPrice) || 0,
            inventory: Number(item.inventory) || 0,
            inventoryByBranch,
            committedByBranch: {},
            inTransitByBranch: {},
            inventoryWarning: Number(item.inventoryWarning) || 0,
            categorySystemId: item.categorySystemId || '',
            description: item.description || '',
            prices: {},
            isDeleted: false,
            createdAt: new Date().toISOString(),
            createdBy: options.currentEmployeeSystemId,
            updatedAt: new Date().toISOString(),
            updatedBy: options.currentEmployeeSystemId
        };
    });
}
}),
"[project]/features/products/components/pkgx-link-dialog.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PkgxLinkDialog",
    ()=>PkgxLinkDialog
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Link2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/link-2.js [app-ssr] (ecmascript) <export default as Link2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dialog.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$virtualized$2d$combobox$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/virtualized-combobox.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$hooks$2f$use$2d$all$2d$products$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/products/hooks/use-all-products.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$hooks$2f$use$2d$products$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/products/hooks/use-products.ts [app-ssr] (ecmascript)");
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
;
;
function PkgxLinkDialog({ open, onOpenChange, product, onSuccess }) {
    const { update: updateProductMutation } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$hooks$2f$use$2d$products$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductMutations"])();
    const pkgxSettingsStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePkgxSettingsStore"])();
    const cachedPkgxProducts = pkgxSettingsStore.settings.pkgxProducts;
    const setPkgxProducts = pkgxSettingsStore.setPkgxProducts;
    const [selectedPkgxProduct, setSelectedPkgxProduct] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](null);
    const [pkgxProducts, setPkgxProductsLocal] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]([]);
    const [isLoading, setIsLoading] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](false);
    const [isSyncing, setIsSyncing] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](false);
    const [hasFetched, setHasFetched] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](false);
    // Load PKGX products khi mở dialog - chỉ chạy 1 lần
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        if (open && !hasFetched) {
            if (cachedPkgxProducts && cachedPkgxProducts.length > 0) {
                setPkgxProductsLocal(cachedPkgxProducts);
                setHasFetched(true);
            } else {
                loadPkgxProducts();
            }
        }
    }, [
        open,
        hasFetched,
        cachedPkgxProducts
    ]);
    // Reset state khi đóng dialog
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        if (!open) {
            setSelectedPkgxProduct(null);
        }
    }, [
        open
    ]);
    const loadPkgxProducts = async ()=>{
        setIsLoading(true);
        try {
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getProducts"])(1, 1000);
            if (response.success && response.data && response.data.data) {
                // API trả về { data: PkgxProduct[], pagination: {...} }
                const productsArray = Array.isArray(response.data.data) ? response.data.data : [];
                setPkgxProductsLocal(productsArray);
                setPkgxProducts(productsArray); // Lưu vào store để dùng chung
                setHasFetched(true);
            }
        } catch (error) {
            console.error('Failed to load PKGX products:', error);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Không thể tải danh sách sản phẩm PKGX');
        } finally{
            setIsLoading(false);
        }
    };
    // Filter out products that are already linked
    const { data: hrmProducts } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$hooks$2f$use$2d$all$2d$products$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAllProducts"])();
    const linkedPkgxIds = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        return new Set(hrmProducts.filter((p)=>p.pkgxId).map((p)=>p.pkgxId));
    }, [
        hrmProducts
    ]);
    // Convert PKGX products to combobox options
    const pkgxOptions = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        return pkgxProducts.filter((p)=>!linkedPkgxIds.has(p.goods_id)) // Exclude already linked
        .map((p)=>({
                value: String(p.goods_id),
                label: p.goods_name,
                subtitle: `ID: ${p.goods_id} | Mã: ${p.goods_sn || '-'}`,
                metadata: p
            }));
    }, [
        pkgxProducts,
        linkedPkgxIds
    ]);
    const handleConfirmLink = async ()=>{
        if (!product || !selectedPkgxProduct) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Vui lòng chọn sản phẩm PKGX để liên kết');
            return;
        }
        setIsSyncing(true);
        try {
            const pkgxId = Number(selectedPkgxProduct.value);
            // Update HRM product with pkgxId
            updateProductMutation.mutate({
                systemId: product.systemId,
                pkgxId
            }, {
                onSuccess: ()=>{
                    // Log to console
                    console.log('[PKGX Link]', {
                        action: 'link_product',
                        status: 'success',
                        productId: product.systemId,
                        pkgxId,
                        pkgxProductName: selectedPkgxProduct.label
                    });
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success(`Đã liên kết với sản phẩm PKGX: ${selectedPkgxProduct.label}`);
                    onSuccess?.(pkgxId);
                    onOpenChange(false);
                },
                onError: (error)=>{
                    console.error('[PKGX Link Error]', error);
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Lỗi khi liên kết sản phẩm');
                },
                onSettled: ()=>{
                    setIsSyncing(false);
                }
            });
        } catch (error) {
            console.error('[PKGX Link Error]', error);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Lỗi khi liên kết sản phẩm');
            setIsSyncing(false);
        }
    };
    if (!product) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Dialog"], {
        open: open,
        onOpenChange: onOpenChange,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogContent"], {
            className: "sm:max-w-[500px]",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogHeader"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogTitle"], {
                            children: "Liên kết với sản phẩm PKGX"
                        }, void 0, false, {
                            fileName: "[project]/features/products/components/pkgx-link-dialog.tsx",
                            lineNumber: 151,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogDescription"], {
                            children: "Chọn sản phẩm PKGX để liên kết với sản phẩm HRM này"
                        }, void 0, false, {
                            fileName: "[project]/features/products/components/pkgx-link-dialog.tsx",
                            lineNumber: 152,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/products/components/pkgx-link-dialog.tsx",
                    lineNumber: 150,
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
                                    children: "Sản phẩm HRM:"
                                }, void 0, false, {
                                    fileName: "[project]/features/products/components/pkgx-link-dialog.tsx",
                                    lineNumber: 160,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm",
                                    children: product.name
                                }, void 0, false, {
                                    fileName: "[project]/features/products/components/pkgx-link-dialog.tsx",
                                    lineNumber: 161,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-muted-foreground",
                                    children: [
                                        "Mã: ",
                                        product.id,
                                        " | SystemID: ",
                                        product.systemId
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/products/components/pkgx-link-dialog.tsx",
                                    lineNumber: 162,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/products/components/pkgx-link-dialog.tsx",
                            lineNumber: 159,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "text-sm font-medium",
                                    children: "Chọn sản phẩm PKGX"
                                }, void 0, false, {
                                    fileName: "[project]/features/products/components/pkgx-link-dialog.tsx",
                                    lineNumber: 169,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$virtualized$2d$combobox$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VirtualizedCombobox"], {
                                    value: selectedPkgxProduct,
                                    onChange: setSelectedPkgxProduct,
                                    options: pkgxOptions,
                                    placeholder: "Tìm và chọn sản phẩm PKGX...",
                                    searchPlaceholder: "Tìm theo tên hoặc mã...",
                                    emptyPlaceholder: isLoading ? 'Đang tải...' : 'Không tìm thấy sản phẩm PKGX',
                                    isLoading: isLoading,
                                    disabled: isLoading
                                }, void 0, false, {
                                    fileName: "[project]/features/products/components/pkgx-link-dialog.tsx",
                                    lineNumber: 170,
                                    columnNumber: 13
                                }, this),
                                pkgxOptions.length === 0 && !isLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-muted-foreground",
                                    children: "Tất cả sản phẩm PKGX đã được liên kết. Hãy đồng bộ danh sách mới từ PKGX."
                                }, void 0, false, {
                                    fileName: "[project]/features/products/components/pkgx-link-dialog.tsx",
                                    lineNumber: 181,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/products/components/pkgx-link-dialog.tsx",
                            lineNumber: 168,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/products/components/pkgx-link-dialog.tsx",
                    lineNumber: 157,
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
                            fileName: "[project]/features/products/components/pkgx-link-dialog.tsx",
                            lineNumber: 189,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                            onClick: handleConfirmLink,
                            disabled: !selectedPkgxProduct || isSyncing,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Link2$3e$__["Link2"], {
                                    className: "h-4 w-4 mr-2"
                                }, void 0, false, {
                                    fileName: "[project]/features/products/components/pkgx-link-dialog.tsx",
                                    lineNumber: 200,
                                    columnNumber: 13
                                }, this),
                                isSyncing ? 'Đang liên kết...' : 'Liên kết'
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/products/components/pkgx-link-dialog.tsx",
                            lineNumber: 196,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/products/components/pkgx-link-dialog.tsx",
                    lineNumber: 188,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/features/products/components/pkgx-link-dialog.tsx",
            lineNumber: 149,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/features/products/components/pkgx-link-dialog.tsx",
        lineNumber: 148,
        columnNumber: 5
    }, this);
}
}),
"[project]/features/products/product-service.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_PRODUCT_SORT",
    ()=>DEFAULT_PRODUCT_SORT,
    "fetchProductsPage",
    ()=>fetchProductsPage,
    "getFilteredProductsSnapshot",
    ()=>getFilteredProductsSnapshot,
    "getInitialProductsPage",
    ()=>getInitialProductsPage,
    "invalidateFuseCache",
    ()=>invalidateFuseCache
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/fuse.js/dist/fuse.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/products/store.ts [app-ssr] (ecmascript)");
;
;
;
const DEFAULT_PRODUCT_SORT = {
    id: 'createdAt',
    desc: true
};
const fuseOptions = {
    keys: [
        'name',
        'id',
        'barcode',
        'tags'
    ],
    threshold: 0.3
};
// ========================================
// Cached Fuse index for better performance
// ========================================
let cachedFuseIndex = null;
let cachedProductsLength = 0;
let cachedProductsHash = '';
function getProductsHash(products) {
    // Simple hash based on first/last product IDs and length
    if (products.length === 0) return 'empty';
    return `${products.length}-${products[0]?.systemId}-${products[products.length - 1]?.systemId}`;
}
function getFuseIndex(products) {
    const hash = getProductsHash(products);
    if (cachedFuseIndex && cachedProductsHash === hash) {
        return cachedFuseIndex;
    }
    // Rebuild index only when products change
    cachedFuseIndex = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"](products, fuseOptions);
    cachedProductsHash = hash;
    cachedProductsLength = products.length;
    return cachedFuseIndex;
}
function invalidateFuseCache() {
    cachedFuseIndex = null;
    cachedProductsHash = '';
    cachedProductsLength = 0;
}
function applyFilters(products, params) {
    const { search, statusFilter, typeFilter, categoryFilter, comboFilter, stockLevelFilter, pkgxFilter, dateRange, sorting } = params;
    let dataset = products.filter((product)=>!product.isDeleted);
    if (statusFilter !== 'all') {
        dataset = dataset.filter((product)=>product.status === statusFilter);
    }
    if (typeFilter !== 'all') {
        dataset = dataset.filter((product)=>product.type === typeFilter);
    }
    if (categoryFilter !== 'all') {
        dataset = dataset.filter((product)=>product.categorySystemId === categoryFilter);
    }
    // Combo filter
    if (comboFilter === 'combo') {
        dataset = dataset.filter((product)=>product.type === 'combo');
    } else if (comboFilter === 'non-combo') {
        dataset = dataset.filter((product)=>product.type !== 'combo');
    }
    // Stock level filter
    if (stockLevelFilter !== 'all') {
        dataset = dataset.filter((product)=>{
            // Calculate total inventory across all branches
            const totalInventory = Object.values(product.inventoryByBranch || {}).reduce((sum, qty)=>sum + qty, 0);
            switch(stockLevelFilter){
                case 'out-of-stock':
                    return totalInventory <= 0;
                case 'low-stock':
                    // Low stock: above 0 but at or below reorder level
                    return totalInventory > 0 && product.reorderLevel !== undefined && totalInventory <= product.reorderLevel;
                case 'below-safety':
                    // Below safety stock
                    return product.safetyStock !== undefined && totalInventory < product.safetyStock;
                case 'high-stock':
                    // High stock: above max stock level
                    return product.maxStock !== undefined && totalInventory > product.maxStock;
                default:
                    return true;
            }
        });
    }
    // PKGX link filter
    if (pkgxFilter === 'linked') {
        dataset = dataset.filter((product)=>!!product.pkgxId);
    } else if (pkgxFilter === 'not-linked') {
        dataset = dataset.filter((product)=>!product.pkgxId);
    }
    if (dateRange && (dateRange[0] || dateRange[1])) {
        dataset = dataset.filter((product)=>{
            if (!product.createdAt) return false;
            const createdDate = new Date(product.createdAt);
            const fromDate = dateRange[0] ? new Date(dateRange[0]) : null;
            const toDate = dateRange[1] ? new Date(dateRange[1]) : null;
            if (fromDate && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isDateBefore"])(createdDate, fromDate)) return false;
            if (toDate && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isDateAfter"])(createdDate, toDate)) return false;
            return true;
        });
    }
    if (search.trim()) {
        // Use cached Fuse index for better performance
        const fuse = getFuseIndex(dataset);
        dataset = fuse.search(search.trim()).map((result)=>result.item);
    }
    const sorted = [
        ...dataset
    ].sort((a, b)=>{
        const valueA = getSortValue(a, sorting.id);
        const valueB = getSortValue(b, sorting.id);
        if (valueA < valueB) return sorting.desc ? 1 : -1;
        if (valueA > valueB) return sorting.desc ? -1 : 1;
        return 0;
    });
    return {
        filtered: sorted
    };
}
function getSortValue(product, sorter) {
    switch(sorter){
        case 'createdAt':
            return product.createdAt ? new Date(product.createdAt).getTime() : 0;
        case 'status':
            return product.status ?? '';
        case 'type':
            return product.type ?? '';
        case 'id':
            return product.id ?? '';
        case 'name':
        default:
            return product.name ?? '';
    }
}
async function fetchProductsPage(params) {
    const { data } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState();
    const { filtered } = applyFilters(data, params);
    const { pageIndex, pageSize } = params.pagination;
    const start = pageIndex * pageSize;
    const end = start + pageSize;
    const pagedItems = filtered.slice(start, end);
    // Small delay to simulate async behavior and prevent UI blocking
    await new Promise((resolve)=>setTimeout(resolve, 10));
    return {
        items: pagedItems,
        total: filtered.length,
        pageCount: Math.max(1, Math.ceil(filtered.length / pageSize)),
        pageIndex
    };
}
function getInitialProductsPage(params) {
    const { data } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState();
    const { filtered } = applyFilters(data, params);
    const { pageIndex, pageSize } = params.pagination;
    const start = pageIndex * pageSize;
    const end = start + pageSize;
    const pagedItems = filtered.slice(start, end);
    return {
        items: pagedItems,
        total: filtered.length,
        pageCount: Math.max(1, Math.ceil(filtered.length / pageSize)),
        pageIndex
    };
}
function getFilteredProductsSnapshot(params) {
    const { data } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState();
    const { filtered } = applyFilters(data, params);
    return filtered;
}
}),
"[project]/features/products/hooks/use-products-query.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useProductsQuery",
    ()=>useProductsQuery
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/query-core/build/modern/utils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$product$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/products/product-service.ts [app-ssr] (ecmascript)");
;
;
function useProductsQuery(params) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'products',
            params
        ],
        queryFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$product$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchProductsPage"])(params),
        staleTime: 30_000,
        placeholderData: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["keepPreviousData"],
        initialData: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$product$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getInitialProductsPage"])(params)
    });
}
}),
"[project]/features/products/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProductsPage",
    ()=>ProductsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$column$2d$visibility$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/use-column-visibility.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$hooks$2f$use$2d$all$2d$products$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/products/hooks/use-all-products.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$hooks$2f$use$2d$products$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/products/hooks/use-products.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$inventory$2f$hooks$2f$use$2d$all$2d$inventory$2d$settings$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/inventory/hooks/use-all-inventory-settings.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$hooks$2f$use$2d$all$2d$branches$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/branches/hooks/use-all-branches.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pricing$2f$hooks$2f$use$2d$all$2d$pricing$2d$policies$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/features/settings/pricing/hooks/use-all-pricing-policies.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$hooks$2f$use$2d$pkgx$2d$bulk$2d$sync$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/hooks/use-pkgx-bulk-sync.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$components$2f$pkgx$2d$bulk$2d$sync$2d$confirm$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/components/pkgx-bulk-sync-confirm-dialog.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/pkgx/api-service.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$hooks$2f$use$2d$pkgx$2d$sync$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/products/hooks/use-pkgx-sync.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$columns$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/products/columns.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$print$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/use-print.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2f$product$2d$print$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/print/product-print-helper.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$product$2d$label$2e$mapper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-mappers/product-label.mapper.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$store$2d$info$2f$store$2d$info$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/store-info/store-info-store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$responsive$2d$data$2d$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/data-table/responsive-data-table.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$generic$2d$import$2d$dialog$2d$v2$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/shared/generic-import-dialog-v2.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$generic$2d$export$2d$dialog$2d$v2$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/shared/generic-export-dialog-v2.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$export$2f$configs$2f$product$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/import-export/configs/product.config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$date$2d$filter$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/data-table/data-table-date-filter.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$page$2d$filters$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/layout/page-filters.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$page$2d$toolbar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/layout/page-toolbar.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$product$2d$importer$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/products/product-importer.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/alert-dialog.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PlusCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-plus.js [app-ssr] (ecmascript) <export default as PlusCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$components$2f$pkgx$2d$link$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/products/components/pkgx-link-dialog.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$hooks$2f$use$2d$products$2d$query$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/products/hooks/use-products-query.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$product$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/products/product-service.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$page$2d$header$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/page-header-context.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$column$2d$toggle$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/data-table/data-table-column-toggle.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/badge.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/avatar.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$media$2d$query$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/use-media-query.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dropdown-menu.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/select.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sheet$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/sheet.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis-vertical.js [app-ssr] (ecmascript) <export default as MoreVertical>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/package.js [app-ssr] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings-2.js [app-ssr] (ecmascript) <export default as Settings2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sliders-horizontal.js [app-ssr] (ecmascript) <export default as SlidersHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$columns$2d$3$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Columns3$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/columns-3.js [app-ssr] (ecmascript) <export default as Columns3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layers.js [app-ssr] (ecmascript) <export default as Layers>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-ssr] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-ssr] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/dollar-sign.js [app-ssr] (ecmascript) <export default as DollarSign>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2d$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PackageSearch$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/package-search.js [app-ssr] (ecmascript) <export default as PackageSearch>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-ssr] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flag$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Flag$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/flag.js [app-ssr] (ecmascript) <export default as Flag>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/image.js [app-ssr] (ecmascript) <export default as Image>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/external-link.js [app-ssr] (ecmascript) <export default as ExternalLink>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$unlink$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Unlink$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/unlink.js [app-ssr] (ecmascript) <export default as Unlink>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/printer.js [app-ssr] (ecmascript) <export default as Printer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-ssr] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/play.js [app-ssr] (ecmascript) <export default as Play>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$stop$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__StopCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-stop.js [app-ssr] (ecmascript) <export default as StopCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-up.js [app-ssr] (ecmascript) <export default as FileUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.js [app-ssr] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-ssr] (ecmascript)");
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
const TABLE_STATE_STORAGE_KEY = 'products-table-state';
const MOBILE_ROW_HEIGHT = 190;
const MOBILE_LIST_HEIGHT = 520;
const defaultTableState = {
    search: '',
    statusFilter: 'all',
    typeFilter: 'all',
    categoryFilter: 'all',
    comboFilter: 'all',
    stockLevelFilter: 'all',
    pkgxFilter: 'all',
    dateRange: undefined,
    pagination: {
        pageIndex: 0,
        pageSize: 20
    },
    sorting: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$product$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_PRODUCT_SORT"]
};
function resolveStateAction(current, action) {
    return typeof action === 'function' ? action(current) : action;
}
function ProductsPage() {
    const isMobile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$media$2d$query$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMediaQuery"])("(max-width: 768px)");
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const { data: productsRaw } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$hooks$2f$use$2d$all$2d$products$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAllProducts"])();
    const { remove, update, create } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$hooks$2f$use$2d$products$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductMutations"])();
    const { data: categories } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$inventory$2f$hooks$2f$use$2d$all$2d$inventory$2d$settings$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAllProductCategories"])();
    const { data: brands } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$inventory$2f$hooks$2f$use$2d$all$2d$inventory$2d$settings$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAllBrands"])();
    const activeCategories = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>categories.filter((category)=>!category.isDeleted && category.isActive !== false), [
        categories
    ]);
    const { data: branches } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$hooks$2f$use$2d$all$2d$branches$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAllBranches"])();
    const { employee: authEmployee } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    // Helpers for finding category/brand by ID
    const findCategoryById = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((systemId)=>{
        if (!systemId) return undefined;
        return categories.find((c)=>c.systemId === systemId);
    }, [
        categories
    ]);
    const findBrandById = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((systemId)=>{
        if (!systemId) return undefined;
        return brands.find((b)=>b.systemId === systemId);
    }, [
        brands
    ]);
    const defaultBranchSystemId = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        return branches.find((branch)=>branch.isDefault)?.systemId ?? branches[0]?.systemId ?? null;
    }, [
        branches
    ]);
    const branchInventoryIdentifiers = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        return branches.map((branch)=>({
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(branch.systemId),
                identifiers: new Set([
                    branch.systemId,
                    branch.id,
                    branch.name
                ].map((value)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$product$2d$importer$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeFieldKey"])(value)).filter(Boolean))
            }));
    }, [
        branches
    ]);
    // ✅ Memoize products để tránh unstable reference
    const products = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>productsRaw, [
        productsRaw
    ]);
    // ✅ Get deleted count - filter deleted products
    const deletedCount = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        return products.filter((p)=>p.isDeleted).length;
    }, [
        products
    ]);
    const [rowSelection, setRowSelection] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]({});
    const [isAlertOpen, setIsAlertOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](false);
    const [idToDelete, setIdToDelete] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](null);
    const [isFilterSheetOpen, setFilterSheetOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](false);
    const [isActionsSheetOpen, setActionsSheetOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](false);
    // ✅ Memoize headerActions để tránh infinite loop
    const headerActions = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        const actions = [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                variant: "outline",
                size: "sm",
                className: "h-9",
                onClick: ()=>router.push('/products/trash'),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                        className: "mr-2 h-4 w-4"
                    }, void 0, false, {
                        fileName: "[project]/features/products/page.tsx",
                        lineNumber: 168,
                        columnNumber: 9
                    }, this),
                    "Thùng rác (",
                    deletedCount,
                    ")"
                ]
            }, "trash", true, {
                fileName: "[project]/features/products/page.tsx",
                lineNumber: 161,
                columnNumber: 7
            }, this)
        ];
        // Chỉ hiện nút Tùy chọn bảng trên Mobile (vì Desktop đã có toolbar)
        if (isMobile) {
            actions.push(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                variant: "ghost",
                size: "sm",
                className: "h-9",
                onClick: ()=>setActionsSheetOpen(true),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$columns$2d$3$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Columns3$3e$__["Columns3"], {
                        className: "mr-2 h-4 w-4"
                    }, void 0, false, {
                        fileName: "[project]/features/products/page.tsx",
                        lineNumber: 183,
                        columnNumber: 11
                    }, this),
                    "Tùy chọn bảng"
                ]
            }, "import", true, {
                fileName: "[project]/features/products/page.tsx",
                lineNumber: 176,
                columnNumber: 9
            }, this));
        }
        actions.push(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenu"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                    asChild: true,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                        size: "sm",
                        className: "h-9",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PlusCircle$3e$__["PlusCircle"], {
                                className: "mr-2 h-4 w-4"
                            }, void 0, false, {
                                fileName: "[project]/features/products/page.tsx",
                                lineNumber: 193,
                                columnNumber: 13
                            }, this),
                            "Thêm sản phẩm"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/products/page.tsx",
                        lineNumber: 192,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/features/products/page.tsx",
                    lineNumber: 191,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                    align: "end",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                            onClick: ()=>router.push('/products/new'),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                                    className: "mr-2 h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/features/products/page.tsx",
                                    lineNumber: 199,
                                    columnNumber: 13
                                }, this),
                                "Thêm sản phẩm đơn"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/products/page.tsx",
                            lineNumber: 198,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                            onClick: ()=>router.push('/products/new?type=combo'),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__["Layers"], {
                                    className: "mr-2 h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/features/products/page.tsx",
                                    lineNumber: 203,
                                    columnNumber: 13
                                }, this),
                                "Thêm Combo"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/products/page.tsx",
                            lineNumber: 202,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/products/page.tsx",
                    lineNumber: 197,
                    columnNumber: 9
                }, this)
            ]
        }, "add-menu", true, {
            fileName: "[project]/features/products/page.tsx",
            lineNumber: 190,
            columnNumber: 7
        }, this));
        return actions;
    }, [
        deletedCount,
        router,
        setActionsSheetOpen,
        isMobile
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$page$2d$header$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePageHeader"])({
        title: 'Danh sách sản phẩm',
        breadcrumb: [
            {
                label: 'Trang chủ',
                href: '/',
                isCurrent: false
            },
            {
                label: 'Sản phẩm',
                href: '/products',
                isCurrent: true
            }
        ],
        actions: headerActions,
        showBackButton: false
    });
    // Table state
    const [columnVisibility, setColumnVisibility] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$column$2d$visibility$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useColumnVisibility"])('products', {});
    const [columnOrder, setColumnOrder] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]([]);
    const [pinnedColumns, setPinnedColumns] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]([]);
    const [tableState, setTableState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(defaultTableState);
    const handleDelete = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((systemId)=>{
        setIdToDelete(systemId);
        setIsAlertOpen(true);
    }, []);
    // ✅ Handle restore cho soft delete
    const handleRestore = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((systemId)=>{
        const product = products.find((p)=>p.systemId === systemId);
        if (product) {
            update.mutate({
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(systemId),
                ...product,
                isDeleted: false
            }, {
                onSuccess: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success('Đã khôi phục sản phẩm')
            });
        }
    }, [
        products,
        update
    ]);
    // Print hook and store info for single product print action in row dropdown
    const { print: printSingleLabel, printMultiple } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$print$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePrint"])();
    const storeInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$store$2d$info$2f$store$2d$info$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStoreInfoStore"])((state)=>state.info);
    const { data: pricingPolicies } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pricing$2f$hooks$2f$use$2d$all$2d$pricing$2d$policies$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useAllPricingPolicies"])();
    const defaultSellingPolicy = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>pricingPolicies.find((p)=>p.type === 'Bán hàng' && p.isDefault), [
        pricingPolicies
    ]);
    const storeSettings = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2f$product$2d$print$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createStoreSettings"])(storeInfo), [
        storeInfo
    ]);
    const handlePrintLabel = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((product)=>{
        const categoryName = product.categorySystemId ? findCategoryById(product.categorySystemId)?.name || product.category : product.category;
        const brandName = product.brandSystemId ? findBrandById(product.brandSystemId)?.name || '' : '';
        const defaultPrice = defaultSellingPolicy ? product.prices?.[defaultSellingPolicy.systemId] : undefined;
        const printData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$product$2d$label$2e$mapper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapProductToLabelPrintData"])(product, storeSettings, {
            category: categoryName,
            brand: brandName,
            price: defaultPrice ?? product.sellingPrice
        });
        printSingleLabel('product-label', {
            data: printData
        });
    }, [
        printSingleLabel,
        storeSettings,
        defaultSellingPolicy
    ]);
    // ===== PKGX Handlers =====
    const { settings: pkgxSettings, addLog: addPkgxLog } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePkgxSettingsStore"])();
    // Use PKGX sync hook for all sync handlers
    const { handlePkgxUpdatePrice, handlePkgxSyncInventory, handlePkgxUpdateSeo, handlePkgxSyncDescription, handlePkgxSyncFlags, handlePkgxSyncBasicInfo, handlePkgxSyncImages, handlePkgxSyncAll } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$hooks$2f$use$2d$pkgx$2d$sync$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePkgxSync"])({
        addPkgxLog
    });
    // Bulk sync hook for PKGX operations
    const { confirmAction: bulkConfirmAction, progress: bulkProgress, triggerBulkSync, executeAction: executeBulkAction, cancelConfirm: cancelBulkConfirm } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$hooks$2f$use$2d$pkgx$2d$bulk$2d$sync$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePkgxBulkSync"])({
        entityType: 'product',
        onLog: addPkgxLog
    });
    // Helper: Build PKGX product payload from HRM product (for Publish)
    const buildPkgxPayload = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((product)=>{
        // Find mapped category
        const categoryMapping = pkgxSettings.categoryMappings.find((m)=>m.hrmCategorySystemId === product.categorySystemId);
        // Find mapped brand
        const brand = findBrandById(product.brandSystemId);
        const brandMapping = brand ? pkgxSettings.brandMappings.find((m)=>m.hrmBrandSystemId === brand.systemId) : undefined;
        // Get price from mapping or default
        const { priceMapping } = pkgxSettings;
        // Shop price (giá bán)
        let shopPrice = product.costPrice || 0;
        if (priceMapping.shopPrice && product.prices[priceMapping.shopPrice]) {
            shopPrice = product.prices[priceMapping.shopPrice];
        } else if (defaultSellingPolicy) {
            shopPrice = product.prices[defaultSellingPolicy.systemId] || shopPrice;
        }
        // Market price (giá thị trường)
        let marketPrice = shopPrice * 1.2; // Default markup
        if (priceMapping.marketPrice && product.prices[priceMapping.marketPrice]) {
            marketPrice = product.prices[priceMapping.marketPrice];
        }
        // Partner price (giá đối tác)
        let partnerPrice;
        if (priceMapping.partnerPrice && product.prices[priceMapping.partnerPrice]) {
            partnerPrice = product.prices[priceMapping.partnerPrice];
        }
        // ACE price (giá ACE)
        let acePrice;
        if (priceMapping.acePrice && product.prices[priceMapping.acePrice]) {
            acePrice = product.prices[priceMapping.acePrice];
        }
        // Deal price (giá khuyến mãi)
        let dealPrice;
        if (priceMapping.dealPrice && product.prices[priceMapping.dealPrice]) {
            dealPrice = product.prices[priceMapping.dealPrice];
        }
        // Calculate total inventory
        const totalInventory = product.inventoryByBranch ? Object.values(product.inventoryByBranch).reduce((sum, qty)=>sum + (qty || 0), 0) : 0;
        // Get PKGX-specific SEO data (ưu tiên seoPkgx, fallback về field gốc)
        const pkgxSeo = product.seoPkgx;
        const payload = {
            // Thông tin cơ bản (giống handlePkgxSyncBasicInfo)
            goods_name: product.name,
            goods_sn: product.id,
            cat_id: categoryMapping?.pkgxCatId || 0,
            brand_id: brandMapping?.pkgxBrandId || 0,
            seller_note: product.sellerNote || '',
            // Giá
            shop_price: shopPrice,
            market_price: marketPrice,
            goods_number: totalInventory,
            // Mô tả (giống handlePkgxSyncDescription)
            goods_desc: pkgxSeo?.longDescription || product.description || '',
            goods_brief: pkgxSeo?.shortDescription || product.shortDescription || '',
            // SEO (giống handlePkgxUpdateSeo)
            keywords: pkgxSeo?.seoKeywords || product.tags?.join(', ') || product.name,
            meta_title: pkgxSeo?.seoTitle || product.ktitle || product.name,
            meta_desc: pkgxSeo?.metaDescription || product.seoDescription || '',
            // Hình ảnh
            original_img: product.thumbnailImage || product.images?.[0] || '',
            gallery_images: product.galleryImages || product.images || [],
            // Flags - mapping đúng theo HRM fields
            // HRM isPublished (Đăng web) -> PKGX is_on_sale
            // HRM isFeatured (Nổi bật) -> PKGX is_best, ishome
            // HRM isBestSeller (Bán chạy) -> PKGX is_hot
            // HRM isNewArrival (Mới về) -> PKGX is_new
            best: product.isFeatured || false,
            hot: product.isBestSeller || false,
            new: product.isNewArrival || false,
            ishome: product.isFeatured || false,
            is_on_sale: product.isPublished ?? product.status === 'active'
        };
        // Add optional prices if mapped
        if (partnerPrice !== undefined) payload.partner_price = partnerPrice;
        if (acePrice !== undefined) payload.ace_price = acePrice;
        if (dealPrice !== undefined) payload.deal_price = dealPrice;
        return payload;
    }, [
        pkgxSettings,
        defaultSellingPolicy
    ]);
    const handlePkgxPublish = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](async (product)=>{
        if (product.pkgxId) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].warning('Sản phẩm đã được đăng lên PKGX');
            return;
        }
        if (!pkgxSettings.enabled) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Tích hợp PKGX chưa được bật. Vui lòng bật trong Cài đặt > Tích hợp PKGX');
            return;
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].loading(`Đang đăng sản phẩm lên PKGX...`, {
            id: 'pkgx-publish'
        });
        try {
            const payload = buildPkgxPayload(product);
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createProduct"])(payload);
            if (response.success && response.data) {
                const goodsId = response.data.goods_id;
                // Save pkgxId to product store - trigger re-render
                update.mutate({
                    systemId: product.systemId,
                    pkgxId: goodsId
                });
                // Update React Query cache trực tiếp (không cần refetch - realtime!)
                // Tìm tất cả queries có prefix 'products' và update item trong cache
                queryClient.setQueriesData({
                    queryKey: [
                        'products'
                    ]
                }, (oldData)=>{
                    if (!oldData) return oldData;
                    return {
                        ...oldData,
                        items: oldData.items.map((item)=>item.systemId === product.systemId ? {
                                ...item,
                                pkgxId: goodsId
                            } : item)
                    };
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success(`Đã đăng sản phẩm lên PKGX! ID: ${goodsId}`, {
                    id: 'pkgx-publish'
                });
                // Add log
                addPkgxLog({
                    action: 'create_product',
                    status: 'success',
                    message: `Đã đăng sản phẩm: ${product.name}`,
                    details: {
                        productId: product.systemId,
                        pkgxId: goodsId,
                        productName: product.name
                    }
                });
            } else {
                throw new Error(response.error);
            }
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(`Lỗi đăng sản phẩm: ${error instanceof Error ? error.message : 'Unknown error'}`, {
                id: 'pkgx-publish'
            });
            addPkgxLog({
                action: 'create_product',
                status: 'error',
                message: `Lỗi đăng sản phẩm: ${product.name}`,
                details: {
                    productId: product.systemId,
                    error: error instanceof Error ? error.message : String(error)
                }
            });
        }
    }, [
        pkgxSettings,
        buildPkgxPayload,
        update,
        addPkgxLog,
        queryClient
    ]);
    // ═══════════════════════════════════════════════════════════════
    // PKGX Link Dialog State
    // ═══════════════════════════════════════════════════════════════
    const [pkgxLinkDialogOpen, setPkgxLinkDialogOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](false);
    const [productToLink, setProductToLink] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](null);
    const handlePkgxLink = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((product)=>{
        setProductToLink(product);
        setPkgxLinkDialogOpen(true);
    }, []);
    const handlePkgxLinkSuccess = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((pkgxId)=>{
        // Update React Query cache trực tiếp (realtime)
        if (productToLink) {
            queryClient.setQueriesData({
                queryKey: [
                    'products'
                ]
            }, (oldData)=>{
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    items: oldData.items.map((item)=>item.systemId === productToLink.systemId ? {
                            ...item,
                            pkgxId
                        } : item)
                };
            });
        }
    }, [
        productToLink,
        queryClient
    ]);
    // Handler hủy liên kết PKGX
    const handlePkgxUnlink = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((product)=>{
        // Update store - xóa pkgxId
        update.mutate({
            systemId: product.systemId,
            pkgxId: undefined
        });
        // Update React Query cache trực tiếp (realtime)
        queryClient.setQueriesData({
            queryKey: [
                'products'
            ]
        }, (oldData)=>{
            if (!oldData) return oldData;
            return {
                ...oldData,
                items: oldData.items.map((item)=>item.systemId === product.systemId ? {
                        ...item,
                        pkgxId: undefined
                    } : item)
            };
        });
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success(`Đã hủy liên kết PKGX cho sản phẩm: ${product.name}`);
    }, [
        update,
        queryClient
    ]);
    // Handler thay đổi trạng thái sản phẩm (Switch)
    const handleStatusChange = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((product, newStatus)=>{
        update.mutate({
            systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(product.systemId),
            status: newStatus
        });
        // Update React Query cache
        queryClient.setQueriesData({
            queryKey: [
                'products'
            ]
        }, (oldData)=>{
            if (!oldData) return oldData;
            return {
                ...oldData,
                items: oldData.items.map((item)=>item.systemId === product.systemId ? {
                        ...item,
                        status: newStatus
                    } : item)
            };
        });
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success(`${product.name}: ${newStatus === 'active' ? 'Đang bán' : 'Ngừng bán'}`);
    }, [
        update,
        queryClient
    ]);
    // Handler thay đổi tồn kho (Inline edit)
    const handleInventoryChange = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((product, newQuantity)=>{
        // Lấy branch mặc định (branch đầu tiên có trong inventoryByBranch)
        const branches = Object.keys(product.inventoryByBranch);
        if (branches.length === 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Không tìm thấy chi nhánh để cập nhật tồn kho');
            return;
        }
        const defaultBranch = branches[0];
        const newInventory = {
            ...product.inventoryByBranch,
            [defaultBranch]: newQuantity
        };
        update.mutate({
            systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(product.systemId),
            inventoryByBranch: newInventory
        });
        // Update React Query cache
        queryClient.setQueriesData({
            queryKey: [
                'products'
            ]
        }, (oldData)=>{
            if (!oldData) return oldData;
            return {
                ...oldData,
                items: oldData.items.map((item)=>item.systemId === product.systemId ? {
                        ...item,
                        inventoryByBranch: newInventory
                    } : item)
            };
        });
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success(`Đã cập nhật tồn kho ${product.name}: ${newQuantity}`);
    }, [
        update,
        queryClient
    ]);
    // Handler cập nhật trường bất kỳ (Inline edit cho text/number/boolean fields)
    const handleFieldUpdate = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((product, field, value)=>{
        // Xử lý nested field như prices.systemId
        let updateData;
        if (field.startsWith('prices.')) {
            const policySystemId = field.replace('prices.', '');
            updateData = {
                prices: {
                    ...product.prices,
                    [policySystemId]: value
                }
            };
        } else {
            updateData = {
                [field]: value
            };
        }
        update.mutate({
            systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(product.systemId),
            ...updateData
        });
        // Update React Query cache
        queryClient.setQueriesData({
            queryKey: [
                'products'
            ]
        }, (oldData)=>{
            if (!oldData) return oldData;
            return {
                ...oldData,
                items: oldData.items.map((item)=>item.systemId === product.systemId ? {
                        ...item,
                        ...updateData
                    } : item)
            };
        });
        // Show success toast
        const fieldLabels = {
            pkgxId: 'ID PKGX',
            trendtechId: 'ID Trendtech',
            reorderLevel: 'Mức đặt hàng lại',
            safetyStock: 'Tồn kho an toàn',
            maxStock: 'Mức tồn tối đa',
            sellerNote: 'Ghi chú',
            isPublished: 'Đăng web',
            isFeatured: 'Nổi bật',
            isNewArrival: 'Mới về',
            isBestSeller: 'Bán chạy',
            isOnSale: 'Đang giảm giá',
            isStockTracked: 'Theo dõi kho',
            costPrice: 'Giá vốn',
            sortOrder: 'Thứ tự'
        };
        const label = field.startsWith('prices.') ? 'Giá' : fieldLabels[field] || field;
        const displayValue = typeof value === 'boolean' ? value ? 'Bật' : 'Tắt' : typeof value === 'string' && value.includes('T') ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(new Date(value)) : value;
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success(`Đã cập nhật ${label}: ${displayValue}`);
    }, [
        update,
        queryClient
    ]);
    const columns = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$columns$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getColumns"])(handleDelete, handleRestore, router, handlePrintLabel, handlePkgxPublish, handlePkgxLink, handlePkgxUnlink, handlePkgxSyncImages, handleStatusChange, handleInventoryChange, handleFieldUpdate), [
        handleDelete,
        handleRestore,
        router,
        handlePrintLabel,
        handlePkgxPublish,
        handlePkgxLink,
        handlePkgxUnlink,
        handlePkgxSyncImages,
        handleStatusChange,
        handleInventoryChange,
        handleFieldUpdate
    ]);
    // ✅ Run once on mount only
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        // Show ALL columns by default for testing
        const initialVisibility = {};
        columns.forEach((c)=>{
            initialVisibility[c.id] = true; // Show all columns
        });
        setColumnVisibility(initialVisibility);
        setColumnOrder(columns.map((c)=>c.id).filter(Boolean));
    }, []);
    const updateTableState = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((updater)=>{
        setTableState((prev)=>updater(prev));
    }, [
        setTableState
    ]);
    const handleSearchChange = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((value)=>{
        updateTableState((prev)=>({
                ...prev,
                search: value,
                pagination: {
                    ...prev.pagination,
                    pageIndex: 0
                }
            }));
    }, [
        updateTableState
    ]);
    const handleStatusFilterChange = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((value)=>{
        updateTableState((prev)=>({
                ...prev,
                statusFilter: value,
                pagination: {
                    ...prev.pagination,
                    pageIndex: 0
                }
            }));
    }, [
        updateTableState
    ]);
    const handleTypeFilterChange = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((value)=>{
        updateTableState((prev)=>({
                ...prev,
                typeFilter: value,
                pagination: {
                    ...prev.pagination,
                    pageIndex: 0
                }
            }));
    }, [
        updateTableState
    ]);
    const handleCategoryFilterChange = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((value)=>{
        updateTableState((prev)=>({
                ...prev,
                categoryFilter: value,
                pagination: {
                    ...prev.pagination,
                    pageIndex: 0
                }
            }));
    }, [
        updateTableState
    ]);
    const handleComboFilterChange = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((value)=>{
        updateTableState((prev)=>({
                ...prev,
                comboFilter: value,
                pagination: {
                    ...prev.pagination,
                    pageIndex: 0
                }
            }));
    }, [
        updateTableState
    ]);
    const handleStockLevelFilterChange = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((value)=>{
        updateTableState((prev)=>({
                ...prev,
                stockLevelFilter: value,
                pagination: {
                    ...prev.pagination,
                    pageIndex: 0
                }
            }));
    }, [
        updateTableState
    ]);
    const handlePkgxFilterChange = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((value)=>{
        updateTableState((prev)=>({
                ...prev,
                pkgxFilter: value,
                pagination: {
                    ...prev.pagination,
                    pageIndex: 0
                }
            }));
    }, [
        updateTableState
    ]);
    const handleDateRangeChange = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((value)=>{
        updateTableState((prev)=>({
                ...prev,
                dateRange: value,
                pagination: {
                    ...prev.pagination,
                    pageIndex: 0
                }
            }));
    }, [
        updateTableState
    ]);
    const handlePaginationChange = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((action)=>{
        updateTableState((prev)=>({
                ...prev,
                pagination: resolveStateAction(prev.pagination, action)
            }));
    }, [
        updateTableState
    ]);
    const handleSortingChange = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((action)=>{
        updateTableState((prev)=>{
            const nextSortingSource = resolveStateAction(prev.sorting, action);
            return {
                ...prev,
                sorting: {
                    id: nextSortingSource.id ?? prev.sorting.id,
                    desc: nextSortingSource.desc
                }
            };
        });
    }, [
        updateTableState
    ]);
    const queryParams = tableState;
    const { data: queryResult, isLoading: queryLoading, isFetching } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$hooks$2f$use$2d$products$2d$query$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductsQuery"])(queryParams);
    const pageData = queryResult?.items ?? [];
    const totalRows = queryResult?.total ?? 0;
    const pageCount = queryResult?.pageCount ?? 1;
    const isTableLoading = queryLoading || isFetching;
    const filteredSnapshot = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$product$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getFilteredProductsSnapshot"])(queryParams), [
        products,
        queryParams
    ]);
    const selectedProducts = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>products.filter((product)=>rowSelection[product.systemId]), [
        products,
        rowSelection
    ]);
    // Import/Export dialog states
    const [isImportOpen, setIsImportOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](false);
    const [isExportOpen, setIsExportOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](false);
    const confirmDelete = ()=>{
        if (idToDelete) {
            remove.mutate((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(idToDelete), {
                onSuccess: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success('Đã chuyển sản phẩm vào thùng rác')
            });
        }
        setIsAlertOpen(false);
        setIdToDelete(null);
    };
    const allSelectedRows = selectedProducts;
    // Import handler - tích hợp với product importer logic
    const handleImport = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](async (data, mode, branchId)=>{
        const currentEmployeeSystemId = authEmployee?.systemId ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SYSTEM');
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
                    // Check if product exists (by id or barcode)
                    // NOTE: Product uses 'id' (BusinessId) not 'code'
                    const existingProduct = products.find((p)=>item.id && p.id === item.id || item.barcode && p.barcode === item.barcode);
                    if (existingProduct) {
                        // Product exists
                        if (mode === 'insert-only') {
                            // Skip in insert-only mode
                            results.skipped++;
                            continue;
                        }
                        // Update existing product
                        const updatedFields = {
                            ...item,
                            updatedAt: new Date().toISOString(),
                            updatedBy: currentEmployeeSystemId
                        };
                        // Remove fields that shouldn't be overwritten
                        delete updatedFields.systemId;
                        delete updatedFields.createdAt;
                        delete updatedFields.createdBy;
                        update.mutate({
                            systemId: existingProduct.systemId,
                            ...updatedFields
                        });
                        results.updated++;
                        results.success++;
                    } else {
                        // Product does not exist
                        if (mode === 'update-only') {
                            // Skip in update-only mode
                            results.skipped++;
                            continue;
                        }
                        // Insert new product
                        const newProduct = {
                            name: item.name,
                            sellingPrice: item.sellingPrice ?? 0,
                            costPrice: item.costPrice,
                            sku: item.sku,
                            barcode: item.barcode,
                            categoryId: item.categorySystemId,
                            brandId: item.brandSystemId,
                            description: item.description,
                            images: item.images,
                            inventoryByBranch: item.inventoryByBranch || {},
                            committedByBranch: item.committedByBranch || {},
                            inTransitByBranch: item.inTransitByBranch || {},
                            prices: item.prices || {},
                            status: item.status || 'active'
                        };
                        create.mutate(newProduct);
                        results.inserted++;
                        results.success++;
                    }
                } catch (rowError) {
                    results.failed++;
                    results.errors.push({
                        row: i + 2,
                        message: rowError instanceof Error ? rowError.message : 'Lỗi không xác định'
                    });
                }
            }
            // Invalidate query cache để refresh danh sách sản phẩm
            if (results.success > 0) {
                queryClient.invalidateQueries({
                    queryKey: [
                        'products'
                    ]
                });
            }
            return results;
        } catch (error) {
            console.error('[Products Importer] Lỗi nhập sản phẩm', error);
            throw error;
        }
    }, [
        products,
        create,
        update,
        authEmployee?.systemId,
        queryClient
    ]);
    const toolbarLeftActions = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                variant: "outline",
                size: "sm",
                onClick: ()=>setIsImportOpen(true),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileUp$3e$__["FileUp"], {
                        className: "mr-2 h-4 w-4"
                    }, void 0, false, {
                        fileName: "[project]/features/products/page.tsx",
                        lineNumber: 908,
                        columnNumber: 9
                    }, this),
                    "Nhập file"
                ]
            }, void 0, true, {
                fileName: "[project]/features/products/page.tsx",
                lineNumber: 907,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                variant: "outline",
                size: "sm",
                onClick: ()=>setIsExportOpen(true),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                        className: "mr-2 h-4 w-4"
                    }, void 0, false, {
                        fileName: "[project]/features/products/page.tsx",
                        lineNumber: 912,
                        columnNumber: 9
                    }, this),
                    "Xuất Excel"
                ]
            }, void 0, true, {
                fileName: "[project]/features/products/page.tsx",
                lineNumber: 911,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
    const toolbarRightActions = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$column$2d$toggle$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DataTableColumnCustomizer"], {
        columns: columns,
        columnVisibility: columnVisibility,
        setColumnVisibility: setColumnVisibility,
        columnOrder: columnOrder,
        setColumnOrder: setColumnOrder,
        pinnedColumns: pinnedColumns,
        setPinnedColumns: setPinnedColumns
    }, void 0, false, {
        fileName: "[project]/features/products/page.tsx",
        lineNumber: 919,
        columnNumber: 5
    }, this);
    const handleRowClick = (row)=>{
        router.push(`/products/${row.systemId}`);
    };
    // Get unique categories for filter - từ settings
    const categoryOptions = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        return activeCategories.map((c)=>({
                label: c.path || c.name,
                value: c.systemId
            })).sort((a, b)=>a.label.localeCompare(b.label));
    }, [
        activeCategories
    ]);
    // Calculate stock level counts
    const stockLevelCounts = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        const activeProducts = products.filter((p)=>!p.isDeleted);
        const counts = {
            outOfStock: 0,
            lowStock: 0,
            belowSafety: 0,
            highStock: 0
        };
        activeProducts.forEach((product)=>{
            const totalInventory = Object.values(product.inventoryByBranch || {}).reduce((sum, qty)=>sum + qty, 0);
            if (totalInventory <= 0) {
                counts.outOfStock++;
            }
            if (totalInventory > 0 && product.reorderLevel !== undefined && totalInventory <= product.reorderLevel) {
                counts.lowStock++;
            }
            if (product.safetyStock !== undefined && totalInventory < product.safetyStock) {
                counts.belowSafety++;
            }
            if (product.maxStock !== undefined && totalInventory > product.maxStock) {
                counts.highStock++;
            }
        });
        return counts;
    }, [
        products
    ]);
    const renderFilterControls = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$date$2d$filter$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DataTableDateFilter"], {
                    value: tableState.dateRange,
                    onChange: handleDateRangeChange,
                    title: "Ngày tạo"
                }, void 0, false, {
                    fileName: "[project]/features/products/page.tsx",
                    lineNumber: 977,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Select"], {
                    value: tableState.statusFilter,
                    onValueChange: handleStatusFilterChange,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                            className: "w-full sm:w-[180px] h-9",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectValue"], {
                                placeholder: "Tất cả trạng thái"
                            }, void 0, false, {
                                fileName: "[project]/features/products/page.tsx",
                                lineNumber: 985,
                                columnNumber: 11
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/features/products/page.tsx",
                            lineNumber: 984,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectContent"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                    value: "all",
                                    children: "Tất cả trạng thái"
                                }, void 0, false, {
                                    fileName: "[project]/features/products/page.tsx",
                                    lineNumber: 988,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                    value: "active",
                                    children: "Hoạt động"
                                }, void 0, false, {
                                    fileName: "[project]/features/products/page.tsx",
                                    lineNumber: 989,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                    value: "inactive",
                                    children: "Tạm ngừng"
                                }, void 0, false, {
                                    fileName: "[project]/features/products/page.tsx",
                                    lineNumber: 990,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                    value: "discontinued",
                                    children: "Ngừng kinh doanh"
                                }, void 0, false, {
                                    fileName: "[project]/features/products/page.tsx",
                                    lineNumber: 991,
                                    columnNumber: 11
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/products/page.tsx",
                            lineNumber: 987,
                            columnNumber: 9
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/products/page.tsx",
                    lineNumber: 983,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Select"], {
                    value: tableState.typeFilter,
                    onValueChange: handleTypeFilterChange,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                            className: "w-full sm:w-[180px] h-9",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectValue"], {
                                placeholder: "Loại sản phẩm"
                            }, void 0, false, {
                                fileName: "[project]/features/products/page.tsx",
                                lineNumber: 997,
                                columnNumber: 11
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/features/products/page.tsx",
                            lineNumber: 996,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectContent"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                    value: "all",
                                    children: "Tất cả loại"
                                }, void 0, false, {
                                    fileName: "[project]/features/products/page.tsx",
                                    lineNumber: 1000,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                    value: "physical",
                                    children: "Hàng hóa"
                                }, void 0, false, {
                                    fileName: "[project]/features/products/page.tsx",
                                    lineNumber: 1001,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                    value: "service",
                                    children: "Dịch vụ"
                                }, void 0, false, {
                                    fileName: "[project]/features/products/page.tsx",
                                    lineNumber: 1002,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                    value: "digital",
                                    children: "Sản phẩm số"
                                }, void 0, false, {
                                    fileName: "[project]/features/products/page.tsx",
                                    lineNumber: 1003,
                                    columnNumber: 11
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/products/page.tsx",
                            lineNumber: 999,
                            columnNumber: 9
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/products/page.tsx",
                    lineNumber: 995,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Select"], {
                    value: tableState.categoryFilter,
                    onValueChange: handleCategoryFilterChange,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                            className: "w-full sm:w-[180px] h-9",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectValue"], {
                                placeholder: "Danh mục"
                            }, void 0, false, {
                                fileName: "[project]/features/products/page.tsx",
                                lineNumber: 1009,
                                columnNumber: 11
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/features/products/page.tsx",
                            lineNumber: 1008,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectContent"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                    value: "all",
                                    children: "Tất cả danh mục"
                                }, void 0, false, {
                                    fileName: "[project]/features/products/page.tsx",
                                    lineNumber: 1012,
                                    columnNumber: 11
                                }, this),
                                categoryOptions.map((cat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                        value: cat.value,
                                        children: cat.label
                                    }, cat.value, false, {
                                        fileName: "[project]/features/products/page.tsx",
                                        lineNumber: 1014,
                                        columnNumber: 13
                                    }, this))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/products/page.tsx",
                            lineNumber: 1011,
                            columnNumber: 9
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/products/page.tsx",
                    lineNumber: 1007,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Select"], {
                    value: tableState.comboFilter,
                    onValueChange: handleComboFilterChange,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                            className: "w-full sm:w-[180px] h-9",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectValue"], {
                                placeholder: "Sản phẩm combo"
                            }, void 0, false, {
                                fileName: "[project]/features/products/page.tsx",
                                lineNumber: 1021,
                                columnNumber: 11
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/features/products/page.tsx",
                            lineNumber: 1020,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectContent"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                    value: "all",
                                    children: "Tất cả sản phẩm"
                                }, void 0, false, {
                                    fileName: "[project]/features/products/page.tsx",
                                    lineNumber: 1024,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                    value: "combo",
                                    children: "Chỉ Combo"
                                }, void 0, false, {
                                    fileName: "[project]/features/products/page.tsx",
                                    lineNumber: 1025,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                    value: "non-combo",
                                    children: "Không phải Combo"
                                }, void 0, false, {
                                    fileName: "[project]/features/products/page.tsx",
                                    lineNumber: 1026,
                                    columnNumber: 11
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/products/page.tsx",
                            lineNumber: 1023,
                            columnNumber: 9
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/products/page.tsx",
                    lineNumber: 1019,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Select"], {
                    value: tableState.stockLevelFilter,
                    onValueChange: handleStockLevelFilterChange,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                            className: "w-full sm:w-[180px] h-9",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectValue"], {
                                placeholder: "Mức tồn kho"
                            }, void 0, false, {
                                fileName: "[project]/features/products/page.tsx",
                                lineNumber: 1032,
                                columnNumber: 11
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/features/products/page.tsx",
                            lineNumber: 1031,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectContent"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                    value: "all",
                                    children: "Tất cả mức tồn"
                                }, void 0, false, {
                                    fileName: "[project]/features/products/page.tsx",
                                    lineNumber: 1035,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                    value: "out-of-stock",
                                    children: [
                                        "Hết hàng (",
                                        stockLevelCounts.outOfStock,
                                        ")"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/products/page.tsx",
                                    lineNumber: 1036,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                    value: "low-stock",
                                    children: [
                                        "Sắp hết (",
                                        stockLevelCounts.lowStock,
                                        ")"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/products/page.tsx",
                                    lineNumber: 1037,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                    value: "below-safety",
                                    children: [
                                        "Dưới an toàn (",
                                        stockLevelCounts.belowSafety,
                                        ")"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/products/page.tsx",
                                    lineNumber: 1038,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                    value: "high-stock",
                                    children: [
                                        "Tồn cao (",
                                        stockLevelCounts.highStock,
                                        ")"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/products/page.tsx",
                                    lineNumber: 1039,
                                    columnNumber: 11
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/products/page.tsx",
                            lineNumber: 1034,
                            columnNumber: 9
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/products/page.tsx",
                    lineNumber: 1030,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Select"], {
                    value: tableState.pkgxFilter,
                    onValueChange: handlePkgxFilterChange,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                            className: "w-full sm:w-[180px] h-9",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectValue"], {
                                placeholder: "Trạng thái PKGX"
                            }, void 0, false, {
                                fileName: "[project]/features/products/page.tsx",
                                lineNumber: 1045,
                                columnNumber: 11
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/features/products/page.tsx",
                            lineNumber: 1044,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectContent"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                    value: "all",
                                    children: "Tất cả PKGX"
                                }, void 0, false, {
                                    fileName: "[project]/features/products/page.tsx",
                                    lineNumber: 1048,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                    value: "linked",
                                    children: "Đã liên kết PKGX"
                                }, void 0, false, {
                                    fileName: "[project]/features/products/page.tsx",
                                    lineNumber: 1049,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                    value: "not-linked",
                                    children: "Chưa liên kết PKGX"
                                }, void 0, false, {
                                    fileName: "[project]/features/products/page.tsx",
                                    lineNumber: 1050,
                                    columnNumber: 11
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/products/page.tsx",
                            lineNumber: 1047,
                            columnNumber: 9
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/products/page.tsx",
                    lineNumber: 1043,
                    columnNumber: 7
                }, this)
            ]
        }, void 0, true);
    const handlePrintLabels = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((products)=>{
        if (products.length === 0) return;
        const printOptionsList = products.map((product)=>{
            const categoryName = product.categorySystemId ? findCategoryById(product.categorySystemId)?.name || product.category : product.category;
            const brandName = product.brandSystemId ? findBrandById(product.brandSystemId)?.name || '' : '';
            const defaultPrice = defaultSellingPolicy ? product.prices?.[defaultSellingPolicy.systemId] : undefined;
            return {
                data: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$product$2d$label$2e$mapper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapProductToLabelPrintData"])(product, storeSettings, {
                    category: categoryName,
                    brand: brandName,
                    price: defaultPrice ?? product.sellingPrice
                })
            };
        });
        printMultiple('product-label', printOptionsList);
    }, [
        printMultiple,
        storeSettings,
        defaultSellingPolicy
    ]);
    // ═══════════════════════════════════════════════════════════════════════════
    // PKGX Bulk Action Helper Functions
    // ═══════════════════════════════════════════════════════════════════════════
    // Get total inventory across all branches
    const getTotalInventory = (product)=>{
        if (!product.inventoryByBranch) return 0;
        return Object.values(product.inventoryByBranch).reduce((sum, qty)=>sum + (qty || 0), 0);
    };
    // Create price update payload for PKGX
    const createPriceUpdatePayload = (product)=>{
        const pkgxSettingsState = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePkgxSettingsStore"].getState();
        const { priceMapping } = pkgxSettingsState.settings;
        const payload = {};
        // Shop price (giá bán)
        if (priceMapping?.shopPrice && product.prices?.[priceMapping.shopPrice]) {
            payload.shop_price = product.prices[priceMapping.shopPrice];
        } else if (defaultSellingPolicy && product.prices?.[defaultSellingPolicy.systemId]) {
            payload.shop_price = product.prices[defaultSellingPolicy.systemId];
        } else if (product.costPrice) {
            payload.shop_price = product.costPrice;
        }
        // Market price (giá thị trường)
        if (priceMapping?.marketPrice && product.prices?.[priceMapping.marketPrice]) {
            payload.market_price = product.prices[priceMapping.marketPrice];
        }
        // Partner price
        if (priceMapping?.partnerPrice && product.prices?.[priceMapping.partnerPrice]) {
            payload.partner_price = product.prices[priceMapping.partnerPrice];
        }
        // Ace price
        if (priceMapping?.acePrice && product.prices?.[priceMapping.acePrice]) {
            payload.ace_price = product.prices[priceMapping.acePrice];
        }
        // Deal price
        if (priceMapping?.dealPrice && product.prices?.[priceMapping.dealPrice]) {
            payload.deal_price = product.prices[priceMapping.dealPrice];
        }
        return payload;
    };
    // Create SEO update payload for PKGX (đồng nhất với handlePkgxUpdateSeo)
    const createSeoUpdatePayload = (product)=>{
        const pkgxSeo = product.seoPkgx;
        return {
            keywords: pkgxSeo?.seoKeywords || product.tags?.join(', ') || product.name,
            meta_title: pkgxSeo?.seoTitle || product.ktitle || product.name,
            meta_desc: pkgxSeo?.metaDescription || product.seoDescription || '',
            goods_brief: pkgxSeo?.shortDescription || product.shortDescription || ''
        };
    };
    // Create flags update payload for PKGX
    // Mapping: HRM isPublished->is_on_sale, isFeatured->best/ishome, isBestSeller->hot, isNewArrival->new
    const createFlagsUpdatePayload = (product)=>{
        return {
            best: product.isFeatured || false,
            hot: product.isBestSeller || false,
            new: product.isNewArrival || false,
            ishome: product.isFeatured || false,
            is_on_sale: product.isPublished ?? product.status === 'active'
        };
    };
    const bulkActions = [
        {
            label: "In tem phụ sản phẩm",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__["Printer"],
            onSelect: (selectedRows)=>{
                handlePrintLabels(selectedRows);
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success(`Đang in tem cho ${selectedRows.length} sản phẩm`);
            }
        },
        {
            label: "Chuyển vào thùng rác",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"],
            onSelect: (selectedRows)=>{
                const systemIds = selectedRows.map((p)=>p.systemId);
                systemIds.forEach((id)=>remove.mutate((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(id)));
                setRowSelection({});
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success(`Đã chuyển ${selectedRows.length} sản phẩm vào thùng rác`);
            }
        },
        {
            label: "Đang hoạt động",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__["Play"],
            onSelect: (selectedRows)=>{
                selectedRows.forEach((product)=>{
                    update.mutate({
                        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(product.systemId),
                        ...product,
                        status: 'active'
                    });
                });
                setRowSelection({});
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success(`Đã cập nhật ${selectedRows.length} sản phẩm sang trạng thái "Đang hoạt động"`);
            }
        },
        {
            label: "Ngừng kinh doanh",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$stop$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__StopCircle$3e$__["StopCircle"],
            onSelect: (selectedRows)=>{
                selectedRows.forEach((product)=>{
                    update.mutate({
                        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(product.systemId),
                        ...product,
                        status: 'discontinued'
                    });
                });
                setRowSelection({});
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success(`Đã cập nhật ${selectedRows.length} sản phẩm sang trạng thái "Ngừng kinh doanh"`);
            }
        }
    ];
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
                label: "Thông tin cơ bản",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"],
                onSelect: (selectedRows)=>{
                    triggerBulkSync(selectedRows, 'sync_basic');
                }
            },
            {
                label: "Giá",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__["DollarSign"],
                onSelect: (selectedRows)=>{
                    triggerBulkSync(selectedRows, 'sync_price');
                }
            },
            {
                label: "Tồn kho",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2d$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PackageSearch$3e$__["PackageSearch"],
                onSelect: (selectedRows)=>{
                    triggerBulkSync(selectedRows, 'sync_inventory');
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
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"],
                onSelect: (selectedRows)=>{
                    triggerBulkSync(selectedRows, 'sync_description');
                }
            },
            {
                label: "Flags",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flag$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Flag$3e$__["Flag"],
                onSelect: (selectedRows)=>{
                    triggerBulkSync(selectedRows, 'sync_flags');
                }
            },
            {
                label: "Hình ảnh",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__["Image"],
                onSelect: (selectedRows)=>{
                    triggerBulkSync(selectedRows, 'sync_images');
                }
            },
            {
                label: "Xem trên PKGX",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"],
                onSelect: (selectedRows)=>{
                    const linkedProducts = selectedRows.filter((p)=>p.pkgxId);
                    if (linkedProducts.length === 0) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Không có sản phẩm nào đã liên kết PKGX');
                        return;
                    }
                    if (linkedProducts.length === 1) {
                        window.open(`https://phukiengiaxuong.com.vn/admin/goods.php?act=edit_goods&goods_id=${linkedProducts[0].pkgxId}`, '_blank');
                    } else {
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].info(`Đã chọn ${linkedProducts.length} sản phẩm. Vui lòng chọn 1 sản phẩm để xem.`);
                    }
                }
            },
            {
                label: "Hủy liên kết",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$unlink$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Unlink$3e$__["Unlink"],
                variant: 'destructive',
                onSelect: async (selectedRows)=>{
                    const linkedProducts = selectedRows.filter((p)=>p.pkgxId);
                    if (linkedProducts.length === 0) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Không có sản phẩm nào đã liên kết PKGX');
                        return;
                    }
                    if (!confirm(`Bạn có chắc muốn hủy liên kết ${linkedProducts.length} sản phẩm với PKGX?`)) {
                        return;
                    }
                    let successCount = 0;
                    for (const product of linkedProducts){
                        try {
                            update.mutate({
                                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(product.systemId),
                                pkgxId: undefined
                            });
                            successCount++;
                        } catch  {
                        // ignore
                        }
                    }
                    setRowSelection({});
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success(`Đã hủy liên kết ${successCount} sản phẩm với PKGX`);
                }
            }
        ], [
        triggerBulkSync,
        update,
        setRowSelection
    ]);
    const getStatusVariant = (status)=>{
        if (!status) return 'secondary';
        switch(status){
            case 'active':
                return 'default';
            case 'inactive':
                return 'secondary';
            case 'discontinued':
                return 'destructive';
            default:
                return 'secondary';
        }
    };
    const getStatusLabel = (status)=>{
        if (!status) return 'Không xác định';
        switch(status){
            case 'active':
                return 'Hoạt động';
            case 'inactive':
                return 'Tạm ngừng';
            case 'discontinued':
                return 'Ngừng kinh doanh';
            default:
                return status;
        }
    };
    const getTypeLabel = (type)=>{
        if (!type) return '';
        switch(type){
            case 'physical':
                return 'Hàng hóa';
            case 'service':
                return 'Dịch vụ';
            case 'digital':
                return 'Sản phẩm số';
            default:
                return type;
        }
    };
    const MobileProductCard = ({ product })=>{
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
            className: "cursor-pointer hover:shadow-md transition-shadow",
            onClick: ()=>handleRowClick(product),
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                className: "p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-start gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Avatar"], {
                            className: "h-12 w-12 flex-shrink-0",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AvatarFallback"], {
                                className: "bg-primary/10 text-primary font-semibold",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                                    className: "h-6 w-6"
                                }, void 0, false, {
                                    fileName: "[project]/features/products/page.tsx",
                                    lineNumber: 1341,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/features/products/page.tsx",
                                lineNumber: 1340,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/features/products/page.tsx",
                            lineNumber: 1339,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1 min-w-0",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-start justify-between mb-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                            className: "text-body-sm font-medium truncate",
                                                            children: product.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/products/page.tsx",
                                                            lineNumber: 1350,
                                                            columnNumber: 21
                                                        }, this),
                                                        product.pkgxId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                                            variant: "outline",
                                                            className: "text-body-xs border-blue-500 text-blue-600 flex-shrink-0",
                                                            children: "PKGX"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/products/page.tsx",
                                                            lineNumber: 1352,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/products/page.tsx",
                                                    lineNumber: 1349,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-body-xs text-muted-foreground",
                                                    children: product.id
                                                }, void 0, false, {
                                                    fileName: "[project]/features/products/page.tsx",
                                                    lineNumber: 1357,
                                                    columnNumber: 19
                                                }, this),
                                                product.shortDescription && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-body-xs text-muted-foreground mt-0.5 line-clamp-1",
                                                    children: product.shortDescription
                                                }, void 0, false, {
                                                    fileName: "[project]/features/products/page.tsx",
                                                    lineNumber: 1359,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/products/page.tsx",
                                            lineNumber: 1348,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenu"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                                                    asChild: true,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                        variant: "ghost",
                                                        size: "sm",
                                                        className: "h-9 w-9 p-0",
                                                        onClick: (e)=>e.stopPropagation(),
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__["MoreVertical"], {
                                                            className: "h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/products/page.tsx",
                                                            lineNumber: 1372,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/products/page.tsx",
                                                        lineNumber: 1366,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/features/products/page.tsx",
                                                    lineNumber: 1365,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                                                    align: "end",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                            onClick: (e)=>{
                                                                e.stopPropagation();
                                                                router.push(`/products/${product.systemId}/edit`);
                                                            },
                                                            children: "Chỉnh sửa"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/products/page.tsx",
                                                            lineNumber: 1376,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                            onClick: (e)=>{
                                                                e.stopPropagation();
                                                                handleDelete(product.systemId);
                                                            },
                                                            children: "Chuyển vào thùng rác"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/products/page.tsx",
                                                            lineNumber: 1379,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/products/page.tsx",
                                                    lineNumber: 1375,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/products/page.tsx",
                                            lineNumber: 1364,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/products/page.tsx",
                                    lineNumber: 1347,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-1.5 mt-2",
                                    children: [
                                        product.categorySystemId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center text-body-xs text-muted-foreground",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                                                    className: "h-3 w-3 mr-1.5"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/products/page.tsx",
                                                    lineNumber: 1390,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "truncate",
                                                    children: categories.find((c)=>c.systemId === product.categorySystemId)?.name || product.categorySystemId
                                                }, void 0, false, {
                                                    fileName: "[project]/features/products/page.tsx",
                                                    lineNumber: 1391,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/products/page.tsx",
                                            lineNumber: 1389,
                                            columnNumber: 19
                                        }, this),
                                        product.type && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center text-body-xs text-muted-foreground",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "truncate",
                                                children: getTypeLabel(product.type)
                                            }, void 0, false, {
                                                fileName: "[project]/features/products/page.tsx",
                                                lineNumber: 1398,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/features/products/page.tsx",
                                            lineNumber: 1397,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/products/page.tsx",
                                    lineNumber: 1387,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between mt-3 pt-2 border-t",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                            variant: getStatusVariant(product.status),
                                            className: "text-body-xs",
                                            children: getStatusLabel(product.status)
                                        }, void 0, false, {
                                            fileName: "[project]/features/products/page.tsx",
                                            lineNumber: 1405,
                                            columnNumber: 17
                                        }, this),
                                        product.unit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-body-xs text-muted-foreground",
                                            children: [
                                                "ĐVT: ",
                                                product.unit
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/products/page.tsx",
                                            lineNumber: 1409,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/products/page.tsx",
                                    lineNumber: 1404,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/products/page.tsx",
                            lineNumber: 1346,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/products/page.tsx",
                    lineNumber: 1337,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/products/page.tsx",
                lineNumber: 1336,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/features/products/page.tsx",
            lineNumber: 1335,
            columnNumber: 7
        }, this);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col w-full h-full",
        children: [
            !isMobile ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$page$2d$toolbar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PageToolbar"], {
                className: "flex-wrap gap-2",
                leftActions: toolbarLeftActions,
                rightActions: toolbarRightActions
            }, void 0, false, {
                fileName: "[project]/features/products/page.tsx",
                lineNumber: 1425,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "py-3",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                            type: "button",
                            variant: "outline",
                            size: "sm",
                            className: "w-full justify-center gap-2",
                            onClick: ()=>setActionsSheetOpen(true),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings2$3e$__["Settings2"], {
                                    className: "h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/features/products/page.tsx",
                                    lineNumber: 1440,
                                    columnNumber: 15
                                }, this),
                                "Tùy chọn bảng"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/products/page.tsx",
                            lineNumber: 1433,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/features/products/page.tsx",
                        lineNumber: 1432,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sheet$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Sheet"], {
                        open: isActionsSheetOpen,
                        onOpenChange: setActionsSheetOpen,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sheet$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SheetContent"], {
                            side: "bottom",
                            className: "space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sheet$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SheetHeader"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sheet$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SheetTitle"], {
                                            children: "Hành động nhanh"
                                        }, void 0, false, {
                                            fileName: "[project]/features/products/page.tsx",
                                            lineNumber: 1447,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sheet$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SheetDescription"], {
                                            children: "Nhập, xuất dữ liệu và tùy chỉnh cột hiển thị."
                                        }, void 0, false, {
                                            fileName: "[project]/features/products/page.tsx",
                                            lineNumber: 1448,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/products/page.tsx",
                                    lineNumber: 1446,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                            className: "w-full justify-center",
                                            variant: "outline",
                                            onClick: ()=>{
                                                setActionsSheetOpen(false);
                                                setIsImportOpen(true);
                                            },
                                            children: "Nhập sản phẩm"
                                        }, void 0, false, {
                                            fileName: "[project]/features/products/page.tsx",
                                            lineNumber: 1451,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                            className: "w-full justify-center",
                                            variant: "outline",
                                            onClick: ()=>{
                                                setActionsSheetOpen(false);
                                                setIsExportOpen(true);
                                            },
                                            children: "Xuất danh sách"
                                        }, void 0, false, {
                                            fileName: "[project]/features/products/page.tsx",
                                            lineNumber: 1461,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$column$2d$toggle$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DataTableColumnCustomizer"], {
                                            columns: columns,
                                            columnVisibility: columnVisibility,
                                            setColumnVisibility: setColumnVisibility,
                                            columnOrder: columnOrder,
                                            setColumnOrder: setColumnOrder,
                                            pinnedColumns: pinnedColumns,
                                            setPinnedColumns: setPinnedColumns,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                className: "w-full justify-center gap-2",
                                                variant: "outline",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$columns$2d$3$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Columns3$3e$__["Columns3"], {
                                                        className: "h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/products/page.tsx",
                                                        lineNumber: 1481,
                                                        columnNumber: 21
                                                    }, this),
                                                    "Tuỳ chỉnh cột"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/products/page.tsx",
                                                lineNumber: 1480,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/features/products/page.tsx",
                                            lineNumber: 1471,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/products/page.tsx",
                                    lineNumber: 1450,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/products/page.tsx",
                            lineNumber: 1445,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/features/products/page.tsx",
                        lineNumber: 1444,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true),
            !isMobile ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$page$2d$filters$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PageFilters"], {
                searchValue: tableState.search,
                onSearchChange: handleSearchChange,
                searchPlaceholder: "Tìm kiếm sản phẩm...",
                children: renderFilterControls()
            }, void 0, false, {
                fileName: "[project]/features/products/page.tsx",
                lineNumber: 1493,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$page$2d$filters$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PageFilters"], {
                        searchValue: tableState.search,
                        onSearchChange: handleSearchChange,
                        searchPlaceholder: "Tìm kiếm sản phẩm...",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                            type: "button",
                            variant: "outline",
                            size: "sm",
                            className: "w-full sm:w-auto justify-center gap-2",
                            onClick: ()=>setFilterSheetOpen(true),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__["SlidersHorizontal"], {
                                    className: "h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/features/products/page.tsx",
                                    lineNumber: 1514,
                                    columnNumber: 15
                                }, this),
                                "Bộ lọc nâng cao"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/products/page.tsx",
                            lineNumber: 1507,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/features/products/page.tsx",
                        lineNumber: 1502,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sheet$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Sheet"], {
                        open: isFilterSheetOpen,
                        onOpenChange: setFilterSheetOpen,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sheet$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SheetContent"], {
                            side: "bottom",
                            className: "space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sheet$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SheetHeader"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sheet$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SheetTitle"], {
                                            children: "Bộ lọc sản phẩm"
                                        }, void 0, false, {
                                            fileName: "[project]/features/products/page.tsx",
                                            lineNumber: 1521,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sheet$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SheetDescription"], {
                                            children: "Tùy chọn nhanh cho trạng thái, loại, danh mục, combo và tồn kho."
                                        }, void 0, false, {
                                            fileName: "[project]/features/products/page.tsx",
                                            lineNumber: 1522,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/products/page.tsx",
                                    lineNumber: 1520,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-3",
                                    children: renderFilterControls()
                                }, void 0, false, {
                                    fileName: "[project]/features/products/page.tsx",
                                    lineNumber: 1524,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/products/page.tsx",
                            lineNumber: 1519,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/features/products/page.tsx",
                        lineNumber: 1518,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pb-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$responsive$2d$data$2d$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ResponsiveDataTable"], {
                    columns: columns,
                    data: pageData,
                    renderMobileCard: (product)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MobileProductCard, {
                            product: product
                        }, void 0, false, {
                            fileName: "[project]/features/products/page.tsx",
                            lineNumber: 1537,
                            columnNumber: 42
                        }, void 0),
                    pageCount: pageCount,
                    pagination: tableState.pagination,
                    setPagination: handlePaginationChange,
                    rowCount: totalRows,
                    rowSelection: rowSelection,
                    setRowSelection: setRowSelection,
                    allSelectedRows: allSelectedRows,
                    onBulkDelete: undefined,
                    bulkActions: bulkActions,
                    pkgxBulkActions: pkgxBulkActions,
                    sorting: tableState.sorting,
                    setSorting: handleSortingChange,
                    columnVisibility: columnVisibility,
                    setColumnVisibility: setColumnVisibility,
                    columnOrder: columnOrder,
                    setColumnOrder: setColumnOrder,
                    pinnedColumns: pinnedColumns,
                    setPinnedColumns: setPinnedColumns,
                    onRowClick: handleRowClick,
                    emptyTitle: "Không có sản phẩm",
                    emptyDescription: "Thêm sản phẩm đầu tiên để bắt đầu",
                    isLoading: isTableLoading,
                    mobileVirtualized: true,
                    mobileRowHeight: MOBILE_ROW_HEIGHT,
                    mobileListHeight: MOBILE_LIST_HEIGHT
                }, void 0, false, {
                    fileName: "[project]/features/products/page.tsx",
                    lineNumber: 1534,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/products/page.tsx",
                lineNumber: 1533,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialog"], {
                open: isAlertOpen,
                onOpenChange: setIsAlertOpen,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogContent"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogHeader"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogTitle"], {
                                    children: "Bạn có chắc chắn muốn xóa?"
                                }, void 0, false, {
                                    fileName: "[project]/features/products/page.tsx",
                                    lineNumber: 1570,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogDescription"], {
                                    children: "Sản phẩm sẽ được chuyển vào thùng rác. Bạn có thể khôi phục lại sau."
                                }, void 0, false, {
                                    fileName: "[project]/features/products/page.tsx",
                                    lineNumber: 1571,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/products/page.tsx",
                            lineNumber: 1569,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogFooter"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogCancel"], {
                                    className: "h-9",
                                    children: "Hủy"
                                }, void 0, false, {
                                    fileName: "[project]/features/products/page.tsx",
                                    lineNumber: 1576,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogAction"], {
                                    className: "h-9",
                                    onClick: confirmDelete,
                                    children: "Xóa"
                                }, void 0, false, {
                                    fileName: "[project]/features/products/page.tsx",
                                    lineNumber: 1577,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/products/page.tsx",
                            lineNumber: 1575,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/products/page.tsx",
                    lineNumber: 1568,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/products/page.tsx",
                lineNumber: 1567,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$generic$2d$import$2d$dialog$2d$v2$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GenericImportDialogV2"], {
                open: isImportOpen,
                onOpenChange: setIsImportOpen,
                config: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$export$2f$configs$2f$product$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["productImportExportConfig"],
                existingData: products,
                onImport: handleImport,
                currentUser: authEmployee ? {
                    systemId: authEmployee.systemId,
                    name: authEmployee.fullName || authEmployee.id
                } : undefined
            }, void 0, false, {
                fileName: "[project]/features/products/page.tsx",
                lineNumber: 1583,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$generic$2d$export$2d$dialog$2d$v2$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GenericExportDialogV2"], {
                open: isExportOpen,
                onOpenChange: setIsExportOpen,
                config: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$export$2f$configs$2f$product$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["productImportExportConfig"],
                allData: products,
                filteredData: filteredSnapshot,
                currentPageData: pageData,
                selectedData: selectedProducts,
                currentUser: authEmployee ? {
                    systemId: authEmployee.systemId,
                    name: authEmployee.fullName || authEmployee.id
                } : {
                    systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SYSTEM'),
                    name: 'System'
                }
            }, void 0, false, {
                fileName: "[project]/features/products/page.tsx",
                lineNumber: 1596,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$components$2f$pkgx$2d$link$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PkgxLinkDialog"], {
                open: pkgxLinkDialogOpen,
                onOpenChange: setPkgxLinkDialogOpen,
                product: productToLink,
                onSuccess: handlePkgxLinkSuccess
            }, void 0, false, {
                fileName: "[project]/features/products/page.tsx",
                lineNumber: 1611,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$components$2f$pkgx$2d$bulk$2d$sync$2d$confirm$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PkgxBulkSyncConfirmDialog"], {
                confirmAction: bulkConfirmAction,
                progress: bulkProgress,
                onConfirm: executeBulkAction,
                onCancel: cancelBulkConfirm
            }, void 0, false, {
                fileName: "[project]/features/products/page.tsx",
                lineNumber: 1619,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/products/page.tsx",
        lineNumber: 1422,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=features_products_dd55daaa._.js.map