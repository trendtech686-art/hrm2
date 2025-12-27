module.exports = [
"[project]/features/settings/provinces/api/provinces-api.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Provinces API Layer
 * Handles all province, district, ward-related API calls
 */ __turbopack_context__.s([
    "createDistrict",
    ()=>createDistrict,
    "createProvince",
    ()=>createProvince,
    "createWard",
    ()=>createWard,
    "deleteDistrict",
    ()=>deleteDistrict,
    "deleteProvince",
    ()=>deleteProvince,
    "deleteWard",
    ()=>deleteWard,
    "fetchAllProvinces",
    ()=>fetchAllProvinces,
    "fetchAllWards",
    ()=>fetchAllWards,
    "fetchDistricts",
    ()=>fetchDistricts,
    "fetchDistrictsByProvince",
    ()=>fetchDistrictsByProvince,
    "fetchProvinceById",
    ()=>fetchProvinceById,
    "fetchProvinces",
    ()=>fetchProvinces,
    "fetchWards",
    ()=>fetchWards,
    "fetchWardsByDistrict",
    ()=>fetchWardsByDistrict,
    "fetchWardsByProvince",
    ()=>fetchWardsByProvince,
    "importAdministrativeUnits",
    ()=>importAdministrativeUnits,
    "updateDistrict",
    ()=>updateDistrict,
    "updateProvince",
    ()=>updateProvince,
    "updateWard",
    ()=>updateWard
]);
const BASE_URL = '/api/settings/locations';
async function fetchProvinces(filters = {}) {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.search) params.set('search', filters.search);
    const url = params.toString() ? `${BASE_URL}/provinces?${params}` : `${BASE_URL}/provinces`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch provinces');
    return response.json();
}
async function fetchProvinceById(systemId) {
    const response = await fetch(`${BASE_URL}/provinces/${systemId}`);
    if (!response.ok) throw new Error('Failed to fetch province');
    return response.json();
}
async function fetchAllProvinces() {
    const response = await fetchProvinces({
        limit: 100
    });
    return response.data;
}
async function fetchDistricts(filters = {}) {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.provinceId) params.set('provinceId', filters.provinceId);
    if (filters.search) params.set('search', filters.search);
    const url = params.toString() ? `${BASE_URL}/districts?${params}` : `${BASE_URL}/districts`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch districts');
    return response.json();
}
async function fetchDistrictsByProvince(provinceId) {
    const response = await fetchDistricts({
        provinceId,
        limit: 100
    });
    return response.data;
}
async function fetchWards(filters = {}) {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.provinceId) params.set('provinceId', filters.provinceId);
    if (filters.districtId) params.set('districtId', String(filters.districtId));
    if (filters.level) params.set('level', filters.level);
    if (filters.search) params.set('search', filters.search);
    const url = params.toString() ? `${BASE_URL}/wards?${params}` : `${BASE_URL}/wards`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch wards');
    return response.json();
}
async function fetchWardsByDistrict(districtId) {
    const response = await fetchWards({
        districtId,
        limit: 500
    });
    return response.data;
}
async function fetchWardsByProvince(provinceId) {
    const response = await fetchWards({
        provinceId,
        limit: 500
    });
    return response.data;
}
async function fetchAllWards() {
    const response = await fetchWards({
        limit: 2000
    });
    return response.data;
}
async function createProvince(data) {
    const response = await fetch(`${BASE_URL}/provinces`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create province');
    return response.json();
}
async function updateProvince(systemId, data) {
    const response = await fetch(`${BASE_URL}/provinces/${systemId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update province');
    return response.json();
}
async function deleteProvince(systemId) {
    const response = await fetch(`${BASE_URL}/provinces/${systemId}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete province');
}
async function createDistrict(data) {
    const response = await fetch(`${BASE_URL}/districts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create district');
    return response.json();
}
async function updateDistrict(systemId, data) {
    const response = await fetch(`${BASE_URL}/districts/${systemId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update district');
    return response.json();
}
async function deleteDistrict(systemId) {
    const response = await fetch(`${BASE_URL}/districts/${systemId}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete district');
}
async function createWard(data) {
    const response = await fetch(`${BASE_URL}/wards`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create ward');
    return response.json();
}
async function updateWard(systemId, data) {
    const response = await fetch(`${BASE_URL}/wards/${systemId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update ward');
    return response.json();
}
async function deleteWard(systemId) {
    const response = await fetch(`${BASE_URL}/wards/${systemId}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete ward');
}
async function importAdministrativeUnits(payload) {
    const response = await fetch(`${BASE_URL}/import`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error('Failed to import administrative units');
}
}),
"[project]/features/settings/provinces/hooks/use-provinces.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "locationKeys",
    ()=>locationKeys,
    "useAdministrativeImportMutation",
    ()=>useAdministrativeImportMutation,
    "useAllProvinces",
    ()=>useAllProvinces,
    "useAllWards",
    ()=>useAllWards,
    "useDistrictMutations",
    ()=>useDistrictMutations,
    "useDistricts",
    ()=>useDistricts,
    "useDistrictsByProvince",
    ()=>useDistrictsByProvince,
    "useProvinceById",
    ()=>useProvinceById,
    "useProvinceMutations",
    ()=>useProvinceMutations,
    "useProvinces",
    ()=>useProvinces,
    "useWardMutations",
    ()=>useWardMutations,
    "useWards",
    ()=>useWards,
    "useWardsByDistrict",
    ()=>useWardsByDistrict,
    "useWardsByProvince",
    ()=>useWardsByProvince
]);
/**
 * Provinces React Query Hooks
 * Provides data fetching for provinces, districts, wards
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$provinces$2f$api$2f$provinces$2d$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/provinces/api/provinces-api.ts [app-rsc] (ecmascript)");
;
;
const locationKeys = {
    all: [
        'locations'
    ],
    provinces: ()=>[
            ...locationKeys.all,
            'provinces'
        ],
    provinceList: (filters)=>[
            ...locationKeys.provinces(),
            'list',
            filters
        ],
    provinceDetail: (id)=>[
            ...locationKeys.provinces(),
            'detail',
            id
        ],
    allProvinces: ()=>[
            ...locationKeys.provinces(),
            'all'
        ],
    districts: ()=>[
            ...locationKeys.all,
            'districts'
        ],
    districtList: (filters)=>[
            ...locationKeys.districts(),
            'list',
            filters
        ],
    districtsByProvince: (provinceId)=>[
            ...locationKeys.districts(),
            'province',
            provinceId
        ],
    wards: ()=>[
            ...locationKeys.all,
            'wards'
        ],
    wardList: (filters)=>[
            ...locationKeys.wards(),
            'list',
            filters
        ],
    wardsByDistrict: (districtId)=>[
            ...locationKeys.wards(),
            'district',
            districtId
        ],
    wardsByProvince: (provinceId)=>[
            ...locationKeys.wards(),
            'province',
            provinceId
        ],
    allWards: ()=>[
            ...locationKeys.wards(),
            'all'
        ]
};
function useProvinces(filters = {}) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: locationKeys.provinceList(filters),
        queryFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$provinces$2f$api$2f$provinces$2d$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchProvinces"])(filters),
        staleTime: 1000 * 60 * 60
    });
}
function useAllProvinces() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: locationKeys.allProvinces(),
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$provinces$2f$api$2f$provinces$2d$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchAllProvinces"],
        staleTime: 1000 * 60 * 60 * 24
    });
}
function useProvinceById(systemId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: locationKeys.provinceDetail(systemId),
        queryFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$provinces$2f$api$2f$provinces$2d$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchProvinceById"])(systemId),
        enabled: !!systemId,
        staleTime: 1000 * 60 * 60
    });
}
function useDistricts(filters = {}) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: locationKeys.districtList(filters),
        queryFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$provinces$2f$api$2f$provinces$2d$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchDistricts"])(filters),
        staleTime: 1000 * 60 * 60
    });
}
function useDistrictsByProvince(provinceId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: locationKeys.districtsByProvince(provinceId),
        queryFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$provinces$2f$api$2f$provinces$2d$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchDistrictsByProvince"])(provinceId),
        enabled: !!provinceId,
        staleTime: 1000 * 60 * 60
    });
}
function useWards(filters = {}) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: locationKeys.wardList(filters),
        queryFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$provinces$2f$api$2f$provinces$2d$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchWards"])(filters),
        staleTime: 1000 * 60 * 60
    });
}
function useWardsByDistrict(districtId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: locationKeys.wardsByDistrict(districtId),
        queryFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$provinces$2f$api$2f$provinces$2d$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchWardsByDistrict"])(districtId),
        enabled: !!districtId,
        staleTime: 1000 * 60 * 60
    });
}
function useWardsByProvince(provinceId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: locationKeys.wardsByProvince(provinceId),
        queryFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$provinces$2f$api$2f$provinces$2d$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchWardsByProvince"])(provinceId),
        enabled: !!provinceId,
        staleTime: 1000 * 60 * 60
    });
}
function useAllWards() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: locationKeys.allWards(),
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$provinces$2f$api$2f$provinces$2d$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchAllWards"],
        staleTime: 1000 * 60 * 60 * 24
    });
}
function useProvinceMutations(options = {}) {
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const invalidateAll = ()=>{
        queryClient.invalidateQueries({
            queryKey: locationKeys.provinces()
        });
    };
    const add = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: (data)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$provinces$2f$api$2f$provinces$2d$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createProvince"])(data),
        onSuccess: ()=>{
            invalidateAll();
            options.onSuccess?.();
        },
        onError: options.onError
    });
    const update = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: ({ systemId, data })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$provinces$2f$api$2f$provinces$2d$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateProvince"])(systemId, data),
        onSuccess: ()=>{
            invalidateAll();
            options.onSuccess?.();
        },
        onError: options.onError
    });
    const remove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: (systemId)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$provinces$2f$api$2f$provinces$2d$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteProvince"])(systemId),
        onSuccess: ()=>{
            invalidateAll();
            options.onSuccess?.();
        },
        onError: options.onError
    });
    return {
        add,
        update,
        remove
    };
}
function useDistrictMutations(options = {}) {
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const invalidateAll = ()=>{
        queryClient.invalidateQueries({
            queryKey: locationKeys.districts()
        });
    };
    const add = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: (data)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$provinces$2f$api$2f$provinces$2d$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createDistrict"])(data),
        onSuccess: ()=>{
            invalidateAll();
            options.onSuccess?.();
        },
        onError: options.onError
    });
    const update = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: ({ systemId, data })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$provinces$2f$api$2f$provinces$2d$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateDistrict"])(systemId, data),
        onSuccess: ()=>{
            invalidateAll();
            options.onSuccess?.();
        },
        onError: options.onError
    });
    const remove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: (systemId)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$provinces$2f$api$2f$provinces$2d$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteDistrict"])(systemId),
        onSuccess: ()=>{
            invalidateAll();
            options.onSuccess?.();
        },
        onError: options.onError
    });
    return {
        add,
        update,
        remove
    };
}
function useWardMutations(options = {}) {
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const invalidateAll = ()=>{
        queryClient.invalidateQueries({
            queryKey: locationKeys.wards()
        });
    };
    const add = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: (data)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$provinces$2f$api$2f$provinces$2d$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createWard"])(data),
        onSuccess: ()=>{
            invalidateAll();
            options.onSuccess?.();
        },
        onError: options.onError
    });
    const update = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: ({ systemId, data })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$provinces$2f$api$2f$provinces$2d$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateWard"])(systemId, data),
        onSuccess: ()=>{
            invalidateAll();
            options.onSuccess?.();
        },
        onError: options.onError
    });
    const remove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: (systemId)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$provinces$2f$api$2f$provinces$2d$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteWard"])(systemId),
        onSuccess: ()=>{
            invalidateAll();
            options.onSuccess?.();
        },
        onError: options.onError
    });
    return {
        add,
        update,
        remove
    };
}
function useAdministrativeImportMutation(options = {}) {
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: (payload)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$provinces$2f$api$2f$provinces$2d$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["importAdministrativeUnits"])(payload),
        onSuccess: ()=>{
            queryClient.invalidateQueries({
                queryKey: locationKeys.all
            });
            options.onSuccess?.();
        },
        onError: options.onError
    });
}
}),
"[project]/lib/id-types.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Type-safe ID System
 * 
 * Prevents mixing systemId with business ID at compile time
 */ // Branded types for type safety
__turbopack_context__.s([
    "asBusinessId",
    ()=>asBusinessId,
    "asSystemId",
    ()=>asSystemId,
    "buildEntityLink",
    ()=>buildEntityLink,
    "ensureBusinessId",
    ()=>ensureBusinessId,
    "ensureSystemId",
    ()=>ensureSystemId,
    "getDisplayId",
    ()=>getDisplayId,
    "isBusinessIdFormat",
    ()=>isBusinessIdFormat,
    "isSystemIdFormat",
    ()=>isSystemIdFormat,
    "parseId",
    ()=>parseId
]);
function asSystemId(id) {
    return id;
}
function asBusinessId(id) {
    return id;
}
function isSystemIdFormat(id) {
    // SystemId: 8 digits + prefix (e.g., NV00000001, VOUCHER00000123)
    return /^[A-Z]+\d{8}$/.test(id);
}
function isBusinessIdFormat(id) {
    // Business ID: shorter, variable length (e.g., NV001, PT000001)
    return /^[A-Z]+\d{3,6}$/.test(id);
}
function parseId(id) {
    if (isSystemIdFormat(id)) {
        return {
            type: 'system',
            value: asSystemId(id)
        };
    }
    if (isBusinessIdFormat(id)) {
        return {
            type: 'business',
            value: asBusinessId(id)
        };
    }
    throw new Error(`Invalid ID format: ${id}`);
}
function buildEntityLink(path, entity) {
    return path.replace(':systemId', entity.systemId);
}
function getDisplayId(entity) {
    return entity.id;
}
function ensureSystemId(id, context) {
    if (!isSystemIdFormat(id)) {
        console.warn(`[ensureSystemId] Invalid SystemId format: "${id}"${context ? ` in ${context}` : ''}`);
    }
    return asSystemId(id);
}
function ensureBusinessId(id, context) {
    if (!isBusinessIdFormat(id)) {
        console.warn(`[ensureBusinessId] Invalid BusinessId format: "${id}"${context ? ` in ${context}` : ''}`);
    }
    return asBusinessId(id);
}
}),
"[project]/lib/utils.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn,
    "slugify",
    ()=>slugify
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-rsc] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
function slugify(text) {
    if (!text) return '';
    // Vietnamese character map
    const vnMap = {
        'à': 'a',
        'á': 'a',
        'ả': 'a',
        'ã': 'a',
        'ạ': 'a',
        'ă': 'a',
        'ằ': 'a',
        'ắ': 'a',
        'ẳ': 'a',
        'ẵ': 'a',
        'ặ': 'a',
        'â': 'a',
        'ầ': 'a',
        'ấ': 'a',
        'ẩ': 'a',
        'ẫ': 'a',
        'ậ': 'a',
        'đ': 'd',
        'è': 'e',
        'é': 'e',
        'ẻ': 'e',
        'ẽ': 'e',
        'ẹ': 'e',
        'ê': 'e',
        'ề': 'e',
        'ế': 'e',
        'ể': 'e',
        'ễ': 'e',
        'ệ': 'e',
        'ì': 'i',
        'í': 'i',
        'ỉ': 'i',
        'ĩ': 'i',
        'ị': 'i',
        'ò': 'o',
        'ó': 'o',
        'ỏ': 'o',
        'õ': 'o',
        'ọ': 'o',
        'ô': 'o',
        'ồ': 'o',
        'ố': 'o',
        'ổ': 'o',
        'ỗ': 'o',
        'ộ': 'o',
        'ơ': 'o',
        'ờ': 'o',
        'ớ': 'o',
        'ở': 'o',
        'ỡ': 'o',
        'ợ': 'o',
        'ù': 'u',
        'ú': 'u',
        'ủ': 'u',
        'ũ': 'u',
        'ụ': 'u',
        'ư': 'u',
        'ừ': 'u',
        'ứ': 'u',
        'ử': 'u',
        'ữ': 'u',
        'ự': 'u',
        'ỳ': 'y',
        'ý': 'y',
        'ỷ': 'y',
        'ỹ': 'y',
        'ỵ': 'y'
    };
    return text.toLowerCase().split('').map((char)=>vnMap[char] || char).join('').normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove remaining diacritics
    .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens
    .replace(/^-+|-+$/g, ''); // Trim hyphens from ends
}
}),
"[project]/components/ui/button.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-slot/dist/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-rsc] (ecmascript)");
;
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
    variants: {
        variant: {
            default: "bg-primary text-primary-foreground hover:bg-primary/90",
            destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
            outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
            secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            ghost: "hover:bg-accent hover:text-accent-foreground",
            link: "text-primary underline-offset-4 hover:underline"
        },
        size: {
            default: "h-9 px-4 py-2",
            sm: "h-9 rounded-md px-3",
            lg: "h-11 rounded-md px-8",
            icon: "h-9 w-10"
        }
    },
    defaultVariants: {
        variant: "default",
        size: "default"
    }
});
const Button = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["forwardRef"](({ className, variant, size, asChild = false, ...props }, ref)=>{
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Slot"] : "button";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        })),
        ref: ref,
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/button.tsx",
        lineNumber: 46,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
Button.displayName = "Button";
;
}),
"[project]/components/ui/form.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Form",
    ()=>Form,
    "FormControl",
    ()=>FormControl,
    "FormDescription",
    ()=>FormDescription,
    "FormField",
    ()=>FormField,
    "FormItem",
    ()=>FormItem,
    "FormLabel",
    ()=>FormLabel,
    "FormMessage",
    ()=>FormMessage,
    "useFormField",
    ()=>useFormField
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const Form = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call Form() from the server but Form is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/components/ui/form.tsx <module evaluation>", "Form");
const FormControl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call FormControl() from the server but FormControl is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/components/ui/form.tsx <module evaluation>", "FormControl");
const FormDescription = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call FormDescription() from the server but FormDescription is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/components/ui/form.tsx <module evaluation>", "FormDescription");
const FormField = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call FormField() from the server but FormField is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/components/ui/form.tsx <module evaluation>", "FormField");
const FormItem = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call FormItem() from the server but FormItem is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/components/ui/form.tsx <module evaluation>", "FormItem");
const FormLabel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call FormLabel() from the server but FormLabel is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/components/ui/form.tsx <module evaluation>", "FormLabel");
const FormMessage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call FormMessage() from the server but FormMessage is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/components/ui/form.tsx <module evaluation>", "FormMessage");
const useFormField = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call useFormField() from the server but useFormField is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/components/ui/form.tsx <module evaluation>", "useFormField");
}),
"[project]/components/ui/form.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Form",
    ()=>Form,
    "FormControl",
    ()=>FormControl,
    "FormDescription",
    ()=>FormDescription,
    "FormField",
    ()=>FormField,
    "FormItem",
    ()=>FormItem,
    "FormLabel",
    ()=>FormLabel,
    "FormMessage",
    ()=>FormMessage,
    "useFormField",
    ()=>useFormField
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const Form = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call Form() from the server but Form is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/components/ui/form.tsx", "Form");
const FormControl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call FormControl() from the server but FormControl is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/components/ui/form.tsx", "FormControl");
const FormDescription = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call FormDescription() from the server but FormDescription is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/components/ui/form.tsx", "FormDescription");
const FormField = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call FormField() from the server but FormField is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/components/ui/form.tsx", "FormField");
const FormItem = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call FormItem() from the server but FormItem is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/components/ui/form.tsx", "FormItem");
const FormLabel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call FormLabel() from the server but FormLabel is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/components/ui/form.tsx", "FormLabel");
const FormMessage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call FormMessage() from the server but FormMessage is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/components/ui/form.tsx", "FormMessage");
const useFormField = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call useFormField() from the server but useFormField is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/components/ui/form.tsx", "useFormField");
}),
"[project]/components/ui/form.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/components/ui/form.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/components/ui/form.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/components/ui/input.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Input",
    ()=>Input
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-rsc] (ecmascript)");
;
;
;
const Input = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["forwardRef"](({ className, type, ...props }, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
        type: type,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])("flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
        ref: ref,
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/input.tsx",
        lineNumber: 10,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
Input.displayName = "Input";
;
}),
"[project]/features/settings/provinces/form.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProvinceForm",
    ()=>ProvinceForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$react$2d$server$2e$esm$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hook-form/dist/react-server.esm.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$provinces$2f$hooks$2f$use$2d$provinces$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/provinces/hooks/use-provinces.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/form.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/input.tsx [app-rsc] (ecmascript)");
;
;
;
;
;
;
function ProvinceForm({ initialData, onSubmit, onCancel }) {
    const { data: provinces = [] } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$provinces$2f$hooks$2f$use$2d$provinces$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useAllProvinces"])();
    const form = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$react$2d$server$2e$esm$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useForm"])({
        defaultValues: initialData || {
            id: "",
            name: ""
        }
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Form"], {
        ...form,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
            onSubmit: form.handleSubmit(onSubmit),
            className: "space-y-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FormField"], {
                    control: form.control,
                    name: "id",
                    render: ({ field })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FormItem"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FormLabel"], {
                                    children: "Mã Tỉnh thành"
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/provinces/form.tsx",
                                    lineNumber: 38,
                                    columnNumber: 13
                                }, void 0),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FormControl"], {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Input"], {
                                        placeholder: "VD: T000001",
                                        ...field,
                                        value: field.value ?? ''
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/provinces/form.tsx",
                                        lineNumber: 39,
                                        columnNumber: 26
                                    }, void 0)
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/provinces/form.tsx",
                                    lineNumber: 39,
                                    columnNumber: 13
                                }, void 0),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FormMessage"], {}, void 0, false, {
                                    fileName: "[project]/features/settings/provinces/form.tsx",
                                    lineNumber: 40,
                                    columnNumber: 13
                                }, void 0)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/settings/provinces/form.tsx",
                            lineNumber: 37,
                            columnNumber: 11
                        }, void 0)
                }, void 0, false, {
                    fileName: "[project]/features/settings/provinces/form.tsx",
                    lineNumber: 36,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FormField"], {
                    control: form.control,
                    name: "name",
                    render: ({ field })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FormItem"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FormLabel"], {
                                    children: "Tên Tỉnh thành"
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/provinces/form.tsx",
                                    lineNumber: 45,
                                    columnNumber: 13
                                }, void 0),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FormControl"], {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Input"], {
                                        placeholder: "VD: TP. Hồ Chí Minh",
                                        ...field,
                                        value: field.value ?? ''
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/provinces/form.tsx",
                                        lineNumber: 46,
                                        columnNumber: 26
                                    }, void 0)
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/provinces/form.tsx",
                                    lineNumber: 46,
                                    columnNumber: 13
                                }, void 0),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FormMessage"], {}, void 0, false, {
                                    fileName: "[project]/features/settings/provinces/form.tsx",
                                    lineNumber: 47,
                                    columnNumber: 13
                                }, void 0)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/settings/provinces/form.tsx",
                            lineNumber: 44,
                            columnNumber: 11
                        }, void 0)
                }, void 0, false, {
                    fileName: "[project]/features/settings/provinces/form.tsx",
                    lineNumber: 43,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-end space-x-2 pt-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Button"], {
                            type: "button",
                            variant: "outline",
                            onClick: onCancel,
                            children: "Hủy"
                        }, void 0, false, {
                            fileName: "[project]/features/settings/provinces/form.tsx",
                            lineNumber: 51,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Button"], {
                            type: "submit",
                            children: "Lưu"
                        }, void 0, false, {
                            fileName: "[project]/features/settings/provinces/form.tsx",
                            lineNumber: 52,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/settings/provinces/form.tsx",
                    lineNumber: 50,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/features/settings/provinces/form.tsx",
            lineNumber: 35,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/features/settings/provinces/form.tsx",
        lineNumber: 34,
        columnNumber: 5
    }, this);
}
}),
"[project]/features/settings/provinces/ward-form.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WardForm",
    ()=>WardForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$react$2d$server$2e$esm$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hook-form/dist/react-server.esm.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/form.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/input.tsx [app-rsc] (ecmascript)");
;
;
;
;
;
function WardForm({ initialData, onSubmit, onCancel }) {
    const form = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$react$2d$server$2e$esm$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useForm"])({
        defaultValues: initialData || {
            id: "",
            name: ""
        }
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Form"], {
        ...form,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
            onSubmit: form.handleSubmit(onSubmit),
            className: "space-y-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FormField"], {
                    control: form.control,
                    name: "id",
                    render: ({ field })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FormItem"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FormLabel"], {
                                    children: "Mã Phường/Xã"
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/provinces/ward-form.tsx",
                                    lineNumber: 37,
                                    columnNumber: 13
                                }, void 0),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FormControl"], {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Input"], {
                                        placeholder: "VD: 00001",
                                        ...field,
                                        value: field.value ?? ''
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/provinces/ward-form.tsx",
                                        lineNumber: 38,
                                        columnNumber: 26
                                    }, void 0)
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/provinces/ward-form.tsx",
                                    lineNumber: 38,
                                    columnNumber: 13
                                }, void 0),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FormMessage"], {}, void 0, false, {
                                    fileName: "[project]/features/settings/provinces/ward-form.tsx",
                                    lineNumber: 39,
                                    columnNumber: 13
                                }, void 0)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/settings/provinces/ward-form.tsx",
                            lineNumber: 36,
                            columnNumber: 11
                        }, void 0)
                }, void 0, false, {
                    fileName: "[project]/features/settings/provinces/ward-form.tsx",
                    lineNumber: 35,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FormField"], {
                    control: form.control,
                    name: "name",
                    render: ({ field })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FormItem"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FormLabel"], {
                                    children: "Tên Phường/Xã"
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/provinces/ward-form.tsx",
                                    lineNumber: 44,
                                    columnNumber: 13
                                }, void 0),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FormControl"], {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Input"], {
                                        placeholder: "VD: Phường Phúc Xá",
                                        ...field,
                                        value: field.value ?? ''
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/provinces/ward-form.tsx",
                                        lineNumber: 45,
                                        columnNumber: 26
                                    }, void 0)
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/provinces/ward-form.tsx",
                                    lineNumber: 45,
                                    columnNumber: 13
                                }, void 0),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FormMessage"], {}, void 0, false, {
                                    fileName: "[project]/features/settings/provinces/ward-form.tsx",
                                    lineNumber: 46,
                                    columnNumber: 13
                                }, void 0)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/settings/provinces/ward-form.tsx",
                            lineNumber: 43,
                            columnNumber: 11
                        }, void 0)
                }, void 0, false, {
                    fileName: "[project]/features/settings/provinces/ward-form.tsx",
                    lineNumber: 42,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-end space-x-2 pt-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Button"], {
                            type: "button",
                            variant: "outline",
                            onClick: onCancel,
                            children: "Hủy"
                        }, void 0, false, {
                            fileName: "[project]/features/settings/provinces/ward-form.tsx",
                            lineNumber: 50,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Button"], {
                            type: "submit",
                            children: "Lưu"
                        }, void 0, false, {
                            fileName: "[project]/features/settings/provinces/ward-form.tsx",
                            lineNumber: 51,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/settings/provinces/ward-form.tsx",
                    lineNumber: 49,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/features/settings/provinces/ward-form.tsx",
            lineNumber: 34,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/features/settings/provinces/ward-form.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
}),
"[project]/features/settings/provinces/district-form.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DistrictForm",
    ()=>DistrictForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$react$2d$server$2e$esm$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hook-form/dist/react-server.esm.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/input.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/form.tsx [app-rsc] (ecmascript)");
;
;
;
;
;
function DistrictForm({ initialData, provinceId, onSubmit, onCancel }) {
    const form = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$react$2d$server$2e$esm$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useForm"])({
        defaultValues: initialData || {
            id: 0,
            name: '',
            provinceId: provinceId
        }
    });
    const handleSubmit = (data)=>{
        onSubmit({
            ...data,
            provinceId: provinceId
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Form"], {
        ...form,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
            onSubmit: form.handleSubmit(handleSubmit),
            className: "space-y-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FormField"], {
                    control: form.control,
                    name: "id",
                    rules: {
                        required: 'Vui lòng nhập mã'
                    },
                    render: ({ field })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FormItem"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FormLabel"], {
                                    children: "Mã Quận/Huyện"
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/provinces/district-form.tsx",
                                    lineNumber: 54,
                                    columnNumber: 15
                                }, void 0),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FormControl"], {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Input"], {
                                        type: "number",
                                        placeholder: "VD: 760",
                                        ...field,
                                        value: field.value ?? 0,
                                        onChange: (e)=>field.onChange(e.target.valueAsNumber)
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/provinces/district-form.tsx",
                                        lineNumber: 56,
                                        columnNumber: 17
                                    }, void 0)
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/provinces/district-form.tsx",
                                    lineNumber: 55,
                                    columnNumber: 15
                                }, void 0),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FormMessage"], {}, void 0, false, {
                                    fileName: "[project]/features/settings/provinces/district-form.tsx",
                                    lineNumber: 64,
                                    columnNumber: 15
                                }, void 0)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/settings/provinces/district-form.tsx",
                            lineNumber: 53,
                            columnNumber: 13
                        }, void 0)
                }, void 0, false, {
                    fileName: "[project]/features/settings/provinces/district-form.tsx",
                    lineNumber: 48,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FormField"], {
                    control: form.control,
                    name: "name",
                    rules: {
                        required: 'Vui lòng nhập tên'
                    },
                    render: ({ field })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FormItem"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FormLabel"], {
                                    children: "Tên Quận/Huyện"
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/provinces/district-form.tsx",
                                    lineNumber: 75,
                                    columnNumber: 15
                                }, void 0),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FormControl"], {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Input"], {
                                        placeholder: "VD: Quận 1",
                                        ...field,
                                        value: field.value ?? ''
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/provinces/district-form.tsx",
                                        lineNumber: 77,
                                        columnNumber: 17
                                    }, void 0)
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/provinces/district-form.tsx",
                                    lineNumber: 76,
                                    columnNumber: 15
                                }, void 0),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FormMessage"], {}, void 0, false, {
                                    fileName: "[project]/features/settings/provinces/district-form.tsx",
                                    lineNumber: 83,
                                    columnNumber: 15
                                }, void 0)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/settings/provinces/district-form.tsx",
                            lineNumber: 74,
                            columnNumber: 13
                        }, void 0)
                }, void 0, false, {
                    fileName: "[project]/features/settings/provinces/district-form.tsx",
                    lineNumber: 69,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-end gap-2 pt-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Button"], {
                            type: "button",
                            variant: "outline",
                            onClick: onCancel,
                            children: "Hủy"
                        }, void 0, false, {
                            fileName: "[project]/features/settings/provinces/district-form.tsx",
                            lineNumber: 89,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Button"], {
                            type: "submit",
                            children: initialData ? 'Cập nhật' : 'Thêm mới'
                        }, void 0, false, {
                            fileName: "[project]/features/settings/provinces/district-form.tsx",
                            lineNumber: 92,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/settings/provinces/district-form.tsx",
                    lineNumber: 88,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/features/settings/provinces/district-form.tsx",
            lineNumber: 47,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/features/settings/provinces/district-form.tsx",
        lineNumber: 46,
        columnNumber: 5
    }, this);
}
}),
"[project]/lib/smart-prefix.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Smart Prefix System
 * Mapping entity types to their unique prefixes
 */ __turbopack_context__.s([
    "ENTITY_PREFIXES",
    ()=>ENTITY_PREFIXES,
    "getAllEntityTypes",
    ()=>getAllEntityTypes,
    "getEntityTypeFromPrefix",
    ()=>getEntityTypeFromPrefix,
    "getPrefix",
    ()=>getPrefix,
    "isValidEntityType",
    ()=>isValidEntityType
]);
const ENTITY_PREFIXES = {
    // ========================================
    // NHÂN SỰ & TỔ CHỨC (HR & ORGANIZATION)
    // ========================================
    'employees': 'NV',
    'departments': 'PB',
    'branches': 'CN',
    'job-titles': 'CV',
    // ========================================
    // KHÁCH HÀNG & ĐỐI TÁC (CUSTOMERS & PARTNERS)
    // ========================================
    'customers': 'KH',
    'suppliers': 'NCC',
    'shipping-partners': 'DVVC',
    // ========================================
    // SẢN PHẨM & KHO (PRODUCTS & INVENTORY)
    // ========================================
    'products': 'SP',
    'brands': 'TH',
    'categories': 'DM',
    'units': 'DVT',
    'stock-locations': 'KHO',
    'inventory-receipts': 'NK',
    'inventory-checks': 'PKK',
    'stock-transfers': 'PCK',
    'stock-history': 'LS',
    // ========================================
    // BÁN HÀNG (SALES)
    // ========================================
    'orders': 'DH',
    'sales-returns': 'TH',
    'sales-channels': 'KENH',
    'shipments': 'VC',
    // ========================================
    // MUA HÀNG (PURCHASING)
    // ========================================
    'purchase-orders': 'PO',
    'purchase-returns': 'TM',
    // ========================================
    // TÀI CHÍNH (FINANCE)
    // ========================================
    'receipts': 'PT',
    'payments': 'PC',
    'voucher-receipt': 'PT',
    'voucher-payment': 'PC',
    'cashbook': 'SCT',
    'reconciliation': 'DT',
    // Cài đặt tài chính
    'receipt-types': 'LT',
    'payment-types': 'LC',
    'cash-accounts': 'TK',
    'payment-methods': 'PTTT',
    'pricing-settings': 'GIA',
    'taxes': 'TAX',
    // ========================================
    // LƯƠNG & NHÂN SỰ (PAYROLL & HR)
    // ========================================
    'payroll': 'BL',
    'payslips': 'PL',
    'payroll-audit-log': 'PAL',
    'payroll-templates': 'BTP',
    'penalties': 'PF',
    'leaves': 'PN',
    'attendance': 'CC',
    'duty-schedule': 'PC',
    // ========================================
    // KPI & MỤC TIÊU (KPI & TARGETS)
    // ========================================
    'kpi': 'KPI',
    'target-groups': 'NHOM',
    'other-targets': 'MT',
    // ========================================
    // CÔNG VIỆC & DỊCH VỤ (TASKS & SERVICES)
    // ========================================
    'internal-tasks': 'CVNB',
    'task-templates': 'TMPL',
    'custom-fields': 'FIELD',
    'warranty': 'BH',
    'complaints': 'PKN',
    // ========================================
    // CÀI ĐẶT & DANH MỤC (SETTINGS & CATEGORIES)
    // ========================================
    'provinces': 'TP',
    'districts': 'QH',
    'wards': 'PX',
    'wiki': 'TL',
    'packaging': 'DG',
    'audit-log': 'LOG',
    // ========================================
    // CÀI ĐẶT KHÁCH HÀNG (CUSTOMER SETTINGS)
    // ========================================
    'customer-types': 'LKH',
    'customer-groups': 'NHKH',
    'customer-sources': 'NKH',
    'payment-terms': 'HTTT',
    'credit-ratings': 'XHTD',
    'lifecycle-stages': 'GDL',
    'sla-settings': 'SLA',
    // ========================================
    // CÀI ĐẶT NHÂN VIÊN (EMPLOYEE SETTINGS)
    // ========================================
    'employee-types': 'LNV',
    'employee-statuses': 'TTNV',
    'contract-types': 'LHD',
    'work-shifts': 'CA',
    'leave-types': 'LP',
    'salary-components': 'SC',
    // ========================================
    // CÀI ĐẶT KHÁC (OTHER SETTINGS)
    // ========================================
    'settings': 'CFG',
    // ========================================
    // AUTHENTICATION & USERS
    // ========================================
    'users': 'USER',
    // ========================================
    // PKGX INTEGRATION (phukiengiaxuong.com.vn)
    // ========================================
    'pkgx-categories': 'PKGXCAT',
    'pkgx-brands': 'PKGXBRAND',
    'pkgx-category-mappings': 'CATMAP',
    'pkgx-brand-mappings': 'BRANDMAP',
    'pkgx-price-mappings': 'PRICEMAP',
    'pkgx-sync-logs': 'PKGXLOG'
};
function getPrefix(entityType) {
    return ENTITY_PREFIXES[entityType];
}
function getAllEntityTypes() {
    return Object.keys(ENTITY_PREFIXES);
}
function isValidEntityType(entityType) {
    return entityType in ENTITY_PREFIXES;
}
function getEntityTypeFromPrefix(prefix) {
    const entry = Object.entries(ENTITY_PREFIXES).find(([_, p])=>p === prefix);
    return entry ? entry[0] : null;
}
}),
"[project]/lib/id-config.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ID_CONFIG",
    ()=>ID_CONFIG,
    "allowsCustomId",
    ()=>allowsCustomId,
    "createBusinessId",
    ()=>createBusinessId,
    "createSystemId",
    ()=>createSystemId,
    "exportConfig",
    ()=>exportConfig,
    "formatCounterInfo",
    ()=>formatCounterInfo,
    "getCategoryLabel",
    ()=>getCategoryLabel,
    "getEntitiesByCategory",
    ()=>getEntitiesByCategory,
    "getEntityCategories",
    ()=>getEntityCategories,
    "getEntityConfig",
    ()=>getEntityConfig,
    "getIDSystemStats",
    ()=>getIDSystemStats,
    "getStoreFactoryEntities",
    ()=>getStoreFactoryEntities,
    "getTotalEntityCount",
    ()=>getTotalEntityCount,
    "searchEntities",
    ()=>searchEntities,
    "validateIdFormat",
    ()=>validateIdFormat
]);
/**
 * ⚡ ENTERPRISE ID MANAGEMENT SYSTEM v2.0
 * 
 * SINGLE SOURCE OF TRUTH - Synced with smart-prefix.ts
 * 
 * Features:
 * - 60+ entity configurations
 * - TypeScript branded types (SystemId, BusinessId)
 * - Category grouping for UI
 * - Validation rules
 * - Store factory integration
 * - Backward compatibility
 * 
 * @version 2.0.0
 * @date 2025-11-10
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/smart-prefix.ts [app-rsc] (ecmascript)");
;
function createSystemId(id) {
    return id;
}
function createBusinessId(id) {
    return id;
}
function formatCounterInfo(entityType, counters) {
    const config = ID_CONFIG[entityType];
    if (!config) {
        throw new Error(`Unknown entity type: ${entityType}`);
    }
    const currentBusinessCounter = Math.max(0, counters?.business ?? 0);
    const currentSystemCounter = Math.max(0, counters?.system ?? currentBusinessCounter);
    const nextBusinessCounter = currentBusinessCounter + 1;
    const nextSystemCounter = currentSystemCounter + 1;
    const paddedBusiness = String(nextBusinessCounter).padStart(config.digitCount, '0');
    const paddedSystem = String(nextSystemCounter).padStart(config.digitCount, '0');
    return {
        currentBusinessCounter,
        currentSystemCounter,
        nextBusinessId: createBusinessId(`${config.prefix}${paddedBusiness}`),
        nextSystemId: createSystemId(`${config.systemIdPrefix}${paddedSystem}`),
        digitCount: config.digitCount,
        prefix: config.prefix,
        systemIdPrefix: config.systemIdPrefix,
        displayName: config.displayName
    };
}
const ID_CONFIG = {
    // ========================================
    // 👥 HR & ORGANIZATION (NHÂN SỰ)
    // ========================================
    'employees': {
        entityType: 'employees',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['employees'],
        systemIdPrefix: 'EMP',
        digitCount: 6,
        displayName: 'Nhân viên',
        category: 'hr',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'departments': {
        entityType: 'departments',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['departments'],
        systemIdPrefix: 'DEPT',
        digitCount: 6,
        displayName: 'Phòng ban',
        category: 'hr',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'branches': {
        entityType: 'branches',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['branches'],
        systemIdPrefix: 'BRANCH',
        digitCount: 6,
        displayName: 'Chi nhánh',
        category: 'hr',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'job-titles': {
        entityType: 'job-titles',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['job-titles'],
        systemIdPrefix: 'JOB',
        digitCount: 6,
        displayName: 'Chức vụ',
        category: 'hr',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'attendance': {
        entityType: 'attendance',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['attendance'],
        systemIdPrefix: 'ATTEND',
        digitCount: 6,
        displayName: 'Chấm công',
        category: 'hr',
        usesStoreFactory: false
    },
    'duty-schedule': {
        entityType: 'duty-schedule',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['duty-schedule'],
        systemIdPrefix: 'DUTY',
        digitCount: 6,
        displayName: 'Phân công',
        category: 'hr',
        notes: 'Prefix conflict with "payments" (PC)'
    },
    'payroll': {
        entityType: 'payroll',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['payroll'],
        systemIdPrefix: 'PAYROLL',
        digitCount: 6,
        displayName: 'Bảng lương',
        category: 'hr',
        usesStoreFactory: false
    },
    'payslips': {
        entityType: 'payslips',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['payslips'],
        systemIdPrefix: 'PAYSLIP',
        digitCount: 6,
        displayName: 'Phiếu lương',
        category: 'hr',
        usesStoreFactory: false,
        notes: 'Sinh từ payroll batch store'
    },
    'payroll-audit-log': {
        entityType: 'payroll-audit-log',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['payroll-audit-log'],
        systemIdPrefix: 'PAYROLLLOG',
        digitCount: 6,
        displayName: 'Nhật ký payroll',
        category: 'hr',
        usesStoreFactory: false
    },
    'payroll-templates': {
        entityType: 'payroll-templates',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['payroll-templates'],
        systemIdPrefix: 'PAYTPL',
        digitCount: 6,
        displayName: 'Mẫu bảng lương',
        category: 'hr',
        usesStoreFactory: false,
        notes: 'Dùng cho trang template payroll Phase 3'
    },
    'penalties': {
        entityType: 'penalties',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['penalties'],
        systemIdPrefix: 'PENALTY',
        digitCount: 6,
        displayName: 'Phiếu phạt',
        category: 'hr',
        usesStoreFactory: true
    },
    'leaves': {
        entityType: 'leaves',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['leaves'],
        systemIdPrefix: 'LEAVE',
        digitCount: 6,
        displayName: 'Nghỉ phép',
        category: 'hr',
        usesStoreFactory: true
    },
    // ========================================
    // 👤 CUSTOMERS & PARTNERS (KHÁCH HÀNG)
    // ========================================
    'customers': {
        entityType: 'customers',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['customers'],
        systemIdPrefix: 'CUSTOMER',
        digitCount: 6,
        displayName: 'Khách hàng',
        category: 'sales',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'suppliers': {
        entityType: 'suppliers',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['suppliers'],
        systemIdPrefix: 'SUPPLIER',
        digitCount: 6,
        displayName: 'Nhà cung cấp',
        category: 'purchasing',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'shipping-partners': {
        entityType: 'shipping-partners',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['shipping-partners'],
        systemIdPrefix: 'SHIPPING',
        digitCount: 6,
        displayName: 'Đơn vị vận chuyển',
        category: 'settings',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    // ========================================
    // 📦 PRODUCTS & INVENTORY (SẢN PHẨM & KHO)
    // ========================================
    'products': {
        entityType: 'products',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['products'],
        systemIdPrefix: 'PRODUCT',
        digitCount: 6,
        displayName: 'Sản phẩm',
        category: 'inventory',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'brands': {
        entityType: 'brands',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['brands'],
        systemIdPrefix: 'BRAND',
        digitCount: 6,
        displayName: 'Thương hiệu',
        category: 'inventory',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'categories': {
        entityType: 'categories',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['categories'],
        systemIdPrefix: 'CATEGORY',
        digitCount: 6,
        displayName: 'Danh mục',
        category: 'inventory',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'units': {
        entityType: 'units',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['units'],
        systemIdPrefix: 'UNIT',
        digitCount: 6,
        displayName: 'Đơn vị tính',
        category: 'inventory',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'stock-locations': {
        entityType: 'stock-locations',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['stock-locations'],
        systemIdPrefix: 'STOCK',
        digitCount: 6,
        displayName: 'Vị trí kho',
        category: 'inventory',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'inventory-receipts': {
        entityType: 'inventory-receipts',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['inventory-receipts'],
        systemIdPrefix: 'INVRECEIPT',
        digitCount: 6,
        displayName: 'Nhập kho',
        category: 'inventory',
        usesStoreFactory: true
    },
    'inventory-checks': {
        entityType: 'inventory-checks',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['inventory-checks'],
        systemIdPrefix: 'INVCHECK',
        digitCount: 6,
        displayName: 'Phiếu kiểm kho',
        category: 'inventory',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'stock-transfers': {
        entityType: 'stock-transfers',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['stock-transfers'],
        systemIdPrefix: 'TRANSFER',
        digitCount: 6,
        displayName: 'Phiếu chuyển kho',
        category: 'inventory',
        usesStoreFactory: true,
        notes: 'systemId: TRANSFER000001, Business ID: PCK000001'
    },
    'stock-history': {
        entityType: 'stock-history',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['stock-history'],
        systemIdPrefix: 'HISTORY',
        digitCount: 6,
        displayName: 'Lịch sử kho',
        category: 'inventory',
        usesStoreFactory: false
    },
    // ========================================
    // 🛒 SALES (BÁN HÀNG)
    // ========================================
    'orders': {
        entityType: 'orders',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['orders'],
        systemIdPrefix: 'ORDER',
        digitCount: 6,
        displayName: 'Đơn hàng',
        category: 'sales',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'sales-returns': {
        entityType: 'sales-returns',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['sales-returns'],
        systemIdPrefix: 'RETURN',
        digitCount: 6,
        displayName: 'Trả hàng',
        category: 'sales',
        usesStoreFactory: true
    },
    'sales-channels': {
        entityType: 'sales-channels',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['sales-channels'],
        systemIdPrefix: 'CHANNEL',
        digitCount: 6,
        displayName: 'Kênh bán hàng',
        category: 'sales',
        usesStoreFactory: true
    },
    'shipments': {
        entityType: 'shipments',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['shipments'],
        systemIdPrefix: 'SHIPMENT',
        digitCount: 6,
        displayName: 'Vận chuyển',
        category: 'sales',
        usesStoreFactory: false
    },
    // ========================================
    // 🏭 PURCHASING (MUA HÀNG)
    // ========================================
    'purchase-orders': {
        entityType: 'purchase-orders',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['purchase-orders'],
        systemIdPrefix: 'PURCHASE',
        digitCount: 6,
        displayName: 'Đơn mua hàng',
        category: 'purchasing',
        usesStoreFactory: true
    },
    'purchase-returns': {
        entityType: 'purchase-returns',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['purchase-returns'],
        systemIdPrefix: 'PRETURN',
        digitCount: 6,
        displayName: 'Trả hàng NCC',
        category: 'purchasing',
        usesStoreFactory: true
    },
    // ========================================
    // 💰 FINANCE (TÀI CHÍNH)
    // ========================================
    'receipts': {
        entityType: 'receipts',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['receipts'],
        systemIdPrefix: 'RECEIPT',
        digitCount: 6,
        displayName: 'Phiếu thu',
        category: 'finance',
        usesStoreFactory: true
    },
    'payments': {
        entityType: 'payments',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['payments'],
        systemIdPrefix: 'PAYMENT',
        digitCount: 6,
        displayName: 'Phiếu chi',
        category: 'finance',
        usesStoreFactory: true
    },
    'voucher-receipt': {
        entityType: 'voucher-receipt',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['voucher-receipt'],
        systemIdPrefix: 'RECEIPT',
        digitCount: 6,
        displayName: 'Phiếu thu (Voucher)',
        category: 'finance',
        usesStoreFactory: true,
        notes: 'Alias dùng cho các workflow voucher-only hoặc màn hình tổng hợp phiếu thu/chi.'
    },
    'voucher-payment': {
        entityType: 'voucher-payment',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['voucher-payment'],
        systemIdPrefix: 'PAYMENT',
        digitCount: 6,
        displayName: 'Phiếu chi (Voucher)',
        category: 'finance',
        usesStoreFactory: true,
        notes: 'Alias dùng cho các workflow voucher-only hoặc màn hình tổng hợp phiếu thu/chi.'
    },
    'cashbook': {
        entityType: 'cashbook',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['cashbook'],
        systemIdPrefix: 'CASHBOOK',
        digitCount: 6,
        displayName: 'Sổ quỹ tiền mặt',
        category: 'finance',
        usesStoreFactory: false
    },
    'reconciliation': {
        entityType: 'reconciliation',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['reconciliation'],
        systemIdPrefix: 'RECON',
        digitCount: 6,
        displayName: 'Đối chiếu',
        category: 'finance',
        usesStoreFactory: false
    },
    // Finance Settings
    'receipt-types': {
        entityType: 'receipt-types',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['receipt-types'],
        systemIdPrefix: 'RECTYPE',
        digitCount: 6,
        displayName: 'Loại thu',
        category: 'finance',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'payment-types': {
        entityType: 'payment-types',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['payment-types'],
        systemIdPrefix: 'PAYTYPE',
        digitCount: 6,
        displayName: 'Loại chi',
        category: 'finance',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'cash-accounts': {
        entityType: 'cash-accounts',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['cash-accounts'],
        systemIdPrefix: 'ACCOUNT',
        digitCount: 6,
        displayName: 'Tài khoản',
        category: 'finance',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'payment-methods': {
        entityType: 'payment-methods',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['payment-methods'],
        systemIdPrefix: 'METHOD',
        digitCount: 6,
        displayName: 'Phương thức thanh toán',
        category: 'finance',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'pricing-settings': {
        entityType: 'pricing-settings',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['pricing-settings'],
        systemIdPrefix: 'PRICING',
        digitCount: 6,
        displayName: 'Cài đặt giá',
        category: 'settings',
        usesStoreFactory: false
    },
    'taxes': {
        entityType: 'taxes',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['taxes'],
        systemIdPrefix: 'TAX',
        digitCount: 6,
        displayName: 'Thuế',
        category: 'settings',
        usesStoreFactory: true
    },
    // ========================================
    // 🎯 KPI & TARGETS (MỤC TIÊU)
    // ========================================
    'kpi': {
        entityType: 'kpi',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['kpi'],
        systemIdPrefix: 'KPI',
        digitCount: 6,
        displayName: 'KPI',
        category: 'hr',
        usesStoreFactory: false
    },
    'target-groups': {
        entityType: 'target-groups',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['target-groups'],
        systemIdPrefix: 'TARGET',
        digitCount: 6,
        displayName: 'Nhóm mục tiêu',
        category: 'settings',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'other-targets': {
        entityType: 'other-targets',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['other-targets'],
        systemIdPrefix: 'OTHERTARGET',
        digitCount: 6,
        displayName: 'Mục tiêu khác',
        category: 'sales',
        usesStoreFactory: false
    },
    // ========================================
    // CUSTOMER SERVICE (DỊCH VỤ)
    // ========================================
    'internal-tasks': {
        entityType: 'internal-tasks',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['internal-tasks'],
        systemIdPrefix: 'TASK',
        digitCount: 6,
        displayName: 'Công việc nội bộ',
        category: 'system',
        usesStoreFactory: true,
        validation: {
            allowCustomId: true
        }
    },
    'task-templates': {
        entityType: 'task-templates',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['task-templates'],
        systemIdPrefix: 'TMPL',
        digitCount: 6,
        displayName: 'Mẫu công việc',
        category: 'system',
        usesStoreFactory: false
    },
    'custom-fields': {
        entityType: 'custom-fields',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['custom-fields'],
        systemIdPrefix: 'FIELD',
        digitCount: 6,
        displayName: 'Trường tùy chỉnh',
        category: 'settings',
        usesStoreFactory: false
    },
    'warranty': {
        entityType: 'warranty',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['warranty'],
        systemIdPrefix: 'WARRANTY',
        digitCount: 6,
        displayName: 'Bảo hành',
        category: 'service',
        usesStoreFactory: true,
        notes: 'systemId: WARRANTY000001, Business ID: BH000001'
    },
    'complaints': {
        entityType: 'complaints',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['complaints'],
        systemIdPrefix: 'COMPLAINT',
        digitCount: 6,
        displayName: 'Khiếu nại',
        category: 'service',
        usesStoreFactory: true,
        notes: 'systemId: COMPLAINT000001, Business ID: PKN000001'
    },
    // ========================================
    // ⚙️ SETTINGS & CATEGORIES
    // ========================================
    'provinces': {
        entityType: 'provinces',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['provinces'],
        systemIdPrefix: 'PROVINCE',
        digitCount: 6,
        displayName: 'Tỉnh/Thành phố',
        category: 'settings',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'districts': {
        entityType: 'districts',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['districts'],
        systemIdPrefix: 'DISTRICT',
        digitCount: 6,
        displayName: 'Quận/Huyện',
        category: 'settings',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'wards': {
        entityType: 'wards',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['wards'],
        systemIdPrefix: 'WARD',
        digitCount: 6,
        displayName: 'Phường/Xã',
        category: 'settings',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'wiki': {
        entityType: 'wiki',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['wiki'],
        systemIdPrefix: 'WIKI',
        digitCount: 6,
        displayName: 'Tài liệu',
        category: 'system',
        usesStoreFactory: false
    },
    'packaging': {
        entityType: 'packaging',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['packaging'],
        systemIdPrefix: 'PACKAGE',
        digitCount: 6,
        displayName: 'Đóng gói',
        category: 'inventory',
        usesStoreFactory: false
    },
    'audit-log': {
        entityType: 'audit-log',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['audit-log'],
        systemIdPrefix: 'LOG',
        digitCount: 10,
        displayName: 'Nhật ký',
        category: 'system',
        usesStoreFactory: false
    },
    // Customer Settings
    'customer-types': {
        entityType: 'customer-types',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['customer-types'],
        systemIdPrefix: 'CUSTTYPE',
        digitCount: 6,
        displayName: 'Loại khách hàng',
        category: 'settings',
        usesStoreFactory: false
    },
    'customer-groups': {
        entityType: 'customer-groups',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['customer-groups'],
        systemIdPrefix: 'CUSTGROUP',
        digitCount: 6,
        displayName: 'Nhóm khách hàng',
        category: 'settings',
        usesStoreFactory: false
    },
    'customer-sources': {
        entityType: 'customer-sources',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['customer-sources'],
        systemIdPrefix: 'CUSTSOURCE',
        digitCount: 6,
        displayName: 'Nguồn khách hàng',
        category: 'settings',
        usesStoreFactory: false
    },
    'payment-terms': {
        entityType: 'payment-terms',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['payment-terms'],
        systemIdPrefix: 'PAYTERM',
        digitCount: 6,
        displayName: 'Hình thức thanh toán',
        category: 'settings',
        usesStoreFactory: false
    },
    'credit-ratings': {
        entityType: 'credit-ratings',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['credit-ratings'],
        systemIdPrefix: 'CREDIT',
        digitCount: 6,
        displayName: 'Xếp hạng tín dụng',
        category: 'settings',
        usesStoreFactory: false
    },
    'lifecycle-stages': {
        entityType: 'lifecycle-stages',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['lifecycle-stages'],
        systemIdPrefix: 'LIFECYCLE',
        digitCount: 6,
        displayName: 'Giai đoạn vòng đời khách hàng',
        category: 'sales',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'sla-settings': {
        entityType: 'sla-settings',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['sla-settings'],
        systemIdPrefix: 'SLACFG',
        digitCount: 6,
        displayName: 'Cài đặt SLA khách hàng',
        category: 'sales',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    // Employee Settings
    'employee-types': {
        entityType: 'employee-types',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['employee-types'],
        systemIdPrefix: 'EMPTYPE',
        digitCount: 6,
        displayName: 'Loại nhân viên',
        category: 'settings',
        usesStoreFactory: false
    },
    'employee-statuses': {
        entityType: 'employee-statuses',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['employee-statuses'],
        systemIdPrefix: 'EMPSTATUS',
        digitCount: 6,
        displayName: 'Trạng thái nhân viên',
        category: 'settings',
        usesStoreFactory: false
    },
    'contract-types': {
        entityType: 'contract-types',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['contract-types'],
        systemIdPrefix: 'CONTRACT',
        digitCount: 6,
        displayName: 'Loại hợp đồng',
        category: 'settings',
        usesStoreFactory: false
    },
    'work-shifts': {
        entityType: 'work-shifts',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['work-shifts'],
        systemIdPrefix: 'WSHIFT',
        digitCount: 6,
        displayName: 'Ca làm việc',
        category: 'settings',
        usesStoreFactory: false,
        notes: 'Dùng cho cài đặt ca làm việc & Dual ID trong attendance'
    },
    'leave-types': {
        entityType: 'leave-types',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['leave-types'],
        systemIdPrefix: 'LEAVETYPE',
        digitCount: 6,
        displayName: 'Loại nghỉ phép',
        category: 'settings',
        usesStoreFactory: false,
        notes: 'Quản lý danh mục phép năm/phép đặc biệt'
    },
    'salary-components': {
        entityType: 'salary-components',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['salary-components'],
        systemIdPrefix: 'SALCOMP',
        digitCount: 6,
        displayName: 'Thành phần lương',
        category: 'settings',
        usesStoreFactory: false,
        notes: 'Dùng cho cấu hình payroll engine'
    },
    // ========================================
    // 🔐 SYSTEM & AUTH
    // ========================================
    'settings': {
        entityType: 'settings',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['settings'],
        systemIdPrefix: 'CONFIG',
        digitCount: 6,
        displayName: 'Cấu hình',
        category: 'system',
        usesStoreFactory: false
    },
    'users': {
        entityType: 'users',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['users'],
        systemIdPrefix: 'USER',
        digitCount: 6,
        displayName: 'Người dùng',
        category: 'system',
        usesStoreFactory: false
    },
    // ========================================
    // 🌐 PKGX INTEGRATION (phukiengiaxuong.com.vn)
    // ========================================
    'pkgx-categories': {
        entityType: 'pkgx-categories',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['pkgx-categories'],
        systemIdPrefix: 'PKGXCAT',
        digitCount: 6,
        displayName: 'Danh mục PKGX',
        category: 'settings',
        usesStoreFactory: false,
        notes: 'Danh mục từ website phukiengiaxuong.com.vn'
    },
    'pkgx-brands': {
        entityType: 'pkgx-brands',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['pkgx-brands'],
        systemIdPrefix: 'PKGXBRAND',
        digitCount: 6,
        displayName: 'Thương hiệu PKGX',
        category: 'settings',
        usesStoreFactory: false,
        notes: 'Thương hiệu từ website phukiengiaxuong.com.vn'
    },
    'pkgx-category-mappings': {
        entityType: 'pkgx-category-mappings',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['pkgx-category-mappings'],
        systemIdPrefix: 'CATMAP',
        digitCount: 6,
        displayName: 'Mapping danh mục PKGX',
        category: 'settings',
        usesStoreFactory: false,
        notes: 'Mapping danh mục HRM ↔ PKGX'
    },
    'pkgx-brand-mappings': {
        entityType: 'pkgx-brand-mappings',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['pkgx-brand-mappings'],
        systemIdPrefix: 'BRANDMAP',
        digitCount: 6,
        displayName: 'Mapping thương hiệu PKGX',
        category: 'settings',
        usesStoreFactory: false,
        notes: 'Mapping thương hiệu HRM ↔ PKGX'
    },
    'pkgx-price-mappings': {
        entityType: 'pkgx-price-mappings',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['pkgx-price-mappings'],
        systemIdPrefix: 'PRICEMAP',
        digitCount: 6,
        displayName: 'Mapping giá PKGX',
        category: 'settings',
        usesStoreFactory: false,
        notes: 'Mapping bảng giá HRM → PKGX price fields'
    },
    'pkgx-sync-logs': {
        entityType: 'pkgx-sync-logs',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['pkgx-sync-logs'],
        systemIdPrefix: 'PKGXLOG',
        digitCount: 6,
        displayName: 'Log đồng bộ PKGX',
        category: 'system',
        usesStoreFactory: false,
        notes: 'Lưu lịch sử đồng bộ với PKGX'
    }
};
function getEntityConfig(entityType) {
    const config = ID_CONFIG[entityType];
    if (!config) {
        throw new Error(`No configuration found for entity type: ${entityType}`);
    }
    return config;
}
function getEntitiesByCategory(category) {
    return Object.values(ID_CONFIG).filter((config)=>config.category === category).map((config)=>config.entityType);
}
function getEntityCategories() {
    const categories = {
        'hr': [],
        'finance': [],
        'inventory': [],
        'sales': [],
        'purchasing': [],
        'service': [],
        'settings': [],
        'system': []
    };
    Object.values(ID_CONFIG).forEach((config)=>{
        categories[config.category].push(config.entityType);
    });
    return categories;
}
function validateIdFormat(id, entityType) {
    const config = getEntityConfig(entityType);
    // Check prefix
    if (!id.startsWith(config.prefix)) {
        return {
            valid: false,
            error: `Invalid prefix. Expected "${config.prefix}", got "${id.slice(0, config.prefix.length)}"`
        };
    }
    // Check digit count
    const numberPart = id.substring(config.prefix.length);
    if (numberPart.length !== config.digitCount) {
        const expectedLength = config.prefix.length + config.digitCount;
        return {
            valid: false,
            error: `Invalid length. Expected ${expectedLength} characters, got ${id.length}`
        };
    }
    // Check if numeric
    if (!/^\d+$/.test(numberPart)) {
        return {
            valid: false,
            error: 'Numeric part must contain only digits'
        };
    }
    // Custom pattern validation
    if (config.validation?.pattern && !config.validation.pattern.test(id)) {
        return {
            valid: false,
            error: 'ID does not match required pattern'
        };
    }
    return {
        valid: true
    };
}
function allowsCustomId(entityType) {
    return getEntityConfig(entityType).validation?.allowCustomId ?? false;
}
function getStoreFactoryEntities() {
    return Object.values(ID_CONFIG).filter((config)=>config.usesStoreFactory === true).map((config)=>config.entityType);
}
function getCategoryLabel(category) {
    const labels = {
        'hr': 'Nhân sự & Tổ chức',
        'finance': 'Tài chính',
        'inventory': 'Kho hàng',
        'sales': 'Bán hàng',
        'purchasing': 'Mua hàng',
        'service': 'Dịch vụ khách hàng',
        'settings': 'Cài đặt',
        'system': 'Hệ thống'
    };
    return labels[category];
}
function searchEntities(query) {
    const lowerQuery = query.toLowerCase();
    return Object.values(ID_CONFIG).filter((config)=>config.displayName.toLowerCase().includes(lowerQuery) || config.prefix.toLowerCase().includes(lowerQuery) || config.entityType.includes(lowerQuery));
}
function getTotalEntityCount() {
    return Object.keys(ID_CONFIG).length;
}
function exportConfig() {
    return JSON.stringify(ID_CONFIG, null, 2);
}
function getIDSystemStats() {
    const configs = Object.values(ID_CONFIG);
    const byCategory = {};
    let storeFactoryEnabled = 0;
    let customIdAllowed = 0;
    let totalDigits = 0;
    configs.forEach((config)=>{
        // Count by category
        byCategory[config.category] = (byCategory[config.category] || 0) + 1;
        // Count features
        if (config.usesStoreFactory) storeFactoryEnabled++;
        if (config.validation?.allowCustomId) customIdAllowed++;
        totalDigits += config.digitCount;
    });
    return {
        totalEntities: configs.length,
        byCategory,
        storeFactoryEnabled,
        customIdAllowed,
        averageDigitCount: Math.round(totalDigits / configs.length * 10) / 10
    };
}
}),
"[project]/lib/breadcrumb-generator.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearBreadcrumbStores",
    ()=>clearBreadcrumbStores,
    "generateBreadcrumb",
    ()=>generateBreadcrumb,
    "generateDetailBreadcrumb",
    ()=>generateDetailBreadcrumb,
    "generateFormBreadcrumb",
    ()=>generateFormBreadcrumb,
    "getEntityDisplayInfo",
    ()=>getEntityDisplayInfo,
    "getRegisteredStores",
    ()=>getRegisteredStores,
    "registerBreadcrumbStore",
    ()=>registerBreadcrumbStore,
    "useBreadcrumb",
    ()=>useBreadcrumb
]);
/**
 * 🍞 BREADCRUMB AUTO-GENERATION SYSTEM
 * 
 * Automatically generates breadcrumbs from route metadata + entity data
 * 
 * Features:
 * - Auto-lookup entity name from systemId
 * - Falls back to route metadata if entity not found
 * - Type-safe with SystemId branded types
 * - Supports all entity types from id-config.ts
 * 
 * @example
 * ```typescript
 * // Route: /receipts/VOUCHER00000123
 * const crumbs = generateBreadcrumb(location.pathname);
 * // Result: ['Phiếu thu/chi', 'PT000051']
 * ```
 * 
 * @version 1.0.0
 * @date 2025-11-11
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-config.ts [app-rsc] (ecmascript)");
;
let storeRegistry = {};
function registerBreadcrumbStore(entityType, getStore) {
    storeRegistry[entityType] = getStore;
}
/**
 * Find entity by systemId and return display name
 */ function findEntityDisplayName(entityType, systemId) {
    const getStore = storeRegistry[entityType];
    if (!getStore) return null;
    try {
        const store = getStore();
        const item = store.data.find((d)=>d.systemId === systemId);
        if (!item) return null;
        // Priority: name > title > id (business ID) > systemId
        return item.name || item.title || item.id || systemId;
    } catch (error) {
        console.warn(`[Breadcrumb] Failed to lookup ${entityType}:`, error);
        return null;
    }
}
function parseRouteEntity(pathname) {
    // Pattern: /{entity-type}/{systemId}
    const match = pathname.match(/^\/([^/]+)\/([^/]+)$/);
    if (!match) {
        return {
            entityType: null,
            systemId: null,
            displayName: null
        };
    }
    const [, routeType, id] = match;
    // Map route type to entity type
    const routeToEntityMap = {
        'receipts': 'voucher-receipt',
        'payments': 'voucher-payment',
        'employees': 'employees',
        'customers': 'customers',
        'products': 'products',
        'orders': 'orders',
        'suppliers': 'suppliers',
        'complaints': 'complaints',
        'warranty': 'warranty',
        'purchase-orders': 'purchase-orders',
        'sales-returns': 'sales-returns',
        'purchase-returns': 'purchase-returns',
        'inventory-checks': 'inventory-checks'
    };
    const entityType = routeToEntityMap[routeType] || null;
    if (!entityType) {
        return {
            entityType: null,
            systemId: id,
            displayName: null
        };
    }
    // Lookup display name
    const displayName = findEntityDisplayName(entityType, id);
    return {
        entityType,
        systemId: id,
        displayName
    };
}
function generateBreadcrumb(pathname, routeMeta) {
    // If route has static breadcrumb metadata, use it as base
    const baseCrumbs = routeMeta?.breadcrumb || [];
    // Try to enhance with entity data
    const entityInfo = parseRouteEntity(pathname);
    if (entityInfo.displayName) {
        // Replace last breadcrumb with entity display name
        return [
            ...baseCrumbs.slice(0, -1),
            entityInfo.displayName
        ];
    }
    // Fallback to route metadata
    return baseCrumbs;
}
function generateDetailBreadcrumb(entityType, systemId, listPageLabel) {
    const displayName = findEntityDisplayName(entityType, systemId);
    return [
        listPageLabel,
        displayName || systemId
    ];
}
function generateFormBreadcrumb(entityType, systemId, listPageLabel) {
    if (!systemId) {
        return [
            listPageLabel,
            'Thêm mới'
        ];
    }
    const displayName = findEntityDisplayName(entityType, systemId);
    return [
        listPageLabel,
        displayName || 'Chỉnh sửa'
    ];
}
function useBreadcrumb(entityType, systemId, listPageLabel) {
    if (!systemId) {
        return [
            listPageLabel,
            'Thêm mới'
        ];
    }
    return generateDetailBreadcrumb(entityType, systemId, listPageLabel);
}
function getEntityDisplayInfo(entityType) {
    try {
        const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getEntityConfig"])(entityType);
        return {
            displayName: config.displayName,
            prefix: config.prefix,
            category: config.category
        };
    } catch  {
        return null;
    }
}
function clearBreadcrumbStores() {
    storeRegistry = {};
}
function getRegisteredStores() {
    return Object.keys(storeRegistry);
}
}),
"[project]/lib/breadcrumb-system.ts [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "generateBreadcrumb",
    ()=>generateBreadcrumb,
    "generatePageTitle",
    ()=>generatePageTitle
]);
/**
 * Breadcrumb System
 * 
 * Central exports for breadcrumb functionality.
 * Re-exports from breadcrumb-generator.ts with additional types.
 */ // Re-export functions that still make sense
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$breadcrumb$2d$generator$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/breadcrumb-generator.ts [app-rsc] (ecmascript)");
;
function generateBreadcrumb(pathname, context) {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 0) {
        return [
            {
                label: 'Trang chủ',
                href: '/',
                isCurrent: true
            }
        ];
    }
    const breadcrumbs = [
        {
            label: 'Trang chủ',
            href: '/',
            isCurrent: false
        }
    ];
    let currentPath = '';
    segments.forEach((segment, index)=>{
        currentPath += `/${segment}`;
        const isLast = index === segments.length - 1;
        // Get display label for segment
        const label = getSegmentLabel(segment, context, isLast);
        breadcrumbs.push({
            label,
            href: currentPath,
            isCurrent: isLast
        });
    });
    return breadcrumbs;
}
/**
 * Get display label for a route segment
 */ function getSegmentLabel(segment, context, isLast) {
    // Check if context provides entity name
    if (context?.name && isLast) {
        return context.name;
    }
    if (context?.title && isLast) {
        return context.title;
    }
    if (context?.id && isLast) {
        return context.id;
    }
    // Route to label mapping
    const routeLabelMap = {
        // Core
        'dashboard': 'Tổng quan',
        'employees': 'Nhân viên',
        'customers': 'Khách hàng',
        'products': 'Sản phẩm',
        'orders': 'Đơn hàng',
        'suppliers': 'Nhà cung cấp',
        'receipts': 'Phiếu thu',
        'payments': 'Phiếu chi',
        'cashbook': 'Sổ quỹ',
        'purchase-orders': 'Đơn mua hàng',
        'purchase-returns': 'Trả hàng NCC',
        'sales-returns': 'Trả hàng',
        'inventory-receipts': 'Nhập kho',
        'inventory-checks': 'Kiểm kho',
        'stock-transfers': 'Chuyển kho',
        'stock-locations': 'Vị trí kho',
        'stock-history': 'Lịch sử kho',
        'cost-adjustments': 'Điều chỉnh giá vốn',
        // Settings
        'settings': 'Cài đặt',
        'store-info': 'Thông tin cửa hàng',
        'appearance': 'Giao diện',
        'taxes': 'Thuế',
        'pricing': 'Bảng giá',
        'shipping': 'Vận chuyển',
        'inventory': 'Kho hàng',
        'print-templates': 'Mẫu in',
        'employee-roles': 'Phân quyền',
        'workflow-templates': 'Quy trình',
        'id-counters': 'Mã tự động',
        'provinces': 'Tỉnh thành',
        'sales-config': 'Cấu hình bán hàng',
        'system-logs': 'Nhật ký hệ thống',
        'import-export-logs': 'Nhật ký nhập/xuất',
        // Operations
        'warranty': 'Bảo hành',
        'complaints': 'Khiếu nại',
        'tasks': 'Công việc',
        'wiki': 'Wiki',
        'shipments': 'Vận đơn',
        'packaging': 'Đóng gói',
        'attendance': 'Chấm công',
        'leaves': 'Nghỉ phép',
        'payroll': 'Bảng lương',
        // Reports
        'reports': 'Báo cáo',
        // Forms
        'new': 'Thêm mới',
        'edit': 'Chỉnh sửa',
        // Categories
        'categories': 'Danh mục',
        'brands': 'Thương hiệu'
    };
    return routeLabelMap[segment] || segment;
}
function generatePageTitle(pathname, context) {
    const segments = pathname.split('/').filter(Boolean);
    const lastSegment = segments[segments.length - 1];
    const secondLastSegment = segments[segments.length - 2];
    // Check for entity display name in context
    if (context) {
        const displayName = context.name || context.title || context.id;
        if (displayName) {
            // Determine page type
            if (lastSegment === 'edit') {
                return {
                    title: `Chỉnh sửa ${displayName}`
                };
            }
            if (lastSegment === 'new') {
                const entityLabel = getSegmentLabel(secondLastSegment);
                return {
                    title: `Thêm ${entityLabel} mới`
                };
            }
            // Detail page
            return {
                title: displayName
            };
        }
    }
    // Default title from route
    const title = getSegmentLabel(lastSegment, context);
    return {
        title
    };
}
}),
"[project]/contexts/page-header-context.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PageHeaderProvider",
    ()=>PageHeaderProvider,
    "usePageHeader",
    ()=>usePageHeader,
    "usePageHeaderContext",
    ()=>usePageHeaderContext,
    "usePageHeaderDispatch",
    ()=>usePageHeaderDispatch,
    "usePageHeaderState",
    ()=>usePageHeaderState
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$breadcrumb$2d$system$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/breadcrumb-system.ts [app-rsc] (ecmascript) <locals>");
;
;
;
;
const PageHeaderStateContext = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createContext"](null);
const PageHeaderDispatchContext = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createContext"](null);
function PageHeaderProvider({ children }) {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["usePathname"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useRouter"])();
    const [pageHeader, setPageHeaderState] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"]({});
    // Auto-clear on route change (optional - can be disabled)
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useEffect"](()=>{
    // Don't auto-clear, let pages set their own headers
    // setPageHeaderState({});
    }, [
        pathname
    ]);
    const setPageHeader = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useCallback"]((state)=>{
        setPageHeaderState((prev)=>{
            // Auto-generate breadcrumb if not provided
            let breadcrumb = state.breadcrumb;
            if (!breadcrumb) {
                breadcrumb = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$breadcrumb$2d$system$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["generateBreadcrumb"])(pathname, state.context);
            } else {
                // ✨ Transform route metadata breadcrumb format
                // Convert: ['Nhân viên', 'Chi tiết'] or [{ label: 'Nhân viên', href: '/employees' }, 'Chi tiết']
                // To: [{ label: 'Nhân viên', href: '/employees', isCurrent: false }, { label: 'Chi tiết', href: pathname, isCurrent: true }]
                breadcrumb = breadcrumb.map((item, index)=>{
                    if (typeof item === 'string') {
                        return {
                            label: item,
                            href: pathname,
                            isCurrent: index === breadcrumb.length - 1
                        };
                    }
                    return {
                        ...item,
                        isCurrent: index === breadcrumb.length - 1
                    };
                });
            }
            // Auto-generate title if not provided
            let title = state.title;
            if (!title) {
                const pageTitle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$breadcrumb$2d$system$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["generatePageTitle"])(pathname, state.context);
                title = pageTitle.title;
            }
            // Auto back handler if not provided
            let onBack = state.onBack;
            if (!onBack && state.showBackButton !== false) {
                onBack = ()=>{
                    if (state.backPath) {
                        router.push(state.backPath);
                    } else {
                        router.back();
                    }
                };
            }
            // ✅ KHÔNG spread prev để tránh giữ lại state cũ (như badge)
            return {
                ...state,
                breadcrumb,
                title,
                onBack
            };
        });
    }, [
        pathname,
        router
    ]);
    const clearPageHeader = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useCallback"](()=>{
        setPageHeaderState({});
    }, []);
    const dispatchValue = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMemo"](()=>({
            setPageHeader,
            clearPageHeader
        }), [
        setPageHeader,
        clearPageHeader
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(PageHeaderDispatchContext.Provider, {
        value: dispatchValue,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(PageHeaderStateContext.Provider, {
            value: pageHeader,
            children: children
        }, void 0, false, {
            fileName: "[project]/contexts/page-header-context.tsx",
            lineNumber: 123,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/contexts/page-header-context.tsx",
        lineNumber: 122,
        columnNumber: 5
    }, this);
}
function usePageHeaderState() {
    const context = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useContext"](PageHeaderStateContext);
    if (!context) {
        throw new Error('usePageHeaderState must be used within PageHeaderProvider');
    }
    return context;
}
function usePageHeaderDispatch() {
    const context = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useContext"](PageHeaderDispatchContext);
    if (!context) {
        throw new Error('usePageHeaderDispatch must be used within PageHeaderProvider');
    }
    return context;
}
function usePageHeaderContext() {
    const state = usePageHeaderState();
    const dispatch = usePageHeaderDispatch();
    return {
        pageHeader: state,
        ...dispatch
    };
}
function usePageHeader(config) {
    const { setPageHeader, clearPageHeader } = usePageHeaderDispatch();
    const configRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useRef"](config);
    // Update ref without causing re-render
    configRef.current = config;
    // Create a serializable fingerprint of the config
    const configFingerprint = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        const currentConfig = config;
        // Helper to recursively extract text from React elements
        const extractText = (node)=>{
            if (!node) return '';
            if (typeof node === 'string' || typeof node === 'number') return String(node);
            if (Array.isArray(node)) return node.map(extractText).join('');
            if (/*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isValidElement"](node)) {
                return extractText(node.props.children);
            }
            if (typeof node === 'object' && 'props' in node) {
                return extractText(node.props?.children);
            }
            return '';
        };
        const extractTextFromActions = (actions)=>{
            if (!actions) return '';
            const actionsArray = Array.isArray(actions) ? actions : [
                actions
            ];
            return actionsArray.map((node)=>{
                if (!/*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isValidElement"](node)) return extractText(node);
                const props = node.props;
                return `${extractText(node)}|${props.disabled}|${props.hidden}|${node.key}`;
            }).join('||');
        };
        return currentConfig ? JSON.stringify({
            title: typeof currentConfig.title === 'string' ? currentConfig.title : extractText(currentConfig.title),
            subtitle: currentConfig.subtitle,
            showBackButton: currentConfig.showBackButton,
            backPath: currentConfig.backPath,
            actionsText: extractTextFromActions(currentConfig.actions),
            breadcrumb: currentConfig.breadcrumb,
            badgeKey: /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isValidElement"](currentConfig.badge) ? currentConfig.badge.key : undefined,
            context: currentConfig.context,
            docLink: currentConfig.docLink
        }) : 'EMPTY';
    }, [
        config
    ]);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        const currentConfig = configRef.current;
        if (currentConfig) {
            setPageHeader(currentConfig);
        }
    }, [
        configFingerprint,
        setPageHeader
    ]);
    return {
        setPageHeader,
        clearPageHeader
    };
}
}),
"[project]/features/settings/use-settings-page-header.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useSettingsPageHeader",
    ()=>useSettingsPageHeader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2d$2$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings-2.js [app-rsc] (ecmascript) <export default as Settings2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$page$2d$header$2d$context$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/page-header-context.tsx [app-rsc] (ecmascript)");
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
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["usePathname"])();
    const { title, icon, docLink, breadcrumb, ...rest } = options;
    const normalizedDocLink = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMemo"](()=>{
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
    const decoratedTitle = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMemo"](()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "inline-flex items-center gap-2",
            children: [
                icon ?? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2d$2$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings2$3e$__["Settings2"], {
                    className: "h-5 w-5 text-muted-foreground",
                    "aria-hidden": "true"
                }, void 0, false, {
                    fileName: "[project]/features/settings/use-settings-page-header.tsx",
                    lineNumber: 40,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
    const normalizedBreadcrumb = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMemo"](()=>{
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
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$page$2d$header$2d$context$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["usePageHeader"])({
        ...rest,
        breadcrumb: normalizedBreadcrumb,
        title: decoratedTitle,
        docLink: normalizedDocLink
    });
}
}),
"[project]/components/settings/SettingsActionButton.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SettingsActionButton",
    ()=>SettingsActionButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-rsc] (ecmascript)");
;
;
;
;
const SettingsActionButton = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["forwardRef"](({ className, size, children, ...props }, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Button"], {
        ref: ref,
        size: size ?? 'sm',
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])('h-9 px-4 font-medium gap-2', className),
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/components/settings/SettingsActionButton.tsx",
        lineNumber: 12,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
SettingsActionButton.displayName = 'SettingsActionButton';
}),
"[project]/components/ui/card.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Card",
    ()=>Card,
    "CardContent",
    ()=>CardContent,
    "CardDescription",
    ()=>CardDescription,
    "CardFooter",
    ()=>CardFooter,
    "CardHeader",
    ()=>CardHeader,
    "CardTitle",
    ()=>CardTitle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-rsc] (ecmascript)");
;
;
;
const Card = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])("rounded-lg border border-border bg-card text-card-foreground shadow-sm", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 9,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
Card.displayName = "Card";
const CardHeader = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])("flex flex-col space-y-1.5 p-6", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 24,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
CardHeader.displayName = "CardHeader";
const CardTitle = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])("text-h3 font-semibold leading-none tracking-tight", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 36,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
CardTitle.displayName = "CardTitle";
const CardDescription = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])("text-sm text-muted-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 51,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
CardDescription.displayName = "CardDescription";
const CardContent = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])("p-6 pt-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 63,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
CardContent.displayName = "CardContent";
const CardFooter = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])("flex items-center p-6 pt-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 71,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
CardFooter.displayName = "CardFooter";
;
}),
"[project]/components/ui/scroll-area.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ScrollArea",
    ()=>ScrollArea,
    "ScrollBar",
    ()=>ScrollBar
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const ScrollArea = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call ScrollArea() from the server but ScrollArea is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/components/ui/scroll-area.tsx <module evaluation>", "ScrollArea");
const ScrollBar = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call ScrollBar() from the server but ScrollBar is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/components/ui/scroll-area.tsx <module evaluation>", "ScrollBar");
}),
"[project]/components/ui/scroll-area.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ScrollArea",
    ()=>ScrollArea,
    "ScrollBar",
    ()=>ScrollBar
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const ScrollArea = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call ScrollArea() from the server but ScrollArea is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/components/ui/scroll-area.tsx", "ScrollArea");
const ScrollBar = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call ScrollBar() from the server but ScrollBar is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/components/ui/scroll-area.tsx", "ScrollBar");
}),
"[project]/components/ui/scroll-area.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$scroll$2d$area$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/components/ui/scroll-area.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$scroll$2d$area$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/components/ui/scroll-area.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$scroll$2d$area$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/contexts/modal-context.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ModalProvider",
    ()=>ModalProvider,
    "useModal",
    ()=>useModal,
    "useModalContext",
    ()=>useModalContext
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-rsc] (ecmascript)");
;
;
const DEFAULT_Z_INDEX = {
    dialog: 50,
    drawer: 50,
    sheet: 50,
    dropdown: 40,
    popover: 40,
    select: 40,
    custom: 30
};
const BASE_Z_INDEX = 40;
const ModalContext = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createContext"]({
    openModals: [],
    activeModal: null,
    registerModal: ()=>{},
    unregisterModal: ()=>{},
    shouldShowOverlay: false,
    modalMetadata: {},
    getZIndex: ()=>BASE_Z_INDEX,
    isModalActive: ()=>false
});
function ModalProvider({ children }) {
    const [openModals, setOpenModals] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"]([]);
    const [modalMetadata, setModalMetadata] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"]({});
    // Register a new modal with its type and metadata
    const registerModal = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useCallback"]((id, type, metadata)=>{
        setOpenModals((prev)=>{
            if (prev.includes(id)) return prev;
            return [
                ...prev,
                id
            ];
        });
        setModalMetadata((prev)=>({
                ...prev,
                [id]: {
                    type,
                    zIndex: metadata?.zIndex || DEFAULT_Z_INDEX[type],
                    className: metadata?.className
                }
            }));
    }, []);
    // Remove a modal from tracking
    const unregisterModal = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useCallback"]((id)=>{
        setOpenModals((prev)=>prev.filter((modalId)=>modalId !== id));
        setModalMetadata((prev)=>{
            const newMetadata = {
                ...prev
            };
            delete newMetadata[id];
            return newMetadata;
        });
    }, []);
    // The active modal is the last one in the stack
    const activeModal = openModals.length > 0 ? openModals[openModals.length - 1] : null;
    // Show overlay when any modal is open
    const shouldShowOverlay = openModals.length > 0;
    // Calculate z-index for a given modal
    const getZIndex = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useCallback"]((id)=>{
        const metadata = modalMetadata[id];
        if (!metadata) return BASE_Z_INDEX;
        // Base z-index for this type of modal
        const baseZ = metadata.zIndex || DEFAULT_Z_INDEX[metadata.type];
        // Position in the stack (higher = more recently opened)
        const position = openModals.indexOf(id);
        if (position === -1) return baseZ;
        // Add position bonus (more recent modals get higher z-index)
        return baseZ + position;
    }, [
        modalMetadata,
        openModals
    ]);
    // Check if a modal is the active (top) one
    const isModalActive = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useCallback"]((id)=>{
        return id === activeModal;
    }, [
        activeModal
    ]);
    const value = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMemo"](()=>({
            openModals,
            activeModal,
            registerModal,
            unregisterModal,
            shouldShowOverlay,
            modalMetadata,
            getZIndex,
            isModalActive
        }), [
        openModals,
        activeModal,
        registerModal,
        unregisterModal,
        shouldShowOverlay,
        modalMetadata,
        getZIndex,
        isModalActive
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(ModalContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/contexts/modal-context.tsx",
        lineNumber: 132,
        columnNumber: 5
    }, this);
}
function useModal(id, isOpen, type = 'dialog', metadata) {
    const { registerModal, unregisterModal, getZIndex, isModalActive } = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useContext"](ModalContext);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        if (isOpen) {
            registerModal(id, type, metadata);
        } else {
            unregisterModal(id);
        }
        return ()=>{
            unregisterModal(id);
        };
    }, [
        id,
        isOpen,
        type,
        metadata,
        registerModal,
        unregisterModal
    ]);
    const zIndex = getZIndex(id);
    const isActive = isModalActive(id);
    return {
        zIndex,
        isActive
    };
}
function useModalContext() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useContext"](ModalContext);
}
}),
"[project]/components/ui/dialog.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Dialog",
    ()=>Dialog,
    "DialogClose",
    ()=>DialogClose,
    "DialogContent",
    ()=>DialogContent,
    "DialogDescription",
    ()=>DialogDescription,
    "DialogFooter",
    ()=>DialogFooter,
    "DialogHeader",
    ()=>DialogHeader,
    "DialogOverlay",
    ()=>DialogOverlay,
    "DialogPortal",
    ()=>DialogPortal,
    "DialogProvider",
    ()=>DialogProvider,
    "DialogTitle",
    ()=>DialogTitle,
    "DialogTrigger",
    ()=>DialogTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-dialog/dist/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-rsc] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$modal$2d$context$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/modal-context.tsx [app-rsc] (ecmascript)");
;
;
;
;
;
;
// Use the original Dialog component
const Dialog = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Root"];
// Create a Context to pass ID through the Dialog component tree
const DialogContext = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createContext"]("");
// Provider component that accepts an ID
const DialogProvider = ({ id, children })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(DialogContext.Provider, {
        value: id,
        children: children
    }, void 0, false, {
        fileName: "[project]/components/ui/dialog.tsx",
        lineNumber: 16,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
const DialogTrigger = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Trigger"];
const DialogPortal = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Portal"];
const DialogClose = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Close"];
const DialogOverlay = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Overlay"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])("fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dialog.tsx",
        lineNumber: 29,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
DialogOverlay.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Overlay"].displayName;
const DialogContent = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["forwardRef"](({ className, children, id: propId, open, ...props }, ref)=>{
    // Use either the prop id or the id from context
    const contextId = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useContext"](DialogContext);
    const id = propId || contextId || `dialog-${__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useId"]()}`;
    // Register with our modal context using the open prop
    const { zIndex } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$modal$2d$context$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useModal"])(id, !!open, 'dialog');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(DialogPortal, {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(DialogOverlay, {
                style: {
                    zIndex: zIndex - 1
                }
            }, void 0, false, {
                fileName: "[project]/components/ui/dialog.tsx",
                lineNumber: 57,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Content"], {
                ref: ref,
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])("dialog-content fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-border bg-background p-6 shadow-lg sm:rounded-lg", className),
                style: {
                    zIndex
                },
                ...props,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(DialogProvider, {
                    id: id,
                    children: [
                        children,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Close"], {
                            "aria-label": "Đóng",
                            className: "absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    className: "h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/components/ui/dialog.tsx",
                                    lineNumber: 73,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "sr-only",
                                    children: "Đóng"
                                }, void 0, false, {
                                    fileName: "[project]/components/ui/dialog.tsx",
                                    lineNumber: 74,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ui/dialog.tsx",
                            lineNumber: 69,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/ui/dialog.tsx",
                    lineNumber: 67,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/components/ui/dialog.tsx",
                lineNumber: 58,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/dialog.tsx",
        lineNumber: 55,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
});
DialogContent.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Content"].displayName;
const DialogHeader = ({ className, ...props })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])("flex flex-col space-y-1.5 text-center sm:text-left", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dialog.tsx",
        lineNumber: 87,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
DialogHeader.displayName = "DialogHeader";
const DialogFooter = ({ className, ...props })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dialog.tsx",
        lineNumber: 101,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
DialogFooter.displayName = "DialogFooter";
const DialogTitle = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Title"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])("text-lg font-semibold leading-none tracking-tight", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dialog.tsx",
        lineNumber: 115,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
DialogTitle.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Title"].displayName;
const DialogDescription = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Description"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])("text-sm text-muted-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dialog.tsx",
        lineNumber: 130,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
DialogDescription.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Description"].displayName;
;
}),
"[project]/components/ui/alert-dialog.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AlertDialog",
    ()=>AlertDialog,
    "AlertDialogAction",
    ()=>AlertDialogAction,
    "AlertDialogCancel",
    ()=>AlertDialogCancel,
    "AlertDialogContent",
    ()=>AlertDialogContent,
    "AlertDialogDescription",
    ()=>AlertDialogDescription,
    "AlertDialogFooter",
    ()=>AlertDialogFooter,
    "AlertDialogHeader",
    ()=>AlertDialogHeader,
    "AlertDialogOverlay",
    ()=>AlertDialogOverlay,
    "AlertDialogPortal",
    ()=>AlertDialogPortal,
    "AlertDialogTitle",
    ()=>AlertDialogTitle,
    "AlertDialogTrigger",
    ()=>AlertDialogTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-alert-dialog/dist/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-rsc] (ecmascript)");
;
;
;
;
;
const AlertDialog = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Root"];
const AlertDialogTrigger = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Trigger"];
const AlertDialogPortal = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Portal"];
const AlertDialogOverlay = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Overlay"], {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])("fixed inset-0 z-50 bg-black/80 transition-opacity duration-200 opacity-0 data-[state=open]:opacity-100 data-[state=closed]:opacity-0", className),
        ...props,
        ref: ref
    }, void 0, false, {
        fileName: "[project]/components/ui/alert-dialog.tsx",
        lineNumber: 17,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
AlertDialogOverlay.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Overlay"].displayName;
const AlertDialogContent = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(AlertDialogPortal, {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(AlertDialogOverlay, {}, void 0, false, {
                fileName: "[project]/components/ui/alert-dialog.tsx",
                lineNumber: 33,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Content"], {
                ref: ref,
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-border bg-background p-6 shadow-lg transition-opacity duration-200 opacity-0 data-[state=open]:opacity-100 data-[state=closed]:opacity-0 sm:rounded-lg", className),
                ...props
            }, void 0, false, {
                fileName: "[project]/components/ui/alert-dialog.tsx",
                lineNumber: 34,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/alert-dialog.tsx",
        lineNumber: 32,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
AlertDialogContent.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Content"].displayName;
const AlertDialogHeader = ({ className, ...props })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])("flex flex-col space-y-2 text-center sm:text-left", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/alert-dialog.tsx",
        lineNumber: 50,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
AlertDialogHeader.displayName = "AlertDialogHeader";
const AlertDialogFooter = ({ className, ...props })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/alert-dialog.tsx",
        lineNumber: 64,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
AlertDialogFooter.displayName = "AlertDialogFooter";
const AlertDialogTitle = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Title"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])("text-lg font-semibold", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/alert-dialog.tsx",
        lineNumber: 78,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
AlertDialogTitle.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Title"].displayName;
const AlertDialogDescription = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Description"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])("text-sm text-muted-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/alert-dialog.tsx",
        lineNumber: 90,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
AlertDialogDescription.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Description"].displayName;
const AlertDialogAction = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Action"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["buttonVariants"])(), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/alert-dialog.tsx",
        lineNumber: 103,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
AlertDialogAction.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Action"].displayName;
const AlertDialogCancel = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Cancel"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["buttonVariants"])({
            variant: "outline"
        }), "mt-2 sm:mt-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/alert-dialog.tsx",
        lineNumber: 115,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
AlertDialogCancel.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Cancel"].displayName;
;
}),
"[project]/components/ui/tabs.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Tabs",
    ()=>Tabs,
    "TabsContent",
    ()=>TabsContent,
    "TabsList",
    ()=>TabsList,
    "TabsTrigger",
    ()=>TabsTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-tabs/dist/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-rsc] (ecmascript)");
;
;
;
;
const Tabs = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Root"];
const TabsList = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["List"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])("inline-flex h-9 items-center justify-center rounded-md bg-muted p-1", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/tabs.tsx",
        lineNumber: 12,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
TabsList.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["List"].displayName;
const TabsTrigger = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Trigger"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])("inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium text-muted-foreground ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/tabs.tsx",
        lineNumber: 27,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
TabsTrigger.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Trigger"].displayName;
const TabsContent = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Content"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/tabs.tsx",
        lineNumber: 42,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
TabsContent.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Content"].displayName;
;
}),
"[project]/features/settings/provinces/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProvincesPage",
    ()=>ProvincesPage,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/xlsx/xlsx.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/fuse.js/dist/fuse.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$provinces$2f$hooks$2f$use$2d$provinces$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/provinces/hooks/use-provinces.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$provinces$2f$form$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/provinces/form.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$provinces$2f$ward$2d$form$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/provinces/ward-form.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$provinces$2f$district$2d$form$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/provinces/district-form.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$use$2d$settings$2d$page$2d$header$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/use-settings-page-header.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$SettingsActionButton$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/settings/SettingsActionButton.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/card.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/input.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$scroll$2d$area$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/scroll-area.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dialog.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/alert-dialog.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/tabs.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$plus$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__PlusCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-plus.js [app-rsc] (ecmascript) <export default as PlusCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-rsc] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/upload.js [app-rsc] (ecmascript) <export default as Upload>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.js [app-rsc] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/square-pen.js [app-rsc] (ecmascript) <export default as Edit>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-rsc] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$virtual$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-virtual/dist/esm/index.js [app-rsc] (ecmascript) <locals>");
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
function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"](value);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        const handler = setTimeout(()=>{
            setDebouncedValue(value);
        }, delay);
        return ()=>{
            clearTimeout(handler);
        };
    }, [
        value,
        delay
    ]);
    return debouncedValue;
}
const getInitials = (name)=>{
    const fallback = name.slice(0, 2).toUpperCase();
    const parts = name.split(/\s+/).filter(Boolean).slice(0, 2).map((part)=>part[0]?.toUpperCase() ?? "").join("");
    return parts || fallback;
};
const ProvinceItem = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["memo"](function ProvinceItem({ province, isActive, onSelect, onEdit, onDelete, index }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        onClick: ()=>onSelect(province.systemId),
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])("group flex cursor-pointer items-center gap-3 rounded-lg border border-transparent px-3 py-2 transition-colors hover:bg-muted/50", isActive ? "bg-primary/5 border-primary/20" : "hover:border-border/50"),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary",
                children: province.name.slice(0, 2).toUpperCase()
            }, void 0, false, {
                fileName: "[project]/features/settings/provinces/page.tsx",
                lineNumber: 117,
                columnNumber: 8
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-1 flex-col gap-0.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-sm font-medium leading-none",
                        children: province.name
                    }, void 0, false, {
                        fileName: "[project]/features/settings/provinces/page.tsx",
                        lineNumber: 121,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-xs text-muted-foreground",
                        children: [
                            "Mã: ",
                            province.id
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/settings/provinces/page.tsx",
                        lineNumber: 122,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/settings/provinces/page.tsx",
                lineNumber: 120,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Button"], {
                        variant: "ghost",
                        size: "icon",
                        className: "h-8 w-8",
                        onClick: (event)=>{
                            event.stopPropagation();
                            onEdit(province);
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__["Edit"], {
                            className: "h-4 w-4"
                        }, void 0, false, {
                            fileName: "[project]/features/settings/provinces/page.tsx",
                            lineNumber: 134,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/features/settings/provinces/page.tsx",
                        lineNumber: 125,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Button"], {
                        variant: "ghost",
                        size: "icon",
                        className: "h-8 w-8 text-destructive hover:text-destructive",
                        onClick: (event)=>{
                            event.stopPropagation();
                            onDelete(province.systemId);
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                            className: "h-4 w-4"
                        }, void 0, false, {
                            fileName: "[project]/features/settings/provinces/page.tsx",
                            lineNumber: 145,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/features/settings/provinces/page.tsx",
                        lineNumber: 136,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/settings/provinces/page.tsx",
                lineNumber: 124,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/settings/provinces/page.tsx",
        lineNumber: 110,
        columnNumber: 5
    }, this);
});
const DistrictItem = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["memo"](function DistrictItem({ district, isActive, onSelect, onEdit, onDelete }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        onClick: ()=>onSelect(district.id),
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])("group flex cursor-pointer items-center gap-3 rounded-lg border border-transparent px-3 py-2 transition-colors hover:bg-muted/50", isActive ? "bg-primary/5 border-primary/20" : "hover:border-border/50"),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary",
                children: district.name.slice(0, 2).toUpperCase()
            }, void 0, false, {
                fileName: "[project]/features/settings/provinces/page.tsx",
                lineNumber: 175,
                columnNumber: 8
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-1 flex-col gap-0.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-sm font-medium leading-none",
                        children: district.name
                    }, void 0, false, {
                        fileName: "[project]/features/settings/provinces/page.tsx",
                        lineNumber: 179,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-xs text-muted-foreground",
                        children: [
                            "Mã: ",
                            district.id
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/settings/provinces/page.tsx",
                        lineNumber: 180,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/settings/provinces/page.tsx",
                lineNumber: 178,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Button"], {
                        variant: "ghost",
                        size: "icon",
                        className: "h-8 w-8",
                        onClick: (event)=>{
                            event.stopPropagation();
                            onEdit(district);
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__["Edit"], {
                            className: "h-4 w-4"
                        }, void 0, false, {
                            fileName: "[project]/features/settings/provinces/page.tsx",
                            lineNumber: 192,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/features/settings/provinces/page.tsx",
                        lineNumber: 183,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Button"], {
                        variant: "ghost",
                        size: "icon",
                        className: "h-8 w-8 text-destructive hover:text-destructive",
                        onClick: (event)=>{
                            event.stopPropagation();
                            onDelete(district.systemId);
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                            className: "h-4 w-4"
                        }, void 0, false, {
                            fileName: "[project]/features/settings/provinces/page.tsx",
                            lineNumber: 203,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/features/settings/provinces/page.tsx",
                        lineNumber: 194,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/settings/provinces/page.tsx",
                lineNumber: 182,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/settings/provinces/page.tsx",
        lineNumber: 168,
        columnNumber: 5
    }, this);
});
function WardList({ wards, onEdit, onDelete }) {
    const parentRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useRef"](null);
    const rowVirtualizer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$virtual$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useVirtualizer"])({
        count: wards.length,
        getScrollElement: ()=>parentRef.current,
        estimateSize: ()=>60,
        overscan: 5
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: parentRef,
        className: "h-full w-full overflow-auto",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: "100%",
                position: "relative"
            },
            children: rowVirtualizer.getVirtualItems().map((virtualItem)=>{
                const ward = wards[virtualItem.index];
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: `${virtualItem.size}px`,
                        transform: `translateY(${virtualItem.start}px)`
                    },
                    className: "flex items-center justify-between border-b border-border px-4 hover:bg-muted/50 group",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col justify-center h-full",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-medium text-sm",
                                    children: ward.name
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/provinces/page.tsx",
                                    lineNumber: 251,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xs text-muted-foreground font-mono",
                                    children: ward.id
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/provinces/page.tsx",
                                    lineNumber: 252,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/settings/provinces/page.tsx",
                            lineNumber: 250,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "ghost",
                                    size: "icon",
                                    className: "h-8 w-8",
                                    onClick: ()=>onEdit(ward),
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__["Edit"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/provinces/page.tsx",
                                        lineNumber: 261,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/provinces/page.tsx",
                                    lineNumber: 255,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "ghost",
                                    size: "icon",
                                    className: "h-8 w-8 text-destructive hover:text-destructive",
                                    onClick: ()=>onDelete(ward.systemId),
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/provinces/page.tsx",
                                        lineNumber: 269,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/provinces/page.tsx",
                                    lineNumber: 263,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/settings/provinces/page.tsx",
                            lineNumber: 254,
                            columnNumber: 15
                        }, this)
                    ]
                }, virtualItem.key, true, {
                    fileName: "[project]/features/settings/provinces/page.tsx",
                    lineNumber: 238,
                    columnNumber: 13
                }, this);
            })
        }, void 0, false, {
            fileName: "[project]/features/settings/provinces/page.tsx",
            lineNumber: 228,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/features/settings/provinces/page.tsx",
        lineNumber: 227,
        columnNumber: 5
    }, this);
}
function ProvincesPage() {
    // React Query hooks for data fetching
    const { data: provincesData } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$provinces$2f$hooks$2f$use$2d$provinces$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useAllProvinces"])();
    const provinces = provincesData || [];
    // Mutations
    const provinceMutations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$provinces$2f$hooks$2f$use$2d$provinces$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useProvinceMutations"])();
    const districtMutations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$provinces$2f$hooks$2f$use$2d$provinces$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useDistrictMutations"])();
    const wardMutations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$provinces$2f$hooks$2f$use$2d$provinces$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useWardMutations"])();
    const importMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$provinces$2f$hooks$2f$use$2d$provinces$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useAdministrativeImportMutation"])();
    const [importPreview, setImportPreview] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"](null);
    const [isImportDialogOpen, setIsImportDialogOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"](false);
    const [isImporting, setIsImporting] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"](false);
    const [mode, setMode] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"]("3-level");
    const importInputRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useRef"](null);
    const [selectedProvinceId, setSelectedProvinceId] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"](provinces[0]?.systemId ?? null);
    const [selectedDistrictId, setSelectedDistrictId] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"](null);
    const [provinceSearchInput, setProvinceSearchInput] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"]("");
    const [districtSearchInput, setDistrictSearchInput] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"]("");
    const [wardSearchInput, setWardSearchInput] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"]("");
    const provinceSearch = useDebounce(provinceSearchInput, 300);
    const districtSearch = useDebounce(districtSearchInput, 300);
    const wardSearch = useDebounce(wardSearchInput, 300);
    const [isProvinceFormOpen, setIsProvinceFormOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"](false);
    const [editingProvince, setEditingProvince] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"](null);
    const [isWardFormOpen, setIsWardFormOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"](false);
    const [editingWard, setEditingWard] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"](null);
    const [isDistrictFormOpen, setIsDistrictFormOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"](false);
    const [editingDistrict, setEditingDistrict] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"](null);
    const [dialogState, setDialogState] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"](null);
    const selectedProvince = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMemo"](()=>provinces.find((province)=>province.systemId === selectedProvinceId) ?? null, [
        provinces,
        selectedProvinceId
    ]);
    // Fetch districts for selected province (3-level mode)
    const { data: districtsData } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$provinces$2f$hooks$2f$use$2d$provinces$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useDistrictsByProvince"])(mode === "3-level" && selectedProvince ? selectedProvince.id : undefined);
    const districtsForProvince = districtsData || [];
    // Fetch wards based on mode
    const { data: wards2LevelData } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$provinces$2f$hooks$2f$use$2d$provinces$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useWardsByProvince"])(mode === "2-level" && selectedProvince ? selectedProvince.id : undefined);
    const { data: wards3LevelData } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$provinces$2f$hooks$2f$use$2d$provinces$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useWardsByDistrict"])(mode === "3-level" && selectedDistrictId ? selectedDistrictId : undefined);
    const wardsForSelectedProvince = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        if (!selectedProvince) return [];
        if (mode === "2-level") {
            return (wards2LevelData || []).filter((w)=>w.level === "2-level");
        }
        if (selectedDistrictId) {
            return (wards3LevelData || []).filter((w)=>w.level === "3-level");
        }
        return [];
    }, [
        mode,
        selectedProvince,
        selectedDistrictId,
        wards2LevelData,
        wards3LevelData
    ]);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        if (!provinces.length) {
            if (selectedProvinceId !== null) {
                setSelectedProvinceId(null);
            }
            return;
        }
        const exists = provinces.some((province)=>province.systemId === selectedProvinceId);
        if (!exists) {
            setSelectedProvinceId(provinces[0]?.systemId ?? null);
        }
    }, [
        provinces,
        selectedProvinceId
    ]);
    const provinceFuse = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMemo"](()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"](provinces, {
            keys: [
                "name",
                "id"
            ],
            threshold: 0.3
        }), [
        provinces
    ]);
    const filteredProvinces = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMemo"](()=>provinceSearch ? provinceFuse.search(provinceSearch).map((result)=>result.item) : provinces, [
        provinceFuse,
        provinceSearch,
        provinces
    ]);
    const orderedProvinces = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        return [
            ...filteredProvinces
        ].sort((a, b)=>a.name.localeCompare(b.name));
    }, [
        filteredProvinces
    ]);
    const districtFuse = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMemo"](()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"](districtsForProvince, {
            keys: [
                "name"
            ],
            threshold: 0.3
        }), [
        districtsForProvince
    ]);
    const filteredDistricts = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMemo"](()=>districtSearch ? districtFuse.search(districtSearch).map((result)=>result.item) : districtsForProvince, [
        districtFuse,
        districtSearch,
        districtsForProvince
    ]);
    const wardFuse = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMemo"](()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"](wardsForSelectedProvince, {
            keys: [
                "name",
                "id"
            ],
            threshold: 0.3
        }), [
        wardsForSelectedProvince
    ]);
    const filteredWards = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMemo"](()=>wardSearch ? wardFuse.search(wardSearch).map((result)=>result.item) : wardsForSelectedProvince, [
        wardFuse,
        wardSearch,
        wardsForSelectedProvince
    ]);
    const handleAddProvince = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useCallback"](()=>{
        setEditingProvince(null);
        setIsProvinceFormOpen(true);
    }, [
        setEditingProvince,
        setIsProvinceFormOpen
    ]);
    const handleEditProvince = (province)=>{
        setEditingProvince(province);
        setIsProvinceFormOpen(true);
    };
    const handleDeleteProvince = (systemId)=>setDialogState({
            type: "province",
            systemId
        });
    const handleProvinceFormSubmit = (values)=>{
        if (editingProvince) {
            provinceMutations.update.mutate({
                systemId: editingProvince.systemId,
                data: {
                    ...editingProvince,
                    ...values
                }
            });
        } else {
            provinceMutations.add.mutate(values);
        }
        setIsProvinceFormOpen(false);
    };
    const handleAddWard = ()=>{
        setEditingWard(null);
        setIsWardFormOpen(true);
    };
    const handleEditWard = (ward)=>{
        setEditingWard(ward);
        setIsWardFormOpen(true);
    };
    const handleDeleteWard = (systemId)=>setDialogState({
            type: "ward",
            systemId
        });
    const handleWardFormSubmit = (values)=>{
        if (!selectedProvince) return;
        const finalValues = {
            ...values,
            provinceId: selectedProvince.id
        };
        if (editingWard) {
            wardMutations.update.mutate({
                systemId: editingWard.systemId,
                data: {
                    ...editingWard,
                    ...finalValues
                }
            });
        } else {
            wardMutations.add.mutate(finalValues);
        }
        setIsWardFormOpen(false);
    };
    const handleAddDistrict = ()=>{
        setEditingDistrict(null);
        setIsDistrictFormOpen(true);
    };
    const handleEditDistrict = (district)=>{
        setEditingDistrict(district);
        setIsDistrictFormOpen(true);
    };
    const handleDeleteDistrict = (systemId)=>setDialogState({
            type: "district",
            systemId
        });
    const handleDistrictFormSubmit = (values)=>{
        if (!selectedProvince) return;
        const finalValues = {
            ...values,
            provinceId: selectedProvince.id
        };
        if (editingDistrict) {
            districtMutations.update.mutate({
                systemId: editingDistrict.systemId,
                data: {
                    ...editingDistrict,
                    ...finalValues
                }
            });
        } else {
            districtMutations.add.mutate(finalValues);
        }
        setIsDistrictFormOpen(false);
    };
    const confirmDelete = ()=>{
        if (!dialogState) return;
        if (dialogState.type === "province") {
            if (dialogState.systemId === selectedProvinceId) {
                const fallback = provinces.find((province)=>province.systemId !== dialogState.systemId);
                setSelectedProvinceId(fallback?.systemId ?? null);
                setSelectedDistrictId(null);
            }
            provinceMutations.remove.mutate(dialogState.systemId);
        } else if (dialogState.type === "ward") {
            wardMutations.remove.mutate(dialogState.systemId);
        } else if (dialogState.type === "district") {
            const district = districtsForProvince.find((d)=>d.systemId === dialogState.systemId);
            if (district && district.id === selectedDistrictId) {
                setSelectedDistrictId(null);
            }
            districtMutations.remove.mutate(dialogState.systemId);
        }
        setDialogState(null);
    };
    const handleImport = (event)=>{
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (loadEvent)=>{
            try {
                const data = loadEvent.target?.result;
                const workbook = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["read"](data, {
                    type: "binary"
                });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["utils"].sheet_to_json(worksheet);
                const provincesMap = new Map();
                const wards = [];
                json.forEach((row)=>{
                    const rawProvinceId = row["Mã tỉnh (BNV)"] ?? row["Ma Tinh"];
                    const provinceName = row["Tên tỉnh/TP mới"] ?? row["Ten tinh"];
                    const wardCode = row["Mã phường/xã mới"] ?? row["Ma phuong/xa"];
                    const wardName = row["Tên Phường/Xã mới"] ?? row["Ten Phuong/Xa"];
                    if (!rawProvinceId || !provinceName || !wardCode || !wardName) {
                        return;
                    }
                    const provinceId = String(rawProvinceId).padStart(2, "0");
                    if (!provincesMap.has(provinceId)) {
                        provincesMap.set(provinceId, {
                            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["asBusinessId"])(provinceId),
                            name: String(provinceName).trim()
                        });
                    }
                    wards.push({
                        id: String(wardCode).trim(),
                        name: String(wardName).trim(),
                        provinceId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["asBusinessId"])(provinceId),
                        provinceName: String(provinceName).trim()
                    });
                });
                if (provincesMap.size === 0 || wards.length === 0) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].error('Không tìm thấy dữ liệu hợp lệ', {
                        description: 'Vui lòng kiểm tra lại định dạng file Excel.'
                    });
                    return;
                }
                setImportPreview({
                    provinces: Array.from(provincesMap.values()),
                    wards,
                    summary: {
                        provinceCount: provincesMap.size,
                        wardCount: wards.length
                    }
                });
                setIsImportDialogOpen(true);
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].error('Lỗi khi đọc file', {
                    description: error instanceof Error ? error.message : 'File không hợp lệ'
                });
            }
        };
        reader.readAsBinaryString(file);
        event.target.value = "";
    };
    const handleImportDialogChange = (open)=>{
        if (!open) {
            if (isImporting) return;
            setIsImportDialogOpen(false);
            setImportPreview(null);
            return;
        }
        setIsImportDialogOpen(true);
    };
    const handleConfirmImport = async ()=>{
        if (!importPreview) return;
        setIsImporting(true);
        try {
            await importMutation.mutateAsync({
                provinces: importPreview.provinces,
                wards: importPreview.wards
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].success('Đã nhập dữ liệu hành chính', {
                description: `Ghi đè ${importPreview.summary.provinceCount.toLocaleString("vi-VN")} tỉnh/thành và ${importPreview.summary.wardCount.toLocaleString("vi-VN")} phường/xã (2 cấp).`
            });
            setIsImportDialogOpen(false);
            setImportPreview(null);
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].error('Không thể ghi dữ liệu', {
                description: error instanceof Error ? error.message : 'Vui lòng thử lại sau.'
            });
        } finally{
            setIsImporting(false);
        }
    };
    // Fetch wards for export - using sample province "08" (Hà Nội usually)
    const { data: exportWardsData } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$provinces$2f$hooks$2f$use$2d$provinces$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useWardsByProvince"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["asBusinessId"])("08"));
    const wards2LevelForExport = (exportWardsData || []).filter((w)=>w.level === "2-level");
    const handleExport = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useCallback"](()=>{
        const provincesToExport = provinces.map(({ systemId, ...rest })=>({
                "Mã tỉnh": rest.id,
                "Tên Tỉnh/Thành phố": rest.name
            }));
        const wardsToExport = wards2LevelForExport.map(({ systemId, ...rest })=>({
                "Mã tỉnh": rest.provinceId,
                "Mã Phường/Xã": rest.id,
                "Tên Phường/Xã": rest.name
            }));
        const provincesWs = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["utils"].json_to_sheet(provincesToExport);
        const wardsWs = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["utils"].json_to_sheet(wardsToExport);
        const wb = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["utils"].book_new();
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["utils"].book_append_sheet(wb, provincesWs, "TinhThanh");
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["utils"].book_append_sheet(wb, wardsWs, "PhuongXa");
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["writeFile"](wb, "Danh_sach_Don_vi_hanh_chinh.xlsx");
    }, [
        provinces,
        wards2LevelForExport
    ]);
    const handleImportButtonClick = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useCallback"](()=>{
        importInputRef.current?.click();
    }, [
        importInputRef
    ]);
    const headerActions = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMemo"](()=>[
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$SettingsActionButton$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SettingsActionButton"], {
                variant: "outline",
                onClick: handleImportButtonClick,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                        className: "h-4 w-4"
                    }, void 0, false, {
                        fileName: "[project]/features/settings/provinces/page.tsx",
                        lineNumber: 605,
                        columnNumber: 9
                    }, this),
                    "Nhập file"
                ]
            }, "import", true, {
                fileName: "[project]/features/settings/provinces/page.tsx",
                lineNumber: 604,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$SettingsActionButton$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SettingsActionButton"], {
                variant: "outline",
                onClick: handleExport,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                        className: "h-4 w-4"
                    }, void 0, false, {
                        fileName: "[project]/features/settings/provinces/page.tsx",
                        lineNumber: 609,
                        columnNumber: 9
                    }, this),
                    "Xuất file"
                ]
            }, "export", true, {
                fileName: "[project]/features/settings/provinces/page.tsx",
                lineNumber: 608,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$SettingsActionButton$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SettingsActionButton"], {
                onClick: handleAddProvince,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$plus$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__PlusCircle$3e$__["PlusCircle"], {
                        className: "h-4 w-4"
                    }, void 0, false, {
                        fileName: "[project]/features/settings/provinces/page.tsx",
                        lineNumber: 613,
                        columnNumber: 9
                    }, this),
                    "Thêm tỉnh thành"
                ]
            }, "add", true, {
                fileName: "[project]/features/settings/provinces/page.tsx",
                lineNumber: 612,
                columnNumber: 7
            }, this)
        ], [
        handleImportButtonClick,
        handleExport,
        handleAddProvince
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$use$2d$settings$2d$page$2d$header$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useSettingsPageHeader"])({
        title: "Tỉnh thành - Quận huyện",
        actions: headerActions
    });
    const handleSelectProvince = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useCallback"]((systemId)=>{
        setSelectedProvinceId(systemId);
        setSelectedDistrictId(null);
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex h-full flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                ref: importInputRef,
                type: "file",
                className: "hidden",
                accept: ".xlsx, .xls",
                onChange: handleImport
            }, void 0, false, {
                fileName: "[project]/features/settings/provinces/page.tsx",
                lineNumber: 632,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-4 flex flex-shrink-0 items-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Tabs"], {
                    value: mode,
                    onValueChange: (value)=>{
                        setMode(value);
                        setSelectedDistrictId(null);
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TabsList"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TabsTrigger"], {
                                value: "2-level",
                                children: "2 cấp (Tỉnh → Phường) - 3,321 wards"
                            }, void 0, false, {
                                fileName: "[project]/features/settings/provinces/page.tsx",
                                lineNumber: 649,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TabsTrigger"], {
                                value: "3-level",
                                children: "3 cấp (Tỉnh → Quận → Phường) - 10,035 wards"
                            }, void 0, false, {
                                fileName: "[project]/features/settings/provinces/page.tsx",
                                lineNumber: 650,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/settings/provinces/page.tsx",
                        lineNumber: 648,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/features/settings/provinces/page.tsx",
                    lineNumber: 641,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/settings/provinces/page.tsx",
                lineNumber: 640,
                columnNumber: 7
            }, this),
            mode === "2-level" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex min-h-0 flex-grow gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Card"], {
                        className: "flex w-1/3 flex-col",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardHeader"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardTitle"], {
                                                children: "Tỉnh/Thành phố"
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/provinces/page.tsx",
                                                lineNumber: 660,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Button"], {
                                                    size: "icon",
                                                    variant: "ghost",
                                                    className: "h-8 w-8",
                                                    onClick: handleAddProvince,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$plus$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__PlusCircle$3e$__["PlusCircle"], {
                                                        className: "h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/settings/provinces/page.tsx",
                                                        lineNumber: 663,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/provinces/page.tsx",
                                                    lineNumber: 662,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/provinces/page.tsx",
                                                lineNumber: 661,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/settings/provinces/page.tsx",
                                        lineNumber: 659,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative pt-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                className: "pointer-events-none absolute left-2.5 top-[18px] h-4 w-4 text-muted-foreground"
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/provinces/page.tsx",
                                                lineNumber: 668,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Input"], {
                                                placeholder: "Tìm kiếm...",
                                                className: "h-9 pl-8",
                                                value: provinceSearchInput,
                                                onChange: (event)=>setProvinceSearchInput(event.target.value)
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/provinces/page.tsx",
                                                lineNumber: 669,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/settings/provinces/page.tsx",
                                        lineNumber: 667,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/settings/provinces/page.tsx",
                                lineNumber: 658,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardContent"], {
                                className: "flex-grow overflow-hidden p-2",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$scroll$2d$area$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ScrollArea"], {
                                    className: "h-full",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-2 pb-2",
                                        children: orderedProvinces.map((province, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(ProvinceItem, {
                                                province: province,
                                                index: index,
                                                isActive: selectedProvinceId === province.systemId,
                                                onSelect: handleSelectProvince,
                                                onEdit: handleEditProvince,
                                                onDelete: handleDeleteProvince
                                            }, province.systemId, false, {
                                                fileName: "[project]/features/settings/provinces/page.tsx",
                                                lineNumber: 681,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/provinces/page.tsx",
                                        lineNumber: 679,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/provinces/page.tsx",
                                    lineNumber: 678,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/features/settings/provinces/page.tsx",
                                lineNumber: 677,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/settings/provinces/page.tsx",
                        lineNumber: 657,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex w-2/3 flex-col",
                        children: selectedProvince ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Card"], {
                            className: "flex flex-grow flex-col",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardHeader"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardTitle"], {
                                                            children: selectedProvince.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/settings/provinces/page.tsx",
                                                            lineNumber: 702,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardDescription"], {
                                                            children: [
                                                                "Mã: ",
                                                                selectedProvince.id,
                                                                " • ",
                                                                filteredWards.length,
                                                                " phường/xã (2 cấp)"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/features/settings/provinces/page.tsx",
                                                            lineNumber: 703,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/settings/provinces/page.tsx",
                                                    lineNumber: 701,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Button"], {
                                                    size: "sm",
                                                    onClick: handleAddWard,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$plus$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__PlusCircle$3e$__["PlusCircle"], {
                                                            className: "mr-2 h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/settings/provinces/page.tsx",
                                                            lineNumber: 708,
                                                            columnNumber: 23
                                                        }, this),
                                                        " Thêm phường/xã"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/settings/provinces/page.tsx",
                                                    lineNumber: 707,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/settings/provinces/page.tsx",
                                            lineNumber: 700,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative pt-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                    className: "pointer-events-none absolute left-2.5 top-[18px] h-4 w-4 text-muted-foreground"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/provinces/page.tsx",
                                                    lineNumber: 712,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Input"], {
                                                    placeholder: "Tìm phường/xã...",
                                                    className: "h-9 pl-8",
                                                    value: wardSearchInput,
                                                    onChange: (event)=>setWardSearchInput(event.target.value)
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/provinces/page.tsx",
                                                    lineNumber: 713,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/settings/provinces/page.tsx",
                                            lineNumber: 711,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/settings/provinces/page.tsx",
                                    lineNumber: 699,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardContent"], {
                                    className: "flex flex-grow flex-col p-0",
                                    children: filteredWards.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1 h-full overflow-hidden",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(WardList, {
                                            wards: filteredWards,
                                            onEdit: handleEditWard,
                                            onDelete: handleDeleteWard
                                        }, void 0, false, {
                                            fileName: "[project]/features/settings/provinces/page.tsx",
                                            lineNumber: 724,
                                            columnNumber: 23
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/provinces/page.tsx",
                                        lineNumber: 723,
                                        columnNumber: 21
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex h-full flex-col items-center justify-center gap-2 p-4 text-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "font-medium text-muted-foreground",
                                                children: "Chưa có phường/xã"
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/provinces/page.tsx",
                                                lineNumber: 732,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-muted-foreground",
                                                children: "Thêm phường/xã mới cho tỉnh/thành này."
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/provinces/page.tsx",
                                                lineNumber: 733,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Button"], {
                                                size: "sm",
                                                onClick: handleAddWard,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$plus$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__PlusCircle$3e$__["PlusCircle"], {
                                                        className: "mr-2 h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/settings/provinces/page.tsx",
                                                        lineNumber: 735,
                                                        columnNumber: 25
                                                    }, this),
                                                    " Thêm phường/xã"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/settings/provinces/page.tsx",
                                                lineNumber: 734,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/settings/provinces/page.tsx",
                                        lineNumber: 731,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/provinces/page.tsx",
                                    lineNumber: 721,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/settings/provinces/page.tsx",
                            lineNumber: 698,
                            columnNumber: 15
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Card"], {
                            className: "flex h-full items-center justify-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center text-muted-foreground",
                                children: "Chọn một Tỉnh/Thành phố để xem chi tiết."
                            }, void 0, false, {
                                fileName: "[project]/features/settings/provinces/page.tsx",
                                lineNumber: 743,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/features/settings/provinces/page.tsx",
                            lineNumber: 742,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/features/settings/provinces/page.tsx",
                        lineNumber: 696,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/settings/provinces/page.tsx",
                lineNumber: 656,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex min-h-0 flex-grow gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Card"], {
                        className: "flex w-1/4 flex-col",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardHeader"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardTitle"], {
                                                children: "Tỉnh/TP"
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/provinces/page.tsx",
                                                lineNumber: 753,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Button"], {
                                                    size: "icon",
                                                    variant: "ghost",
                                                    className: "h-8 w-8",
                                                    onClick: handleAddProvince,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$plus$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__PlusCircle$3e$__["PlusCircle"], {
                                                        className: "h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/settings/provinces/page.tsx",
                                                        lineNumber: 756,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/provinces/page.tsx",
                                                    lineNumber: 755,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/provinces/page.tsx",
                                                lineNumber: 754,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/settings/provinces/page.tsx",
                                        lineNumber: 752,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative pt-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                className: "pointer-events-none absolute left-2.5 top-[18px] h-4 w-4 text-muted-foreground"
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/provinces/page.tsx",
                                                lineNumber: 761,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Input"], {
                                                placeholder: "Tìm...",
                                                className: "h-9 pl-8",
                                                value: provinceSearchInput,
                                                onChange: (event)=>setProvinceSearchInput(event.target.value)
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/provinces/page.tsx",
                                                lineNumber: 762,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/settings/provinces/page.tsx",
                                        lineNumber: 760,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/settings/provinces/page.tsx",
                                lineNumber: 751,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardContent"], {
                                className: "flex-grow overflow-hidden p-2",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$scroll$2d$area$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ScrollArea"], {
                                    className: "h-full",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-2 pb-2",
                                        children: orderedProvinces.map((province, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(ProvinceItem, {
                                                province: province,
                                                index: index,
                                                isActive: selectedProvinceId === province.systemId,
                                                onSelect: handleSelectProvince,
                                                onEdit: handleEditProvince,
                                                onDelete: handleDeleteProvince
                                            }, province.systemId, false, {
                                                fileName: "[project]/features/settings/provinces/page.tsx",
                                                lineNumber: 774,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/provinces/page.tsx",
                                        lineNumber: 772,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/provinces/page.tsx",
                                    lineNumber: 771,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/features/settings/provinces/page.tsx",
                                lineNumber: 770,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/settings/provinces/page.tsx",
                        lineNumber: 750,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Card"], {
                        className: "flex w-1/4 flex-col",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardHeader"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardTitle"], {
                                                className: "text-base",
                                                children: "Quận/Huyện"
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/provinces/page.tsx",
                                                lineNumber: 792,
                                                columnNumber: 17
                                            }, this),
                                            selectedProvince ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Button"], {
                                                size: "icon",
                                                variant: "ghost",
                                                className: "h-8 w-8",
                                                onClick: handleAddDistrict,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$plus$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__PlusCircle$3e$__["PlusCircle"], {
                                                    className: "h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/provinces/page.tsx",
                                                    lineNumber: 795,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/provinces/page.tsx",
                                                lineNumber: 794,
                                                columnNumber: 19
                                            }, this) : null
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/settings/provinces/page.tsx",
                                        lineNumber: 791,
                                        columnNumber: 15
                                    }, this),
                                    selectedProvince ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative pt-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                className: "pointer-events-none absolute left-2.5 top-[18px] h-4 w-4 text-muted-foreground"
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/provinces/page.tsx",
                                                lineNumber: 801,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Input"], {
                                                placeholder: "Tìm quận/huyện...",
                                                className: "h-9 pl-8",
                                                value: districtSearchInput,
                                                onChange: (event)=>setDistrictSearchInput(event.target.value)
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/provinces/page.tsx",
                                                lineNumber: 802,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/settings/provinces/page.tsx",
                                        lineNumber: 800,
                                        columnNumber: 17
                                    }, this) : null
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/settings/provinces/page.tsx",
                                lineNumber: 790,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardContent"], {
                                className: "flex-grow overflow-hidden p-2",
                                children: selectedProvince ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$scroll$2d$area$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ScrollArea"], {
                                        className: "h-full",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-2 pb-2",
                                            children: filteredDistricts.map((district)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(DistrictItem, {
                                                    district: district,
                                                    isActive: selectedDistrictId === district.id,
                                                    onSelect: setSelectedDistrictId,
                                                    onEdit: handleEditDistrict,
                                                    onDelete: handleDeleteDistrict
                                                }, district.systemId, false, {
                                                    fileName: "[project]/features/settings/provinces/page.tsx",
                                                    lineNumber: 817,
                                                    columnNumber: 25
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/features/settings/provinces/page.tsx",
                                            lineNumber: 815,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/provinces/page.tsx",
                                        lineNumber: 814,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex h-full items-center justify-center text-sm text-muted-foreground",
                                    children: "Chọn tỉnh/TP trước"
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/provinces/page.tsx",
                                    lineNumber: 830,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/features/settings/provinces/page.tsx",
                                lineNumber: 811,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/settings/provinces/page.tsx",
                        lineNumber: 789,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Card"], {
                        className: "flex flex-1 flex-col",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardHeader"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardTitle"], {
                                                        className: "text-base",
                                                        children: "Phường/Xã"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/settings/provinces/page.tsx",
                                                        lineNumber: 841,
                                                        columnNumber: 19
                                                    }, this),
                                                    selectedDistrictId ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardDescription"], {
                                                        className: "mt-1 text-xs text-muted-foreground",
                                                        children: [
                                                            districtsForProvince.find((district)=>district.id === selectedDistrictId)?.name,
                                                            " • ",
                                                            filteredWards.length,
                                                            " phường/xã"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/features/settings/provinces/page.tsx",
                                                        lineNumber: 843,
                                                        columnNumber: 21
                                                    }, this) : null
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/settings/provinces/page.tsx",
                                                lineNumber: 840,
                                                columnNumber: 17
                                            }, this),
                                            selectedDistrictId ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Button"], {
                                                size: "sm",
                                                onClick: handleAddWard,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$plus$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__PlusCircle$3e$__["PlusCircle"], {
                                                        className: "mr-2 h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/settings/provinces/page.tsx",
                                                        lineNumber: 850,
                                                        columnNumber: 21
                                                    }, this),
                                                    " Thêm"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/settings/provinces/page.tsx",
                                                lineNumber: 849,
                                                columnNumber: 19
                                            }, this) : null
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/settings/provinces/page.tsx",
                                        lineNumber: 839,
                                        columnNumber: 15
                                    }, this),
                                    selectedDistrictId ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative pt-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                className: "pointer-events-none absolute left-2.5 top-[18px] h-4 w-4 text-muted-foreground"
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/provinces/page.tsx",
                                                lineNumber: 856,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Input"], {
                                                placeholder: "Tìm phường/xã...",
                                                className: "h-9 pl-8",
                                                value: wardSearchInput,
                                                onChange: (event)=>setWardSearchInput(event.target.value)
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/provinces/page.tsx",
                                                lineNumber: 857,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/settings/provinces/page.tsx",
                                        lineNumber: 855,
                                        columnNumber: 17
                                    }, this) : null
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/settings/provinces/page.tsx",
                                lineNumber: 838,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardContent"], {
                                className: "flex flex-1 flex-col p-0",
                                children: selectedDistrictId ? filteredWards.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1 h-full overflow-hidden",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(WardList, {
                                        wards: filteredWards,
                                        onEdit: handleEditWard,
                                        onDelete: handleDeleteWard
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/provinces/page.tsx",
                                        lineNumber: 870,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/provinces/page.tsx",
                                    lineNumber: 869,
                                    columnNumber: 19
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex h-full flex-col items-center justify-center gap-2 p-4 text-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "font-medium text-muted-foreground",
                                            children: "Chưa có phường/xã"
                                        }, void 0, false, {
                                            fileName: "[project]/features/settings/provinces/page.tsx",
                                            lineNumber: 878,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-muted-foreground",
                                            children: "Thêm phường/xã mới cho quận/huyện này."
                                        }, void 0, false, {
                                            fileName: "[project]/features/settings/provinces/page.tsx",
                                            lineNumber: 879,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Button"], {
                                            size: "sm",
                                            onClick: handleAddWard,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$plus$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__PlusCircle$3e$__["PlusCircle"], {
                                                    className: "mr-2 h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/provinces/page.tsx",
                                                    lineNumber: 881,
                                                    columnNumber: 23
                                                }, this),
                                                " Thêm phường/xã"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/settings/provinces/page.tsx",
                                            lineNumber: 880,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/settings/provinces/page.tsx",
                                    lineNumber: 877,
                                    columnNumber: 19
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex h-full items-center justify-center text-muted-foreground",
                                    children: "Chọn quận/huyện để xem phường/xã"
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/provinces/page.tsx",
                                    lineNumber: 886,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/features/settings/provinces/page.tsx",
                                lineNumber: 866,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/settings/provinces/page.tsx",
                        lineNumber: 837,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/settings/provinces/page.tsx",
                lineNumber: 749,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Dialog"], {
                open: isProvinceFormOpen,
                onOpenChange: setIsProvinceFormOpen,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DialogContent"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DialogHeader"], {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DialogTitle"], {
                                children: editingProvince ? "Chỉnh sửa Tỉnh thành" : "Thêm Tỉnh thành mới"
                            }, void 0, false, {
                                fileName: "[project]/features/settings/provinces/page.tsx",
                                lineNumber: 898,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/features/settings/provinces/page.tsx",
                            lineNumber: 897,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$provinces$2f$form$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ProvinceForm"], {
                            initialData: editingProvince,
                            onSubmit: handleProvinceFormSubmit,
                            onCancel: ()=>setIsProvinceFormOpen(false)
                        }, void 0, false, {
                            fileName: "[project]/features/settings/provinces/page.tsx",
                            lineNumber: 900,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/settings/provinces/page.tsx",
                    lineNumber: 896,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/settings/provinces/page.tsx",
                lineNumber: 895,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Dialog"], {
                open: isWardFormOpen,
                onOpenChange: setIsWardFormOpen,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DialogContent"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DialogHeader"], {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DialogTitle"], {
                                children: editingWard ? "Chỉnh sửa Phường/Xã" : "Thêm Phường/Xã mới"
                            }, void 0, false, {
                                fileName: "[project]/features/settings/provinces/page.tsx",
                                lineNumber: 911,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/features/settings/provinces/page.tsx",
                            lineNumber: 910,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$provinces$2f$ward$2d$form$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["WardForm"], {
                            initialData: editingWard,
                            onSubmit: handleWardFormSubmit,
                            onCancel: ()=>setIsWardFormOpen(false)
                        }, void 0, false, {
                            fileName: "[project]/features/settings/provinces/page.tsx",
                            lineNumber: 913,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/settings/provinces/page.tsx",
                    lineNumber: 909,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/settings/provinces/page.tsx",
                lineNumber: 908,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Dialog"], {
                open: isDistrictFormOpen,
                onOpenChange: setIsDistrictFormOpen,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DialogContent"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DialogHeader"], {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DialogTitle"], {
                                children: editingDistrict ? "Chỉnh sửa Quận/Huyện" : "Thêm Quận/Huyện mới"
                            }, void 0, false, {
                                fileName: "[project]/features/settings/provinces/page.tsx",
                                lineNumber: 924,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/features/settings/provinces/page.tsx",
                            lineNumber: 923,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$provinces$2f$district$2d$form$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DistrictForm"], {
                            initialData: editingDistrict,
                            provinceId: selectedProvince?.id ?? "",
                            onSubmit: handleDistrictFormSubmit,
                            onCancel: ()=>setIsDistrictFormOpen(false)
                        }, void 0, false, {
                            fileName: "[project]/features/settings/provinces/page.tsx",
                            lineNumber: 926,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/settings/provinces/page.tsx",
                    lineNumber: 922,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/settings/provinces/page.tsx",
                lineNumber: 921,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AlertDialog"], {
                open: !!dialogState,
                onOpenChange: ()=>setDialogState(null),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AlertDialogContent"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AlertDialogHeader"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AlertDialogTitle"], {
                                    children: "Bạn có chắc chắn muốn xóa?"
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/provinces/page.tsx",
                                    lineNumber: 938,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AlertDialogDescription"], {
                                    children: dialogState?.type === "province" ? "Hành động này sẽ xóa Tỉnh/Thành phố và tất cả Phường/Xã liên quan. Hành động này không thể được hoàn tác." : dialogState?.type === "district" ? "Hành động này sẽ xóa Quận/Huyện và tất cả Phường/Xã liên quan. Hành động này không thể được hoàn tác." : "Hành động này sẽ xóa Phường/Xã. Hành động này không thể được hoàn tác."
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/provinces/page.tsx",
                                    lineNumber: 939,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/settings/provinces/page.tsx",
                            lineNumber: 937,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AlertDialogFooter"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AlertDialogCancel"], {
                                    children: "Hủy"
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/provinces/page.tsx",
                                    lineNumber: 948,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AlertDialogAction"], {
                                    onClick: confirmDelete,
                                    children: "Tiếp tục"
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/provinces/page.tsx",
                                    lineNumber: 949,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/settings/provinces/page.tsx",
                            lineNumber: 947,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/settings/provinces/page.tsx",
                    lineNumber: 936,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/settings/provinces/page.tsx",
                lineNumber: 935,
                columnNumber: 7
            }, this),
            importPreview ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Dialog"], {
                open: isImportDialogOpen,
                onOpenChange: handleImportDialogChange,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DialogContent"], {
                    className: "sm:max-w-2xl",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DialogHeader"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DialogTitle"], {
                                    children: "Xác nhận ghi đè dữ liệu địa giới"
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/provinces/page.tsx",
                                    lineNumber: 958,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DialogDescription"], {
                                    children: "File mới sẽ thay thế toàn bộ danh sách tỉnh/thành và phường/xã (2 cấp). Dữ liệu quận/huyện và phường/xã 3 cấp được giữ nguyên."
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/provinces/page.tsx",
                                    lineNumber: 959,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/settings/provinces/page.tsx",
                            lineNumber: 957,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "rounded-md border border-dashed bg-muted/40 p-4 text-sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "font-medium",
                                            children: "Tóm tắt"
                                        }, void 0, false, {
                                            fileName: "[project]/features/settings/provinces/page.tsx",
                                            lineNumber: 966,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                            className: "mt-2 space-y-1 text-muted-foreground",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: [
                                                        "• ",
                                                        importPreview.summary.provinceCount.toLocaleString("vi-VN"),
                                                        " tỉnh/thành phố mới"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/settings/provinces/page.tsx",
                                                    lineNumber: 968,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: [
                                                        "• ",
                                                        importPreview.summary.wardCount.toLocaleString("vi-VN"),
                                                        " phường/xã (2 cấp)"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/settings/provinces/page.tsx",
                                                    lineNumber: 969,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: "• Ghi đè toàn bộ dữ liệu hiện có cho cấp tỉnh và phường/xã 2 cấp"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/provinces/page.tsx",
                                                    lineNumber: 970,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/settings/provinces/page.tsx",
                                            lineNumber: 967,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/settings/provinces/page.tsx",
                                    lineNumber: 965,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid gap-4 md:grid-cols-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "rounded-md border border-border p-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm font-medium",
                                                    children: "Danh sách tỉnh/thành"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/provinces/page.tsx",
                                                    lineNumber: 976,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$scroll$2d$area$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ScrollArea"], {
                                                    className: "mt-2 h-40",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                        className: "divide-y text-sm",
                                                        children: importPreview.provinces.slice(0, 12).map((province)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                className: "flex items-center justify-between py-1.5",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: province.name
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/features/settings/provinces/page.tsx",
                                                                        lineNumber: 981,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "font-mono text-xs text-muted-foreground",
                                                                        children: province.id
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/features/settings/provinces/page.tsx",
                                                                        lineNumber: 982,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, province.id, true, {
                                                                fileName: "[project]/features/settings/provinces/page.tsx",
                                                                lineNumber: 980,
                                                                columnNumber: 25
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/settings/provinces/page.tsx",
                                                        lineNumber: 978,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/provinces/page.tsx",
                                                    lineNumber: 977,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "mt-2 text-xs text-muted-foreground",
                                                    children: [
                                                        "Hiển thị tối đa 12 / ",
                                                        importPreview.summary.provinceCount.toLocaleString("vi-VN"),
                                                        " tỉnh/thành."
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/settings/provinces/page.tsx",
                                                    lineNumber: 987,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/settings/provinces/page.tsx",
                                            lineNumber: 975,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "rounded-md border border-border p-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm font-medium",
                                                    children: "Một số phường/xã (2 cấp)"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/provinces/page.tsx",
                                                    lineNumber: 993,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$scroll$2d$area$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ScrollArea"], {
                                                    className: "mt-2 h-40",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                        className: "divide-y text-sm",
                                                        children: importPreview.wards.slice(0, 12).map((ward, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                className: "py-1.5",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center justify-between",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                children: ward.name
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/features/settings/provinces/page.tsx",
                                                                                lineNumber: 999,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "font-mono text-xs text-muted-foreground",
                                                                                children: ward.id
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/features/settings/provinces/page.tsx",
                                                                                lineNumber: 1000,
                                                                                columnNumber: 29
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/features/settings/provinces/page.tsx",
                                                                        lineNumber: 998,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-xs text-muted-foreground",
                                                                        children: [
                                                                            "Thuộc tỉnh: ",
                                                                            ward.provinceName
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/features/settings/provinces/page.tsx",
                                                                        lineNumber: 1002,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, `${ward.provinceId}-${ward.id}-${index}`, true, {
                                                                fileName: "[project]/features/settings/provinces/page.tsx",
                                                                lineNumber: 997,
                                                                columnNumber: 25
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/settings/provinces/page.tsx",
                                                        lineNumber: 995,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/provinces/page.tsx",
                                                    lineNumber: 994,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "mt-2 text-xs text-muted-foreground",
                                                    children: [
                                                        "Hiển thị tối đa 12 / ",
                                                        importPreview.summary.wardCount.toLocaleString("vi-VN"),
                                                        " phường/xã."
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/settings/provinces/page.tsx",
                                                    lineNumber: 1007,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/settings/provinces/page.tsx",
                                            lineNumber: 992,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/settings/provinces/page.tsx",
                                    lineNumber: 974,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/settings/provinces/page.tsx",
                            lineNumber: 964,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DialogFooter"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Button"], {
                                    type: "button",
                                    variant: "outline",
                                    className: "h-9",
                                    onClick: ()=>handleImportDialogChange(false),
                                    disabled: isImporting,
                                    children: "Hủy"
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/provinces/page.tsx",
                                    lineNumber: 1015,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Button"], {
                                    type: "button",
                                    className: "h-9",
                                    onClick: handleConfirmImport,
                                    disabled: isImporting,
                                    children: isImporting ? "Đang ghi dữ liệu..." : "Xác nhận nhập file"
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/provinces/page.tsx",
                                    lineNumber: 1018,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/settings/provinces/page.tsx",
                            lineNumber: 1014,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/settings/provinces/page.tsx",
                    lineNumber: 956,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/settings/provinces/page.tsx",
                lineNumber: 955,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/features/settings/provinces/page.tsx",
        lineNumber: 631,
        columnNumber: 5
    }, this);
}
const __TURBOPACK__default__export__ = ProvincesPage;
}),
"[project]/features/settings/provinces/page.tsx [app-rsc] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/features/settings/provinces/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=_95c1c05a._.js.map