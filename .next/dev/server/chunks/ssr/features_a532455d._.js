module.exports = [
"[project]/features/products/store.ts [app-ssr] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.resolve().then(() => {
        return parentImport("[project]/features/products/store.ts [app-ssr] (ecmascript)");
    });
});
}),
"[project]/features/stock-history/store.ts [app-ssr] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/ssr/features_stock-history_store_ts_81d37d7e._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/features/stock-history/store.ts [app-ssr] (ecmascript)");
    });
});
}),
];