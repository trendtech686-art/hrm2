module.exports = [
"[project]/features/suppliers/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useSupplierStore",
    ()=>useSupplierStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/fuse.js/dist/fuse.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-ssr] (ecmascript)");
;
;
;
;
const baseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createCrudStore"])([], 'suppliers', {
    businessIdField: 'id',
    getCurrentUser: __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserSystemId"],
    apiEndpoint: '/api/suppliers'
});
// ✅ API Sync helpers
const API_ENDPOINT = '/api/suppliers';
const syncToApi = {
    create: async (supplier)=>{
        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(supplier)
            });
            if (!response.ok) console.warn('[Supplier API] Create sync failed');
            else console.log('[Supplier API] Created:', supplier.systemId);
        } catch (e) {
            console.warn('[Supplier API] Create sync error:', e);
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
            if (!response.ok) console.warn('[Supplier API] Update sync failed');
            else console.log('[Supplier API] Updated:', systemId);
        } catch (e) {
            console.warn('[Supplier API] Update sync error:', e);
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
            if (!response.ok) console.warn('[Supplier API] Delete sync failed');
            else console.log('[Supplier API] Deleted:', systemId);
        } catch (e) {
            console.warn('[Supplier API] Delete sync error:', e);
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
            if (!response.ok) console.warn('[Supplier API] Restore sync failed');
            else console.log('[Supplier API] Restored:', systemId);
        } catch (e) {
            console.warn('[Supplier API] Restore sync error:', e);
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
const fuse = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"](baseStore.getState().data, {
    keys: [
        'name',
        'id',
        'phone'
    ],
    threshold: 0.3
});
// Augmented methods
const augmentedMethods = {
    searchSuppliers: async (query, page, limit = 20)=>{
        return new Promise((resolve)=>{
            setTimeout(()=>{
                const allSuppliers = baseStore.getState().data;
                const results = query ? fuse.search(query).map((r)=>r.item) : allSuppliers;
                const start = (page - 1) * limit;
                const end = start + limit;
                const paginatedItems = results.slice(start, end);
                resolve({
                    items: paginatedItems.map((s)=>({
                            value: s.systemId,
                            label: s.name
                        })),
                    hasNextPage: end < results.length
                });
            }, 300);
        });
    },
    updateStatus: (systemIds, status)=>{
        const currentUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserSystemId"])());
        baseStore.setState((state)=>({
                data: state.data.map((item)=>systemIds.includes(item.systemId) ? {
                        ...item,
                        status,
                        updatedBy: currentUser,
                        updatedAt: new Date().toISOString()
                    } : item)
            }));
    },
    bulkDelete: (systemIds)=>{
        const currentUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserSystemId"])());
        baseStore.setState((state)=>({
                data: state.data.map((item)=>systemIds.includes(item.systemId) ? {
                        ...item,
                        isDeleted: true,
                        deletedBy: currentUser,
                        deletedAt: new Date().toISOString()
                    } : item)
            }));
    }
};
const useSupplierStore = ()=>{
    const state = baseStore();
    return {
        ...state,
        ...augmentedMethods
    };
};
// Export getState for non-hook usage
useSupplierStore.getState = ()=>{
    const state = baseStore.getState();
    return {
        ...state,
        ...augmentedMethods
    };
};
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
const baseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createCrudStore"])([], 'employees', {
    businessIdField: 'id',
    getCurrentUser: __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserSystemId"],
    apiEndpoint: '/api/employees'
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
// ✅ API-backed persistence adapter - syncs to PostgreSQL
const API_ENDPOINT = '/api/employees';
const persistence = {
    create: async (payload)=>{
        // First create locally for immediate UI update
        const localResult = await employeeRepository.create(payload);
        // Then sync to API (background)
        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...payload,
                    systemId: localResult.systemId
                })
            });
            if (!response.ok) {
                console.warn('[Employee API] Create sync failed, data saved locally');
            } else {
                console.log('[Employee API] Created:', localResult.systemId);
            }
        } catch (e) {
            console.warn('[Employee API] Create sync error:', e);
        }
        return localResult;
    },
    update: async (systemId, payload)=>{
        // First update locally
        const localResult = await employeeRepository.update(systemId, payload);
        // Then sync to API
        try {
            const response = await fetch(`${API_ENDPOINT}/${systemId}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                console.warn('[Employee API] Update sync failed');
            } else {
                console.log('[Employee API] Updated:', systemId);
            }
        } catch (e) {
            console.warn('[Employee API] Update sync error:', e);
        }
        return localResult;
    },
    softDelete: async (systemId)=>{
        // First delete locally
        await employeeRepository.softDelete(systemId);
        // Then sync to API
        try {
            const response = await fetch(`${API_ENDPOINT}/${systemId}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    hard: false
                })
            });
            if (!response.ok) {
                console.warn('[Employee API] Soft delete sync failed');
            } else {
                console.log('[Employee API] Soft deleted:', systemId);
            }
        } catch (e) {
            console.warn('[Employee API] Soft delete sync error:', e);
        }
    },
    restore: async (systemId)=>{
        // First restore locally
        const localResult = await employeeRepository.restore(systemId);
        // Then sync to API
        try {
            const response = await fetch(`${API_ENDPOINT}/${systemId}/restore`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                console.warn('[Employee API] Restore sync failed');
            } else {
                console.log('[Employee API] Restored:', systemId);
            }
        } catch (e) {
            console.warn('[Employee API] Restore sync error:', e);
        }
        return localResult;
    },
    hardDelete: async (systemId)=>{
        // First delete locally
        await employeeRepository.hardDelete(systemId);
        // Then sync to API
        try {
            const response = await fetch(`${API_ENDPOINT}/${systemId}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    hard: true
                })
            });
            if (!response.ok) {
                console.warn('[Employee API] Hard delete sync failed');
            } else {
                console.log('[Employee API] Hard deleted:', systemId);
            }
        } catch (e) {
            console.warn('[Employee API] Hard delete sync error:', e);
        }
    }
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
const baseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createCrudStore"])([], 'customers', {
    businessIdField: 'id',
    getCurrentUser: __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserSystemId"],
    apiEndpoint: '/api/customers'
});
// ✅ API Sync helpers
const API_ENDPOINT = '/api/customers';
const syncToApi = {
    create: async (customer)=>{
        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(customer)
            });
            if (!response.ok) console.warn('[Customer API] Create sync failed');
            else console.log('[Customer API] Created:', customer.systemId);
        } catch (e) {
            console.warn('[Customer API] Create sync error:', e);
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
            if (!response.ok) console.warn('[Customer API] Update sync failed');
            else console.log('[Customer API] Updated:', systemId);
        } catch (e) {
            console.warn('[Customer API] Update sync error:', e);
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
            if (!response.ok) console.warn('[Customer API] Delete sync failed');
            else console.log('[Customer API] Deleted:', systemId);
        } catch (e) {
            console.warn('[Customer API] Delete sync error:', e);
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
            if (!response.ok) console.warn('[Customer API] Restore sync failed');
            else console.log('[Customer API] Restored:', systemId);
        } catch (e) {
            console.warn('[Customer API] Restore sync error:', e);
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
                        const newDebt = (customer.currentDebt || 0) + amountChange;
                        // Sync to API
                        syncToApi.update(systemId, {
                            currentDebt: newDebt
                        });
                        return {
                            ...customer,
                            currentDebt: newDebt
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
];

//# sourceMappingURL=features_8f7f4b57._.js.map