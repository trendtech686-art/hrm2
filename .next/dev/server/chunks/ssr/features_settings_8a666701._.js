module.exports = [
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
"[project]/features/settings/store-info/api/store-info-api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Store Info Settings API Layer
 * Handles all store information settings API calls
 */ __turbopack_context__.s([
    "fetchStoreInfo",
    ()=>fetchStoreInfo,
    "resetStoreInfo",
    ()=>resetStoreInfo,
    "updateStoreInfo",
    ()=>updateStoreInfo,
    "uploadStoreLogo",
    ()=>uploadStoreLogo
]);
const BASE_URL = '/api/settings/store-info';
async function fetchStoreInfo() {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
        throw new Error('Failed to fetch store info');
    }
    return response.json();
}
async function updateStoreInfo(data, metadata) {
    const response = await fetch(BASE_URL, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ...data,
            ...metadata
        })
    });
    if (!response.ok) {
        const error = await response.json().catch(()=>({}));
        throw new Error(error.error || 'Failed to update store info');
    }
    return response.json();
}
async function resetStoreInfo() {
    const response = await fetch(`${BASE_URL}/reset`, {
        method: 'POST'
    });
    if (!response.ok) {
        throw new Error('Failed to reset store info');
    }
    return response.json();
}
async function uploadStoreLogo(file) {
    const formData = new FormData();
    formData.append('logo', file);
    const response = await fetch(`${BASE_URL}/logo`, {
        method: 'POST',
        body: formData
    });
    if (!response.ok) {
        throw new Error('Failed to upload logo');
    }
    return response.json();
}
}),
"[project]/features/settings/store-info/hooks/use-store-info.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "storeInfoKeys",
    ()=>storeInfoKeys,
    "useStoreInfo",
    ()=>useStoreInfo,
    "useStoreInfoMutations",
    ()=>useStoreInfoMutations
]);
/**
 * Store Info Settings React Query Hooks
 * Provides data fetching and mutations for store information
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$store$2d$info$2f$api$2f$store$2d$info$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/store-info/api/store-info-api.ts [app-ssr] (ecmascript)");
;
;
const storeInfoKeys = {
    all: [
        'store-info'
    ],
    info: ()=>[
            ...storeInfoKeys.all,
            'current'
        ]
};
function useStoreInfo() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: storeInfoKeys.info(),
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$store$2d$info$2f$api$2f$store$2d$info$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchStoreInfo"],
        staleTime: 1000 * 60 * 30
    });
}
function useStoreInfoMutations(options = {}) {
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const invalidateInfo = ()=>{
        queryClient.invalidateQueries({
            queryKey: storeInfoKeys.all
        });
    };
    const update = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: ({ data, metadata })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$store$2d$info$2f$api$2f$store$2d$info$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateStoreInfo"])(data, metadata),
        onSuccess: ()=>{
            invalidateInfo();
            options.onSuccess?.();
        },
        onError: options.onError
    });
    const reset = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$store$2d$info$2f$api$2f$store$2d$info$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resetStoreInfo"])(),
        onSuccess: ()=>{
            invalidateInfo();
            options.onSuccess?.();
        },
        onError: options.onError
    });
    const uploadLogo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: (file)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$store$2d$info$2f$api$2f$store$2d$info$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["uploadStoreLogo"])(file),
        onSuccess: ()=>{
            invalidateInfo();
            options.onSuccess?.();
        },
        onError: options.onError
    });
    return {
        update,
        reset,
        uploadLogo,
        isLoading: update.isPending || reset.isPending || uploadLogo.isPending
    };
}
}),
];

//# sourceMappingURL=features_settings_8a666701._.js.map