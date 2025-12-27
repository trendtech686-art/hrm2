module.exports = [
"[project]/features/complaints/api/complaints-api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/features/complaints/hooks/use-complaints.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/query-core/build/modern/utils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$api$2f$complaints$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/complaints/api/complaints-api.ts [app-ssr] (ecmascript)");
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
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: complaintKeys.list(params),
        queryFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$api$2f$complaints$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchComplaints"])(params),
        staleTime: 30_000,
        gcTime: 5 * 60 * 1000,
        placeholderData: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["keepPreviousData"]
    });
}
function useComplaint(id) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: complaintKeys.detail(id),
        queryFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$api$2f$complaints$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchComplaint"])(id),
        enabled: !!id,
        staleTime: 60_000
    });
}
function useComplaintStats() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: complaintKeys.stats(),
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$api$2f$complaints$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchComplaintStats"],
        staleTime: 60_000
    });
}
function useComplaintMutations(options = {}) {
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const create = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$api$2f$complaints$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createComplaint"],
        onSuccess: (data)=>{
            queryClient.invalidateQueries({
                queryKey: complaintKeys.lists()
            });
            queryClient.invalidateQueries({
                queryKey: complaintKeys.stats()
            });
            options.onCreateSuccess?.(data);
        },
        onError: options.onError
    });
    const update = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: ({ systemId, data })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$api$2f$complaints$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateComplaint"])(systemId, data),
        onSuccess: (data, variables)=>{
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
        },
        onError: options.onError
    });
    const remove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$api$2f$complaints$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deleteComplaint"],
        onSuccess: ()=>{
            queryClient.invalidateQueries({
                queryKey: complaintKeys.all
            });
            options.onDeleteSuccess?.();
        },
        onError: options.onError
    });
    return {
        create,
        update,
        remove
    };
}
function usePendingComplaints() {
    return useComplaints({
        status: 'pending'
    });
}
function useComplaintsByCustomer(customerId) {
    return useComplaints({
        customerId: customerId || undefined,
        limit: 50
    });
}
function useComplaintsByOrder(orderId) {
    return useComplaints({
        orderId: orderId || undefined,
        limit: 20
    });
}
}),
"[project]/features/employees/api/employees-api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/features/employees/hooks/use-all-employees.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$hooks$2f$use$2d$employees$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/features/employees/hooks/use-employees.ts [app-ssr] (ecmascript) <locals>");
;
;
function useAllEmployees() {
    const query = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$hooks$2f$use$2d$employees$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useEmployees"])({
        limit: 30
    });
    return {
        data: query.data?.data || [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error
    };
}
function useEmployeeOptions() {
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
function useEmployeeFinder() {
    const { data } = useAllEmployees();
    const findById = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((systemId)=>{
        if (!systemId) return undefined;
        return data.find((e)=>e.systemId === systemId);
    }, [
        data
    ]);
    return {
        findById
    };
}
function useEmployeeSearcher() {
    const { data } = useAllEmployees();
    const searchEmployees = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](async (query, _page = 0, limit = 100)=>{
        const lowerQuery = query.toLowerCase();
        const filtered = data.filter((e)=>e.fullName?.toLowerCase().includes(lowerQuery) || e.id?.toLowerCase().includes(lowerQuery) || e.phone?.includes(query));
        return {
            items: filtered.slice(0, limit).map((e)=>({
                    value: e.systemId,
                    label: e.fullName || e.id || 'N/A'
                })),
            total: filtered.length
        };
    }, [
        data
    ]);
    return {
        searchEmployees
    };
}
}),
"[project]/features/employees/hooks/use-employees.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/query-core/build/modern/utils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$api$2f$employees$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/employees/api/employees-api.ts [app-ssr] (ecmascript)");
// Re-export from use-all-employees for backward compatibility
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$hooks$2f$use$2d$all$2d$employees$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/employees/hooks/use-all-employees.ts [app-ssr] (ecmascript)");
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
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: employeeKeys.list(params),
        queryFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$api$2f$employees$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchEmployees"])(params),
        staleTime: 60_000,
        gcTime: 10 * 60 * 1000,
        placeholderData: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["keepPreviousData"]
    });
}
function useEmployee(id) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: employeeKeys.detail(id),
        queryFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$api$2f$employees$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchEmployee"])(id),
        enabled: !!id,
        staleTime: 60_000,
        gcTime: 10 * 60 * 1000
    });
}
function useEmployeeSearch(query, limit = 20) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: employeeKeys.search(query),
        queryFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$api$2f$employees$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["searchEmployees"])(query, limit),
        enabled: query.length >= 2,
        staleTime: 30_000
    });
}
function useEmployeesByDepartment(departmentId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: employeeKeys.byDepartment(departmentId),
        queryFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$api$2f$employees$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchEmployeesByDepartment"])(departmentId),
        enabled: !!departmentId,
        staleTime: 60_000
    });
}
function useEmployeesByBranch(branchId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: employeeKeys.byBranch(branchId),
        queryFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$api$2f$employees$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchEmployeesByBranch"])(branchId),
        enabled: !!branchId,
        staleTime: 60_000
    });
}
function useEmployeeMutations(options = {}) {
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const create = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$api$2f$employees$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createEmployee"],
        onSuccess: (data)=>{
            queryClient.invalidateQueries({
                queryKey: employeeKeys.lists()
            });
            options.onCreateSuccess?.(data);
        },
        onError: options.onError
    });
    const update = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$api$2f$employees$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateEmployee"],
        onSuccess: (data, variables)=>{
            queryClient.invalidateQueries({
                queryKey: employeeKeys.detail(variables.systemId)
            });
            queryClient.invalidateQueries({
                queryKey: employeeKeys.lists()
            });
            options.onUpdateSuccess?.(data);
        },
        onError: options.onError
    });
    const remove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$api$2f$employees$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deleteEmployee"],
        onSuccess: ()=>{
            queryClient.invalidateQueries({
                queryKey: employeeKeys.all
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
function useActiveEmployees(params = {}) {
    return useEmployees({
        ...params,
        status: 'active'
    });
}
function usePrefetchEmployee() {
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (id)=>{
        queryClient.prefetchQuery({
            queryKey: employeeKeys.detail(id),
            queryFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$api$2f$employees$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchEmployee"])(id),
            staleTime: 60_000
        });
    };
}
;
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
"[project]/features/complaints/types.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// =============================================
// COMPLAINT TYPES & INTERFACES
// =============================================
__turbopack_context__.s([
    "complaintPriorityColors",
    ()=>complaintPriorityColors,
    "complaintPriorityLabels",
    ()=>complaintPriorityLabels,
    "complaintResolutionLabels",
    ()=>complaintResolutionLabels,
    "complaintStatusColors",
    ()=>complaintStatusColors,
    "complaintStatusLabels",
    ()=>complaintStatusLabels,
    "complaintTypeColors",
    ()=>complaintTypeColors,
    "complaintTypeLabels",
    ()=>complaintTypeLabels,
    "complaintVerificationColors",
    ()=>complaintVerificationColors,
    "complaintVerificationLabels",
    ()=>complaintVerificationLabels,
    "getComplaintResolutionLabel",
    ()=>getComplaintResolutionLabel,
    "getComplaintStatusLabel",
    ()=>getComplaintStatusLabel,
    "getComplaintTypeLabel",
    ()=>getComplaintTypeLabel
]);
const complaintTypeLabels = {
    "wrong-product": "Sai hàng",
    "missing-items": "Thiếu hàng",
    "wrong-packaging": "Đóng gói sai quy cách",
    "warehouse-defect": "Trả hàng lỗi do kho",
    "product-condition": "Phàn nàn về tình trạng hàng"
};
const complaintTypeColors = {
    "wrong-product": "bg-red-500/10 text-red-700 border-red-200",
    "missing-items": "bg-orange-500/10 text-orange-700 border-orange-200",
    "wrong-packaging": "bg-yellow-500/10 text-yellow-700 border-yellow-200",
    "warehouse-defect": "bg-purple-500/10 text-purple-700 border-purple-200",
    "product-condition": "bg-pink-500/10 text-pink-700 border-pink-200"
};
const complaintStatusLabels = {
    pending: "Chờ xử lý",
    investigating: "Đang kiểm tra",
    resolved: "Đã giải quyết",
    cancelled: "Đã hủy",
    ended: "Kết thúc"
};
const complaintStatusColors = {
    pending: "bg-gray-500/10 text-gray-700 border-gray-200",
    investigating: "bg-blue-500/10 text-blue-700 border-blue-200",
    resolved: "bg-green-500/10 text-green-700 border-green-200",
    cancelled: "bg-red-500/10 text-red-700 border-red-200",
    ended: "bg-purple-500/10 text-purple-700 border-purple-200"
};
const complaintResolutionLabels = {
    refund: "Trừ tiền vào đơn hàng",
    "return-shipping": "Gửi trả hàng (shop chịu phí)",
    "advice-only": "Tư vấn/Hỗ trợ",
    replacement: "Đổi sản phẩm",
    rejected: "Từ chối khiếu nại"
};
const complaintVerificationLabels = {
    "verified-correct": "Xác nhận đúng",
    "verified-incorrect": "Xác nhận sai",
    "pending-verification": "Chưa xác minh"
};
const complaintVerificationColors = {
    "verified-correct": "bg-red-500/10 text-red-700 border-red-200",
    "verified-incorrect": "bg-green-500/10 text-green-700 border-green-200",
    "pending-verification": "bg-gray-500/10 text-gray-700 border-gray-200"
};
const complaintPriorityLabels = {
    low: "Thấp",
    medium: "Trung bình",
    high: "Cao",
    urgent: "Khẩn cấp"
};
const complaintPriorityColors = {
    low: "bg-gray-500/10 text-gray-700 border-gray-200",
    medium: "bg-blue-500/10 text-blue-700 border-blue-200",
    high: "bg-orange-500/10 text-orange-700 border-orange-200",
    urgent: "bg-red-500/10 text-red-700 border-red-200"
};
function getComplaintTypeLabel(type) {
    return complaintTypeLabels[type];
}
function getComplaintStatusLabel(status) {
    return complaintStatusLabels[status];
}
function getComplaintResolutionLabel(resolution) {
    return complaintResolutionLabels[resolution];
}
}),
"[project]/features/complaints/sla-utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Complaints SLA Utilities
 * 
 * NOTE: SLA settings are now synced with database via complaints-settings-sync.ts
 */ __turbopack_context__.s([
    "checkOverdue",
    ()=>checkOverdue,
    "defaultSLA",
    ()=>defaultSLA,
    "formatTimeLeft",
    ()=>formatTimeLeft
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$complaints$2d$settings$2d$sync$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/complaints-settings-sync.ts [app-ssr] (ecmascript)");
;
const defaultSLA = {
    low: {
        responseTime: 240,
        resolveTime: 48
    },
    medium: {
        responseTime: 120,
        resolveTime: 24
    },
    high: {
        responseTime: 60,
        resolveTime: 12
    },
    urgent: {
        responseTime: 30,
        resolveTime: 4
    }
};
/**
 * Load SLA settings from database (sync version)
 */ function loadSLASettings() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$complaints$2d$settings$2d$sync$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getComplaintsSLASync"])();
}
function checkOverdue(complaint) {
    const now = new Date();
    const createdAt = new Date(complaint.createdAt);
    const priority = complaint.priority || 'medium';
    // Load SLA from localStorage
    const slaSettings = loadSLASettings();
    const sla = slaSettings[priority] || slaSettings.medium;
    const minutesElapsed = (now.getTime() - createdAt.getTime()) / (1000 * 60);
    const hoursElapsed = minutesElapsed / 60;
    const hasResponse = complaint.timeline?.some((action)=>action.actionType === 'commented' || action.actionType === 'investigated') || false;
    const responseTimeLeft = sla.responseTime - minutesElapsed;
    const isOverdueResponse = !hasResponse && responseTimeLeft < 0;
    const isResolved = complaint.status === 'resolved' || complaint.status === 'ended';
    const resolveTimeLeft = sla.resolveTime - hoursElapsed;
    const isOverdueResolve = !isResolved && resolveTimeLeft < 0;
    return {
        isOverdueResponse,
        isOverdueResolve,
        responseTimeLeft,
        resolveTimeLeft
    };
}
function formatTimeLeft(minutes) {
    const abs = Math.abs(minutes);
    if (abs < 60) return `${Math.floor(abs)} phút`;
    if (abs < 1440) return `${Math.floor(abs / 60)} giờ`;
    return `${Math.floor(abs / 1440)} ngày`;
}
}),
"[project]/features/settings/printer/templates/order.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Đơn bán hàng - TipTap compatible
 * 
 * QUAN TRỌNG - Quy tắc template:
 * 1. Bảng chứa {line_stt} là bảng line items - sẽ được lặp theo số sản phẩm
 * 2. Các bảng khác là bảng thông tin - không lặp
 * 3. Sử dụng inline styles để đảm bảo hiển thị đúng khi in
 * 
 * CHUẨN TEMPLATE v2 (2025-12-08):
 * - Header: Logo trái + Store info phải (dạng table)
 * - Title: Căn giữa, border-bottom
 * - Info table: Label 22% nền xám
 * - Product table: table-layout fixed, responsive
 * - Summary: 250px căn phải
 * - Footer: border-top dashed, font nhỏ
 */ __turbopack_context__.s([
    "ORDER_TEMPLATE",
    ()=>ORDER_TEMPLATE
]);
const ORDER_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER: Logo trái + Thông tin cửa hàng phải -->
<table style="width: 100%; margin-bottom: 12px; border-collapse: collapse;">
  <tr>
    <td style="width: 70px; vertical-align: top; padding-right: 10px;">{store_logo}</td>
    <td style="vertical-align: top;">
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
      <div style="font-size: 11px; color: #333;">{store_address}</div>
      <div style="font-size: 11px; color: #333;">ĐT: {store_phone_number} | Email: {store_email}</div>
    </td>
  </tr>
</table>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 12px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 8px;">HÓA ĐƠN BÁN HÀNG</h2>
<div style="text-align: center; margin-bottom: 12px; font-size: 11px;">
  <div>Số: <strong>{order_code}</strong></div>
  <div>Ngày: {created_on} {created_on_time}</div>
</div>

<!-- THÔNG TIN KHÁCH HÀNG -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Khách hàng:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;"><strong>{customer_name}</strong></td>
      <td style="padding: 4px 6px; width: 18%; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Mã KH:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{customer_code}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Điện thoại:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{customer_phone_number}</td>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Nhóm KH:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{customer_group}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Địa chỉ:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;" colspan="3">{billing_address}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">ĐC giao hàng:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;" colspan="3">{shipping_address}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">NV bán:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{account_name}</td>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Trạng thái:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{order_status}</td>
    </tr>
  </tbody>
</table>

<!-- BẢNG SẢN PHẨM - Responsive với table-layout fixed -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: center; width: 28px; font-size: 10px;">STT</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: left; font-size: 10px;">Tên sản phẩm</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: center; width: 32px; font-size: 10px;">ĐVT</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: center; width: 28px; font-size: 10px;">SL</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: right; width: 65px; font-size: 10px;">Đơn giá</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: right; width: 50px; font-size: 10px;">VAT</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: right; width: 45px; font-size: 10px;">CK</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: right; width: 70px; font-size: 10px;">Thành tiền</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: center; font-size: 10px;">{line_stt}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; font-size: 10px; word-wrap: break-word;">{line_product_name}<br><small style="color: #666;">{line_variant}</small></td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: center; font-size: 10px;">{line_unit}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: center; font-size: 10px; font-weight: bold;">{line_quantity}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: right; font-size: 10px;">{line_price}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: right; font-size: 10px;">{line_tax_amount}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: right; font-size: 10px;">{line_discount_amount}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: right; font-size: 10px;">{line_amount}</td>
    </tr>
  </tbody>
</table>

<!-- BẢNG TỔNG GIÁ TRỊ -->
<table style="width: 250px; margin-left: auto; border-collapse: collapse; margin-bottom: 10px;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Tổng số lượng:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; width: 85px; font-size: 11px;"><strong>{total_quantity}</strong></td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Tổng tiền hàng:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px;">{total}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Chiết khấu:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px;">{total_discount}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Thuế:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px;">{total_tax}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Phí giao hàng:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px;">{delivery_fee}</td>
    </tr>
    <tr style="background: #f5f5f5;">
      <td style="padding: 5px 6px; border: 1px solid #333; font-size: 11px;"><strong>TỔNG CỘNG:</strong></td>
      <td style="padding: 5px 6px; border: 1px solid #333; text-align: right; font-size: 11px;"><strong>{total_amount}</strong></td>
    </tr>
  </tbody>
</table>

<!-- BẰNG CHỮ -->
<p style="margin: 8px 0; font-size: 11px;"><strong>Bằng chữ:</strong> <em>{total_text}</em></p>

<!-- THANH TOÁN -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Phương thức TT:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{payment_name}</td>
      <td style="padding: 4px 6px; width: 18%; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">TT thanh toán:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{payment_status}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Khách đưa:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{payment_customer}</td>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Tiền thừa:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{money_return}</td>
    </tr>
  </tbody>
</table>

<!-- GHI CHÚ -->
<div style="margin: 8px 0; padding: 8px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">
  <strong>Ghi chú:</strong> {order_note}
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 25px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 8px; vertical-align: top;">
        <div style="font-weight: bold; font-size: 11px;">Người mua hàng</div>
        <div style="color: #888; font-size: 10px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 50px;"></div>
        <div style="font-size: 11px;">{customer_name}</div>
      </td>
      <td style="width: 50%; text-align: center; padding: 8px; vertical-align: top;">
        <div style="font-weight: bold; font-size: 11px;">Người bán hàng</div>
        <div style="color: #888; font-size: 10px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 50px;"></div>
        <div style="font-size: 11px;">{account_name}</div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 10px; color: #666;">
  <div>Cảm ơn quý khách đã mua hàng!</div>
  <div>Hotline: {store_phone_number} | In lúc: {print_date} {print_time}</div>
</div>

</div>
`;
}),
"[project]/features/settings/printer/templates/quote.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu báo giá / Đơn tạm tính - TipTap compatible
 * Cập nhật: Thiết kế đen trắng cho máy in
 */ __turbopack_context__.s([
    "QUOTE_TEMPLATE",
    ()=>QUOTE_TEMPLATE
]);
const QUOTE_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="width: 80px; vertical-align: top;">{store_logo}</td>
    <td style="vertical-align: top;">
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
      <div>{store_address}</div>
      <div>ĐT: {store_phone_number} | Email: {store_email}</div>
    </td>
  </tr>
</table>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU BÁO GIÁ</h2>
<div style="text-align: center; margin-bottom: 10px;">
  <div>Số: <strong>{order_code}</strong></div>
  <div>Ngày: {created_on} {created_on_time}</div>
  <div style="font-style: italic;">Hiệu lực đến: {issued_on}</div>
</div>

<!-- THÔNG TIN KHÁCH HÀNG -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Khách hàng:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{customer_name}</strong></td>
      <td style="padding: 5px; width: 15%; background: #f5f5f5; border: 1px solid #333;">Mã KH:</td>
      <td style="padding: 5px; border: 1px solid #333;">{customer_code}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Điện thoại:</td>
      <td style="padding: 5px; border: 1px solid #333;">{customer_phone_number}</td>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Email:</td>
      <td style="padding: 5px; border: 1px solid #333;">{customer_email}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Địa chỉ:</td>
      <td style="padding: 5px; border: 1px solid #333;" colspan="3">{billing_address}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Nhân viên:</td>
      <td style="padding: 5px; border: 1px solid #333;">{account_name}</td>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Chính sách giá:</td>
      <td style="padding: 5px; border: 1px solid #333;">{price_list_name}</td>
    </tr>
  </tbody>
</table>

<!-- BẢNG SẢN PHẨM -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 40px;">STT</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: left;">Tên sản phẩm</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 60px;">ĐVT</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 50px;">SL</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: right; width: 100px;">Đơn giá</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: right; width: 80px;">CK</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: right; width: 110px;">Thành tiền</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_stt}</td>
      <td style="padding: 6px; border: 1px solid #333;">{line_product_name}<br><small>{line_variant}</small></td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_unit}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_quantity}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: right;">{line_price}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: right;">{line_discount_amount}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: right;">{line_amount}</td>
    </tr>
  </tbody>
</table>

<!-- TỔNG GIÁ TRỊ -->
<table style="width: 250px; margin-left: auto; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Tổng tiền hàng:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right; width: 120px;">{total}</td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Chiết khấu:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;">{total_discount}</td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Thuế VAT:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;">{total_tax}</td>
    </tr>
    <tr style="background: #f5f5f5;">
      <td style="padding: 5px; border: 1px solid #333;"><strong>TỔNG CỘNG:</strong></td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;"><strong>{total_amount}</strong></td>
    </tr>
  </tbody>
</table>

<p style="margin: 10px 0;"><strong>Bằng chữ:</strong> <em>{total_text}</em></p>

<!-- GHI CHÚ -->
<div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {order_note}
</div>

<!-- ĐIỀU KHOẢN -->
<div style="margin-bottom: 10px; padding: 10px; border: 1px solid #333; font-size: 11px;">
  <strong>Điều khoản:</strong>
  <ul style="margin: 5px 0 0 15px; padding: 0;">
    <li>Báo giá có hiệu lực trong 7 ngày kể từ ngày lập</li>
    <li>Giá trên chưa bao gồm phí vận chuyển (nếu có)</li>
    <li>Thanh toán: Theo thỏa thuận</li>
  </ul>
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 10px;">
        <strong>Khách hàng</strong><br>
        <em>(Ký xác nhận đồng ý)</em><br>
        <div style="height: 50px;"></div>
        {customer_name}
      </td>
      <td style="width: 50%; text-align: center; padding: 10px;">
        <strong>Nhân viên báo giá</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
        {account_name}
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333;">
  <p style="margin: 5px 0;">Cảm ơn Quý khách đã quan tâm!</p>
  <p style="margin: 5px 0;">Liên hệ: {store_phone_number}</p>

  <div style="font-size: 10px; color: #666; margin-top: 5px;">In lúc: {print_date} {print_time}</div></div>

</div>
`;
}),
"[project]/features/settings/printer/templates/receipt.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu thu - TipTap compatible
 * Cập nhật: Thiết kế đen trắng cho máy in
 */ __turbopack_context__.s([
    "RECEIPT_TEMPLATE",
    ()=>RECEIPT_TEMPLATE
]);
const RECEIPT_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="width: 80px; vertical-align: top;">{store_logo}</td>
    <td style="vertical-align: top;">
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
      <div>{store_address}</div>
    </td>
  </tr>
</table>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU THU</h2>
<div style="text-align: center; margin-bottom: 10px;">
  <div>Số: <strong>{receipt_voucher_code}</strong></div>
  <div>Ngày: {created_on}</div>
</div>

<!-- MÃ VẠCH -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="text-align: center; padding: 10px; border: 1px solid #333; background: #f5f5f5;">
      <div style="margin-bottom: 8px;">{receipt_barcode}</div>
      <div style="font-family: monospace;">{receipt_voucher_code}</div>
    </td>
  </tr>
</table>

<!-- THÔNG TIN PHIẾU THU -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Người nộp tiền:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{object_name}</strong></td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Địa chỉ:</td>
      <td style="padding: 5px; border: 1px solid #333;">{object_address}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Lý do nộp:</td>
      <td style="padding: 5px; border: 1px solid #333;">{description}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Hình thức thanh toán:</td>
      <td style="padding: 5px; border: 1px solid #333;">{payment_method}</td>
    </tr>
  </tbody>
</table>

<!-- SỐ TIỀN -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="text-align: center; padding: 15px; border: 2px solid #333;">
      <div style="margin-bottom: 8px;">Số tiền</div>
      <div style="font-size: 24px; font-weight: bold;">{amount}</div>
      <div style="font-style: italic; margin-top: 8px;">({amount_text})</div>
    </td>
  </tr>
</table>

<!-- GHI CHÚ -->
<div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {note}
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Người nộp tiền</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
        {object_name}
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Thủ quỹ</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Người lập phiếu</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
        {account_name}
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 11px;">
  In lúc: {print_date} {print_time}
</div>

</div>
`;
}),
"[project]/features/settings/printer/templates/payment.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu chi - TipTap compatible
 * Cập nhật: Thiết kế đen trắng cho máy in
 */ __turbopack_context__.s([
    "PAYMENT_TEMPLATE",
    ()=>PAYMENT_TEMPLATE
]);
const PAYMENT_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="width: 80px; vertical-align: top;">{store_logo}</td>
    <td style="vertical-align: top;">
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
      <div>{store_address}</div>
    </td>
  </tr>
</table>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU CHI</h2>
<div style="text-align: center; margin-bottom: 10px;">
  <div>Số: <strong>{payment_voucher_code}</strong></div>
  <div>Ngày: {created_on}</div>
</div>

<!-- MÃ VẠCH -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="text-align: center; padding: 10px; border: 1px solid #333; background: #f5f5f5;">
      <div style="margin-bottom: 8px;">{payment_barcode}</div>
      <div style="font-family: monospace;">{payment_voucher_code}</div>
    </td>
  </tr>
</table>

<!-- THÔNG TIN PHIẾU CHI -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Người nhận tiền:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{object_name}</strong></td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Địa chỉ:</td>
      <td style="padding: 5px; border: 1px solid #333;">{object_address}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Lý do chi:</td>
      <td style="padding: 5px; border: 1px solid #333;">{description}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Hình thức thanh toán:</td>
      <td style="padding: 5px; border: 1px solid #333;">{payment_method}</td>
    </tr>
  </tbody>
</table>

<!-- SỐ TIỀN -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="text-align: center; padding: 15px; border: 2px solid #333;">
      <div style="margin-bottom: 8px;">Số tiền</div>
      <div style="font-size: 24px; font-weight: bold;">{amount}</div>
      <div style="font-style: italic; margin-top: 8px;">({amount_text})</div>
    </td>
  </tr>
</table>

<!-- GHI CHÚ -->
<div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {note}
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Người nhận tiền</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
        {object_name}
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Thủ quỹ</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Người lập phiếu</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
        {account_name}
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 11px;">
  In lúc: {print_date} {print_time}
</div>

</div>
`;
}),
"[project]/features/settings/printer/templates/warranty.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu bảo hành - TipTap compatible
 * Cập nhật: Thiết kế đen trắng cho máy in
 */ __turbopack_context__.s([
    "WARRANTY_TEMPLATE",
    ()=>WARRANTY_TEMPLATE
]);
const WARRANTY_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="width: 80px; vertical-align: top;">{store_logo}</td>
    <td style="vertical-align: top;">
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
      <div>{store_address}</div>
      <div>Hotline: <strong>{store_phone_number}</strong></div>
    </td>
  </tr>
</table>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU BẢO HÀNH</h2>
<div style="text-align: center; margin-bottom: 10px;">
  <div>Mã phiếu: <strong>{warranty_code}</strong></div>
  <div>Ngày: {created_on}</div>
</div>

<!-- THÔNG TIN KHÁCH HÀNG -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Khách hàng:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{customer_name}</strong></td>
      <td style="padding: 5px; width: 15%; background: #f5f5f5; border: 1px solid #333;">SĐT:</td>
      <td style="padding: 5px; border: 1px solid #333;">{customer_phone_number}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Địa chỉ:</td>
      <td style="padding: 5px; border: 1px solid #333;" colspan="3">{customer_address}</td>
    </tr>
  </tbody>
</table>

<!-- THÔNG TIN SẢN PHẨM BẢO HÀNH -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed; border: 2px solid #333;">
  <tbody>
    <tr>
      <td style="padding: 8px; width: 25%; background: #f5f5f5; border: 1px solid #333;">Sản phẩm:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{product_name}</strong></td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333;">Serial/IMEI:</td>
      <td style="padding: 8px; border: 1px solid #333; font-family: monospace; font-size: 14px;">{serial_number}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333;">Thời hạn BH:</td>
      <td style="padding: 8px; border: 1px solid #333;">{warranty_duration}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333;">Ngày hết hạn:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{warranty_expired_on}</strong></td>
    </tr>
  </tbody>
</table>

<!-- QUY ĐỊNH BẢO HÀNH -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tr>
    <td style="width: 50%; padding: 10px; border: 1px solid #333; vertical-align: top;">
      <strong>ĐƯỢC BẢO HÀNH:</strong>
      <div style="padding-left: 10px; margin-top: 5px;">
        <div>- Còn trong thời hạn bảo hành</div>
        <div>- Tem bảo hành còn nguyên vẹn</div>
        <div>- Hư hỏng do lỗi kỹ thuật từ NSX</div>
      </div>
    </td>
    <td style="width: 50%; padding: 10px; border: 1px solid #333; vertical-align: top;">
      <strong>TỪ CHỐI BẢO HÀNH:</strong>
      <div style="padding-left: 10px; margin-top: 5px;">
        <div>- Rơi vỡ, trầy xước, biến dạng</div>
        <div>- Vào nước, ẩm, cháy, nổ</div>
        <div>- Tự ý tháo lắp, sửa chữa</div>
        <div>- Sử dụng sai cách, cố ý làm hư</div>
      </div>
    </td>
  </tr>
</table>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 10px;">
        <strong>Khách hàng</strong><br>
        <em>(Ký xác nhận)</em><br>
        <div style="height: 50px;"></div>
        {customer_name}
      </td>
      <td style="width: 50%; text-align: center; padding: 10px;">
        <strong>Nhân viên</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
        {account_name}
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 11px;">
  Cảm ơn quý khách đã tin tưởng sử dụng dịch vụ của chúng tôi!

  <div style="font-size: 10px; color: #666; margin-top: 5px;">In lúc: {print_date} {print_time}</div></div>

</div>
`;
}),
"[project]/features/settings/printer/templates/inventory-check.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu kiểm kho - TipTap compatible
 * Cập nhật: Thiết kế đen trắng cho máy in
 */ __turbopack_context__.s([
    "INVENTORY_CHECK_TEMPLATE",
    ()=>INVENTORY_CHECK_TEMPLATE
]);
const INVENTORY_CHECK_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="width: 80px; vertical-align: top;">{store_logo}</td>
    <td style="vertical-align: top;">
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
      <div>{store_address}</div>
    </td>
  </tr>
</table>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU KIỂM KHO</h2>
<div style="text-align: center; margin-bottom: 10px;">
  <div>Mã phiếu: <strong>{inventory_code}</strong></div>
  <div>Ngày kiểm: {created_on}</div>
</div>

<!-- THÔNG TIN KHO -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Kho kiểm:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{location_name}</strong></td>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Trạng thái:</td>
      <td style="padding: 5px; border: 1px solid #333;">{inventory_status}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Người kiểm:</td>
      <td style="padding: 5px; border: 1px solid #333;" colspan="3">{account_name}</td>
    </tr>
  </tbody>
</table>

<!-- BẢNG SẢN PHẨM -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 40px;">STT</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 100px;">Mã SP</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: left;">Tên sản phẩm</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 70px;">Tồn kho</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 70px;">Thực tế</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 60px;">Lệch</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: left; width: 100px;">Ghi chú</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_stt}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center; font-family: monospace;">{line_variant_code}</td>
      <td style="padding: 6px; border: 1px solid #333;">{line_product_name}<br><small>{line_variant}</small></td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_on_hand}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center; font-weight: bold;">{line_real_quantity}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center; font-weight: bold;">{line_difference}</td>
      <td style="padding: 6px; border: 1px solid #333; font-size: 11px;">{line_note}</td>
    </tr>
  </tbody>
</table>

<!-- TỔNG KẾT -->
<table style="width: 250px; margin-left: auto; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Tổng số SP kiểm:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right; width: 80px;"><strong>{total_items}</strong></td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Chênh lệch (thừa):</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;"><strong>+{total_surplus}</strong></td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Chênh lệch (thiếu):</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;"><strong>-{total_shortage}</strong></td>
    </tr>
  </tbody>
</table>

<!-- GHI CHÚ -->
<div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {note}
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 10px;">
        <strong>Người kiểm kho</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
        {account_name}
      </td>
      <td style="width: 50%; text-align: center; padding: 10px;">
        <strong>Thủ kho</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 11px;">
  In lúc: {print_date} {print_time}
</div>

</div>
`;
}),
"[project]/features/settings/printer/templates/stock-transfer.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu chuyển kho - TipTap compatible
 * Cập nhật: Thiết kế đen trắng cho máy in
 */ __turbopack_context__.s([
    "STOCK_TRANSFER_TEMPLATE",
    ()=>STOCK_TRANSFER_TEMPLATE
]);
const STOCK_TRANSFER_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="width: 80px; vertical-align: top;">{store_logo}</td>
    <td style="vertical-align: top;">
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
      <div>{store_address}</div>
    </td>
  </tr>
</table>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU CHUYỂN KHO</h2>
<div style="text-align: center; margin-bottom: 10px;">
  <div>Mã phiếu: <strong>{transfer_code}</strong></div>
  <div>Ngày: {created_on}</div>
</div>

<!-- THÔNG TIN CHUYỂN KHO -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 10px; width: 45%; border: 2px solid #333; text-align: center;">
        <div style="font-size: 12px;">KHO XUẤT</div>
        <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{source_location_name}</div>
      </td>
      <td style="padding: 10px; text-align: center; font-size: 20px; width: 10%;">--&gt;</td>
      <td style="padding: 10px; width: 45%; border: 2px solid #333; text-align: center;">
        <div style="font-size: 12px;">KHO NHẬP</div>
        <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{target_location_name}</div>
      </td>
    </tr>
  </tbody>
</table>

<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Trạng thái:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{status}</strong></td>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Người tạo:</td>
      <td style="padding: 5px; border: 1px solid #333;">{account_name}</td>
    </tr>
  </tbody>
</table>

<!-- BẢNG SẢN PHẨM -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 40px;">STT</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 100px;">Mã SP</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: left;">Tên sản phẩm</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 60px;">ĐVT</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 80px;">Số lượng</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 40px;">OK</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_stt}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center; font-family: monospace;">{line_variant_code}</td>
      <td style="padding: 6px; border: 1px solid #333;">{line_product_name}<br><small>{line_variant}</small></td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_unit}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center; font-weight: bold;">{line_quantity}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;"><div style="width: 16px; height: 16px; border: 1px solid #333; margin: 0 auto;"></div></td>
    </tr>
  </tbody>
</table>

<!-- TỔNG CỘNG -->
<table style="width: 250px; margin-left: auto; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr style="background: #f5f5f5;">
      <td style="padding: 5px; border: 1px solid #333;"><strong>Tổng số lượng:</strong></td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;"><strong>{total_quantity}</strong></td>
    </tr>
  </tbody>
</table>

<!-- GHI CHÚ -->
<div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {note}
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Người lập phiếu</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
        {account_name}
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Thủ kho xuất</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Thủ kho nhập</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 11px;">
  In lúc: {print_date} {print_time}
</div>

</div>
`;
}),
"[project]/features/settings/printer/templates/sales-return.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu trả hàng - TipTap compatible
 * Cập nhật: Thiết kế đen trắng cho máy in
 */ __turbopack_context__.s([
    "SALES_RETURN_TEMPLATE",
    ()=>SALES_RETURN_TEMPLATE
]);
const SALES_RETURN_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="width: 80px; vertical-align: top;">{store_logo}</td>
    <td style="vertical-align: top;">
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
      <div>{store_address}</div>
    </td>
  </tr>
</table>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU TRẢ HÀNG</h2>
<div style="text-align: center; margin-bottom: 10px;">
  <div>Số: <strong>{order_return_code}</strong></div>
  <div>Đơn hàng gốc: <strong>{order_code}</strong></div>
  <div>Ngày: {created_on}</div>
</div>

<!-- THÔNG TIN KHÁCH HÀNG -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Khách hàng:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{customer_name}</strong></td>
      <td style="padding: 5px; width: 15%; background: #f5f5f5; border: 1px solid #333;">SĐT:</td>
      <td style="padding: 5px; border: 1px solid #333;">{customer_phone_number}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Lý do trả:</td>
      <td style="padding: 5px; border: 1px solid #333;" colspan="3"><strong>{reason_return}</strong></td>
    </tr>
  </tbody>
</table>

<!-- BẢNG SẢN PHẨM TRẢ -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 40px;">STT</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 100px;">Mã SP</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: left;">Tên sản phẩm</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 60px;">ĐVT</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 60px;">SL Trả</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: right; width: 100px;">Đơn giá</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: right; width: 110px;">Thành tiền</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_stt}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center; font-family: monospace;">{line_variant_code}</td>
      <td style="padding: 6px; border: 1px solid #333;">{line_product_name}<br><small>{line_variant}</small></td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_unit}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center; font-weight: bold;">{line_quantity}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: right;">{line_price}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: right;">{line_total}</td>
    </tr>
  </tbody>
</table>

<!-- TỔNG TIỀN HOÀN -->
<table style="width: 250px; margin-left: auto; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Tổng số lượng trả:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right; width: 100px;"><strong>{total_quantity}</strong></td>
    </tr>
    <tr style="background: #f5f5f5;">
      <td style="padding: 5px; border: 1px solid #333;"><strong>TỔNG TIỀN HOÀN:</strong></td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;"><strong>{total}</strong></td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Trạng thái hoàn:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;">{refund_status}</td>
    </tr>
  </tbody>
</table>

<!-- GHI CHÚ -->
<div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {note}
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 10px;">
        <strong>Khách hàng</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
        {customer_name}
      </td>
      <td style="width: 50%; text-align: center; padding: 10px;">
        <strong>Người nhận hàng trả</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
        {account_name}
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 11px;">
  Hotline: {store_phone_number}

  <div style="font-size: 10px; color: #666; margin-top: 5px;">In lúc: {print_date} {print_time}</div></div>

</div>
`;
}),
"[project]/features/settings/printer/templates/purchase-order.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Đơn đặt hàng nhập - TipTap compatible
 * Cập nhật: Thiết kế đen trắng cho máy in
 */ __turbopack_context__.s([
    "PURCHASE_ORDER_TEMPLATE",
    ()=>PURCHASE_ORDER_TEMPLATE
]);
const PURCHASE_ORDER_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="width: 80px; vertical-align: top;">{store_logo}</td>
    <td style="vertical-align: top;">
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
      <div>{store_address}</div>
    </td>
  </tr>
</table>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 10px;">ĐƠN ĐẶT HÀNG NHẬP</h2>
<div style="text-align: center; margin-bottom: 10px;">
  <div>Số: <strong>{order_supplier_code}</strong></div>
  <div>Ngày: {created_on}</div>
</div>

<!-- THÔNG TIN NHÀ CUNG CẤP -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Nhà cung cấp:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{supplier_name}</strong></td>
      <td style="padding: 5px; width: 15%; background: #f5f5f5; border: 1px solid #333;">Mã NCC:</td>
      <td style="padding: 5px; border: 1px solid #333; font-family: monospace;">{supplier_code}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Điện thoại:</td>
      <td style="padding: 5px; border: 1px solid #333;">{supplier_phone_number}</td>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Email:</td>
      <td style="padding: 5px; border: 1px solid #333;">{supplier_email}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Địa chỉ:</td>
      <td style="padding: 5px; border: 1px solid #333;" colspan="3">{supplier_address}</td>
    </tr>
  </tbody>
