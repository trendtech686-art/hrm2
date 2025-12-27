module.exports = [
"[project]/features/warranty/api/warranties-api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/features/warranty/hooks/use-warranties.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/query-core/build/modern/utils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$api$2f$warranties$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/api/warranties-api.ts [app-ssr] (ecmascript)");
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
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: warrantyKeys.list(params),
        queryFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$api$2f$warranties$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchWarranties"])(params),
        staleTime: 30_000,
        gcTime: 5 * 60 * 1000,
        placeholderData: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["keepPreviousData"]
    });
}
function useWarranty(id) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: warrantyKeys.detail(id),
        queryFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$api$2f$warranties$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchWarranty"])(id),
        enabled: !!id,
        staleTime: 60_000
    });
}
function useWarrantyStats() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: warrantyKeys.stats(),
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$api$2f$warranties$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchWarrantyStats"],
        staleTime: 60_000
    });
}
function useWarrantyMutations(options = {}) {
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const create = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$api$2f$warranties$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createWarranty"],
        onSuccess: (data)=>{
            queryClient.invalidateQueries({
                queryKey: warrantyKeys.lists()
            });
            queryClient.invalidateQueries({
                queryKey: warrantyKeys.stats()
            });
            options.onCreateSuccess?.(data);
        },
        onError: options.onError
    });
    const update = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: ({ systemId, data })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$api$2f$warranties$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateWarranty"])(systemId, data),
        onSuccess: (data, variables)=>{
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
        },
        onError: options.onError
    });
    const remove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$api$2f$warranties$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deleteWarranty"],
        onSuccess: ()=>{
            queryClient.invalidateQueries({
                queryKey: warrantyKeys.all
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
function usePendingWarranties() {
    return useWarranties({
        status: 'pending'
    });
}
function useWarrantiesByCustomer(customerId) {
    return useWarranties({
        customerId: customerId || undefined,
        limit: 50
    });
}
}),
"[project]/features/warranty/hooks/use-all-warranties.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAllWarranties",
    ()=>useAllWarranties
]);
/**
 * useAllWarranties - Convenience hook for components needing all warranties as flat array
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$hooks$2f$use$2d$warranties$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/hooks/use-warranties.ts [app-ssr] (ecmascript)");
;
function useAllWarranties() {
    const query = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$hooks$2f$use$2d$warranties$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useWarranties"])({});
    return {
        data: query.data?.data || [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error
    };
}
}),
"[project]/features/warranty/warranty-sla-utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Warranty SLA Utilities
 * 
 * Calculate and format SLA-related metrics for warranty tickets
 * 
 * NOTE: SLA settings are now synced with database via warranty-settings-sync.ts
 * These functions are kept for backwards compatibility but use the sync utility internally
 */ __turbopack_context__.s([
    "WARRANTY_SLA_TARGETS",
    ()=>WARRANTY_SLA_TARGETS,
    "checkWarrantyOverdue",
    ()=>checkWarrantyOverdue,
    "formatTimeLeft",
    ()=>formatTimeLeft,
    "getHoursSince",
    ()=>getHoursSince,
    "getUrgencyColor",
    ()=>getUrgencyColor,
    "getUrgencyLevel",
    ()=>getUrgencyLevel,
    "loadWarrantySLATargets",
    ()=>loadWarrantySLATargets,
    "saveWarrantySLATargets",
    ()=>saveWarrantySLATargets
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$warranty$2d$settings$2d$sync$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/warranty-settings-sync.ts [app-ssr] (ecmascript)");
;
/**
 * Default SLA Targets (in minutes)
 */ const DEFAULT_WARRANTY_SLA_TARGETS = {
    response: 2 * 60,
    processing: 24 * 60,
    return: 48 * 60
};
function loadWarrantySLATargets() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$warranty$2d$settings$2d$sync$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getWarrantySLATargetsSync"])();
}
function saveWarrantySLATargets(targets) {
    // Fire and forget - save to database in background
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$warranty$2d$settings$2d$sync$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["saveWarrantySLATargetsAsync"])(targets).catch((error)=>{
        console.error('Failed to save SLA targets:', error);
    });
}
const WARRANTY_SLA_TARGETS = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$warranty$2d$settings$2d$sync$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getWarrantySLATargetsSync"])();
function checkWarrantyOverdue(ticket) {
    const now = new Date();
    const createdAt = new Date(ticket.createdAt);
    const elapsedMinutes = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60));
    // Response time: from created to first action (status changed to pending)
    const hasResponse = ticket.status !== 'incomplete';
    const responseTimeLeft = WARRANTY_SLA_TARGETS.response - elapsedMinutes;
    const isOverdueResponse = !hasResponse && responseTimeLeft < 0;
    // Processing time: from created to processed
    const hasProcessed = ticket.status === 'processed' || ticket.status === 'returned';
    const processingTimeLeft = WARRANTY_SLA_TARGETS.processing - elapsedMinutes;
    const isOverdueProcessing = !hasProcessed && processingTimeLeft < 0;
    // Return time: from created to returned
    const hasReturned = ticket.status === 'returned';
    const returnTimeLeft = WARRANTY_SLA_TARGETS.return - elapsedMinutes;
    const isOverdueReturn = !hasReturned && returnTimeLeft < 0;
    // Format most critical overdue duration
    let overdueDuration;
    if (isOverdueResponse) {
        overdueDuration = formatTimeLeft(Math.abs(responseTimeLeft));
    } else if (isOverdueProcessing) {
        overdueDuration = formatTimeLeft(Math.abs(processingTimeLeft));
    } else if (isOverdueReturn) {
        overdueDuration = formatTimeLeft(Math.abs(returnTimeLeft));
    }
    return {
        isOverdueResponse,
        isOverdueProcessing,
        isOverdueReturn,
        responseTimeLeft,
        processingTimeLeft,
        returnTimeLeft,
        overdueDuration
    };
}
function formatTimeLeft(minutes) {
    const abs = Math.abs(minutes);
    const totalHours = Math.floor(abs / 60);
    const mins = Math.floor(abs % 60);
    if (abs < 60) {
        return `${mins} phút`;
    }
    if (totalHours < 24) {
        return mins > 0 ? `${totalHours} giờ ${mins} phút` : `${totalHours} giờ`;
    }
    const days = Math.floor(totalHours / 24);
    const remainingHours = totalHours % 24;
    // Always show format: X ngày X giờ X phút
    const parts = [];
    parts.push(`${days} ngày`);
    if (remainingHours > 0) {
        parts.push(`${remainingHours} giờ`);
    }
    if (mins > 0) {
        parts.push(`${mins} phút`);
    }
    return parts.join(' ');
}
function getHoursSince(timestamp) {
    const now = new Date();
    const then = new Date(timestamp);
    return Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60));
}
function getUrgencyLevel(minutesLeft) {
    if (minutesLeft < 0) return 'overdue';
    const hoursLeft = minutesLeft / 60;
    if (hoursLeft < 1) return 'critical';
    if (hoursLeft < 3) return 'warning';
    return 'normal';
}
function getUrgencyColor(level) {
    const colors = {
        normal: 'text-muted-foreground',
        warning: 'text-orange-500 font-medium',
        critical: 'text-destructive animate-pulse',
        overdue: 'text-destructive font-semibold'
    };
    return colors[level];
}
}),
"[project]/features/warranty/columns.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getColumns",
    ()=>getColumns
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-ssr] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module './types'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$warranty$2d$sla$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/warranty-sla-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/checkbox.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$column$2d$header$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/data-table/data-table-column-header.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/badge.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pencil.js [app-ssr] (ecmascript) <export default as Pencil>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-ssr] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis.js [app-ssr] (ecmascript) <export default as MoreHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/package.js [app-ssr] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/printer.js [app-ssr] (ecmascript) <export default as Printer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Link$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/link.js [app-ssr] (ecmascript) <export default as Link>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-ssr] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dropdown-menu.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$router$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/router.ts [app-ssr] (ecmascript)");
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
// Local helper function to calculate settlement status
function calculateSettlementStatus(totalSettlement, totalPaid, shippingFee) {
    const totalDue = totalSettlement + shippingFee;
    if (totalPaid >= totalDue) return 'completed';
    if (totalPaid > 0) return 'partial';
    return 'pending';
}
const formatCurrency = (value)=>{
    if (typeof value !== 'number') return '0';
    return new Intl.NumberFormat('vi-VN').format(value);
};
const getColumns = (onDelete, onEdit, router, orders = [])=>[
        // Select column - sticky left
        {
            id: "select",
            header: ({ isAllPageRowsSelected, isSomePageRowsSelected, onToggleAll })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Checkbox"], {
                    checked: isAllPageRowsSelected ? true : isSomePageRowsSelected ? "indeterminate" : false,
                    onCheckedChange: (value)=>onToggleAll?.(!!value),
                    "aria-label": "Select all"
                }, void 0, false, {
                    fileName: "[project]/features/warranty/columns.tsx",
                    lineNumber: 41,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            cell: ({ onToggleSelect, isSelected })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Checkbox"], {
                    checked: isSelected,
                    onCheckedChange: onToggleSelect,
                    "aria-label": "Select row"
                }, void 0, false, {
                    fileName: "[project]/features/warranty/columns.tsx",
                    lineNumber: 48,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            size: 48,
            meta: {
                displayName: "Chọn",
                sticky: "left"
            }
        },
        // ID column - clickable, sticky left
        {
            id: "id",
            accessorKey: "id",
            header: ({ sorting, setSorting })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$column$2d$header$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DataTableColumnHeader"], {
                    title: "Mã phiếu",
                    sortKey: "id",
                    isSorted: sorting?.id === 'id',
                    sortDirection: sorting?.desc ? 'desc' : 'asc',
                    onSort: ()=>setSorting?.((s)=>({
                                id: 'id',
                                desc: s.id === 'id' ? !s.desc : false
                            }))
                }, void 0, false, {
                    fileName: "[project]/features/warranty/columns.tsx",
                    lineNumber: 66,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "font-medium text-primary cursor-pointer hover:underline whitespace-nowrap",
                    onClick: ()=>router.push(`/warranty/${row.systemId}`),
                    children: row.id
                }, void 0, false, {
                    fileName: "[project]/features/warranty/columns.tsx",
                    lineNumber: 75,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            meta: {
                displayName: "Mã phiếu",
                group: "Thông tin cơ bản"
            }
        },
        // Branch & Employee info
        {
            id: "branchName",
            accessorKey: "branchName",
            header: "Chi nhánh",
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-[150px] truncate",
                    title: row.branchName,
                    children: row.branchName
                }, void 0, false, {
                    fileName: "[project]/features/warranty/columns.tsx",
                    lineNumber: 94,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            meta: {
                displayName: "Chi nhánh",
                group: "Thông tin cơ bản"
            }
        },
        {
            id: "employeeName",
            accessorKey: "employeeName",
            header: "Nhân viên",
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-[150px] truncate",
                    title: row.employeeName,
                    children: row.employeeName
                }, void 0, false, {
                    fileName: "[project]/features/warranty/columns.tsx",
                    lineNumber: 109,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            meta: {
                displayName: "Nhân viên phụ trách",
                group: "Thông tin cơ bản"
            }
        },
        // Customer info
        {
            id: "customerName",
            accessorKey: "customerName",
            header: ({ sorting, setSorting })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$column$2d$header$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DataTableColumnHeader"], {
                    title: "Khách hàng",
                    sortKey: "customerName",
                    isSorted: sorting?.id === 'customerName',
                    sortDirection: sorting?.desc ? 'desc' : 'asc',
                    onSort: ()=>setSorting?.((s)=>({
                                id: 'customerName',
                                desc: s.id === 'customerName' ? !s.desc : false
                            }))
                }, void 0, false, {
                    fileName: "[project]/features/warranty/columns.tsx",
                    lineNumber: 124,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-[180px] truncate",
                    title: row.customerName,
                    children: row.customerName
                }, void 0, false, {
                    fileName: "[project]/features/warranty/columns.tsx",
                    lineNumber: 133,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            meta: {
                displayName: "Tên khách hàng",
                group: "Thông tin khách hàng"
            }
        },
        {
            id: "customerPhone",
            accessorKey: "customerPhone",
            header: "Số điện thoại",
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "whitespace-nowrap",
                    children: row.customerPhone
                }, void 0, false, {
                    fileName: "[project]/features/warranty/columns.tsx",
                    lineNumber: 148,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            meta: {
                displayName: "SĐT khách hàng",
                group: "Thông tin khách hàng"
            }
        },
        {
            id: "customerAddress",
            accessorKey: "customerAddress",
            header: "Địa chỉ",
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-[200px] truncate",
                    title: row.customerAddress,
                    children: row.customerAddress || '—'
                }, void 0, false, {
                    fileName: "[project]/features/warranty/columns.tsx",
                    lineNumber: 161,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            meta: {
                displayName: "Địa chỉ khách hàng",
                group: "Thông tin khách hàng"
            }
        },
        // Tracking info
        {
            id: "trackingCode",
            accessorKey: "trackingCode",
            header: "Mã vận đơn / Mã tra cứu",
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-0.5",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "font-mono text-body-xs whitespace-nowrap",
                            children: row.trackingCode
                        }, void 0, false, {
                            fileName: "[project]/features/warranty/columns.tsx",
                            lineNumber: 178,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0)),
                        row.publicTrackingCode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "font-mono text-body-xs text-muted-foreground",
                            children: [
                                "Tra cứu: ",
                                row.publicTrackingCode
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/warranty/columns.tsx",
                            lineNumber: 180,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/warranty/columns.tsx",
                    lineNumber: 177,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            meta: {
                displayName: "Mã vận đơn / Tra cứu",
                group: "Vận chuyển"
            }
        },
        {
            id: "shippingFee",
            accessorKey: "shippingFee",
            header: "Phí cước",
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-right whitespace-nowrap",
                    children: row.shippingFee ? `${formatCurrency(row.shippingFee)} ₫` : '—'
                }, void 0, false, {
                    fileName: "[project]/features/warranty/columns.tsx",
                    lineNumber: 197,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            meta: {
                displayName: "Phí cước",
                group: "Vận chuyển"
            }
        },
        // Reference fields
        {
            id: "linkedOrderId",
            accessorKey: "linkedOrderSystemId",
            header: "Đơn hàng liên kết",
            cell: ({ row })=>{
                if (!row.linkedOrderSystemId) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-muted-foreground text-body-xs",
                    children: "—"
                }, void 0, false, {
                    fileName: "[project]/features/warranty/columns.tsx",
                    lineNumber: 213,
                    columnNumber: 44
                }, ("TURBOPACK compile-time value", void 0));
                const orderBusinessId = orders.find((o)=>o.systemId === row.linkedOrderSystemId)?.id;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "font-medium text-primary cursor-pointer hover:underline whitespace-nowrap",
                    onClick: ()=>router.push(`/orders/${row.linkedOrderSystemId}`),
                    children: orderBusinessId || row.linkedOrderSystemId
                }, void 0, false, {
                    fileName: "[project]/features/warranty/columns.tsx",
                    lineNumber: 216,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0));
            },
            meta: {
                displayName: "Đơn hàng liên kết",
                group: "Tham chiếu"
            }
        },
        {
            id: "referenceUrl",
            accessorKey: "referenceUrl",
            header: "Link tham chiếu",
            cell: ({ row })=>{
                if (!row.referenceUrl) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-muted-foreground text-body-xs",
                    children: "—"
                }, void 0, false, {
                    fileName: "[project]/features/warranty/columns.tsx",
                    lineNumber: 235,
                    columnNumber: 37
                }, ("TURBOPACK compile-time value", void 0));
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                    href: row.referenceUrl,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "text-primary hover:underline text-body-xs flex items-center gap-1",
                    onClick: (e)=>e.stopPropagation(),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Link$3e$__["Link"], {
                            className: "h-3 w-3"
                        }, void 0, false, {
                            fileName: "[project]/features/warranty/columns.tsx",
                            lineNumber: 244,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        "Link"
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/warranty/columns.tsx",
                    lineNumber: 237,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0));
            },
            meta: {
                displayName: "Đường dẫn tham chiếu",
                group: "Tham chiếu"
            }
        },
        {
            id: "externalReference",
            accessorKey: "externalReference",
            header: "Mã tham chiếu",
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "font-mono text-body-xs whitespace-nowrap",
                    children: row.externalReference || '—'
                }, void 0, false, {
                    fileName: "[project]/features/warranty/columns.tsx",
                    lineNumber: 260,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            meta: {
                displayName: "Mã tham chiếu bên ngoài",
                group: "Tham chiếu"
            }
        },
        // Status
        {
            id: "status",
            accessorKey: "status",
            header: ({ sorting, setSorting })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$column$2d$header$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DataTableColumnHeader"], {
                    title: "Trạng thái",
                    sortKey: "status",
                    isSorted: sorting?.id === 'status',
                    sortDirection: sorting?.desc ? 'desc' : 'asc',
                    onSort: ()=>setSorting?.((s)=>({
                                id: 'status',
                                desc: s.id === 'status' ? !s.desc : false
                            }))
                }, void 0, false, {
                    fileName: "[project]/features/warranty/columns.tsx",
                    lineNumber: 275,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                    className: WARRANTY_STATUS_COLORS[row.status],
                    children: WARRANTY_STATUS_LABELS[row.status]
                }, void 0, false, {
                    fileName: "[project]/features/warranty/columns.tsx",
                    lineNumber: 284,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            meta: {
                displayName: "Trạng thái",
                group: "Trạng thái"
            }
        },
        // SLA Status column - NEW
        {
            id: "slaStatus",
            header: "SLA",
            cell: ({ row })=>{
                const overdueStatus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$warranty$2d$sla$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["checkWarrantyOverdue"])(row);
                // Nếu đã trả hàng
                if (row.status === 'returned') {
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-muted-foreground",
                        children: "Hoàn thành"
                    }, void 0, false, {
                        fileName: "[project]/features/warranty/columns.tsx",
                        lineNumber: 303,
                        columnNumber: 16
                    }, ("TURBOPACK compile-time value", void 0));
                }
                // Check trạng thái quá hạn (kiểm tra từng loại)
                const isOverdue = overdueStatus.isOverdueResponse || overdueStatus.isOverdueProcessing || overdueStatus.isOverdueReturn;
                // Nếu không quá hạn - hiển thị thời gian còn lại theo trạng thái
                if (!isOverdue) {
                    let timeLeft = 0;
                    if (row.status === 'incomplete') {
                        timeLeft = overdueStatus.responseTimeLeft;
                    } else if (row.status === 'pending') {
                        timeLeft = overdueStatus.processingTimeLeft;
                    } else if (row.status === 'processed') {
                        timeLeft = overdueStatus.returnTimeLeft;
                    }
                    const timeLeftStr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$warranty$2d$sla$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTimeLeft"])(timeLeft);
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-1",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-green-600",
                            children: [
                                "Còn ",
                                timeLeftStr
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/warranty/columns.tsx",
                            lineNumber: 325,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/features/warranty/columns.tsx",
                        lineNumber: 324,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0));
                }
                // Quá hạn - hiển thị từ overdueDuration
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-1 text-red-600",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                            className: "h-3 w-3"
                        }, void 0, false, {
                            fileName: "[project]/features/warranty/columns.tsx",
                            lineNumber: 333,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: [
                                "Quá ",
                                overdueStatus.overdueDuration
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/warranty/columns.tsx",
                            lineNumber: 334,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/warranty/columns.tsx",
                    lineNumber: 332,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0));
            },
            size: 140,
            meta: {
                displayName: "SLA",
                group: "Trạng thái"
            }
        },
        // Settlement Status - NEW: Trạng thái thanh toán
        {
            id: "settlementStatus",
            header: "Thanh toán",
            cell: ({ row })=>{
                // Chỉ hiển thị cho phiếu đã trả và có totalSettlement > 0
                if (row.status !== 'returned' || !row.summary?.totalSettlement || row.summary.totalSettlement <= 0) {
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-muted-foreground text-body-xs",
                        children: "—"
                    }, void 0, false, {
                        fileName: "[project]/features/warranty/columns.tsx",
                        lineNumber: 352,
                        columnNumber: 16
                    }, ("TURBOPACK compile-time value", void 0));
                }
                // Get vouchers and calculate
                // REMOVED: useVoucherStore no longer exists
                // const vouchers = useVoucherStore.getState().data;
                const vouchers = [];
                const relatedVouchers = vouchers.filter((v)=>v.linkedWarrantySystemId === row.systemId);
                const totalPaid = relatedVouchers.reduce((sum, v)=>sum + (v.amount || 0), 0);
                // Calculate status
                const status = calculateSettlementStatus(Math.abs(row.summary.totalSettlement), totalPaid, row.shippingFee || 0);
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                    className: WARRANTY_SETTLEMENT_STATUS_COLORS[status],
                    children: WARRANTY_SETTLEMENT_STATUS_LABELS[status]
                }, void 0, false, {
                    fileName: "[project]/features/warranty/columns.tsx",
                    lineNumber: 370,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0));
            },
            meta: {
                displayName: "Trạng thái thanh toán",
                group: "Trạng thái"
            }
        },
        // Products summary
        {
            id: "productsCount",
            accessorKey: "products",
            header: "Sản phẩm",
            cell: ({ row })=>{
                const totalQty = row.products?.reduce((sum, p)=>sum + (p.quantity || 1), 0) || 0;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                            className: "h-4 w-4 text-muted-foreground"
                        }, void 0, false, {
                            fileName: "[project]/features/warranty/columns.tsx",
                            lineNumber: 390,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: totalQty
                        }, void 0, false, {
                            fileName: "[project]/features/warranty/columns.tsx",
                            lineNumber: 391,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/warranty/columns.tsx",
                    lineNumber: 389,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0));
            },
            meta: {
                displayName: "Tổng số lượng sản phẩm",
                group: "Sản phẩm"
            }
        },
        {
            id: "totalProducts",
            accessorKey: "summary",
            header: "Tổng SP",
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center font-medium",
                    children: row.summary?.totalProducts || 0
                }, void 0, false, {
                    fileName: "[project]/features/warranty/columns.tsx",
                    lineNumber: 406,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            meta: {
                displayName: "Tổng sản phẩm",
                group: "Sản phẩm"
            }
        },
        {
            id: "totalReplaced",
            accessorKey: "summary",
            header: "Đổi mới",
            cell: ({ row })=>{
                // Fallback: Calculate from products if summary is missing
                let replaced = row.summary?.totalReplaced;
                if (replaced === undefined || replaced === null) {
                    replaced = row.products?.filter((p)=>p.resolution === 'replace').reduce((sum, p)=>sum + (p.quantity || 1), 0) || 0;
                }
                if (replaced === 0) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-muted-foreground text-body-xs",
                    children: "—"
                }, void 0, false, {
                    fileName: "[project]/features/warranty/columns.tsx",
                    lineNumber: 426,
                    columnNumber: 34
                }, ("TURBOPACK compile-time value", void 0));
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center text-green-600 font-medium",
                    children: replaced
                }, void 0, false, {
                    fileName: "[project]/features/warranty/columns.tsx",
                    lineNumber: 427,
                    columnNumber: 14
                }, ("TURBOPACK compile-time value", void 0));
            },
            meta: {
                displayName: "Số lượng đổi mới",
                group: "Sản phẩm"
            }
        },
        {
            id: "totalReturned",
            accessorKey: "summary",
            header: "Trả lại",
            cell: ({ row })=>{
                // Fallback: Calculate from products if summary is missing
                let returned = row.summary?.totalReturned;
                if (returned === undefined || returned === null) {
                    returned = row.products?.filter((p)=>p.resolution === 'return').reduce((sum, p)=>sum + (p.quantity || 1), 0) || 0;
                }
                if (returned === 0) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-muted-foreground text-body-xs",
                    children: "—"
                }, void 0, false, {
                    fileName: "[project]/features/warranty/columns.tsx",
                    lineNumber: 447,
                    columnNumber: 34
                }, ("TURBOPACK compile-time value", void 0));
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center text-blue-600 font-medium",
                    children: returned
                }, void 0, false, {
                    fileName: "[project]/features/warranty/columns.tsx",
                    lineNumber: 448,
                    columnNumber: 14
                }, ("TURBOPACK compile-time value", void 0));
            },
            meta: {
                displayName: "Số lượng trả lại",
                group: "Sản phẩm"
            }
        },
        {
            id: "totalOutOfStock",
            accessorKey: "summary",
            header: "Hết hàng",
            cell: ({ row })=>{
                // Fallback: Calculate from products if summary is missing or incorrect
                // Gộp cả "out_of_stock" và "deduct" vì đều là hết hàng → khấu trừ tiền
                let outOfStock = row.summary?.totalOutOfStock;
                let deduction = row.summary?.totalDeduction;
                if (outOfStock === undefined || outOfStock === null || deduction === undefined || deduction === null) {
                    const outOfStockProducts = row.products?.filter((p)=>p.resolution === 'out_of_stock' || p.resolution === 'deduct') || [];
                    outOfStock = outOfStockProducts.reduce((sum, p)=>sum + (p.quantity || 1), 0);
                    deduction = outOfStockProducts.reduce((sum, p)=>{
                        if (p.resolution === 'deduct') return sum + (p.deductionAmount || 0);
                        if (p.resolution === 'out_of_stock') return sum + (p.quantity || 1) * (p.unitPrice || 0);
                        return sum;
                    }, 0);
                }
                if (outOfStock === 0 && deduction === 0) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-muted-foreground text-body-xs",
                    children: "—"
                }, void 0, false, {
                    fileName: "[project]/features/warranty/columns.tsx",
                    lineNumber: 478,
                    columnNumber: 55
                }, ("TURBOPACK compile-time value", void 0));
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-orange-600 font-medium",
                            children: [
                                outOfStock,
                                " SP"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/warranty/columns.tsx",
                            lineNumber: 482,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        deduction > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-body-xs text-red-600 whitespace-nowrap",
                            children: [
                                formatCurrency(deduction),
                                " ₫"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/warranty/columns.tsx",
                            lineNumber: 484,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/warranty/columns.tsx",
                    lineNumber: 481,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0));
            },
            meta: {
                displayName: "Hết hàng (Khấu trừ tiền)",
                group: "Sản phẩm"
            }
        },
        {
            id: "totalSettlement",
            accessorKey: "summary",
            header: "Bù trừ",
            cell: ({ row })=>{
                const settlement = row.summary?.totalSettlement || 0;
                if (settlement === 0) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-muted-foreground text-body-xs",
                    children: "—"
                }, void 0, false, {
                    fileName: "[project]/features/warranty/columns.tsx",
                    lineNumber: 503,
                    columnNumber: 36
                }, ("TURBOPACK compile-time value", void 0));
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-right text-blue-600 whitespace-nowrap",
                    children: [
                        formatCurrency(Math.abs(settlement)),
                        " ₫"
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/warranty/columns.tsx",
                    lineNumber: 505,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0));
            },
            meta: {
                displayName: "Tổng tiền bù trừ",
                group: "Sản phẩm"
            }
        },
        // Images
        {
            id: "receivedImagesCount",
            accessorKey: "receivedImages",
            header: "Hình nhận",
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center",
                    children: [
                        row.receivedImages?.length || 0,
                        " ảnh"
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/warranty/columns.tsx",
                    lineNumber: 522,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            meta: {
                displayName: "Số ảnh nhận hàng",
                group: "Hình ảnh"
            }
        },
        {
            id: "processedImagesCount",
            accessorKey: "processedImages",
            header: "Hình xử lý",
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center",
                    children: [
                        row.processedImages?.length || 0,
                        " ảnh"
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/warranty/columns.tsx",
                    lineNumber: 535,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            meta: {
                displayName: "Số ảnh xử lý xong",
                group: "Hình ảnh"
            }
        },
        // History & Comments
        {
            id: "historyCount",
            accessorKey: "history",
            header: "Lịch sử",
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center",
                    children: row.history?.length || 0
                }, void 0, false, {
                    fileName: "[project]/features/warranty/columns.tsx",
                    lineNumber: 549,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            meta: {
                displayName: "Số bản ghi lịch sử",
                group: "Lịch sử & Bình luận"
            }
        },
        {
            id: "commentsCount",
            accessorKey: "comments",
            header: "Bình luận",
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center",
                    children: row.comments?.length || 0
                }, void 0, false, {
                    fileName: "[project]/features/warranty/columns.tsx",
                    lineNumber: 562,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            meta: {
                displayName: "Số bình luận",
                group: "Lịch sử & Bình luận"
            }
        },
        {
            id: "subtasksCount",
            accessorKey: "subtasks",
            header: "Công việc",
            cell: ({ row })=>{
                const count = row.subtasks?.length || 0;
                if (count === 0) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-muted-foreground text-body-xs",
                    children: "—"
                }, void 0, false, {
                    fileName: "[project]/features/warranty/columns.tsx",
                    lineNumber: 576,
                    columnNumber: 31
                }, ("TURBOPACK compile-time value", void 0));
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center",
                    children: count
                }, void 0, false, {
                    fileName: "[project]/features/warranty/columns.tsx",
                    lineNumber: 577,
                    columnNumber: 14
                }, ("TURBOPACK compile-time value", void 0));
            },
            meta: {
                displayName: "Số công việc",
                group: "Lịch sử & Bình luận"
            }
        },
        // Notes
        {
            id: "notes",
            accessorKey: "notes",
            header: "Ghi chú",
            cell: ({ row })=>{
                if (!row.notes?.trim()) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-muted-foreground text-body-xs",
                    children: "—"
                }, void 0, false, {
                    fileName: "[project]/features/warranty/columns.tsx",
                    lineNumber: 591,
                    columnNumber: 38
                }, ("TURBOPACK compile-time value", void 0));
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-[200px] truncate text-body-xs",
                    title: row.notes,
                    children: row.notes
                }, void 0, false, {
                    fileName: "[project]/features/warranty/columns.tsx",
                    lineNumber: 593,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0));
            },
            meta: {
                displayName: "Ghi chú",
                group: "Thông tin bổ sung"
            }
        },
        // Timestamps
        {
            id: "returnedAt",
            accessorKey: "returnedAt",
            header: "Ngày trả hàng",
            cell: ({ row })=>{
                if (!row.returnedAt) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-muted-foreground text-body-xs",
                    children: "—"
                }, void 0, false, {
                    fileName: "[project]/features/warranty/columns.tsx",
                    lineNumber: 610,
                    columnNumber: 35
                }, ("TURBOPACK compile-time value", void 0));
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "whitespace-nowrap text-body-xs",
                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDateTime"])(row.returnedAt)
                }, void 0, false, {
                    fileName: "[project]/features/warranty/columns.tsx",
                    lineNumber: 611,
                    columnNumber: 14
                }, ("TURBOPACK compile-time value", void 0));
            },
            meta: {
                displayName: "Ngày trả hàng",
                group: "Thời gian"
            }
        },
        {
            id: "completedAt",
            accessorKey: "completedAt",
            header: "Ngày kết thúc",
            cell: ({ row })=>{
                if (!row.completedAt) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-muted-foreground text-body-xs",
                    children: "—"
                }, void 0, false, {
                    fileName: "[project]/features/warranty/columns.tsx",
                    lineNumber: 624,
                    columnNumber: 36
                }, ("TURBOPACK compile-time value", void 0));
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "whitespace-nowrap text-body-xs",
                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDateTime"])(row.completedAt)
                }, void 0, false, {
                    fileName: "[project]/features/warranty/columns.tsx",
                    lineNumber: 625,
                    columnNumber: 14
                }, ("TURBOPACK compile-time value", void 0));
            },
            meta: {
                displayName: "Ngày kết thúc",
                group: "Thời gian"
            }
        },
        // Audit fields
        {
            id: "createdBy",
            accessorKey: "createdBy",
            header: "Người tạo",
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "whitespace-nowrap",
                    children: row.createdBy
                }, void 0, false, {
                    fileName: "[project]/features/warranty/columns.tsx",
                    lineNumber: 639,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            meta: {
                displayName: "Người tạo",
                group: "Audit"
            }
        },
        {
            id: "createdAt",
            accessorKey: "createdAt",
            header: ({ sorting, setSorting })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$column$2d$header$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DataTableColumnHeader"], {
                    title: "Ngày tạo",
                    sortKey: "createdAt",
                    isSorted: sorting?.id === 'createdAt',
                    sortDirection: sorting?.desc ? 'desc' : 'asc',
                    onSort: ()=>setSorting?.((s)=>({
                                id: 'createdAt',
                                desc: s.id === 'createdAt' ? !s.desc : false
                            }))
                }, void 0, false, {
                    fileName: "[project]/features/warranty/columns.tsx",
                    lineNumber: 651,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "whitespace-nowrap",
                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDateTime"])(row.createdAt)
                }, void 0, false, {
                    fileName: "[project]/features/warranty/columns.tsx",
                    lineNumber: 660,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            meta: {
                displayName: "Ngày tạo",
                group: "Audit"
            }
        },
        {
            id: "updatedAt",
            accessorKey: "updatedAt",
            header: "Ngày cập nhật",
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "whitespace-nowrap",
                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDateTime"])(row.updatedAt)
                }, void 0, false, {
                    fileName: "[project]/features/warranty/columns.tsx",
                    lineNumber: 673,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            meta: {
                displayName: "Ngày cập nhật cuối",
                group: "Audit"
            }
        },
        // Actions column - sticky right
        {
            id: "actions",
            header: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center",
                    children: "Hành động"
                }, void 0, false, {
                    fileName: "[project]/features/warranty/columns.tsx",
                    lineNumber: 684,
                    columnNumber: 19
                }, ("TURBOPACK compile-time value", void 0)),
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenu"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                                asChild: true,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "ghost",
                                    className: "h-8 w-8 p-0",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__["MoreHorizontal"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/features/warranty/columns.tsx",
                                        lineNumber: 690,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/features/warranty/columns.tsx",
                                    lineNumber: 689,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/features/warranty/columns.tsx",
                                lineNumber: 688,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                                align: "end",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                        onClick: ()=>onEdit(row),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__["Pencil"], {
                                                className: "mr-2 h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/features/warranty/columns.tsx",
                                                lineNumber: 695,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            "Chỉnh Sửa"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/warranty/columns.tsx",
                                        lineNumber: 694,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                        onClick: ()=>{
                                            window.print();
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__["Printer"], {
                                                className: "mr-2 h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/features/warranty/columns.tsx",
                                                lineNumber: 701,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            "In"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/warranty/columns.tsx",
                                        lineNumber: 698,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                        disabled: !row.publicTrackingCode,
                                        onClick: ()=>{
                                            if (!row.publicTrackingCode) return;
                                            // CHỈ dùng publicTrackingCode (mã tra cứu chính thức)
                                            const trackingPath = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$router$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generatePath"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$router$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROUTES"].INTERNAL.WARRANTY_TRACKING, {
                                                trackingCode: row.publicTrackingCode
                                            });
                                            const trackingUrl = `${window.location.origin}${trackingPath}`;
                                            navigator.clipboard.writeText(trackingUrl);
                                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-col gap-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "font-semibold",
                                                        children: "Đã copy link tracking"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/warranty/columns.tsx",
                                                        lineNumber: 714,
                                                        columnNumber: 21
                                                    }, void 0),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-body-sm text-muted-foreground",
                                                        children: [
                                                            "Mã: ",
                                                            row.publicTrackingCode
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/features/warranty/columns.tsx",
                                                        lineNumber: 715,
                                                        columnNumber: 21
                                                    }, void 0)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/warranty/columns.tsx",
                                                lineNumber: 713,
                                                columnNumber: 19
                                            }, void 0), {
                                                duration: 5000
                                            });
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Link$3e$__["Link"], {
                                                className: "mr-2 h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/features/warranty/columns.tsx",
                                                lineNumber: 720,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            "Get Link Tracking",
                                            !row.publicTrackingCode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "ml-2 text-body-xs text-orange-600",
                                                children: "(Chưa có mã)"
                                            }, void 0, false, {
                                                fileName: "[project]/features/warranty/columns.tsx",
                                                lineNumber: 722,
                                                columnNumber: 43
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/warranty/columns.tsx",
                                        lineNumber: 704,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                                        fileName: "[project]/features/warranty/columns.tsx",
                                        lineNumber: 724,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                        className: "text-destructive",
                                        onClick: ()=>onDelete(row.systemId),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                className: "mr-2 h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/features/warranty/columns.tsx",
                                                lineNumber: 729,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            "Hủy"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/warranty/columns.tsx",
                                        lineNumber: 725,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/warranty/columns.tsx",
                                lineNumber: 693,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/warranty/columns.tsx",
                        lineNumber: 687,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/features/warranty/columns.tsx",
                    lineNumber: 686,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            meta: {
                displayName: "Hành động",
                sticky: "right"
            },
            size: 90
        }
    ];
}),
"[project]/features/warranty/warranty-card.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WarrantyCard",
    ()=>WarrantyCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-ssr] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module './types'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/badge.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/package.js [app-ssr] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/phone.js [app-ssr] (ecmascript) <export default as Phone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$truck$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Truck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/truck.js [app-ssr] (ecmascript) <export default as Truck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-ssr] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-ssr] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$warranty$2d$sla$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/warranty-sla-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SlaTimer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/SlaTimer.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$warranty$2f$warranty$2d$settings$2d$page$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/warranty/warranty-settings-page.tsx [app-ssr] (ecmascript)");
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
const WarrantyCard = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["memo"](function WarrantyCard({ ticket, onEdit, onDelete, onClick }) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const handleCardClick = (e)=>{
        // Ignore right-click
        if (e.type === 'contextmenu' || e.button === 2) {
            return;
        }
        if (onClick) {
            onClick(ticket);
        } else {
            router.push(`/warranty/${ticket.systemId}`);
        }
    };
    // Check if overdue
    const overdueStatus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$warranty$2d$sla$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["checkWarrantyOverdue"])(ticket);
    const isOverdue = overdueStatus.isOverdueResponse || overdueStatus.isOverdueProcessing || overdueStatus.isOverdueReturn;
    // Load card color settings
    const cardColors = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$warranty$2f$warranty$2d$settings$2d$page$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["loadCardColorSettings"])(), []);
    // Calculate summary with fallback from products
    const summary = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        if (ticket.summary?.totalReplaced !== undefined && ticket.summary?.totalOutOfStock !== undefined) {
            console.log('✅ Using existing summary:', ticket.id, ticket.summary);
            return ticket.summary;
        }
        // Fallback: Calculate from products (with null checks)
        if (!ticket.products || !Array.isArray(ticket.products)) {
            return {
                ...ticket.summary,
                totalProducts: 0,
                totalReplaced: 0,
                totalReturned: 0,
                totalOutOfStock: 0,
                totalDeduction: 0
            };
        }
        const totalProducts = ticket.products.reduce((sum, p)=>sum + (p.quantity || 1), 0);
        const totalReplaced = ticket.products.filter((p)=>p.resolution === 'replace').reduce((sum, p)=>sum + (p.quantity || 1), 0);
        const totalReturned = ticket.products.filter((p)=>p.resolution === 'return').reduce((sum, p)=>sum + (p.quantity || 1), 0);
        // Gộp "out_of_stock" và "deduct" thành "Hết hàng (Khấu trừ)"
        const outOfStockProducts = ticket.products.filter((p)=>p.resolution === 'out_of_stock' || p.resolution === 'deduct');
        const totalOutOfStock = outOfStockProducts.reduce((sum, p)=>sum + (p.quantity || 1), 0);
        const totalDeduction = outOfStockProducts.reduce((sum, p)=>{
            if (p.resolution === 'deduct') return sum + (p.deductionAmount || 0);
            if (p.resolution === 'out_of_stock') return sum + (p.quantity || 1) * (p.unitPrice || 0);
            return sum;
        }, 0);
        const calculated = {
            ...ticket.summary,
            totalProducts,
            totalReplaced,
            totalReturned,
            totalOutOfStock,
            totalDeduction
        };
        console.log('⚙️ Calculated summary:', ticket.id, calculated);
        return calculated;
    }, [
        ticket.summary,
        ticket.products
    ]);
    // Determine card color (priority: overdue > status)
    let cardColorClass = "";
    let borderClass = "border-l-4";
    if (cardColors.enableOverdueColor && isOverdue) {
        cardColorClass = cardColors.overdueColor || "bg-red-50"; // Fallback
        borderClass += " border-l-red-500";
    } else if (cardColors.enableStatusColors) {
        cardColorClass = cardColors.statusColors[ticket.status] || "";
        const statusBorderColors = {
            incomplete: "border-l-orange-500",
            pending: "border-l-yellow-500",
            processed: "border-l-green-500",
            returned: "border-l-gray-500",
            completed: "border-l-blue-500",
            cancelled: "border-l-red-500"
        };
        borderClass += " " + (statusBorderColors[ticket.status] || "border-l-gray-200");
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("hover:shadow-md transition-all cursor-pointer", borderClass, cardColorClass, ticket.status === 'cancelled' && "opacity-60" // Dim cancelled tickets
        ),
        onClick: handleCardClick,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
            className: "p-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between mb-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2 flex-wrap",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("font-semibold text-primary text-body-sm font-mono", ticket.status === 'cancelled' && "line-through" // Strike through cancelled ID
                                    ),
                                    children: ticket.id
                                }, void 0, false, {
                                    fileName: "[project]/features/warranty/warranty-card.tsx",
                                    lineNumber: 137,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                    className: WARRANTY_STATUS_COLORS[ticket.status] + " text-body-xs",
                                    children: WARRANTY_STATUS_LABELS[ticket.status]
                                }, void 0, false, {
                                    fileName: "[project]/features/warranty/warranty-card.tsx",
                                    lineNumber: 143,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/warranty/warranty-card.tsx",
                            lineNumber: 136,
                            columnNumber: 11
                        }, this),
                        isOverdue && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                            variant: "outline",
                            className: "text-body-xs bg-red-100 text-red-800 whitespace-nowrap",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                    className: "h-3 w-3 mr-1"
                                }, void 0, false, {
                                    fileName: "[project]/features/warranty/warranty-card.tsx",
                                    lineNumber: 149,
                                    columnNumber: 15
                                }, this),
                                "Quá hạn"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/warranty/warranty-card.tsx",
                            lineNumber: 148,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/warranty/warranty-card.tsx",
                    lineNumber: 135,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex items-center text-body-sm font-medium mb-2", ticket.status === 'cancelled' && "line-through" // Strike through cancelled customer name
                    ),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                            className: "h-3.5 w-3.5 mr-1.5 flex-shrink-0 text-muted-foreground"
                        }, void 0, false, {
                            fileName: "[project]/features/warranty/warranty-card.tsx",
                            lineNumber: 160,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "truncate",
                            children: ticket.customerName
                        }, void 0, false, {
                            fileName: "[project]/features/warranty/warranty-card.tsx",
                            lineNumber: 161,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/warranty/warranty-card.tsx",
                    lineNumber: 156,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "border-t border-border mb-2"
                }, void 0, false, {
                    fileName: "[project]/features/warranty/warranty-card.tsx",
                    lineNumber: 165,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-1.5",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between text-body-xs text-muted-foreground",
                            children: [
                                ticket.customerPhone && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__["Phone"], {
                                            className: "h-3 w-3 mr-1"
                                        }, void 0, false, {
                                            fileName: "[project]/features/warranty/warranty-card.tsx",
                                            lineNumber: 173,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: ticket.customerPhone
                                        }, void 0, false, {
                                            fileName: "[project]/features/warranty/warranty-card.tsx",
                                            lineNumber: 174,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/warranty/warranty-card.tsx",
                                    lineNumber: 172,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$truck$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Truck$3e$__["Truck"], {
                                            className: "h-3 w-3 mr-1"
                                        }, void 0, false, {
                                            fileName: "[project]/features/warranty/warranty-card.tsx",
                                            lineNumber: 178,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-mono",
                                            children: ticket.trackingCode
                                        }, void 0, false, {
                                            fileName: "[project]/features/warranty/warranty-card.tsx",
                                            lineNumber: 179,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/warranty/warranty-card.tsx",
                                    lineNumber: 177,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/warranty/warranty-card.tsx",
                            lineNumber: 170,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center text-body-xs gap-1.5 flex-wrap",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center text-muted-foreground",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                                            className: "h-3 w-3 mr-1"
                                        }, void 0, false, {
                                            fileName: "[project]/features/warranty/warranty-card.tsx",
                                            lineNumber: 186,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-semibold",
                                            children: summary?.totalProducts || ticket.products?.length || 0
                                        }, void 0, false, {
                                            fileName: "[project]/features/warranty/warranty-card.tsx",
                                            lineNumber: 187,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/warranty/warranty-card.tsx",
                                    lineNumber: 185,
                                    columnNumber: 13
                                }, this),
                                summary && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        summary.totalReplaced > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-green-600 font-medium",
                                            children: [
                                                "• ",
                                                summary.totalReplaced,
                                                "đổi mới"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/warranty/warranty-card.tsx",
                                            lineNumber: 191,
                                            columnNumber: 47
                                        }, this),
                                        summary.totalReturned > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-blue-600 font-medium",
                                            children: [
                                                "• ",
                                                summary.totalReturned,
                                                "trả lại"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/warranty/warranty-card.tsx",
                                            lineNumber: 192,
                                            columnNumber: 47
                                        }, this),
                                        summary.totalOutOfStock > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-orange-600 font-medium",
                                            children: [
                                                "• ",
                                                summary.totalOutOfStock,
                                                "hết hàng"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/warranty/warranty-card.tsx",
                                            lineNumber: 193,
                                            columnNumber: 49
                                        }, this),
                                        summary.totalDeduction > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-red-600 font-medium ml-auto",
                                            children: [
                                                "Bù trừ ",
                                                new Intl.NumberFormat('vi-VN').format(summary.totalDeduction),
                                                "₫"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/warranty/warranty-card.tsx",
                                            lineNumber: 195,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/warranty/warranty-card.tsx",
                            lineNumber: 184,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SlaTimer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SlaTimer"], {
                            startTime: ticket.createdAt,
                            targetMinutes: ticket.status === 'incomplete' ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SlaTimer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WARRANTY_SLA_CONFIGS"].response.targetMinutes : ticket.status === 'pending' ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SlaTimer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WARRANTY_SLA_CONFIGS"].processing.targetMinutes : __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SlaTimer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WARRANTY_SLA_CONFIGS"].return.targetMinutes,
                            isCompleted: ticket.status === 'returned',
                            thresholds: ticket.status === 'incomplete' ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SlaTimer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WARRANTY_SLA_CONFIGS"].response.thresholds : ticket.status === 'pending' ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SlaTimer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WARRANTY_SLA_CONFIGS"].processing.thresholds : __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SlaTimer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WARRANTY_SLA_CONFIGS"].return.thresholds,
                            className: "mt-1"
                        }, void 0, false, {
                            fileName: "[project]/features/warranty/warranty-card.tsx",
                            lineNumber: 204,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between text-body-xs pt-1.5 border-t",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-muted-foreground",
                                    children: [
                                        "Tạo ",
                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDateTime"])(ticket.createdAt)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/warranty/warranty-card.tsx",
                                    lineNumber: 226,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-muted-foreground",
                                    children: [
                                        "CN ",
                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDateTime"])(ticket.updatedAt)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/warranty/warranty-card.tsx",
                                    lineNumber: 227,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/warranty/warranty-card.tsx",
                            lineNumber: 225,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between text-body-xs",
                            children: ticket.status === 'completed' && ticket.completedAt ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-blue-700 font-medium",
                                children: [
                                    "✓ Kết thúc ",
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDateTime"])(ticket.completedAt)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/warranty/warranty-card.tsx",
                                lineNumber: 233,
                                columnNumber: 15
                            }, this) : ticket.returnedAt ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-green-700 font-medium",
                                children: [
                                    "✓ Đã trả ",
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDateTime"])(ticket.returnedAt)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/warranty/warranty-card.tsx",
                                lineNumber: 235,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-muted-foreground",
                                children: [
                                    "Người tạo: ",
                                    ticket.createdBy
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/warranty/warranty-card.tsx",
                                lineNumber: 237,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/features/warranty/warranty-card.tsx",
                            lineNumber: 231,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/warranty/warranty-card.tsx",
                    lineNumber: 168,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/features/warranty/warranty-card.tsx",
            lineNumber: 133,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/features/warranty/warranty-card.tsx",
        lineNumber: 124,
        columnNumber: 5
    }, this);
});
}),
"[project]/features/warranty/warranty-card-context-menu.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WarrantyCardContextMenu",
    ()=>WarrantyCardContextMenu
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$context$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/context-menu.tsx [app-ssr] (ecmascript)");
;
;
function WarrantyCardContextMenu({ ticket, onEdit, onGetLink, onStartProcessing, onMarkProcessed, onMarkReturned, onCancel, onRemind, children }) {
    const { status } = ticket;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$context$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ContextMenu"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$context$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ContextMenuTrigger"], {
                asChild: true,
                children: children
            }, void 0, false, {
                fileName: "[project]/features/warranty/warranty-card-context-menu.tsx",
                lineNumber: 48,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$context$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ContextMenuContent"], {
                className: "w-56",
                children: [
                    status === 'incomplete' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$context$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ContextMenuItem"], {
                                onSelect: ()=>onEdit(ticket.systemId),
                                children: "Sửa thông tin"
                            }, void 0, false, {
                                fileName: "[project]/features/warranty/warranty-card-context-menu.tsx",
                                lineNumber: 55,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$context$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ContextMenuItem"], {
                                onSelect: ()=>onStartProcessing(ticket.systemId),
                                children: "Bắt đầu xử lý"
                            }, void 0, false, {
                                fileName: "[project]/features/warranty/warranty-card-context-menu.tsx",
                                lineNumber: 58,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$context$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ContextMenuItem"], {
                                onSelect: ()=>onGetLink(ticket.systemId),
                                children: "Copy link tracking"
                            }, void 0, false, {
                                fileName: "[project]/features/warranty/warranty-card-context-menu.tsx",
                                lineNumber: 61,
                                columnNumber: 13
                            }, this),
                            onRemind && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$context$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ContextMenuItem"], {
                                onSelect: ()=>onRemind(ticket.systemId),
                                children: "Gửi thông báo nhắc nhở"
                            }, void 0, false, {
                                fileName: "[project]/features/warranty/warranty-card-context-menu.tsx",
                                lineNumber: 65,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$context$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ContextMenuSeparator"], {}, void 0, false, {
                                fileName: "[project]/features/warranty/warranty-card-context-menu.tsx",
                                lineNumber: 69,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$context$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ContextMenuItem"], {
                                onSelect: ()=>onCancel(ticket.systemId),
                                className: "text-destructive focus:text-destructive",
                                children: "Hủy phiếu"
                            }, void 0, false, {
                                fileName: "[project]/features/warranty/warranty-card-context-menu.tsx",
                                lineNumber: 70,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true),
                    status === 'pending' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$context$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ContextMenuItem"], {
                                onSelect: ()=>onEdit(ticket.systemId),
                                children: "Sửa thông tin"
                            }, void 0, false, {
                                fileName: "[project]/features/warranty/warranty-card-context-menu.tsx",
                                lineNumber: 82,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$context$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ContextMenuItem"], {
                                onSelect: ()=>onMarkProcessed(ticket.systemId),
                                children: "Hoàn thành xử lý"
                            }, void 0, false, {
                                fileName: "[project]/features/warranty/warranty-card-context-menu.tsx",
                                lineNumber: 85,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$context$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ContextMenuItem"], {
                                onSelect: ()=>onGetLink(ticket.systemId),
                                children: "Copy link tracking"
                            }, void 0, false, {
                                fileName: "[project]/features/warranty/warranty-card-context-menu.tsx",
                                lineNumber: 88,
                                columnNumber: 13
                            }, this),
                            onRemind && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$context$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ContextMenuItem"], {
                                onSelect: ()=>onRemind(ticket.systemId),
                                children: "Gửi thông báo nhắc nhở"
                            }, void 0, false, {
                                fileName: "[project]/features/warranty/warranty-card-context-menu.tsx",
                                lineNumber: 92,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true),
                    status === 'processed' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$context$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ContextMenuItem"], {
                                onSelect: ()=>onMarkReturned(ticket.systemId),
                                children: "Đã trả hàng cho khách"
                            }, void 0, false, {
                                fileName: "[project]/features/warranty/warranty-card-context-menu.tsx",
                                lineNumber: 102,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$context$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ContextMenuItem"], {
                                onSelect: ()=>onGetLink(ticket.systemId),
                                children: "Copy link tracking"
                            }, void 0, false, {
                                fileName: "[project]/features/warranty/warranty-card-context-menu.tsx",
                                lineNumber: 105,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true),
                    status === 'returned' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$context$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ContextMenuItem"], {
                        onSelect: ()=>onGetLink(ticket.systemId),
                        children: "Copy link tracking"
                    }, void 0, false, {
                        fileName: "[project]/features/warranty/warranty-card-context-menu.tsx",
                        lineNumber: 113,
                        columnNumber: 11
                    }, this),
                    status === 'completed' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$context$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ContextMenuItem"], {
                        onSelect: ()=>onGetLink(ticket.systemId),
                        children: "Copy link tracking"
                    }, void 0, false, {
                        fileName: "[project]/features/warranty/warranty-card-context-menu.tsx",
                        lineNumber: 120,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/warranty/warranty-card-context-menu.tsx",
                lineNumber: 51,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/warranty/warranty-card-context-menu.tsx",
        lineNumber: 47,
        columnNumber: 5
    }, this);
}
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
"[project]/features/warranty/components/dialogs/warranty-cancel-dialog.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WarrantyCancelDialog",
    ()=>WarrantyCancelDialog
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * Cancel Warranty Dialog
 * Dialog để hủy phiếu bảo hành với lý do
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/alert-dialog.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/textarea.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/features/warranty/store.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/store/index.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$payments$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/payments/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$receipts$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/receipts/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/orders/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-ssr] (ecmascript)");
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
function WarrantyCancelDialog({ open, onOpenChange, ticket, onCancelled }) {
    const [cancelReason, setCancelReason] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]('');
    const { user: currentUser } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const { update, findById, addHistory } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useWarrantyStore"])();
    const payments = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$payments$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePaymentStore"])((state)=>state.data);
    const receipts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$receipts$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useReceiptStore"])((state)=>state.data);
    const { data: orders } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useOrderStore"])();
    const handleCancel = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](async ()=>{
        console.log('[CANCEL DIALOG] handleCancel called', {
            hasTicket: !!ticket,
            cancelReason,
            ticketId: ticket?.id
        });
        if (!currentUser) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Vui lòng đăng nhập');
            return;
        }
        if (!ticket || !cancelReason.trim()) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Vui lòng nhập lý do hủy phiếu');
            return;
        }
        try {
            const timestamp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentDate"])());
            // ✅ ROLLBACK KHO khi hủy - Phân biệt theo trạng thái
            const { rollbackWarrantyStock, uncommitWarrantyStock } = await __turbopack_context__.A("[project]/features/warranty/store/stock-management.ts [app-ssr] (ecmascript, async loader)");
            // Check nếu đã xuất kho (completed hoặc returned sau khi completed)
            const hasDeductedStock = ticket.stockDeducted || ticket.status === 'completed';
            if (hasDeductedStock) {
                // Đã xuất kho → Hoàn hàng về kho
                rollbackWarrantyStock(ticket);
                console.log('[CANCEL DIALOG] Rollback completed/returned warranty (restore stock):', {
                    status: ticket.status,
                    ticketId: ticket.id,
                    stockDeducted: ticket.stockDeducted,
                    products: ticket.products.filter((p)=>p.resolution === 'replace').length
                });
            } else if (ticket.status === 'pending' || ticket.status === 'processed') {
                // Chưa xuất kho, chỉ uncommit (giải phóng hàng giữ chỗ)
                uncommitWarrantyStock(ticket);
                console.log('[CANCEL DIALOG] Uncommit pending/processing warranty:', {
                    status: ticket.status,
                    ticketId: ticket.id
                });
            } else if (ticket.status === 'returned') {
                // Đã trả hàng nhưng chưa kết thúc → vẫn đang giữ hàng thay thế
                uncommitWarrantyStock(ticket);
                console.log('[CANCEL DIALOG] Uncommit returned warranty:', {
                    status: ticket.status,
                    ticketId: ticket.id
                });
            }
            // incomplete: không làm gì cả (chưa commit)
            // CANCEL ALL PAYMENT & RECEIPT VOUCHERS linked to this warranty
            const relatedPayments = payments.filter((p)=>p.linkedWarrantySystemId === ticket.systemId && p.status !== 'cancelled');
            const relatedReceipts = receipts.filter((r)=>r.linkedWarrantySystemId === ticket.systemId && r.status !== 'cancelled');
            console.log('[CANCEL DIALOG] Found transactions:', {
                payments: relatedPayments.length,
                receipts: relatedReceipts.length,
                paymentIds: relatedPayments.map((p)=>p.id),
                receiptIds: relatedReceipts.map((r)=>r.id)
            });
            const allVouchers = [
                ...relatedPayments,
                ...relatedReceipts
            ];
            if (allVouchers.length > 0) {
                const paymentStore = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$payments$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePaymentStore"].getState();
                const receiptStore = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$receipts$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useReceiptStore"].getState();
                const orderStore = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useOrderStore"].getState();
                const cancelledCount = {
                    payments: 0,
                    receipts: 0
                };
                // Soft delete payments - update status to 'cancelled' + save cancelReason in description
                relatedPayments.forEach((payment)=>{
                    const newDescription = `[HỦY] ${cancelReason}${payment.description ? ` | Gốc: ${payment.description}` : ''}`;
                    console.log('[CANCEL DIALOG] Saving payment with description:', {
                        paymentId: payment.id,
                        originalDesc: payment.description,
                        newDescription,
                        cancelReason
                    });
                    paymentStore.update(payment.systemId, {
                        ...payment,
                        status: 'cancelled',
                        cancelledAt: timestamp,
                        description: newDescription
                    });
                    cancelledCount.payments++;
                    console.log('[WARRANTY CANCEL] Cancelled payment:', payment.id);
                    // ✅ UPDATE ORDER: Remove payment from order.payments and decrease paidAmount
                    if (payment.linkedOrderSystemId) {
                        const order = orders.find((o)=>o.systemId === payment.linkedOrderSystemId);
                        if (order) {
                            // Remove this payment from order.payments array
                            const updatedPayments = order.payments.filter((p)=>p.systemId !== payment.systemId);
                            // Decrease paidAmount (payment.amount is negative, so we subtract it back)
                            const newPaidAmount = (order.paidAmount || 0) - Math.abs(payment.amount);
                            console.log('[WARRANTY CANCEL] Updating order:', {
                                orderId: order.id,
                                oldPaidAmount: order.paidAmount,
                                newPaidAmount,
                                removedPayment: payment.id
                            });
                            orderStore.update(payment.linkedOrderSystemId, {
                                payments: updatedPayments,
                                paidAmount: Math.max(0, newPaidAmount)
                            });
                        }
                    }
                });
                // Soft delete receipts - update status to 'cancelled' + save cancelReason in description
                relatedReceipts.forEach((receipt)=>{
                    receiptStore.update(receipt.systemId, {
                        ...receipt,
                        status: 'cancelled',
                        cancelledAt: timestamp,
                        description: `[HỦY] ${cancelReason}${receipt.description ? ` | Gốc: ${receipt.description}` : ''}`
                    });
                    cancelledCount.receipts++;
                    console.log('[WARRANTY CANCEL] Cancelled receipt:', receipt.id);
                });
                const voucherList = allVouchers.map((v)=>`${v.id} (${v.amount.toLocaleString('vi-VN')}đ)`).join(', ');
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].warning(`Đã hủy ${cancelledCount.payments} phiếu chi và ${cancelledCount.receipts} phiếu thu`, {
                    description: voucherList,
                    duration: 5000
                });
                addHistory(ticket.systemId, `🗑️ Hủy ${allVouchers.length} phiếu thu/chi (${cancelledCount.payments} phiếu chi, ${cancelledCount.receipts} phiếu thu)`, currentUser.name, `Danh sách: ${voucherList}`);
            }
            // Update warranty ticket status to 'cancelled'
            const latestTicket = findById(ticket.systemId);
            if (!latestTicket) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Không tìm thấy phiếu');
                return;
            }
            const newHistory = {
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(`history_${Date.now()}`),
                action: 'Hủy phiếu bảo hành',
                actionLabel: 'Đã hủy phiếu',
                entityType: 'status',
                performedBy: currentUser.name,
                performedAt: timestamp,
                note: `Lý do: ${cancelReason}`
            };
            const updatedTicket = {
                ...latestTicket,
                status: 'cancelled',
                cancelledAt: timestamp,
                cancelReason,
                linkedOrderSystemId: undefined,
                stockDeducted: false,
                history: [
                    ...latestTicket.history,
                    newHistory
                ]
            };
            update(ticket.systemId, updatedTicket);
            onCancelled?.(updatedTicket);
            onOpenChange(false);
            setCancelReason('');
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success('Đã hủy phiếu bảo hành');
        } catch (error) {
            console.error('Failed to cancel ticket:', error);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Không thể hủy phiếu');
        }
    }, [
        ticket,
        cancelReason,
        update,
        currentUser,
        findById,
        payments,
        receipts,
        addHistory,
        onOpenChange,
        orders
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialog"], {
        open: open,
        onOpenChange: onOpenChange,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogContent"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogHeader"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogTitle"], {
                            children: "Xác nhận hủy phiếu bảo hành"
                        }, void 0, false, {
                            fileName: "[project]/features/warranty/components/dialogs/warranty-cancel-dialog.tsx",
                            lineNumber: 234,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogDescription"], {
                            children: "Bạn có chắc chắn muốn hủy phiếu bảo hành này? Vui lòng nhập lý do hủy."
                        }, void 0, false, {
                            fileName: "[project]/features/warranty/components/dialogs/warranty-cancel-dialog.tsx",
                            lineNumber: 235,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/warranty/components/dialogs/warranty-cancel-dialog.tsx",
                    lineNumber: 233,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Textarea"], {
                    value: cancelReason,
                    onChange: (e)=>setCancelReason(e.target.value),
                    placeholder: "Nhập lý do hủy phiếu (bắt buộc)...",
                    className: "min-h-[100px]"
                }, void 0, false, {
                    fileName: "[project]/features/warranty/components/dialogs/warranty-cancel-dialog.tsx",
                    lineNumber: 239,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogFooter"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogCancel"], {
                            onClick: ()=>setCancelReason(''),
                            children: "Hủy"
                        }, void 0, false, {
                            fileName: "[project]/features/warranty/components/dialogs/warranty-cancel-dialog.tsx",
                            lineNumber: 246,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogAction"], {
                            onClick: handleCancel,
                            className: "bg-destructive hover:bg-destructive/90",
                            children: "Hủy phiếu"
                        }, void 0, false, {
                            fileName: "[project]/features/warranty/components/dialogs/warranty-cancel-dialog.tsx",
                            lineNumber: 247,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/warranty/components/dialogs/warranty-cancel-dialog.tsx",
                    lineNumber: 245,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/features/warranty/components/dialogs/warranty-cancel-dialog.tsx",
            lineNumber: 232,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/features/warranty/components/dialogs/warranty-cancel-dialog.tsx",
        lineNumber: 231,
        columnNumber: 5
    }, this);
}
}),
"[project]/features/warranty/components/logic/processing.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Warranty Processing Logic
 * Gom toàn bộ tính toán/payment state cho module warranty
 */ __turbopack_context__.s([
    "areAllTransactionsCancelled",
    ()=>areAllTransactionsCancelled,
    "calculateTotalPaid",
    ()=>calculateTotalPaid,
    "calculateWarrantyProcessingState",
    ()=>calculateWarrantyProcessingState,
    "canShowActionButtons",
    ()=>canShowActionButtons,
    "canShowPaymentButton",
    ()=>canShowPaymentButton,
    "canShowReceiptButton",
    ()=>canShowReceiptButton,
    "debugWarrantyProcessing",
    ()=>debugWarrantyProcessing,
    "getWarrantyPayments",
    ()=>getWarrantyPayments,
    "getWarrantyReceipts",
    ()=>getWarrantyReceipts,
    "hasAnyTransactions",
    ()=>hasAnyTransactions,
    "shouldHideCard",
    ()=>shouldHideCard
]);
function getWarrantyPayments(payments, warrantySystemId) {
    return payments.filter((p)=>p.linkedWarrantySystemId === warrantySystemId && p.status !== 'cancelled').sort((a, b)=>new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
function getWarrantyReceipts(receipts, warrantySystemId) {
    return receipts.filter((r)=>r.linkedWarrantySystemId === warrantySystemId && r.status !== 'cancelled').sort((a, b)=>new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
function calculateTotalPaid(payments, receipts) {
    const totalPayments = payments.filter((p)=>p.status !== 'cancelled').reduce((sum, p)=>sum + p.amount, 0);
    const totalReceipts = receipts.filter((r)=>r.status !== 'cancelled').reduce((sum, r)=>sum + r.amount, 0);
    return {
        totalPayments,
        totalReceipts
    };
}
function hasAnyTransactions(payments, receipts) {
    return payments.length > 0 || receipts.length > 0;
}
function areAllTransactionsCancelled(payments, receipts) {
    const allTransactions = [
        ...payments,
        ...receipts
    ];
    return allTransactions.length > 0 && allTransactions.every((t)=>t.status === 'cancelled');
}
function shouldHideCard(ticket, hasTransactions) {
    if (!ticket) return true;
    return !hasTransactions && (ticket.status === 'incomplete' || ticket.status === 'pending' || !!ticket.cancelledAt);
}
function canShowActionButtons(ticket, totalPayment, remainingAmount, hasTransactions, allTransactionsCancelled) {
    if (!ticket) return false;
    const notCancelled = !ticket.cancelledAt;
    const hasPaymentNeeded = totalPayment !== 0;
    const hasRemainingAmount = remainingAmount > 0;
    const isInProcessingStage = ticket.status === 'processed' || ticket.status === 'returned' || ticket.status === 'completed';
    const hasExistingTransactions = hasTransactions;
    return notCancelled && hasPaymentNeeded && hasRemainingAmount && (isInProcessingStage || hasExistingTransactions);
}
function canShowPaymentButton(canShowActions, totalPayment) {
    return canShowActions && totalPayment > 0;
}
function canShowReceiptButton(canShowActions, totalPayment) {
    return canShowActions && totalPayment < 0;
}
function calculateWarrantyProcessingState(ticket, payments, receipts, totalPayment) {
    if (!ticket) {
        return {
            ticket: null,
            payments: [],
            receipts: [],
            totalPayment: 0,
            warrantyPayments: [],
            warrantyReceipts: [],
            totalPaid: 0,
            remainingAmount: 0,
            hasTransactions: false,
            allTransactionsCancelled: false,
            shouldHideCard: true,
            canShowActionButtons: false,
            canShowPaymentButton: false,
            canShowReceiptButton: false
        };
    }
    const warrantyPayments = getWarrantyPayments(payments, ticket.systemId);
    const warrantyReceipts = getWarrantyReceipts(receipts, ticket.systemId);
    const { totalPayments, totalReceipts } = calculateTotalPaid(warrantyPayments, warrantyReceipts);
    let remainingAmount = 0;
    if (totalPayment > 0) {
        remainingAmount = totalPayment - totalPayments;
    } else if (totalPayment < 0) {
        remainingAmount = Math.abs(totalPayment) - totalReceipts;
    }
    const totalPaid = totalReceipts - totalPayments;
    const hasTransactions = hasAnyTransactions(warrantyPayments, warrantyReceipts);
    const allTransactionsCancelled = areAllTransactionsCancelled(warrantyPayments, warrantyReceipts);
    const hideCard = shouldHideCard(ticket, hasTransactions);
    const showActionButtons = canShowActionButtons(ticket, totalPayment, remainingAmount, hasTransactions, allTransactionsCancelled);
    const showPaymentButton = canShowPaymentButton(showActionButtons, totalPayment);
    const showReceiptButton = canShowReceiptButton(showActionButtons, totalPayment);
    return {
        ticket,
        payments,
        receipts,
        totalPayment,
        warrantyPayments,
        warrantyReceipts,
        totalPaid,
        remainingAmount,
        hasTransactions,
        allTransactionsCancelled,
        shouldHideCard: hideCard,
        canShowActionButtons: showActionButtons,
        canShowPaymentButton: showPaymentButton,
        canShowReceiptButton: showReceiptButton
    };
}
function debugWarrantyProcessing(state) {
    console.group('[WARRANTY PROCESSING] Debug State');
    console.log('Input:', {
        ticketId: state.ticket?.id,
        ticketStatus: state.ticket?.status,
        cancelledAt: state.ticket?.cancelledAt,
        totalPayment: state.totalPayment
    });
    console.log('Calculations:', {
        warrantyPayments: state.warrantyPayments.length,
        warrantyReceipts: state.warrantyReceipts.length,
        totalPaid: state.totalPaid,
        remainingAmount: state.remainingAmount,
        hasTransactions: state.hasTransactions,
        allCancelled: state.allTransactionsCancelled
    });
    console.log('Display Flags:', {
        shouldHideCard: state.shouldHideCard,
        canShowActionButtons: state.canShowActionButtons,
        canShowPaymentButton: state.canShowPaymentButton,
        canShowReceiptButton: state.canShowReceiptButton
    });
    console.groupEnd();
}
}),
"[project]/features/warranty/components/dialogs/insufficient-balance-dialog.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "InsufficientBalanceDialog",
    ()=>InsufficientBalanceDialog
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dialog.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/alert.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/badge.tsx [app-ssr] (ecmascript)");
;
;
;
;
;
;
function InsufficientBalanceDialog({ open, onOpenChange, totalAmount, orderAmount, shortageAmount, orderLabel, onSelectMixed, onSelectCashOnly }) {
    const formatCurrency = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((value)=>{
        return value.toLocaleString('vi-VN');
    }, []);
    const recommendedOrderAmount = Math.min(orderAmount, totalAmount);
    const recommendedCashAmount = Math.max(shortageAmount, 0);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Dialog"], {
        open: open,
        onOpenChange: onOpenChange,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogContent"], {
            className: "max-w-2xl",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogHeader"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogTitle"], {
                            children: "Xử lý khi đơn không đủ để bù trừ"
                        }, void 0, false, {
                            fileName: "[project]/features/warranty/components/dialogs/insufficient-balance-dialog.tsx",
                            lineNumber: 46,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogDescription"], {
                            children: [
                                "Đơn ",
                                orderLabel ?? 'đã chọn',
                                " không đủ để bù trừ toàn bộ số tiền bảo hành. Chọn phương án phù hợp bên dưới."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/warranty/components/dialogs/insufficient-balance-dialog.tsx",
                            lineNumber: 47,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/warranty/components/dialogs/insufficient-balance-dialog.tsx",
                    lineNumber: 45,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Alert"], {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDescription"], {
                                className: "space-y-1 text-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            "Số tiền cần hoàn: ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: [
                                                    formatCurrency(totalAmount),
                                                    " đ"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/warranty/components/dialogs/insufficient-balance-dialog.tsx",
                                                lineNumber: 55,
                                                columnNumber: 38
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/warranty/components/dialogs/insufficient-balance-dialog.tsx",
                                        lineNumber: 55,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            "Đơn ",
                                            orderLabel ?? '',
                                            " còn lại: ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: [
                                                    formatCurrency(orderAmount),
                                                    " đ"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/warranty/components/dialogs/insufficient-balance-dialog.tsx",
                                                lineNumber: 56,
                                                columnNumber: 52
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/warranty/components/dialogs/insufficient-balance-dialog.tsx",
                                        lineNumber: 56,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            "Thiếu: ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                className: "text-red-600",
                                                children: [
                                                    formatCurrency(shortageAmount),
                                                    " đ"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/warranty/components/dialogs/insufficient-balance-dialog.tsx",
                                                lineNumber: 57,
                                                columnNumber: 27
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/warranty/components/dialogs/insufficient-balance-dialog.tsx",
                                        lineNumber: 57,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/warranty/components/dialogs/insufficient-balance-dialog.tsx",
                                lineNumber: 54,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/features/warranty/components/dialogs/insufficient-balance-dialog.tsx",
                            lineNumber: 53,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid gap-3 md:grid-cols-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "rounded-lg border border-border p-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-start justify-between gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "font-semibold",
                                                            children: "Bù trừ đơn + Chi tiền mặt"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/warranty/components/dialogs/insufficient-balance-dialog.tsx",
                                                            lineNumber: 65,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-muted-foreground",
                                                            children: "Trừ tối đa vào đơn, phần thiếu chi trực tiếp."
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/warranty/components/dialogs/insufficient-balance-dialog.tsx",
                                                            lineNumber: 66,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/warranty/components/dialogs/insufficient-balance-dialog.tsx",
                                                    lineNumber: 64,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                                    variant: "secondary",
                                                    children: "Khuyến nghị"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/warranty/components/dialogs/insufficient-balance-dialog.tsx",
                                                    lineNumber: 68,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/warranty/components/dialogs/insufficient-balance-dialog.tsx",
                                            lineNumber: 63,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                            className: "mt-3 space-y-1 text-sm text-muted-foreground",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: [
                                                        "Trừ vào đơn: ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: [
                                                                formatCurrency(recommendedOrderAmount),
                                                                " đ"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/features/warranty/components/dialogs/insufficient-balance-dialog.tsx",
                                                            lineNumber: 71,
                                                            columnNumber: 34
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/warranty/components/dialogs/insufficient-balance-dialog.tsx",
                                                    lineNumber: 71,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: [
                                                        "Chi trực tiếp: ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: [
                                                                formatCurrency(recommendedCashAmount),
                                                                " đ"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/features/warranty/components/dialogs/insufficient-balance-dialog.tsx",
                                                            lineNumber: 72,
                                                            columnNumber: 36
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/warranty/components/dialogs/insufficient-balance-dialog.tsx",
                                                    lineNumber: 72,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/warranty/components/dialogs/insufficient-balance-dialog.tsx",
                                            lineNumber: 70,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                            className: "mt-4 w-full",
                                            onClick: onSelectMixed,
                                            children: "Áp dụng phương án này"
                                        }, void 0, false, {
                                            fileName: "[project]/features/warranty/components/dialogs/insufficient-balance-dialog.tsx",
                                            lineNumber: 74,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/warranty/components/dialogs/insufficient-balance-dialog.tsx",
                                    lineNumber: 62,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "rounded-lg border border-border p-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-start justify-between gap-3",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "font-semibold",
                                                        children: "Chỉ chi tiền mặt"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/warranty/components/dialogs/insufficient-balance-dialog.tsx",
                                                        lineNumber: 82,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm text-muted-foreground",
                                                        children: "Không trừ vào đơn, chi toàn bộ cho khách."
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/warranty/components/dialogs/insufficient-balance-dialog.tsx",
                                                        lineNumber: 83,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/warranty/components/dialogs/insufficient-balance-dialog.tsx",
                                                lineNumber: 81,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/features/warranty/components/dialogs/insufficient-balance-dialog.tsx",
                                            lineNumber: 80,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                            className: "mt-3 space-y-1 text-sm text-muted-foreground",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: [
                                                        "Trừ vào đơn: ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "0 đ"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/warranty/components/dialogs/insufficient-balance-dialog.tsx",
                                                            lineNumber: 87,
                                                            columnNumber: 34
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/warranty/components/dialogs/insufficient-balance-dialog.tsx",
                                                    lineNumber: 87,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: [
                                                        "Chi trực tiếp: ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: [
                                                                formatCurrency(totalAmount),
                                                                " đ"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/features/warranty/components/dialogs/insufficient-balance-dialog.tsx",
                                                            lineNumber: 88,
                                                            columnNumber: 36
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/warranty/components/dialogs/insufficient-balance-dialog.tsx",
                                                    lineNumber: 88,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/warranty/components/dialogs/insufficient-balance-dialog.tsx",
                                            lineNumber: 86,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                            variant: "outline",
                                            className: "mt-4 w-full",
                                            onClick: onSelectCashOnly,
                                            children: "Chuyển sang chi tiền trực tiếp"
                                        }, void 0, false, {
                                            fileName: "[project]/features/warranty/components/dialogs/insufficient-balance-dialog.tsx",
                                            lineNumber: 90,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/warranty/components/dialogs/insufficient-balance-dialog.tsx",
                                    lineNumber: 79,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/warranty/components/dialogs/insufficient-balance-dialog.tsx",
                            lineNumber: 61,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/warranty/components/dialogs/insufficient-balance-dialog.tsx",
                    lineNumber: 52,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogFooter"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                        variant: "ghost",
                        onClick: ()=>onOpenChange(false),
                        children: "Đóng"
                    }, void 0, false, {
                        fileName: "[project]/features/warranty/components/dialogs/insufficient-balance-dialog.tsx",
                        lineNumber: 98,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/features/warranty/components/dialogs/insufficient-balance-dialog.tsx",
                    lineNumber: 97,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/features/warranty/components/dialogs/insufficient-balance-dialog.tsx",
            lineNumber: 44,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/features/warranty/components/dialogs/insufficient-balance-dialog.tsx",
        lineNumber: 43,
        columnNumber: 5
    }, this);
}
}),
"[project]/features/warranty/utils/payment-calculations.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "calculateWarrantySettlementTotal",
    ()=>calculateWarrantySettlementTotal
]);
const MONEY_RESOLUTIONS = new Set([
    'out_of_stock'
]);
function calculateWarrantySettlementTotal(ticket) {
    if (!ticket) {
        return 0;
    }
    const productCompensation = (ticket.products || []).reduce((sum, product)=>{
        if (!product) {
            return sum;
        }
        if (MONEY_RESOLUTIONS.has(product.resolution)) {
            const quantity = product.quantity ?? 0;
            const unitPrice = product.unitPrice ?? 0;
            return sum + quantity * unitPrice;
        }
        return sum;
    }, 0);
    return productCompensation + (ticket.shippingFee ?? 0);
}
}),
"[project]/features/warranty/utils/settlement-store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "recordWarrantySettlementMethods",
    ()=>recordWarrantySettlementMethods
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/features/warranty/store.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/store/index.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
;
;
const METHOD_ID_PREFIX = 'SM';
const SETTLEMENT_ID_PREFIX = 'SET';
const generateMethodId = (index)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(`${METHOD_ID_PREFIX}_${Date.now()}_${index}_${Math.random().toString(36).slice(2, 6).toUpperCase()}`);
const normalizeMethod = (method, index)=>{
    const createdAt = method.createdAt ?? new Date().toISOString();
    const status = method.status ?? 'completed';
    const completedAt = status === 'completed' ? method.completedAt ?? createdAt : method.completedAt;
    return {
        ...method,
        amount: Math.abs(method.amount),
        systemId: method.systemId ?? generateMethodId(index),
        createdAt,
        status,
        completedAt
    };
};
const mergeMethods = (existing, incoming)=>{
    const byId = new Map();
    existing.forEach((method)=>byId.set(method.systemId, method));
    incoming.forEach((method)=>byId.set(method.systemId, method));
    return Array.from(byId.values()).sort((a, b)=>new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
};
const calculateProgress = (totalAmount, methods)=>{
    const absoluteTotal = Math.abs(totalAmount);
    const settledAmount = methods.filter((method)=>method.status !== 'cancelled').reduce((sum, method)=>sum + Math.abs(method.amount), 0);
    const remainingAmount = Math.max(absoluteTotal - settledAmount, 0);
    const status = remainingAmount <= 0 ? 'completed' : settledAmount > 0 ? 'partial' : 'pending';
    return {
        settledAmount,
        remainingAmount,
        status
    };
};
function recordWarrantySettlementMethods({ ticket, settlementType, totalAmount, methods }) {
    if (!ticket || !methods.length) {
        return;
    }
    const normalizedMethods = methods.map(normalizeMethod);
    const store = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useWarrantyStore"].getState();
    const existingSettlement = ticket.settlement;
    const existingMethods = existingSettlement?.methods ?? [];
    const mergedMethods = mergeMethods(existingMethods, normalizedMethods);
    const now = new Date().toISOString();
    const inferredSettlementType = settlementType === 'mixed' || mergedMethods.length > 1 ? 'mixed' : mergedMethods[0]?.type ?? settlementType;
    const { settledAmount, remainingAmount, status } = calculateProgress(totalAmount, mergedMethods);
    const settlement = {
        systemId: existingSettlement?.systemId ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(`${SETTLEMENT_ID_PREFIX}_${Date.now()}`),
        warrantyId: ticket.systemId,
        settlementType: inferredSettlementType,
        totalAmount,
        settledAmount,
        remainingAmount,
        unsettledProducts: existingSettlement?.unsettledProducts ?? [],
        paymentVoucherId: inferredSettlementType !== 'mixed' ? mergedMethods.find((method)=>method.type === inferredSettlementType)?.paymentVoucherId ?? existingSettlement?.paymentVoucherId : undefined,
        debtTransactionId: existingSettlement?.debtTransactionId,
        voucherCode: existingSettlement?.voucherCode,
        linkedOrderSystemId: mergedMethods.find((method)=>method.type === 'order_deduction')?.linkedOrderSystemId ?? existingSettlement?.linkedOrderSystemId,
        methods: mergedMethods,
        status,
        settledAt: status === 'completed' ? existingSettlement?.settledAt ?? now : existingSettlement?.settledAt,
        settledBy: status === 'completed' ? existingSettlement?.settledBy ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SYSTEM') : existingSettlement?.settledBy,
        notes: existingSettlement?.notes ?? '',
        createdAt: existingSettlement?.createdAt ?? now,
        updatedAt: now
    };
    store.update(ticket.systemId, {
        settlement
    });
}
}),
"[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WarrantyPaymentVoucherDialog",
    ()=>WarrantyPaymentVoucherDialog
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * WarrantyPaymentVoucherDialog
 * 
 * Dialog tạo phiếu chi (payment voucher) từ warranty
 * - Auto-fill số tiền từ remainingAmount
 * - Chọn phương thức: Cash / Bank Transfer
 * - Optional: Link đơn hàng để trừ vào tiền hàng
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hook-form/dist/index.esm.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dialog.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/label.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$currency$2d$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/currency-input.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/textarea.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/select.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/alert.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-ssr] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-ssr] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$payments$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/payments/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$receipts$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/receipts/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/orders/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/features/warranty/store.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/store/index.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$payments$2f$types$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/payments/types/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$payments$2f$methods$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/payments/methods/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$cashbook$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/cashbook/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$order$2d$search$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/orders/order-search-api.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$virtualized$2d$combobox$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/virtualized-combobox.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$components$2f$logic$2f$processing$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/components/logic/processing.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$components$2f$dialogs$2f$insufficient$2d$balance$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/components/dialogs/insufficient-balance-dialog.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$utils$2f$payment$2d$calculations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/utils/payment-calculations.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$utils$2f$settlement$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/utils/settlement-store.ts [app-ssr] (ecmascript)");
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
const detectDirectSettlementType = (paymentMethod)=>{
    if (!paymentMethod) {
        return 'cash';
    }
    const normalizedId = paymentMethod.id?.toUpperCase() || '';
    const normalizedName = paymentMethod.name.toLowerCase();
    if (normalizedId === 'TIEN_MAT' || normalizedName.includes('tiền mặt')) {
        return 'cash';
    }
    if (normalizedId === 'VI_DIEN_TU' || normalizedName.includes('momo') || normalizedName.includes('ví')) {
        return 'transfer';
    }
    return 'transfer';
};
function WarrantyPaymentVoucherDialog({ warrantyId, warrantySystemId, customer, defaultAmount = 0, linkedOrderId, branchSystemId, branchName, existingPayments = [] }) {
    const [open, setOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](false);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { add: addPayment, data: payments } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$payments$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePaymentStore"])();
    const { data: receipts } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$receipts$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useReceiptStore"])();
    const { data: orders, update: updateOrder } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useOrderStore"])();
    const { findById: findWarrantyById, addHistory } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useWarrantyStore"])();
    const { data: paymentTypes } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$payments$2f$types$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePaymentTypeStore"])();
    const { data: paymentMethods } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$payments$2f$methods$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePaymentMethodStore"])();
    const { accounts } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$cashbook$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCashbookStore"])();
    const { employee: authEmployee } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const currentUserSystemId = authEmployee?.systemId ?? 'SYSTEM';
    const currentUserName = authEmployee?.fullName || authEmployee?.id || 'Hệ thống';
    // Order search state
    const [orderSearchQuery, setOrderSearchQuery] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]('');
    const [orderSearchResults, setOrderSearchResults] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]([]);
    const [isSearchingOrders, setIsSearchingOrders] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](false);
    // Get warranty payment types
    const warrantyRefundType = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>paymentTypes.find((t)=>t.id === 'HOANTIEN_BH' && t.isActive), [
        paymentTypes
    ]);
    const warrantyOrderDeductionType = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>paymentTypes.find((t)=>t.id === 'TRAVAO_DONHANG' && t.isActive), [
        paymentTypes
    ]);
    // Get default payment method (Tiền mặt)
    const defaultPaymentMethod = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>paymentMethods.find((m)=>m.isDefault && m.isActive) || paymentMethods.find((m)=>m.isActive), [
        paymentMethods
    ]);
    // Get default cash account
    const defaultCashAccount = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>accounts.find((a)=>a.type === 'cash' && a.isDefault && a.isActive) || accounts.find((a)=>a.type === 'cash' && a.isActive), [
        accounts
    ]);
    // ✅ Tính số tiền còn lại THỰC TẾ dùng warranty-processing-logic
    const ticket = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>findWarrantyById((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(warrantySystemId)), [
        findWarrantyById,
        warrantySystemId
    ]);
    const actualRemainingAmount = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        // ✅ Tính lại từ ticket thực tế, KHÔNG dùng defaultAmount (vì nó đã bị trừ)
        if (!ticket) return 0;
        // Tính totalPayment từ ticket (giống WarrantyProcessingCard)
        const totalPaymentFromTicket = ticket.products.reduce((sum, p)=>{
            if (p.resolution === 'out_of_stock') {
                return sum + (p.quantity || 0) * (p.unitPrice || 0);
            }
            return sum;
        }, 0) + (ticket.shippingFee || 0);
        const state = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$components$2f$logic$2f$processing$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateWarrantyProcessingState"])(ticket, payments, receipts, totalPaymentFromTicket);
        console.log('💰 [ACTUAL REMAINING CALCULATION]', {
            totalPaymentFromTicket,
            remainingAmount: state.remainingAmount,
            warrantySystemId,
            paymentsCount: state.warrantyPayments.length,
            receiptsCount: state.warrantyReceipts.length,
            warrantyPaymentsTotal: state.warrantyPayments.reduce((sum, p)=>p.status !== 'cancelled' ? sum + p.amount : sum, 0)
        });
        return state.remainingAmount;
    }, [
        ticket,
        payments,
        receipts,
        warrantySystemId
    ]);
    const { control, handleSubmit, watch, reset, setValue } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useForm"])({
        defaultValues: {
            amount: 0,
            settlementType: 'direct_payment',
            paymentMethodSystemId: defaultPaymentMethod?.systemId,
            accountSystemId: defaultCashAccount?.systemId,
            selectedOrderId: linkedOrderId,
            notes: `Hoàn tiền bảo hành ${warrantyId}`,
            mixedOrderAmount: undefined,
            mixedCashAmount: undefined
        }
    });
    const settlementType = watch('settlementType');
    const selectedOrderId = watch('selectedOrderId');
    const paymentMethodSystemId = watch('paymentMethodSystemId');
    const accountSystemId = watch('accountSystemId');
    const amount = watch('amount');
    const mixedOrderAmount = watch('mixedOrderAmount');
    const mixedCashAmount = watch('mixedCashAmount');
    // Get selected payment method to determine account type
    const selectedPaymentMethod = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>paymentMethods.find((m)=>m.systemId === paymentMethodSystemId), [
        paymentMethods,
        paymentMethodSystemId
    ]);
    // Filter accounts based on payment method
    // Tiền mặt → cash accounts, Chuyển khoản → bank accounts
    const filteredAccounts = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        if (!selectedPaymentMethod) return accounts.filter((a)=>a.isActive);
        const isCashMethod = selectedPaymentMethod.name.toLowerCase().includes('tiền mặt') || selectedPaymentMethod.id === 'TIEN_MAT';
        const accountType = isCashMethod ? 'cash' : 'bank';
        return accounts.filter((a)=>a.isActive && a.type === accountType);
    }, [
        accounts,
        selectedPaymentMethod
    ]);
    // Auto-select appropriate account when payment method changes
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        if (!selectedPaymentMethod || settlementType !== 'direct_payment') return;
        const isCashMethod = selectedPaymentMethod.name.toLowerCase().includes('tiền mặt') || selectedPaymentMethod.id === 'TIEN_MAT';
        const accountType = isCashMethod ? 'cash' : 'bank';
        // Find default account of the correct type
        const defaultAccount = accounts.find((a)=>a.type === accountType && a.isDefault && a.isActive) || accounts.find((a)=>a.type === accountType && a.isActive);
        if (defaultAccount) {
            setValue('accountSystemId', defaultAccount.systemId);
        }
    }, [
        selectedPaymentMethod,
        accounts,
        setValue,
        settlementType
    ]);
    // Reset form when dialog opens và auto-fill số tiền tối đa
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        if (open) {
            reset({
                amount: actualRemainingAmount,
                settlementType: 'direct_payment',
                paymentMethodSystemId: defaultPaymentMethod?.systemId,
                accountSystemId: defaultCashAccount?.systemId,
                selectedOrderId: linkedOrderId,
                notes: `Hoàn tiền bảo hành ${warrantyId}`,
                mixedOrderAmount: undefined,
                mixedCashAmount: undefined
            });
        }
    }, [
        open,
        linkedOrderId,
        warrantyId,
        reset,
        defaultPaymentMethod,
        defaultCashAccount,
        actualRemainingAmount
    ]);
    // Server-side search for orders with debounce - ONLY SHOW ORDERS NOT SHIPPED YET
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        const performSearch = async ()=>{
            setIsSearchingOrders(true);
            try {
                const results = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$order$2d$search$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["searchOrders"])({
                    query: orderSearchQuery,
                    limit: 50
                }, orders);
                // Filter: Only show orders that:
                // 1. NOT been shipped yet (stockOutStatus === 'Chưa xuất kho')
                // 2. Still have remaining amount to deduct (grandTotal - paidAmount > 0)
                const unshippedResults = results.filter((result)=>{
                    const order = orders.find((o)=>o.systemId === result.value);
                    if (!order) return false;
                    // Check if order is not shipped yet
                    if (order.stockOutStatus !== 'Chưa xuất kho') return false;
                    // Calculate remaining amount (grandTotal - already paid from warranty)
                    const paidAmount = order.paidAmount || 0;
                    const remainingAmount = order.grandTotal - paidAmount;
                    // Only show orders with remaining amount > 0
                    return remainingAmount > 0;
                });
                // Update subtitle to show remaining amount
                const resultsWithRemaining = unshippedResults.map((result)=>{
                    const order = orders.find((o)=>o.systemId === result.value);
                    if (!order) return result;
                    const paidAmount = order.paidAmount || 0;
                    const remainingAmount = order.grandTotal - paidAmount;
                    return {
                        ...result,
                        subtitle: `${order.grandTotal.toLocaleString('vi-VN')} đ • Còn lại: ${remainingAmount.toLocaleString('vi-VN')} đ • ${order.orderDate}`
                    };
                });
                setOrderSearchResults(resultsWithRemaining);
            } catch (error) {
                console.error('Order search error:', error);
                setOrderSearchResults([]);
            } finally{
                setIsSearchingOrders(false);
            }
        };
        performSearch();
    }, [
        orderSearchQuery,
        orders
    ]);
    // Memoize selected order value for VirtualizedCombobox
    const selectedOrderValue = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        if (!selectedOrderId) return null;
        const order = orders.find((o)=>o.systemId === selectedOrderId);
        if (!order) return null;
        const paidAmount = order.paidAmount || 0;
        const remainingAmount = order.grandTotal - paidAmount;
        return {
            value: order.systemId,
            label: `${order.id} - ${order.customerName}`,
            subtitle: `${order.grandTotal.toLocaleString('vi-VN')} đ • Còn lại: ${remainingAmount.toLocaleString('vi-VN')} đ • ${order.orderDate}`
        };
    }, [
        selectedOrderId,
        orders
    ]);
    // Get selected order details for validation
    const selectedOrder = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>orders.find((o)=>o.systemId === selectedOrderId), [
        orders,
        selectedOrderId
    ]);
    const [insufficientDialogOpen, setInsufficientDialogOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](false);
    const orderRemainingAmount = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        if (!selectedOrder) return 0;
        const orderPaidAmount = selectedOrder.paidAmount || 0;
        return Math.max(selectedOrder.grandTotal - orderPaidAmount, 0);
    }, [
        selectedOrder
    ]);
    const shortageAmount = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        if (!selectedOrder) return 0;
        return Math.max(actualRemainingAmount - orderRemainingAmount, 0);
    }, [
        selectedOrder,
        actualRemainingAmount,
        orderRemainingAmount
    ]);
    const shouldShowInsufficientWarning = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        if (!selectedOrder) return false;
        return settlementType === 'order_deduction' && shortageAmount > 0;
    }, [
        settlementType,
        selectedOrder,
        shortageAmount
    ]);
    const applyMixedSuggestion = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](()=>{
        if (!selectedOrder) return;
        const orderAllocation = Math.min(orderRemainingAmount, actualRemainingAmount);
        const cashAllocation = Math.max(actualRemainingAmount - orderAllocation, 0);
        setValue('settlementType', 'mixed', {
            shouldValidate: true,
            shouldDirty: true
        });
        setValue('mixedOrderAmount', orderAllocation, {
            shouldValidate: true,
            shouldDirty: true
        });
        setValue('mixedCashAmount', cashAllocation, {
            shouldValidate: true,
            shouldDirty: true
        });
        setValue('amount', cashAllocation, {
            shouldValidate: true,
            shouldDirty: true
        });
        setInsufficientDialogOpen(false);
    }, [
        selectedOrder,
        orderRemainingAmount,
        actualRemainingAmount,
        setValue
    ]);
    const applyCashOnlySuggestion = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](()=>{
        setValue('settlementType', 'direct_payment', {
            shouldValidate: true,
            shouldDirty: true
        });
        setValue('selectedOrderId', '', {
            shouldValidate: true,
            shouldDirty: true
        });
        setValue('mixedOrderAmount', undefined);
        setValue('mixedCashAmount', undefined);
        setValue('amount', actualRemainingAmount, {
            shouldValidate: true,
            shouldDirty: true
        });
        setInsufficientDialogOpen(false);
    }, [
        actualRemainingAmount,
        setValue
    ]);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        if (settlementType !== 'mixed') return;
        const maxOrderAllocation = Math.min(orderRemainingAmount, actualRemainingAmount);
        const rawOrderAmount = mixedOrderAmount ?? maxOrderAllocation;
        const clampedOrderAmount = Math.max(0, Math.min(rawOrderAmount, maxOrderAllocation));
        if (clampedOrderAmount !== (mixedOrderAmount ?? 0)) {
            setValue('mixedOrderAmount', clampedOrderAmount, {
                shouldValidate: true,
                shouldDirty: true
            });
        }
        const recalculatedCashAmount = Math.max(actualRemainingAmount - clampedOrderAmount, 0);
        if (recalculatedCashAmount !== (mixedCashAmount ?? 0)) {
            setValue('mixedCashAmount', recalculatedCashAmount, {
                shouldValidate: true,
                shouldDirty: true
            });
        }
        if (settlementType === 'mixed' && amount !== recalculatedCashAmount) {
            setValue('amount', recalculatedCashAmount, {
                shouldValidate: true,
                shouldDirty: true
            });
        }
    }, [
        settlementType,
        mixedOrderAmount,
        mixedCashAmount,
        orderRemainingAmount,
        actualRemainingAmount,
        amount,
        setValue
    ]);
    // Calculate max amount based on settlement type
    const maxAmount = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        if (settlementType === 'order_deduction' && selectedOrder) {
            // Nếu trừ vào đơn hàng: max = min(actualRemainingAmount, order remaining amount)
            const orderPaidAmount = selectedOrder.paidAmount || 0;
            const orderRemainingAmount = selectedOrder.grandTotal - orderPaidAmount;
            return Math.min(actualRemainingAmount, orderRemainingAmount);
        }
        // Nếu trả trực tiếp: max = actualRemainingAmount
        return actualRemainingAmount;
    }, [
        settlementType,
        selectedOrder,
        actualRemainingAmount
    ]);
    const handleMixedSettlement = async (values)=>{
        if (!ticket) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Không tìm thấy thông tin phiếu bảo hành');
            return;
        }
        const selectedOrderSystemId = values.selectedOrderId;
        if (!selectedOrderSystemId) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Vui lòng chọn đơn hàng để bù trừ');
            return;
        }
        const order = orders.find((o)=>o.systemId === selectedOrderSystemId);
        if (!order) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Không tìm thấy thông tin đơn hàng để bù trừ');
            return;
        }
        const orderAmount = values.mixedOrderAmount || 0;
        const cashAmount = values.mixedCashAmount || 0;
        if (orderAmount <= 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Số tiền trừ vào đơn phải lớn hơn 0');
            return;
        }
        if (cashAmount <= 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Số tiền chi trực tiếp phải lớn hơn 0');
            return;
        }
        const orderPaidAmount = order.paidAmount || 0;
        const orderRemainingAmountForOrder = order.grandTotal - orderPaidAmount;
        if (orderAmount > orderRemainingAmountForOrder) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Số tiền trừ vào đơn vượt quá số dư của đơn hàng', {
                description: `Còn lại: ${orderRemainingAmountForOrder.toLocaleString('vi-VN')} đ`
            });
            return;
        }
        const latestPayments = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$payments$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePaymentStore"].getState().data;
        const latestReceipts = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$receipts$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useReceiptStore"].getState().data;
        const totalPaymentFromTicket = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$utils$2f$payment$2d$calculations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateWarrantySettlementTotal"])(ticket);
        const currentState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$components$2f$logic$2f$processing$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateWarrantyProcessingState"])(ticket, latestPayments, latestReceipts, totalPaymentFromTicket);
        const currentRemainingAmount = currentState.remainingAmount;
        if (orderAmount + cashAmount > currentRemainingAmount) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Tổng số tiền vượt quá số tiền cần hoàn cho khách', {
                description: `Còn lại: ${currentRemainingAmount.toLocaleString('vi-VN')} đ`
            });
            return;
        }
        if (!warrantyOrderDeductionType || !warrantyRefundType) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Thiếu cấu hình loại phiếu chi bảo hành trong cài đặt');
            return;
        }
        let selectedPaymentMethod = paymentMethods.find((m)=>m.systemId === values.paymentMethodSystemId);
        if (!selectedPaymentMethod) {
            selectedPaymentMethod = defaultPaymentMethod;
        }
        if (!selectedPaymentMethod) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Vui lòng chọn hình thức thanh toán cho phần chi trực tiếp');
            return;
        }
        if (!values.accountSystemId) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Vui lòng chọn tài khoản chi cho phần chi trực tiếp');
            return;
        }
        const now = new Date();
        const isoNow = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(now) || now.toISOString();
        const baseNotes = values.notes || `Hoàn tiền bảo hành ${warrantyId}`;
        // --- Step 1: Order deduction ---
        const orderDeductionPayment = {
            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(''),
            date: isoNow,
            amount: orderAmount,
            recipientTypeSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('KHACHHANG'),
            recipientTypeName: 'Khách hàng',
            recipientName: customer.name,
            description: `${baseNotes} - Trừ vào đơn ${order.id}`,
            paymentMethodSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ORDER_DEDUCTION'),
            paymentMethodName: 'Bù trừ đơn hàng',
            accountSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(''),
            paymentReceiptTypeSystemId: warrantyOrderDeductionType.systemId,
            paymentReceiptTypeName: warrantyOrderDeductionType.name,
            branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(branchSystemId || ''),
            branchName: branchName || '',
            status: 'completed',
            category: 'warranty_refund',
            linkedWarrantySystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(warrantySystemId),
            linkedOrderSystemId: order.systemId,
            originalDocumentId: warrantyId,
            customerSystemId: undefined,
            customerName: customer.name,
            affectsDebt: false,
            createdBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(currentUserSystemId),
            createdAt: isoNow
        };
        const orderPayment = addPayment(orderDeductionPayment);
        const existingOrderPayments = order.payments || [];
        const orderPaymentEntry = {
            systemId: orderPayment.systemId,
            id: orderPayment.id,
            date: orderPayment.date,
            method: 'Bù trừ bảo hành',
            amount: -orderAmount,
            createdBy: orderPayment.createdBy,
            description: `Trừ tiền bảo hành ${warrantyId}`,
            linkedWarrantySystemId: warrantySystemId
        };
        updateOrder(order.systemId, {
            payments: [
                ...existingOrderPayments,
                orderPaymentEntry
            ],
            paidAmount: (order.paidAmount || 0) + orderAmount
        });
        addHistory((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(warrantySystemId), `Bù trừ ${orderAmount.toLocaleString('vi-VN')} đ vào đơn ${order.id}`, currentUserName, `Đơn ${order.id} - Khách hàng: ${order.customerName}`, {
            paymentSystemId: orderPayment.systemId,
            linkedOrderSystemId: order.systemId
        });
        // --- Step 2: Cash payment ---
        const cashPayment = {
            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(''),
            date: isoNow,
            amount: cashAmount,
            recipientTypeSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('KHACHHANG'),
            recipientTypeName: 'Khách hàng',
            recipientName: customer.name,
            description: `${baseNotes} - Chi trực tiếp`,
            paymentMethodSystemId: selectedPaymentMethod.systemId,
            paymentMethodName: selectedPaymentMethod.name,
            accountSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(values.accountSystemId || ''),
            paymentReceiptTypeSystemId: warrantyRefundType.systemId,
            paymentReceiptTypeName: warrantyRefundType.name,
            branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(branchSystemId || ''),
            branchName: branchName || '',
            status: 'completed',
            category: 'warranty_refund',
            linkedWarrantySystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(warrantySystemId),
            originalDocumentId: warrantyId,
            customerSystemId: undefined,
            customerName: customer.name,
            affectsDebt: false,
            createdBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(currentUserSystemId),
            createdAt: isoNow
        };
        const cashPaymentResult = addPayment(cashPayment);
        addHistory((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(warrantySystemId), `Chi ${cashAmount.toLocaleString('vi-VN')} đ cho khách`, currentUserName, `${selectedPaymentMethod.name} - ${cashAmount.toLocaleString('vi-VN')} đ`, {
            paymentSystemId: cashPaymentResult.systemId
        });
        const settlementMethods = [
            {
                type: 'order_deduction',
                amount: orderAmount,
                status: 'completed',
                linkedOrderSystemId: order.systemId,
                paymentVoucherId: orderPayment.systemId,
                notes: `Trừ vào đơn ${order.id}`,
                createdAt: isoNow,
                completedAt: isoNow
            },
            {
                type: detectDirectSettlementType(selectedPaymentMethod),
                amount: cashAmount,
                status: 'completed',
                paymentVoucherId: cashPaymentResult.systemId,
                notes: `${selectedPaymentMethod.name} - ${baseNotes}`,
                createdAt: isoNow,
                completedAt: cashPaymentResult.status === 'completed' ? isoNow : undefined
            }
        ];
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$utils$2f$settlement$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["recordWarrantySettlementMethods"])({
            ticket,
            settlementType: 'mixed',
            totalAmount: totalPaymentFromTicket,
            methods: settlementMethods
        });
        setInsufficientDialogOpen(false);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success('Đã xử lý bù trừ + chi tiền', {
            description: `Trừ ${orderAmount.toLocaleString('vi-VN')} đ vào ${order.id} + Chi ${cashAmount.toLocaleString('vi-VN')} đ`,
            action: {
                label: 'Xem phiếu chi',
                onClick: ()=>router.push(`/payments/${cashPaymentResult.systemId}`)
            }
        });
    };
    const onSubmit = async (values)=>{
        try {
            if (values.settlementType === 'mixed') {
                await handleMixedSettlement(values);
                setOpen(false);
                return;
            }
            const now = new Date();
            if (!ticket) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Không tìm thấy thông tin phiếu bảo hành');
                return;
            }
            const totalPaymentFromTicket = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$utils$2f$payment$2d$calculations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateWarrantySettlementTotal"])(ticket);
            const currentState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$components$2f$logic$2f$processing$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateWarrantyProcessingState"])(ticket, payments, receipts, totalPaymentFromTicket);
            const currentRemainingAmount = currentState.remainingAmount;
            console.log('💰 [PAYMENT VALIDATION]', {
                totalPaymentFromTicket,
                totalPayments: currentState.warrantyPayments.reduce((sum, p)=>p.status !== 'cancelled' ? sum + p.amount : sum, 0),
                totalReceipts: currentState.warrantyReceipts.reduce((sum, r)=>r.status !== 'cancelled' ? sum + r.amount : sum, 0),
                currentRemainingAmount,
                attemptingToPay: values.amount,
                willExceed: values.amount > currentRemainingAmount
            });
            // Không cho thanh toán vượt quá số tiền còn phải trả
            if (values.amount > currentRemainingAmount) {
                const totalPaid = totalPaymentFromTicket - currentRemainingAmount;
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Số tiền không được vượt quá số tiền còn phải trả cho khách', {
                    description: `Đã trả: ${totalPaid.toLocaleString('vi-VN')} đ\nCòn lại: ${currentRemainingAmount.toLocaleString('vi-VN')} đ`,
                    duration: 5000
                });
                return;
            }
            // Determine payment type and method based on settlement type
            let paymentType = warrantyRefundType;
            let selectedPaymentMethod = paymentMethods.find((m)=>m.systemId === values.paymentMethodSystemId);
            let linkedOrderSystemId;
            if (values.settlementType === 'order_deduction') {
                // Trừ vào đơn hàng - use TRAVAO_DONHANG type
                paymentType = warrantyOrderDeductionType;
                linkedOrderSystemId = values.selectedOrderId;
                if (!linkedOrderSystemId) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Vui lòng chọn đơn hàng');
                    return;
                }
                // ✅ ADDITIONAL VALIDATION: Kiểm tra số tiền không vượt quá số dư đơn hàng
                if (selectedOrder) {
                    const orderPaidAmount = selectedOrder.paidAmount || 0;
                    const orderRemainingAmount = selectedOrder.grandTotal - orderPaidAmount;
                    if (values.amount > orderRemainingAmount) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Số tiền không được vượt quá số dư đơn hàng', {
                            description: `Còn lại: ${orderRemainingAmount.toLocaleString('vi-VN')} đ`,
                            duration: 5000
                        });
                        return;
                    }
                }
            }
            // Validation
            if (!paymentType) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Không tìm thấy loại phiếu chi phù hợp trong cài đặt');
                return;
            }
            if (!selectedPaymentMethod) {
                selectedPaymentMethod = defaultPaymentMethod;
            }
            if (!selectedPaymentMethod) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Không tìm thấy phương thức thanh toán');
                return;
            }
            // Validate account for direct payment
            if (values.settlementType === 'direct_payment' && !values.accountSystemId) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Vui lòng chọn tài khoản chi');
                return;
            }
            const settlementRecordType = values.settlementType === 'order_deduction' ? 'order_deduction' : detectDirectSettlementType(selectedPaymentMethod);
            const payment = {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(''),
                date: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(now) || now.toISOString(),
                amount: values.amount,
                // Recipient info (TargetGroup)
                recipientTypeSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('KHACHHANG'),
                recipientTypeName: 'Khách hàng',
                recipientName: customer.name,
                recipientSystemId: undefined,
                description: values.notes || `Hoàn tiền bảo hành ${warrantyId}`,
                // Payment Method - From settings
                paymentMethodSystemId: selectedPaymentMethod.systemId,
                paymentMethodName: selectedPaymentMethod.name,
                // Account & Type - From settings
                accountSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(values.accountSystemId || ''),
                paymentReceiptTypeSystemId: paymentType.systemId,
                paymentReceiptTypeName: paymentType.name,
                // Branch info
                branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(branchSystemId || ''),
                branchName: branchName || '',
                // Status & Category
                status: 'completed',
                category: 'warranty_refund',
                // Links to warranty and order
                linkedWarrantySystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(warrantySystemId),
                linkedOrderSystemId: linkedOrderSystemId ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(linkedOrderSystemId) : undefined,
                originalDocumentId: warrantyId,
                customerSystemId: undefined,
                customerName: customer.name,
                // Financial
                affectsDebt: false,
                createdBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(currentUserSystemId),
                createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(now) || now.toISOString()
            };
            const newPayment = addPayment(payment);
            // ============================================================
            // UPDATE ORDER if this is order_deduction
            // ============================================================
            if (linkedOrderSystemId) {
                const order = orders.find((o)=>o.systemId === linkedOrderSystemId);
                if (order) {
                    // Create OrderPayment object
                    const orderPayment = {
                        systemId: newPayment.systemId,
                        id: newPayment.id,
                        date: newPayment.date,
                        method: selectedPaymentMethod?.name || 'N/A',
                        amount: -values.amount,
                        createdBy: newPayment.createdBy,
                        description: `Trừ tiền bảo hành ${warrantyId}`,
                        linkedWarrantySystemId: warrantySystemId
                    };
                    // Update order: add payment and increase paidAmount
                    const updatedPayments = [
                        ...order.payments,
                        orderPayment
                    ];
                    const newPaidAmount = (order.paidAmount || 0) + values.amount;
                    updateOrder(linkedOrderSystemId, {
                        payments: updatedPayments,
                        paidAmount: newPaidAmount
                    });
                }
            }
            // Add history to warranty với metadata
            const settlementLabel = values.settlementType === 'order_deduction' ? `Trừ vào đơn hàng (${paymentType.name})` : `${selectedPaymentMethod.name} (${paymentType.name})`;
            addHistory((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(warrantySystemId), `Tạo phiếu chi ${newPayment.id}`, currentUserName, `Số tiền: ${values.amount.toLocaleString('vi-VN')}đ - Phương thức: ${settlementLabel}`, {
                paymentSystemId: newPayment.systemId
            } // ✅ Lưu systemId vào metadata
            );
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$utils$2f$settlement$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["recordWarrantySettlementMethods"])({
                ticket,
                settlementType: settlementRecordType,
                totalAmount: totalPaymentFromTicket,
                methods: [
                    {
                        type: settlementRecordType,
                        amount: values.amount,
                        status: 'completed',
                        paymentVoucherId: newPayment.systemId,
                        linkedOrderSystemId: linkedOrderSystemId ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(linkedOrderSystemId) : undefined,
                        notes: settlementLabel,
                        createdAt: newPayment.createdAt,
                        completedAt: newPayment.status === 'completed' ? newPayment.createdAt : undefined
                    }
                ]
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success(`Đã tạo phiếu chi ${newPayment.id}`, {
                description: `Đã xuất tiền (${values.amount.toLocaleString('vi-VN')} đ)`,
                action: {
                    label: 'Xem phiếu chi',
                    onClick: ()=>router.push(`/payments/${newPayment.systemId}`)
                }
            });
            setOpen(false);
        } catch (error) {
            console.error('Error creating payment voucher:', error);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Không thể tạo phiếu chi');
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Dialog"], {
        open: open,
        onOpenChange: setOpen,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogTrigger"], {
                asChild: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                    variant: "default",
                    size: "lg",
                    className: "h-9 flex-1",
                    children: "Tạo phiếu chi"
                }, void 0, false, {
                    fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                    lineNumber: 810,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                lineNumber: 809,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogContent"], {
                className: "max-w-2xl max-h-[90vh] overflow-y-auto",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogHeader"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogTitle"], {
                            children: "Tạo phiếu chi - Hoàn tiền bảo hành"
                        }, void 0, false, {
                            fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                            lineNumber: 821,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                        lineNumber: 820,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: handleSubmit(onSubmit),
                        className: "space-y-4",
                        children: [
                            (!warrantyRefundType || !warrantyOrderDeductionType) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Alert"], {
                                variant: "destructive",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                        lineNumber: 828,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDescription"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: "Thiếu cấu hình:"
                                            }, void 0, false, {
                                                fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                                lineNumber: 830,
                                                columnNumber: 17
                                            }, this),
                                            " Không tìm thấy loại phiếu chi phù hợp trong cài đặt. Vui lòng vào ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: [
                                                    "Cài đặt ",
                                                    '>',
                                                    " Loại phiếu chi"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                                lineNumber: 831,
                                                columnNumber: 30
                                            }, this),
                                            " để kiểm tra các loại:",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                className: "mt-2 ml-4 list-disc text-sm",
                                                children: [
                                                    !warrantyRefundType && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                children: "HOANTIEN_BH"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                                                lineNumber: 833,
                                                                columnNumber: 47
                                                            }, this),
                                                            " - Hoàn tiền bảo hành"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                                        lineNumber: 833,
                                                        columnNumber: 43
                                                    }, this),
                                                    !warrantyOrderDeductionType && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                children: "TRAVAO_DONHANG"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                                                lineNumber: 834,
                                                                columnNumber: 55
                                                            }, this),
                                                            " - Trả bảo hành vào đơn hàng"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                                        lineNumber: 834,
                                                        columnNumber: 51
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                                lineNumber: 832,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                        lineNumber: 829,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                lineNumber: 827,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Alert"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                        lineNumber: 842,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDescription"], {
                                        className: "space-y-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-medium",
                                                        children: "Phiếu bảo hành:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                                        lineNumber: 845,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-mono",
                                                        children: warrantyId
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                                        lineNumber: 846,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                                lineNumber: 844,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-medium",
                                                        children: "Khách hàng:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                                        lineNumber: 849,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: [
                                                            customer.name,
                                                            " • ",
                                                            customer.phone
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                                        lineNumber: 850,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                                lineNumber: 848,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-medium",
                                                        children: "Cần bù trừ:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                                        lineNumber: 853,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-semibold text-red-600",
                                                        children: [
                                                            actualRemainingAmount.toLocaleString('vi-VN'),
                                                            " đ"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                                        lineNumber: 854,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                                lineNumber: 852,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                        lineNumber: 843,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                lineNumber: 841,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                        htmlFor: "settlementType",
                                        children: "Phương thức *"
                                    }, void 0, false, {
                                        fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                        lineNumber: 862,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Controller"], {
                                        name: "settlementType",
                                        control: control,
                                        render: ({ field })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Select"], {
                                                value: field.value,
                                                onValueChange: field.onChange,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                                        id: "settlementType",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectValue"], {}, void 0, false, {
                                                            fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                                            lineNumber: 869,
                                                            columnNumber: 21
                                                        }, void 0)
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                                        lineNumber: 868,
                                                        columnNumber: 19
                                                    }, void 0),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectContent"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                value: "direct_payment",
                                                                children: "Trả tiền trực tiếp"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                                                lineNumber: 872,
                                                                columnNumber: 21
                                                            }, void 0),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                value: "order_deduction",
                                                                children: "Trừ vào đơn hàng"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                                                lineNumber: 873,
                                                                columnNumber: 21
                                                            }, void 0),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                value: "mixed",
                                                                children: "Bù trừ đơn + Chi tiền"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                                                lineNumber: 874,
                                                                columnNumber: 21
                                                            }, void 0)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                                        lineNumber: 871,
                                                        columnNumber: 19
                                                    }, void 0)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                                lineNumber: 867,
                                                columnNumber: 17
                                            }, void 0)
                                    }, void 0, false, {
                                        fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                        lineNumber: 863,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                lineNumber: 861,
                                columnNumber: 11
                            }, this),
                            (settlementType === 'direct_payment' || settlementType === 'mixed') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                                htmlFor: "paymentMethodSystemId",
                                                children: "Hình thức thanh toán *"
                                            }, void 0, false, {
                                                fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                                lineNumber: 885,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Controller"], {
                                                name: "paymentMethodSystemId",
                                                control: control,
                                                rules: {
                                                    required: settlementType === 'direct_payment' || settlementType === 'mixed'
                                                },
                                                render: ({ field })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Select"], {
                                                        value: field.value,
                                                        onValueChange: field.onChange,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                                                id: "paymentMethodSystemId",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectValue"], {
                                                                    placeholder: "-- Chọn hình thức --"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                                                    lineNumber: 893,
                                                                    columnNumber: 25
                                                                }, void 0)
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                                                lineNumber: 892,
                                                                columnNumber: 23
                                                            }, void 0),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectContent"], {
                                                                children: paymentMethods.filter((m)=>m.isActive).map((method)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                        value: method.systemId,
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-2",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                children: method.name
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                                                                lineNumber: 899,
                                                                                columnNumber: 31
                                                                            }, void 0)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                                                            lineNumber: 898,
                                                                            columnNumber: 29
                                                                        }, void 0)
                                                                    }, method.systemId, false, {
                                                                        fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                                                        lineNumber: 897,
                                                                        columnNumber: 27
                                                                    }, void 0))
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                                                lineNumber: 895,
                                                                columnNumber: 23
                                                            }, void 0)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                                        lineNumber: 891,
                                                        columnNumber: 21
                                                    }, void 0)
                                            }, void 0, false, {
                                                fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                                lineNumber: 886,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-muted-foreground",
                                                children: "Chọn hình thức thanh toán phù hợp từ cài đặt hệ thống"
                                            }, void 0, false, {
                                                fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                                lineNumber: 907,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                        lineNumber: 884,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                                htmlFor: "accountSystemId",
                                                children: "Tài khoản chi *"
                                            }, void 0, false, {
                                                fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                                lineNumber: 914,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Controller"], {
                                                name: "accountSystemId",
                                                control: control,
                                                rules: {
                                                    required: settlementType === 'direct_payment' || settlementType === 'mixed'
                                                },
                                                render: ({ field })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Select"], {
                                                        value: field.value,
                                                        onValueChange: field.onChange,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                                                id: "accountSystemId",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectValue"], {
                                                                    placeholder: "-- Chọn tài khoản --"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                                                    lineNumber: 922,
                                                                    columnNumber: 25
                                                                }, void 0)
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                                                lineNumber: 921,
                                                                columnNumber: 23
                                                            }, void 0),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectContent"], {
                                                                children: filteredAccounts.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "p-4 text-sm text-muted-foreground text-center",
                                                                    children: "Không có tài khoản khả dụng"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                                                    lineNumber: 926,
                                                                    columnNumber: 27
                                                                }, void 0) : filteredAccounts.map((account)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                        value: account.systemId,
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-2",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                children: account.name
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                                                                lineNumber: 933,
                                                                                columnNumber: 33
                                                                            }, void 0)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                                                            lineNumber: 932,
                                                                            columnNumber: 31
                                                                        }, void 0)
                                                                    }, account.systemId, false, {
                                                                        fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                                                        lineNumber: 931,
                                                                        columnNumber: 29
                                                                    }, void 0))
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                                                lineNumber: 924,
                                                                columnNumber: 23
                                                            }, void 0)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                                        lineNumber: 920,
                                                        columnNumber: 21
                                                    }, void 0)
                                            }, void 0, false, {
                                                fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                                lineNumber: 915,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-muted-foreground",
                                                children: selectedPaymentMethod?.name === 'Tiền mặt' ? 'Hiển thị tài khoản quỹ tiền mặt' : 'Hiển thị tài khoản ngân hàng'
                                            }, void 0, false, {
                                                fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                                lineNumber: 942,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                        lineNumber: 913,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true),
                            (settlementType === 'order_deduction' || settlementType === 'mixed') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                        htmlFor: "selectedOrderId",
                                        children: "Chọn đơn hàng *"
                                    }, void 0, false, {
                                        fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                        lineNumber: 954,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs text-muted-foreground mb-2",
                                        children: "Nhập mã đơn hàng hoặc tên khách để tìm nhanh. Hệ thống tự động lọc kết quả từ đơn hàng."
                                    }, void 0, false, {
                                        fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                        lineNumber: 955,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$virtualized$2d$combobox$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VirtualizedCombobox"], {
                                        options: orderSearchResults,
                                        value: selectedOrderValue,
                                        onChange: (option)=>setValue('selectedOrderId', option?.value || ''),
                                        onSearchChange: (query)=>setOrderSearchQuery(query),
                                        placeholder: "Tìm kiếm đơn hàng...",
                                        searchPlaceholder: "Nhập mã đơn hoặc tên khách hàng...",
                                        emptyPlaceholder: orderSearchQuery ? "Không tìm thấy đơn hàng phù hợp" : "Nhập từ khóa để tìm kiếm đơn hàng",
                                        isLoading: isSearchingOrders,
                                        minSearchLength: 0,
                                        estimatedItemHeight: 56,
                                        maxHeight: 400
                                    }, void 0, false, {
                                        fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                        lineNumber: 959,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-muted-foreground",
                                        children: [
                                            "Chỉ hiển thị đơn hàng ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: "chưa xuất kho"
                                            }, void 0, false, {
                                                fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                                lineNumber: 977,
                                                columnNumber: 39
                                            }, this),
                                            " và ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: "còn số dư có thể trừ"
                                            }, void 0, false, {
                                                fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                                lineNumber: 977,
                                                columnNumber: 73
                                            }, this),
                                            "."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                        lineNumber: 976,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                lineNumber: 953,
                                columnNumber: 13
                            }, this),
                            shouldShowInsufficientWarning && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Alert"], {
                                className: "border-yellow-400 bg-yellow-50 text-yellow-900",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-start gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                            className: "h-4 w-4 mt-0.5"
                                        }, void 0, false, {
                                            fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                            lineNumber: 985,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-1 text-sm",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "font-medium",
                                                    children: [
                                                        "Đơn ",
                                                        selectedOrder?.id,
                                                        " không đủ để trừ toàn bộ."
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                                    lineNumber: 987,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs",
                                                    children: [
                                                        "Thiếu ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: [
                                                                shortageAmount.toLocaleString('vi-VN'),
                                                                " đ"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                                            lineNumber: 989,
                                                            columnNumber: 27
                                                        }, this),
                                                        " so với số tiền cần hoàn. Chọn cách xử lý bên dưới."
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                                    lineNumber: 988,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                    type: "button",
                                                    size: "sm",
                                                    variant: "secondary",
                                                    className: "mt-1",
                                                    onClick: ()=>setInsufficientDialogOpen(true),
                                                    children: "Mở gợi ý xử lý"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                                    lineNumber: 991,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                            lineNumber: 986,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                    lineNumber: 984,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                lineNumber: 983,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                        htmlFor: "amount",
                                        children: "Số tiền *"
                                    }, void 0, false, {
                                        fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                        lineNumber: 1006,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Controller"], {
                                        name: "amount",
                                        control: control,
                                        rules: {
                                            required: 'Vui lòng nhập số tiền',
                                            min: {
                                                value: 1,
                                                message: 'Số tiền phải lớn hơn 0'
                                            },
                                            max: {
                                                value: maxAmount,
                                                message: settlementType === 'order_deduction' && selectedOrder ? (()=>{
                                                    const orderPaidAmount = selectedOrder.paidAmount || 0;
                                                    const orderRemainingAmount = selectedOrder.grandTotal - orderPaidAmount;
                                                    return `Số tiền không được vượt quá số tiền còn lại của đơn hàng (${orderRemainingAmount.toLocaleString('vi-VN')} đ)`;
                                                })() : `Số tiền không được vượt quá ${actualRemainingAmount.toLocaleString('vi-VN')} đ`
                                            }
                                        },
                                        render: ({ field, fieldState })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$currency$2d$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CurrencyInput"], {
                                                        value: field.value,
                                                        onChange: field.onChange,
                                                        disabled: settlementType === 'mixed',
                                                        placeholder: "0"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                                        lineNumber: 1026,
                                                        columnNumber: 19
                                                    }, void 0),
                                                    fieldState.error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-destructive",
                                                        children: fieldState.error.message
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                                        lineNumber: 1033,
                                                        columnNumber: 21
                                                    }, void 0),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-muted-foreground",
                                                        children: settlementType === 'order_deduction' && selectedOrder ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                            children: (()=>{
                                                                const orderPaidAmount = selectedOrder.paidAmount || 0;
                                                                const orderRemainingAmount = selectedOrder.grandTotal - orderPaidAmount;
                                                                const maxAllowed = Math.min(actualRemainingAmount, orderRemainingAmount);
                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                    children: [
                                                                        "Số tiền tối đa: ",
                                                                        maxAllowed.toLocaleString('vi-VN'),
                                                                        " đ",
                                                                        orderPaidAmount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-blue-600 font-medium",
                                                                            children: [
                                                                                ' ',
                                                                                "(Đã trừ: ",
                                                                                orderPaidAmount.toLocaleString('vi-VN'),
                                                                                " đ / ",
                                                                                selectedOrder.grandTotal.toLocaleString('vi-VN'),
                                                                                " đ)"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                                                            lineNumber: 1047,
                                                                            columnNumber: 33
                                                                        }, void 0)
                                                                    ]
                                                                }, void 0, true);
                                                            })()
                                                        }, void 0, false) : settlementType === 'mixed' ? `Tiền mặt cần chi: ${(mixedCashAmount || 0).toLocaleString('vi-VN')} đ (tự động từ phần bù trừ)` : `Số tiền tối đa: ${actualRemainingAmount.toLocaleString('vi-VN')} đ`
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                                        lineNumber: 1035,
                                                        columnNumber: 19
                                                    }, void 0)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                                lineNumber: 1025,
                                                columnNumber: 17
                                            }, void 0)
                                    }, void 0, false, {
                                        fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                        lineNumber: 1007,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                lineNumber: 1005,
                                columnNumber: 11
                            }, this),
                            settlementType === 'mixed' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-3 rounded-lg border border-border p-3 bg-muted/40",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-sm font-medium",
                                        children: "Phân bổ bù trừ"
                                    }, void 0, false, {
                                        fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                        lineNumber: 1068,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs text-muted-foreground",
                                        children: [
                                            "Tổng cần hoàn: ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: [
                                                    actualRemainingAmount.toLocaleString('vi-VN'),
                                                    " đ"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                                lineNumber: 1070,
                                                columnNumber: 32
                                            }, this),
                                            ". Điều chỉnh số tiền trừ vào đơn, phần còn lại sẽ chi trực tiếp."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                        lineNumber: 1069,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid gap-3 md:grid-cols-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                                        children: "Trừ vào đơn"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                                        lineNumber: 1074,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$currency$2d$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CurrencyInput"], {
                                                        value: mixedOrderAmount || 0,
                                                        onChange: (value)=>setValue('mixedOrderAmount', value || 0, {
                                                                shouldValidate: true,
                                                                shouldDirty: true
                                                            }),
                                                        max: orderRemainingAmount,
                                                        min: 0
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                                        lineNumber: 1075,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-muted-foreground",
                                                        children: [
                                                            "Tối đa: ",
                                                            orderRemainingAmount.toLocaleString('vi-VN'),
                                                            " đ"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                                        lineNumber: 1081,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                                lineNumber: 1073,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                                        children: "Chi trực tiếp"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                                        lineNumber: 1086,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "rounded-md border bg-background px-3 py-2 text-right font-semibold",
                                                        children: [
                                                            (mixedCashAmount || 0).toLocaleString('vi-VN'),
                                                            " đ"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                                        lineNumber: 1087,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-muted-foreground",
                                                        children: "Tự động tính = Tổng cần hoàn - Trừ vào đơn"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                                        lineNumber: 1090,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                                lineNumber: 1085,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                        lineNumber: 1072,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                lineNumber: 1067,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                        htmlFor: "notes",
                                        children: "Ghi chú"
                                    }, void 0, false, {
                                        fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                        lineNumber: 1098,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Controller"], {
                                        name: "notes",
                                        control: control,
                                        render: ({ field })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Textarea"], {
                                                ...field,
                                                id: "notes",
                                                placeholder: "Thêm ghi chú cho phiếu chi...",
                                                rows: 3
                                            }, void 0, false, {
                                                fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                                lineNumber: 1103,
                                                columnNumber: 17
                                            }, void 0)
                                    }, void 0, false, {
                                        fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                        lineNumber: 1099,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                lineNumber: 1097,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogFooter"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                        type: "button",
                                        variant: "outline",
                                        onClick: ()=>setOpen(false),
                                        children: "Hủy"
                                    }, void 0, false, {
                                        fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                        lineNumber: 1114,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                        type: "submit",
                                        children: "Tạo phiếu chi"
                                    }, void 0, false, {
                                        fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                        lineNumber: 1117,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                                lineNumber: 1113,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                        lineNumber: 824,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                lineNumber: 819,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$components$2f$dialogs$2f$insufficient$2d$balance$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["InsufficientBalanceDialog"], {
                open: insufficientDialogOpen,
                onOpenChange: setInsufficientDialogOpen,
                totalAmount: actualRemainingAmount,
                orderAmount: orderRemainingAmount,
                shortageAmount: shortageAmount,
                orderLabel: selectedOrder?.id,
                onSelectMixed: applyMixedSuggestion,
                onSelectCashOnly: applyCashOnlySuggestion
            }, void 0, false, {
                fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
                lineNumber: 1124,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx",
        lineNumber: 808,
        columnNumber: 5
    }, this);
}
}),
"[project]/features/warranty/hooks/use-warranty-settlement.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useWarrantySettlement",
    ()=>useWarrantySettlement
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/features/warranty/store.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/store/index.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$payments$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/payments/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$receipts$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/receipts/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$components$2f$logic$2f$processing$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/components/logic/processing.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$utils$2f$payment$2d$calculations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/utils/payment-calculations.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
function useWarrantySettlement(warrantySystemId, options) {
    const { findById } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useWarrantyStore"])();
    const payments = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$payments$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePaymentStore"])((state)=>state.data);
    const receipts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$receipts$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useReceiptStore"])((state)=>state.data);
    const overrideTicket = options?.ticket ?? null;
    const normalizedWarrantySystemId = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>warrantySystemId ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(warrantySystemId) : undefined, [
        warrantySystemId
    ]);
    const ticket = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        if (overrideTicket) {
            return overrideTicket;
        }
        if (!normalizedWarrantySystemId) return null;
        return findById(normalizedWarrantySystemId) || null;
    }, [
        findById,
        normalizedWarrantySystemId,
        overrideTicket
    ]);
    const fallbackTotalPayment = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$utils$2f$payment$2d$calculations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateWarrantySettlementTotal"])(ticket), [
        ticket
    ]);
    const settlementSnapshot = ticket?.settlement ?? null;
    const totalPayment = settlementSnapshot?.totalAmount ?? fallbackTotalPayment;
    const settlementMethods = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        if (!settlementSnapshot) {
            return [];
        }
        if (settlementSnapshot.methods?.length) {
            return [
                ...settlementSnapshot.methods
            ].sort((a, b)=>new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        }
        const fallbackType = settlementSnapshot.settlementType;
        if (!fallbackType || fallbackType === 'mixed') {
            return [];
        }
        const inferredMethod = {
            systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(`${settlementSnapshot.systemId}_fallback_method`),
            type: fallbackType,
            amount: Math.abs(settlementSnapshot.totalAmount ?? totalPayment),
            status: settlementSnapshot.status,
            paymentVoucherId: settlementSnapshot.paymentVoucherId,
            debtTransactionId: settlementSnapshot.debtTransactionId,
            voucherCode: settlementSnapshot.voucherCode,
            linkedOrderSystemId: settlementSnapshot.linkedOrderSystemId,
            notes: settlementSnapshot.notes,
            createdAt: settlementSnapshot.createdAt,
            completedAt: settlementSnapshot.settledAt
        };
        return [
            inferredMethod
        ];
    }, [
        settlementSnapshot,
        totalPayment
    ]);
    const processingState = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$components$2f$logic$2f$processing$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateWarrantyProcessingState"])(ticket, payments, receipts, totalPayment);
    }, [
        ticket,
        payments,
        receipts,
        totalPayment
    ]);
    const snapshotSettledAmount = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        if (settlementSnapshot?.settledAmount != null) {
            return Math.abs(settlementSnapshot.settledAmount);
        }
        return settlementMethods.filter((method)=>method.status === 'completed').reduce((sum, method)=>sum + Math.abs(method.amount), 0);
    }, [
        settlementMethods,
        settlementSnapshot
    ]);
    const snapshotRemainingAmount = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        if (settlementSnapshot?.remainingAmount != null) {
            return Math.abs(settlementSnapshot.remainingAmount);
        }
        return Math.max(Math.abs(totalPayment) - snapshotSettledAmount, 0);
    }, [
        settlementSnapshot,
        snapshotSettledAmount,
        totalPayment
    ]);
    const remainingAmount = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        if (settlementSnapshot) {
            return snapshotRemainingAmount;
        }
        return Math.max(processingState.remainingAmount, 0);
    }, [
        processingState.remainingAmount,
        settlementSnapshot,
        snapshotRemainingAmount
    ]);
    return {
        ticket,
        totalPayment,
        remainingAmount,
        processingState,
        settlementSnapshot,
        settlementMethods,
        snapshotSettledAmount,
        snapshotRemainingAmount
    };
}
}),
"[project]/features/warranty/components/dialogs/warranty-receipt-voucher-dialog.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WarrantyReceiptVoucherDialog",
    ()=>WarrantyReceiptVoucherDialog
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * CreateReceiptVoucherDialog
 * 
 * Dialog tạo phiếu thu (receipt voucher) từ warranty
 * - Thu thêm tiền từ khách (trường hợp đặc biệt)
 * - Nhập số tiền, lý do, phương thức thu
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hook-form/dist/index.esm.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dialog.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/label.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/textarea.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/select.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/alert.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-ssr] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$payments$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/payments/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$receipts$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/receipts/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/features/warranty/store.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/store/index.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$components$2f$logic$2f$processing$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/components/logic/processing.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$utils$2f$payment$2d$calculations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/utils/payment-calculations.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$hooks$2f$use$2d$warranty$2d$settlement$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/hooks/use-warranty-settlement.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$currency$2d$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/currency-input.tsx [app-ssr] (ecmascript)");
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
function WarrantyReceiptVoucherDialog({ warrantyId, warrantySystemId, customer, defaultAmount = 0, linkedOrderId, branchSystemId, branchName, existingReceipts = [] }) {
    const [open, setOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](false);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { add: addReceipt } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$receipts$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useReceiptStore"])();
    const { findById, addHistory } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useWarrantyStore"])();
    const { employee: authEmployee } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const currentUserSystemId = authEmployee?.systemId ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SYSTEM');
    const currentUserName = authEmployee?.fullName || authEmployee?.id || 'Hệ thống';
    const { remainingAmount: remainingAmountForReceipt } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$hooks$2f$use$2d$warranty$2d$settlement$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useWarrantySettlement"])(warrantySystemId);
    const amountValidationRules = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        const baseRules = {
            required: 'Vui lòng nhập số tiền',
            min: {
                value: 1,
                message: 'Số tiền phải lớn hơn 0'
            }
        };
        if (remainingAmountForReceipt > 0) {
            baseRules.max = {
                value: remainingAmountForReceipt,
                message: `Số tiền không được vượt quá ${remainingAmountForReceipt.toLocaleString('vi-VN')} đ`
            };
        }
        return baseRules;
    }, [
        remainingAmountForReceipt
    ]);
    const { control, handleSubmit, watch, reset } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useForm"])({
        defaultValues: {
            amount: defaultAmount,
            reason: 'Chi phí sửa chữa thêm',
            paymentMethod: 'Tiền mặt',
            notes: `Thu thêm từ bảo hành ${warrantyId}`
        }
    });
    const amount = watch('amount');
    // Reset form when dialog opens
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        if (open) {
            reset({
                amount: remainingAmountForReceipt || defaultAmount,
                reason: 'Chi phí sửa chữa thêm',
                paymentMethod: 'Tiền mặt',
                notes: `Thu thêm từ bảo hành ${warrantyId}`
            });
        }
    }, [
        open,
        warrantyId,
        defaultAmount,
        remainingAmountForReceipt,
        reset
    ]);
    const onSubmit = (values)=>{
        try {
            const now = new Date();
            const latestTicket = findById((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(warrantySystemId));
            if (!latestTicket) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Không tìm thấy phiếu bảo hành');
                return;
            }
            const latestPayments = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$payments$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePaymentStore"].getState().data;
            const latestReceipts = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$receipts$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useReceiptStore"].getState().data;
            const totalPaymentFromTicket = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$utils$2f$payment$2d$calculations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateWarrantySettlementTotal"])(latestTicket);
            const currentState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$components$2f$logic$2f$processing$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateWarrantyProcessingState"])(latestTicket, latestPayments, latestReceipts, totalPaymentFromTicket);
            if (totalPaymentFromTicket >= 0) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Phiếu này không cần thu thêm tiền');
                return;
            }
            if (values.amount > currentState.remainingAmount) {
                const collected = Math.abs(totalPaymentFromTicket) - currentState.remainingAmount;
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Số tiền không được vượt quá số tiền khách phải trả', {
                    description: `Đã thu: ${collected.toLocaleString('vi-VN')} đ • Còn lại: ${currentState.remainingAmount.toLocaleString('vi-VN')} đ`,
                    duration: 5000
                });
                return;
            }
            const receipt = {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(''),
                date: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(now) || now.toISOString(),
                amount: values.amount,
                // Payer info (TargetGroup)
                payerTypeSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('KHACHHANG'),
                payerTypeName: 'Khách hàng',
                payerName: customer.name,
                payerSystemId: undefined,
                description: values.reason,
                // Payment Method - TODO: Get from settings
                paymentMethodSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(''),
                paymentMethodName: values.paymentMethod,
                // Account & Type - TODO: Get from settings
                accountSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(''),
                paymentReceiptTypeSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(''),
                paymentReceiptTypeName: 'Thu thêm bảo hành',
                // Branch info
                branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(branchSystemId || ''),
                branchName: branchName || '',
                // Status & Category
                status: 'completed',
                category: 'warranty_additional',
                // Links to warranty
                linkedWarrantySystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(warrantySystemId),
                originalDocumentId: warrantyId ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(warrantyId) : undefined,
                customerSystemId: undefined,
                customerName: customer.name,
                // Financial
                affectsDebt: false,
                createdBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(currentUserSystemId),
                createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(now) || now.toISOString()
            };
            const newReceipt = addReceipt(receipt);
            // Add history to warranty với metadata
            addHistory((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(warrantySystemId), `Tạo phiếu thu ${newReceipt.id}`, currentUserName, `Số tiền: ${values.amount.toLocaleString('vi-VN')}đ - Phương thức: ${values.paymentMethod}`, {
                receiptSystemId: newReceipt.systemId
            } // ✅ Lưu systemId vào metadata
            );
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success(`Đã tạo phiếu thu ${newReceipt.id}`, {
                description: `Thu ${values.amount.toLocaleString('vi-VN')} đ từ ${customer.name}`,
                action: {
                    label: 'Xem phiếu thu',
                    onClick: ()=>router.push(`/receipts/${newReceipt.systemId}`)
                }
            });
            setOpen(false);
        } catch (error) {
            console.error('Error creating receipt voucher:', error);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Không thể tạo phiếu thu');
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Dialog"], {
        open: open,
        onOpenChange: setOpen,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogTrigger"], {
                asChild: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                    variant: "default",
                    size: "lg",
                    className: "h-9 flex-1",
                    children: "Tạo phiếu thu"
                }, void 0, false, {
                    fileName: "[project]/features/warranty/components/dialogs/warranty-receipt-voucher-dialog.tsx",
                    lineNumber: 213,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/warranty/components/dialogs/warranty-receipt-voucher-dialog.tsx",
                lineNumber: 212,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogContent"], {
                className: "max-w-2xl max-h-[90vh] overflow-y-auto",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogHeader"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogTitle"], {
                            children: "Tạo phiếu thu - Thu thêm từ khách"
                        }, void 0, false, {
                            fileName: "[project]/features/warranty/components/dialogs/warranty-receipt-voucher-dialog.tsx",
                            lineNumber: 224,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/features/warranty/components/dialogs/warranty-receipt-voucher-dialog.tsx",
                        lineNumber: 223,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: handleSubmit(onSubmit),
                        className: "space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Alert"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/features/warranty/components/dialogs/warranty-receipt-voucher-dialog.tsx",
                                        lineNumber: 230,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDescription"], {
                                        className: "space-y-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-medium",
                                                        children: "Phiếu bảo hành:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/warranty/components/dialogs/warranty-receipt-voucher-dialog.tsx",
                                                        lineNumber: 233,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-mono",
                                                        children: warrantyId
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/warranty/components/dialogs/warranty-receipt-voucher-dialog.tsx",
                                                        lineNumber: 234,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/warranty/components/dialogs/warranty-receipt-voucher-dialog.tsx",
                                                lineNumber: 232,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-medium",
                                                        children: "Khách hàng:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/warranty/components/dialogs/warranty-receipt-voucher-dialog.tsx",
                                                        lineNumber: 237,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: [
                                                            customer.name,
                                                            " • ",
                                                            customer.phone
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/features/warranty/components/dialogs/warranty-receipt-voucher-dialog.tsx",
                                                        lineNumber: 238,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/warranty/components/dialogs/warranty-receipt-voucher-dialog.tsx",
                                                lineNumber: 236,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/warranty/components/dialogs/warranty-receipt-voucher-dialog.tsx",
                                        lineNumber: 231,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/warranty/components/dialogs/warranty-receipt-voucher-dialog.tsx",
                                lineNumber: 229,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                        htmlFor: "amount",
                                        children: "Số tiền thu *"
                                    }, void 0, false, {
                                        fileName: "[project]/features/warranty/components/dialogs/warranty-receipt-voucher-dialog.tsx",
                                        lineNumber: 245,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Controller"], {
                                        name: "amount",
                                        control: control,
                                        rules: amountValidationRules,
                                        render: ({ field, fieldState })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$currency$2d$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CurrencyInput"], {
                                                        id: "amount",
                                                        value: field.value,
                                                        onChange: field.onChange,
                                                        placeholder: "Nhập số tiền cần thu thêm"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/warranty/components/dialogs/warranty-receipt-voucher-dialog.tsx",
                                                        lineNumber: 252,
                                                        columnNumber: 19
                                                    }, void 0),
                                                    fieldState.error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-destructive",
                                                        children: fieldState.error.message
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/warranty/components/dialogs/warranty-receipt-voucher-dialog.tsx",
                                                        lineNumber: 259,
                                                        columnNumber: 21
                                                    }, void 0)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/warranty/components/dialogs/warranty-receipt-voucher-dialog.tsx",
                                                lineNumber: 251,
                                                columnNumber: 17
                                            }, void 0)
                                    }, void 0, false, {
                                        fileName: "[project]/features/warranty/components/dialogs/warranty-receipt-voucher-dialog.tsx",
                                        lineNumber: 246,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-muted-foreground",
                                        children: amount > 0 ? `Đã nhập: ${amount.toLocaleString('vi-VN')} đ` : 'Chưa nhập số tiền'
                                    }, void 0, false, {
                                        fileName: "[project]/features/warranty/components/dialogs/warranty-receipt-voucher-dialog.tsx",
                                        lineNumber: 264,
                                        columnNumber: 13
                                    }, this),
                                    remainingAmountForReceipt > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-muted-foreground",
                                        children: [
                                            "Có thể thu tối đa: ",
                                            remainingAmountForReceipt.toLocaleString('vi-VN'),
                                            " đ"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/warranty/components/dialogs/warranty-receipt-voucher-dialog.tsx",
                                        lineNumber: 268,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/warranty/components/dialogs/warranty-receipt-voucher-dialog.tsx",
                                lineNumber: 244,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                        htmlFor: "reason",
                                        children: "Lý do thu thêm *"
                                    }, void 0, false, {
                                        fileName: "[project]/features/warranty/components/dialogs/warranty-receipt-voucher-dialog.tsx",
                                        lineNumber: 276,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Controller"], {
                                        name: "reason",
                                        control: control,
                                        rules: {
                                            required: true
                                        },
                                        render: ({ field })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Select"], {
                                                value: field.value,
                                                onValueChange: field.onChange,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                                        id: "reason",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectValue"], {}, void 0, false, {
                                                            fileName: "[project]/features/warranty/components/dialogs/warranty-receipt-voucher-dialog.tsx",
                                                            lineNumber: 284,
                                                            columnNumber: 21
                                                        }, void 0)
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/warranty/components/dialogs/warranty-receipt-voucher-dialog.tsx",
                                                        lineNumber: 283,
                                                        columnNumber: 19
                                                    }, void 0),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectContent"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                value: "Chi phí sửa chữa thêm",
                                                                children: "Chi phí sửa chữa thêm"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/warranty/components/dialogs/warranty-receipt-voucher-dialog.tsx",
                                                                lineNumber: 287,
                                                                columnNumber: 21
                                                            }, void 0),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                value: "Chi phí linh kiện",
                                                                children: "Chi phí linh kiện"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/warranty/components/dialogs/warranty-receipt-voucher-dialog.tsx",
                                                                lineNumber: 288,
                                                                columnNumber: 21
                                                            }, void 0),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                value: "Phí dịch vụ",
                                                                children: "Phí dịch vụ"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/warranty/components/dialogs/warranty-receipt-voucher-dialog.tsx",
                                                                lineNumber: 289,
                                                                columnNumber: 21
                                                            }, void 0),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                value: "Bù trừ thiếu hụt",
                                                                children: "Bù trừ thiếu hụt"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/warranty/components/dialogs/warranty-receipt-voucher-dialog.tsx",
                                                                lineNumber: 290,
                                                                columnNumber: 21
                                                            }, void 0),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                value: "Khác",
                                                                children: "Khác"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/warranty/components/dialogs/warranty-receipt-voucher-dialog.tsx",
                                                                lineNumber: 291,
                                                                columnNumber: 21
                                                            }, void 0)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/features/warranty/components/dialogs/warranty-receipt-voucher-dialog.tsx",
                                                        lineNumber: 286,
                                                        columnNumber: 19
                                                    }, void 0)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/warranty/components/dialogs/warranty-receipt-voucher-dialog.tsx",
                                                lineNumber: 282,
                                                columnNumber: 17
                                            }, void 0)
                                    }, void 0, false, {
                                        fileName: "[project]/features/warranty/components/dialogs/warranty-receipt-voucher-dialog.tsx",
                                        lineNumber: 277,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/warranty/components/dialogs/warranty-receipt-voucher-dialog.tsx",
                                lineNumber: 275,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                        htmlFor: "paymentMethod",
                                        children: "Phương thức thu *"
                                    }, void 0, false, {
                                        fileName: "[project]/features/warranty/components/dialogs/warranty-receipt-voucher-dialog.tsx",
                                        lineNumber: 300,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Controller"], {
                                        name: "paymentMethod",
                                        control: control,
                                        render: ({ field })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Select"], {
                                                value: field.value,
                                                onValueChange: field.onChange,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                                        id: "paymentMethod",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectValue"], {}, void 0, false, {
                                                            fileName: "[project]/features/warranty/components/dialogs/warranty-receipt-voucher-dialog.tsx",
                                                            lineNumber: 307,
                                                            columnNumber: 21
                                                        }, void 0)
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/warranty/components/dialogs/warranty-receipt-voucher-dialog.tsx",
                                                        lineNumber: 306,
                                                        columnNumber: 19
                                                    }, void 0),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectContent"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                value: "Tiền mặt",
                                                                children: "Tiền mặt"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/warranty/components/dialogs/warranty-receipt-voucher-dialog.tsx",
                                                                lineNumber: 310,
                                                                columnNumber: 21
                                                            }, void 0),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                value: "Chuyển khoản",
                                                                children: "Chuyển khoản"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/warranty/components/dialogs/warranty-receipt-voucher-dialog.tsx",
                                                                lineNumber: 311,
                                                                columnNumber: 21
                                                            }, void 0)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/features/warranty/components/dialogs/warranty-receipt-voucher-dialog.tsx",
                                                        lineNumber: 309,
                                                        columnNumber: 19
                                                    }, void 0)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/warranty/components/dialogs/warranty-receipt-voucher-dialog.tsx",
                                                lineNumber: 305,
                                                columnNumber: 17
                                            }, void 0)
                                    }, void 0, false, {
                                        fileName: "[project]/features/warranty/components/dialogs/warranty-receipt-voucher-dialog.tsx",
                                        lineNumber: 301,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/warranty/components/dialogs/warranty-receipt-voucher-dialog.tsx",
                                lineNumber: 299,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                        htmlFor: "notes",
                                        children: "Ghi chú"
                                    }, void 0, false, {
                                        fileName: "[project]/features/warranty/components/dialogs/warranty-receipt-voucher-dialog.tsx",
                                        lineNumber: 320,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Controller"], {
                                        name: "notes",
                                        control: control,
                                        render: ({ field })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Textarea"], {
                                                ...field,
                                                id: "notes",
                                                placeholder: "Thêm ghi chú cho phiếu thu...",
                                                rows: 3
                                            }, void 0, false, {
                                                fileName: "[project]/features/warranty/components/dialogs/warranty-receipt-voucher-dialog.tsx",
                                                lineNumber: 325,
                                                columnNumber: 17
                                            }, void 0)
                                    }, void 0, false, {
                                        fileName: "[project]/features/warranty/components/dialogs/warranty-receipt-voucher-dialog.tsx",
                                        lineNumber: 321,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/warranty/components/dialogs/warranty-receipt-voucher-dialog.tsx",
                                lineNumber: 319,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Alert"], {
                                className: "border-blue-200 bg-blue-50",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                        className: "h-4 w-4 text-blue-600"
                                    }, void 0, false, {
                                        fileName: "[project]/features/warranty/components/dialogs/warranty-receipt-voucher-dialog.tsx",
                                        lineNumber: 337,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDescription"], {
                                        className: "text-blue-800 text-sm",
                                        children: [
                                            "💡 ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: "Lưu ý:"
                                            }, void 0, false, {
                                                fileName: "[project]/features/warranty/components/dialogs/warranty-receipt-voucher-dialog.tsx",
                                                lineNumber: 339,
                                                columnNumber: 18
                                            }, this),
                                            " Phiếu thu dùng khi khách hàng phải bù thêm chi phí (sản phẩm hỏng nặng, cần sửa chữa thêm, v.v.)"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/warranty/components/dialogs/warranty-receipt-voucher-dialog.tsx",
                                        lineNumber: 338,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/warranty/components/dialogs/warranty-receipt-voucher-dialog.tsx",
                                lineNumber: 336,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogFooter"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                        type: "button",
                                        variant: "outline",
                                        onClick: ()=>setOpen(false),
                                        children: "Hủy"
                                    }, void 0, false, {
                                        fileName: "[project]/features/warranty/components/dialogs/warranty-receipt-voucher-dialog.tsx",
                                        lineNumber: 344,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                        type: "submit",
                                        children: "Tạo phiếu thu"
                                    }, void 0, false, {
                                        fileName: "[project]/features/warranty/components/dialogs/warranty-receipt-voucher-dialog.tsx",
                                        lineNumber: 347,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/warranty/components/dialogs/warranty-receipt-voucher-dialog.tsx",
                                lineNumber: 343,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/warranty/components/dialogs/warranty-receipt-voucher-dialog.tsx",
                        lineNumber: 227,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/warranty/components/dialogs/warranty-receipt-voucher-dialog.tsx",
                lineNumber: 222,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/warranty/components/dialogs/warranty-receipt-voucher-dialog.tsx",
        lineNumber: 211,
        columnNumber: 5
    }, this);
}
}),
"[project]/features/warranty/components/dialogs/warranty-reopen-from-cancelled-dialog.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WarrantyReopenFromCancelledDialog",
    ()=>WarrantyReopenFromCancelledDialog
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * Reopen From Cancelled Dialog
 * Dialog để mở lại phiếu bảo hành từ trạng thái đã hủy
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/alert-dialog.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/textarea.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/features/warranty/store.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/store/index.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/products/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
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
const HISTORY_ID_PREFIX = 'WARRANTYHISTORY';
const generateHistorySystemId = (historyEntries = [])=>{
    const latestCounter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getMaxSystemIdCounter"])(historyEntries, HISTORY_ID_PREFIX);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(`${HISTORY_ID_PREFIX}${String(latestCounter + 1).padStart(6, '0')}`);
};
function WarrantyReopenFromCancelledDialog({ open, onOpenChange, ticket }) {
    const [reopenReason, setReopenReason] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]('');
    const { user, employee } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const performerName = employee?.fullName ?? user?.name ?? 'Hệ thống';
    const performerSystemId = employee?.systemId ?? user?.employeeId;
    const { update, findById } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useWarrantyStore"])();
    const handleReopen = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](()=>{
        if (!ticket || !reopenReason.trim()) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Vui lòng nhập lý do mở lại phiếu');
            return;
        }
        try {
            // ✅ RE-COMMIT STOCK: Commit stock again when reopening from cancelled
            const replacedProducts = ticket.products.filter((p)=>p.resolution === 'replace');
            if (replacedProducts.length > 0) {
                const productStore = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState();
                replacedProducts.forEach((warrantyProduct)=>{
                    const fallbackProduct = warrantyProduct.productSystemId ? productStore.data.find((p)=>p.systemId === warrantyProduct.productSystemId) : warrantyProduct.sku ? productStore.data.find((p)=>p.id === warrantyProduct.sku) : undefined;
                    const productSystemId = warrantyProduct.productSystemId ?? fallbackProduct?.systemId;
                    if (!productSystemId) {
                        console.warn('[WARRANTY REOPEN] Không tìm thấy SystemId cho sản phẩm:', warrantyProduct.productName || warrantyProduct.sku);
                        return;
                    }
                    const quantityToCommit = warrantyProduct.quantity || 1;
                    productStore.commitStock(productSystemId, ticket.branchSystemId, quantityToCommit);
                    console.log('[WARRANTY REOPEN] Đã giữ lại hàng:', {
                        productSystemId,
                        productId: fallbackProduct?.id ?? warrantyProduct.sku,
                        productName: fallbackProduct?.name ?? warrantyProduct.productName,
                        quantity: quantityToCommit,
                        warranty: ticket.id
                    });
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].info('Đã giữ hàng cho phiếu bảo hành', {
                    description: `${replacedProducts.length} sản phẩm đã được giữ lại trong kho`,
                    duration: 3000
                });
            }
            // ✅ Add history entry WITH REASON
            const inventoryNote = replacedProducts.length > 0 ? ` (Đã giữ lại ${replacedProducts.length} sản phẩm)` : '';
            // ✅ Get latest ticket from store to avoid stale history
            const latestTicket = findById(ticket.systemId);
            if (!latestTicket) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Không tìm thấy phiếu');
                return;
            }
            const newHistory = {
                systemId: generateHistorySystemId(latestTicket.history ?? []),
                action: 'Mở lại phiếu từ trạng thái Đã hủy',
                actionLabel: 'Đã mở lại phiếu từ trạng thái Đã hủy',
                entityType: 'status',
                performedBy: performerName,
                performedBySystemId: performerSystemId ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(performerSystemId) : undefined,
                performedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentDate"])()),
                note: `Lý do mở lại: ${reopenReason}${inventoryNote}`
            };
            update(ticket.systemId, {
                cancelledAt: undefined,
                status: 'pending',
                returnedAt: undefined,
                processedAt: undefined,
                processingStartedAt: undefined,
                linkedOrderSystemId: undefined,
                history: [
                    ...latestTicket.history,
                    newHistory
                ]
            });
            onOpenChange(false);
            setReopenReason('');
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success('Đã mở lại phiếu bảo hành');
        } catch (error) {
            console.error('Failed to reopen ticket:', error);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Không thể mở lại phiếu');
        }
    }, [
        ticket,
        reopenReason,
        update,
        performerName,
        performerSystemId,
        findById,
        onOpenChange
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialog"], {
        open: open,
        onOpenChange: onOpenChange,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogContent"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogHeader"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogTitle"], {
                            children: "Xác nhận mở lại phiếu"
                        }, void 0, false, {
                            fileName: "[project]/features/warranty/components/dialogs/warranty-reopen-from-cancelled-dialog.tsx",
                            lineNumber: 138,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogDescription"], {
                            children: "Bạn có chắc chắn muốn mở lại phiếu bảo hành này? Vui lòng nhập lý do mở lại."
                        }, void 0, false, {
                            fileName: "[project]/features/warranty/components/dialogs/warranty-reopen-from-cancelled-dialog.tsx",
                            lineNumber: 139,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/warranty/components/dialogs/warranty-reopen-from-cancelled-dialog.tsx",
                    lineNumber: 137,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Textarea"], {
                    value: reopenReason,
                    onChange: (e)=>setReopenReason(e.target.value),
                    placeholder: "Nhập lý do mở lại phiếu (bắt buộc)...",
                    className: "min-h-[100px]"
                }, void 0, false, {
                    fileName: "[project]/features/warranty/components/dialogs/warranty-reopen-from-cancelled-dialog.tsx",
                    lineNumber: 143,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogFooter"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogCancel"], {
                            onClick: ()=>setReopenReason(''),
                            children: "Hủy"
                        }, void 0, false, {
                            fileName: "[project]/features/warranty/components/dialogs/warranty-reopen-from-cancelled-dialog.tsx",
                            lineNumber: 150,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogAction"], {
                            onClick: handleReopen,
                            children: "Mở lại"
                        }, void 0, false, {
                            fileName: "[project]/features/warranty/components/dialogs/warranty-reopen-from-cancelled-dialog.tsx",
                            lineNumber: 151,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/warranty/components/dialogs/warranty-reopen-from-cancelled-dialog.tsx",
                    lineNumber: 149,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/features/warranty/components/dialogs/warranty-reopen-from-cancelled-dialog.tsx",
            lineNumber: 136,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/features/warranty/components/dialogs/warranty-reopen-from-cancelled-dialog.tsx",
        lineNumber: 135,
        columnNumber: 5
    }, this);
}
}),
"[project]/features/warranty/components/dialogs/warranty-reopen-from-returned-dialog.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WarrantyReopenFromReturnedDialog",
    ()=>WarrantyReopenFromReturnedDialog
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * Reopen From Returned Dialog
 * Dialog để mở lại phiếu bảo hành từ trạng thái đã trả/kết thúc
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/alert-dialog.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/textarea.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/features/warranty/store.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/store/index.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
function WarrantyReopenFromReturnedDialog({ open, onOpenChange, ticket }) {
    const [reopenReason, setReopenReason] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]('');
    const { user: currentUser } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const { update, updateStatus, addHistory } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useWarrantyStore"])();
    const handleReopen = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](()=>{
        if (!ticket || !reopenReason.trim()) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Vui lòng nhập lý do mở lại');
            return;
        }
        try {
            // Determine target status based on current status
            const targetStatus = ticket.status === 'completed' ? 'returned' : 'processed';
            // ⚠️ KHÔNG ĐỘNG CHẠM GÌ KHI MỞ LẠI TỪ COMPLETED
            // Lý do:
            // - Kết thúc = Đơn đã xong, hàng đã xuất, tiền đã thanh toán
            // - Mở lại CHỈ để xem lại, không được sửa/thay đổi gì
            // - Nếu muốn điều chỉnh → Phải thao tác thêm (tạo phiếu mới, hoàn hàng thủ công, etc.)
            if (ticket.status === 'completed') {
                console.log('📋 [REOPEN FROM COMPLETED] Chỉ mở để xem, không động kho/voucher:', {
                    ticketId: ticket.id,
                    note: 'Read-only reopen - No inventory/payment changes'
                });
            }
            // ✅ Pass lý do mở lại vào note parameter
            updateStatus(ticket.systemId, targetStatus, `Lý do: ${reopenReason}`);
            // Clear returnedAt và linkedOrderSystemId only when going back to processed (not from completed)
            if (targetStatus === 'processed') {
                update(ticket.systemId, {
                    returnedAt: undefined,
                    linkedOrderSystemId: undefined
                });
            }
            onOpenChange(false);
            setReopenReason('');
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success(`Đã mở lại phiếu`, {
                description: ticket.status === 'completed' ? 'Phiếu đã mở lại để xem. Không thay đổi kho hàng hay thanh toán.' : undefined
            });
        } catch (error) {
            console.error('Failed to reopen ticket:', error);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Không thể mở lại phiếu');
        }
    }, [
        ticket,
        reopenReason,
        update,
        updateStatus,
        onOpenChange
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialog"], {
        open: open,
        onOpenChange: onOpenChange,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogContent"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogHeader"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogTitle"], {
                            children: "Xác nhận mở lại phiếu đã trả"
                        }, void 0, false, {
                            fileName: "[project]/features/warranty/components/dialogs/warranty-reopen-from-returned-dialog.tsx",
                            lineNumber: 85,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogDescription"], {
                            children: "Phiếu này đã trả hàng cho khách. Vui lòng nhập lý do cần mở lại."
                        }, void 0, false, {
                            fileName: "[project]/features/warranty/components/dialogs/warranty-reopen-from-returned-dialog.tsx",
                            lineNumber: 86,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/warranty/components/dialogs/warranty-reopen-from-returned-dialog.tsx",
                    lineNumber: 84,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Textarea"], {
                    value: reopenReason,
                    onChange: (e)=>setReopenReason(e.target.value),
                    placeholder: "Nhập lý do mở lại (bắt buộc)...",
                    className: "min-h-[100px]"
                }, void 0, false, {
                    fileName: "[project]/features/warranty/components/dialogs/warranty-reopen-from-returned-dialog.tsx",
                    lineNumber: 90,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogFooter"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogCancel"], {
                            onClick: ()=>setReopenReason(''),
                            children: "Hủy"
                        }, void 0, false, {
                            fileName: "[project]/features/warranty/components/dialogs/warranty-reopen-from-returned-dialog.tsx",
                            lineNumber: 97,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogAction"], {
                            onClick: handleReopen,
                            children: "Mở lại"
                        }, void 0, false, {
                            fileName: "[project]/features/warranty/components/dialogs/warranty-reopen-from-returned-dialog.tsx",
                            lineNumber: 98,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/warranty/components/dialogs/warranty-reopen-from-returned-dialog.tsx",
                    lineNumber: 96,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/features/warranty/components/dialogs/warranty-reopen-from-returned-dialog.tsx",
            lineNumber: 83,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/features/warranty/components/dialogs/warranty-reopen-from-returned-dialog.tsx",
        lineNumber: 82,
        columnNumber: 5
    }, this);
}
}),
"[project]/features/warranty/components/dialogs/warranty-return-method-dialog.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WarrantyReturnMethodDialog",
    ()=>WarrantyReturnMethodDialog
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dialog.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$virtualized$2d$combobox$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/virtualized-combobox.tsx [app-ssr] (ecmascript)");
;
;
;
;
;
function WarrantyReturnMethodDialog({ open, ticket, currentMethodLabel, returnMethod, onReturnMethodChange, selectedOrderValue, onOrderSelect, orderSearchResults, orderSearchQuery, onOrderSearchChange, isSearchingOrders, totalOrderCount, onConfirmDirect, onConfirmWithOrder, onOpenChange, onReset }) {
    const handleOpenChange = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((nextOpen)=>{
        if (!nextOpen) {
            onReset();
        }
        onOpenChange(nextOpen);
    }, [
        onOpenChange,
        onReset
    ]);
    const handleConfirm = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](()=>{
        if (returnMethod === 'direct') {
            onConfirmDirect();
        } else if (returnMethod === 'order') {
            onConfirmWithOrder();
        }
    }, [
        onConfirmDirect,
        onConfirmWithOrder,
        returnMethod
    ]);
    const handleCancel = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](()=>{
        onReset();
        onOpenChange(false);
    }, [
        onOpenChange,
        onReset
    ]);
    const showCurrentMethod = ticket?.status === 'returned' && (currentMethodLabel || ticket);
    const orderCountLabel = totalOrderCount.toLocaleString('vi-VN');
    const isOrderDisabled = returnMethod === 'order' && !selectedOrderValue;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Dialog"], {
        open: open,
        onOpenChange: handleOpenChange,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogContent"], {
            className: "max-w-2xl max-h-[90vh] overflow-y-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogHeader"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogTitle"], {
                            children: ticket?.status === 'returned' ? 'Cập nhật phương thức trả hàng' : 'Đã trả hàng cho khách'
                        }, void 0, false, {
                            fileName: "[project]/features/warranty/components/dialogs/warranty-return-method-dialog.tsx",
                            lineNumber: 81,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogDescription"], {
                            children: ticket?.status === 'returned' ? 'Thay đổi phương thức trả hàng cho khách. Phương thức hiện tại sẽ được cập nhật.' : 'Chọn phương thức trả hàng cho khách.'
                        }, void 0, false, {
                            fileName: "[project]/features/warranty/components/dialogs/warranty-return-method-dialog.tsx",
                            lineNumber: 84,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/warranty/components/dialogs/warranty-return-method-dialog.tsx",
                    lineNumber: 80,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "py-4 space-y-4",
                    children: [
                        showCurrentMethod && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-blue-50 border border-blue-200 rounded-lg p-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-sm font-medium text-blue-900 mb-1",
                                    children: "Phương thức hiện tại:"
                                }, void 0, false, {
                                    fileName: "[project]/features/warranty/components/dialogs/warranty-return-method-dialog.tsx",
                                    lineNumber: 94,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-sm text-blue-700",
                                    children: currentMethodLabel || 'Khách lấy trực tiếp tại cửa hàng'
                                }, void 0, false, {
                                    fileName: "[project]/features/warranty/components/dialogs/warranty-return-method-dialog.tsx",
                                    lineNumber: 97,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/warranty/components/dialogs/warranty-return-method-dialog.tsx",
                            lineNumber: 93,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "text-sm font-medium",
                                    children: "Phương thức trả hàng *"
                                }, void 0, false, {
                                    fileName: "[project]/features/warranty/components/dialogs/warranty-return-method-dialog.tsx",
                                    lineNumber: 104,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-2 gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                            type: "button",
                                            variant: returnMethod === 'direct' ? 'default' : 'outline',
                                            className: "h-auto py-4 flex flex-col items-center gap-2",
                                            onClick: ()=>onReturnMethodChange('direct'),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-base font-semibold",
                                                    children: "Khách lấy trực tiếp"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/warranty/components/dialogs/warranty-return-method-dialog.tsx",
                                                    lineNumber: 112,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-xs text-muted-foreground",
                                                    children: "Tại cửa hàng"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/warranty/components/dialogs/warranty-return-method-dialog.tsx",
                                                    lineNumber: 113,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/warranty/components/dialogs/warranty-return-method-dialog.tsx",
                                            lineNumber: 106,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                            type: "button",
                                            variant: returnMethod === 'order' ? 'default' : 'outline',
                                            className: "h-auto py-4 flex flex-col items-center gap-2",
                                            onClick: ()=>onReturnMethodChange('order'),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-base font-semibold",
                                                    children: "Giao qua đơn hàng"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/warranty/components/dialogs/warranty-return-method-dialog.tsx",
                                                    lineNumber: 121,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-xs text-muted-foreground",
                                                    children: "Link với đơn hàng"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/warranty/components/dialogs/warranty-return-method-dialog.tsx",
                                                    lineNumber: 122,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/warranty/components/dialogs/warranty-return-method-dialog.tsx",
                                            lineNumber: 115,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/warranty/components/dialogs/warranty-return-method-dialog.tsx",
                                    lineNumber: 105,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/warranty/components/dialogs/warranty-return-method-dialog.tsx",
                            lineNumber: 103,
                            columnNumber: 11
                        }, this),
                        returnMethod === 'order' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "text-sm font-medium",
                                    children: "Chọn đơn hàng"
                                }, void 0, false, {
                                    fileName: "[project]/features/warranty/components/dialogs/warranty-return-method-dialog.tsx",
                                    lineNumber: 129,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-xs text-muted-foreground mb-2",
                                    children: [
                                        "💡 ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: "Tìm kiếm thông minh:"
                                        }, void 0, false, {
                                            fileName: "[project]/features/warranty/components/dialogs/warranty-return-method-dialog.tsx",
                                            lineNumber: 131,
                                            columnNumber: 20
                                        }, this),
                                        " Nhập mã đơn hàng hoặc tên khách để tìm nhanh. Hệ thống tự động lọc kết quả từ ",
                                        orderCountLabel,
                                        " đơn hàng."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/warranty/components/dialogs/warranty-return-method-dialog.tsx",
                                    lineNumber: 130,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$virtualized$2d$combobox$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VirtualizedCombobox"], {
                                    options: orderSearchResults,
                                    value: selectedOrderValue,
                                    onChange: onOrderSelect,
                                    onSearchChange: onOrderSearchChange,
                                    placeholder: "Tìm kiếm đơn hàng...",
                                    searchPlaceholder: "Nhập mã đơn hoặc tên khách hàng...",
                                    emptyPlaceholder: orderSearchQuery ? 'Không tìm thấy đơn hàng phù hợp' : 'Nhập từ khóa để tìm kiếm đơn hàng',
                                    isLoading: isSearchingOrders,
                                    minSearchLength: 0,
                                    estimatedItemHeight: 56,
                                    maxHeight: 400
                                }, void 0, false, {
                                    fileName: "[project]/features/warranty/components/dialogs/warranty-return-method-dialog.tsx",
                                    lineNumber: 134,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-muted-foreground",
                                    children: isSearchingOrders ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-blue-600",
                                        children: "⏳ Đang tìm kiếm..."
                                    }, void 0, false, {
                                        fileName: "[project]/features/warranty/components/dialogs/warranty-return-method-dialog.tsx",
                                        lineNumber: 153,
                                        columnNumber: 19
                                    }, this) : orderSearchQuery ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            "✓ Tìm thấy ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: orderSearchResults.length
                                            }, void 0, false, {
                                                fileName: "[project]/features/warranty/components/dialogs/warranty-return-method-dialog.tsx",
                                                lineNumber: 155,
                                                columnNumber: 36
                                            }, this),
                                            " đơn hàng"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/warranty/components/dialogs/warranty-return-method-dialog.tsx",
                                        lineNumber: 155,
                                        columnNumber: 19
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            "Hiển thị ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: orderSearchResults.length
                                            }, void 0, false, {
                                                fileName: "[project]/features/warranty/components/dialogs/warranty-return-method-dialog.tsx",
                                                lineNumber: 157,
                                                columnNumber: 34
                                            }, this),
                                            " đơn hàng gần nhất"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/warranty/components/dialogs/warranty-return-method-dialog.tsx",
                                        lineNumber: 157,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/features/warranty/components/dialogs/warranty-return-method-dialog.tsx",
                                    lineNumber: 151,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/warranty/components/dialogs/warranty-return-method-dialog.tsx",
                            lineNumber: 128,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/warranty/components/dialogs/warranty-return-method-dialog.tsx",
                    lineNumber: 91,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-end gap-2 pt-4 border-t",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "outline",
                            onClick: handleCancel,
                            children: "Hủy"
                        }, void 0, false, {
                            fileName: "[project]/features/warranty/components/dialogs/warranty-return-method-dialog.tsx",
                            lineNumber: 165,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                            onClick: handleConfirm,
                            disabled: !returnMethod || isOrderDisabled,
                            children: "Xác nhận"
                        }, void 0, false, {
                            fileName: "[project]/features/warranty/components/dialogs/warranty-return-method-dialog.tsx",
                            lineNumber: 168,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/warranty/components/dialogs/warranty-return-method-dialog.tsx",
                    lineNumber: 164,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/features/warranty/components/dialogs/warranty-return-method-dialog.tsx",
            lineNumber: 79,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/features/warranty/components/dialogs/warranty-return-method-dialog.tsx",
        lineNumber: 78,
        columnNumber: 5
    }, this);
}
}),
"[project]/features/warranty/hooks/use-warranty-reminders.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_REMINDER_TEMPLATES",
    ()=>DEFAULT_REMINDER_TEMPLATES,
    "formatReminderMessage",
    ()=>formatReminderMessage,
    "loadReminderTemplates",
    ()=>loadReminderTemplates,
    "saveReminderTemplates",
    ()=>saveReminderTemplates,
    "useWarrantyReminders",
    ()=>useWarrantyReminders
]);
/**
 * Warranty Reminders Hook
 * Auto-scheduling and reminder management for warranty tickets
 * Pattern copied from Complaints system
 * 
 * NOTE: Templates are now synced with database via warranty-settings-sync.ts
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/features/warranty/store.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/store/index.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$notification$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/notification-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$warranty$2d$settings$2d$sync$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/warranty-settings-sync.ts [app-ssr] (ecmascript)");
;
;
;
;
const DEFAULT_REMINDER_TEMPLATES = [
    {
        id: 'overdue',
        name: 'Nhắc nhở quá hạn',
        message: 'Phiếu bảo hành #{ticketId} đã quá hạn xử lý. Vui lòng kiểm tra và cập nhật trạng thái.',
        isDefault: true
    },
    {
        id: 'follow-up',
        name: 'Theo dõi tiến độ',
        message: 'Phiếu bảo hành #{ticketId} đang được xử lý. Vui lòng cập nhật tiến độ cho khách hàng {customerName}.',
        isDefault: true
    },
    {
        id: 'return-ready',
        name: 'Sẵn sàng trả hàng',
        message: 'Sản phẩm bảo hành #{ticketId} đã xử lý xong. Vui lòng chuẩn bị trả hàng cho khách {customerName}.',
        isDefault: true
    },
    {
        id: 'custom',
        name: 'Nhắc nhở tùy chỉnh',
        message: '',
        isDefault: false
    }
];
function loadReminderTemplates() {
    try {
        const custom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$warranty$2d$settings$2d$sync$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getWarrantyTemplatesSync"])();
        return [
            ...DEFAULT_REMINDER_TEMPLATES,
            ...custom
        ];
    } catch (error) {
        console.error('Failed to load reminder templates:', error);
        return DEFAULT_REMINDER_TEMPLATES;
    }
}
function saveReminderTemplates(templates) {
    try {
        const customTemplates = templates.filter((t)=>!t.isDefault);
        // Fire and forget - save to database in background
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$warranty$2d$settings$2d$sync$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["saveWarrantyTemplatesAsync"])(customTemplates).catch((error)=>{
            console.error('Failed to save reminder templates:', error);
        });
    } catch (error) {
        console.error('Failed to save reminder templates:', error);
    }
}
function formatReminderMessage(template, ticket) {
    return template.replace(/{ticketId}/g, ticket.id).replace(/{customerName}/g, ticket.customerName).replace(/{customerPhone}/g, ticket.customerPhone).replace(/{trackingCode}/g, ticket.trackingCode || 'N/A');
}
function useWarrantyReminders() {
    const [isReminderModalOpen, setIsReminderModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedTicket, setSelectedTicket] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [templates] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(loadReminderTemplates());
    /**
   * Open reminder modal for a ticket
   */ const openReminderModal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((ticket)=>{
        setSelectedTicket(ticket);
        setIsReminderModalOpen(true);
    }, []);
    /**
   * Close reminder modal
   */ const closeReminderModal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setIsReminderModalOpen(false);
        setSelectedTicket(null);
    }, []);
    /**
   * Send reminder for a ticket
   */ const sendReminder = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (ticket, templateId, customMessage, assignedTo)=>{
        try {
            const template = templates.find((t)=>t.id === templateId);
            if (!template) {
                throw new Error('Template not found');
            }
            const message = customMessage || formatReminderMessage(template.message, ticket);
            const reminder = {
                id: `reminder_${Date.now()}`,
                ticketSystemId: ticket.systemId,
                ticketId: ticket.id,
                templateId,
                message,
                assignedTo: assignedTo || ticket.employeeSystemId || 'unassigned',
                createdBy: 'current_user',
                createdAt: new Date(),
                status: 'sent'
            };
            // Store reminder in ticket history
            const { addHistory } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useWarrantyStore"].getState();
            addHistory(ticket.systemId, 'Gửi nhắc nhở', 'current_user', message);
            // Send notification
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$notification$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["notifyWarrantyReminder"])(ticket.id, message);
            return true;
        } catch (error) {
            console.error('Failed to send reminder:', error);
            return false;
        }
    }, [
        templates
    ]);
    /**
   * Schedule automatic reminder for overdue tickets
   */ const scheduleAutoReminder = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((ticket)=>{
        // This would be called by a background job
        // For now, it's a placeholder for future implementation
        console.log('Auto reminder scheduled for:', ticket.id);
    }, []);
    /**
   * Get pending reminders for a ticket
   */ const getTicketReminders = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((ticketSystemId)=>{
        // TODO: Load from store or API
        return [];
    }, []);
    /**
   * Dismiss a reminder
   */ const dismissReminder = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((reminderId)=>{
        // TODO: Update reminder status
        console.log('Reminder dismissed:', reminderId);
    }, []);
    return {
        // Modal state
        isReminderModalOpen,
        openReminderModal,
        closeReminderModal,
        selectedTicket,
        // Templates
        templates,
        // Actions
        sendReminder,
        scheduleAutoReminder,
        getTicketReminders,
        dismissReminder,
        // Utils
        formatReminderMessage
    };
}
}),
"[project]/features/warranty/components/dialogs/warranty-reminder-dialog.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WarrantyReminderDialog",
    ()=>WarrantyReminderDialog
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * Warranty Reminder Dialog
 * Modal for sending reminders for warranty tickets
 * Pattern copied from Complaints system
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bell.js [app-ssr] (ecmascript) <export default as Bell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/send.js [app-ssr] (ecmascript) <export default as Send>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dialog.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/label.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/textarea.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/select.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$hooks$2f$use$2d$warranty$2d$reminders$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/hooks/use-warranty-reminders.ts [app-ssr] (ecmascript)");
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
function WarrantyReminderDialog({ open, onOpenChange, ticket, templates, onSendReminder }) {
    const [selectedTemplateId, setSelectedTemplateId] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]('');
    const [customMessage, setCustomMessage] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]('');
    const [isSending, setIsSending] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](false);
    // Reset state when modal opens
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        if (open && ticket) {
            // Default to first template
            const defaultTemplate = templates.find((t)=>t.id === 'follow-up') || templates[0];
            setSelectedTemplateId(defaultTemplate?.id || '');
            setCustomMessage('');
        }
    }, [
        open,
        ticket,
        templates
    ]);
    // Update message preview when template changes
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        if (!selectedTemplateId || !ticket) return;
        const template = templates.find((t)=>t.id === selectedTemplateId);
        if (!template) return;
        // For custom template, keep user input
        if (template.id === 'custom') {
            return;
        }
        // Auto-fill message from template
        const formatted = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$hooks$2f$use$2d$warranty$2d$reminders$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatReminderMessage"])(template.message, ticket);
        setCustomMessage(formatted);
    }, [
        selectedTemplateId,
        ticket,
        templates
    ]);
    const handleSend = async ()=>{
        if (!ticket) return;
        if (!customMessage.trim()) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Vui lòng nhập nội dung nhắc nhở');
            return;
        }
        setIsSending(true);
        try {
            const success = await onSendReminder(ticket, selectedTemplateId, customMessage);
            if (success) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success('Đã gửi nhắc nhở thành công');
                onOpenChange(false);
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Không thể gửi nhắc nhở');
            }
        } catch (error) {
            console.error('Send reminder error:', error);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Có lỗi xảy ra khi gửi nhắc nhở');
        } finally{
            setIsSending(false);
        }
    };
    if (!ticket) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Dialog"], {
        open: open,
        onOpenChange: onOpenChange,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogContent"], {
            className: "sm:max-w-[500px]",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogHeader"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogTitle"], {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"], {
                                className: "h-5 w-5"
                            }, void 0, false, {
                                fileName: "[project]/features/warranty/components/dialogs/warranty-reminder-dialog.tsx",
                                lineNumber: 114,
                                columnNumber: 13
                            }, this),
                            "Gửi nhắc nhở - ",
                            ticket.id
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/warranty/components/dialogs/warranty-reminder-dialog.tsx",
                        lineNumber: 113,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/features/warranty/components/dialogs/warranty-reminder-dialog.tsx",
                    lineNumber: 112,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-4 py-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-lg border border-border p-3 bg-muted/50 space-y-1 text-sm",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "font-medium",
                                    children: ticket.customerName
                                }, void 0, false, {
                                    fileName: "[project]/features/warranty/components/dialogs/warranty-reminder-dialog.tsx",
                                    lineNumber: 122,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-muted-foreground",
                                    children: ticket.customerPhone
                                }, void 0, false, {
                                    fileName: "[project]/features/warranty/components/dialogs/warranty-reminder-dialog.tsx",
                                    lineNumber: 123,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-muted-foreground",
                                    children: [
                                        ticket.summary.totalProducts,
                                        " sản phẩm"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/warranty/components/dialogs/warranty-reminder-dialog.tsx",
                                    lineNumber: 124,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/warranty/components/dialogs/warranty-reminder-dialog.tsx",
                            lineNumber: 121,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                    htmlFor: "template",
                                    children: "Mẫu nhắc nhở"
                                }, void 0, false, {
                                    fileName: "[project]/features/warranty/components/dialogs/warranty-reminder-dialog.tsx",
                                    lineNumber: 131,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Select"], {
                                    value: selectedTemplateId,
                                    onValueChange: setSelectedTemplateId,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                            id: "template",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectValue"], {
                                                placeholder: "Chọn mẫu..."
                                            }, void 0, false, {
                                                fileName: "[project]/features/warranty/components/dialogs/warranty-reminder-dialog.tsx",
                                                lineNumber: 137,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/features/warranty/components/dialogs/warranty-reminder-dialog.tsx",
                                            lineNumber: 136,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectContent"], {
                                            children: templates.map((template)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                    value: template.id,
                                                    children: template.name
                                                }, template.id, false, {
                                                    fileName: "[project]/features/warranty/components/dialogs/warranty-reminder-dialog.tsx",
                                                    lineNumber: 141,
                                                    columnNumber: 19
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/features/warranty/components/dialogs/warranty-reminder-dialog.tsx",
                                            lineNumber: 139,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/warranty/components/dialogs/warranty-reminder-dialog.tsx",
                                    lineNumber: 132,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/warranty/components/dialogs/warranty-reminder-dialog.tsx",
                            lineNumber: 130,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                    htmlFor: "message",
                                    children: "Nội dung nhắc nhở"
                                }, void 0, false, {
                                    fileName: "[project]/features/warranty/components/dialogs/warranty-reminder-dialog.tsx",
                                    lineNumber: 151,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Textarea"], {
                                    id: "message",
                                    value: customMessage,
                                    onChange: (e)=>setCustomMessage(e.target.value),
                                    placeholder: "Nhập nội dung nhắc nhở...",
                                    rows: 6,
                                    className: "resize-none"
                                }, void 0, false, {
                                    fileName: "[project]/features/warranty/components/dialogs/warranty-reminder-dialog.tsx",
                                    lineNumber: 152,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-xs text-muted-foreground",
                                    children: [
                                        "Có thể dùng: ",
                                        '{ticketId}',
                                        ", ",
                                        '{customerName}',
                                        ", ",
                                        '{customerPhone}',
                                        ", ",
                                        '{trackingCode}'
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/warranty/components/dialogs/warranty-reminder-dialog.tsx",
                                    lineNumber: 160,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/warranty/components/dialogs/warranty-reminder-dialog.tsx",
                            lineNumber: 150,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/warranty/components/dialogs/warranty-reminder-dialog.tsx",
                    lineNumber: 119,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogFooter"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                            type: "button",
                            variant: "outline",
                            onClick: ()=>onOpenChange(false),
                            disabled: isSending,
                            children: "Hủy"
                        }, void 0, false, {
                            fileName: "[project]/features/warranty/components/dialogs/warranty-reminder-dialog.tsx",
                            lineNumber: 167,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                            type: "button",
                            onClick: handleSend,
                            disabled: isSending || !customMessage.trim(),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__["Send"], {
                                    className: "h-4 w-4 mr-2"
                                }, void 0, false, {
                                    fileName: "[project]/features/warranty/components/dialogs/warranty-reminder-dialog.tsx",
                                    lineNumber: 180,
                                    columnNumber: 13
                                }, this),
                                isSending ? 'Đang gửi...' : 'Gửi nhắc nhở'
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/warranty/components/dialogs/warranty-reminder-dialog.tsx",
                            lineNumber: 175,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/warranty/components/dialogs/warranty-reminder-dialog.tsx",
                    lineNumber: 166,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/features/warranty/components/dialogs/warranty-reminder-dialog.tsx",
            lineNumber: 111,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/features/warranty/components/dialogs/warranty-reminder-dialog.tsx",
        lineNumber: 110,
        columnNumber: 5
    }, this);
}
}),
"[project]/features/warranty/components/dialogs/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$components$2f$dialogs$2f$warranty$2d$cancel$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/components/dialogs/warranty-cancel-dialog.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$components$2f$dialogs$2f$warranty$2d$payment$2d$voucher$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$components$2f$dialogs$2f$warranty$2d$receipt$2d$voucher$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/components/dialogs/warranty-receipt-voucher-dialog.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$components$2f$dialogs$2f$warranty$2d$reopen$2d$from$2d$cancelled$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/components/dialogs/warranty-reopen-from-cancelled-dialog.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$components$2f$dialogs$2f$warranty$2d$reopen$2d$from$2d$returned$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/components/dialogs/warranty-reopen-from-returned-dialog.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$components$2f$dialogs$2f$warranty$2d$return$2d$method$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/components/dialogs/warranty-return-method-dialog.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$components$2f$dialogs$2f$warranty$2d$reminder$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/components/dialogs/warranty-reminder-dialog.tsx [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
}),
"[project]/features/warranty/warranty-list-page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WarrantyListPage",
    ()=>WarrantyListPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-ssr] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$grid$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutGrid$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layout-grid.js [app-ssr] (ecmascript) <export default as LayoutGrid>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$table$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Table$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/table.js [app-ssr] (ecmascript) <export default as Table>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.js [app-ssr] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chart-column.js [app-ssr] (ecmascript) <export default as BarChart3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-ssr] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-ssr] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-ssr] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-ssr] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-x.js [app-ssr] (ecmascript) <export default as XCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/fuse.js/dist/fuse.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$hooks$2f$use$2d$all$2d$warranties$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/hooks/use-all-warranties.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$hooks$2f$use$2d$warranties$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/hooks/use-warranties.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$hooks$2f$use$2d$all$2d$orders$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/orders/hooks/use-all-orders.ts [app-ssr] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module './types'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
