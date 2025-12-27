module.exports = [
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
"[project]/features/complaints/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useComplaintStore",
    ()=>useComplaintStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/smart-prefix.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
;
;
;
const complaintSeedData = [
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("COMPLAINT000001"),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])("PKN000001"),
        publicTrackingCode: "rb5n8xzhrm",
        orderSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("ORDER000001"),
        orderCode: "DH000001",
        orderValue: 16550000,
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("BRANCH000003"),
        branchName: "Chi nhánh Trung tâm",
        customerSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("CUST000001"),
        customerId: "KH000001",
        customerName: "Công ty Cổ phần Bất động sản Hưng Thịnh",
        customerPhone: "0901112233",
        type: "missing-items",
        description: "Khách nhận thiếu adapter USB-C trong hộp laptop Dell Inspiron 15.",
        images: [
            {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("CMPIMG000001"),
                url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=640&q=80",
                uploadedBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000002"),
                uploadedAt: new Date("2025-11-14T09:00:00Z"),
                description: "Ảnh khách chụp hộp sản phẩm",
                type: "initial"
            }
        ],
        employeeImages: [],
        status: "investigating",
        verification: "pending-verification",
        createdBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000002"),
        createdAt: new Date("2025-11-14T08:45:00Z"),
        assignedTo: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000005"),
        assigneeName: "Lê Văn Kho",
        assignedAt: new Date("2025-11-14T09:15:00Z"),
        investigationNote: "Kho xác nhận thiếu phụ kiện trong kiện hàng. Đang kiểm tra tồn kho để gửi bổ sung.",
        evidenceImages: [],
        proposedSolution: "Gửi bổ sung adapter trong 24h và tặng voucher 2% cho đơn tiếp theo.",
        timeline: [
            {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("CMPACT000001"),
                actionType: "created",
                performedBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000002"),
                performedAt: new Date("2025-11-14T08:45:00Z"),
                note: "Tạo phiếu khiếu nại từ khách Hưng Thịnh."
            },
            {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("CMPACT000002"),
                actionType: "assigned",
                performedBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000002"),
                performedAt: new Date("2025-11-14T09:15:00Z"),
                note: "Giao cho nhân viên kho kiểm tra."
            },
            {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("CMPACT000003"),
                actionType: "investigated",
                performedBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000005"),
                performedAt: new Date("2025-11-14T11:00:00Z"),
                note: "Đang chờ adapter bổ sung từ kho trung tâm."
            }
        ],
        priority: "high",
        tags: [
            "Hưng Thịnh",
            "Thiếu phụ kiện"
        ],
        updatedAt: new Date("2025-11-14T11:15:00Z"),
        affectedProducts: [
            {
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("SP000001"),
                productId: "SP000001",
                productName: "Laptop Dell Inspiron 15",
                unitPrice: 15000000,
                quantityOrdered: 1,
                quantityReceived: 1,
                quantityMissing: 1,
                quantityDefective: 0,
                quantityExcess: 0,
                issueType: "missing",
                note: "Thiếu adapter USB-C trong hộp",
                resolutionType: "replacement"
            }
        ]
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("COMPLAINT000002"),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])("PKN000002"),
        publicTrackingCode: "m1p9l0sdxz",
        orderSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("ORDER000005"),
        orderCode: "DH000005",
        orderValue: 3775000,
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("BRANCH000004"),
        branchName: "Chi nhánh Quận 3",
        customerSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("CUST000001"),
        customerId: "KH000001",
        customerName: "Công ty Cổ phần Bất động sản Hưng Thịnh",
        customerPhone: "0901112233",
        type: "product-condition",
        description: "Keycap custom bị trầy và 6 switch Gateron không nhận tín hiệu sau khi lắp.",
        images: [
            {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("CMPIMG000002"),
                url: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=640&q=80",
                uploadedBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000003"),
                uploadedAt: new Date("2025-11-19T02:20:00Z"),
                description: "Ảnh khách gửi về keycap trầy",
                type: "initial"
            },
            {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("CMPIMG000003"),
                url: "https://images.unsplash.com/photo-1478562853135-c3c9e3ef7905?auto=format&fit=crop&w=640&q=80",
                uploadedBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000003"),
                uploadedAt: new Date("2025-11-19T02:25:00Z"),
                description: "Ảnh switch lỗi",
                type: "initial"
            }
        ],
        employeeImages: [],
        status: "resolved",
        verification: "verified-correct",
        createdBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000003"),
        createdAt: new Date("2025-11-19T02:10:00Z"),
        assignedTo: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000003"),
        assigneeName: "Trần Thị Hoa",
        assignedAt: new Date("2025-11-19T02:15:00Z"),
        investigationNote: "Đã test tại cửa hàng, xác nhận 6 switch lỗi. Keycap bị trầy do quá trình đóng gói.",
        evidenceImages: [
            "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=640&q=80"
        ],
        proposedSolution: "Hoàn 60.000đ cho switch lỗi và gửi kèm bộ switch mới dự phòng.",
        timeline: [
            {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("CMPACT000004"),
                actionType: "created",
                performedBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000003"),
                performedAt: new Date("2025-11-19T02:10:00Z"),
                note: "Khách báo switch lỗi và keycap trầy."
            },
            {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("CMPACT000005"),
                actionType: "investigated",
                performedBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000003"),
                performedAt: new Date("2025-11-19T10:30:00Z"),
                note: "Đã kiểm tra thực tế, xác nhận lỗi."
            },
            {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("CMPACT000006"),
                actionType: "verified",
                performedBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000003"),
                performedAt: new Date("2025-11-20T04:00:00Z"),
                note: "Xác nhận lỗi thuộc về kho đóng gói."
            },
            {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("CMPACT000007"),
                actionType: "resolved",
                performedBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000003"),
                performedAt: new Date("2025-11-20T05:00:00Z"),
                note: "Hoàn tiền và tạo voucher xin lỗi khách."
            }
        ],
        resolution: "refund",
        resolutionNote: "Hoàn 60.000đ cho switch lỗi, tặng voucher 5% và gửi switch mới.",
        resolvedBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000003"),
        resolvedAt: new Date("2025-11-20T05:00:00Z"),
        responsibleUserId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000003"),
        isVerifiedCorrect: true,
        priority: "medium",
        tags: [
            "Keychron",
            "Switch lỗi"
        ],
        updatedAt: new Date("2025-11-20T05:30:00Z"),
        affectedProducts: [
            {
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("SP000008"),
                productId: "SP000008",
                productName: "Bàn phím cơ Keychron K2",
                unitPrice: 2500000,
                quantityOrdered: 1,
                quantityReceived: 1,
                quantityMissing: 0,
                quantityDefective: 1,
                quantityExcess: 0,
                issueType: "defective",
                note: "Keycap trầy nhẹ",
                resolutionType: "replacement"
            },
            {
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("SP000010"),
                productId: "SP000010",
                productName: "Switch Gateron Yellow",
                unitPrice: 5000,
                quantityOrdered: 90,
                quantityReceived: 90,
                quantityMissing: 0,
                quantityDefective: 6,
                quantityExcess: 0,
                issueType: "defective",
                note: "6 switch không nhận tín hiệu",
                resolutionType: "refund"
            }
        ]
    }
];
// =============================================
// HELPER FUNCTIONS
// =============================================
/**
 * Generate random public tracking code (10 chars: a-z, 0-9)
 * Example: rb5n8xzhrm
 */ function generatePublicTrackingCode() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for(let i = 0; i < 10; i++){
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
// =============================================
// DEFAULT VALUES
// =============================================
const defaultFilters = {
    status: "all",
    type: "all",
    verification: "all",
    assignedTo: "all",
    priority: "all"
};
const useComplaintStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((set, get)=>({
        // Initial State - Load sample data if empty
        complaints: complaintSeedData,
        filters: defaultFilters,
        searchQuery: "",
        selectedComplaintId: null,
        // =============================================
        // CRUD ACTIONS (Using store-factory logic)
        // =============================================
        addComplaint: (complaintData)=>{
            const currentComplaints = get().complaints;
            const BUSINESS_PREFIX = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['complaints']; // 'PKN'
            const SYSTEM_PREFIX = 'COMPLAINT';
            // Generate SystemId (6 digits) - COMPLAINT000001, COMPLAINT000002
            const maxSystemIdNumber = currentComplaints.length > 0 ? Math.max(...currentComplaints.map((c)=>{
                const match = c.systemId.match(/COMPLAINT(\d{6})/);
                return match ? parseInt(match[1]) : 0;
            })) : 0;
            const systemId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(`${SYSTEM_PREFIX}${String(maxSystemIdNumber + 1).padStart(6, '0')}`);
            // Generate Business ID (6 digits) - PKN000001, PKN000002 (if not provided)
            let idValue = complaintData.id ?? null;
            let id = idValue ? String(idValue) : '';
            if (!id) {
                const maxBusinessIdNumber = currentComplaints.length > 0 ? Math.max(...currentComplaints.map((c)=>{
                    const match = c.id?.match(/PKN(\d{6})/);
                    return match ? parseInt(match[1]) : 0;
                })) : 0;
                id = `${BUSINESS_PREFIX}${String(maxBusinessIdNumber + 1).padStart(6, '0')}`;
            } else {
                // Validate unique ID (case-insensitive)
                const existingIds = currentComplaints.map((c)=>c.id?.toLowerCase());
                if (existingIds.includes(id.toLowerCase())) {
                    throw new Error(`Mã "${id}" đã tồn tại! Vui lòng sử dụng mã khác.`);
                }
                // Sanitize ID: uppercase + remove spaces
                id = id.toUpperCase().trim().replace(/\s+/g, '');
            }
            const businessId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(id);
            // [NOTE] Generate public tracking code for customer
            const publicTrackingCode = complaintData.publicTrackingCode || generatePublicTrackingCode();
            const now = new Date();
            const initialAction = {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(`action_${Date.now()}`),
                actionType: "created",
                performedBy: complaintData.createdBy,
                performedAt: now,
                note: complaintData.description
            };
            const newComplaint = {
                ...complaintData,
                systemId,
                id: businessId,
                publicTrackingCode,
                createdAt: now,
                updatedAt: now,
                status: "pending",
                verification: "pending-verification",
                timeline: [
                    initialAction
                ]
            };
            set((state)=>({
                    complaints: [
                        newComplaint,
                        ...state.complaints
                    ]
                }));
            return systemId; // Return systemId for internal use
        },
        updateComplaint: (systemId, updates)=>{
            set((state)=>({
                    complaints: state.complaints.map((complaint)=>complaint.systemId === systemId ? {
                            ...complaint,
                            ...updates,
                            updatedAt: new Date()
                        } : complaint)
                }));
        },
        deleteComplaint: (systemId)=>{
            set((state)=>({
                    complaints: state.complaints.filter((c)=>c.systemId !== systemId)
                }));
        },
        getComplaintById: (systemId)=>{
            return get().complaints.find((c)=>c.systemId === systemId);
        },
        // =============================================
        // WORKFLOW ACTIONS
        // =============================================
        assignComplaint: (id, userId, userName)=>{
            const complaint = get().complaints.find((c)=>c.systemId === id);
            if (!complaint) return;
            const action = {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(`action_${Date.now()}`),
                actionType: "assigned",
                performedBy: userId,
                performedAt: new Date(),
                note: userName ? `Khiếu nại được giao cho ${userName}` : `Khiếu nại được giao cho nhân viên xử lý`
            };
            get().updateComplaint(id, {
                assignedTo: userId,
                assigneeName: userName,
                assignedAt: new Date(),
                status: "investigating",
                timeline: [
                    ...complaint.timeline,
                    action
                ]
            });
        },
        startInvestigation: (id, note)=>{
            const complaint = get().complaints.find((c)=>c.systemId === id);
            if (!complaint) return;
            const action = {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(`action_${Date.now()}`),
                actionType: "investigated",
                performedBy: complaint.assignedTo || complaint.createdBy,
                performedAt: new Date(),
                note
            };
            get().updateComplaint(id, {
                status: "investigating",
                timeline: [
                    ...complaint.timeline,
                    action
                ]
            });
        },
        submitEvidence: (id, evidenceImages, investigationNote, proposedSolution)=>{
            const complaint = get().complaints.find((c)=>c.systemId === id);
            if (!complaint) return;
            const action = {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(`action_${Date.now()}`),
                actionType: "investigated",
                performedBy: complaint.assignedTo || complaint.createdBy,
                performedAt: new Date(),
                note: investigationNote,
                images: evidenceImages
            };
            get().updateComplaint(id, {
                evidenceImages,
                investigationNote,
                proposedSolution,
                timeline: [
                    ...complaint.timeline,
                    action
                ]
            });
        },
        verifyComplaint: (id, isCorrect, note)=>{
            const complaint = get().complaints.find((c)=>c.systemId === id);
            if (!complaint) return;
            const action = {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(`action_${Date.now()}`),
                actionType: "verified",
                performedBy: complaint.createdBy,
                performedAt: new Date(),
                note
            };
            get().updateComplaint(id, {
                verification: isCorrect ? "verified-correct" : "verified-incorrect",
                isVerifiedCorrect: isCorrect,
                timeline: [
                    ...complaint.timeline,
                    action
                ]
            });
        },
        resolveComplaint: (id, resolution, resolutionNote, responsibleUserId)=>{
            const complaint = get().complaints.find((c)=>c.systemId === id);
            if (!complaint) return;
            const action = {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(`action_${Date.now()}`),
                actionType: "resolved",
                performedBy: complaint.createdBy,
                performedAt: new Date(),
                note: resolutionNote
            };
            const updatePayload = {
                status: "resolved",
                resolution,
                resolutionNote,
                resolvedBy: complaint.createdBy,
                resolvedAt: new Date(),
                timeline: [
                    ...complaint.timeline,
                    action
                ]
            };
            if (responsibleUserId) {
                updatePayload.responsibleUserId = responsibleUserId;
            }
            get().updateComplaint(id, updatePayload);
        },
        rejectComplaint: (id, reason)=>{
            const complaint = get().complaints.find((c)=>c.systemId === id);
            if (!complaint) return;
            const action = {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(`action_${Date.now()}`),
                actionType: "rejected",
                performedBy: complaint.createdBy,
                performedAt: new Date(),
                note: reason
            };
            get().updateComplaint(id, {
                status: "ended",
                resolution: "rejected",
                resolutionNote: reason,
                resolvedBy: complaint.createdBy,
                resolvedAt: new Date(),
                timeline: [
                    ...complaint.timeline,
                    action
                ]
            });
        },
        // =============================================
        // IMAGE ACTIONS
        // =============================================
        addComplaintImage: (id, image)=>{
            const complaint = get().complaints.find((c)=>c.systemId === id);
            if (!complaint) return;
            get().updateComplaint(id, {
                images: [
                    ...complaint.images,
                    image
                ]
            });
        },
        removeComplaintImage: (id, imageId)=>{
            const complaint = get().complaints.find((c)=>c.systemId === id);
            if (!complaint) return;
            get().updateComplaint(id, {
                images: complaint.images.filter((img)=>img.id !== imageId)
            });
        },
        // =============================================
        // FILTER & SEARCH ACTIONS
        // =============================================
        setFilters: (filters)=>{
            set((state)=>({
                    filters: {
                        ...state.filters,
                        ...filters
                    }
                }));
        },
        resetFilters: ()=>{
            set({
                filters: defaultFilters
            });
        },
        setSearchQuery: (query)=>{
            set({
                searchQuery: query
            });
        },
        setSelectedComplaint: (id)=>{
            set({
                selectedComplaintId: id
            });
        },
        // =============================================
        // COMPUTED GETTERS
        // =============================================
        getFilteredComplaints: ()=>{
            const { complaints, filters, searchQuery } = get();
            return complaints.filter((complaint)=>{
                // Status filter
                if (filters.status !== "all" && complaint.status !== filters.status) {
                    return false;
                }
                // Type filter
                if (filters.type !== "all" && complaint.type !== filters.type) {
                    return false;
                }
                // Verification filter
                if (filters.verification !== "all" && complaint.verification !== filters.verification) {
                    return false;
                }
                // Assignee filter
                if (filters.assignedTo !== "all" && complaint.assignedTo !== filters.assignedTo) {
                    return false;
                }
                // Priority filter
                if (filters.priority !== "all" && complaint.priority !== filters.priority) {
                    return false;
                }
                // Date range filter
                if (filters.dateRange) {
                    const complaintDate = new Date(complaint.createdAt);
                    if (complaintDate < filters.dateRange.from || complaintDate > filters.dateRange.to) {
                        return false;
                    }
                }
                // Search query
                if (searchQuery) {
                    const query = searchQuery.toLowerCase();
                    return (complaint.orderCode || complaint.orderSystemId).toLowerCase().includes(query) || // [NOTE] Fallback
                    complaint.customerName.toLowerCase().includes(query) || complaint.customerPhone.includes(query) || complaint.description.toLowerCase().includes(query) || complaint.id.toLowerCase().includes(query) // Search by business ID too
                    ;
                }
                return true;
            });
        },
        getComplaintsByStatus: (status)=>{
            return get().complaints.filter((c)=>c.status === status);
        },
        getComplaintsByAssignee: (userId)=>{
            return get().complaints.filter((c)=>c.assignedTo === userId);
        },
        getStats: ()=>{
            const complaints = get().complaints;
            return {
                total: complaints.length,
                pending: complaints.filter((c)=>c.status === "pending").length,
                investigating: complaints.filter((c)=>c.status === "investigating").length,
                resolved: complaints.filter((c)=>c.status === "resolved").length,
                rejected: complaints.filter((c)=>c.resolution === "rejected").length,
                verifiedCorrect: complaints.filter((c)=>c.verification === "verified-correct").length,
                verifiedIncorrect: complaints.filter((c)=>c.verification === "verified-incorrect").length
            };
        }
    }));
}),
"[project]/features/warranty/notification-utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getWarrantyNotificationSummary",
    ()=>getWarrantyNotificationSummary,
    "isWarrantyNotificationEnabled",
    ()=>isWarrantyNotificationEnabled,
    "loadWarrantyNotificationSettings",
    ()=>loadWarrantyNotificationSettings,
    "notifyWarrantyAssigned",
    ()=>notifyWarrantyAssigned,
    "notifyWarrantyBulkAction",
    ()=>notifyWarrantyBulkAction,
    "notifyWarrantyCreated",
    ()=>notifyWarrantyCreated,
    "notifyWarrantyError",
    ()=>notifyWarrantyError,
    "notifyWarrantyOverdue",
    ()=>notifyWarrantyOverdue,
    "notifyWarrantyProcessed",
    ()=>notifyWarrantyProcessed,
    "notifyWarrantyProcessing",
    ()=>notifyWarrantyProcessing,
    "notifyWarrantyReminder",
    ()=>notifyWarrantyReminder,
    "notifyWarrantyReturned",
    ()=>notifyWarrantyReturned,
    "notifyWarrantyStatusChange",
    ()=>notifyWarrantyStatusChange,
    "saveWarrantyNotificationSettings",
    ()=>saveWarrantyNotificationSettings,
    "showWarrantyLoading",
    ()=>showWarrantyLoading,
    "showWarrantyNotification",
    ()=>showWarrantyNotification
]);
/**
 * Warranty Notification Utilities
 * Handle notification settings and events for warranty tickets
 * Pattern copied from Complaints notification system
 * 
 * NOTE: Settings are now synced with database via warranty-settings-sync.ts
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$warranty$2d$settings$2d$sync$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/warranty-settings-sync.ts [app-ssr] (ecmascript)");
;
;
// Default notification settings
const defaultNotifications = {
    emailOnCreate: true,
    emailOnAssign: true,
    emailOnProcessing: false,
    emailOnProcessed: true,
    emailOnReturned: true,
    emailOnOverdue: true,
    smsOnOverdue: false,
    inAppNotifications: true,
    reminderNotifications: true
};
function loadWarrantyNotificationSettings() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$warranty$2d$settings$2d$sync$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getWarrantyNotificationsSync"])();
}
function saveWarrantyNotificationSettings(settings) {
    // Fire and forget - save to database in background
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$warranty$2d$settings$2d$sync$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["saveWarrantyNotificationsAsync"])(settings).catch((error)=>{
        console.error('Failed to save warranty notification settings:', error);
    });
}
function showWarrantyNotification(type, message, options) {
    const settings = loadWarrantyNotificationSettings();
    // Always show if inAppNotifications is enabled
    if (settings.inAppNotifications) {
        switch(type){
            case 'success':
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success(message, options);
                break;
            case 'error':
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(message, options);
                break;
            case 'info':
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].info(message, options);
                break;
            case 'warning':
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].warning(message, options);
                break;
        }
    }
}
function showWarrantyLoading(message) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].loading(message);
}
function isWarrantyNotificationEnabled(event) {
    const settings = loadWarrantyNotificationSettings();
    return settings[event] || false;
}
function notifyWarrantyCreated(ticketId) {
    if (isWarrantyNotificationEnabled('emailOnCreate')) {
        showWarrantyNotification('success', `Đã tạo phiếu bảo hành ${ticketId}`, {
            description: 'Phiếu mới đã được tạo thành công'
        });
    }
}
function notifyWarrantyAssigned(ticketId, employeeName) {
    if (isWarrantyNotificationEnabled('emailOnAssign')) {
        showWarrantyNotification('info', `Phiếu ${ticketId} được gán cho ${employeeName}`, {
            description: 'Đã cập nhật người phụ trách'
        });
    }
}
function notifyWarrantyProcessing(ticketId) {
    if (isWarrantyNotificationEnabled('emailOnProcessing')) {
        showWarrantyNotification('info', `Phiếu ${ticketId} đang được xử lý`, {
            description: 'Nhân viên đã bắt đầu xử lý phiếu'
        });
    }
}
function notifyWarrantyProcessed(ticketId) {
    if (isWarrantyNotificationEnabled('emailOnProcessed')) {
        showWarrantyNotification('success', `Phiếu ${ticketId} đã xử lý xong`, {
            description: 'Sản phẩm sẵn sàng để trả khách'
        });
    }
}
function notifyWarrantyReturned(ticketId, orderId) {
    if (isWarrantyNotificationEnabled('emailOnReturned')) {
        showWarrantyNotification('success', `Phiếu ${ticketId} đã trả hàng`, {
            description: orderId ? `Liên kết với đơn hàng ${orderId}` : 'Đã hoàn tất quy trình'
        });
    }
}
function notifyWarrantyOverdue(ticketId, type) {
    if (isWarrantyNotificationEnabled('emailOnOverdue')) {
        const typeLabels = {
            response: 'phản hồi',
            processing: 'xử lý',
            return: 'trả hàng'
        };
        showWarrantyNotification('warning', `Phiếu ${ticketId} quá hạn ${typeLabels[type]}`, {
            description: 'Vui lòng kiểm tra và xử lý ngay',
            duration: 10000
        });
    }
}
function notifyWarrantyReminder(ticketId, message) {
    if (isWarrantyNotificationEnabled('reminderNotifications')) {
        showWarrantyNotification('info', `Nhắc nhở: ${ticketId}`, {
            description: message,
            duration: 8000
        });
    }
}
function notifyWarrantyStatusChange(ticketId, oldStatus, newStatus) {
    showWarrantyNotification('info', `Phiếu ${ticketId} đã chuyển trạng thái`, {
        description: `${oldStatus} → ${newStatus}`
    });
}
function notifyWarrantyBulkAction(action, count) {
    showWarrantyNotification('success', `Đã ${action} ${count} phiếu bảo hành`, {
        description: 'Thao tác hàng loạt thành công'
    });
}
function notifyWarrantyError(message, details) {
    showWarrantyNotification('error', message, {
        description: details,
        duration: 5000
    });
}
function getWarrantyNotificationSummary() {
    const settings = loadWarrantyNotificationSettings();
    const enabledCount = Object.values(settings).filter(Boolean).length;
    const totalCount = Object.keys(settings).length;
    return {
        enabled: enabledCount,
        total: totalCount,
        percentage: Math.round(enabledCount / totalCount * 100)
    };
}
}),
"[project]/features/warranty/use-realtime-updates.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getWarrantyDataVersion",
    ()=>getWarrantyDataVersion,
    "triggerWarrantyDataUpdate",
    ()=>triggerWarrantyDataUpdate,
    "useRealtimeUpdates",
    ()=>useRealtimeUpdates
]);
/**
 * Realtime Updates Hook for Warranty Module
 * Uses in-memory versioning - localStorage has been removed
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-ssr] (ecmascript)");
;
;
// In-memory version tracking
let warrantyDataVersion = 0;
const versionListeners = new Set();
function useRealtimeUpdates({ onRefresh, dataVersion, interval = 30000 }) {
    const [hasUpdates, setHasUpdates] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](false);
    const [isPolling, setIsPolling] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](false);
    const [lastVersion, setLastVersion] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](dataVersion);
    // Subscribe to version changes
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        const listener = ()=>{
            setHasUpdates(true);
        };
        versionListeners.add(listener);
        return ()=>{
            versionListeners.delete(listener);
        };
    }, []);
    // Polling effect
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        if (!isPolling) return;
        const timer = setInterval(()=>{
            if (warrantyDataVersion > lastVersion) {
                setHasUpdates(true);
            }
        }, interval);
        return ()=>clearInterval(timer);
    }, [
        isPolling,
        interval,
        lastVersion
    ]);
    // Check if data version changed
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        if (dataVersion !== lastVersion) {
            setHasUpdates(true);
        }
    }, [
        dataVersion,
        lastVersion
    ]);
    const checkForUpdates = ()=>{
        return warrantyDataVersion > lastVersion;
    };
    const showUpdateNotification = ()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].info('Có cập nhật mới cho bảo hành', {
            duration: 10000,
            position: 'top-right',
            action: {
                label: 'Làm mới',
                onClick: ()=>{
                    handleRefresh();
                }
            }
        });
    };
    const handleRefresh = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](()=>{
        setLastVersion(warrantyDataVersion);
        setHasUpdates(false);
        onRefresh();
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success('Đã làm mới dữ liệu bảo hành');
    }, [
        onRefresh
    ]);
    const togglePolling = ()=>{
        setIsPolling((prev)=>!prev);
        if (!isPolling) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].info('Đã bật chế độ cập nhật tự động (30s)', {
                duration: 3000
            });
        } else {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].info('Đã tắt chế độ cập nhật tự động', {
                duration: 3000
            });
        }
    };
    return {
        hasUpdates,
        isPolling,
        refresh: handleRefresh,
        togglePolling
    };
}
function triggerWarrantyDataUpdate() {
    warrantyDataVersion++;
    versionListeners.forEach((listener)=>listener());
}
function getWarrantyDataVersion() {
    return warrantyDataVersion;
}
}),
"[project]/features/warranty/initial-data.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WARRANTY_SEED_AUDIT_TEMPLATE",
    ()=>WARRANTY_SEED_AUDIT_TEMPLATE,
    "warrantyInitialData",
    ()=>warrantyInitialData
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/seed-audit.ts [app-ssr] (ecmascript)");
;
;
/**
 * Initial Warranty Data
 * Empty array - data will be persisted in localStorage by createCrudStore
 * 
 * Example of properly typed warranty record:
 * {
 *   systemId: asSystemId('WARRANTY00000001'),
 *   id: asBusinessId('WR001'),
 *   branchSystemId: asSystemId('BRANCH00000001'),
 *   employeeSystemId: asSystemId('NV00000001'),
 *   customerSystemId: asSystemId('CUSTOMER00000001'),
 *   linkedOrderSystemId: asSystemId('ORDER00000123'),
 *   products: [
 *     {
 *       systemId: asSystemId('WARPROD00000001'),
 *       productSystemId: asSystemId('PRODUCT00000045'),
 *       sku: asBusinessId('SKU001'),
 *       ...
 *     }
 *   ],
 *   ...
 * }
 */ const seedCustomer = {
    systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CUST000001'),
    name: 'Công ty Cổ phần Bất động sản Hưng Thịnh',
    phone: '0901112233',
    address: '123 Đường ABC, Phường 1, Quận 1, TP.HCM'
};
const seedBranch = {
    systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000003'),
    name: 'Chi nhánh Trung tâm'
};
const warrantyOwner = {
    systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000002'),
    name: 'Trần Thị Bình'
};
const warrantyInitialData = [
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('WARRANTY000001'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('BH000001'),
        branchSystemId: seedBranch.systemId,
        branchName: seedBranch.name,
        employeeSystemId: warrantyOwner.systemId,
        employeeName: warrantyOwner.name,
        customerSystemId: seedCustomer.systemId,
        customerName: seedCustomer.name,
        customerPhone: seedCustomer.phone,
        customerAddress: seedCustomer.address,
        trackingCode: 'GHN-WAR-0001',
        publicTrackingCode: 'wh8ut4nz9p',
        shippingFee: 45000,
        referenceUrl: 'https://docs.google.com/spreadsheets/d/war-0001',
        linkedOrderSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ORDER000001'),
        receivedImages: [
            'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=640&q=80'
        ],
        products: [
            {
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('WARPROD000001'),
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SP000001'),
                sku: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000001'),
                productName: 'Laptop Dell Inspiron 15',
                quantity: 1,
                unitPrice: 15000000,
                issueDescription: 'Máy tự tắt khi sử dụng hơn 30 phút',
                resolution: 'replace',
                deductionAmount: 0,
                productImages: [
                    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80'
                ],
                notes: 'Cần sao lưu dữ liệu trước khi chuyển hãng'
            },
            {
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('WARPROD000002'),
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SP000002'),
                sku: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000002'),
                productName: 'Chuột Logitech MX Master 3',
                quantity: 1,
                unitPrice: 2000000,
                issueDescription: 'Con lăn bị kẹt định kỳ',
                resolution: 'return',
                productImages: [
                    'https://images.unsplash.com/photo-1481277542470-605612bd2d61?auto=format&fit=crop&w=400&q=80'
                ],
                notes: 'Đã vệ sinh nhưng lỗi tái diễn'
            }
        ],
        processedImages: [
            'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=640&q=80'
        ],
        status: 'processed',
        settlementStatus: 'pending',
        stockDeducted: false,
        processingStartedAt: '2025-11-13T01:30:00Z',
        processedAt: '2025-11-13T09:00:00Z',
        notes: 'Đợi xác nhận của khách về phương án đổi mới laptop.',
        summary: {
            totalProducts: 2,
            totalReplaced: 1,
            totalReturned: 1,
            totalDeduction: 0,
            totalOutOfStock: 0,
            totalSettlement: 0
        },
        history: [
            {
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('WARHIST000001'),
                action: 'create',
                actionLabel: 'Tạo phiếu bảo hành',
                performedBy: warrantyOwner.name,
                performedBySystemId: warrantyOwner.systemId,
                performedAt: '2025-11-12T09:00:00Z',
                note: 'Tiếp nhận phiếu bảo hành từ khách Hưng Thịnh.',
                linkedOrderSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ORDER000001')
            },
            {
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('WARHIST000002'),
                action: 'update_status',
                actionLabel: 'Bắt đầu xử lý',
                performedBy: warrantyOwner.name,
                performedBySystemId: warrantyOwner.systemId,
                performedAt: '2025-11-13T01:30:00Z',
                note: 'Chuyển trạng thái sang Đang xử lý và gửi thiết bị sang ASUS.'
            },
            {
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('WARHIST000003'),
                action: 'update_status',
                actionLabel: 'Hoàn tất xử lý',
                performedBy: warrantyOwner.name,
                performedBySystemId: warrantyOwner.systemId,
                performedAt: '2025-11-13T09:00:00Z',
                note: 'Laptop sẽ đổi máy mới, chuột vệ sinh và trả lại.'
            }
        ],
        comments: [],
        subtasks: [],
        createdBy: warrantyOwner.name,
        createdBySystemId: warrantyOwner.systemId,
        createdAt: '2025-11-12T09:00:00Z',
        updatedAt: '2025-11-13T09:00:00Z',
        updatedBySystemId: warrantyOwner.systemId
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('WARRANTY000002'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('BH000002'),
        branchSystemId: seedBranch.systemId,
        branchName: seedBranch.name,
        employeeSystemId: warrantyOwner.systemId,
        employeeName: warrantyOwner.name,
        customerSystemId: seedCustomer.systemId,
        customerName: seedCustomer.name,
        customerPhone: seedCustomer.phone,
        customerAddress: seedCustomer.address,
        trackingCode: 'GHTK-WAR-0452',
        publicTrackingCode: 'r9bth1e6md',
        shippingFee: 30000,
        linkedOrderSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ORDER000005'),
        receivedImages: [
            'https://images.unsplash.com/photo-1581291518823-11e99804a128?auto=format&fit=crop&w=640&q=80'
        ],
        products: [
            {
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('WARPROD000003'),
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SP000008'),
                sku: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000008'),
                productName: 'Bàn phím cơ Keychron K2',
                quantity: 1,
                unitPrice: 2500000,
                issueDescription: 'Phím space bị kẹt sau 1 tuần sử dụng',
                resolution: 'replace',
                productImages: [
                    'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=400&q=80'
                ]
            },
            {
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('WARPROD000004'),
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SP000010'),
                sku: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000010'),
                productName: 'Switch Gateron Yellow',
                quantity: 6,
                unitPrice: 5000,
                issueDescription: 'Một số switch không nhận tín hiệu sau khi lắp',
                resolution: 'deduct',
                deductionAmount: 60000,
                productImages: [],
                notes: 'Khách đề nghị hoàn tiền cho số switch lỗi'
            }
        ],
        status: 'pending',
        settlementStatus: 'pending',
        stockDeducted: false,
        notes: 'Đang chờ kỹ thuật kiểm tra bàn phím.',
        summary: {
            totalProducts: 2,
            totalReplaced: 0,
            totalReturned: 0,
            totalDeduction: 60000,
            totalOutOfStock: 0,
            totalSettlement: 60000
        },
        history: [
            {
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('WARHIST000004'),
                action: 'create',
                actionLabel: 'Tạo phiếu bảo hành',
                performedBy: warrantyOwner.name,
                performedBySystemId: warrantyOwner.systemId,
                performedAt: '2025-11-18T03:00:00Z',
                note: 'Khách gửi bàn phím Keychron cần bảo hành.',
                linkedOrderSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ORDER000005')
            }
        ],
        comments: [],
        subtasks: [],
        createdBy: warrantyOwner.name,
        createdBySystemId: warrantyOwner.systemId,
        createdAt: '2025-11-18T03:00:00Z',
        updatedAt: '2025-11-18T03:00:00Z',
        updatedBySystemId: warrantyOwner.systemId
    }
];
const WARRANTY_SEED_AUDIT_TEMPLATE = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
    createdAt: '2024-02-01T00:00:00Z'
});
}),
"[project]/features/warranty/store/base-store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "baseStore",
    ()=>baseStore,
    "generatePublicTrackingCode",
    ()=>generatePublicTrackingCode,
    "getCurrentUserName",
    ()=>getCurrentUserName,
    "originalAdd",
    ()=>originalAdd,
    "originalRemove",
    ()=>originalRemove,
    "originalUpdate",
    ()=>originalUpdate,
    "syncToApi",
    ()=>syncToApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$initial$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/initial-data.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-ssr] (ecmascript)");