</table>

<!-- BẢNG SẢN PHẨM -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 40px;">STT</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 100px;">Mã SP</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: left;">Tên sản phẩm</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 60px;">ĐVT</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 60px;">SL Đặt</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: right; width: 100px;">Đơn giá</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: right; width: 110px;">Thành tiền</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_stt}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center; font-family: monospace;">{line_variant_code}</td>
      <td style="padding: 6px; border: 1px solid #333;">{line_product_name}<br><small>{line_variant}</small></td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_unit}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_ordered_quantity}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: right;">{line_price}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: right;">{line_total}</td>
    </tr>
  </tbody>
</table>

<!-- TỔNG TIỀN -->
<table style="width: 250px; margin-left: auto; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Tổng tiền hàng:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right; width: 100px;">{total}</td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Chiết khấu:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;">{discount}</td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Thuế VAT:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;">{tax_vat}</td>
    </tr>
    <tr style="background: #f5f5f5;">
      <td style="padding: 5px; border: 1px solid #333;"><strong>TỔNG CỘNG:</strong></td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;"><strong>{total_order}</strong></td>
    </tr>
  </tbody>
</table>

<!-- GHI CHÚ -->
<div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {note}
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 10px;">
        <strong>Người lập đơn</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
        {account_name}
      </td>
      <td style="width: 50%; text-align: center; padding: 10px;">
        <strong>Duyệt đơn</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 11px;">
  In lúc: {print_date} {print_time}
</div>

</div>
`;
}),
"[project]/features/settings/printer/templates/packing.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu đóng gói - TipTap compatible
 * Cập nhật: 2025-12-08 - Responsive + Chuẩn hóa
 */ __turbopack_context__.s([
    "PACKING_TEMPLATE",
    ()=>PACKING_TEMPLATE
]);
const PACKING_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<table style="width: 100%; margin-bottom: 12px; border-collapse: collapse;">
  <tr>
    <td style="width: 70px; vertical-align: top; padding-right: 10px;">{store_logo}</td>
    <td style="vertical-align: top;">
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
      <div style="font-size: 11px; color: #333;">{store_address}</div>
    </td>
  </tr>
</table>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 12px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 8px;">PHIẾU ĐÓNG GÓI</h2>
<div style="text-align: center; margin-bottom: 12px; font-size: 11px;">
  <div>Mã: <strong>{fulfillment_code}</strong> | Đơn hàng: <strong>{order_code}</strong></div>
  <div>Ngày: {created_on}</div>
</div>

<!-- THÔNG TIN -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Khách hàng:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;"><strong>{customer_name}</strong></td>
      <td style="padding: 4px 6px; width: 15%; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">SĐT:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{customer_phone_number}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Địa chỉ giao:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;" colspan="3">{shipping_address}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">NV được gán:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;" colspan="3">{assigned_employee}</td>
    </tr>
  </tbody>
</table>

<!-- BẢNG SẢN PHẨM - Responsive -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: center; width: 28px; font-size: 10px;">STT</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: center; width: 70px; font-size: 10px;">Mã SP</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: left; font-size: 10px;">Tên sản phẩm</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: center; width: 35px; font-size: 10px;">SL</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: center; width: 55px; font-size: 10px;">Vị trí</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: left; width: 70px; font-size: 10px;">Ghi chú</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: center; width: 28px; font-size: 10px;">OK</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: center; font-size: 10px;">{line_stt}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: center; font-family: monospace; font-size: 9px;">{line_variant_code}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; font-size: 10px; word-wrap: break-word;">{line_product_name}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: center; font-weight: bold; font-size: 11px;">{line_quantity}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: center; font-size: 10px;">{bin_location}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; font-size: 9px;">{line_note}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: center;"><div style="width: 14px; height: 14px; border: 1px solid #333; margin: 0 auto;"></div></td>
    </tr>
  </tbody>
</table>

<!-- TỔNG CỘNG VÀ COD -->
<table style="width: 220px; margin-left: auto; border-collapse: collapse; margin-bottom: 10px;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Tổng số lượng:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; width: 75px; font-size: 11px;"><strong>{total_quantity}</strong></td>
    </tr>
    <tr style="background: #f5f5f5;">
      <td style="padding: 5px 6px; border: 1px solid #333; font-size: 11px;"><strong>COD - THU HỘ:</strong></td>
      <td style="padding: 5px 6px; border: 1px solid #333; text-align: right; font-size: 11px;"><strong>{cod}</strong></td>
    </tr>
  </tbody>
</table>

<!-- GHI CHÚ -->
<div style="margin: 8px 0; padding: 8px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">
  <strong>Ghi chú đóng gói:</strong> {packing_note}
</div>
<div style="margin: 8px 0; padding: 8px; border: 1px solid #333; font-size: 11px;">
  <strong>Ghi chú đơn hàng:</strong> {order_note}
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 25px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 8px; vertical-align: top;">
        <div style="font-weight: bold; font-size: 11px;">Người đóng gói</div>
        <div style="color: #888; font-size: 10px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 50px;"></div>
        <div style="font-size: 11px;">{account_name}</div>
      </td>
      <td style="width: 50%; text-align: center; padding: 8px; vertical-align: top;">
        <div style="font-weight: bold; font-size: 11px;">Kiểm tra</div>
        <div style="color: #888; font-size: 10px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 50px;"></div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 10px; color: #666;">
  In lúc: {print_date} {print_time}
</div>

</div>
`;
}),
"[project]/features/settings/printer/templates/delivery.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu giao hàng - TipTap compatible
 * Cập nhật: 2025-12-08 - Responsive + Chuẩn hóa
 */ __turbopack_context__.s([
    "DELIVERY_TEMPLATE",
    ()=>DELIVERY_TEMPLATE
]);
const DELIVERY_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<table style="width: 100%; margin-bottom: 12px; border-collapse: collapse;">
  <tr>
    <td style="width: 70px; vertical-align: top; padding-right: 10px;">{store_logo}</td>
    <td style="vertical-align: top;">
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
      <div style="font-size: 11px; color: #333;">{store_address}</div>
      <div style="font-size: 11px; color: #333;">ĐT: {store_phone_number}</div>
    </td>
  </tr>
</table>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 12px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 8px;">PHIẾU GIAO HÀNG</h2>
<div style="text-align: center; margin-bottom: 12px; font-size: 11px;">
  <div>Mã: <strong>{delivery_code}</strong> | Đơn hàng: <strong>{order_code}</strong></div>
  <div>Ngày: {created_on} {created_on_time}</div>
</div>

<!-- MÃ VẠCH VẬN ĐƠN -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="text-align: center; padding: 8px; border: 1px solid #333; background: #f5f5f5;">
      <div style="margin-bottom: 5px;">{shipment_barcode}</div>
      <div style="font-size: 14px; font-weight: bold; font-family: monospace;">{tracking_number}</div>
      <div style="font-size: 10px;">Đối tác: {carrier_name}</div>
    </td>
  </tr>
</table>

<!-- THÔNG TIN NGƯỜI NHẬN -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Người nhận:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;"><strong>{receiver_name}</strong></td>
      <td style="padding: 4px 6px; width: 15%; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">SĐT:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{receiver_phone}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Địa chỉ giao:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;" colspan="3">{shipping_address}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">NV giao hàng:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{shipper_name}</td>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Trạng thái:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{delivery_status}</td>
    </tr>
  </tbody>
</table>

<!-- BẢNG SẢN PHẨM - Responsive -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: center; width: 28px; font-size: 10px;">STT</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: center; width: 70px; font-size: 10px;">Mã SP</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: left; font-size: 10px;">Tên sản phẩm</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: center; width: 32px; font-size: 10px;">ĐVT</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: center; width: 30px; font-size: 10px;">SL</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: right; width: 60px; font-size: 10px;">Đơn giá</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: right; width: 70px; font-size: 10px;">Thành tiền</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: center; font-size: 10px;">{line_stt}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: center; font-family: monospace; font-size: 9px;">{line_variant_code}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; font-size: 10px; word-wrap: break-word;">{line_product_name}<br><small style="color: #666;">{line_variant}</small></td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: center; font-size: 10px;">{line_unit}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: center; font-weight: bold; font-size: 11px;">{line_quantity}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: right; font-size: 10px;">{line_price}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: right; font-size: 10px;">{line_amount}</td>
    </tr>
  </tbody>
</table>

<!-- TỔNG GIÁ TRỊ -->
<table style="width: 250px; margin-left: auto; border-collapse: collapse; margin-bottom: 10px;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Tổng số lượng:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; width: 85px; font-size: 11px;"><strong>{total_quantity}</strong></td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Tổng tiền hàng:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px;">{total}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Phí vận chuyển:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px;">{delivery_fee}</td>
    </tr>
    <tr style="background: #f5f5f5;">
      <td style="padding: 5px 6px; border: 1px solid #333; font-size: 11px;"><strong>COD - THU HỘ:</strong></td>
      <td style="padding: 5px 6px; border: 1px solid #333; text-align: right; font-size: 11px;"><strong>{cod_amount}</strong></td>
    </tr>
  </tbody>
</table>

<!-- GHI CHÚ -->
<div style="margin: 8px 0; padding: 8px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">
  <strong>Ghi chú:</strong> {note}
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 25px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 8px; vertical-align: top;">
        <div style="font-weight: bold; font-size: 11px;">Người giao</div>
        <div style="color: #888; font-size: 10px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 50px;"></div>
        <div style="font-size: 11px;">{shipper_name}</div>
      </td>
      <td style="width: 50%; text-align: center; padding: 8px; vertical-align: top;">
        <div style="font-weight: bold; font-size: 11px;">Người nhận</div>
        <div style="color: #888; font-size: 10px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 50px;"></div>
        <div style="font-size: 11px;">{receiver_name}</div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 10px; color: #666;">
  <div>Cảm ơn quý khách!</div>
  <div>Hotline: {store_phone_number} | In lúc: {print_date} {print_time}</div>
</div>

</div>
`;
}),
"[project]/features/settings/printer/templates/shipping-label.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Nhãn giao hàng - TipTap compatible
 * Cập nhật: Thiết kế đen trắng cho máy in
 */ __turbopack_context__.s([
    "SHIPPING_LABEL_TEMPLATE",
    ()=>SHIPPING_LABEL_TEMPLATE,
    "SHIPPING_LABEL_TEMPLATE_LARGE",
    ()=>SHIPPING_LABEL_TEMPLATE_LARGE,
    "SHIPPING_LABEL_TEMPLATE_SMALL",
    ()=>SHIPPING_LABEL_TEMPLATE_SMALL
]);
const SHIPPING_LABEL_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 13px; line-height: 1.4; max-width: 400px; margin: 0 auto; border: 2px solid #333; padding: 15px;">

<!-- HEADER -->
<div style="text-align: center; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 2px dashed #333;">
  <div style="font-size: 14px; font-weight: bold;">{store_name}</div>
  <div style="font-size: 12px;">{store_phone_number}</div>
</div>

<!-- MÃ VẬN ĐƠN -->
<div style="text-align: center; margin-bottom: 10px; padding: 10px; background: #f5f5f5;">
  <div style="margin-bottom: 8px;">{shipment_barcode}</div>
  <div style="font-size: 18px; font-weight: bold; font-family: monospace;">{shipment_code}</div>
  <div style="font-size: 12px;">Đơn: {order_code}</div>
</div>

<!-- NGƯỜI GỬI -->
<div style="margin-bottom: 10px; padding: 8px; background: #f5f5f5;">
  <div style="font-weight: bold; font-size: 11px;">Gửi:</div>
  <div><strong>{store_name}</strong></div>
  <div style="font-size: 11px;">{store_address}</div>
</div>

<!-- NGƯỜI NHẬN -->
<div style="margin-bottom: 10px; padding: 10px; border: 1px solid #333;">
  <div style="font-weight: bold; font-size: 11px;">Nhận:</div>
  <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{customer_name}</div>
  <div style="font-size: 14px; font-weight: bold;">{customer_phone_number}</div>
  <div style="font-size: 12px;">{shipping_address}</div>
</div>

<!-- THÔNG TIN KIỆN -->
<table style="width: 100%; margin-bottom: 10px; border-collapse: collapse;">
  <tr>
    <td style="text-align: center; padding: 8px; background: #f5f5f5; width: 50%; border: 1px solid #333;">
      <div style="font-size: 11px;">Số lượng</div>
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{total_quantity}</div>
    </td>
    <td style="text-align: center; padding: 8px; background: #f5f5f5; width: 50%; border: 1px solid #333;">
      <div style="font-size: 11px;">Khối lượng</div>
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{total_weight_g}g</div>
    </td>
  </tr>
</table>

<!-- COD -->
<div style="text-align: center; padding: 12px; border: 2px solid #333; margin-bottom: 10px;">
  <div style="font-size: 12px; font-weight: bold;">THU HỘ (COD)</div>
  <div style="font-size: 22px; font-weight: bold;">{cod}</div>
</div>

<!-- GHI CHÚ -->
<div style="font-size: 11px;">
  <strong>Ghi chú:</strong> {note}
</div>

</div>
`;
const SHIPPING_LABEL_TEMPLATE_SMALL = `
<div style="font-family: Arial, sans-serif; font-size: 11px; line-height: 1.3; max-width: 300px; padding: 10px; border: 1px solid #333;">
  <div style="text-align: center; margin-bottom: 8px;">{shipment_barcode}</div>
  <div style="text-align: center; font-weight: bold; font-family: monospace; margin-bottom: 10px;">{shipment_code}</div>
  <div style="border-top: 1px dashed #333; padding-top: 8px;">
    <div><strong>{customer_name}</strong></div>
    <div>{customer_phone_number}</div>
    <div style="font-size: 10px;">{shipping_address}</div>
  </div>
  <div style="text-align: center; margin-top: 10px; padding: 5px; background: #f5f5f5; font-weight: bold;">
    COD: {cod}
  </div>
</div>
`;
const SHIPPING_LABEL_TEMPLATE_LARGE = `
<div style="font-family: Arial, sans-serif; font-size: 13px; line-height: 1.4; max-width: 500px; margin: 0 auto; border: 3px solid #333; padding: 20px;">

<!-- HEADER -->
<div style="text-align: center; margin-bottom: 10px; padding-bottom: 15px; border-bottom: 2px solid #333;">
  <div style="font-size: 18px; font-weight: bold;">{store_name}</div>
  <div>{store_phone_number}</div>
</div>

<!-- MÃ VẠCH + QR -->
<table style="width: 100%; margin-bottom: 20px;">
  <tr>
    <td style="text-align: center; width: 60%;">{shipment_barcode}</td>
    <td style="text-align: center; width: 40%;">{shipment_qrcode}</td>
  </tr>
</table>

<div style="text-align: center; margin-bottom: 20px;">
  <div style="font-size: 28px; font-weight: bold; font-family: monospace;">{shipment_code}</div>
  <div>Đơn: {order_code}</div>
</div>

<!-- NGƯỜI GỬI / NHẬN -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
  <tr>
    <td style="padding: 15px; background: #f5f5f5; border: 1px solid #333; vertical-align: top; width: 50%;">
      <div style="font-weight: bold; margin-bottom: 5px;">NGƯỜI GỬI</div>
      <div><strong>{store_name}</strong></div>
      <div>{store_phone_number}</div>
      <div style="font-size: 11px;">{store_address}</div>
    </td>
    <td style="padding: 15px; border: 2px solid #333; vertical-align: top; width: 50%;">
      <div style="font-weight: bold; margin-bottom: 5px;">NGƯỜI NHẬN</div>
      <div style="font-size: 16px;"><strong>{customer_name}</strong></div>
      <div style="font-size: 15px; font-weight: bold;">{customer_phone_number}</div>
      <div style="font-size: 12px;">{shipping_address}</div>
    </td>
  </tr>
</table>

<!-- THÔNG TIN KIỆN -->
<table style="width: 100%; margin-bottom: 10px; border-collapse: collapse;">
  <tr>
    <td style="text-align: center; padding: 15px; background: #f5f5f5; width: 50%; border: 1px solid #333;">
      <div style="font-size: 12px;">Số lượng</div>
      <div style="font-size: 24px; font-weight: bold;">{total_quantity}</div>
    </td>
    <td style="text-align: center; padding: 15px; background: #f5f5f5; width: 50%; border: 1px solid #333;">
      <div style="font-size: 12px;">Khối lượng</div>
      <div style="font-size: 24px; font-weight: bold;">{total_weight_kg} kg</div>
    </td>
  </tr>
</table>

<!-- COD -->
<div style="text-align: center; padding: 20px; border: 3px solid #333; margin-bottom: 10px;">
  <div style="font-size: 14px; font-weight: bold;">THU HỘ (COD)</div>
  <div style="font-size: 32px; font-weight: bold;">{cod}</div>
</div>

<!-- GHI CHÚ -->
<div style="padding: 10px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {note}
</div>

</div>
`;
}),
"[project]/features/settings/printer/templates/product-label.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Tem phụ sản phẩm (product label)
 * Thiết kế theo mẫu tem phụ nhập khẩu chuẩn
 */ __turbopack_context__.s([
    "PRODUCT_LABEL_TEMPLATE",
    ()=>PRODUCT_LABEL_TEMPLATE
]);
const PRODUCT_LABEL_TEMPLATE = `
<div style="font-family: 'Inter', Arial, sans-serif; width: 320px; background: #fff; padding: 16px; line-height: 1.5; font-size: 13px; color: #111;">
  <!-- TÊN SẢN PHẨM -->
  <div style="margin-bottom: 12px;">
    <span style="font-weight: 700;">TÊN SẢN PHẨM:</span> {product_name_vat}
  </div>

  <!-- THƯƠNG HIỆU & ĐỊA CHỈ SẢN XUẤT -->
  <div style="margin-bottom: 8px;">
    <span style="font-weight: 700;">Thương Hiệu:</span> {product_brand}. <span style="font-weight: 700;">Địa chỉ sản xuất:</span> {product_origin}
  </div>

  <!-- HƯỚNG DẪN SỬ DỤNG -->
  <div style="margin-bottom: 8px;">
    <span style="font-weight: 700;">Hướng Dẫn sử dụng:</span> {product_usage_guide}
  </div>

  <!-- ĐƠN VỊ NHẬP KHẨU -->
  <div style="margin-bottom: 8px;">
    <span style="font-weight: 700;">ĐƠN VỊ NHẬP KHẨU:</span> {product_importer_name}
  </div>

  <!-- ĐỊA CHỈ NHẬP KHẨU -->
  <div style="margin-bottom: 12px;">
    <span style="font-weight: 700;">Địa chỉ:</span> {product_importer_address}
  </div>

  <!-- BARCODE -->
  <div style="display: flex; align-items: center; gap: 12px; padding-top: 8px; border-top: 1px dashed #ccc;">
    <div style="flex: 1;">
      {product_barcode_image}
      <div style="font-size: 11px; margin-top: 2px;">{product_barcode}</div>
    </div>
  </div>
</div>
`;
}),
"[project]/features/settings/printer/templates/stock-in.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu nhập kho - TipTap compatible
 * Cập nhật: Thiết kế đen trắng cho máy in
 */ __turbopack_context__.s([
    "STOCK_IN_TEMPLATE",
    ()=>STOCK_IN_TEMPLATE
]);
const STOCK_IN_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="width: 80px; vertical-align: top;">{store_logo}</td>
    <td style="vertical-align: top;">
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
      <div>{store_address}</div>
    </td>
  </tr>
</table>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU NHẬP KHO</h2>
<div style="text-align: center; margin-bottom: 10px;">
  <div>Mã: <strong>{stock_in_code}</strong></div>
  <div>Đơn đặt hàng: <strong>{order_supplier_code}</strong></div>
  <div>Ngày: {created_on}</div>
</div>

<!-- THÔNG TIN NHẬP KHO -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Kho nhập:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{location_name}</strong></td>
      <td style="padding: 5px; width: 15%; background: #f5f5f5; border: 1px solid #333;">Trạng thái:</td>
      <td style="padding: 5px; border: 1px solid #333;">{stock_in_status}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Nhà cung cấp:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{supplier_name}</strong></td>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Mã NCC:</td>
      <td style="padding: 5px; border: 1px solid #333; font-family: monospace;">{supplier_code}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Người tạo:</td>
      <td style="padding: 5px; border: 1px solid #333;" colspan="3">{account_name}</td>
    </tr>
  </tbody>
</table>

<!-- BẢNG SẢN PHẨM -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 35px;">STT</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 90px;">Mã SP</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: left;">Tên sản phẩm</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 50px;">ĐVT</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 55px;">SL Đặt</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 55px;">SL Nhập</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: right; width: 90px;">Đơn giá</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: right; width: 100px;">Thành tiền</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_stt}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center; font-family: monospace;">{line_variant_code}</td>
      <td style="padding: 6px; border: 1px solid #333;">{line_product_name}<br><small>{line_variant}</small></td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_unit}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_ordered_quantity}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center; font-weight: bold;">{line_received_quantity}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: right;">{line_price}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: right;">{line_total}</td>
    </tr>
  </tbody>
</table>

<!-- TỔNG TIỀN -->
<table style="width: 250px; margin-left: auto; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Tổng tiền hàng:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right; width: 100px;">{total}</td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Chiết khấu:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;">{discount}</td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Thuế VAT:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;">{tax_vat}</td>
    </tr>
    <tr style="background: #f5f5f5;">
      <td style="padding: 5px; border: 1px solid #333;"><strong>TỔNG CỘNG:</strong></td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;"><strong>{total_order}</strong></td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Đã thanh toán:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;">{paid}</td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Còn phải trả:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;"><strong>{remaining}</strong></td>
    </tr>
  </tbody>
</table>

<!-- GHI CHÚ -->
<div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {note}
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Người giao</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Thủ kho</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Người lập</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
        {account_name}
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 11px;">
  In lúc: {print_date} {print_time}
</div>

</div>
`;
}),
"[project]/features/settings/printer/templates/supplier-return.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu trả hàng NCC - TipTap compatible
 * Cập nhật: Thiết kế đen trắng cho máy in
 */ __turbopack_context__.s([
    "SUPPLIER_RETURN_TEMPLATE",
    ()=>SUPPLIER_RETURN_TEMPLATE
]);
const SUPPLIER_RETURN_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="width: 80px; vertical-align: top;">{store_logo}</td>
    <td style="vertical-align: top;">
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
      <div>{store_address}</div>
    </td>
  </tr>
</table>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU TRẢ HÀNG NHÀ CUNG CẤP</h2>
<div style="text-align: center; margin-bottom: 10px;">
  <div>Mã: <strong>{return_supplier_code}</strong></div>
  <div>Ngày: {created_on}</div>
</div>

<!-- THÔNG TIN NHÀ CUNG CẤP -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Nhà cung cấp:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{supplier_name}</strong></td>
      <td style="padding: 5px; width: 15%; background: #f5f5f5; border: 1px solid #333;">Mã NCC:</td>
      <td style="padding: 5px; border: 1px solid #333; font-family: monospace;">{supplier_code}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Điện thoại:</td>
      <td style="padding: 5px; border: 1px solid #333;">{supplier_phone_number}</td>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Email:</td>
      <td style="padding: 5px; border: 1px solid #333;">{supplier_email}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Địa chỉ:</td>
      <td style="padding: 5px; border: 1px solid #333;" colspan="3">{supplier_address}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Lý do trả:</td>
      <td style="padding: 5px; border: 1px solid #333;" colspan="3"><strong>{reason_return}</strong></td>
    </tr>
  </tbody>
</table>

<!-- BẢNG SẢN PHẨM TRẢ -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 40px;">STT</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 100px;">Mã SP</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: left;">Tên sản phẩm</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 60px;">ĐVT</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 60px;">SL Trả</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: right; width: 100px;">Đơn giá</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: right; width: 110px;">Thành tiền</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_stt}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center; font-family: monospace;">{line_variant_code}</td>
      <td style="padding: 6px; border: 1px solid #333;">{line_product_name}<br><small>{line_variant}</small></td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_unit}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center; font-weight: bold;">{line_quantity}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: right;">{line_price}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: right;">{line_total}</td>
    </tr>
  </tbody>
</table>

<!-- TỔNG GIÁ TRỊ -->
<table style="width: 250px; margin-left: auto; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr style="background: #f5f5f5;">
      <td style="padding: 8px; border: 1px solid #333;"><strong>TỔNG GIÁ TRỊ TRẢ:</strong></td>
      <td style="padding: 8px; border: 1px solid #333; text-align: right; width: 100px;"><strong>{total_order}</strong></td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Đã nhận hoàn:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;">{refunded}</td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Còn phải nhận:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;"><strong>{remaining}</strong></td>
    </tr>
  </tbody>
</table>

<!-- GHI CHÚ -->
<div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {note}
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Đại diện NCC</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Thủ kho</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Người lập</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
        {account_name}
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 11px;">
  In lúc: {print_date} {print_time}
</div>

</div>
`;
}),
"[project]/features/settings/printer/templates/complaint.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu khiếu nại - TipTap compatible
 * Cập nhật: Thiết kế đen trắng cho máy in
 */ __turbopack_context__.s([
    "COMPLAINT_TEMPLATE",
    ()=>COMPLAINT_TEMPLATE
]);
const COMPLAINT_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="width: 80px; vertical-align: top;">{store_logo}</td>
    <td style="vertical-align: top;">
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
      <div>{store_address}</div>
      <div>Hotline: <strong>{store_phone_number}</strong></div>
    </td>
  </tr>
</table>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU KHIẾU NẠI</h2>
<div style="text-align: center; margin-bottom: 10px;">
  <div>Mã phiếu: <strong>{complaint_code}</strong></div>
  <div>Ngày: {created_on}</div>
</div>

<!-- THÔNG TIN KHÁCH HÀNG -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Khách hàng:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{customer_name}</strong></td>
      <td style="padding: 5px; width: 15%; background: #f5f5f5; border: 1px solid #333;">SĐT:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{customer_phone_number}</strong></td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Email:</td>
      <td style="padding: 5px; border: 1px solid #333;">{customer_email}</td>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Địa chỉ:</td>
      <td style="padding: 5px; border: 1px solid #333;">{customer_address}</td>
    </tr>
  </tbody>
</table>

<!-- THÔNG TIN ĐƠN HÀNG -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Mã đơn hàng:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{order_code}</strong></td>
      <td style="padding: 5px; width: 15%; background: #f5f5f5; border: 1px solid #333;">Ngày mua:</td>
      <td style="padding: 5px; border: 1px solid #333;">{order_date}</td>
    </tr>
  </tbody>
</table>

<!-- NỘI DUNG KHIẾU NẠI -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed; border: 2px solid #333;">
  <tbody>
    <tr>
      <td style="padding: 8px; width: 25%; background: #f5f5f5; border: 1px solid #333;">Loại khiếu nại:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{complaint_type}</strong></td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333;">Sản phẩm:</td>
      <td style="padding: 8px; border: 1px solid #333;">{line_product_name} - <small>{line_variant}</small></td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333;">Mô tả vấn đề:</td>
      <td style="padding: 8px; border: 1px solid #333;">{complaint_description}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333;">Yêu cầu của KH:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{customer_request}</strong></td>
    </tr>
  </tbody>
</table>

<!-- XỬ LÝ KHIẾU NẠI -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Trạng thái:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{complaint_status}</strong></td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Phương án xử lý:</td>
      <td style="padding: 5px; border: 1px solid #333;">{resolution}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Người xử lý:</td>
      <td style="padding: 5px; border: 1px solid #333;">{assignee_name}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Ngày hoàn thành:</td>
      <td style="padding: 5px; border: 1px solid #333;">{resolved_on}</td>
    </tr>
  </tbody>
</table>

<!-- GHI CHÚ -->
<div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {complaint_note}
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Khách hàng</strong><br>
        <em>(Ký xác nhận)</em><br>
        <div style="height: 50px;"></div>
        {customer_name}
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Người xử lý</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
        {assignee_name}
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Quản lý</strong><br>
        <em>(Ký duyệt)</em><br>
        <div style="height: 50px;"></div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 11px;">
  Cảm ơn quý khách đã phản hồi. Chúng tôi sẽ xử lý trong thời gian sớm nhất!

  <div style="font-size: 10px; color: #666; margin-top: 5px;">In lúc: {print_date} {print_time}</div></div>

</div>
`;
}),
"[project]/features/settings/printer/templates/penalty.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu phạt - TipTap compatible
 * Cập nhật: Thiết kế đen trắng cho máy in
 */ __turbopack_context__.s([
    "PENALTY_TEMPLATE",
    ()=>PENALTY_TEMPLATE
]);
const PENALTY_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="width: 80px; vertical-align: top;">{store_logo}</td>
    <td style="vertical-align: top;">
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
      <div>{store_address}</div>
    </td>
  </tr>
</table>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU XỬ PHẠT</h2>
<div style="text-align: center; margin-bottom: 10px;">
  <div>Số: <strong>{penalty_code}</strong></div>
  <div>Ngày: {created_on}</div>
</div>

<!-- THÔNG TIN NGƯỜI BỊ PHẠT -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Họ và tên:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{employee_name}</strong></td>
      <td style="padding: 5px; width: 15%; background: #f5f5f5; border: 1px solid #333;">Mã NV:</td>
      <td style="padding: 5px; border: 1px solid #333; font-family: monospace;">{employee_code}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Bộ phận:</td>
      <td style="padding: 5px; border: 1px solid #333;">{department_name}</td>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Chức vụ:</td>
      <td style="padding: 5px; border: 1px solid #333;">{position_name}</td>
    </tr>
  </tbody>
</table>

<!-- NỘI DUNG VI PHẠM -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Loại vi phạm:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{violation_type}</strong></td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Ngày vi phạm:</td>
      <td style="padding: 5px; border: 1px solid #333;">{violation_date}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Mô tả vi phạm:</td>
      <td style="padding: 5px; border: 1px solid #333;">{violation_description}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Bằng chứng:</td>
      <td style="padding: 5px; border: 1px solid #333;">{evidence}</td>
    </tr>
  </tbody>
</table>

<!-- HÌNH THỨC XỬ PHẠT -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed; border: 2px solid #333;">
  <tbody>
    <tr>
      <td style="padding: 8px; width: 30%; background: #f5f5f5; border: 1px solid #333;">Hình thức:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{penalty_type}</strong></td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333;">Lần vi phạm:</td>
      <td style="padding: 8px; border: 1px solid #333;">Lần thứ <strong>{violation_count}</strong></td>
    </tr>
    <tr style="background: #f5f5f5;">
      <td style="padding: 12px; border: 1px solid #333;"><strong>SỐ TIỀN PHẠT:</strong></td>
      <td style="padding: 12px; border: 1px solid #333; font-size: 18px; font-weight: bold;">{penalty_amount}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #333;">Bằng chữ:</td>
      <td style="padding: 8px; border: 1px solid #333; font-style: italic;">{penalty_amount_text}</td>
    </tr>
  </tbody>
</table>

<!-- GHI CHÚ -->
<div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {penalty_note}
</div>

<!-- CĂN CỨ PHÁP LÝ -->
<div style="margin: 10px 0; padding: 10px; border: 1px solid #333; font-size: 12px;">
  <strong>Căn cứ pháp lý:</strong> Theo quy định nội bộ công ty và Bộ luật Lao động Việt Nam.
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Người vi phạm</strong><br>
        <em>(Ký xác nhận)</em><br>
        <div style="height: 50px;"></div>
        {employee_name}
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Trưởng bộ phận</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Giám đốc</strong><br>
        <em>(Ký duyệt)</em><br>
        <div style="height: 50px;"></div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 11px;">
  Phiếu này được lập thành 02 bản, mỗi bên giữ 01 bản có giá trị như nhau.

  <div style="font-size: 10px; color: #666; margin-top: 5px;">In lúc: {print_date} {print_time}</div></div>

</div>
`;
}),
"[project]/features/settings/printer/templates/cost-adjustment.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu điều chỉnh giá vốn - TipTap compatible
 * Cập nhật: Thiết kế đen trắng cho máy in
 */ __turbopack_context__.s([
    "COST_ADJUSTMENT_TEMPLATE",
    ()=>COST_ADJUSTMENT_TEMPLATE
]);
const COST_ADJUSTMENT_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="width: 80px; vertical-align: top;">{store_logo}</td>
    <td style="vertical-align: top;">
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
      <div>{store_address}</div>
      <div>ĐT: {store_phone}</div>
    </td>
  </tr>
</table>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 16px; font-weight: bold; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU ĐIỀU CHỈNH GIÁ VỐN</h2>
<div style="text-align: center; margin-bottom: 15px;">
  <div>Số: <strong>{adjustment_code}</strong></div>
  <div>Ngày: {created_on} {created_on_time}</div>
</div>

<!-- THÔNG TIN CHI NHÁNH -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 5px; width: 25%; background: #f5f5f5; border: 1px solid #333;">Chi nhánh:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{location_name}</strong></td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Địa chỉ:</td>
      <td style="padding: 5px; border: 1px solid #333;">{location_address}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Lý do điều chỉnh:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{reason}</strong></td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Trạng thái:</td>
      <td style="padding: 5px; border: 1px solid #333;">{status}</td>
    </tr>
  </tbody>
</table>

<!-- DANH SÁCH SẢN PHẨM -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 11px;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 6px; border: 1px solid #333; text-align: center; width: 30px;">STT</th>
      <th style="padding: 6px; border: 1px solid #333; text-align: left;">Mã SP</th>
      <th style="padding: 6px; border: 1px solid #333; text-align: left;">Tên sản phẩm</th>
      <th style="padding: 6px; border: 1px solid #333; text-align: center; width: 50px;">ĐVT</th>
      <th style="padding: 6px; border: 1px solid #333; text-align: right;">Giá vốn cũ</th>
      <th style="padding: 6px; border: 1px solid #333; text-align: right;">Giá vốn mới</th>
      <th style="padding: 6px; border: 1px solid #333; text-align: right;">Chênh lệch</th>
    </tr>
  </thead>
  <tbody>
    <tr data-line-item>
      <td style="padding: 5px; border: 1px solid #333; text-align: center;">{line_stt}</td>
      <td style="padding: 5px; border: 1px solid #333; font-family: monospace;">{line_variant_code}</td>
      <td style="padding: 5px; border: 1px solid #333;">{line_product_name}</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: center;">{line_unit}</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;">{line_old_price}</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;">{line_new_price}</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;">{line_difference}</td>
    </tr>
  </tbody>
</table>

<!-- TỔNG KẾT -->
<table style="width: 50%; margin-left: auto; border-collapse: collapse; margin-bottom: 15px;">
  <tbody>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Tổng số sản phẩm:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;"><strong>{total_items}</strong></td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Tổng tăng giá vốn:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right; color: green;">{total_increase}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Tổng giảm giá vốn:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right; color: red;">{total_decrease}</td>
    </tr>
    <tr style="font-weight: bold; font-size: 13px;">
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333;">CHÊNH LỆCH:</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: right;">{total_difference}</td>
    </tr>
  </tbody>
</table>

<!-- GHI CHÚ -->
<div style="margin: 15px 0; padding: 10px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {note}
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center;">
        <strong>Người lập phiếu</strong>
        <div style="margin-top: 50px; font-style: italic;">{account_name}</div>
      </td>
      <td style="width: 50%; text-align: center;">
        <strong>Người xác nhận</strong>
        <div style="margin-top: 50px; font-style: italic;">{confirmed_by}</div>
      </td>
    </tr>
  </tbody>
</table>

<!-- NGÀY IN -->
<div style="text-align: right; margin-top: 20px; font-size: 10px; color: #666;">
  In ngày: {print_date} {print_time}
</div>

