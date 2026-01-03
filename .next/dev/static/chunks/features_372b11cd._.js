(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/features/settings/inventory/product-category-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useProductCategoryStore",
    ()=>useProductCategoryStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-client] (ecmascript)");
;
;
;
const generateSystemId = (counter)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(`CATEGORY${String(counter + 1).padStart(6, '0')}`);
};
const generateBusinessId = (counter)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])(`DM${String(counter + 1).padStart(6, '0')}`);
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
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(item.systemId),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])(item.id),
        parentId: 'parentId' in item && item.parentId ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(item.parentId) : undefined
    }));
const INITIAL_COUNTER = rawData.length;
const useProductCategoryStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        data: initialData,
        counter: INITIAL_COUNTER,
        add: (category)=>{
            const currentCounter = get().counter;
            const allData = get().data;
            const { id, ...rest } = category;
            const businessId = id && id.trim() ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])(id.trim()) : generateBusinessId(currentCounter);
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/products/data.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "data",
    ()=>data
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-client] (ecmascript)");
;
const SEED_AUTHOR = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000001');
const buildAuditFields = (createdAt, createdBy = SEED_AUTHOR)=>({
        createdAt,
        updatedAt: createdAt,
        createdBy,
        updatedBy: createdBy
    });
const data = [
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000001'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000001'),
        name: 'Laptop Dell Inspiron 15',
        thumbnailImage: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=600&q=80',
        unit: 'Chiếc',
        costPrice: 12000000,
        prices: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PP000001')]: 15000000
        },
        inventoryByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 50,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 30
        },
        committedByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 1,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        inTransitByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 0,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        ...buildAuditFields('2024-01-01T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000002'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000002'),
        name: 'Chuột Logitech MX Master 3',
        thumbnailImage: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=600&q=80',
        unit: 'Chiếc',
        costPrice: 1500000,
        prices: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PP000001')]: 2000000
        },
        inventoryByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 100,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 80
        },
        committedByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 1,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        inTransitByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 0,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        ...buildAuditFields('2024-01-02T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000003'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000003'),
        name: 'Điện thoại iPhone 15 Pro',
        thumbnailImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
        unit: 'Chiếc',
        costPrice: 25000000,
        prices: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PP000001')]: 28000000
        },
        inventoryByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 20,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 15
        },
        committedByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 1,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        inTransitByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 0,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        ...buildAuditFields('2024-01-03T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000004'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000004'),
        name: 'Ốp lưng iPhone 15 Pro',
        thumbnailImage: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80',
        unit: 'Chiếc',
        costPrice: 200000,
        prices: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PP000001')]: 300000
        },
        inventoryByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 200,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 150
        },
        committedByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 2,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        inTransitByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 0,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        ...buildAuditFields('2024-01-04T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000005'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000005'),
        name: 'Máy tính bảng iPad Air',
        thumbnailImage: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&q=80',
        unit: 'Chiếc',
        costPrice: 15000000,
        prices: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PP000001')]: 18000000
        },
        inventoryByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 30,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 20
        },
        committedByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 1,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        inTransitByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 0,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        ...buildAuditFields('2024-01-05T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000006'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000006'),
        name: 'Đồng hồ Apple Watch Series 9',
        thumbnailImage: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=600&q=80',
        unit: 'Chiếc',
        costPrice: 10000000,
        prices: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PP000001')]: 12000000
        },
        inventoryByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 40,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 25
        },
        committedByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 1,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        inTransitByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 0,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        ...buildAuditFields('2024-01-06T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000007'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000007'),
        name: 'Tai nghe AirPods Pro',
        thumbnailImage: 'https://images.unsplash.com/photo-1519671282429-b44660ead0a7?auto=format&fit=crop&w=600&q=80',
        unit: 'Chiếc',
        costPrice: 5000000,
        prices: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PP000001')]: 6000000
        },
        inventoryByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 60,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 40
        },
        committedByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 1,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        inTransitByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 0,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        ...buildAuditFields('2024-01-07T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000008'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000008'),
        name: 'Bàn phím cơ Keychron K2',
        thumbnailImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
        unit: 'Chiếc',
        costPrice: 2000000,
        prices: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PP000001')]: 2500000
        },
        inventoryByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 35,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 25
        },
        committedByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 1,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        inTransitByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 0,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        ...buildAuditFields('2024-01-08T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000009'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000009'),
        name: 'Keycap custom',
        thumbnailImage: 'https://images.unsplash.com/photo-1505740106531-4243f3831c78?auto=format&fit=crop&w=600&q=80',
        unit: 'Bộ',
        costPrice: 600000,
        prices: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PP000001')]: 800000
        },
        inventoryByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 50,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 30
        },
        committedByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 1,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        inTransitByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 0,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        ...buildAuditFields('2024-01-09T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000010'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000010'),
        name: 'Switch Gateron Yellow',
        thumbnailImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80',
        unit: 'Cái',
        costPrice: 3000,
        prices: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PP000001')]: 5000
        },
        inventoryByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 500,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 300
        },
        committedByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 90,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        inTransitByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 0,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        ...buildAuditFields('2024-01-10T08:00:00Z')
    },
    // ═══════════════════════════════════════════════════════════════
    // COMBO PRODUCTS - Sản phẩm bundle
    // ═══════════════════════════════════════════════════════════════
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000011'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('COMBO001'),
        name: 'Combo Bàn phím + Keycap + Switch',
        thumbnailImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
        shortDescription: 'Bộ combo custom keyboard siêu hot',
        type: 'combo',
        unit: 'Bộ',
        costPrice: 0,
        prices: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PP000001')]: 3000000
        },
        inventoryByBranch: {},
        committedByBranch: {},
        inTransitByBranch: {},
        // Combo items: Bàn phím (1) + Keycap (1) + Switch (90 cái)
        comboItems: [
            {
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000008'),
                quantity: 1
            },
            {
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000009'),
                quantity: 1
            },
            {
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000010'),
                quantity: 90
            }
        ],
        comboPricingType: 'sum_discount_percent',
        comboDiscount: 10,
        status: 'active',
        ...buildAuditFields('2024-06-01T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000012'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('COMBO002'),
        name: 'Combo iPhone + Ốp lưng',
        thumbnailImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
        shortDescription: 'Mua iPhone kèm ốp lưng giá ưu đãi',
        type: 'combo',
        unit: 'Bộ',
        costPrice: 0,
        prices: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PP000001')]: 27500000
        },
        inventoryByBranch: {},
        committedByBranch: {},
        inTransitByBranch: {},
        comboItems: [
            {
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000003'),
                quantity: 1
            },
            {
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000004'),
                quantity: 1
            }
        ],
        comboPricingType: 'sum_discount_amount',
        comboDiscount: 800000,
        status: 'active',
        ...buildAuditFields('2024-06-15T08:00:00Z')
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/products/store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useProductStore",
    ()=>useProductStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/products/data.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/fuse.js/dist/fuse.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/activity-history-helper.ts [app-client] (ecmascript)");
