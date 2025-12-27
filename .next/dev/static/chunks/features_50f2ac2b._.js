(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/features/products/store.ts [app-client] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.resolve().then(() => {
        return parentImport("[project]/features/products/store.ts [app-client] (ecmascript)");
    });
});
}),
"[project]/features/stock-history/store.ts [app-client] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "static/chunks/features_stock-history_store_ts_d23c76b6._.js",
  "static/chunks/features_stock-history_store_ts_b032a806._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/features/stock-history/store.ts [app-client] (ecmascript)");
    });
});
}),
]);