</div>
`;
}),
"[project]/features/settings/printer/templates/payroll.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Payroll Template - Bảng lương
 * Mẫu in mặc định theo chuẩn TEMPLATE v2
 * 
 * QUAN TRỌNG - Quy tắc template:
 * 1. Bảng chứa {line_stt} hoặc {line_index} là bảng line items - sẽ được lặp theo số nhân viên
 * 2. Các bảng khác là bảng thông tin - không lặp
 * 3. Sử dụng inline styles để đảm bảo hiển thị đúng khi in
 * 
 * CHUẨN TEMPLATE v2 (2025-12-08):
 * - Header: Logo trái + Store info phải (dạng table)
 * - Title: Căn giữa, border-bottom
 * - Info table: Label 22% nền xám
 * - Product table: table-layout fixed, responsive
 * - Summary: 280px căn phải
 * - Footer: border-top dashed, font nhỏ
 */ __turbopack_context__.s([
    "PAYROLL_TEMPLATE",
    ()=>PAYROLL_TEMPLATE
]);
const PAYROLL_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 900px; margin: 0 auto; padding: 10px;">

<!-- HEADER: Logo trái + Thông tin cửa hàng phải -->
<table style="width: 100%; margin-bottom: 12px; border-collapse: collapse;">
  <tr>
    <td style="width: 70px; vertical-align: top; padding-right: 10px;">{store_logo}</td>
    <td style="vertical-align: top;">
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
      <div style="font-size: 11px; color: #333;">{store_address}</div>
      <div style="font-size: 11px; color: #333;">ĐT: {store_phone_number} | Email: {store_email}</div>
    </td>
  </tr>
</table>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 12px 0 5px 0; font-size: 16px; font-weight: bold; border-bottom: 2px solid #333; padding-bottom: 8px;">BẢNG LƯƠNG TỔNG HỢP</h2>
<div style="text-align: center; margin-bottom: 12px; font-size: 12px;">
  <div><strong>{batch_title}</strong></div>
  <div>Mã: <strong>{batch_code}</strong> | Kỳ lương: <strong>{pay_period}</strong></div>
</div>

<!-- THÔNG TIN BẢNG LƯƠNG -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 20%; border: 1px solid #333; font-size: 11px;">Trạng thái:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;"><strong>{batch_status}</strong></td>
      <td style="padding: 4px 6px; width: 20%; border: 1px solid #333; font-size: 11px;">Ngày thanh toán:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{payroll_date}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Tháng chấm công:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{reference_months}</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Số nhân viên:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;"><strong>{total_employees}</strong> người</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Người lập:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{created_by}</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Ngày lập:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{created_on}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Ghi chú:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;" colspan="3">{notes}</td>
    </tr>
  </tbody>
</table>

<!-- BẢNG CHI TIẾT LƯƠNG TỪNG NHÂN VIÊN - Table layout fixed -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: center; width: 28px; font-size: 10px;">STT</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: left; width: 58px; font-size: 10px;">Mã NV</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: left; font-size: 10px;">Họ tên</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: left; width: 80px; font-size: 10px;">Phòng ban</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: right; width: 72px; font-size: 10px;">Thu nhập</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: right; width: 55px; font-size: 10px;">Bảo hiểm</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: right; width: 60px; font-size: 10px;">Thuế TNCN</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: right; width: 72px; font-size: 10px; font-weight: bold;">Thực lĩnh</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: center; font-size: 10px;">{line_stt}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; font-size: 10px;">{employee_code}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; font-size: 10px; word-wrap: break-word;">{employee_name}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; font-size: 10px; word-wrap: break-word;">{department_name}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: right; font-size: 10px;">{earnings}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: right; font-size: 10px;">{total_insurance}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: right; font-size: 10px;">{personal_income_tax}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: right; font-size: 10px; font-weight: bold;">{net_pay}</td>
    </tr>
  </tbody>
</table>

<!-- BẢNG TỔNG KẾT -->
<table style="width: 300px; margin-left: auto; border-collapse: collapse; margin-bottom: 10px;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Tổng thu nhập:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; width: 120px; font-size: 11px;">{total_earnings}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Tổng bảo hiểm (NV):</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px;">{total_insurance}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Tổng thuế TNCN:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px;">{total_tax}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Tổng khấu trừ:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px;">{total_deductions}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Đóng góp (DN):</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px;">{total_contributions}</td>
    </tr>
    <tr>
      <td style="padding: 5px 6px; border: 1px solid #333; font-size: 12px; font-weight: bold; background: #f0f0f0;">TỔNG THỰC LĨNH:</td>
      <td style="padding: 5px 6px; border: 1px solid #333; text-align: right; font-size: 12px; font-weight: bold; background: #f0f0f0;">{total_net}</td>
    </tr>
  </tbody>
</table>

<!-- BẰNG CHỮ -->
<p style="font-style: italic; margin: 10px 0; font-size: 11px;">
  <strong>Bằng chữ:</strong> {total_net_text}
</p>

<!-- FOOTER: Chữ ký -->
<table style="width: 100%; margin-top: 25px; border-collapse: collapse;">
  <tr>
    <td style="width: 33%; text-align: center; padding: 5px; vertical-align: top;">
      <div style="font-weight: bold; margin-bottom: 50px; font-size: 11px;">Người lập</div>
      <div style="font-size: 11px;">{created_by}</div>
    </td>
    <td style="width: 33%; text-align: center; padding: 5px; vertical-align: top;">
      <div style="font-weight: bold; margin-bottom: 50px; font-size: 11px;">Kế toán trưởng</div>
      <div style="font-size: 11px;"></div>
    </td>
    <td style="width: 33%; text-align: center; padding: 5px; vertical-align: top;">
      <div style="font-weight: bold; margin-bottom: 50px; font-size: 11px;">Giám đốc</div>
      <div style="font-size: 11px;"></div>
    </td>
  </tr>
</table>

<!-- NGÀY IN -->
<div style="margin-top: 15px; padding-top: 8px; border-top: 1px dashed #ccc; font-size: 10px; color: #666; text-align: right;">
  Ngày in: {print_date} {print_time}
</div>

</div>
`;
}),
"[project]/features/settings/printer/templates/payslip.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Payslip Template - Phiếu lương cá nhân
 * Mẫu in mặc định theo chuẩn TEMPLATE v2
 * 
 * QUAN TRỌNG - Quy tắc template:
 * 1. Bảng chứa {line_stt} là bảng line items - sẽ được lặp theo số components
 * 2. Các bảng khác là bảng thông tin - không lặp
 * 3. Sử dụng inline styles để đảm bảo hiển thị đúng khi in
 * 
 * CHUẨN TEMPLATE v2 (2025-12-08):
 * - Header: Logo trái + Store info phải (dạng table)
 * - Title: Căn giữa, border-bottom
 * - Info table: Label 22% nền xám
 * - Component table: table-layout fixed, responsive
 * - Summary: 280px căn phải
 * - Footer: border-top dashed, font nhỏ
 */ __turbopack_context__.s([
    "PAYSLIP_TEMPLATE",
    ()=>PAYSLIP_TEMPLATE
]);
const PAYSLIP_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 700px; margin: 0 auto; padding: 10px;">

<!-- HEADER: Logo trái + Thông tin cửa hàng phải -->
<table style="width: 100%; margin-bottom: 12px; border-collapse: collapse;">
  <tr>
    <td style="width: 70px; vertical-align: top; padding-right: 10px;">{store_logo}</td>
    <td style="vertical-align: top;">
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
      <div style="font-size: 11px; color: #333;">{store_address}</div>
      <div style="font-size: 11px; color: #333;">ĐT: {store_phone_number} | Email: {store_email}</div>
    </td>
  </tr>
</table>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 12px 0 5px 0; font-size: 16px; font-weight: bold; border-bottom: 2px solid #333; padding-bottom: 8px;">PHIẾU LƯƠNG</h2>
<div style="text-align: center; margin-bottom: 12px; font-size: 12px;">
  <div>Kỳ lương: <strong>{pay_period}</strong></div>
  <div>Mã phiếu: <strong>{payslip_code}</strong></div>
</div>

<!-- THÔNG TIN NHÂN VIÊN -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; border: 1px solid #333; font-size: 11px; background: #f5f5f5;">Mã nhân viên:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;"><strong>{employee_code}</strong></td>
      <td style="padding: 4px 6px; width: 22%; border: 1px solid #333; font-size: 11px; background: #f5f5f5;">Họ và tên:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;"><strong>{employee_name}</strong></td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px; background: #f5f5f5;">Phòng ban:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{department_name}</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px; background: #f5f5f5;">Chức vụ:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{position}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px; background: #f5f5f5;">Bảng lương:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;" colspan="3">{batch_title} ({batch_code})</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px; background: #f5f5f5;">Ngày thanh toán:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{payroll_date}</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px; background: #f5f5f5;">Kỳ lương:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{pay_period}</td>
    </tr>
  </tbody>
</table>

<!-- THÔNG TIN CHẤM CÔNG -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; background: #f8f9fa;">
  <tbody>
    <tr>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; width: 25%; background: #e8e8e8; font-weight: bold;">Ngày công</td>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; width: 25%; text-align: center;"><strong>{work_days}</strong> / {standard_work_days}</td>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; width: 25%; background: #e8e8e8; font-weight: bold;">Nghỉ phép</td>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; width: 25%; text-align: center;">{leave_days} ngày</td>
    </tr>
    <tr>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; background: #e8e8e8; font-weight: bold;">Tổng giờ OT</td>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; text-align: center; color: #0066cc;"><strong>{ot_hours}h</strong></td>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; background: #e8e8e8; font-weight: bold;">Vắng không phép</td>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; text-align: center;">{absent_days} ngày</td>
    </tr>
    <tr>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; background: #e8e8e8;">OT ngày thường</td>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; text-align: center;">{ot_hours_weekday}h</td>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; background: #e8e8e8;">Đi trễ/Về sớm</td>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; text-align: center;">{late_arrivals} lần / {early_departures} lần</td>
    </tr>
    <tr>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; background: #e8e8e8;">OT cuối tuần</td>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; text-align: center;">{ot_hours_weekend}h</td>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; background: #e8e8e8;">OT ngày lễ</td>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; text-align: center;">{ot_hours_holiday}h</td>
    </tr>
  </tbody>
</table>

<!-- CHI TIẾT CÁC THÀNH PHẦN LƯƠNG (LINE ITEMS) -->
<h4 style="margin: 15px 0 8px 0; font-size: 12px; font-weight: bold; border-bottom: 1px solid #333; padding-bottom: 4px;">I. CHI TIẾT THU NHẬP</h4>
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
  <thead>
    <tr style="background: #e8e8e8;">
      <th style="padding: 5px 6px; border: 1px solid #333; text-align: center; font-size: 11px; width: 30px;">STT</th>
      <th style="padding: 5px 6px; border: 1px solid #333; text-align: left; font-size: 11px; width: 140px;">Tên thành phần</th>
      <th style="padding: 5px 6px; border: 1px solid #333; text-align: left; font-size: 11px;">Chi tiết tính</th>
      <th style="padding: 5px 6px; border: 1px solid #333; text-align: right; font-size: 11px; width: 110px;">Số tiền</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: center; font-size: 10px;">{line_stt}</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 10px;">{component_name}</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 10px; color: #555;">{component_formula}</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 10px; font-weight: bold;">{component_amount}</td>
    </tr>
  </tbody>
  <tfoot>
    <tr style="background: #f5f5f5;">
      <td colspan="3" style="padding: 5px 6px; border: 1px solid #333; font-size: 11px; font-weight: bold;">Tổng thu nhập (Gross)</td>
      <td style="padding: 5px 6px; border: 1px solid #333; text-align: right; font-size: 11px; font-weight: bold;">{total_earnings}</td>
    </tr>
  </tfoot>
</table>

<!-- CÁC KHOẢN KHẤU TRỪ -->
<h4 style="margin: 15px 0 8px 0; font-size: 12px; font-weight: bold; border-bottom: 1px solid #333; padding-bottom: 4px;">II. CÁC KHOẢN KHẤU TRỪ</h4>
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
  <thead>
    <tr style="background: #e8e8e8;">
      <th style="padding: 5px 6px; border: 1px solid #333; text-align: left; font-size: 11px;">Khoản mục</th>
      <th style="padding: 5px 6px; border: 1px solid #333; text-align: right; font-size: 11px; width: 120px;">Số tiền</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px; padding-left: 10px;">BHXH (8%)</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px; color: #c00;">{bhxh_amount}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px; padding-left: 10px;">BHYT (1.5%)</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px; color: #c00;">{bhyt_amount}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px; padding-left: 10px;">BHTN (1%)</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px; color: #c00;">{bhtn_amount}</td>
    </tr>
    <tr style="background: #fff5f5;">
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px; font-weight: bold;">Tổng bảo hiểm (10.5%)</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px; font-weight: bold; color: #c00;">{total_insurance}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px; padding-left: 10px;">Thuế TNCN</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px; color: #c00;">{personal_income_tax}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px; padding-left: 10px;">Khấu trừ phạt</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px; color: #c00;">{penalty_deductions}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px; padding-left: 10px;">Khấu trừ khác</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px; color: #c00;">{other_deductions}</td>
    </tr>
  </tbody>
  <tfoot>
    <tr style="background: #fff5f5;">
      <td style="padding: 5px 6px; border: 1px solid #333; font-size: 11px; font-weight: bold;">Tổng khấu trừ</td>
      <td style="padding: 5px 6px; border: 1px solid #333; text-align: right; font-size: 11px; font-weight: bold; color: #c00;">{total_deductions}</td>
    </tr>
  </tfoot>
</table>

<!-- TÍNH THUẾ TNCN (Tham khảo) -->
<h4 style="margin: 15px 0 8px 0; font-size: 12px; font-weight: bold; border-bottom: 1px solid #333; padding-bottom: 4px;">III. TÍNH THUẾ TNCN</h4>
<p style="font-size: 10px; color: #666; margin: 0 0 8px 0; font-style: italic;">Công thức: Thu nhập chịu thuế = Tổng thu nhập - BH (NV đóng) - Giảm trừ gia cảnh</p>
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px; width: 60%;">Mức giảm trừ bản thân (theo luật thuế TNCN)</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px; color: #666;">{personal_deduction}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Mức giảm trừ người phụ thuộc ({dependents_count} người × 4.400.000)</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px; color: #666;">{dependent_deduction}</td>
    </tr>
    <tr style="background: #f5f5f5;">
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px; font-weight: bold;">→ Thu nhập chịu thuế</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px; font-weight: bold;">{taxable_income}</td>
    </tr>
    <tr style="background: #fff5f5;">
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px; font-weight: bold;">→ Thuế TNCN phải nộp</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px; font-weight: bold; color: #c00;">{personal_income_tax}</td>
    </tr>
  </tbody>
</table>

<!-- THỰC LĨNH -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
  <tbody>
    <tr style="background: #d4edda;">
      <td style="padding: 8px 10px; border: 2px solid #333; font-size: 14px; font-weight: bold; width: 50%;">THỰC LĨNH</td>
      <td style="padding: 8px 10px; border: 2px solid #333; text-align: right; font-size: 14px; font-weight: bold; color: #155724;">{net_pay}</td>
    </tr>
  </tbody>
</table>

<!-- BẰNG CHỮ -->
<p style="font-style: italic; margin: 10px 0; font-size: 11px; padding: 8px; border: 1px solid #333; background: #fffde7;">
  <strong>Số tiền bằng chữ:</strong> {net_pay_text}
</p>

<!-- FOOTER: Chữ ký -->
<table style="width: 100%; margin-top: 25px; border-collapse: collapse;">
  <tr>
    <td style="width: 50%; text-align: center; padding: 5px; vertical-align: top;">
      <div style="font-weight: bold; margin-bottom: 50px; font-size: 11px;">Người lập phiếu</div>
      <div style="font-size: 11px;"></div>
    </td>
    <td style="width: 50%; text-align: center; padding: 5px; vertical-align: top;">
      <div style="font-weight: bold; margin-bottom: 50px; font-size: 11px;">Người nhận</div>
      <div style="font-size: 11px;">{employee_name}</div>
    </td>
  </tr>
</table>

<!-- NGÀY IN -->
<div style="margin-top: 15px; padding-top: 8px; border-top: 1px dashed #ccc; font-size: 10px; color: #666; text-align: right;">
  Ngày in: {print_date} {print_time}
</div>

</div>
`;
}),
"[project]/features/settings/printer/templates/supplier-order.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Đơn đặt hàng nhập (Extended) - TipTap compatible
 */ __turbopack_context__.s([
    "SUPPLIER_ORDER_TEMPLATE",
    ()=>SUPPLIER_ORDER_TEMPLATE
]);
const SUPPLIER_ORDER_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<div style="text-align: center; margin-bottom: 10px;">
  <div style="margin-bottom: 5px;">{store_logo}</div>
  <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
  <div style="color: #666;">{store_address}</div>
  <div style="color: #666;">ĐT: {store_phone_number}</div>
</div>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 20px 0 10px 0; font-size: 18px; text-transform: uppercase; border-bottom: 2px solid #333; padding-bottom: 10px;">ĐƠN ĐẶT HÀNG NHẬP</h2>
<div style="text-align: center; margin-bottom: 20px;">
  <div style="font-size: 14px;">Số: <strong>{order_supplier_code}</strong></div>
  <div>Ngày: {created_on} {created_on_time}</div>
</div>

<!-- THÔNG TIN NHÀ CUNG CẤP -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 8px; width: 20%; background: #f5f5f5; border: 1px solid #ddd; font-weight: bold;">Nhà cung cấp:</td>
      <td style="padding: 8px; border: 1px solid #ddd;"><strong>{supplier_name}</strong></td>
      <td style="padding: 8px; width: 15%; background: #f5f5f5; border: 1px solid #ddd; font-weight: bold;">Mã NCC:</td>
      <td style="padding: 8px; border: 1px solid #ddd;">{supplier_code}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #ddd; font-weight: bold;">Điện thoại:</td>
      <td style="padding: 8px; border: 1px solid #ddd;">{supplier_phone_number}</td>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #ddd; font-weight: bold;">Email:</td>
      <td style="padding: 8px; border: 1px solid #ddd;">{supplier_email}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #ddd; font-weight: bold;">Địa chỉ:</td>
      <td style="padding: 8px; border: 1px solid #ddd;" colspan="3">{supplier_address}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #ddd; font-weight: bold;">Kho nhập:</td>
      <td style="padding: 8px; border: 1px solid #ddd;">{location_name}</td>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #ddd; font-weight: bold;">Ngày giao dự kiến:</td>
      <td style="padding: 8px; border: 1px solid #ddd;">{expected_on}</td>
    </tr>
  </tbody>
</table>

<!-- BẢNG SẢN PHẨM -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 40px;">STT</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 100px;">Mã SP</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: left;">Tên sản phẩm</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 60px;">ĐVT</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 60px;">SL Đặt</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: right; width: 100px;">Đơn giá</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: right; width: 110px;">Thành tiền</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px; border: 1px solid #333; text-align: center;">{line_stt}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; font-family: monospace;">{line_variant_code}</td>
      <td style="padding: 8px; border: 1px solid #333;">{line_product_name}<br><small style="color: #666;">{line_variant}</small></td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center;">{line_unit}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; font-weight: bold;">{line_quantity}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: right;">{line_price}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: right;">{line_amount}</td>
    </tr>
  </tbody>
</table>

<!-- TỔNG GIÁ TRỊ -->
<table style="width: 250px; margin-left: auto; border-collapse: collapse; margin-bottom: 20px;">
  <tbody>
    <tr>
      <td style="padding: 8px; border: 1px solid #333;">Tổng tiền hàng:</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: right; width: 120px;">{total}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #333;">Chiết khấu:</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: right;">{total_discount}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #333;">Thuế VAT:</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: right;">{total_tax}</td>
    </tr>
    <tr style="background: #f5f5f5;">
      <td style="padding: 10px; border: 1px solid #333; font-weight: bold; font-size: 14px;">TỔNG CỘNG:</td>
      <td style="padding: 10px; border: 1px solid #333; text-align: right; font-weight: bold; font-size: 14px;">{total_amount}</td>
    </tr>
  </tbody>
</table>

<!-- GHI CHÚ -->
<div style="margin-bottom: 20px; padding: 12px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {note}
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 40px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">NGƯỜI LẬP ĐƠN</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 60px;"></div>
        <div>{account_name}</div>
      </td>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">PHÊ DUYỆT</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 60px;"></div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="margin-top: 15px; padding-top: 8px; border-top: 1px dashed #ccc; font-size: 10px; color: #666; text-align: center;">
  In lúc: {print_date} {print_time}
</div>

</div>
`;
}),
"[project]/features/settings/printer/templates/return-order.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Đơn trả hàng (Extended) - TipTap compatible
 */ __turbopack_context__.s([
    "RETURN_ORDER_TEMPLATE",
    ()=>RETURN_ORDER_TEMPLATE
]);
const RETURN_ORDER_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<div style="text-align: center; margin-bottom: 10px;">
  <div style="margin-bottom: 5px;">{store_logo}</div>
  <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
  <div style="color: #666;">{store_address}</div>
  <div style="color: #666;">ĐT: {store_phone_number}</div>
</div>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 20px 0 10px 0; font-size: 18px; text-transform: uppercase; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU TRẢ HÀNG</h2>
<div style="text-align: center; margin-bottom: 20px;">
  <div style="font-size: 14px;">Số: <strong>{return_code}</strong></div>
  <div>Ngày: {created_on} {created_on_time}</div>
  <div>Đơn hàng gốc: <strong>{order_code}</strong></div>
</div>

<!-- THÔNG TIN KHÁCH HÀNG -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 8px; width: 20%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Khách hàng:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{customer_name}</strong></td>
      <td style="padding: 8px; width: 15%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Mã KH:</td>
      <td style="padding: 8px; border: 1px solid #333;">{customer_code}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Điện thoại:</td>
      <td style="padding: 8px; border: 1px solid #333;">{customer_phone_number}</td>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Email:</td>
      <td style="padding: 8px; border: 1px solid #333;">{customer_email}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Lý do trả:</td>
      <td style="padding: 8px; border: 1px solid #333;" colspan="3"><strong>{reason}</strong></td>
    </tr>
  </tbody>
</table>

<!-- BẢNG SẢN PHẨM TRẢ -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 40px;">STT</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 100px;">Mã SP</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: left;">Tên sản phẩm</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 60px;">ĐVT</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 60px;">SL Trả</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: right; width: 100px;">Đơn giá</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: right; width: 110px;">Thành tiền</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px; border: 1px solid #333; text-align: center;">{line_stt}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; font-family: monospace;">{line_variant_code}</td>
      <td style="padding: 8px; border: 1px solid #333;">{line_product_name}<br><small style="color: #666;">{line_variant}</small></td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center;">{line_unit}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; font-weight: bold;">{line_quantity}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: right;">{line_price}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: right;">{line_amount}</td>
    </tr>
  </tbody>
</table>

<!-- TỔNG GIÁ TRỊ HOÀN -->
<table style="width: 250px; margin-left: auto; border-collapse: collapse; margin-bottom: 20px;">
  <tbody>
    <tr>
      <td style="padding: 8px; border: 1px solid #333;">Tổng số lượng trả:</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: right; width: 120px;"><strong>{total_quantity}</strong></td>
    </tr>
    <tr style="background: #f5f5f5;">
      <td style="padding: 10px; border: 1px solid #333; font-weight: bold; font-size: 14px;">TỔNG TIỀN HOÀN:</td>
      <td style="padding: 10px; border: 1px solid #333; text-align: right; font-weight: bold; font-size: 14px;">{total_amount}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #333;">Bằng chữ:</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: right; font-style: italic;">{total_text}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #333;">Trạng thái hoàn tiền:</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: right;"><strong>{refund_status}</strong></td>
    </tr>
  </tbody>
</table>

<!-- GHI CHÚ -->
<div style="margin-bottom: 20px; padding: 12px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {note}
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 40px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">KHÁCH HÀNG</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 60px;"></div>
        <div>{customer_name}</div>
      </td>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">NGƯỜI NHẬN HÀNG</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 60px;"></div>
        <div>{account_name}</div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="margin-top: 15px; padding-top: 8px; border-top: 1px dashed #ccc; font-size: 10px; color: #666; text-align: center;">
  In lúc: {print_date} {print_time}
</div>

</div>
`;
}),
"[project]/features/settings/printer/templates/handover.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu bàn giao (Extended) - TipTap compatible
 */ __turbopack_context__.s([
    "HANDOVER_TEMPLATE",
    ()=>HANDOVER_TEMPLATE
]);
const HANDOVER_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<div style="text-align: center; margin-bottom: 10px;">
  <div style="margin-bottom: 5px;">{store_logo}</div>
  <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
  <div style="color: #666;">{store_address}</div>
</div>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 20px 0 10px 0; font-size: 18px; text-transform: uppercase; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU BÀN GIAO</h2>
<div style="text-align: center; margin-bottom: 20px;">
  <div style="font-size: 14px;">Số: <strong>{handover_code}</strong></div>
  <div>Ngày: {created_on} {created_on_time}</div>
</div>

<!-- THÔNG TIN BÀN GIAO -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 8px; width: 20%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Người bàn giao:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{from_employee}</strong></td>
      <td style="padding: 8px; width: 20%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Bộ phận:</td>
      <td style="padding: 8px; border: 1px solid #333;">{from_department}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Người nhận:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{to_employee}</strong></td>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Bộ phận:</td>
      <td style="padding: 8px; border: 1px solid #333;">{to_department}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Loại bàn giao:</td>
      <td style="padding: 8px; border: 1px solid #333;">{handover_type}</td>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Trạng thái:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{status}</strong></td>
    </tr>
  </tbody>
</table>

<!-- BẢNG NỘI DUNG BÀN GIAO -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 40px;">STT</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: left;">Nội dung bàn giao</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 80px;">Số lượng</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 100px;">Tình trạng</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: left; width: 150px;">Ghi chú</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px; border: 1px solid #333; text-align: center;">{line_stt}</td>
      <td style="padding: 8px; border: 1px solid #333;">{line_description}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; font-weight: bold;">{line_quantity}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center;">{line_condition}</td>
      <td style="padding: 8px; border: 1px solid #333;">{line_note}</td>
    </tr>
  </tbody>
</table>

<!-- GHI CHÚ CHUNG -->
<div style="margin-bottom: 20px; padding: 12px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {note}
</div>

<!-- CAM KẾT -->
<div style="margin-bottom: 20px; padding: 12px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Cam kết:</strong> Hai bên đã kiểm tra và xác nhận đầy đủ các nội dung bàn giao trên. Người nhận cam kết bảo quản và sử dụng đúng mục đích.
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 40px;">
  <tbody>
    <tr>
      <td style="width: 33%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">NGƯỜI BÀN GIAO</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 60px;"></div>
        <div>{from_employee}</div>
      </td>
      <td style="width: 33%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">NGƯỜI NHẬN</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 60px;"></div>
        <div>{to_employee}</div>
      </td>
      <td style="width: 33%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">XÁC NHẬN</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 60px;"></div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; color: #666; font-size: 11px;">
  Phiếu này được lập thành 02 bản, mỗi bên giữ 01 bản có giá trị như nhau.

  <div style="font-size: 10px; color: #666; margin-top: 5px;">In lúc: {print_date} {print_time}</div></div>

</div>
`;
}),
"[project]/features/settings/printer/templates/refund-confirmation.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu xác nhận hoàn (Extended) - TipTap compatible
 */ __turbopack_context__.s([
    "REFUND_CONFIRMATION_TEMPLATE",
    ()=>REFUND_CONFIRMATION_TEMPLATE
]);
const REFUND_CONFIRMATION_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<div style="text-align: center; margin-bottom: 10px;">
  <div style="margin-bottom: 5px;">{store_logo}</div>
  <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
  <div style="color: #666;">{store_address}</div>
  <div style="color: #666;">ĐT: {store_phone_number}</div>
</div>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 20px 0 10px 0; font-size: 18px; text-transform: uppercase; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU XÁC NHẬN HOÀN TIỀN</h2>
<div style="text-align: center; margin-bottom: 20px;">
  <div style="font-size: 14px;">Số: <strong>{refund_code}</strong></div>
  <div>Ngày: {created_on} {created_on_time}</div>
</div>

<!-- THÔNG TIN HOÀN TIỀN -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 8px; width: 25%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Mã đơn hàng gốc:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{order_code}</strong></td>
      <td style="padding: 8px; width: 20%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Ngày đặt:</td>
      <td style="padding: 8px; border: 1px solid #333;">{order_date}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Mã phiếu trả:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{return_code}</strong></td>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Ngày trả:</td>
      <td style="padding: 8px; border: 1px solid #333;">{return_date}</td>
    </tr>
  </tbody>
</table>

<!-- THÔNG TIN KHÁCH HÀNG -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 8px; width: 25%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Khách hàng:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{customer_name}</strong></td>
      <td style="padding: 8px; width: 20%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Điện thoại:</td>
      <td style="padding: 8px; border: 1px solid #333;">{customer_phone_number}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Lý do hoàn:</td>
      <td style="padding: 8px; border: 1px solid #333;" colspan="3">{refund_reason}</td>
    </tr>
  </tbody>
</table>

<!-- CHI TIẾT HOÀN TIỀN -->
<div style="background: #f5f5f5; border: 2px solid #333; padding: 20px; margin-bottom: 20px; text-align: center;">
  <div style="font-size: 14px; color: #666; margin-bottom: 10px;">SỐ TIỀN HOÀN</div>
  <div style="font-size: 28px; font-weight: bold;">{refund_amount}</div>
  <div style="font-style: italic; color: #666; margin-top: 5px;">({refund_amount_text})</div>
</div>

<!-- THÔNG TIN HOÀN -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 8px; width: 25%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Hình thức hoàn:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{refund_method}</strong></td>
      <td style="padding: 8px; width: 20%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Trạng thái:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{refund_status}</strong></td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Ngày hoàn tiền:</td>
      <td style="padding: 8px; border: 1px solid #333;">{refunded_on}</td>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Người xử lý:</td>
      <td style="padding: 8px; border: 1px solid #333;">{account_name}</td>
    </tr>
  </tbody>
</table>

<!-- THÔNG TIN TÀI KHOẢN (nếu chuyển khoản) -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 8px; width: 25%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Ngân hàng:</td>
      <td style="padding: 8px; border: 1px solid #333;">{bank_name}</td>
      <td style="padding: 8px; width: 20%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Chi nhánh:</td>
      <td style="padding: 8px; border: 1px solid #333;">{bank_branch}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Số tài khoản:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{bank_account}</strong></td>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Chủ tài khoản:</td>
      <td style="padding: 8px; border: 1px solid #333;">{bank_account_name}</td>
    </tr>
  </tbody>
</table>

<!-- GHI CHÚ -->
<div style="margin-bottom: 20px; padding: 12px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {note}
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 40px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">KHÁCH HÀNG</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký xác nhận đã nhận tiền)</div>
        <div style="height: 60px;"></div>
        <div>{customer_name}</div>
      </td>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">NGƯỜI XỬ LÝ</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 60px;"></div>
        <div>{account_name}</div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="margin-top: 15px; padding-top: 8px; border-top: 1px dashed #ccc; font-size: 10px; color: #666; text-align: center;">
  In lúc: {print_date} {print_time}
</div>

</div>
`;
}),
"[project]/features/settings/printer/templates/packing-guide.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu hướng dẫn đóng gói (Extended) - TipTap compatible
 */ __turbopack_context__.s([
    "PACKING_GUIDE_TEMPLATE",
    ()=>PACKING_GUIDE_TEMPLATE
]);
const PACKING_GUIDE_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<div style="text-align: center; margin-bottom: 10px;">
  <div style="margin-bottom: 5px;">{store_logo}</div>
  <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
</div>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 20px 0 10px 0; font-size: 18px; text-transform: uppercase; border-bottom: 2px solid #333; padding-bottom: 10px;">HƯỚNG DẪN ĐÓNG GÓI</h2>
<div style="text-align: center; margin-bottom: 20px;">
  <div style="font-size: 14px;">Đơn hàng: <strong>{order_code}</strong></div>
  <div>Ngày: {created_on}</div>
</div>

<!-- THÔNG TIN NGƯỜI NHẬN -->
<div style="background: #f5f5f5; border: 1px solid #333; padding: 15px; margin-bottom: 20px;">
  <div style="font-weight: bold; margin-bottom: 10px;">THÔNG TIN GIAO HÀNG</div>
  <table style="width: 100%;">
    <tbody>
      <tr>
        <td style="padding: 5px 0; width: 120px;"><strong>Người nhận:</strong></td>
        <td>{customer_name}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Điện thoại:</strong></td>
        <td>{customer_phone_number}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Địa chỉ:</strong></td>
        <td>{shipping_address}</td>
      </tr>
    </tbody>
  </table>
</div>

<!-- CHECKLIST ĐÓNG GÓI -->
<div style="background: #f5f5f5; border: 1px solid #333; padding: 15px; margin-bottom: 20px;">
  <div style="font-weight: bold; margin-bottom: 10px;">CHECKLIST ĐÓNG GÓI</div>
  <table style="width: 100%;">
    <tbody>
      <tr><td style="padding: 5px 0;">[ ] Kiểm tra đầy đủ sản phẩm theo danh sách</td></tr>
      <tr><td style="padding: 5px 0;">[ ] Kiểm tra tình trạng sản phẩm</td></tr>
      <tr><td style="padding: 5px 0;">[ ] Bọc chống sốc cho sản phẩm dễ vỡ</td></tr>
      <tr><td style="padding: 5px 0;">[ ] Đóng gói chắc chắn, dán kín</td></tr>
      <tr><td style="padding: 5px 0;">[ ] Dán nhãn giao hàng</td></tr>
      <tr><td style="padding: 5px 0;">[ ] Kèm hóa đơn/phiếu giao hàng</td></tr>
    </tbody>
  </table>
</div>

<!-- DANH SÁCH SẢN PHẨM -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 40px;">STT</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 100px;">Mã SP</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: left;">Tên sản phẩm</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 60px;">SL</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 100px;">Vị trí kho</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 60px;">Đã lấy</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px; border: 1px solid #333; text-align: center;">{line_stt}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; font-family: monospace;">{line_variant_code}</td>
      <td style="padding: 8px; border: 1px solid #333;">{line_product_name}<br><small style="color: #666;">{line_variant}</small></td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; font-weight: bold; font-size: 16px;">{line_quantity}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center;">{bin_location}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; font-size: 20px;">[ ]</td>
    </tr>
  </tbody>
</table>

<!-- TỔNG QUAN -->
<table style="width: 250px; margin-left: auto; border-collapse: collapse; margin-bottom: 20px;">
  <tbody>
    <tr style="background: #f5f5f5;">
      <td style="padding: 10px; border: 1px solid #333; font-weight: bold;">Tổng số lượng:</td>
      <td style="padding: 10px; border: 1px solid #333; text-align: right; font-weight: bold; font-size: 16px;">{total_quantity}</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #333;">COD thu hộ:</td>
      <td style="padding: 10px; border: 1px solid #333; text-align: right; font-weight: bold;">{cod}</td>
    </tr>
  </tbody>
</table>

<!-- LƯU Ý ĐẶC BIỆT -->
<div style="background: #f5f5f5; border: 1px solid #333; padding: 15px; margin-bottom: 20px;">
  <div style="font-weight: bold; margin-bottom: 10px;">LƯU Ý ĐẶC BIỆT</div>
  <div>{packing_note}</div>
  <div style="margin-top: 10px; padding-top: 10px; border-top: 1px dashed #333;">
    <strong>Ghi chú đơn hàng:</strong> {order_note}
  </div>
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">NGƯỜI ĐÓNG GÓI</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 50px;"></div>
        <div>{account_name}</div>
      </td>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">KIỂM TRA</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 50px;"></div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 10px; color: #666;">
  In lúc: {print_date} {print_time}
</div>

</div>
`;
}),
"[project]/features/settings/printer/templates/sales-summary.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu tổng kết bán hàng (Extended) - TipTap compatible
 */ __turbopack_context__.s([
    "SALES_SUMMARY_TEMPLATE",
    ()=>SALES_SUMMARY_TEMPLATE
]);
const SALES_SUMMARY_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<div style="text-align: center; margin-bottom: 10px;">
  <div style="margin-bottom: 5px;">{store_logo}</div>
  <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
  <div style="color: #666;">Chi nhánh: {location_name}</div>
</div>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 20px 0 10px 0; font-size: 18px; text-transform: uppercase; border-bottom: 2px solid #333; padding-bottom: 10px;">BÁO CÁO TỔNG KẾT BÁN HÀNG</h2>
<div style="text-align: center; margin-bottom: 20px;">
  <div style="font-size: 14px;">Kỳ báo cáo: <strong>{period}</strong></div>
  <div>Từ ngày: {from_date} - Đến ngày: {to_date}</div>
  <div>Người lập: {account_name} | Ngày lập: {created_on}</div>
</div>

<!-- THỐNG KÊ TỔNG QUAN -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
  <tbody>
    <tr>
      <td style="width: 25%; padding: 15px; text-align: center; background: #f5f5f5; border: 1px solid #333;">
        <div style="font-size: 12px; color: #666;">Tổng đơn hàng</div>
        <div style="font-size: 24px; font-weight: bold;">{total_orders}</div>
      </td>
      <td style="width: 25%; padding: 15px; text-align: center; background: #f5f5f5; border: 1px solid #333;">
        <div style="font-size: 12px; color: #666;">Doanh thu</div>
        <div style="font-size: 24px; font-weight: bold;">{total_revenue}</div>
      </td>
      <td style="width: 25%; padding: 15px; text-align: center; background: #f5f5f5; border: 1px solid #333;">
        <div style="font-size: 12px; color: #666;">Chiết khấu</div>
        <div style="font-size: 24px; font-weight: bold;">{total_discount}</div>
      </td>
      <td style="width: 25%; padding: 15px; text-align: center; background: #f5f5f5; border: 1px solid #333;">
        <div style="font-size: 12px; color: #666;">Trả hàng</div>
        <div style="font-size: 24px; font-weight: bold;">{total_returns}</div>
      </td>
    </tr>
  </tbody>
</table>

<!-- CHI TIẾT DOANH THU -->
<div style="background: #f5f5f5; border: 1px solid #333; padding: 15px; margin-bottom: 20px;">
  <div style="font-weight: bold; margin-bottom: 10px; font-size: 14px;">CHI TIẾT DOANH THU</div>
  <table style="width: 100%; border-collapse: collapse;">
    <tbody>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #333;">Doanh thu bán hàng:</td>
        <td style="padding: 8px; border-bottom: 1px solid #333; text-align: right; font-weight: bold;">{sales_revenue}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #333;">Phí giao hàng thu được:</td>
        <td style="padding: 8px; border-bottom: 1px solid #333; text-align: right;">{delivery_revenue}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #333;">Thuế VAT:</td>
        <td style="padding: 8px; border-bottom: 1px solid #333; text-align: right;">{total_tax}</td>
      </tr>
      <tr style="background: #f5f5f5;">
        <td style="padding: 10px; font-weight: bold; font-size: 14px;">TỔNG DOANH THU:</td>
        <td style="padding: 10px; text-align: right; font-weight: bold; font-size: 16px;">{total_revenue}</td>
      </tr>
    </tbody>
  </table>
</div>

<!-- THỐNG KÊ THANH TOÁN -->
<div style="background: #f5f5f5; border: 1px solid #333; padding: 15px; margin-bottom: 20px;">
  <div style="font-weight: bold; margin-bottom: 10px; font-size: 14px;">THỐNG KÊ THANH TOÁN</div>
  <table style="width: 100%; border-collapse: collapse;">
    <tbody>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #333;">Tiền mặt:</td>
        <td style="padding: 8px; border-bottom: 1px solid #333; text-align: right; font-weight: bold;">{cash_amount}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #333;">Chuyển khoản:</td>
        <td style="padding: 8px; border-bottom: 1px solid #333; text-align: right;">{bank_transfer_amount}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #333;">Thẻ tín dụng:</td>
        <td style="padding: 8px; border-bottom: 1px solid #333; text-align: right;">{card_amount}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #333;">Ví điện tử:</td>
        <td style="padding: 8px; border-bottom: 1px solid #333; text-align: right;">{ewallet_amount}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #333;">COD:</td>
        <td style="padding: 8px; border-bottom: 1px solid #333; text-align: right;">{cod_amount}</td>
      </tr>
      <tr style="background: #f5f5f5;">
        <td style="padding: 10px; font-weight: bold;">TỔNG THU:</td>
        <td style="padding: 10px; text-align: right; font-weight: bold; font-size: 14px;">{total_collected}</td>
      </tr>
    </tbody>
  </table>
</div>

<!-- TOP SẢN PHẨM BÁN CHẠY -->
<div style="margin-bottom: 20px;">
  <div style="font-weight: bold; margin-bottom: 10px; color: #333; font-size: 14px;">TOP SẢN PHẨM BÁN CHẠY</div>
  <table style="width: 100%; border-collapse: collapse;">
    <thead>
      <tr style="background: #f5f5f5;">
        <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 40px;">STT</th>
        <th style="padding: 10px; border: 1px solid #333; text-align: left;">Sản phẩm</th>
        <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 80px;">SL bán</th>
        <th style="padding: 10px; border: 1px solid #333; text-align: right; width: 120px;">Doanh thu</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding: 8px; border: 1px solid #333; text-align: center;">{line_stt}</td>
        <td style="padding: 8px; border: 1px solid #333;">{line_product_name}</td>
        <td style="padding: 8px; border: 1px solid #333; text-align: center; font-weight: bold;">{line_quantity}</td>
        <td style="padding: 8px; border: 1px solid #333; text-align: right;">{line_amount}</td>
      </tr>
    </tbody>
  </table>
</div>

<!-- GHI CHÚ -->
<div style="margin-bottom: 20px; padding: 12px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {note}
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 40px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">NGƯỜI LẬP BÁO CÁO</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 60px;"></div>
        <div>{account_name}</div>
      </td>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">QUẢN LÝ XÁC NHẬN</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 60px;"></div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="margin-top: 15px; padding-top: 8px; border-top: 1px dashed #ccc; font-size: 10px; color: #666; text-align: center;">
  In lúc: {print_date} {print_time}
</div>

