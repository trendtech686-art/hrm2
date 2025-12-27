module.exports = [
"[project]/features/settings/shipping/integrations/ghtk-service.ts [app-ssr] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.resolve().then(() => {
        return parentImport("[project]/features/settings/shipping/integrations/ghtk-service.ts [app-ssr] (ecmascript)");
    });
});
}),
"[project]/lib/utils/get-shipping-credentials.ts [app-ssr] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.resolve().then(() => {
        return parentImport("[project]/lib/utils/get-shipping-credentials.ts [app-ssr] (ecmascript)");
    });
});
}),
"[project]/lib/ghtk-sync-service.ts [app-ssr] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/ssr/features_orders_store_ts_974f700b._.js",
  "server/chunks/ssr/lib_ghtk-sync-service_ts_047d8035._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/lib/ghtk-sync-service.ts [app-ssr] (ecmascript)");
    });
});
}),
];