(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/features/settings/customers/api/customer-settings-api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Customer Settings API Layer
 * Handles customer types, groups, sources, payment terms, credit ratings, lifecycle stages
 */ __turbopack_context__.s([
    "createCreditRating",
    ()=>createCreditRating,
    "createCustomerGroup",
    ()=>createCustomerGroup,
    "createCustomerSource",
    ()=>createCustomerSource,
    "createCustomerType",
    ()=>createCustomerType,
    "createLifecycleStage",
    ()=>createLifecycleStage,
    "createPaymentTerm",
    ()=>createPaymentTerm,
    "deleteCreditRating",
    ()=>deleteCreditRating,
    "deleteCustomerGroup",
    ()=>deleteCustomerGroup,
    "deleteCustomerSource",
    ()=>deleteCustomerSource,
    "deleteCustomerType",
    ()=>deleteCustomerType,
    "deleteLifecycleStage",
    ()=>deleteLifecycleStage,
    "deletePaymentTerm",
    ()=>deletePaymentTerm,
    "fetchCreditRatings",
    ()=>fetchCreditRatings,
    "fetchCustomerGroups",
    ()=>fetchCustomerGroups,
    "fetchCustomerSlaSettings",
    ()=>fetchCustomerSlaSettings,
    "fetchCustomerSources",
    ()=>fetchCustomerSources,
    "fetchCustomerTypes",
    ()=>fetchCustomerTypes,
    "fetchLifecycleStages",
    ()=>fetchLifecycleStages,
    "fetchPaymentTerms",
    ()=>fetchPaymentTerms,
    "updateCreditRating",
    ()=>updateCreditRating,
    "updateCustomerGroup",
    ()=>updateCustomerGroup,
    "updateCustomerSlaSetting",
    ()=>updateCustomerSlaSetting,
    "updateCustomerSource",
    ()=>updateCustomerSource,
    "updateCustomerType",
    ()=>updateCustomerType,
    "updateLifecycleStage",
    ()=>updateLifecycleStage,
    "updatePaymentTerm",
    ()=>updatePaymentTerm
]);
const BASE_URL = '/api/settings/customers';
async function fetchCustomerTypes() {
    const res = await fetch(`${BASE_URL}/types`);
    if (!res.ok) throw new Error('Failed to fetch customer types');
    return res.json();
}
async function createCustomerType(data) {
    const res = await fetch(`${BASE_URL}/types`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create');
    return res.json();
}
async function updateCustomerType(systemId, data) {
    const res = await fetch(`${BASE_URL}/types/${systemId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update');
    return res.json();
}
async function deleteCustomerType(systemId) {
    const res = await fetch(`${BASE_URL}/types/${systemId}`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete');
}
async function fetchCustomerGroups() {
    const res = await fetch(`${BASE_URL}/groups`);
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
}
async function createCustomerGroup(data) {
    const res = await fetch(`${BASE_URL}/groups`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create');
    return res.json();
}
async function updateCustomerGroup(systemId, data) {
    const res = await fetch(`${BASE_URL}/groups/${systemId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update');
    return res.json();
}
async function deleteCustomerGroup(systemId) {
    const res = await fetch(`${BASE_URL}/groups/${systemId}`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete');
}
async function fetchCustomerSources() {
    const res = await fetch(`${BASE_URL}/sources`);
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
}
async function createCustomerSource(data) {
    const res = await fetch(`${BASE_URL}/sources`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create');
    return res.json();
}
async function updateCustomerSource(systemId, data) {
    const res = await fetch(`${BASE_URL}/sources/${systemId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update');
    return res.json();
}
async function deleteCustomerSource(systemId) {
    const res = await fetch(`${BASE_URL}/sources/${systemId}`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete');
}
async function fetchPaymentTerms() {
    const res = await fetch(`${BASE_URL}/payment-terms`);
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
}
async function createPaymentTerm(data) {
    const res = await fetch(`${BASE_URL}/payment-terms`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create');
    return res.json();
}
async function updatePaymentTerm(systemId, data) {
    const res = await fetch(`${BASE_URL}/payment-terms/${systemId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update');
    return res.json();
}
async function deletePaymentTerm(systemId) {
    const res = await fetch(`${BASE_URL}/payment-terms/${systemId}`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete');
}
async function fetchCreditRatings() {
    const res = await fetch(`${BASE_URL}/credit-ratings`);
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
}
async function createCreditRating(data) {
    const res = await fetch(`${BASE_URL}/credit-ratings`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create');
    return res.json();
}
async function updateCreditRating(systemId, data) {
    const res = await fetch(`${BASE_URL}/credit-ratings/${systemId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update');
    return res.json();
}
async function deleteCreditRating(systemId) {
    const res = await fetch(`${BASE_URL}/credit-ratings/${systemId}`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete');
}
async function fetchLifecycleStages() {
    const res = await fetch(`${BASE_URL}/lifecycle-stages`);
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
}
async function createLifecycleStage(data) {
    const res = await fetch(`${BASE_URL}/lifecycle-stages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create');
    return res.json();
}
async function updateLifecycleStage(systemId, data) {
    const res = await fetch(`${BASE_URL}/lifecycle-stages/${systemId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update');
    return res.json();
}
async function deleteLifecycleStage(systemId) {
    const res = await fetch(`${BASE_URL}/lifecycle-stages/${systemId}`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete');
}
async function fetchCustomerSlaSettings() {
    const res = await fetch(`${BASE_URL}/sla-settings`);
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
}
async function updateCustomerSlaSetting(systemId, data) {
    const res = await fetch(`${BASE_URL}/sla-settings/${systemId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update');
    return res.json();
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/customers/hooks/use-customer-settings.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "customerSettingsKeys",
    ()=>customerSettingsKeys,
    "useCreditRatingMutations",
    ()=>useCreditRatingMutations,
    "useCreditRatings",
    ()=>useCreditRatings,
    "useCustomerGroupMutations",
    ()=>useCustomerGroupMutations,
    "useCustomerGroups",
    ()=>useCustomerGroups,
    "useCustomerSlaSettingMutations",
    ()=>useCustomerSlaSettingMutations,
    "useCustomerSlaSettings",
    ()=>useCustomerSlaSettings,
    "useCustomerSourceMutations",
    ()=>useCustomerSourceMutations,
    "useCustomerSources",
    ()=>useCustomerSources,
    "useCustomerTypeMutations",
    ()=>useCustomerTypeMutations,
    "useCustomerTypes",
    ()=>useCustomerTypes,
    "useLifecycleStageMutations",
    ()=>useLifecycleStageMutations,
    "useLifecycleStages",
    ()=>useLifecycleStages,
    "usePaymentTermMutations",
    ()=>usePaymentTermMutations,
    "usePaymentTerms",
    ()=>usePaymentTerms
]);
/**
 * Customer Settings React Query Hooks
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/customers/api/customer-settings-api.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature(), _s6 = __turbopack_context__.k.signature(), _s7 = __turbopack_context__.k.signature(), _s8 = __turbopack_context__.k.signature(), _s9 = __turbopack_context__.k.signature(), _s10 = __turbopack_context__.k.signature(), _s11 = __turbopack_context__.k.signature(), _s12 = __turbopack_context__.k.signature(), _s13 = __turbopack_context__.k.signature();
;
;
const customerSettingsKeys = {
    all: [
        'customer-settings'
    ],
    types: ()=>[
            ...customerSettingsKeys.all,
            'types'
        ],
    groups: ()=>[
            ...customerSettingsKeys.all,
            'groups'
        ],
    sources: ()=>[
            ...customerSettingsKeys.all,
            'sources'
        ],
    paymentTerms: ()=>[
            ...customerSettingsKeys.all,
            'payment-terms'
        ],
    creditRatings: ()=>[
            ...customerSettingsKeys.all,
            'credit-ratings'
        ],
    lifecycleStages: ()=>[
            ...customerSettingsKeys.all,
            'lifecycle-stages'
        ],
    slaSettings: ()=>[
            ...customerSettingsKeys.all,
            'sla-settings'
        ]
};
function useCustomerTypes() {
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: customerSettingsKeys.types(),
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchCustomerTypes"],
        staleTime: 1000 * 60 * 10
    });
}
_s(useCustomerTypes, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useCustomerTypeMutations(opts) {
    _s1();
    const qc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const invalidate = ()=>qc.invalidateQueries({
            queryKey: customerSettingsKeys.types()
        });
    return {
        create: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCustomerType"],
            onSuccess: {
                "useCustomerTypeMutations.useMutation": ()=>{
                    invalidate();
                    opts?.onSuccess?.();
                }
            }["useCustomerTypeMutations.useMutation"]
        }),
        update: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: {
                "useCustomerTypeMutations.useMutation": ({ systemId, data })=>__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateCustomerType"](systemId, data)
            }["useCustomerTypeMutations.useMutation"],
            onSuccess: {
                "useCustomerTypeMutations.useMutation": ()=>{
                    invalidate();
                    opts?.onSuccess?.();
                }
            }["useCustomerTypeMutations.useMutation"]
        }),
        remove: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteCustomerType"],
            onSuccess: {
                "useCustomerTypeMutations.useMutation": ()=>{
                    invalidate();
                    opts?.onSuccess?.();
                }
            }["useCustomerTypeMutations.useMutation"]
        })
    };
}
_s1(useCustomerTypeMutations, "O5Vz5OiMGwSmx1F87b/hU4o6JkA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useCustomerGroups() {
    _s2();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: customerSettingsKeys.groups(),
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchCustomerGroups"],
        staleTime: 1000 * 60 * 10
    });
}
_s2(useCustomerGroups, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useCustomerGroupMutations(opts) {
    _s3();
    const qc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const invalidate = ()=>qc.invalidateQueries({
            queryKey: customerSettingsKeys.groups()
        });
    return {
        create: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCustomerGroup"],
            onSuccess: {
                "useCustomerGroupMutations.useMutation": ()=>{
                    invalidate();
                    opts?.onSuccess?.();
                }
            }["useCustomerGroupMutations.useMutation"]
        }),
        update: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: {
                "useCustomerGroupMutations.useMutation": ({ systemId, data })=>__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateCustomerGroup"](systemId, data)
            }["useCustomerGroupMutations.useMutation"],
            onSuccess: {
                "useCustomerGroupMutations.useMutation": ()=>{
                    invalidate();
                    opts?.onSuccess?.();
                }
            }["useCustomerGroupMutations.useMutation"]
        }),
        remove: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteCustomerGroup"],
            onSuccess: {
                "useCustomerGroupMutations.useMutation": ()=>{
                    invalidate();
                    opts?.onSuccess?.();
                }
            }["useCustomerGroupMutations.useMutation"]
        })
    };
}
_s3(useCustomerGroupMutations, "O5Vz5OiMGwSmx1F87b/hU4o6JkA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useCustomerSources() {
    _s4();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: customerSettingsKeys.sources(),
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchCustomerSources"],
        staleTime: 1000 * 60 * 10
    });
}
_s4(useCustomerSources, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useCustomerSourceMutations(opts) {
    _s5();
    const qc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const invalidate = ()=>qc.invalidateQueries({
            queryKey: customerSettingsKeys.sources()
        });
    return {
        create: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCustomerSource"],
            onSuccess: {
                "useCustomerSourceMutations.useMutation": ()=>{
                    invalidate();
                    opts?.onSuccess?.();
                }
            }["useCustomerSourceMutations.useMutation"]
        }),
        update: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: {
                "useCustomerSourceMutations.useMutation": ({ systemId, data })=>__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateCustomerSource"](systemId, data)
            }["useCustomerSourceMutations.useMutation"],
            onSuccess: {
                "useCustomerSourceMutations.useMutation": ()=>{
                    invalidate();
                    opts?.onSuccess?.();
                }
            }["useCustomerSourceMutations.useMutation"]
        }),
        remove: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteCustomerSource"],
            onSuccess: {
                "useCustomerSourceMutations.useMutation": ()=>{
                    invalidate();
                    opts?.onSuccess?.();
                }
            }["useCustomerSourceMutations.useMutation"]
        })
    };
}
_s5(useCustomerSourceMutations, "O5Vz5OiMGwSmx1F87b/hU4o6JkA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function usePaymentTerms() {
    _s6();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: customerSettingsKeys.paymentTerms(),
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchPaymentTerms"],
        staleTime: 1000 * 60 * 10
    });
}
_s6(usePaymentTerms, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function usePaymentTermMutations(opts) {
    _s7();
    const qc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const invalidate = ()=>qc.invalidateQueries({
            queryKey: customerSettingsKeys.paymentTerms()
        });
    return {
        create: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPaymentTerm"],
            onSuccess: {
                "usePaymentTermMutations.useMutation": ()=>{
                    invalidate();
                    opts?.onSuccess?.();
                }
            }["usePaymentTermMutations.useMutation"]
        }),
        update: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: {
                "usePaymentTermMutations.useMutation": ({ systemId, data })=>__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updatePaymentTerm"](systemId, data)
            }["usePaymentTermMutations.useMutation"],
            onSuccess: {
                "usePaymentTermMutations.useMutation": ()=>{
                    invalidate();
                    opts?.onSuccess?.();
                }
            }["usePaymentTermMutations.useMutation"]
        }),
        remove: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deletePaymentTerm"],
            onSuccess: {
                "usePaymentTermMutations.useMutation": ()=>{
                    invalidate();
                    opts?.onSuccess?.();
                }
            }["usePaymentTermMutations.useMutation"]
        })
    };
}
_s7(usePaymentTermMutations, "O5Vz5OiMGwSmx1F87b/hU4o6JkA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useCreditRatings() {
    _s8();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: customerSettingsKeys.creditRatings(),
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchCreditRatings"],
        staleTime: 1000 * 60 * 10
    });
}
_s8(useCreditRatings, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useCreditRatingMutations(opts) {
    _s9();
    const qc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const invalidate = ()=>qc.invalidateQueries({
            queryKey: customerSettingsKeys.creditRatings()
        });
    return {
        create: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCreditRating"],
            onSuccess: {
                "useCreditRatingMutations.useMutation": ()=>{
                    invalidate();
                    opts?.onSuccess?.();
                }
            }["useCreditRatingMutations.useMutation"]
        }),
        update: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: {
                "useCreditRatingMutations.useMutation": ({ systemId, data })=>__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateCreditRating"](systemId, data)
            }["useCreditRatingMutations.useMutation"],
            onSuccess: {
                "useCreditRatingMutations.useMutation": ()=>{
                    invalidate();
                    opts?.onSuccess?.();
                }
            }["useCreditRatingMutations.useMutation"]
        }),
        remove: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteCreditRating"],
            onSuccess: {
                "useCreditRatingMutations.useMutation": ()=>{
                    invalidate();
                    opts?.onSuccess?.();
                }
            }["useCreditRatingMutations.useMutation"]
        })
    };
}
_s9(useCreditRatingMutations, "O5Vz5OiMGwSmx1F87b/hU4o6JkA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useLifecycleStages() {
    _s10();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: customerSettingsKeys.lifecycleStages(),
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchLifecycleStages"],
        staleTime: 1000 * 60 * 10
    });
}
_s10(useLifecycleStages, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useLifecycleStageMutations(opts) {
    _s11();
    const qc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const invalidate = ()=>qc.invalidateQueries({
            queryKey: customerSettingsKeys.lifecycleStages()
        });
    return {
        create: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createLifecycleStage"],
            onSuccess: {
                "useLifecycleStageMutations.useMutation": ()=>{
                    invalidate();
                    opts?.onSuccess?.();
                }
            }["useLifecycleStageMutations.useMutation"]
        }),
        update: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: {
                "useLifecycleStageMutations.useMutation": ({ systemId, data })=>__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateLifecycleStage"](systemId, data)
            }["useLifecycleStageMutations.useMutation"],
            onSuccess: {
                "useLifecycleStageMutations.useMutation": ()=>{
                    invalidate();
                    opts?.onSuccess?.();
                }
            }["useLifecycleStageMutations.useMutation"]
        }),
        remove: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteLifecycleStage"],
            onSuccess: {
                "useLifecycleStageMutations.useMutation": ()=>{
                    invalidate();
                    opts?.onSuccess?.();
                }
            }["useLifecycleStageMutations.useMutation"]
        })
    };
}
_s11(useLifecycleStageMutations, "O5Vz5OiMGwSmx1F87b/hU4o6JkA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useCustomerSlaSettings() {
    _s12();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: customerSettingsKeys.slaSettings(),
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchCustomerSlaSettings"],
        staleTime: 1000 * 60 * 10
    });
}
_s12(useCustomerSlaSettings, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useCustomerSlaSettingMutations(opts) {
    _s13();
    const qc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const invalidate = ()=>qc.invalidateQueries({
            queryKey: customerSettingsKeys.slaSettings()
        });
    return {
        update: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: {
                "useCustomerSlaSettingMutations.useMutation": ({ systemId, data })=>__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateCustomerSlaSetting"](systemId, data)
            }["useCustomerSlaSettingMutations.useMutation"],
            onSuccess: {
                "useCustomerSlaSettingMutations.useMutation": ()=>{
                    invalidate();
                    opts?.onSuccess?.();
                }
            }["useCustomerSlaSettingMutations.useMutation"]
        })
    };
}
_s13(useCustomerSlaSettingMutations, "ec0A66mtyLA0kdwNsMUsaWj/EHM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/customers/hooks/use-all-customer-settings.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAllCustomerGroups",
    ()=>useAllCustomerGroups,
    "useAllCustomerSources",
    ()=>useAllCustomerSources,
    "useAllCustomerTypes",
    ()=>useAllCustomerTypes,
    "useCustomerGroupFinder",
    ()=>useCustomerGroupFinder,
    "useCustomerGroupOptions",
    ()=>useCustomerGroupOptions,
    "useCustomerSourceFinder",
    ()=>useCustomerSourceFinder,
    "useCustomerSourceOptions",
    ()=>useCustomerSourceOptions,
    "useCustomerTypeFinder",
    ()=>useCustomerTypeFinder,
    "useCustomerTypeOptions",
    ()=>useCustomerTypeOptions
]);
/**
 * Convenience hooks for customer settings - flat array access
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$hooks$2f$use$2d$customer$2d$settings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/customers/hooks/use-customer-settings.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature(), _s6 = __turbopack_context__.k.signature(), _s7 = __turbopack_context__.k.signature(), _s8 = __turbopack_context__.k.signature();
;
;
function useAllCustomerTypes() {
    _s();
    const query = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$hooks$2f$use$2d$customer$2d$settings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCustomerTypes"])();
    return {
        data: query.data || [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error
    };
}
_s(useAllCustomerTypes, "Fw9jV7nW5qCqtqHDFdigv95keaM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$hooks$2f$use$2d$customer$2d$settings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCustomerTypes"]
    ];
});
function useCustomerTypeOptions() {
    _s1();
    const { data, isLoading } = useAllCustomerTypes();
    const options = data.map((t)=>({
            value: t.systemId,
            label: t.name
        }));
    return {
        options,
        isLoading
    };
}
_s1(useCustomerTypeOptions, "0ogSm1MPYIsWEj8NdnObeljlhLE=", false, function() {
    return [
        useAllCustomerTypes
    ];
});
function useCustomerTypeFinder() {
    _s2();
    const { data } = useAllCustomerTypes();
    const findById = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useCustomerTypeFinder.useCallback[findById]": (systemId)=>{
            return data.find({
                "useCustomerTypeFinder.useCallback[findById]": (t)=>t.systemId === systemId
            }["useCustomerTypeFinder.useCallback[findById]"]);
        }
    }["useCustomerTypeFinder.useCallback[findById]"], [
        data
    ]);
    return {
        findById
    };
}
_s2(useCustomerTypeFinder, "tWfvico+hqcU8DuF+IRrDDf0CRs=", false, function() {
    return [
        useAllCustomerTypes
    ];
});
function useAllCustomerGroups() {
    _s3();
    const query = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$hooks$2f$use$2d$customer$2d$settings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCustomerGroups"])();
    return {
        data: query.data || [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error
    };
}
_s3(useAllCustomerGroups, "VevC4reZGZfphQGv5ZLXNPqXpgw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$hooks$2f$use$2d$customer$2d$settings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCustomerGroups"]
    ];
});
function useCustomerGroupOptions() {
    _s4();
    const { data, isLoading } = useAllCustomerGroups();
    const options = data.map((g)=>({
            value: g.systemId,
            label: g.name
        }));
    return {
        options,
        isLoading
    };
}
_s4(useCustomerGroupOptions, "Rz4YkbGXCKdMdkEVUN2Kyw3LoNo=", false, function() {
    return [
        useAllCustomerGroups
    ];
});
function useAllCustomerSources() {
    _s5();
    const query = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$hooks$2f$use$2d$customer$2d$settings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCustomerSources"])();
    return {
        data: query.data || [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error
    };
}
_s5(useAllCustomerSources, "g5umuhD4TuM8hpnQTRufrsrRF1I=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$hooks$2f$use$2d$customer$2d$settings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCustomerSources"]
    ];
});
function useCustomerSourceOptions() {
    _s6();
    const { data, isLoading } = useAllCustomerSources();
    const options = data.map((s)=>({
            value: s.systemId,
            label: s.name
        }));
    return {
        options,
        isLoading
    };
}
_s6(useCustomerSourceOptions, "FS2uqU6GEE5H2pP5CZqBKVmJM3c=", false, function() {
    return [
        useAllCustomerSources
    ];
});
function useCustomerGroupFinder() {
    _s7();
    const { data } = useAllCustomerGroups();
    const findById = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useCustomerGroupFinder.useCallback[findById]": (systemId)=>{
            return data.find({
                "useCustomerGroupFinder.useCallback[findById]": (g)=>g.systemId === systemId
            }["useCustomerGroupFinder.useCallback[findById]"]);
        }
    }["useCustomerGroupFinder.useCallback[findById]"], [
        data
    ]);
    return {
        findById
    };
}
_s7(useCustomerGroupFinder, "08oKo4clUe5Tzs6fFYtbyBq8Ym0=", false, function() {
    return [
        useAllCustomerGroups
    ];
});
function useCustomerSourceFinder() {
    _s8();
    const { data } = useAllCustomerSources();
    const findById = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useCustomerSourceFinder.useCallback[findById]": (systemId)=>{
            return data.find({
                "useCustomerSourceFinder.useCallback[findById]": (s)=>s.systemId === systemId
            }["useCustomerSourceFinder.useCallback[findById]"]);
        }
    }["useCustomerSourceFinder.useCallback[findById]"], [
        data
    ]);
    return {
        findById
    };
}
_s8(useCustomerSourceFinder, "+OLfBnQWYU5lEz/Fhrm9TuDWdcU=", false, function() {
    return [
        useAllCustomerSources
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/customers/sla-settings-data.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SLA_TYPE_DESCRIPTIONS",
    ()=>SLA_TYPE_DESCRIPTIONS,
    "SLA_TYPE_LABELS",
    ()=>SLA_TYPE_LABELS,
    "defaultCustomerSlaSettings",
    ()=>defaultCustomerSlaSettings
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/seed-audit.ts [app-client] (ecmascript)");
;
;
const defaultCustomerSlaSettings = [
    // Follow-up SLA - Nhắc liên hệ định kỳ
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('CUSTSLA0000001'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('SLA-FOLLOWUP'),
        name: 'Liên hệ định kỳ',
        description: 'Nhắc nhở liên hệ khách hàng sau một thời gian không tương tác',
        slaType: 'follow-up',
        targetDays: 14,
        warningDays: 3,
        criticalDays: 7,
        color: '#2196F3',
        isActive: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-01T08:00:00Z'
        })
    },
    // Re-engagement SLA - Kích hoạt lại khách hàng không hoạt động
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('CUSTSLA0000002'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('SLA-REENGAGEMENT'),
        name: 'Kích hoạt lại',
        description: 'Khách hàng không mua hàng cần được kích hoạt lại',
        slaType: 're-engagement',
        targetDays: 60,
        warningDays: 10,
        criticalDays: 14,
        color: '#FF9800',
        isActive: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-02T08:00:00Z'
        })
    },
    // Debt Payment SLA - Nhắc thanh toán công nợ
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('CUSTSLA0000003'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('SLA-DEBT'),
        name: 'Nhắc công nợ',
        description: 'Nhắc thanh toán công nợ quá hạn',
        slaType: 'debt-payment',
        targetDays: 7,
        warningDays: 2,
        criticalDays: 7,
        color: '#E91E63',
        isActive: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-03T08:00:00Z'
        })
    }
];
const SLA_TYPE_LABELS = {
    'follow-up': 'Liên hệ định kỳ',
    're-engagement': 'Kích hoạt lại',
    'debt-payment': 'Nhắc công nợ'
};
const SLA_TYPE_DESCRIPTIONS = {
    'follow-up': 'Nhắc nhở liên hệ khách hàng theo chu kỳ định kỳ',
    're-engagement': 'Kích hoạt khách hàng không hoạt động trong thời gian dài',
    'debt-payment': 'Nhắc thanh toán công nợ quá hạn'
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/customers/sla-settings-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getSlaBySlaType",
    ()=>getSlaBySlaType,
    "loadCustomerSlaSettings",
    ()=>loadCustomerSlaSettings,
    "useCustomerSlaStore",
    ()=>useCustomerSlaStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$sla$2d$settings$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/customers/sla-settings-data.ts [app-client] (ecmascript)");
;
;
const useCustomerSlaStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCrudStore"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$sla$2d$settings$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaultCustomerSlaSettings"], 'sla-settings', {
    apiEndpoint: '/api/settings/customers?type=sla-setting'
});
function getSlaBySlaType(slaType) {
    return useCustomerSlaStore.getState().data.find((sla)=>sla.slaType === slaType && sla.isActive);
}
function loadCustomerSlaSettings() {
    return useCustomerSlaStore.getState().data.filter((sla)=>sla.isActive);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/branches/api/branches-api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/branches/hooks/use-branches.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/query-core/build/modern/utils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$api$2f$branches$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/branches/api/branches-api.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature();
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
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: branchKeys.list(params),
        queryFn: {
            "useBranches.useQuery": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$api$2f$branches$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchBranches"])(params)
        }["useBranches.useQuery"],
        staleTime: 10 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
        placeholderData: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["keepPreviousData"]
    });
}
_s(useBranches, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useBranch(id) {
    _s1();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: branchKeys.detail(id),
        queryFn: {
            "useBranch.useQuery": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$api$2f$branches$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchBranch"])(id)
        }["useBranch.useQuery"],
        enabled: !!id,
        staleTime: 10 * 60 * 1000
    });
}
_s1(useBranch, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useBranchMutations(options = {}) {
    _s2();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const create = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$api$2f$branches$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createBranch"],
        onSuccess: {
            "useBranchMutations.useMutation[create]": (data)=>{
                queryClient.invalidateQueries({
                    queryKey: branchKeys.all
                });
                options.onCreateSuccess?.(data);
            }
        }["useBranchMutations.useMutation[create]"],
        onError: options.onError
    });
    const update = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useBranchMutations.useMutation[update]": ({ systemId, data })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$api$2f$branches$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateBranch"])(systemId, data)
        }["useBranchMutations.useMutation[update]"],
        onSuccess: {
            "useBranchMutations.useMutation[update]": (data, variables)=>{
                queryClient.invalidateQueries({
                    queryKey: branchKeys.detail(variables.systemId)
                });
                queryClient.invalidateQueries({
                    queryKey: branchKeys.lists()
                });
                options.onUpdateSuccess?.(data);
            }
        }["useBranchMutations.useMutation[update]"],
        onError: options.onError
    });
    const remove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$api$2f$branches$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteBranch"],
        onSuccess: {
            "useBranchMutations.useMutation[remove]": ()=>{
                queryClient.invalidateQueries({
                    queryKey: branchKeys.all
                });
                options.onDeleteSuccess?.();
            }
        }["useBranchMutations.useMutation[remove]"],
        onError: options.onError
    });
    const makeDefault = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$api$2f$branches$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setDefaultBranch"],
        onSuccess: {
            "useBranchMutations.useMutation[makeDefault]": (data)=>{
                queryClient.invalidateQueries({
                    queryKey: branchKeys.all
                });
                options.onSetDefaultSuccess?.(data);
            }
        }["useBranchMutations.useMutation[makeDefault]"],
        onError: options.onError
    });
    return {
        create,
        update,
        remove,
        makeDefault
    };
}
_s2(useBranchMutations, "EPwZaexZ+A2MG/Il9d02DBsR3OY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useAllBranches() {
    _s3();
    return useBranches({
        limit: 100
    });
}
_s3(useAllBranches, "EFXwoFMuwUPYJRyM9DXF8ybsE6A=", false, function() {
    return [
        useBranches
    ];
});
function useDefaultBranch() {
    _s4();
    const { data, ...rest } = useBranches({
        isDefault: true,
        limit: 1
    });
    return {
        ...rest,
        data: data?.data?.[0] ?? null
    };
}
_s4(useDefaultBranch, "25wE7MkZyZGCmEQqDULsd6PAQBo=", false, function() {
    return [
        useBranches
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/branches/hooks/use-all-branches.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$hooks$2f$use$2d$branches$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/branches/hooks/use-branches.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature();
;
;
function useAllBranches() {
    _s();
    const query = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$hooks$2f$use$2d$branches$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBranches"])({
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
_s(useAllBranches, "+PKTE8oUN6qYm8gSxvgSOCPz7xo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$hooks$2f$use$2d$branches$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBranches"]
    ];
});
function useBranchOptions() {
    _s1();
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
_s1(useBranchOptions, "iJUX8iYMHRFOUTFA2yROVdRBuCs=", false, function() {
    return [
        useAllBranches
    ];
});
function useDefaultBranch() {
    _s2();
    const { data, isLoading } = useAllBranches();
    const defaultBranch = data.find((b)=>b.isDefault) || data[0];
    return {
        defaultBranch,
        isLoading
    };
}
_s2(useDefaultBranch, "iJUX8iYMHRFOUTFA2yROVdRBuCs=", false, function() {
    return [
        useAllBranches
    ];
});
function useBranchFinder() {
    _s3();
    const { data } = useAllBranches();
    const findById = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "useBranchFinder.useCallback[findById]": (systemId)=>{
            if (!systemId) return undefined;
            return data.find({
                "useBranchFinder.useCallback[findById]": (b)=>b.systemId === systemId
            }["useBranchFinder.useCallback[findById]"]);
        }
    }["useBranchFinder.useCallback[findById]"], [
        data
    ]);
    return {
        findById
    };
}
_s3(useBranchFinder, "M2po72zMNxGW66rBzp8UHlwb280=", false, function() {
    return [
        useAllBranches
    ];
});
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
;
const baseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCrudStore"])([], 'branches', {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-client] (ecmascript)");
;
;
const baseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCrudStore"])([], 'pricing-settings', {
    businessIdField: 'id',
    getCurrentUser: __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentUserSystemId"],
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
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-client] (ecmascript)");
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
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(item.systemId),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])(item.id)
    }));
const useProductTypeStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((set, get)=>({
        data: initialData,
        initialized: false,
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
                                    systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(item.systemId),
                                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])(item.id)
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/inventory/product-category-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useProductCategoryStore",
    ()=>useProductCategoryStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-client] (ecmascript)");
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
const useProductCategoryStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((set, get)=>({
        data: [],
        counter: 0,
        initialized: false,
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
                                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(item.systemId),
                                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])(item.id),
                                parentId: item.parentId ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(item.parentId) : undefined,
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/receipt-types/store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useReceiptTypeStore",
    ()=>useReceiptTypeStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-client] (ecmascript)");
;
;
const baseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCrudStore"])([], 'receipt-types', {
    businessIdField: 'id',
    apiEndpoint: '/api/settings/data?type=receipt-type'
});
const originalAdd = baseStore.getState().add;
baseStore.setState((state)=>({
        ...state,
        add: (item)=>{
            const newItem = {
                ...item,
                createdAt: item.createdAt ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toISODate"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentDate"])())
            };
            return originalAdd(newItem);
        }
    }));
const useReceiptTypeStore = baseStore;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/target-groups/store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useTargetGroupStore",
    ()=>useTargetGroupStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-client] (ecmascript)");
;
const useTargetGroupStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCrudStore"])([], 'target-groups', {
    apiEndpoint: '/api/settings/data?type=target-group'
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/payments/methods/store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePaymentMethodStore",
    ()=>usePaymentMethodStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-client] (ecmascript)");
;
;
// API sync helper
async function syncToAPI(action, data) {
    try {
        const endpoint = action === 'create' ? '/api/settings/payment-methods' : `/api/settings/payment-methods/${data.systemId}`;
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
        console.error(`[Payment Methods API] ${action} error:`, error);
        return false;
    }
}
const usePaymentMethodStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((set, get)=>({
        data: [],
        initialized: false,
        add: (item)=>{
            const newItem = {
                ...item,
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(`PM_${Date.now()}`),
                isDefault: get().data.length === 0
            };
            set((state)=>({
                    data: [
                        ...state.data,
                        newItem
                    ]
                }));
            // Sync to API
            syncToAPI('create', newItem).catch(console.error);
        },
        update: (systemId, updatedFields)=>{
            set((state)=>({
                    data: state.data.map((p)=>p.systemId === systemId ? {
                            ...p,
                            ...updatedFields
                        } : p)
                }));
            // Sync to API
            const updated = get().data.find((p)=>p.systemId === systemId);
            if (updated) {
                syncToAPI('update', updated).catch(console.error);
            }
        },
        remove: (systemId)=>{
            syncToAPI('delete', {
                systemId
            }).catch(console.error);
            set((state)=>({
                    data: state.data.filter((p)=>p.systemId !== systemId)
                }));
        },
        setDefault: (systemId)=>{
            set((state)=>({
                    data: state.data.map((p)=>({
                            ...p,
                            isDefault: p.systemId === systemId
                        }))
                }));
            // Sync all to API (update default status)
            const data = get().data;
            for (const item of data){
                syncToAPI('update', item).catch(console.error);
            }
        },
        loadFromAPI: async ()=>{
            if (get().initialized) return;
            try {
                // NOTE: Settings data is typically small, but using limit for consistency
                const response = await fetch('/api/settings/payment-methods?limit=30');
                if (response.ok) {
                    const json = await response.json();
                    const data = json.data || json.methods || [];
                    if (data.length > 0) {
                        set({
                            data,
                            initialized: true
                        });
                    } else {
                        set({
                            initialized: true
                        });
                    }
                }
            } catch (error) {
                console.error('[Payment Methods Store] loadFromAPI error:', error);
            }
        }
    }));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/payments/types/store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePaymentTypeStore",
    ()=>usePaymentTypeStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-client] (ecmascript)");
;
;
const baseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCrudStore"])([], 'payment-types', {
    businessIdField: 'id',
    apiEndpoint: '/api/settings/data?type=payment-type'
});
const originalAdd = baseStore.getState().add;
baseStore.setState((state)=>({
        ...state,
        add: (item)=>{
            const newItem = {
                ...item,
                createdAt: item.createdAt ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toISODate"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentDate"])())
            };
            return originalAdd(newItem);
        }
    }));
const usePaymentTypeStore = baseStore;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/shipping/store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useShippingPartnerStore",
    ()=>useShippingPartnerStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/fuse.js/dist/fuse.mjs [app-client] (ecmascript)");
;
;
// FIX: Replaced import from a non-existent module and replaced it with a mock function.
const connectPartner = async (partnerId, credentials)=>{
    console.log(`Connecting to ${partnerId} with`, credentials);
    // Simulate success for known partners if they have credentials.
    if (credentials && Object.values(credentials).every((v)=>v)) {
        return {
            success: true,
            message: 'Kết nối thành công.'
        };
    }
    return {
        success: false,
        message: 'Thông tin kết nối không hợp lệ.'
    };
};
const baseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCrudStore"])([], 'shipping-partners', {
    // ⚠️ DEPRECATED: Store này không còn dùng để lưu credentials nữa
    // Credentials giờ được lưu trong database
    apiEndpoint: '/api/settings/data?type=shipping-partner'
});
const fuse = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](baseStore.getState().data, {
    keys: [
        'name',
        'id',
        'phone'
    ],
    threshold: 0.3
});
const storeExtension = {
    searchShippingPartners: async (query, page, limit = 20)=>{
        return new Promise((resolve)=>{
            setTimeout(()=>{
                const allPartners = baseStore.getState().data;
                const results = query ? fuse.search(query).map((r)=>r.item) : allPartners;
                const start = (page - 1) * limit;
                const end = start + limit;
                const paginatedItems = results.slice(start, end);
                resolve({
                    items: paginatedItems.map((p)=>({
                            value: p.systemId,
                            label: p.name
                        })),
                    hasNextPage: end < results.length
                });
            }, 300);
        });
    },
    connect: async (systemId, credentials)=>{
        // ⚠️ DEPRECATED: Không nên dùng hàm này nữa
        // Vui lòng cấu hình trong Settings → Đối tác vận chuyển
        // Credentials sẽ được lưu vào shipping_partners_config
        console.warn('[ShippingPartnerStore] connect() is deprecated. Use shipping_partners_config instead.');
        const partner = baseStore.getState().findById(systemId);
        if (!partner) return {
            success: false,
            message: 'Không tìm thấy đối tác vận chuyển.'
        };
        console.log('[ShippingPartnerStore] Connecting partner:', {
            systemId,
            credentials
        });
        const result = {
            success: true,
            message: 'Kết nối thành công.'
        };
        if (result.success) {
            baseStore.setState((state)=>{
                const newData = state.data.map((p)=>p.systemId === systemId ? {
                        ...p,
                        isConnected: true,
                        status: 'Đang hợp tác',
                        credentials
                    } : p);
                console.log('[ShippingPartnerStore] Updated partner:', newData.find((p)=>p.systemId === systemId));
                return {
                    data: newData
                };
            });
        }
        return result;
    },
    disconnect: (systemId)=>{
        // ⚠️ DEPRECATED: Không nên dùng hàm này nữa
        console.warn('[ShippingPartnerStore] disconnect() is deprecated. Use shipping_partners_config instead.');
        baseStore.setState((state)=>({
                data: state.data.map((p)=>p.systemId === systemId ? {
                        ...p,
                        isConnected: false,
                        status: 'Ngừng hợp tác',
                        credentials: {},
                        configuration: {}
                    } : p)
            }));
    }
};
baseStore.setState(storeExtension);
const useShippingPartnerStore = baseStore;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/sales/sales-management-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "salesManagementDefaultSettings",
    ()=>salesManagementDefaultSettings,
    "useSalesManagementSettingsStore",
    ()=>useSalesManagementSettingsStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
;
const defaultSettings = {
    allowCancelAfterExport: true,
    allowNegativeOrder: true,
    allowNegativeApproval: true,
    allowNegativePacking: true,
    allowNegativeStockOut: true,
    printCopies: '1'
};
// API sync helper
async function syncToAPI(settings) {
    try {
        const response = await fetch('/api/settings/sales', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(settings)
        });
        return response.ok;
    } catch (error) {
        console.error('[Sales Management Settings API] sync error:', error);
        return false;
    }
}
const useSalesManagementSettingsStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((set, get)=>({
        ...defaultSettings,
        initialized: false,
        updateSetting: (key, value)=>{
            set((state)=>({
                    ...state,
                    [key]: value
                }));
            syncToAPI({
                [key]: value
            }).catch(console.error);
        },
        reset: ()=>{
            set(()=>({
                    ...defaultSettings
                }));
            syncToAPI(defaultSettings).catch(console.error);
        },
        loadFromAPI: async ()=>{
            if (get().initialized) return;
            try {
                const response = await fetch('/api/settings/sales');
                if (response.ok) {
                    const json = await response.json();
                    const data = json.data || json;
                    if (data) {
                        set({
                            ...defaultSettings,
                            ...data,
                            initialized: true
                        });
                    } else {
                        set({
                            initialized: true
                        });
                    }
                }
            } catch (error) {
                console.error('[Sales Management Settings Store] loadFromAPI error:', error);
            }
        }
    }));
const salesManagementDefaultSettings = defaultSettings;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=features_settings_061da231._.js.map