;
;
;
;
;
;
const baseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCrudStore"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["data"], 'products', {
    businessIdField: 'id',
    persistKey: 'hrm-products',
    getCurrentUser: __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentUserSystemId"]
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
    const fuse = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](allProducts, {
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
                value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(result.item.systemId),
                label: `${result.item.name} (${result.item.id})`
            })),
        hasNextPage: endIndex < results.length
    };
};
// Wrapped add method with activity history logging
const addProduct = (product)=>{
    const userInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentUserInfo"])();
    const newProduct = baseStore.getState().add(product);
    // Add activity history entry
    const historyEntry = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCreatedEntry"])(userInfo, `${userInfo.name} đã tạo sản phẩm ${newProduct.name} (${newProduct.id})`);
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
    const userInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentUserInfo"])();
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
            historyEntries.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createStatusChangedEntry"])(userInfo, statusLabels[existingProduct.status || 'active'], statusLabels[updatedProduct.status || 'active'], `${userInfo.name} đã đổi trạng thái từ "${statusLabels[existingProduct.status || 'active']}" sang "${statusLabels[updatedProduct.status || 'active']}"`));
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
            historyEntries.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createUpdatedEntry"])(userInfo, `${userInfo.name} đã cập nhật: ${changes.join(', ')}`));
        }
    }
    const productWithHistory = {
        ...updatedProduct,
        activityHistory: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["appendHistoryEntry"])(existingProduct?.activityHistory, ...historyEntries)
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/categories/columns.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getColumns",
    ()=>getColumns
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/checkbox.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$column$2d$header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/data-table/data-table-column-header.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$switch$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/switch.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis.js [app-client] (ecmascript) <export default as MoreHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/image.js [app-client] (ecmascript) <export default as Image>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/package.js [app-client] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pencil.js [app-client] (ecmascript) <export default as Pencil>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-client] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-x.js [app-client] (ecmascript) <export default as XCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-client] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$text$2d$align$2d$start$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlignLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/text-align-start.js [app-client] (ecmascript) <export default as AlignLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/external-link.js [app-client] (ecmascript) <export default as ExternalLink>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$unlink$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Unlink$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/unlink.js [app-client] (ecmascript) <export default as Unlink>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/globe.js [app-client] (ecmascript) <export default as Globe>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Link2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/link-2.js [app-client] (ecmascript) <export default as Link2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderEdit$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/folder-pen.js [app-client] (ecmascript) <export default as FolderEdit>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dropdown-menu.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/avatar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/products/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$inline$2d$editable$2d$cell$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/shared/inline-editable-cell.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/alert-dialog.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
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
// SEO Score calculation
const calculateSeoScore = (category, website)=>{
    const seo = category.websiteSeo?.[website];
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
    if (score >= 80) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
        variant: "default",
        className: "bg-green-100 text-green-800 hover:bg-green-100",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                className: "h-3 w-3 mr-1"
            }, void 0, false, {
                fileName: "[project]/features/categories/columns.tsx",
                lineNumber: 42,
                columnNumber: 111
            }, ("TURBOPACK compile-time value", void 0)),
            " ",
            score,
            "%"
        ]
    }, void 0, true, {
        fileName: "[project]/features/categories/columns.tsx",
        lineNumber: 42,
        columnNumber: 27
    }, ("TURBOPACK compile-time value", void 0));
    if (score >= 50) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
        variant: "secondary",
        className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                className: "h-3 w-3 mr-1"
            }, void 0, false, {
                fileName: "[project]/features/categories/columns.tsx",
                lineNumber: 43,
                columnNumber: 116
            }, ("TURBOPACK compile-time value", void 0)),
            " ",
            score,
            "%"
        ]
    }, void 0, true, {
        fileName: "[project]/features/categories/columns.tsx",
        lineNumber: 43,
        columnNumber: 27
    }, ("TURBOPACK compile-time value", void 0));
    if (score > 0) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
        variant: "secondary",
        className: "bg-red-100 text-red-800 hover:bg-red-100",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"], {
                className: "h-3 w-3 mr-1"
            }, void 0, false, {
                fileName: "[project]/features/categories/columns.tsx",
                lineNumber: 44,
                columnNumber: 105
            }, ("TURBOPACK compile-time value", void 0)),
            " ",
            score,
            "%"
        ]
    }, void 0, true, {
        fileName: "[project]/features/categories/columns.tsx",
        lineNumber: 44,
        columnNumber: 25
    }, ("TURBOPACK compile-time value", void 0));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
        variant: "outline",
        className: "text-muted-foreground",
        children: "—"
    }, void 0, false, {
        fileName: "[project]/features/categories/columns.tsx",
        lineNumber: 45,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
function PkgxActionsCell({ row, hasPkgxMapping, pkgxCatId, onPkgxSyncSeo, onPkgxSyncDescription, onPkgxSyncAll, onPkgxSyncBasic, onPkgxLink, onPkgxUnlink }) {
    _s();
    const [confirmAction, setConfirmAction] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]({
        open: false,
        title: '',
        description: '',
        action: null
    });
    const handleConfirm = (title, description, action)=>{
        setConfirmAction({
            open: true,
            title,
            description,
            action
        });
    };
    const executeAction = ()=>{
        if (confirmAction.action) {
            confirmAction.action();
        }
        setConfirmAction({
            open: false,
            title: '',
            description: '',
            action: null
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-center",
                onClick: (e)=>e.stopPropagation(),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenu"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                            asChild: true,
                            onClick: (e)=>e.stopPropagation(),
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "ghost",
                                className: `h-8 w-8 p-0 ${hasPkgxMapping ? "text-primary" : "text-muted-foreground"}`,
                                onClick: (e)=>e.stopPropagation(),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "sr-only",
                                        children: "PKGX menu"
                                    }, void 0, false, {
                                        fileName: "[project]/features/categories/columns.tsx",
                                        lineNumber: 102,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__["MoreHorizontal"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/features/categories/columns.tsx",
                                        lineNumber: 103,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/categories/columns.tsx",
                                lineNumber: 97,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/features/categories/columns.tsx",
                            lineNumber: 96,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                            align: "end",
                            onClick: (e)=>e.stopPropagation(),
                            children: hasPkgxMapping ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    onPkgxSyncAll && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                        onSelect: ()=>handleConfirm('Đồng bộ tất cả', `Bạn có chắc muốn đồng bộ TẤT CẢ thông tin danh mục "${row.name}" lên PKGX?`, ()=>onPkgxSyncAll(row)),
                                        className: "font-medium",
                                        title: "Đồng bộ: Keywords, Meta Title, Meta Desc, Mô tả ngắn, Mô tả dài",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                                className: "mr-2 h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/features/categories/columns.tsx",
                                                lineNumber: 120,
                                                columnNumber: 21
                                            }, this),
                                            "Đồng bộ tất cả"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/categories/columns.tsx",
                                        lineNumber: 111,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                                        fileName: "[project]/features/categories/columns.tsx",
                                        lineNumber: 124,
                                        columnNumber: 17
                                    }, this),
                                    onPkgxSyncSeo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                        onSelect: ()=>handleConfirm('Đồng bộ SEO', `Đồng bộ SEO (keywords, meta title, meta description) của "${row.name}" lên PKGX?`, ()=>onPkgxSyncSeo(row)),
                                        title: "Đồng bộ: Keywords, Meta Title, Meta Desc",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                className: "mr-2 h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/features/categories/columns.tsx",
                                                lineNumber: 136,
                                                columnNumber: 21
                                            }, this),
                                            "SEO"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/categories/columns.tsx",
                                        lineNumber: 128,
                                        columnNumber: 19
                                    }, this),
                                    onPkgxSyncDescription && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                        onSelect: ()=>handleConfirm('Đồng bộ mô tả', `Đồng bộ mô tả danh mục "${row.name}" lên PKGX?`, ()=>onPkgxSyncDescription(row)),
                                        title: "Đồng bộ: Mô tả ngắn (Short Desc), Mô tả dài (Long Desc)",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$text$2d$align$2d$start$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlignLeft$3e$__["AlignLeft"], {
                                                className: "mr-2 h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/features/categories/columns.tsx",
                                                lineNumber: 149,
                                                columnNumber: 21
                                            }, this),
                                            "Mô tả"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/categories/columns.tsx",
                                        lineNumber: 141,
                                        columnNumber: 19
                                    }, this),
                                    onPkgxSyncBasic && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                        onSelect: ()=>handleConfirm('Đồng bộ thông tin cơ bản', `Đồng bộ thông tin cơ bản (Tên, Trạng thái hiển thị) của "${row.name}" lên PKGX?`, ()=>onPkgxSyncBasic(row)),
                                        title: "Đồng bộ: Tên danh mục, Trạng thái hiển thị",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderEdit$3e$__["FolderEdit"], {
                                                className: "mr-2 h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/features/categories/columns.tsx",
                                                lineNumber: 162,
                                                columnNumber: 21
                                            }, this),
                                            "Thông tin cơ bản"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/categories/columns.tsx",
                                        lineNumber: 154,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                                        fileName: "[project]/features/categories/columns.tsx",
                                        lineNumber: 167,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                        onSelect: ()=>window.open(`https://phukiengiaxuong.com.vn/admin/category.php?act=edit&cat_id=${pkgxCatId}`, '_blank'),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                                                className: "mr-2 h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/features/categories/columns.tsx",
                                                lineNumber: 171,
                                                columnNumber: 19
                                            }, this),
                                            "Xem trên PKGX"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/categories/columns.tsx",
                                        lineNumber: 168,
                                        columnNumber: 17
                                    }, this),
                                    onPkgxUnlink && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                                                fileName: "[project]/features/categories/columns.tsx",
                                                lineNumber: 178,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                onSelect: ()=>handleConfirm('Hủy liên kết PKGX', `Bạn có chắc muốn hủy liên kết danh mục "${row.name}" với PKGX?`, ()=>onPkgxUnlink(row)),
                                                className: "text-destructive",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$unlink$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Unlink$3e$__["Unlink"], {
                                                        className: "mr-2 h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/categories/columns.tsx",
                                                        lineNumber: 187,
                                                        columnNumber: 23
                                                    }, this),
                                                    "Hủy liên kết"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/categories/columns.tsx",
                                                lineNumber: 179,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true)
                                ]
                            }, void 0, true) : /* Not linked - show link option */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: onPkgxLink && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                    onSelect: ()=>onPkgxLink(row),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Link2$3e$__["Link2"], {
                                            className: "mr-2 h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/features/categories/columns.tsx",
                                            lineNumber: 198,
                                            columnNumber: 21
                                        }, this),
                                        "Liên kết với PKGX"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/categories/columns.tsx",
                                    lineNumber: 197,
                                    columnNumber: 19
                                }, this)
                            }, void 0, false)
                        }, void 0, false, {
                            fileName: "[project]/features/categories/columns.tsx",
                            lineNumber: 106,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/categories/columns.tsx",
                    lineNumber: 95,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/categories/columns.tsx",
                lineNumber: 94,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialog"], {
                open: confirmAction.open,
                onOpenChange: (open)=>!open && setConfirmAction({
                        open: false,
                        title: '',
                        description: '',
                        action: null
                    }),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogContent"], {
                    onClick: (e)=>e.stopPropagation(),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogHeader"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogTitle"], {
                                    children: confirmAction.title
                                }, void 0, false, {
                                    fileName: "[project]/features/categories/columns.tsx",
                                    lineNumber: 212,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogDescription"], {
                                    children: confirmAction.description
                                }, void 0, false, {
                                    fileName: "[project]/features/categories/columns.tsx",
                                    lineNumber: 213,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/categories/columns.tsx",
                            lineNumber: 211,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogFooter"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogCancel"], {
                                    onClick: (e)=>e.stopPropagation(),
                                    children: "Hủy"
                                }, void 0, false, {
                                    fileName: "[project]/features/categories/columns.tsx",
                                    lineNumber: 216,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogAction"], {
                                    onClick: (e)=>{
                                        e.stopPropagation();
                                        executeAction();
                                    },
                                    children: "Xác nhận"
                                }, void 0, false, {
                                    fileName: "[project]/features/categories/columns.tsx",
                                    lineNumber: 217,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/categories/columns.tsx",
                            lineNumber: 215,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/categories/columns.tsx",
                    lineNumber: 210,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/categories/columns.tsx",
                lineNumber: 209,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(PkgxActionsCell, "BDMW2fk4XuxIybOll7Cwqe+wsws=");
_c = PkgxActionsCell;
const getColumns = (onDelete, onToggleActive, navigate, allCategories, onUpdateName, onUpdateSortOrder, // PKGX handlers
onPkgxSyncSeo, onPkgxSyncDescription, onPkgxSyncAll, onPkgxSyncBasic, hasPkgxMapping, getPkgxCatId, onPkgxLink, onPkgxUnlink)=>{
    // Get product counts per category - không dùng useMemo vì đây không phải React component
    const productStore = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductStore"].getState();
    const productCountByCategory = {};
    productStore.data.forEach((p)=>{
        if (p.categorySystemId && !p.isDeleted) {
            productCountByCategory[String(p.categorySystemId)] = (productCountByCategory[String(p.categorySystemId)] || 0) + 1;
        }
    });
    return [
        {
            id: "select",
            header: ({ isAllPageRowsSelected, isSomePageRowsSelected, onToggleAll })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Checkbox"], {
                    checked: isAllPageRowsSelected ? true : isSomePageRowsSelected ? "indeterminate" : false,
                    onCheckedChange: (value)=>onToggleAll?.(!!value),
                    "aria-label": "Select all"
                }, void 0, false, {
                    fileName: "[project]/features/categories/columns.tsx",
                    lineNumber: 255,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            cell: ({ onToggleSelect, isSelected })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Checkbox"], {
                    checked: isSelected,
                    onCheckedChange: onToggleSelect,
                    "aria-label": "Select row"
                }, void 0, false, {
                    fileName: "[project]/features/categories/columns.tsx",
                    lineNumber: 262,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            size: 48,
            meta: {
                displayName: "Chọn",
                sticky: "left"
            }
        },
        // Thumbnail Image
        {
            id: "thumbnailImage",
            accessorKey: "thumbnailImage",
            header: "Ảnh",
            cell: ({ row })=>{
                const category = row;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Avatar"], {
                    className: "h-10 w-10 rounded-md",
                    children: [
                        category.thumbnailImage ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AvatarImage"], {
                            src: category.thumbnailImage,
                            alt: category.name,
                            className: "object-cover"
                        }, void 0, false, {
                            fileName: "[project]/features/categories/columns.tsx",
                            lineNumber: 284,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)) : null,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AvatarFallback"], {
                            className: "rounded-md bg-muted",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__["Image"], {
                                className: "h-4 w-4 text-muted-foreground"
                            }, void 0, false, {
                                fileName: "[project]/features/categories/columns.tsx",
                                lineNumber: 287,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/features/categories/columns.tsx",
                            lineNumber: 286,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/categories/columns.tsx",
                    lineNumber: 282,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0));
            },
            size: 60,
            meta: {
                displayName: "Ảnh",
                group: "Thông tin cơ bản"
            }
        },
        // Mã danh mục
        {
            id: "id",
            accessorKey: "id",
            header: ({ sorting, setSorting })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$column$2d$header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DataTableColumnHeader"], {
                    title: "Mã",
                    sortKey: "id",
                    isSorted: sorting?.id === 'id',
                    sortDirection: sorting?.desc ? 'desc' : 'asc',
                    onSort: ()=>setSorting?.((s)=>({
                                id: 'id',
                                desc: s.id === 'id' ? !s.desc : false
                            }))
                }, void 0, false, {
                    fileName: "[project]/features/categories/columns.tsx",
                    lineNumber: 303,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            cell: ({ row })=>{
                const category = row;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "font-mono text-xs text-muted-foreground",
                    children: category.id
                }, void 0, false, {
                    fileName: "[project]/features/categories/columns.tsx",
                    lineNumber: 314,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0));
            },
            size: 100,
            meta: {
                displayName: "Mã danh mục",
                group: "Thông tin cơ bản"
            }
        },
        // Tên danh mục với indent + inline editing
        {
            id: "name",
            accessorKey: "name",
            header: ({ sorting, setSorting })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$column$2d$header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DataTableColumnHeader"], {
                    title: "Tên danh mục",
                    sortKey: "name",
                    isSorted: sorting?.id === 'name',
                    sortDirection: sorting?.desc ? 'desc' : 'asc',
                    onSort: ()=>setSorting?.((s)=>({
                                id: 'name',
                                desc: s.id === 'name' ? !s.desc : false
                            }))
                }, void 0, false, {
                    fileName: "[project]/features/categories/columns.tsx",
                    lineNumber: 330,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            cell: ({ row })=>{
                const category = row;
                const level = category.level ?? 0;
                const indent = level * 24;
                const hasMapping = hasPkgxMapping?.(category) ?? false;
                if (onUpdateName) {
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            paddingLeft: `${indent}px`
                        },
                        className: "flex items-center gap-1",
                        children: [
                            level > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-muted-foreground/50",
                                children: "└"
                            }, void 0, false, {
                                fileName: "[project]/features/categories/columns.tsx",
                                lineNumber: 347,
                                columnNumber: 27
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$inline$2d$editable$2d$cell$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InlineEditableCell"], {
                                value: category.name,
                                onSave: (newName)=>onUpdateName(String(category.systemId), newName),
                                inputClassName: "h-7 text-sm w-48",
                                renderDisplay: (value, onEdit)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2 group",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-medium truncate cursor-pointer hover:text-primary",
                                                onClick: ()=>navigate(`/categories/${category.systemId}`),
                                                children: value
                                            }, void 0, false, {
                                                fileName: "[project]/features/categories/columns.tsx",
                                                lineNumber: 354,
                                                columnNumber: 19
                                            }, void 0),
                                            hasMapping && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                variant: "secondary",
                                                className: "text-xs",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__["Globe"], {
                                                        className: "h-3 w-3 mr-1"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/categories/columns.tsx",
                                                        lineNumber: 362,
                                                        columnNumber: 23
                                                    }, void 0),
                                                    "PKGX"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/categories/columns.tsx",
                                                lineNumber: 361,
                                                columnNumber: 21
                                            }, void 0),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                variant: "ghost",
                                                size: "icon",
                                                className: "h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0",
                                                onClick: (e)=>{
                                                    e.stopPropagation();
                                                    onEdit();
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__["Pencil"], {
                                                    className: "h-3 w-3"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/categories/columns.tsx",
                                                    lineNumber: 375,
                                                    columnNumber: 21
                                                }, void 0)
                                            }, void 0, false, {
                                                fileName: "[project]/features/categories/columns.tsx",
                                                lineNumber: 366,
                                                columnNumber: 19
                                            }, void 0)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/categories/columns.tsx",
                                        lineNumber: 353,
                                        columnNumber: 17
                                    }, void 0)
                            }, void 0, false, {
                                fileName: "[project]/features/categories/columns.tsx",
                                lineNumber: 348,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/categories/columns.tsx",
                        lineNumber: 346,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0));
                }
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-2 cursor-pointer hover:text-primary",
                    style: {
                        paddingLeft: `${indent}px`
                    },
                    onClick: ()=>navigate(`/categories/${category.systemId}`),
                    children: [
                        level > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-muted-foreground/50",
                            children: "└"
                        }, void 0, false, {
                            fileName: "[project]/features/categories/columns.tsx",
                            lineNumber: 390,
                            columnNumber: 25
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "font-medium truncate",
                            children: category.name
                        }, void 0, false, {
                            fileName: "[project]/features/categories/columns.tsx",
                            lineNumber: 391,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        hasMapping && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                            variant: "secondary",
                            className: "text-xs",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__["Globe"], {
                                    className: "h-3 w-3 mr-1"
                                }, void 0, false, {
                                    fileName: "[project]/features/categories/columns.tsx",
                                    lineNumber: 394,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                "PKGX"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/categories/columns.tsx",
                            lineNumber: 393,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/categories/columns.tsx",
                    lineNumber: 385,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0));
            },
            size: 300,
            meta: {
                displayName: "Tên danh mục",
                group: "Thông tin cơ bản"
            }
        },
        // Thứ tự sắp xếp
        {
            id: "sortOrder",
            accessorKey: "sortOrder",
            header: ({ sorting, setSorting })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$column$2d$header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DataTableColumnHeader"], {
                    title: "STT",
                    sortKey: "sortOrder",
                    isSorted: sorting?.id === 'sortOrder',
                    sortDirection: sorting?.desc ? 'desc' : 'asc',
                    onSort: ()=>setSorting?.((s)=>({
                                id: 'sortOrder',
                                desc: s.id === 'sortOrder' ? !s.desc : false
                            }))
                }, void 0, false, {
                    fileName: "[project]/features/categories/columns.tsx",
                    lineNumber: 412,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            cell: ({ row })=>{
                const category = row;
                if (onUpdateSortOrder) {
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$inline$2d$editable$2d$cell$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InlineEditableNumberCell"], {
                        value: category.sortOrder ?? 0,
                        onSave: (newValue)=>onUpdateSortOrder(String(category.systemId), newValue),
                        inputClassName: "h-7 w-16 text-center text-sm",
                        renderDisplay: (value, onEdit)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-center cursor-pointer",
                                onClick: (e)=>{
                                    e.stopPropagation();
                                    onEdit();
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                    variant: "outline",
                                    className: "font-mono text-xs hover:bg-muted transition-colors",
                                    children: value
                                }, void 0, false, {
                                    fileName: "[project]/features/categories/columns.tsx",
                                    lineNumber: 437,
                                    columnNumber: 17
                                }, void 0)
                            }, void 0, false, {
                                fileName: "[project]/features/categories/columns.tsx",
                                lineNumber: 430,
                                columnNumber: 15
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/categories/columns.tsx",
                        lineNumber: 425,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0));
                }
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                        variant: "outline",
                        className: "font-mono text-xs",
                        children: category.sortOrder ?? 0
                    }, void 0, false, {
                        fileName: "[project]/features/categories/columns.tsx",
                        lineNumber: 448,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/features/categories/columns.tsx",
                    lineNumber: 447,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0));
            },
            size: 70,
            meta: {
                displayName: "Thứ tự",
                group: "Thông tin cơ bản"
            }
        },
        // Cấp (Level)
        {
            id: "level",
            accessorKey: "level",
            header: ({ sorting, setSorting })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$column$2d$header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DataTableColumnHeader"], {
                    title: "Cấp",
                    sortKey: "level",
                    isSorted: sorting?.id === 'level',
                    sortDirection: sorting?.desc ? 'desc' : 'asc',
                    onSort: ()=>setSorting?.((s)=>({
                                id: 'level',
                                desc: s.id === 'level' ? !s.desc : false
                            }))
                }, void 0, false, {
                    fileName: "[project]/features/categories/columns.tsx",
                    lineNumber: 465,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            cell: ({ row })=>{
                const category = row;
                const level = category.level ?? 0;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                    variant: "outline",
                    className: "font-mono",
                    children: level
                }, void 0, false, {
                    fileName: "[project]/features/categories/columns.tsx",
                    lineNumber: 477,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0));
            },
            size: 70,
            meta: {
                displayName: "Cấp",
                group: "Phân cấp"
            }
        },
        // Số danh mục con
        {
            id: "childCount",
            header: "DM con",
            cell: ({ row })=>{
                const category = row;
                const childCount = allCategories.filter((c)=>c.parentId === category.systemId && !c.isDeleted).length;
                return childCount > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                    variant: "secondary",
                    children: childCount
                }, void 0, false, {
                    fileName: "[project]/features/categories/columns.tsx",
                    lineNumber: 496,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-muted-foreground",
                    children: "—"
                }, void 0, false, {
                    fileName: "[project]/features/categories/columns.tsx",
                    lineNumber: 498,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0));
            },
            size: 80,
            meta: {
                displayName: "DM con",
                group: "Phân cấp"
            }
        },
        // Số sản phẩm
        {
            id: "productCount",
            header: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-1",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                            className: "h-3.5 w-3.5"
                        }, void 0, false, {
                            fileName: "[project]/features/categories/columns.tsx",
                            lineNumber: 512,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: "SP"
                        }, void 0, false, {
                            fileName: "[project]/features/categories/columns.tsx",
                            lineNumber: 513,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/categories/columns.tsx",
                    lineNumber: 511,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            cell: ({ row })=>{
                const category = row;
                const count = productCountByCategory[String(category.systemId)] || 0;
                return count > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                    variant: "outline",
                    className: "text-primary",
                    children: count
                }, void 0, false, {
                    fileName: "[project]/features/categories/columns.tsx",
                    lineNumber: 520,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-muted-foreground",
                    children: "—"
                }, void 0, false, {
                    fileName: "[project]/features/categories/columns.tsx",
                    lineNumber: 524,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0));
            },
            size: 70,
            meta: {
                displayName: "Sản phẩm",
                group: "Thống kê"
            }
        },
        // SEO PKGX Status
        {
            id: "seoPkgx",
            header: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-1",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-red-500",
                            children: "●"
                        }, void 0, false, {
                            fileName: "[project]/features/categories/columns.tsx",
                            lineNumber: 538,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: "PKGX"
                        }, void 0, false, {
                            fileName: "[project]/features/categories/columns.tsx",
                            lineNumber: 539,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/categories/columns.tsx",
                    lineNumber: 537,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            cell: ({ row })=>{
                const category = row;
                const score = calculateSeoScore(category, 'pkgx');
                return getSeoStatusBadge(score);
            },
            size: 90,
            meta: {
                displayName: "SEO PKGX",
                group: "SEO"
            }
        },
        // SEO Trendtech Status
        {
            id: "seoTrendtech",
            header: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-1",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-blue-500",
                            children: "●"
                        }, void 0, false, {
                            fileName: "[project]/features/categories/columns.tsx",
                            lineNumber: 558,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: "Trendtech"
                        }, void 0, false, {
                            fileName: "[project]/features/categories/columns.tsx",
                            lineNumber: 559,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/categories/columns.tsx",
                    lineNumber: 557,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            cell: ({ row })=>{
                const category = row;
                const score = calculateSeoScore(category, 'trendtech');
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
                const category = row;
                const hasMapping = hasPkgxMapping?.(category) ?? false;
                const pkgxId = getPkgxCatId?.(category);
                return hasMapping ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                    variant: "default",
                    className: "bg-green-500 text-xs",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__["Globe"], {
                            className: "h-3 w-3 mr-1"
                        }, void 0, false, {
                            fileName: "[project]/features/categories/columns.tsx",
                            lineNumber: 584,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        pkgxId
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/categories/columns.tsx",
                    lineNumber: 583,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                    variant: "secondary",
                    className: "text-xs",
                    children: "Chưa liên kết"
                }, void 0, false, {
                    fileName: "[project]/features/categories/columns.tsx",
                    lineNumber: 588,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0));
            },
            size: 110,
            meta: {
                displayName: "Liên kết PKGX",
                group: "PKGX"
            }
        },
        // Trạng thái - Switch
        {
            id: "isActive",
            accessorKey: "isActive",
            header: "Trạng thái",
            cell: ({ row })=>{
                const category = row;
                const isActive = category.isActive !== false;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center",
                    onClick: (e)=>e.stopPropagation(),
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$switch$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Switch"], {
                        checked: isActive,
                        onCheckedChange: (checked)=>onToggleActive(String(category.systemId), checked)
                    }, void 0, false, {
                        fileName: "[project]/features/categories/columns.tsx",
                        lineNumber: 607,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/features/categories/columns.tsx",
                    lineNumber: 606,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0));
            },
            size: 80,
            meta: {
                displayName: "Trạng thái",
                group: "Trạng thái"
            }
        },
        // Ngày tạo
        {
            id: "createdAt",
            accessorKey: "createdAt",
            header: ({ sorting, setSorting })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$column$2d$header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DataTableColumnHeader"], {
                    title: "Ngày tạo",
                    sortKey: "createdAt",
                    isSorted: sorting?.id === 'createdAt',
                    sortDirection: sorting?.desc ? 'desc' : 'asc',
                    onSort: ()=>setSorting?.((s)=>({
                                id: 'createdAt',
                                desc: s.id === 'createdAt' ? !s.desc : false
                            }))
                }, void 0, false, {
                    fileName: "[project]/features/categories/columns.tsx",
                    lineNumber: 625,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            cell: ({ row })=>{
                const category = row;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-sm text-muted-foreground",
                    children: formatDate(category.createdAt)
                }, void 0, false, {
                    fileName: "[project]/features/categories/columns.tsx",
                    lineNumber: 636,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0));
            },
            size: 110,
            meta: {
                displayName: "Ngày tạo",
                group: "Thời gian"
            }
        },
        // PKGX Actions Column
        {
            id: "pkgx",
            header: "PKGX",
            cell: ({ row })=>{
                const category = row;
                const hasMapping = hasPkgxMapping?.(category) ?? false;
                const pkgxId = getPkgxCatId?.(category);
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PkgxActionsCell, {
                    row: category,
                    hasPkgxMapping: hasMapping,
                    pkgxCatId: pkgxId,
                    onPkgxSyncSeo: onPkgxSyncSeo,
                    onPkgxSyncDescription: onPkgxSyncDescription,
                    onPkgxSyncAll: onPkgxSyncAll,
                    onPkgxSyncBasic: onPkgxSyncBasic,
                    onPkgxLink: onPkgxLink,
                    onPkgxUnlink: onPkgxUnlink
                }, void 0, false, {
                    fileName: "[project]/features/categories/columns.tsx",
                    lineNumber: 657,
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
            header: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "sr-only",
                    children: "Thao tác"
                }, void 0, false, {
                    fileName: "[project]/features/categories/columns.tsx",
                    lineNumber: 679,
                    columnNumber: 19
                }, ("TURBOPACK compile-time value", void 0)),
            cell: ({ row })=>{
                const category = row;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenu"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                            asChild: true,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "ghost",
                                className: "h-8 w-8 p-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "sr-only",
                                        children: "Mở menu"
                                    }, void 0, false, {
                                        fileName: "[project]/features/categories/columns.tsx",
                                        lineNumber: 687,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__["MoreHorizontal"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/features/categories/columns.tsx",
                                        lineNumber: 688,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/categories/columns.tsx",
                                lineNumber: 686,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/features/categories/columns.tsx",
                            lineNumber: 685,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                            align: "end",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                    onClick: ()=>navigate(`/categories/${category.systemId}`),
                                    children: "Xem chi tiết"
                                }, void 0, false, {
                                    fileName: "[project]/features/categories/columns.tsx",
                                    lineNumber: 692,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                    onClick: ()=>navigate(`/categories/${category.systemId}/edit`),
                                    children: "Chỉnh sửa"
                                }, void 0, false, {
                                    fileName: "[project]/features/categories/columns.tsx",
                                    lineNumber: 695,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                                    fileName: "[project]/features/categories/columns.tsx",
                                    lineNumber: 698,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                    className: "text-destructive",
                                    onClick: ()=>onDelete(String(category.systemId)),
                                    children: "Xóa danh mục"
                                }, void 0, false, {
                                    fileName: "[project]/features/categories/columns.tsx",
                                    lineNumber: 699,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/categories/columns.tsx",
                            lineNumber: 691,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/categories/columns.tsx",
                    lineNumber: 684,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0));
            },
            size: 60,
            meta: {
                displayName: "Thao tác",
                sticky: "right"
            }
        }
    ];
};
var _c;
__turbopack_context__.k.register(_c, "PkgxActionsCell");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/categories/card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MobileCategoryCard",
    ()=>MobileCategoryCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/avatar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$switch$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/switch.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$mobile$2f$touch$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/mobile/touch-button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dropdown-menu.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis.js [app-client] (ecmascript) <export default as MoreHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-client] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pencil.js [app-client] (ecmascript) <export default as Pencil>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/image.js [app-client] (ecmascript) <export default as Image>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-client] (ecmascript) <export default as MapPin>");
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
// SEO Score calculation
const calculateSeoScore = (category, website)=>{
    const seo = category.websiteSeo?.[website];
    if (!seo) return 0;
    let score = 0;
    if (seo.seoTitle && seo.seoTitle.length >= 30) score += 25;
    if (seo.metaDescription && seo.metaDescription.length >= 100) score += 25;
    if (seo.seoKeywords) score += 15;
    if (seo.shortDescription) score += 15;
    if (seo.longDescription && seo.longDescription.length >= 200) score += 20;
    return score;
};
const getSeoStatusBadge = (score, website)=>{
    const color = website === 'pkgx' ? 'text-red-500' : 'text-blue-500';
    if (score >= 80) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
        variant: "outline",
        className: "text-green-600 text-[10px]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: color,
                children: "●"
            }, void 0, false, {
                fileName: "[project]/features/categories/card.tsx",
                lineNumber: 38,
                columnNumber: 91
            }, ("TURBOPACK compile-time value", void 0)),
            " ",
            score,
            "%"
        ]
    }, void 0, true, {
        fileName: "[project]/features/categories/card.tsx",
        lineNumber: 38,
        columnNumber: 27
    }, ("TURBOPACK compile-time value", void 0));
    if (score >= 50) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
        variant: "outline",
        className: "text-yellow-600 text-[10px]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: color,
                children: "●"
            }, void 0, false, {
                fileName: "[project]/features/categories/card.tsx",
                lineNumber: 39,
                columnNumber: 92
            }, ("TURBOPACK compile-time value", void 0)),
            " ",
            score,
            "%"
        ]
    }, void 0, true, {
        fileName: "[project]/features/categories/card.tsx",
        lineNumber: 39,
        columnNumber: 27
    }, ("TURBOPACK compile-time value", void 0));
    if (score > 0) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
        variant: "outline",
        className: "text-red-600 text-[10px]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: color,
                children: "●"
            }, void 0, false, {
                fileName: "[project]/features/categories/card.tsx",
                lineNumber: 40,
                columnNumber: 87
            }, ("TURBOPACK compile-time value", void 0)),
            " ",
            score,
            "%"
        ]
    }, void 0, true, {
        fileName: "[project]/features/categories/card.tsx",
        lineNumber: 40,
        columnNumber: 25
    }, ("TURBOPACK compile-time value", void 0));
    return null;
};
const MobileCategoryCard = ({ category, childCount, onDelete, onToggleActive, navigate, handleRowClick })=>{
    const level = category.level ?? 0;
    const pkgxScore = calculateSeoScore(category, 'pkgx');
    const trendtechScore = calculateSeoScore(category, 'trendtech');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
        className: "hover:shadow-md transition-shadow cursor-pointer",
        onClick: ()=>handleRowClick(category),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
            className: "p-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-start justify-between gap-3 mb-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3 flex-1 min-w-0",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Avatar"], {
                                    className: "h-12 w-12 rounded-md flex-shrink-0",
                                    children: [
                                        category.thumbnailImage ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AvatarImage"], {
                                            src: category.thumbnailImage,
                                            alt: category.name,
                                            className: "object-cover"
                                        }, void 0, false, {
                                            fileName: "[project]/features/categories/card.tsx",
                                            lineNumber: 77,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)) : null,
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AvatarFallback"], {
                                            className: "rounded-md bg-muted",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__["Image"], {
                                                className: "h-5 w-5 text-muted-foreground"
                                            }, void 0, false, {
                                                fileName: "[project]/features/categories/card.tsx",
                                                lineNumber: 80,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/features/categories/card.tsx",
                                            lineNumber: 79,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/categories/card.tsx",
                                    lineNumber: 75,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col min-w-0",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2 flex-wrap",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                                className: "font-semibold text-sm truncate",
                                                children: category.name
                                            }, void 0, false, {
                                                fileName: "[project]/features/categories/card.tsx",
                                                lineNumber: 86,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/features/categories/card.tsx",
                                            lineNumber: 85,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2 text-xs text-muted-foreground",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-mono",
                                                    children: category.id
                                                }, void 0, false, {
                                                    fileName: "[project]/features/categories/card.tsx",
                                                    lineNumber: 89,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "•"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/categories/card.tsx",
                                                    lineNumber: 90,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: [
                                                        "Cấp ",
                                                        level
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/categories/card.tsx",
                                                    lineNumber: 91,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                childCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "•"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/categories/card.tsx",
                                                            lineNumber: 94,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: [
                                                                childCount,
                                                                " danh mục con"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/features/categories/card.tsx",
                                                            lineNumber: 95,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/categories/card.tsx",
                                            lineNumber: 88,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/categories/card.tsx",
                                    lineNumber: 84,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/categories/card.tsx",
                            lineNumber: 73,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$switch$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Switch"], {
                                    checked: category.isActive !== false,
                                    onCheckedChange: (checked)=>{
                                        onToggleActive(String(category.systemId), checked);
                                    },
                                    onClick: (e)=>e.stopPropagation()
                                }, void 0, false, {
                                    fileName: "[project]/features/categories/card.tsx",
                                    lineNumber: 104,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenu"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                                            asChild: true,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$mobile$2f$touch$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TouchButton"], {
                                                variant: "ghost",
                                                size: "sm",
                                                className: "h-9 w-10 p-0 flex-shrink-0",
                                                onClick: (e)=>e.stopPropagation(),
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__["MoreHorizontal"], {
                                                    className: "h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/categories/card.tsx",
                                                    lineNumber: 120,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/features/categories/card.tsx",
                                                lineNumber: 114,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/features/categories/card.tsx",
                                            lineNumber: 113,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                                            align: "end",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                    onClick: (e)=>{
                                                        e.stopPropagation();
                                                        navigate(`/categories/${category.systemId}`);
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                            className: "mr-2 h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/categories/card.tsx",
                                                            lineNumber: 125,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        "Xem chi tiết"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/categories/card.tsx",
                                                    lineNumber: 124,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                    onClick: (e)=>{
                                                        e.stopPropagation();
                                                        navigate(`/categories/${category.systemId}/edit`);
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__["Pencil"], {
                                                            className: "mr-2 h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/categories/card.tsx",
                                                            lineNumber: 129,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        "Chỉnh sửa"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/categories/card.tsx",
                                                    lineNumber: 128,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                                                    fileName: "[project]/features/categories/card.tsx",
                                                    lineNumber: 132,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                    className: "text-destructive focus:text-destructive",
                                                    onClick: (e)=>{
                                                        e.stopPropagation();
                                                        onDelete(String(category.systemId));
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                            className: "mr-2 h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/categories/card.tsx",
                                                            lineNumber: 137,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        "Xóa danh mục"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/categories/card.tsx",
                                                    lineNumber: 133,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/categories/card.tsx",
                                            lineNumber: 123,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/categories/card.tsx",
                                    lineNumber: 112,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/categories/card.tsx",
                            lineNumber: 102,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/categories/card.tsx",
                    lineNumber: 72,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                category.path && level > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-xs text-muted-foreground mb-2 truncate flex items-center gap-1",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                            className: "h-3 w-3"
                        }, void 0, false, {
                            fileName: "[project]/features/categories/card.tsx",
                            lineNumber: 148,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        " ",
                        category.path
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/categories/card.tsx",
                    lineNumber: 147,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)),
                (pkgxScore > 0 || trendtechScore > 0) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-2 mt-2 pt-2 border-t",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-xs text-muted-foreground",
                            children: "SEO:"
                        }, void 0, false, {
                            fileName: "[project]/features/categories/card.tsx",
                            lineNumber: 155,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        getSeoStatusBadge(pkgxScore, 'pkgx'),
                        getSeoStatusBadge(trendtechScore, 'trendtech')
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/categories/card.tsx",
                    lineNumber: 154,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-[10px] text-muted-foreground mt-2",
                    children: [
                        "Tạo: ",
                        formatDate(category.createdAt)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/categories/card.tsx",
                    lineNumber: 162,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/features/categories/card.tsx",
            lineNumber: 70,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/features/categories/card.tsx",
        lineNumber: 66,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = MobileCategoryCard;
var _c;
__turbopack_context__.k.register(_c, "MobileCategoryCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/pkgx/types.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

// Re-export all PKGX types from central prisma-extended
__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2f$prisma$2d$extended$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/types/prisma-extended.ts [app-client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/pkgx/constants.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/pkgx/store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/features/settings/pkgx/types.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2f$prisma$2d$extended$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/types/prisma-extended.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/constants.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/pkgx/api-service.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature(), _s6 = __turbopack_context__.k.signature(), _s7 = __turbopack_context__.k.signature(), _s8 = __turbopack_context__.k.signature(), _s9 = __turbopack_context__.k.signature();
;
;
;
;
;
;
const usePkgxSettingsStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        // === Initial State ===
        settings: {
            ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2f$prisma$2d$extended$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_PKGX_SETTINGS"],
            categories: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PKGX_CATEGORIES"],
            brands: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PKGX_BRANDS"]
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
            const userInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentUserInfo"])();
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
                const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCategories"])();
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
                const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getBrands"])();
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
                        categories: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PKGX_CATEGORIES"],
                        brands: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PKGX_BRANDS"]
                    }
                })),
        resetSettings: ()=>set({
                settings: {
                    ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2f$prisma$2d$extended$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_PKGX_SETTINGS"],
                    categories: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PKGX_CATEGORIES"],
                    brands: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PKGX_BRANDS"]
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
    storage: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createJSONStorage"])(()=>localStorage),
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
    _s();
    return usePkgxSettingsStore({
        "usePkgxEnabled.usePkgxSettingsStore": (state)=>state.settings.enabled
    }["usePkgxEnabled.usePkgxSettingsStore"]);
}
_s(usePkgxEnabled, "m5nQTXkJFYjk1I0WVrCCFc8ptlE=", false, function() {
    return [
        usePkgxSettingsStore
    ];
});
function usePkgxApiConfig() {
    _s1();
    return usePkgxSettingsStore({
        "usePkgxApiConfig.usePkgxSettingsStore": (state)=>({
                apiUrl: state.settings.apiUrl,
                apiKey: state.settings.apiKey,
                enabled: state.settings.enabled
            })
    }["usePkgxApiConfig.usePkgxSettingsStore"]);
}
_s1(usePkgxApiConfig, "m5nQTXkJFYjk1I0WVrCCFc8ptlE=", false, function() {
    return [
        usePkgxSettingsStore
    ];
});
function usePkgxCategories() {
    _s2();
    return usePkgxSettingsStore({
        "usePkgxCategories.usePkgxSettingsStore": (state)=>state.settings.categories
    }["usePkgxCategories.usePkgxSettingsStore"]);
}
_s2(usePkgxCategories, "m5nQTXkJFYjk1I0WVrCCFc8ptlE=", false, function() {
    return [
        usePkgxSettingsStore
    ];
});
function usePkgxBrands() {
    _s3();
    return usePkgxSettingsStore({
        "usePkgxBrands.usePkgxSettingsStore": (state)=>state.settings.brands
    }["usePkgxBrands.usePkgxSettingsStore"]);
}
_s3(usePkgxBrands, "m5nQTXkJFYjk1I0WVrCCFc8ptlE=", false, function() {
    return [
        usePkgxSettingsStore
    ];
});
function usePkgxPriceMapping() {
    _s4();
    return usePkgxSettingsStore({
        "usePkgxPriceMapping.usePkgxSettingsStore": (state)=>state.settings.priceMapping
    }["usePkgxPriceMapping.usePkgxSettingsStore"]);
}
_s4(usePkgxPriceMapping, "m5nQTXkJFYjk1I0WVrCCFc8ptlE=", false, function() {
    return [
        usePkgxSettingsStore
    ];
});
function usePkgxCategoryMappings() {
    _s5();
    return usePkgxSettingsStore({
        "usePkgxCategoryMappings.usePkgxSettingsStore": (state)=>state.settings.categoryMappings
    }["usePkgxCategoryMappings.usePkgxSettingsStore"]);
}
_s5(usePkgxCategoryMappings, "m5nQTXkJFYjk1I0WVrCCFc8ptlE=", false, function() {
    return [
        usePkgxSettingsStore
    ];
});
function usePkgxBrandMappings() {
    _s6();
    return usePkgxSettingsStore({
        "usePkgxBrandMappings.usePkgxSettingsStore": (state)=>state.settings.brandMappings
    }["usePkgxBrandMappings.usePkgxSettingsStore"]);
}
_s6(usePkgxBrandMappings, "m5nQTXkJFYjk1I0WVrCCFc8ptlE=", false, function() {
    return [
        usePkgxSettingsStore
    ];
});
function usePkgxSyncSettings() {
    _s7();
    return usePkgxSettingsStore({
        "usePkgxSyncSettings.usePkgxSettingsStore": (state)=>state.settings.syncSettings
    }["usePkgxSyncSettings.usePkgxSettingsStore"]);
}
_s7(usePkgxSyncSettings, "m5nQTXkJFYjk1I0WVrCCFc8ptlE=", false, function() {
    return [
        usePkgxSettingsStore
    ];
});
function usePkgxSyncStatus() {
    _s8();
    return usePkgxSettingsStore({
        "usePkgxSyncStatus.usePkgxSettingsStore": (state)=>({
                lastSyncAt: state.settings.lastSyncAt,
                lastSyncResult: state.settings.lastSyncResult,
                connectionStatus: state.settings.connectionStatus,
                connectionError: state.settings.connectionError
            })
    }["usePkgxSyncStatus.usePkgxSettingsStore"]);
}
_s8(usePkgxSyncStatus, "m5nQTXkJFYjk1I0WVrCCFc8ptlE=", false, function() {
    return [
        usePkgxSettingsStore
    ];
});
function usePkgxProducts() {
    _s9();
    return usePkgxSettingsStore({
        "usePkgxProducts.usePkgxSettingsStore": (state)=>({
                products: state.settings.pkgxProducts,
                lastFetch: state.settings.pkgxProductsLastFetch
            })
    }["usePkgxProducts.usePkgxSettingsStore"]);
}
_s9(usePkgxProducts, "m5nQTXkJFYjk1I0WVrCCFc8ptlE=", false, function() {
    return [
        usePkgxSettingsStore
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/categories/hooks/use-pkgx-category-sync.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePkgxCategorySync",
    ()=>usePkgxCategorySync
]);
/**
 * Hook chứa tất cả các handlers để đồng bộ danh mục (Category) với PKGX
 * Tương tự như use-pkgx-sync.ts của products
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/pkgx/api-service.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/store.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
;
;
/**
 * Lấy pkgxCatId từ category mapping
 */ function getPkgxCatId(category, categoryMappings) {
    console.log('[getPkgxCatId] Input category:', {
        systemId: category.systemId,
        name: category.name
    });
    console.log('[getPkgxCatId] Available mappings:', categoryMappings);
    if (!categoryMappings) {
        console.log('[getPkgxCatId] No mappings found');
        return undefined;
    }
    const mapping = categoryMappings.find((m)=>m.hrmCategorySystemId === category.systemId);
    console.log('[getPkgxCatId] Found mapping:', mapping);
    return mapping?.pkgxCatId;
}
function usePkgxCategorySync({ addPkgxLog } = {}) {
    _s();
    const { settings: pkgxSettings, updateCategory: updateCategoryInStore } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePkgxSettingsStore"])();
    // Default log function if not provided
    const logAction = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useCallback({
        "usePkgxCategorySync.useCallback[logAction]": (entry)=>{
            if (addPkgxLog) {
                addPkgxLog(entry);
            }
            console.log('[PKGX Category Sync]', entry.action, entry.status, entry.message);
        }
    }["usePkgxCategorySync.useCallback[logAction]"], [
        addPkgxLog
    ]);
    // ═══════════════════════════════════════════════════════════════
    // HELPER: Refresh category data từ PKGX sau khi sync thành công
    // ═══════════════════════════════════════════════════════════════
    const refreshCategoryFromPkgx = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useCallback({
        "usePkgxCategorySync.useCallback[refreshCategoryFromPkgx]": async (pkgxCatId)=>{
            try {
                const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCategoryById"])(pkgxCatId);
                if (response.success && response.data?.data?.[0]) {
                    const data = response.data.data[0];
                    // Cập nhật vào store
                    updateCategoryInStore(pkgxCatId, {
                        id: data.cat_id,
                        name: data.cat_name,
                        parentId: data.parent_id || 0,
                        sortOrder: data.sort_order || 0,
                        isShow: data.is_show ?? 1,
                        cat_desc: data.cat_desc || '',
                        long_desc: data.long_desc || '',
                        keywords: data.keywords || '',
                        meta_title: data.meta_title || '',
                        meta_desc: data.meta_desc || '',
                        cat_alias: data.cat_alias || '',
                        style: data.style || '',
                        grade: data.grade || 0
                    });
                    console.log('[PKGX Category Sync] Auto-refreshed category data from PKGX:', pkgxCatId);
                }
            } catch (error) {
                console.warn('[PKGX Category Sync] Failed to refresh category data:', error);
            }
        }
    }["usePkgxCategorySync.useCallback[refreshCategoryFromPkgx]"], [
        updateCategoryInStore
    ]);
    // ═══════════════════════════════════════════════════════════════
    // 1. SYNC SEO (keywords, meta_title, meta_desc)
    // ═══════════════════════════════════════════════════════════════
    const handleSyncSeo = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useCallback({
        "usePkgxCategorySync.useCallback[handleSyncSeo]": async (category)=>{
            const pkgxCatId = getPkgxCatId(category, pkgxSettings?.categoryMappings);
            if (!pkgxCatId) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Danh mục chưa được liên kết với PKGX. Vui lòng mapping trong Cài đặt > PKGX.');
                return;
            }
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].loading(`Đang đồng bộ SEO danh mục...`, {
                id: 'pkgx-category-sync-seo'
            });
            try {
                const pkgxSeo = category.websiteSeo?.pkgx;
                // Fallback chain: SEO PKGX → SEO Chung → name
                // Category DB columns: keywords, meta_title, meta_desc (NO cat_alias, NO short_desc!)
                const seoPayload = {
                    keywords: pkgxSeo?.seoKeywords || category.seoKeywords || category.name,
                    meta_title: pkgxSeo?.seoTitle || category.seoTitle || category.name,
                    meta_desc: pkgxSeo?.metaDescription || category.metaDescription || ''
                };
                // DEBUG
                console.log('[PKGX Category SEO Sync] Category:', category.name);
                console.log('[PKGX Category SEO Sync] websiteSeo.pkgx:', pkgxSeo);
                console.log('[PKGX Category SEO Sync] SEO Chung - seoKeywords:', category.seoKeywords);
                console.log('[PKGX Category SEO Sync] Payload:', seoPayload);
                console.log('[PKGX Category SEO Sync] Calling updateCategory with catId:', pkgxCatId);
                const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateCategory"])(pkgxCatId, seoPayload);
                console.log('[PKGX Category SEO Sync] API Response:', response);
                if (response.success) {
                    // Auto-refresh để cập nhật store
                    await refreshCategoryFromPkgx(pkgxCatId);
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(`Đã đồng bộ SEO cho danh mục: ${category.name}`, {
                        id: 'pkgx-category-sync-seo'
                    });
                    logAction({
                        action: 'sync_category_seo',
                        status: 'success',
                        message: `Đã đồng bộ SEO: ${category.name}`,
                        details: {
                            categoryId: category.systemId,
                            pkgxCatId,
                            payload: seoPayload
                        }
                    });
                } else {
                    throw new Error(response.error);
                }
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Lỗi đồng bộ SEO danh mục: ${error instanceof Error ? error.message : 'Unknown error'}`, {
                    id: 'pkgx-category-sync-seo'
                });
                logAction({
                    action: 'sync_category_seo',
                    status: 'error',
                    message: `Lỗi đồng bộ SEO: ${category.name}`,
                    details: {
                        categoryId: category.systemId,
                        error: error instanceof Error ? error.message : String(error)
                    }
                });
            }
        }
    }["usePkgxCategorySync.useCallback[handleSyncSeo]"], [
        pkgxSettings?.categoryMappings,
        logAction,
        refreshCategoryFromPkgx
    ]);
    // ═══════════════════════════════════════════════════════════════
    // 2. SYNC MÔ TẢ (cat_desc = longDescription)
    // ═══════════════════════════════════════════════════════════════
    const handleSyncDescription = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useCallback({
        "usePkgxCategorySync.useCallback[handleSyncDescription]": async (category)=>{
            const pkgxCatId = getPkgxCatId(category, pkgxSettings?.categoryMappings);
            if (!pkgxCatId) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Danh mục chưa được liên kết với PKGX. Vui lòng mapping trong Cài đặt > PKGX.');
                return;
            }
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].loading(`Đang đồng bộ mô tả danh mục...`, {
                id: 'pkgx-category-sync-desc'
            });
            try {
                const pkgxSeo = category.websiteSeo?.pkgx;
                // Category DB: cat_desc = mô tả ngắn, long_desc = mô tả dài (NO short_desc column!)
                const descPayload = {
                    cat_desc: pkgxSeo?.shortDescription || category.shortDescription || '',
                    long_desc: pkgxSeo?.longDescription || category.longDescription || ''
                };
                console.log('[PKGX Category Desc Sync] Payload:', descPayload);
                const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateCategory"])(pkgxCatId, descPayload);
                if (response.success) {
                    // Auto-refresh để cập nhật store
                    await refreshCategoryFromPkgx(pkgxCatId);
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(`Đã đồng bộ mô tả cho danh mục: ${category.name}`, {
                        id: 'pkgx-category-sync-desc'
                    });
                    logAction({
                        action: 'sync_category_description',
                        status: 'success',
                        message: `Đã đồng bộ mô tả: ${category.name}`,
                        details: {
                            categoryId: category.systemId,
                            pkgxCatId
                        }
                    });
                } else {
                    throw new Error(response.error);
                }
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Lỗi đồng bộ mô tả danh mục: ${error instanceof Error ? error.message : 'Unknown error'}`, {
                    id: 'pkgx-category-sync-desc'
                });
                logAction({
                    action: 'sync_category_description',
                    status: 'error',
                    message: `Lỗi đồng bộ mô tả: ${category.name}`,
                    details: {
                        categoryId: category.systemId,
                        error: error instanceof Error ? error.message : String(error)
                    }
                });
            }
        }
    }["usePkgxCategorySync.useCallback[handleSyncDescription]"], [
        pkgxSettings?.categoryMappings,
        logAction,
        refreshCategoryFromPkgx
    ]);
    // ═══════════════════════════════════════════════════════════════
    // 3. SYNC TẤT CẢ (SEO + Mô tả + Slug)
    // ═══════════════════════════════════════════════════════════════
    const handleSyncAll = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useCallback({
        "usePkgxCategorySync.useCallback[handleSyncAll]": async (category)=>{
            const pkgxCatId = getPkgxCatId(category, pkgxSettings?.categoryMappings);
            if (!pkgxCatId) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Danh mục chưa được liên kết với PKGX. Vui lòng mapping trong Cài đặt > PKGX.');
                return;
            }
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].loading(`Đang đồng bộ tất cả thông tin danh mục...`, {
                id: 'pkgx-category-sync-all'
            });
            try {
                const pkgxSeo = category.websiteSeo?.pkgx;
                // Build full payload
                // Category DB: cat_desc = mô tả ngắn, long_desc = mô tả dài (NO short_desc column!)
                const fullPayload = {
                    // Basic info
                    cat_name: category.name,
                    cat_alias: pkgxSeo?.slug || category.slug || '',
                    // SEO fields - Fallback chain: SEO PKGX → SEO Chung → name
                    keywords: pkgxSeo?.seoKeywords || category.seoKeywords || category.name,
                    meta_title: pkgxSeo?.seoTitle || category.seoTitle || category.name,
                    meta_desc: pkgxSeo?.metaDescription || category.metaDescription || '',
                    // Descriptions
                    cat_desc: pkgxSeo?.shortDescription || category.shortDescription || '',
                    long_desc: pkgxSeo?.longDescription || category.longDescription || ''
                };
                console.log('[PKGX Category Sync All] Payload:', fullPayload);
                const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateCategory"])(pkgxCatId, fullPayload);
                if (response.success) {
                    // Auto-refresh để cập nhật store
                    await refreshCategoryFromPkgx(pkgxCatId);
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(`Đã đồng bộ tất cả thông tin danh mục: ${category.name}`, {
                        id: 'pkgx-category-sync-all'
                    });
                    logAction({
                        action: 'sync_category_all',
                        status: 'success',
                        message: `Đã đồng bộ tất cả: ${category.name}`,
                        details: {
                            categoryId: category.systemId,
                            pkgxCatId
                        }
                    });
                } else {
                    throw new Error(response.error);
                }
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Lỗi đồng bộ danh mục: ${error instanceof Error ? error.message : 'Unknown error'}`, {
                    id: 'pkgx-category-sync-all'
                });
                logAction({
                    action: 'sync_category_all',
                    status: 'error',
                    message: `Lỗi đồng bộ: ${category.name}`,
                    details: {
                        categoryId: category.systemId,
                        error: error instanceof Error ? error.message : String(error)
                    }
                });
            }
        }
    }["usePkgxCategorySync.useCallback[handleSyncAll]"], [
        pkgxSettings?.categoryMappings,
        logAction,
        refreshCategoryFromPkgx
    ]);
    // ═══════════════════════════════════════════════════════════════
    // 4. SYNC BASIC (cat_name, is_show)
    // ═══════════════════════════════════════════════════════════════
    const handleSyncBasic = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useCallback({
        "usePkgxCategorySync.useCallback[handleSyncBasic]": async (category)=>{
            const pkgxCatId = getPkgxCatId(category, pkgxSettings?.categoryMappings);
            if (!pkgxCatId) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Danh mục chưa được liên kết với PKGX. Vui lòng mapping trong Cài đặt > PKGX.');
                return;
            }
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].loading(`Đang đồng bộ thông tin cơ bản danh mục...`, {
                id: 'pkgx-category-sync-basic'
            });
            try {
                // Build payload - chỉ tên và trạng thái hiển thị
                const basicPayload = {
                    cat_name: category.name,
                    is_show: category.isActive ? 1 : 0
                };
                console.log('[PKGX Category Basic Sync] Payload:', basicPayload);
                const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateCategoryBasic"])(pkgxCatId, basicPayload);
                if (response.success) {
                    // Auto-refresh để cập nhật store
                    await refreshCategoryFromPkgx(pkgxCatId);
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(`Đã đồng bộ thông tin cơ bản danh mục: ${category.name}`, {
                        id: 'pkgx-category-sync-basic'
                    });
                    logAction({
                        action: 'sync_category_basic',
                        status: 'success',
                        message: `Đã đồng bộ thông tin cơ bản: ${category.name}`,
                        details: {
                            categoryId: category.systemId,
                            pkgxCatId,
                            payload: basicPayload
                        }
                    });
                } else {
                    throw new Error(response.error);
                }
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Lỗi đồng bộ thông tin cơ bản: ${error instanceof Error ? error.message : 'Unknown error'}`, {
                    id: 'pkgx-category-sync-basic'
                });
                logAction({
                    action: 'sync_category_basic',
                    status: 'error',
                    message: `Lỗi đồng bộ thông tin cơ bản: ${category.name}`,
                    details: {
                        categoryId: category.systemId,
                        error: error instanceof Error ? error.message : String(error)
                    }
                });
            }
        }
    }["usePkgxCategorySync.useCallback[handleSyncBasic]"], [
        pkgxSettings?.categoryMappings,
        logAction,
        refreshCategoryFromPkgx
    ]);
    // ═══════════════════════════════════════════════════════════════
    // HELPER: Kiểm tra category có mapping với PKGX không
    // ═══════════════════════════════════════════════════════════════
    const hasPkgxMapping = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useCallback({
        "usePkgxCategorySync.useCallback[hasPkgxMapping]": (category)=>{
            return !!getPkgxCatId(category, pkgxSettings?.categoryMappings);
        }
    }["usePkgxCategorySync.useCallback[hasPkgxMapping]"], [
        pkgxSettings?.categoryMappings
    ]);
    return {
        handleSyncSeo,
        handleSyncDescription,
        handleSyncAll,
        handleSyncBasic,
        hasPkgxMapping,
        getPkgxCatId: (category)=>getPkgxCatId(category, pkgxSettings?.categoryMappings)
    };
}
_s(usePkgxCategorySync, "nbFZVSDYyRcC+s0jgH9boy4ax1w=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePkgxSettingsStore"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/categories/components/pkgx-link-dialog.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PkgxCategoryLinkDialog",
    ()=>PkgxCategoryLinkDialog
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Link2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/link-2.js [app-client] (ecmascript) <export default as Link2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$virtualized$2d$combobox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/virtualized-combobox.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/pkgx/api-service.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
;
function PkgxCategoryLinkDialog({ open, onOpenChange, category, onSuccess }) {
    _s();
    const pkgxSettingsStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePkgxSettingsStore"])();
    const cachedPkgxCategories = pkgxSettingsStore.settings.categories;
    const categoryMappings = pkgxSettingsStore.settings.categoryMappings;
    const addCategoryMapping = pkgxSettingsStore.addCategoryMapping;
    const setCategories = pkgxSettingsStore.setCategories;
    const [selectedPkgxCategory, setSelectedPkgxCategory] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](null);
    const [pkgxCategories, setPkgxCategoriesLocal] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]([]);
    const [isLoading, setIsLoading] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    const [isSyncing, setIsSyncing] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    const [hasFetched, setHasFetched] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    const loadPkgxCategories = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "PkgxCategoryLinkDialog.useCallback[loadPkgxCategories]": async ()=>{
            setIsLoading(true);
            try {
                const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCategories"])();
                if (response.success && response.data && response.data.data) {
                    // API trả về { error, message, total, data: PkgxCategoryFromApi[] }
                    // Cần map từ PkgxCategoryFromApi -> PkgxCategory
                    const categoriesArray = response.data.data.map({
                        "PkgxCategoryLinkDialog.useCallback[loadPkgxCategories].categoriesArray": (c)=>({
                                id: c.cat_id,
                                name: c.cat_name,
                                parentId: c.parent_id || undefined,
                                cat_desc: c.cat_desc,
                                keywords: c.keywords,
                                cat_alias: c.cat_alias,
                                grade: c.grade
                            })
                    }["PkgxCategoryLinkDialog.useCallback[loadPkgxCategories].categoriesArray"]);
                    setPkgxCategoriesLocal(categoriesArray);
                    setCategories(categoriesArray); // Lưu vào store để dùng chung
                    setHasFetched(true);
                }
            } catch (error) {
                console.error('Failed to load PKGX categories:', error);
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Không thể tải danh sách danh mục PKGX');
            } finally{
                setIsLoading(false);
            }
        }
    }["PkgxCategoryLinkDialog.useCallback[loadPkgxCategories]"], [
        setCategories
    ]);
    // Load PKGX categories khi mở dialog - chỉ chạy 1 lần
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "PkgxCategoryLinkDialog.useEffect": ()=>{
            if (open && !hasFetched) {
                if (cachedPkgxCategories && cachedPkgxCategories.length > 0) {
                    setPkgxCategoriesLocal(cachedPkgxCategories);
                    setHasFetched(true);
                } else {
                    loadPkgxCategories();
                }
            }
        }
    }["PkgxCategoryLinkDialog.useEffect"], [
        open,
        hasFetched,
        cachedPkgxCategories,
        loadPkgxCategories
    ]);
    // Reset state khi đóng dialog
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "PkgxCategoryLinkDialog.useEffect": ()=>{
            if (!open) {
                setSelectedPkgxCategory(null);
            }
        }
    }["PkgxCategoryLinkDialog.useEffect"], [
        open
    ]);
    // Filter out categories that are already linked
    const linkedPkgxCatIds = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "PkgxCategoryLinkDialog.useMemo[linkedPkgxCatIds]": ()=>{
            return new Set(categoryMappings.map({
                "PkgxCategoryLinkDialog.useMemo[linkedPkgxCatIds]": (m)=>m.pkgxCatId
            }["PkgxCategoryLinkDialog.useMemo[linkedPkgxCatIds]"]));
        }
    }["PkgxCategoryLinkDialog.useMemo[linkedPkgxCatIds]"], [
        categoryMappings
    ]);
    // Convert PKGX categories to combobox options
    const pkgxOptions = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "PkgxCategoryLinkDialog.useMemo[pkgxOptions]": ()=>{
            return pkgxCategories.filter({
                "PkgxCategoryLinkDialog.useMemo[pkgxOptions]": (c)=>!linkedPkgxCatIds.has(c.id)
            }["PkgxCategoryLinkDialog.useMemo[pkgxOptions]"]) // Exclude already linked
            .map({
                "PkgxCategoryLinkDialog.useMemo[pkgxOptions]": (c)=>({
                        value: String(c.id),
                        label: c.name,
                        subtitle: `ID: ${c.id}${c.parentId ? ` | Parent: ${c.parentId}` : ''}`,
                        metadata: c
                    })
            }["PkgxCategoryLinkDialog.useMemo[pkgxOptions]"]);
        }
    }["PkgxCategoryLinkDialog.useMemo[pkgxOptions]"], [
        pkgxCategories,
        linkedPkgxCatIds
    ]);
    const handleConfirmLink = async ()=>{
        if (!category || !selectedPkgxCategory) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Vui lòng chọn danh mục PKGX để liên kết');
            return;
        }
        setIsSyncing(true);
        try {
            const pkgxCatId = Number(selectedPkgxCategory.value);
            // Add mapping to store
            addCategoryMapping({
                id: `category-mapping-${category.systemId}-${pkgxCatId}`,
                hrmCategorySystemId: category.systemId,
                hrmCategoryName: category.name,
                pkgxCatId: pkgxCatId,
                pkgxCatName: selectedPkgxCategory.label
            });
            // Log to console
            console.log('[PKGX Category Link]', {
                action: 'link_category',
                status: 'success',
                categoryId: category.systemId,
                pkgxCatId,
                pkgxCatName: selectedPkgxCategory.label
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(`Đã liên kết với danh mục PKGX: ${selectedPkgxCategory.label}`);
            onSuccess?.(pkgxCatId);
            onOpenChange(false);
        } catch (error) {
            console.error('[PKGX Category Link Error]', error);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Lỗi khi liên kết danh mục');
        } finally{
            setIsSyncing(false);
        }
    };
    if (!category) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"], {
        open: open,
        onOpenChange: onOpenChange,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogContent"], {
            className: "sm:max-w-[500px]",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogHeader"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogTitle"], {
                            children: "Liên kết với danh mục PKGX"
                        }, void 0, false, {
                            fileName: "[project]/features/categories/components/pkgx-link-dialog.tsx",
                            lineNumber: 153,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogDescription"], {
                            children: "Chọn danh mục PKGX để liên kết với danh mục HRM này"
                        }, void 0, false, {
                            fileName: "[project]/features/categories/components/pkgx-link-dialog.tsx",
                            lineNumber: 154,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/categories/components/pkgx-link-dialog.tsx",
                    lineNumber: 152,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-4 py-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-lg bg-muted p-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm font-medium",
                                    children: "Danh mục HRM:"
                                }, void 0, false, {
                                    fileName: "[project]/features/categories/components/pkgx-link-dialog.tsx",
                                    lineNumber: 162,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm",
                                    children: category.name
                                }, void 0, false, {
                                    fileName: "[project]/features/categories/components/pkgx-link-dialog.tsx",
                                    lineNumber: 163,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-muted-foreground",
                                    children: [
                                        "Mã: ",
                                        category.id,
                                        " | SystemID: ",
                                        category.systemId
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/categories/components/pkgx-link-dialog.tsx",
                                    lineNumber: 164,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/categories/components/pkgx-link-dialog.tsx",
                            lineNumber: 161,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "text-sm font-medium",
                                    children: "Chọn danh mục PKGX"
                                }, void 0, false, {
                                    fileName: "[project]/features/categories/components/pkgx-link-dialog.tsx",
                                    lineNumber: 171,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$virtualized$2d$combobox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VirtualizedCombobox"], {
                                    value: selectedPkgxCategory,
                                    onChange: setSelectedPkgxCategory,
                                    options: pkgxOptions,
                                    placeholder: "Tìm và chọn danh mục PKGX...",
                                    searchPlaceholder: "Tìm theo tên...",
                                    emptyPlaceholder: isLoading ? 'Đang tải...' : 'Không tìm thấy danh mục PKGX',
                                    isLoading: isLoading,
                                    disabled: isLoading
                                }, void 0, false, {
                                    fileName: "[project]/features/categories/components/pkgx-link-dialog.tsx",
                                    lineNumber: 172,
                                    columnNumber: 13
                                }, this),
                                pkgxOptions.length === 0 && !isLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-muted-foreground",
                                    children: "Tất cả danh mục PKGX đã được liên kết. Hãy đồng bộ danh sách mới từ PKGX."
                                }, void 0, false, {
                                    fileName: "[project]/features/categories/components/pkgx-link-dialog.tsx",
                                    lineNumber: 183,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/categories/components/pkgx-link-dialog.tsx",
                            lineNumber: 170,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/categories/components/pkgx-link-dialog.tsx",
                    lineNumber: 159,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogFooter"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "outline",
                            onClick: ()=>onOpenChange(false),
                            disabled: isSyncing,
                            children: "Hủy"
                        }, void 0, false, {
                            fileName: "[project]/features/categories/components/pkgx-link-dialog.tsx",
                            lineNumber: 191,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            onClick: handleConfirmLink,
                            disabled: !selectedPkgxCategory || isSyncing,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Link2$3e$__["Link2"], {
                                    className: "h-4 w-4 mr-2"
                                }, void 0, false, {
                                    fileName: "[project]/features/categories/components/pkgx-link-dialog.tsx",
                                    lineNumber: 202,
                                    columnNumber: 13
                                }, this),
                                isSyncing ? 'Đang liên kết...' : 'Liên kết'
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/categories/components/pkgx-link-dialog.tsx",
                            lineNumber: 198,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/categories/components/pkgx-link-dialog.tsx",
                    lineNumber: 190,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/features/categories/components/pkgx-link-dialog.tsx",
            lineNumber: 151,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/features/categories/components/pkgx-link-dialog.tsx",
        lineNumber: 150,
        columnNumber: 5
    }, this);
}
_s(PkgxCategoryLinkDialog, "pajBlIwSk5/GtaA7euHZux/aqG4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePkgxSettingsStore"]
    ];
});
_c = PkgxCategoryLinkDialog;
var _c;
__turbopack_context__.k.register(_c, "PkgxCategoryLinkDialog");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/provinces/store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useProvinceStore",
    ()=>useProvinceStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-client] (ecmascript)");
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
const provinceBaseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCrudStore"])(normalizedProvinces, 'provinces', {
    businessIdField: 'id',
    persistKey: 'hrm-provinces',
    getCurrentUser: __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentUserSystemId"]
});
const districtBaseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCrudStore"])(normalizedDistricts, 'districts', {
    persistKey: 'hrm-districts',
    getCurrentUser: __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentUserSystemId"]
});
const wardBaseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCrudStore"])(normalizedWards, 'wards', {
    persistKey: 'hrm-wards',
    getCurrentUser: __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentUserSystemId"]
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
const useProvinceStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((set, get)=>{
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/pricing/data.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "data",
    ()=>data
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/seed-audit.ts [app-client] (ecmascript)");
;
;
const data = [
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PP000001'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('10'),
        name: '10',
        description: 'Giá mặc định',
        type: 'Bán hàng',
        isDefault: true,
        isActive: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-05T08:00:00Z'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PP000002'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('GIANHAP'),
        name: 'Giá nhập',
        description: 'Giá nhập hàng từ nhà cung cấp',
        type: 'Nhập hàng',
        isDefault: true,
        isActive: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-06T08:00:00Z'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PP000003'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('BANLE'),
        name: 'Giá bán lẻ',
        description: 'Giá bán cho khách lẻ',
        type: 'Bán hàng',
        isDefault: false,
        isActive: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-07T08:00:00Z'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PP000004'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('BANBUON'),
        name: 'Giá bán buôn',
        description: 'Giá bán sỉ cho đại lý',
        type: 'Bán hàng',
        isDefault: false,
        isActive: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-08T08:00:00Z'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PP000005'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('SHOPEE'),
        name: 'shopee',
        description: 'Giá bán trên Shopee',
        type: 'Bán hàng',
        isDefault: false,
        isActive: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-09T08:00:00Z'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PP000006'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('TIKTOK'),
        name: 'tiktok',
        description: 'Giá bán trên TikTok',
        type: 'Bán hàng',
        isDefault: false,
        isActive: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-10T08:00:00Z'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PP000007'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('ACE'),
        name: 'ace',
        description: 'Giá bán ACE',
        type: 'Bán hàng',
        isDefault: false,
        isActive: false,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-11T08:00:00Z'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PP000008'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('IDWEB'),
        name: 'idweb',
        description: 'Giá bán web',
        type: 'Bán hàng',
        isDefault: false,
        isActive: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-12T08:00:00Z'
        })
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/pricing/store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePricingPolicyStore",
    ()=>usePricingPolicyStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pricing$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pricing/data.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-client] (ecmascript)");