;
;
;
function getCurrentUserName() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserInfo"])().name;
}
function generatePublicTrackingCode() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for(let i = 0; i < 10; i++){
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
const baseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createCrudStore"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$initial$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["warrantyInitialData"], 'warranty', {
    businessIdField: 'id',
    getCurrentUser: __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserSystemId"],
    apiEndpoint: '/api/warranties'
});
// ✅ API Sync helpers
const API_ENDPOINT = '/api/warranties';
const syncToApi = {
    create: async (warranty)=>{
        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(warranty)
            });
            if (!response.ok) console.warn('[Warranty API] Create sync failed');
            else console.log('[Warranty API] Created:', warranty.systemId);
        } catch (e) {
            console.warn('[Warranty API] Create sync error:', e);
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
            if (!response.ok) console.warn('[Warranty API] Update sync failed');
            else console.log('[Warranty API] Updated:', systemId);
        } catch (e) {
            console.warn('[Warranty API] Update sync error:', e);
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
            if (!response.ok) console.warn('[Warranty API] Delete sync failed');
            else console.log('[Warranty API] Deleted:', systemId);
        } catch (e) {
            console.warn('[Warranty API] Delete sync error:', e);
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
            if (!response.ok) console.warn('[Warranty API] Restore sync failed');
            else console.log('[Warranty API] Restored:', systemId);
        } catch (e) {
            console.warn('[Warranty API] Restore sync error:', e);
        }
    }
};
const originalAdd = baseStore.getState().add;
const originalUpdate = baseStore.getState().update;
const originalRemove = baseStore.getState().remove;
// ✅ Wrap base store methods with API sync (for direct usage)
const originalHardDelete = baseStore.getState().hardDelete;
const originalRestore = baseStore.getState().restore;
baseStore.setState({
    hardDelete: (systemId)=>{
        originalHardDelete(systemId);
        syncToApi.delete(systemId, true);
    },
    restore: (systemId)=>{
        originalRestore(systemId);
        syncToApi.restore(systemId);
    }
});
;
}),
"[project]/features/warranty/store/stock-management.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "commitWarrantyStock",
    ()=>commitWarrantyStock,
    "deductWarrantyStock",
    ()=>deductWarrantyStock,
    "rollbackWarrantyStock",
    ()=>rollbackWarrantyStock,
    "uncommitWarrantyStock",
    ()=>uncommitWarrantyStock
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/products/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$stock$2d$history$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/stock-history/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/store/base-store.ts [app-ssr] (ecmascript)");
;
;
;
;
;
function commitWarrantyStock(ticket) {
    const replaceProducts = ticket.products.filter((p)=>p.resolution === 'replace');
    if (replaceProducts.length > 0) {
        const productStore = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState();
        const productCache = new Map();
        productStore.data.forEach((p)=>productCache.set(p.id, p));
        replaceProducts.forEach((warrantyProduct)=>{
            if (!warrantyProduct.sku) {
                console.warn('Sản phẩm thiếu SKU, bỏ qua commit:', warrantyProduct.productName);
                return;
            }
            const product = productCache.get(warrantyProduct.sku);
            if (!product) {
                console.warn('Không tìm thấy sản phẩm trong kho:', warrantyProduct.sku);
                return;
            }
            const quantityToCommit = warrantyProduct.quantity || 1;
            // Reuse productStore.commitStock()
            productStore.commitStock(product.systemId, ticket.branchSystemId, quantityToCommit);
            console.log('✅ [COMMIT STOCK] Giữ hàng thay thế:', {
                productId: product.id,
                productName: product.name,
                quantity: quantityToCommit,
                warranty: ticket.id,
                branch: ticket.branchName
            });
        });
    }
}
function uncommitWarrantyStock(ticket, options) {
    const replaceProducts = ticket.products.filter((p)=>p.resolution === 'replace');
    if (replaceProducts.length > 0) {
        const productStore = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState();
        const productCache = new Map();
        productStore.data.forEach((p)=>productCache.set(p.id, p));
        replaceProducts.forEach((warrantyProduct)=>{
            if (!warrantyProduct.sku) return;
            const product = productCache.get(warrantyProduct.sku);
            if (product) {
                const quantityToUncommit = warrantyProduct.quantity || 1;
                // Reuse productStore.uncommitStock()
                productStore.uncommitStock(product.systemId, ticket.branchSystemId, quantityToUncommit);
                console.log('Đã uncommit stock:', {
                    productId: product.id,
                    quantity: quantityToUncommit,
                    warranty: ticket.id
                });
            }
        });
        if (!options?.silent) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].info('Đã giải phóng hàng giữ chỗ', {
                description: `${replaceProducts.length} sản phẩm đã được trả lại kho có thể bán`,
                duration: 3000
            });
        }
    }
}
function deductWarrantyStock(ticket) {
    console.log('📤 [DEDUCT FUNCTION CALLED]:', {
        ticketId: ticket.id,
        ticketStatus: ticket.status,
        stockDeducted: ticket.stockDeducted,
        productsCount: ticket.products.length,
        replaceProducts: ticket.products.filter((p)=>p.resolution === 'replace').length
    });
    const replacedProducts = ticket.products.filter((p)=>p.resolution === 'replace');
    if (replacedProducts.length > 0) {
        const productStore = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState();
        const stockHistoryStore = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$stock$2d$history$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStockHistoryStore"].getState();
        const productCache = new Map();
        productStore.data.forEach((p)=>productCache.set(p.id, p));
        const deductionResults = [];
        let hasErrors = false;
        replacedProducts.forEach((warrantyProduct)=>{
            if (!warrantyProduct.sku) {
                deductionResults.push(`Sản phẩm "${warrantyProduct.productName}" không có SKU`);
                hasErrors = true;
                return;
            }
            const product = productCache.get(warrantyProduct.sku);
            if (!product) {
                deductionResults.push(`Không tìm thấy SP SKU: ${warrantyProduct.sku}`);
                hasErrors = true;
                return;
            }
            const currentInventory = product.inventoryByBranch[ticket.branchSystemId] || 0;
            const quantityToDeduct = warrantyProduct.quantity || 1;
            console.log('📤 [DEDUCT] Before:', {
                productId: product.id,
                currentInventory,
                quantityToDeduct,
                branchSystemId: ticket.branchSystemId
            });
            if (currentInventory < quantityToDeduct) {
                deductionResults.push(`${product.name} (${product.id}): Không đủ hàng (Tồn: ${currentInventory}, Cần: ${quantityToDeduct})`);
                hasErrors = true;
                return;
            }
            // ✅ Xuất kho trực tiếp (không dùng dispatchStock vì warranty không có inTransit)
            // -Tồn kho
            productStore.updateInventory(product.systemId, ticket.branchSystemId, -quantityToDeduct);
            // -Đang giao dịch (uncommit)
            productStore.uncommitStock(product.systemId, ticket.branchSystemId, quantityToDeduct);
            // ✅ Lấy lại product sau khi update
            const freshProductStore = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState();
            const updatedProduct = freshProductStore.data.find((p)=>p.systemId === product.systemId);
            const newStockLevel = updatedProduct?.inventoryByBranch[ticket.branchSystemId] || currentInventory - quantityToDeduct;
            console.log('✅ [DEDUCT] After:', {
                productId: product.id,
                newStockLevel,
                expectedLevel: currentInventory - quantityToDeduct
            });
            stockHistoryStore.addEntry({
                productId: product.systemId,
                date: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentDate"])()),
                employeeName: (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserName"])(),
                action: 'Xuất bảo hành (đổi mới)',
                quantityChange: -quantityToDeduct,
                newStockLevel,
                documentId: ticket.id,
                branchSystemId: ticket.branchSystemId,
                branch: ticket.branchName
            });
            deductionResults.push(`${product.name} (${product.id}): Trừ ${quantityToDeduct} cái (Còn: ${newStockLevel})`);
        });
        if (hasErrors) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Có lỗi khi xuất kho', {
                description: deductionResults.join('\n'),
                duration: 6000
            });
        } else {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success('Đã xuất kho sản phẩm thay thế', {
                description: `Xuất ${replacedProducts.length} sản phẩm tại chi nhánh ${ticket.branchName}`,
                duration: 4000
            });
        }
    }
}
function rollbackWarrantyStock(ticket) {
    console.log('🔄 [ROLLBACK FUNCTION CALLED]:', {
        ticketId: ticket.id,
        ticketStatus: ticket.status,
        stockDeducted: ticket.stockDeducted,
        productsCount: ticket.products.length,
        replaceProducts: ticket.products.filter((p)=>p.resolution === 'replace').length
    });
    const replacedProducts = ticket.products.filter((p)=>p.resolution === 'replace');
    if (replacedProducts.length > 0) {
        const productStore = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState();
        const stockHistoryStore = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$stock$2d$history$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStockHistoryStore"].getState();
        const productCache = new Map();
        productStore.data.forEach((p)=>productCache.set(p.id, p));
        const rollbackResults = [];
        replacedProducts.forEach((warrantyProduct)=>{
            if (!warrantyProduct.sku) {
                rollbackResults.push(`Sản phẩm "${warrantyProduct.productName}" không có SKU`);
                return;
            }
            const product = productCache.get(warrantyProduct.sku);
            if (!product) {
                rollbackResults.push(`Không tìm thấy SP SKU: ${warrantyProduct.sku}`);
                return;
            }
            const quantityToRollback = warrantyProduct.quantity || 1;
            const currentInventory = product.inventoryByBranch[ticket.branchSystemId] || 0;
            console.log('🔄 [ROLLBACK] Before:', {
                productId: product.id,
                currentInventory,
                quantityToRollback,
                branchSystemId: ticket.branchSystemId
            });
            // ✅ Hoàn kho: +Tồn kho (warranty xuất trực tiếp, không qua inTransit)
            productStore.updateInventory(product.systemId, ticket.branchSystemId, quantityToRollback);
            // ✅ Lấy lại product sau khi update để có inventory mới
            const freshProductStore = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState();
            const updatedProduct = freshProductStore.data.find((p)=>p.systemId === product.systemId);
            const newStockLevel = updatedProduct?.inventoryByBranch[ticket.branchSystemId] || currentInventory + quantityToRollback;
            console.log('✅ [ROLLBACK] After:', {
                productId: product.id,
                newStockLevel,
                expectedLevel: currentInventory + quantityToRollback
            });
            // Note: Không cần uncommit vì khi deduct đã uncommit rồi
            stockHistoryStore.addEntry({
                productId: product.systemId,
                date: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentDate"])()),
                employeeName: (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserName"])(),
                action: 'Hoàn kho (Hủy bảo hành)',
                quantityChange: quantityToRollback,
                newStockLevel,
                documentId: ticket.id,
                branchSystemId: ticket.branchSystemId,
                branch: ticket.branchName
            });
            rollbackResults.push(`${product.name} (${product.id}): Hoàn ${quantityToRollback} cái`);
        });
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].info('Đã hoàn kho sản phẩm thay thế', {
            description: rollbackResults.join('\n'),
            duration: 4000
        });
    }
}
}),
"[project]/features/warranty/store/product-management.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addHistory",
    ()=>addHistory,
    "addProduct",
    ()=>addProduct,
    "calculateSettlementStatus",
    ()=>calculateSettlementStatus,
    "calculateSummary",
    ()=>calculateSummary,
    "recalculateSummary",
    ()=>recalculateSummary,
    "removeProduct",
    ()=>removeProduct,
    "updateProduct",
    ()=>updateProduct
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/store/base-store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$stock$2d$management$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/store/stock-management.ts [app-ssr] (ecmascript)");
;
;
;
;
function calculateSummary(products) {
    const outOfStockProducts = products.filter((p)=>p.resolution === 'out_of_stock' || p.resolution === 'deduct');
    const totalSettlement = outOfStockProducts.reduce((sum, p)=>{
        if (p.resolution === 'deduct') return sum + (p.deductionAmount || 0);
        if (p.resolution === 'out_of_stock') return sum + (p.quantity || 1) * (p.unitPrice || 0);
        return sum;
    }, 0);
    return {
        totalProducts: products.reduce((sum, p)=>sum + (p.quantity || 1), 0),
        totalReplaced: products.filter((p)=>p.resolution === 'replace').reduce((sum, p)=>sum + (p.quantity || 1), 0),
        totalReturned: products.filter((p)=>p.resolution === 'return').reduce((sum, p)=>sum + (p.quantity || 1), 0),
        totalDeduction: totalSettlement,
        totalOutOfStock: outOfStockProducts.reduce((sum, p)=>sum + (p.quantity || 1), 0),
        totalSettlement: totalSettlement
    };
}
function adjustReplacementStock(ticket, previousProduct, nextProduct) {
    if (!ticket) return;
    const previousQty = previousProduct?.resolution === 'replace' ? previousProduct.quantity || 1 : 0;
    const nextQty = nextProduct?.resolution === 'replace' ? nextProduct.quantity || 1 : 0;
    if (previousQty === nextQty) {
        return;
    }
    const diff = Math.abs(nextQty - previousQty);
    const referenceProduct = nextQty > previousQty ? nextProduct : previousProduct;
    if (!referenceProduct || diff <= 0) return;
    const tempProduct = {
        ...referenceProduct,
        quantity: diff
    };
    const tempTicket = {
        ...ticket,
        products: [
            tempProduct
        ]
    };
    if (nextQty > previousQty) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$stock$2d$management$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commitWarrantyStock"])(tempTicket);
    } else {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$stock$2d$management$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["uncommitWarrantyStock"])(tempTicket, {
            silent: true
        });
    }
}
function addProduct(ticketSystemId, product) {
    const ticket = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["baseStore"].getState().data.find((t)=>t.systemId === ticketSystemId);
    if (!ticket) return;
    const newProduct = {
        ...product,
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(`WP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
    };
    adjustReplacementStock(ticket, undefined, newProduct);
    const updatedProducts = [
        ...ticket.products,
        newProduct
    ];
    const summary = calculateSummary(updatedProducts);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["originalUpdate"])(ticketSystemId, {
        ...ticket,
        products: updatedProducts,
        summary,
        updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentDate"])())
    });
    // Add history
    const resolutionLabels = {
        replace: 'Thay thế',
        refund: 'Hoàn tiền',
        deduct: 'Trừ tiền',
        warranty_extension: 'Gia hạn BH',
        no_warranty: 'Không BH',
        out_of_stock: 'Hết hàng',
        return: 'Trả hàng'
    };
    const resolution = resolutionLabels[newProduct.resolution] || newProduct.resolution;
    const quantity = newProduct.quantity || 1;
    addHistory(ticketSystemId, `Thêm SP: ${newProduct.productName} (${resolution}, SL: ${quantity})`, (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserName"])());
}
function updateProduct(ticketSystemId, productSystemId, updates) {
    const ticket = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["baseStore"].getState().data.find((t)=>t.systemId === ticketSystemId);
    if (!ticket) return;
    const originalProduct = ticket.products.find((p)=>p.systemId === productSystemId);
    if (!originalProduct) return;
    const updatedProducts = ticket.products.map((p)=>p.systemId === productSystemId ? {
            ...p,
            ...updates
        } : p);
    const summary = calculateSummary(updatedProducts);
    const updatedProduct = updatedProducts.find((p)=>p.systemId === productSystemId);
    adjustReplacementStock(ticket, originalProduct, updatedProduct);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["originalUpdate"])(ticketSystemId, {
        ...ticket,
        products: updatedProducts,
        summary,
        updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentDate"])())
    });
    // Add history
    if (updatedProduct) {
        addHistory(ticketSystemId, `Cập nhật SP: ${updatedProduct.productName}`, (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserName"])());
    }
}
function removeProduct(ticketSystemId, productSystemId) {
    const ticket = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["baseStore"].getState().data.find((t)=>t.systemId === ticketSystemId);
    if (!ticket) return;
    const productToRemove = ticket.products.find((p)=>p.systemId === productSystemId);
    const updatedProducts = ticket.products.filter((p)=>p.systemId !== productSystemId);
    const summary = calculateSummary(updatedProducts);
    if (productToRemove) {
        adjustReplacementStock(ticket, productToRemove, undefined);
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["originalUpdate"])(ticketSystemId, {
        ...ticket,
        products: updatedProducts,
        summary,
        updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentDate"])())
    });
    if (productToRemove) {
        addHistory(ticketSystemId, `Xóa SP: ${productToRemove.productName}`, (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserName"])());
    }
}
function recalculateSummary(ticketSystemId) {
    const ticket = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["baseStore"].getState().data.find((t)=>t.systemId === ticketSystemId);
    if (!ticket) return;
    const summary = calculateSummary(ticket.products);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["originalUpdate"])(ticketSystemId, {
        ...ticket,
        summary
    });
}
function calculateSettlementStatus(totalSettlement, totalPaid, shippingFee = 0) {
    if (totalSettlement <= 0) return 'completed';
    const netAmount = totalSettlement - shippingFee;
    if (netAmount <= 0) return 'completed';
    if (totalPaid === 0) return 'pending';
    if (totalPaid >= netAmount) return 'completed';
    return 'partial';
}
function addHistory(ticketSystemId, action, performedBy, note, metadata) {
    const ticket = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["baseStore"].getState().data.find((t)=>t.systemId === ticketSystemId);
    if (!ticket) return;
    const historyEntry = {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(`WH_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`),
        action,
        actionLabel: action,
        performedBy,
        performedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentDate"])()),
        note,
        metadata
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["originalUpdate"])(ticketSystemId, {
        ...ticket,
        history: [
            ...ticket.history || [],
            historyEntry
        ]
    });
}
}),
"[project]/features/warranty/store/status-management.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "updateStatus",
    ()=>updateStatus
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/store/base-store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$product$2d$management$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/store/product-management.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$stock$2d$management$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/store/stock-management.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$notification$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/notification-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$use$2d$realtime$2d$updates$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/use-realtime-updates.ts [app-ssr] (ecmascript)");
;
;
;
;
;
;
const STATUS_ORDER = {
    incomplete: 0,
    pending: 1,
    processed: 2,
    returned: 3,
    completed: 4,
    cancelled: 5
};
const TIMESTAMP_STAGES = [
    {
        key: 'processingStartedAt',
        stageOrder: STATUS_ORDER.pending
    },
    {
        key: 'processedAt',
        stageOrder: STATUS_ORDER.processed
    },
    {
        key: 'returnedAt',
        stageOrder: STATUS_ORDER.returned
    },
    {
        key: 'completedAt',
        stageOrder: STATUS_ORDER.completed
    }
];
function computeTimestampUpdates(ticket, newStatus, nowIso) {
    const updates = {};
    const oldOrder = STATUS_ORDER[ticket.status] ?? 0;
    const newOrder = STATUS_ORDER[newStatus] ?? oldOrder;
    TIMESTAMP_STAGES.forEach(({ key, stageOrder })=>{
        const currentValue = ticket[key];
        const crossedForward = newOrder >= stageOrder && oldOrder < stageOrder;
        if (newStatus !== 'cancelled' && crossedForward && !currentValue) {
            updates[key] = nowIso;
            return;
        }
        const movedBackward = newOrder < stageOrder;
        if (movedBackward && currentValue) {
            updates[key] = undefined;
        }
    });
    return updates;
}
function updateStatus(ticketSystemId, newStatus, note) {
    const ticket = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["baseStore"].getState().data.find((t)=>t.systemId === ticketSystemId);
    if (!ticket) return;
    console.log('[STATUS CHANGE]', {
        ticketId: ticket.id,
        oldStatus: ticket.status,
        newStatus: newStatus,
        productsCount: ticket.products.length,
        replacedProducts: ticket.products.filter((p)=>p.resolution === 'replace').length
    });
    const nowIso = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentDate"])());
    const timestampUpdates = computeTimestampUpdates(ticket, newStatus, nowIso);
    const baseUpdate = {
        ...ticket,
        ...timestampUpdates,
        status: newStatus,
        updatedAt: nowIso
    };
    // XUẤT KHO khi completed (CHỈ 1 LẦN DUY NHẤT - không trừ lại khi reopen)
    if (newStatus === 'completed' && ticket.status !== 'completed' && !ticket.stockDeducted) {
        console.log('[COMPLETED - DEDUCT] Xuất kho (LẦN ĐẦU TIÊN):', {
            ticketId: ticket.id,
            oldStatus: ticket.status,
            newStatus: newStatus,
            stockDeducted: ticket.stockDeducted,
            action: '-Đang giao dịch + -Tồn kho'
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$stock$2d$management$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deductWarrantyStock"])(ticket);
        // Set flag để không trừ lại lần nữa
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["originalUpdate"])(ticketSystemId, {
            ...baseUpdate,
            stockDeducted: true
        });
    } else if (newStatus === 'completed' && ticket.stockDeducted) {
        console.log('[COMPLETED - SKIP DEDUCT] Đã trừ kho rồi, bỏ qua:', {
            ticketId: ticket.id,
            oldStatus: ticket.status,
            newStatus: newStatus,
            stockDeducted: ticket.stockDeducted
        });
        // Chỉ update status, KHÔNG trừ kho nữa
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["originalUpdate"])(ticketSystemId, baseUpdate);
    } else {
        // Normal status update (không phải completed)
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["originalUpdate"])(ticketSystemId, baseUpdate);
    }
    // KHÔNG ROLLBACK KHO khi mở lại từ completed
    // Lý do:
    // - Kết thúc = Đơn đã xong, hàng đã xuất, tiền đã thanh toán đầy đủ
    // - Mở lại (completed → returned) CHỈ để xem lại, KHÔNG được sửa/thay đổi gì
    // - Nếu cần điều chỉnh → Phải tạo phiếu mới, hoàn hàng thủ công, tạo phiếu thu/chi riêng
    // - Giữ nguyên inventory và payment history để đảm bảo tính toàn vẹn dữ liệu
    // KHÔNG ROLLBACK KHO khi mở lại từ completed
    // Lý do:
    // - Kết thúc = Đơn đã xong, hàng đã xuất, tiền đã thanh toán đầy đủ
    // - Mở lại (completed → returned) CHỈ để xem lại, KHÔNG được sửa/thay đổi gì
    // - Nếu cần điều chỉnh → Phải tạo phiếu mới, hoàn hàng thủ công, tạo phiếu thu/chi riêng
    // - Giữ nguyên inventory và payment history để đảm bảo tính toàn vẹn dữ liệu
    // Add history với format rõ ràng
    const statusLabels = {
        incomplete: 'Chưa đủ thông tin',
        pending: 'Chưa xử lý',
        processed: 'Đã xử lý',
        returned: 'Đã trả hàng',
        completed: 'Kết thúc'
    };
    const oldStatusLabel = statusLabels[ticket.status] || ticket.status;
    const newStatusLabel = statusLabels[newStatus] || newStatus;
    // Format history dựa trên hướng chuyển đổi
    let historyAction;
    if (ticket.status === 'completed' && (newStatus === 'returned' || newStatus === 'processed')) {
        // Mở lại từ "Kết thúc"
        historyAction = `Mở lại từ ${oldStatusLabel}`;
    } else if (ticket.status === 'returned' && newStatus === 'processed') {
        // Mở lại từ "Đã trả hàng"
        historyAction = `Mở lại từ ${oldStatusLabel}`;
    } else if (newStatus === 'completed') {
        // Kết thúc phiếu
        historyAction = 'Kết thúc phiếu bảo hành';
    } else {
        // Chuyển trạng thái bình thường
        historyAction = `Chuyển trạng thái: ${oldStatusLabel} → ${newStatusLabel}`;
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$product$2d$management$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["addHistory"])(ticketSystemId, historyAction, (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserName"])(), note);
    // Send notifications
    if (ticket.status !== newStatus) {
        if (newStatus === 'pending') {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$notification$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["notifyWarrantyProcessing"])(ticket.id);
        } else if (newStatus === 'processed') {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$notification$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["notifyWarrantyProcessed"])(ticket.id);
        } else if (newStatus === 'returned') {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$notification$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["notifyWarrantyReturned"])(ticket.id, undefined);
        }
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$use$2d$realtime$2d$updates$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["triggerWarrantyDataUpdate"])();
}
}),
"[project]/features/warranty/store/index.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useWarrantyStore",
    ()=>useWarrantyStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$workflow$2d$templates$2d$page$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/features/settings/printer/workflow-templates-page.tsx [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$workflow$2d$templates$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__getWorkflowTemplateSync__as__getWorkflowTemplate$3e$__ = __turbopack_context__.i("[project]/hooks/use-workflow-templates.ts [app-ssr] (ecmascript) <export getWorkflowTemplateSync as getWorkflowTemplate>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$notification$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/notification-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$use$2d$realtime$2d$updates$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/use-realtime-updates.ts [app-ssr] (ecmascript)");
// Import base store và các modules
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/store/base-store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$stock$2d$management$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/store/stock-management.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$product$2d$management$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/store/product-management.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$status$2d$management$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/store/status-management.ts [app-ssr] (ecmascript)");
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
// Override add() for custom logic
__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["baseStore"].setState({
    add: (item)=>{
        // Auto ID generation by createCrudStore
        const newTicket = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["originalAdd"])(item);
        // Copy workflow template subtasks
        const subtasks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$workflow$2d$templates$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__getWorkflowTemplateSync__as__getWorkflowTemplate$3e$__["getWorkflowTemplate"])('warranty');
        if (subtasks && subtasks.length > 0) {
            newTicket.subtasks = subtasks;
        }
        // Generate public tracking code
        if (!newTicket.publicTrackingCode) {
            newTicket.publicTrackingCode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generatePublicTrackingCode"])();
        }
        // Commit stock for replace products
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$stock$2d$management$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commitWarrantyStock"])(newTicket);
        // Add initial history
        if (!newTicket.history || newTicket.history.length === 0) {
            newTicket.history = [
                {
                    systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(`WH_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`),
                    action: 'Tạo phiếu bảo hành',
                    actionLabel: 'Tạo phiếu bảo hành',
                    performedBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserName"])(),
                    performedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentDate"])())
                }
            ];
        }
        // Update state to include subtasks, history, publicTrackingCode
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["baseStore"].setState((state)=>({
                data: state.data.map((t)=>t.systemId === newTicket.systemId ? newTicket : t)
            }));
        // ✅ Sync to API
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["syncToApi"].create(newTicket);
        // Send notification
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$notification$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["notifyWarrantyCreated"])(newTicket.id);
        // Trigger realtime update
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$use$2d$realtime$2d$updates$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["triggerWarrantyDataUpdate"])();
        return newTicket;
    },
    update: (systemId, updates)=>{
        const oldTicket = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["baseStore"].getState().data.find((t)=>t.systemId === systemId);
        if (!oldTicket) return;
        // Check if history is explicitly provided
        const hasExplicitHistory = updates.history && updates.history.length > (oldTicket.history?.length || 0);
        // Track changes for auto-history
        const changes = [];
        if (!hasExplicitHistory) {
            if (updates.customerName && updates.customerName !== oldTicket.customerName) {
                changes.push(`Tên khách hàng: "${oldTicket.customerName}" → "${updates.customerName}"`);
            }
            if (updates.customerPhone && updates.customerPhone !== oldTicket.customerPhone) {
                changes.push(`Số điện thoại: "${oldTicket.customerPhone}" → "${updates.customerPhone}"`);
            }
            if (updates.trackingCode && updates.trackingCode !== oldTicket.trackingCode) {
                changes.push(`Mã vận đơn: "${oldTicket.trackingCode}" → "${updates.trackingCode}"`);
            }
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["originalUpdate"])(systemId, updates);
        // ✅ Sync to API
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["syncToApi"].update(systemId, updates);
        // Add auto-history
        if (!hasExplicitHistory && changes.length > 0) {
            changes.forEach((change)=>{
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$product$2d$management$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["addHistory"])(systemId, change, (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserName"])());
            });
        }
        // Trigger realtime update
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$use$2d$realtime$2d$updates$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["triggerWarrantyDataUpdate"])();
    },
    remove: (systemId)=>{
        const ticket = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["baseStore"].getState().data.find((t)=>t.systemId === systemId);
        if (ticket) {
            // Add history before deletion
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$product$2d$management$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["addHistory"])(systemId, 'Xóa phiếu bảo hành (chuyển vào thùng rác)', (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserName"])());
            // Uncommit stock
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$stock$2d$management$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["uncommitWarrantyStock"])(ticket);
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["originalRemove"])(systemId);
        // ✅ Sync to API
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["syncToApi"].delete(systemId, false);
        // Trigger realtime update
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$use$2d$realtime$2d$updates$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["triggerWarrantyDataUpdate"])();
    }
});
const useWarrantyStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((set, get)=>({
        ...__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["baseStore"].getState(),
        // Warranty-specific methods
        addProduct: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$product$2d$management$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["addProduct"],
        updateProduct: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$product$2d$management$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateProduct"],
        removeProduct: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$product$2d$management$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["removeProduct"],
        updateStatus: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$status$2d$management$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateStatus"],
        addHistory: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$product$2d$management$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["addHistory"],
        recalculateSummary: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$product$2d$management$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["recalculateSummary"],
        calculateSummary: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$product$2d$management$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateSummary"],
        calculateSettlementStatus: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$product$2d$management$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateSettlementStatus"],
        // Placeholder methods for backward compatibility
        addComment: ()=>console.warn('addComment: Use generic Comments component instead'),
        updateComment: ()=>console.warn('updateComment: Use generic Comments component instead'),
        deleteComment: ()=>console.warn('deleteComment: Use generic Comments component instead'),
        replyComment: ()=>console.warn('replyComment: Use generic Comments component instead'),
        generateNextSystemId: ()=>{
            // Generate next systemId using same pattern as createCrudStore
            const maxSystemId = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["baseStore"].getState().data.reduce((max, item)=>{
                const match = item.systemId.match(/WARRANTY(\d{6})/);
                return match ? Math.max(max, parseInt(match[1])) : max;
            }, 0);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(`WARRANTY${String(maxSystemId + 1).padStart(6, '0')}`);
        },
        _migrate: ()=>console.warn('_migrate: No longer needed with createCrudStore')
    }));
// Subscribe to base store changes
__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["baseStore"].subscribe((state)=>{
    useWarrantyStore.setState(state);
});
}),
"[project]/features/warranty/store.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/store/index.ts [app-ssr] (ecmascript)");
;
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
"[project]/features/products/combo-utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Combo Product Utilities
 * ═══════════════════════════════════════════════════════════════
 * Tham khảo: Sapo Combo
 * - Combo không có tồn kho riêng
 * - Tồn kho combo = MIN(tồn kho SP con / số lượng trong combo)
 * - Tối đa 20 sản phẩm con
 * - Không cho phép combo lồng combo
 * ═══════════════════════════════════════════════════════════════
 */ __turbopack_context__.s([
    "MAX_COMBO_ITEMS",
    ()=>MAX_COMBO_ITEMS,
    "MIN_COMBO_ITEMS",
    ()=>MIN_COMBO_ITEMS,
    "calculateComboCostPrice",
    ()=>calculateComboCostPrice,
    "calculateComboLastPurchasePrice",
    ()=>calculateComboLastPurchasePrice,
    "calculateComboMinPrice",
    ()=>calculateComboMinPrice,
    "calculateComboPrice",
    ()=>calculateComboPrice,
    "calculateComboPricesByPolicy",
    ()=>calculateComboPricesByPolicy,
    "calculateComboStock",
    ()=>calculateComboStock,
    "calculateComboStockAllBranches",
    ()=>calculateComboStockAllBranches,
    "calculateFinalComboPricesByPolicy",
    ()=>calculateFinalComboPricesByPolicy,
    "canAddToCombo",
    ()=>canAddToCombo,
    "getComboBottleneckProducts",
    ()=>getComboBottleneckProducts,
    "getComboSummary",
    ()=>getComboSummary,
    "hasComboStock",
    ()=>hasComboStock,
    "isComboProduct",
    ()=>isComboProduct,
    "validateComboItems",
    ()=>validateComboItems
]);
const MAX_COMBO_ITEMS = 20;
const MIN_COMBO_ITEMS = 2;
function isComboProduct(product) {
    return product.type === 'combo';
}
function canAddToCombo(product) {
    if (product.type === 'combo') return false;
    if (product.status === 'discontinued') return false;
    if (product.isDeleted) return false;
    return true;
}
function validateComboItems(comboItems, allProducts) {
    // Check minimum items
    if (comboItems.length < MIN_COMBO_ITEMS) {
        return `Combo phải có ít nhất ${MIN_COMBO_ITEMS} sản phẩm`;
    }
    // Check maximum items
    if (comboItems.length > MAX_COMBO_ITEMS) {
        return `Combo chỉ được tối đa ${MAX_COMBO_ITEMS} sản phẩm`;
    }
    // Check for duplicate products
    const productIds = comboItems.map((item)=>item.productSystemId);
    const uniqueIds = new Set(productIds);
    if (uniqueIds.size !== productIds.length) {
        return 'Combo không được chứa sản phẩm trùng lặp';
    }
    // Check each item
    for (const item of comboItems){
        // Check quantity
        if (item.quantity < 1) {
            return 'Số lượng sản phẩm trong combo phải >= 1';
        }
        if (!Number.isInteger(item.quantity)) {
            return 'Số lượng sản phẩm trong combo phải là số nguyên';
        }
        // Check product exists and is valid
        const product = allProducts.find((p)=>p.systemId === item.productSystemId);
        if (!product) {
            return 'Sản phẩm trong combo không tồn tại';
        }
        if (!canAddToCombo(product)) {
            return `Sản phẩm "${product.name}" không thể thêm vào combo`;
        }
    }
    return null;
}
function calculateComboStock(comboItems, allProducts, branchSystemId) {
    if (!comboItems || comboItems.length === 0) return 0;
    let minComboQuantity = Infinity;
    for (const item of comboItems){
        const product = allProducts.find((p)=>p.systemId === item.productSystemId);
        if (!product) return 0; // If any product not found, combo unavailable
        // Available = On-hand - Committed
        const onHand = product.inventoryByBranch?.[branchSystemId] || 0;
        const committed = product.committedByBranch?.[branchSystemId] || 0;
        const available = onHand - committed;
        // How many combos can we make from this product?
        const comboQuantityFromThisProduct = Math.floor(available / item.quantity);
        minComboQuantity = Math.min(minComboQuantity, comboQuantityFromThisProduct);
    }
    return minComboQuantity === Infinity ? 0 : Math.max(0, minComboQuantity);
}
function calculateComboStockAllBranches(comboItems, allProducts) {
    if (!comboItems || comboItems.length === 0) return {};
    // Collect all branch IDs from child products
    const allBranchIds = new Set();
    for (const item of comboItems){
        const product = allProducts.find((p)=>p.systemId === item.productSystemId);
        if (product?.inventoryByBranch) {
            Object.keys(product.inventoryByBranch).forEach((branchId)=>{
                allBranchIds.add(branchId);
            });
        }
    }
    // Calculate stock for each branch
    const result = {};
    for (const branchId of allBranchIds){
        result[branchId] = calculateComboStock(comboItems, allProducts, branchId);
    }
    return result;
}
function calculateComboPrice(comboItems, allProducts, pricingPolicySystemId, comboPricingType, comboDiscount = 0) {
    if (comboPricingType === 'fixed') {
        // Fixed price is stored directly, not calculated
        return comboDiscount; // In fixed mode, comboDiscount IS the price
    }
    // Calculate sum of child products' prices
    let sumPrice = 0;
    for (const item of comboItems){
        const product = allProducts.find((p)=>p.systemId === item.productSystemId);
        if (!product) continue;
        const unitPrice = product.prices?.[pricingPolicySystemId] || 0;
        sumPrice += unitPrice * item.quantity;
    }
    // Apply discount
    if (comboPricingType === 'sum_discount_percent') {
        const discountAmount = sumPrice * (comboDiscount / 100);
        return Math.round(sumPrice - discountAmount);
    }
    if (comboPricingType === 'sum_discount_amount') {
        return Math.max(0, sumPrice - comboDiscount);
    }
    return sumPrice;
}
const isNumber = (value)=>typeof value === 'number' && Number.isFinite(value);
function calculateComboCostPrice(comboItems, allProducts, options = {}) {
    const { fallbackPricingPolicyId, allowPriceFallback = true } = options;
    let totalCost = 0;
    for (const item of comboItems){
        const product = allProducts.find((p)=>p.systemId === item.productSystemId);
        if (!product) continue;
        let unitCost = product.costPrice;
        if (!isNumber(unitCost) && isNumber(product.lastPurchasePrice)) {
            unitCost = product.lastPurchasePrice;
        }
        if (!isNumber(unitCost) && allowPriceFallback) {
            if (fallbackPricingPolicyId && isNumber(product.prices?.[fallbackPricingPolicyId])) {
                unitCost = product.prices[fallbackPricingPolicyId];
            }
            if (!isNumber(unitCost)) {
                const firstPrice = Object.values(product.prices || {}).find((price)=>isNumber(price));
                if (isNumber(firstPrice)) {
                    unitCost = firstPrice;
                }
            }
        }
        if (!isNumber(unitCost) && isNumber(product.minPrice)) {
            unitCost = product.minPrice;
        }
        totalCost += (unitCost || 0) * item.quantity;
    }
    return totalCost;
}
function calculateComboLastPurchasePrice(comboItems, allProducts) {
    let total = 0;
    for (const item of comboItems){
        const product = allProducts.find((p)=>p.systemId === item.productSystemId);
        if (!product) continue;
        total += (product.lastPurchasePrice || 0) * item.quantity;
    }
    return total;
}
function calculateComboMinPrice(comboItems, allProducts) {
    let total = 0;
    for (const item of comboItems){
        const product = allProducts.find((p)=>p.systemId === item.productSystemId);
        if (!product) continue;
        total += (product.minPrice || 0) * item.quantity;
    }
    return total;
}
function calculateComboPricesByPolicy(comboItems, allProducts) {
    const pricesByPolicy = {};
    for (const item of comboItems){
        const product = allProducts.find((p)=>p.systemId === item.productSystemId);
        if (!product || !product.prices) continue;
        for (const [policyId, price] of Object.entries(product.prices)){
            if (!pricesByPolicy[policyId]) {
                pricesByPolicy[policyId] = 0;
            }
            pricesByPolicy[policyId] += (price || 0) * item.quantity;
        }
    }
    return pricesByPolicy;
}
function calculateFinalComboPricesByPolicy(comboItems, allProducts, comboPricingType, comboDiscount = 0, defaultPolicyId) {
    // Get raw sum prices first
    const rawPricesByPolicy = calculateComboPricesByPolicy(comboItems, allProducts);
    const finalPricesByPolicy = {};
    if (comboPricingType === 'fixed') {
        // For fixed pricing, only policies that exist on child products should be auto-filled.
        for (const policyId of Object.keys(rawPricesByPolicy)){
            finalPricesByPolicy[policyId] = comboDiscount; // comboDiscount IS the price in fixed mode
        }
        return finalPricesByPolicy;
    }
    // For discount-based pricing, apply discount to each policy's sum
    for (const [policyId, sumPrice] of Object.entries(rawPricesByPolicy)){
        if (comboPricingType === 'sum_discount_percent') {
            const discountAmount = sumPrice * (comboDiscount / 100);
            finalPricesByPolicy[policyId] = Math.round(sumPrice - discountAmount);
        } else if (comboPricingType === 'sum_discount_amount') {
            finalPricesByPolicy[policyId] = Math.max(0, sumPrice - comboDiscount);
        } else {
            // No discount, use raw sum
            finalPricesByPolicy[policyId] = sumPrice;
        }
    }
    return finalPricesByPolicy;
}
function getComboSummary(comboItems, allProducts, branchSystemId) {
    const itemCount = comboItems?.length || 0;
    if (!branchSystemId) {
        return `${itemCount} sản phẩm`;
    }
    const stock = calculateComboStock(comboItems, allProducts, branchSystemId);
    return `${itemCount} sản phẩm, tồn kho: ${stock}`;
}
function hasComboStock(comboItems, allProducts, branchSystemId, requiredQuantity) {
    const available = calculateComboStock(comboItems, allProducts, branchSystemId);
    return available >= requiredQuantity;
}
function getComboBottleneckProducts(comboItems, allProducts, branchSystemId) {
    if (!comboItems || comboItems.length === 0) return [];
    const comboStock = calculateComboStock(comboItems, allProducts, branchSystemId);
    const bottlenecks = [];
    for (const item of comboItems){
        const product = allProducts.find((p)=>p.systemId === item.productSystemId);
        if (!product) continue;
        const onHand = product.inventoryByBranch?.[branchSystemId] || 0;
        const committed = product.committedByBranch?.[branchSystemId] || 0;
        const available = onHand - committed;
        const comboQuantityFromThisProduct = Math.floor(available / item.quantity);
        // This product is a bottleneck if it limits the combo quantity
        if (comboQuantityFromThisProduct === comboStock) {
            bottlenecks.push({
                product,
                availableForCombo: comboQuantityFromThisProduct,
                itemQuantity: item.quantity
            });
        }
    }
    return bottlenecks;
}
}),
"[project]/features/stock-history/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useStockHistoryStore",
    ()=>useStockHistoryStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
;
;
// REMOVED: import { data as initialData } from './data'; // Mock data no longer used - database is source of truth
// API sync helpers
async function syncToAPI(action, data) {
    try {
        const response = await fetch('/api/inventory/stock-history', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            console.error(`[StockHistory API] ${action} failed:`, await response.text());
            return false;
        }
        return true;
    } catch (error) {
        console.error(`[StockHistory API] ${action} error:`, error);
        return false;
    }
}
// ✨ Migration helper: Convert SKU to systemId for old data
function migrateHistoryData(entries) {
    // Map SKU → systemId from products
    const skuToSystemId = {
        'DV-WEB-01': 'SP00000001',
        'DV-WEB-02': 'SP00000002',
        'DV-WEB-03': 'SP00000003',
        'DV-MKT-01': 'SP00000004',
        'DV-MKT-02': 'SP00000005',
        'DV-MKT-03': 'SP00000006',
        'DV-SEO-01': 'SP00000007',
        'DV-SEO-02': 'SP00000008',
        'DV-IT-01': 'SP00000009',
        'DV-DSN-01': 'SP00000010',
        'SW-CRM-01': 'SP00000011',
        'SW-ERP-01': 'SP00000012',
        'SW-WIN-01': 'SP00000013',
        'SW-OFF-01': 'SP00000014',
        'SW-ADOBE-01': 'SP00000015',
        'HW-SRV-01': 'SP00000016',
        'HW-SRV-02': 'SP00000017',
        'HW-PC-01': 'SP00000018',
        'HW-PC-02': 'SP00000019',
        'HW-LT-01': 'SP00000020',
        'HW-NET-01': 'SP00000021',
        'HW-NET-02': 'SP00000022',
        'HW-CAM-01': 'SP00000023',
        'MISC-HOST-01': 'SP00000024',
        'MISC-HOST-02': 'SP00000025',
        'MISC-SSL-01': 'SP00000026',
        'MISC-DOMAIN-COM': 'SP00000027',
        'MISC-DOMAIN-VN': 'SP00000028',
        'MISC-PRINT-01': 'SP00000029',
        'MISC-PRINT-02': 'SP00000030'
    };
    return entries.map((entry)=>({
            ...entry,
            productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(skuToSystemId[entry.productId] || entry.productId) // Convert or keep if already systemId
        }));
}
let entryCounter = 0;
const useStockHistoryStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((set, get)=>({
        entries: [],
        initialized: false,
        addEntry: (entry)=>{
            entryCounter++;
            const newEntry = {
                ...entry,
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(`HISTORY${String(Date.now()).slice(-6)}_${entryCounter}`)
            };
            set((state)=>({
                    entries: [
                        ...state.entries,
                        newEntry
                    ]
                }));
            // Sync to API
            syncToAPI('create', newEntry).catch(console.error);
        },
        getHistoryForProduct: (productId, branchSystemId = 'all')=>{
            const productHistory = get().entries.filter((e)=>e.productId === productId);
            const sortedHistory = productHistory.sort((a, b)=>new Date(b.date).getTime() - new Date(a.date).getTime());
            if (branchSystemId === 'all') {
                return sortedHistory;
            }
            return sortedHistory.filter((e)=>e.branchSystemId === branchSystemId);
        },
        loadFromAPI: async ()=>{
            try {
                // NOTE: Use React Query hooks for paginated data. This only loads initial batch.
                const response = await fetch('/api/inventory/stock-history?limit=30');
                if (!response.ok) return;
                const json = await response.json();
                const apiData = json.data || [];
                if (apiData.length > 0) {
                    set({
                        entries: migrateHistoryData(apiData),
                        initialized: true
                    });
                } else {
                    set({
                        initialized: true
                    });
                }
            } catch (error) {
                console.error('[StockHistory API] loadFromAPI error:', error);
            }
        }
    }));
}),
"[project]/features/cashbook/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCashbookStore",
    ()=>useCashbookStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
;
;
;
const CASH_ACCOUNT_ENTITY = 'cash-accounts';
const SYSTEM_ID_PREFIX = 'ACCOUNT';
const BUSINESS_ID_PREFIX = 'TK';
const BUSINESS_ID_DIGITS = 6;
// API sync helpers
async function syncToAPI(action, data) {
    try {
        const endpoint = action === 'create' ? '/api/cash-accounts' : `/api/cash-accounts/${data.systemId}`;
        const method = action === 'create' ? 'POST' : action === 'update' ? 'PATCH' : 'DELETE';
        const response = await fetch(endpoint, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: action !== 'delete' ? JSON.stringify(data) : undefined
        });
        if (!response.ok) {
            console.error(`[Cashbook API] ${action} failed:`, await response.text());
            return false;
        }
        return true;
    } catch (error) {
        console.error(`[Cashbook API] ${action} error:`, error);
        return false;
    }
}
async function fetchFromAPI() {
    try {
        const response = await fetch('/api/cash-accounts?limit=50');
        if (!response.ok) return [];
        const json = await response.json();
        return json.data || [];
    } catch (error) {
        console.error('[Cashbook API] fetch error:', error);
        return [];
    }
}
const getNextSystemId = (accounts)=>{
    const currentCounter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getMaxSystemIdCounter"])(accounts, SYSTEM_ID_PREFIX);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateSystemId"])(CASH_ACCOUNT_ENTITY, currentCounter + 1));
};
const ensureBusinessId = (accounts, provided)=>{
    if (provided && provided.trim()) {
        return provided;
    }
    const existingIds = accounts.map((acc)=>acc.id);
    const startCounter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getMaxBusinessIdCounter"])(accounts, BUSINESS_ID_PREFIX);
    const { nextId } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findNextAvailableBusinessId"])(BUSINESS_ID_PREFIX, existingIds, startCounter, BUSINESS_ID_DIGITS);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(nextId);
};
const useCashbookStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((set, get)=>({
        accounts: [],
        initialized: false,
        getAccountById: (id)=>get().accounts.find((a)=>a.id === id),
        add: (item)=>{
            const newAccount = {
                ...item,
                systemId: getNextSystemId(get().accounts),
                id: ensureBusinessId(get().accounts, item.id)
            };
            set((state)=>({
                    accounts: [
                        ...state.accounts,
                        newAccount
                    ]
                }));
            // Sync to API
            syncToAPI('create', newAccount).catch(console.error);
        },
        update: (systemId, updatedItem)=>{
            set((state)=>({
                    accounts: state.accounts.map((acc)=>acc.systemId === systemId ? updatedItem : acc)
                }));
            // Sync to API
            syncToAPI('update', updatedItem).catch(console.error);
        },
        remove: (systemId)=>{
            set((state)=>({
                    accounts: state.accounts.filter((acc)=>acc.systemId !== systemId)
                }));
            // Sync to API
            syncToAPI('delete', {
                systemId
            }).catch(console.error);
        },
        setDefault: (systemId)=>{
            set((state)=>{
                const targetAccount = state.accounts.find((acc)=>acc.systemId === systemId);
                if (!targetAccount) return state;
                const updated = state.accounts.map((acc)=>({
                        ...acc,
                        isDefault: (acc.type === targetAccount.type ? acc.systemId === systemId : acc.isDefault) ?? false
                    }));
                // Sync updated accounts to API
                updated.forEach((acc)=>{
                    if (acc.type === targetAccount.type) {
                        syncToAPI('update', acc).catch(console.error);
                    }
                });
                return {
                    accounts: updated
                };
            });
        },
        loadFromAPI: async ()=>{
            const apiData = await fetchFromAPI();
            if (apiData.length > 0) {
                set({
                    accounts: apiData,
                    initialized: true
                });
            } else {
                set({
                    initialized: true
                });
            }
        }
    }));
}),
"[project]/features/finance/document-lookups.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_CUSTOMER_GROUP",
    ()=>DEFAULT_CUSTOMER_GROUP,
    "pickAccount",
    ()=>pickAccount,
    "pickPaymentMethod",
    ()=>pickPaymentMethod,
    "pickPaymentType",
    ()=>pickPaymentType,
    "pickReceiptType",
    ()=>pickReceiptType,
    "pickTargetGroup",
    ()=>pickTargetGroup
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$target$2d$groups$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/target-groups/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$payments$2f$methods$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/payments/methods/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$cashbook$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/cashbook/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$receipt$2d$types$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/receipt-types/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$payments$2f$types$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/payments/types/store.ts [app-ssr] (ecmascript)");
;
;
;
;
;
const normalizeName = (value)=>(value ?? '').trim().toLowerCase();
const DEFAULT_CUSTOMER_GROUP = 'khách hàng';
const pickTargetGroup = (options)=>{
    const groups = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$target$2d$groups$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTargetGroupStore"].getState().data ?? [];
    if (groups.length === 0) {
        return null;
    }
    if (options?.systemId) {
        const match = groups.find((group)=>group.systemId === options.systemId);
        if (match) {
            return match;
        }
    }
    const lookupNames = [
        options?.name,
        options?.fallbackName,
        DEFAULT_CUSTOMER_GROUP
    ].filter(Boolean);
    for (const candidate of lookupNames){
        const normalized = normalizeName(candidate);
        const match = groups.find((group)=>normalizeName(group.name) === normalized);
        if (match) {
            return match;
        }
    }
    return groups[0] ?? null;
};
const pickPaymentMethod = (options)=>{
    const methods = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$payments$2f$methods$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePaymentMethodStore"].getState().data ?? [];
    if (methods.length === 0) {
        return null;
    }
    if (options?.systemId) {
        const match = methods.find((method)=>method.systemId === options.systemId);
        if (match) {
            return match;
        }
    }
    if (options?.name) {
        const normalized = normalizeName(options.name);
        const match = methods.find((method)=>normalizeName(method.name) === normalized);
        if (match) {
            return match;
        }
    }
    return methods.find((method)=>method.isDefault) ?? methods[0] ?? null;
};
const pickAccount = (options)=>{
    const { accounts } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$cashbook$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCashbookStore"].getState();
    if (!accounts || accounts.length === 0) {
        return null;
    }
    if (options.accountSystemId) {
        const match = accounts.find((account)=>account.systemId === options.accountSystemId);
        if (match) {
            return match;
        }
    }
    let preferredType = options.preferredType;
    if (!preferredType && options.paymentMethodName) {
        const normalizedMethod = normalizeName(options.paymentMethodName);
        preferredType = normalizedMethod === 'tiền mặt' ? 'cash' : normalizedMethod === 'chuyển khoản' ? 'bank' : undefined;
    }
    const candidates = preferredType ? accounts.filter((account)=>account.type === preferredType) : accounts;
    if (candidates.length === 0) {
        return accounts[0];
    }
    return candidates.find((account)=>account.branchSystemId && options.branchSystemId && account.branchSystemId === options.branchSystemId) ?? candidates.find((account)=>account.isDefault) ?? candidates[0];
};
const pickReceiptType = (options)=>{
    const types = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$receipt$2d$types$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useReceiptTypeStore"].getState().data ?? [];
    if (types.length === 0) {
        return null;
    }
    if (options?.systemId) {
        const match = types.find((type)=>type.systemId === options.systemId);
        if (match) {
            return match;
        }
    }
    if (options?.name) {
        const normalized = normalizeName(options.name);
        const match = types.find((type)=>normalizeName(type.name) === normalized);
        if (match) {
            return match;
        }
    }
    return types[0] ?? null;
};
const pickPaymentType = (options)=>{
    const types = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$payments$2f$types$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePaymentTypeStore"].getState().data ?? [];
    if (types.length === 0) {
        return null;
    }
    if (options?.systemId) {
        const match = types.find((type)=>type.systemId === options.systemId);
        if (match) {
            return match;
        }
    }
    if (options?.name) {
        const normalized = normalizeName(options.name);
        const match = types.find((type)=>normalizeName(type.name) === normalized);
        if (match) {
            return match;
        }
    }
    return types[0] ?? null;
};
}),
"[project]/features/finance/document-helpers.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createPaymentDocument",
    ()=>createPaymentDocument,
    "createReceiptDocument",
    ()=>createReceiptDocument
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$receipts$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/receipts/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$payments$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/payments/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/finance/document-lookups.ts [app-ssr] (ecmascript)");
;
;
;
;
;
const asBusinessIdOrUndefined = (value)=>{
    if (!value) {
        return undefined;
    }
    return typeof value === 'string' ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(value) : value;
};
const createReceiptDocument = (options)=>{
    if (!options.branchSystemId) {
        return {
            document: null,
            error: 'Thiếu mã chi nhánh khi tạo phiếu thu.'
        };
    }
    const targetGroup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pickTargetGroup"])({
        systemId: options.payerTargetGroupSystemId,
        name: options.payerTargetGroupName
    });
    if (!targetGroup) {
        return {
            document: null,
            error: 'Chưa cấu hình nhóm đối tượng (Target Group) cho phiếu thu.'
        };
    }
    const paymentMethod = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pickPaymentMethod"])({
        systemId: options.paymentMethodSystemId,
        name: options.paymentMethodName
    });
    if (!paymentMethod) {
        return {
            document: null,
            error: 'Chưa cấu hình phương thức thu tiền.'
        };
    }
    const account = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pickAccount"])({
        accountSystemId: options.accountSystemId,
        preferredType: options.accountPreference,
        branchSystemId: options.branchSystemId,
        paymentMethodName: paymentMethod.name
    });
    if (!account) {
        return {
            document: null,
            error: 'Chưa cấu hình tài khoản quỹ phù hợp để tạo phiếu thu.'
        };
    }
    const receiptType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pickReceiptType"])({
        systemId: options.receiptTypeSystemId,
        name: options.receiptTypeName
    });
    if (!receiptType) {
        return {
            document: null,
            error: 'Chưa cấu hình loại phiếu thu.'
        };
    }
    const timestamp = options.date ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date());
    const payload = {
        date: timestamp,
        amount: options.amount,
        payerTypeSystemId: targetGroup.systemId,
        payerTypeName: targetGroup.name,
        payerName: options.customerName,
        payerSystemId: options.customerSystemId,
        description: options.description,
        paymentMethodSystemId: paymentMethod.systemId,
        paymentMethodName: paymentMethod.name,
        accountSystemId: account.systemId,
        paymentReceiptTypeSystemId: receiptType.systemId,
        paymentReceiptTypeName: receiptType.name,
        branchSystemId: options.branchSystemId,
        branchName: options.branchName,
        createdBy: options.createdBy,
        createdAt: timestamp,
        status: options.status ?? 'completed',
        category: options.category,
        originalDocumentId: asBusinessIdOrUndefined(options.originalDocumentId),
        linkedOrderSystemId: options.linkedOrderSystemId,
        linkedSalesReturnSystemId: options.linkedSalesReturnSystemId,
        linkedWarrantySystemId: options.linkedWarrantySystemId,
        linkedComplaintSystemId: options.linkedComplaintSystemId,
        customerSystemId: options.customerSystemId,
        customerName: options.customerName,
        affectsDebt: options.affectsDebt ?? true
    };
    const receipt = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$receipts$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useReceiptStore"].getState().add(payload);
    return {
        document: receipt
    };
};
const createPaymentDocument = (options)=>{
    if (!options.branchSystemId) {
        return {
            document: null,
            error: 'Thiếu mã chi nhánh khi tạo phiếu chi.'
        };
    }
    const targetGroup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pickTargetGroup"])({
        systemId: options.recipientTargetGroupSystemId,
        name: options.recipientTargetGroupName
    });
    if (!targetGroup) {
        return {
            document: null,
            error: 'Chưa cấu hình nhóm đối tượng (Target Group) cho phiếu chi.'
        };
    }
    const paymentMethod = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pickPaymentMethod"])({
        systemId: options.paymentMethodSystemId,
        name: options.paymentMethodName
    });
    if (!paymentMethod) {
        return {
            document: null,
            error: 'Chưa cấu hình phương thức chi tiền.'
        };
    }
    const account = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pickAccount"])({
        accountSystemId: options.accountSystemId,
        preferredType: options.accountPreference,
        branchSystemId: options.branchSystemId,
        paymentMethodName: paymentMethod.name
    });
    if (!account) {
        return {
            document: null,
            error: 'Chưa cấu hình tài khoản quỹ phù hợp để tạo phiếu chi.'
        };
    }
    const paymentType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pickPaymentType"])({
        systemId: options.paymentTypeSystemId,
        name: options.paymentTypeName
    });
    if (!paymentType) {
        return {
            document: null,
            error: 'Chưa cấu hình loại phiếu chi.'
        };
    }
    const timestamp = options.date ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date());
    const payload = {
        date: timestamp,
        amount: options.amount,
        recipientTypeSystemId: targetGroup.systemId,
        recipientTypeName: targetGroup.name,
        recipientName: options.recipientName,
        recipientSystemId: options.recipientSystemId,
        description: options.description,
        paymentMethodSystemId: paymentMethod.systemId,
        paymentMethodName: paymentMethod.name,
        accountSystemId: account.systemId,
        paymentReceiptTypeSystemId: paymentType.systemId,
        paymentReceiptTypeName: paymentType.name,
        branchSystemId: options.branchSystemId,
        branchName: options.branchName,
        createdBy: options.createdBy,
        createdAt: timestamp,
        status: options.status ?? 'completed',
        category: options.category,
        originalDocumentId: asBusinessIdOrUndefined(options.originalDocumentId),
        linkedOrderSystemId: options.linkedOrderSystemId,
        linkedSalesReturnSystemId: options.linkedSalesReturnSystemId,
        linkedWarrantySystemId: options.linkedWarrantySystemId,
        linkedComplaintSystemId: options.linkedComplaintSystemId,
        customerSystemId: options.customerSystemId,
        customerName: options.customerName ?? options.recipientName,
        affectsDebt: options.affectsDebt ?? true
    };
    const payment = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$payments$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePaymentStore"].getState().add(payload);
    return {
        document: payment
    };
};
}),
"[project]/features/receipts/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useReceiptStore",
    ()=>useReceiptStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
// REMOVED: import { data as initialData } from './data'; // Mock data no longer used - database is source of truth
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/finance/document-lookups.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/employees/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
// API sync helpers
async function syncToAPI(action, data) {
    try {
        const endpoint = action === 'create' ? '/api/receipts' : `/api/receipts/${data.systemId}`;
        const method = action === 'create' ? 'POST' : action === 'update' ? 'PATCH' : 'DELETE';
        const response = await fetch(endpoint, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: action !== 'delete' ? JSON.stringify(data) : undefined
        });
        if (!response.ok) {
            console.error(`[Receipts API] ${action} failed:`, await response.text());
            return false;
        }
        return true;
    } catch (error) {
        console.error(`[Receipts API] ${action} error:`, error);
        return false;
    }
}
// Helper to get current user info
const getCurrentUserInfo = ()=>{
    const currentUserSystemId = __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserSystemId"]?.() || 'SYSTEM';
    const employee = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmployeeStore"].getState().data.find((e)=>e.systemId === currentUserSystemId);
    return {
        systemId: currentUserSystemId,
        name: employee?.fullName || 'Hệ thống',
        avatar: employee?.avatarUrl
    };
};
// Helper to create history entry
const createHistoryEntry = (action, description, metadata)=>({
        id: crypto.randomUUID(),
        action,
        timestamp: new Date(),
        user: getCurrentUserInfo(),
        description,
        metadata
    });
const SYSTEM_AUTHOR = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SYSTEM');
const getCurrentReceiptAuthor = ()=>{
    const userId = __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserSystemId"]?.();
    return userId ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(userId) : SYSTEM_AUTHOR;
};
const RECEIPT_ENTITY = 'receipts';
const SYSTEM_ID_PREFIX = 'RECEIPT';
const BUSINESS_ID_PREFIX = 'PT';
const BUSINESS_ID_DIGITS = 6;
const normalizeReceiptStatus = (status)=>status === 'cancelled' ? 'cancelled' : 'completed';
const ensureReceiptMetadata = (receipt)=>{
    let mutated = false;
    const updates = {};
    const targetGroup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pickTargetGroup"])({
        systemId: receipt.payerTypeSystemId,
        name: receipt.payerTypeName
    });
    if (targetGroup) {
        if (receipt.payerTypeSystemId !== targetGroup.systemId) {
            updates.payerTypeSystemId = targetGroup.systemId;
            mutated = true;
        }
        if (receipt.payerTypeName !== targetGroup.name) {
            updates.payerTypeName = targetGroup.name;
            mutated = true;
        }
    }
    const paymentMethod = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pickPaymentMethod"])({
        systemId: receipt.paymentMethodSystemId,
        name: receipt.paymentMethodName
    });
    if (paymentMethod) {
        if (receipt.paymentMethodSystemId !== paymentMethod.systemId) {
            updates.paymentMethodSystemId = paymentMethod.systemId;
            mutated = true;
        }
        if (receipt.paymentMethodName !== paymentMethod.name) {
            updates.paymentMethodName = paymentMethod.name;
            mutated = true;
        }
    }
    const account = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pickAccount"])({
        accountSystemId: receipt.accountSystemId,
        branchSystemId: receipt.branchSystemId,
        paymentMethodName: paymentMethod?.name ?? receipt.paymentMethodName
    });
    if (account && receipt.accountSystemId !== account.systemId) {
        updates.accountSystemId = account.systemId;
        mutated = true;
    }
    const receiptType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pickReceiptType"])({
        systemId: receipt.paymentReceiptTypeSystemId,
        name: receipt.paymentReceiptTypeName
    });
    if (receiptType) {
        if (receipt.paymentReceiptTypeSystemId !== receiptType.systemId) {
            updates.paymentReceiptTypeSystemId = receiptType.systemId;
            mutated = true;
        }
        if (receipt.paymentReceiptTypeName !== receiptType.name) {
            updates.paymentReceiptTypeName = receiptType.name;
            mutated = true;
        }
    }
    if (!receipt.customerName && receipt.payerName) {
        updates.customerName = receipt.payerName;
        mutated = true;
    }
    if (!receipt.customerSystemId && receipt.payerSystemId) {
        updates.customerSystemId = receipt.payerSystemId;
        mutated = true;
    }
    return mutated ? {
        ...receipt,
        ...updates
    } : receipt;
};
const backfillReceiptMetadata = (receipts)=>{
    let mutated = false;
    const updated = receipts.map((receipt)=>{
        const normalized = ensureReceiptMetadata(receipt);
        if (normalized !== receipt) {
            mutated = true;
        }
        return normalized;
    });
    return mutated ? updated : receipts;
};
const initialReceipts = []; // Database is source of truth
let systemIdCounter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getMaxSystemIdCounter"])(initialReceipts, SYSTEM_ID_PREFIX);
let businessIdCounter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getMaxBusinessIdCounter"])(initialReceipts, BUSINESS_ID_PREFIX);
const getNextSystemId = ()=>{
    systemIdCounter += 1;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateSystemId"])(RECEIPT_ENTITY, systemIdCounter));
};
const ensureReceiptBusinessId = (receipts, provided)=>{
    if (provided && `${provided}`.trim().length > 0) {
        const normalized = `${provided}`.trim().toUpperCase();
        const parsedCounter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extractCounterFromBusinessId"])(normalized, BUSINESS_ID_PREFIX);
        if (parsedCounter > businessIdCounter) {
            businessIdCounter = parsedCounter;
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(normalized);
    }
    const existingIds = receipts.map((receipt)=>receipt.id).filter(Boolean);
    const { nextId, updatedCounter } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findNextAvailableBusinessId"])(BUSINESS_ID_PREFIX, existingIds, businessIdCounter, BUSINESS_ID_DIGITS);
    businessIdCounter = updatedCounter;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(nextId);
};
const useReceiptStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["subscribeWithSelector"])((set, get)=>({
        data: initialReceipts,
        businessIdCounter,
        systemIdCounter,
        initialized: false,
        add: (item)=>{
            let createdReceipt = null;
            set((state)=>{
                const systemId = getNextSystemId();
                const id = ensureReceiptBusinessId(state.data, item.id);
                const createdBy = item.createdBy ?? getCurrentReceiptAuthor();
                const newReceipt = {
                    ...item,
                    systemId,
                    id,
                    createdBy,
                    createdAt: item.createdAt || new Date().toISOString(),
                    status: normalizeReceiptStatus(item.status),
                    orderAllocations: item.orderAllocations ?? []
                };
                const normalizedReceipt = ensureReceiptMetadata(newReceipt);
                createdReceipt = normalizedReceipt;
                return {
                    data: [
                        ...state.data,
                        normalizedReceipt
                    ],
                    businessIdCounter,
                    systemIdCounter
                };
            });
            // Sync to API
            if (createdReceipt) {
                syncToAPI('create', createdReceipt).catch(console.error);
            }
            return createdReceipt;
        },
        addMultiple: (items)=>{
            const created = [];
            set((state)=>{
                items.forEach((item)=>{
                    const context = [
                        ...state.data,
                        ...created
                    ];
                    const systemId = getNextSystemId();
                    const id = ensureReceiptBusinessId(context, item.id);
                    const createdBy = item.createdBy ?? getCurrentReceiptAuthor();
                    const newReceipt = {
                        ...item,
                        systemId,
                        id,
                        createdBy,
                        createdAt: item.createdAt || new Date().toISOString(),
                        status: normalizeReceiptStatus(item.status),
                        orderAllocations: item.orderAllocations ?? []
                    };
                    created.push(ensureReceiptMetadata(newReceipt));
                });
                return {
                    data: [
                        ...state.data,
                        ...created
                    ],
                    businessIdCounter,
                    systemIdCounter
                };
            });
            // Sync all to API
            created.forEach((receipt)=>{
                syncToAPI('create', receipt).catch(console.error);
            });
        },
        update: (systemId, item)=>{
            const updated = {
                ...item,
                status: normalizeReceiptStatus(item.status),
                updatedAt: new Date().toISOString()
            };
            set((state)=>({
                    data: state.data.map((r)=>r.systemId === systemId ? updated : r),
                    businessIdCounter,
                    systemIdCounter
                }));
            // Sync to API
            syncToAPI('update', updated).catch(console.error);
        },
        remove: (systemId)=>{
            set((state)=>({
                    data: state.data.filter((r)=>r.systemId !== systemId),
                    businessIdCounter,
                    systemIdCounter
                }));
            // Sync to API
            syncToAPI('delete', {
                systemId
            }).catch(console.error);
        },
        findById: (systemId)=>{
            return get().data.find((r)=>r.systemId === systemId);
        },
        getActive: ()=>{
            return get().data.filter((r)=>r.status !== 'cancelled');
        },
        cancel: (systemId, reason)=>{
            const receipt = get().findById(systemId);
            if (receipt && receipt.status !== 'cancelled') {
                const historyEntry = createHistoryEntry('cancelled', `Đã hủy phiếu thu${reason ? `: ${reason}` : ''}`, {
                    oldValue: 'Hoàn thành',
                    newValue: 'Đã hủy',
                    note: reason
                });
                get().update(systemId, {
                    ...receipt,
                    status: 'cancelled',
                    cancelledAt: new Date().toISOString(),
                    activityHistory: [
                        ...receipt.activityHistory || [],
                        historyEntry
                    ]
                });
            }
        },
        loadFromAPI: async ()=>{
            try {
                // NOTE: Use React Query hooks for paginated data. This only loads initial batch.
                const response = await fetch('/api/receipts?limit=30');
                if (!response.ok) return;
                const json = await response.json();
                const apiData = json.data || [];
                if (apiData.length > 0) {
                    const normalized = backfillReceiptMetadata(apiData.map((receipt)=>({
                            ...receipt,
                            status: normalizeReceiptStatus(receipt.status)
                        })));
                    const nextSystemCounter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getMaxSystemIdCounter"])(normalized, SYSTEM_ID_PREFIX);
                    const nextBusinessCounter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getMaxBusinessIdCounter"])(normalized, BUSINESS_ID_PREFIX);
                    systemIdCounter = nextSystemCounter;
                    businessIdCounter = nextBusinessCounter;
                    set({
                        data: normalized,
                        systemIdCounter,
                        businessIdCounter,
                        initialized: true
                    });
                } else {
                    set({
                        initialized: true
                    });
                }
            } catch (error) {
                console.error('[Receipts API] loadFromAPI error:', error);
            }
        }
    })));
}),
"[project]/features/payments/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePaymentStore",
    ()=>usePaymentStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
// REMOVED: import { data as initialData } from './data'; // Mock data no longer used - database is source of truth
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/finance/document-lookups.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/employees/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-ssr] (ecmascript)");
;
;
;
;
;
;
// API sync helpers
async function syncToAPI(action, data) {
    try {
        const endpoint = action === 'create' ? '/api/payments' : `/api/payments/${data.systemId}`;
        const method = action === 'create' ? 'POST' : action === 'update' ? 'PATCH' : 'DELETE';
        const response = await fetch(endpoint, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: action !== 'delete' ? JSON.stringify(data) : undefined
        });
        if (!response.ok) {
            console.error(`[Payments API] ${action} failed:`, await response.text());
            return false;
        }
        return true;
    } catch (error) {
        console.error(`[Payments API] ${action} error:`, error);
        return false;
    }
}
// Helper to get current user info
const getCurrentUserInfo = ()=>{
    const currentUserSystemId = __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserSystemId"]?.() || 'SYSTEM';
    const employee = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmployeeStore"].getState().data.find((e)=>e.systemId === currentUserSystemId);
    return {
        systemId: currentUserSystemId,
        name: employee?.fullName || 'Hệ thống',
        avatar: employee?.avatarUrl
    };
};
// Helper to create history entry
const createHistoryEntry = (action, description, metadata)=>({
        id: crypto.randomUUID(),
        action,
        timestamp: new Date(),
        user: getCurrentUserInfo(),
        description,
        metadata
    });
const PAYMENT_ENTITY = 'payments';
const SYSTEM_ID_PREFIX = 'PAYMENT';
const BUSINESS_ID_PREFIX = 'PC';
const BUSINESS_ID_DIGITS = 6;
const PURCHASE_ORDER_SYSTEM_PREFIX = 'PURCHASE';
const PURCHASE_ORDER_BUSINESS_PREFIX = 'PO';
const normalizePaymentStatus = (status)=>status === 'cancelled' ? 'cancelled' : 'completed';
const normalizePayment = (payment)=>({
        ...payment,
        status: normalizePaymentStatus(payment.status)
    });
const ensurePaymentMetadata = (payment)=>{
    let mutated = false;
    const updates = {};
    const targetGroup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pickTargetGroup"])({
        systemId: payment.recipientTypeSystemId,
        name: payment.recipientTypeName
    });
    if (targetGroup) {
        if (payment.recipientTypeSystemId !== targetGroup.systemId) {
            updates.recipientTypeSystemId = targetGroup.systemId;
            mutated = true;
        }
        if (payment.recipientTypeName !== targetGroup.name) {
            updates.recipientTypeName = targetGroup.name;
            mutated = true;
        }
    }
    const paymentMethod = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pickPaymentMethod"])({
        systemId: payment.paymentMethodSystemId,
        name: payment.paymentMethodName
    });
    if (paymentMethod) {
        if (payment.paymentMethodSystemId !== paymentMethod.systemId) {
            updates.paymentMethodSystemId = paymentMethod.systemId;
            mutated = true;
        }
        if (payment.paymentMethodName !== paymentMethod.name) {
            updates.paymentMethodName = paymentMethod.name;
            mutated = true;
        }
    }
    const account = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pickAccount"])({
        accountSystemId: payment.accountSystemId,
        branchSystemId: payment.branchSystemId,
        paymentMethodName: paymentMethod?.name ?? payment.paymentMethodName
    });
    if (account && payment.accountSystemId !== account.systemId) {
        updates.accountSystemId = account.systemId;
        mutated = true;
    }
    const paymentType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pickPaymentType"])({
        systemId: payment.paymentReceiptTypeSystemId,
        name: payment.paymentReceiptTypeName
    });
    if (paymentType) {
        if (payment.paymentReceiptTypeSystemId !== paymentType.systemId) {
            updates.paymentReceiptTypeSystemId = paymentType.systemId;
            mutated = true;
        }
        if (payment.paymentReceiptTypeName !== paymentType.name) {
            updates.paymentReceiptTypeName = paymentType.name;
            mutated = true;
        }
    }
    const normalizedGroupName = targetGroup?.name?.trim().toLowerCase();
    if (normalizedGroupName === 'khách hàng') {
        if (!payment.customerName && payment.recipientName) {
            updates.customerName = payment.recipientName;
            mutated = true;
        }
        if (!payment.customerSystemId && payment.recipientSystemId) {
            updates.customerSystemId = payment.recipientSystemId;
            mutated = true;
        }
    }
    return mutated ? {
        ...payment,
        ...updates
    } : payment;
};
const backfillPaymentMetadata = (payments)=>{
    let mutated = false;
    const updated = payments.map((payment)=>{
        const normalized = ensurePaymentMetadata(payment);
        if (normalized !== payment) {
            mutated = true;
        }
        return normalized;
    });
    return mutated ? updated : payments;
};
const initialPayments = []; // Database is source of truth
let systemIdCounter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getMaxSystemIdCounter"])(initialPayments, SYSTEM_ID_PREFIX);
let businessIdCounter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getMaxBusinessIdCounter"])(initialPayments, BUSINESS_ID_PREFIX);
const getNextSystemId = ()=>{
    systemIdCounter += 1;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateSystemId"])(PAYMENT_ENTITY, systemIdCounter));
};
const ensurePaymentBusinessId = (payments, provided)=>{
    if (provided && `${provided}`.trim().length > 0) {
        const normalized = `${provided}`.trim().toUpperCase();
        const parsedCounter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extractCounterFromBusinessId"])(normalized, BUSINESS_ID_PREFIX);
        if (parsedCounter > businessIdCounter) {
            businessIdCounter = parsedCounter;
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(normalized);
    }
    const existingIds = payments.map((payment)=>payment.id).filter(Boolean);
    const { nextId, updatedCounter } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findNextAvailableBusinessId"])(BUSINESS_ID_PREFIX, existingIds, businessIdCounter, BUSINESS_ID_DIGITS);
    businessIdCounter = updatedCounter;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(nextId);
};
const reconcileLinkedDocuments = (payment)=>{
    if (!payment.originalDocumentId) {
        return payment;
    }
    const normalizedDocId = payment.originalDocumentId.toUpperCase();
    const nextPayment = {
        ...payment
    };
    if (!nextPayment.purchaseOrderSystemId && normalizedDocId.startsWith(PURCHASE_ORDER_SYSTEM_PREFIX)) {
        nextPayment.purchaseOrderSystemId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(payment.originalDocumentId);
    }
    if (!nextPayment.purchaseOrderId && normalizedDocId.startsWith(PURCHASE_ORDER_BUSINESS_PREFIX)) {
        nextPayment.purchaseOrderId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(payment.originalDocumentId);
    }
    return nextPayment;
};
const buildPayment = (input, existingPayments)=>{
    const systemId = getNextSystemId();
    const id = ensurePaymentBusinessId(existingPayments, input.id);
    const basePayment = {
        ...input,
        systemId,
        id,
        createdAt: input.createdAt || new Date().toISOString(),
        status: normalizePaymentStatus(input.status)
    };
    return reconcileLinkedDocuments(basePayment);
};
const usePaymentStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((set, get)=>({
        data: initialPayments,
        businessIdCounter,
        systemIdCounter,
        initialized: false,
        add: (item)=>{
            let createdPayment = null;
            set((state)=>{
                const newPayment = buildPayment(item, state.data);
                createdPayment = newPayment;
                return {
                    data: [
                        ...state.data,
                        newPayment
                    ],
                    businessIdCounter,
                    systemIdCounter
                };
            });
            // Sync to API
            if (createdPayment) {
                syncToAPI('create', createdPayment).catch(console.error);
            }
            return createdPayment;
        },
        addMultiple: (items)=>{
            const created = [];
            set((state)=>{
                items.forEach((item)=>{
                    const context = [
                        ...state.data,
                        ...created
                    ];
                    const payment = buildPayment(item, context);
                    created.push(payment);
                });
                return {
                    data: [
                        ...state.data,
                        ...created
                    ],
                    businessIdCounter,
                    systemIdCounter
                };
            });
            // Sync all to API
            created.forEach((payment)=>{
                syncToAPI('create', payment).catch(console.error);
            });
        },
        update: (systemId, item)=>{
            const updated = reconcileLinkedDocuments({
                ...item,
                systemId,
                status: normalizePaymentStatus(item.status),
                updatedAt: new Date().toISOString()
            });
            set((state)=>({
                    data: state.data.map((payment)=>payment.systemId === systemId ? updated : payment),
                    businessIdCounter,
                    systemIdCounter
                }));
            // Sync to API
            syncToAPI('update', updated).catch(console.error);
        },
        remove: (systemId)=>{
            set((state)=>({
                    data: state.data.filter((payment)=>payment.systemId !== systemId),
                    businessIdCounter,
                    systemIdCounter
                }));
            // Sync to API
            syncToAPI('delete', {
                systemId
            }).catch(console.error);
        },
        findById: (systemId)=>{
            return get().data.find((payment)=>payment.systemId === systemId);
        },
        getActive: ()=>{
            return get().data.filter((payment)=>payment.status !== 'cancelled');
        },
        cancel: (systemId, reason)=>{
            const payment = get().findById(systemId);
            if (payment && payment.status !== 'cancelled') {
                const historyEntry = createHistoryEntry('cancelled', `Đã hủy phiếu chi${reason ? `: ${reason}` : ''}`, {
                    oldValue: 'Hoàn thành',
                    newValue: 'Đã hủy',
                    note: reason
                });
                get().update(systemId, {
                    ...payment,
                    status: 'cancelled',
                    cancelledAt: new Date().toISOString(),
                    activityHistory: [
                        ...payment.activityHistory || [],
                        historyEntry
                    ]
                });
            }
        },
        loadFromAPI: async ()=>{
            try {
                // NOTE: Use React Query hooks for paginated data. This only loads initial batch.
                const response = await fetch('/api/payments?limit=30');
                if (!response.ok) return;
                const json = await response.json();
                const apiData = json.data || [];
                if (apiData.length > 0) {
                    const normalized = backfillPaymentMetadata(apiData.map(normalizePayment));
                    const nextSystemCounter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getMaxSystemIdCounter"])(normalized, SYSTEM_ID_PREFIX);
                    const nextBusinessCounter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getMaxBusinessIdCounter"])(normalized, BUSINESS_ID_PREFIX);
                    systemIdCounter = nextSystemCounter;
                    businessIdCounter = nextBusinessCounter;
                    set({
                        data: normalized,
                        systemIdCounter,
                        businessIdCounter,
                        initialized: true
                    });
                } else {
                    set({
                        initialized: true
                    });
                }
            } catch (error) {
                console.error('[Payments API] loadFromAPI error:', error);
            }
        }
    }));
}),
"[project]/features/sales-returns/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useSalesReturnStore",
    ()=>useSalesReturnStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-ssr] (ecmascript)");
// Other stores
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/orders/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/products/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$stock$2d$history$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/stock-history/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/customers/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$helpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/finance/document-helpers.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$shipping$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/shipping/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$combo$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/products/combo-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-utils.ts [app-ssr] (ecmascript)");
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
/**
 * ✅ Helper: Expand combo return items to child products
 * When a combo is returned, we need to add stock back to child products
 */ const getReturnStockItems = (returnItems)=>{
    const { findById } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState();
    const expandedItems = [];
    returnItems.forEach((item)=>{
        const product = findById(item.productSystemId);
        if (product && (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$combo$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isComboProduct"])(product) && product.comboItems) {
            // Combo → expand to child products
            product.comboItems.forEach((comboItem)=>{
                const childProduct = findById(comboItem.productSystemId);
                expandedItems.push({
                    productSystemId: comboItem.productSystemId,
                    productName: childProduct?.name || 'SP không xác định',
                    quantity: comboItem.quantity * item.returnQuantity
                });
            });
        } else {
            // Regular product
            expandedItems.push({
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(item.productSystemId),
                productName: item.productName,
                quantity: item.returnQuantity
            });
        }
    });
    return expandedItems;
};
const baseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createCrudStore"])([], 'sales-returns', {
    apiEndpoint: '/api/sales-returns'
});
const originalAdd = baseStore.getState().add;
const augmentedMethods = {
    addWithSideEffects: (item)=>{
        const orderSystemId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(item.orderSystemId);
        const orderBusinessId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(item.orderId);
        const customerSystemId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(item.customerSystemId);
        const branchSystemId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(item.branchSystemId);
        const creatorSystemId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(item.creatorSystemId ?? item.creatorId ?? 'SYSTEM');
        const exchangeOrderSystemId = item.exchangeOrderSystemId ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(item.exchangeOrderSystemId) : undefined;
        const accountSystemId = item.accountSystemId ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(item.accountSystemId) : undefined;
        const paymentVoucherSystemId = item.paymentVoucherSystemId ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(item.paymentVoucherSystemId) : undefined;
        const paymentVoucherSystemIds = item.paymentVoucherSystemIds?.map(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"]);
        const receiptVoucherSystemIds = item.receiptVoucherSystemIds?.map(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"]);
        const formattedItems = item.items.map((lineItem)=>({
                ...lineItem,
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(lineItem.productSystemId),
                productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(lineItem.productId)
            }));
        const formattedPayments = item.payments?.map((payment)=>({
                ...payment,
                accountSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(payment.accountSystemId)
            }));
        const formattedRefunds = item.refunds?.map((refund)=>({
                ...refund,
                accountSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(refund.accountSystemId)
            }));
        const newItemData = {
            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(''),
            orderSystemId,
            orderId: orderBusinessId,
            customerSystemId,
            customerName: item.customerName,
            branchSystemId,
            branchName: item.branchName,
            returnDate: item.returnDate,
            reason: item.reason,
            note: item.note,
            notes: item.notes,
            reference: item.reference,
            items: formattedItems,
            totalReturnValue: item.totalReturnValue,
            isReceived: item.isReceived,
            exchangeItems: item.exchangeItems ?? [],
            exchangeOrderSystemId,
            subtotalNew: item.subtotalNew,
            shippingFeeNew: item.shippingFeeNew,
            discountNew: item.discountNew,
            discountNewType: item.discountNewType,
            grandTotalNew: item.grandTotalNew,
            deliveryMethod: item.deliveryMethod,
            shippingPartnerId: item.shippingPartnerId,
            shippingServiceId: item.shippingServiceId,
            shippingAddress: item.shippingAddress,
            packageInfo: item.packageInfo,
            configuration: item.configuration,
            finalAmount: item.finalAmount,
            refundMethod: item.refundMethod,
            refundAmount: item.refundAmount,
            accountSystemId,
            refunds: formattedRefunds,
            payments: formattedPayments,
            paymentVoucherSystemId,
            paymentVoucherSystemIds,
            receiptVoucherSystemIds,
            creatorSystemId,
            creatorName: item.creatorName
        };
        // --- Side Effects ---
        const { update: updateOrder, findById: findOrderById, add: addOrder } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useOrderStore"].getState();
        const { updateInventory } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState();
        const { addEntry: addStockHistory } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$stock$2d$history$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStockHistoryStore"].getState();
        const { updateDebt, incrementReturnStats } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCustomerStore"].getState();
        const order = findOrderById(newItemData.orderSystemId);
        if (!order) return {
            newReturn: null,
            newOrderSystemId: null
        };
        // ✅ IMPORTANT: Create the return FIRST to get IDs for exchange order
        const newReturn = originalAdd(newItemData);
        if (!newReturn) return {
            newReturn: null,
            newOrderSystemId: null
        };
        // ✅ Update customer return stats
        const totalReturnQty = newItemData.items.reduce((sum, item)=>sum + item.returnQuantity, 0);
        if (totalReturnQty > 0) {
            incrementReturnStats(newItemData.customerSystemId, totalReturnQty);
        }
        let newOrderSystemId;
        // Create a new sales order for the exchange items
        if (newItemData.exchangeItems && newItemData.exchangeItems.length > 0) {
            console.log('🔄 [Sales Return] Creating exchange order...', {
                exchangeItems: newItemData.exchangeItems,
                finalAmount: newItemData.finalAmount,
                payments: newItemData.payments
            });
            // ✅ Calculate payments for exchange order based on sales return logic
            const exchangeOrderPayments = newItemData.finalAmount > 0 && newItemData.payments ? newItemData.payments.map((p)=>({
                    method: p.method,
                    accountSystemId: p.accountSystemId,
                    amount: p.amount
                })) : [];
            // If company refunded customer (finalAmount < 0)
            // The exchange order will have COD = grandTotal (shipper collects on delivery)
            // No payments array needed - will be handled by COD in shipping
            // ✅ Determine status and packagings based on delivery method
            let finalMainStatus = 'Đặt hàng';
            let finalDeliveryStatus = 'Chờ đóng gói';
            const packagings = [];
            const now = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDateCustom"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentDate"])(), 'yyyy-MM-dd HH:mm');
            // ✅ Helper to get next packaging systemId
            const PACKAGING_SYSTEM_ID_PREFIX = 'PACKAGE';
            const allOrders = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useOrderStore"].getState().data;
            const allPackagings = allOrders.flatMap((o)=>o.packagings || []);
            const maxPackagingCounter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getMaxSystemIdCounter"])(allPackagings, PACKAGING_SYSTEM_ID_PREFIX);
            let packagingCounter = maxPackagingCounter;
            const getNextPackagingSystemId = ()=>{
                packagingCounter++;
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateSystemId"])('packaging', packagingCounter));
            };
            // Check if using shipping partner or pickup
            const isPickup = newItemData.deliveryMethod === 'pickup';
            const isShippingPartner = newItemData.shippingPartnerId && newItemData.shippingServiceId;
            if (isPickup) {
                // Nhận tại cửa hàng - Tạo packaging request ngay
                finalMainStatus = 'Đang giao dịch';
                finalDeliveryStatus = 'Chờ đóng gói';
                packagings.push({
                    systemId: getNextPackagingSystemId(),
                    id: '',
                    requestDate: now,
                    requestingEmployeeId: creatorSystemId,
                    requestingEmployeeName: newItemData.creatorName,
                    status: 'Chờ đóng gói',
                    printStatus: 'Chưa in',
                    deliveryStatus: 'Chờ đóng gói'
                });
            } else if (isShippingPartner) {
                // Đẩy qua hãng vận chuyển - Tạo packaging đã đóng gói với tracking
                finalMainStatus = 'Đang giao dịch';
                finalDeliveryStatus = 'Chờ lấy hàng';
                // Get partner info
                const { data: partners } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$shipping$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useShippingPartnerStore"].getState();
                const partner = partners.find((p)=>p.systemId === newItemData.shippingPartnerId);
                const service = partner?.services.find((s)=>s.id === newItemData.shippingServiceId);
                packagings.push({
                    systemId: getNextPackagingSystemId(),
                    id: '',
                    requestDate: now,
                    confirmDate: now,
                    requestingEmployeeId: creatorSystemId,
                    requestingEmployeeName: newItemData.creatorName,
                    confirmingEmployeeId: creatorSystemId,
                    confirmingEmployeeName: newItemData.creatorName,
                    status: 'Đã đóng gói',
                    deliveryStatus: 'Chờ lấy hàng',
                    printStatus: 'Chưa in',
                    deliveryMethod: 'Dịch vụ giao hàng',
                    carrier: partner?.name,
                    service: service?.name,
                    trackingCode: newItemData.packageInfo?.trackingCode || `VC${Date.now()}`,
                    shippingFeeToPartner: newItemData.shippingFeeNew,
                    codAmount: 0,
                    payer: 'Người nhận',
                    weight: newItemData.packageInfo?.weight,
                    dimensions: newItemData.packageInfo?.dimensions
                });
            }
            // else: deliver-later → keep default 'Đặt hàng', 'Chờ đóng gói', no packagings
            const newOrderPayload = {
                id: '',
                customerSystemId: order.customerSystemId,
                customerName: order.customerName,
                branchSystemId: order.branchSystemId,
                branchName: order.branchName,
                salespersonId: creatorSystemId,
                salesperson: newItemData.creatorName,
                orderDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDateCustom"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentDate"])(), 'yyyy-MM-dd HH:mm'),
                lineItems: newItemData.exchangeItems,
                subtotal: newItemData.subtotalNew,
                shippingFee: newItemData.shippingFeeNew,
                tax: 0,
                // ✅ IMPORTANT: grandTotal should be NET amount (after subtracting return value)
                // grandTotal = subtotalNew + shippingFee - totalReturnValue
                grandTotal: newItemData.finalAmount > 0 ? newItemData.finalAmount : newItemData.grandTotalNew,
                // ✅ Store return value info for display
                linkedSalesReturnId: newReturn.id,
                linkedSalesReturnSystemId: newReturn.systemId,
                linkedSalesReturnValue: newItemData.totalReturnValue,
                payments: exchangeOrderPayments,
                notes: `Đơn hàng đổi từ phiếu trả ${newReturn.id} của đơn hàng ${order.id}`,
                sourceSalesReturnId: newReturn.id,
                // ✅ Pass shipping info from form
                deliveryMethod: newItemData.deliveryMethod === 'pickup' ? 'Nhận tại cửa hàng' : 'Dịch vụ giao hàng',
                shippingPartnerId: newItemData.shippingPartnerId,
                shippingServiceId: newItemData.shippingServiceId,
                shippingAddress: newItemData.shippingAddress,
                packageInfo: newItemData.packageInfo,
                configuration: newItemData.configuration,
                // ✅ Add required status fields based on delivery method
                status: finalMainStatus,
                paymentStatus: exchangeOrderPayments.length > 0 ? exchangeOrderPayments.reduce((sum, p)=>sum + p.amount, 0) >= newItemData.grandTotalNew ? 'Thanh toán toàn bộ' : 'Thanh toán 1 phần' : 'Chưa thanh toán',
                deliveryStatus: finalDeliveryStatus,
                printStatus: 'Chưa in',
                stockOutStatus: 'Chưa xuất kho',
                returnStatus: 'Chưa trả hàng',
                codAmount: 0,
                packagings: packagings
            };
            console.log('📦 [Sales Return] New order payload:', newOrderPayload);
            const newOrder = addOrder(newOrderPayload);
            console.log('✅ [Sales Return] New order created:', newOrder);
            if (newOrder) {
                newOrderSystemId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(newOrder.systemId);
                // ✅ Save exchange order systemId to sales return
                newItemData.exchangeOrderSystemId = newOrderSystemId;
                console.log('🎉 [Sales Return] Exchange order systemId:', newOrderSystemId);
            } else {
                console.error('❌ [Sales Return] Failed to create exchange order!');
            }
        }
        // Adjust customer debt if needed
        const creditAmount = newItemData.totalReturnValue - newItemData.grandTotalNew - (newItemData.refundAmount || 0);
        if (creditAmount > 0) {
            updateDebt(newItemData.customerSystemId, -creditAmount);
        }
        // ✅ newReturn already created above, use it directly
        // ✅ NOW create vouchers with correct originalDocumentId
        // Handle Financials AFTER creating the return
        const finalAmount = newItemData.finalAmount;
        if (finalAmount < 0 && newItemData.refunds && newItemData.refunds.length > 0) {
            const createdVoucherIds = [];
            newItemData.refunds.forEach((refund)=>{
                if (!refund.amount || refund.amount <= 0) {
                    return;
                }
                const { document, error } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$helpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createPaymentDocument"])({
                    amount: refund.amount,
                    description: `Hoàn tiền đổi/trả hàng từ đơn ${order.id} (Phiếu: ${newReturn.id}) qua ${refund.method}`,
                    recipientName: newItemData.customerName,
                    recipientSystemId: newItemData.customerSystemId,
                    customerSystemId: newItemData.customerSystemId,
                    customerName: newItemData.customerName,
                    paymentMethodName: refund.method,
                    accountSystemId: refund.accountSystemId,
                    paymentTypeName: 'Hoàn tiền khách hàng',
                    branchSystemId: newReturn.branchSystemId,
                    branchName: newReturn.branchName,
                    createdBy: creatorSystemId,
                    originalDocumentId: newReturn.id,
                    linkedSalesReturnSystemId: newReturn.systemId,
                    linkedOrderSystemId: newReturn.orderSystemId,
                    category: 'complaint_refund',
                    affectsDebt: true
                });
                if (error) {
                    console.error('[Sales Return] Failed to create payment voucher:', error);
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(`Không thể tạo phiếu chi hoàn tiền: ${error}`);
                    return;
                }
                if (document) {
                    createdVoucherIds.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(document.systemId));
                }
            });
            if (createdVoucherIds.length > 0) {
                baseStore.getState().update(newReturn.systemId, {
                    ...newReturn,
                    paymentVoucherSystemIds: createdVoucherIds
                });
            }
        } else if (finalAmount > 0 && newItemData.payments && newItemData.payments.length > 0) {
            const createdVoucherIds = [];
            newItemData.payments.forEach((payment)=>{
                if (!payment.amount || payment.amount <= 0) {
                    return;
                }
                const { document, error } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$helpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createReceiptDocument"])({
                    amount: payment.amount,
                    description: `Thu tiền chênh lệch đổi hàng từ đơn ${order.id} (Phiếu: ${newReturn.id})`,
                    customerName: newReturn.customerName,
                    customerSystemId: newItemData.customerSystemId,
                    paymentMethodName: payment.method,
                    accountSystemId: payment.accountSystemId,
                    receiptTypeName: 'Thanh toán cho đơn hàng',
                    branchSystemId: newReturn.branchSystemId,
                    branchName: newReturn.branchName,
                    createdBy: creatorSystemId,
                    originalDocumentId: newReturn.id,
                    linkedSalesReturnSystemId: newReturn.systemId,
                    linkedOrderSystemId: newReturn.orderSystemId,
                    category: 'sale',
                    affectsDebt: false
                });
                if (error) {
                    console.error('[Sales Return] Failed to create receipt voucher:', error);
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(`Không thể tạo phiếu thu đổi hàng: ${error}`);
                    return;
                }
                if (document) {
                    createdVoucherIds.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(document.systemId));
                }
            });
            if (createdVoucherIds.length > 0) {
                baseStore.getState().update(newReturn.systemId, {
                    ...newReturn,
                    receiptVoucherSystemIds: createdVoucherIds
                });
            }
        }
        // ✅ Update inventory for returned items ONLY if isReceived = true
        // ✅ For combo products, add stock to child products instead
        if (newReturn.isReceived) {
            console.log('✅ [Sales Return] Updating inventory - items received');
            // Expand combo items to child products
            const stockItems = getReturnStockItems(newReturn.items);
            stockItems.forEach((item)=>{
                if (item.quantity > 0) {
                    const product = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState().findById(item.productSystemId);
                    const oldStock = product?.inventoryByBranch[newReturn.branchSystemId] || 0;
                    updateInventory(item.productSystemId, newReturn.branchSystemId, item.quantity); // Add stock back
                    addStockHistory({
                        productId: item.productSystemId,
                        date: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentDate"])().toISOString(),
                        employeeName: newReturn.creatorName,
                        action: 'Nhập hàng từ khách trả',
                        quantityChange: item.quantity,
                        newStockLevel: oldStock + item.quantity,
                        documentId: newReturn.id,
                        branchSystemId: newReturn.branchSystemId,
                        branch: newReturn.branchName
                    });
                }
            });
        } else {
            console.log('⏸️ [Sales Return] Inventory NOT updated - waiting for receipt confirmation');
        }
        // Update original order's return status
        const previousReturnsForOrder = baseStore.getState().data.filter((r)=>r.orderSystemId === order.systemId);
        const totalReturnedQty = previousReturnsForOrder.flatMap((r)=>r.items).reduce((sum, item)=>sum + item.returnQuantity, 0);
        const totalOrderedQty = order.lineItems.reduce((sum, item)=>sum + item.quantity, 0);
        const newReturnStatus = totalReturnedQty >= totalOrderedQty ? 'Trả hàng toàn bộ' : 'Trả hàng một phần';
        updateOrder(order.systemId, {
            ...order,
            returnStatus: newReturnStatus
        });
        return {
            newReturn,
            newOrderSystemId
        };
    },
    /**
   * ✅ Confirm receipt of returned items and update inventory
   * Use this when isReceived was false initially and items are now received
   * ✅ For combo products, add stock to child products instead
   */ confirmReceipt: (returnSystemId)=>{
        const salesReturn = baseStore.getState().findById(returnSystemId);
        if (!salesReturn) {
            console.error('❌ [Sales Return] Return not found:', returnSystemId);
            return {
                success: false,
                message: 'Không tìm thấy phiếu trả hàng'
            };
        }
        if (salesReturn.isReceived) {
            console.warn('⚠️ [Sales Return] Already received:', returnSystemId);
            return {
                success: false,
                message: 'Hàng đã được nhận trước đó'
            };
        }
        const { updateInventory } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState();
        const { addEntry: addStockHistory } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$stock$2d$history$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStockHistoryStore"].getState();
        // ✅ Expand combo items to child products
        const stockItems = getReturnStockItems(salesReturn.items);
        // Update inventory for all returned items (including expanded combo children)
        stockItems.forEach((item)=>{
            if (item.quantity > 0) {
                const product = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState().findById(item.productSystemId);
                const oldStock = product?.inventoryByBranch[salesReturn.branchSystemId] || 0;
                updateInventory(item.productSystemId, salesReturn.branchSystemId, item.quantity);
                addStockHistory({
                    productId: item.productSystemId,
                    date: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentDate"])().toISOString(),
                    employeeName: salesReturn.creatorName,
                    action: 'Nhập hàng từ khách trả (xác nhận)',
                    quantityChange: item.quantity,
                    newStockLevel: oldStock + item.quantity,
                    documentId: salesReturn.id,
                    branchSystemId: salesReturn.branchSystemId,
                    branch: salesReturn.branchName
                });
            }
        });
        // Update the return record
        baseStore.getState().update(returnSystemId, {
            ...salesReturn,
            isReceived: true
        });
        console.log('✅ [Sales Return] Receipt confirmed and inventory updated:', returnSystemId);
        return {
            success: true,
            message: 'Đã xác nhận nhận hàng và cập nhật tồn kho'
        };
    }
};
const useSalesReturnStore = ()=>{
    const state = baseStore();
    return {
        ...state,
        ...augmentedMethods
    };
};
// Export getState for non-hook usage
useSalesReturnStore.getState = ()=>{
    const state = baseStore.getState();
    return {
        ...state,
        ...augmentedMethods
    };
};
}),
"[project]/features/shipments/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useShipmentStore",
    ()=>useShipmentStore
]);
/**
 * Shipment Store - Entity riêng cho vận đơn
 * 
 * ⚠️ ID Format theo ID-GOVERNANCE.md:
 * - SystemId: SHIPMENT000001
 * - BusinessId: VC000001
 * 
 * Relationship: Shipment 1:1 Packaging (via packagingSystemId)
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-utils.ts [app-ssr] (ecmascript)");
;
;
;
// ========================================
// CONSTANTS
// ========================================
const SHIPMENT_SYSTEM_ID_PREFIX = 'SHIPMENT';
const SHIPMENT_BUSINESS_ID_PREFIX = 'VC';
// ========================================
// INITIAL SEED DATA
// ========================================
const initialData = [
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SHIPMENT000001'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('VC000001'),
        packagingSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PACKAGE000001'),
        orderSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ORDER000001'),
        orderId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000001'),
        trackingCode: 'GHN000001',
        carrier: 'GHN',
        service: 'Chuẩn',
        deliveryStatus: 'Đã giao hàng',
        printStatus: 'Đã in',
        reconciliationStatus: 'Đã đối soát',
        shippingFeeToPartner: 25000,
        codAmount: 0,
        payer: 'Người gửi',
        createdAt: '2025-11-01 08:30',
        dispatchedAt: '2025-11-02 08:00',
        deliveredAt: '2025-11-05 15:30'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SHIPMENT000002'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('VC000002'),
        packagingSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PACKAGE000002'),
        orderSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ORDER000002'),
        orderId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000002'),
        trackingCode: 'JT000245',
        carrier: 'J&T Express',
        service: 'Gói chuẩn',
        deliveryStatus: 'Đang giao hàng',
        printStatus: 'Đã in',
        reconciliationStatus: 'Chưa đối soát',
        shippingFeeToPartner: 30000,
        codAmount: 5000000,
        payer: 'Người nhận',
        createdAt: '2025-11-03 16:00',
        dispatchedAt: '2025-11-04 09:00'
    },
    // Thêm dữ liệu mẫu mới
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SHIPMENT000003'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('VC000003'),
        packagingSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PACKAGE000005'),
        orderSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ORDER000005'),
        orderId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000005'),
        trackingCode: 'GHTK123456',
        carrier: 'GHTK',
        service: 'Nhanh',
        deliveryStatus: 'Đã giao hàng',
        printStatus: 'Đã in',
        reconciliationStatus: 'Chưa đối soát',
        shippingFeeToPartner: 35000,
        codAmount: 12500000,
        payer: 'Người nhận',
        createdAt: '2025-11-08 10:00',
        dispatchedAt: '2025-11-08 14:00',
        deliveredAt: '2025-11-10 11:30'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SHIPMENT000004'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('VC000004'),
        packagingSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PACKAGE000006'),
        orderSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ORDER000006'),
        orderId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000006'),
        trackingCode: 'VTP789012',
        carrier: 'Viettel Post',
        service: 'Tiêu chuẩn',
        deliveryStatus: 'Đang giao hàng',
        printStatus: 'Đã in',
        reconciliationStatus: 'Chưa đối soát',
        shippingFeeToPartner: 28000,
        codAmount: 8900000,
        payer: 'Người nhận',
        createdAt: '2025-11-09 09:15',
        dispatchedAt: '2025-11-09 15:30'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SHIPMENT000005'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('VC000005'),
        packagingSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PACKAGE000007'),
        orderSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ORDER000007'),
        orderId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000007'),
        trackingCode: 'GHN345678',
        carrier: 'GHN',
        service: 'Express',
        deliveryStatus: 'Đã giao hàng',
        printStatus: 'Đã in',
        reconciliationStatus: 'Chưa đối soát',
        shippingFeeToPartner: 45000,
        codAmount: 23800000,
        payer: 'Người nhận',
        createdAt: '2025-11-07 08:00',
        dispatchedAt: '2025-11-07 10:00',
        deliveredAt: '2025-11-08 09:30'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SHIPMENT000006'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('VC000006'),
        packagingSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PACKAGE000008'),
        orderSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ORDER000008'),
        orderId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000008'),
        trackingCode: 'BEST567890',
        carrier: 'Best Express',
        service: 'Tiết kiệm',
        deliveryStatus: 'Chờ lấy hàng',
        printStatus: 'Đã in',
        reconciliationStatus: 'Chưa đối soát',
        shippingFeeToPartner: 22000,
        codAmount: 4500000,
        payer: 'Người nhận',
        createdAt: '2025-11-10 07:30'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SHIPMENT000007'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('VC000007'),
        packagingSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PACKAGE000009'),
        orderSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ORDER000009'),
        orderId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000009'),
        trackingCode: 'NJV901234',
        carrier: 'Ninja Van',
        service: 'Standard',
        deliveryStatus: 'Đã giao hàng',
        printStatus: 'Đã in',
        reconciliationStatus: 'Đã đối soát',
        shippingFeeToPartner: 32000,
        codAmount: 15600000,
        payer: 'Người gửi',
        createdAt: '2025-11-05 11:00',
        dispatchedAt: '2025-11-05 16:00',
        deliveredAt: '2025-11-07 14:30'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SHIPMENT000008'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('VC000008'),
        packagingSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PACKAGE000010'),
        orderSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ORDER000010'),
        orderId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000010'),
        trackingCode: 'JT567891',
        carrier: 'J&T Express',
        service: 'Siêu tốc',
        deliveryStatus: 'Đang giao hàng',
        printStatus: 'Đã in',
        reconciliationStatus: 'Chưa đối soát',
        shippingFeeToPartner: 55000,
        codAmount: 31200000,
        payer: 'Người nhận',
        createdAt: '2025-11-10 14:00',
        dispatchedAt: '2025-11-10 16:30'
    }
];
// ========================================
// HELPER FUNCTIONS
// ========================================
let shipmentSystemIdCounter = 0;
let shipmentBusinessIdCounter = 0;
function initCounters(shipments) {
    shipmentSystemIdCounter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getMaxSystemIdCounter"])(shipments, SHIPMENT_SYSTEM_ID_PREFIX);
    shipmentBusinessIdCounter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getMaxBusinessIdCounter"])(shipments, SHIPMENT_BUSINESS_ID_PREFIX);
}
function getNextShipmentSystemId() {
    shipmentSystemIdCounter++;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateSystemId"])('shipments', shipmentSystemIdCounter);
}
function getNextShipmentBusinessId() {
    shipmentBusinessIdCounter++;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateBusinessId"])('shipments', shipmentBusinessIdCounter);
}
// Initialize counters
initCounters(initialData);
const useShipmentStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((set, get)=>({
        data: initialData,
        findById: (systemId)=>{
            return get().data.find((s)=>s.systemId === systemId);
        },
        findByPackagingSystemId: (packagingSystemId)=>{
            return get().data.find((s)=>s.packagingSystemId === packagingSystemId);
        },
        findByTrackingCode: (trackingCode)=>{
            return get().data.find((s)=>s.trackingCode === trackingCode);
        },
        createShipment: (data)=>{
            const newShipment = {
                systemId: getNextShipmentSystemId(),
                id: getNextShipmentBusinessId(),
                ...data
            };
            set((state)=>({
                    data: [
                        ...state.data,
                        newShipment
                    ]
                }));
            return newShipment;
        },
        updateShipment: (systemId, updates)=>{
            set((state)=>({
                    data: state.data.map((s)=>s.systemId === systemId ? {
                            ...s,
                            ...updates
                        } : s)
                }));
        },
        deleteShipment: (systemId)=>{
            set((state)=>({
                    data: state.data.filter((s)=>s.systemId !== systemId)
                }));
        },
        getNextSystemId: ()=>getNextShipmentSystemId(),
        getNextBusinessId: ()=>getNextShipmentBusinessId()
    }));
}),
"[project]/features/orders/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useOrderStore",
    ()=>useOrderStore
]);
// persist middleware removed - database is now source of truth
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/employees/store.ts [app-ssr] (ecmascript)");
// REMOVED: Voucher store no longer exists - using Payment/Receipt stores instead
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/products/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$combo$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/products/combo-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$stock$2d$history$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/stock-history/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/customers/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$receipt$2d$types$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/receipt-types/store.ts [app-ssr] (ecmascript)");
// REMOVED: import type { Voucher } from '../vouchers/types';
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$cashbook$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/cashbook/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$receipts$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/receipts/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$sales$2d$returns$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/sales-returns/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$helpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/finance/document-helpers.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$shipments$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/shipments/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$sales$2f$sales$2d$management$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/sales/sales-management-store.ts [app-ssr] (ecmascript)");
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
// ✅ Helper to get branch systemId
const getBranchId = (order)=>order.branchSystemId;
const deliveryStatusesBlockedForCancellation = [
    'Đang giao hàng',
    'Đã giao hàng',
    'Chờ giao lại'
];
const IN_STORE_PICKUP_PREFIX = 'INSTORE';
const PACKAGING_CODE_PREFIX = 'DG';
const PACKAGING_SYSTEM_ID_PREFIX = 'PACKAGE';
// ✅ Track packaging systemId counter globally
let packagingSystemIdCounter = 0;
// ✅ Initialize counter from all existing packagings across all orders
const initPackagingCounter = (orders)=>{
    const allPackagings = orders.flatMap((o)=>o.packagings || []);
    packagingSystemIdCounter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getMaxSystemIdCounter"])(allPackagings, PACKAGING_SYSTEM_ID_PREFIX);
};
// ✅ Generate next packaging systemId
const getNextPackagingSystemId = ()=>{
    packagingSystemIdCounter++;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateSystemId"])('packaging', packagingSystemIdCounter));
};
const getPackagingSuffixFromOrderId = (orderId)=>{
    if (!orderId) return '';
    const rawValue = `${orderId}`;
    const suffix = rawValue.replace(/^[A-Z-]+/, '');
    return suffix || rawValue;
};
// Count only active packagings (not cancelled) for numbering
const getActivePackagingCount = (packagings)=>{
    return packagings.filter((p)=>p.status !== 'Hủy đóng gói').length;
};
const buildPackagingBusinessId = (orderId, activeIndex, activeCount)=>{
    const suffix = getPackagingSuffixFromOrderId(orderId);
    const baseCode = `${PACKAGING_CODE_PREFIX}${suffix || '000000'}`;
    // Only add suffix if there are multiple active packagings
    if (activeCount > 1 && activeIndex > 0) {
        const paddedIndex = String(activeIndex + 1).padStart(2, '0');
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(`${baseCode}-${paddedIndex}`);
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(baseCode);
};
const getReturnedValueForOrder = (orderSystemId)=>{
    return __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$sales$2d$returns$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSalesReturnStore"].getState().data.filter((sr)=>sr.orderSystemId === orderSystemId).reduce((sum, sr)=>sum + sr.totalReturnValue, 0);
};
const calculateActualDebt = (order)=>{
    const totalReturnedValue = getReturnedValueForOrder(order.systemId);
    return Math.max(order.grandTotal - totalReturnedValue, 0);
};
const calculateTotalPaid = (payments)=>{
    return payments.reduce((sum, payment)=>sum + payment.amount, 0);
};
const getOrderOutstandingAmount = (order)=>{
    const actualDebt = calculateActualDebt(order);
    const totalPaid = calculateTotalPaid(order.payments ?? []);
    return Math.max(actualDebt - totalPaid, 0);
};
const applyPaymentToOrder = (order, payment)=>{
    const updatedPayments = [
        ...order.payments ?? [],
        payment
    ];
    const totalPaid = calculateTotalPaid(updatedPayments);
    const actualDebt = calculateActualDebt(order);
    let newPaymentStatus = 'Chưa thanh toán';
    if (totalPaid >= actualDebt) {
        newPaymentStatus = 'Thanh toán toàn bộ';
    } else if (totalPaid > 0) {
        newPaymentStatus = 'Thanh toán 1 phần';
    }
    const wasCompleted = order.status === 'Hoàn thành';
    let newStatus = order.status;
    let newCompletedDate = order.completedDate;
    if (newPaymentStatus === 'Thanh toán toàn bộ' && order.deliveryStatus === 'Đã giao hàng') {
        newStatus = 'Hoàn thành';
        newCompletedDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date());
        if (!wasCompleted) {
            const { incrementOrderStats } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCustomerStore"].getState();
            incrementOrderStats(order.customerSystemId, order.grandTotal);
        }
    }
    const { updateDebtTransactionPayment } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCustomerStore"].getState();
    updateDebtTransactionPayment(order.customerSystemId, order.id, payment.amount);
    return {
        ...order,
        payments: updatedPayments,
        paymentStatus: newPaymentStatus,
        status: newStatus,
        completedDate: newCompletedDate,
        paidAmount: totalPaid
    };
};
const shouldAutoAllocateReceipt = (receipt)=>{
    return receipt.status === 'completed' && receipt.affectsDebt && !!receipt.customerSystemId && !receipt.linkedOrderSystemId;
};
const getAllocatedAmount = (receipt)=>{
    return receipt.orderAllocations?.reduce((sum, allocation)=>sum + allocation.amount, 0) ?? 0;
};
const autoAllocateReceiptToOrders = (receipt)=>{
    if (!shouldAutoAllocateReceipt(receipt)) {
        return;
    }
    const remainingAmount = receipt.amount - getAllocatedAmount(receipt);
    if (remainingAmount <= 0) {
        return;
    }
    const candidateOrders = baseStore.getState().data.filter((order)=>order.customerSystemId === receipt.customerSystemId && order.status !== 'Đã hủy').map((order)=>({
            order,
            outstanding: getOrderOutstandingAmount(order)
        })).filter((entry)=>entry.outstanding > 0).sort((a, b)=>{
        const aTime = a.order.orderDate ? new Date(a.order.orderDate).getTime() : 0;
        const bTime = b.order.orderDate ? new Date(b.order.orderDate).getTime() : 0;
        return aTime - bTime;
    });
    if (!candidateOrders.length) {
        return;
    }
    let amountToDistribute = remainingAmount;
    const updatedOrders = new Map();
    const allocationEntries = [];
    for (const { order } of candidateOrders){
        if (amountToDistribute <= 0) {
            break;
        }
        const currentOrderState = updatedOrders.get(order.systemId) ?? order;
        const outstanding = getOrderOutstandingAmount(currentOrderState);
        if (outstanding <= 0) {
            continue;
        }
        const allocationAmount = Math.min(outstanding, amountToDistribute);
        if (allocationAmount <= 0) {
            continue;
        }
        const paymentEntry = {
            systemId: receipt.systemId,
            id: receipt.id,
            date: receipt.date,
            amount: allocationAmount,
            method: receipt.paymentMethodName,
            createdBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(receipt.createdBy),
            description: receipt.description ?? `Thanh toán từ phiếu thu ${receipt.id}`
        };
        const updatedOrder = applyPaymentToOrder(currentOrderState, paymentEntry);
        updatedOrders.set(order.systemId, updatedOrder);
        allocationEntries.push({
            orderSystemId: order.systemId,
            orderId: order.id,
            amount: allocationAmount
        });
        amountToDistribute -= allocationAmount;
    }
    if (!allocationEntries.length) {
        return;
    }
    baseStore.setState((state)=>{
        const data = state.data.map((order)=>updatedOrders.get(order.systemId) ?? order);
        return {
            data
        };
    });
    const receiptStore = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$receipts$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useReceiptStore"].getState();
    const latestReceipt = receiptStore.findById(receipt.systemId);
    if (!latestReceipt) {
        return;
    }
    receiptStore.update(receipt.systemId, {
        ...latestReceipt,
        orderAllocations: [
            ...latestReceipt.orderAllocations ?? [],
            ...allocationEntries
        ]
    });
};
const ensureOrderPackagingIdentifiers = (order)=>{
    if (!order.packagings || order.packagings.length === 0) {
        return null;
    }
    // Count only active packagings for proper numbering
    const activePackagings = order.packagings.filter((p)=>p.status !== 'Hủy đóng gói');
    const activeCount = activePackagings.length;
    let changed = false;
    let activeIndex = 0;
    const updatedPackagings = order.packagings.map((pkg, idx)=>{
        const isCancelled = pkg.status === 'Hủy đóng gói';
        const hasId = typeof pkg.id === 'string' && pkg.id.trim().length > 0;
        // ✅ Check for temp systemId or old format (PKG_)
        const hasTempOrOldSystemId = pkg.systemId?.startsWith('PKG_TEMP_') || pkg.systemId?.startsWith('PKG_');
        const hasValidSystemId = pkg.systemId?.startsWith(PACKAGING_SYSTEM_ID_PREFIX);
        const shouldFixTracking = pkg.deliveryMethod === 'Nhận tại cửa hàng' && pkg.trackingCode === `${IN_STORE_PICKUP_PREFIX}-`;
        // For cancelled packagings, keep existing ID
        if (isCancelled) {
            if (!hasId || hasTempOrOldSystemId && !hasValidSystemId) {
                // Still need to assign an ID if missing
                const nextPkg = {
                    ...pkg
                };
                if (!hasId) {
                    nextPkg.id = buildPackagingBusinessId(order.id, 0, 1);
                }
                if (hasTempOrOldSystemId && !hasValidSystemId) {
                    nextPkg.systemId = getNextPackagingSystemId();
                }
                changed = true;
                return nextPkg;
            }
            return pkg;
        }
        // For active packagings, use activeIndex for numbering
        const currentActiveIndex = activeIndex;
        activeIndex++;
        if (hasId && !shouldFixTracking && hasValidSystemId) {
            return pkg;
        }
        const nextPkg = {
            ...pkg
        };
        if (!hasId) {
            nextPkg.id = buildPackagingBusinessId(order.id, currentActiveIndex, activeCount);
            changed = true;
        }
        // ✅ Fix temporary/old systemId to proper format PACKAGE000001
        if (hasTempOrOldSystemId && !hasValidSystemId) {
            nextPkg.systemId = getNextPackagingSystemId();
            changed = true;
        }
        if (shouldFixTracking) {
            const resolvedId = nextPkg.id ?? buildPackagingBusinessId(order.id, currentActiveIndex, activeCount);
            nextPkg.trackingCode = `${IN_STORE_PICKUP_PREFIX}-${resolvedId}`;
            changed = true;
        }
        return nextPkg;
    });
    return changed ? {
        ...order,
        packagings: updatedPackagings
    } : null;
};
const ensureCancellationAllowed = (order, actionLabel)=>{
    if (!order) return false;
    const { allowCancelAfterExport } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$sales$2f$sales$2d$management$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSalesManagementSettingsStore"].getState();
    if (allowCancelAfterExport) {
        return true;
    }
    const hasLeftWarehouse = order.stockOutStatus === 'Xuất kho toàn bộ' || deliveryStatusesBlockedForCancellation.includes(order.deliveryStatus);
    if (hasLeftWarehouse) {
        alert(`Không thể ${actionLabel} vì đơn hàng đã xuất kho. Vào Cấu hình bán hàng -> Thiết lập quản lý bán hàng và bật "Cho phép hủy đơn hàng sau khi xuất kho".`);
        return false;
    }
    return true;
};
const processLineItemStock = (lineItem, branchSystemId, operation, orderQuantity = 1 // Số lượng đặt của line item
)=>{
    const { findById: findProductById, commitStock, uncommitStock, dispatchStock, completeDelivery, returnStockFromTransit } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState();
    const product = findProductById((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(lineItem.productSystemId));
    // Xác định danh sách items cần xử lý (SP con nếu combo, hoặc chính SP nếu thường)
    const itemsToProcess = [];
    if (product && (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$combo$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isComboProduct"])(product) && product.comboItems) {
        // Combo: xử lý tất cả SP con
        product.comboItems.forEach((comboItem)=>{
            itemsToProcess.push({
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(comboItem.productSystemId),
                quantity: orderQuantity * comboItem.quantity
            });
        });
    } else {
        // Sản phẩm thường
        itemsToProcess.push({
            productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(lineItem.productSystemId),
            quantity: orderQuantity
        });
    }
    // Thực hiện operation cho từng item
    itemsToProcess.forEach((item)=>{
        const branchId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(branchSystemId);
        switch(operation){
            case 'commit':
                commitStock(item.productSystemId, branchId, item.quantity);
                break;
            case 'uncommit':
                uncommitStock(item.productSystemId, branchId, item.quantity);
                break;
            case 'dispatch':
                dispatchStock(item.productSystemId, branchId, item.quantity);
                break;
            case 'complete':
                completeDelivery(item.productSystemId, branchId, item.quantity);
                break;
            case 'return':
                returnStockFromTransit(item.productSystemId, branchId, item.quantity);
                break;
        }
    });
    return itemsToProcess; // Return để có thể dùng cho stock history
};
/**
 * ✅ Helper để lấy danh sách stock items từ line items (mở rộng combo thành SP con)
 * Dùng trong webhook GHTK hoặc các thao tác batch
 */ const getComboStockItems = (lineItems)=>{
    const { findById: findProductById } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState();
    const stockItems = [];
    lineItems.forEach((item)=>{
        const product = findProductById((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(item.productSystemId));
        if (product && (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$combo$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isComboProduct"])(product) && product.comboItems) {
            // Combo: mở rộng thành SP con
            product.comboItems.forEach((comboItem)=>{
                stockItems.push({
                    productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(comboItem.productSystemId),
                    quantity: item.quantity * comboItem.quantity
                });
            });
        } else {
            // Sản phẩm thường
            stockItems.push({
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(item.productSystemId),
                quantity: item.quantity
            });
        }
    });
    return stockItems;
};
const createOrderRefundVoucher = (order, amount, employeeId)=>{
    const lastPositivePayment = [
        ...order.payments ?? []
    ].reverse().find((p)=>p.amount > 0);
    const { document, error } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$helpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createPaymentDocument"])({
        amount,
        description: `Hoàn tiền do hủy đơn ${order.id}`,
        recipientName: order.customerName,
        recipientSystemId: order.customerSystemId,
        customerSystemId: order.customerSystemId,
        customerName: order.customerName,
        branchSystemId: order.branchSystemId,
        branchName: order.branchName,
        createdBy: employeeId,
        paymentMethodName: lastPositivePayment?.method || 'Tiền mặt',
        paymentTypeName: 'Hoàn tiền khách hàng',
        originalDocumentId: order.id,
        linkedOrderSystemId: order.systemId,
        affectsDebt: true,
        category: 'other'
    });
    if (!document) {
        console.error('[cancelOrder] Không thể tạo phiếu chi hoàn tiền', error);
        return null;
    }
    return document;
};
// REMOVED: initialDataOmit transformation - database is source of truth
const initialData = [];
const baseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createCrudStore"])([], 'orders', {
    businessIdField: 'id',
    apiEndpoint: '/api/orders',
    getCurrentUser: ()=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserSystemId"])());
    }
});
// ✅ API Sync helpers
const API_ENDPOINT = '/api/orders';
const syncToApi = {
    create: async (order)=>{
        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(order)
            });
            if (!response.ok) console.warn('[Order API] Create sync failed');
            else console.log('[Order API] Created:', order.systemId);
        } catch (e) {
            console.warn('[Order API] Create sync error:', e);
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
            if (!response.ok) console.warn('[Order API] Update sync failed');
            else console.log('[Order API] Updated:', systemId);
        } catch (e) {
            console.warn('[Order API] Update sync error:', e);
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
            if (!response.ok) console.warn('[Order API] Delete sync failed');
            else console.log('[Order API] Deleted:', systemId);
        } catch (e) {
            console.warn('[Order API] Delete sync error:', e);
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
            if (!response.ok) console.warn('[Order API] Restore sync failed');
            else console.log('[Order API] Restored:', systemId);
        } catch (e) {
            console.warn('[Order API] Restore sync error:', e);
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
// ✅ MIGRATION: Ensure all orders have paidAmount field (backward compatibility)
baseStore.setState((state)=>({
        data: state.data.map((order)=>({
                ...order,
                paidAmount: order.paidAmount ?? 0
            }))
    }));
// ✅ MIGRATION: Merge seed data - add new orders from initialData if not exist in persisted store
baseStore.setState((state)=>{
    const existingIds = new Set(state.data.map((o)=>o.systemId));
    const newOrders = initialData.filter((o)=>!existingIds.has(o.systemId));
    if (newOrders.length > 0) {
        return {
            data: [
                ...state.data,
                ...newOrders
            ]
        };
    }
    return state;
});
// ✅ MIGRATION: Fix order status - orders with full payment and delivery should be "Hoàn thành"
baseStore.setState((state)=>({
        data: state.data.map((order)=>{
            // If order is already completed or cancelled, skip
            if (order.status === 'Hoàn thành' || order.status === 'Đã hủy') {
                return order;
            }
            // Check if all active packagings are delivered
            const activePackagings = order.packagings.filter((p)=>p.status !== 'Hủy đóng gói');
            const isAllDelivered = activePackagings.length > 0 && activePackagings.every((p)=>p.deliveryStatus === 'Đã giao hàng');
            // If fully paid and fully delivered, update status to "Hoàn thành"
            if (order.paymentStatus === 'Thanh toán toàn bộ' && (isAllDelivered || order.deliveryStatus === 'Đã giao hàng')) {
                return {
                    ...order,
                    status: 'Hoàn thành',
                    completedDate: order.completedDate || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date())
                };
            }
            return order;
        })
    }));
const originalAddWithStock = baseStore.getState().add;
baseStore.setState({
    add: (item)=>{
        const { commitStock, findById: findProductById } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState();
        const userInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserInfo"])();
        const newItem = originalAddWithStock(item);
        if (newItem) {
            const hydratedPackagings = ensureOrderPackagingIdentifiers(newItem);
            if (hydratedPackagings) {
                Object.assign(newItem, hydratedPackagings);
                baseStore.setState((state)=>({
                        data: state.data.map((order)=>order.systemId === hydratedPackagings.systemId ? hydratedPackagings : order)
                    }));
            }
            newItem.lineItems.forEach((li)=>{
                const product = findProductById((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(li.productSystemId));
                // ✅ Xử lý combo: commit stock của SP con thay vì combo
                if (product && (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$combo$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isComboProduct"])(product) && product.comboItems) {
                    product.comboItems.forEach((comboItem)=>{
                        // Commit stock = số lượng combo × số lượng SP con trong combo
                        const totalQuantity = li.quantity * comboItem.quantity;
                        commitStock((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(comboItem.productSystemId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(newItem.branchSystemId), totalQuantity);
                    });
                } else {
                    // Sản phẩm thường: commit stock như bình thường
                    commitStock((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(li.productSystemId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(newItem.branchSystemId), li.quantity);
                }
            });
            // ✅ Cập nhật lastPurchaseDate khi tạo đơn mới (để SLA/churn risk hoạt động đúng)
            if (newItem.customerSystemId) {
                const { update: updateCustomer, findById: findCustomer } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCustomerStore"].getState();
                const customer = findCustomer(newItem.customerSystemId);
                if (customer) {
                    updateCustomer(newItem.customerSystemId, {
                        lastPurchaseDate: new Date().toISOString().split('T')[0]
                    });
                }
            }
            // ✅ Add activity history entry
            const historyEntry = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createCreatedEntry"])(userInfo, `${userInfo.name} đã tạo đơn hàng ${newItem.id} cho khách hàng ${newItem.customerName} (Tổng: ${newItem.grandTotal.toLocaleString('vi-VN')}đ)`);
            baseStore.setState((state)=>({
                    data: state.data.map((order)=>order.systemId === newItem.systemId ? {
                            ...order,
                            activityHistory: [
                                historyEntry
                            ]
                        } : order)
                }));
        }
        return newItem;
    }
});
const backfillPackagingIdentifiers = ()=>{
    const currentState = baseStore.getState();
    let changed = false;
    const updatedData = currentState.data.map((order)=>{
        const updatedOrder = ensureOrderPackagingIdentifiers(order);
        if (updatedOrder) {
            changed = true;
            return updatedOrder;
        }
        return order;
    });
    if (changed) {
        baseStore.setState({
            data: updatedData
        });
    }
};
backfillPackagingIdentifiers();
const augmentedMethods = {
    cancelOrder: (systemId, employeeId, options)=>{
        const { reason, restock = true } = options ?? {};
        const currentOrder = baseStore.getState().data.find((o)=>o.systemId === systemId);
        if (!ensureCancellationAllowed(currentOrder, 'hủy đơn hàng')) {
            return;
        }
        baseStore.setState((state)=>{
            const orderToCancel = state.data.find((o)=>o.systemId === systemId);
            if (!orderToCancel || orderToCancel.status === 'Đã hủy') {
                return state;
            }
            const employee = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmployeeStore"].getState().findById(employeeId);
            const now = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date());
            const cancellationReason = reason && reason.trim().length > 0 ? reason.trim() : orderToCancel.cancellationReason || `Hủy bởi ${employee?.fullName || 'Hệ thống'}`;
            // ✅ Uncommit stock (hỗ trợ combo)
            if (restock) {
                orderToCancel.lineItems.forEach((item)=>{
                    processLineItemStock(item, orderToCancel.branchSystemId, 'uncommit', item.quantity);
                });
            }
            const hasDispatchedStock = orderToCancel.stockOutStatus === 'Xuất kho toàn bộ' || [
                'Chờ lấy hàng',
                'Đang giao hàng',
                'Đã giao hàng',
                'Chờ giao lại'
            ].includes(orderToCancel.deliveryStatus);
            // ✅ Return stock from transit (hỗ trợ combo)
            if (restock && hasDispatchedStock) {
                orderToCancel.lineItems.forEach((item)=>{
                    processLineItemStock(item, orderToCancel.branchSystemId, 'return', item.quantity);
                });
            }
            const existingPayments = orderToCancel.payments ?? [];
            const netCollected = existingPayments.reduce((sum, payment)=>sum + payment.amount, 0);
            let refundPaymentEntry = null;
            const refundAmount = netCollected > 0 ? netCollected : 0;
            if (refundAmount > 0) {
                const refundVoucher = createOrderRefundVoucher(orderToCancel, refundAmount, employeeId);
                if (!refundVoucher) {
                    alert('Không thể tạo phiếu chi hoàn tiền. Vui lòng kiểm tra cấu hình tài chính trước khi hủy đơn.');
                    return state;
                }
                refundPaymentEntry = {
                    systemId: refundVoucher.systemId,
                    id: refundVoucher.id,
                    date: refundVoucher.date,
                    amount: -refundAmount,
                    method: refundVoucher.paymentMethodName,
                    createdBy: employeeId,
                    description: `Hoàn tiền khi hủy đơn ${orderToCancel.id}`
                };
            }
            const updatedPayments = refundPaymentEntry ? [
                ...existingPayments,
                refundPaymentEntry
            ] : existingPayments;
            const updatedPaidAmount = Math.max(0, (orderToCancel.paidAmount ?? 0) - refundAmount);
            const updatedPackagings = orderToCancel.packagings.map((pkg)=>{
                if (pkg.status === 'Hủy đóng gói' && pkg.deliveryStatus === 'Đã hủy') {
                    return pkg;
                }
                return {
                    ...pkg,
                    status: 'Hủy đóng gói',
                    deliveryStatus: 'Đã hủy',
                    cancelDate: now,
                    cancelReason: pkg.cancelReason ?? cancellationReason,
                    cancelingEmployeeId: employeeId,
                    cancelingEmployeeName: employee?.fullName || 'Hệ thống'
                };
            });
            const updatedOrder = {
                ...orderToCancel,
                status: 'Đã hủy',
                cancelledDate: now,
                cancellationReason,
                deliveryStatus: 'Đã hủy',
                stockOutStatus: restock ? 'Chưa xuất kho' : orderToCancel.stockOutStatus,
                payments: updatedPayments,
                paidAmount: updatedPaidAmount,
                paymentStatus: refundPaymentEntry ? 'Chưa thanh toán' : orderToCancel.paymentStatus,
                packagings: updatedPackagings,
                cancellationMetadata: {
                    restockItems: restock,
                    notifyCustomer: false,
                    emailNotifiedAt: undefined
                },
                activityHistory: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["appendHistoryEntry"])(orderToCancel.activityHistory, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHistoryEntry"])('cancelled', (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserInfo"])(), `${employee?.fullName || 'Hệ thống'} đã hủy đơn hàng. Lý do: ${cancellationReason}${refundAmount > 0 ? `. Hoàn tiền: ${refundAmount.toLocaleString('vi-VN')}đ` : ''}`))
            };
            // ✅ Remove debt transaction from customer
            __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCustomerStore"].getState().removeDebtTransaction(orderToCancel.customerSystemId, orderToCancel.id);
            return {
                data: state.data.map((o)=>o.systemId === systemId ? updatedOrder : o)
            };
        });
    },
    addPayment: (orderSystemId, paymentData, employeeId)=>{
        // --- Side effects must happen outside setState ---
        const order = baseStore.getState().findById(orderSystemId);
        const employee = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmployeeStore"].getState().findById(employeeId);
        if (!order || !employee) {
            console.error("Order or employee not found for payment.");
            return;
        }
        const { document: createdReceipt, error } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$helpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createReceiptDocument"])({
            amount: paymentData.amount,
            description: `Thanh toán cho đơn hàng ${order.id}`,
            customerName: order.customerName,
            customerSystemId: order.customerSystemId,
            branchSystemId: order.branchSystemId,
            branchName: order.branchName,
            createdBy: employeeId,
            paymentMethodName: paymentData.method,
            receiptTypeName: 'Thanh toán cho đơn hàng',
            originalDocumentId: order.id,
            linkedOrderSystemId: order.systemId,
            affectsDebt: true
        });
        if (!createdReceipt) {
            console.error('Failed to create receipt', error);
            alert('Không thể tạo phiếu thu cho đơn hàng. Vui lòng kiểm tra cấu hình chứng từ.');
            return;
        }
        // 2. Now, update the order state with the created receipt info
        baseStore.setState((state)=>{
            const orderIndex = state.data.findIndex((o)=>o.systemId === orderSystemId);
            if (orderIndex === -1) return state;
            const orderToUpdate = state.data[orderIndex];
            const newPayment = {
                systemId: createdReceipt.systemId,
                id: createdReceipt.id,
                date: createdReceipt.date,
                amount: createdReceipt.amount,
                method: createdReceipt.paymentMethodName,
                createdBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(createdReceipt.createdBy),
                description: createdReceipt.description
            };
            const updatedOrder = applyPaymentToOrder(orderToUpdate, newPayment);
            // ✅ Add activity history entry
            updatedOrder.activityHistory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["appendHistoryEntry"])(orderToUpdate.activityHistory, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHistoryEntry"])('payment_made', (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserInfo"])(), `${employee?.fullName || 'Nhân viên'} đã thanh toán ${paymentData.amount.toLocaleString('vi-VN')}đ bằng ${paymentData.method}`));
            const newData = [
                ...state.data
            ];
            newData[orderIndex] = updatedOrder;
            return {
                data: newData
            };
        });
    },
    requestPackaging: (orderSystemId, employeeId, assignedEmployeeId)=>{
        baseStore.setState((state)=>{
            const order = state.data.find((o)=>o.systemId === orderSystemId);
            if (!order) return state;
            const employee = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmployeeStore"].getState().findById(employeeId);
            const assignedEmployee = assignedEmployeeId ? __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmployeeStore"].getState().findById(assignedEmployeeId) : null;
            // Count only active packagings for proper numbering
            const activePackagings = order.packagings.filter((p)=>p.status !== 'Hủy đóng gói');
            const activeCountAfterInsert = activePackagings.length + 1;
            const newActiveIndex = activePackagings.length; // This will be the index in active packagings
            const newPackaging = {
                systemId: getNextPackagingSystemId(),
                id: buildPackagingBusinessId(order.id, newActiveIndex, activeCountAfterInsert),
                requestDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date()),
                requestingEmployeeId: employeeId,
                requestingEmployeeName: employee?.fullName || 'N/A',
                assignedEmployeeId,
                assignedEmployeeName: assignedEmployee?.fullName,
                status: 'Chờ đóng gói',
                printStatus: 'Chưa in'
            };
            const updatedOrder = {
                ...order,
                packagings: [
                    ...order.packagings,
                    newPackaging
                ],
                deliveryStatus: 'Chờ đóng gói'
            };
            return {
                data: state.data.map((o)=>o.systemId === orderSystemId ? updatedOrder : o)
            };
        });
    },
    confirmPackaging: (orderSystemId, packagingSystemId, employeeId)=>{
        // ✅ Check negative packing setting
        const { allowNegativePacking } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$sales$2f$sales$2d$management$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSalesManagementSettingsStore"].getState();
        if (!allowNegativePacking) {
            const order = baseStore.getState().data.find((o)=>o.systemId === orderSystemId);
            if (order) {
                const { findById: findProductById } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState();
                for (const item of order.lineItems){
                    const product = findProductById((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(item.productSystemId));
                    if (product && (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$combo$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isComboProduct"])(product) && product.comboItems) {
                        for (const comboItem of product.comboItems){
                            const childProduct = findProductById((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(comboItem.productSystemId));
                            const requiredQty = item.quantity * comboItem.quantity;
                            const currentStock = childProduct?.inventoryByBranch?.[order.branchSystemId] || 0;
                            if (currentStock < requiredQty) {
                                alert(`Không thể đóng gói: Sản phẩm "${childProduct?.name}" không đủ tồn kho (Có: ${currentStock}, Cần: ${requiredQty})`);
                                return baseStore.getState();
                            }
                        }
                    } else {
                        const currentStock = product?.inventoryByBranch?.[order.branchSystemId] || 0;
                        if (currentStock < item.quantity) {
                            alert(`Không thể đóng gói: Sản phẩm "${item.productName}" không đủ tồn kho (Có: ${currentStock}, Cần: ${item.quantity})`);
                            return baseStore.getState();
                        }
                    }
                }
            }
        }
        baseStore.setState((state)=>{
            const dataCopy = [
                ...state.data
            ];
            const orderIndex = dataCopy.findIndex((o)=>o.systemId === orderSystemId);
            if (orderIndex === -1) return state;
            const orderCopy = {
                ...dataCopy[orderIndex]
            };
            const packagingIndex = orderCopy.packagings.findIndex((p)=>p.systemId === packagingSystemId);
            if (packagingIndex === -1) return state;
            const employee = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmployeeStore"].getState().findById(employeeId);
            const packagingsCopy = [
                ...orderCopy.packagings
            ];
            packagingsCopy[packagingIndex] = {
                ...packagingsCopy[packagingIndex],
                status: 'Đã đóng gói',
                confirmDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date()),
                confirmingEmployeeId: employeeId,
                confirmingEmployeeName: employee?.fullName || 'N/A'
            };
            orderCopy.packagings = packagingsCopy;
            orderCopy.deliveryStatus = 'Đã đóng gói';
            dataCopy[orderIndex] = orderCopy;
            return {
                data: dataCopy
            };
        });
    },
    cancelPackagingRequest: (orderSystemId, packagingSystemId, employeeId, reason)=>{
        baseStore.setState((state)=>{
            const order = state.data.find((o)=>o.systemId === orderSystemId);
            if (!order) return state;
            const employee = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmployeeStore"].getState().findById(employeeId);
            const updatedPackagings = order.packagings.map((p)=>{
                if (p.systemId === packagingSystemId) {
                    return {
                        ...p,
                        status: 'Hủy đóng gói',
                        cancelDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date()),
                        cancelingEmployeeId: employeeId,
                        cancelingEmployeeName: employee?.fullName || 'N/A',
                        cancelReason: reason
                    };
                }
                return p;
            });
            const isAnyActivePackaging = updatedPackagings.some((p)=>p.status !== 'Hủy đóng gói');
            const updatedOrder = {
                ...order,
                packagings: updatedPackagings,
                deliveryStatus: isAnyActivePackaging ? order.deliveryStatus : 'Chờ đóng gói'
            };
            return {
                data: state.data.map((o)=>o.systemId === orderSystemId ? updatedOrder : o)
            };
        });
    },
    processInStorePickup: (orderSystemId, packagingSystemId)=>{
        baseStore.setState((state)=>{
            const order = state.data.find((o)=>o.systemId === orderSystemId);
            if (!order) return state;
            const totalCount = order.packagings.length;
            const updatedPackagings = order.packagings.map((p, index)=>{
                if (p.systemId === packagingSystemId) {
                    const hasId = typeof p.id === 'string' && p.id.trim().length > 0;
                    const resolvedId = hasId ? p.id : buildPackagingBusinessId(order.id, index, totalCount);
                    return {
                        ...p,
                        id: resolvedId,
                        deliveryMethod: 'Nhận tại cửa hàng',
                        deliveryStatus: 'Đã đóng gói'
                    };
                }
                return p;
            });
            const updatedOrder = {
                ...order,
                packagings: updatedPackagings,
                deliveryStatus: 'Đã đóng gói'
            };
            return {
                data: state.data.map((o)=>o.systemId === orderSystemId ? updatedOrder : o)
            };
        });
    },
    confirmInStorePickup: (orderSystemId, packagingSystemId, employeeId)=>{
        console.log('🟢 [confirmInStorePickup] Called with:', {
            orderSystemId,
            packagingSystemId,
            employeeId
        });
        // ✅ Check negative stock out setting
        const { allowNegativeStockOut } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$sales$2f$sales$2d$management$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSalesManagementSettingsStore"].getState();
        if (!allowNegativeStockOut) {
            const order = baseStore.getState().data.find((o)=>o.systemId === orderSystemId);
            if (order) {
                const { findById: findProductById } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState();
                for (const item of order.lineItems){
                    const product = findProductById((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(item.productSystemId));
                    if (product && (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$combo$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isComboProduct"])(product) && product.comboItems) {
                        for (const comboItem of product.comboItems){
                            const childProduct = findProductById((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(comboItem.productSystemId));
                            const requiredQty = item.quantity * comboItem.quantity;
                            const currentStock = childProduct?.inventoryByBranch?.[order.branchSystemId] || 0;
                            if (currentStock < requiredQty) {
                                alert(`Không thể xuất kho: Sản phẩm "${childProduct?.name}" không đủ tồn kho (Có: ${currentStock}, Cần: ${requiredQty})`);
                                return baseStore.getState();
                            }
                        }
                    } else {
                        const currentStock = product?.inventoryByBranch?.[order.branchSystemId] || 0;
                        if (currentStock < item.quantity) {
                            alert(`Không thể xuất kho: Sản phẩm "${item.productName}" không đủ tồn kho (Có: ${currentStock}, Cần: ${item.quantity})`);
                            return baseStore.getState();
                        }
                    }
                }
            }
        }
        baseStore.setState((state)=>{
            const order = state.data.find((o)=>o.systemId === orderSystemId);
            if (!order) {
                console.error('❌ [confirmInStorePickup] Order not found:', orderSystemId);
                return state;
            }
            console.log('📋 [confirmInStorePickup] Order found:', order.id);
            console.log('📋 [confirmInStorePickup] Line items:', order.lineItems.length);
            // Stock logic
            const { addEntry: addStockHistory } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$stock$2d$history$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStockHistoryStore"].getState();
            const employeeData = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmployeeStore"].getState().findById(employeeId);
            const now = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date());
            order.lineItems.forEach((item, index)=>{
                console.log(`📦 [confirmInStorePickup] Dispatching item ${index + 1}:`, {
                    productSystemId: item.productSystemId,
                    productName: item.productName,
                    quantity: item.quantity,
                    branchSystemId: getBranchId(order)
                });
                // ✅ Dispatch stock (hỗ trợ combo - sẽ dispatch SP con)
                const processedItems = processLineItemStock(item, getBranchId(order), 'dispatch', item.quantity);
                // ✅ Add stock history entry for each processed item (SP con nếu combo)
                processedItems.forEach((processedItem)=>{
                    const product = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState().findById(processedItem.productSystemId);
                    const currentStock = product?.inventoryByBranch?.[getBranchId(order)] || 0;
                    addStockHistory({
                        date: now,
                        productId: processedItem.productSystemId,
                        action: 'Xuất kho (Đơn hàng)',
                        quantityChange: -processedItem.quantity,
                        newStockLevel: currentStock,
                        documentId: order.id,
                        branchSystemId: getBranchId(order),
                        branch: order.branchName,
                        employeeName: employeeData?.fullName || 'Hệ thống'
                    });
                });
            });
            // Status update logic - will be updated with trackingCode after shipment creation
            let updatedPackagings = order.packagings.map((p)=>{
                if (p.systemId === packagingSystemId) {
                    return {
                        ...p,
                        deliveryStatus: 'Đã giao hàng',
                        deliveredDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date())
                    };
                }
                return p;
            });
            const isAllDelivered = updatedPackagings.every((p)=>p.status === 'Hủy đóng gói' || p.deliveryStatus === 'Đã giao hàng');
            let newStatus = order.status === 'Đặt hàng' ? 'Đang giao dịch' : order.status;
            let newCompletedDate = order.completedDate;
            if (isAllDelivered && order.paymentStatus === 'Thanh toán toàn bộ') {
                newStatus = 'Hoàn thành';
                newCompletedDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date());
            }
            const employee = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmployeeStore"].getState().findById(employeeId);
            // ✅ Create shipment record for INSTORE pickup
            const packaging = order.packagings.find((p)=>p.systemId === packagingSystemId);
            let newShipment = null;
            if (packaging) {
                const { createShipment, updateShipment } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$shipments$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useShipmentStore"].getState();
                newShipment = createShipment({
                    packagingSystemId: packagingSystemId,
                    orderSystemId: orderSystemId,
                    orderId: order.id,
                    trackingCode: '',
                    carrier: 'Nhận tại cửa hàng',
                    service: 'Nhận tại cửa hàng',
                    deliveryStatus: 'Đã giao hàng',
                    printStatus: 'Chưa in',
                    reconciliationStatus: 'Chưa đối soát',
                    shippingFeeToPartner: 0,
                    codAmount: 0,
                    payer: 'Người gửi',
                    createdAt: now,
                    dispatchedAt: now,
                    deliveredAt: now
                });
                // Update shipment trackingCode to use its own business ID
                if (newShipment) {
                    updateShipment(newShipment.systemId, {
                        trackingCode: newShipment.id
                    });
                    // Update packaging with shipment trackingCode
                    updatedPackagings = updatedPackagings.map((p)=>{
                        if (p.systemId === packagingSystemId) {
                            return {
                                ...p,
                                trackingCode: newShipment.id
                            };
                        }
                        return p;
                    });
                }
                console.log('✅ [confirmInStorePickup] Shipment created:', newShipment?.id);
            }
            const updatedOrder = {
                ...order,
                packagings: updatedPackagings,
                deliveryStatus: 'Đã giao hàng',
                status: newStatus,
                completedDate: newCompletedDate,
                stockOutStatus: 'Xuất kho toàn bộ',
                dispatchedDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date()),
                dispatchedByEmployeeId: employeeId,
                dispatchedByEmployeeName: employee?.fullName
            };
            console.log('✅ [confirmInStorePickup] Stock dispatched successfully');
            return {
                data: state.data.map((o)=>o.systemId === orderSystemId ? updatedOrder : o)
            };
        });
    },
    confirmPartnerShipment: async (orderSystemId, packagingSystemId, shipmentData)=>{
        try {
            const order = baseStore.getState().data.find((o)=>o.systemId === orderSystemId);
            if (!order) {
                return {
                    success: false,
                    message: 'Không tìm thấy đơn hàng'
                };
            }
            // ✅ Check negative packing setting (covers creating shipment)
            const { allowNegativePacking } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$sales$2f$sales$2d$management$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSalesManagementSettingsStore"].getState();
            if (!allowNegativePacking) {
                const { findById: findProductById } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState();
                for (const item of order.lineItems){
                    const product = findProductById((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(item.productSystemId));
                    if (product && (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$combo$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isComboProduct"])(product) && product.comboItems) {
                        for (const comboItem of product.comboItems){
                            const childProduct = findProductById((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(comboItem.productSystemId));
                            const requiredQty = item.quantity * comboItem.quantity;
                            const currentStock = childProduct?.inventoryByBranch?.[order.branchSystemId] || 0;
                            if (currentStock < requiredQty) {
                                return {
                                    success: false,
                                    message: `Không thể tạo vận đơn: Sản phẩm "${childProduct?.name}" không đủ tồn kho`
                                };
                            }
                        }
                    } else {
                        const currentStock = product?.inventoryByBranch?.[order.branchSystemId] || 0;
                        if (currentStock < item.quantity) {
                            return {
                                success: false,
                                message: `Không thể tạo vận đơn: Sản phẩm "${item.productName}" không đủ tồn kho`
                            };
                        }
                    }
                }
            }
            // ✅ Get GHTK preview params from window (set by ShippingIntegration)
            const ghtkParams = window.__ghtkPreviewParams;
            if (!ghtkParams) {
                return {
                    success: false,
                    message: 'Thiếu thông tin vận chuyển. Vui lòng chọn dịch vụ vận chuyển.'
                };
            }
            // ✅ Import GHTK service dynamically
            const { GHTKService } = await __turbopack_context__.A("[project]/features/settings/shipping/integrations/ghtk-service.ts [app-ssr] (ecmascript, async loader)");
            const { getGHTKCredentials } = await __turbopack_context__.A("[project]/lib/utils/get-shipping-credentials.ts [app-ssr] (ecmascript, async loader)");
            const { apiToken, partnerCode } = getGHTKCredentials();
            const ghtkService = new GHTKService(apiToken, partnerCode);
            console.log('📤 [confirmPartnerShipment] Calling GHTK API with params:', ghtkParams);
            // ✅ Call real GHTK API
            const result = await ghtkService.createOrder(ghtkParams);
            if (!result.success || !result.order) {
                throw new Error(result.message || 'Không thể tạo đơn vận chuyển');
            }
            // ✅ Update order with real tracking code from GHTK
            const trackingCode = result.order.label;
            const ghtkTrackingId = result.order.tracking_id;
            const estimatedPickTime = result.order.estimated_pick_time;
            const estimatedDeliverTime = result.order.estimated_deliver_time;
            baseStore.setState((state)=>{
                const updatedPackagings = order.packagings.map((p)=>{
                    if (p.systemId === packagingSystemId) {
                        return {
                            ...p,
                            deliveryMethod: 'Dịch vụ giao hàng',
                            deliveryStatus: 'Chờ lấy hàng',
                            carrier: 'GHTK',
                            service: result.order?.fee ? `${result.order.fee}đ` : 'Standard',
                            trackingCode: trackingCode,
                            shippingFeeToPartner: parseInt(result.order?.fee || '0') || 0,
                            codAmount: ghtkParams.pick_money || 0,
                            payer: ghtkParams.is_freeship === 1 ? 'Người gửi' : 'Người nhận',
                            noteToShipper: ghtkParams.note || '',
                            weight: ghtkParams.weight,
                            dimensions: `${ghtkParams.products?.[0]?.length || 10}×${ghtkParams.products?.[0]?.width || 10}×${ghtkParams.products?.[0]?.height || 10}`,
                            // ✅ Store GHTK specific data
                            ghtkTrackingId: String(ghtkTrackingId),
                            estimatedPickTime: estimatedPickTime,
                            estimatedDeliverTime: estimatedDeliverTime
                        };
                    }
                    return p;
                });
                const updatedOrder = {
                    ...order,
                    packagings: updatedPackagings,
                    deliveryStatus: 'Chờ lấy hàng',
                    status: 'Đang giao dịch'
                };
                return {
                    data: state.data.map((o)=>o.systemId === orderSystemId ? updatedOrder : o)
                };
            });
            console.log('✅ [confirmPartnerShipment] GHTK order created successfully:', {
                trackingCode,
                ghtkTrackingId,
                estimatedPickTime,
                estimatedDeliverTime
            });
            return {
                success: true,
                message: `Tạo vận đơn thành công! Mã vận đơn: ${trackingCode}`
            };
        } catch (error) {
            console.error('❌ [confirmPartnerShipment] Error:', error);
            let errorMessage = 'Vui lòng thử lại';
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            return {
                success: false,
                message: `Lỗi tạo đơn vận chuyển: ${errorMessage}`
            };
        }
    },
    dispatchFromWarehouse: (orderSystemId, packagingSystemId, employeeId)=>{
        // ✅ Check negative stock out setting
        const { allowNegativeStockOut } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$sales$2f$sales$2d$management$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSalesManagementSettingsStore"].getState();
        if (!allowNegativeStockOut) {
            const order = baseStore.getState().data.find((o)=>o.systemId === orderSystemId);
            if (order) {
                const { findById: findProductById } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState();
                for (const item of order.lineItems){
                    const product = findProductById((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(item.productSystemId));
                    if (product && (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$combo$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isComboProduct"])(product) && product.comboItems) {
                        for (const comboItem of product.comboItems){
                            const childProduct = findProductById((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(comboItem.productSystemId));
                            const requiredQty = item.quantity * comboItem.quantity;
                            const currentStock = childProduct?.inventoryByBranch?.[order.branchSystemId] || 0;
                            if (currentStock < requiredQty) {
                                alert(`Không thể xuất kho: Sản phẩm "${childProduct?.name}" không đủ tồn kho (Có: ${currentStock}, Cần: ${requiredQty})`);
                                return baseStore.getState();
                            }
                        }
                    } else {
                        const currentStock = product?.inventoryByBranch?.[order.branchSystemId] || 0;
                        if (currentStock < item.quantity) {
                            alert(`Không thể xuất kho: Sản phẩm "${item.productName}" không đủ tồn kho (Có: ${currentStock}, Cần: ${item.quantity})`);
                            return baseStore.getState();
                        }
                    }
                }
            }
        }
        baseStore.setState((state)=>{
            const order = state.data.find((o)=>o.systemId === orderSystemId);
            if (!order) return state;
            const { addEntry: addStockHistory } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$stock$2d$history$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStockHistoryStore"].getState();
            const employeeData = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmployeeStore"].getState().findById(employeeId);
            const now = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date());
            order.lineItems.forEach((item)=>{
                // ✅ Dispatch stock (hỗ trợ combo - sẽ dispatch SP con)
                const processedItems = processLineItemStock(item, getBranchId(order), 'dispatch', item.quantity);
                // ✅ Add stock history entry for each processed item
                processedItems.forEach((processedItem)=>{
                    const product = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState().findById(processedItem.productSystemId);
                    const currentStock = product?.inventoryByBranch?.[getBranchId(order)] || 0;
                    addStockHistory({
                        date: now,
                        productId: processedItem.productSystemId,
                        action: 'Xuất kho (Đơn hàng)',
                        quantityChange: -processedItem.quantity,
                        newStockLevel: currentStock,
                        documentId: order.id,
                        branchSystemId: getBranchId(order),
                        branch: order.branchName,
                        employeeName: employeeData?.fullName || 'Hệ thống'
                    });
                });
            });
            const now2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date());
            const updatedPackagings = order.packagings.map((p)=>p.systemId === packagingSystemId ? {
                    ...p,
                    deliveryStatus: 'Đang giao hàng'
                } : p);
            const updatedOrder = {
                ...order,
                packagings: updatedPackagings,
                deliveryStatus: 'Đang giao hàng',
                stockOutStatus: 'Xuất kho toàn bộ',
                dispatchedDate: now2,
                dispatchedByEmployeeId: employeeId,
                dispatchedByEmployeeName: employeeData?.fullName,
                status: order.status === 'Đặt hàng' ? 'Đang giao dịch' : order.status
            };
            return {
                data: state.data.map((o)=>o.systemId === orderSystemId ? updatedOrder : o)
            };
        });
    },
    completeDelivery: (orderSystemId, packagingSystemId, employeeId)=>{
        baseStore.setState((state)=>{
            const order = state.data.find((o)=>o.systemId === orderSystemId);
            if (!order) return state;
            // ✅ Complete delivery (hỗ trợ combo - sẽ complete SP con)
            order.lineItems.forEach((item)=>{
                processLineItemStock(item, getBranchId(order), 'complete', item.quantity);
            });
            const updatedPackagings = order.packagings.map((p)=>p.systemId === packagingSystemId ? {
                    ...p,
                    deliveryStatus: 'Đã giao hàng',
                    deliveredDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date())
                } : p);
            const isAllDelivered = updatedPackagings.every((p)=>p.status === 'Hủy đóng gói' || p.deliveryStatus === 'Đã giao hàng');
            let newStatus = order.status;
            let newCompletedDate = order.completedDate;
            // ✅ Khi tất cả đơn đã giao → tạo công nợ (nếu có) và cập nhật stats
            if (isAllDelivered && order.status !== 'Hoàn thành') {
                // Tính công nợ còn lại
                const totalPaid = (order.payments || []).reduce((sum, p)=>sum + p.amount, 0);
                const debtAmount = Math.max(0, order.grandTotal - totalPaid);
                // ✅ Tạo công nợ CHỈ KHI giao hàng thành công
                if (debtAmount > 0) {
                    const { addDebtTransaction } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCustomerStore"].getState();
                    const dueDate = new Date();
                    dueDate.setDate(dueDate.getDate() + 30);
                    addDebtTransaction(order.customerSystemId, {
                        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(`DEBT_${order.systemId}`),
                        orderId: order.id,
                        orderDate: order.orderDate.split('T')[0],
                        amount: debtAmount,
                        dueDate: dueDate.toISOString().split('T')[0],
                        isPaid: false,
                        remainingAmount: debtAmount,
                        notes: 'Công nợ từ đơn hàng đã giao thành công'
                    });
                }
                // Update customer stats
                const { incrementOrderStats } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCustomerStore"].getState();
                incrementOrderStats(order.customerSystemId, order.grandTotal);
            }
            // Check if order is fully complete (delivered + fully paid)
            if (isAllDelivered && order.paymentStatus === 'Thanh toán toàn bộ') {
                newStatus = 'Hoàn thành';
                newCompletedDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date());
            }
            const employee = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmployeeStore"].getState().findById(employeeId);
            const updatedOrder = {
                ...order,
                packagings: updatedPackagings,
                deliveryStatus: 'Đã giao hàng',
                status: newStatus,
                completedDate: newCompletedDate,
                activityHistory: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["appendHistoryEntry"])(order.activityHistory, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHistoryEntry"])('status_changed', (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserInfo"])(), `${employee?.fullName || 'Nhân viên'} đã xác nhận giao hàng thành công${newStatus === 'Hoàn thành' ? '. Đơn hàng hoàn thành' : ''}`))
            };
            return {
                data: state.data.map((o)=>o.systemId === orderSystemId ? updatedOrder : o)
            };
        });
    },
    failDelivery: (orderSystemId, packagingSystemId, employeeId, reason)=>{
        baseStore.setState((state)=>{
            const order = state.data.find((o)=>o.systemId === orderSystemId);
            if (!order) return state;
            const { incrementFailedDeliveryStats } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCustomerStore"].getState();
            // ✅ Return stock from transit (hỗ trợ combo - sẽ return SP con)
            order.lineItems.forEach((item)=>{
                processLineItemStock(item, getBranchId(order), 'return', item.quantity);
            });
            // ✅ Update customer failed delivery stats
            incrementFailedDeliveryStats(order.customerSystemId);
            const updatedPackagings = order.packagings.map((p)=>p.systemId === packagingSystemId ? {
                    ...p,
                    deliveryStatus: 'Chờ giao lại',
                    notes: `Giao thất bại: ${reason}`
                } : p);
            const updatedOrder = {
                ...order,
                packagings: updatedPackagings,
                deliveryStatus: 'Chờ giao lại'
            };
            return {
                data: state.data.map((o)=>o.systemId === orderSystemId ? updatedOrder : o)
            };
        });
    },
    // ✅ Hủy giao hàng - KHÔNG trả hàng về kho (hàng bị thất tung/shipper giữ)
    cancelDeliveryOnly: (orderSystemId, packagingSystemId, employeeId, reason)=>{
        const currentOrder = baseStore.getState().data.find((o)=>o.systemId === orderSystemId);
        if (!ensureCancellationAllowed(currentOrder, 'hủy giao hàng')) {
            return;
        }
        baseStore.setState((state)=>{
            const order = state.data.find((o)=>o.systemId === orderSystemId);
            if (!order) return state;
            // ✅ Get employee info for canceller
            const employeeData = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmployeeStore"].getState().findById(employeeId);
            const updatedPackagings = order.packagings.map((p)=>p.systemId === packagingSystemId ? {
                    ...p,
                    status: 'Hủy đóng gói',
                    deliveryStatus: 'Đã hủy',
                    cancelReason: `Hủy giao hàng: ${reason}`,
                    cancelDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date()),
                    cancelingEmployeeId: employeeId,
                    cancelingEmployeeName: employeeData?.fullName || 'Hệ thống'
                } : p);
            // ✅ Check if all packagings are cancelled, update order status accordingly
            const allCancelled = updatedPackagings.every((p)=>p.deliveryStatus === 'Đã hủy' || p.status === 'Hủy đóng gói');
            const hasAnyActive = updatedPackagings.some((p)=>p.deliveryStatus && p.deliveryStatus !== 'Đã hủy' && p.status !== 'Hủy đóng gói');
            let newOrderStatus = order.status;
            let newDeliveryStatus = order.deliveryStatus;
            if (allCancelled) {
                // All packagings cancelled → order goes back to pending state
                newOrderStatus = 'Đang giao dịch';
                newDeliveryStatus = 'Chưa giao hàng';
            } else if (hasAnyActive) {
                // Some packagings still active → keep current delivery status of remaining active packaging
                const activePackaging = updatedPackagings.find((p)=>p.deliveryStatus && p.deliveryStatus !== 'Đã hủy');
                if (activePackaging?.deliveryStatus) {
                    newDeliveryStatus = activePackaging.deliveryStatus;
                }
            }
            const updatedOrder = {
                ...order,
                packagings: updatedPackagings,
                status: newOrderStatus,
                deliveryStatus: newDeliveryStatus
            };
            return {
                data: state.data.map((o)=>o.systemId === orderSystemId ? updatedOrder : o)
            };
        });
    },
    // ✅ Hủy giao và nhận lại hàng - TRẢ hàng về kho (đã nhận lại từ shipper)
    cancelDelivery: (orderSystemId, packagingSystemId, employeeId, reason)=>{
        const currentOrder = baseStore.getState().data.find((o)=>o.systemId === orderSystemId);
        if (!ensureCancellationAllowed(currentOrder, 'hủy giao hàng')) {
            return;
        }
        baseStore.setState((state)=>{
            const order = state.data.find((o)=>o.systemId === orderSystemId);
            if (!order) return state;
            // ✅ TRẢ hàng từ "đang giao" về "tồn kho" (hỗ trợ combo - sẽ return SP con)
            order.lineItems.forEach((item)=>{
                processLineItemStock(item, getBranchId(order), 'return', item.quantity);
            });
            // ✅ Get employee info for canceller
            const employeeData = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmployeeStore"].getState().findById(employeeId);
            const updatedPackagings = order.packagings.map((p)=>p.systemId === packagingSystemId ? {
                    ...p,
                    status: 'Hủy đóng gói',
                    deliveryStatus: 'Đã hủy',
                    cancelReason: `Hủy giao hàng: ${reason}`,
                    cancelDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date()),
                    cancelingEmployeeId: employeeId,
                    cancelingEmployeeName: employeeData?.fullName || 'Hệ thống'
                } : p);
            // ✅ Check if all packagings are cancelled, update order status accordingly
            const allCancelled = updatedPackagings.every((p)=>p.deliveryStatus === 'Đã hủy' || p.status === 'Hủy đóng gói');
            const hasAnyActive = updatedPackagings.some((p)=>p.deliveryStatus && p.deliveryStatus !== 'Đã hủy' && p.status !== 'Hủy đóng gói');
            let newOrderStatus = order.status;
            let newDeliveryStatus = order.deliveryStatus;
            if (allCancelled) {
                // All packagings cancelled → order goes back to pending state
                newOrderStatus = 'Đang giao dịch';
                newDeliveryStatus = 'Chưa giao hàng';
            } else if (hasAnyActive) {
                // Some packagings still active → keep current delivery status of remaining active packaging
                const activePackaging = updatedPackagings.find((p)=>p.deliveryStatus && p.deliveryStatus !== 'Đã hủy');
                if (activePackaging?.deliveryStatus) {
                    newDeliveryStatus = activePackaging.deliveryStatus;
                }
            }
            const updatedOrder = {
                ...order,
                packagings: updatedPackagings,
                status: newOrderStatus,
                deliveryStatus: newDeliveryStatus
            };
            return {
                data: state.data.map((o)=>o.systemId === orderSystemId ? updatedOrder : o)
            };
        });
    },
    confirmCodReconciliation: (shipments, employeeId)=>{
        const { add: addReceipt } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$receipts$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useReceiptStore"].getState();
        const { accounts } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$cashbook$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCashbookStore"].getState();
        const { data: receiptTypes } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$receipt$2d$types$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useReceiptTypeStore"].getState();
        const employee = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmployeeStore"].getState().findById(employeeId);
        const allOrders = baseStore.getState().data;
        const totalByPartnerAndBranch = {};
        shipments.forEach((shipment)=>{
            const order = allOrders.find((o)=>o.systemId === shipment.orderSystemId);
            if (!order || !shipment.carrier) return;
            const key = `${shipment.carrier}-${getBranchId(order)}`;
            if (!totalByPartnerAndBranch[key]) {
                totalByPartnerAndBranch[key] = {
                    total: 0,
                    ids: [],
                    branchSystemId: getBranchId(order),
                    branchName: order.branchName,
                    partnerName: shipment.carrier,
                    shipmentSystemIds: []
                };
            }
            totalByPartnerAndBranch[key].total += shipment.codAmount || 0;
            totalByPartnerAndBranch[key].ids.push(shipment.trackingCode || shipment.id);
            totalByPartnerAndBranch[key].shipmentSystemIds.push(shipment.systemId);
        });
        const createdReceipts = [];
        Object.values(totalByPartnerAndBranch).forEach((group)=>{
            const account = accounts.find((acc)=>acc.type === 'bank' && acc.branchSystemId === group.branchSystemId) || accounts.find((acc)=>acc.type === 'bank');
            const category = receiptTypes.find((c)=>c.id === 'DOISOATCOD');
            if (account && category) {
                const newReceiptData = {
                    id: '',
                    date: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date()),
                    amount: group.total,
                    payerType: 'Đối tác vận chuyển',
                    payerName: group.partnerName,
                    description: `Đối soát COD cho các vận đơn: ${group.ids.join(', ')}`,
                    paymentMethod: 'Chuyển khoản',
                    accountSystemId: account.systemId,
                    originalDocumentId: group.ids.join(', '),
                    createdBy: employee?.fullName || 'N/A',
                    branchSystemId: group.branchSystemId,
                    branchName: group.branchName,
                    paymentReceiptTypeSystemId: category.systemId,
                    paymentReceiptTypeName: category.name,
                    status: 'completed',
                    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date()),
                    updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date()),
                    affectsDebt: false
                };
                const newReceipt = addReceipt(newReceiptData);
                if (newReceipt) {
                    createdReceipts.push({
                        ...newReceipt,
                        shipmentSystemIds: group.shipmentSystemIds
                    });
                }
            }
        });
        baseStore.setState((state)=>{
            const updates = new Map();
            shipments.forEach((shipment)=>{
                const receiptForShipment = createdReceipts.find((v)=>v.shipmentSystemIds.includes(shipment.systemId));
                if (!receiptForShipment || !shipment.codAmount || shipment.codAmount <= 0) return;
                const orderSystemId = shipment.orderSystemId;
                const orderUpdates = updates.get(orderSystemId) || {
                    newPayments: [],
                    reconciledShipmentIds: []
                };
                const newPayment = {
                    systemId: receiptForShipment.systemId,
                    id: receiptForShipment.id,
                    date: receiptForShipment.date,
                    method: 'Đối soát COD',
                    amount: shipment.codAmount || 0,
                    createdBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SYSTEM'),
                    description: `Thanh toán COD cho vận đơn ${shipment.trackingCode || shipment.id}`
                };
                orderUpdates.newPayments.push(newPayment);
                orderUpdates.reconciledShipmentIds.push(shipment.systemId);
                updates.set(orderSystemId, orderUpdates);
            });
            if (updates.size === 0) return state;
            const newData = state.data.map((order)=>{
                if (updates.has(order.systemId)) {
                    const orderUpdates = updates.get(order.systemId);
                    let updatedOrder = {
                        ...order
                    };
                    updatedOrder.packagings = updatedOrder.packagings.map((p)=>orderUpdates.reconciledShipmentIds.includes(p.systemId) ? {
                            ...p,
                            reconciliationStatus: 'Đã đối soát'
                        } : p);
                    for (const payment of orderUpdates.newPayments){
                        updatedOrder = applyPaymentToOrder(updatedOrder, payment);
                    }
                    return updatedOrder;
                }
                return order;
            });
            return {
                data: newData
            };
        });
    },
    // ============================================
    // GHTK INTEGRATION METHODS
    // ============================================
    /**
     * Process GHTK webhook update
     * Called when GHTK pushes status update or from tracking API
     */ processGHTKWebhook: (webhookData)=>{
        baseStore.setState((state)=>{
            // Find order by tracking code or partner_id
            const order = state.data.find((o)=>o.packagings.some((p)=>p.trackingCode === webhookData.label_id || p.systemId === webhookData.partner_id || o.systemId === webhookData.partner_id));
            if (!order) {
                console.warn('[GHTK Webhook] Order not found for:', {
                    label_id: webhookData.label_id,
                    partner_id: webhookData.partner_id
                });
                return state;
            }
            // Import status mapping
            const { getGHTKStatusInfo, getGHTKReasonText } = __turbopack_context__.r("[project]/lib/ghtk-constants.ts [app-ssr] (ecmascript)");
            const statusMapping = getGHTKStatusInfo(webhookData.status_id);
            if (!statusMapping) {
                console.warn('[GHTK Webhook] Unknown status:', webhookData.status_id);
                return state;
            }
            console.log('[GHTK Webhook] Processing update:', {
                order: order.id,
                trackingCode: webhookData.label_id,
                statusId: webhookData.status_id,
                statusText: statusMapping.statusText,
                deliveryStatus: statusMapping.deliveryStatus
            });
            // Update packaging with new status
            const updatedPackagings = order.packagings.map((p)=>{
                if (p.trackingCode !== webhookData.label_id && p.systemId !== webhookData.partner_id) {
                    return p;
                }
                return {
                    ...p,
                    deliveryStatus: statusMapping.deliveryStatus,
                    partnerStatus: statusMapping.statusText,
                    ghtkStatusId: webhookData.status_id,
                    ghtkReasonCode: webhookData.reason_code,
                    ghtkReasonText: webhookData.reason ? webhookData.reason : webhookData.reason_code ? getGHTKReasonText(webhookData.reason_code) : undefined,
                    actualWeight: webhookData.weight,
                    actualFee: webhookData.fee,
                    lastSyncedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date()),
                    // Update reconciliation status if status = 6 (Đã đối soát)
                    reconciliationStatus: webhookData.status_id === 6 ? 'Đã đối soát' : p.reconciliationStatus,
                    // Update delivered date if status = 5 or 6
                    deliveredDate: [
                        5,
                        6
                    ].includes(webhookData.status_id) && !p.deliveredDate ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date()) : p.deliveredDate
                };
            });
            // Handle stock updates based on status
            if (statusMapping.shouldUpdateStock && statusMapping.stockAction) {
                const { dispatchStock, completeDelivery: productCompleteDelivery, returnStockFromTransit } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState();
                const { incrementFailedDeliveryStats } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCustomerStore"].getState();
                // ✅ Expand combo items to child products
                const stockItems = getComboStockItems(order.lineItems);
                stockItems.forEach((item)=>{
                    switch(statusMapping.stockAction){
                        case 'dispatch':
                            // Status 3: Đã lấy hàng -> Move to transit
                            dispatchStock(item.productSystemId, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(getBranchId(order)), item.quantity);
                            break;
                        case 'complete':
                            // Status 5: Đã giao hàng -> Complete delivery
                            productCompleteDelivery(item.productSystemId, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(getBranchId(order)), item.quantity);
                            break;
                        case 'return':
                            // Status -1, 7, 9, 13, 20: Failed/Returned -> Return stock
                            returnStockFromTransit(item.productSystemId, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(getBranchId(order)), item.quantity);
                            break;
                    }
                });
                // ✅ Increment failed delivery stats for customer if return (moved outside loop)
                if (statusMapping.stockAction === 'return') {
                    const failureStatuses = [
                        7,
                        9,
                        13,
                        20,
                        21
                    ];
                    const currentPackaging = order.packagings.find((p)=>p.trackingCode === webhookData.label_id);
                    const previousStatusId = currentPackaging?.ghtkStatusId;
                    if (failureStatuses.includes(webhookData.status_id) && (!previousStatusId || !failureStatuses.includes(previousStatusId))) {
                        incrementFailedDeliveryStats(order.customerSystemId);
                    }
                }
                console.log('[GHTK Webhook] Stock updated:', {
                    action: statusMapping.stockAction,
                    items: stockItems.length
                });
            }
            // Determine order-level delivery status
            const allPackagingsDelivered = updatedPackagings.every((p)=>p.status === 'Hủy đóng gói' || p.deliveryStatus === 'Đã giao hàng');
            let newOrderDeliveryStatus = order.deliveryStatus;
            let newOrderStatus = order.status;
            let newCompletedDate = order.completedDate;
            let newStockOutStatus = order.stockOutStatus;
            // Update order delivery status
            if (allPackagingsDelivered) {
                newOrderDeliveryStatus = 'Đã giao hàng';
                // Auto-complete order if delivered + paid
                if (order.paymentStatus === 'Thanh toán toàn bộ' && order.status !== 'Hoàn thành') {
                    newOrderStatus = 'Hoàn thành';
                    newCompletedDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date());
                    // Update customer stats
                    const { incrementOrderStats } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCustomerStore"].getState();
                    incrementOrderStats(order.customerSystemId, order.grandTotal);
                    console.log('[GHTK Webhook] Order completed:', order.id);
                }
            } else if (statusMapping.statusId === 3) {
                // Status 3: Đã lấy hàng
                newOrderDeliveryStatus = 'Đang giao hàng';
                newStockOutStatus = 'Xuất kho toàn bộ';
            } else if ([
                4,
                10
            ].includes(statusMapping.statusId)) {
                // Status 4, 10: Đang giao
                newOrderDeliveryStatus = 'Đang giao hàng';
            }
            const updatedOrder = {
                ...order,
                packagings: updatedPackagings,
                deliveryStatus: newOrderDeliveryStatus,
                status: newOrderStatus,
                completedDate: newCompletedDate,
                stockOutStatus: newStockOutStatus
            };
            return {
                data: state.data.map((o)=>o.systemId === order.systemId ? updatedOrder : o)
            };
        });
    },
    /**
     * Cancel GHTK shipment
     * ⚠️ Chỉ hủy được khi đơn ở trạng thái: 1, 2, 12 (Chưa tiếp nhận, Đã tiếp nhận, Đang lấy hàng)
     */ cancelGHTKShipment: async (orderSystemId, packagingSystemId, trackingCode)=>{
        try {
            console.log('[GHTK] Cancelling shipment:', trackingCode);
            // ✅ Lấy credentials từ shipping_partners_config
            const { getGHTKCredentials } = await __turbopack_context__.A("[project]/lib/utils/get-shipping-credentials.ts [app-ssr] (ecmascript, async loader)");
            let credentials;
            try {
                credentials = getGHTKCredentials();
            } catch (error) {
                return {
                    success: false,
                    message: error.message || 'Chưa cấu hình GHTK. Vui lòng vào Cài đặt → Đối tác vận chuyển.'
                };
            }
            const response = await fetch((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getApiUrl"])('/shipping/ghtk/cancel-order'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    trackingCode,
                    apiToken: credentials.apiToken,
                    partnerCode: credentials.partnerCode
                })
            });
            const data = await response.json();
            // ✅ Kiểm tra response từ GHTK
            if (!response.ok) {
                throw new Error(data.message || data.error || 'Failed to cancel GHTK shipment');
            }
            // ✅ GHTK trả success: false khi không thể hủy (đã lấy hàng)
            if (data.success === false) {
                console.log('[GHTK] Cannot cancel:', data.message);
                return {
                    success: false,
                    message: data.message || 'Không thể hủy đơn hàng'
                };
            }
            console.log('[GHTK] Cancellation successful:', data.message);
            // ✅ CHỈ update state khi GHTK xác nhận hủy thành công
            baseStore.setState((state)=>{
                const order = state.data.find((o)=>o.systemId === orderSystemId);
                if (!order) return state;
                const updatedPackagings = order.packagings.map((p)=>{
                    if (p.systemId !== packagingSystemId) return p;
                    return {
                        ...p,
                        status: 'Hủy đóng gói',
                        deliveryStatus: 'Đã hủy',
                        cancelDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date()),
                        cancelReason: 'Hủy vận đơn GHTK',
                        ghtkStatusId: -1,
                        partnerStatus: 'Hủy đơn hàng'
                    };
                });
                // ✅ KHÔNG rollback stock - để user tự quyết định (nút "Hủy giao và nhận lại hàng")
                const updatedOrder = {
                    ...order,
                    packagings: updatedPackagings
                };
                return {
                    data: state.data.map((o)=>o.systemId === orderSystemId ? updatedOrder : o)
                };
            });
            return {
                success: true,
                message: data.message || 'Đã hủy vận đơn GHTK thành công'
            };
        } catch (error) {
            console.error('[GHTK] Cancel error:', error);
            return {
                success: false,
                message: error.message || 'Lỗi khi hủy vận đơn GHTK'
            };
        }
    }
};
// Auto-allocate historical receipts on startup
__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$receipts$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useReceiptStore"].getState().data.forEach((receipt)=>{
    autoAllocateReceiptToOrders(receipt);
});
// React to newly created receipts
__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$receipts$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useReceiptStore"].subscribe((state)=>state.data, (currentReceipts, previousReceipts)=>{
    const previousIds = new Set((previousReceipts ?? []).map((r)=>r.systemId));
    currentReceipts.forEach((receipt)=>{
        if (!previousIds.has(receipt.systemId)) {
            autoAllocateReceiptToOrders(receipt);
        }
    });
});
const useOrderStore = ()=>{
    const state = baseStore();
    return {
        ...state,
        ...augmentedMethods
    };
};
// Export getState for non-hook usage
useOrderStore.getState = ()=>{
    const state = baseStore.getState();
    return {
        ...state,
        ...augmentedMethods
    };
};
}),
"[project]/features/attendance/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAttendanceStore",
    ()=>useAttendanceStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
;
// API sync helper
async function syncToAPI(action, data) {
    try {
        const endpoint = '/api/attendance';
        const method = action === 'save' ? 'POST' : 'PATCH';
        const response = await fetch(endpoint, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action,
                ...data
            })
        });
        if (!response.ok) {
            console.error(`[Attendance API] ${action} failed:`, await response.text());
            return false;
        }
        return true;
    } catch (error) {
        console.error(`[Attendance API] ${action} error:`, error);
        return false;
    }
}
async function fetchFromAPI(monthKey) {
    try {
        const [year, month] = monthKey.split('-');
        const fromDate = `${year}-${month}-01`;
        const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
        const toDate = `${year}-${month}-${lastDay}`;
        // Attendance is filtered by month, so 500 records should cover most cases
        const response = await fetch(`/api/attendance?fromDate=${fromDate}&toDate=${toDate}&limit=500`);
        if (!response.ok) return null;
        const json = await response.json();
        return json.data || null;
    } catch (error) {
        console.error('[Attendance API] fetch error:', error);
        return null;
    }
}
const useAttendanceStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((set, get)=>({
        lockedMonths: {},
        initialized: false,
        lockMonth: (monthYear)=>{
            set((state)=>({
                    lockedMonths: {
                        ...state.lockedMonths,
                        [monthYear]: true
                    }
                }));
            // Sync to API
            syncToAPI('lock', {
                monthYear
            }).catch(console.error);
        },
        unlockMonth: (monthYear)=>{
            set((state)=>{
                if (!state.lockedMonths[monthYear]) {
                    return state;
                }
                const nextLocked = {
                    ...state.lockedMonths
                };
                delete nextLocked[monthYear];
                return {
                    lockedMonths: nextLocked
                };
            });
            // Sync to API
            syncToAPI('unlock', {
                monthYear
            }).catch(console.error);
        },
        toggleLock: (monthYear)=>{
            const isLocked = Boolean(get().lockedMonths[monthYear]);
            if (isLocked) {
                get().unlockMonth(monthYear);
            } else {
                get().lockMonth(monthYear);
            }
        },
        // Data management
        attendanceData: {},
        saveAttendanceData: (monthKey, data)=>{
            set((state)=>({
                    attendanceData: {
                        ...state.attendanceData,
                        [monthKey]: data
                    }
                }));
            // Sync to API
            syncToAPI('save', {
                monthKey,
                data
            }).catch(console.error);
        },
        getAttendanceData: (monthKey)=>{
            return get().attendanceData[monthKey] || null;
        },
        updateEmployeeRecord: (monthKey, employeeSystemId, dayKey, record)=>{
            set((state)=>{
                const monthData = state.attendanceData[monthKey];
                if (!monthData) return state;
                const updatedData = monthData.map((emp)=>{
                    if (emp.employeeSystemId === employeeSystemId) {
                        return {
                            ...emp,
                            [dayKey]: record
                        };
                    }
                    return emp;
                });
                return {
                    attendanceData: {
                        ...state.attendanceData,
                        [monthKey]: updatedData
                    }
                };
            });
            // Sync single record to API
            syncToAPI('save', {
                monthKey,
                employeeSystemId,
                dayKey,
                record
            }).catch(console.error);
        },
        // Load from API
        loadFromAPI: async (monthKey)=>{
            const apiData = await fetchFromAPI(monthKey);
            if (apiData && apiData.length > 0) {
                set((state)=>({
                        attendanceData: {
                            ...state.attendanceData,
                            [monthKey]: apiData
                        },
                        initialized: true
                    }));
            }
        }
    }));
}),
"[project]/features/attendance/utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "calculateOvertimePay",
    ()=>calculateOvertimePay,
    "calculateOvertimePayFromRow",
    ()=>calculateOvertimePayFromRow,
    "excelSerialToTime",
    ()=>excelSerialToTime,
    "initializeEmptyAttendance",
    ()=>initializeEmptyAttendance,
    "recalculateSummary",
    ()=>recalculateSummary
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-ssr] (ecmascript)");
;
function initializeEmptyAttendance(employees, year, month, settings) {
    const daysInMonth = new Date(year, month, 0).getDate();
    return employees.map((emp)=>{
        const row = {
            systemId: emp.systemId,
            employeeSystemId: emp.systemId,
            employeeId: emp.id,
            fullName: emp.fullName,
            department: emp.department,
            workDays: 0,
            leaveDays: 0,
            absentDays: 0,
            lateArrivals: 0,
            earlyDepartures: 0,
            otHours: 0,
            otHoursWeekday: 0,
            otHoursWeekend: 0,
            otHoursHoliday: 0
        };
        // Initialize each day with default status
        for(let d = 1; d <= daysInMonth; d++){
            const workDate = new Date(year, month - 1, d);
            const dayOfWeek = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDayOfWeek"])(workDate);
            const isWorkingDay = dayOfWeek !== null && settings.workingDays.includes(dayOfWeek);
            row[`day_${d}`] = {
                status: isWorkingDay ? 'absent' : 'weekend'
            };
        }
        return row;
    });
}
function excelSerialToTime(serial) {
    if (typeof serial === 'string') {
        // If it's already a time string, just ensure format
        const parts = serial.split(':');
        if (parts.length >= 2) {
            return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
        }
        return '';
    }
    if (typeof serial !== 'number' || serial < 0 || serial > 1) {
        // It might be a Date object from cellDates:true
        if (serial instanceof Date) {
            // Use local time (getHours/getMinutes) for Vietnam timezone GMT+7
            const hours = serial.getHours();
            const minutes = serial.getMinutes();
            return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        }
        return ''; // Invalid time serial
    }
    const totalSeconds = Math.round(serial * 86400);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor(totalSeconds % 3600 / 60);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}
function recalculateSummary(row, year, month, settings) {
    let totalWorkMinutes = 0; // Tổng phút làm việc trong giờ hành chính (8:30-18:00)
    let leaveDays = 0;
    let absentDays = 0;
    let lateArrivals = 0;
    let earlyDepartures = 0;
    // OT theo loại ngày
    let otMinutesWeekday = 0; // Làm thêm ngày thường (sau 18h)
    let otMinutesWeekend = 0; // Làm thêm cuối tuần
    let otMinutesHoliday = 0; // Làm thêm ngày lễ
    const daysInMonth = new Date(year, month, 0).getDate();
    // Tính số giờ làm việc tiêu chuẩn 1 ngày (trừ nghỉ trưa)
    // VD: 8:30-18:00 = 9.5h, trừ nghỉ trưa 1.5h = 8h
    const workStartParts = settings.workStartTime.split(':').map(Number);
    const workEndParts = settings.workEndTime.split(':').map(Number);
    const workStartMinutes = workStartParts[0] * 60 + workStartParts[1];
    const workEndMinutes = workEndParts[0] * 60 + workEndParts[1];
    const standardDayMinutes = workEndMinutes - workStartMinutes - settings.lunchBreakDuration;
    // Lấy giờ nghỉ trưa từ settings (nếu có), fallback về hardcode
    const lunchStartParts = (settings.lunchBreakStart || '12:00').split(':').map(Number);
    const lunchEndParts = (settings.lunchBreakEnd || '13:30').split(':').map(Number);
    const lunchStartMinutes = lunchStartParts[0] * 60 + lunchStartParts[1];
    const lunchEndMinutes = lunchEndParts[0] * 60 + lunchEndParts[1];
    for(let d = 1; d <= daysInMonth; d++){
        const record = row[`day_${d}`];
        const workDate = new Date(year, month - 1, d);
        const dayOfWeek = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDayOfWeek"])(workDate);
        const isWorkingDay = dayOfWeek !== null && settings.workingDays.includes(dayOfWeek);
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // CN = 0, T7 = 6
        const isHoliday = record?.status === 'holiday';
        if (record) {
            // Xử lý cho ngày làm việc (thứ 2-6)
            if (isWorkingDay) {
                // Tính giờ làm việc thực tế từ checkIn/checkOut
                if (record.checkIn && record.checkOut) {
                    const workDateStr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODate"])(workDate);
                    const checkInTime = new Date(`${workDateStr}T${record.checkIn}`);
                    const checkOutTime = new Date(`${workDateStr}T${record.checkOut}`);
                    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isValidDate"])(checkInTime) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isValidDate"])(checkOutTime) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isDateAfter"])(checkOutTime, checkInTime)) {
                        const checkInMins = checkInTime.getHours() * 60 + checkInTime.getMinutes();
                        const checkOutMins = checkOutTime.getHours() * 60 + checkOutTime.getMinutes();
                        // ===== TÍNH GIỜ CÔNG (trong giờ hành chính 8:30-18:00) =====
                        // Giờ vào tính công = max(checkIn, workStart)
                        const effectiveStartMins = Math.max(checkInMins, workStartMinutes);
                        // Giờ ra tính công = min(checkOut, workEnd)
                        const effectiveEndMins = Math.min(checkOutMins, workEndMinutes);
                        let workedMinutes = effectiveEndMins - effectiveStartMins;
                        // Trừ nghỉ trưa nếu làm qua giờ nghỉ trưa
                        if (effectiveStartMins < lunchStartMinutes && effectiveEndMins > lunchEndMinutes) {
                            workedMinutes -= settings.lunchBreakDuration;
                        } else if (effectiveStartMins < lunchEndMinutes && effectiveEndMins > lunchStartMinutes) {
                            // Nếu chỉ chạm 1 phần giờ nghỉ trưa
                            const overlapStart = Math.max(effectiveStartMins, lunchStartMinutes);
                            const overlapEnd = Math.min(effectiveEndMins, lunchEndMinutes);
                            workedMinutes -= Math.max(0, overlapEnd - overlapStart);
                        }
                        totalWorkMinutes += Math.max(0, workedMinutes);
                        // ===== TÍNH GIỜ LÀM THÊM (sau giờ tan làm 18:00) =====
                        if (checkOutMins > workEndMinutes) {
                            const otMinutes = checkOutMins - workEndMinutes;
                            if (isHoliday) {
                                otMinutesHoliday += otMinutes;
                            } else {
                                otMinutesWeekday += otMinutes;
                            }
                        }
                        // Early departure calculation - ra trước giờ tan làm
                        if (checkOutMins < workEndMinutes) {
                            earlyDepartures++;
                        }
                    }
                }
                // Đếm ngày nghỉ phép
                if (record.status === 'leave') {
                    leaveDays += 1;
                }
                // Late arrival calculation
                if (record.checkIn) {
                    const workDateStr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODate"])(workDate);
                    const checkInTime = new Date(`${workDateStr}T${record.checkIn}`);
                    const workStartTime = new Date(`${workDateStr}T${settings.workStartTime}`);
                    const allowedLateTime = new Date(workStartTime.getTime() + settings.allowedLateMinutes * 60000);
                    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isDateAfter"])(checkInTime, allowedLateTime)) {
                        lateArrivals++;
                    }
                }
            }
            // ===== XỬ LÝ LÀM THÊM CUỐI TUẦN / NGÀY LỄ =====
            // Nếu là cuối tuần hoặc ngày lễ mà có checkIn/checkOut → tính toàn bộ là OT
            if ((isWeekend || isHoliday) && record.checkIn && record.checkOut) {
                const workDateStr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODate"])(workDate);
                const checkInTime = new Date(`${workDateStr}T${record.checkIn}`);
                const checkOutTime = new Date(`${workDateStr}T${record.checkOut}`);
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isValidDate"])(checkInTime) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isValidDate"])(checkOutTime) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isDateAfter"])(checkOutTime, checkInTime)) {
                    let otMinutes = (checkOutTime.getTime() - checkInTime.getTime()) / 60000;
                    // Trừ nghỉ trưa nếu làm qua trưa
                    const checkInMins = checkInTime.getHours() * 60 + checkInTime.getMinutes();
                    const checkOutMins = checkOutTime.getHours() * 60 + checkOutTime.getMinutes();
                    if (checkInMins < lunchStartMinutes && checkOutMins > lunchEndMinutes) {
                        otMinutes -= settings.lunchBreakDuration;
                    }
                    if (isHoliday) {
                        otMinutesHoliday += Math.max(0, otMinutes);
                    } else {
                        otMinutesWeekend += Math.max(0, otMinutes);
                    }
                }
            }
            // OT từ cột overtimeCheckIn/overtimeCheckOut riêng (nếu có)
            if (record.overtimeCheckIn && record.overtimeCheckOut) {
                const workDateStr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODate"])(workDate);
                const otStartDate = new Date(`${workDateStr}T${record.overtimeCheckIn}`);
                const otEndDate = new Date(`${workDateStr}T${record.overtimeCheckOut}`);
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isValidDate"])(otStartDate) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isValidDate"])(otEndDate) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isDateAfter"])(otEndDate, otStartDate)) {
                    const diffInMinutes = (otEndDate.getTime() - otStartDate.getTime()) / 60000;
                    if (isHoliday) {
                        otMinutesHoliday += diffInMinutes;
                    } else if (isWeekend) {
                        otMinutesWeekend += diffInMinutes;
                    } else {
                        otMinutesWeekday += diffInMinutes;
                    }
                }
            }
        }
    }
    // Tính số công = Tổng giờ làm / Giờ tiêu chuẩn 1 ngày (tối đa = số ngày làm việc trong tháng)
    const workDays = standardDayMinutes > 0 ? parseFloat((totalWorkMinutes / standardDayMinutes).toFixed(2)) : 0;
    // Tính ngày vắng = Tổng ngày làm việc trong tháng - ngày có công - ngày phép
    const totalWorkingDaysInMonth = Array.from({
        length: daysInMonth
    }, (_, i)=>{
        const d = new Date(year, month - 1, i + 1);
        const dow = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDayOfWeek"])(d);
        return dow !== null && settings.workingDays.includes(dow) ? 1 : 0;
    }).reduce((a, b)=>a + b, 0);
    absentDays = Math.max(0, totalWorkingDaysInMonth - Math.ceil(workDays) - leaveDays);
    // Convert OT từ phút sang giờ
    const otHoursWeekday = parseFloat((otMinutesWeekday / 60).toFixed(2));
    const otHoursWeekend = parseFloat((otMinutesWeekend / 60).toFixed(2));
    const otHoursHoliday = parseFloat((otMinutesHoliday / 60).toFixed(2));
    const otHours = parseFloat((otHoursWeekday + otHoursWeekend + otHoursHoliday).toFixed(2));
    return {
        workDays,
        leaveDays,
        absentDays,
        lateArrivals,
        earlyDepartures,
        otHours,
        otHoursWeekday,
        otHoursWeekend,
        otHoursHoliday
    };
}
function calculateOvertimePay(otHoursWeekday, otHoursWeekend, otHoursHoliday, settings) {
    const hourlyRate = settings.otHourlyRate || 0;
    // Ngày thường: tiền/giờ * số giờ
    const weekdayPay = otHoursWeekday * hourlyRate;
    // Cuối tuần: tiền/giờ * hệ số cuối tuần * số giờ
    const weekendPay = otHoursWeekend * hourlyRate * (settings.otRateWeekend || 1.5);
    // Ngày lễ: tiền/giờ * hệ số ngày lễ * số giờ  
    const holidayPay = otHoursHoliday * hourlyRate * (settings.otRateHoliday || 3);
    const totalOtPay = weekdayPay + weekendPay + holidayPay;
    return {
        weekdayPay: Math.round(weekdayPay),
        weekendPay: Math.round(weekendPay),
        holidayPay: Math.round(holidayPay),
        totalOtPay: Math.round(totalOtPay)
    };
}
function calculateOvertimePayFromRow(row, settings) {
    return calculateOvertimePay(row.otHoursWeekday || 0, row.otHoursWeekend || 0, row.otHoursHoliday || 0, settings);
}
}),
"[project]/features/leaves/leave-sync-service.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "leaveAttendanceSync",
    ()=>leaveAttendanceSync
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$attendance$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/attendance/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$employees$2f$employee$2d$settings$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/employees/employee-settings-store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$attendance$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/attendance/utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-ssr] (ecmascript)");
;
;
;
;
const LEAVE_NOTE_PREFIX = '[LEAVE:';
const buildMonthKey = (date)=>`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
const buildLeaveNote = (leave)=>{
    const description = `${LEAVE_NOTE_PREFIX}${leave.systemId}] ${leave.leaveTypeName}`;
    return leave.reason ? `${description} - ${leave.reason}` : description;
};
const isSameLeaveNote = (record, leave)=>{
    if (!record?.notes) return false;
    return record.notes.includes(`${LEAVE_NOTE_PREFIX}${leave.systemId}]`);
};
const cloneDate = (input)=>new Date(input.getFullYear(), input.getMonth(), input.getDate());
const parseLeaveBoundary = (value)=>{
    const parsed = new Date(`${value}T00:00:00`);
    return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
};
const collectWorkingDays = (leave)=>{
    const workingDays = new Set(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$employees$2f$employee$2d$settings$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmployeeSettingsStore"].getState().settings.workingDays);
    if (!leave.startDate || !leave.endDate) return new Map();
    let start = parseLeaveBoundary(leave.startDate);
    let end = parseLeaveBoundary(leave.endDate);
    if (start > end) {
        const temp = start;
        start = end;
        end = temp;
    }
    const monthMap = new Map();
    for(let cursor = cloneDate(start); cursor <= end; cursor.setDate(cursor.getDate() + 1)){
        const dayOfWeek = cursor.getDay();
        if (!workingDays.has(dayOfWeek)) {
            continue;
        }
        const monthKey = buildMonthKey(cursor);
        const entry = {
            date: cloneDate(cursor),
            dayOfMonth: cursor.getDate()
        };
        const existing = monthMap.get(monthKey);
        if (existing) {
            existing.push(entry);
        } else {
            monthMap.set(monthKey, [
                entry
            ]);
        }
    }
    return monthMap;
};
const buildLeaveRecord = (leave)=>({
        status: 'leave',
        notes: buildLeaveNote(leave)
    });
const buildRevertedRecord = (context)=>{
    const today = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentDate"])();
    if (context.date > today) {
        return {
            status: 'future'
        };
    }
    return {
        status: 'absent'
    };
};
const applyUpdatesForMonth = (monthKey, days, leave, mode)=>{
    if (days.length === 0) return;
    const attendanceStore = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$attendance$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAttendanceStore"].getState();
    const monthData = attendanceStore.getAttendanceData(monthKey);
    if (!monthData?.length) return;
    const [yearStr, monthStr] = monthKey.split('-');
    const year = Number(yearStr) || new Date().getFullYear();
    const month = Number(monthStr) || new Date().getMonth() + 1;
    const settings = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$employees$2f$employee$2d$settings$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmployeeSettingsStore"].getState().settings;
    let didChange = false;
    const updatedRows = monthData.map((row)=>{
        if (row.employeeSystemId !== leave.employeeSystemId) {
            return row;
        }
        let rowChanged = false;
        const mutableRow = {
            ...row
        };
        days.forEach((ctx)=>{
            const dayKey = `day_${ctx.dayOfMonth}`;
            const currentRecord = mutableRow[dayKey];
            if (mode === 'apply') {
                mutableRow[dayKey] = buildLeaveRecord(leave);
                rowChanged = true;
                return;
            }
            if (mode === 'clear' && currentRecord && isSameLeaveNote(currentRecord, leave)) {
                mutableRow[dayKey] = buildRevertedRecord(ctx);
                rowChanged = true;
            }
        });
        if (!rowChanged) {
            return row;
        }
        didChange = true;
        const summary = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$attendance$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["recalculateSummary"])(mutableRow, year, month, settings);
        return {
            ...mutableRow,
            ...summary
        };
    });
    if (didChange) {
        attendanceStore.saveAttendanceData(monthKey, updatedRows);
    }
};
const leaveAttendanceSync = {
    apply (leave) {
        const monthMap = collectWorkingDays(leave);
        monthMap.forEach((days, monthKey)=>applyUpdatesForMonth(monthKey, days, leave, 'apply'));
    },
    clear (leave) {
        const monthMap = collectWorkingDays(leave);
        monthMap.forEach((days, monthKey)=>applyUpdatesForMonth(monthKey, days, leave, 'clear'));
    }
};
}),
"[project]/features/leaves/leave-quota-service.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "leaveQuotaSync",
    ()=>leaveQuotaSync
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/employees/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$employees$2f$employee$2d$settings$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/employees/employee-settings-store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-ssr] (ecmascript)");
;
;
;
const clampNonNegative = (value)=>Number.isFinite(value) && value > 0 ? value : 0;
const resolveDelta = (leave)=>{
    const days = Number(leave.numberOfDays) || 0;
    return days > 0 ? days : 0;
};
const isAnnualLeaveType = (leaveType)=>{
    if (!leaveType) return false;
    const normalizedName = leaveType.name?.toLowerCase() ?? '';
    const annualKeywords = [
        'phép năm',
        'phep nam',
        'annual'
    ];
    return annualKeywords.some((keyword)=>normalizedName.includes(keyword));
};
const resolveLeaveTypeMetadata = (leave)=>{
    const settings = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$employees$2f$employee$2d$settings$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmployeeSettingsStore"].getState().settings;
    const matchedType = settings.leaveTypes.find((type)=>{
        if (leave.leaveTypeSystemId && type.systemId === leave.leaveTypeSystemId) return true;
        if (leave.leaveTypeId && type.id === leave.leaveTypeId) return true;
        return false;
    });
    const isPaid = typeof leave.leaveTypeIsPaid === 'boolean' ? leave.leaveTypeIsPaid : matchedType?.isPaid ?? true;
    const countsTowardsAnnual = matchedType ? isAnnualLeaveType(matchedType) : isPaid;
    return {
        isPaid,
        countsTowardsAnnual
    };
};
const getServiceYears = (hireDate)=>{
    if (!hireDate) return 0;
    const parsed = new Date(hireDate);
    if (Number.isNaN(parsed.getTime())) return 0;
    const today = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentDate"])();
    let years = today.getFullYear() - parsed.getFullYear();
    const hasNotReachedAnniversary = today.getMonth() < parsed.getMonth() || today.getMonth() === parsed.getMonth() && today.getDate() < parsed.getDate();
    if (hasNotReachedAnniversary) {
        years -= 1;
    }
    return Math.max(years, 0);
};
const computeAnnualQuota = (employeeHireDate)=>{
    const { baseAnnualLeaveDays, annualLeaveSeniorityBonus } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$employees$2f$employee$2d$settings$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmployeeSettingsStore"].getState().settings;
    const base = baseAnnualLeaveDays ?? 0;
    if (!annualLeaveSeniorityBonus) {
        return clampNonNegative(base);
    }
    const years = getServiceYears(employeeHireDate);
    const bonusInterval = annualLeaveSeniorityBonus.years || 0;
    const bonusValue = annualLeaveSeniorityBonus.additionalDays || 0;
    const bonusMultiplier = bonusInterval > 0 ? Math.floor(years / bonusInterval) : 0;
    const bonus = bonusMultiplier * bonusValue;
    return clampNonNegative(base + bonus);
};
const adjustLeaveUsage = (leave, delta)=>{
    if (!delta) return;
    const employeeStore = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmployeeStore"].getState();
    const employee = employeeStore.findById(leave.employeeSystemId);
    if (!employee) return;
    const { isPaid, countsTowardsAnnual } = resolveLeaveTypeMetadata(leave);
    const totalDelta = delta;
    const paidDelta = isPaid ? delta : 0;
    const unpaidDelta = isPaid ? 0 : delta;
    const annualDelta = countsTowardsAnnual ? delta : 0;
    const nextLeaveTaken = clampNonNegative((employee.leaveTaken ?? 0) + totalDelta);
    const nextPaid = clampNonNegative((employee.paidLeaveTaken ?? 0) + paidDelta);
    const nextUnpaid = clampNonNegative((employee.unpaidLeaveTaken ?? 0) + unpaidDelta);
    const nextAnnual = clampNonNegative((employee.annualLeaveTaken ?? 0) + annualDelta);
    const quota = computeAnnualQuota(employee.hireDate);
    const nextBalance = clampNonNegative(quota - nextAnnual);
    const hasChanges = nextLeaveTaken !== (employee.leaveTaken ?? 0) || nextPaid !== (employee.paidLeaveTaken ?? 0) || nextUnpaid !== (employee.unpaidLeaveTaken ?? 0) || nextAnnual !== (employee.annualLeaveTaken ?? 0) || nextBalance !== (employee.annualLeaveBalance ?? quota);
    if (!hasChanges) return;
    employeeStore.update(leave.employeeSystemId, {
        ...employee,
        leaveTaken: nextLeaveTaken,
        paidLeaveTaken: nextPaid,
        unpaidLeaveTaken: nextUnpaid,
        annualLeaveTaken: nextAnnual,
        annualLeaveBalance: nextBalance
    });
};
const leaveQuotaSync = {
    apply (leave) {
        const delta = resolveDelta(leave);
        if (!delta) return;
        adjustLeaveUsage(leave, delta);
    },
    clear (leave) {
        const delta = resolveDelta(leave);
        if (!delta) return;
        adjustLeaveUsage(leave, -delta);
    }
};
}),
"[project]/features/leaves/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useLeaveStore",
    ()=>useLeaveStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$leaves$2f$leave$2d$sync$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/leaves/leave-sync-service.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$leaves$2f$leave$2d$quota$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/leaves/leave-quota-service.ts [app-ssr] (ecmascript)");