// Column definitions & Mobile card
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$columns$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/columns.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$warranty$2d$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/warranty-card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$warranty$2d$card$2d$context$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/warranty-card-context-menu.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$components$2f$dialogs$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/features/warranty/components/dialogs/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$components$2f$dialogs$2f$warranty$2d$reminder$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/components/dialogs/warranty-reminder-dialog.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$components$2f$dialogs$2f$warranty$2d$cancel$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/components/dialogs/warranty-cancel-dialog.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$hooks$2f$use$2d$warranty$2d$reminders$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/hooks/use-warranty-reminders.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$use$2d$realtime$2d$updates$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/use-realtime-updates.ts [app-ssr] (ecmascript)");
// UI Components
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/input.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$responsive$2d$data$2d$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/data-table/responsive-data-table.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$faceted$2d$filter$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/data-table/data-table-faceted-filter.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$column$2d$toggle$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/data-table/data-table-column-toggle.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$page$2d$filters$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/layout/page-filters.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$page$2d$toolbar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/layout/page-toolbar.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/alert-dialog.tsx [app-ssr] (ecmascript)");
// Hooks & Utils
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$page$2d$header$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/page-header-context.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$breakpoint$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/breakpoint-context.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$debounce$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/use-debounce.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$warranty$2f$warranty$2d$settings$2d$page$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/warranty/warranty-settings-page.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$warranty$2d$sla$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/warranty-sla-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$router$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/router.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$print$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/use-print.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$hooks$2f$use$2d$all$2d$branches$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/branches/hooks/use-all-branches.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$store$2d$info$2f$hooks$2f$use$2d$store$2d$info$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/store-info/hooks/use-store-info.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2f$warranty$2d$print$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/print/warranty-print-helper.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$warranty$2e$mapper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-mappers/warranty.mapper.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$simple$2d$print$2d$options$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/shared/simple-print-options-dialog.tsx [app-ssr] (ecmascript)");
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
/**
 * KanbanColumn Component - Display warranties by status
 */ function KanbanColumn({ status, tickets, onTicketClick, cardColors, onEdit, onGetLink, onStartProcessing, onMarkProcessed, onMarkReturned, onCancel, onRemind }) {
    const [searchQuery, setSearchQuery] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]('');
    const statusIcons = {
        incomplete: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"],
        pending: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"],
        processed: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"],
        returned: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"],
        completed: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"],
        cancelled: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"]
    };
    const StatusIcon = statusIcons[status];
    // Filter tickets based on local search
    const filteredTickets = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        if (!searchQuery.trim()) return tickets;
        const query = searchQuery.toLowerCase();
        return tickets.filter((t)=>t.id.toLowerCase().includes(query) || t.customerName.toLowerCase().includes(query) || t.customerPhone.includes(query) || t.trackingCode.toLowerCase().includes(query));
    }, [
        tickets,
        searchQuery
    ]);
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
                                fileName: "[project]/features/warranty/warranty-list-page.tsx",
                                lineNumber: 131,
                                columnNumber: 11
                            }, this),
                            WARRANTY_STATUS_LABELS[status]
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/warranty/warranty-list-page.tsx",
                        lineNumber: 130,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-body-sm font-normal bg-background h-6 w-6 flex items-center justify-center rounded-full",
                        children: filteredTickets.length
                    }, void 0, false, {
                        fileName: "[project]/features/warranty/warranty-list-page.tsx",
                        lineNumber: 134,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/warranty/warranty-list-page.tsx",
                lineNumber: 129,
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
                    fileName: "[project]/features/warranty/warranty-list-page.tsx",
                    lineNumber: 141,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/warranty/warranty-list-page.tsx",
                lineNumber: 140,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 space-y-3 overflow-y-auto pb-2",
                children: filteredTickets.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center py-8 text-muted-foreground text-body-sm",
                    children: searchQuery ? 'Không tìm thấy kết quả' : 'Không có bảo hành nào'
                }, void 0, false, {
                    fileName: "[project]/features/warranty/warranty-list-page.tsx",
                    lineNumber: 152,
                    columnNumber: 11
                }, this) : filteredTickets.map((ticket)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$warranty$2d$card$2d$context$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WarrantyCardContextMenu"], {
                        ticket: ticket,
                        onEdit: onEdit,
                        onGetLink: onGetLink,
                        onStartProcessing: onStartProcessing,
                        onMarkProcessed: onMarkProcessed,
                        onMarkReturned: onMarkReturned,
                        onCancel: onCancel,
                        onRemind: onRemind,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$warranty$2d$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WarrantyCard"], {
                                ticket: ticket,
                                onClick: ()=>onTicketClick(ticket)
                            }, void 0, false, {
                                fileName: "[project]/features/warranty/warranty-list-page.tsx",
                                lineNumber: 169,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/features/warranty/warranty-list-page.tsx",
                            lineNumber: 168,
                            columnNumber: 15
                        }, this)
                    }, ticket.systemId, false, {
                        fileName: "[project]/features/warranty/warranty-list-page.tsx",
                        lineNumber: 157,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/features/warranty/warranty-list-page.tsx",
                lineNumber: 150,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/warranty/warranty-list-page.tsx",
        lineNumber: 127,
        columnNumber: 5
    }, this);
}
function WarrantyListPage() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { isMobile } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$breakpoint$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useBreakpoint"])();
    const { data: tickets = [] } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$hooks$2f$use$2d$all$2d$warranties$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAllWarranties"])();
    const { update: updateWarranty, remove: deleteWarrantyMutation } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$hooks$2f$use$2d$warranties$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useWarrantyMutations"])();
    const { data: orders = [] } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$hooks$2f$use$2d$all$2d$orders$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAllOrders"])();
    // Load card color settings
    const cardColors = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$warranty$2f$warranty$2d$settings$2d$page$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["loadCardColorSettings"])(), []);
    // Get row style based on overdue/status (same logic as card)
    const getRowStyle = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((ticket)=>{
        // Check if overdue and overdue color is enabled (Priority 1)
        const overdueStatus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$warranty$2d$sla$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["checkWarrantyOverdue"])(ticket);
        const isOverdue = overdueStatus.isOverdueResponse || overdueStatus.isOverdueProcessing || overdueStatus.isOverdueReturn;
        if (cardColors.enableOverdueColor && isOverdue) {
            const colorClass = cardColors.overdueColor;
            return parseColorClass(colorClass);
        }
        // Check status color if enabled (Priority 2)
        if (cardColors.enableStatusColors) {
            const colorClass = cardColors.statusColors[ticket.status];
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
    // ==========================================
    // State Management
    // ==========================================
    const [searchQuery, setSearchQuery] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]('');
    // ✅ OPTIMIZATION: Use debounce hook instead of manual setTimeout
    const debouncedSearch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$debounce$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useDebounce"])(searchQuery, 300);
    const [sorting, setSorting] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]({
        id: 'createdAt',
        desc: true
    });
    const [columnFilters, setColumnFilters] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]([]);
    const [rowSelection, setRowSelection] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]({});
    const [statusFilter, setStatusFilter] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](new Set());
    const [expanded, setExpanded] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]({});
    // ==========================================
    // Default visible columns (20+ columns visible for sticky scrollbar)
    // ==========================================
    const defaultVisibleColumns = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>({
            select: true,
            id: true,
            branchName: true,
            employeeName: true,
            customerName: true,
            customerPhone: true,
            customerAddress: true,
            trackingCode: true,
            shippingFee: true,
            linkedOrderId: true,
            referenceUrl: true,
            externalReference: true,
            status: true,
            slaStatus: true,
            settlementStatus: true,
            productsCount: true,
            totalProducts: true,
            totalReplaced: true,
            totalReturned: true,
            totalOutOfStock: true,
            totalSettlement: true,
            receivedImagesCount: true,
            processedImagesCount: true,
            historyCount: true,
            commentsCount: true,
            subtasksCount: true,
            notes: true,
            returnedAt: true,
            completedAt: true,
            createdBy: true,
            createdAt: true,
            updatedAt: true,
            actions: true
        }), []);
    // Column visibility: 15+ columns for better UX
    const [columnVisibility, setColumnVisibility] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](()=>defaultVisibleColumns);
    const [columnOrder, setColumnOrder] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]([]);
    const [pinnedColumns, setPinnedColumns] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]([
        'select',
        'actions'
    ]);
    // Pagination state
    const [pagination, setPagination] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]({
        pageIndex: 0,
        pageSize: 20
    });
    // Dialogs
    const [deleteDialogOpen, setDeleteDialogOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](false);
    const [cancelDialogOpen, setCancelDialogOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](false);
    const [cancelQueue, setCancelQueue] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]([]);
    const bulkCancelRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"](false);
    const bulkCancelTicketIdsRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"](new Set());
    const bulkCancelPendingRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"](0);
    const bulkCancelCompletedRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"](0);
    const currentCancelTicket = cancelQueue[0] ?? null;
    // View mode: kanban or table
    const [viewMode, setViewMode] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]('table');
    // Reminder system
    const { isReminderModalOpen, openReminderModal, closeReminderModal, selectedTicket, templates, sendReminder } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$hooks$2f$use$2d$warranty$2d$reminders$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useWarrantyReminders"])();
    // Real-time updates
    const [dataVersion, setDataVersion] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$use$2d$realtime$2d$updates$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getWarrantyDataVersion"])());
    const { isPolling, togglePolling, refresh } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$use$2d$realtime$2d$updates$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRealtimeUpdates"])({
        dataVersion,
        onRefresh: ()=>{
            // Reload warranty data
            setDataVersion((0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$use$2d$realtime$2d$updates$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getWarrantyDataVersion"])());
            // Force re-render
            window.location.reload();
        },
        interval: 30000 // 30 seconds
    });
    // ==========================================
    // Handlers
    // ==========================================
    const handleEdit = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((ticket)=>{
        router.push(`/warranty/${ticket.systemId}/edit`);
    }, [
        router
    ]);
    const startCancelWorkflow = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((ticketsToCancel, options)=>{
        if (!ticketsToCancel || ticketsToCancel.length === 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Không có phiếu hợp lệ để hủy');
            return;
        }
        const normalized = ticketsToCancel.filter((ticket)=>Boolean(ticket)).filter((ticket, index, self)=>self.findIndex((item)=>item.systemId === ticket.systemId) === index).filter((ticket)=>ticket.status !== 'cancelled' && !ticket.cancelledAt);
        const skipped = ticketsToCancel.length - normalized.length;
        if (normalized.length === 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].info('Các phiếu đã chọn đều đã bị hủy trước đó');
            return;
        }
        if (skipped > 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].info(`${skipped} phiếu đã được bỏ qua vì đã hủy trước đó.`);
        }
        const isBulk = Boolean(options?.bulk);
        if (isBulk && bulkCancelPendingRef.current === 0) {
            bulkCancelCompletedRef.current = 0;
        }
        setCancelQueue((prevQueue)=>{
            if (prevQueue.length === 0) {
                if (isBulk) {
                    normalized.forEach((ticket)=>bulkCancelTicketIdsRef.current.add(ticket.systemId));
                    bulkCancelPendingRef.current += normalized.length;
                    bulkCancelRef.current = true;
                }
                return normalized;
            }
            const existingIds = new Set(prevQueue.map((ticket)=>ticket.systemId));
            const additionalTickets = normalized.filter((ticket)=>!existingIds.has(ticket.systemId));
            if (additionalTickets.length === 0) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].info('Các phiếu đã nằm trong hàng chờ hủy');
                return prevQueue;
            }
            if (isBulk) {
                additionalTickets.forEach((ticket)=>bulkCancelTicketIdsRef.current.add(ticket.systemId));
                bulkCancelPendingRef.current += additionalTickets.length;
                bulkCancelRef.current = true;
            }
            return [
                ...prevQueue,
                ...additionalTickets
            ];
        });
        setCancelDialogOpen(true);
    }, []);
    // Context menu handlers
    const handleGetLink = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((systemId)=>{
        const ticket = tickets.find((t)=>t.systemId === (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(systemId));
        if (!ticket) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Không tìm thấy phiếu bảo hành');
            return;
        }
        const trackingPath = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$router$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generatePath"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$router$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROUTES"].INTERNAL.WARRANTY_TRACKING, {
            trackingCode: ticket.publicTrackingCode || ticket.id
        });
        const trackingUrl = `${window.location.origin}${trackingPath}`;
        navigator.clipboard.writeText(trackingUrl);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success('Đã copy link tracking vào clipboard');
    }, [
        tickets
    ]);
    const handleStartProcessing = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((systemId)=>{
        const normalizedId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(systemId);
        const ticket = tickets.find((t)=>t.systemId === normalizedId);
        if (!ticket) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Không tìm thấy phiếu bảo hành');
            return;
        }
        updateWarranty.mutate({
            systemId: normalizedId,
            data: {
                status: 'pending',
                statusReason: 'Bắt đầu xử lý từ danh sách'
            }
        }, {
            onSuccess: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success('Đã chuyển sang trạng thái Chưa xử lý')
        });
    }, [
        tickets,
        updateWarranty
    ]);
    const handleMarkProcessed = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((systemId)=>{
        const normalizedId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(systemId);
        const ticket = tickets.find((t)=>t.systemId === normalizedId);
        if (!ticket) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Không tìm thấy phiếu bảo hành');
            return;
        }
        updateWarranty.mutate({
            systemId: normalizedId,
            data: {
                status: 'processed',
                statusReason: 'Hoàn thành xử lý từ danh sách'
            }
        }, {
            onSuccess: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success('Đã hoàn thành xử lý')
        });
    }, [
        tickets,
        updateWarranty
    ]);
    const handleMarkReturned = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((systemId)=>{
        router.push(`/warranty/${systemId}`); // Go to detail page to link order
    }, [
        router
    ]);
    const handleCancel = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((systemId)=>{
        const normalizedId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(systemId);
        const ticket = tickets.find((t)=>t.systemId === normalizedId);
        if (!ticket) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Không tìm thấy phiếu bảo hành');
            return;
        }
        startCancelWorkflow([
            ticket
        ]);
    }, [
        tickets,
        startCancelWorkflow
    ]);
    const handleCancelSuccess = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((ticket)=>{
        let queueBecameEmpty = false;
        setCancelQueue((prevQueue)=>{
            const [, ...rest] = prevQueue;
            queueBecameEmpty = rest.length === 0;
            return rest;
        });
        if (queueBecameEmpty) {
            setCancelDialogOpen(false);
        }
        if (bulkCancelTicketIdsRef.current.has(ticket.systemId)) {
            bulkCancelTicketIdsRef.current.delete(ticket.systemId);
            bulkCancelPendingRef.current = Math.max(0, bulkCancelPendingRef.current - 1);
            bulkCancelCompletedRef.current += 1;
        }
        if (bulkCancelRef.current && bulkCancelPendingRef.current === 0) {
            const completed = bulkCancelCompletedRef.current || 0;
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success(`Đã hủy ${completed} phiếu bảo hành`);
            setRowSelection({});
            bulkCancelRef.current = false;
            bulkCancelPendingRef.current = 0;
            bulkCancelCompletedRef.current = 0;
            bulkCancelTicketIdsRef.current.clear();
        }
        if (queueBecameEmpty && !bulkCancelRef.current) {
            bulkCancelTicketIdsRef.current.clear();
        }
    }, [
        setRowSelection
    ]);
    const handleCancelDialogOpenChange = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((open)=>{
        setCancelDialogOpen(open);
        if (!open) {
            setCancelQueue([]);
            bulkCancelTicketIdsRef.current.clear();
            bulkCancelPendingRef.current = 0;
            bulkCancelCompletedRef.current = 0;
            bulkCancelRef.current = false;
        }
    }, []);
    const handleRemind = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((systemId)=>{
        const ticket = tickets.find((t)=>t.systemId === (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(systemId));
        if (ticket) {
            openReminderModal(ticket);
        }
    }, [
        tickets,
        openReminderModal
    ]);
    // Generate columns
    const columns = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        const cols = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$columns$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getColumns"])(handleCancel, handleEdit, router, orders); // ✅ Pass orders
        console.log('📊 Warranty columns generated:', cols.length, 'columns', cols.map((c)=>c.id));
        return cols;
    }, [
        handleCancel,
        handleEdit,
        router,
        orders
    ] // ✅ Add orders dependency
    );
    const hasInitializedColumns = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"](false);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        if (hasInitializedColumns.current) return;
        const allColumnIds = columns.map((c)=>c.id).filter(Boolean);
        setColumnOrder(allColumnIds);
        hasInitializedColumns.current = true;
    }, [
        columns
    ]);
    // ==========================================
    // Search with Fuse.js (threshold 0.3)
    // ==========================================
    const fuse = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"](tickets, {
            keys: [
                'id',
                'customerName',
                'customerPhone',
                'trackingCode'
            ],
            threshold: 0.3,
            ignoreLocation: true
        });
    }, [
        tickets
    ]);
    const searchedData = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        if (!debouncedSearch.trim()) return tickets;
        return fuse.search(debouncedSearch.trim()).map((result)=>result.item);
    }, [
        fuse,
        debouncedSearch,
        tickets
    ]);
    // ==========================================
    // Filters
    // ==========================================
    const filteredData = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        let result = searchedData;
        // Status filter
        if (statusFilter.size > 0) {
            result = result.filter((ticket)=>statusFilter.has(ticket.status));
        }
        return result;
    }, [
        searchedData,
        statusFilter
    ]);
    // ==========================================
    // Sorting
    // ==========================================
    const sortedData = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        if (!sorting || !sorting.id) return filteredData;
        const sorted = [
            ...filteredData
        ];
        sorted.sort((a, b)=>{
            const aValue = a[sorting.id];
            const bValue = b[sorting.id];
            if (aValue == null) return 1;
            if (bValue == null) return -1;
            if (typeof aValue === 'string') {
                return sorting.desc ? bValue.localeCompare(aValue) : aValue.localeCompare(bValue);
            }
            if (typeof aValue === 'number') {
                return sorting.desc ? bValue - aValue : aValue - bValue;
            }
            // Date comparison
            const aDate = new Date(aValue).getTime();
            const bDate = new Date(bValue).getTime();
            return sorting.desc ? bDate - aDate : aDate - bDate;
        });
        return sorted;
    }, [
        filteredData,
        sorting
    ]);
    // ==========================================
    // Pagination
    // ==========================================
    const pageCount = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        return Math.ceil(sortedData.length / pagination.pageSize);
    }, [
        sortedData.length,
        pagination.pageSize
    ]);
    const paginatedData = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        const start = pagination.pageIndex * pagination.pageSize;
        const end = start + pagination.pageSize;
        return sortedData.slice(start, end);
    }, [
        sortedData,
        pagination
    ]);
    // ==========================================
    // Bulk Actions
    // ==========================================
    const selectedTickets = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        return sortedData.filter((ticket)=>rowSelection[ticket.systemId]);
    }, [
        sortedData,
        rowSelection
    ]);
    const handleBulkDelete = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](()=>{
        selectedTickets.forEach((ticket)=>{
            deleteWarrantyMutation.mutate(ticket.systemId);
        });
        setRowSelection({});
        setDeleteDialogOpen(false);
    }, [
        selectedTickets,
        deleteWarrantyMutation
    ]);
    const handleExportSelected = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](()=>{
        // Export selected rows
        const dataToExport = selectedTickets.map((ticket)=>({
                'Mã phiếu': ticket.id,
                'Khách hàng': ticket.customerName,
                'SĐT': ticket.customerPhone,
                'Địa chỉ': ticket.customerAddress,
                'Mã vận đơn': ticket.trackingCode,
                'Phí vận chuyển': ticket.shippingFee,
                'Trạng thái': WARRANTY_STATUS_LABELS[ticket.status],
                'Số SP': ticket.summary.totalProducts,
                'SP đổi mới': ticket.summary.totalReplaced,
                'SP trả lại': ticket.summary.totalReturned,
                'SP hết hàng': ticket.summary.totalOutOfStock,
                'Tiền bù trừ': ticket.summary.totalDeduction,
                'Ngày tạo': ticket.createdAt
            }));
        const csv = [
            Object.keys(dataToExport[0]).join(','),
            ...dataToExport.map((row)=>Object.values(row).join(','))
        ].join('\n');
        const blob = new Blob([
            csv
        ], {
            type: 'text/csv;charset=utf-8;'
        });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `warranty-export-${new Date().toISOString()}.csv`;
        link.click();
    }, [
        selectedTickets
    ]);
    // Print imports
    const { data: branches = [] } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$hooks$2f$use$2d$all$2d$branches$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAllBranches"])();
    const { data: storeInfo } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$store$2d$info$2f$hooks$2f$use$2d$store$2d$info$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStoreInfo"])();
    const { printMultiple } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$print$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePrint"])();
    const [isPrintDialogOpen, setIsPrintDialogOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](false);
    const [pendingPrintTickets, setPendingPrintTickets] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]([]);
    const handleBulkPrint = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](()=>{
        if (selectedTickets.length === 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Vui lòng chọn ít nhất một phiếu để in');
            return;
        }
        setPendingPrintTickets(selectedTickets);
        setIsPrintDialogOpen(true);
    }, [
        selectedTickets
    ]);
    const handlePrintConfirm = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((options)=>{
        const { branchSystemId, paperSize } = options;
        const printOptionsList = pendingPrintTickets.map((ticket)=>{
            const branch = branchSystemId ? branches.find((b)=>b.systemId === branchSystemId) : branches.find((b)=>b.systemId === ticket.branchSystemId);
            const storeSettings = branch ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2f$warranty$2d$print$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createStoreSettings"])(branch) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2f$warranty$2d$print$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createStoreSettings"])(storeInfo);
            const ticketData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2f$warranty$2d$print$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["convertWarrantyForPrint"])(ticket, {
                branch
            });
            return {
                data: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$warranty$2e$mapper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapWarrantyToPrintData"])(ticketData, storeSettings),
                lineItems: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$warranty$2e$mapper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapWarrantyLineItems"])(ticketData.items),
                paperSize
            };
        });
        printMultiple('warranty', printOptionsList);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success('Đã gửi lệnh in', {
            description: `Đang in ${pendingPrintTickets.length} phiếu bảo hành`
        });
        setRowSelection({});
        setPendingPrintTickets([]);
    }, [
        pendingPrintTickets,
        branches,
        storeInfo,
        printMultiple
    ]);
    const handleBulkGetTrackingLink = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](()=>{
        if (selectedTickets.length === 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Vui lòng chọn ít nhất một phiếu');
            return;
        }
        try {
            const trackingLinks = selectedTickets.map((ticket)=>{
                const publicCode = ticket.publicTrackingCode || ticket.id;
                const trackingPath = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$router$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generatePath"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$router$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROUTES"].INTERNAL.WARRANTY_TRACKING, {
                    trackingCode: publicCode
                });
                const trackingUrl = `${window.location.origin}${trackingPath}`;
                return `${publicCode}: ${trackingUrl}`;
            });
            navigator.clipboard.writeText(trackingLinks.join('\n'));
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success(`Đã copy ${selectedTickets.length} link tracking vào clipboard`);
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Không thể copy link tracking');
        }
    }, [
        selectedTickets
    ]);
    const handleBulkCancel = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](()=>{
        if (selectedTickets.length === 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Vui lòng chọn ít nhất một phiếu');
            return;
        }
        startCancelWorkflow([
            ...selectedTickets
        ], {
            bulk: true
        });
    }, [
        selectedTickets,
        startCancelWorkflow
    ]);
    // Bulk actions array
    const bulkActions = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>[
            {
                label: "In",
                onSelect: handleBulkPrint
            },
            {
                label: "Get Link Tracking",
                onSelect: handleBulkGetTrackingLink
            },
            {
                label: "Hủy",
                onSelect: handleBulkCancel
            }
        ], [
        handleBulkPrint,
        handleBulkGetTrackingLink,
        handleBulkCancel
    ]);
    // ==========================================
    // Kanban Data (Group by status)
    // ==========================================
    const ticketsByStatus = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        const statuses = [
            'incomplete',
            'pending',
            'processed',
            'returned',
            'completed'
        ];
        return statuses.reduce((acc, status)=>{
            acc[status] = sortedData.filter((ticket)=>ticket.status === status && !ticket.cancelledAt); // Exclude cancelled
            return acc;
        }, {});
    }, [
        sortedData
    ]);
    // ==========================================
    // Header Actions
    // ==========================================
    const actions = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>[
            // Real-time toggle (LEFT)
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                variant: isPolling ? "default" : "outline",
                onClick: togglePolling,
                size: "sm",
                className: "h-9",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("h-4 w-4 mr-2", isPolling && "animate-spin")
                    }, void 0, false, {
                        fileName: "[project]/features/warranty/warranty-list-page.tsx",
                        lineNumber: 786,
                        columnNumber: 9
                    }, this),
                    isPolling ? "Live" : "Manual"
                ]
            }, "realtime", true, {
                fileName: "[project]/features/warranty/warranty-list-page.tsx",
                lineNumber: 779,
                columnNumber: 7
            }, this),
            // Statistics (LEFT)
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                onClick: ()=>router.push('/warranty/statistics'),
                variant: "outline",
                size: "sm",
                className: "h-9",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"], {
                        className: "h-4 w-4 mr-2"
                    }, void 0, false, {
                        fileName: "[project]/features/warranty/warranty-list-page.tsx",
                        lineNumber: 797,
                        columnNumber: 9
                    }, this),
                    "Thống kê"
                ]
            }, "statistics", true, {
                fileName: "[project]/features/warranty/warranty-list-page.tsx",
                lineNumber: 790,
                columnNumber: 7
            }, this),
            // View toggle (RIGHT)
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
                            fileName: "[project]/features/warranty/warranty-list-page.tsx",
                            lineNumber: 810,
                            columnNumber: 13
                        }, this),
                        "Chế độ bảng"
                    ]
                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$grid$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutGrid$3e$__["LayoutGrid"], {
                            className: "h-4 w-4 mr-2"
                        }, void 0, false, {
                            fileName: "[project]/features/warranty/warranty-list-page.tsx",
                            lineNumber: 815,
                            columnNumber: 13
                        }, this),
                        "Chế độ Kanban"
                    ]
                }, void 0, true)
            }, "view-toggle", false, {
                fileName: "[project]/features/warranty/warranty-list-page.tsx",
                lineNumber: 801,
                columnNumber: 7
            }, this),
            // Create button (RIGHT)
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                onClick: ()=>router.push('/warranty/new'),
                size: "sm",
                className: "h-9",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                        className: "h-4 w-4 mr-2"
                    }, void 0, false, {
                        fileName: "[project]/features/warranty/warranty-list-page.tsx",
                        lineNumber: 827,
                        columnNumber: 9
                    }, this),
                    "Tạo phiếu mới"
                ]
            }, "new", true, {
                fileName: "[project]/features/warranty/warranty-list-page.tsx",
                lineNumber: 821,
                columnNumber: 7
            }, this)
        ], [
        router,
        viewMode,
        isPolling,
        togglePolling
    ]);
    const warrantyStats = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        return tickets.reduce((acc, ticket)=>{
            acc.total += 1;
            if (ticket.status === 'incomplete') acc.incomplete += 1;
            if (ticket.status === 'pending') acc.pending += 1;
            if (ticket.status === 'processed') acc.processed += 1;
            if (ticket.status === 'returned') acc.returned += 1;
            if (ticket.status === 'completed') acc.completed += 1;
            if (ticket.status === 'cancelled') acc.cancelled += 1;
            const overdue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$warranty$2d$sla$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["checkWarrantyOverdue"])(ticket);
            if (overdue.isOverdueResponse || overdue.isOverdueProcessing || overdue.isOverdueReturn) {
                acc.overdue += 1;
            }
            return acc;
        }, {
            total: 0,
            incomplete: 0,
            pending: 0,
            processed: 0,
            returned: 0,
            completed: 0,
            cancelled: 0,
            overdue: 0
        });
    }, [
        tickets
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$page$2d$header$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePageHeader"])({
        title: 'Quản lý bảo hành',
        actions,
        breadcrumb: [
            {
                label: 'Trang chủ',
                href: '/',
                isCurrent: false
            },
            {
                label: 'Quản lý bảo hành',
                href: '/warranty',
                isCurrent: true
            }
        ]
    });
    // ==========================================
    // Render
    // ==========================================
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col w-full h-full",
        children: [
            !isMobile && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$page$2d$toolbar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PageToolbar"], {
                leftActions: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                        onClick: ()=>router.push('/settings/warranty'),
                        variant: "outline",
                        size: "sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                                className: "h-4 w-4 mr-2"
                            }, void 0, false, {
                                fileName: "[project]/features/warranty/warranty-list-page.tsx",
                                lineNumber: 877,
                                columnNumber: 17
                            }, void 0),
                            "Cài đặt"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/warranty/warranty-list-page.tsx",
                        lineNumber: 872,
                        columnNumber: 15
                    }, void 0)
                }, void 0, false),
                rightActions: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$column$2d$toggle$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DataTableColumnCustomizer"], {
                        columns: columns,
                        columnVisibility: columnVisibility,
                        setColumnVisibility: setColumnVisibility,
                        columnOrder: columnOrder,
                        setColumnOrder: setColumnOrder,
                        pinnedColumns: pinnedColumns,
                        setPinnedColumns: setPinnedColumns
                    }, void 0, false, {
                        fileName: "[project]/features/warranty/warranty-list-page.tsx",
                        lineNumber: 885,
                        columnNumber: 15
                    }, void 0)
                }, void 0, false)
            }, void 0, false, {
                fileName: "[project]/features/warranty/warranty-list-page.tsx",
                lineNumber: 869,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$page$2d$filters$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PageFilters"], {
                searchValue: searchQuery,
                onSearchChange: setSearchQuery,
                searchPlaceholder: "Tìm theo mã phiếu, tên KH, SĐT, mã vận đơn...",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$faceted$2d$filter$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DataTableFacetedFilter"], {
                        title: "Trạng thái",
                        options: [
                            {
                                label: 'Chưa đầy đủ',
                                value: 'incomplete'
                            },
                            {
                                label: 'Chưa xử lý',
                                value: 'pending'
                            },
                            {
                                label: 'Đã xử lý',
                                value: 'processed'
                            },
                            {
                                label: 'Đã trả',
                                value: 'returned'
                            }
                        ],
                        selectedValues: statusFilter,
                        onSelectedValuesChange: setStatusFilter
                    }, void 0, false, {
                        fileName: "[project]/features/warranty/warranty-list-page.tsx",
                        lineNumber: 906,
                        columnNumber: 9
                    }, this),
                    (searchQuery || statusFilter.size > 0) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                        variant: "ghost",
                        size: "sm",
                        onClick: ()=>{
                            setSearchQuery('');
                            setStatusFilter(new Set());
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                className: "h-4 w-4 mr-2"
                            }, void 0, false, {
                                fileName: "[project]/features/warranty/warranty-list-page.tsx",
                                lineNumber: 928,
                                columnNumber: 13
                            }, this),
                            "Xóa bộ lọc"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/warranty/warranty-list-page.tsx",
                        lineNumber: 920,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/warranty/warranty-list-page.tsx",
                lineNumber: 900,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full py-4",
                children: viewMode === 'table' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$responsive$2d$data$2d$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ResponsiveDataTable"], {
                    columns: columns,
                    data: paginatedData,
                    renderMobileCard: (ticket)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$warranty$2d$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WarrantyCard"], {
                            ticket: ticket,
                            onClick: ()=>router.push(`/warranty/${ticket.systemId}`)
                        }, ticket.systemId, false, {
                            fileName: "[project]/features/warranty/warranty-list-page.tsx",
                            lineNumber: 941,
                            columnNumber: 15
                        }, void 0),
                    pageCount: pageCount,
                    pagination: pagination,
                    setPagination: setPagination,
                    rowCount: sortedData.length,
                    rowSelection: rowSelection,
                    setRowSelection: setRowSelection,
                    onBulkDelete: ()=>setDeleteDialogOpen(true),
                    bulkActions: bulkActions,
                    allSelectedRows: selectedTickets,
                    expanded: expanded,
                    setExpanded: setExpanded,
                    sorting: sorting,
                    setSorting: setSorting,
                    columnVisibility: columnVisibility,
                    setColumnVisibility: setColumnVisibility,
                    columnOrder: columnOrder,
                    setColumnOrder: setColumnOrder,
                    pinnedColumns: pinnedColumns,
                    setPinnedColumns: setPinnedColumns,
                    onRowClick: (ticket)=>router.push(`/warranty/${ticket.systemId}`),
                    getRowStyle: getRowStyle
                }, void 0, false, {
                    fileName: "[project]/features/warranty/warranty-list-page.tsx",
                    lineNumber: 937,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-4 overflow-x-auto pb-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(KanbanColumn, {
                            status: "incomplete",
                            tickets: ticketsByStatus.incomplete,
                            onTicketClick: (ticket)=>router.push(`/warranty/${ticket.systemId}`),
                            cardColors: cardColors,
                            onEdit: (systemId)=>router.push(`/warranty/${systemId}/edit`),
                            onGetLink: handleGetLink,
                            onStartProcessing: handleStartProcessing,
                            onMarkProcessed: handleMarkProcessed,
                            onMarkReturned: handleMarkReturned,
                            onCancel: handleCancel,
                            onRemind: handleRemind
                        }, void 0, false, {
                            fileName: "[project]/features/warranty/warranty-list-page.tsx",
                            lineNumber: 971,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(KanbanColumn, {
                            status: "pending",
                            tickets: ticketsByStatus.pending,
                            onTicketClick: (ticket)=>router.push(`/warranty/${ticket.systemId}`),
                            cardColors: cardColors,
                            onEdit: (systemId)=>router.push(`/warranty/${systemId}/edit`),
                            onGetLink: handleGetLink,
                            onStartProcessing: handleStartProcessing,
                            onMarkProcessed: handleMarkProcessed,
                            onMarkReturned: handleMarkReturned,
                            onCancel: handleCancel,
                            onRemind: handleRemind
                        }, void 0, false, {
                            fileName: "[project]/features/warranty/warranty-list-page.tsx",
                            lineNumber: 984,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(KanbanColumn, {
                            status: "processed",
                            tickets: ticketsByStatus.processed,
                            onTicketClick: (ticket)=>router.push(`/warranty/${ticket.systemId}`),
                            cardColors: cardColors,
                            onEdit: (systemId)=>router.push(`/warranty/${systemId}/edit`),
                            onGetLink: handleGetLink,
                            onStartProcessing: handleStartProcessing,
                            onMarkProcessed: handleMarkProcessed,
                            onMarkReturned: handleMarkReturned,
                            onCancel: handleCancel,
                            onRemind: handleRemind
                        }, void 0, false, {
                            fileName: "[project]/features/warranty/warranty-list-page.tsx",
                            lineNumber: 997,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(KanbanColumn, {
                            status: "returned",
                            tickets: ticketsByStatus.returned,
                            onTicketClick: (ticket)=>router.push(`/warranty/${ticket.systemId}`),
                            cardColors: cardColors,
                            onEdit: (systemId)=>router.push(`/warranty/${systemId}/edit`),
                            onGetLink: handleGetLink,
                            onStartProcessing: handleStartProcessing,
                            onMarkProcessed: handleMarkProcessed,
                            onMarkReturned: handleMarkReturned,
                            onCancel: handleCancel,
                            onRemind: handleRemind
                        }, void 0, false, {
                            fileName: "[project]/features/warranty/warranty-list-page.tsx",
                            lineNumber: 1010,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(KanbanColumn, {
                            status: "completed",
                            tickets: ticketsByStatus.completed,
                            onTicketClick: (ticket)=>router.push(`/warranty/${ticket.systemId}`),
                            cardColors: cardColors,
                            onEdit: (systemId)=>router.push(`/warranty/${systemId}/edit`),
                            onGetLink: handleGetLink,
                            onStartProcessing: handleStartProcessing,
                            onMarkProcessed: handleMarkProcessed,
                            onMarkReturned: handleMarkReturned,
                            onCancel: handleCancel,
                            onRemind: handleRemind
                        }, void 0, false, {
                            fileName: "[project]/features/warranty/warranty-list-page.tsx",
                            lineNumber: 1023,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/warranty/warranty-list-page.tsx",
                    lineNumber: 970,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/warranty/warranty-list-page.tsx",
                lineNumber: 935,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$components$2f$dialogs$2f$warranty$2d$cancel$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WarrantyCancelDialog"], {
                open: cancelDialogOpen && Boolean(currentCancelTicket),
                onOpenChange: handleCancelDialogOpenChange,
                ticket: currentCancelTicket,
                onCancelled: handleCancelSuccess
            }, void 0, false, {
                fileName: "[project]/features/warranty/warranty-list-page.tsx",
                lineNumber: 1041,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$components$2f$dialogs$2f$warranty$2d$reminder$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WarrantyReminderDialog"], {
                open: isReminderModalOpen,
                onOpenChange: closeReminderModal,
                ticket: selectedTicket,
                templates: templates,
                onSendReminder: sendReminder
            }, void 0, false, {
                fileName: "[project]/features/warranty/warranty-list-page.tsx",
                lineNumber: 1049,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialog"], {
                open: deleteDialogOpen,
                onOpenChange: setDeleteDialogOpen,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogContent"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogHeader"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogTitle"], {
                                    children: "Xác nhận xóa"
                                }, void 0, false, {
                                    fileName: "[project]/features/warranty/warranty-list-page.tsx",
                                    lineNumber: 1061,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogDescription"], {
                                    children: [
                                        "Bạn có chắc muốn xóa ",
                                        selectedTickets.length,
                                        " phiếu bảo hành đã chọn? Hành động này không thể hoàn tác."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/warranty/warranty-list-page.tsx",
                                    lineNumber: 1062,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/warranty/warranty-list-page.tsx",
                            lineNumber: 1060,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogFooter"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogCancel"], {
                                    children: "Hủy"
                                }, void 0, false, {
                                    fileName: "[project]/features/warranty/warranty-list-page.tsx",
                                    lineNumber: 1068,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogAction"], {
                                    onClick: handleBulkDelete,
                                    children: "Xóa"
                                }, void 0, false, {
                                    fileName: "[project]/features/warranty/warranty-list-page.tsx",
                                    lineNumber: 1069,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/warranty/warranty-list-page.tsx",
                            lineNumber: 1067,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/warranty/warranty-list-page.tsx",
                    lineNumber: 1059,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/warranty/warranty-list-page.tsx",
                lineNumber: 1058,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$simple$2d$print$2d$options$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SimplePrintOptionsDialog"], {
                open: isPrintDialogOpen,
                onOpenChange: setIsPrintDialogOpen,
                onConfirm: handlePrintConfirm,
                selectedCount: pendingPrintTickets.length,
                title: "In phiếu bảo hành"
            }, void 0, false, {
                fileName: "[project]/features/warranty/warranty-list-page.tsx",
                lineNumber: 1075,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/warranty/warranty-list-page.tsx",
        lineNumber: 866,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=features_warranty_721dec0f._.js.map