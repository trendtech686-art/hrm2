module.exports = [
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
];

//# sourceMappingURL=features_products_store_ts_6acfc8a3._.js.map