;
;
;
const baseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createCrudStore"])([], 'leaves', {
    businessIdField: 'id',
    apiEndpoint: '/api/leaves'
});
const isApproved = (leave)=>Boolean(leave && leave.status === 'Đã duyệt');
const snapshotLeave = (leave)=>leave ? {
        ...leave
    } : undefined;
const syncApprovedLeave = {
    apply: (leave)=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$leaves$2f$leave$2d$sync$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["leaveAttendanceSync"].apply(leave);
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$leaves$2f$leave$2d$quota$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["leaveQuotaSync"].apply(leave);
    },
    clear: (leave)=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$leaves$2f$leave$2d$sync$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["leaveAttendanceSync"].clear(leave);
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$leaves$2f$leave$2d$quota$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["leaveQuotaSync"].clear(leave);
    }
};
const syncAwareActions = {
    add: (payload)=>{
        const created = baseStore.getState().add(payload);
        if (isApproved(created)) {
            syncApprovedLeave.apply(created);
        }
        return created;
    },
    update: (systemId, next)=>{
        const store = baseStore.getState();
        const previous = snapshotLeave(store.findById(systemId));
        store.update(systemId, next);
        const updated = snapshotLeave(baseStore.getState().findById(systemId));
        if (isApproved(previous)) {
            syncApprovedLeave.clear(previous);
        }
        if (isApproved(updated)) {
            syncApprovedLeave.apply(updated);
        }
    },
    remove: (systemId)=>{
        const store = baseStore.getState();
        const target = snapshotLeave(store.findById(systemId));
        store.remove(systemId);
        if (isApproved(target)) {
            syncApprovedLeave.clear(target);
        }
    },
    restore: (systemId)=>{
        const store = baseStore.getState();
        store.restore(systemId);
        const restored = snapshotLeave(baseStore.getState().findById(systemId));
        if (isApproved(restored)) {
            syncApprovedLeave.apply(restored);
        }
    },
    hardDelete: (systemId)=>{
        const store = baseStore.getState();
        const target = snapshotLeave(store.findById(systemId));
        store.hardDelete(systemId);
        if (isApproved(target)) {
            syncApprovedLeave.clear(target);
        }
    }
};
const withSync = (state)=>({
        ...state,
        ...syncAwareActions
    });