</div>
`;
}),
"[project]/features/settings/printer/templates/warranty-request.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu yêu cầu bảo hành (Extended) - TipTap compatible
 */ __turbopack_context__.s([
    "WARRANTY_REQUEST_TEMPLATE",
    ()=>WARRANTY_REQUEST_TEMPLATE
]);
const WARRANTY_REQUEST_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<div style="text-align: center; margin-bottom: 10px;">
  <div style="margin-bottom: 5px;">{store_logo}</div>
  <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
  <div style="color: #666;">{store_address}</div>
  <div style="color: #666;">Hotline: {store_phone_number}</div>
</div>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 20px 0 10px 0; font-size: 18px; text-transform: uppercase; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU YÊU CẦU BẢO HÀNH</h2>
<div style="text-align: center; margin-bottom: 20px;">
  <div style="font-size: 14px;">Số: <strong>{warranty_request_code}</strong></div>
  <div>Ngày tiếp nhận: {created_on} {created_on_time}</div>
</div>

<!-- THÔNG TIN KHÁCH HÀNG -->
<div style="background: #f5f5f5; border: 1px solid #333; padding: 15px; margin-bottom: 20px;">
  <div style="font-weight: bold; margin-bottom: 10px;">THÔNG TIN KHÁCH HÀNG</div>
  <table style="width: 100%;">
    <tbody>
      <tr>
        <td style="padding: 5px 0; width: 25%;"><strong>Họ tên:</strong></td>
        <td style="padding: 5px 0;"><strong>{customer_name}</strong></td>
        <td style="padding: 5px 0; width: 20%;"><strong>Mã KH:</strong></td>
        <td style="padding: 5px 0;">{customer_code}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Điện thoại:</strong></td>
        <td style="padding: 5px 0;">{customer_phone_number}</td>
        <td style="padding: 5px 0;"><strong>Email:</strong></td>
        <td style="padding: 5px 0;">{customer_email}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Địa chỉ:</strong></td>
        <td style="padding: 5px 0;" colspan="3">{customer_address}</td>
      </tr>
    </tbody>
  </table>
</div>

<!-- THÔNG TIN SẢN PHẨM -->
<div style="background: #f5f5f5; border: 1px solid #333; padding: 15px; margin-bottom: 20px;">
  <div style="font-weight: bold; margin-bottom: 10px;">THÔNG TIN SẢN PHẨM BẢO HÀNH</div>
  <table style="width: 100%;">
    <tbody>
      <tr>
        <td style="padding: 5px 0; width: 25%;"><strong>Sản phẩm:</strong></td>
        <td style="padding: 5px 0;"><strong>{product_name}</strong></td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Mã SP:</strong></td>
        <td style="padding: 5px 0;">{product_code}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Serial/IMEI:</strong></td>
        <td style="padding: 5px 0;"><strong>{serial_number}</strong></td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Mã đơn hàng gốc:</strong></td>
        <td style="padding: 5px 0;">{order_code}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Ngày mua:</strong></td>
        <td style="padding: 5px 0;">{purchase_date}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Thời hạn BH:</strong></td>
        <td style="padding: 5px 0;">{warranty_duration}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Hết hạn BH:</strong></td>
        <td style="padding: 5px 0;"><strong>{warranty_expired_on}</strong></td>
      </tr>
    </tbody>
  </table>
</div>

<!-- TÌNH TRẠNG LỖI -->
<div style="background: #f5f5f5; border: 1px solid #333; padding: 15px; margin-bottom: 20px;">
  <div style="font-weight: bold; margin-bottom: 10px;">TÌNH TRẠNG LỖI</div>
  <table style="width: 100%;">
    <tbody>
      <tr>
        <td style="padding: 5px 0; width: 25%;"><strong>Loại lỗi:</strong></td>
        <td style="padding: 5px 0;"><strong>{issue_type}</strong></td>
      </tr>
      <tr>
        <td style="padding: 5px 0; vertical-align: top;"><strong>Mô tả lỗi:</strong></td>
        <td style="padding: 5px 0;">{issue_description}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Tình trạng máy:</strong></td>
        <td style="padding: 5px 0;">{device_condition}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Phụ kiện kèm:</strong></td>
        <td style="padding: 5px 0;">{accessories}</td>
      </tr>
    </tbody>
  </table>
</div>

<!-- TRẠNG THÁI XỬ LÝ -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
  <tbody>
    <tr>
      <td style="padding: 8px; width: 25%; background: #f5f5f5; border: 1px solid #d9d9d9; font-weight: bold;">Trạng thái:</td>
      <td style="padding: 8px; border: 1px solid #d9d9d9;"><strong style="color: #eb2f96;">{status}</strong></td>
      <td style="padding: 8px; width: 25%; background: #f5f5f5; border: 1px solid #d9d9d9; font-weight: bold;">Ưu tiên:</td>
      <td style="padding: 8px; border: 1px solid #d9d9d9;">{priority}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #d9d9d9; font-weight: bold;">Người tiếp nhận:</td>
      <td style="padding: 8px; border: 1px solid #d9d9d9;">{received_by}</td>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #d9d9d9; font-weight: bold;">Kỹ thuật viên:</td>
      <td style="padding: 8px; border: 1px solid #d9d9d9;">{technician_name}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #d9d9d9; font-weight: bold;">Dự kiến hoàn thành:</td>
      <td style="padding: 8px; border: 1px solid #d9d9d9;" colspan="3">{expected_completion_date}</td>
    </tr>
  </tbody>
</table>

<!-- GHI CHÚ -->
<div style="margin-bottom: 20px; padding: 12px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {note}
</div>

<!-- QUY ĐỊNH BẢO HÀNH -->
<div style="margin-bottom: 20px; padding: 12px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">
  <strong>QUY ĐỊNH BẢO HÀNH:</strong>
  <ul style="margin: 5px 0 0 15px; padding: 0;">
    <li>Thời gian xử lý: 7-14 ngày làm việc (tùy mức độ lỗi)</li>
    <li>Khách hàng vui lòng mang theo phiếu này khi nhận máy</li>
    <li>Cửa hàng không chịu trách nhiệm nếu máy không được nhận trong 30 ngày</li>
    <li>Hotline hỗ trợ: {store_phone_number}</li>
  </ul>
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">KHÁCH HÀNG</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký xác nhận)</div>
        <div style="height: 50px;"></div>
        <div>{customer_name}</div>
      </td>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">NHÂN VIÊN TIẾP NHẬN</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 50px;"></div>
        <div>{received_by}</div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="margin-top: 15px; padding-top: 8px; border-top: 1px dashed #ccc; font-size: 10px; color: #666; text-align: center;">
  In lúc: {print_date} {print_time}
</div>

</div>
`;
}),
"[project]/features/settings/printer/templates/packing-request.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu yêu cầu đóng gói (Extended) - TipTap compatible
 */ __turbopack_context__.s([
    "PACKING_REQUEST_TEMPLATE",
    ()=>PACKING_REQUEST_TEMPLATE
]);
const PACKING_REQUEST_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<div style="text-align: center; margin-bottom: 10px;">
  <div style="margin-bottom: 5px;">{store_logo}</div>
  <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
  <div style="color: #666;">Kho: {location_name}</div>
</div>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 20px 0 10px 0; font-size: 18px; text-transform: uppercase; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU YÊU CẦU ĐÓNG GÓI</h2>
<div style="text-align: center; margin-bottom: 20px;">
  <div style="font-size: 14px;">Mã yêu cầu: <strong>{packing_request_code}</strong></div>
  <div>Đơn hàng: <strong>{order_code}</strong></div>
  <div>Ngày tạo: {created_on} {created_on_time}</div>
</div>

<!-- ĐỘ ƯU TIÊN -->
<div style="text-align: center; margin-bottom: 20px;">
  <span style="background: #f5f5f5; border: 1px solid #333; padding: 8px 20px; font-weight: bold; font-size: 14px;">
    ĐỘ ƯU TIÊN: {priority}
  </span>
</div>

<!-- THÔNG TIN GIAO HÀNG -->
<div style="background: #f5f5f5; border: 1px solid #333; padding: 15px; margin-bottom: 20px;">
  <div style="font-weight: bold; margin-bottom: 10px;">THÔNG TIN GIAO HÀNG</div>
  <table style="width: 100%;">
    <tbody>
      <tr>
        <td style="padding: 5px 0; width: 25%;"><strong>Người nhận:</strong></td>
        <td style="padding: 5px 0;"><strong>{customer_name}</strong></td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Điện thoại:</strong></td>
        <td style="padding: 5px 0;">{customer_phone_number}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Địa chỉ:</strong></td>
        <td style="padding: 5px 0;">{shipping_address}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Đơn vị VC:</strong></td>
        <td style="padding: 5px 0;">{carrier_name}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Dịch vụ:</strong></td>
        <td style="padding: 5px 0;">{service_name}</td>
      </tr>
    </tbody>
  </table>
</div>

<!-- DANH SÁCH SẢN PHẨM CẦN ĐÓNG GÓI -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 40px;">STT</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 100px;">Mã SP</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: left;">Tên sản phẩm</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 60px;">SL</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 100px;">Vị trí kho</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 60px;">Lấy</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px; border: 1px solid #333; text-align: center;">{line_stt}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; font-family: monospace;">{line_variant_code}</td>
      <td style="padding: 8px; border: 1px solid #333;">{line_product_name}<br><small style="color: #666;">{line_variant}</small></td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; font-weight: bold; font-size: 16px;">{line_quantity}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; font-weight: bold;">{bin_location}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; font-size: 20px;">[ ]</td>
    </tr>
  </tbody>
</table>

<!-- THỐNG KÊ -->
<table style="width: 250px; margin-left: auto; border-collapse: collapse; margin-bottom: 20px;">
  <tbody>
    <tr>
      <td style="padding: 10px; border: 1px solid #333; background: #f5f5f5; font-weight: bold;">Tổng số lượng:</td>
      <td style="padding: 10px; border: 1px solid #333; text-align: right; font-weight: bold; font-size: 16px;">{total_quantity}</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #333;">Tổng khối lượng:</td>
      <td style="padding: 10px; border: 1px solid #333; text-align: right;">{total_weight} g</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #333;">COD thu hộ:</td>
      <td style="padding: 10px; border: 1px solid #333; text-align: right; font-weight: bold;">{cod}</td>
    </tr>
  </tbody>
</table>

<!-- YÊU CẦU ĐẶC BIỆT -->
<div style="background: #f5f5f5; border: 1px solid #333; padding: 15px; margin-bottom: 20px;">
  <div style="font-weight: bold; margin-bottom: 10px;">YÊU CẦU ĐẶC BIỆT</div>
  <div>{special_request}</div>
</div>

<!-- GHI CHÚ -->
<div style="margin-bottom: 20px; padding: 12px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú đóng gói:</strong> {packing_note}
</div>

<!-- TRẠNG THÁI -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
  <tbody>
    <tr>
      <td style="padding: 8px; width: 25%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Trạng thái:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{status}</strong></td>
      <td style="padding: 8px; width: 25%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Người được gán:</td>
      <td style="padding: 8px; border: 1px solid #333;">{assigned_employee}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Thời hạn:</td>
      <td style="padding: 8px; border: 1px solid #333;" colspan="3"><strong>{deadline}</strong></td>
    </tr>
  </tbody>
</table>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">NGƯỜI ĐÓNG GÓI</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 50px;"></div>
      </td>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">KIỂM TRA</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 50px;"></div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 10px; color: #666;">
  In lúc: {print_date} {print_time}
</div>

</div>
`;
}),
"[project]/features/settings/printer/templates/attendance.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Attendance Template - Bảng chấm công
 * Mẫu in mặc định cho bảng chấm công
 * 
 * CHUẨN TEMPLATE v3 (2025-12-10):
 * - Dạng DỌC (portrait) - mỗi nhân viên 1 tờ A4
 * - Compact: Chia 2 nửa tháng theo chiều ngang
 * - Font nhỏ gọn, vừa 1 trang
 */ // Template cho BÁO CÁO CÁ NHÂN (mỗi nhân viên 1 trang)
__turbopack_context__.s([
    "ATTENDANCE_SUMMARY_TEMPLATE",
    ()=>ATTENDANCE_SUMMARY_TEMPLATE,
    "ATTENDANCE_TEMPLATE",
    ()=>ATTENDANCE_TEMPLATE
]);
const ATTENDANCE_TEMPLATE = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: Arial, sans-serif; 
      font-size: 9px; 
      line-height: 1.2;
      padding: 8mm;
    }
    @page { size: A4 portrait; margin: 8mm; }
    .page-break { page-break-after: always; }
    
    .header { 
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      gap: 10px;
    }
    .store-logo {
      max-width: 40px;
      max-height: 40px;
    }
    .store-info-container { flex: 1; }
    .store-name { 
      font-size: 11px; 
      font-weight: bold; 
    }
    .store-info { 
      font-size: 8px; 
      color: #333;
    }
    
    .title { 
      font-size: 13px; 
      font-weight: bold; 
      text-align: center;
      margin: 8px 0 4px 0;
      text-transform: uppercase;
    }
    .subtitle {
      font-size: 11px;
      text-align: center;
      margin-bottom: 8px;
      font-weight: bold;
    }
    
    .employee-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      padding: 6px 10px;
      background: #f0f0f0;
      border-radius: 3px;
      font-size: 9px;
    }
    .info-group { display: flex; gap: 20px; }
    .info-item strong { font-weight: bold; }
    
    .legend {
      margin: 6px 0;
      font-size: 8px;
      color: #666;
    }
    .legend span { margin-right: 10px; }
    
    .tables-container {
      display: flex;
      gap: 8px;
    }
    .half-month {
      flex: 1;
    }
    .half-month h4 {
      font-size: 9px;
      text-align: center;
      margin-bottom: 4px;
      background: #333;
      color: white;
      padding: 3px;
    }
    
    table { 
      width: 100%; 
      border-collapse: collapse; 
      font-size: 8px;
    }
    th, td { 
      border: 1px solid #999; 
      padding: 2px 3px; 
      text-align: center;
    }
    th { 
      background: #e0e0e0; 
      font-weight: bold;
      font-size: 7px;
    }
    .col-day { width: 22px; }
    .col-dow { width: 22px; }
    .col-status { width: 28px; }
    .col-time { width: 38px; font-size: 7px; }
    
    .summary-section {
      margin: 10px 0;
      display: flex;
      gap: 10px;
    }
    .summary-box {
      flex: 1;
      padding: 6px 10px;
      background: #f5f5f5;
      border-radius: 3px;
      border: 1px solid #ddd;
      display: flex;
      justify-content: space-between;
      font-size: 9px;
    }
    .summary-box strong {
      font-size: 11px;
    }
    
    .footer { 
      margin-top: 15px;
      display: flex;
      justify-content: space-between;
    }
    .signature-box {
      width: 30%;
      text-align: center;
    }
    .signature-title {
      font-weight: bold;
      font-size: 9px;
      margin-bottom: 35px;
    }
    .signature-line {
      border-top: 1px dotted #333;
      padding-top: 3px;
      font-size: 8px;
    }
    
    .print-date {
      font-size: 8px;
      color: #666;
      text-align: right;
      margin-top: 10px;
    }
    
    @media print {
      body { padding: 5mm; }
    }
  </style>
</head>
<body>
  {{#line_items}}
  <div class="employee-page">
    <!-- Header -->
    <div class="header">
      <img src="{store_logo}" class="store-logo" onerror="this.style.display='none'">
      <div class="store-info-container">
        <div class="store-name">{store_name}</div>
        <div class="store-info">{store_address} | ĐT: {store_phone_number}</div>
      </div>
    </div>

    <div class="title">BẢNG CHẤM CÔNG CÁ NHÂN</div>
    <div class="subtitle">Tháng {month_year}</div>

    <!-- Thông tin nhân viên -->
    <div class="employee-info">
      <div class="info-group">
        <div class="info-item"><strong>Mã NV:</strong> {employee_code}</div>
        <div class="info-item"><strong>Họ tên:</strong> {employee_name}</div>
      </div>
      <div class="info-group">
        <div class="info-item"><strong>Phòng ban:</strong> {department_name}</div>
      </div>
    </div>

    <!-- Chú thích -->
    <div class="legend">
      <span>✓ Có mặt</span>
      <span>X Vắng</span>
      <span>P Nghỉ phép</span>
      <span>½ Nửa ngày</span>
      <span>L Nghỉ lễ</span>
      <span>- Cuối tuần/Chưa đến</span>
    </div>

    <!-- 2 bảng song song: Nửa đầu + Nửa cuối tháng -->
    <div class="tables-container">
      <!-- Nửa đầu tháng (1-15) -->
      <div class="half-month">
        <h4>Ngày 1 - 15</h4>
        <table>
          <thead>
            <tr>
              <th class="col-day">Ngày</th>
              <th class="col-dow">Thứ</th>
              <th class="col-status">TT</th>
              <th class="col-time">Vào</th>
              <th class="col-time">Ra</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>1</td><td>{dow_1}</td><td>{day_1}</td><td>{checkin_1}</td><td>{checkout_1}</td></tr>
            <tr><td>2</td><td>{dow_2}</td><td>{day_2}</td><td>{checkin_2}</td><td>{checkout_2}</td></tr>
            <tr><td>3</td><td>{dow_3}</td><td>{day_3}</td><td>{checkin_3}</td><td>{checkout_3}</td></tr>
            <tr><td>4</td><td>{dow_4}</td><td>{day_4}</td><td>{checkin_4}</td><td>{checkout_4}</td></tr>
            <tr><td>5</td><td>{dow_5}</td><td>{day_5}</td><td>{checkin_5}</td><td>{checkout_5}</td></tr>
            <tr><td>6</td><td>{dow_6}</td><td>{day_6}</td><td>{checkin_6}</td><td>{checkout_6}</td></tr>
            <tr><td>7</td><td>{dow_7}</td><td>{day_7}</td><td>{checkin_7}</td><td>{checkout_7}</td></tr>
            <tr><td>8</td><td>{dow_8}</td><td>{day_8}</td><td>{checkin_8}</td><td>{checkout_8}</td></tr>
            <tr><td>9</td><td>{dow_9}</td><td>{day_9}</td><td>{checkin_9}</td><td>{checkout_9}</td></tr>
            <tr><td>10</td><td>{dow_10}</td><td>{day_10}</td><td>{checkin_10}</td><td>{checkout_10}</td></tr>
            <tr><td>11</td><td>{dow_11}</td><td>{day_11}</td><td>{checkin_11}</td><td>{checkout_11}</td></tr>
            <tr><td>12</td><td>{dow_12}</td><td>{day_12}</td><td>{checkin_12}</td><td>{checkout_12}</td></tr>
            <tr><td>13</td><td>{dow_13}</td><td>{day_13}</td><td>{checkin_13}</td><td>{checkout_13}</td></tr>
            <tr><td>14</td><td>{dow_14}</td><td>{day_14}</td><td>{checkin_14}</td><td>{checkout_14}</td></tr>
            <tr><td>15</td><td>{dow_15}</td><td>{day_15}</td><td>{checkin_15}</td><td>{checkout_15}</td></tr>
          </tbody>
        </table>
      </div>

      <!-- Nửa cuối tháng (16-31) -->
      <div class="half-month">
        <h4>Ngày 16 - 31</h4>
        <table>
          <thead>
            <tr>
              <th class="col-day">Ngày</th>
              <th class="col-dow">Thứ</th>
              <th class="col-status">TT</th>
              <th class="col-time">Vào</th>
              <th class="col-time">Ra</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>16</td><td>{dow_16}</td><td>{day_16}</td><td>{checkin_16}</td><td>{checkout_16}</td></tr>
            <tr><td>17</td><td>{dow_17}</td><td>{day_17}</td><td>{checkin_17}</td><td>{checkout_17}</td></tr>
            <tr><td>18</td><td>{dow_18}</td><td>{day_18}</td><td>{checkin_18}</td><td>{checkout_18}</td></tr>
            <tr><td>19</td><td>{dow_19}</td><td>{day_19}</td><td>{checkin_19}</td><td>{checkout_19}</td></tr>
            <tr><td>20</td><td>{dow_20}</td><td>{day_20}</td><td>{checkin_20}</td><td>{checkout_20}</td></tr>
            <tr><td>21</td><td>{dow_21}</td><td>{day_21}</td><td>{checkin_21}</td><td>{checkout_21}</td></tr>
            <tr><td>22</td><td>{dow_22}</td><td>{day_22}</td><td>{checkin_22}</td><td>{checkout_22}</td></tr>
            <tr><td>23</td><td>{dow_23}</td><td>{day_23}</td><td>{checkin_23}</td><td>{checkout_23}</td></tr>
            <tr><td>24</td><td>{dow_24}</td><td>{day_24}</td><td>{checkin_24}</td><td>{checkout_24}</td></tr>
            <tr><td>25</td><td>{dow_25}</td><td>{day_25}</td><td>{checkin_25}</td><td>{checkout_25}</td></tr>
            <tr><td>26</td><td>{dow_26}</td><td>{day_26}</td><td>{checkin_26}</td><td>{checkout_26}</td></tr>
            <tr><td>27</td><td>{dow_27}</td><td>{day_27}</td><td>{checkin_27}</td><td>{checkout_27}</td></tr>
            <tr><td>28</td><td>{dow_28}</td><td>{day_28}</td><td>{checkin_28}</td><td>{checkout_28}</td></tr>
            <tr><td>29</td><td>{dow_29}</td><td>{day_29}</td><td>{checkin_29}</td><td>{checkout_29}</td></tr>
            <tr><td>30</td><td>{dow_30}</td><td>{day_30}</td><td>{checkin_30}</td><td>{checkout_30}</td></tr>
            <tr><td>31</td><td>{dow_31}</td><td>{day_31}</td><td>{checkin_31}</td><td>{checkout_31}</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Tổng kết -->
    <div class="summary-section">
      <div class="summary-box"><span>Ngày công:</span> <strong>{work_days}</strong></div>
      <div class="summary-box"><span>Nghỉ phép:</span> <strong>{leave_days}</strong></div>
      <div class="summary-box"><span>Vắng mặt:</span> <strong>{absent_days}</strong></div>
      <div class="summary-box"><span>Đi trễ:</span> <strong>{late_arrivals}</strong></div>
      <div class="summary-box"><span>Về sớm:</span> <strong>{early_departures}</strong></div>
      <div class="summary-box"><span>Giờ làm thêm:</span> <strong>{ot_hours}h</strong></div>
    </div>

    <!-- Chữ ký -->
    <div class="footer">
      <div class="signature-box">
        <div class="signature-title">Nhân viên</div>
        <div class="signature-line">(Ký, ghi rõ họ tên)</div>
      </div>
      <div class="signature-box">
        <div class="signature-title">Trưởng phòng</div>
        <div class="signature-line">(Ký, ghi rõ họ tên)</div>
      </div>
      <div class="signature-box">
        <div class="signature-title">Giám đốc</div>
        <div class="signature-line">(Ký, đóng dấu)</div>
      </div>
    </div>

    <div class="print-date">Ngày in: {print_date}</div>
  </div>
  <div class="page-break"></div>
  {{/line_items}}
</body>
</html>`;
const ATTENDANCE_SUMMARY_TEMPLATE = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: Arial, sans-serif; 
      font-size: 8px; 
      line-height: 1.2;
      padding: 5mm;
    }
    @page { size: A4 landscape; margin: 5mm; }
    
    .header { 
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      gap: 10px;
    }
    .store-logo {
      max-width: 40px;
      max-height: 40px;
    }
    .store-name { 
      font-size: 11px; 
      font-weight: bold; 
    }
    .store-info { 
      font-size: 8px; 
      color: #333;
    }
    
    .title { 
      font-size: 14px; 
      font-weight: bold; 
      text-align: center;
      margin: 5px 0;
      text-transform: uppercase;
    }
    .subtitle {
      font-size: 10px;
      text-align: center;
      margin-bottom: 8px;
    }
    
    .legend {
      font-size: 7px;
      margin-bottom: 5px;
      color: #666;
    }
    
    table { 
      width: 100%; 
      border-collapse: collapse; 
      font-size: 7px;
    }
    th, td { 
      border: 1px solid #999; 
      padding: 2px; 
      text-align: center;
    }
    th { 
      background: #e0e0e0; 
      font-weight: bold;
    }
    .col-name { 
      text-align: left; 
      padding-left: 3px !important;
      min-width: 80px;
    }
    
    .summary {
      margin-top: 8px;
      font-size: 9px;
    }
    
    .footer { 
      margin-top: 15px;
      display: flex;
      justify-content: space-between;
    }
    .signature-box {
      width: 25%;
      text-align: center;
    }
    .signature-title {
      font-weight: bold;
      font-size: 9px;
      margin-bottom: 30px;
    }
    
    .print-date {
      font-size: 7px;
      color: #666;
      text-align: right;
      margin-top: 8px;
    }
  </style>
