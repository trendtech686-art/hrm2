module.exports = [
"[project]/features/products/store.ts [app-ssr] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/ssr/features_products_9a7dba76._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/features/products/store.ts [app-ssr] (ecmascript)");
    });
});
}),
"[project]/features/stock-history/store.ts [app-ssr] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/ssr/features_stock-history_e8bb9e4c._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/features/stock-history/store.ts [app-ssr] (ecmascript)");
    });
});
}),
];