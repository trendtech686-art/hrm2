module.exports = [
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
];

//# sourceMappingURL=features_stock-history_store_ts_81d37d7e._.js.map