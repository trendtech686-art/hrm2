module.exports = [
"[project]/features/settings/inventory/api/inventory-settings-api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Inventory Settings API Layer
 */ __turbopack_context__.s([
    "createBrand",
    ()=>createBrand,
    "createImporter",
    ()=>createImporter,
    "createProductCategory",
    ()=>createProductCategory,
    "createProductType",
    ()=>createProductType,
    "deleteBrand",
    ()=>deleteBrand,
    "deleteImporter",
    ()=>deleteImporter,
    "deleteProductCategory",
    ()=>deleteProductCategory,
    "deleteProductType",
    ()=>deleteProductType,
    "fetchBrands",
    ()=>fetchBrands,
    "fetchImporters",
    ()=>fetchImporters,
    "fetchProductCategories",
    ()=>fetchProductCategories,
    "fetchProductTypes",
    ()=>fetchProductTypes,
    "updateBrand",
    ()=>updateBrand,
    "updateImporter",
    ()=>updateImporter,
    "updateProductCategory",
    ()=>updateProductCategory,
    "updateProductType",
    ()=>updateProductType
]);
const BASE_URL = '/api/settings/inventory';
async function fetchProductTypes() {
    const res = await fetch(`${BASE_URL}/product-types`);
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
}
async function createProductType(data) {
    const res = await fetch(`${BASE_URL}/product-types`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create');
    return res.json();
}
async function updateProductType(systemId, data) {
    const res = await fetch(`${BASE_URL}/product-types/${systemId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update');
    return res.json();
}
async function deleteProductType(systemId) {
    const res = await fetch(`${BASE_URL}/product-types/${systemId}`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete');
}
async function fetchProductCategories() {
    const res = await fetch('/api/categories?all=true');
    if (!res.ok) throw new Error('Failed to fetch');
    const json = await res.json();
    return json.data || json;
}
async function createProductCategory(data) {
    const res = await fetch('/api/categories', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create');
    return res.json();
}
async function updateProductCategory(systemId, data) {
    const res = await fetch(`/api/categories/${systemId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update');
    return res.json();
}
async function deleteProductCategory(systemId) {
    const res = await fetch(`/api/categories/${systemId}`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete');
}
async function fetchBrands() {
    const res = await fetch('/api/brands?all=true');
    if (!res.ok) throw new Error('Failed to fetch');
    const json = await res.json();
    return json.data || json;
}
async function createBrand(data) {
    const res = await fetch('/api/brands', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create');
    return res.json();
}
async function updateBrand(systemId, data) {
    const res = await fetch(`/api/brands/${systemId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update');
    return res.json();
}
async function deleteBrand(systemId) {
    const res = await fetch(`/api/brands/${systemId}`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete');
}
async function fetchImporters() {
    const res = await fetch(`${BASE_URL}/importers`);
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
}
async function createImporter(data) {
    const res = await fetch(`${BASE_URL}/importers`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create');
    return res.json();
}
async function updateImporter(systemId, data) {
    const res = await fetch(`${BASE_URL}/importers/${systemId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update');
    return res.json();
}
async function deleteImporter(systemId) {
    const res = await fetch(`${BASE_URL}/importers/${systemId}`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete');
}
}),
"[project]/features/settings/inventory/hooks/use-inventory-settings.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "inventorySettingsKeys",
    ()=>inventorySettingsKeys,
    "useActiveBrands",
    ()=>useActiveBrands,
    "useActiveImporters",
    ()=>useActiveImporters,
    "useBrandMutations",
    ()=>useBrandMutations,
    "useImporterMutations",
    ()=>useImporterMutations,
    "useImporters",
    ()=>useImporters,
    "useInventoryBrands",
    ()=>useInventoryBrands,
    "useProductCategories",
    ()=>useProductCategories,
    "useProductCategoryMutations",
    ()=>useProductCategoryMutations,
    "useProductTypeMutations",
    ()=>useProductTypeMutations,
    "useProductTypes",
    ()=>useProductTypes,
    "useStorageLocations",
    ()=>useStorageLocations
]);
/**
 * Inventory Settings React Query Hooks
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$inventory$2f$api$2f$inventory$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/inventory/api/inventory-settings-api.ts [app-ssr] (ecmascript)");
;
;
const inventorySettingsKeys = {
    all: [
        'inventory-settings'
    ],
    productTypes: ()=>[
            ...inventorySettingsKeys.all,
            'product-types'
        ],
    categories: ()=>[
            ...inventorySettingsKeys.all,
            'categories'
        ],
    brands: ()=>[
            ...inventorySettingsKeys.all,
            'brands'
        ],
    importers: ()=>[
            ...inventorySettingsKeys.all,
            'importers'
        ]
};
function useProductTypes() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: inventorySettingsKeys.productTypes(),
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$inventory$2f$api$2f$inventory$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchProductTypes"],
        staleTime: 1000 * 60 * 10
    });
}
function useProductTypeMutations(opts) {
    const qc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const invalidate = ()=>qc.invalidateQueries({
            queryKey: inventorySettingsKeys.productTypes()
        });
    return {
        create: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$inventory$2f$api$2f$inventory$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createProductType"],
            onSuccess: ()=>{
                invalidate();
                opts?.onSuccess?.();
            }
        }),
        update: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: ({ systemId, data })=>__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$inventory$2f$api$2f$inventory$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateProductType"](systemId, data),
            onSuccess: ()=>{
                invalidate();
                opts?.onSuccess?.();
            }
        }),
        remove: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$inventory$2f$api$2f$inventory$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deleteProductType"],
            onSuccess: ()=>{
                invalidate();
                opts?.onSuccess?.();
            }
        })
    };
}
function useProductCategories() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: inventorySettingsKeys.categories(),
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$inventory$2f$api$2f$inventory$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchProductCategories"],
        staleTime: 1000 * 60 * 10
    });
}
function useProductCategoryMutations(opts) {
    const qc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const invalidate = ()=>qc.invalidateQueries({
            queryKey: inventorySettingsKeys.categories()
        });
    return {
        create: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$inventory$2f$api$2f$inventory$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createProductCategory"],
            onSuccess: ()=>{
                invalidate();
                opts?.onSuccess?.();
            }
        }),
        update: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: ({ systemId, data })=>__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$inventory$2f$api$2f$inventory$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateProductCategory"](systemId, data),
            onSuccess: ()=>{
                invalidate();
                opts?.onSuccess?.();
            }
        }),
        remove: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$inventory$2f$api$2f$inventory$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deleteProductCategory"],
            onSuccess: ()=>{
                invalidate();
                opts?.onSuccess?.();
            }
        })
    };
}
function useInventoryBrands() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: inventorySettingsKeys.brands(),
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$inventory$2f$api$2f$inventory$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchBrands"],
        staleTime: 1000 * 60 * 10
    });
}
function useBrandMutations(opts) {
    const qc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const invalidate = ()=>qc.invalidateQueries({
            queryKey: inventorySettingsKeys.brands()
        });
    return {
        create: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$inventory$2f$api$2f$inventory$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createBrand"],
            onSuccess: ()=>{
                invalidate();
                opts?.onSuccess?.();
            }
        }),
        update: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: ({ systemId, data })=>__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$inventory$2f$api$2f$inventory$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateBrand"](systemId, data),
            onSuccess: ()=>{
                invalidate();
                opts?.onSuccess?.();
            }
        }),
        remove: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$inventory$2f$api$2f$inventory$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deleteBrand"],
            onSuccess: ()=>{
                invalidate();
                opts?.onSuccess?.();
            }
        })
    };
}
function useImporters() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: inventorySettingsKeys.importers(),
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$inventory$2f$api$2f$inventory$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchImporters"],
        staleTime: 1000 * 60 * 10
    });
}
function useImporterMutations(opts) {
    const qc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const invalidate = ()=>qc.invalidateQueries({
            queryKey: inventorySettingsKeys.importers()
        });
    return {
        create: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$inventory$2f$api$2f$inventory$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createImporter"],
            onSuccess: ()=>{
                invalidate();
                opts?.onSuccess?.();
            }
        }),
        update: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: ({ systemId, data })=>__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$inventory$2f$api$2f$inventory$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateImporter"](systemId, data),
            onSuccess: ()=>{
                invalidate();
                opts?.onSuccess?.();
            }
        }),
        remove: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$inventory$2f$api$2f$inventory$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deleteImporter"],
            onSuccess: ()=>{
                invalidate();
                opts?.onSuccess?.();
            }
        })
    };
}
function useActiveBrands() {
    const query = useInventoryBrands();
    const data = (query.data || []).filter((b)=>b.isActive);
    return {
        ...query,
        data
    };
}
function useActiveImporters() {
    const query = useImporters();
    const data = (query.data || []).filter((i)=>i.isActive);
    return {
        ...query,
        data
    };
}
function useStorageLocations() {
    // Placeholder - returns empty array until storage locations API is implemented
    return {
        data: [],
        isLoading: false,
        isError: false,
        error: null
    };
}
}),
"[project]/features/settings/inventory/hooks/use-all-inventory-settings.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAllBrands",
    ()=>useAllBrands,
    "useAllImporters",
    ()=>useAllImporters,
    "useAllProductCategories",
    ()=>useAllProductCategories,
    "useBrandFinder",
    ()=>useBrandFinder,
    "useBrandOptions",
    ()=>useBrandOptions,
    "useProductCategoryFinder",
    ()=>useProductCategoryFinder,
    "useProductCategoryOptions",
    ()=>useProductCategoryOptions
]);
/**
 * Convenience hooks for inventory settings - flat array access
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$inventory$2f$hooks$2f$use$2d$inventory$2d$settings$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/inventory/hooks/use-inventory-settings.ts [app-ssr] (ecmascript)");
;
;
function useAllProductCategories() {
    const query = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$inventory$2f$hooks$2f$use$2d$inventory$2d$settings$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductCategories"])();
    return {
        data: query.data || [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error
    };
}
function useProductCategoryOptions() {
    const { data, isLoading } = useAllProductCategories();
    const options = data.map((c)=>({
            value: c.systemId,
            label: c.name
        }));
    return {
        options,
        isLoading
    };
}
function useProductCategoryFinder() {
    const { data } = useAllProductCategories();
    const findById = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((systemId)=>{
        return data.find((c)=>c.systemId === systemId);
    }, [
        data
    ]);
    return {
        findById
    };
}
function useAllBrands() {
    const query = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$inventory$2f$hooks$2f$use$2d$inventory$2d$settings$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useInventoryBrands"])();
    return {
        data: query.data || [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error
    };
}
function useBrandOptions() {
    const { data, isLoading } = useAllBrands();
    const options = data.map((b)=>({
            value: b.systemId,
            label: b.name
        }));
    return {
        options,
        isLoading
    };
}
function useBrandFinder() {
    const { data } = useAllBrands();
    const findById = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((systemId)=>{
        return data.find((b)=>b.systemId === systemId);
    }, [
        data
    ]);
    return {
        findById
    };
}
function useAllImporters() {
    const query = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$inventory$2f$hooks$2f$use$2d$inventory$2d$settings$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useImporters"])();
    return {
        data: query.data || [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error
    };
}
}),
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
"[project]/features/settings/inventory/brand-store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useBrandStore",
    ()=>useBrandStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
;
;
const generateSystemId = (currentCounter)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(`BRAND${String(currentCounter + 1).padStart(6, '0')}`);
};
const generateBusinessId = (currentCounter)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(`TH${String(currentCounter + 1).padStart(6, '0')}`);
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
const useBrandStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((set, get)=>({
        data: [],
        counter: 0,
        initialized: false,
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
                                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(item.systemId),
                                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(item.id),
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
"[project]/features/settings/inventory/sla-settings-store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useSlaSettingsStore",
    ()=>useSlaSettingsStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
;
const defaultSettings = {
    // Ngưỡng mặc định
    defaultReorderLevel: 10,
    defaultSafetyStock: 5,
    defaultMaxStock: 100,
    // Cảnh báo hàng tồn lâu
    deadStockDays: 90,
    slowMovingDays: 30,
    // Notifications
    enableEmailAlerts: false,
    alertEmailRecipients: [],
    alertFrequency: 'daily',
    // Dashboard
    showOnDashboard: true,
    dashboardAlertTypes: [
        'out_of_stock',
        'low_stock',
        'below_safety'
    ]
};
// API sync helper
async function syncToAPI(settings) {
    try {
        const response = await fetch('/api/settings/product-sla', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(settings)
        });
        return response.ok;
    } catch (error) {
        console.error('[SLA Settings API] sync error:', error);
        return false;
    }
}
const useSlaSettingsStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((set, get)=>({
        settings: defaultSettings,
        initialized: false,
        update: (updates)=>{
            const newSettings = {
                ...get().settings,
                ...updates
            };
            set({
                settings: newSettings
            });
            syncToAPI(newSettings).catch(console.error);
        },
        reset: ()=>{
            set({
                settings: defaultSettings
            });
            syncToAPI(defaultSettings).catch(console.error);
        },
        loadFromAPI: async ()=>{
            if (get().initialized) return;
            try {
                const response = await fetch('/api/settings/product-sla');
                if (response.ok) {
                    const json = await response.json();
                    const data = json.data || json;
                    if (data && Object.keys(data).length > 0) {
                        set({
                            settings: {
                                ...defaultSettings,
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
                console.error('[SLA Settings Store] loadFromAPI error:', error);
            }
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
"[project]/features/settings/pricing/api/pricing-api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Pricing Settings API Layer
 * Handles all pricing policy-related API calls
 */ __turbopack_context__.s([
    "createPricingPolicy",
    ()=>createPricingPolicy,
    "deletePricingPolicy",
    ()=>deletePricingPolicy,
    "fetchActivePricingPolicies",
    ()=>fetchActivePricingPolicies,
    "fetchPricingPolicies",
    ()=>fetchPricingPolicies,
    "fetchPricingPoliciesByType",
    ()=>fetchPricingPoliciesByType,
    "fetchPricingPolicyById",
    ()=>fetchPricingPolicyById,
    "setDefaultPricingPolicy",
    ()=>setDefaultPricingPolicy,
    "updatePricingPolicy",
    ()=>updatePricingPolicy
]);
const BASE_URL = '/api/settings/pricing-policies';
const LEGACY_URL = '/api/settings/data?type=pricing-policy';
async function fetchPricingPolicies(filters = {}) {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.type) params.set('type', filters.type);
    if (filters.isActive !== undefined) params.set('isActive', String(filters.isActive));
    // Try new endpoint first, fallback to legacy
    let url = params.toString() ? `${BASE_URL}?${params}` : BASE_URL;
    let response = await fetch(url);
    // Fallback to legacy endpoint
    if (!response.ok && response.status === 404) {
        url = `${LEGACY_URL}${params.toString() ? '&' + params : ''}`;
        response = await fetch(url);
    }
    if (!response.ok) {
        throw new Error('Failed to fetch pricing policies');
    }
    return response.json();
}
async function fetchPricingPolicyById(systemId) {
    const response = await fetch(`${BASE_URL}/${systemId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch pricing policy');
    }
    return response.json();
}
async function createPricingPolicy(data) {
    const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const error = await response.json().catch(()=>({}));
        throw new Error(error.error || 'Failed to create pricing policy');
    }
    return response.json();
}
async function updatePricingPolicy(systemId, data) {
    const response = await fetch(`${BASE_URL}/${systemId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const error = await response.json().catch(()=>({}));
        throw new Error(error.error || 'Failed to update pricing policy');
    }
    return response.json();
}
async function deletePricingPolicy(systemId) {
    const response = await fetch(`${BASE_URL}/${systemId}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error('Failed to delete pricing policy');
    }
}
async function setDefaultPricingPolicy(systemId) {
    const response = await fetch(`${BASE_URL}/${systemId}/set-default`, {
        method: 'POST'
    });
    if (!response.ok) {
        throw new Error('Failed to set default pricing policy');
    }
    return response.json();
}
async function fetchActivePricingPolicies() {
    const response = await fetchPricingPolicies({
        isActive: true,
        limit: 100
    });
    return response.data;
}
async function fetchPricingPoliciesByType(type) {
    const response = await fetchPricingPolicies({
        type,
        isActive: true,
        limit: 100
    });
    return response.data;
}
}),
"[project]/features/settings/pricing/hooks/use-pricing.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "pricingPolicyKeys",
    ()=>pricingPolicyKeys,
    "useActivePricingPolicies",
    ()=>useActivePricingPolicies,
    "usePricingPolicies",
    ()=>usePricingPolicies,
    "usePricingPoliciesByType",
    ()=>usePricingPoliciesByType,
    "usePricingPolicyById",
    ()=>usePricingPolicyById,
    "usePricingPolicyMutations",
    ()=>usePricingPolicyMutations,
    "usePurchasePricingPolicies",
    ()=>usePurchasePricingPolicies,
    "useSalePricingPolicies",
    ()=>useSalePricingPolicies
]);
/**
 * Pricing Settings React Query Hooks
 * Provides data fetching and mutations for pricing policies
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pricing$2f$api$2f$pricing$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pricing/api/pricing-api.ts [app-ssr] (ecmascript)");
;
;
const pricingPolicyKeys = {
    all: [
        'pricing-policies'
    ],
    lists: ()=>[
            ...pricingPolicyKeys.all,
            'list'
        ],
    list: (filters)=>[
            ...pricingPolicyKeys.lists(),
            filters
        ],
    details: ()=>[
            ...pricingPolicyKeys.all,
            'detail'
        ],
    detail: (id)=>[
            ...pricingPolicyKeys.details(),
            id
        ],
    active: ()=>[
            ...pricingPolicyKeys.all,
            'active'
        ],
    byType: (type)=>[
            ...pricingPolicyKeys.all,
            'type',
            type
        ]
};
function usePricingPolicies(filters = {}) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: pricingPolicyKeys.list(filters),
        queryFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pricing$2f$api$2f$pricing$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchPricingPolicies"])(filters),
        staleTime: 1000 * 60 * 10
    });
}
function useActivePricingPolicies() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: pricingPolicyKeys.active(),
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pricing$2f$api$2f$pricing$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchActivePricingPolicies"],
        staleTime: 1000 * 60 * 10
    });
}
function usePricingPoliciesByType(type) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: pricingPolicyKeys.byType(type),
        queryFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pricing$2f$api$2f$pricing$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchPricingPoliciesByType"])(type),
        staleTime: 1000 * 60 * 10
    });
}
function usePricingPolicyById(systemId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: pricingPolicyKeys.detail(systemId),
        queryFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pricing$2f$api$2f$pricing$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchPricingPolicyById"])(systemId),
        enabled: !!systemId,
        staleTime: 1000 * 60 * 10
    });
}
function usePricingPolicyMutations(options = {}) {
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const invalidatePolicies = ()=>{
        queryClient.invalidateQueries({
            queryKey: pricingPolicyKeys.all
        });
    };
    const create = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: (data)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pricing$2f$api$2f$pricing$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createPricingPolicy"])(data),
        onSuccess: ()=>{
            invalidatePolicies();
            options.onSuccess?.();
        },
        onError: options.onError
    });
    const update = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: ({ systemId, data })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pricing$2f$api$2f$pricing$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updatePricingPolicy"])(systemId, data),
        onSuccess: ()=>{
            invalidatePolicies();
            options.onSuccess?.();
        },
        onError: options.onError
    });
    const remove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: (systemId)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pricing$2f$api$2f$pricing$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deletePricingPolicy"])(systemId),
        onSuccess: ()=>{
            invalidatePolicies();
            options.onSuccess?.();
        },
        onError: options.onError
    });
    const setDefault = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: (systemId)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pricing$2f$api$2f$pricing$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setDefaultPricingPolicy"])(systemId),
        onSuccess: ()=>{
            invalidatePolicies();
            options.onSuccess?.();
        },
        onError: options.onError
    });
    return {
        create,
        update,
        remove,
        setDefault,
        isLoading: create.isPending || update.isPending || remove.isPending || setDefault.isPending
    };
}
function useSalePricingPolicies() {
    return usePricingPoliciesByType('Bán hàng');
}
function usePurchasePricingPolicies() {
    return usePricingPoliciesByType('Nhập hàng');
}
}),
"[project]/features/settings/pricing/hooks/use-all-pricing-policies.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAllPricingPolicies",
    ()=>useAllPricingPolicies,
    "useDefaultSellingPolicy",
    ()=>useDefaultSellingPolicy,
    "useSellingPolicies",
    ()=>useSellingPolicies
]);
/**
 * useAllPricingPolicies - Convenience hook for components needing all policies as flat array
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pricing$2f$hooks$2f$use$2d$pricing$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pricing/hooks/use-pricing.ts [app-ssr] (ecmascript)");
;
;
function useAllPricingPolicies() {
    const query = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pricing$2f$hooks$2f$use$2d$pricing$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePricingPolicies"])({});
    return {
        data: query.data?.data || [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error
    };
}
function useDefaultSellingPolicy() {
    const { data, isLoading } = useAllPricingPolicies();
    const defaultPolicy = data.find((p)=>p.type === 'Bán hàng' && p.isDefault);
    return {
        defaultPolicy,
        isLoading
    };
}
function useSellingPolicies() {
    const { data, isLoading } = useAllPricingPolicies();
    const sellingPolicies = data.filter((p)=>p.type === 'Bán hàng');
    return {
        data: sellingPolicies,
        isLoading
    };
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
"[project]/features/settings/store-info/store-info-store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getDefaultStoreInfo",
    ()=>getDefaultStoreInfo,
    "useStoreInfoStore",
    ()=>useStoreInfoStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
;
const defaultInfo = {
    companyName: '',
    brandName: '',
    logo: '',
    taxCode: '',
    registrationNumber: '',
    representativeName: '',
    representativeTitle: '',
    hotline: '',
    email: '',
    website: '',
    headquartersAddress: '',
    ward: '',
    district: '',
    province: '',
    note: '',
    bankAccountName: '',
    bankAccountNumber: '',
    bankName: '',
    updatedAt: undefined,
    updatedBySystemId: undefined,
    updatedByName: undefined
};
const useStoreInfoStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((set)=>({
        info: {
            ...defaultInfo
        },
        updateInfo: (values, metadata)=>set(()=>({
                    info: {
                        ...values,
                        updatedAt: new Date().toISOString(),
                        updatedBySystemId: metadata?.updatedBySystemId,
                        updatedByName: metadata?.updatedByName
                    }
                })),
        reset: ()=>set(()=>({
                    info: {
                        ...defaultInfo
                    }
                })),
        // Load from API - should be called on app init
        loadFromAPI: async ()=>{
            try {
                const res = await fetch('/api/settings?key=store-info');
                if (res.ok) {
                    const data = await res.json();
                    if (data?.value) {
                        set({
                            info: {
                                ...defaultInfo,
                                ...data.value
                            }
                        });
                    }
                }
            } catch (error) {
                console.error('[StoreInfo] Failed to load from API:', error);
            }
        },
        // Save to API
        saveToAPI: async ()=>{
            try {
                const state = useStoreInfoStore.getState();
                await fetch('/api/settings', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        key: 'store-info',
                        group: 'store',
                        value: state.info
                    })
                });
            } catch (error) {
                console.error('[StoreInfo] Failed to save to API:', error);
            }
        }
    }));
function getDefaultStoreInfo() {
    return {
        ...defaultInfo
    };
}
}),
];

//# sourceMappingURL=features_settings_c8314fab._.js.map