</head>
<body>
  <div class="header">
    <img src="{store_logo}" class="store-logo" onerror="this.style.display='none'">
    <div>
      <div class="store-name">{store_name}</div>
      <div class="store-info">{store_address}</div>
    </div>
  </div>

  <div class="title">BẢNG CHẤM CÔNG TỔNG HỢP</div>
  <div class="subtitle">Tháng {month_year} | Phòng ban: {department_name}</div>

  <div class="legend">
    ✓ = Có mặt | X = Vắng | P = Nghỉ phép | ½ = Nửa ngày | L = Nghỉ lễ | - = Cuối tuần
  </div>

  <table>
    <thead>
      <tr>
        <th rowspan="2">STT</th>
        <th rowspan="2">Mã NV</th>
        <th rowspan="2" class="col-name">Họ và tên</th>
        <th colspan="4">Tổng kết</th>
        <th colspan="31">Ngày trong tháng</th>
      </tr>
      <tr>
        <th>Công</th>
        <th>Phép</th>
        <th>Vắng</th>
        <th>OT</th>
        <th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th>
        <th>8</th><th>9</th><th>10</th><th>11</th><th>12</th><th>13</th><th>14</th><th>15</th>
        <th>16</th><th>17</th><th>18</th><th>19</th><th>20</th><th>21</th><th>22</th>
        <th>23</th><th>24</th><th>25</th><th>26</th><th>27</th><th>28</th><th>29</th><th>30</th><th>31</th>
      </tr>
    </thead>
    <tbody>
      {{#line_items}}
      <tr>
        <td>{line_index}</td>
        <td>{employee_code}</td>
        <td class="col-name">{employee_name}</td>
        <td>{work_days}</td>
        <td>{leave_days}</td>
        <td>{absent_days}</td>
        <td>{ot_hours}</td>
        <td>{day_1}</td><td>{day_2}</td><td>{day_3}</td><td>{day_4}</td><td>{day_5}</td><td>{day_6}</td><td>{day_7}</td>
        <td>{day_8}</td><td>{day_9}</td><td>{day_10}</td><td>{day_11}</td><td>{day_12}</td><td>{day_13}</td><td>{day_14}</td><td>{day_15}</td>
        <td>{day_16}</td><td>{day_17}</td><td>{day_18}</td><td>{day_19}</td><td>{day_20}</td><td>{day_21}</td><td>{day_22}</td>
        <td>{day_23}</td><td>{day_24}</td><td>{day_25}</td><td>{day_26}</td><td>{day_27}</td><td>{day_28}</td><td>{day_29}</td><td>{day_30}</td><td>{day_31}</td>
      </tr>
      {{/line_items}}
    </tbody>
  </table>

  <div class="summary">
    <strong>Tổng cộng:</strong> {total_employees} nhân viên | 
    {total_work_days} công | {total_leave_days} phép | {total_absent_days} vắng | {total_ot_hours}h OT
  </div>

  <div class="footer">
    <div class="signature-box">
      <div class="signature-title">Người lập</div>
    </div>
    <div class="signature-box">
      <div class="signature-title">Kế toán</div>
    </div>
    <div class="signature-box">
      <div class="signature-title">Trưởng phòng</div>
    </div>
    <div class="signature-box">
      <div class="signature-title">Giám đốc</div>
    </div>
  </div>

  <div class="print-date">Ngày in: {print_date}</div>
</body>
</html>`;
}),
"[project]/features/settings/printer/templates/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_TEMPLATES",
    ()=>DEFAULT_TEMPLATES,
    "EXTENDED_TEMPLATES",
    ()=>EXTENDED_TEMPLATES,
    "getAllTemplateTypes",
    ()=>getAllTemplateTypes,
    "getDefaultTemplate",
    ()=>getDefaultTemplate
]);
// =============================================
// EXPORT ALL DEFAULT TEMPLATES
// =============================================
// MAIN TEMPLATES (16 loại chính)
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$order$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/order.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$quote$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/quote.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$receipt$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/receipt.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$payment$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/payment.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$warranty$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/warranty.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$inventory$2d$check$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/inventory-check.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$stock$2d$transfer$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/stock-transfer.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$sales$2d$return$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/sales-return.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$purchase$2d$order$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/purchase-order.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$packing$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/packing.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$delivery$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/delivery.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$shipping$2d$label$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/shipping-label.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$product$2d$label$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/product-label.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$stock$2d$in$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/stock-in.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$supplier$2d$return$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/supplier-return.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$complaint$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/complaint.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$penalty$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/penalty.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$cost$2d$adjustment$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/cost-adjustment.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$payroll$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/payroll.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$payslip$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/payslip.ts [app-ssr] (ecmascript)");
// EXTENDED TEMPLATES (8 loại mở rộng - MỚI)
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$supplier$2d$order$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/supplier-order.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$return$2d$order$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/return-order.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$handover$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/handover.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$refund$2d$confirmation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/refund-confirmation.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$packing$2d$guide$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/packing-guide.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$sales$2d$summary$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/sales-summary.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$warranty$2d$request$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/warranty-request.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$packing$2d$request$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/packing-request.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$attendance$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/attendance.ts [app-ssr] (ecmascript)");
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
;
;
;
;
;
;
;
;
const DEFAULT_TEMPLATES = {
    'order': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$order$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ORDER_TEMPLATE"],
    'quote': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$quote$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QUOTE_TEMPLATE"],
    'receipt': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$receipt$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RECEIPT_TEMPLATE"],
    'payment': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$payment$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PAYMENT_TEMPLATE"],
    'warranty': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$warranty$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WARRANTY_TEMPLATE"],
    'inventory-check': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$inventory$2d$check$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["INVENTORY_CHECK_TEMPLATE"],
    'stock-transfer': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$stock$2d$transfer$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["STOCK_TRANSFER_TEMPLATE"],
    'sales-return': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$sales$2d$return$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SALES_RETURN_TEMPLATE"],
    'purchase-order': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$purchase$2d$order$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PURCHASE_ORDER_TEMPLATE"],
    'packing': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$packing$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PACKING_TEMPLATE"],
    'delivery': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$delivery$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DELIVERY_TEMPLATE"],
    'shipping-label': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$shipping$2d$label$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SHIPPING_LABEL_TEMPLATE"],
    'product-label': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$product$2d$label$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PRODUCT_LABEL_TEMPLATE"],
    'stock-in': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$stock$2d$in$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["STOCK_IN_TEMPLATE"],
    'supplier-return': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$supplier$2d$return$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SUPPLIER_RETURN_TEMPLATE"],
    'complaint': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$complaint$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COMPLAINT_TEMPLATE"],
    'penalty': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$penalty$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PENALTY_TEMPLATE"],
    'leave': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$penalty$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PENALTY_TEMPLATE"],
    'cost-adjustment': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$cost$2d$adjustment$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COST_ADJUSTMENT_TEMPLATE"],
    'handover': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$handover$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HANDOVER_TEMPLATE"],
    'payroll': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$payroll$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PAYROLL_TEMPLATE"],
    'payslip': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$payslip$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PAYSLIP_TEMPLATE"],
    'attendance': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$attendance$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ATTENDANCE_TEMPLATE"]
};
const EXTENDED_TEMPLATES = {
    'supplier-order': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$supplier$2d$order$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SUPPLIER_ORDER_TEMPLATE"],
    'return-order': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$return$2d$order$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RETURN_ORDER_TEMPLATE"],
    'refund-confirmation': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$refund$2d$confirmation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["REFUND_CONFIRMATION_TEMPLATE"],
    'packing-guide': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$packing$2d$guide$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PACKING_GUIDE_TEMPLATE"],
    'sales-summary': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$sales$2d$summary$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SALES_SUMMARY_TEMPLATE"],
    'warranty-request': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$warranty$2d$request$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WARRANTY_REQUEST_TEMPLATE"],
    'packing-request': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$packing$2d$request$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PACKING_REQUEST_TEMPLATE"]
};
function getDefaultTemplate(type) {
    if (type in DEFAULT_TEMPLATES) {
        return DEFAULT_TEMPLATES[type];
    }
    if (type in EXTENDED_TEMPLATES) {
        return EXTENDED_TEMPLATES[type];
    }
    return '';
}
function getAllTemplateTypes() {
    return [
        ...Object.keys(DEFAULT_TEMPLATES),
        ...Object.keys(EXTENDED_TEMPLATES)
    ];
}
}),
"[project]/features/settings/printer/default-templates.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// Re-export từ templates/index.ts - các template mới đã được tối ưu với inline styles
// Các template này tương thích với TipTap editor và preview
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/index.ts [app-ssr] (ecmascript) <locals>");
;
}),
"[project]/features/settings/printer/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePrintTemplateStore",
    ()=>usePrintTemplateStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$default$2d$templates$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/features/settings/printer/default-templates.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/index.ts [app-ssr] (ecmascript) <locals>");
;
;
const getTemplateKey = (type, size, branchId)=>branchId ? `${type}-${size}-${branchId}` : `${type}-${size}`;
// API sync helper
async function syncTemplateToAPI(template, action) {
    try {
        const response = await fetch('/api/settings/print-templates', {
            method: action === 'create' ? 'POST' : action === 'delete' ? 'DELETE' : 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(template)
        });
        return response.ok;
    } catch (error) {
        console.error('syncTemplateToAPI error:', error);
        return false;
    }
}
const usePrintTemplateStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((set, get)=>({
        templates: {},
        defaultSizes: {},
        initialized: false,
        getTemplate: (type, size, branchId)=>{
            const state = get();
            const key = getTemplateKey(type, size, branchId);
            // Thử tìm template cho branch cụ thể
            const branchTemplate = state.templates[key];
            if (branchTemplate && branchTemplate.content && branchTemplate.content.trim() !== '') {
                // Auto-reset payroll templates nếu phát hiện dùng syntax cũ
                // - {{#line_items}} : Mustache syntax không được hỗ trợ
                // - {line_index} : biến cũ, phải dùng {line_stt}
                if ((type === 'payroll' || type === 'payslip') && (branchTemplate.content.includes('{{#line_items}}') || branchTemplate.content.includes('{line_index}'))) {
                    // Template đang dùng syntax cũ không được hỗ trợ -> reset về mặc định
                    return {
                        id: `template-${key}`,
                        type,
                        name: type === 'payroll' ? 'Bảng lương' : 'Phiếu lương',
                        content: (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getDefaultTemplate"])(type),
                        paperSize: size,
                        isActive: true,
                        updatedAt: new Date().toISOString()
                    };
                }
                return branchTemplate;
            }
            // Nếu không có template cho branch, tìm template chung
            const generalKey = getTemplateKey(type, size);
            const generalTemplate = state.templates[generalKey];
            if (branchId && generalTemplate && generalTemplate.content && generalTemplate.content.trim() !== '') {
                // Auto-reset payroll templates nếu phát hiện dùng syntax cũ
                if ((type === 'payroll' || type === 'payslip') && (generalTemplate.content.includes('{{#line_items}}') || generalTemplate.content.includes('{line_index}'))) {
                    return {
                        id: `template-${key}`,
                        type,
                        name: type === 'payroll' ? 'Bảng lương' : 'Phiếu lương',
                        content: (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getDefaultTemplate"])(type),
                        paperSize: size,
                        isActive: true,
                        updatedAt: new Date().toISOString()
                    };
                }
                return generalTemplate;
            }
            // Return default template if not exists or empty
            // Đây là điểm quan trọng: nếu chưa có template hoặc template trống
            // thì sử dụng mẫu mặc định của hệ thống
            return {
                id: `template-${key}`,
                type,
                name: type === 'order' ? 'Mẫu hóa đơn bán hàng' : 'Mẫu in',
                content: (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getDefaultTemplate"])(type),
                paperSize: size,
                isActive: true,
                updatedAt: new Date().toISOString()
            };
        },
        updateTemplate: (type, size, content, branchId)=>{
            const key = getTemplateKey(type, size, branchId);
            set((state)=>{
                const current = state.templates[key] || {
                    id: `template-${key}`,
                    type,
                    name: 'Mẫu in',
                    content: (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getDefaultTemplate"])(type),
                    paperSize: size,
                    isActive: true,
                    updatedAt: new Date().toISOString()
                };
                return {
                    templates: {
                        ...state.templates,
                        [key]: {
                            ...current,
                            content,
                            updatedAt: new Date().toISOString()
                        }
                    }
                };
            });
        },
        updateTemplateAllBranches: (type, size, content)=>{
            // Lưu template chung (không có branchId) - sẽ áp dụng cho tất cả chi nhánh
            const key = getTemplateKey(type, size);
            set((state)=>{
                // Xóa tất cả template cụ thể của các branch cho type và size này
                const newTemplates = {
                    ...state.templates
                };
                Object.keys(newTemplates).forEach((k)=>{
                    if (k.startsWith(`${type}-${size}-`)) {
                        delete newTemplates[k];
                    }
                });
                return {
                    templates: {
                        ...newTemplates,
                        [key]: {
                            id: `template-${key}`,
                            type,
                            name: 'Mẫu in',
                            content,
                            paperSize: size,
                            isActive: true,
                            updatedAt: new Date().toISOString()
                        }
                    }
                };
            });
        },
        resetTemplate: (type, size, branchId)=>{
            const key = getTemplateKey(type, size, branchId);
            set((state)=>({
                    templates: {
                        ...state.templates,
                        [key]: {
                            id: `template-${key}`,
                            type,
                            name: 'Mẫu mặc định',
                            content: (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getDefaultTemplate"])(type),
                            paperSize: size,
                            isActive: true,
                            updatedAt: new Date().toISOString()
                        }
                    }
                }));
        },
        setDefaultSize: (type, size)=>{
            set((state)=>({
                    defaultSizes: {
                        ...state.defaultSizes,
                        [type]: size
                    }
                }));
        },
        getDefaultSize: (type)=>{
            const state = get();
            return state.defaultSizes[type] || 'A4';
        },
        loadFromAPI: async ()=>{
            if (get().initialized) return;
            try {
                const response = await fetch('/api/settings/print-templates');
                if (response.ok) {
                    const json = await response.json();
                    if (json.data) {
                        set({
                            templates: json.data.templates || {},
                            defaultSizes: json.data.defaultSizes || {},
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
"[project]/features/complaints/tracking-utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "canCustomerComment",
    ()=>canCustomerComment,
    "formatTrackingInfo",
    ()=>formatTrackingInfo,
    "generateTrackingUrl",
    ()=>generateTrackingUrl,
    "getTrackingCode",
    ()=>getTrackingCode,
    "isTrackingEnabled",
    ()=>isTrackingEnabled,
    "loadTrackingSettings",
    ()=>loadTrackingSettings,
    "shouldShowEmployeeName",
    ()=>shouldShowEmployeeName,
    "shouldShowTimeline",
    ()=>shouldShowTimeline
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$complaints$2d$settings$2d$sync$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/complaints-settings-sync.ts [app-ssr] (ecmascript)");
;
// Default tracking settings
const defaultSettings = {
    enabled: false,
    allowCustomerComments: false,
    showEmployeeName: true,
    showTimeline: true
};
function loadTrackingSettings() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$complaints$2d$settings$2d$sync$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getComplaintsTrackingSync"])();
}
function isTrackingEnabled() {
    const settings = loadTrackingSettings();
    return settings.enabled;
}
function generateTrackingUrl(complaint) {
    const baseUrl = window.location.origin;
    const trackingCode = complaint.publicTrackingCode || complaint.systemId; // Fallback SystemId nếu chưa có code riêng
    return `${baseUrl}/complaint-tracking/${trackingCode}`;
}
function getTrackingCode(complaintId) {
    // Handle undefined/null
    if (!complaintId) {
        return 'N/A';
    }
    // If ID format is COM00000003, extract the number part
    const match = complaintId.match(/COM(\d+)/);
    if (match) {
        return `KN-${match[1]}`;
    }
    // Fallback: use first 8 chars
    return complaintId.substring(0, 8).toUpperCase();
}
function canCustomerComment() {
    const settings = loadTrackingSettings();
    return settings.enabled && settings.allowCustomerComments;
}
function shouldShowEmployeeName() {
    const settings = loadTrackingSettings();
    return settings.showEmployeeName;
}
function shouldShowTimeline() {
    const settings = loadTrackingSettings();
    return settings.showTimeline;
}
function formatTrackingInfo(complaint) {
    return {
        code: getTrackingCode(complaint.id),
        url: generateTrackingUrl(complaint),
        enabled: isTrackingEnabled()
    };
}
}),
"[project]/features/complaints/columns.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getColumns",
    ()=>getColumns
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/checkbox.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-ssr] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-ssr] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-x.js [app-ssr] (ecmascript) <export default as XCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/phone.js [app-ssr] (ecmascript) <export default as Phone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/package.js [app-ssr] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar.js [app-ssr] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-ssr] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis.js [app-ssr] (ecmascript) <export default as MoreHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dropdown-menu.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/complaints/types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$sla$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/complaints/sla-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$tracking$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/complaints/tracking-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-ssr] (ecmascript)");
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
const getColumns = (onView, onEdit, onFinish, onOpen, onCancel, onGetLink, employees, router)=>[
        // Select column
        {
            id: 'select',
            header: ({ isAllPageRowsSelected, isSomePageRowsSelected, onToggleAll })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Checkbox"], {
                    checked: isAllPageRowsSelected ? true : isSomePageRowsSelected ? "indeterminate" : false,
                    onCheckedChange: (value)=>onToggleAll?.(!!value),
                    "aria-label": "Select all"
                }, void 0, false, {
                    fileName: "[project]/features/complaints/columns.tsx",
                    lineNumber: 49,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            cell: ({ onToggleSelect, isSelected })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Checkbox"], {
                    checked: isSelected,
                    onCheckedChange: onToggleSelect,
                    "aria-label": "Select row"
                }, void 0, false, {
                    fileName: "[project]/features/complaints/columns.tsx",
                    lineNumber: 56,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            size: 48,
            meta: {
                sticky: 'left',
                displayName: 'Chọn'
            }
        },
        // ID column - Clickable
        {
            id: 'complaintId',
            accessorKey: 'id',
            header: 'Mã khiếu nại',
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>onView(row.systemId),
                    className: "text-primary hover:underline font-medium",
                    children: row.id
                }, void 0, false, {
                    fileName: "[project]/features/complaints/columns.tsx",
                    lineNumber: 75,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            size: 140,
            meta: {
                displayName: 'Mã khiếu nại'
            }
        },
        // Order Code
        {
            id: 'orderCode',
            accessorKey: 'orderCode',
            header: 'Mã đơn hàng',
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                            className: "h-4 w-4 text-muted-foreground"
                        }, void 0, false, {
                            fileName: "[project]/features/complaints/columns.tsx",
                            lineNumber: 95,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>router.push(`/orders/${row.orderSystemId}`),
                            className: "font-medium text-primary hover:underline",
                            children: row.orderCode || row.orderSystemId
                        }, void 0, false, {
                            fileName: "[project]/features/complaints/columns.tsx",
                            lineNumber: 96,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/complaints/columns.tsx",
                    lineNumber: 94,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            size: 140,
            meta: {
                displayName: 'Mã đơn hàng'
            }
        },
        // Customer Name
        {
            id: 'customerName',
            accessorKey: 'customerName',
            header: 'Khách hàng',
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>router.push(`/customers/${row.customerSystemId}`),
                            className: "font-medium text-primary hover:underline text-left",
                            children: row.customerName
                        }, void 0, false, {
                            fileName: "[project]/features/complaints/columns.tsx",
                            lineNumber: 117,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-body-xs text-muted-foreground flex items-center gap-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__["Phone"], {
                                    className: "h-3 w-3"
                                }, void 0, false, {
                                    fileName: "[project]/features/complaints/columns.tsx",
                                    lineNumber: 124,
                                    columnNumber: 11
                                }, ("TURBOPACK compile-time value", void 0)),
                                row.customerPhone
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/complaints/columns.tsx",
                            lineNumber: 123,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/complaints/columns.tsx",
                    lineNumber: 116,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            size: 180,
            meta: {
                displayName: 'Khách hàng'
            }
        },
        // Type
        {
            id: 'type',
            accessorKey: 'type',
            header: 'Loại khiếu nại',
            cell: ({ row })=>{
                const type = row.type;
                const typeLabels = {
                    'wrong-product': 'Sai hàng',
                    'missing-items': 'Thiếu hàng',
                    'wrong-packaging': 'Đóng gói sai quy cách',
                    'warehouse-defect': 'Trả hàng lỗi do kho',
                    'product-condition': 'Khách phàn nàn về tình trạng hàng'
                };
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    children: typeLabels[type] || __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["complaintTypeLabels"][type]
                }, void 0, false, {
                    fileName: "[project]/features/complaints/columns.tsx",
                    lineNumber: 149,
                    columnNumber: 14
                }, ("TURBOPACK compile-time value", void 0));
            },
            size: 180,
            meta: {
                displayName: 'Loại khiếu nại'
            }
        },
        // Priority
        {
            id: 'priority',
            accessorKey: 'priority',
            header: 'Mức độ',
            cell: ({ row })=>{
                const priority = row.priority;
                const priorityLabels = {
                    low: 'Thấp',
                    medium: 'Trung bình',
                    high: 'Cao',
                    urgent: 'Khẩn cấp'
                };
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    children: priorityLabels[priority] || 'Trung bình'
                }, void 0, false, {
                    fileName: "[project]/features/complaints/columns.tsx",
                    lineNumber: 170,
                    columnNumber: 14
                }, ("TURBOPACK compile-time value", void 0));
            },
            size: 130,
            meta: {
                displayName: 'Mức độ'
            }
        },
        // Status
        {
            id: 'status',
            accessorKey: 'status',
            header: 'Trạng thái',
            cell: ({ row })=>{
                const status = row.status;
                const statusLabels = {
                    pending: 'Chờ xử lý',
                    investigating: 'Đang kiểm tra',
                    resolved: 'Đã giải quyết',
                    cancelled: 'Đã hủy',
                    ended: 'Kết thúc'
                };
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    children: statusLabels[status] || status
                }, void 0, false, {
                    fileName: "[project]/features/complaints/columns.tsx",
                    lineNumber: 192,
                    columnNumber: 14
                }, ("TURBOPACK compile-time value", void 0));
            },
            size: 140,
            meta: {
                displayName: 'Trạng thái'
            }
        },
        // SLA Status
        {
            id: 'slaStatus',
            header: 'SLA',
            cell: ({ row })=>{
                const overdueStatus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$sla$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["checkOverdue"])(row);
                if (!overdueStatus.isOverdueResponse && !overdueStatus.isOverdueResolve) {
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "Trong hạn"
                    }, void 0, false, {
                        fileName: "[project]/features/complaints/columns.tsx",
                        lineNumber: 208,
                        columnNumber: 16
                    }, ("TURBOPACK compile-time value", void 0));
                }
                if (row.status === 'resolved') {
                    const hours = Math.abs(overdueStatus.resolveTimeLeft);
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: [
                            "Quá ",
                            Math.floor(hours),
                            "h"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/complaints/columns.tsx",
                        lineNumber: 213,
                        columnNumber: 16
                    }, ("TURBOPACK compile-time value", void 0));
                }
                const hours = Math.abs(overdueStatus.resolveTimeLeft);
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    children: [
                        "Quá ",
                        Math.floor(hours),
                        "h"
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/complaints/columns.tsx",
                    lineNumber: 217,
                    columnNumber: 14
                }, ("TURBOPACK compile-time value", void 0));
            },
            size: 140,
            meta: {
                displayName: 'SLA'
            }
        },
        // Assigned To
        {
            id: 'assignedTo',
            accessorKey: 'assignedTo',
            header: 'Người xử lý',
            cell: ({ row })=>{
                const assignedTo = row.assignedTo;
                if (!assignedTo) {
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-muted-foreground italic",
                        children: "Chưa phân công"
                    }, void 0, false, {
                        fileName: "[project]/features/complaints/columns.tsx",
                        lineNumber: 233,
                        columnNumber: 16
                    }, ("TURBOPACK compile-time value", void 0));
                }
                const employee = employees.find((e)=>e.systemId === assignedTo);
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                            className: "h-4 w-4 text-muted-foreground"
                        }, void 0, false, {
                            fileName: "[project]/features/complaints/columns.tsx",
                            lineNumber: 238,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: employee?.fullName || 'Không xác định'
                        }, void 0, false, {
                            fileName: "[project]/features/complaints/columns.tsx",
                            lineNumber: 239,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/complaints/columns.tsx",
                    lineNumber: 237,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0));
            },
            size: 160,
            meta: {
                displayName: 'Người xử lý'
            }
        },
        // Created At
        {
            id: 'createdAt',
            accessorKey: 'createdAt',
            header: 'Ngày tạo',
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                            className: "h-4 w-4 text-muted-foreground"
                        }, void 0, false, {
                            fileName: "[project]/features/complaints/columns.tsx",
                            lineNumber: 256,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-body-sm",
                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(row.createdAt)
                        }, void 0, false, {
                            fileName: "[project]/features/complaints/columns.tsx",
                            lineNumber: 257,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/complaints/columns.tsx",
                    lineNumber: 255,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            size: 140,
            meta: {
                displayName: 'Ngày tạo'
            }
        },
        // Updated At
        {
            id: 'updatedAt',
            accessorKey: 'updatedAt',
            header: 'Cập nhật',
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                            className: "h-4 w-4 text-muted-foreground"
                        }, void 0, false, {
                            fileName: "[project]/features/complaints/columns.tsx",
                            lineNumber: 273,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0)),
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(row.updatedAt)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/complaints/columns.tsx",
                    lineNumber: 272,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            size: 140,
            meta: {
                displayName: 'Cập nhật'
            }
        },
        // Verification Status
        {
            id: 'verification',
            accessorKey: 'verification',
            header: 'Xác minh',
            cell: ({ row })=>{
                const verification = row.verification;
                const verificationLabels = {
                    'verified-correct': 'Đúng',
                    'verified-incorrect': 'Sai',
                    'pending-verification': 'Chưa xác minh'
                };
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    children: verificationLabels[verification] || 'Chưa xác minh'
                }, void 0, false, {
                    fileName: "[project]/features/complaints/columns.tsx",
                    lineNumber: 295,
                    columnNumber: 14
                }, ("TURBOPACK compile-time value", void 0));
            },
            size: 130,
            meta: {
                displayName: 'Xác minh'
            }
        },
        // Branch
        {
            id: 'branch',
            accessorKey: 'branchName',
            header: 'Chi nhánh',
            cell: ({ row })=>{
                const branchName = row.branchName;
                if (!branchName) {
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-muted-foreground italic",
                        children: "Chưa có"
                    }, void 0, false, {
                        fileName: "[project]/features/complaints/columns.tsx",
                        lineNumber: 311,
                        columnNumber: 16
                    }, ("TURBOPACK compile-time value", void 0));
                }
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    children: branchName
                }, void 0, false, {
                    fileName: "[project]/features/complaints/columns.tsx",
                    lineNumber: 313,
                    columnNumber: 14
                }, ("TURBOPACK compile-time value", void 0));
            },
            size: 150,
            meta: {
                displayName: 'Chi nhánh'
            }
        },
        // Affected Products Count
        {
            id: 'affectedProducts',
            header: 'SP ảnh hưởng',
            cell: ({ row })=>{
                const products = row.affectedProducts || [];
                if (products.length === 0) {
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-muted-foreground",
                        children: "0"
                    }, void 0, false, {
                        fileName: "[project]/features/complaints/columns.tsx",
                        lineNumber: 328,
                        columnNumber: 16
                    }, ("TURBOPACK compile-time value", void 0));
                }
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-1",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                            className: "h-4 w-4 text-orange-600"
                        }, void 0, false, {
                            fileName: "[project]/features/complaints/columns.tsx",
                            lineNumber: 332,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "font-medium",
                            children: products.length
                        }, void 0, false, {
                            fileName: "[project]/features/complaints/columns.tsx",
                            lineNumber: 333,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/complaints/columns.tsx",
                    lineNumber: 331,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0));
            },
            size: 110,
            meta: {
                displayName: 'SP ảnh hưởng'
            }
        },
        // Resolved At
        {
            id: 'resolvedAt',
            accessorKey: 'resolvedAt',
            header: 'Ngày giải quyết',
            cell: ({ row })=>{
                if (!row.resolvedAt) {
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-muted-foreground italic",
                        children: "Chưa giải quyết"
                    }, void 0, false, {
                        fileName: "[project]/features/complaints/columns.tsx",
                        lineNumber: 350,
                        columnNumber: 16
                    }, ("TURBOPACK compile-time value", void 0));
                }
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                            className: "h-4 w-4 text-green-600"
                        }, void 0, false, {
                            fileName: "[project]/features/complaints/columns.tsx",
                            lineNumber: 354,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-body-sm",
                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(row.resolvedAt)
                        }, void 0, false, {
                            fileName: "[project]/features/complaints/columns.tsx",
                            lineNumber: 355,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/complaints/columns.tsx",
                    lineNumber: 353,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0));
            },
            size: 160,
            meta: {
                displayName: 'Ngày giải quyết'
            }
        },
        // Cancelled At
        {
            id: 'cancelledAt',
            accessorKey: 'cancelledAt',
            header: 'Ngày hủy',
            cell: ({ row })=>{
                if (!row.cancelledAt) {
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-muted-foreground",
                        children: "-"
                    }, void 0, false, {
                        fileName: "[project]/features/complaints/columns.tsx",
                        lineNumber: 372,
                        columnNumber: 16
                    }, ("TURBOPACK compile-time value", void 0));
                }
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"], {
                            className: "h-4 w-4 text-destructive"
                        }, void 0, false, {
                            fileName: "[project]/features/complaints/columns.tsx",
                            lineNumber: 376,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-body-sm",
                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(row.cancelledAt)
                        }, void 0, false, {
                            fileName: "[project]/features/complaints/columns.tsx",
                            lineNumber: 377,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/complaints/columns.tsx",
                    lineNumber: 375,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0));
            },
            size: 160,
            meta: {
                displayName: 'Ngày hủy'
            }
        },
        // Description
        {
            id: 'description',
            accessorKey: 'description',
            header: 'Mô tả',
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-[300px] line-clamp-2",
                    title: row.description,
                    children: row.description
                }, void 0, false, {
                    fileName: "[project]/features/complaints/columns.tsx",
                    lineNumber: 393,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            size: 300,
            meta: {
                displayName: 'Mô tả'
            }
        },
        // Resolution
        {
            id: 'resolution',
            accessorKey: 'resolutionNote',
            header: 'Giải pháp',
            cell: ({ row })=>{
                const resolutionNote = row.resolutionNote;
                if (!resolutionNote) {
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-muted-foreground italic",
                        children: "Chưa có"
                    }, void 0, false, {
                        fileName: "[project]/features/complaints/columns.tsx",
                        lineNumber: 411,
                        columnNumber: 16
                    }, ("TURBOPACK compile-time value", void 0));
                }
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-[300px] line-clamp-2",
                    title: resolutionNote,
                    children: resolutionNote
                }, void 0, false, {
                    fileName: "[project]/features/complaints/columns.tsx",
                    lineNumber: 414,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0));
            },
            size: 300,
            meta: {
                displayName: 'Giải pháp'
            }
        },
        // Actions column - sticky right
        {
            id: 'actions',
            header: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-right",
                    children: "Thao tác"
                }, void 0, false, {
                    fileName: "[project]/features/complaints/columns.tsx",
                    lineNumber: 428,
                    columnNumber: 19
                }, ("TURBOPACK compile-time value", void 0)),
            cell: ({ row })=>{
                const complaint = row;
                const isResolved = complaint.status === 'resolved';
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-end",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenu"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                                asChild: true,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "ghost",
                                    className: "h-8 w-8 p-0",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "sr-only",
                                            children: "Mở menu"
                                        }, void 0, false, {
                                            fileName: "[project]/features/complaints/columns.tsx",
                                            lineNumber: 438,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__["MoreHorizontal"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/features/complaints/columns.tsx",
                                            lineNumber: 439,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/complaints/columns.tsx",
                                    lineNumber: 437,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/features/complaints/columns.tsx",
                                lineNumber: 436,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                                align: "end",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuLabel"], {
                                        children: "Thao tác"
                                    }, void 0, false, {
                                        fileName: "[project]/features/complaints/columns.tsx",
                                        lineNumber: 443,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                                        fileName: "[project]/features/complaints/columns.tsx",
                                        lineNumber: 444,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                        onClick: ()=>onEdit(complaint.systemId),
                                        children: "Sửa"
                                    }, void 0, false, {
                                        fileName: "[project]/features/complaints/columns.tsx",
                                        lineNumber: 445,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                        onClick: ()=>{
                                            // Check if tracking is enabled
                                            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$tracking$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isTrackingEnabled"])()) {
                                                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Chức năng tracking chưa được bật. Vui lòng bật trong Cài đặt.');
                                                return;
                                            }
                                            onGetLink(complaint.systemId);
                                        },
                                        children: "Get Tracking"
                                    }, void 0, false, {
                                        fileName: "[project]/features/complaints/columns.tsx",
                                        lineNumber: 448,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                                        fileName: "[project]/features/complaints/columns.tsx",
                                        lineNumber: 460,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    !isResolved && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                        onClick: ()=>onFinish(complaint.systemId),
                                        children: "Kết thúc"
                                    }, void 0, false, {
                                        fileName: "[project]/features/complaints/columns.tsx",
                                        lineNumber: 462,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    isResolved && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                        onClick: ()=>onOpen(complaint.systemId),
                                        children: "Mở"
                                    }, void 0, false, {
                                        fileName: "[project]/features/complaints/columns.tsx",
                                        lineNumber: 467,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                                        fileName: "[project]/features/complaints/columns.tsx",
                                        lineNumber: 471,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                        onClick: ()=>onCancel(complaint.systemId),
                                        className: "text-destructive focus:text-destructive",
                                        children: "Hủy"
                                    }, void 0, false, {
                                        fileName: "[project]/features/complaints/columns.tsx",
                                        lineNumber: 472,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/complaints/columns.tsx",
                                lineNumber: 442,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/complaints/columns.tsx",
                        lineNumber: 435,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/features/complaints/columns.tsx",
                    lineNumber: 434,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0));
            },
            size: 90,
            meta: {
                sticky: 'right',
                displayName: 'Thao tác'
            }
        }
    ];
}),
"[project]/features/complaints/complaint-card.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComplaintCard",
    ()=>ComplaintCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/phone.js [app-ssr] (ecmascript) <export default as Phone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/package.js [app-ssr] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar.js [app-ssr] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-ssr] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-ssr] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-ssr] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-ssr] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-x.js [app-ssr] (ecmascript) <export default as XCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-ssr] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/badge.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$StatusBadge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/StatusBadge.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/complaints/types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$sla$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/complaints/sla-utils.ts [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
;
;
function ComplaintCard({ complaint, onClick, employees }) {
    const overdueStatus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$sla$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["checkOverdue"])(complaint);
    const isOverdue = overdueStatus.isOverdueResponse || overdueStatus.isOverdueResolve;
    const statusConfig = {
        pending: {
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"],
            color: 'text-yellow-600'
        },
        investigating: {
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"],
            color: 'text-blue-600'
        },
        resolved: {
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"],
            color: 'text-green-600'
        },
        rejected: {
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"],
            color: 'text-gray-600'
        }
    };
    const StatusIcon = statusConfig[complaint.status].icon;
    const priorityConfig = {
        low: {
            label: 'Thấp',
            color: 'bg-slate-100 text-slate-800'
        },
        medium: {
            label: 'Trung bình',
            color: 'bg-amber-100 text-amber-800'
        },
        high: {
            label: 'Cao',
            color: 'bg-orange-100 text-orange-800'
        },
        urgent: {
            label: 'Khẩn cấp',
            color: 'bg-red-100 text-red-800'
        }
    };
    const assignedEmployee = complaint.assignedTo ? employees.find((e)=>e.systemId === complaint.assignedTo) : null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
        onClick: onClick,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("p-4 cursor-pointer transition-all hover:shadow-md", "border-l-4", isOverdue && "border-l-red-500 bg-red-50", !isOverdue && complaint.priority === 'urgent' && "border-l-red-400 bg-red-50", !isOverdue && complaint.priority === 'high' && "border-l-orange-400 bg-orange-50", !isOverdue && complaint.priority === 'medium' && "border-l-amber-400 bg-amber-50", !isOverdue && complaint.priority === 'low' && "border-l-slate-400 bg-slate-50"),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-start justify-between mb-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 min-w-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 mb-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-semibold text-body-sm text-primary",
                                        children: complaint.id
                                    }, void 0, false, {
                                        fileName: "[project]/features/complaints/complaint-card.tsx",
                                        lineNumber: 58,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                        variant: "outline",
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-body-xs", __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["complaintTypeColors"][complaint.type]),
                                        children: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["complaintTypeLabels"][complaint.type]
                                    }, void 0, false, {
                                        fileName: "[project]/features/complaints/complaint-card.tsx",
                                        lineNumber: 59,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/complaints/complaint-card.tsx",
                                lineNumber: 57,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 text-body-xs text-muted-foreground",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                                        className: "h-3.5 w-3.5 shrink-0"
                                    }, void 0, false, {
                                        fileName: "[project]/features/complaints/complaint-card.tsx",
                                        lineNumber: 64,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "truncate",
                                        children: complaint.orderCode
                                    }, void 0, false, {
                                        fileName: "[project]/features/complaints/complaint-card.tsx",
                                        lineNumber: 65,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/complaints/complaint-card.tsx",
                                lineNumber: 63,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/complaints/complaint-card.tsx",
                        lineNumber: 56,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col items-end gap-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$StatusBadge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StatusBadge"], {
                                status: complaint.status,
                                statusMap: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$StatusBadge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COMPLAINT_STATUS_MAP"]
                            }, void 0, false, {
                                fileName: "[project]/features/complaints/complaint-card.tsx",
                                lineNumber: 70,
                                columnNumber: 11
                            }, this),
                            isOverdue && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                variant: "outline",
                                className: "text-body-xs bg-red-100 text-red-800 whitespace-nowrap",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                        className: "h-3 w-3 mr-1"
                                    }, void 0, false, {
                                        fileName: "[project]/features/complaints/complaint-card.tsx",
                                        lineNumber: 74,
                                        columnNumber: 15
                                    }, this),
                                    "Quá hạn"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/complaints/complaint-card.tsx",
                                lineNumber: 73,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                variant: "outline",
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-body-xs", priorityConfig[complaint.priority].color, "whitespace-nowrap"),
                                children: priorityConfig[complaint.priority].label
                            }, void 0, false, {
                                fileName: "[project]/features/complaints/complaint-card.tsx",
                                lineNumber: 79,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/complaints/complaint-card.tsx",
                        lineNumber: 69,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/complaints/complaint-card.tsx",
                lineNumber: 55,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-2 mb-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 text-body-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                className: "h-3.5 w-3.5 text-muted-foreground shrink-0"
                            }, void 0, false, {
                                fileName: "[project]/features/complaints/complaint-card.tsx",
                                lineNumber: 91,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-medium truncate",
                                children: complaint.customerName
                            }, void 0, false, {
                                fileName: "[project]/features/complaints/complaint-card.tsx",
                                lineNumber: 92,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/complaints/complaint-card.tsx",
                        lineNumber: 90,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 text-body-sm text-muted-foreground",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__["Phone"], {
                                className: "h-3.5 w-3.5 shrink-0"
                            }, void 0, false, {
                                fileName: "[project]/features/complaints/complaint-card.tsx",
                                lineNumber: 95,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: complaint.customerPhone
                            }, void 0, false, {
                                fileName: "[project]/features/complaints/complaint-card.tsx",
                                lineNumber: 96,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/complaints/complaint-card.tsx",
                        lineNumber: 94,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/complaints/complaint-card.tsx",
                lineNumber: 89,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-body-sm text-muted-foreground line-clamp-2 mb-3",
                children: complaint.description
            }, void 0, false, {
                fileName: "[project]/features/complaints/complaint-card.tsx",
                lineNumber: 101,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between text-body-xs text-muted-foreground pt-3 border-t",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                className: "h-3.5 w-3.5"
                            }, void 0, false, {
                                fileName: "[project]/features/complaints/complaint-card.tsx",
                                lineNumber: 108,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(complaint.createdAt)
                            }, void 0, false, {
                                fileName: "[project]/features/complaints/complaint-card.tsx",
                                lineNumber: 109,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/complaints/complaint-card.tsx",
                        lineNumber: 107,
                        columnNumber: 9
                    }, this),
                    assignedEmployee ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                className: "h-3.5 w-3.5"
                            }, void 0, false, {
                                fileName: "[project]/features/complaints/complaint-card.tsx",
                                lineNumber: 114,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "truncate max-w-[120px]",
                                children: assignedEmployee.fullName
                            }, void 0, false, {
                                fileName: "[project]/features/complaints/complaint-card.tsx",
                                lineNumber: 115,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/complaints/complaint-card.tsx",
                        lineNumber: 113,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-muted-foreground",
                        children: "Chưa phân công"
                    }, void 0, false, {
                        fileName: "[project]/features/complaints/complaint-card.tsx",
                        lineNumber: 118,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/complaints/complaint-card.tsx",
                lineNumber: 106,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/complaints/complaint-card.tsx",
        lineNumber: 42,
        columnNumber: 5
    }, this);
}
}),
"[project]/features/complaints/complaint-card-context-menu.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComplaintCardContextMenu",
    ()=>ComplaintCardContextMenu
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$context$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/context-menu.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$tracking$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/complaints/tracking-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-ssr] (ecmascript)");
;
;
;
;
function ComplaintCardContextMenu({ complaint, onEdit, onGetLink, onStartInvestigation, onFinish, onOpen, onReject, onRemind, children }) {
    const { status } = complaint;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$context$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ContextMenu"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$context$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ContextMenuTrigger"], {
                asChild: true,
                children: children
            }, void 0, false, {
                fileName: "[project]/features/complaints/complaint-card-context-menu.tsx",
                lineNumber: 43,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$context$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ContextMenuContent"], {
                className: "w-56",
                children: [
                    status === 'pending' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$context$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ContextMenuItem"], {
                                onSelect: ()=>onEdit(complaint.systemId),
                                children: "Sửa thông tin"
                            }, void 0, false, {
                                fileName: "[project]/features/complaints/complaint-card-context-menu.tsx",
                                lineNumber: 50,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$context$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ContextMenuItem"], {
                                onSelect: ()=>onStartInvestigation(complaint.systemId),
                                children: "Bắt đầu xử lý"
                            }, void 0, false, {
                                fileName: "[project]/features/complaints/complaint-card-context-menu.tsx",
                                lineNumber: 53,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$context$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ContextMenuItem"], {
                                onSelect: ()=>{
                                    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$tracking$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isTrackingEnabled"])()) {
                                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Chức năng tracking chưa được bật. Vui lòng bật trong Cài đặt.');
                                        return;
                                    }
                                    onGetLink(complaint.systemId);
                                },
                                children: "Copy link tracking"
                            }, void 0, false, {
                                fileName: "[project]/features/complaints/complaint-card-context-menu.tsx",
                                lineNumber: 56,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$context$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ContextMenuItem"], {
                                onSelect: ()=>onRemind(complaint.systemId),
                                children: "Gửi thông báo nhắc nhở"
                            }, void 0, false, {
                                fileName: "[project]/features/complaints/complaint-card-context-menu.tsx",
                                lineNumber: 67,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$context$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ContextMenuSeparator"], {}, void 0, false, {
                                fileName: "[project]/features/complaints/complaint-card-context-menu.tsx",
                                lineNumber: 70,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$context$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ContextMenuItem"], {
                                onSelect: ()=>onFinish(complaint.systemId),
                                children: "Kết thúc"
                            }, void 0, false, {
                                fileName: "[project]/features/complaints/complaint-card-context-menu.tsx",
                                lineNumber: 71,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$context$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ContextMenuItem"], {
                                onSelect: ()=>onReject(complaint.systemId),
                                className: "text-destructive focus:text-destructive",
                                children: "Hủy khiếu nại"
                            }, void 0, false, {
                                fileName: "[project]/features/complaints/complaint-card-context-menu.tsx",
                                lineNumber: 74,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true),
                    status === 'investigating' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$context$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ContextMenuItem"], {
                                onSelect: ()=>onEdit(complaint.systemId),
                                children: "Sửa thông tin"
                            }, void 0, false, {
                                fileName: "[project]/features/complaints/complaint-card-context-menu.tsx",
                                lineNumber: 86,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$context$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ContextMenuItem"], {
                                onSelect: ()=>onFinish(complaint.systemId),
                                children: "Hoàn thành"
                            }, void 0, false, {
                                fileName: "[project]/features/complaints/complaint-card-context-menu.tsx",
                                lineNumber: 89,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$context$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ContextMenuItem"], {
                                onSelect: ()=>{
                                    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$tracking$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isTrackingEnabled"])()) {
                                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Chức năng tracking chưa được bật. Vui lòng bật trong Cài đặt.');
                                        return;
                                    }
                                    onGetLink(complaint.systemId);
                                },
                                children: "Copy link tracking"
                            }, void 0, false, {
                                fileName: "[project]/features/complaints/complaint-card-context-menu.tsx",
                                lineNumber: 92,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$context$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ContextMenuItem"], {
                                onSelect: ()=>onRemind(complaint.systemId),
                                children: "Gửi thông báo nhắc nhở"
                            }, void 0, false, {
                                fileName: "[project]/features/complaints/complaint-card-context-menu.tsx",
                                lineNumber: 103,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$context$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ContextMenuSeparator"], {}, void 0, false, {
                                fileName: "[project]/features/complaints/complaint-card-context-menu.tsx",
                                lineNumber: 106,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$context$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ContextMenuItem"], {
                                onSelect: ()=>onReject(complaint.systemId),
                                className: "text-destructive focus:text-destructive",
                                children: "Từ chối khiếu nại"
                            }, void 0, false, {
                                fileName: "[project]/features/complaints/complaint-card-context-menu.tsx",
                                lineNumber: 107,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true),
                    status === 'resolved' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$context$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ContextMenuItem"], {
                                onSelect: ()=>{
                                    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$tracking$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isTrackingEnabled"])()) {
                                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Chức năng tracking chưa được bật. Vui lòng bật trong Cài đặt.');
                                        return;
                                    }
                                    onGetLink(complaint.systemId);
                                },
                                children: "Copy link tracking"
                            }, void 0, false, {
                                fileName: "[project]/features/complaints/complaint-card-context-menu.tsx",
                                lineNumber: 119,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$context$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ContextMenuItem"], {
                                onSelect: ()=>onOpen(complaint.systemId),
                                children: "Mở lại"
                            }, void 0, false, {
                                fileName: "[project]/features/complaints/complaint-card-context-menu.tsx",
                                lineNumber: 130,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true),
                    status === 'cancelled' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$context$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ContextMenuItem"], {
                                onSelect: ()=>{
                                    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$tracking$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isTrackingEnabled"])()) {
                                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Chức năng tracking chưa được bật. Vui lòng bật trong Cài đặt.');
                                        return;
                                    }
                                    onGetLink(complaint.systemId);
                                },
                                children: "Copy link tracking"
                            }, void 0, false, {
                                fileName: "[project]/features/complaints/complaint-card-context-menu.tsx",
                                lineNumber: 139,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$context$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ContextMenuItem"], {
                                onSelect: ()=>onOpen(complaint.systemId),
                                children: "Mở lại"
                            }, void 0, false, {
                                fileName: "[project]/features/complaints/complaint-card-context-menu.tsx",
                                lineNumber: 150,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true)
                ]
            }, void 0, true, {
                fileName: "[project]/features/complaints/complaint-card-context-menu.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/complaints/complaint-card-context-menu.tsx",
        lineNumber: 42,
        columnNumber: 5
    }, this);
}
}),
"[project]/features/settings/use-settings-page-header.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useSettingsPageHeader",
    ()=>useSettingsPageHeader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings-2.js [app-ssr] (ecmascript) <export default as Settings2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$page$2d$header$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/page-header-context.tsx [app-ssr] (ecmascript)");
;
;
;
;
;
const defaultDocLabel = 'Xem hướng dẫn';
const baseBreadcrumb = [
    {
        label: 'Trang chủ',
        href: '/',
        isCurrent: false
    },
    {
        label: 'Cài đặt',
        href: '/settings',
        isCurrent: false
    }
];
const normalizeLabel = (label)=>label?.trim().toLocaleLowerCase('vi');
const isHomeCrumb = (item)=>item.href === '/' || normalizeLabel(item.label) === 'trang chủ';
const isSettingsCrumb = (item)=>item.href === '/settings' || normalizeLabel(item.label) === 'cài đặt';
function useSettingsPageHeader(options) {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const { title, icon, docLink, breadcrumb, ...rest } = options;
    const normalizedDocLink = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        if (!docLink) return undefined;
        if (typeof docLink === 'string') {
            return {
                href: docLink,
                label: defaultDocLabel
            };
        }
        return {
            href: docLink.href,
            label: docLink.label ?? defaultDocLabel
        };
    }, [
        docLink
    ]);
    const decoratedTitle = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "inline-flex items-center gap-2",
            children: [
                icon ?? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings2$3e$__["Settings2"], {
                    className: "h-5 w-5 text-muted-foreground",
                    "aria-hidden": "true"
                }, void 0, false, {
                    fileName: "[project]/features/settings/use-settings-page-header.tsx",
                    lineNumber: 40,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    children: title
                }, void 0, false, {
                    fileName: "[project]/features/settings/use-settings-page-header.tsx",
                    lineNumber: 41,
                    columnNumber: 7
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/features/settings/use-settings-page-header.tsx",
            lineNumber: 39,
            columnNumber: 5
        }, this), [
        icon,
        title
    ]);
    const normalizedBreadcrumb = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        const custom = (breadcrumb ?? []).map((item)=>({
                ...item,
                href: item.href || pathname
            }));
        let merged = custom.length ? [
            ...custom
        ] : [
            {
                label: title,
                href: pathname,
                isCurrent: true
            }
        ];
        if (!merged.some(isHomeCrumb)) {
            merged = [
                {
                    ...baseBreadcrumb[0]
                },
                ...merged
            ];
        }
        if (!merged.some(isSettingsCrumb)) {
            const homeIndex = merged.findIndex(isHomeCrumb);
            const insertionIndex = homeIndex >= 0 ? homeIndex + 1 : 0;
            merged = [
                ...merged.slice(0, insertionIndex),
                {
                    ...baseBreadcrumb[1]
                },
                ...merged.slice(insertionIndex)
            ];
        }
        return merged.map((item, index)=>({
                ...item,
                isCurrent: index === merged.length - 1
            }));
    }, [
        breadcrumb,
        pathname,
        title
    ]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$page$2d$header$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePageHeader"])({
        ...rest,
        breadcrumb: normalizedBreadcrumb,
        title: decoratedTitle,
        docLink: normalizedDocLink
    });
}
}),
"[project]/features/settings/settings-config-store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createSettingsConfigStore",
    ()=>createSettingsConfigStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
;
// API sync helper
async function syncSettingsToAPI(apiEndpoint, data) {
    if (!apiEndpoint) return true;
    try {
        const response = await fetch(apiEndpoint, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(data)
        });
        return response.ok;
    } catch (error) {
        console.error(`[Settings Config API] sync error for ${apiEndpoint}:`, error);
        return false;
    }
}
function createSettingsConfigStore({ storageKey, getDefaultState, apiEndpoint }) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((set, get)=>({
            data: getDefaultState(),
            initialized: false,
            setSection: (key, value)=>{
                const current = get().data;
                const nextValue = typeof value === 'function' ? value(current[key]) : value;
                const newData = {
                    ...current,
                    [key]: nextValue
                };
                set({
                    data: newData
                });
                // Sync to API in background
                syncSettingsToAPI(apiEndpoint, newData).catch(console.error);
            },
            setData: (updater)=>{
                const newData = updater(get().data);
                set({
                    data: newData
                });
                // Sync to API in background
                syncSettingsToAPI(apiEndpoint, newData).catch(console.error);
            },
            resetSection: (key)=>{
                const defaults = getDefaultState();
                const newData = {
                    ...get().data,
                    [key]: defaults[key]
                };
                set({
                    data: newData
                });
                // Sync to API in background
                syncSettingsToAPI(apiEndpoint, newData).catch(console.error);
            },
            resetAll: ()=>{
                const defaults = getDefaultState();
                set({
                    data: defaults
                });
                // Sync to API in background
                syncSettingsToAPI(apiEndpoint, defaults).catch(console.error);
            },
            loadFromAPI: async ()=>{
                if (!apiEndpoint) return;
                if (get().initialized) return;
                try {
                    const response = await fetch(apiEndpoint, {
                        credentials: 'include'
                    });
                    if (response.ok) {
                        const json = await response.json();
                        const data = json.data || json;
                        if (data && Object.keys(data).length > 0) {
                            set({
                                data: {
                                    ...getDefaultState(),
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
                    console.error(`[Settings Config Store] loadFromAPI error for ${apiEndpoint}:`, error);
                }
            }
        }));
}
}),
"[project]/features/settings/use-tab-action-registry.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useTabActionRegistry",
    ()=>useTabActionRegistry
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
function useTabActionRegistry(activeTab) {
    const [headerActions, setHeaderActions] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]([]);
    const registerActions = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((tabValue)=>(actions)=>{
            if (tabValue === activeTab) {
                setHeaderActions(actions ?? []);
            }
        }, [
        activeTab
    ]);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        setHeaderActions([]);
    }, [
        activeTab
    ]);
    return {
        headerActions,
        registerActions,
        setHeaderActions
    };
}
}),
"[project]/features/settings/complaints/complaints-settings-page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComplaintsSettingsPage",
    ()=>ComplaintsSettingsPage,
    "loadCardColorSettings",
    ()=>loadCardColorSettings,
    "loadComplaintTypes",
    ()=>loadComplaintTypes
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/tabs.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/label.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/input.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$forms$2f$SettingsFormGrid$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/settings/forms/SettingsFormGrid.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$forms$2f$SettingsFormSection$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/settings/forms/SettingsFormSection.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$switch$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/switch.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/textarea.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tailwind$2d$color$2d$picker$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/tailwind-color-picker.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$SettingsActionButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/settings/SettingsActionButton.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$SettingsVerticalTabs$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/settings/SettingsVerticalTabs.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/select.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/table.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-ssr] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bell.js [app-ssr] (ecmascript) <export default as Bell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-ssr] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis.js [app-ssr] (ecmascript) <export default as MoreHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-ssr] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/save.js [app-ssr] (ecmascript) <export default as Save>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dialog.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dropdown-menu.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$confirm$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/confirm-dialog.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$use$2d$settings$2d$page$2d$header$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/use-settings-page-header.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$settings$2d$config$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/settings-config-store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$use$2d$tab$2d$action$2d$registry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/use-tab-action-registry.ts [app-ssr] (ecmascript)");
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
// ============================================
// DEFAULT VALUES
// ============================================
const defaultSLA = {
    low: {
        responseTime: 240,
        resolveTime: 48
    },
    medium: {
        responseTime: 120,
        resolveTime: 24
    },
    high: {
        responseTime: 60,
        resolveTime: 12
    },
    urgent: {
        responseTime: 30,
        resolveTime: 4
    }
};
const defaultReminders = {
    enabled: true,
    firstReminderHours: 4,
    secondReminderHours: 8,
    escalationHours: 24
};
const defaultNotifications = {
    emailOnCreate: true,
    emailOnAssign: true,
    emailOnVerified: false,
    emailOnResolved: true,
    emailOnOverdue: true,
    smsOnOverdue: false,
    inAppNotifications: true
};
const defaultPublicTracking = {
    enabled: false,
    allowCustomerComments: false,
    showEmployeeName: true,
    showTimeline: true
};
const defaultCardColors = {
    statusColors: {
        pending: 'bg-yellow-50 border-yellow-200',
        investigating: 'bg-blue-50 border-blue-200',
        resolved: 'bg-green-50 border-green-200',
        rejected: 'bg-gray-50 border-gray-200'
    },
    priorityColors: {
        low: 'bg-slate-50 border-slate-200',
        medium: 'bg-amber-50 border-amber-200',
        high: 'bg-orange-50 border-orange-300',
        urgent: 'bg-red-100 border-red-300'
    },
    overdueColor: 'bg-red-50 border-red-400',
    enableStatusColors: false,
    enablePriorityColors: true,
    enableOverdueColor: true
};
const defaultComplaintTypes = [
    {
        id: '1',
        name: 'Sản phẩm lỗi',
        description: 'Sản phẩm có lỗi kỹ thuật hoặc hỏng hóc',
        order: 1,
        isActive: true
    },
    {
        id: '2',
        name: 'Giao hàng chậm',
        description: 'Đơn hàng giao chậm so với thời gian cam kết',
        order: 2,
        isActive: true
    },
    {
        id: '3',
        name: 'Sai sản phẩm',
        description: 'Giao sai sản phẩm so với đơn hàng',
        order: 3,
        isActive: true
    },
    {
        id: '4',
        name: 'Dịch vụ chăm sóc',
        description: 'Khiếu nại về thái độ hoặc dịch vụ nhân viên',
        order: 4,
        isActive: true
    },
    {
        id: '5',
        name: 'Khác',
        description: 'Các loại khiếu nại khác',
        order: 5,
        isActive: true
    }
];
const SLA_PRIORITY_CONFIGS = [
    {
        key: 'low',
        label: 'Ưu tiên thấp',
        description: 'Ví dụ: các lỗi nhỏ hoặc yêu cầu tham khảo thông tin',
        indicatorClass: 'bg-green-500'
    },
    {
        key: 'medium',
        label: 'Ưu tiên trung bình',
        description: 'Ảnh hưởng vừa phải tới khách hàng, cần theo dõi trong ngày',
        indicatorClass: 'bg-yellow-500'
    },
    {
        key: 'high',
        label: 'Ưu tiên cao',
        description: 'Các vấn đề ảnh hưởng trực tiếp đến trải nghiệm khách hàng',
        indicatorClass: 'bg-orange-500'
    },
    {
        key: 'urgent',
        label: 'Ưu tiên khẩn cấp',
        description: 'Khiếu nại nghiêm trọng cần phản hồi ngay (ví dụ sự cố truyền thông)',
        indicatorClass: 'bg-red-500'
    }
];
const defaultTemplates = [
    {
        id: '1',
        name: 'Xin lỗi - Lỗi sản phẩm',
        content: 'Kính chào Anh/Chị,\n\nChúng tôi xin chân thành xin lỗi về sản phẩm bị lỗi mà Anh/Chị đã nhận được. Đây là sự cố đáng tiếc và chúng tôi hiểu sự bất tiện mà điều này gây ra.\n\nChúng tôi đang xử lý khiếu nại của Anh/Chị và sẽ sớm có phương án giải quyết hợp lý nhất.\n\nTrân trọng,',
        category: 'product-defect',
        order: 1
    },
    {
        id: '2',
        name: 'Xin lỗi - Giao hàng chậm',
        content: 'Kính chào Anh/Chị,\n\nChúng tôi xin lỗi vì đơn hàng của Anh/Chị đã bị giao chậm hơn so với dự kiến. Chúng tôi đã liên hệ với đơn vị vận chuyển để làm rõ nguyên nhân.\n\nChúng tôi sẽ có phương án bù trừ hợp lý cho sự chậm trễ này.\n\nTrân trọng,',
        category: 'shipping-delay',
        order: 2
    },
    {
        id: '3',
        name: 'Xác nhận đang xử lý',
        content: 'Kính chào Anh/Chị,\n\nChúng tôi đã nhận được khiếu nại của Anh/Chị và đang tiến hành xác minh thông tin.\n\nChúng tôi sẽ phản hồi lại trong thời gian sớm nhất. Xin Anh/Chị vui lòng theo dõi.\n\nTrân trọng,',
        category: 'general',
        order: 3
    }
];
const clone = (value)=>{
    if (typeof structuredClone === 'function') {
        return structuredClone(value);
    }
    return JSON.parse(JSON.stringify(value));
};
const createDefaultComplaintsSettings = ()=>({
        sla: clone(defaultSLA),
        templates: clone(defaultTemplates),
        notifications: clone(defaultNotifications),
        publicTracking: clone(defaultPublicTracking),
        reminders: clone(defaultReminders),
        cardColors: clone(defaultCardColors),
        complaintTypes: clone(defaultComplaintTypes)
    });
const useComplaintsSettingsStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$settings$2d$config$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createSettingsConfigStore"])({
    storageKey: 'settings-complaints',
    getDefaultState: createDefaultComplaintsSettings
});
// Validation helper for Tailwind classes
function validateTailwindClasses(value) {
    if (!value || !value.trim()) return false;
    // Pattern: bg-color-shade or border-color-shade, can have multiple classes
    const tailwindPattern = /^(bg|border|text|shadow|ring)-[\w-]+(\/\d+)?(\s+(bg|border|text|shadow|ring)-[\w-]+(\/\d+)?)*$/;
    return tailwindPattern.test(value.trim());
}
function loadCardColorSettings() {
    return clone(useComplaintsSettingsStore.getState().data.cardColors);
}
function loadComplaintTypes() {
    return clone(useComplaintsSettingsStore.getState().data.complaintTypes);
}
function ComplaintsSettingsPage() {
    const [activeTab, setActiveTab] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]('sla');
    const { headerActions, registerActions } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$use$2d$tab$2d$action$2d$registry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTabActionRegistry"])(activeTab);
    const registerSlaActions = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>registerActions('sla'), [
        registerActions
    ]);
    const registerComplaintTypeActions = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>registerActions('complaint-types'), [
        registerActions
    ]);
    const registerCardColorActions = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>registerActions('card-colors'), [
        registerActions
    ]);
    const registerTemplateActions = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>registerActions('templates'), [
        registerActions
    ]);
    const registerNotificationActions = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>registerActions('notifications'), [
        registerActions
    ]);
    const registerPublicTrackingActions = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>registerActions('public-tracking'), [
        registerActions
    ]);
    const storedSla = useComplaintsSettingsStore((state)=>state.data.sla);
    const storedTemplates = useComplaintsSettingsStore((state)=>state.data.templates);
    const storedNotifications = useComplaintsSettingsStore((state)=>state.data.notifications);
    const storedPublicTracking = useComplaintsSettingsStore((state)=>state.data.publicTracking);
    const storedReminders = useComplaintsSettingsStore((state)=>state.data.reminders);
    const storedCardColors = useComplaintsSettingsStore((state)=>state.data.cardColors);
    const storedComplaintTypes = useComplaintsSettingsStore((state)=>state.data.complaintTypes);
    const setStoreSection = useComplaintsSettingsStore((state)=>state.setSection);
    // SLA State
    const [sla, setSLA] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](storedSla);
    // Templates State
    const [templates, setTemplates] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](storedTemplates);
    const [editingTemplate, setEditingTemplate] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](null);
    const [isAddingTemplate, setIsAddingTemplate] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](false);
    // Notifications State
    const [notifications, setNotifications] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](storedNotifications);
    // Public Tracking State
    const [publicTracking, setPublicTracking] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](storedPublicTracking);
    // Reminders State
    const [reminders, setReminders] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](storedReminders);
    // Card Colors State
    const [cardColors, setCardColors] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](storedCardColors);
    // Complaint Types State
    const [complaintTypes, setComplaintTypes] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](storedComplaintTypes);
    const [editingType, setEditingType] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](null);
    const [isAddingType, setIsAddingType] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](false);
    const [typeDialogOpen, setTypeDialogOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](false);
    const [deleteTypeId, setDeleteTypeId] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](null);
    // Template Dialog State
    const [templateDialogOpen, setTemplateDialogOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](false);
    const [deleteTemplateId, setDeleteTemplateId] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](null);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        setSLA(storedSla);
    }, [
        storedSla
    ]);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        setTemplates(storedTemplates);
    }, [
        storedTemplates
    ]);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        setNotifications(storedNotifications);
    }, [
        storedNotifications
    ]);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        setPublicTracking(storedPublicTracking);
    }, [
        storedPublicTracking
    ]);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        setReminders(storedReminders);
    }, [
        storedReminders
    ]);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        setCardColors(storedCardColors);
    }, [
        storedCardColors
    ]);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        setComplaintTypes(storedComplaintTypes);
    }, [
        storedComplaintTypes
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$use$2d$settings$2d$page$2d$header$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSettingsPageHeader"])({
        title: 'Cài đặt khiếu nại',
        subtitle: 'Thiết lập SLA, tự động hóa và template phản hồi khiếu nại',
        actions: headerActions
    });
    // ============================================
    // SLA HANDLERS
    // ============================================
    const handleSLAChange = (priority, field, value)=>{
        const numValue = parseInt(value) || 0;
        setSLA((prev)=>({
                ...prev,
                [priority]: {
                    ...prev[priority],
                    [field]: numValue
                }
            }));
    };
    const handleSaveSLA = ()=>{
        // Validation for each priority level
        const priorities = [
            'low',
            'medium',
            'high',
            'urgent'
        ];
        const errors = [];
        priorities.forEach((priority)=>{
            const settings = sla[priority];
            const priorityLabel = {
                low: 'Thấp',
                medium: 'Trung bình',
                high: 'Cao',
                urgent: 'Khẩn cấp'
            }[priority];
            if (settings.responseTime <= 0) {
                errors.push(`Thời gian phản hồi của mức độ ${priorityLabel} phải lớn hơn 0`);
            }
            if (settings.resolveTime <= 0) {
                errors.push(`Thời gian giải quyết của mức độ ${priorityLabel} phải lớn hơn 0`);
            }
            // Convert response time from minutes to hours for comparison
            const responseHours = settings.responseTime / 60;
            if (settings.resolveTime <= responseHours) {
                errors.push(`Thời gian giải quyết của mức độ ${priorityLabel} phải lớn hơn thời gian phản hồi`);
            }
        });
        if (errors.length > 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Lỗi xác thực', {
                description: errors.join('\n')
            });
            return;
        }
        setStoreSection('sla', sla);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success('Đã lưu cài đặt SLA', {
            description: 'Thời gian phản hồi và giải quyết đã được cập nhật thành công.'
        });
    };
    const handleResetSLA = ()=>{
        const nextDefaults = clone(defaultSLA);
        setSLA(nextDefaults);
        setStoreSection('sla', nextDefaults);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].info('Đã khôi phục cài đặt mặc định', {
            description: 'Cài đặt SLA đã được reset về giá trị mặc định của hệ thống.'
        });
    };
    // ============================================
    // TEMPLATE HANDLERS
    // ============================================
    const handleAddTemplate = ()=>{
        setEditingTemplate({
            id: Date.now().toString(),
            name: '',
            content: '',
            category: 'general',
            order: templates.length + 1
        });
        setIsAddingTemplate(true);
        setTemplateDialogOpen(true);
    };
    const handleEditTemplate = (template)=>{
        setEditingTemplate({
            ...template
        });
        setIsAddingTemplate(false);
        setTemplateDialogOpen(true);
    };
    const handleSaveTemplate = ()=>{
        if (!editingTemplate) return;
        if (!editingTemplate.name.trim() || !editingTemplate.content.trim()) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Lỗi xác thực', {
                description: 'Vui lòng điền đầy đủ tên và nội dung mẫu.'
            });
            return;
        }
        let updatedTemplates;
        if (isAddingTemplate) {
            updatedTemplates = [
                ...templates,
                editingTemplate
            ];
        } else {
            updatedTemplates = templates.map((t)=>t.id === editingTemplate.id ? editingTemplate : t);
        }
        setTemplates(updatedTemplates);
        setStoreSection('templates', updatedTemplates);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success(isAddingTemplate ? 'Đã thêm mẫu' : 'Đã cập nhật mẫu', {
            description: `Mẫu "${editingTemplate.name}" đã được lưu thành công.`
        });
        setEditingTemplate(null);
        setIsAddingTemplate(false);
        setTemplateDialogOpen(false);
    };
    const handleConfirmDeleteTemplate = ()=>{
        if (!deleteTemplateId) return;
        const updatedTemplates = templates.filter((t)=>t.id !== deleteTemplateId);
        setTemplates(updatedTemplates);
        setStoreSection('templates', updatedTemplates);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success('Đã xóa mẫu', {
            description: 'Mẫu phản hồi đã được xóa thành công.'
        });
        setDeleteTemplateId(null);
    };
    const handleResetTemplates = ()=>{
        const defaults = clone(defaultTemplates);
        setTemplates(defaults);
        setStoreSection('templates', defaults);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].info('Đã khôi phục mẫu mặc định', {
            description: 'Tất cả mẫu phản hồi đã được reset về giá trị mặc định của hệ thống.'
        });
    };
    const handleCancelEdit = ()=>{
        setEditingTemplate(null);
        setIsAddingTemplate(false);
        setTemplateDialogOpen(false);
    };
    // ============================================
    // NOTIFICATION HANDLERS
    // ============================================
    const handleNotificationChange = (key)=>{
        setNotifications((prev)=>({
                ...prev,
                [key]: !prev[key]
            }));
    };
    const handleSaveNotifications = ()=>{
        setStoreSection('notifications', notifications);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success('Đã lưu cài đặt thông báo', {
            description: 'Các tùy chọn thông báo đã được cập nhật thành công.'
        });
    };
    const handleResetNotifications = ()=>{
        const defaults = clone(defaultNotifications);
        setNotifications(defaults);
        setStoreSection('notifications', defaults);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].info('Đã khôi phục cài đặt mặc định', {
            description: 'Cài đặt thông báo đã được reset về giá trị mặc định của hệ thống.'
        });
    };
    // ============================================
    // PUBLIC TRACKING HANDLERS
    // ============================================
    const handlePublicTrackingChange = (key)=>{
        setPublicTracking((prev)=>({
                ...prev,
                [key]: !prev[key]
            }));
    };
    const handleSavePublicTracking = ()=>{
        setStoreSection('publicTracking', publicTracking);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success('Đã lưu cài đặt tracking công khai', {
            description: 'Các tùy chọn liên kết công khai đã được cập nhật thành công.'
        });
    };
    const handleResetPublicTracking = ()=>{
        const defaults = clone(defaultPublicTracking);
        setPublicTracking(defaults);
        setStoreSection('publicTracking', defaults);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].info('Đã khôi phục cài đặt mặc định', {
            description: 'Cài đặt tracking công khai đã được reset về giá trị mặc định của hệ thống.'
        });
    };
    // ============================================
    // REMINDERS HANDLERS
    // ============================================
    const handleReminderChange = (field, value)=>{
        setReminders((prev)=>({
                ...prev,
                [field]: value
            }));
    };
    const handleSaveReminders = ()=>{
        setStoreSection('reminders', reminders);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success('Đã lưu cài đặt nhắc nhở', {
            description: 'Các tùy chọn nhắc nhở khiếu nại đã được cập nhật thành công.'
        });
    };
    const handleResetReminders = ()=>{
        const defaults = clone(defaultReminders);
        setReminders(defaults);
        setStoreSection('reminders', defaults);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].info('Đã khôi phục cài đặt mặc định', {
            description: 'Cài đặt nhắc nhở đã được reset về giá trị mặc định của hệ thống.'
        });
    };
    // ============================================
    // CARD COLORS HANDLERS
    // ============================================
    const handleCardColorToggle = (key)=>{
        setCardColors((prev)=>({
                ...prev,
                [key]: !prev[key]
            }));
    };
    const handleStatusColorChange = (status, value)=>{
        setCardColors((prev)=>({
                ...prev,
                statusColors: {
                    ...prev.statusColors,
                    [status]: value
                }
            }));
    };
    const handlePriorityColorChange = (priority, value)=>{
        setCardColors((prev)=>({
                ...prev,
                priorityColors: {
                    ...prev.priorityColors,
                    [priority]: value
                }
            }));
    };
    const handleOverdueColorChange = (value)=>{
        setCardColors((prev)=>({
                ...prev,
                overdueColor: value
            }));
    };
    const handleSaveCardColors = ()=>{
        // Validate all enabled color settings
        const errors = [];
        if (cardColors.enableOverdueColor) {
            if (!cardColors.overdueColor.trim()) {
                errors.push('Màu quá hạn không được để trống');
            } else if (!validateTailwindClasses(cardColors.overdueColor)) {
                errors.push('Màu quá hạn không đúng định dạng Tailwind (ví dụ: bg-red-50 border-red-400)');
            }
        }
        if (cardColors.enablePriorityColors) {
            const priorities = [
                {
                    key: 'low',
                    label: 'Thấp'
                },
                {
                    key: 'medium',
                    label: 'Trung bình'
                },
                {
                    key: 'high',
                    label: 'Cao'
                },
                {
                    key: 'urgent',
                    label: 'Khẩn cấp'
                }
            ];
            priorities.forEach(({ key, label })=>{
                const value = cardColors.priorityColors[key];
                if (!value.trim()) {
                    errors.push(`Màu mức độ ${label} không được để trống`);
                } else if (!validateTailwindClasses(value)) {
                    errors.push(`Màu mức độ ${label} không đúng định dạng Tailwind`);
                }
            });
        }
        if (cardColors.enableStatusColors) {
            const statuses = [
                {
                    key: 'pending',
                    label: 'Chờ xử lý'
                },
                {
                    key: 'investigating',
                    label: 'Đang xử lý'
                },
                {
                    key: 'resolved',
                    label: 'Đã giải quyết'
                },
                {
                    key: 'rejected',
                    label: 'Từ chối'
                }
            ];
            statuses.forEach(({ key, label })=>{
                const value = cardColors.statusColors[key];
                if (!value.trim()) {
                    errors.push(`Màu trạng thái ${label} không được để trống`);
                } else if (!validateTailwindClasses(value)) {
                    errors.push(`Màu trạng thái ${label} không đúng định dạng Tailwind`);
                }
            });
        }
        if (errors.length > 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Lỗi xác thực', {
                description: errors.join('\n')
            });
            return;
        }
        setStoreSection('cardColors', cardColors);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success('Đã lưu cài đặt màu card', {
            description: 'Màu sắc hiển thị card đã được cập nhật thành công.'
        });
    };
    const handleResetCardColors = ()=>{
        const defaults = clone(defaultCardColors);
        setCardColors(defaults);
        setStoreSection('cardColors', defaults);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].info('Đã khôi phục cài đặt mặc định', {
            description: 'Màu card đã được reset về giá trị mặc định của hệ thống.'
        });
    };
    // ============================================
    // COMPLAINT TYPES HANDLERS
    // ============================================
    const handleAddType = ()=>{
        const newType = {
            id: Date.now().toString(),
            name: '',
            description: '',
            order: complaintTypes.length + 1,
            isActive: true
        };
        setEditingType(newType);
        setIsAddingType(true);
        setTypeDialogOpen(true);
    };
    const handleEditType = (type)=>{
        setEditingType({
            ...type
        });
        setIsAddingType(false);
        setTypeDialogOpen(true);
    };
    const handleSaveType = ()=>{
        if (!editingType) return;
        if (!editingType.name.trim()) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Tên loại khiếu nại không được để trống');
            return;
        }
        const nextTypes = isAddingType ? [
            ...complaintTypes,
            editingType
        ] : complaintTypes.map((t)=>t.id === editingType.id ? editingType : t);
        setComplaintTypes(nextTypes);
        setStoreSection('complaintTypes', nextTypes);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success(isAddingType ? 'Đã thêm loại khiếu nại mới' : 'Đã cập nhật loại khiếu nại');
        setEditingType(null);
        setIsAddingType(false);
        setTypeDialogOpen(false);
    };
    const handleConfirmDeleteType = ()=>{
        if (!deleteTypeId) return;
        const updated = complaintTypes.filter((t)=>t.id !== deleteTypeId);
        setComplaintTypes(updated);
        setStoreSection('complaintTypes', updated);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success('Đã xóa loại khiếu nại');
        setDeleteTypeId(null);
    };
    const handleToggleTypeActive = (id)=>{
        const updated = complaintTypes.map((t)=>t.id === id ? {
                ...t,
                isActive: !t.isActive
            } : t);
        setComplaintTypes(updated);
        setStoreSection('complaintTypes', updated);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success('Đã cập nhật trạng thái');
    };
    const handleResetTypes = ()=>{
        const defaults = clone(defaultComplaintTypes);
        setComplaintTypes(defaults);
        setStoreSection('complaintTypes', defaults);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].info('Đã khôi phục cài đặt mặc định');
    };
    // ============================================
    // RENDER
    // ============================================
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        if (activeTab !== 'sla') {
            return;
        }
        registerSlaActions([
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$SettingsActionButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SettingsActionButton"], {
                onClick: handleSaveSLA,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__["Save"], {
                        className: "h-4 w-4"
                    }, void 0, false, {
                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                        lineNumber: 814,
                        columnNumber: 11
                    }, this),
                    " Lưu cài đặt"
                ]
            }, "save", true, {
                fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                lineNumber: 813,
                columnNumber: 9
            }, this)
        ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        activeTab,
        registerSlaActions
    ]);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        if (activeTab !== 'complaint-types') {
            return;
        }
        registerComplaintTypeActions([
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$SettingsActionButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SettingsActionButton"], {
                onClick: handleAddType,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                        className: "h-4 w-4"
                    }, void 0, false, {
                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                        lineNumber: 827,
                        columnNumber: 11
                    }, this),
                    " Thêm loại mới"
                ]
            }, "add", true, {
                fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                lineNumber: 826,
                columnNumber: 9
            }, this)
        ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        activeTab,
        registerComplaintTypeActions
    ]);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        if (activeTab !== 'card-colors') {
            return;
        }
        registerCardColorActions([
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$SettingsActionButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SettingsActionButton"], {
                onClick: handleSaveCardColors,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__["Save"], {
                        className: "h-4 w-4"
                    }, void 0, false, {
                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                        lineNumber: 840,
                        columnNumber: 11
                    }, this),
                    " Lưu cài đặt"
                ]
            }, "save", true, {
                fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                lineNumber: 839,
                columnNumber: 9
            }, this)
        ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        activeTab,
        registerCardColorActions
    ]);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        if (activeTab !== 'templates') {
            return;
        }
        registerTemplateActions([
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$SettingsActionButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SettingsActionButton"], {
                onClick: handleAddTemplate,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                        className: "h-4 w-4"
                    }, void 0, false, {
                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                        lineNumber: 853,
                        columnNumber: 11
                    }, this),
                    " Thêm mẫu"
                ]
            }, "add", true, {
                fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                lineNumber: 852,
                columnNumber: 9
            }, this)
        ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        activeTab,
        registerTemplateActions
    ]);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        if (activeTab !== 'notifications') {
            return;
        }
        registerNotificationActions([
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$SettingsActionButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SettingsActionButton"], {
                onClick: ()=>{
                    handleSaveNotifications();
                    handleSaveReminders();
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__["Save"], {
                        className: "h-4 w-4"
                    }, void 0, false, {
                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                        lineNumber: 869,
                        columnNumber: 11
                    }, this),
                    " Lưu cài đặt"
                ]
            }, "save", true, {
                fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                lineNumber: 865,
                columnNumber: 9
            }, this)
        ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        activeTab,
        registerNotificationActions
    ]);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        if (activeTab !== 'public-tracking') {
            return;
        }
        registerPublicTrackingActions([
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$SettingsActionButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SettingsActionButton"], {
                onClick: handleSavePublicTracking,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__["Save"], {
                        className: "h-4 w-4"
                    }, void 0, false, {
                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                        lineNumber: 882,
                        columnNumber: 11
                    }, this),
                    " Lưu cài đặt"
                ]
            }, "save", true, {
                fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                lineNumber: 881,
                columnNumber: 9
            }, this)
        ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        activeTab,
        registerPublicTrackingActions
    ]);
    const tabs = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>[
            {
                value: 'sla',
                label: 'SLA'
            },
            {
                value: 'complaint-types',
                label: 'Loại KN'
            },
            {
                value: 'card-colors',
                label: 'Màu card'
            },
            {
                value: 'templates',
                label: 'Mẫu phản hồi'
            },
            {
                value: 'notifications',
                label: 'Thông báo'
            },
            {
                value: 'public-tracking',
                label: 'Tracking'
            }
        ], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$SettingsVerticalTabs$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SettingsVerticalTabs"], {
            value: activeTab,
            onValueChange: setActiveTab,
            tabs: tabs,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TabsContent"], {
                    value: "sla",
                    className: "mt-0 space-y-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardHeader"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardTitle"], {
                                        children: "Cài đặt SLA (Service Level Agreement)"
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                        lineNumber: 910,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardDescription"], {
                                        children: "Thiết lập thời gian phản hồi và giải quyết khiếu nại theo mức độ ưu tiên"
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                        lineNumber: 911,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                lineNumber: 909,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                                className: "space-y-6",
                                children: SLA_PRIORITY_CONFIGS.map(({ key, label, description, indicatorClass })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$forms$2f$SettingsFormSection$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SettingsFormSection"], {
                                        title: label,
                                        description: description,
                                        badge: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('h-2 w-2 rounded-full', indicatorClass)
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                    lineNumber: 923,
                                                    columnNumber: 23
                                                }, void 0),
                                                "SLA"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                            lineNumber: 922,
                                            columnNumber: 21
                                        }, void 0),
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$forms$2f$SettingsFormGrid$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SettingsFormGrid"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                                            htmlFor: `${key}-response`,
                                                            children: "Thời gian phản hồi tối đa (phút)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                            lineNumber: 930,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                                            id: `${key}-response`,
                                                            type: "number",
                                                            min: "0",
                                                            value: sla[key].responseTime,
                                                            onChange: (e)=>handleSLAChange(key, 'responseTime', e.target.value)
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                            lineNumber: 931,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                    lineNumber: 929,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                                            htmlFor: `${key}-resolve`,
                                                            children: "Thời gian giải quyết tối đa (giờ)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                            lineNumber: 940,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                                            id: `${key}-resolve`,
                                                            type: "number",
                                                            min: "0",
                                                            value: sla[key].resolveTime,
                                                            onChange: (e)=>handleSLAChange(key, 'resolveTime', e.target.value)
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                            lineNumber: 941,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                    lineNumber: 939,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                            lineNumber: 928,
                                            columnNumber: 19
                                        }, this)
                                    }, key, false, {
                                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                        lineNumber: 917,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                lineNumber: 915,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                        lineNumber: 908,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                    lineNumber: 907,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TabsContent"], {
                    value: "complaint-types",
                    className: "mt-0 space-y-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardHeader"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardTitle"], {
                                            children: "Loại khiếu nại"
                                        }, void 0, false, {
                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                            lineNumber: 962,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardDescription"], {
                                            children: "Quản lý các loại khiếu nại có thể sử dụng khi tạo khiếu nại mới"
                                        }, void 0, false, {
                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                            lineNumber: 963,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                    lineNumber: 961,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                                    className: "space-y-6",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "border border-border rounded-lg",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Table"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableHeader"], {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableRow"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableHead"], {
                                                                className: "w-[50px]",
                                                                children: "STT"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                lineNumber: 974,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableHead"], {
                                                                children: "Tên loại"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                lineNumber: 975,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableHead"], {
                                                                children: "Mô tả"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                lineNumber: 976,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableHead"], {
                                                                className: "w-[100px]",
                                                                children: "Trạng thái"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                lineNumber: 977,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableHead"], {
                                                                className: "w-[80px] text-right",
                                                                children: "Thao tác"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                lineNumber: 978,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                        lineNumber: 973,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                    lineNumber: 972,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableBody"], {
                                                    children: complaintTypes.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableRow"], {
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableCell"], {
                                                            colSpan: 5,
                                                            className: "text-center text-muted-foreground",
                                                            children: "Chưa có loại khiếu nại nào"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                            lineNumber: 984,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                        lineNumber: 983,
                                                        columnNumber: 23
                                                    }, this) : complaintTypes.map((type, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableRow"], {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableCell"], {
                                                                    children: index + 1
                                                                }, void 0, false, {
                                                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                    lineNumber: 991,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableCell"], {
                                                                    className: "font-medium",
                                                                    children: type.name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                    lineNumber: 992,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableCell"], {
                                                                    className: "text-sm text-muted-foreground",
                                                                    children: type.description
                                                                }, void 0, false, {
                                                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                    lineNumber: 993,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableCell"], {
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$switch$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Switch"], {
                                                                        checked: type.isActive,
                                                                        onCheckedChange: ()=>handleToggleTypeActive(type.id)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                        lineNumber: 997,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                    lineNumber: 996,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableCell"], {
                                                                    className: "text-right",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenu"], {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                                                                                asChild: true,
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                                                    variant: "ghost",
                                                                                    size: "icon",
                                                                                    className: "h-8 w-8",
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__["MoreHorizontal"], {
                                                                                        className: "h-4 w-4"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                                        lineNumber: 1006,
                                                                                        columnNumber: 35
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                                    lineNumber: 1005,
                                                                                    columnNumber: 33
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                                lineNumber: 1004,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                                                                                align: "end",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                                                        onClick: ()=>handleEditType(type),
                                                                                        children: "Sửa"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                                        lineNumber: 1010,
                                                                                        columnNumber: 33
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                                                                                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                                        lineNumber: 1013,
                                                                                        columnNumber: 33
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                                                        onClick: ()=>setDeleteTypeId(type.id),
                                                                                        className: "text-destructive focus:text-destructive",
                                                                                        children: "Xóa"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                                        lineNumber: 1014,
                                                                                        columnNumber: 33
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                                lineNumber: 1009,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                        lineNumber: 1003,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                    lineNumber: 1002,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, type.id, true, {
                                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                            lineNumber: 990,
                                                            columnNumber: 25
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                    lineNumber: 981,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                            lineNumber: 971,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                        lineNumber: 970,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                    lineNumber: 967,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                            lineNumber: 960,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Dialog"], {
                            open: typeDialogOpen,
                            onOpenChange: (open)=>{
                                setTypeDialogOpen(open);
                                if (!open) {
                                    setEditingType(null);
                                    setIsAddingType(false);
                                }
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogContent"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogHeader"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogTitle"], {
                                                children: isAddingType ? 'Thêm loại khiếu nại mới' : 'Chỉnh sửa loại khiếu nại'
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                lineNumber: 1042,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogDescription"], {
                                                children: isAddingType ? 'Điền thông tin để tạo loại khiếu nại mới' : 'Cập nhật thông tin loại khiếu nại'
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                lineNumber: 1045,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                        lineNumber: 1041,
                                        columnNumber: 15
                                    }, this),
                                    editingType && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-4 py-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                                        htmlFor: "type-name",
                                                        children: "Tên loại khiếu nại *"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                        lineNumber: 1055,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                                        id: "type-name",
                                                        value: editingType.name,
                                                        onChange: (e)=>setEditingType({
                                                                ...editingType,
                                                                name: e.target.value
                                                            }),
                                                        placeholder: "VD: Sản phẩm lỗi"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                        lineNumber: 1056,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                lineNumber: 1054,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                                        htmlFor: "type-description",
                                                        children: "Mô tả"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                        lineNumber: 1065,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Textarea"], {
                                                        id: "type-description",
                                                        value: editingType.description,
                                                        onChange: (e)=>setEditingType({
                                                                ...editingType,
                                                                description: e.target.value
                                                            }),
                                                        placeholder: "VD: Sản phẩm có lỗi kỹ thuật hoặc hỏng hóc",
                                                        rows: 3
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                        lineNumber: 1066,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                lineNumber: 1064,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$switch$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Switch"], {
                                                        id: "type-active",
                                                        checked: editingType.isActive,
                                                        onCheckedChange: (checked)=>setEditingType({
                                                                ...editingType,
                                                                isActive: checked
                                                            })
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                        lineNumber: 1076,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                                        htmlFor: "type-active",
                                                        className: "cursor-pointer",
                                                        children: "Kích hoạt"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                        lineNumber: 1081,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                lineNumber: 1075,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                        lineNumber: 1053,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogFooter"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                variant: "outline",
                                                onClick: ()=>{
                                                    setTypeDialogOpen(false);
                                                    setEditingType(null);
                                                    setIsAddingType(false);
                                                },
                                                children: "Hủy"
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                lineNumber: 1089,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                onClick: handleSaveType,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__["Save"], {
                                                        className: "h-4 w-4 mr-2"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                        lineNumber: 1097,
                                                        columnNumber: 19
                                                    }, this),
                                                    isAddingType ? 'Thêm loại' : 'Lưu thay đổi'
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                lineNumber: 1096,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                        lineNumber: 1088,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                lineNumber: 1040,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                            lineNumber: 1033,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$confirm$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ConfirmDialog"], {
                            open: !!deleteTypeId,
                            onOpenChange: (open)=>!open && setDeleteTypeId(null),
                            title: "Xóa loại khiếu nại",
                            description: "Bạn có chắc chắn muốn xóa loại khiếu nại này? Hành động này không thể hoàn tác.",
                            confirmText: "Xóa",
                            cancelText: "Hủy",
                            variant: "destructive",
                            onConfirm: handleConfirmDeleteType
                        }, void 0, false, {
                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                            lineNumber: 1105,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                    lineNumber: 959,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TabsContent"], {
                    value: "card-colors",
                    className: "mt-0 space-y-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardHeader"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardTitle"], {
                                        children: "Màu sắc card khiếu nại"
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                        lineNumber: 1123,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardDescription"], {
                                        children: "Tùy chỉnh màu hiển thị card theo trạng thái, độ ưu tiên và quá hạn"
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                        lineNumber: 1124,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                lineNumber: 1122,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                                className: "space-y-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$forms$2f$SettingsFormSection$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SettingsFormSection"], {
                                        title: "Hướng dẫn nhập màu Tailwind",
                                        description: "Áp dụng đồng nhất giữa màu nền (bg-*) và viền (border-*) để card trông hài hòa.",
                                        className: "bg-blue-50/80 border-blue-200",
                                        contentClassName: "space-y-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-blue-900 font-medium",
                                                children: "💡 Gợi ý:"
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                lineNumber: 1135,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                className: "list-inside list-disc text-sm text-blue-800 space-y-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                        children: [
                                                            "Sử dụng định dạng ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                                                className: "bg-blue-100 px-1 rounded",
                                                                children: "bg-[màu]-[độ đậm]"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                lineNumber: 1137,
                                                                columnNumber: 41
                                                            }, this),
                                                            " và ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                                                className: "bg-blue-100 px-1 rounded",
                                                                children: "border-[màu]-[độ đậm]"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                lineNumber: 1137,
                                                                columnNumber: 112
                                                            }, this),
                                                            "."
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                        lineNumber: 1137,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                        children: [
                                                            "Ví dụ: ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                                                className: "bg-blue-100 px-1 rounded",
                                                                children: "bg-red-50 border-red-400"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                lineNumber: 1138,
                                                                columnNumber: 30
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                        lineNumber: 1138,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                        children: "Dãy màu hợp lệ: red, blue, green, yellow, amber, slate, gray,..."
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                        lineNumber: 1139,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                        children: "Độ đậm phổ biến: 50 → 900"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                        lineNumber: 1140,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                lineNumber: 1136,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                        lineNumber: 1129,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$forms$2f$SettingsFormSection$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SettingsFormSection"], {
                                        title: "Bật/Tắt hiển thị màu",
                                        description: "Tùy chọn ưu tiên hiển thị: quá hạn → độ ưu tiên → trạng thái.",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "space-y-0.5",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                                                    htmlFor: "enable-overdue",
                                                                    children: "Màu quá hạn"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                    lineNumber: 1151,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm text-muted-foreground",
                                                                    children: "Nhấn mạnh các khiếu nại vượt SLA."
                                                                }, void 0, false, {
                                                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                    lineNumber: 1152,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                            lineNumber: 1150,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$switch$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Switch"], {
                                                            id: "enable-overdue",
                                                            checked: cardColors.enableOverdueColor,
                                                            onCheckedChange: ()=>handleCardColorToggle('enableOverdueColor')
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                            lineNumber: 1154,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                    lineNumber: 1149,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "space-y-0.5",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                                                    htmlFor: "enable-priority",
                                                                    children: "Màu theo độ ưu tiên"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                    lineNumber: 1163,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm text-muted-foreground",
                                                                    children: "Thể hiện mức độ ảnh hưởng của khiếu nại."
                                                                }, void 0, false, {
                                                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                    lineNumber: 1164,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                            lineNumber: 1162,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$switch$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Switch"], {
                                                            id: "enable-priority",
                                                            checked: cardColors.enablePriorityColors,
                                                            onCheckedChange: ()=>handleCardColorToggle('enablePriorityColors')
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                            lineNumber: 1166,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                    lineNumber: 1161,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "space-y-0.5",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                                                    htmlFor: "enable-status",
                                                                    children: "Màu theo trạng thái"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                    lineNumber: 1175,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm text-muted-foreground",
                                                                    children: "Phân loại theo tiến trình xử lý."
                                                                }, void 0, false, {
                                                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                    lineNumber: 1176,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                            lineNumber: 1174,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$switch$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Switch"], {
                                                            id: "enable-status",
                                                            checked: cardColors.enableStatusColors,
                                                            onCheckedChange: ()=>handleCardColorToggle('enableStatusColors')
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                            lineNumber: 1178,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                    lineNumber: 1173,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                            lineNumber: 1148,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                        lineNumber: 1144,
                                        columnNumber: 15
                                    }, this),
                                    cardColors.enableOverdueColor && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$forms$2f$SettingsFormSection$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SettingsFormSection"], {
                                        title: "Màu quá hạn SLA",
                                        description: "Áp dụng cho các khiếu nại vượt SLA, hiển thị trước các màu khác.",
                                        className: "border border-destructive/30",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tailwind$2d$color$2d$picker$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TailwindColorPicker"], {
                                            value: cardColors.overdueColor,
                                            onChange: handleOverdueColorChange,
                                            label: "Màu nền và viền",
                                            placeholder: "Ví dụ: bg-red-50 border-red-400"
                                        }, void 0, false, {
                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                            lineNumber: 1193,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                        lineNumber: 1188,
                                        columnNumber: 17
                                    }, this),
                                    cardColors.enablePriorityColors && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$forms$2f$SettingsFormSection$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SettingsFormSection"], {
                                        title: "Màu theo độ ưu tiên",
                                        description: "Sử dụng dải màu ấm từ thấp → khẩn cấp để dễ phân biệt.",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tailwind$2d$color$2d$picker$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TailwindColorPicker"], {
                                                    value: cardColors.priorityColors.low,
                                                    onChange: (value)=>handlePriorityColorChange('low', value),
                                                    label: "Ưu tiên thấp",
                                                    placeholder: "Ví dụ: bg-slate-50 border-slate-200"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                    lineNumber: 1208,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tailwind$2d$color$2d$picker$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TailwindColorPicker"], {
                                                    value: cardColors.priorityColors.medium,
                                                    onChange: (value)=>handlePriorityColorChange('medium', value),
                                                    label: "Ưu tiên trung bình",
                                                    placeholder: "Ví dụ: bg-amber-50 border-amber-200"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                    lineNumber: 1215,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tailwind$2d$color$2d$picker$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TailwindColorPicker"], {
                                                    value: cardColors.priorityColors.high,
                                                    onChange: (value)=>handlePriorityColorChange('high', value),
                                                    label: "Ưu tiên cao",
                                                    placeholder: "Ví dụ: bg-orange-50 border-orange-300"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                    lineNumber: 1222,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tailwind$2d$color$2d$picker$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TailwindColorPicker"], {
                                                    value: cardColors.priorityColors.urgent,
                                                    onChange: (value)=>handlePriorityColorChange('urgent', value),
                                                    label: "Khẩn cấp",
                                                    placeholder: "Ví dụ: bg-red-100 border-red-300"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                    lineNumber: 1229,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                            lineNumber: 1207,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                        lineNumber: 1203,
                                        columnNumber: 17
                                    }, this),
                                    cardColors.enableStatusColors && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$forms$2f$SettingsFormSection$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SettingsFormSection"], {
                                        title: "Màu theo trạng thái",
                                        description: "Dùng tông màu lạnh để thể hiện tiến trình xử lý.",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tailwind$2d$color$2d$picker$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TailwindColorPicker"], {
                                                    value: cardColors.statusColors.pending,
                                                    onChange: (value)=>handleStatusColorChange('pending', value),
                                                    label: "Chờ xử lý",
                                                    placeholder: "Ví dụ: bg-yellow-50 border-yellow-200"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                    lineNumber: 1245,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tailwind$2d$color$2d$picker$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TailwindColorPicker"], {
                                                    value: cardColors.statusColors.investigating,
                                                    onChange: (value)=>handleStatusColorChange('investigating', value),
                                                    label: "Đang kiểm tra",
                                                    placeholder: "Ví dụ: bg-blue-50 border-blue-200"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                    lineNumber: 1252,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tailwind$2d$color$2d$picker$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TailwindColorPicker"], {
                                                    value: cardColors.statusColors.resolved,
                                                    onChange: (value)=>handleStatusColorChange('resolved', value),
                                                    label: "Đã giải quyết",
                                                    placeholder: "Ví dụ: bg-green-50 border-green-200"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                    lineNumber: 1259,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tailwind$2d$color$2d$picker$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TailwindColorPicker"], {
                                                    value: cardColors.statusColors.rejected,
                                                    onChange: (value)=>handleStatusColorChange('rejected', value),
                                                    label: "Từ chối",
                                                    placeholder: "Ví dụ: bg-gray-50 border-gray-200"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                    lineNumber: 1266,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                            lineNumber: 1244,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                        lineNumber: 1240,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                lineNumber: 1128,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                        lineNumber: 1121,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                    lineNumber: 1120,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TabsContent"], {
                    value: "templates",
                    className: "mt-0 space-y-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardHeader"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardTitle"], {
                                            children: "Mẫu phản hồi"
                                        }, void 0, false, {
                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                            lineNumber: 1285,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardDescription"], {
                                            children: "Tạo và quản lý các mẫu phản hồi nhanh cho khiếu nại"
                                        }, void 0, false, {
                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                            lineNumber: 1286,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                    lineNumber: 1284,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                                    children: templates.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-center py-8 text-muted-foreground",
                                        children: 'Chưa có mẫu phản hồi nào. Nhấn "Thêm mẫu" để tạo mẫu mới.'
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                        lineNumber: 1292,
                                        columnNumber: 17
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Table"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableHeader"], {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableRow"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableHead"], {
                                                            children: "Tên mẫu"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                            lineNumber: 1299,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableHead"], {
                                                            children: "Danh mục"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                            lineNumber: 1300,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableHead"], {
                                                            className: "w-[80px] text-right",
                                                            children: "Thao tác"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                            lineNumber: 1301,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                    lineNumber: 1298,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                lineNumber: 1297,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableBody"], {
                                                children: templates.map((template)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableRow"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableCell"], {
                                                                className: "font-medium",
                                                                children: template.name
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                lineNumber: 1307,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableCell"], {
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-xs px-2 py-1 rounded-md bg-muted",
                                                                    children: [
                                                                        template.category === 'general' && 'Chung',
                                                                        template.category === 'product-defect' && 'Lỗi sản phẩm',
                                                                        template.category === 'shipping-delay' && 'Giao hàng chậm',
                                                                        template.category === 'wrong-item' && 'Sai hàng',
                                                                        template.category === 'customer-service' && 'Dịch vụ KH'
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                    lineNumber: 1309,
                                                                    columnNumber: 27
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                lineNumber: 1308,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableCell"], {
                                                                className: "text-right",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenu"], {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                                                                            asChild: true,
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                                                variant: "ghost",
                                                                                size: "icon",
                                                                                className: "h-8 w-8",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__["MoreHorizontal"], {
                                                                                    className: "h-4 w-4"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                                    lineNumber: 1321,
                                                                                    columnNumber: 33
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                                lineNumber: 1320,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                            lineNumber: 1319,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                                                                            align: "end",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                                                    onClick: ()=>handleEditTemplate(template),
                                                                                    children: "Sửa"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                                    lineNumber: 1325,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                                                                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                                    lineNumber: 1328,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                                                    onClick: ()=>setDeleteTemplateId(template.id),
                                                                                    className: "text-destructive focus:text-destructive",
                                                                                    children: "Xóa"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                                    lineNumber: 1329,
                                                                                    columnNumber: 31
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                            lineNumber: 1324,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                    lineNumber: 1318,
                                                                    columnNumber: 27
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                lineNumber: 1317,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, template.id, true, {
                                                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                        lineNumber: 1306,
                                                        columnNumber: 23
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                lineNumber: 1304,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                        lineNumber: 1296,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                    lineNumber: 1290,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                            lineNumber: 1283,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Dialog"], {
                            open: templateDialogOpen,
                            onOpenChange: (open)=>{
                                setTemplateDialogOpen(open);
                                if (!open) {
                                    setEditingTemplate(null);
                                    setIsAddingTemplate(false);
                                }
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogContent"], {
                                className: "max-w-lg",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogHeader"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogTitle"], {
                                                children: isAddingTemplate ? 'Thêm mẫu phản hồi mới' : 'Chỉnh sửa mẫu phản hồi'
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                lineNumber: 1356,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogDescription"], {
                                                children: isAddingTemplate ? 'Điền thông tin để tạo mẫu phản hồi mới' : 'Cập nhật thông tin mẫu phản hồi'
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                lineNumber: 1359,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                        lineNumber: 1355,
                                        columnNumber: 15
                                    }, this),
                                    editingTemplate && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-4 py-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                                        htmlFor: "template-name",
                                                        children: "Tên mẫu *"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                        lineNumber: 1369,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                                        id: "template-name",
                                                        value: editingTemplate.name,
                                                        onChange: (e)=>setEditingTemplate({
                                                                ...editingTemplate,
                                                                name: e.target.value
                                                            }),
                                                        placeholder: "VD: Xin lỗi - Lỗi sản phẩm"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                        lineNumber: 1370,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                lineNumber: 1368,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                                        htmlFor: "template-category",
                                                        children: "Danh mục"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                        lineNumber: 1379,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Select"], {
                                                        value: editingTemplate.category,
                                                        onValueChange: (value)=>setEditingTemplate({
                                                                ...editingTemplate,
                                                                category: value
                                                            }),
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                                                id: "template-category",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectValue"], {}, void 0, false, {
                                                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                    lineNumber: 1388,
                                                                    columnNumber: 25
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                lineNumber: 1387,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectContent"], {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                        value: "general",
                                                                        children: "Chung"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                        lineNumber: 1391,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                        value: "product-defect",
                                                                        children: "Lỗi sản phẩm"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                        lineNumber: 1392,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                        value: "shipping-delay",
                                                                        children: "Giao hàng chậm"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                        lineNumber: 1393,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                        value: "wrong-item",
                                                                        children: "Sai hàng"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                        lineNumber: 1394,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                        value: "customer-service",
                                                                        children: "Dịch vụ khách hàng"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                        lineNumber: 1395,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                lineNumber: 1390,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                        lineNumber: 1380,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                lineNumber: 1378,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                                        htmlFor: "template-content",
                                                        children: "Nội dung mẫu *"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                        lineNumber: 1401,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Textarea"], {
                                                        id: "template-content",
                                                        value: editingTemplate.content,
                                                        onChange: (e)=>setEditingTemplate({
                                                                ...editingTemplate,
                                                                content: e.target.value
                                                            }),
                                                        placeholder: "Nhập nội dung phản hồi...",
                                                        rows: 8
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                        lineNumber: 1402,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                lineNumber: 1400,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                        lineNumber: 1367,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogFooter"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                variant: "outline",
                                                onClick: handleCancelEdit,
                                                children: "Hủy"
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                lineNumber: 1414,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                onClick: handleSaveTemplate,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__["Save"], {
                                                        className: "h-4 w-4 mr-2"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                        lineNumber: 1418,
                                                        columnNumber: 19
                                                    }, this),
                                                    isAddingTemplate ? 'Thêm mẫu' : 'Lưu thay đổi'
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                lineNumber: 1417,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                        lineNumber: 1413,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                lineNumber: 1354,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                            lineNumber: 1347,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$confirm$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ConfirmDialog"], {
                            open: !!deleteTemplateId,
                            onOpenChange: (open)=>!open && setDeleteTemplateId(null),
                            title: "Xóa mẫu phản hồi",
                            description: "Bạn có chắc chắn muốn xóa mẫu phản hồi này? Hành động này không thể hoàn tác.",
                            confirmText: "Xóa",
                            cancelText: "Hủy",
                            variant: "destructive",
                            onConfirm: handleConfirmDeleteTemplate
                        }, void 0, false, {
                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                            lineNumber: 1426,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                    lineNumber: 1282,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TabsContent"], {
                    value: "notifications",
                    className: "mt-0 space-y-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardHeader"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardTitle"], {
                                        children: "Cài đặt thông báo"
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                        lineNumber: 1444,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardDescription"], {
                                        children: "Quản lý thông báo qua email, SMS và in-app cho các sự kiện khiếu nại"
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                        lineNumber: 1445,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                lineNumber: 1443,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                                className: "space-y-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$forms$2f$SettingsFormSection$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SettingsFormSection"], {
                                        title: "Thông báo Email",
                                        description: "Gửi mail tới nhân viên phụ trách và người tạo khiếu nại.",
                                        badge: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"], {
                                            className: "h-4 w-4 text-muted-foreground"
                                        }, void 0, false, {
                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                            lineNumber: 1453,
                                            columnNumber: 24
                                        }, void 0),
                                        contentClassName: "space-y-3",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                                            htmlFor: "email-create",
                                                            className: "cursor-pointer",
                                                            children: "Khi khiếu nại mới được tạo"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                            lineNumber: 1458,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$switch$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Switch"], {
                                                            id: "email-create",
                                                            checked: notifications.emailOnCreate,
                                                            onCheckedChange: ()=>handleNotificationChange('emailOnCreate')
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                            lineNumber: 1461,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                    lineNumber: 1457,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                                            htmlFor: "email-assign",
                                                            className: "cursor-pointer",
                                                            children: "Khi được phân công xử lý"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                            lineNumber: 1469,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$switch$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Switch"], {
                                                            id: "email-assign",
                                                            checked: notifications.emailOnAssign,
                                                            onCheckedChange: ()=>handleNotificationChange('emailOnAssign')
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                            lineNumber: 1472,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                    lineNumber: 1468,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                                            htmlFor: "email-verified",
                                                            className: "cursor-pointer",
                                                            children: "Khi khiếu nại được xác minh"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                            lineNumber: 1480,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$switch$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Switch"], {
                                                            id: "email-verified",
                                                            checked: notifications.emailOnVerified,
                                                            onCheckedChange: ()=>handleNotificationChange('emailOnVerified')
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                            lineNumber: 1483,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                    lineNumber: 1479,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                                            htmlFor: "email-resolved",
                                                            className: "cursor-pointer",
                                                            children: "Khi khiếu nại được giải quyết"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                            lineNumber: 1491,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$switch$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Switch"], {
                                                            id: "email-resolved",
                                                            checked: notifications.emailOnResolved,
                                                            onCheckedChange: ()=>handleNotificationChange('emailOnResolved')
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                            lineNumber: 1494,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                    lineNumber: 1490,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                                            htmlFor: "email-overdue",
                                                            className: "cursor-pointer",
                                                            children: "Khi khiếu nại quá hạn SLA"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                            lineNumber: 1502,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$switch$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Switch"], {
                                                            id: "email-overdue",
                                                            checked: notifications.emailOnOverdue,
                                                            onCheckedChange: ()=>handleNotificationChange('emailOnOverdue')
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                            lineNumber: 1505,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                    lineNumber: 1501,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                            lineNumber: 1456,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                        lineNumber: 1450,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$forms$2f$SettingsFormSection$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SettingsFormSection"], {
                                        title: "Thông báo SMS",
                                        description: "Dùng cho các cảnh báo quan trọng, tránh gửi quá nhiều.",
                                        badge: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                            className: "h-4 w-4 text-muted-foreground"
                                        }, void 0, false, {
                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                            lineNumber: 1517,
                                            columnNumber: 24
                                        }, void 0),
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                                    htmlFor: "sms-overdue",
                                                    className: "cursor-pointer",
                                                    children: "Cảnh báo quá hạn SLA"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                    lineNumber: 1520,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$switch$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Switch"], {
                                                    id: "sms-overdue",
                                                    checked: notifications.smsOnOverdue,
                                                    onCheckedChange: ()=>handleNotificationChange('smsOnOverdue')
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                    lineNumber: 1523,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                            lineNumber: 1519,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                        lineNumber: 1514,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$forms$2f$SettingsFormSection$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SettingsFormSection"], {
                                        title: "Thông báo trong ứng dụng",
                                        description: "Hiển thị tại biểu tượng chuông của HRM giúp đội xử lý không bỏ sót.",
                                        badge: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"], {
                                            className: "h-4 w-4 text-muted-foreground"
                                        }, void 0, false, {
                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                            lineNumber: 1534,
                                            columnNumber: 24
                                        }, void 0),
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                                    htmlFor: "inapp",
                                                    className: "cursor-pointer",
                                                    children: "Bật thông báo in-app (bell icon)"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                    lineNumber: 1537,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$switch$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Switch"], {
                                                    id: "inapp",
                                                    checked: notifications.inAppNotifications,
                                                    onCheckedChange: ()=>handleNotificationChange('inAppNotifications')
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                    lineNumber: 1540,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                            lineNumber: 1536,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                        lineNumber: 1531,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$forms$2f$SettingsFormSection$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SettingsFormSection"], {
                                        title: "Nhắc nhở tự động",
                                        description: "Gửi cảnh báo nếu ticket không được cập nhật trong thời gian quy định.",
                                        badge: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                            className: "h-4 w-4 text-muted-foreground"
                                        }, void 0, false, {
                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                            lineNumber: 1551,
                                            columnNumber: 24
                                        }, void 0),
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "space-y-1",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                                                    htmlFor: "reminders-enabled",
                                                                    className: "cursor-pointer",
                                                                    children: "Bật tính năng nhắc nhở tự động"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                    lineNumber: 1556,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm text-muted-foreground",
                                                                    children: "Tự động gửi thông báo khi khiếu nại bị bỏ quên"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                    lineNumber: 1559,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                            lineNumber: 1555,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$switch$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Switch"], {
                                                            id: "reminders-enabled",
                                                            checked: reminders.enabled,
                                                            onCheckedChange: (checked)=>handleReminderChange('enabled', checked)
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                            lineNumber: 1563,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                    lineNumber: 1554,
                                                    columnNumber: 19
                                                }, this),
                                                reminders.enabled && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$forms$2f$SettingsFormGrid$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SettingsFormGrid"], {
                                                            columns: 3,
                                                            className: "items-start",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "space-y-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                                                            htmlFor: "first-reminder",
                                                                            children: "Nhắc nhở lần 1 (giờ)"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                            lineNumber: 1574,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                                                            id: "first-reminder",
                                                                            type: "number",
                                                                            min: "1",
                                                                            value: reminders.firstReminderHours,
                                                                            onChange: (e)=>handleReminderChange('firstReminderHours', parseInt(e.target.value) || 1)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                            lineNumber: 1575,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-xs text-muted-foreground",
                                                                            children: "Mặc định: 4 giờ"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                            lineNumber: 1582,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                    lineNumber: 1573,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "space-y-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                                                            htmlFor: "second-reminder",
                                                                            children: "Nhắc nhở lần 2 (giờ)"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                            lineNumber: 1585,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                                                            id: "second-reminder",
                                                                            type: "number",
                                                                            min: "1",
                                                                            value: reminders.secondReminderHours,
                                                                            onChange: (e)=>handleReminderChange('secondReminderHours', parseInt(e.target.value) || 1)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                            lineNumber: 1586,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-xs text-muted-foreground",
                                                                            children: "Mặc định: 8 giờ"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                            lineNumber: 1593,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                    lineNumber: 1584,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "space-y-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                                                            htmlFor: "escalation",
                                                                            className: "flex items-center gap-1",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                                                                    className: "h-3 w-3 text-destructive"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                                    lineNumber: 1597,
                                                                                    columnNumber: 29
                                                                                }, this),
                                                                                "Báo động leo thang (giờ)"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                            lineNumber: 1596,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                                                            id: "escalation",
                                                                            type: "number",
                                                                            min: "1",
                                                                            value: reminders.escalationHours,
                                                                            onChange: (e)=>handleReminderChange('escalationHours', parseInt(e.target.value) || 1)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                            lineNumber: 1600,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-xs text-muted-foreground",
                                                                            children: "Mặc định: 24 giờ"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                            lineNumber: 1607,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                    lineNumber: 1595,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                            lineNumber: 1572,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-xs text-muted-foreground space-y-1 bg-muted/50 p-3 rounded",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    children: "• Áp dụng cho trạng thái Pending/Investigating."
                                                                }, void 0, false, {
                                                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                    lineNumber: 1612,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    children: "• Thời gian tính từ hành động gần nhất."
                                                                }, void 0, false, {
                                                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                    lineNumber: 1613,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    children: "• Gửi cho người phụ trách và người tạo ticket."
                                                                }, void 0, false, {
                                                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                    lineNumber: 1614,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                            lineNumber: 1611,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                    lineNumber: 1571,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                            lineNumber: 1553,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                        lineNumber: 1548,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                lineNumber: 1449,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                        lineNumber: 1442,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                    lineNumber: 1441,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TabsContent"], {
                    value: "public-tracking",
                    className: "mt-0 space-y-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardHeader"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardTitle"], {
                                        children: "Liên kết theo dõi công khai"
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                        lineNumber: 1630,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardDescription"], {
                                        children: "Cho phép khách hàng theo dõi tiến độ xử lý khiếu nại qua link công khai"
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                        lineNumber: 1631,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                lineNumber: 1629,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                                className: "space-y-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$forms$2f$SettingsFormSection$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SettingsFormSection"], {
                                        title: "Cấu hình truy cập công khai",
                                        description: "Kiểm soát thông tin nào được chia sẻ cho khách hàng qua đường link.",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "space-y-1",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                                                    htmlFor: "tracking-enabled",
                                                                    className: "cursor-pointer",
                                                                    children: "Bật tính năng tracking công khai"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                    lineNumber: 1643,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm text-muted-foreground",
                                                                    children: "Tạo link để khách hàng tự tra cứu tiến độ"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                    lineNumber: 1646,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                            lineNumber: 1642,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$switch$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Switch"], {
                                                            id: "tracking-enabled",
                                                            checked: publicTracking.enabled,
                                                            onCheckedChange: ()=>handlePublicTrackingChange('enabled')
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                            lineNumber: 1650,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                    lineNumber: 1641,
                                                    columnNumber: 19
                                                }, this),
                                                publicTracking.enabled && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-between",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "space-y-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                                                            htmlFor: "allow-comments",
                                                                            className: "cursor-pointer",
                                                                            children: "Cho phép khách hàng comment"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                            lineNumber: 1661,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-sm text-muted-foreground",
                                                                            children: "Thu thập thêm dữ liệu và bằng chứng trực tiếp từ khách hàng"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                            lineNumber: 1664,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                    lineNumber: 1660,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$switch$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Switch"], {
                                                                    id: "allow-comments",
                                                                    checked: publicTracking.allowCustomerComments,
                                                                    onCheckedChange: ()=>handlePublicTrackingChange('allowCustomerComments')
                                                                }, void 0, false, {
                                                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                    lineNumber: 1668,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                            lineNumber: 1659,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-between",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "space-y-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                                                            htmlFor: "show-employee",
                                                                            className: "cursor-pointer",
                                                                            children: "Hiển thị tên nhân viên xử lý"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                            lineNumber: 1677,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-sm text-muted-foreground",
                                                                            children: "Tăng tính minh bạch với khách hàng"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                            lineNumber: 1680,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                    lineNumber: 1676,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$switch$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Switch"], {
                                                                    id: "show-employee",
                                                                    checked: publicTracking.showEmployeeName,
                                                                    onCheckedChange: ()=>handlePublicTrackingChange('showEmployeeName')
                                                                }, void 0, false, {
                                                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                    lineNumber: 1684,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                            lineNumber: 1675,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-between",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "space-y-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                                                            htmlFor: "show-timeline",
                                                                            className: "cursor-pointer",
                                                                            children: "Hiển thị timeline xử lý"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                            lineNumber: 1693,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-sm text-muted-foreground",
                                                                            children: "Cho phép khách hàng xem toàn bộ lịch sử hành động"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                            lineNumber: 1696,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                    lineNumber: 1692,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$switch$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Switch"], {
                                                                    id: "show-timeline",
                                                                    checked: publicTracking.showTimeline,
                                                                    onCheckedChange: ()=>handlePublicTrackingChange('showTimeline')
                                                                }, void 0, false, {
                                                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                                    lineNumber: 1700,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                            lineNumber: 1691,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                    lineNumber: 1658,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                            lineNumber: 1640,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                        lineNumber: 1636,
                                        columnNumber: 15
                                    }, this),
                                    publicTracking.enabled && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-4 bg-muted rounded-lg space-y-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm font-medium",
                                                children: "Ví dụ link tracking:"
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                lineNumber: 1714,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                                className: "text-xs bg-background px-2 py-1 rounded block",
                                                children: "https://yoursite.com/complaint-tracking/abc123xyz"
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                lineNumber: 1715,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-muted-foreground",
                                                children: "Link này sẽ được tạo tự động khi tạo khiếu nại mới"
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                                lineNumber: 1718,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                        lineNumber: 1713,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                                lineNumber: 1635,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                        lineNumber: 1628,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
                    lineNumber: 1627,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
            lineNumber: 902,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/features/settings/complaints/complaints-settings-page.tsx",
        lineNumber: 901,
        columnNumber: 7
    }, this);
}
}),
"[project]/features/complaints/use-realtime-updates.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getDataVersion",
    ()=>getDataVersion,
    "triggerDataUpdate",
    ()=>triggerDataUpdate,
    "useRealtimeUpdates",
    ()=>useRealtimeUpdates
]);
/**
 * Realtime Updates Hook for Complaints Module
 * Uses in-memory versioning - localStorage has been removed
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-ssr] (ecmascript)");
;
;
// In-memory version tracking
let complaintsDataVersion = 0;
const versionListeners = new Set();
function useRealtimeUpdates({ onRefresh, dataVersion, interval = 30000 }) {
    const [hasUpdates, setHasUpdates] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](false);
    const [isPolling, setIsPolling] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](true);
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
            if (complaintsDataVersion > lastVersion) {
                setHasUpdates(true);
                showUpdateNotification();
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
    const showUpdateNotification = ()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].info('Có cập nhật mới từ hệ thống', {
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
        setLastVersion(complaintsDataVersion);
        setHasUpdates(false);
        onRefresh();
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success('Đã làm mới dữ liệu');
    }, [
        onRefresh
    ]);
    const togglePolling = ()=>{
        setIsPolling((prev)=>!prev);
    };
    return {
        hasUpdates,
        isPolling,
        refresh: handleRefresh,
        togglePolling
    };
}
function triggerDataUpdate() {
    complaintsDataVersion++;
    versionListeners.forEach((listener)=>listener());
}
function getDataVersion() {
    return complaintsDataVersion;
}
}),
"[project]/features/complaints/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComplaintsPage",
    ()=>ComplaintsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-ssr] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$grid$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutGrid$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layout-grid.js [app-ssr] (ecmascript) <export default as LayoutGrid>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$table$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Table$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/table.js [app-ssr] (ecmascript) <export default as Table>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-ssr] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-ssr] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-ssr] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-x.js [app-ssr] (ecmascript) <export default as XCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.js [app-ssr] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chart-column.js [app-ssr] (ecmascript) <export default as BarChart3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-ssr] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/printer.js [app-ssr] (ecmascript) <export default as Printer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/fuse.js/dist/fuse.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$virtual$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-virtual/dist/esm/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$hooks$2f$use$2d$complaints$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/complaints/hooks/use-complaints.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$hooks$2f$use$2d$employees$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/features/employees/hooks/use-employees.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$hooks$2f$use$2d$all$2d$employees$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/employees/hooks/use-all-employees.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$hooks$2f$use$2d$branches$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/branches/hooks/use-branches.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$store$2d$info$2f$hooks$2f$use$2d$store$2d$info$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/store-info/hooks/use-store-info.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/complaints/types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$sla$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/complaints/sla-utils.ts [app-ssr] (ecmascript)");
// Print
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$print$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/use-print.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2f$complaint$2d$print$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/print/complaint-print-helper.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$complaint$2e$mapper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-mappers/complaint.mapper.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$simple$2d$print$2d$options$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/shared/simple-print-options-dialog.tsx [app-ssr] (ecmascript)");
// UI Components
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/input.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/badge.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dialog.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$page$2d$filters$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/layout/page-filters.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$faceted$2d$filter$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/data-table/data-table-faceted-filter.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$column$2d$toggle$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/data-table/data-table-column-toggle.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$responsive$2d$data$2d$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/data-table/responsive-data-table.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SlaTimer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/SlaTimer.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$columns$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/complaints/columns.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$complaint$2d$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/complaints/complaint-card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$complaint$2d$card$2d$context$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/complaints/complaint-card-context-menu.tsx [app-ssr] (ecmascript)"); // Hooks
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$page$2d$header$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/page-header-context.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$breakpoint$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/breakpoint-context.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$complaints$2f$complaints$2d$settings$2d$page$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/complaints/complaints-settings-page.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$use$2d$realtime$2d$updates$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/complaints/use-realtime-updates.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$tracking$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/complaints/tracking-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$router$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/router.ts [app-ssr] (ecmascript)");
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
/**
 * Kanban Column Component - Unified neutral header with search
 */ function KanbanColumn({ status, complaints, onComplaintClick, employees, onEdit, onGetLink, onStartInvestigation, onFinish, onOpen, onCancel, onRemind }) {
    const [searchQuery, setSearchQuery] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]('');
    // ⚡ VIRTUAL SCROLLING: Ref cho container
    const parentRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"](null);
    const statusIcons = {
        pending: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"],
        investigating: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"],
        resolved: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"],
        cancelled: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"],
        ended: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"]
    };
    const StatusIcon = statusIcons[status];
    // Filter complaints based on local search
    const filteredComplaints = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        if (!searchQuery.trim()) return complaints;
        const query = searchQuery.toLowerCase();
        return complaints.filter((c)=>(c.orderCode || c.orderSystemId).toLowerCase().includes(query) || // ⭐ Fallback to systemId
            c.customerName.toLowerCase().includes(query) || c.customerPhone.includes(query) || c.description.toLowerCase().includes(query));
    }, [
        complaints,
        searchQuery
    ]);
    // ⚡ VIRTUAL SCROLLING: Setup virtualizer
    const virtualizer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$virtual$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useVirtualizer"])({
        count: filteredComplaints.length,
        getScrollElement: ()=>parentRef.current,
        estimateSize: ()=>200,
        overscan: 5
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex-1 min-w-[300px] flex flex-col max-h-[calc(100vh-320px)]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-body-sm font-semibold px-4 py-3 mb-2 rounded-lg border bg-muted flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StatusIcon, {
                                className: "h-4 w-4"
                            }, void 0, false, {
                                fileName: "[project]/features/complaints/page.tsx",
                                lineNumber: 137,
                                columnNumber: 11
                            }, this),
                            __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["complaintStatusLabels"][status]
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/complaints/page.tsx",
                        lineNumber: 136,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-body-sm font-normal bg-background h-6 w-6 flex items-center justify-center rounded-full",
                        children: filteredComplaints.length
                    }, void 0, false, {
                        fileName: "[project]/features/complaints/page.tsx",
                        lineNumber: 140,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/complaints/page.tsx",
                lineNumber: 135,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-2",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                    placeholder: "Tìm kiếm...",
                    value: searchQuery,
                    onChange: (e)=>setSearchQuery(e.target.value),
                    className: "h-9"
                }, void 0, false, {
                    fileName: "[project]/features/complaints/page.tsx",
                    lineNumber: 147,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/complaints/page.tsx",
                lineNumber: 146,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: parentRef,
                className: "flex-1 overflow-y-auto pb-2",
                style: {
                    height: '100%',
                    overflow: 'auto'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            height: `${virtualizer.getTotalSize()}px`,
                            width: '100%',
                            position: 'relative'
                        },
                        children: virtualizer.getVirtualItems().map((virtualItem)=>{
                            const complaint = filteredComplaints[virtualItem.index];
                            const overdueStatus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$sla$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["checkOverdue"])(complaint);
                            const isOverdue = overdueStatus.isOverdueResponse || overdueStatus.isOverdueResolve;
                            // Load card color settings
                            const colorSettings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$complaints$2f$complaints$2d$settings$2d$page$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["loadCardColorSettings"])();
                            // Determine card color (priority order: overdue > priority > status)
                            let cardColorClass = "";
                            if (colorSettings.enableOverdueColor && isOverdue) {
                                cardColorClass = colorSettings.overdueColor;
                            } else if (colorSettings.enablePriorityColors && complaint.priority) {
                                const priority = complaint.priority;
                                cardColorClass = colorSettings.priorityColors[priority] || "";
                            } else if (colorSettings.enableStatusColors) {
                                cardColorClass = colorSettings.statusColors[complaint.status] || "";
                            }
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    transform: `translateY(${virtualItem.start}px)`
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "pb-3",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$complaint$2d$card$2d$context$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ComplaintCardContextMenu"], {
                                        complaint: complaint,
                                        onEdit: onEdit,
                                        onGetLink: onGetLink,
                                        onStartInvestigation: onStartInvestigation,
                                        onFinish: onFinish,
                                        onOpen: onOpen,
                                        onReject: onCancel,
                                        onRemind: onRemind,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                                            onClick: ()=>onComplaintClick(complaint),
                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("p-4 cursor-pointer transition-colors hover:bg-accent", cardColorClass),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-start justify-between mb-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-body-sm font-semibold",
                                                            children: complaint.id
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/complaints/page.tsx",
                                                            lineNumber: 221,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-1 flex-wrap justify-end",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                                                variant: "outline",
                                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-body-xs", __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["complaintTypeColors"][complaint.type]),
                                                                children: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["complaintTypeLabels"][complaint.type]
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/complaints/page.tsx",
                                                                lineNumber: 225,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/complaints/page.tsx",
                                                            lineNumber: 224,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/complaints/page.tsx",
                                                    lineNumber: 220,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mb-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-body-sm font-medium text-foreground mb-1",
                                                            children: [
                                                                "Đơn hàng: #",
                                                                complaint.orderCode || complaint.orderSystemId
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/features/complaints/page.tsx",
                                                            lineNumber: 236,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-between gap-2 text-body-xs text-muted-foreground",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "truncate",
                                                                    children: complaint.customerName
                                                                }, void 0, false, {
                                                                    fileName: "[project]/features/complaints/page.tsx",
                                                                    lineNumber: 240,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "flex-shrink-0",
                                                                    children: complaint.customerPhone
                                                                }, void 0, false, {
                                                                    fileName: "[project]/features/complaints/page.tsx",
                                                                    lineNumber: 241,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/features/complaints/page.tsx",
                                                            lineNumber: 239,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/complaints/page.tsx",
                                                    lineNumber: 235,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-body-xs text-muted-foreground mb-2 line-clamp-2",
                                                    children: complaint.description
                                                }, void 0, false, {
                                                    fileName: "[project]/features/complaints/page.tsx",
                                                    lineNumber: 246,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SlaTimer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SlaTimer"], {
                                                    startTime: complaint.createdAt,
                                                    targetMinutes: 120,
                                                    isCompleted: complaint.status === 'resolved' || complaint.status === 'cancelled',
                                                    completedLabel: "Đã giải quyết",
                                                    className: "mb-2"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/complaints/page.tsx",
                                                    lineNumber: 251,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between text-body-xs",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2",
                                                            children: complaint.assignedTo && (()=>{
                                                                const assignedEmployee = employees.find((e)=>e.systemId === complaint.assignedTo);
                                                                if (!assignedEmployee) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-muted-foreground",
                                                                    children: "Chưa giao"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/features/complaints/page.tsx",
                                                                    lineNumber: 264,
                                                                    columnNumber: 59
                                                                }, this);
                                                                // Get initials from full name (e.g. "Nguyễn Văn A" -> "NVA")
                                                                const initials = assignedEmployee.fullName.split(' ').map((word)=>word[0]).join('').toUpperCase().slice(0, 3);
                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-1.5",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-semibold",
                                                                            children: initials
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/features/complaints/page.tsx",
                                                                            lineNumber: 276,
                                                                            columnNumber: 33
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-muted-foreground max-w-[80px] truncate",
                                                                            children: assignedEmployee.fullName
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/features/complaints/page.tsx",
                                                                            lineNumber: 279,
                                                                            columnNumber: 33
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/features/complaints/page.tsx",
                                                                    lineNumber: 275,
                                                                    columnNumber: 31
                                                                }, this);
                                                            })()
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/complaints/page.tsx",
                                                            lineNumber: 261,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-muted-foreground",
                                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDateForDisplay"])(complaint.createdAt)
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/complaints/page.tsx",
                                                            lineNumber: 286,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/complaints/page.tsx",
                                                    lineNumber: 260,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/complaints/page.tsx",
                                            lineNumber: 212,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/features/complaints/page.tsx",
                                        lineNumber: 202,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/features/complaints/page.tsx",
                                    lineNumber: 201,
                                    columnNumber: 17
                                }, this)
                            }, complaint.systemId, false, {
                                fileName: "[project]/features/complaints/page.tsx",
                                lineNumber: 191,
                                columnNumber: 15
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/features/complaints/page.tsx",
                        lineNumber: 164,
                        columnNumber: 9
                    }, this),
                    filteredComplaints.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-center h-40 text-body-sm text-muted-foreground border-2 border-dashed rounded-lg",
                        children: "Không có khiếu nại nào"
                    }, void 0, false, {
                        fileName: "[project]/features/complaints/page.tsx",
                        lineNumber: 299,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/complaints/page.tsx",
                lineNumber: 156,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/complaints/page.tsx",
        lineNumber: 133,
        columnNumber: 5
    }, this);
}
function ComplaintsPage() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { isMobile } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$breakpoint$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useBreakpoint"])();
    const { setPageHeader } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$page$2d$header$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePageHeader"])();
    // React Query hooks
    const { data: complaintsData } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$hooks$2f$use$2d$complaints$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useComplaints"])();
    const complaints = complaintsData?.data || [];
    const { data: statsData } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$hooks$2f$use$2d$complaints$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useComplaintStats"])();
    const { update: updateComplaintMutation } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$hooks$2f$use$2d$complaints$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useComplaintMutations"])();
    const { data: employeesData } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$hooks$2f$use$2d$all$2d$employees$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAllEmployees"])();
    const employees = employeesData || [];
    const { data: branchesData } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$hooks$2f$use$2d$branches$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAllBranches"])();
    const branches = branchesData?.data || [];
    const { data: storeInfoData } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$store$2d$info$2f$hooks$2f$use$2d$store$2d$info$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStoreInfo"])();
    const storeInfo = storeInfoData || null;
    const { print, printMultiple } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$print$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePrint"])();
    // Local search state
    const [searchQuery, setSearchQuery] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]("");
    // Helper function to get complaints by status
    const getComplaintsByStatus = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((status)=>{
        return complaints.filter((c)=>c.status === status);
    }, [
        complaints
    ]);
    // Helper function to get stats
    const getStats = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](()=>{
        if (statsData) return statsData;
        return {
            total: complaints.length,
            pending: complaints.filter((c)=>c.status === 'pending').length,
            inProgress: complaints.filter((c)=>c.status === 'investigating').length,
            resolved: complaints.filter((c)=>c.status === 'resolved').length,
            rejected: complaints.filter((c)=>c.status === 'cancelled').length
        };
    }, [
        complaints,
        statsData
    ]);
    // Wrapper for updateComplaint
    const updateComplaint = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((systemId, updates)=>{
        updateComplaintMutation.mutate({
            systemId,
            data: updates
        });
    }, [
        updateComplaintMutation
    ]);
    // Print dialog state
    const [printDialogOpen, setPrintDialogOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](false);
    const [itemsToPrint, setItemsToPrint] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]([]);
    // ==========================================
    // State Management
    // ==========================================
    const [viewMode, setViewMode] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]("kanban");
    const [debouncedSearch, setDebouncedSearch] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]("");
    // Filter states - giống Employees (dùng Set)
    const [statusFilter, setStatusFilter] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](new Set());
    const [typeFilter, setTypeFilter] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](new Set());
    const [assignedToFilter, setAssignedToFilter] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](new Set());
    // Table view states
    const [rowSelection, setRowSelection] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]({});
    // Column visibility - Initialize with all columns visible (like Employees)
    const [columnVisibility, setColumnVisibility] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](()=>{
        const defaultVisibleColumns = [
            'complaintId',
            'orderCode',
            'customerName',
            'type',
            'priority',
            'status',
            'verification',
            'slaStatus',
            'assignedTo',
            'affectedProducts',
            'createdAt',
            'resolvedAt'
        ];
        const initial = {};
        const cols = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$columns$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getColumns"])(()=>{}, ()=>{}, ()=>{}, ()=>{}, ()=>{}, ()=>{}, employees, router);
        cols.forEach((col)=>{
            const colId = col.id || '';
            // select and actions are ALWAYS visible
            if (colId === 'select' || colId === 'actions') {
                initial[colId] = true;
            } else {
                initial[colId] = defaultVisibleColumns.includes(colId);
            }
        });
        return initial;
    });
    const [columnOrder, setColumnOrder] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]([]);
    const [sorting, setSorting] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]({
        id: 'createdAt',
        desc: true
    });
    const [pagination, setPagination] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]({
        pageIndex: 0,
        pageSize: 20
    });
    const [pinnedColumns, setPinnedColumns] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]([
        'select',
        'complaintId'
    ]);
    // Mobile infinite scroll
    const [mobileLoadedCount, setMobileLoadedCount] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](20);
    // Realtime updates
    const [dataVersion, setDataVersion] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$use$2d$realtime$2d$updates$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDataVersion"])());
    const { hasUpdates, isPolling, refresh, togglePolling } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$use$2d$realtime$2d$updates$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRealtimeUpdates"])({
        dataVersion,
        onRefresh: ()=>{
            // Refresh data when updates available
            setDataVersion((0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$use$2d$realtime$2d$updates$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDataVersion"])());
            // Force re-render by updating state
            const newVersion = Date.now();
            setDataVersion(newVersion);
        },
        interval: 30000 // Check every 30 seconds
    });
    // Load card color settings
    const cardColors = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$complaints$2f$complaints$2d$settings$2d$page$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["loadCardColorSettings"])(), []);
    // Get row style based on priority/status/overdue (same logic as card)
    const getRowStyle = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((complaint)=>{
        // Check if overdue and overdue color is enabled
        const overdueStatus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$sla$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["checkOverdue"])(complaint);
        if (cardColors.enableOverdueColor && (overdueStatus.isOverdueResponse || overdueStatus.isOverdueResolve)) {
            const colorClass = cardColors.overdueColor;
            return parseColorClass(colorClass);
        }
        // Check priority color if enabled
        if (cardColors.enablePriorityColors && complaint.priority) {
            const colorClass = cardColors.priorityColors[complaint.priority];
            if (colorClass) {
                return parseColorClass(colorClass);
            }
        }
        // Check status color if enabled
        if (cardColors.enableStatusColors) {
            const colorClass = cardColors.statusColors[complaint.status];
            if (colorClass) {
                return parseColorClass(colorClass);
            }
        }
        return {};
    }, [
        cardColors
    ]);
    // Helper function to parse Tailwind color classes to CSS
    function parseColorClass(colorClass) {
        if (!colorClass || typeof colorClass !== 'string') {
            return {};
        }
        // Extract Tailwind color from class (e.g., 'bg-yellow-50 border-yellow-200')
        const colorMap = {
            'bg-yellow-50': '#fefce8',
            'bg-blue-50': '#eff6ff',
            'bg-green-50': '#f0fdf4',
            'bg-gray-50': '#f9fafb',
            'bg-amber-50': '#fffbeb',
            'bg-orange-50': '#fff7ed',
            'bg-red-50': '#fef2f2',
            'bg-red-100': '#fee2e2',
            'bg-slate-50': '#f8fafc'
        };
        // Find the bg color class
        const bgClass = colorClass.split(' ').find((c)=>c.startsWith('bg-'));
        const hexColor = bgClass ? colorMap[bgClass] : null;
        if (!hexColor) return {};
        return {
            backgroundColor: hexColor
        };
    }
    // Dialog confirm states
    const [confirmDialog, setConfirmDialog] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]({
        open: false,
        title: '',
        description: '',
        onConfirm: ()=>{}
    });
    // Debounced search (300ms)
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        const timer = setTimeout(()=>{
            setDebouncedSearch(searchQuery);
        }, 300);
        return ()=>clearTimeout(timer);
    }, [
        searchQuery
    ]);
    // Filter options - giống Employees
    const statusOptions = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>[
            {
                label: "Chờ xử lý",
                value: "pending"
            },
            {
                label: "Đang kiểm tra",
                value: "investigating"
            },
            {
                label: "Đã giải quyết",
                value: "resolved"
            },
            {
                label: "Đã hủy",
                value: "cancelled"
            }
        ], []);
    const typeOptions = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>[
            {
                label: "Sai hàng",
                value: "wrong-product"
            },
            {
                label: "Thiếu hàng",
                value: "missing-items"
            },
            {
                label: "Đóng gói sai",
                value: "wrong-packaging"
            },
            {
                label: "Lỗi do kho",
                value: "warehouse-defect"
            },
            {
                label: "Tình trạng hàng",
                value: "product-condition"
            }
        ], []);
    const employeeOptions = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        return employees.map((emp)=>({
                label: emp.fullName,
                value: emp.systemId
            }));
    }, [
        employees
    ]);
    // ==========================================
    // Data Processing
    // ==========================================
    const stats = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>getStats(), [
        complaints,
        getStats
    ]);
    // Memoize Fuse instance
    const fuseInstance = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"](complaints, {
            keys: [
                "orderCode",
                "customerName",
                "customerPhone",
                "description"
            ],
            threshold: 0.3
        });
    }, [
        complaints
    ]);
    const filteredComplaints = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        let result = [
            ...complaints
        ];
        // Apply status filter
        if (statusFilter.size > 0) {
            result = result.filter((c)=>statusFilter.has(c.status));
        }
        // Apply type filter
        if (typeFilter.size > 0) {
            result = result.filter((c)=>typeFilter.has(c.type));
        }
        // Apply employee filter
        if (assignedToFilter.size > 0) {
            result = result.filter((c)=>c.assignedTo && assignedToFilter.has(c.assignedTo));
        }
        // Apply search with Fuse.js
        if (debouncedSearch) {
            result = fuseInstance.search(debouncedSearch).map((item)=>item.item);
        }
        return result;
    }, [
        complaints,
        statusFilter,
        typeFilter,
        assignedToFilter,
        debouncedSearch,
        fuseInstance
    ]);
    const complaintsByStatus = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        return {
            pending: filteredComplaints.filter((c)=>c.status === "pending"),
            investigating: filteredComplaints.filter((c)=>c.status === "investigating"),
            resolved: filteredComplaints.filter((c)=>c.status === "resolved"),
            cancelled: filteredComplaints.filter((c)=>c.status === "cancelled")
        };
    }, [
        filteredComplaints
    ]);
    // ==========================================
    // Event Handlers
    // ==========================================
    const handleComplaintClick = (complaint)=>{
        router.push(`/complaints/${complaint.systemId}`);
    };
    const handleCreateComplaint = ()=>{
        router.push("/complaints/new");
    };
    // Table view handlers
    const handleView = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((systemId)=>{
        router.push(`/complaints/${systemId}`);
    }, [
        router
    ]);
    const handleEdit = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((systemId)=>{
        router.push(`/complaints/${systemId}/edit`);
    }, [
        router
    ]);
    const handleFinish = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((systemId)=>{
        const complaint = complaints.find((c)=>c.systemId === systemId);
        if (!complaint) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Không tìm thấy khiếu nại');
            return;
        }
        setConfirmDialog({
            open: true,
            title: 'Kết thúc khiếu nại',
            description: 'Bạn có chắc muốn kết thúc khiếu nại này?',
            onConfirm: ()=>{
                try {
                    updateComplaint((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(systemId), {
                        status: 'resolved',
                        updatedAt: new Date(),
                        resolvedAt: new Date(),
                        timeline: [
                            ...complaint.timeline,
                            {
                                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(`action_${Date.now()}`),
                                actionType: 'resolved',
                                performedBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('Admin'),
                                performedAt: new Date(),
                                note: 'Kết thúc khiếu nại từ Kanban view'
                            }
                        ]
                    });
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success('Đã kết thúc khiếu nại thành công');
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$use$2d$realtime$2d$updates$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["triggerDataUpdate"])();
                } catch (error) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Không thể kết thúc khiếu nại');
                }
                setConfirmDialog((prev)=>({
                        ...prev,
                        open: false
                    }));
            }
        });
    }, [
        complaints,
        updateComplaint
    ]);
    const handleOpen = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((systemId)=>{
        const complaint = complaints.find((c)=>c.systemId === systemId);
        if (!complaint) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Không tìm thấy khiếu nại');
            return;
        }
        setConfirmDialog({
            open: true,
            title: 'Mở lại khiếu nại',
            description: 'Bạn có chắc muốn mở lại khiếu nại này?',
            onConfirm: ()=>{
                try {
                    updateComplaint((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(systemId), {
                        status: 'investigating',
                        // ⭐ Xóa các trường ended/resolved để về trạng thái mở
                        endedBy: undefined,
                        endedAt: undefined,
                        resolvedBy: undefined,
                        resolvedAt: undefined,
                        cancelledBy: undefined,
                        cancelledAt: undefined,
                        updatedAt: new Date(),
                        timeline: [
                            ...complaint.timeline,
                            {
                                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(`action_${Date.now()}`),
                                actionType: 'reopened',
                                performedBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('Admin'),
                                performedAt: new Date(),
                                note: 'Mở lại khiếu nại từ Kanban view'
                            }
                        ]
                    });
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success('Đã mở lại khiếu nại thành công');
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$use$2d$realtime$2d$updates$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["triggerDataUpdate"])();
                } catch (error) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Không thể mở lại khiếu nại');
                }
                setConfirmDialog((prev)=>({
                        ...prev,
                        open: false
                    }));
            }
        });
    }, [
        complaints,
        updateComplaint
    ]);
    const handleCancel = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((systemId)=>{
        const complaint = complaints.find((c)=>c.systemId === systemId);
        if (!complaint) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Không tìm thấy khiếu nại');
            return;
        }
        setConfirmDialog({
            open: true,
            title: 'Hủy khiếu nại',
            description: 'Bạn có chắc muốn hủy khiếu nại này?',
            onConfirm: ()=>{
                try {
                    updateComplaint((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(systemId), {
                        status: 'cancelled',
                        updatedAt: new Date(),
                        cancelledAt: new Date(),
                        timeline: [
                            ...complaint.timeline,
                            {
                                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(`action_${Date.now()}`),
                                actionType: 'cancelled',
                                performedBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('Admin'),
                                performedAt: new Date(),
                                note: 'Hủy khiếu nại từ Kanban view'
                            }
                        ]
                    });
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success('Đã hủy khiếu nại thành công');
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$use$2d$realtime$2d$updates$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["triggerDataUpdate"])();
                } catch (error) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Không thể hủy khiếu nại');
                }
                setConfirmDialog((prev)=>({
                        ...prev,
                        open: false
                    }));
            }
        });
    }, [
        complaints,
        updateComplaint
    ]);
    const handleStartInvestigation = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((systemId)=>{
        const complaint = complaints.find((c)=>c.systemId === systemId);
        if (!complaint) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Không tìm thấy khiếu nại');
            return;
        }
        setConfirmDialog({
            open: true,
            title: 'Bắt đầu xử lý',
            description: 'Bạn có chắc muốn bắt đầu xử lý khiếu nại này?',
            onConfirm: ()=>{
                try {
                    updateComplaint((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(systemId), {
                        status: 'investigating',
                        updatedAt: new Date(),
                        timeline: [
                            ...complaint.timeline,
                            {
                                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(`action_${Date.now()}`),
                                actionType: 'investigating',
                                performedBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('Admin'),
                                performedAt: new Date(),
                                note: 'Bắt đầu xử lý khiếu nại từ Kanban view'
                            }
                        ]
                    });
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success('Đã bắt đầu xử lý khiếu nại');
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$use$2d$realtime$2d$updates$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["triggerDataUpdate"])();
                } catch (error) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Không thể bắt đầu xử lý khiếu nại');
                }
                setConfirmDialog((prev)=>({
                        ...prev,
                        open: false
                    }));
            }
        });
    }, [
        complaints,
        updateComplaint
    ]);
    const handleGetLink = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((systemId)=>{
        try {
            const complaint = complaints.find((c)=>c.systemId === systemId);
            if (!complaint) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Không tìm thấy khiếu nại');
                return;
            }
            // Check if tracking is enabled
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$tracking$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isTrackingEnabled"])()) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Chức năng tracking chưa được bật. Vui lòng bật trong Cài đặt.');
                return;
            }
            // Generate tracking URL and code
            const trackingUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$tracking$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateTrackingUrl"])(complaint);
            const trackingCode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$tracking$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getTrackingCode"])(complaint.id);
            // Copy to clipboard
            navigator.clipboard.writeText(trackingUrl);
            // Show success with tracking code
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "font-semibold",
                        children: "Đã copy link tracking"
                    }, void 0, false, {
                        fileName: "[project]/features/complaints/page.tsx",
                        lineNumber: 772,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-sm text-muted-foreground",
                        children: [
                            "Mã theo dõi: ",
                            trackingCode
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/complaints/page.tsx",
                        lineNumber: 773,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/complaints/page.tsx",
                lineNumber: 771,
                columnNumber: 9
            }, this), {
                duration: 5000
            });
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Không thể copy link tracking');
        }
    }, [
        complaints
    ]);
    const handleRemind = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((systemId)=>{
        const complaint = complaints.find((c)=>c.systemId === systemId);
        if (!complaint) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Không tìm thấy khiếu nại');
            return;
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col gap-1",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "font-semibold",
                    children: "Đã gửi thông báo nhắc nhở"
                }, void 0, false, {
                    fileName: "[project]/features/complaints/page.tsx",
                    lineNumber: 791,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-sm text-muted-foreground",
                    children: [
                        "Khiếu nại: ",
                        complaint.id
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/complaints/page.tsx",
                    lineNumber: 792,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/features/complaints/page.tsx",
            lineNumber: 790,
            columnNumber: 7
        }, this), {
            duration: 3000
        });
    }, [
        complaints
    ]);
    const handleRowClick = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((complaint)=>{
        router.push(`/complaints/${complaint.systemId}`);
    }, [
        router
    ]);
    // Get columns
    const columns = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$columns$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getColumns"])(handleView, handleEdit, handleFinish, handleOpen, handleCancel, handleGetLink, employees, router), [
        handleView,
        handleEdit,
        handleFinish,
        handleOpen,
        handleCancel,
        handleGetLink,
        employees,
        router
    ]);
    // Set page header - CHỈ truyền actions (title & breadcrumb tự động generate)
    const actions = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>[
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                variant: isPolling ? "default" : "outline",
                size: "sm",
                className: "h-9",
                onClick: togglePolling,
                title: isPolling ? "Tắt cập nhật tự động" : "Bật cập nhật tự động",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("h-4 w-4 mr-2", isPolling && "animate-spin")
                    }, void 0, false, {
                        fileName: "[project]/features/complaints/page.tsx",
                        lineNumber: 829,
                        columnNumber: 7
                    }, this),
                    isPolling ? "Live" : "Cài đặt"
                ]
            }, "live-toggle", true, {
                fileName: "[project]/features/complaints/page.tsx",
                lineNumber: 821,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                onClick: ()=>setViewMode(viewMode === 'kanban' ? 'table' : 'kanban'),
                variant: "outline",
                size: "sm",
                className: "h-9",
                children: viewMode === 'kanban' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$table$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Table$3e$__["Table"], {
                            className: "h-4 w-4 mr-2"
                        }, void 0, false, {
                            fileName: "[project]/features/complaints/page.tsx",
                            lineNumber: 841,
                            columnNumber: 11
                        }, this),
                        "Chế độ bảng"
                    ]
                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$grid$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutGrid$3e$__["LayoutGrid"], {
                            className: "h-4 w-4 mr-2"
                        }, void 0, false, {
                            fileName: "[project]/features/complaints/page.tsx",
                            lineNumber: 846,
                            columnNumber: 11
                        }, this),
                        "Chế độ Kanban"
                    ]
                }, void 0, true)
            }, "view-toggle", false, {
                fileName: "[project]/features/complaints/page.tsx",
                lineNumber: 832,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                variant: "outline",
                onClick: ()=>router.push("/complaints/statistics"),
                className: "h-9",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"], {
                        className: "h-4 w-4 mr-2"
                    }, void 0, false, {
                        fileName: "[project]/features/complaints/page.tsx",
                        lineNumber: 857,
                        columnNumber: 7
                    }, this),
                    "Thống kê"
                ]
            }, "statistics", true, {
                fileName: "[project]/features/complaints/page.tsx",
                lineNumber: 851,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                onClick: ()=>router.push("/complaints/new"),
                className: "h-9",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                        className: "h-4 w-4 mr-2"
                    }, void 0, false, {
                        fileName: "[project]/features/complaints/page.tsx",
                        lineNumber: 865,
                        columnNumber: 7
                    }, this),
                    "Tạo khiếu nại"
                ]
            }, "create", true, {
                fileName: "[project]/features/complaints/page.tsx",
                lineNumber: 860,
                columnNumber: 5
            }, this)
        ], [
        router,
        viewMode,
        isPolling,
        togglePolling
    ]);
    const breadcrumb = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>[
            {
                label: "Trang chủ",
                href: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$router$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROUTES"].ROOT
            },
            {
                label: "Quản lý Khiếu nại",
                href: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$router$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROUTES"].INTERNAL.COMPLAINTS,
                isCurrent: true
            }
        ], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$page$2d$header$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePageHeader"])({
        title: "Quản lý Khiếu nại",
        breadcrumb,
        showBackButton: false,
        actions
    });
    // Set column order on mount
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        if (columnOrder.length === 0) {
            setColumnOrder(columns.map((c)=>c.id).filter(Boolean));
        }
    }, []); // Empty deps - run once
    // Calculate pagination
    const pageCount = Math.ceil(filteredComplaints.length / pagination.pageSize);
    const paginatedData = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        const start = pagination.pageIndex * pagination.pageSize;
        const end = start + pagination.pageSize;
        return filteredComplaints.slice(start, end);
    }, [
        filteredComplaints,
        pagination.pageIndex,
        pagination.pageSize
    ]);
    // Mobile display data
    const displayData = isMobile ? filteredComplaints.slice(0, mobileLoadedCount) : paginatedData;
    // Selected rows
    const allSelectedRows = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>Object.keys(rowSelection).filter((key)=>rowSelection[key]).map((systemId)=>filteredComplaints.find((c)=>c.systemId === systemId)).filter(Boolean), [
        rowSelection,
        filteredComplaints
    ]);
    // Bulk actions
    const handleBulkFinish = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](()=>{
        if (allSelectedRows.length === 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Vui lòng chọn ít nhất một khiếu nại');
            return;
        }
        setConfirmDialog({
            open: true,
            title: 'Kết thúc khiếu nại',
            description: `Bạn có chắc muốn kết thúc ${allSelectedRows.length} khiếu nại đã chọn?`,
            onConfirm: ()=>{
                try {
                    allSelectedRows.forEach((complaint)=>{
                        // TODO: Implement bulk finish logic
                        console.log('Kết thúc khiếu nại:', complaint.systemId);
                    });
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success(`Đã kết thúc ${allSelectedRows.length} khiếu nại`);
                    setRowSelection({});
                } catch (error) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Không thể kết thúc khiếu nại');
                }
                setConfirmDialog((prev)=>({
                        ...prev,
                        open: false
                    }));
            }
        });
    }, [
        allSelectedRows
    ]);
    const handleBulkOpen = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](()=>{
        if (allSelectedRows.length === 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Vui lòng chọn ít nhất một khiếu nại');
            return;
        }
        setConfirmDialog({
            open: true,
            title: 'Mở lại khiếu nại',
            description: `Bạn có chắc muốn mở ${allSelectedRows.length} khiếu nại đã chọn?`,
            onConfirm: ()=>{
                try {
                    allSelectedRows.forEach((complaint)=>{
                        // TODO: Implement bulk open logic
                        console.log('Mở khiếu nại:', complaint.systemId);
                    });
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success(`Đã mở lại ${allSelectedRows.length} khiếu nại`);
                    setRowSelection({});
                } catch (error) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Không thể mở lại khiếu nại');
                }
                setConfirmDialog((prev)=>({
                        ...prev,
                        open: false
                    }));
            }
        });
    }, [
        allSelectedRows
    ]);
    const handleBulkCancel = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](()=>{
        if (allSelectedRows.length === 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Vui lòng chọn ít nhất một khiếu nại');
            return;
        }
        setConfirmDialog({
            open: true,
            title: 'Hủy khiếu nại',
            description: `Bạn có chắc muốn hủy ${allSelectedRows.length} khiếu nại đã chọn?`,
            onConfirm: ()=>{
                try {
                    allSelectedRows.forEach((complaint)=>{
                        // TODO: Implement bulk cancel logic
                        console.log('Hủy khiếu nại:', complaint.systemId);
                    });
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success(`Đã hủy ${allSelectedRows.length} khiếu nại`);
                    setRowSelection({});
                } catch (error) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Không thể hủy khiếu nại');
                }
                setConfirmDialog((prev)=>({
                        ...prev,
                        open: false
                    }));
            }
        });
    }, [
        allSelectedRows
    ]);
    const handleBulkGetLink = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](()=>{
        if (allSelectedRows.length === 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Vui lòng chọn ít nhất một khiếu nại');
            return;
        }
        // Check if tracking is enabled
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$tracking$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isTrackingEnabled"])()) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Chức năng tracking chưa được bật. Vui lòng bật trong Cài đặt.');
            return;
        }
        try {
            const trackingLinks = allSelectedRows.map((c)=>{
                const trackingUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$tracking$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateTrackingUrl"])(c);
                const trackingCode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$tracking$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getTrackingCode"])(c.id);
                return `${trackingCode}: ${trackingUrl}`;
            });
            navigator.clipboard.writeText(trackingLinks.join('\n'));
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success(`Đã copy ${allSelectedRows.length} link tracking vào clipboard`);
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Không thể copy link tracking');
        }
    }, [
        allSelectedRows
    ]);
    // Bulk print handlers
    const handleBulkPrint = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((rows)=>{
        setItemsToPrint(rows);
        setPrintDialogOpen(true);
    }, []);
    const handlePrintConfirm = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((options)=>{
        if (itemsToPrint.length === 0) return;
        const printItems = itemsToPrint.map((complaint)=>{
            const selectedBranch = options.branchSystemId ? branches.find((b)=>b.systemId === options.branchSystemId) : branches.find((b)=>b.systemId === complaint.branchSystemId);
            const storeSettings = selectedBranch ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2f$complaint$2d$print$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createStoreSettings"])(selectedBranch) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2f$complaint$2d$print$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createStoreSettings"])(storeInfo);
            const complaintData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2f$complaint$2d$print$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["convertComplaintForPrint"])(complaint, {});
            return {
                data: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$complaint$2e$mapper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapComplaintToPrintData"])(complaintData, storeSettings),
                lineItems: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$complaint$2e$mapper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapComplaintLineItems"])(complaintData.items || []),
                paperSize: options.paperSize
            };
        });
        printMultiple('complaint', printItems);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success(`Đang in ${itemsToPrint.length} phiếu khiếu nại`);
        setItemsToPrint([]);
        setPrintDialogOpen(false);
    }, [
        itemsToPrint,
        branches,
        storeInfo,
        printMultiple
    ]);
    const bulkActions = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>[
            {
                label: 'In phiếu',
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__["Printer"],
                onSelect: handleBulkPrint
            },
            {
                label: 'Kết thúc',
                onSelect: handleBulkFinish
            },
            {
                label: 'Mở',
                onSelect: handleBulkOpen
            },
            {
                label: 'Get Link',
                onSelect: handleBulkGetLink
            },
            {
                label: 'Hủy',
                onSelect: handleBulkCancel
            }
        ], [
        handleBulkPrint,
        handleBulkFinish,
        handleBulkOpen,
        handleBulkGetLink,
        handleBulkCancel
    ]);
    // Reset mobile loaded count when filters change
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        setMobileLoadedCount(20);
    }, [
        searchQuery,
        statusFilter,
        typeFilter,
        assignedToFilter
    ]);
    // Mobile infinite scroll
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        if (!isMobile || viewMode !== 'table') return;
        const handleScroll = ()=>{
            const scrollPosition = window.scrollY + window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            if (scrollPosition >= documentHeight * 0.8) {
                setMobileLoadedCount((prev)=>Math.min(prev + 20, filteredComplaints.length));
            }
        };
        window.addEventListener('scroll', handleScroll);
        return ()=>window.removeEventListener('scroll', handleScroll);
    }, [
        isMobile,
        mobileLoadedCount,
        filteredComplaints.length,
        viewMode
    ]);
    const handleClearFilters = ()=>{
        setStatusFilter(new Set());
        setTypeFilter(new Set());
        setAssignedToFilter(new Set());
        setSearchQuery("");
    };
    const hasActiveFilters = statusFilter.size > 0 || typeFilter.size > 0 || assignedToFilter.size > 0 || searchQuery !== "";
    // ==========================================
    // Render
    // ==========================================
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col w-full h-full",
        children: [
            viewMode === "kanban" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-wrap items-center gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                    placeholder: "Tìm theo mã, đơn hàng, khách hàng...",
                                    value: searchQuery,
                                    onChange: (e)=>setSearchQuery(e.target.value),
                                    className: "h-9 max-w-xs"
                                }, void 0, false, {
                                    fileName: "[project]/features/complaints/page.tsx",
                                    lineNumber: 1115,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$faceted$2d$filter$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DataTableFacetedFilter"], {
                                    title: "Trạng thái",
                                    options: statusOptions,
                                    selectedValues: statusFilter,
                                    onSelectedValuesChange: setStatusFilter
                                }, void 0, false, {
                                    fileName: "[project]/features/complaints/page.tsx",
                                    lineNumber: 1122,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$faceted$2d$filter$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DataTableFacetedFilter"], {
                                    title: "Loại khiếu nại",
                                    options: typeOptions,
                                    selectedValues: typeFilter,
                                    onSelectedValuesChange: setTypeFilter
                                }, void 0, false, {
                                    fileName: "[project]/features/complaints/page.tsx",
                                    lineNumber: 1129,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$faceted$2d$filter$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DataTableFacetedFilter"], {
                                    title: "Người xử lý",
                                    options: employeeOptions,
                                    selectedValues: assignedToFilter,
                                    onSelectedValuesChange: setAssignedToFilter
                                }, void 0, false, {
                                    fileName: "[project]/features/complaints/page.tsx",
                                    lineNumber: 1136,
                                    columnNumber: 15
                                }, this),
                                hasActiveFilters && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "ghost",
                                    size: "sm",
                                    onClick: handleClearFilters,
                                    className: "h-9 px-2 lg:px-3",
                                    children: [
                                        "Xóa lọc",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                            className: "ml-2 h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/features/complaints/page.tsx",
                                            lineNumber: 1151,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/complaints/page.tsx",
                                    lineNumber: 1144,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/complaints/page.tsx",
                            lineNumber: 1114,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/features/complaints/page.tsx",
                        lineNumber: 1112,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-4 overflow-x-auto pb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(KanbanColumn, {
                                status: "pending",
                                complaints: complaintsByStatus.pending,
                                onComplaintClick: handleComplaintClick,
                                employees: employees,
                                onEdit: handleEdit,
                                onGetLink: handleGetLink,
                                onStartInvestigation: handleStartInvestigation,
                                onFinish: handleFinish,
                                onOpen: handleOpen,
                                onCancel: handleCancel,
                                onRemind: handleRemind
                            }, void 0, false, {
                                fileName: "[project]/features/complaints/page.tsx",
                                lineNumber: 1159,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(KanbanColumn, {
                                status: "investigating",
                                complaints: complaintsByStatus.investigating,
                                onComplaintClick: handleComplaintClick,
                                employees: employees,
                                onEdit: handleEdit,
                                onGetLink: handleGetLink,
                                onStartInvestigation: handleStartInvestigation,
                                onFinish: handleFinish,
                                onOpen: handleOpen,
                                onCancel: handleCancel,
                                onRemind: handleRemind
                            }, void 0, false, {
                                fileName: "[project]/features/complaints/page.tsx",
                                lineNumber: 1172,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(KanbanColumn, {
                                status: "resolved",
                                complaints: complaintsByStatus.resolved,
                                onComplaintClick: handleComplaintClick,
                                employees: employees,
                                onEdit: handleEdit,
                                onGetLink: handleGetLink,
                                onStartInvestigation: handleStartInvestigation,
                                onFinish: handleFinish,
                                onOpen: handleOpen,
                                onCancel: handleCancel,
                                onRemind: handleRemind
                            }, void 0, false, {
                                fileName: "[project]/features/complaints/page.tsx",
                                lineNumber: 1185,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(KanbanColumn, {
                                status: "cancelled",
                                complaints: complaintsByStatus.cancelled,
                                onComplaintClick: handleComplaintClick,
                                employees: employees,
                                onEdit: handleEdit,
                                onGetLink: handleGetLink,
                                onStartInvestigation: handleStartInvestigation,
                                onFinish: handleFinish,
                                onOpen: handleOpen,
                                onCancel: handleCancel,
                                onRemind: handleRemind
                            }, void 0, false, {
                                fileName: "[project]/features/complaints/page.tsx",
                                lineNumber: 1198,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/complaints/page.tsx",
                        lineNumber: 1158,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/complaints/page.tsx",
                lineNumber: 1110,
                columnNumber: 9
            }, this),
            viewMode === "table" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-end gap-2 mb-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "outline",
                                size: "sm",
                                className: "h-9",
                                onClick: ()=>router.push("/settings/complaints"),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                                        className: "h-4 w-4 mr-2"
                                    }, void 0, false, {
                                        fileName: "[project]/features/complaints/page.tsx",
                                        lineNumber: 1226,
                                        columnNumber: 15
                                    }, this),
                                    "Cài đặt"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/complaints/page.tsx",
                                lineNumber: 1220,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$column$2d$toggle$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DataTableColumnCustomizer"], {
                                columns: columns,
                                columnVisibility: columnVisibility,
                                setColumnVisibility: setColumnVisibility,
                                columnOrder: columnOrder,
                                setColumnOrder: setColumnOrder,
                                pinnedColumns: pinnedColumns,
                                setPinnedColumns: setPinnedColumns
                            }, void 0, false, {
                                fileName: "[project]/features/complaints/page.tsx",
                                lineNumber: 1229,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/complaints/page.tsx",
                        lineNumber: 1219,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$page$2d$filters$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PageFilters"], {
                        searchValue: searchQuery,
                        onSearchChange: setSearchQuery,
                        searchPlaceholder: "Tìm theo đơn hàng, khách hàng, SĐT...",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$faceted$2d$filter$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DataTableFacetedFilter"], {
                                title: "Trạng thái",
                                options: statusOptions,
                                selectedValues: statusFilter,
                                onSelectedValuesChange: setStatusFilter
                            }, void 0, false, {
                                fileName: "[project]/features/complaints/page.tsx",
                                lineNumber: 1246,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$faceted$2d$filter$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DataTableFacetedFilter"], {
                                title: "Loại khiếu nại",
                                options: typeOptions,
                                selectedValues: typeFilter,
                                onSelectedValuesChange: setTypeFilter
                            }, void 0, false, {
                                fileName: "[project]/features/complaints/page.tsx",
                                lineNumber: 1252,
                                columnNumber: 13
                            }, this),
                            employeeOptions.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$faceted$2d$filter$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DataTableFacetedFilter"], {
                                title: "Nhân viên xử lý",
                                options: employeeOptions,
                                selectedValues: assignedToFilter,
                                onSelectedValuesChange: setAssignedToFilter
                            }, void 0, false, {
                                fileName: "[project]/features/complaints/page.tsx",
                                lineNumber: 1259,
                                columnNumber: 15
                            }, this),
                            hasActiveFilters && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "ghost",
                                size: "sm",
                                onClick: handleClearFilters,
                                className: "h-9",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                        className: "h-4 w-4 mr-1"
                                    }, void 0, false, {
                                        fileName: "[project]/features/complaints/page.tsx",
                                        lineNumber: 1268,
                                        columnNumber: 17
                                    }, this),
                                    "Xóa lọc"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/complaints/page.tsx",
                                lineNumber: 1267,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/complaints/page.tsx",
                        lineNumber: 1241,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$responsive$2d$data$2d$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ResponsiveDataTable"], {
                        data: displayData,
                        columns: columns,
                        rowSelection: rowSelection,
                        setRowSelection: setRowSelection,
                        allSelectedRows: allSelectedRows,
                        columnVisibility: columnVisibility,
                        setColumnVisibility: setColumnVisibility,
                        columnOrder: columnOrder,
                        setColumnOrder: setColumnOrder,
                        sorting: sorting ?? {
                            id: 'createdAt',
                            desc: true
                        },
                        setSorting: setSorting,
                        pagination: pagination,
                        setPagination: setPagination,
                        pageCount: pageCount,
                        rowCount: filteredComplaints.length,
                        pinnedColumns: pinnedColumns,
                        setPinnedColumns: setPinnedColumns,
                        onRowClick: handleRowClick,
                        getRowStyle: getRowStyle,
                        bulkActions: bulkActions,
                        renderMobileCard: (complaint)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$complaint$2d$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ComplaintCard"], {
                                complaint: complaint,
                                onClick: ()=>handleComplaintClick(complaint),
                                employees: employees
                            }, complaint.systemId, false, {
                                fileName: "[project]/features/complaints/page.tsx",
                                lineNumber: 1297,
                                columnNumber: 15
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/features/complaints/page.tsx",
                        lineNumber: 1275,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true),
            isMobile && viewMode === 'table' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "py-6 text-center",
                children: mobileLoadedCount < filteredComplaints.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-center gap-2 text-muted-foreground",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "animate-spin rounded-full h-4 w-4 border-b-2 border-primary"
                        }, void 0, false, {
                            fileName: "[project]/features/complaints/page.tsx",
                            lineNumber: 1313,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-body-sm",
                            children: "Đang tải thêm..."
                        }, void 0, false, {
                            fileName: "[project]/features/complaints/page.tsx",
                            lineNumber: 1314,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/complaints/page.tsx",
                    lineNumber: 1312,
                    columnNumber: 13
                }, this) : filteredComplaints.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-body-sm text-muted-foreground",
                    children: [
                        "Đã hiển thị tất cả ",
                        filteredComplaints.length,
                        " khiếu nại"
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/complaints/page.tsx",
                    lineNumber: 1317,
                    columnNumber: 13
                }, this) : null
            }, void 0, false, {
                fileName: "[project]/features/complaints/page.tsx",
                lineNumber: 1310,
                columnNumber: 9
            }, this),
            filteredComplaints.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col items-center justify-center py-12 text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                        className: "h-12 w-12 text-muted-foreground mb-4"
                    }, void 0, false, {
                        fileName: "[project]/features/complaints/page.tsx",
                        lineNumber: 1327,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-h4 font-semibold mb-2",
                        children: "Chưa có khiếu nại nào"
                    }, void 0, false, {
                        fileName: "[project]/features/complaints/page.tsx",
                        lineNumber: 1328,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-muted-foreground mb-4",
                        children: hasActiveFilters ? "Không tìm thấy khiếu nại phù hợp với bộ lọc" : "Bắt đầu bằng cách tạo khiếu nại mới"
                    }, void 0, false, {
                        fileName: "[project]/features/complaints/page.tsx",
                        lineNumber: 1329,
                        columnNumber: 11
                    }, this),
                    !hasActiveFilters && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                        onClick: handleCreateComplaint,
                        className: "h-9",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                className: "h-4 w-4 mr-2"
                            }, void 0, false, {
                                fileName: "[project]/features/complaints/page.tsx",
                                lineNumber: 1336,
                                columnNumber: 15
                            }, this),
                            "Tạo khiếu nại đầu tiên"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/complaints/page.tsx",
                        lineNumber: 1335,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/complaints/page.tsx",
                lineNumber: 1326,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Dialog"], {
                open: confirmDialog.open,
                onOpenChange: (open)=>setConfirmDialog((prev)=>({
                            ...prev,
                            open
                        })),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogContent"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogHeader"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogTitle"], {
                                    children: confirmDialog.title
                                }, void 0, false, {
                                    fileName: "[project]/features/complaints/page.tsx",
                                    lineNumber: 1347,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogDescription"], {
                                    children: confirmDialog.description
                                }, void 0, false, {
                                    fileName: "[project]/features/complaints/page.tsx",
                                    lineNumber: 1348,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/complaints/page.tsx",
                            lineNumber: 1346,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogFooter"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "outline",
                                    className: "h-9",
                                    onClick: ()=>setConfirmDialog((prev)=>({
                                                ...prev,
                                                open: false
                                            })),
                                    children: "Hủy"
                                }, void 0, false, {
                                    fileName: "[project]/features/complaints/page.tsx",
                                    lineNumber: 1351,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                    className: "h-9",
                                    onClick: confirmDialog.onConfirm,
                                    children: "Xác nhận"
                                }, void 0, false, {
                                    fileName: "[project]/features/complaints/page.tsx",
                                    lineNumber: 1358,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/complaints/page.tsx",
                            lineNumber: 1350,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/complaints/page.tsx",
                    lineNumber: 1345,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/complaints/page.tsx",
                lineNumber: 1344,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$simple$2d$print$2d$options$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SimplePrintOptionsDialog"], {
                open: printDialogOpen,
                onOpenChange: setPrintDialogOpen,
                onConfirm: handlePrintConfirm,
                selectedCount: itemsToPrint.length,
                title: "In phiếu khiếu nại"
            }, void 0, false, {
                fileName: "[project]/features/complaints/page.tsx",
                lineNumber: 1366,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/complaints/page.tsx",
        lineNumber: 1107,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=features_f3148c9e._.js.map