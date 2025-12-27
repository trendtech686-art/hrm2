(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/features/employees/store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "employeeRepository",
    ()=>employeeRepository,
    "useEmployeeStore",
    ()=>useEmployeeStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-client] (ecmascript)");
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
const baseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCrudStore"])([], 'employees', {
    businessIdField: 'id',
    getCurrentUser: __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentUserSystemId"],
    apiEndpoint: '/api/employees'
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
"[project]/features/employees/api/employees-api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Employees API - Isolated API functions
 * 
 * ⚠️ IMPORTANT: This file should ONLY contain:
 * - Fetch functions
 * - Type imports from ../types
 * - NO store imports
 * - NO cross-feature imports
 */ __turbopack_context__.s([
    "createEmployee",
    ()=>createEmployee,
    "deleteEmployee",
    ()=>deleteEmployee,
    "fetchEmployee",
    ()=>fetchEmployee,
    "fetchEmployees",
    ()=>fetchEmployees,
    "fetchEmployeesByBranch",
    ()=>fetchEmployeesByBranch,
    "fetchEmployeesByDepartment",
    ()=>fetchEmployeesByDepartment,
    "searchEmployees",
    ()=>searchEmployees,
    "updateEmployee",
    ()=>updateEmployee
]);
const API_BASE = '/api/employees';
async function fetchEmployees(params = {}) {
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
        throw new Error(`Failed to fetch employees: ${res.statusText}`);
    }
    return res.json();
}
async function fetchEmployee(id) {
    const res = await fetch(`${API_BASE}/${id}`, {
        credentials: 'include'
    });
    if (!res.ok) {
        throw new Error(`Failed to fetch employee ${id}: ${res.statusText}`);
    }
    return res.json();
}
async function createEmployee(data) {
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
        throw new Error(error.message || `Failed to create employee: ${res.statusText}`);
    }
    return res.json();
}
async function updateEmployee({ systemId, ...data }) {
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
        throw new Error(error.message || `Failed to update employee: ${res.statusText}`);
    }
    return res.json();
}
async function deleteEmployee(id) {
    const res = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    });
    if (!res.ok) {
        const error = await res.json().catch(()=>({}));
        throw new Error(error.message || `Failed to delete employee: ${res.statusText}`);
    }
}
async function searchEmployees(query, limit = 20) {
    const res = await fetch(`${API_BASE}?search=${encodeURIComponent(query)}&limit=${limit}`, {
        credentials: 'include'
    });
    if (!res.ok) {
        throw new Error(`Failed to search employees: ${res.statusText}`);
    }
    const json = await res.json();
    return json.data || [];
}
async function fetchEmployeesByDepartment(departmentId) {
    const res = await fetch(`${API_BASE}?departmentId=${departmentId}&limit=100`, {
        credentials: 'include'
    });
    if (!res.ok) {
        throw new Error(`Failed to fetch employees by department: ${res.statusText}`);
    }
    const json = await res.json();
    return json.data || [];
}
async function fetchEmployeesByBranch(branchId) {
    const res = await fetch(`${API_BASE}?branchId=${branchId}&limit=100`, {
        credentials: 'include'
    });
    if (!res.ok) {
        throw new Error(`Failed to fetch employees by branch: ${res.statusText}`);
    }
    const json = await res.json();
    return json.data || [];
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/employees/hooks/use-employees.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "employeeKeys",
    ()=>employeeKeys,
    "useActiveEmployees",
    ()=>useActiveEmployees,
    "useEmployee",
    ()=>useEmployee,
    "useEmployeeMutations",
    ()=>useEmployeeMutations,
    "useEmployeeSearch",
    ()=>useEmployeeSearch,
    "useEmployees",
    ()=>useEmployees,
    "useEmployeesByBranch",
    ()=>useEmployeesByBranch,
    "useEmployeesByDepartment",
    ()=>useEmployeesByDepartment,
    "usePrefetchEmployee",
    ()=>usePrefetchEmployee
]);
/**
 * useEmployees - React Query hooks for employees
 * 
 * ⚠️ IMPORTANT: Direct import pattern
 * - Import this file directly: import { useEmployees } from '@/features/employees/hooks/use-employees'
 * - NEVER import from '@/features/employees' or '@/features/employees/store'
 * 
 * This hook is ISOLATED - it only depends on:
 * - @tanstack/react-query
 * - Local API functions
 * - Local types
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/query-core/build/modern/utils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$api$2f$employees$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/employees/api/employees-api.ts [app-client] (ecmascript)");
// Re-export from use-all-employees for backward compatibility
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$hooks$2f$use$2d$all$2d$employees$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/employees/hooks/use-all-employees.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature(), _s6 = __turbopack_context__.k.signature(), _s7 = __turbopack_context__.k.signature();
;
;
const employeeKeys = {
    all: [
        'employees'
    ],
    lists: ()=>[
            ...employeeKeys.all,
            'list'
        ],
    list: (params)=>[
            ...employeeKeys.lists(),
            params
        ],
    details: ()=>[
            ...employeeKeys.all,
            'detail'
        ],
    detail: (id)=>[
            ...employeeKeys.details(),
            id
        ],
    search: (query)=>[
            ...employeeKeys.all,
            'search',
            query
        ],
    byDepartment: (id)=>[
            ...employeeKeys.all,
            'department',
            id
        ],
    byBranch: (id)=>[
            ...employeeKeys.all,
            'branch',
            id
        ]
};
function useEmployees(params = {}) {
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: employeeKeys.list(params),
        queryFn: {
            "useEmployees.useQuery": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$api$2f$employees$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchEmployees"])(params)
        }["useEmployees.useQuery"],
        staleTime: 60_000,
        gcTime: 10 * 60 * 1000,
        placeholderData: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["keepPreviousData"]
    });
}
_s(useEmployees, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useEmployee(id) {
    _s1();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: employeeKeys.detail(id),
        queryFn: {
            "useEmployee.useQuery": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$api$2f$employees$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchEmployee"])(id)
        }["useEmployee.useQuery"],
        enabled: !!id,
        staleTime: 60_000,
        gcTime: 10 * 60 * 1000
    });
}
_s1(useEmployee, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useEmployeeSearch(query, limit = 20) {
    _s2();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: employeeKeys.search(query),
        queryFn: {
            "useEmployeeSearch.useQuery": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$api$2f$employees$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["searchEmployees"])(query, limit)
        }["useEmployeeSearch.useQuery"],
        enabled: query.length >= 2,
        staleTime: 30_000
    });
}
_s2(useEmployeeSearch, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useEmployeesByDepartment(departmentId) {
    _s3();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: employeeKeys.byDepartment(departmentId),
        queryFn: {
            "useEmployeesByDepartment.useQuery": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$api$2f$employees$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchEmployeesByDepartment"])(departmentId)
        }["useEmployeesByDepartment.useQuery"],
        enabled: !!departmentId,
        staleTime: 60_000
    });
}
_s3(useEmployeesByDepartment, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useEmployeesByBranch(branchId) {
    _s4();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: employeeKeys.byBranch(branchId),
        queryFn: {
            "useEmployeesByBranch.useQuery": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$api$2f$employees$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchEmployeesByBranch"])(branchId)
        }["useEmployeesByBranch.useQuery"],
        enabled: !!branchId,
        staleTime: 60_000
    });
}
_s4(useEmployeesByBranch, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useEmployeeMutations(options = {}) {
    _s5();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const create = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$api$2f$employees$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createEmployee"],
        onSuccess: {
            "useEmployeeMutations.useMutation[create]": (data)=>{
                queryClient.invalidateQueries({
                    queryKey: employeeKeys.lists()
                });
                options.onCreateSuccess?.(data);
            }
        }["useEmployeeMutations.useMutation[create]"],
        onError: options.onError
    });
    const update = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$api$2f$employees$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateEmployee"],
        onSuccess: {
            "useEmployeeMutations.useMutation[update]": (data, variables)=>{
                queryClient.invalidateQueries({
                    queryKey: employeeKeys.detail(variables.systemId)
                });
                queryClient.invalidateQueries({
                    queryKey: employeeKeys.lists()
                });
                options.onUpdateSuccess?.(data);
            }
        }["useEmployeeMutations.useMutation[update]"],
        onError: options.onError
    });
    const remove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$api$2f$employees$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteEmployee"],
        onSuccess: {
            "useEmployeeMutations.useMutation[remove]": ()=>{
                queryClient.invalidateQueries({
                    queryKey: employeeKeys.all
                });
                options.onDeleteSuccess?.();
            }
        }["useEmployeeMutations.useMutation[remove]"],
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
_s5(useEmployeeMutations, "JxOfJjdyCQxYamNcDrzBiezg78E=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useActiveEmployees(params = {}) {
    _s6();
    return useEmployees({
        ...params,
        status: 'active'
    });
}
_s6(useActiveEmployees, "ZKJodnfpUN3BzYCJ+1ImVugjonI=", false, function() {
    return [
        useEmployees
    ];
});
function usePrefetchEmployee() {
    _s7();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (id)=>{
        queryClient.prefetchQuery({
            queryKey: employeeKeys.detail(id),
            queryFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$api$2f$employees$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchEmployee"])(id),
            staleTime: 60_000
        });
    };
}
_s7(usePrefetchEmployee, "4R+oYVB2Uc11P7bp1KcuhpkfaTw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"]
    ];
});
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/employees/hooks/use-all-employees.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAllEmployees",
    ()=>useAllEmployees,
    "useEmployeeFinder",
    ()=>useEmployeeFinder,
    "useEmployeeOptions",
    ()=>useEmployeeOptions,
    "useEmployeeSearcher",
    ()=>useEmployeeSearcher
]);
/**
 * useAllEmployees - Convenience hook for components needing all employees as flat array
 * 
 * Use case: Dropdowns, selects, comboboxes that need all employees for selection
 * 
 * ⚠️ For paginated views, use useEmployees() instead
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$hooks$2f$use$2d$employees$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/features/employees/hooks/use-employees.ts [app-client] (ecmascript) <locals>");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature();
;
;
function useAllEmployees() {
    _s();
    const query = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$hooks$2f$use$2d$employees$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useEmployees"])({
        limit: 30
    });
    return {
        data: query.data?.data || [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error
    };
}
_s(useAllEmployees, "B9e30hqZbf6UAK8zWgAqRt+CumM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$hooks$2f$use$2d$employees$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useEmployees"]
    ];
});
function useEmployeeOptions() {
    _s1();
    const { data, isLoading } = useAllEmployees();
    const options = data.map((e)=>({
            value: e.systemId,
            label: e.fullName
        }));
    return {
        options,
        isLoading
    };
}
_s1(useEmployeeOptions, "UwDi4hE/SAywiDQYk7L3NhC+Fa4=", false, function() {
    return [
        useAllEmployees
    ];
});
function useEmployeeFinder() {
    _s2();
    const { data } = useAllEmployees();
    const findById = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "useEmployeeFinder.useCallback[findById]": (systemId)=>{
            if (!systemId) return undefined;
            return data.find({
                "useEmployeeFinder.useCallback[findById]": (e)=>e.systemId === systemId
            }["useEmployeeFinder.useCallback[findById]"]);
        }
    }["useEmployeeFinder.useCallback[findById]"], [
        data
    ]);
    return {
        findById
    };
}
_s2(useEmployeeFinder, "2QCkJ/NgAJS1kqJBv0CBNXKtGGY=", false, function() {
    return [
        useAllEmployees
    ];
});
function useEmployeeSearcher() {
    _s3();
    const { data } = useAllEmployees();
    const searchEmployees = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "useEmployeeSearcher.useCallback[searchEmployees]": async (query, _page = 0, limit = 100)=>{
            const lowerQuery = query.toLowerCase();
            const filtered = data.filter({
                "useEmployeeSearcher.useCallback[searchEmployees].filtered": (e)=>e.fullName?.toLowerCase().includes(lowerQuery) || e.id?.toLowerCase().includes(lowerQuery) || e.phone?.includes(query)
            }["useEmployeeSearcher.useCallback[searchEmployees].filtered"]);
            return {
                items: filtered.slice(0, limit).map({
                    "useEmployeeSearcher.useCallback[searchEmployees]": (e)=>({
                            value: e.systemId,
                            label: e.fullName || e.id || 'N/A'
                        })
                }["useEmployeeSearcher.useCallback[searchEmployees]"]),
                total: filtered.length
            };
        }
    }["useEmployeeSearcher.useCallback[searchEmployees]"], [
        data
    ]);
    return {
        searchEmployees
    };
}
_s3(useEmployeeSearcher, "0Sy3BETrITINXgdXux2sX8zBj8c=", false, function() {
    return [
        useAllEmployees
    ];
});
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
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/fuse.js/dist/fuse.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/activity-history-helper.ts [app-client] (ecmascript)");
;
;
;
;
;
const baseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCrudStore"])([], 'products', {
    businessIdField: 'id',
    getCurrentUser: __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentUserSystemId"],
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
"[project]/features/products/combo-utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/products/api/products-api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/products/hooks/use-products.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/query-core/build/modern/utils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$api$2f$products$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/products/api/products-api.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature(), _s6 = __turbopack_context__.k.signature(), _s7 = __turbopack_context__.k.signature();
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
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: productKeys.list(params),
        queryFn: {
            "useProducts.useQuery": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$api$2f$products$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchProducts"])(params)
        }["useProducts.useQuery"],
        staleTime: 60_000,
        gcTime: 10 * 60 * 1000,
        placeholderData: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["keepPreviousData"]
    });
}
_s(useProducts, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useProduct(id) {
    _s1();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: productKeys.detail(id),
        queryFn: {
            "useProduct.useQuery": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$api$2f$products$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchProduct"])(id)
        }["useProduct.useQuery"],
        enabled: !!id,
        staleTime: 60_000,
        gcTime: 10 * 60 * 1000
    });
}
_s1(useProduct, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useProductSearch(query, limit = 20) {
    _s2();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: productKeys.search(query),
        queryFn: {
            "useProductSearch.useQuery": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$api$2f$products$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["searchProducts"])(query, limit)
        }["useProductSearch.useQuery"],
        enabled: query.length >= 2,
        staleTime: 30_000
    });
}
_s2(useProductSearch, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useProductInventory(productId) {
    _s3();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: productKeys.inventory(productId),
        queryFn: {
            "useProductInventory.useQuery": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$api$2f$products$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchProductInventory"])(productId)
        }["useProductInventory.useQuery"],
        enabled: !!productId,
        staleTime: 30_000
    });
}
_s3(useProductInventory, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useProductMutations(options = {}) {
    _s4();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const create = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$api$2f$products$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createProduct"],
        onSuccess: {
            "useProductMutations.useMutation[create]": (data)=>{
                queryClient.invalidateQueries({
                    queryKey: productKeys.lists()
                });
                options.onCreateSuccess?.(data);
            }
        }["useProductMutations.useMutation[create]"],
        onError: options.onError
    });
    const update = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$api$2f$products$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateProduct"],
        onSuccess: {
            "useProductMutations.useMutation[update]": (data, variables)=>{
                queryClient.invalidateQueries({
                    queryKey: productKeys.detail(variables.systemId)
                });
                queryClient.invalidateQueries({
                    queryKey: productKeys.lists()
                });
                options.onUpdateSuccess?.(data);
            }
        }["useProductMutations.useMutation[update]"],
        onError: options.onError
    });
    const remove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$api$2f$products$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteProduct"],
        onSuccess: {
            "useProductMutations.useMutation[remove]": ()=>{
                queryClient.invalidateQueries({
                    queryKey: productKeys.all
                });
                options.onDeleteSuccess?.();
            }
        }["useProductMutations.useMutation[remove]"],
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
_s4(useProductMutations, "JxOfJjdyCQxYamNcDrzBiezg78E=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useProductsByCategory(categoryId) {
    _s5();
    return useProducts({
        categoryId: categoryId || undefined,
        limit: 100
    });
}
_s5(useProductsByCategory, "CsPmZWBPZc1K7ouhTogojMm0kys=", false, function() {
    return [
        useProducts
    ];
});
function useProductsByBrand(brandId) {
    _s6();
    return useProducts({
        brandId: brandId || undefined,
        limit: 100
    });
}
_s6(useProductsByBrand, "CsPmZWBPZc1K7ouhTogojMm0kys=", false, function() {
    return [
        useProducts
    ];
});
function useActiveProducts(params = {}) {
    _s7();
    return useProducts({
        ...params,
        status: 'active'
    });
}
_s7(useActiveProducts, "CsPmZWBPZc1K7ouhTogojMm0kys=", false, function() {
    return [
        useProducts
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/products/hooks/use-all-products.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$hooks$2f$use$2d$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/products/hooks/use-products.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
;
;
function useAllProducts() {
    _s();
    const query = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$hooks$2f$use$2d$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProducts"])({
        limit: 50
    });
    return {
        data: query.data?.data || [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error
    };
}
_s(useAllProducts, "c1uOWWZDhGV3U/1ngTHX+qpIb28=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$hooks$2f$use$2d$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProducts"]
    ];
});
function useActiveProducts() {
    _s1();
    const { data, isLoading } = useAllProducts();
    const activeProducts = data.filter((p)=>!p.isDeleted && p.isActive !== false);
    return {
        data: activeProducts,
        isLoading
    };
}
_s1(useActiveProducts, "y82VBulObInCngo9RGfjcr4NhUM=", false, function() {
    return [
        useAllProducts
    ];
});
function useProductFinder() {
    _s2();
    const { data } = useAllProducts();
    const findById = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "useProductFinder.useCallback[findById]": (systemId)=>{
            if (!systemId) return undefined;
            return data.find({
                "useProductFinder.useCallback[findById]": (p)=>p.systemId === systemId
            }["useProductFinder.useCallback[findById]"]);
        }
    }["useProductFinder.useCallback[findById]"], [
        data
    ]);
    return {
        findById
    };
}
_s2(useProductFinder, "l2uxSt/MNAmUA04pl9WI5+g+pX4=", false, function() {
    return [
        useAllProducts
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/products/image-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
;
const useImageStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])((set, get)=>({
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/products/components/product-image.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProductImage",
    ()=>ProductImage,
    "useProductImage",
    ()=>useProductImage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * ProductImage Component
 * 
 * Component hiển thị ảnh sản phẩm với logic ưu tiên:
 * 1. Ảnh từ server (upload thực) - ưu tiên cao nhất
 * 2. Ảnh từ product data (mock/seed)
 * 3. Icon placeholder nếu không có ảnh
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/package.js [app-client] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$image$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/products/image-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$file$2d$upload$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/file-upload-api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$lazy$2d$image$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/lazy-image.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
;
;
;
;
;
const sizeClasses = {
    xs: 'w-8 h-8',
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
};
const iconSizes = {
    xs: 'h-4 w-4',
    sm: 'h-5 w-5',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
};
function ProductImage({ productSystemId, productData, alt, size = 'md', className }) {
    _s();
    // Get image from store (server images)
    const permanentImages = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$image$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useImageStore"])({
        "ProductImage.useImageStore[permanentImages]": (state)=>state.permanentImages[productSystemId]
    }["ProductImage.useImageStore[permanentImages]"]);
    const lastFetched = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$image$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useImageStore"])({
        "ProductImage.useImageStore[lastFetched]": (state)=>state.permanentMeta[productSystemId]?.lastFetched
    }["ProductImage.useImageStore[lastFetched]"]);
    const updatePermanentImages = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$image$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useImageStore"])({
        "ProductImage.useImageStore[updatePermanentImages]": (state)=>state.updatePermanentImages
    }["ProductImage.useImageStore[updatePermanentImages]"]);
    const storeThumbnail = permanentImages?.thumbnail?.[0]?.url;
    const storeGallery = permanentImages?.gallery?.[0]?.url;
    // ✅ Ưu tiên ảnh từ server trước, sau đó mới đến product data
    const displayImage = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "ProductImage.useMemo[displayImage]": ()=>{
            // 1. Ảnh từ server (ưu tiên cao nhất)
            if (storeThumbnail) return storeThumbnail;
            if (storeGallery) return storeGallery;
            // 2. Ảnh từ product data (mock/seed)
            if (!productData) return undefined;
            return productData.thumbnailImage || productData.galleryImages?.[0] || productData.images?.[0];
        }
    }["ProductImage.useMemo[displayImage]"], [
        storeThumbnail,
        storeGallery,
        productData
    ]);
    // Fetch image from server if not yet fetched
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "ProductImage.useEffect": ()=>{
            if (!lastFetched && productSystemId) {
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$file$2d$upload$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FileUploadAPI"].getProductFiles(productSystemId).then({
                    "ProductImage.useEffect": (files)=>{
                        if (!files || !Array.isArray(files)) return;
                        const mapToServerFile = {
                            "ProductImage.useEffect.mapToServerFile": (f)=>({
                                    id: f.id,
                                    sessionId: '',
                                    name: f.name,
                                    originalName: f.originalName,
                                    slug: f.slug,
                                    filename: f.filename,
                                    size: f.size,
                                    type: f.type,
                                    url: f.url,
                                    status: 'permanent',
                                    uploadedAt: f.uploadedAt,
                                    metadata: f.metadata
                                })
                        }["ProductImage.useEffect.mapToServerFile"];
                        const thumbnailFiles = files.filter({
                            "ProductImage.useEffect.thumbnailFiles": (f)=>f.documentName === 'thumbnail'
                        }["ProductImage.useEffect.thumbnailFiles"]).map(mapToServerFile);
                        const galleryFiles = files.filter({
                            "ProductImage.useEffect.galleryFiles": (f)=>f.documentName === 'gallery'
                        }["ProductImage.useEffect.galleryFiles"]).map(mapToServerFile);
                        updatePermanentImages(productSystemId, 'thumbnail', thumbnailFiles);
                        updatePermanentImages(productSystemId, 'gallery', galleryFiles);
                    }
                }["ProductImage.useEffect"]).catch({
                    "ProductImage.useEffect": (err)=>console.error("Failed to load product image", err)
                }["ProductImage.useEffect"]);
            }
        }
    }["ProductImage.useEffect"], [
        productSystemId,
        lastFetched,
        updatePermanentImages
    ]);
    const sizeClass = sizeClasses[size];
    const iconSize = iconSizes[size];
    const displayAlt = alt || productData?.name || 'Product';
    if (displayImage) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(sizeClass, "flex-shrink-0 rounded overflow-hidden bg-muted", className),
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$lazy$2d$image$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LazyImage"], {
                src: displayImage,
                alt: displayAlt,
                className: "w-full h-full object-cover"
            }, void 0, false, {
                fileName: "[project]/features/products/components/product-image.tsx",
                lineNumber: 108,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/features/products/components/product-image.tsx",
            lineNumber: 107,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(sizeClass, "flex-shrink-0 bg-muted rounded flex items-center justify-center", className),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(iconSize, "text-muted-foreground")
        }, void 0, false, {
            fileName: "[project]/features/products/components/product-image.tsx",
            lineNumber: 119,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/features/products/components/product-image.tsx",
        lineNumber: 118,
        columnNumber: 5
    }, this);
}
_s(ProductImage, "XH9J4eLsncK5fijimS03NHQoXeQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$image$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useImageStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$image$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useImageStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$image$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useImageStore"]
    ];
});
_c = ProductImage;
function useProductImage(productSystemId, productData) {
    _s1();
    const permanentImages = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$image$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useImageStore"])({
        "useProductImage.useImageStore[permanentImages]": (state)=>state.permanentImages[productSystemId]
    }["useProductImage.useImageStore[permanentImages]"]);
    const lastFetched = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$image$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useImageStore"])({
        "useProductImage.useImageStore[lastFetched]": (state)=>state.permanentMeta[productSystemId]?.lastFetched
    }["useProductImage.useImageStore[lastFetched]"]);
    const updatePermanentImages = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$image$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useImageStore"])({
        "useProductImage.useImageStore[updatePermanentImages]": (state)=>state.updatePermanentImages
    }["useProductImage.useImageStore[updatePermanentImages]"]);
    const storeThumbnail = permanentImages?.thumbnail?.[0]?.url;
    const storeGallery = permanentImages?.gallery?.[0]?.url;
    // Fetch if needed
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "useProductImage.useEffect": ()=>{
            if (!lastFetched && productSystemId) {
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$file$2d$upload$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FileUploadAPI"].getProductFiles(productSystemId).then({
                    "useProductImage.useEffect": (files)=>{
                        if (!files || !Array.isArray(files)) return;
                        const mapToServerFile = {
                            "useProductImage.useEffect.mapToServerFile": (f)=>({
                                    id: f.id,
                                    sessionId: '',
                                    name: f.name,
                                    originalName: f.originalName,
                                    slug: f.slug,
                                    filename: f.filename,
                                    size: f.size,
                                    type: f.type,
                                    url: f.url,
                                    status: 'permanent',
                                    uploadedAt: f.uploadedAt,
                                    metadata: f.metadata
                                })
                        }["useProductImage.useEffect.mapToServerFile"];
                        const thumbnailFiles = files.filter({
                            "useProductImage.useEffect.thumbnailFiles": (f)=>f.documentName === 'thumbnail'
                        }["useProductImage.useEffect.thumbnailFiles"]).map(mapToServerFile);
                        const galleryFiles = files.filter({
                            "useProductImage.useEffect.galleryFiles": (f)=>f.documentName === 'gallery'
                        }["useProductImage.useEffect.galleryFiles"]).map(mapToServerFile);
                        updatePermanentImages(productSystemId, 'thumbnail', thumbnailFiles);
                        updatePermanentImages(productSystemId, 'gallery', galleryFiles);
                    }
                }["useProductImage.useEffect"]).catch({
                    "useProductImage.useEffect": ()=>{}
                }["useProductImage.useEffect"]);
            }
        }
    }["useProductImage.useEffect"], [
        productSystemId,
        lastFetched,
        updatePermanentImages
    ]);
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "useProductImage.useMemo": ()=>{
            // 1. Ảnh từ server (ưu tiên cao nhất)
            if (storeThumbnail) return storeThumbnail;
            if (storeGallery) return storeGallery;
            // 2. Ảnh từ product data
            if (!productData) return undefined;
            return productData.thumbnailImage || productData.galleryImages?.[0] || productData.images?.[0];
        }
    }["useProductImage.useMemo"], [
        storeThumbnail,
        storeGallery,
        productData
    ]);
}
_s1(useProductImage, "VpJMGHttRA4pJhNt6bwSzFK9MPE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$image$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useImageStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$image$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useImageStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$image$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useImageStore"]
    ];
});
var _c;
__turbopack_context__.k.register(_c, "ProductImage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/stock-history/store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useStockHistoryStore",
    ()=>useStockHistoryStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-client] (ecmascript)");
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
            productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(skuToSystemId[entry.productId] || entry.productId) // Convert or keep if already systemId
        }));
}
let entryCounter = 0;
const useStockHistoryStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((set, get)=>({
        entries: [],
        initialized: false,
        addEntry: (entry)=>{
            entryCounter++;
            const newEntry = {
                ...entry,
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(`HISTORY${String(Date.now()).slice(-6)}_${entryCounter}`)
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/cashbook/store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCashbookStore",
    ()=>useCashbookStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-client] (ecmascript)");
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
    const currentCounter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMaxSystemIdCounter"])(accounts, SYSTEM_ID_PREFIX);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateSystemId"])(CASH_ACCOUNT_ENTITY, currentCounter + 1));
};
const ensureBusinessId = (accounts, provided)=>{
    if (provided && provided.trim()) {
        return provided;
    }
    const existingIds = accounts.map((acc)=>acc.id);
    const startCounter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMaxBusinessIdCounter"])(accounts, BUSINESS_ID_PREFIX);
    const { nextId } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findNextAvailableBusinessId"])(BUSINESS_ID_PREFIX, existingIds, startCounter, BUSINESS_ID_DIGITS);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])(nextId);
};
const useCashbookStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((set, get)=>({
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/finance/document-lookups.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$target$2d$groups$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/target-groups/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$payments$2f$methods$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/payments/methods/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$cashbook$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/cashbook/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$receipt$2d$types$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/receipt-types/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$payments$2f$types$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/payments/types/store.ts [app-client] (ecmascript)");
;
;
;
;
;
const normalizeName = (value)=>(value ?? '').trim().toLowerCase();
const DEFAULT_CUSTOMER_GROUP = 'khách hàng';
const pickTargetGroup = (options)=>{
    const groups = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$target$2d$groups$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTargetGroupStore"].getState().data ?? [];
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
    const methods = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$payments$2f$methods$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePaymentMethodStore"].getState().data ?? [];
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
    const { accounts } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$cashbook$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCashbookStore"].getState();
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
    const types = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$receipt$2d$types$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReceiptTypeStore"].getState().data ?? [];
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
    const types = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$payments$2f$types$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePaymentTypeStore"].getState().data ?? [];
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/finance/document-helpers.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createPaymentDocument",
    ()=>createPaymentDocument,
    "createReceiptDocument",
    ()=>createReceiptDocument
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$receipts$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/receipts/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$payments$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/payments/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/finance/document-lookups.ts [app-client] (ecmascript)");
;
;
;
;
;
const asBusinessIdOrUndefined = (value)=>{
    if (!value) {
        return undefined;
    }
    return typeof value === 'string' ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])(value) : value;
};
const createReceiptDocument = (options)=>{
    if (!options.branchSystemId) {
        return {
            document: null,
            error: 'Thiếu mã chi nhánh khi tạo phiếu thu.'
        };
    }
    const targetGroup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pickTargetGroup"])({
        systemId: options.payerTargetGroupSystemId,
        name: options.payerTargetGroupName
    });
    if (!targetGroup) {
        return {
            document: null,
            error: 'Chưa cấu hình nhóm đối tượng (Target Group) cho phiếu thu.'
        };
    }
    const paymentMethod = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pickPaymentMethod"])({
        systemId: options.paymentMethodSystemId,
        name: options.paymentMethodName
    });
    if (!paymentMethod) {
        return {
            document: null,
            error: 'Chưa cấu hình phương thức thu tiền.'
        };
    }
    const account = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pickAccount"])({
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
    const receiptType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pickReceiptType"])({
        systemId: options.receiptTypeSystemId,
        name: options.receiptTypeName
    });
    if (!receiptType) {
        return {
            document: null,
            error: 'Chưa cấu hình loại phiếu thu.'
        };
    }
    const timestamp = options.date ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date());
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
    const receipt = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$receipts$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReceiptStore"].getState().add(payload);
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
    const targetGroup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pickTargetGroup"])({
        systemId: options.recipientTargetGroupSystemId,
        name: options.recipientTargetGroupName
    });
    if (!targetGroup) {
        return {
            document: null,
            error: 'Chưa cấu hình nhóm đối tượng (Target Group) cho phiếu chi.'
        };
    }
    const paymentMethod = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pickPaymentMethod"])({
        systemId: options.paymentMethodSystemId,
        name: options.paymentMethodName
    });
    if (!paymentMethod) {
        return {
            document: null,
            error: 'Chưa cấu hình phương thức chi tiền.'
        };
    }
    const account = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pickAccount"])({
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
    const paymentType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pickPaymentType"])({
        systemId: options.paymentTypeSystemId,
        name: options.paymentTypeName
    });
    if (!paymentType) {
        return {
            document: null,
            error: 'Chưa cấu hình loại phiếu chi.'
        };
    }
    const timestamp = options.date ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date());
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
    const payment = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$payments$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePaymentStore"].getState().add(payload);
    return {
        document: payment
    };
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/receipts/store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useReceiptStore",
    ()=>useReceiptStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-client] (ecmascript)");
// REMOVED: import { data as initialData } from './data'; // Mock data no longer used - database is source of truth
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/finance/document-lookups.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/employees/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-client] (ecmascript)");
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
    const currentUserSystemId = __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentUserSystemId"]?.() || 'SYSTEM';
    const employee = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEmployeeStore"].getState().data.find((e)=>e.systemId === currentUserSystemId);
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
const SYSTEM_AUTHOR = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('SYSTEM');
const getCurrentReceiptAuthor = ()=>{
    const userId = __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentUserSystemId"]?.();
    return userId ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(userId) : SYSTEM_AUTHOR;
};
const RECEIPT_ENTITY = 'receipts';
const SYSTEM_ID_PREFIX = 'RECEIPT';
const BUSINESS_ID_PREFIX = 'PT';
const BUSINESS_ID_DIGITS = 6;
const normalizeReceiptStatus = (status)=>status === 'cancelled' ? 'cancelled' : 'completed';
const ensureReceiptMetadata = (receipt)=>{
    let mutated = false;
    const updates = {};
    const targetGroup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pickTargetGroup"])({
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
    const paymentMethod = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pickPaymentMethod"])({
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
    const account = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pickAccount"])({
        accountSystemId: receipt.accountSystemId,
        branchSystemId: receipt.branchSystemId,
        paymentMethodName: paymentMethod?.name ?? receipt.paymentMethodName
    });
    if (account && receipt.accountSystemId !== account.systemId) {
        updates.accountSystemId = account.systemId;
        mutated = true;
    }
    const receiptType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pickReceiptType"])({
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
let systemIdCounter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMaxSystemIdCounter"])(initialReceipts, SYSTEM_ID_PREFIX);
let businessIdCounter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMaxBusinessIdCounter"])(initialReceipts, BUSINESS_ID_PREFIX);
const getNextSystemId = ()=>{
    systemIdCounter += 1;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateSystemId"])(RECEIPT_ENTITY, systemIdCounter));
};
const ensureReceiptBusinessId = (receipts, provided)=>{
    if (provided && `${provided}`.trim().length > 0) {
        const normalized = `${provided}`.trim().toUpperCase();
        const parsedCounter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extractCounterFromBusinessId"])(normalized, BUSINESS_ID_PREFIX);
        if (parsedCounter > businessIdCounter) {
            businessIdCounter = parsedCounter;
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])(normalized);
    }
    const existingIds = receipts.map((receipt)=>receipt.id).filter(Boolean);
    const { nextId, updatedCounter } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findNextAvailableBusinessId"])(BUSINESS_ID_PREFIX, existingIds, businessIdCounter, BUSINESS_ID_DIGITS);
    businessIdCounter = updatedCounter;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])(nextId);
};
const useReceiptStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["subscribeWithSelector"])((set, get)=>({
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
                    const nextSystemCounter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMaxSystemIdCounter"])(normalized, SYSTEM_ID_PREFIX);
                    const nextBusinessCounter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMaxBusinessIdCounter"])(normalized, BUSINESS_ID_PREFIX);
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/receipts/api/receipts-api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Receipts (Phiếu Thu) API functions
 * 
 * ⚠️ Direct import: import { fetchReceipts } from '@/features/receipts/api/receipts-api'
 */ __turbopack_context__.s([
    "cancelReceipt",
    ()=>cancelReceipt,
    "createReceipt",
    ()=>createReceipt,
    "deleteReceipt",
    ()=>deleteReceipt,
    "fetchReceipt",
    ()=>fetchReceipt,
    "fetchReceiptStats",
    ()=>fetchReceiptStats,
    "fetchReceipts",
    ()=>fetchReceipts,
    "updateReceipt",
    ()=>updateReceipt
]);
const BASE_URL = '/api/receipts';
async function fetchReceipts(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set('page', String(params.page));
    if (params.limit) searchParams.set('limit', String(params.limit));
    if (params.search) searchParams.set('search', params.search);
    if (params.status) searchParams.set('status', params.status);
    if (params.category) searchParams.set('category', params.category);
    if (params.payerTypeSystemId) searchParams.set('payerTypeSystemId', params.payerTypeSystemId);
    if (params.payerSystemId) searchParams.set('payerSystemId', params.payerSystemId);
    if (params.branchId) searchParams.set('branchId', params.branchId);
    if (params.accountId) searchParams.set('accountId', params.accountId);
    if (params.startDate) searchParams.set('startDate', params.startDate);
    if (params.endDate) searchParams.set('endDate', params.endDate);
    if (params.sortBy) searchParams.set('sortBy', params.sortBy);
    if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);
    const url = searchParams.toString() ? `${BASE_URL}?${searchParams}` : BASE_URL;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch receipts: ${response.statusText}`);
    }
    return response.json();
}
async function fetchReceipt(systemId) {
    const response = await fetch(`${BASE_URL}/${systemId}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch receipt: ${response.statusText}`);
    }
    return response.json();
}
async function createReceipt(data) {
    const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const error = await response.json().catch(()=>({}));
        throw new Error(error.message || 'Failed to create receipt');
    }
    return response.json();
}
async function updateReceipt(systemId, data) {
    const response = await fetch(`${BASE_URL}/${systemId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const error = await response.json().catch(()=>({}));
        throw new Error(error.message || 'Failed to update receipt');
    }
    return response.json();
}
async function deleteReceipt(systemId) {
    const response = await fetch(`${BASE_URL}/${systemId}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error(`Failed to delete receipt: ${response.statusText}`);
    }
}
async function cancelReceipt(systemId, reason) {
    const response = await fetch(`${BASE_URL}/${systemId}/cancel`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            reason
        })
    });
    if (!response.ok) {
        const error = await response.json().catch(()=>({}));
        throw new Error(error.message || 'Failed to cancel receipt');
    }
    return response.json();
}
async function fetchReceiptStats() {
    const response = await fetch(`${BASE_URL}/stats`);
    if (!response.ok) {
        throw new Error(`Failed to fetch receipt stats: ${response.statusText}`);
    }
    return response.json();
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/receipts/hooks/use-receipts.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "receiptKeys",
    ()=>receiptKeys,
    "useReceipt",
    ()=>useReceipt,
    "useReceiptMutations",
    ()=>useReceiptMutations,
    "useReceiptStats",
    ()=>useReceiptStats,
    "useReceipts",
    ()=>useReceipts,
    "useReceiptsByBranch",
    ()=>useReceiptsByBranch,
    "useReceiptsByDateRange",
    ()=>useReceiptsByDateRange,
    "useReceiptsByPayer",
    ()=>useReceiptsByPayer
]);
/**
 * useReceipts - React Query hooks (Phiếu Thu)
 * 
 * ⚠️ Direct import: import { useReceipts } from '@/features/receipts/hooks/use-receipts'
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/query-core/build/modern/utils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$receipts$2f$api$2f$receipts$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/receipts/api/receipts-api.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature(), _s6 = __turbopack_context__.k.signature();
;
;
;
const receiptKeys = {
    all: [
        'receipts'
    ],
    lists: ()=>[
            ...receiptKeys.all,
            'list'
        ],
    list: (params)=>[
            ...receiptKeys.lists(),
            params
        ],
    details: ()=>[
            ...receiptKeys.all,
            'detail'
        ],
    detail: (id)=>[
            ...receiptKeys.details(),
            id
        ],
    stats: ()=>[
            ...receiptKeys.all,
            'stats'
        ]
};
function useReceipts(params = {}) {
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: receiptKeys.list(params),
        queryFn: {
            "useReceipts.useQuery": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$receipts$2f$api$2f$receipts$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchReceipts"])(params)
        }["useReceipts.useQuery"],
        staleTime: 30_000,
        gcTime: 5 * 60 * 1000,
        placeholderData: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["keepPreviousData"]
    });
}
_s(useReceipts, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useReceipt(id) {
    _s1();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: receiptKeys.detail(id),
        queryFn: {
            "useReceipt.useQuery": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$receipts$2f$api$2f$receipts$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchReceipt"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(id))
        }["useReceipt.useQuery"],
        enabled: !!id,
        staleTime: 60_000
    });
}
_s1(useReceipt, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useReceiptStats() {
    _s2();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: receiptKeys.stats(),
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$receipts$2f$api$2f$receipts$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchReceiptStats"],
        staleTime: 60_000
    });
}
_s2(useReceiptStats, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useReceiptMutations(options = {}) {
    _s3();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const create = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$receipts$2f$api$2f$receipts$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createReceipt"],
        onSuccess: {
            "useReceiptMutations.useMutation[create]": (data)=>{
                queryClient.invalidateQueries({
                    queryKey: receiptKeys.lists()
                });
                queryClient.invalidateQueries({
                    queryKey: receiptKeys.stats()
                });
                options.onCreateSuccess?.(data);
            }
        }["useReceiptMutations.useMutation[create]"],
        onError: options.onError
    });
    const update = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useReceiptMutations.useMutation[update]": ({ systemId, data })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$receipts$2f$api$2f$receipts$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateReceipt"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(systemId), data)
        }["useReceiptMutations.useMutation[update]"],
        onSuccess: {
            "useReceiptMutations.useMutation[update]": (data, variables)=>{
                queryClient.invalidateQueries({
                    queryKey: receiptKeys.detail(variables.systemId)
                });
                queryClient.invalidateQueries({
                    queryKey: receiptKeys.lists()
                });
                queryClient.invalidateQueries({
                    queryKey: receiptKeys.stats()
                });
                options.onUpdateSuccess?.(data);
            }
        }["useReceiptMutations.useMutation[update]"],
        onError: options.onError
    });
    const remove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useReceiptMutations.useMutation[remove]": (systemId)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$receipts$2f$api$2f$receipts$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteReceipt"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(systemId))
        }["useReceiptMutations.useMutation[remove]"],
        onSuccess: {
            "useReceiptMutations.useMutation[remove]": ()=>{
                queryClient.invalidateQueries({
                    queryKey: receiptKeys.all
                });
                options.onDeleteSuccess?.();
            }
        }["useReceiptMutations.useMutation[remove]"],
        onError: options.onError
    });
    const cancel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useReceiptMutations.useMutation[cancel]": ({ systemId, reason })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$receipts$2f$api$2f$receipts$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cancelReceipt"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(systemId), reason)
        }["useReceiptMutations.useMutation[cancel]"],
        onSuccess: {
            "useReceiptMutations.useMutation[cancel]": (data, variables)=>{
                queryClient.invalidateQueries({
                    queryKey: receiptKeys.detail(variables.systemId)
                });
                queryClient.invalidateQueries({
                    queryKey: receiptKeys.lists()
                });
                queryClient.invalidateQueries({
                    queryKey: receiptKeys.stats()
                });
                options.onCancelSuccess?.(data);
            }
        }["useReceiptMutations.useMutation[cancel]"],
        onError: options.onError
    });
    return {
        create,
        update,
        remove,
        cancel
    };
}
_s3(useReceiptMutations, "FrOqqYCQBvZ3xNMy85mCMLrk2E4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useReceiptsByPayer(payerSystemId) {
    _s4();
    return useReceipts({
        payerSystemId: payerSystemId || undefined,
        limit: 50
    });
}
_s4(useReceiptsByPayer, "06eI5PiQtDWGyshNOGohkQLewVU=", false, function() {
    return [
        useReceipts
    ];
});
function useReceiptsByBranch(branchId) {
    _s5();
    return useReceipts({
        branchId: branchId || undefined,
        limit: 100
    });
}
_s5(useReceiptsByBranch, "06eI5PiQtDWGyshNOGohkQLewVU=", false, function() {
    return [
        useReceipts
    ];
});
function useReceiptsByDateRange(startDate, endDate) {
    _s6();
    return useReceipts({
        startDate,
        endDate
    });
}
_s6(useReceiptsByDateRange, "06eI5PiQtDWGyshNOGohkQLewVU=", false, function() {
    return [
        useReceipts
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/receipts/hooks/use-all-receipts.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAllReceipts",
    ()=>useAllReceipts
]);
/**
 * useAllReceipts - Convenience hook for components needing all receipts as flat array
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$receipts$2f$hooks$2f$use$2d$receipts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/receipts/hooks/use-receipts.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
function useAllReceipts() {
    _s();
    const query = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$receipts$2f$hooks$2f$use$2d$receipts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReceipts"])({});
    return {
        data: query.data?.data || [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error
    };
}
_s(useAllReceipts, "+5RuRjAkedR+qt3ehwJKbYSCiUc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$receipts$2f$hooks$2f$use$2d$receipts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReceipts"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/payments/store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePaymentStore",
    ()=>usePaymentStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
// REMOVED: import { data as initialData } from './data'; // Mock data no longer used - database is source of truth
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/finance/document-lookups.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/employees/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-client] (ecmascript)");
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
    const currentUserSystemId = __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentUserSystemId"]?.() || 'SYSTEM';
    const employee = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEmployeeStore"].getState().data.find((e)=>e.systemId === currentUserSystemId);
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
    const targetGroup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pickTargetGroup"])({
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
    const paymentMethod = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pickPaymentMethod"])({
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
    const account = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pickAccount"])({
        accountSystemId: payment.accountSystemId,
        branchSystemId: payment.branchSystemId,
        paymentMethodName: paymentMethod?.name ?? payment.paymentMethodName
    });
    if (account && payment.accountSystemId !== account.systemId) {
        updates.accountSystemId = account.systemId;
        mutated = true;
    }
    const paymentType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pickPaymentType"])({
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
let systemIdCounter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMaxSystemIdCounter"])(initialPayments, SYSTEM_ID_PREFIX);
let businessIdCounter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMaxBusinessIdCounter"])(initialPayments, BUSINESS_ID_PREFIX);
const getNextSystemId = ()=>{
    systemIdCounter += 1;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateSystemId"])(PAYMENT_ENTITY, systemIdCounter));
};
const ensurePaymentBusinessId = (payments, provided)=>{
    if (provided && `${provided}`.trim().length > 0) {
        const normalized = `${provided}`.trim().toUpperCase();
        const parsedCounter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extractCounterFromBusinessId"])(normalized, BUSINESS_ID_PREFIX);
        if (parsedCounter > businessIdCounter) {
            businessIdCounter = parsedCounter;
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])(normalized);
    }
    const existingIds = payments.map((payment)=>payment.id).filter(Boolean);
    const { nextId, updatedCounter } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findNextAvailableBusinessId"])(BUSINESS_ID_PREFIX, existingIds, businessIdCounter, BUSINESS_ID_DIGITS);
    businessIdCounter = updatedCounter;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])(nextId);
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
        nextPayment.purchaseOrderSystemId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(payment.originalDocumentId);
    }
    if (!nextPayment.purchaseOrderId && normalizedDocId.startsWith(PURCHASE_ORDER_BUSINESS_PREFIX)) {
        nextPayment.purchaseOrderId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])(payment.originalDocumentId);
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
const usePaymentStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((set, get)=>({
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
                    const nextSystemCounter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMaxSystemIdCounter"])(normalized, SYSTEM_ID_PREFIX);
                    const nextBusinessCounter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMaxBusinessIdCounter"])(normalized, BUSINESS_ID_PREFIX);
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/payments/api/payments-api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Payments (Phiếu Chi) API functions
 * 
 * ⚠️ Direct import: import { fetchPayments } from '@/features/payments/api/payments-api'
 */ __turbopack_context__.s([
    "cancelPayment",
    ()=>cancelPayment,
    "createPayment",
    ()=>createPayment,
    "deletePayment",
    ()=>deletePayment,
    "fetchPayment",
    ()=>fetchPayment,
    "fetchPaymentStats",
    ()=>fetchPaymentStats,
    "fetchPayments",
    ()=>fetchPayments,
    "updatePayment",
    ()=>updatePayment
]);
const BASE_URL = '/api/payments';
async function fetchPayments(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set('page', String(params.page));
    if (params.limit) searchParams.set('limit', String(params.limit));
    if (params.search) searchParams.set('search', params.search);
    if (params.status) searchParams.set('status', params.status);
    if (params.category) searchParams.set('category', params.category);
    if (params.recipientTypeSystemId) searchParams.set('recipientTypeSystemId', params.recipientTypeSystemId);
    if (params.recipientSystemId) searchParams.set('recipientSystemId', params.recipientSystemId);
    if (params.branchId) searchParams.set('branchId', params.branchId);
    if (params.accountId) searchParams.set('accountId', params.accountId);
    if (params.startDate) searchParams.set('startDate', params.startDate);
    if (params.endDate) searchParams.set('endDate', params.endDate);
    if (params.sortBy) searchParams.set('sortBy', params.sortBy);
    if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);
    const url = searchParams.toString() ? `${BASE_URL}?${searchParams}` : BASE_URL;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch payments: ${response.statusText}`);
    }
    return response.json();
}
async function fetchPayment(systemId) {
    const response = await fetch(`${BASE_URL}/${systemId}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch payment: ${response.statusText}`);
    }
    return response.json();
}
async function createPayment(data) {
    const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const error = await response.json().catch(()=>({}));
        throw new Error(error.message || 'Failed to create payment');
    }
    return response.json();
}
async function updatePayment(systemId, data) {
    const response = await fetch(`${BASE_URL}/${systemId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const error = await response.json().catch(()=>({}));
        throw new Error(error.message || 'Failed to update payment');
    }
    return response.json();
}
async function deletePayment(systemId) {
    const response = await fetch(`${BASE_URL}/${systemId}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error(`Failed to delete payment: ${response.statusText}`);
    }
}
async function cancelPayment(systemId, reason) {
    const response = await fetch(`${BASE_URL}/${systemId}/cancel`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            reason
        })
    });
    if (!response.ok) {
        const error = await response.json().catch(()=>({}));
        throw new Error(error.message || 'Failed to cancel payment');
    }
    return response.json();
}
async function fetchPaymentStats() {
    const response = await fetch(`${BASE_URL}/stats`);
    if (!response.ok) {
        throw new Error(`Failed to fetch payment stats: ${response.statusText}`);
    }
    return response.json();
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/payments/hooks/use-payments.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "paymentKeys",
    ()=>paymentKeys,
    "usePayment",
    ()=>usePayment,
    "usePaymentMutations",
    ()=>usePaymentMutations,
    "usePaymentStats",
    ()=>usePaymentStats,
    "usePayments",
    ()=>usePayments,
    "usePaymentsByBranch",
    ()=>usePaymentsByBranch,
    "usePaymentsByCategory",
    ()=>usePaymentsByCategory,
    "usePaymentsByDateRange",
    ()=>usePaymentsByDateRange,
    "usePaymentsByRecipient",
    ()=>usePaymentsByRecipient
]);
/**
 * usePayments - React Query hooks (Phiếu Chi)
 * 
 * ⚠️ Direct import: import { usePayments } from '@/features/payments/hooks/use-payments'
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/query-core/build/modern/utils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$payments$2f$api$2f$payments$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/payments/api/payments-api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature(), _s6 = __turbopack_context__.k.signature(), _s7 = __turbopack_context__.k.signature();
;
;
;
const paymentKeys = {
    all: [
        'payments'
    ],
    lists: ()=>[
            ...paymentKeys.all,
            'list'
        ],
    list: (params)=>[
            ...paymentKeys.lists(),
            params
        ],
    details: ()=>[
            ...paymentKeys.all,
            'detail'
        ],
    detail: (id)=>[
            ...paymentKeys.details(),
            id
        ],
    stats: ()=>[
            ...paymentKeys.all,
            'stats'
        ]
};
function usePayments(params = {}) {
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: paymentKeys.list(params),
        queryFn: {
            "usePayments.useQuery": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$payments$2f$api$2f$payments$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchPayments"])(params)
        }["usePayments.useQuery"],
        staleTime: 30_000,
        gcTime: 5 * 60 * 1000,
        placeholderData: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["keepPreviousData"]
    });
}
_s(usePayments, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function usePayment(id) {
    _s1();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: paymentKeys.detail(id),
        queryFn: {
            "usePayment.useQuery": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$payments$2f$api$2f$payments$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchPayment"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(id))
        }["usePayment.useQuery"],
        enabled: !!id,
        staleTime: 60_000
    });
}
_s1(usePayment, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function usePaymentStats() {
    _s2();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: paymentKeys.stats(),
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$payments$2f$api$2f$payments$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchPaymentStats"],
        staleTime: 60_000
    });
}
_s2(usePaymentStats, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function usePaymentMutations(options = {}) {
    _s3();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const create = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$payments$2f$api$2f$payments$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPayment"],
        onSuccess: {
            "usePaymentMutations.useMutation[create]": (data)=>{
                queryClient.invalidateQueries({
                    queryKey: paymentKeys.lists()
                });
                queryClient.invalidateQueries({
                    queryKey: paymentKeys.stats()
                });
                options.onCreateSuccess?.(data);
            }
        }["usePaymentMutations.useMutation[create]"],
        onError: options.onError
    });
    const update = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "usePaymentMutations.useMutation[update]": ({ systemId, data })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$payments$2f$api$2f$payments$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updatePayment"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(systemId), data)
        }["usePaymentMutations.useMutation[update]"],
        onSuccess: {
            "usePaymentMutations.useMutation[update]": (data, variables)=>{
                queryClient.invalidateQueries({
                    queryKey: paymentKeys.detail(variables.systemId)
                });
                queryClient.invalidateQueries({
                    queryKey: paymentKeys.lists()
                });
                queryClient.invalidateQueries({
                    queryKey: paymentKeys.stats()
                });
                options.onUpdateSuccess?.(data);
            }
        }["usePaymentMutations.useMutation[update]"],
        onError: options.onError
    });
    const remove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "usePaymentMutations.useMutation[remove]": (systemId)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$payments$2f$api$2f$payments$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deletePayment"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(systemId))
        }["usePaymentMutations.useMutation[remove]"],
        onSuccess: {
            "usePaymentMutations.useMutation[remove]": ()=>{
                queryClient.invalidateQueries({
                    queryKey: paymentKeys.all
                });
                options.onDeleteSuccess?.();
            }
        }["usePaymentMutations.useMutation[remove]"],
        onError: options.onError
    });
    const cancel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "usePaymentMutations.useMutation[cancel]": ({ systemId, reason })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$payments$2f$api$2f$payments$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cancelPayment"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(systemId), reason)
        }["usePaymentMutations.useMutation[cancel]"],
        onSuccess: {
            "usePaymentMutations.useMutation[cancel]": (data, variables)=>{
                queryClient.invalidateQueries({
                    queryKey: paymentKeys.detail(variables.systemId)
                });
                queryClient.invalidateQueries({
                    queryKey: paymentKeys.lists()
                });
                queryClient.invalidateQueries({
                    queryKey: paymentKeys.stats()
                });
                options.onCancelSuccess?.(data);
            }
        }["usePaymentMutations.useMutation[cancel]"],
        onError: options.onError
    });
    return {
        create,
        update,
        remove,
        cancel
    };
}
_s3(usePaymentMutations, "FrOqqYCQBvZ3xNMy85mCMLrk2E4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function usePaymentsByRecipient(recipientSystemId) {
    _s4();
    return usePayments({
        recipientSystemId: recipientSystemId || undefined,
        limit: 50
    });
}
_s4(usePaymentsByRecipient, "Xmk24afWLJ7fzMdA2p3NOLVkoNs=", false, function() {
    return [
        usePayments
    ];
});
function usePaymentsByBranch(branchId) {
    _s5();
    return usePayments({
        branchId: branchId || undefined,
        limit: 100
    });
}
_s5(usePaymentsByBranch, "Xmk24afWLJ7fzMdA2p3NOLVkoNs=", false, function() {
    return [
        usePayments
    ];
});
function usePaymentsByDateRange(startDate, endDate) {
    _s6();
    return usePayments({
        startDate,
        endDate
    });
}
_s6(usePaymentsByDateRange, "Xmk24afWLJ7fzMdA2p3NOLVkoNs=", false, function() {
    return [
        usePayments
    ];
});
function usePaymentsByCategory(category) {
    _s7();
    return usePayments({
        category: category
    });
}
_s7(usePaymentsByCategory, "Xmk24afWLJ7fzMdA2p3NOLVkoNs=", false, function() {
    return [
        usePayments
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/payments/hooks/use-all-payments.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAllPayments",
    ()=>useAllPayments
]);
/**
 * useAllPayments - Convenience hook for components needing all payments as flat array
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$payments$2f$hooks$2f$use$2d$payments$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/payments/hooks/use-payments.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
function useAllPayments() {
    _s();
    const query = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$payments$2f$hooks$2f$use$2d$payments$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePayments"])({});
    return {
        data: query.data?.data || [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error
    };
}
_s(useAllPayments, "CEF30uustNpcRdJSTRYwWo+eH48=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$payments$2f$hooks$2f$use$2d$payments$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePayments"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/sales-returns/store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useSalesReturnStore",
    ()=>useSalesReturnStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
// Other stores
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/orders/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/products/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$stock$2d$history$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/stock-history/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/customers/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$helpers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/finance/document-helpers.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$shipping$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/shipping/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$combo$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/products/combo-utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-utils.ts [app-client] (ecmascript)");
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
    const { findById } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductStore"].getState();
    const expandedItems = [];
    returnItems.forEach((item)=>{
        const product = findById(item.productSystemId);
        if (product && (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$combo$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isComboProduct"])(product) && product.comboItems) {
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
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(item.productSystemId),
                productName: item.productName,
                quantity: item.returnQuantity
            });
        }
    });
    return expandedItems;
};
const baseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCrudStore"])([], 'sales-returns', {
    apiEndpoint: '/api/sales-returns'
});
const originalAdd = baseStore.getState().add;
const augmentedMethods = {
    addWithSideEffects: (item)=>{
        const orderSystemId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(item.orderSystemId);
        const orderBusinessId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])(item.orderId);
        const customerSystemId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(item.customerSystemId);
        const branchSystemId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(item.branchSystemId);
        const creatorSystemId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(item.creatorSystemId ?? item.creatorId ?? 'SYSTEM');
        const exchangeOrderSystemId = item.exchangeOrderSystemId ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(item.exchangeOrderSystemId) : undefined;
        const accountSystemId = item.accountSystemId ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(item.accountSystemId) : undefined;
        const paymentVoucherSystemId = item.paymentVoucherSystemId ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(item.paymentVoucherSystemId) : undefined;
        const paymentVoucherSystemIds = item.paymentVoucherSystemIds?.map(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"]);
        const receiptVoucherSystemIds = item.receiptVoucherSystemIds?.map(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"]);
        const formattedItems = item.items.map((lineItem)=>({
                ...lineItem,
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(lineItem.productSystemId),
                productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])(lineItem.productId)
            }));
        const formattedPayments = item.payments?.map((payment)=>({
                ...payment,
                accountSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(payment.accountSystemId)
            }));
        const formattedRefunds = item.refunds?.map((refund)=>({
                ...refund,
                accountSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(refund.accountSystemId)
            }));
        const newItemData = {
            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])(''),
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
        const { update: updateOrder, findById: findOrderById, add: addOrder } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOrderStore"].getState();
        const { updateInventory } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductStore"].getState();
        const { addEntry: addStockHistory } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$stock$2d$history$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStockHistoryStore"].getState();
        const { updateDebt, incrementReturnStats } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCustomerStore"].getState();
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
            const now = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDateCustom"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentDate"])(), 'yyyy-MM-dd HH:mm');
            // ✅ Helper to get next packaging systemId
            const PACKAGING_SYSTEM_ID_PREFIX = 'PACKAGE';
            const allOrders = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOrderStore"].getState().data;
            const allPackagings = allOrders.flatMap((o)=>o.packagings || []);
            const maxPackagingCounter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMaxSystemIdCounter"])(allPackagings, PACKAGING_SYSTEM_ID_PREFIX);
            let packagingCounter = maxPackagingCounter;
            const getNextPackagingSystemId = ()=>{
                packagingCounter++;
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateSystemId"])('packaging', packagingCounter));
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
                const { data: partners } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$shipping$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useShippingPartnerStore"].getState();
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
                orderDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDateCustom"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentDate"])(), 'yyyy-MM-dd HH:mm'),
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
                newOrderSystemId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(newOrder.systemId);
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
                const { document, error } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$helpers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPaymentDocument"])({
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
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Không thể tạo phiếu chi hoàn tiền: ${error}`);
                    return;
                }
                if (document) {
                    createdVoucherIds.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(document.systemId));
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
                const { document, error } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$helpers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createReceiptDocument"])({
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
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Không thể tạo phiếu thu đổi hàng: ${error}`);
                    return;
                }
                if (document) {
                    createdVoucherIds.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(document.systemId));
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
                    const product = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductStore"].getState().findById(item.productSystemId);
                    const oldStock = product?.inventoryByBranch[newReturn.branchSystemId] || 0;
                    updateInventory(item.productSystemId, newReturn.branchSystemId, item.quantity); // Add stock back
                    addStockHistory({
                        productId: item.productSystemId,
                        date: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentDate"])().toISOString(),
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
        const { updateInventory } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductStore"].getState();
        const { addEntry: addStockHistory } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$stock$2d$history$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStockHistoryStore"].getState();
        // ✅ Expand combo items to child products
        const stockItems = getReturnStockItems(salesReturn.items);
        // Update inventory for all returned items (including expanded combo children)
        stockItems.forEach((item)=>{
            if (item.quantity > 0) {
                const product = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductStore"].getState().findById(item.productSystemId);
                const oldStock = product?.inventoryByBranch[salesReturn.branchSystemId] || 0;
                updateInventory(item.productSystemId, salesReturn.branchSystemId, item.quantity);
                addStockHistory({
                    productId: item.productSystemId,
                    date: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentDate"])().toISOString(),
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/sales-returns/api/sales-returns-api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Sales Returns API functions
 * 
 * ⚠️ Direct import: import { fetchSalesReturns } from '@/features/sales-returns/api/sales-returns-api'
 */ __turbopack_context__.s([
    "createSalesReturn",
    ()=>createSalesReturn,
    "deleteSalesReturn",
    ()=>deleteSalesReturn,
    "fetchSalesReturn",
    ()=>fetchSalesReturn,
    "fetchSalesReturnStats",
    ()=>fetchSalesReturnStats,
    "fetchSalesReturns",
    ()=>fetchSalesReturns,
    "markAsReceived",
    ()=>markAsReceived,
    "updateSalesReturn",
    ()=>updateSalesReturn
]);
const BASE_URL = '/api/sales-returns';
async function fetchSalesReturns(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set('page', String(params.page));
    if (params.limit) searchParams.set('limit', String(params.limit));
    if (params.search) searchParams.set('search', params.search);
    if (params.customerId) searchParams.set('customerId', params.customerId);
    if (params.orderId) searchParams.set('orderId', params.orderId);
    if (params.branchId) searchParams.set('branchId', params.branchId);
    if (params.isReceived !== undefined) searchParams.set('isReceived', String(params.isReceived));
    if (params.startDate) searchParams.set('startDate', params.startDate);
    if (params.endDate) searchParams.set('endDate', params.endDate);
    if (params.sortBy) searchParams.set('sortBy', params.sortBy);
    if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);
    const url = searchParams.toString() ? `${BASE_URL}?${searchParams}` : BASE_URL;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch sales returns: ${response.statusText}`);
    }
    return response.json();
}
async function fetchSalesReturn(systemId) {
    const response = await fetch(`${BASE_URL}/${systemId}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch sales return: ${response.statusText}`);
    }
    return response.json();
}
async function createSalesReturn(data) {
    const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const error = await response.json().catch(()=>({}));
        throw new Error(error.message || 'Failed to create sales return');
    }
    return response.json();
}
async function updateSalesReturn(systemId, data) {
    const response = await fetch(`${BASE_URL}/${systemId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const error = await response.json().catch(()=>({}));
        throw new Error(error.message || 'Failed to update sales return');
    }
    return response.json();
}
async function deleteSalesReturn(systemId) {
    const response = await fetch(`${BASE_URL}/${systemId}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error(`Failed to delete sales return: ${response.statusText}`);
    }
}
async function markAsReceived(systemId) {
    const response = await fetch(`${BASE_URL}/${systemId}/receive`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        const error = await response.json().catch(()=>({}));
        throw new Error(error.message || 'Failed to mark sales return as received');
    }
    return response.json();
}
async function fetchSalesReturnStats() {
    const response = await fetch(`${BASE_URL}/stats`);
    if (!response.ok) {
        throw new Error(`Failed to fetch sales return stats: ${response.statusText}`);
    }
    return response.json();
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/sales-returns/hooks/use-sales-returns.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "salesReturnKeys",
    ()=>salesReturnKeys,
    "usePendingSalesReturns",
    ()=>usePendingSalesReturns,
    "useSalesReturn",
    ()=>useSalesReturn,
    "useSalesReturnMutations",
    ()=>useSalesReturnMutations,
    "useSalesReturnStats",
    ()=>useSalesReturnStats,
    "useSalesReturns",
    ()=>useSalesReturns,
    "useSalesReturnsByCustomer",
    ()=>useSalesReturnsByCustomer,
    "useSalesReturnsByOrder",
    ()=>useSalesReturnsByOrder
]);
/**
 * useSalesReturns - React Query hooks
 * 
 * ⚠️ Direct import: import { useSalesReturns } from '@/features/sales-returns/hooks/use-sales-returns'
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/query-core/build/modern/utils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$sales$2d$returns$2f$api$2f$sales$2d$returns$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/sales-returns/api/sales-returns-api.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature(), _s6 = __turbopack_context__.k.signature();
;
;
;
const salesReturnKeys = {
    all: [
        'sales-returns'
    ],
    lists: ()=>[
            ...salesReturnKeys.all,
            'list'
        ],
    list: (params)=>[
            ...salesReturnKeys.lists(),
            params
        ],
    details: ()=>[
            ...salesReturnKeys.all,
            'detail'
        ],
    detail: (id)=>[
            ...salesReturnKeys.details(),
            id
        ],
    stats: ()=>[
            ...salesReturnKeys.all,
            'stats'
        ]
};
function useSalesReturns(params = {}) {
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: salesReturnKeys.list(params),
        queryFn: {
            "useSalesReturns.useQuery": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$sales$2d$returns$2f$api$2f$sales$2d$returns$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchSalesReturns"])(params)
        }["useSalesReturns.useQuery"],
        staleTime: 30_000,
        gcTime: 5 * 60 * 1000,
        placeholderData: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["keepPreviousData"]
    });
}
_s(useSalesReturns, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useSalesReturn(id) {
    _s1();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: salesReturnKeys.detail(id),
        queryFn: {
            "useSalesReturn.useQuery": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$sales$2d$returns$2f$api$2f$sales$2d$returns$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchSalesReturn"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(id))
        }["useSalesReturn.useQuery"],
        enabled: !!id,
        staleTime: 60_000
    });
}
_s1(useSalesReturn, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useSalesReturnStats() {
    _s2();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: salesReturnKeys.stats(),
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$sales$2d$returns$2f$api$2f$sales$2d$returns$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchSalesReturnStats"],
        staleTime: 60_000
    });
}
_s2(useSalesReturnStats, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useSalesReturnMutations(options = {}) {
    _s3();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const create = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$sales$2d$returns$2f$api$2f$sales$2d$returns$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSalesReturn"],
        onSuccess: {
            "useSalesReturnMutations.useMutation[create]": (data)=>{
                queryClient.invalidateQueries({
                    queryKey: salesReturnKeys.lists()
                });
                queryClient.invalidateQueries({
                    queryKey: salesReturnKeys.stats()
                });
                options.onCreateSuccess?.(data);
            }
        }["useSalesReturnMutations.useMutation[create]"],
        onError: options.onError
    });
    const update = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useSalesReturnMutations.useMutation[update]": ({ systemId, data })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$sales$2d$returns$2f$api$2f$sales$2d$returns$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateSalesReturn"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(systemId), data)
        }["useSalesReturnMutations.useMutation[update]"],
        onSuccess: {
            "useSalesReturnMutations.useMutation[update]": (data, variables)=>{
                queryClient.invalidateQueries({
                    queryKey: salesReturnKeys.detail(variables.systemId)
                });
                queryClient.invalidateQueries({
                    queryKey: salesReturnKeys.lists()
                });
                queryClient.invalidateQueries({
                    queryKey: salesReturnKeys.stats()
                });
                options.onUpdateSuccess?.(data);
            }
        }["useSalesReturnMutations.useMutation[update]"],
        onError: options.onError
    });
    const remove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useSalesReturnMutations.useMutation[remove]": (systemId)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$sales$2d$returns$2f$api$2f$sales$2d$returns$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteSalesReturn"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(systemId))
        }["useSalesReturnMutations.useMutation[remove]"],
        onSuccess: {
            "useSalesReturnMutations.useMutation[remove]": ()=>{
                queryClient.invalidateQueries({
                    queryKey: salesReturnKeys.all
                });
                options.onDeleteSuccess?.();
            }
        }["useSalesReturnMutations.useMutation[remove]"],
        onError: options.onError
    });
    const receive = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useSalesReturnMutations.useMutation[receive]": (systemId)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$sales$2d$returns$2f$api$2f$sales$2d$returns$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["markAsReceived"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(systemId))
        }["useSalesReturnMutations.useMutation[receive]"],
        onSuccess: {
            "useSalesReturnMutations.useMutation[receive]": (data, systemId)=>{
                queryClient.invalidateQueries({
                    queryKey: salesReturnKeys.detail(systemId)
                });
                queryClient.invalidateQueries({
                    queryKey: salesReturnKeys.lists()
                });
                queryClient.invalidateQueries({
                    queryKey: salesReturnKeys.stats()
                });
                options.onReceiveSuccess?.(data);
            }
        }["useSalesReturnMutations.useMutation[receive]"],
        onError: options.onError
    });
    return {
        create,
        update,
        remove,
        receive
    };
}
_s3(useSalesReturnMutations, "s1AA8ftinL4kqVDRmzgplmG8uk4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useSalesReturnsByCustomer(customerId) {
    _s4();
    return useSalesReturns({
        customerId: customerId || undefined,
        limit: 50
    });
}
_s4(useSalesReturnsByCustomer, "/3ZarMcgRj06EKVLfoX5xl/HTaw=", false, function() {
    return [
        useSalesReturns
    ];
});
function useSalesReturnsByOrder(orderId) {
    _s5();
    return useSalesReturns({
        orderId: orderId || undefined,
        limit: 20
    });
}
_s5(useSalesReturnsByOrder, "/3ZarMcgRj06EKVLfoX5xl/HTaw=", false, function() {
    return [
        useSalesReturns
    ];
});
function usePendingSalesReturns() {
    _s6();
    return useSalesReturns({
        isReceived: false
    });
}
_s6(usePendingSalesReturns, "/3ZarMcgRj06EKVLfoX5xl/HTaw=", false, function() {
    return [
        useSalesReturns
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/sales-returns/hooks/use-all-sales-returns.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAllSalesReturns",
    ()=>useAllSalesReturns,
    "usePendingSalesReturnsData",
    ()=>usePendingSalesReturnsData
]);
/**
 * useAllSalesReturns - Convenience hook for components needing all sales returns as flat array
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$sales$2d$returns$2f$hooks$2f$use$2d$sales$2d$returns$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/sales-returns/hooks/use-sales-returns.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
;
function useAllSalesReturns() {
    _s();
    const query = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$sales$2d$returns$2f$hooks$2f$use$2d$sales$2d$returns$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSalesReturns"])({
        limit: 500
    });
    return {
        data: query.data?.data || [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error
    };
}
_s(useAllSalesReturns, "wi94tJ/HhnVPh/yO5E688F+eyyw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$sales$2d$returns$2f$hooks$2f$use$2d$sales$2d$returns$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSalesReturns"]
    ];
});
function usePendingSalesReturnsData() {
    _s1();
    const { data, ...rest } = useAllSalesReturns();
    const pendingReturns = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "usePendingSalesReturnsData.useMemo[pendingReturns]": ()=>data.filter({
                "usePendingSalesReturnsData.useMemo[pendingReturns]": (r)=>!r.isReceived
            }["usePendingSalesReturnsData.useMemo[pendingReturns]"])
    }["usePendingSalesReturnsData.useMemo[pendingReturns]"], [
        data
    ]);
    return {
        data: pendingReturns,
        ...rest
    };
}
_s1(usePendingSalesReturnsData, "jsn7y5n+fBWLta4NT4QRvX251po=", false, function() {
    return [
        useAllSalesReturns
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/shipments/store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-utils.ts [app-client] (ecmascript)");
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
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('SHIPMENT000001'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('VC000001'),
        packagingSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PACKAGE000001'),
        orderSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('ORDER000001'),
        orderId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000001'),
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
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('SHIPMENT000002'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('VC000002'),
        packagingSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PACKAGE000002'),
        orderSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('ORDER000002'),
        orderId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000002'),
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
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('SHIPMENT000003'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('VC000003'),
        packagingSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PACKAGE000005'),
        orderSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('ORDER000005'),
        orderId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000005'),
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
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('SHIPMENT000004'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('VC000004'),
        packagingSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PACKAGE000006'),
        orderSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('ORDER000006'),
        orderId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000006'),
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
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('SHIPMENT000005'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('VC000005'),
        packagingSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PACKAGE000007'),
        orderSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('ORDER000007'),
        orderId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000007'),
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
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('SHIPMENT000006'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('VC000006'),
        packagingSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PACKAGE000008'),
        orderSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('ORDER000008'),
        orderId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000008'),
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
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('SHIPMENT000007'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('VC000007'),
        packagingSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PACKAGE000009'),
        orderSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('ORDER000009'),
        orderId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000009'),
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
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('SHIPMENT000008'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('VC000008'),
        packagingSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PACKAGE000010'),
        orderSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('ORDER000010'),
        orderId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000010'),
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
    shipmentSystemIdCounter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMaxSystemIdCounter"])(shipments, SHIPMENT_SYSTEM_ID_PREFIX);
    shipmentBusinessIdCounter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMaxBusinessIdCounter"])(shipments, SHIPMENT_BUSINESS_ID_PREFIX);
}
function getNextShipmentSystemId() {
    shipmentSystemIdCounter++;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateSystemId"])('shipments', shipmentSystemIdCounter);
}
function getNextShipmentBusinessId() {
    shipmentBusinessIdCounter++;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateBusinessId"])('shipments', shipmentBusinessIdCounter);
}
// Initialize counters
initCounters(initialData);
const useShipmentStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((set, get)=>({
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/shipments/api/shipments-api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Shipments API Layer
 * Handles all shipment-related API calls
 */ __turbopack_context__.s([
    "bulkReconcileShipments",
    ()=>bulkReconcileShipments,
    "createShipment",
    ()=>createShipment,
    "deleteShipment",
    ()=>deleteShipment,
    "fetchShipmentById",
    ()=>fetchShipmentById,
    "fetchShipments",
    ()=>fetchShipments,
    "printShippingLabel",
    ()=>printShippingLabel,
    "reconcileShipment",
    ()=>reconcileShipment,
    "syncTrackingInfo",
    ()=>syncTrackingInfo,
    "updateDeliveryStatus",
    ()=>updateDeliveryStatus,
    "updateShipment",
    ()=>updateShipment
]);
const BASE_URL = '/api/shipments';
async function fetchShipments(filters = {}) {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.search) params.set('search', filters.search);
    if (filters.status) params.set('status', filters.status);
    if (filters.orderId) params.set('orderId', filters.orderId);
    if (filters.carrier) params.set('carrier', filters.carrier);
    if (filters.reconciliationStatus) params.set('reconciliationStatus', filters.reconciliationStatus);
    if (filters.fromDate) params.set('fromDate', filters.fromDate);
    if (filters.toDate) params.set('toDate', filters.toDate);
    const url = params.toString() ? `${BASE_URL}?${params}` : BASE_URL;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch shipments');
    }
    return response.json();
}
async function fetchShipmentById(systemId) {
    const response = await fetch(`${BASE_URL}/${systemId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch shipment');
    }
    return response.json();
}
async function createShipment(data) {
    const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const error = await response.json().catch(()=>({}));
        throw new Error(error.error || 'Failed to create shipment');
    }
    return response.json();
}
async function updateShipment(systemId, data) {
    const response = await fetch(`${BASE_URL}/${systemId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const error = await response.json().catch(()=>({}));
        throw new Error(error.error || 'Failed to update shipment');
    }
    return response.json();
}
async function deleteShipment(systemId) {
    const response = await fetch(`${BASE_URL}/${systemId}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error('Failed to delete shipment');
    }
}
async function updateDeliveryStatus(systemId, status, timestamp) {
    return updateShipment(systemId, {
        deliveryStatus: status,
        ...status === 'Đã giao hàng' && {
            deliveredAt: timestamp || new Date().toISOString()
        },
        ...status === 'Đang giao hàng' && {
            dispatchedAt: timestamp || new Date().toISOString()
        }
    });
}
async function reconcileShipment(systemId) {
    return updateShipment(systemId, {
        reconciliationStatus: 'Đã đối soát'
    });
}
async function bulkReconcileShipments(systemIds) {
    const response = await fetch(`${BASE_URL}/bulk-reconcile`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            systemIds
        })
    });
    if (!response.ok) {
        throw new Error('Failed to bulk reconcile shipments');
    }
    return response.json();
}
async function syncTrackingInfo(systemId) {
    const response = await fetch(`${BASE_URL}/${systemId}/sync-tracking`, {
        method: 'POST'
    });
    if (!response.ok) {
        throw new Error('Failed to sync tracking info');
    }
    return response.json();
}
async function printShippingLabel(systemIds) {
    const response = await fetch(`${BASE_URL}/print-labels`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            systemIds
        })
    });
    if (!response.ok) {
        throw new Error('Failed to generate shipping labels');
    }
    return response.json();
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/shipments/hooks/use-shipments.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "shipmentKeys",
    ()=>shipmentKeys,
    "usePendingShipments",
    ()=>usePendingShipments,
    "useShipmentById",
    ()=>useShipmentById,
    "useShipmentMutations",
    ()=>useShipmentMutations,
    "useShipments",
    ()=>useShipments,
    "useShipmentsByOrder",
    ()=>useShipmentsByOrder,
    "useShipmentsInTransit",
    ()=>useShipmentsInTransit
]);
/**
 * Shipments React Query Hooks
 * Provides data fetching and mutations for shipment management
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$shipments$2f$api$2f$shipments$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/shipments/api/shipments-api.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature();
;
;
const shipmentKeys = {
    all: [
        'shipments'
    ],
    lists: ()=>[
            ...shipmentKeys.all,
            'list'
        ],
    list: (filters)=>[
            ...shipmentKeys.lists(),
            filters
        ],
    details: ()=>[
            ...shipmentKeys.all,
            'detail'
        ],
    detail: (id)=>[
            ...shipmentKeys.details(),
            id
        ],
    byOrder: (orderId)=>[
            ...shipmentKeys.all,
            'order',
            orderId
        ]
};
function useShipments(filters = {}) {
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: shipmentKeys.list(filters),
        queryFn: {
            "useShipments.useQuery": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$shipments$2f$api$2f$shipments$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchShipments"])(filters)
        }["useShipments.useQuery"],
        staleTime: 1000 * 60
    });
}
_s(useShipments, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useShipmentById(systemId) {
    _s1();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: shipmentKeys.detail(systemId),
        queryFn: {
            "useShipmentById.useQuery": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$shipments$2f$api$2f$shipments$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchShipmentById"])(systemId)
        }["useShipmentById.useQuery"],
        enabled: !!systemId,
        staleTime: 1000 * 30
    });
}
_s1(useShipmentById, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useShipmentsByOrder(orderId) {
    _s2();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: shipmentKeys.byOrder(orderId),
        queryFn: {
            "useShipmentsByOrder.useQuery": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$shipments$2f$api$2f$shipments$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchShipments"])({
                    orderId: orderId,
                    limit: 50
                })
        }["useShipmentsByOrder.useQuery"],
        enabled: !!orderId,
        staleTime: 1000 * 60
    });
}
_s2(useShipmentsByOrder, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useShipmentMutations(options = {}) {
    _s3();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const invalidateShipments = ()=>{
        queryClient.invalidateQueries({
            queryKey: shipmentKeys.all
        });
    };
    const create = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useShipmentMutations.useMutation[create]": (data)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$shipments$2f$api$2f$shipments$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createShipment"])(data)
        }["useShipmentMutations.useMutation[create]"],
        onSuccess: {
            "useShipmentMutations.useMutation[create]": ()=>{
                invalidateShipments();
                options.onSuccess?.();
            }
        }["useShipmentMutations.useMutation[create]"],
        onError: options.onError
    });
    const update = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useShipmentMutations.useMutation[update]": ({ systemId, data })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$shipments$2f$api$2f$shipments$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateShipment"])(systemId, data)
        }["useShipmentMutations.useMutation[update]"],
        onSuccess: {
            "useShipmentMutations.useMutation[update]": ()=>{
                invalidateShipments();
                options.onSuccess?.();
            }
        }["useShipmentMutations.useMutation[update]"],
        onError: options.onError
    });
    const remove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useShipmentMutations.useMutation[remove]": (systemId)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$shipments$2f$api$2f$shipments$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteShipment"])(systemId)
        }["useShipmentMutations.useMutation[remove]"],
        onSuccess: {
            "useShipmentMutations.useMutation[remove]": ()=>{
                invalidateShipments();
                options.onSuccess?.();
            }
        }["useShipmentMutations.useMutation[remove]"],
        onError: options.onError
    });
    const updateStatus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useShipmentMutations.useMutation[updateStatus]": ({ systemId, status, timestamp })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$shipments$2f$api$2f$shipments$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDeliveryStatus"])(systemId, status, timestamp)
        }["useShipmentMutations.useMutation[updateStatus]"],
        onSuccess: {
            "useShipmentMutations.useMutation[updateStatus]": ()=>{
                invalidateShipments();
                options.onSuccess?.();
            }
        }["useShipmentMutations.useMutation[updateStatus]"],
        onError: options.onError
    });
    const reconcile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useShipmentMutations.useMutation[reconcile]": (systemId)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$shipments$2f$api$2f$shipments$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["reconcileShipment"])(systemId)
        }["useShipmentMutations.useMutation[reconcile]"],
        onSuccess: {
            "useShipmentMutations.useMutation[reconcile]": ()=>{
                invalidateShipments();
                options.onSuccess?.();
            }
        }["useShipmentMutations.useMutation[reconcile]"],
        onError: options.onError
    });
    const bulkReconcile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useShipmentMutations.useMutation[bulkReconcile]": (systemIds)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$shipments$2f$api$2f$shipments$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bulkReconcileShipments"])(systemIds)
        }["useShipmentMutations.useMutation[bulkReconcile]"],
        onSuccess: {
            "useShipmentMutations.useMutation[bulkReconcile]": ()=>{
                invalidateShipments();
                options.onSuccess?.();
            }
        }["useShipmentMutations.useMutation[bulkReconcile]"],
        onError: options.onError
    });
    const syncTracking = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useShipmentMutations.useMutation[syncTracking]": (systemId)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$shipments$2f$api$2f$shipments$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["syncTrackingInfo"])(systemId)
        }["useShipmentMutations.useMutation[syncTracking]"],
        onSuccess: {
            "useShipmentMutations.useMutation[syncTracking]": ()=>{
                invalidateShipments();
                options.onSuccess?.();
            }
        }["useShipmentMutations.useMutation[syncTracking]"],
        onError: options.onError
    });
    const printLabels = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useShipmentMutations.useMutation[printLabels]": (systemIds)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$shipments$2f$api$2f$shipments$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["printShippingLabel"])(systemIds)
        }["useShipmentMutations.useMutation[printLabels]"],
        onError: options.onError
    });
    return {
        create,
        update,
        remove,
        updateStatus,
        reconcile,
        bulkReconcile,
        syncTracking,
        printLabels,
        isLoading: create.isPending || update.isPending || remove.isPending || updateStatus.isPending || reconcile.isPending || bulkReconcile.isPending || syncTracking.isPending
    };
}
_s3(useShipmentMutations, "sMnT9zMLUVJ2vOplmvwjN/P36WQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function usePendingShipments() {
    _s4();
    return useShipments({
        reconciliationStatus: 'Chưa đối soát'
    });
}
_s4(usePendingShipments, "JDr/npvkLWHysbX7f8AGauD/ABA=", false, function() {
    return [
        useShipments
    ];
});
function useShipmentsInTransit() {
    _s5();
    return useShipments({
        status: 'Đang giao hàng'
    });
}
_s5(useShipmentsInTransit, "JDr/npvkLWHysbX7f8AGauD/ABA=", false, function() {
    return [
        useShipments
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/shipments/hooks/use-all-shipments.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAllShipments",
    ()=>useAllShipments
]);
/**
 * useAllShipments - Convenience hook for components needing all shipments as flat array
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$shipments$2f$hooks$2f$use$2d$shipments$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/shipments/hooks/use-shipments.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
function useAllShipments() {
    _s();
    const query = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$shipments$2f$hooks$2f$use$2d$shipments$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useShipments"])({});
    return {
        data: query.data?.data || [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error
    };
}
_s(useAllShipments, "dFgfkRxUClFUFrhKEacbCPfHLNM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$shipments$2f$hooks$2f$use$2d$shipments$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useShipments"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/warranty/api/warranties-api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Warranty API - Isolated API functions
 */ __turbopack_context__.s([
    "createWarranty",
    ()=>createWarranty,
    "deleteWarranty",
    ()=>deleteWarranty,
    "fetchWarranties",
    ()=>fetchWarranties,
    "fetchWarranty",
    ()=>fetchWarranty,
    "fetchWarrantyStats",
    ()=>fetchWarrantyStats,
    "updateWarranty",
    ()=>updateWarranty
]);
const API_BASE = '/api/warranties';
async function fetchWarranties(params = {}) {
    const { page = 1, limit = 50, ...rest } = params;
    const searchParams = new URLSearchParams({
        page: String(page),
        limit: String(limit)
    });
    Object.entries(rest).forEach(([key, value])=>{
        if (value != null && value !== '') {
            searchParams.set(key, String(value));
        }
    });
    const res = await fetch(`${API_BASE}?${searchParams}`, {
        credentials: 'include'
    });
    if (!res.ok) throw new Error(`Failed to fetch warranties: ${res.statusText}`);
    return res.json();
}
async function fetchWarranty(id) {
    const res = await fetch(`${API_BASE}/${id}`, {
        credentials: 'include'
    });
    if (!res.ok) throw new Error(`Failed to fetch warranty: ${res.statusText}`);
    return res.json();
}
async function createWarranty(data) {
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
        throw new Error(error.message || `Failed to create warranty`);
    }
    return res.json();
}
async function updateWarranty(systemId, data) {
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
        throw new Error(error.message || `Failed to update warranty`);
    }
    return res.json();
}
async function deleteWarranty(id) {
    const res = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    });
    if (!res.ok) throw new Error(`Failed to delete warranty`);
}
async function fetchWarrantyStats() {
    const res = await fetch(`${API_BASE}/stats`, {
        credentials: 'include'
    });
    if (!res.ok) throw new Error(`Failed to fetch warranty stats`);
    return res.json();
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/warranty/hooks/use-warranties.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePendingWarranties",
    ()=>usePendingWarranties,
    "useWarranties",
    ()=>useWarranties,
    "useWarrantiesByCustomer",
    ()=>useWarrantiesByCustomer,
    "useWarranty",
    ()=>useWarranty,
    "useWarrantyMutations",
    ()=>useWarrantyMutations,
    "useWarrantyStats",
    ()=>useWarrantyStats,
    "warrantyKeys",
    ()=>warrantyKeys
]);
/**
 * useWarranties - React Query hooks
 * 
 * ⚠️ Direct import: import { useWarranties } from '@/features/warranty/hooks/use-warranties'
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/query-core/build/modern/utils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$api$2f$warranties$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/api/warranties-api.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature();
;
;
const warrantyKeys = {
    all: [
        'warranties'
    ],
    lists: ()=>[
            ...warrantyKeys.all,
            'list'
        ],
    list: (params)=>[
            ...warrantyKeys.lists(),
            params
        ],
    details: ()=>[
            ...warrantyKeys.all,
            'detail'
        ],
    detail: (id)=>[
            ...warrantyKeys.details(),
            id
        ],
    stats: ()=>[
            ...warrantyKeys.all,
            'stats'
        ]
};
function useWarranties(params = {}) {
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: warrantyKeys.list(params),
        queryFn: {
            "useWarranties.useQuery": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$api$2f$warranties$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchWarranties"])(params)
        }["useWarranties.useQuery"],
        staleTime: 30_000,
        gcTime: 5 * 60 * 1000,
        placeholderData: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["keepPreviousData"]
    });
}
_s(useWarranties, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useWarranty(id) {
    _s1();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: warrantyKeys.detail(id),
        queryFn: {
            "useWarranty.useQuery": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$api$2f$warranties$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchWarranty"])(id)
        }["useWarranty.useQuery"],
        enabled: !!id,
        staleTime: 60_000
    });
}
_s1(useWarranty, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useWarrantyStats() {
    _s2();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: warrantyKeys.stats(),
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$api$2f$warranties$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchWarrantyStats"],
        staleTime: 60_000
    });
}
_s2(useWarrantyStats, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useWarrantyMutations(options = {}) {
    _s3();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const create = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$api$2f$warranties$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createWarranty"],
        onSuccess: {
            "useWarrantyMutations.useMutation[create]": (data)=>{
                queryClient.invalidateQueries({
                    queryKey: warrantyKeys.lists()
                });
                queryClient.invalidateQueries({
                    queryKey: warrantyKeys.stats()
                });
                options.onCreateSuccess?.(data);
            }
        }["useWarrantyMutations.useMutation[create]"],
        onError: options.onError
    });
    const update = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useWarrantyMutations.useMutation[update]": ({ systemId, data })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$api$2f$warranties$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateWarranty"])(systemId, data)
        }["useWarrantyMutations.useMutation[update]"],
        onSuccess: {
            "useWarrantyMutations.useMutation[update]": (data, variables)=>{
                queryClient.invalidateQueries({
                    queryKey: warrantyKeys.detail(variables.systemId)
                });
                queryClient.invalidateQueries({
                    queryKey: warrantyKeys.lists()
                });
                queryClient.invalidateQueries({
                    queryKey: warrantyKeys.stats()
                });
                options.onUpdateSuccess?.(data);
            }
        }["useWarrantyMutations.useMutation[update]"],
        onError: options.onError
    });
    const remove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$api$2f$warranties$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteWarranty"],
        onSuccess: {
            "useWarrantyMutations.useMutation[remove]": ()=>{
                queryClient.invalidateQueries({
                    queryKey: warrantyKeys.all
                });
                options.onDeleteSuccess?.();
            }
        }["useWarrantyMutations.useMutation[remove]"],
        onError: options.onError
    });
    return {
        create,
        update,
        remove
    };
}
_s3(useWarrantyMutations, "JxOfJjdyCQxYamNcDrzBiezg78E=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function usePendingWarranties() {
    _s4();
    return useWarranties({
        status: 'pending'
    });
}
_s4(usePendingWarranties, "TUMD8RAhI+2xR+klLd9ers70Z94=", false, function() {
    return [
        useWarranties
    ];
});
function useWarrantiesByCustomer(customerId) {
    _s5();
    return useWarranties({
        customerId: customerId || undefined,
        limit: 50
    });
}
_s5(useWarrantiesByCustomer, "TUMD8RAhI+2xR+klLd9ers70Z94=", false, function() {
    return [
        useWarranties
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/warranty/hooks/use-all-warranties.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAllWarranties",
    ()=>useAllWarranties
]);
/**
 * useAllWarranties - Convenience hook for components needing all warranties as flat array
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$hooks$2f$use$2d$warranties$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/hooks/use-warranties.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
function useAllWarranties() {
    _s();
    const query = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$hooks$2f$use$2d$warranties$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWarranties"])({});
    return {
        data: query.data?.data || [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error
    };
}
_s(useAllWarranties, "1gydHibBMigm9O4vIJs1R3Dj+1U=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$hooks$2f$use$2d$warranties$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWarranties"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/complaints/api/complaints-api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Complaints API - Isolated API functions
 */ __turbopack_context__.s([
    "createComplaint",
    ()=>createComplaint,
    "deleteComplaint",
    ()=>deleteComplaint,
    "fetchComplaint",
    ()=>fetchComplaint,
    "fetchComplaintStats",
    ()=>fetchComplaintStats,
    "fetchComplaints",
    ()=>fetchComplaints,
    "updateComplaint",
    ()=>updateComplaint
]);
const API_BASE = '/api/complaints';
async function fetchComplaints(params = {}) {
    const { page = 1, limit = 50, ...rest } = params;
    const searchParams = new URLSearchParams({
        page: String(page),
        limit: String(limit)
    });
    Object.entries(rest).forEach(([key, value])=>{
        if (value != null && value !== '') {
            searchParams.set(key, String(value));
        }
    });
    const res = await fetch(`${API_BASE}?${searchParams}`, {
        credentials: 'include'
    });
    if (!res.ok) throw new Error(`Failed to fetch complaints: ${res.statusText}`);
    return res.json();
}
async function fetchComplaint(id) {
    const res = await fetch(`${API_BASE}/${id}`, {
        credentials: 'include'
    });
    if (!res.ok) throw new Error(`Failed to fetch complaint: ${res.statusText}`);
    return res.json();
}
async function createComplaint(data) {
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
        throw new Error(error.message || `Failed to create complaint`);
    }
    return res.json();
}
async function updateComplaint(systemId, data) {
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
        throw new Error(error.message || `Failed to update complaint`);
    }
    return res.json();
}
async function deleteComplaint(id) {
    const res = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    });
    if (!res.ok) throw new Error(`Failed to delete complaint`);
}
async function fetchComplaintStats() {
    const res = await fetch(`${API_BASE}/stats`, {
        credentials: 'include'
    });
    if (!res.ok) throw new Error(`Failed to fetch complaint stats`);
    return res.json();
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/complaints/hooks/use-complaints.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "complaintKeys",
    ()=>complaintKeys,
    "useComplaint",
    ()=>useComplaint,
    "useComplaintMutations",
    ()=>useComplaintMutations,
    "useComplaintStats",
    ()=>useComplaintStats,
    "useComplaints",
    ()=>useComplaints,
    "useComplaintsByCustomer",
    ()=>useComplaintsByCustomer,
    "useComplaintsByOrder",
    ()=>useComplaintsByOrder,
    "usePendingComplaints",
    ()=>usePendingComplaints
]);
/**
 * useComplaints - React Query hooks
 * 
 * ⚠️ Direct import: import { useComplaints } from '@/features/complaints/hooks/use-complaints'
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/query-core/build/modern/utils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$api$2f$complaints$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/complaints/api/complaints-api.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature(), _s6 = __turbopack_context__.k.signature();
;
;
const complaintKeys = {
    all: [
        'complaints'
    ],
    lists: ()=>[
            ...complaintKeys.all,
            'list'
        ],
    list: (params)=>[
            ...complaintKeys.lists(),
            params
        ],
    details: ()=>[
            ...complaintKeys.all,
            'detail'
        ],
    detail: (id)=>[
            ...complaintKeys.details(),
            id
        ],
    stats: ()=>[
            ...complaintKeys.all,
            'stats'
        ]
};
function useComplaints(params = {}) {
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: complaintKeys.list(params),
        queryFn: {
            "useComplaints.useQuery": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$api$2f$complaints$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchComplaints"])(params)
        }["useComplaints.useQuery"],
        staleTime: 30_000,
        gcTime: 5 * 60 * 1000,
        placeholderData: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["keepPreviousData"]
    });
}
_s(useComplaints, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useComplaint(id) {
    _s1();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: complaintKeys.detail(id),
        queryFn: {
            "useComplaint.useQuery": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$api$2f$complaints$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchComplaint"])(id)
        }["useComplaint.useQuery"],
        enabled: !!id,
        staleTime: 60_000
    });
}
_s1(useComplaint, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useComplaintStats() {
    _s2();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: complaintKeys.stats(),
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$api$2f$complaints$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchComplaintStats"],
        staleTime: 60_000
    });
}
_s2(useComplaintStats, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useComplaintMutations(options = {}) {
    _s3();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const create = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$api$2f$complaints$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createComplaint"],
        onSuccess: {
            "useComplaintMutations.useMutation[create]": (data)=>{
                queryClient.invalidateQueries({
                    queryKey: complaintKeys.lists()
                });
                queryClient.invalidateQueries({
                    queryKey: complaintKeys.stats()
                });
                options.onCreateSuccess?.(data);
            }
        }["useComplaintMutations.useMutation[create]"],
        onError: options.onError
    });
    const update = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useComplaintMutations.useMutation[update]": ({ systemId, data })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$api$2f$complaints$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateComplaint"])(systemId, data)
        }["useComplaintMutations.useMutation[update]"],
        onSuccess: {
            "useComplaintMutations.useMutation[update]": (data, variables)=>{
                queryClient.invalidateQueries({
                    queryKey: complaintKeys.detail(variables.systemId)
                });
                queryClient.invalidateQueries({
                    queryKey: complaintKeys.lists()
                });
                queryClient.invalidateQueries({
                    queryKey: complaintKeys.stats()
                });
                options.onUpdateSuccess?.(data);
            }
        }["useComplaintMutations.useMutation[update]"],
        onError: options.onError
    });
    const remove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$api$2f$complaints$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteComplaint"],
        onSuccess: {
            "useComplaintMutations.useMutation[remove]": ()=>{
                queryClient.invalidateQueries({
                    queryKey: complaintKeys.all
                });
                options.onDeleteSuccess?.();
            }
        }["useComplaintMutations.useMutation[remove]"],
        onError: options.onError
    });
    return {
        create,
        update,
        remove
    };
}
_s3(useComplaintMutations, "JxOfJjdyCQxYamNcDrzBiezg78E=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function usePendingComplaints() {
    _s4();
    return useComplaints({
        status: 'pending'
    });
}
_s4(usePendingComplaints, "AAwJYjBGW/LdWKqaBqUEPGVNlRs=", false, function() {
    return [
        useComplaints
    ];
});
function useComplaintsByCustomer(customerId) {
    _s5();
    return useComplaints({
        customerId: customerId || undefined,
        limit: 50
    });
}
_s5(useComplaintsByCustomer, "AAwJYjBGW/LdWKqaBqUEPGVNlRs=", false, function() {
    return [
        useComplaints
    ];
});
function useComplaintsByOrder(orderId) {
    _s6();
    return useComplaints({
        orderId: orderId || undefined,
        limit: 20
    });
}
_s6(useComplaintsByOrder, "AAwJYjBGW/LdWKqaBqUEPGVNlRs=", false, function() {
    return [
        useComplaints
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/complaints/hooks/use-all-complaints.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAllComplaints",
    ()=>useAllComplaints
]);
/**
 * useAllComplaints - Convenience hook for components needing all complaints as flat array
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$hooks$2f$use$2d$complaints$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/complaints/hooks/use-complaints.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
function useAllComplaints() {
    _s();
    const query = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$hooks$2f$use$2d$complaints$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComplaints"])({});
    return {
        data: query.data?.data || [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error
    };
}
_s(useAllComplaints, "UdblqX1x/3UJdKHZXy/g/gRpVJo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$hooks$2f$use$2d$complaints$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComplaints"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=features_be3a6698._.js.map