const useLeaveStore = ()=>withSync(baseStore());
useLeaveStore.getState = ()=>withSync(baseStore.getState());
}),
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
"[project]/features/inventory-receipts/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "syncInventoryReceiptsWithPurchaseOrders",
    ()=>syncInventoryReceiptsWithPurchaseOrders,
    "useInventoryReceiptStore",
    ()=>useInventoryReceiptStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/products/store.ts [app-ssr] (ecmascript)");
;
;
const baseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createCrudStore"])([], 'inventory-receipts', {
    apiEndpoint: '/api/inventory-receipts'
});
const addReceipt = (item)=>{
    const newItem = baseStore.getState().add(item);
    // Update last purchase price for all items in the receipt
    const productStore = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState();
    newItem.items.forEach((item)=>{
        if (item.productSystemId && item.unitPrice > 0) {
            productStore.updateLastPurchasePrice(item.productSystemId, item.unitPrice, newItem.receivedDate);
        }
    });
    return newItem;
};
const updateReceipt = (systemId, updates)=>{
    baseStore.getState().update(systemId, updates);
    // Update last purchase price if items or date changed
    if (updates.items || updates.receivedDate) {
        const updatedReceipt = baseStore.getState().findById(systemId);
        if (updatedReceipt) {
            const productStore = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState();
            updatedReceipt.items.forEach((item)=>{
                if (item.productSystemId && item.unitPrice > 0) {
                    productStore.updateLastPurchasePrice(item.productSystemId, item.unitPrice, updatedReceipt.receivedDate);
                }
            });
        }
    }
};
const useInventoryReceiptStore = ()=>{
    const state = baseStore();
    return {
        ...state,
        add: addReceipt,
        update: updateReceipt
    };
};
useInventoryReceiptStore.getState = ()=>{
    const state = baseStore.getState();
    return {
        ...state,
        add: addReceipt,
        update: updateReceipt
    };
};
useInventoryReceiptStore.subscribe = baseStore.subscribe;
useInventoryReceiptStore.setState = baseStore.setState;
const normalizeKey = (value)=>value ? value.trim().toLowerCase() : '';
const buildLookup = (entries, extraKeys)=>{
    const bySystemId = new Map();
    const byAnyKey = new Map();
    entries.forEach((entry)=>{
        const systemKey = normalizeKey(entry.systemId);
        const businessKey = normalizeKey(entry.id);
        if (systemKey) {
            bySystemId.set(systemKey, entry);
            byAnyKey.set(systemKey, entry);
        }
        if (businessKey) {
            byAnyKey.set(businessKey, entry);
        }
        (extraKeys?.(entry) ?? []).forEach((key)=>{
            const normalized = normalizeKey(key);
            if (normalized) {
                byAnyKey.set(normalized, entry);
            }
        });
    });
    return {
        bySystemId,
        byAnyKey
    };
};
const matchProduct = (item, lookup)=>{
    const candidates = [
        item.productSystemId,
        item.productId,
        item.productName
    ];
    for (const candidate of candidates){
        const normalized = normalizeKey(candidate);
        if (!normalized) continue;
        const product = lookup.get(normalized);
        if (product) {
            return product;
        }
    }
    return undefined;
};
function syncInventoryReceiptsWithPurchaseOrders({ purchaseOrders, products }) {
    if (!purchaseOrders.length) return;
    const poLookup = buildLookup(purchaseOrders, (po)=>[
            po.id
        ]);
    const productLookup = buildLookup(products ?? [], (product)=>[
            product.id,
            product.sku,
            product.name
        ]);
    const storeState = useInventoryReceiptStore.getState();
    const updated = storeState.data.map((receipt)=>{
        let next = receipt;
        const matchedPo = poLookup.bySystemId.get(normalizeKey(receipt.purchaseOrderSystemId)) || poLookup.byAnyKey.get(normalizeKey(receipt.purchaseOrderId));
        if (!matchedPo) {
            return receipt;
        }
        const updates = {};
        let mutated = false;
        if (receipt.purchaseOrderSystemId !== matchedPo.systemId) {
            updates.purchaseOrderSystemId = matchedPo.systemId;
            mutated = true;
        }
        if (receipt.purchaseOrderId !== matchedPo.id) {
            updates.purchaseOrderId = matchedPo.id;
            mutated = true;
        }
        if (matchedPo.branchSystemId && receipt.branchSystemId !== matchedPo.branchSystemId) {
            updates.branchSystemId = matchedPo.branchSystemId;
            mutated = true;
        }
        if (matchedPo.branchName && receipt.branchName !== matchedPo.branchName) {
            updates.branchName = matchedPo.branchName;
            mutated = true;
        }
        if (matchedPo.supplierSystemId && receipt.supplierSystemId !== matchedPo.supplierSystemId) {
            updates.supplierSystemId = matchedPo.supplierSystemId;
            mutated = true;
        }
        if (matchedPo.supplierName && receipt.supplierName !== matchedPo.supplierName) {
            updates.supplierName = matchedPo.supplierName;
            mutated = true;
        }
        if (products?.length) {
            const normalizedItems = next.items.map((item)=>{
                const matchedProduct = matchProduct(item, productLookup.byAnyKey);
                if (!matchedProduct) {
                    return item;
                }
                if (item.productSystemId === matchedProduct.systemId && item.productId === matchedProduct.id && item.productName === matchedProduct.name) {
                    return item;
                }
                mutated = true;
                return {
                    ...item,
                    productSystemId: matchedProduct.systemId,
                    productId: matchedProduct.id,
                    productName: matchedProduct.name
                };
            });
            const itemsChanged = normalizedItems.some((item, index)=>item !== next.items[index]);
            if (itemsChanged) {
                updates.items = normalizedItems;
            }
        }
        return mutated ? {
            ...next,
            ...updates
        } : receipt;
    });
    const hasChanges = updated.some((receipt, index)=>receipt !== storeState.data[index]);
    if (hasChanges) {
        baseStore.setState({
            data: updated
        });
    }
}
}),
"[project]/features/purchase-returns/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePurchaseReturnStore",
    ()=>usePurchaseReturnStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/products/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$stock$2d$history$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/stock-history/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$receipts$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/receipts/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$purchase$2d$orders$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/purchase-orders/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$cashbook$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/cashbook/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$receipt$2d$types$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/receipt-types/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$inventory$2d$receipts$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/inventory-receipts/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
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
const baseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createCrudStore"])([], 'purchase-returns', {
    apiEndpoint: '/api/purchase-returns'
});
const originalAdd = baseStore.getState().add;
const newAdd = (item)=>{
    // 1. Get other stores' methods
    const { updateInventory } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState();
    const { addEntry: addStockHistory } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$stock$2d$history$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStockHistoryStore"].getState();
    const { add: addReceipt } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$receipts$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useReceiptStore"].getState();
    const { processReturn: updatePOonReturn, data: allPOs } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$purchase$2d$orders$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePurchaseOrderStore"].getState();
    const { accounts } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$cashbook$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCashbookStore"].getState();
    const { data: receiptTypes } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$receipt$2d$types$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useReceiptTypeStore"].getState();
    const { data: allReceipts } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$inventory$2d$receipts$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useInventoryReceiptStore"].getState();
    // 2. Add the return record itself
    const newReturn = originalAdd(item);
    if (!newReturn) {
        return undefined;
    }
    // 3. Update inventory & create stock history
    newReturn.items.forEach((lineItem)=>{
        if (lineItem.returnQuantity > 0) {
            const productBeforeUpdate = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState().findById(lineItem.productSystemId);
            const oldStock = productBeforeUpdate?.inventoryByBranch[newReturn.branchSystemId] || 0;
            updateInventory(lineItem.productSystemId, newReturn.branchSystemId, -lineItem.returnQuantity);
            addStockHistory({
                productId: lineItem.productSystemId,
                date: new Date().toISOString(),
                employeeName: newReturn.creatorName,
                action: 'Hoàn trả NCC',
                quantityChange: -lineItem.returnQuantity,
                newStockLevel: oldStock - lineItem.returnQuantity,
                documentId: newReturn.id,
                branchSystemId: newReturn.branchSystemId,
                branch: newReturn.branchName
            });
        }
    });
    // 4. Create receipt when supplier refunds money (supplier pays company)
    if (newReturn.refundAmount > 0) {
        const receiptCategory = receiptTypes.find((pt)=>pt.name === 'Nhà cung cấp hoàn tiền');
        if (newReturn.accountSystemId) {
            const account = accounts.find((acc)=>acc.systemId === newReturn.accountSystemId);
            const issuedAt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDateCustom"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentDate"])(), 'yyyy-MM-dd HH:mm');
            const refundReceipt = {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(''),
                date: issuedAt,
                amount: newReturn.refundAmount,
                // Payer info (TargetGroup placeholder)
                payerTypeSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('NHACUNGCAP'),
                payerTypeName: 'Nhà cung cấp',
                payerName: newReturn.supplierName,
                payerSystemId: newReturn.supplierSystemId,
                description: `Nhận hoàn tiền cho đơn nhập ${newReturn.purchaseOrderId} (Phiếu trả hàng ${newReturn.id})`,
                // Payment method placeholders — should map to settings
                paymentMethodSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(account?.type === 'cash' ? 'PAYMENT_METHOD_CASH' : 'PAYMENT_METHOD_BANK'),
                paymentMethodName: newReturn.refundMethod,
                accountSystemId: newReturn.accountSystemId,
                paymentReceiptTypeSystemId: receiptCategory?.systemId ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('RT_SUPPLIER_REFUND'),
                paymentReceiptTypeName: receiptCategory?.name ?? 'Nhà cung cấp hoàn tiền',
                branchSystemId: newReturn.branchSystemId,
                branchName: newReturn.branchName,
                createdBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SYSTEM'),
                createdAt: issuedAt,
                status: 'completed',
                category: 'other',
                affectsDebt: true,
                purchaseOrderSystemId: newReturn.purchaseOrderSystemId,
                purchaseOrderId: newReturn.purchaseOrderId,
                originalDocumentId: newReturn.id
            };
            addReceipt(refundReceipt);
        }
    }
    // 5. Update the original Purchase Order's status
    const po = allPOs.find((p)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(p.systemId) === newReturn.purchaseOrderSystemId);
    if (po) {
        // A full check would require summing all returns for this PO.
        const allItems = po.lineItems;
        const poSystemId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(po.systemId);
        const allReturnedItems = baseStore.getState().data.filter((pr)=>pr.purchaseOrderSystemId === poSystemId).flatMap((pr)=>pr.items);
        const receiptsForPO = allReceipts.filter((r)=>r.purchaseOrderSystemId === poSystemId);
        const isFullReturn = allItems.every((poItem)=>{
            const totalReceived = receiptsForPO.reduce((sum, receipt)=>{
                const receiptItem = receipt.items.find((i)=>i.productSystemId === poItem.productSystemId);
                return sum + (receiptItem ? Number(receiptItem.receivedQuantity) : 0);
            }, 0);
            const totalReturned = allReturnedItems.filter((returnedItem)=>returnedItem.productSystemId === poItem.productSystemId).reduce((sum, returnedItem)=>sum + returnedItem.returnQuantity, 0);
            return totalReturned >= totalReceived;
        });
        const existingReturnsForPO = baseStore.getState().data.filter((pr)=>pr.purchaseOrderSystemId === poSystemId && pr.systemId !== newReturn.systemId);
        const allReturnsForPO = [
            ...existingReturnsForPO,
            newReturn
        ];
        const totalReturnedValue = allReturnsForPO.reduce((sum, r)=>sum + r.totalReturnValue, 0);
        const totalRefunded = allReturnsForPO.reduce((sum, r)=>sum + r.refundAmount, 0);
        let newRefundStatus = po.refundStatus || 'Chưa hoàn tiền';
        if (totalReturnedValue > 0) {
            if (totalRefunded >= totalReturnedValue) {
                newRefundStatus = 'Hoàn tiền toàn bộ';
            } else if (totalRefunded > 0) {
                newRefundStatus = 'Hoàn tiền một phần';
            } else {
                newRefundStatus = 'Chưa hoàn tiền';
            }
        }
        updatePOonReturn(po.id, isFullReturn, newRefundStatus, newReturn.id, newReturn.creatorName);
    }
    return newReturn;
};
const otherMethods = {
    findByPurchaseOrderSystemId: (purchaseOrderSystemId)=>{
        return baseStore.getState().data.filter((pr)=>pr.purchaseOrderSystemId === purchaseOrderSystemId);
    }
};
const usePurchaseReturnStore = ()=>{
    const { add: _unusedAdd, ...rest } = baseStore();
    return {
        ...rest,
        add: newAdd,
        ...otherMethods
    };
};
usePurchaseReturnStore.getState = ()=>{
    const { add: _unusedAdd, ...rest } = baseStore.getState();
    return {
        ...rest,
        add: newAdd,
        ...otherMethods
    };
};
}),
"[project]/features/purchase-orders/payment-utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getPaymentsForPurchaseOrder",
    ()=>getPaymentsForPurchaseOrder,
    "getReceiptsForPurchaseOrder",
    ()=>getReceiptsForPurchaseOrder,
    "isPaymentLinkedToPurchaseOrder",
    ()=>isPaymentLinkedToPurchaseOrder,
    "isReceiptLinkedToPurchaseOrder",
    ()=>isReceiptLinkedToPurchaseOrder,
    "sumPaymentsForPurchaseOrder",
    ()=>sumPaymentsForPurchaseOrder
]);
const SUPPLIER_TARGET_IDS = [
    'NHACUNGCAP',
    'supplier'
];
const SUPPLIER_TARGET_LABELS = [
    'Nhà cung cấp'
];
const isPaymentLinkedToPurchaseOrder = (payment, purchaseOrder)=>{
    if (!payment || !purchaseOrder) {
        return false;
    }
    if (payment.purchaseOrderSystemId) {
        return payment.purchaseOrderSystemId === purchaseOrder.systemId;
    }
    if (payment.originalDocumentId) {
        return payment.originalDocumentId === purchaseOrder.systemId || payment.originalDocumentId === purchaseOrder.id;
    }
    const isSupplierTarget = payment.recipientTypeSystemId && SUPPLIER_TARGET_IDS.includes(payment.recipientTypeSystemId) || payment.recipientTypeName && SUPPLIER_TARGET_LABELS.includes(payment.recipientTypeName);
    if (isSupplierTarget && payment.recipientSystemId && payment.recipientSystemId === purchaseOrder.supplierSystemId) {
        return true;
    }
    return false;
};
const getPaymentsForPurchaseOrder = (payments, purchaseOrder)=>{
    if (!Array.isArray(payments) || !purchaseOrder) {
        return [];
    }
    return payments.filter((payment)=>isPaymentLinkedToPurchaseOrder(payment, purchaseOrder));
};
const sumPaymentsForPurchaseOrder = (payments, purchaseOrder)=>{
    return getPaymentsForPurchaseOrder(payments, purchaseOrder).reduce((sum, payment)=>sum + (payment.amount || 0), 0);
};
const isReceiptLinkedToPurchaseOrder = (receipt, purchaseOrder)=>{
    if (!receipt || !purchaseOrder) {
        return false;
    }
    if (receipt.purchaseOrderSystemId) {
        return receipt.purchaseOrderSystemId === purchaseOrder.systemId;
    }
    if (receipt.originalDocumentId) {
        return receipt.originalDocumentId === purchaseOrder.systemId || receipt.originalDocumentId === purchaseOrder.id;
    }
    const isSupplierTarget = receipt.payerTypeSystemId && SUPPLIER_TARGET_IDS.includes(receipt.payerTypeSystemId) || receipt.payerTypeName && SUPPLIER_TARGET_LABELS.includes(receipt.payerTypeName);
    if (isSupplierTarget && receipt.payerSystemId && receipt.payerSystemId === purchaseOrder.supplierSystemId) {
        return true;
    }
    return false;
};
const getReceiptsForPurchaseOrder = (receipts, purchaseOrder)=>{
    if (!Array.isArray(receipts) || !purchaseOrder) {
        return [];
    }
    return receipts.filter((receipt)=>isReceiptLinkedToPurchaseOrder(receipt, purchaseOrder));
};
}),
"[project]/features/purchase-orders/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePurchaseOrderStore",
    ()=>usePurchaseOrderStore
]);
// REMOVED: Voucher store no longer exists
// import { useVoucherStore } from '../vouchers/store';
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$inventory$2d$receipts$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/inventory-receipts/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$payments$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/payments/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$receipts$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/receipts/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/employees/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$purchase$2d$returns$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/purchase-returns/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$cashbook$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/cashbook/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$receipt$2d$types$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/receipt-types/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$purchase$2d$orders$2f$payment$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/purchase-orders/payment-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/products/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
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
// REMOVED: initialDataOmit transformation - database is source of truth
const initialData = [];
const baseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createCrudStore"])([], 'purchase-orders', {
    businessIdField: 'id',
    apiEndpoint: '/api/purchase-orders'
});
const runInventoryReceiptBackfill = ()=>{
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$inventory$2d$receipts$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["syncInventoryReceiptsWithPurchaseOrders"])({
        purchaseOrders: baseStore.getState().data,
        products: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState().data
    });
};
runInventoryReceiptBackfill();
// Re-run backfill whenever purchase orders or products hydrate/update
baseStore.subscribe?.(()=>{
    runInventoryReceiptBackfill();
});
__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].subscribe?.(()=>{
    runInventoryReceiptBackfill();
});
// Helper functions for ActivityHistory
const getCurrentUserInfo = ()=>{
    const employees = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmployeeStore"].getState().data;
    // Fallback to system user
    return {
        systemId: 'SYSTEM',
        name: 'Hệ thống'
    };
};
const createHistoryEntry = (action, description, user, metadata)=>({
        id: crypto.randomUUID(),
        action,
        timestamp: new Date(),
        user: {
            systemId: user.systemId,
            name: user.name
        },
        description,
        metadata
    });