;
;
;
const baseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCrudStore"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pricing$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["data"], 'pricing-settings', {
    businessIdField: 'id',
    persistKey: 'hrm-pricing-policy-storage',
    getCurrentUser: __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentUserSystemId"]
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
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
"[project]/features/customers/data.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "data",
    ()=>data
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-client] (ecmascript)");
;
const data = [
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])("CUST000001"),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])("KH000001"),
        name: "Công ty Cổ phần Bất động sản Hưng Thịnh",
        email: "info@hungthinhcorp.vn",
        phone: "0901112233",
        company: "Hưng Thịnh Corp",
        status: "Đang giao dịch",
        taxCode: "0301234567",
        zaloPhone: "0901112233",
        currentDebt: 30000000,
        maxDebt: 50000000,
        accountManagerId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000002"),
        accountManagerName: "Trần Thị Bình",
        createdAt: "2024-03-10",
        updatedAt: "2025-10-21T09:30:00Z",
        createdBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000002"),
        updatedBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000002"),
        totalOrders: 2,
        totalSpent: 42000000,
        totalQuantityPurchased: 5,
        totalQuantityReturned: 0,
        lastPurchaseDate: "2025-09-20",
        failedDeliveries: 3,
        lastContactDate: "2025-10-18",
        nextFollowUpDate: "2025-11-05",
        followUpReason: "Đôn đốc ký phụ lục hợp đồng",
        followUpAssigneeId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000002"),
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
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])("KHCT000001"),
                name: "Nguyễn Văn A",
                role: "Giám đốc",
                phone: "0901112233",
                email: "a.nguyen@hungthinhcorp.vn",
                isPrimary: true
            },
            {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])("KHCT000002"),
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
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])("DT000001"),
                orderId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])("ORD000123"),
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
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])("REM000001"),
                reminderDate: "2025-10-21",
                reminderType: "Gọi điện",
                reminderBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000002"),
                reminderByName: "Trần Thị Bình",
                customerResponse: "Hứa trả",
                promisePaymentDate: "2025-10-27",
                notes: "KH đang chờ thanh toán từ khách của họ, hứa trả trong tuần này",
                createdAt: "2025-10-21T09:30:00Z"
            }
        ]
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])("CUST000002"),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])("KH000002"),
        name: "Chuỗi cà phê The Coffee House",
        email: "contact@thecoffeehouse.vn",
        phone: "02871087088",
        company: "The Coffee House",
        status: "Đang giao dịch",
        taxCode: "0313222173",
        zaloPhone: "0902888999",
        currentDebt: 0,
        maxDebt: 100000000,
        accountManagerId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000007"),
        accountManagerName: "Đỗ Hùng",
        createdAt: "2024-01-25",
        updatedAt: "2025-10-10T08:15:00Z",
        createdBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000007"),
        updatedBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000007"),
        totalOrders: 5,
        totalSpent: 156000000,
        totalQuantityPurchased: 15,
        totalQuantityReturned: 0,
        lastPurchaseDate: "2025-10-10",
        failedDeliveries: 0,
        lastContactDate: "2025-10-15",
        nextFollowUpDate: "2025-12-01",
        followUpAssigneeId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000007"),
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
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])("KHCT000003"),
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
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])("CUST000003"),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])("KH000003"),
        name: "Anh Trần Minh Hoàng",
        email: "tmhoang.dev@gmail.com",
        phone: "0987123456",
        company: "Khách lẻ",
        status: "Đang giao dịch",
        zaloPhone: "0987123456",
        currentDebt: 0,
        maxDebt: 10000000,
        accountManagerId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000006"),
        accountManagerName: "Vũ Thị Giang",
        createdAt: "2025-08-01",
        updatedAt: "2025-08-01T10:00:00Z",
        createdBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000006"),
        updatedBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000006"),
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
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])("CUST000004"),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])("KH000004"),
        name: "Shop thời trang GenZ Style",
        email: "genzstyle@fashion.com",
        phone: "0918765432",
        company: "GenZ Style",
        status: "Ngừng Giao Dịch",
        taxCode: "0398765432",
        zaloPhone: "0918765432",
        currentDebt: 500000,
        maxDebt: 20000000,
        accountManagerId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000009"),
        accountManagerName: "Trịnh Văn Khoa",
        createdAt: "2023-11-15",
        updatedAt: "2024-09-20T16:30:00Z",
        createdBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000009"),
        updatedBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000009"),
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
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])("DT000002"),
                orderId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])("ORD000045"),
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
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])("REM000002"),
                reminderDate: "2024-07-01",
                reminderType: "Gọi điện",
                reminderBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000009"),
                reminderByName: "Trịnh Văn Khoa",
                customerResponse: "Không liên lạc được",
                notes: "Gọi nhiều lần không nghe máy",
                createdAt: "2024-07-01T14:00:00Z"
            },
            {
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])("REM000003"),
                reminderDate: "2024-08-15",
                reminderType: "Email",
                reminderBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000009"),
                reminderByName: "Trịnh Văn Khoa",
                customerResponse: "Không liên lạc được",
                notes: "Email gửi nhưng không phản hồi",
                createdAt: "2024-08-15T10:00:00Z"
            },
            {
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])("REM000004"),
                reminderDate: "2024-09-20",
                reminderType: "Gặp trực tiếp",
                reminderBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000009"),
                reminderByName: "Trịnh Văn Khoa",
                customerResponse: "Từ chối",
                notes: "KH gặp khó khăn tài chính, từ chối thanh toán. Đề xuất xử lý pháp lý",
                createdAt: "2024-09-20T16:30:00Z"
            }
        ]
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/customers/lifecycle-utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "calculateLifecycleStage",
    ()=>calculateLifecycleStage,
    "getLifecycleStageVariant",
    ()=>getLifecycleStageVariant,
    "updateAllCustomerLifecycleStages",
    ()=>updateAllCustomerLifecycleStages
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-client] (ecmascript)");
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
    const daysSinceLastPurchase = lastPurchaseDate ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDaysDiff"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentDate"])(), new Date(lastPurchaseDate)) : Infinity;
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/customers/credit-utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/customers/intelligence-utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-client] (ecmascript)");
;
const calculateRFMScores = (customer, allCustomers)=>{
    // Recency: Số ngày từ lần mua cuối
    const daysSinceLastPurchase = customer.lastPurchaseDate ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDaysDiff"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentDate"])(), new Date(customer.lastPurchaseDate)) : 999999;
    // Frequency: Tổng số đơn hàng
    const frequency = customer.totalOrders || 0;
    // Monetary: Tổng chi tiêu
    const monetary = customer.totalSpent || 0;
    // Calculate percentiles for scoring
    const allRecencies = allCustomers.map((c)=>c.lastPurchaseDate ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDaysDiff"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentDate"])(), new Date(c.lastPurchaseDate)) : 999999).sort((a, b)=>a - b);
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
    const daysSinceLastPurchase = customer.lastPurchaseDate ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDaysDiff"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentDate"])(), new Date(customer.lastPurchaseDate)) : Infinity;
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
    const daysSinceLastPurchase = customer.lastPurchaseDate ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDaysDiff"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentDate"])(), new Date(customer.lastPurchaseDate)) : Infinity;
    const totalOrders = customer.totalOrders || 0;
    // Nếu khách mới (chưa có đơn hoặc chỉ 1 đơn), dùng default 30 ngày
    // Nếu khách cũ, tính dựa trên thời gian từ createdAt đến lastPurchaseDate / số đơn
    let avgDaysBetweenOrders = 30; // Default
    if (totalOrders > 1 && customer.createdAt && customer.lastPurchaseDate) {
        const customerAge = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDaysDiff"])(new Date(customer.lastPurchaseDate), new Date(customer.createdAt));
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/customers/debt-tracking-utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-client] (ecmascript)");
;
const calculateDueDate = (orderDate, paymentTermsDays)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toISODate"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addDays"])(new Date(orderDate), paymentTermsDays));
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
    const days = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDaysDiff"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentDate"])(), new Date(dueDate));
    return days > 0 ? days : 0;
};
const calculateDaysUntilDue = (dueDate)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDaysDiff"])(new Date(dueDate), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentDate"])());
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
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isDateBefore"])(new Date(current.dueDate), new Date(oldest.dueDate)) ? current : oldest;
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
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(dateString);
};
const formatCurrency = (value)=>{
    if (typeof value !== 'number') return '0 ₫';
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(value);
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/customers/store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCustomerStore",
    ()=>useCustomerStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/customers/data.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$lifecycle$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/customers/lifecycle-utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$credit$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/customers/credit-utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$intelligence$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/customers/intelligence-utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$debt$2d$tracking$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/customers/debt-tracking-utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/fuse.js/dist/fuse.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/activity-history-helper.ts [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
;
const baseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCrudStore"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["data"], 'customers', {
    businessIdField: 'id',
    persistKey: 'hrm-customers',
    getCurrentUser: __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentUserSystemId"]
});
// Augmented methods
const augmentedMethods = {
    searchCustomers: async (query, page, limit = 20)=>{
        return new Promise((resolve)=>{
            setTimeout(()=>{
                const allCustomers = baseStore.getState().data;
                // Create fresh Fuse instance with current data (avoid stale data)
                const fuse = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](allCustomers, {
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
                        const rfmScores = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$intelligence$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateRFMScores"])(updatedCustomer, allCustomers);
                        const segment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$intelligence$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCustomerSegment"])(rfmScores);
                        const healthScore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$intelligence$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateHealthScore"])(updatedCustomer);
                        const churnRisk = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$intelligence$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateChurnRisk"])(updatedCustomer).risk;
                        const lifecycleStage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$lifecycle$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateLifecycleStage"])(updatedCustomer);
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
                        const rfmScores = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$intelligence$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateRFMScores"])(updatedCustomer, allCustomers);
                        const segment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$intelligence$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCustomerSegment"])(rfmScores);
                        const healthScore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$intelligence$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateHealthScore"])(updatedCustomer);
                        const churnRisk = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$intelligence$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateChurnRisk"])(updatedCustomer).risk;
                        const lifecycleStage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$lifecycle$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateLifecycleStage"])(updatedCustomer);
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
        const userInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentUserInfo"])();
        const customerWithLifecycle = {
            ...customer,
            lifecycleStage: (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$lifecycle$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateLifecycleStage"])(customer)
        };
        const newCustomer = baseStore.getState().add(customerWithLifecycle);
        // Add activity history entry
        const historyEntry = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCreatedEntry"])(userInfo, `${userInfo.name} đã tạo khách hàng ${newCustomer.name} (${newCustomer.id})`);
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
        const userInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentUserInfo"])();
        const existingCustomer = baseStore.getState().data.find((c)=>c.systemId === systemId);
        const historyEntries = [];
        if (existingCustomer) {
            // Track status changes
            if (existingCustomer.status !== updatedCustomer.status) {
                historyEntries.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createStatusChangedEntry"])(userInfo, existingCustomer.status, updatedCustomer.status, `${userInfo.name} đã đổi trạng thái từ "${existingCustomer.status}" sang "${updatedCustomer.status}"`));
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
                historyEntries.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createUpdatedEntry"])(userInfo, `${userInfo.name} đã cập nhật: ${changes.join(', ')}`));
            }
        }
        const customerWithLifecycle = {
            ...updatedCustomer,
            lifecycleStage: (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$lifecycle$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateLifecycleStage"])(updatedCustomer),
            activityHistory: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["appendHistoryEntry"])(existingCustomer?.activityHistory, ...historyEntries)
        };
        console.log('[CustomerStore] Calling baseStore.update with:', customerWithLifecycle);
        // Call the update function from baseStore directly
        baseStore.getState().update(systemId, customerWithLifecycle);
        console.log('[CustomerStore] State after update:', baseStore.getState().data.find((c)=>c.systemId === systemId));
    },
    // Get customers with high debt risk
    getHighRiskDebtCustomers: ()=>{
        const activeCustomers = baseStore.getState().getActive();
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$credit$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getHighRiskDebtCustomers"])(activeCustomers);
    },
    // Batch update customer intelligence (RFM, health score, churn risk)
    updateCustomerIntelligence: ()=>{
        const allCustomers = baseStore.getState().getActive();
        baseStore.setState((state)=>({
                data: state.data.map((customer)=>{
                    if (customer.isDeleted) return customer;
                    // Calculate RFM
                    const rfmScores = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$intelligence$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateRFMScores"])(customer, allCustomers);
                    const segment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$intelligence$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCustomerSegment"])(rfmScores);
                    // Calculate health score
                    const healthScore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$intelligence$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateHealthScore"])(customer);
                    // Calculate churn risk
                    const churnRisk = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$intelligence$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateChurnRisk"])(customer).risk;
                    // Calculate lifecycle stage
                    const lifecycleStage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$lifecycle$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateLifecycleStage"])(customer);
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
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$debt$2d$tracking$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getOverdueDebtCustomers"])(activeCustomers);
    },
    // Get customers with debt due soon
    getDueSoonCustomers: ()=>{
        const activeCustomers = baseStore.getState().getActive();
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$debt$2d$tracking$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDueSoonCustomers"])(activeCustomers);
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/branches/data.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "data",
    ()=>data
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/seed-audit.ts [app-client] (ecmascript)");
;
;
const data = [
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('CN000001'),
        name: 'Trụ sở chính',
        address: '123 Đường ABC, Quận 1, TP.HCM',
        phone: '02833334444',
        managerId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000001'),
        isDefault: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-01T08:00:00Z'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('CN000002'),
        name: 'Chi nhánh Hà Nội',
        address: '456 Đường XYZ, Quận Hai Bà Trưng, Hà Nội',
        phone: '02488889999',
        managerId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000002'),
        isDefault: false,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-02T08:00:00Z'
        })
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/branches/store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useBranchStore",
    ()=>useBranchStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/branches/data.ts [app-client] (ecmascript)");
;
;
const baseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCrudStore"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["data"], 'branches');
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/employees/data.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "data",
    ()=>data
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-client] (ecmascript)");
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
const SEED_AUTHOR = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000001');
const buildAuditFields = (createdAt, createdBy = SEED_AUTHOR)=>({
        createdAt,
        updatedAt: createdAt,
        createdBy,
        updatedBy: createdBy
    });
const data = [
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000001')),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('1'),
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
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
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
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000002')),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('2'),
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
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
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
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000003')),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('3'),
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
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('CN000002'),
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
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000004')),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('4'),
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
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
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
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000005'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('5'),
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
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
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
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000006'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('6'),
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
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('CN000002'),
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
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('7'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('NV000007'),
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
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
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
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000008'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('8'),
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
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
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
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000009'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('9'),
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
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('CN000002'),
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
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000010'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('10'),
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
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
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
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000011'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('11'),
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
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
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
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000012'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('12'),
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
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('CN000002'),
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/employees/store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "employeeRepository",
    ()=>employeeRepository,
    "useEmployeeStore",
    ()=>useEmployeeStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/employees/data.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/fuse.js/dist/fuse.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$breadcrumb$2d$generator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/breadcrumb-generator.ts [app-client] (ecmascript)"); // ✅ NEW
var __TURBOPACK__imported__module__$5b$project$5d2f$repositories$2f$in$2d$memory$2d$repository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/repositories/in-memory-repository.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/activity-history-helper.ts [app-client] (ecmascript)");
;
;
;
;
;
;
;
const baseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCrudStore"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["data"], 'employees', {
    businessIdField: 'id',
    persistKey: 'hrm-employees',
    getCurrentUser: __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentUserSystemId"]
});
// ✅ Wrap add method to include activity history
const originalAdd = baseStore.getState().add;
const wrappedAdd = (item)=>{
    const userInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentUserInfo"])();
    const historyEntry = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createHistoryEntry"])('created', `${userInfo.name} đã tạo hồ sơ nhân viên ${item.fullName} (${item.id})`, userInfo);
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
    const userInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentUserInfo"])();
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
            historyEntries.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createHistoryEntry"])('updated', `${userInfo.name} đã cập nhật ${label}: "${oldDisplay || '(trống)'}" → "${newDisplay}"`, userInfo, {
                field: key,
                oldValue,
                newValue
            }));
        }
    });
    // If status changed specifically
    if (updates.employmentStatus && updates.employmentStatus !== currentEmployee.employmentStatus) {
        historyEntries.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createHistoryEntry"])('status_changed', `${userInfo.name} đã thay đổi trạng thái làm việc từ "${currentEmployee.employmentStatus}" thành "${updates.employmentStatus}"`, userInfo, {
            field: 'employmentStatus',
            oldValue: currentEmployee.employmentStatus,
            newValue: updates.employmentStatus
        }));
    }
    // If no specific changes tracked, add generic update entry
    if (historyEntries.length === 0) {
        historyEntries.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createHistoryEntry"])('updated', `${userInfo.name} đã cập nhật thông tin nhân viên`, userInfo));
    }
    const updatedHistory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["appendHistoryEntry"])(currentEmployee.activityHistory, ...historyEntries);
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
const employeeRepository = (0, __TURBOPACK__imported__module__$5b$project$5d2f$repositories$2f$in$2d$memory$2d$repository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createInMemoryRepository"])(()=>baseStore.getState());
const persistence = {
    create: (payload)=>employeeRepository.create(payload),
    update: (systemId, payload)=>employeeRepository.update(systemId, payload),
    softDelete: (systemId)=>employeeRepository.softDelete(systemId),
    restore: (systemId)=>employeeRepository.restore(systemId),
    hardDelete: (systemId)=>employeeRepository.hardDelete(systemId)
};
// ✅ Register for breadcrumb auto-generation
(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$breadcrumb$2d$generator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["registerBreadcrumbStore"])('employees', ()=>baseStore.getState());
// Augmented methods
const augmentedMethods = {
    // FIX: Changed `page: number = 1` to `page: number` to make it a required parameter, matching Combobox prop type.
    // ✅ CRITICAL FIX: Create fresh Fuse instance on each search to avoid stale data
    searchEmployees: async (query, page, limit = 20)=>{
        return new Promise((resolve)=>{
            setTimeout(()=>{
                const allEmployees = baseStore.getState().data;
                // ✅ Create fresh Fuse instance with current data
                const fuse = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](allEmployees, {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/categories/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProductCategoriesPage",
    ()=>ProductCategoriesPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2f$shallow$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react/shallow.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$power$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Power$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/power.js [app-client] (ecmascript) <export default as Power>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$power$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PowerOff$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/power-off.js [app-client] (ecmascript) <export default as PowerOff>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-client] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$text$2d$align$2d$start$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlignLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/text-align-start.js [app-client] (ecmascript) <export default as AlignLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/external-link.js [app-client] (ecmascript) <export default as ExternalLink>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderEdit$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/folder-pen.js [app-client] (ecmascript) <export default as FolderEdit>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-up.js [app-client] (ecmascript) <export default as FileUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.js [app-client] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$column$2d$visibility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/use-column-visibility.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$page$2d$header$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/page-header-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$inventory$2f$product$2d$category$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/inventory/product-category-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$responsive$2d$data$2d$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/data-table/responsive-data-table.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/alert-dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$column$2d$toggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/data-table/data-table-column-toggle.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$faceted$2d$filter$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/data-table/data-table-faceted-filter.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$page$2d$toolbar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/layout/page-toolbar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$page$2d$filters$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/layout/page-filters.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$media$2d$query$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/use-media-query.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/fuse.js/dist/fuse.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$categories$2f$columns$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/categories/columns.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$categories$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/categories/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$categories$2f$hooks$2f$use$2d$pkgx$2d$category$2d$sync$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/categories/hooks/use-pkgx-category-sync.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/pkgx/api-service.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$categories$2f$components$2f$pkgx$2d$link$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/categories/components/pkgx-link-dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$generic$2d$import$2d$dialog$2d$v2$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/shared/generic-import-dialog-v2.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$generic$2d$export$2d$dialog$2d$v2$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/shared/generic-export-dialog-v2.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$export$2f$configs$2f$category$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/import-export/configs/category.config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
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
function ProductCategoriesPage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const isMobile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$media$2d$query$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMediaQuery"])("(max-width: 768px)");
    const { employee: authEmployee } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    // ✅ Use shallow comparison to prevent unnecessary re-renders
    const { data, add, update, remove } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$inventory$2f$product$2d$category$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductCategoryStore"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2f$shallow$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useShallow"])({
        "ProductCategoriesPage.useProductCategoryStore.useShallow": (state)=>({
                data: state.data,
                add: state.add,
                update: state.update,
                remove: state.remove
            })
    }["ProductCategoriesPage.useProductCategoryStore.useShallow"]));
    const activeCategories = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "ProductCategoriesPage.useMemo[activeCategories]": ()=>data.filter({
                "ProductCategoriesPage.useMemo[activeCategories]": (c)=>!c.isDeleted
            }["ProductCategoriesPage.useMemo[activeCategories]"])
    }["ProductCategoriesPage.useMemo[activeCategories]"], [
        data
    ]);
    // State
    const [rowSelection, setRowSelection] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]({});
    const [isAlertOpen, setIsAlertOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    const [idToDelete, setIdToDelete] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](null);
    const [isBulkDeleteAlertOpen, setIsBulkDeleteAlertOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    const [sorting, setSorting] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]({
        id: 'path',
        desc: false
    });
    const [globalFilter, setGlobalFilter] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]('');
    const [debouncedGlobalFilter, setDebouncedGlobalFilter] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]('');
    const [pagination, setPagination] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]({
        pageIndex: 0,
        pageSize: 20
    });
    const [mobileLoadedCount, setMobileLoadedCount] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](20);
    const [columnVisibility, setColumnVisibility] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$column$2d$visibility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useColumnVisibility"])('categories', {});
    const [columnOrder, setColumnOrder] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]([]);
    const [pinnedColumns, setPinnedColumns] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]([
        'select',
        'thumbnailImage',
        'name'
    ]);
    // Filters
    const [statusFilter, setStatusFilter] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](new Set());
    const [levelFilter, setLevelFilter] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](new Set());
    // Debounce search
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "ProductCategoriesPage.useEffect": ()=>{
            const timer = setTimeout({
                "ProductCategoriesPage.useEffect.timer": ()=>{
                    setDebouncedGlobalFilter(globalFilter);
                }
            }["ProductCategoriesPage.useEffect.timer"], 300);
            return ({
                "ProductCategoriesPage.useEffect": ()=>clearTimeout(timer)
            })["ProductCategoriesPage.useEffect"];
        }
    }["ProductCategoriesPage.useEffect"], [
        globalFilter
    ]);
    // Handlers
    const handleDelete = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "ProductCategoriesPage.useCallback[handleDelete]": (systemId)=>{
            // Check if has children
            const hasChildren = data.some({
                "ProductCategoriesPage.useCallback[handleDelete].hasChildren": (c)=>c.parentId === systemId && !c.isDeleted
            }["ProductCategoriesPage.useCallback[handleDelete].hasChildren"]);
            if (hasChildren) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Không thể xóa danh mục có danh mục con');
                return;
            }
            setIdToDelete(systemId);
            setIsAlertOpen(true);
        }
    }["ProductCategoriesPage.useCallback[handleDelete]"], [
        data
    ]);
    const handleToggleActive = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "ProductCategoriesPage.useCallback[handleToggleActive]": (systemId, isActive)=>{
            update((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(systemId), {
                isActive
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(isActive ? 'Đã kích hoạt danh mục' : 'Đã tắt danh mục');
        }
    }["ProductCategoriesPage.useCallback[handleToggleActive]"], [
        update
    ]);
    // Inline edit handlers
    const handleUpdateName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "ProductCategoriesPage.useCallback[handleUpdateName]": (systemId, name)=>{
            update((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(systemId), {
                name
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Đã cập nhật tên danh mục');
        }
    }["ProductCategoriesPage.useCallback[handleUpdateName]"], [
        update
    ]);
    const handleUpdateSortOrder = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "ProductCategoriesPage.useCallback[handleUpdateSortOrder]": (systemId, sortOrder)=>{
            update((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(systemId), {
                sortOrder
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Đã cập nhật thứ tự');
        }
    }["ProductCategoriesPage.useCallback[handleUpdateSortOrder]"], [
        update
    ]);
    // Bulk actions
    const handleBulkActivate = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "ProductCategoriesPage.useCallback[handleBulkActivate]": ()=>{
            const ids = Object.keys(rowSelection);
            ids.forEach({
                "ProductCategoriesPage.useCallback[handleBulkActivate]": (id)=>update((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(id), {
                        isActive: true
                    })
            }["ProductCategoriesPage.useCallback[handleBulkActivate]"]);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(`Đã kích hoạt ${ids.length} danh mục`);
            setRowSelection({});
        }
    }["ProductCategoriesPage.useCallback[handleBulkActivate]"], [
        rowSelection,
        update
    ]);
    const handleBulkDeactivate = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "ProductCategoriesPage.useCallback[handleBulkDeactivate]": ()=>{
            const ids = Object.keys(rowSelection);
            ids.forEach({
                "ProductCategoriesPage.useCallback[handleBulkDeactivate]": (id)=>update((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(id), {
                        isActive: false
                    })
            }["ProductCategoriesPage.useCallback[handleBulkDeactivate]"]);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(`Đã tắt ${ids.length} danh mục`);
            setRowSelection({});
        }
    }["ProductCategoriesPage.useCallback[handleBulkDeactivate]"], [
        rowSelection,
        update
    ]);
    const handleRowClick = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "ProductCategoriesPage.useCallback[handleRowClick]": (category)=>{
            router.push(`/categories/${category.systemId}`);
        }
    }["ProductCategoriesPage.useCallback[handleRowClick]"], [
        router
    ]);
    // PKGX Sync Hook
    const { handleSyncSeo, handleSyncDescription, handleSyncAll, handleSyncBasic, hasPkgxMapping, getPkgxCatId } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$categories$2f$hooks$2f$use$2d$pkgx$2d$category$2d$sync$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePkgxCategorySync"])();
    const pkgxSettings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePkgxSettingsStore"])({
        "ProductCategoriesPage.usePkgxSettingsStore[pkgxSettings]": (s)=>s.settings
    }["ProductCategoriesPage.usePkgxSettingsStore[pkgxSettings]"]);
    const deleteCategoryMapping = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePkgxSettingsStore"])({
        "ProductCategoriesPage.usePkgxSettingsStore[deleteCategoryMapping]": (s)=>s.deleteCategoryMapping
    }["ProductCategoriesPage.usePkgxSettingsStore[deleteCategoryMapping]"]);
    const getCategoryMappingByHrmId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePkgxSettingsStore"])({
        "ProductCategoriesPage.usePkgxSettingsStore[getCategoryMappingByHrmId]": (s)=>s.getCategoryMappingByHrmId
    }["ProductCategoriesPage.usePkgxSettingsStore[getCategoryMappingByHrmId]"]);
    // PKGX Link Dialog state
    const [pkgxLinkDialogOpen, setPkgxLinkDialogOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    const [categoryToLink, setCategoryToLink] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](null);
    // Import/Export Dialog states
    const [isImportOpen, setIsImportOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    const [isExportOpen, setIsExportOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    // PKGX Link handlers
    const handlePkgxLink = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "ProductCategoriesPage.useCallback[handlePkgxLink]": (category)=>{
            setCategoryToLink(category);
            setPkgxLinkDialogOpen(true);
        }
    }["ProductCategoriesPage.useCallback[handlePkgxLink]"], []);
    const handlePkgxUnlink = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "ProductCategoriesPage.useCallback[handlePkgxUnlink]": (category)=>{
            const mapping = getCategoryMappingByHrmId(category.systemId);
            if (mapping) {
                deleteCategoryMapping(mapping.id);
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(`Đã hủy liên kết danh mục "${category.name}" với PKGX`);
            }
        }
    }["ProductCategoriesPage.useCallback[handlePkgxUnlink]"], [
        getCategoryMappingByHrmId,
        deleteCategoryMapping
    ]);
    const handlePkgxLinkSuccess = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "ProductCategoriesPage.useCallback[handlePkgxLinkSuccess]": ()=>{
        // Refresh handled by store update
        }
    }["ProductCategoriesPage.useCallback[handlePkgxLinkSuccess]"], []);
    // Import handler
    const handleImport = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "ProductCategoriesPage.useCallback[handleImport]": async (importData, mode, _branchId)=>{
            const results = {
                success: 0,
                failed: 0,
                inserted: 0,
                updated: 0,
                skipped: 0,
                errors: []
            };
            try {
                for(let i = 0; i < importData.length; i++){
                    const item = importData[i];
                    try {
                        // Check if category exists (by id)
                        const existingCategory = activeCategories.find({
                            "ProductCategoriesPage.useCallback[handleImport].existingCategory": (c)=>item.id && c.id === item.id
                        }["ProductCategoriesPage.useCallback[handleImport].existingCategory"]);
                        if (existingCategory) {
                            // Category exists
                            if (mode === 'insert-only') {
                                // Skip in insert-only mode
                                results.skipped++;
                                continue;
                            }
                            // Update existing category
                            const updatedFields = {
                                ...item,
                                updatedAt: new Date().toISOString()
                            };
                            // Remove fields that shouldn't be overwritten
                            delete updatedFields.systemId;
                            delete updatedFields.createdAt;
                            // Recalculate path if parentId changed
                            if (item.parentId && item.parentId !== existingCategory.parentId) {
                                const parent = data.find({
                                    "ProductCategoriesPage.useCallback[handleImport].parent": (c)=>c.systemId === item.parentId
                                }["ProductCategoriesPage.useCallback[handleImport].parent"]);
                                if (parent) {
                                    updatedFields.path = parent.path ? `${parent.path} > ${item.name || existingCategory.name}` : item.name || existingCategory.name;
                                    updatedFields.level = (parent.level ?? 0) + 1;
                                }
                            }
                            update(existingCategory.systemId, updatedFields);
                            results.updated++;
                            results.success++;
                        } else {
                            // Category does not exist
                            if (mode === 'update-only') {
                                // Skip in update-only mode
                                results.skipped++;
                                continue;
                            }
                            // Calculate path and level based on parentId
                            let path = item.name || '';
                            let level = 0;
                            if (item.parentId) {
                                const parent = data.find({
                                    "ProductCategoriesPage.useCallback[handleImport].parent": (c)=>c.systemId === item.parentId
                                }["ProductCategoriesPage.useCallback[handleImport].parent"]);
                                if (parent) {
                                    path = parent.path ? `${parent.path} > ${item.name}` : item.name || '';
                                    level = (parent.level ?? 0) + 1;
                                }
                            }
                            // Insert new category
                            const newCategory = {
                                ...item,
                                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])(item.id || `CAT-${Date.now()}`),
                                name: item.name || '',
                                path,
                                level,
                                sortOrder: item.sortOrder ?? 0,
                                isActive: item.isActive !== false,
                                isDeleted: false,
                                createdAt: new Date().toISOString(),
                                updatedAt: new Date().toISOString()
                            };
                            add(newCategory);
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
                console.error('[Categories Importer] Lỗi nhập danh mục', error);
                throw error;
            }
        }
    }["ProductCategoriesPage.useCallback[handleImport]"], [
        activeCategories,
        data,
        add,
        update
    ]);
    const columns = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "ProductCategoriesPage.useMemo[columns]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$categories$2f$columns$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getColumns"])(handleDelete, handleToggleActive, router.push, data, handleUpdateName, handleUpdateSortOrder, // PKGX handlers
            handleSyncSeo, handleSyncDescription, handleSyncAll, handleSyncBasic, hasPkgxMapping, getPkgxCatId, handlePkgxLink, handlePkgxUnlink)
    }["ProductCategoriesPage.useMemo[columns]"], [
        handleDelete,
        handleToggleActive,
        router,
        data,
        handleUpdateName,
        handleUpdateSortOrder,
        handleSyncSeo,
        handleSyncDescription,
        handleSyncAll,
        handleSyncBasic,
        hasPkgxMapping,
        getPkgxCatId,
        handlePkgxLink,
        handlePkgxUnlink
    ]);
    // Export config
    const _exportConfig = {
        fileName: 'Danh_muc_san_pham',
        columns
    };
    // Set default column visibility - only on mount
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "ProductCategoriesPage.useEffect": ()=>{
            // Skip if visibility is already set
            if (Object.keys(columnVisibility).length > 0) return;
            const defaultVisibleColumns = [
                'thumbnailImage',
                'id',
                'name',
                'sortOrder',
                'level',
                'childCount',
                'productCount',
                'seoPkgx',
                'seoTrendtech',
                'pkgxStatus',
                'pkgx',
                'isActive',
                'createdAt'
            ];
            const columnIds = [
                'select',
                'thumbnailImage',
                'id',
                'name',
                'sortOrder',
                'level',
                'childCount',
                'productCount',
                'seoPkgx',
                'seoTrendtech',
                'pkgxStatus',
                'pkgx',
                'isActive',
                'createdAt',
                'actions'
            ];
            const initialVisibility = {};
            columnIds.forEach({
                "ProductCategoriesPage.useEffect": (id)=>{
                    if (id === 'select' || id === 'actions') {
                        initialVisibility[id] = true;
                    } else {
                        initialVisibility[id] = defaultVisibleColumns.includes(id);
                    }
                }
            }["ProductCategoriesPage.useEffect"]);
            setColumnVisibility(initialVisibility);
            setColumnOrder(columnIds);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["ProductCategoriesPage.useEffect"], [
        columnVisibility
    ]);
    const fuse = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "ProductCategoriesPage.useMemo[fuse]": ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](activeCategories, {
                keys: [
                    "id",
                    "name",
                    "path",
                    "slug"
                ],
                threshold: 0.3,
                ignoreLocation: true
            })
    }["ProductCategoriesPage.useMemo[fuse]"], [
        activeCategories
    ]);
    const confirmDelete = ()=>{
        if (idToDelete) {
            remove((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(idToDelete));
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success("Đã xóa danh mục");
        }
        setIsAlertOpen(false);
        setIdToDelete(null);
    };
    const confirmBulkDelete = ()=>{
        const idsToDelete = Object.keys(rowSelection);
        // Check for children
        const hasChildrenIds = idsToDelete.filter((id)=>data.some((c)=>c.parentId === id && !c.isDeleted));
        if (hasChildrenIds.length > 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Không thể xóa danh mục có danh mục con');
            return;
        }
        idsToDelete.forEach((id)=>remove((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(id)));
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(`Đã xóa ${idsToDelete.length} danh mục`);
        setRowSelection({});
        setIsBulkDeleteAlertOpen(false);
    };
    // Filter options
    const statusOptions = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "ProductCategoriesPage.useMemo[statusOptions]": ()=>[
                {
                    value: 'active',
                    label: 'Hoạt động'
                },
                {
                    value: 'inactive',
                    label: 'Tạm tắt'
                }
            ]
    }["ProductCategoriesPage.useMemo[statusOptions]"], []);
    const levelOptions = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "ProductCategoriesPage.useMemo[levelOptions]": ()=>{
            const maxLevel = Math.max(...activeCategories.map({
                "ProductCategoriesPage.useMemo[levelOptions].maxLevel": (c)=>c.level ?? 0
            }["ProductCategoriesPage.useMemo[levelOptions].maxLevel"]), 0);
            return Array.from({
                length: maxLevel + 1
            }, {
                "ProductCategoriesPage.useMemo[levelOptions]": (_, i)=>({
                        value: String(i),
                        label: `Cấp ${i}`
                    })
            }["ProductCategoriesPage.useMemo[levelOptions]"]);
        }
    }["ProductCategoriesPage.useMemo[levelOptions]"], [
        activeCategories
    ]);
    // Apply all filters
    const filteredData = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "ProductCategoriesPage.useMemo[filteredData]": ()=>{
            let result = activeCategories;
            // Status filter
            if (statusFilter.size > 0) {
                result = result.filter({
                    "ProductCategoriesPage.useMemo[filteredData]": (c)=>{
                        const status = c.isActive !== false ? 'active' : 'inactive';
                        return statusFilter.has(status);
                    }
                }["ProductCategoriesPage.useMemo[filteredData]"]);
            }
            // Level filter
            if (levelFilter.size > 0) {
                result = result.filter({
                    "ProductCategoriesPage.useMemo[filteredData]": (c)=>levelFilter.has(String(c.level ?? 0))
                }["ProductCategoriesPage.useMemo[filteredData]"]);
            }
            // Text search (debounced)
            if (debouncedGlobalFilter) {
                const searchResults = fuse.search(debouncedGlobalFilter);
                const searchIds = new Set(searchResults.map({
                    "ProductCategoriesPage.useMemo[filteredData]": (r)=>r.item.systemId
                }["ProductCategoriesPage.useMemo[filteredData]"]));
                result = result.filter({
                    "ProductCategoriesPage.useMemo[filteredData]": (c)=>searchIds.has(c.systemId)
                }["ProductCategoriesPage.useMemo[filteredData]"]);
            }
            return result;
        }
    }["ProductCategoriesPage.useMemo[filteredData]"], [
        activeCategories,
        statusFilter,
        levelFilter,
        debouncedGlobalFilter,
        fuse
    ]);
    const sortedData = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "ProductCategoriesPage.useMemo[sortedData]": ()=>{
            const sorted = [
                ...filteredData
            ];
            if (sorting.id) {
                sorted.sort({
                    "ProductCategoriesPage.useMemo[sortedData]": (a, b)=>{
                        const aValue = a[sorting.id];
                        const bValue = b[sorting.id];
                        if (sorting.id === 'createdAt') {
                            const aTime = aValue ? new Date(aValue).getTime() : 0;
                            const bTime = bValue ? new Date(bValue).getTime() : 0;
                            return sorting.desc ? bTime - aTime : aTime - bTime;
                        }
                        if (sorting.id === 'level') {
                            const aNum = typeof aValue === 'number' ? aValue : 0;
                            const bNum = typeof bValue === 'number' ? bValue : 0;
                            return sorting.desc ? bNum - aNum : aNum - bNum;
                        }
                        const aStr = String(aValue ?? '');
                        const bStr = String(bValue ?? '');
                        if (aStr < bStr) return sorting.desc ? 1 : -1;
                        if (aStr > bStr) return sorting.desc ? -1 : 1;
                        return 0;
                    }
                }["ProductCategoriesPage.useMemo[sortedData]"]);
            }
            return sorted;
        }
    }["ProductCategoriesPage.useMemo[sortedData]"], [
        filteredData,
        sorting
    ]);
    const allSelectedRows = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "ProductCategoriesPage.useMemo[allSelectedRows]": ()=>activeCategories.filter({
                "ProductCategoriesPage.useMemo[allSelectedRows]": (c)=>rowSelection[String(c.systemId)]
            }["ProductCategoriesPage.useMemo[allSelectedRows]"])
    }["ProductCategoriesPage.useMemo[allSelectedRows]"], [
        activeCategories,
        rowSelection
    ]);
    // Mobile infinite scroll
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "ProductCategoriesPage.useEffect": ()=>{
            if (!isMobile) return;
            const handleScroll = {
                "ProductCategoriesPage.useEffect.handleScroll": ()=>{
                    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    const scrollHeight = document.documentElement.scrollHeight;
                    const clientHeight = window.innerHeight;
                    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
                    if (scrollPercentage > 0.8 && mobileLoadedCount < sortedData.length) {
                        setMobileLoadedCount({
                            "ProductCategoriesPage.useEffect.handleScroll": (prev)=>Math.min(prev + 20, sortedData.length)
                        }["ProductCategoriesPage.useEffect.handleScroll"]);
                    }
                }
            }["ProductCategoriesPage.useEffect.handleScroll"];
            window.addEventListener('scroll', handleScroll);
            return ({
                "ProductCategoriesPage.useEffect": ()=>window.removeEventListener('scroll', handleScroll)
            })["ProductCategoriesPage.useEffect"];
        }
    }["ProductCategoriesPage.useEffect"], [
        isMobile,
        mobileLoadedCount,
        sortedData.length
    ]);
    // Reset mobile loaded count when filters change
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "ProductCategoriesPage.useEffect": ()=>{
            setMobileLoadedCount(20);
        }
    }["ProductCategoriesPage.useEffect"], [
        debouncedGlobalFilter,
        statusFilter,
        levelFilter
    ]);
    const pageCount = Math.ceil(sortedData.length / pagination.pageSize);
    const paginatedData = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "ProductCategoriesPage.useMemo[paginatedData]": ()=>sortedData.slice(pagination.pageIndex * pagination.pageSize, (pagination.pageIndex + 1) * pagination.pageSize)
    }["ProductCategoriesPage.useMemo[paginatedData]"], [
        sortedData,
        pagination
    ]);
    // Header actions
    const headerActions = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "ProductCategoriesPage.useMemo[headerActions]": ()=>[
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                    size: "sm",
                    className: "h-9",
                    onClick: {
                        "ProductCategoriesPage.useMemo[headerActions]": ()=>router.push('/categories/new')
                    }["ProductCategoriesPage.useMemo[headerActions]"],
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                            className: "mr-2 h-4 w-4"
                        }, void 0, false, {
                            fileName: "[project]/features/categories/page.tsx",
                            lineNumber: 437,
                            columnNumber: 7
                        }, this),
                        "Thêm danh mục"
                    ]
                }, "add", true, {
                    fileName: "[project]/features/categories/page.tsx",
                    lineNumber: 436,
                    columnNumber: 5
                }, this)
            ]
    }["ProductCategoriesPage.useMemo[headerActions]"], [
        router
    ]);
    // Dùng auto-generated title từ PATH_PATTERNS
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$page$2d$header$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePageHeader"])({
        actions: headerActions,
        showBackButton: false
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-4 h-full flex flex-col",
        children: [
            !isMobile && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$page$2d$toolbar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PageToolbar"], {
                leftActions: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "outline",
                            size: "sm",
                            onClick: ()=>setIsImportOpen(true),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileUp$3e$__["FileUp"], {
                                    className: "mr-2 h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/features/categories/page.tsx",
                                    lineNumber: 456,
                                    columnNumber: 17
                                }, void 0),
                                "Nhập file"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/categories/page.tsx",
                            lineNumber: 455,
                            columnNumber: 15
                        }, void 0),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "outline",
                            size: "sm",
                            onClick: ()=>setIsExportOpen(true),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                    className: "mr-2 h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/features/categories/page.tsx",
                                    lineNumber: 460,
                                    columnNumber: 17
                                }, void 0),
                                "Xuất Excel"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/categories/page.tsx",
                            lineNumber: 459,
                            columnNumber: 15
                        }, void 0)
                    ]
                }, void 0, true),
                rightActions: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$column$2d$toggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DataTableColumnCustomizer"], {
                        columns: columns,
                        columnVisibility: columnVisibility,
                        setColumnVisibility: setColumnVisibility,
                        columnOrder: columnOrder,
                        setColumnOrder: setColumnOrder,
                        pinnedColumns: pinnedColumns,
                        setPinnedColumns: setPinnedColumns
                    }, "customizer", false, {
                        fileName: "[project]/features/categories/page.tsx",
                        lineNumber: 466,
                        columnNumber: 13
                    }, void 0)
                ]
            }, void 0, false, {
                fileName: "[project]/features/categories/page.tsx",
                lineNumber: 452,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$page$2d$filters$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PageFilters"], {
                searchValue: globalFilter,
                onSearchChange: setGlobalFilter,
                searchPlaceholder: "Tìm theo mã, tên danh mục...",
                rightFilters: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$faceted$2d$filter$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DataTableFacetedFilter"], {
                            title: "Cấp độ",
                            options: levelOptions,
                            selectedValues: levelFilter,
                            onSelectedValuesChange: setLevelFilter
                        }, void 0, false, {
                            fileName: "[project]/features/categories/page.tsx",
                            lineNumber: 487,
                            columnNumber: 13
                        }, void 0),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$faceted$2d$filter$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DataTableFacetedFilter"], {
                            title: "Trạng thái",
                            options: statusOptions,
                            selectedValues: statusFilter,
                            onSelectedValuesChange: setStatusFilter
                        }, void 0, false, {
                            fileName: "[project]/features/categories/page.tsx",
                            lineNumber: 493,
                            columnNumber: 13
                        }, void 0)
                    ]
                }, void 0, true)
            }, void 0, false, {
                fileName: "[project]/features/categories/page.tsx",
                lineNumber: 481,
                columnNumber: 7
            }, this),
            isMobile ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-2 flex-1 overflow-y-auto",
                children: sortedData.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                        className: "p-8 text-center text-muted-foreground",
                        children: "Không tìm thấy danh mục nào"
                    }, void 0, false, {
                        fileName: "[project]/features/categories/page.tsx",
                        lineNumber: 508,
                        columnNumber: 15
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/features/categories/page.tsx",
                    lineNumber: 507,
                    columnNumber: 13
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        sortedData.slice(0, mobileLoadedCount).map((category)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$categories$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MobileCategoryCard"], {
                                category: category,
                                onDelete: handleDelete,
                                onToggleActive: handleToggleActive,
                                navigate: router.push,
                                handleRowClick: handleRowClick,
                                childCount: data.filter((c)=>c.parentId === category.systemId && !c.isDeleted).length
                            }, String(category.systemId), false, {
                                fileName: "[project]/features/categories/page.tsx",
                                lineNumber: 515,
                                columnNumber: 17
                            }, this)),
                        mobileLoadedCount < sortedData.length && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                className: "p-4 text-center text-muted-foreground",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "animate-spin rounded-full h-4 w-4 border-b-2 border-primary"
                                        }, void 0, false, {
                                            fileName: "[project]/features/categories/page.tsx",
                                            lineNumber: 529,
                                            columnNumber: 23
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Đang tải thêm..."
                                        }, void 0, false, {
                                            fileName: "[project]/features/categories/page.tsx",
                                            lineNumber: 530,
                                            columnNumber: 23
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/categories/page.tsx",
                                    lineNumber: 528,
                                    columnNumber: 21
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/features/categories/page.tsx",
                                lineNumber: 527,
                                columnNumber: 19
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/features/categories/page.tsx",
                            lineNumber: 526,
                            columnNumber: 17
                        }, this),
                        mobileLoadedCount >= sortedData.length && sortedData.length > 20 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                className: "p-4 text-center text-muted-foreground text-sm",
                                children: [
                                    "Đã hiển thị tất cả ",
                                    sortedData.length,
                                    " danh mục"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/categories/page.tsx",
                                lineNumber: 537,
                                columnNumber: 19
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/features/categories/page.tsx",
                            lineNumber: 536,
                            columnNumber: 17
                        }, this)
                    ]
                }, void 0, true)
            }, void 0, false, {
                fileName: "[project]/features/categories/page.tsx",
                lineNumber: 505,
                columnNumber: 9
            }, this) : /* Desktop View - Table */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full py-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$responsive$2d$data$2d$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResponsiveDataTable"], {
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
                    bulkActions: [
                        {
                            label: 'Kích hoạt',
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$power$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Power$3e$__["Power"],
                            onSelect: handleBulkActivate
                        },
                        {
                            label: 'Tắt',
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$power$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PowerOff$3e$__["PowerOff"],
                            onSelect: handleBulkDeactivate
                        },
                        {
                            label: 'Xóa',
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"],
                            onSelect: ()=>setIsBulkDeleteAlertOpen(true)
                        }
                    ],
                    pkgxBulkActions: [
                        {
                            label: "Đồng bộ tất cả",
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"],
                            onSelect: async (selectedRows)=>{
                                if (!pkgxSettings.enabled) {
                                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('PKGX chưa được bật');
                                    return;
                                }
                                const linkedCategories = selectedRows.filter((c)=>hasPkgxMapping(c));
                                if (linkedCategories.length === 0) {
                                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Không có danh mục nào đã liên kết PKGX');
                                    return;
                                }
                                if (!confirm(`Bạn có chắc muốn đồng bộ tất cả thông tin cho ${linkedCategories.length} danh mục?`)) {
                                    return;
                                }
                                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].info(`Đang đồng bộ ${linkedCategories.length} danh mục...`);
                                let successCount = 0;
                                let errorCount = 0;
                                for (const category of linkedCategories){
                                    try {
                                        const pkgxCatId = getPkgxCatId(category);
                                        if (!pkgxCatId) continue;
                                        const pkgxSeo = category.websiteSeo?.pkgx;
                                        const payload = {
                                            cat_name: category.name,
                                            cat_alias: pkgxSeo?.slug || category.slug || '',
                                            keywords: pkgxSeo?.seoKeywords || category.seoKeywords || category.name,
                                            meta_title: pkgxSeo?.seoTitle || category.seoTitle || category.name,
                                            meta_desc: pkgxSeo?.metaDescription || category.metaDescription || '',
                                            short_desc: pkgxSeo?.shortDescription || category.shortDescription || '',
                                            cat_desc: pkgxSeo?.longDescription || category.longDescription || ''
                                        };
                                        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateCategory"])(pkgxCatId, payload);
                                        if (response.success) successCount++;
                                        else errorCount++;
                                    } catch  {
                                        errorCount++;
                                    }
                                }
                                setRowSelection({});
                                if (successCount > 0) __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(`Đã đồng bộ ${successCount} danh mục`);
                                if (errorCount > 0) __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Lỗi ${errorCount} danh mục`);
                            }
                        },
                        {
                            label: "SEO",
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"],
                            onSelect: async (selectedRows)=>{
                                if (!pkgxSettings.enabled) {
                                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('PKGX chưa được bật');
                                    return;
                                }
                                const linkedCategories = selectedRows.filter((c)=>hasPkgxMapping(c));
                                if (linkedCategories.length === 0) {
                                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Không có danh mục nào đã liên kết PKGX');
                                    return;
                                }
                                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].info(`Đang đồng bộ SEO ${linkedCategories.length} danh mục...`);
                                let successCount = 0;
                                let errorCount = 0;
                                for (const category of linkedCategories){
                                    try {
                                        const pkgxCatId = getPkgxCatId(category);
                                        if (!pkgxCatId) continue;
                                        const pkgxSeo = category.websiteSeo?.pkgx;
                                        const payload = {
                                            cat_alias: pkgxSeo?.slug || category.slug || '',
                                            keywords: pkgxSeo?.seoKeywords || category.seoKeywords || category.name,
                                            meta_title: pkgxSeo?.seoTitle || category.seoTitle || category.name,
                                            meta_desc: pkgxSeo?.metaDescription || category.metaDescription || '',
                                            short_desc: pkgxSeo?.shortDescription || category.shortDescription || ''
                                        };
                                        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateCategory"])(pkgxCatId, payload);
                                        if (response.success) successCount++;
                                        else errorCount++;
                                    } catch  {
                                        errorCount++;
                                    }
                                }
                                setRowSelection({});
                                if (successCount > 0) __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(`Đã đồng bộ SEO ${successCount} danh mục`);
                                if (errorCount > 0) __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Lỗi ${errorCount} danh mục`);
                            }
                        },
                        {
                            label: "Mô tả",
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$text$2d$align$2d$start$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlignLeft$3e$__["AlignLeft"],
                            onSelect: async (selectedRows)=>{
                                if (!pkgxSettings.enabled) {
                                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('PKGX chưa được bật');
                                    return;
                                }
                                const linkedCategories = selectedRows.filter((c)=>hasPkgxMapping(c));
                                if (linkedCategories.length === 0) {
                                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Không có danh mục nào đã liên kết PKGX');
                                    return;
                                }
                                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].info(`Đang đồng bộ mô tả ${linkedCategories.length} danh mục...`);
                                let successCount = 0;
                                let errorCount = 0;
                                for (const category of linkedCategories){
                                    try {
                                        const pkgxCatId = getPkgxCatId(category);
                                        if (!pkgxCatId) continue;
                                        const pkgxSeo = category.websiteSeo?.pkgx;
                                        const payload = {
                                            cat_desc: pkgxSeo?.longDescription || category.longDescription || '',
                                            short_desc: pkgxSeo?.shortDescription || category.shortDescription || ''
                                        };
                                        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateCategory"])(pkgxCatId, payload);
                                        if (response.success) successCount++;
                                        else errorCount++;
                                    } catch  {
                                        errorCount++;
                                    }
                                }
                                setRowSelection({});
                                if (successCount > 0) __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(`Đã đồng bộ mô tả ${successCount} danh mục`);
                                if (errorCount > 0) __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Lỗi ${errorCount} danh mục`);
                            }
                        },
                        {
                            label: "Thông tin cơ bản",
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderEdit$3e$__["FolderEdit"],
                            onSelect: async (selectedRows)=>{
                                if (!pkgxSettings.enabled) {
                                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('PKGX chưa được bật');
                                    return;
                                }
                                const linkedCategories = selectedRows.filter((c)=>hasPkgxMapping(c));
                                if (linkedCategories.length === 0) {
                                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Không có danh mục nào đã liên kết PKGX');
                                    return;
                                }
                                if (!confirm(`Bạn có chắc muốn đồng bộ thông tin cơ bản (Tên, Hiển thị) cho ${linkedCategories.length} danh mục?`)) {
                                    return;
                                }
                                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].info(`Đang đồng bộ thông tin cơ bản ${linkedCategories.length} danh mục...`);
                                let successCount = 0;
                                let errorCount = 0;
                                for (const category of linkedCategories){
                                    try {
                                        const pkgxCatId = getPkgxCatId(category);
                                        if (!pkgxCatId) continue;
                                        const payload = {
                                            cat_name: category.name,
                                            is_show: category.isActive ? 1 : 0
                                        };
                                        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateCategoryBasic"])(pkgxCatId, payload);
                                        if (response.success) successCount++;
                                        else errorCount++;
                                    } catch  {
                                        errorCount++;
                                    }
                                }
                                setRowSelection({});
                                if (successCount > 0) __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(`Đã đồng bộ thông tin cơ bản ${successCount} danh mục`);
                                if (errorCount > 0) __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Lỗi ${errorCount} danh mục`);
                            }
                        },
                        {
                            label: "Xem trên PKGX",
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"],
                            onSelect: (selectedRows)=>{
                                const linkedCategories = selectedRows.filter((c)=>hasPkgxMapping(c));
                                if (linkedCategories.length === 0) {
                                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Không có danh mục nào đã liên kết PKGX');
                                    return;
                                }
                                const firstCategory = linkedCategories[0];
                                const pkgxId = getPkgxCatId(firstCategory);
                                if (pkgxId) {
                                    window.open(`https://phukiengiaxuong.com.vn/admin/category.php?act=edit&cat_id=${pkgxId}`, '_blank');
                                }
                            }
                        }
                    ],
                    expanded: {},
                    setExpanded: ()=>{},
                    columnVisibility: columnVisibility,
                    setColumnVisibility: setColumnVisibility,
                    columnOrder: columnOrder,
                    setColumnOrder: setColumnOrder,
                    pinnedColumns: pinnedColumns,
                    setPinnedColumns: setPinnedColumns,
                    onRowClick: handleRowClick,
                    renderMobileCard: (category)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$categories$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MobileCategoryCard"], {
                            category: category,
                            onDelete: handleDelete,
                            onToggleActive: handleToggleActive,
                            navigate: router.push,
                            handleRowClick: handleRowClick,
                            childCount: data.filter((c)=>c.parentId === category.systemId && !c.isDeleted).length
                        }, void 0, false, {
                            fileName: "[project]/features/categories/page.tsx",
                            lineNumber: 797,
                            columnNumber: 15
                        }, void 0)
                }, void 0, false, {
                    fileName: "[project]/features/categories/page.tsx",
                    lineNumber: 548,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/categories/page.tsx",
                lineNumber: 547,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialog"], {
                open: isAlertOpen,
                onOpenChange: setIsAlertOpen,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogContent"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogHeader"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogTitle"], {
                                    children: "Xóa danh mục?"
                                }, void 0, false, {
                                    fileName: "[project]/features/categories/page.tsx",
                                    lineNumber: 814,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogDescription"], {
                                    children: "Danh mục sẽ bị xóa khỏi hệ thống. Hành động này không thể hoàn tác."
                                }, void 0, false, {
                                    fileName: "[project]/features/categories/page.tsx",
                                    lineNumber: 815,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/categories/page.tsx",
                            lineNumber: 813,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogFooter"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogCancel"], {
                                    children: "Đóng"
                                }, void 0, false, {
                                    fileName: "[project]/features/categories/page.tsx",
                                    lineNumber: 820,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogAction"], {
                                    onClick: confirmDelete,
                                    children: "Xóa"
                                }, void 0, false, {
                                    fileName: "[project]/features/categories/page.tsx",
                                    lineNumber: 821,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/categories/page.tsx",
                            lineNumber: 819,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/categories/page.tsx",
                    lineNumber: 812,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/categories/page.tsx",
                lineNumber: 811,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialog"], {
                open: isBulkDeleteAlertOpen,
                onOpenChange: setIsBulkDeleteAlertOpen,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogContent"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogHeader"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogTitle"], {
                                    children: [
                                        "Xóa ",
                                        Object.keys(rowSelection).length,
                                        " danh mục?"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/categories/page.tsx",
                                    lineNumber: 830,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogDescription"], {
                                    children: "Các danh mục sẽ bị xóa khỏi hệ thống. Hành động này không thể hoàn tác."
                                }, void 0, false, {
                                    fileName: "[project]/features/categories/page.tsx",
                                    lineNumber: 831,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/categories/page.tsx",
                            lineNumber: 829,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogFooter"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogCancel"], {
                                    children: "Đóng"
                                }, void 0, false, {
                                    fileName: "[project]/features/categories/page.tsx",
                                    lineNumber: 836,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogAction"], {
                                    onClick: confirmBulkDelete,
                                    children: "Xóa tất cả"
                                }, void 0, false, {
                                    fileName: "[project]/features/categories/page.tsx",
                                    lineNumber: 837,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/categories/page.tsx",
                            lineNumber: 835,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/categories/page.tsx",
                    lineNumber: 828,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/categories/page.tsx",
                lineNumber: 827,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$categories$2f$components$2f$pkgx$2d$link$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PkgxCategoryLinkDialog"], {
                open: pkgxLinkDialogOpen,
                onOpenChange: setPkgxLinkDialogOpen,
                category: categoryToLink,
                onSuccess: handlePkgxLinkSuccess
            }, void 0, false, {
                fileName: "[project]/features/categories/page.tsx",
                lineNumber: 843,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$generic$2d$import$2d$dialog$2d$v2$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GenericImportDialogV2"], {
                open: isImportOpen,
                onOpenChange: setIsImportOpen,
                config: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$export$2f$configs$2f$category$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["categoryImportExportConfig"],
                existingData: activeCategories,
                onImport: handleImport,
                currentUser: authEmployee ? {
                    systemId: authEmployee.systemId,
                    name: authEmployee.fullName || authEmployee.id
                } : undefined
            }, void 0, false, {
                fileName: "[project]/features/categories/page.tsx",
                lineNumber: 851,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$generic$2d$export$2d$dialog$2d$v2$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GenericExportDialogV2"], {
                open: isExportOpen,
                onOpenChange: setIsExportOpen,
                config: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$export$2f$configs$2f$category$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["categoryImportExportConfig"],
                allData: activeCategories,
                filteredData: sortedData,
                currentPageData: paginatedData,
                selectedData: allSelectedRows,
                currentUser: authEmployee ? {
                    systemId: authEmployee.systemId,
                    name: authEmployee.fullName || authEmployee.id
                } : {
                    systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('SYSTEM'),
                    name: 'System'
                }
            }, void 0, false, {
                fileName: "[project]/features/categories/page.tsx",
                lineNumber: 864,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/categories/page.tsx",
        lineNumber: 449,
        columnNumber: 5
    }, this);
}
_s(ProductCategoriesPage, "NDx+m3mvBa/v26i6XSoPMz5Uy78=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$media$2d$query$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMediaQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$inventory$2f$product$2d$category$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductCategoryStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$column$2d$visibility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useColumnVisibility"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$categories$2f$hooks$2f$use$2d$pkgx$2d$category$2d$sync$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePkgxCategorySync"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePkgxSettingsStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePkgxSettingsStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePkgxSettingsStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$page$2d$header$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePageHeader"]
    ];
});
_c = ProductCategoriesPage;
var _c;
__turbopack_context__.k.register(_c, "ProductCategoriesPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=features_372b11cd._.js.map