const augmentedMethods = {
    addPayment: (purchaseOrderId, payment)=>baseStore.setState((state)=>{
            const { data: allReturns } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$purchase$2d$returns$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePurchaseReturnStore"].getState();
            const newData = state.data.map((po)=>{
                if (po.systemId === purchaseOrderId) {
                    const poSystemId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(po.systemId);
                    const newPayment = {
                        ...payment,
                        id: `PAY_${po.id}_${(po.payments || []).length + 1}`
                    };
                    const updatedPayments = [
                        ...po.payments || [],
                        newPayment
                    ];
                    const totalPaid = updatedPayments.reduce((sum, p)=>sum + p.amount, 0);
                    const totalReturnedValue = allReturns.filter((r)=>r.purchaseOrderSystemId === poSystemId).reduce((sum, r)=>sum + r.totalReturnValue, 0);
                    const actualDebt = po.grandTotal - totalReturnedValue;
                    let newPaymentStatus;
                    if (totalPaid >= actualDebt) {
                        newPaymentStatus = 'Đã thanh toán';
                    } else if (totalPaid > 0) {
                        newPaymentStatus = 'Thanh toán một phần';
                    } else {
                        newPaymentStatus = 'Chưa thanh toán';
                    }
                    let newStatus = po.status;
                    if (po.status !== 'Đã hủy' && po.status !== 'Kết thúc') {
                        // Hoàn thành: đã nhập hết + đã thanh toán hết
                        if (po.deliveryStatus === 'Đã nhập' && newPaymentStatus === 'Đã thanh toán') {
                            newStatus = 'Hoàn thành';
                        } else if (po.deliveryStatus === 'Chưa nhập' && newPaymentStatus === 'Chưa thanh toán') {
                            newStatus = 'Đặt hàng';
                        } else {
                            newStatus = 'Đang giao dịch';
                        }
                    }
                    return {
                        ...po,
                        payments: updatedPayments,
                        paymentStatus: newPaymentStatus,
                        status: newStatus
                    };
                }
                return po;
            });
            return {
                data: newData
            };
        }),
    updatePaymentStatusForPoIds: (poIds)=>{
        baseStore.setState((state)=>{
            const { data: allPayments } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$payments$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePaymentStore"].getState();
            const { data: allReturns } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$purchase$2d$returns$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePurchaseReturnStore"].getState();
            const uniquePoIds = [
                ...new Set(poIds)
            ];
            const newData = [
                ...state.data
            ];
            let changed = false;
            uniquePoIds.forEach((poId)=>{
                const poIndex = newData.findIndex((p)=>p.id === poId);
                if (poIndex === -1) return;
                const po = newData[poIndex];
                const poSystemId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(po.systemId);
                const totalPaid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$purchase$2d$orders$2f$payment$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sumPaymentsForPurchaseOrder"])(allPayments, po);
                const totalReturnedValue = allReturns.filter((r)=>r.purchaseOrderSystemId === poSystemId).reduce((sum, r)=>sum + r.totalReturnValue, 0);
                const actualDebt = po.grandTotal - totalReturnedValue;
                let newPaymentStatus;
                if (totalPaid >= actualDebt) {
                    newPaymentStatus = 'Đã thanh toán';
                } else if (totalPaid > 0) {
                    newPaymentStatus = 'Thanh toán một phần';
                } else {
                    newPaymentStatus = 'Chưa thanh toán';
                }
                let newStatus = po.status;
                if (po.status !== 'Đã hủy' && po.status !== 'Kết thúc') {
                    // Hoàn thành: đã nhập hết + đã thanh toán hết
                    if (po.deliveryStatus === 'Đã nhập' && newPaymentStatus === 'Đã thanh toán') {
                        newStatus = 'Hoàn thành';
                    } else if (po.deliveryStatus === 'Chưa nhập' && newPaymentStatus === 'Chưa thanh toán') {
                        newStatus = 'Đặt hàng';
                    } else {
                        newStatus = 'Đang giao dịch';
                    }
                }
                if (po.paymentStatus !== newPaymentStatus || po.status !== newStatus) {
                    newData[poIndex] = {
                        ...po,
                        paymentStatus: newPaymentStatus,
                        status: newStatus
                    };
                    changed = true;
                }
            });
            return changed ? {
                data: newData
            } : state;
        });
    },
    processInventoryReceipt: (purchaseOrderSystemId)=>{
        baseStore.setState((state)=>{
            const { data: allReceipts } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$inventory$2d$receipts$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useInventoryReceiptStore"].getState();
            const poIndex = state.data.findIndex((p)=>p.systemId === purchaseOrderSystemId);
            if (poIndex === -1) return state;
            const po = state.data[poIndex];
            const poReceipts = allReceipts.filter((r)=>r.purchaseOrderSystemId === purchaseOrderSystemId);
            const totalReceivedByProduct = po.lineItems.reduce((acc, lineItem)=>{
                const totalReceived = poReceipts.reduce((sum, receipt)=>{
                    const item = receipt.items.find((i)=>i.productSystemId === lineItem.productSystemId);
                    return sum + (item ? Number(item.receivedQuantity) : 0);
                }, 0);
                acc[lineItem.productSystemId] = totalReceived;
                return acc;
            }, {});
            const allItemsFullyReceived = po.lineItems.every((item)=>(totalReceivedByProduct[item.productSystemId] || 0) >= item.quantity);
            const anyItemReceived = Object.values(totalReceivedByProduct).some((qty)=>qty > 0);
            let newDeliveryStatus;
            if (allItemsFullyReceived) {
                newDeliveryStatus = 'Đã nhập';
            } else if (anyItemReceived) {
                newDeliveryStatus = 'Đã nhập một phần';
            } else {
                newDeliveryStatus = 'Chưa nhập';
            }
            let newStatus = po.status;
            // Chỉ tự động cập nhật status nếu KHÔNG phải trạng thái terminal
            if (po.status !== 'Đã hủy' && po.status !== 'Kết thúc') {
                // Hoàn thành: đã nhập hết + đã thanh toán hết
                if (newDeliveryStatus === 'Đã nhập' && po.paymentStatus === 'Đã thanh toán') {
                    newStatus = 'Hoàn thành';
                } else if (newDeliveryStatus === 'Chưa nhập' && po.paymentStatus === 'Chưa thanh toán') {
                    newStatus = 'Đặt hàng';
                } else {
                    newStatus = 'Đang giao dịch';
                }
            }
            if (po.deliveryStatus !== newDeliveryStatus || po.status !== newStatus) {
                const newData = [
                    ...state.data
                ];
                const updatedPO = {
                    ...po,
                    deliveryStatus: newDeliveryStatus,
                    status: newStatus
                };
                if (po.deliveryStatus === 'Chưa nhập' && newDeliveryStatus !== 'Chưa nhập') {
                    const latestReceipt = poReceipts.sort((a, b)=>new Date(b.receivedDate).getTime() - new Date(a.receivedDate).getTime())[0];
                    if (latestReceipt) {
                        updatedPO.deliveryDate = latestReceipt.receivedDate;
                    }
                }
                newData[poIndex] = updatedPO;
                const latestReceipt = poReceipts.sort((a, b)=>new Date(b.receivedDate).getTime() - new Date(a.receivedDate).getTime())[0];
                const receiptReceiverName = latestReceipt?.receiverName || 'Hệ thống';
                const user = latestReceipt?.receiverSystemId ? __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmployeeStore"].getState().data.find((e)=>e.systemId === latestReceipt.receiverSystemId) : __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmployeeStore"].getState().data.find((e)=>e.fullName === receiptReceiverName);
                // Add to activityHistory
                const historyEntry = createHistoryEntry('status_changed', `Cập nhật trạng thái giao hàng thành "${newDeliveryStatus}" thông qua phiếu nhập kho ${latestReceipt.id}.`, {
                    systemId: user?.systemId || 'SYSTEM',
                    name: receiptReceiverName
                }, {
                    oldValue: po.deliveryStatus,
                    newValue: newDeliveryStatus,
                    field: 'deliveryStatus'
                });
                newData[poIndex] = {
                    ...updatedPO,
                    activityHistory: [
                        ...updatedPO.activityHistory || [],
                        historyEntry
                    ]
                };
                return {
                    data: newData
                };
            }
            return state;
        });
    },
    processReturn: (purchaseOrderId, isFullReturn, newRefundStatus, returnId, creatorName)=>baseStore.setState((state)=>{
            const poIndex = state.data.findIndex((p)=>p.id === purchaseOrderId);
            if (poIndex === -1) return state;
            const po = state.data[poIndex];
            let newReturnStatus = 'Hoàn hàng một phần';
            if (isFullReturn) {
                newReturnStatus = 'Hoàn hàng toàn bộ';
            }
            // QUAN TRỌNG: Không đè status thành "Đã trả hàng"
            // Chỉ cập nhật returnStatus, giữ nguyên status chính (Hoàn thành, Đang giao dịch, etc.)
            // Logic tự động sẽ xử lý status dựa trên deliveryStatus + paymentStatus
            const updatedPO = {
                ...po,
                returnStatus: newReturnStatus,
                // Bỏ dòng: status: newStatus,  
                ...newRefundStatus && {
                    refundStatus: newRefundStatus
                }
            };
            if (returnId && creatorName) {
                const user = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmployeeStore"].getState().data.find((e)=>e.fullName === creatorName);
                // Add to activityHistory
                const historyEntry = createHistoryEntry('status_changed', `Tạo phiếu hoàn trả ${returnId}, cập nhật trạng thái hoàn trả đơn hàng.`, {
                    systemId: user?.systemId || 'SYSTEM',
                    name: creatorName
                }, {
                    oldValue: po.returnStatus || 'Chưa hoàn trả',
                    newValue: newReturnStatus,
                    field: 'returnStatus'
                });
                updatedPO.activityHistory = [
                    ...updatedPO.activityHistory || [],
                    historyEntry
                ];
            }
            const newData = [
                ...state.data
            ];
            newData[poIndex] = updatedPO;
            return {
                data: newData
            };
        }),
    syncAllPurchaseOrderStatuses: ()=>baseStore.setState((state)=>{
            const { data: allPayments } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$payments$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePaymentStore"].getState();
            const { data: allReturns } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$purchase$2d$returns$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePurchaseReturnStore"].getState();
            const newData = state.data.map((po_untyped)=>{
                const po = po_untyped;
                const poSystemId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(po.systemId);
                const totalPaid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$purchase$2d$orders$2f$payment$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sumPaymentsForPurchaseOrder"])(allPayments, po);
                const totalReturnedValue = allReturns.filter((r)=>r.purchaseOrderSystemId === poSystemId).reduce((sum, r)=>sum + r.totalReturnValue, 0);
                const actualDebt = po.grandTotal - totalReturnedValue;
                let newPaymentStatus;
                if (totalPaid >= actualDebt) {
                    newPaymentStatus = 'Đã thanh toán';
                } else if (totalPaid > 0) {
                    newPaymentStatus = 'Thanh toán một phần';
                } else {
                    newPaymentStatus = 'Chưa thanh toán';
                }
                let newStatus = po.status;
                // Chỉ tự động cập nhật status nếu KHÔNG phải trạng thái terminal (Đã hủy, Kết thúc)
                // Bỏ check "Đã trả hàng" vì đây không còn là status chính nữa
                if (po.status !== 'Đã hủy' && po.status !== 'Kết thúc') {
                    // Hoàn thành: đã nhập hết + đã thanh toán hết
                    if (po.deliveryStatus === 'Đã nhập' && newPaymentStatus === 'Đã thanh toán') {
                        newStatus = 'Hoàn thành';
                    } else if (po.deliveryStatus === 'Chưa nhập' && newPaymentStatus === 'Chưa thanh toán') {
                        newStatus = 'Đặt hàng';
                    } else {
                        newStatus = 'Đang giao dịch';
                    }
                }
                if (po.paymentStatus !== newPaymentStatus || po.status !== newStatus) {
                    return {
                        ...po,
                        paymentStatus: newPaymentStatus,
                        status: newStatus
                    };
                }
                return po;
            });
            const hasChanged = newData.some((po, index)=>po !== state.data[index]);
            return hasChanged ? {
                data: newData
            } : state;
        }),
    finishOrder: (systemId, userId, userName)=>baseStore.setState((state)=>{
            const poIndex = state.data.findIndex((p)=>p.systemId === systemId);
            if (poIndex === -1) return state;
            const po = state.data[poIndex];
            if (po.status === 'Kết thúc' || po.status === 'Đã hủy') return state;
            // Add to activityHistory
            const historyEntry = createHistoryEntry('ended', `Đã kết thúc đơn hàng.`, {
                systemId: userId,
                name: userName
            }, {
                oldValue: po.status,
                newValue: 'Kết thúc',
                field: 'status'
            });
            const updatedPO = {
                ...po,
                status: 'Kết thúc',
                activityHistory: [
                    ...po.activityHistory || [],
                    historyEntry
                ]
            };
            const newData = [
                ...state.data
            ];
            newData[poIndex] = updatedPO;
            return {
                data: newData
            };
        }),
    cancelOrder: (systemId, userId, userName)=>baseStore.setState((state)=>{
            const po = state.data.find((p)=>p.systemId === systemId);
            if (!po || [
                'Hoàn thành',
                'Đã hủy',
                'Kết thúc'
            ].includes(po.status)) {
                console.warn(`Attempted to cancel an order with status: ${po?.status}`);
                return state;
            }
            const { data: allPayments } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$payments$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePaymentStore"].getState();
            const totalPaid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$purchase$2d$orders$2f$payment$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sumPaymentsForPurchaseOrder"])(allPayments, po);
            if (totalPaid > 0) {
                const { accounts } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$cashbook$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCashbookStore"].getState();
                const { data: receiptTypes } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$receipt$2d$types$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useReceiptTypeStore"].getState();
                const { add: addReceipt } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$receipts$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useReceiptStore"].getState();
                const refundCategory = receiptTypes.find((rt)=>rt.name === 'Nhà cung cấp hoàn tiền');
                const targetAccount = accounts.find((acc)=>acc.type === 'cash' && acc.branchSystemId === po.branchSystemId) || accounts.find((acc)=>acc.type === 'cash');
                if (refundCategory && targetAccount) {
                    const newReceipt = {
                        id: '',
                        date: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date()),
                        amount: totalPaid,
                        payerType: 'Nhà cung cấp',
                        payerTypeSystemId: 'NHACUNGCAP',
                        payerTypeName: 'Nhà cung cấp',
                        payerName: po.supplierName,
                        payerSystemId: po.supplierSystemId,
                        description: `Nhận hoàn tiền từ NCC cho đơn hàng ${po.id} bị hủy.`,
                        paymentMethod: 'Tiền mặt',
                        paymentMethodSystemId: 'CASH',
                        paymentMethodName: 'Tiền mặt',
                        accountSystemId: targetAccount.systemId,
                        paymentReceiptTypeSystemId: refundCategory.systemId,
                        paymentReceiptTypeName: refundCategory.name,
                        branchSystemId: po.branchSystemId,
                        branchName: po.branchName,
                        createdBy: userName,
                        createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date()),
                        status: 'completed',
                        category: 'other',
                        affectsDebt: true,
                        purchaseOrderSystemId: po.systemId,
                        purchaseOrderId: po.id,
                        originalDocumentId: po.id
                    };
                    addReceipt(newReceipt);
                } else {
                    console.error("Không thể tạo phiếu thu hoàn tiền: Thiếu loại phiếu 'Nhà cung cấp hoàn tiền' hoặc tài khoản quỹ tiền mặt.");
                }
            }
            // Add to activityHistory
            const historyEntry = createHistoryEntry('cancelled', `Đã hủy đơn hàng.`, {
                systemId: userId,
                name: userName
            }, {
                oldValue: po.status,
                newValue: 'Đã hủy',
                field: 'status'
            });
            const updatedPO = {
                ...po,
                status: 'Đã hủy',
                activityHistory: [
                    ...po.activityHistory || [],
                    historyEntry
                ]
            };
            return {
                data: state.data.map((item)=>item.systemId === systemId ? updatedPO : item)
            };
        }),
    bulkCancel: (systemIds, userId, userName)=>{
        systemIds.forEach((systemId)=>{
            augmentedMethods.cancelOrder(systemId, userId, userName);
        });
    },
    printPurchaseOrders: (systemIds)=>{
        // Placeholder for print functionality
        console.log('Printing purchase orders:', systemIds);
    // TODO: Implement actual print logic
    }
};
const usePurchaseOrderStore = ()=>{
    const state = baseStore();
    return {
        ...state,
        ...augmentedMethods
    };
};
// Export getState for non-hook usage
usePurchaseOrderStore.getState = ()=>{
    const state = baseStore.getState();
    return {
        ...state,
        ...augmentedMethods
    };
};
}),
];

//# sourceMappingURL=features_f4472818._.js.map