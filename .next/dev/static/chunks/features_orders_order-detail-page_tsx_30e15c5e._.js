(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/features/orders/order-detail-page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OrderDetailPage",
    ()=>OrderDetailPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hook-form/dist/index.esm.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$hooks$2f$use$2d$all$2d$orders$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/orders/hooks/use-all-orders.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$hooks$2f$use$2d$order$2d$mutations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/orders/hooks/use-order-mutations.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$hooks$2f$use$2d$order$2d$actions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/orders/hooks/use-order-actions.ts [app-client] (ecmascript)");
// ⚠️ Still needed for complex order action methods (cancelOrder, addPayment, packaging, shipment, etc.)
// TODO: Migrate these to API endpoints and React Query mutations
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/orders/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$address$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/orders/address-utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/table.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$separator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/separator.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$hooks$2f$use$2d$all$2d$customers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/customers/hooks/use-all-customers.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$hooks$2f$use$2d$all$2d$customer$2d$settings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/customers/hooks/use-all-customer-settings.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-client] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/printer.js [app-client] (ecmascript) <export default as Printer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/copy.js [app-client] (ecmascript) <export default as Copy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-client] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$warning$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileWarning$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-warning.js [app-client] (ecmascript) <export default as FileWarning>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/package.js [app-client] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/info.js [app-client] (ecmascript) <export default as Info>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-client] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sticky$2d$note$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__StickyNote$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sticky-note.js [app-client] (ecmascript) <export default as StickyNote>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$down$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowDownLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-down-left.js [app-client] (ecmascript) <export default as ArrowDownLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$hooks$2f$use$2d$all$2d$employees$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/employees/hooks/use-all-employees.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/alert-dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/alert.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/form.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/label.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/checkbox.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/select.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$currency$2d$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/currency-input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$detail$2d$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/detail-field.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$image$2d$preview$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/image-preview-dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/textarea.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$hooks$2f$use$2d$all$2d$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/products/hooks/use-all-products.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$components$2f$product$2d$image$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/products/components/product-image.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$hooks$2f$use$2d$all$2d$warranties$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/hooks/use-all-warranties.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$hooks$2f$use$2d$all$2d$complaints$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/complaints/hooks/use-all-complaints.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$spinner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/spinner.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$page$2d$header$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/page-header-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$payments$2f$hooks$2f$use$2d$all$2d$payment$2d$methods$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/payments/hooks/use-all-payment-methods.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$combobox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/combobox.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$components$2f$packaging$2d$info$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/orders/components/packaging-info.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$components$2f$cancel$2d$shipment$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/orders/components/cancel-shipment-dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$components$2f$cancel$2d$packaging$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/orders/components/cancel-packaging-dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$components$2f$delivery$2d$failure$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/orders/components/delivery-failure-dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$components$2f$payment$2d$info$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/orders/components/payment-info.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$components$2f$shipping$2d$tracking$2d$tab$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/orders/components/shipping-tracking-tab.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$collapsible$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/collapsible.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$sales$2d$returns$2f$hooks$2f$use$2d$all$2d$sales$2d$returns$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/sales-returns/hooks/use-all-sales-returns.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$receipts$2f$hooks$2f$use$2d$all$2d$receipts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/receipts/hooks/use-all-receipts.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$payments$2f$hooks$2f$use$2d$all$2d$payments$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/payments/hooks/use-all-payments.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$components$2f$shipping$2d$integration$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/features/orders/components/shipping-integration.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$components$2f$order$2d$workflow$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/orders/components/order-workflow-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$workflow$2d$templates$2d$page$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/features/settings/printer/workflow-templates-page.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$workflow$2d$templates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__getWorkflowTemplatesSync__as__getWorkflowTemplates$3e$__ = __turbopack_context__.i("[project]/hooks/use-workflow-templates.ts [app-client] (ecmascript) <export getWorkflowTemplatesSync as getWorkflowTemplates>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ActivityHistory$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ActivityHistory.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DatabaseComments$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/DatabaseComments.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$inventory$2f$hooks$2f$use$2d$all$2d$product$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/inventory/hooks/use-all-product-types.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pricing$2f$hooks$2f$use$2d$all$2d$pricing$2d$policies$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/features/settings/pricing/hooks/use-all-pricing-policies.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$sla$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/customers/sla/hooks.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$read$2d$only$2d$products$2d$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/shared/read-only-products-table.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$components$2f$order$2d$print$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/orders/components/order-print-button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$hooks$2f$use$2d$all$2d$branches$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/branches/hooks/use-all-branches.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$branding$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/use-branding.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$sales$2d$return$2e$mapper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-mappers/sales-return.mapper.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$payment$2e$mapper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-mappers/payment.mapper.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$store$2d$info$2f$hooks$2f$use$2d$store$2d$info$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/store-info/hooks/use-store-info.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$print$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/use-print.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-service.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature(), _s6 = __turbopack_context__.k.signature();
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
// Component hiển thị ảnh sản phẩm với preview - sử dụng server image priority
// Nhận product trực tiếp từ parent để tránh re-call useProductStore trong mỗi row
const ProductThumbnailCell = ({ productSystemId, product, productName, size = 'md', onPreview })=>{
    _s();
    const imageUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$components$2f$product$2d$image$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductImage"])(productSystemId, product);
    const sizeClasses = size === 'sm' ? 'w-10 h-9' : 'w-12 h-10';
    const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-4 w-4';
    if (imageUrl) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `group/thumbnail relative ${sizeClasses} rounded border overflow-hidden bg-muted ${onPreview ? 'cursor-pointer' : ''}`,
            onClick: ()=>onPreview?.(imageUrl, productName),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                    src: imageUrl,
                    alt: productName,
                    className: "w-full h-full object-cover transition-all group-hover/thumbnail:brightness-75"
                }, void 0, false, {
                    fileName: "[project]/features/orders/order-detail-page.tsx",
                    lineNumber: 120,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                onPreview && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute inset-0 flex items-center justify-center opacity-0 group-hover/thumbnail:opacity-100 transition-opacity",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                        className: "w-4 h-4 text-white drop-shadow-md"
                    }, void 0, false, {
                        fileName: "[project]/features/orders/order-detail-page.tsx",
                        lineNumber: 123,
                        columnNumber: 25
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/features/orders/order-detail-page.tsx",
                    lineNumber: 122,
                    columnNumber: 21
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/features/orders/order-detail-page.tsx",
            lineNumber: 116,
            columnNumber: 13
        }, ("TURBOPACK compile-time value", void 0));
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `${sizeClasses} bg-muted rounded flex items-center justify-center`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
            className: `${iconSize} text-muted-foreground`
        }, void 0, false, {
            fileName: "[project]/features/orders/order-detail-page.tsx",
            lineNumber: 132,
            columnNumber: 13
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/features/orders/order-detail-page.tsx",
        lineNumber: 131,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s(ProductThumbnailCell, "OwMTthy8yr9lEotXu74vjQv3fzY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$components$2f$product$2d$image$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductImage"]
    ];
});
_c = ProductThumbnailCell;
const normalizeCurrencyValue = (value)=>{
    if (typeof value !== 'number' || Number.isNaN(value)) return 0;
    return Math.abs(value) < 0.005 ? 0 : value;
};
const formatCurrency = (value)=>{
    const normalized = normalizeCurrencyValue(value);
    return new Intl.NumberFormat('vi-VN').format(normalized);
};
const formatNumber = (value)=>{
    if (typeof value !== 'number' || isNaN(value)) return '0';
    return new Intl.NumberFormat('vi-VN').format(value);
};
const formatAddress = (street, ward, province)=>{
    return [
        street,
        ward,
        province
    ].filter(Boolean).join(', ');
};
const getCustomerAddress = (customer, type)=>{
    if (!customer?.addresses || customer.addresses.length === 0) return '';
    // Find address by type, or use default if type not found
    let address = customer.addresses.find((addr)=>addr.type === type);
    // Fallback to default address if specific type not found
    if (!address) {
        address = customer.addresses.find((addr)=>addr.isDefault);
    }
    // Fallback to first address
    if (!address) {
        address = customer.addresses[0];
    }
    if (!address) return '';
    // Format: street, ward, district, province
    return [
        address.street,
        address.ward,
        address.district,
        address.province
    ].filter(Boolean).join(', ');
};
// ✅ Helper to format address object or string
const formatAddressObject = (address)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$address$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatOrderAddress"])(address);
const statusVariants = {
    "Đặt hàng": "secondary",
    "Đang giao dịch": "warning",
    "Hoàn thành": "success",
    "Đã hủy": "destructive"
};
const productTypeFallbackLabels = {
    physical: 'Hàng hóa',
    service: 'Dịch vụ',
    digital: 'Sản phẩm số',
    combo: 'Combo'
};
// A simple deterministic hash function to generate stable mock prices
function simpleHash(str) {
    let hash = 0;
    for(let i = 0; i < str.length; i++){
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
}
const StatusStepper = ({ order })=>{
    const isPackaged = order.packagings.some((p)=>p.status === 'Đã đóng gói');
    const steps = [
        {
            name: 'Đặt hàng',
            date: order.orderDate
        },
        {
            name: 'Duyệt',
            date: order.approvedDate
        },
        {
            name: 'Đóng gói',
            date: isPackaged ? order.packagings.find((p)=>p.status === 'Đã đóng gói')?.confirmDate : undefined
        },
        {
            name: 'Xuất kho',
            date: order.dispatchedDate
        },
        {
            name: 'Hoàn thành',
            date: order.completedDate
        }
    ];
    let currentStepIndex = 0; // Default to 'Đặt hàng'
    if (order.status === 'Hoàn thành') {
        currentStepIndex = 5; // All 5 steps (0-4) are completed.
    } else if (order.dispatchedDate || [
        'Đang giao hàng',
        'Đã giao hàng'
    ].includes(order.deliveryStatus)) {
        currentStepIndex = 4; // Current step is 'Hoàn thành' (index 4)
    } else if (isPackaged || order.deliveryStatus === 'Đã đóng gói') {
        currentStepIndex = 3; // Current step is 'Xuất kho' (index 3)
    } else if (order.approvedDate) {
        currentStepIndex = 2; // Current step is 'Đóng gói' (index 2)
    } else if (order.orderDate) {
        currentStepIndex = 1; // Current step is 'Duyệt' (index 1)
    }
    if (order.status === 'Đã hủy') {
        let lastValidStep = -1;
        if (order.dispatchedDate) lastValidStep = 3;
        else if (isPackaged) lastValidStep = 2;
        else if (order.approvedDate) lastValidStep = 1;
        else if (order.orderDate) lastValidStep = 0;
        currentStepIndex = lastValidStep;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-start justify-between w-full px-4 pt-4",
        children: steps.map((step, index)=>{
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const isCancelled = order.status === 'Đã hủy' && isCurrent;
            const Icon = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"];
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col items-center text-center w-24",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center justify-center w-8 h-8 rounded-full border-2 font-semibold text-body-sm", isCancelled ? "bg-red-100 border-red-500 text-red-500" : isCompleted ? "bg-primary border-primary text-primary-foreground" : isCurrent ? "border-primary text-primary" : "border-gray-300 bg-gray-100 text-gray-400"),
                                children: isCompleted ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                    className: "h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                    lineNumber: 264,
                                    columnNumber: 48
                                }, ("TURBOPACK compile-time value", void 0)) : index + 1
                            }, void 0, false, {
                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                lineNumber: 257,
                                columnNumber: 29
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-body-sm mt-2 font-medium", isCompleted || isCurrent ? "text-foreground" : "text-foreground"),
                                children: step.name
                            }, void 0, false, {
                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                lineNumber: 266,
                                columnNumber: 29
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-body-xs text-foreground mt-1",
                                children: step.date ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDateTime"])(step.date) : '-'
                            }, void 0, false, {
                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                lineNumber: 267,
                                columnNumber: 29
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/orders/order-detail-page.tsx",
                        lineNumber: 256,
                        columnNumber: 25
                    }, ("TURBOPACK compile-time value", void 0)),
                    index < steps.length - 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex-1 mt-4 h-0.5", index < currentStepIndex ? "bg-primary" : "bg-gray-300")
                    }, void 0, false, {
                        fileName: "[project]/features/orders/order-detail-page.tsx",
                        lineNumber: 270,
                        columnNumber: 29
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, step.name, true, {
                fileName: "[project]/features/orders/order-detail-page.tsx",
                lineNumber: 255,
                columnNumber: 21
            }, ("TURBOPACK compile-time value", void 0));
        })
    }, void 0, false, {
        fileName: "[project]/features/orders/order-detail-page.tsx",
        lineNumber: 247,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_c1 = StatusStepper;
function PaymentDialog({ isOpen, onOpenChange, amountDue, onSubmit }) {
    _s1();
    const { data: paymentMethods } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$payments$2f$hooks$2f$use$2d$all$2d$payment$2d$methods$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAllPaymentMethods"])();
    const defaultPaymentMethod = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "PaymentDialog.useMemo[defaultPaymentMethod]": ()=>paymentMethods.find({
                "PaymentDialog.useMemo[defaultPaymentMethod]": (pm)=>pm.isDefault
            }["PaymentDialog.useMemo[defaultPaymentMethod]"])
    }["PaymentDialog.useMemo[defaultPaymentMethod]"], [
        paymentMethods
    ]);
    const form = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useForm"])({
        defaultValues: {
            method: 'Tiền mặt',
            amount: amountDue,
            reference: '',
            accountNumber: '',
            accountName: '',
            bankName: ''
        }
    });
    const selectedMethod = form.watch('method');
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "PaymentDialog.useEffect": ()=>{
            if (isOpen) {
                form.reset({
                    method: 'Tiền mặt',
                    amount: amountDue > 0 ? amountDue : 0,
                    reference: '',
                    accountNumber: '',
                    accountName: '',
                    bankName: ''
                });
            }
        }
    }["PaymentDialog.useEffect"], [
        isOpen,
        amountDue,
        form
    ]);
    // Auto-fill bank account info when selecting "Chuyển khoản"
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "PaymentDialog.useEffect": ()=>{
            if (selectedMethod === 'Chuyển khoản' && defaultPaymentMethod) {
                form.setValue('accountNumber', defaultPaymentMethod.accountNumber || '');
                form.setValue('accountName', defaultPaymentMethod.accountName || '');
                form.setValue('bankName', defaultPaymentMethod.bankName || '');
            }
        }
    }["PaymentDialog.useEffect"], [
        selectedMethod,
        defaultPaymentMethod,
        form
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"], {
        open: isOpen,
        onOpenChange: onOpenChange,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogContent"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogHeader"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogTitle"], {
                        children: "Thanh toán đơn hàng"
                    }, void 0, false, {
                        fileName: "[project]/features/orders/order-detail-page.tsx",
                        lineNumber: 347,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/features/orders/order-detail-page.tsx",
                    lineNumber: 346,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Form"], {
                    ...form,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        id: "payment-form",
                        onSubmit: form.handleSubmit(onSubmit),
                        className: "space-y-4 pt-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormField"], {
                                control: form.control,
                                name: "method",
                                render: ({ field })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormItem"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormLabel"], {
                                                children: "Phương thức"
                                            }, void 0, false, {
                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                lineNumber: 353,
                                                columnNumber: 21
                                            }, void 0),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                                                onValueChange: field.onChange,
                                                value: field.value,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormControl"], {
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectValue"], {}, void 0, false, {
                                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                lineNumber: 355,
                                                                columnNumber: 53
                                                            }, void 0)
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                                            lineNumber: 355,
                                                            columnNumber: 38
                                                        }, void 0)
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                        lineNumber: 355,
                                                        columnNumber: 25
                                                    }, void 0),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectContent"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                value: "Tiền mặt",
                                                                children: "Tiền mặt"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                lineNumber: 356,
                                                                columnNumber: 40
                                                            }, void 0),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                value: "Chuyển khoản",
                                                                children: "Chuyển khoản"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                lineNumber: 356,
                                                                columnNumber: 90
                                                            }, void 0),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                value: "Quẹt thẻ",
                                                                children: "Quẹt thẻ"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                lineNumber: 356,
                                                                columnNumber: 148
                                                            }, void 0)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                        lineNumber: 356,
                                                        columnNumber: 25
                                                    }, void 0)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                lineNumber: 354,
                                                columnNumber: 21
                                            }, void 0)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                        lineNumber: 352,
                                        columnNumber: 17
                                    }, void 0)
                            }, void 0, false, {
                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                lineNumber: 351,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormField"], {
                                control: form.control,
                                name: "amount",
                                rules: {
                                    required: 'Vui lòng nhập số tiền',
                                    min: {
                                        value: 1,
                                        message: 'Số tiền phải lớn hơn 0'
                                    },
                                    max: {
                                        value: amountDue,
                                        message: `Số tiền không được vượt quá ${new Intl.NumberFormat('vi-VN').format(amountDue)} ₫`
                                    }
                                },
                                render: ({ field, fieldState })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormItem"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormLabel"], {
                                                children: "Số tiền"
                                            }, void 0, false, {
                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                lineNumber: 370,
                                                columnNumber: 21
                                            }, void 0),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormControl"], {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$currency$2d$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CurrencyInput"], {
                                                    value: field.value,
                                                    onChange: field.onChange,
                                                    onBlur: field.onBlur,
                                                    name: field.name,
                                                    className: fieldState.error ? 'border-destructive' : ''
                                                }, void 0, false, {
                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                    lineNumber: 372,
                                                    columnNumber: 25
                                                }, void 0)
                                            }, void 0, false, {
                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                lineNumber: 371,
                                                columnNumber: 21
                                            }, void 0),
                                            fieldState.error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-body-sm text-destructive",
                                                children: fieldState.error.message
                                            }, void 0, false, {
                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                lineNumber: 381,
                                                columnNumber: 25
                                            }, void 0)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                        lineNumber: 369,
                                        columnNumber: 17
                                    }, void 0)
                            }, void 0, false, {
                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                lineNumber: 360,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormField"], {
                                control: form.control,
                                name: "reference",
                                render: ({ field })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormItem"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormLabel"], {
                                                children: "Tham chiếu"
                                            }, void 0, false, {
                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                lineNumber: 387,
                                                columnNumber: 21
                                            }, void 0),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormControl"], {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                    ...field,
                                                    placeholder: "VD: Mã giao dịch ngân hàng"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                    lineNumber: 388,
                                                    columnNumber: 34
                                                }, void 0)
                                            }, void 0, false, {
                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                lineNumber: 388,
                                                columnNumber: 21
                                            }, void 0)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                        lineNumber: 386,
                                        columnNumber: 17
                                    }, void 0)
                            }, void 0, false, {
                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                lineNumber: 385,
                                columnNumber: 13
                            }, this),
                            selectedMethod === 'Chuyển khoản' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-4 p-4 border rounded-lg bg-muted/30",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-body-sm font-medium",
                                        children: "Thông tin tài khoản nhận"
                                    }, void 0, false, {
                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                        lineNumber: 395,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormField"], {
                                        control: form.control,
                                        name: "accountNumber",
                                        render: ({ field })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormItem"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormLabel"], {
                                                        children: "Số tài khoản"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                        lineNumber: 398,
                                                        columnNumber: 21
                                                    }, void 0),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormControl"], {
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                            ...field,
                                                            placeholder: "VD: 1234567890"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                                            lineNumber: 399,
                                                            columnNumber: 34
                                                        }, void 0)
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                        lineNumber: 399,
                                                        columnNumber: 21
                                                    }, void 0)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                lineNumber: 397,
                                                columnNumber: 19
                                            }, void 0)
                                    }, void 0, false, {
                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                        lineNumber: 396,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormField"], {
                                        control: form.control,
                                        name: "accountName",
                                        render: ({ field })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormItem"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormLabel"], {
                                                        children: "Tên chủ tài khoản"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                        lineNumber: 404,
                                                        columnNumber: 21
                                                    }, void 0),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormControl"], {
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                            ...field,
                                                            placeholder: "VD: NGUYEN VAN A"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                                            lineNumber: 405,
                                                            columnNumber: 34
                                                        }, void 0)
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                        lineNumber: 405,
                                                        columnNumber: 21
                                                    }, void 0)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                lineNumber: 403,
                                                columnNumber: 19
                                            }, void 0)
                                    }, void 0, false, {
                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                        lineNumber: 402,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormField"], {
                                        control: form.control,
                                        name: "bankName",
                                        render: ({ field })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormItem"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormLabel"], {
                                                        children: "Ngân hàng"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                        lineNumber: 410,
                                                        columnNumber: 21
                                                    }, void 0),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormControl"], {
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                            ...field,
                                                            placeholder: "VD: Vietcombank - CN HCM"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                                            lineNumber: 411,
                                                            columnNumber: 34
                                                        }, void 0)
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                        lineNumber: 411,
                                                        columnNumber: 21
                                                    }, void 0)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                lineNumber: 409,
                                                columnNumber: 19
                                            }, void 0)
                                    }, void 0, false, {
                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                        lineNumber: 408,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                lineNumber: 394,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/orders/order-detail-page.tsx",
                        lineNumber: 350,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/features/orders/order-detail-page.tsx",
                    lineNumber: 349,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogFooter"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "outline",
                            onClick: ()=>onOpenChange(false),
                            children: "Hủy"
                        }, void 0, false, {
                            fileName: "[project]/features/orders/order-detail-page.tsx",
                            lineNumber: 419,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            type: "submit",
                            form: "payment-form",
                            children: "Xác nhận thanh toán"
                        }, void 0, false, {
                            fileName: "[project]/features/orders/order-detail-page.tsx",
                            lineNumber: 420,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/orders/order-detail-page.tsx",
                    lineNumber: 418,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/features/orders/order-detail-page.tsx",
            lineNumber: 345,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/features/orders/order-detail-page.tsx",
        lineNumber: 344,
        columnNumber: 5
    }, this);
}
_s1(PaymentDialog, "HQovv5YsFwZEeZNqY5JRuQgfgBg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$payments$2f$hooks$2f$use$2d$all$2d$payment$2d$methods$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAllPaymentMethods"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useForm"]
    ];
});
_c2 = PaymentDialog;
function CreateShipmentDialog({ isOpen, onOpenChange, onSubmit, order, customer }) {
    _s2();
    const [isLoading, setIsLoading] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    const form = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useForm"])();
    const { handleSubmit, reset } = form;
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "CreateShipmentDialog.useEffect": ()=>{
            if (isOpen && order && customer) {
                reset({
                    customer: customer,
                    lineItems: order.lineItems,
                    grandTotal: order.grandTotal,
                    payments: order.payments,
                    branchSystemId: order.branchSystemId,
                    deliveryMethod: 'shipping-partner'
                });
            }
        }
    }["CreateShipmentDialog.useEffect"], [
        isOpen,
        order,
        customer,
        reset
    ]);
    const handleFormSubmit = async (data)=>{
        if (!order) return;
        setIsLoading(true);
        try {
            const result = await onSubmit(data);
            if (result && result.success) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Thành công', {
                    description: result.message
                });
                onOpenChange(false);
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Lỗi', {
                    description: result?.message || 'Không thể tạo đơn vận chuyển'
                });
            }
        } catch (error) {
            console.error('[CreateShipmentDialog] Error:', error);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Lỗi', {
                description: 'Có lỗi xảy ra khi tạo đơn vận chuyển'
            });
        } finally{
            setIsLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"], {
        open: isOpen,
        onOpenChange: onOpenChange,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogContent"], {
            className: "max-w-6xl h-[90vh] flex flex-col",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogHeader"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogTitle"], {
                            children: "Đẩy qua hãng vận chuyển"
                        }, void 0, false, {
                            fileName: "[project]/features/orders/order-detail-page.tsx",
                            lineNumber: 479,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogDescription"], {
                            children: "Cấu hình và tạo đơn vận chuyển qua đối tác."
                        }, void 0, false, {
                            fileName: "[project]/features/orders/order-detail-page.tsx",
                            lineNumber: 480,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/orders/order-detail-page.tsx",
                    lineNumber: 478,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormProvider"], {
                    ...form,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        id: "create-shipping-form-dialog",
                        onSubmit: handleSubmit(handleFormSubmit),
                        className: "flex-grow overflow-hidden flex flex-col",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-grow overflow-auto p-1",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$components$2f$shipping$2d$integration$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ShippingIntegration"], {
                                    hideTabs: true
                                }, void 0, false, {
                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                    lineNumber: 486,
                                    columnNumber: 27
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                lineNumber: 484,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogFooter"], {
                                className: "mt-4 flex-shrink-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "outline",
                                        onClick: ()=>onOpenChange(false),
                                        disabled: isLoading,
                                        children: "Hủy"
                                    }, void 0, false, {
                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                        lineNumber: 489,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        type: "submit",
                                        disabled: isLoading,
                                        children: [
                                            isLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$spinner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Spinner"], {
                                                className: "mr-2 h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                lineNumber: 491,
                                                columnNumber: 47
                                            }, this),
                                            "Tạo đơn vận chuyển"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                        lineNumber: 490,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                lineNumber: 488,
                                columnNumber: 26
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/orders/order-detail-page.tsx",
                        lineNumber: 483,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/features/orders/order-detail-page.tsx",
                    lineNumber: 482,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/features/orders/order-detail-page.tsx",
            lineNumber: 477,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/features/orders/order-detail-page.tsx",
        lineNumber: 476,
        columnNumber: 9
    }, this);
}
_s2(CreateShipmentDialog, "NcQdHIenHZf7LJcVI0EcGJHDQ+8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useForm"]
    ];
});
_c3 = CreateShipmentDialog;
function PackerSelectionDialog({ isOpen, onOpenChange, onSubmit, existingPackerSystemId }) {
    _s3();
    const { searchEmployees } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$hooks$2f$use$2d$all$2d$employees$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEmployeeSearcher"])();
    const [selectedEmployee, setSelectedEmployee] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](null);
    const handleSubmit = ()=>{
        onSubmit(selectedEmployee ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(selectedEmployee.value) : undefined);
        onOpenChange(false);
    };
    // Preload existing packer if set in order
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "PackerSelectionDialog.useEffect": ()=>{
            if (isOpen && existingPackerSystemId) {
                // Find employee and set as selected
                searchEmployees('', 0, 100).then({
                    "PackerSelectionDialog.useEffect": (result)=>{
                        const existing = result.items.find({
                            "PackerSelectionDialog.useEffect.existing": (e)=>e.value === existingPackerSystemId
                        }["PackerSelectionDialog.useEffect.existing"]);
                        if (existing) {
                            setSelectedEmployee(existing);
                        }
                    }
                }["PackerSelectionDialog.useEffect"]);
            } else if (isOpen) {
                setSelectedEmployee(null);
            }
        }
    }["PackerSelectionDialog.useEffect"], [
        isOpen,
        existingPackerSystemId,
        searchEmployees
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"], {
        open: isOpen,
        onOpenChange: onOpenChange,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogContent"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogHeader"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogTitle"], {
                            children: "Chọn nhân viên đóng gói"
                        }, void 0, false, {
                            fileName: "[project]/features/orders/order-detail-page.tsx",
                            lineNumber: 540,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogDescription"], {
                            children: "Chỉ định một nhân viên để thực hiện đóng gói cho đơn hàng này. Bạn có thể bỏ qua để yêu cầu chung."
                        }, void 0, false, {
                            fileName: "[project]/features/orders/order-detail-page.tsx",
                            lineNumber: 541,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/orders/order-detail-page.tsx",
                    lineNumber: 539,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "pt-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$combobox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Combobox"], {
                        value: selectedEmployee,
                        onChange: setSelectedEmployee,
                        onSearch: searchEmployees,
                        placeholder: "Tìm nhân viên...",
                        searchPlaceholder: "Tìm kiếm...",
                        emptyPlaceholder: "Không tìm thấy nhân viên."
                    }, void 0, false, {
                        fileName: "[project]/features/orders/order-detail-page.tsx",
                        lineNumber: 546,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/features/orders/order-detail-page.tsx",
                    lineNumber: 545,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogFooter"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "outline",
                            onClick: ()=>onOpenChange(false),
                            children: "Hủy"
                        }, void 0, false, {
                            fileName: "[project]/features/orders/order-detail-page.tsx",
                            lineNumber: 556,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            onClick: handleSubmit,
                            children: "Yêu cầu đóng gói"
                        }, void 0, false, {
                            fileName: "[project]/features/orders/order-detail-page.tsx",
                            lineNumber: 559,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/orders/order-detail-page.tsx",
                    lineNumber: 555,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/features/orders/order-detail-page.tsx",
            lineNumber: 538,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/features/orders/order-detail-page.tsx",
        lineNumber: 537,
        columnNumber: 5
    }, this);
}
_s3(PackerSelectionDialog, "ztRIcGX7aY0K+8dX/hoVGn8XxBI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$hooks$2f$use$2d$all$2d$employees$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEmployeeSearcher"]
    ];
});
_c4 = PackerSelectionDialog;
const OrderHistoryTab = ({ order, salesReturnsForOrder })=>{
    _s4();
    const { data: receipts } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$receipts$2f$hooks$2f$use$2d$all$2d$receipts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAllReceipts"])();
    const { data: payments } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$payments$2f$hooks$2f$use$2d$all$2d$payments$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAllPayments"])();
    const { data: warranties } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$hooks$2f$use$2d$all$2d$warranties$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAllWarranties"])();
    const { findById: findEmployeeById } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$hooks$2f$use$2d$all$2d$employees$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEmployeeFinder"])();
    const allTransactions = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "OrderHistoryTab.useMemo[allTransactions]": ()=>[
                ...receipts,
                ...payments
            ]
    }["OrderHistoryTab.useMemo[allTransactions]"], [
        receipts,
        payments
    ]);
    const parseTimestamp = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "OrderHistoryTab.useCallback[parseTimestamp]": (value)=>{
            if (!value) return undefined;
            return new Date(value.includes('T') ? value : value.replace(' ', 'T'));
        }
    }["OrderHistoryTab.useCallback[parseTimestamp]"], []);
    const buildUser = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "OrderHistoryTab.useCallback[buildUser]": (systemId, fallbackName)=>{
            if (systemId && typeof systemId === 'string') {
                const employee = findEmployeeById((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(systemId));
                if (employee) {
                    return {
                        systemId: employee.systemId,
                        name: employee.fullName
                    };
                }
            }
            if (fallbackName) {
                return {
                    systemId: typeof systemId === 'string' ? systemId : 'SYSTEM',
                    name: fallbackName
                };
            }
            return {
                systemId: typeof systemId === 'string' ? systemId : 'SYSTEM',
                name: 'Hệ thống'
            };
        }
    }["OrderHistoryTab.useCallback[buildUser]"], [
        findEmployeeById
    ]);
    const historyEntries = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "OrderHistoryTab.useMemo[historyEntries]": ()=>{
            if (!order) return [];
            const entries = [];
            const pushEntry = {
                "OrderHistoryTab.useMemo[historyEntries].pushEntry": (entry)=>{
                    if (entry && entry.timestamp) {
                        entries.push(entry);
                    }
                }
            }["OrderHistoryTab.useMemo[historyEntries].pushEntry"];
            const createdAt = parseTimestamp(order.orderDate);
            if (createdAt) {
                pushEntry({
                    id: `${order.systemId}-created`,
                    action: 'created',
                    timestamp: createdAt,
                    user: buildUser(order.salespersonSystemId, order.salesperson),
                    description: `Tạo đơn hàng ${order.id}`
                });
            }
            const approvedAt = parseTimestamp(order.approvedDate);
            if (approvedAt) {
                pushEntry({
                    id: `${order.systemId}-approved`,
                    action: 'status_changed',
                    timestamp: approvedAt,
                    user: buildUser(undefined, 'Hệ thống'),
                    description: 'Đã duyệt đơn hàng'
                });
            }
            const dispatchedAt = parseTimestamp(order.dispatchedDate);
            if (dispatchedAt) {
                pushEntry({
                    id: `${order.systemId}-dispatched`,
                    action: 'status_changed',
                    timestamp: dispatchedAt,
                    user: buildUser(order.dispatchedByEmployeeId, order.dispatchedByEmployeeName),
                    description: 'Xuất kho cho đơn hàng'
                });
            }
            const completedAt = parseTimestamp(order.completedDate);
            if (completedAt) {
                pushEntry({
                    id: `${order.systemId}-completed`,
                    action: 'status_changed',
                    timestamp: completedAt,
                    user: buildUser(undefined, 'Hệ thống'),
                    description: 'Hoàn thành đơn hàng'
                });
            }
            const cancelledAt = parseTimestamp(order.cancelledDate);
            if (cancelledAt) {
                pushEntry({
                    id: `${order.systemId}-cancelled`,
                    action: 'cancelled',
                    timestamp: cancelledAt,
                    user: buildUser(undefined, 'Hệ thống'),
                    description: 'Hủy đơn hàng',
                    content: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-body-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Lý do: "
                            }, void 0, false, {
                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                lineNumber: 657,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-medium",
                                children: order.cancellationReason || 'Không rõ'
                            }, void 0, false, {
                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                lineNumber: 658,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0)),
                            order.cancellationMetadata && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-body-xs text-muted-foreground",
                                children: [
                                    order.cancellationMetadata.restockItems ? 'Đã hoàn kho' : 'Không hoàn kho',
                                    " ·",
                                    ' ',
                                    order.cancellationMetadata.notifyCustomer ? 'Đã gửi email cho khách' : 'Không gửi email cho khách'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                lineNumber: 660,
                                columnNumber: 29
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/orders/order-detail-page.tsx",
                        lineNumber: 656,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0))
                });
            }
            order.payments.forEach({
                "OrderHistoryTab.useMemo[historyEntries]": (payment)=>{
                    const timestamp = parseTimestamp(payment.date);
                    if (!timestamp) return;
                    const isRefund = payment.amount < 0;
                    const absAmount = formatCurrency(Math.abs(payment.amount));
                    const voucherPath = isRefund ? 'payments' : 'receipts';
                    const paymentLink = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: `/${voucherPath}/${payment.systemId}`,
                        className: "font-semibold text-primary hover:underline",
                        children: payment.id
                    }, void 0, false, {
                        fileName: "[project]/features/orders/order-detail-page.tsx",
                        lineNumber: 677,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0));
                    const warrantyLink = payment.linkedWarrantySystemId ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            ' ',
                            "từ bảo hành",
                            ' ',
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: `/warranty/${payment.linkedWarrantySystemId}`,
                                className: "font-semibold text-primary hover:underline",
                                children: warranties.find({
                                    "OrderHistoryTab.useMemo[historyEntries]": (w)=>w.systemId === payment.linkedWarrantySystemId
                                }["OrderHistoryTab.useMemo[historyEntries]"])?.id || 'N/A'
                            }, void 0, false, {
                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                lineNumber: 684,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true) : null;
                    pushEntry({
                        id: `${order.systemId}-payment-${payment.systemId}`,
                        action: 'payment_made',
                        timestamp,
                        user: buildUser(payment.createdBy),
                        description: `${isRefund ? 'Hoàn tiền' : 'Thanh toán'} ${absAmount} qua ${payment.method}`,
                        content: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                isRefund ? 'Hoàn tiền' : 'Thanh toán',
                                ' ',
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-semibold",
                                    children: absAmount
                                }, void 0, false, {
                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                    lineNumber: 702,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                " qua ",
                                payment.method,
                                " (",
                                paymentLink,
                                ")",
                                warrantyLink,
                                "."
                            ]
                        }, void 0, true)
                    });
                }
            }["OrderHistoryTab.useMemo[historyEntries]"]);
            order.packagings.forEach({
                "OrderHistoryTab.useMemo[historyEntries]": (pkg)=>{
                    const requestDate = parseTimestamp(pkg.requestDate);
                    if (requestDate) {
                        pushEntry({
                            id: `${pkg.systemId}-request`,
                            action: 'product_added',
                            timestamp: requestDate,
                            user: buildUser(pkg.requestingEmployeeId, pkg.requestingEmployeeName),
                            description: 'Yêu cầu đóng gói',
                            content: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    "Yêu cầu đóng gói",
                                    ' ',
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: `/packaging/${pkg.systemId}`,
                                        className: "text-primary hover:underline",
                                        children: pkg.id
                                    }, void 0, false, {
                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                        lineNumber: 720,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    "."
                                ]
                            }, void 0, true)
                        });
                    }
                    const confirmDate = parseTimestamp(pkg.confirmDate);
                    if (confirmDate) {
                        pushEntry({
                            id: `${pkg.systemId}-confirm`,
                            action: 'status_changed',
                            timestamp: confirmDate,
                            user: buildUser(pkg.confirmingEmployeeId, pkg.confirmingEmployeeName),
                            description: 'Xác nhận đóng gói',
                            content: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    "Xác nhận đóng gói",
                                    ' ',
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: `/packaging/${pkg.systemId}`,
                                        className: "text-primary hover:underline",
                                        children: pkg.id
                                    }, void 0, false, {
                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                        lineNumber: 740,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    "."
                                ]
                            }, void 0, true)
                        });
                    }
                    const cancelDate = parseTimestamp(pkg.cancelDate);
                    if (cancelDate) {
                        pushEntry({
                            id: `${pkg.systemId}-cancel`,
                            action: 'cancelled',
                            timestamp: cancelDate,
                            user: buildUser(pkg.cancelingEmployeeId, pkg.cancelingEmployeeName),
                            description: 'Hủy yêu cầu đóng gói',
                            content: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    "Hủy đóng gói",
                                    ' ',
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: `/packaging/${pkg.systemId}`,
                                        className: "text-primary hover:underline",
                                        children: pkg.id
                                    }, void 0, false, {
                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                        lineNumber: 760,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    ". Lý do: ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "italic",
                                        children: pkg.cancelReason || 'Không rõ'
                                    }, void 0, false, {
                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                        lineNumber: 763,
                                        columnNumber: 38
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true)
                        });
                    }
                }
            }["OrderHistoryTab.useMemo[historyEntries]"]);
            salesReturnsForOrder.forEach({
                "OrderHistoryTab.useMemo[historyEntries]": (returnSlip)=>{
                    const timestamp = parseTimestamp(returnSlip.returnDate);
                    if (!timestamp) return;
                    const transactionSystemId = returnSlip.paymentVoucherSystemId || returnSlip.receiptVoucherSystemIds?.[0];
                    const transaction = transactionSystemId ? allTransactions.find({
                        "OrderHistoryTab.useMemo[historyEntries]": (t)=>t.systemId === transactionSystemId
                    }["OrderHistoryTab.useMemo[historyEntries]"]) : null;
                    const transactionLink = transaction ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            ' ',
                            "và chứng từ",
                            ' ',
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: `/${returnSlip.paymentVoucherSystemId ? 'payments' : 'receipts'}/${transaction.systemId}`,
                                className: "font-semibold text-primary hover:underline",
                                children: transaction.id
                            }, void 0, false, {
                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                lineNumber: 778,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true) : null;
                    const exchangeOrderLink = returnSlip.exchangeOrderSystemId ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            ' ',
                            "và tạo đơn đổi",
                            ' ',
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: `/orders/${returnSlip.exchangeOrderSystemId}`,
                                className: "font-semibold text-primary hover:underline",
                                children: "Xem đơn đổi"
                            }, void 0, false, {
                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                lineNumber: 789,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true) : null;
                    pushEntry({
                        id: `${order.systemId}-return-${returnSlip.systemId}`,
                        action: 'custom',
                        timestamp,
                        user: buildUser(returnSlip.creatorSystemId, returnSlip.creatorName),
                        description: `Tạo phiếu trả hàng ${returnSlip.id}`,
                        content: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                "Tạo phiếu trả hàng",
                                ' ',
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: `/returns/${returnSlip.systemId}`,
                                    className: "font-semibold text-primary hover:underline",
                                    children: returnSlip.id
                                }, void 0, false, {
                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                    lineNumber: 804,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                transactionLink,
                                exchangeOrderLink,
                                "."
                            ]
                        }, void 0, true)
                    });
                }
            }["OrderHistoryTab.useMemo[historyEntries]"]);
            if (order.notes && createdAt) {
                pushEntry({
                    id: `${order.systemId}-note`,
                    action: 'comment_added',
                    timestamp: createdAt,
                    user: buildUser(order.salespersonSystemId, order.salesperson),
                    description: 'Thêm ghi chú đơn hàng',
                    content: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            "Ghi chú: ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "italic",
                                children: order.notes
                            }, void 0, false, {
                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                lineNumber: 823,
                                columnNumber: 34
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true)
                });
            }
            // NOTE: Comments are displayed in separate Comments section, not in history
            return entries.sort({
                "OrderHistoryTab.useMemo[historyEntries]": (a, b)=>b.timestamp.getTime() - a.timestamp.getTime()
            }["OrderHistoryTab.useMemo[historyEntries]"]);
        }
    }["OrderHistoryTab.useMemo[historyEntries]"], [
        order,
        salesReturnsForOrder,
        allTransactions,
        warranties,
        buildUser,
        parseTimestamp
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ActivityHistory$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActivityHistory"], {
        history: historyEntries,
        title: "Lịch sử & Ghi chú",
        showFilters: false,
        showMetadata: false
    }, void 0, false, {
        fileName: "[project]/features/orders/order-detail-page.tsx",
        lineNumber: 835,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s4(OrderHistoryTab, "BXeqWgoLCBJxJ4OfZrZ3TzKue9c=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$receipts$2f$hooks$2f$use$2d$all$2d$receipts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAllReceipts"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$payments$2f$hooks$2f$use$2d$all$2d$payments$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAllPayments"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$hooks$2f$use$2d$all$2d$warranties$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAllWarranties"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$hooks$2f$use$2d$all$2d$employees$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEmployeeFinder"]
    ];
});
_c5 = OrderHistoryTab;
const ProductInfoCard = ({ order, costOfGoods, profit, totalDiscount, salesReturns, getProductTypeLabel })=>{
    // Calculate warranty payments (negative amounts linked to warranty)
    const warrantyPayments = (order?.payments || []).filter((p)=>p.amount < 0 && p.linkedWarrantySystemId);
    const totalWarrantyDeduction = warrantyPayments.reduce((sum, p)=>sum + Math.abs(p.amount), 0);
    // Check if any line item has tax
    const hasTax = order.lineItems.some((item)=>item.tax && item.tax > 0);
    // Convert order lineItems to ReadOnlyProductsTable format
    const lineItems = order.lineItems.map((item)=>{
        // Calculate line total with tax
        const lineGross = item.unitPrice * item.quantity;
        const taxAmount = item.tax ? lineGross * (item.tax / 100) : 0;
        let discountValue = 0;
        if (item.discount && item.discount > 0) {
            discountValue = item.discountType === 'fixed' ? item.discount : (lineGross + taxAmount) * (item.discount / 100);
        }
        const lineTotal = lineGross + taxAmount - discountValue;
        return {
            productSystemId: item.productSystemId,
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discount: item.discount,
            discountType: item.discountType,
            tax: item.tax,
            taxId: item.taxId,
            total: lineTotal,
            note: item.note
        };
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                    className: "text-h4",
                    children: "Thông tin sản phẩm"
                }, void 0, false, {
                    fileName: "[project]/features/orders/order-detail-page.tsx",
                    lineNumber: 881,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/features/orders/order-detail-page.tsx",
                lineNumber: 880,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$read$2d$only$2d$products$2d$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ReadOnlyProductsTable"], {
                        lineItems: lineItems,
                        showStorageLocation: false,
                        showUnit: false,
                        showDiscount: true,
                        showTax: hasTax
                    }, void 0, false, {
                        fileName: "[project]/features/orders/order-detail-page.tsx",
                        lineNumber: 884,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-end mt-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-full max-w-sm space-y-2 text-body-sm",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-muted-foreground",
                                            children: [
                                                "Tổng tiền (",
                                                order.lineItems.length,
                                                " sản phẩm)"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                            lineNumber: 893,
                                            columnNumber: 63
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: formatCurrency(order.subtotal)
                                        }, void 0, false, {
                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                            lineNumber: 893,
                                            columnNumber: 156
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                    lineNumber: 893,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-muted-foreground",
                                            children: "Giá vốn"
                                        }, void 0, false, {
                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                            lineNumber: 894,
                                            columnNumber: 63
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: formatCurrency(costOfGoods)
                                        }, void 0, false, {
                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                            lineNumber: 894,
                                            columnNumber: 118
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                    lineNumber: 894,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between font-semibold",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Lợi nhuận tạm tính"
                                        }, void 0, false, {
                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                            lineNumber: 895,
                                            columnNumber: 77
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: formatCurrency(profit)
                                        }, void 0, false, {
                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                            lineNumber: 895,
                                            columnNumber: 109
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                    lineNumber: 895,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$separator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"], {
                                    className: "!my-2"
                                }, void 0, false, {
                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                    lineNumber: 896,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-muted-foreground",
                                            children: "Chiết khấu"
                                        }, void 0, false, {
                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                            lineNumber: 897,
                                            columnNumber: 63
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: formatCurrency(-totalDiscount)
                                        }, void 0, false, {
                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                            lineNumber: 897,
                                            columnNumber: 121
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                    lineNumber: 897,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                hasTax && order.tax > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-muted-foreground",
                                            children: "Thuế (VAT)"
                                        }, void 0, false, {
                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                            lineNumber: 899,
                                            columnNumber: 67
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: formatCurrency(order.tax)
                                        }, void 0, false, {
                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                            lineNumber: 899,
                                            columnNumber: 125
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                    lineNumber: 899,
                                    columnNumber: 29
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-muted-foreground",
                                            children: "Phí giao hàng"
                                        }, void 0, false, {
                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                            lineNumber: 901,
                                            columnNumber: 63
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: formatCurrency(order.shippingFee)
                                        }, void 0, false, {
                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                            lineNumber: 901,
                                            columnNumber: 124
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                    lineNumber: 901,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-muted-foreground",
                                            children: "Mã giảm giá"
                                        }, void 0, false, {
                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                            lineNumber: 902,
                                            columnNumber: 63
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: formatCurrency(0)
                                        }, void 0, false, {
                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                            lineNumber: 902,
                                            columnNumber: 122
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                    lineNumber: 902,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                order.linkedSalesReturnValue && order.linkedSalesReturnValue > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-muted-foreground",
                                            children: [
                                                "Giá trị trả hàng ",
                                                order.linkedSalesReturnSystemId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    href: `/returns/${order.linkedSalesReturnSystemId}`,
                                                    className: "text-primary hover:underline",
                                                    children: [
                                                        "(",
                                                        salesReturns.find((r)=>r.systemId === order.linkedSalesReturnSystemId)?.id || 'N/A',
                                                        ")"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                    lineNumber: 908,
                                                    columnNumber: 41
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                            lineNumber: 906,
                                            columnNumber: 33
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-red-600",
                                            children: formatCurrency(-(order.linkedSalesReturnValue ?? 0))
                                        }, void 0, false, {
                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                            lineNumber: 913,
                                            columnNumber: 33
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                    lineNumber: 905,
                                    columnNumber: 29
                                }, ("TURBOPACK compile-time value", void 0)),
                                totalWarrantyDeduction > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-muted-foreground",
                                            children: [
                                                "Trừ tiền bảo hành",
                                                warrantyPayments.map((payment, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                        children: [
                                                            idx === 0 && ' (',
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                href: `/payments/${payment.systemId}`,
                                                                className: "text-primary hover:underline font-medium",
                                                                onClick: (e)=>e.stopPropagation(),
                                                                children: payment.id
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                lineNumber: 923,
                                                                columnNumber: 45
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            idx < warrantyPayments.length - 1 ? ', ' : ')'
                                                        ]
                                                    }, payment.systemId, true, {
                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                        lineNumber: 921,
                                                        columnNumber: 41
                                                    }, ("TURBOPACK compile-time value", void 0))),
                                                ":"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                            lineNumber: 918,
                                            columnNumber: 33
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-red-600",
                                            children: formatCurrency(-totalWarrantyDeduction)
                                        }, void 0, false, {
                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                            lineNumber: 934,
                                            columnNumber: 33
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                    lineNumber: 917,
                                    columnNumber: 29
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$separator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"], {
                                    className: "!my-2"
                                }, void 0, false, {
                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                    lineNumber: 937,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between font-bold text-h4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Khách phải trả"
                                        }, void 0, false, {
                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                            lineNumber: 938,
                                            columnNumber: 81
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: formatCurrency(order.grandTotal)
                                        }, void 0, false, {
                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                            lineNumber: 938,
                                            columnNumber: 109
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                    lineNumber: 938,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/orders/order-detail-page.tsx",
                            lineNumber: 892,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/features/orders/order-detail-page.tsx",
                        lineNumber: 891,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/features/orders/order-detail-page.tsx",
                lineNumber: 883,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/features/orders/order-detail-page.tsx",
        lineNumber: 879,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_c6 = ProductInfoCard;
const getFinancialResolutionText = (returnSlip, allTransactions)=>{
    const transactionSystemId = returnSlip.paymentVoucherSystemId || returnSlip.receiptVoucherSystemIds?.[0];
    const transaction = transactionSystemId ? allTransactions.find((t)=>t.systemId === transactionSystemId) : null;
    const transactionLink = transaction ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        href: `/${returnSlip.paymentVoucherSystemId ? 'payments' : 'receipts'}/${transaction.systemId}`,
        onClick: (e)=>e.stopPropagation(),
        className: "ml-1 font-medium text-primary hover:underline",
        children: [
            "(",
            transaction.id,
            ")"
        ]
    }, void 0, true, {
        fileName: "[project]/features/orders/order-detail-page.tsx",
        lineNumber: 950,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0)) : null;
    if (returnSlip.finalAmount < 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                `Hoàn tiền ${formatCurrency(Math.abs(returnSlip.finalAmount))} (${returnSlip.refundMethod})`,
                " ",
                transactionLink
            ]
        }, void 0, true);
    }
    if (returnSlip.finalAmount > 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                `Khách trả thêm ${formatCurrency(returnSlip.finalAmount)}`,
                " ",
                transactionLink
            ]
        }, void 0, true);
    }
    if (returnSlip.totalReturnValue > 0 && returnSlip.grandTotalNew === 0) {
        return `Cấn trừ công nợ: ${formatCurrency(returnSlip.totalReturnValue)}`;
    }
    if (returnSlip.totalReturnValue > 0 && returnSlip.finalAmount === 0) {
        return `Đổi ngang giá`;
    }
    return 'Không thay đổi tài chính';
};
const ReturnHistoryTab = ({ order, salesReturnsForOrder, getProductTypeLabel, onPreview })=>{
    _s5();
    const [expandedReturnId, setExpandedReturnId] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](null);
    const [expandedCombos, setExpandedCombos] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]({});
    const { data: orders } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$hooks$2f$use$2d$all$2d$orders$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAllOrders"])();
    const { data: allProducts } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$hooks$2f$use$2d$all$2d$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAllProducts"])();
    const { findById: findBranchById } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$hooks$2f$use$2d$all$2d$branches$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBranchFinder"])();
    const { data: storeInfo } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$store$2d$info$2f$hooks$2f$use$2d$store$2d$info$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStoreInfo"])();
    const { print } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$print$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePrint"])(order.branchSystemId);
    const { findById: findCustomerById } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$hooks$2f$use$2d$all$2d$customers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCustomerFinder"])();
    const toggleComboRow = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "ReturnHistoryTab.useCallback[toggleComboRow]": (key)=>{
            setExpandedCombos({
                "ReturnHistoryTab.useCallback[toggleComboRow]": (prev)=>({
                        ...prev,
                        [key]: !prev[key]
                    })
            }["ReturnHistoryTab.useCallback[toggleComboRow]"]);
        }
    }["ReturnHistoryTab.useCallback[toggleComboRow]"], []);
    const handlePrintReturn = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "ReturnHistoryTab.useCallback[handlePrintReturn]": (e, salesReturn)=>{
            e.stopPropagation();
            if (!salesReturn) return;
            const branch = findBranchById(salesReturn.branchSystemId);
            const customer = findCustomerById(salesReturn.customerSystemId);
            const storeSettings = {
                name: storeInfo?.brandName || storeInfo?.companyName,
                address: storeInfo?.headquartersAddress,
                phone: storeInfo?.hotline,
                email: storeInfo?.email,
                province: storeInfo?.province
            };
            const printData = {
                code: salesReturn.id,
                orderCode: salesReturn.orderId,
                createdAt: salesReturn.returnDate,
                createdBy: salesReturn.creatorName,
                // Customer
                customerName: salesReturn.customerName,
                customerPhone: customer?.phone,
                shippingAddress: customer?.addresses?.[0] ? [
                    customer.addresses[0].street,
                    customer.addresses[0].ward,
                    customer.addresses[0].district,
                    customer.addresses[0].province
                ].filter(Boolean).join(', ') : undefined,
                // Branch
                location: branch ? {
                    name: branch.name,
                    address: branch.address,
                    province: branch.province
                } : undefined,
                // Items (Exchange items - kept for reference in mapper)
                items: salesReturn.exchangeItems.map({
                    "ReturnHistoryTab.useCallback[handlePrintReturn]": (item)=>({
                            productName: item.productName,
                            quantity: item.quantity,
                            price: item.unitPrice,
                            amount: item.quantity * item.unitPrice,
                            unit: 'Cái'
                        })
                }["ReturnHistoryTab.useCallback[handlePrintReturn]"]),
                returnItems: salesReturn.items.map({
                    "ReturnHistoryTab.useCallback[handlePrintReturn]": (item)=>({
                            productName: item.productName,
                            quantity: item.returnQuantity,
                            price: item.unitPrice,
                            amount: item.totalValue,
                            unit: 'Cái'
                        })
                }["ReturnHistoryTab.useCallback[handlePrintReturn]"]),
                // Totals
                total: salesReturn.grandTotalNew,
                returnTotalAmount: salesReturn.totalReturnValue,
                totalAmount: Math.abs(salesReturn.finalAmount),
                note: salesReturn.note
            };
            const mappedData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$sales$2d$return$2e$mapper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mapSalesReturnToPrintData"])(printData, storeSettings);
            // Inject missing fields based on user feedback/template
            mappedData['{reason_return}'] = salesReturn.reason || '';
            mappedData['{reason}'] = salesReturn.reason || '';
            mappedData['{note}'] = salesReturn.note || '';
            // Calculate refund status
            let refundStatus = 'Chưa hoàn tiền';
            const totalRefunded = (salesReturn.refunds || []).reduce({
                "ReturnHistoryTab.useCallback[handlePrintReturn]": (sum, r)=>sum + (r.amount || 0)
            }["ReturnHistoryTab.useCallback[handlePrintReturn]"], 0) || salesReturn.refundAmount || 0;
            const totalPaid = (salesReturn.payments || []).reduce({
                "ReturnHistoryTab.useCallback[handlePrintReturn].totalPaid": (sum, p)=>sum + (p.amount || 0)
            }["ReturnHistoryTab.useCallback[handlePrintReturn].totalPaid"], 0);
            if (salesReturn.finalAmount < 0) {
                if (totalRefunded >= Math.abs(salesReturn.finalAmount)) {
                    refundStatus = 'Đã hoàn tiền';
                } else if (totalRefunded > 0) {
                    refundStatus = 'Hoàn tiền một phần';
                }
            } else if (salesReturn.finalAmount > 0) {
                if (totalPaid >= salesReturn.finalAmount) {
                    refundStatus = 'Đã thanh toán';
                } else if (totalPaid > 0) {
                    refundStatus = 'Thanh toán một phần';
                } else {
                    refundStatus = 'Chưa thanh toán';
                }
            } else {
                refundStatus = 'Đã hoàn thành';
            }
            mappedData['refund_status'] = refundStatus;
            // Map return items for the main table (since template shows "SL Trả")
            const lineItems = salesReturn.items.map({
                "ReturnHistoryTab.useCallback[handlePrintReturn].lineItems": (item, index)=>({
                        '{line_stt}': (index + 1).toString(),
                        '{line_product_name}': item.productName,
                        '{line_variant_code}': item.productId,
                        '{line_variant}': '',
                        '{line_unit}': 'Cái',
                        '{line_quantity}': item.returnQuantity.toString(),
                        '{line_price}': formatCurrency(item.unitPrice),
                        '{line_total}': formatCurrency(item.totalValue),
                        '{line_amount}': formatCurrency(item.totalValue)
                    })
            }["ReturnHistoryTab.useCallback[handlePrintReturn].lineItems"]);
            print('sales-return', {
                data: mappedData,
                lineItems: lineItems
            });
        }
    }["ReturnHistoryTab.useCallback[handlePrintReturn]"], [
        findBranchById,
        storeInfo,
        print,
        findCustomerById
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
            className: "p-0",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Table"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHeader"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableRow"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                    className: "w-12"
                                }, void 0, false, {
                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                    lineNumber: 1102,
                                    columnNumber: 29
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                    children: "Mã đơn trả hàng"
                                }, void 0, false, {
                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                    lineNumber: 1103,
                                    columnNumber: 29
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                    children: "Trạng thái"
                                }, void 0, false, {
                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                    lineNumber: 1104,
                                    columnNumber: 29
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                    children: "Ngày trả hàng"
                                }, void 0, false, {
                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                    lineNumber: 1105,
                                    columnNumber: 29
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                    className: "text-center",
                                    children: "Số lượng hàng trả"
                                }, void 0, false, {
                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                    lineNumber: 1106,
                                    columnNumber: 29
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                    className: "text-right",
                                    children: "Giá trị hàng trả"
                                }, void 0, false, {
                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                    lineNumber: 1107,
                                    columnNumber: 29
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                    children: "Mã đơn đổi"
                                }, void 0, false, {
                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                    lineNumber: 1108,
                                    columnNumber: 29
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                    className: "text-center",
                                    children: "Số lượng hàng đổi"
                                }, void 0, false, {
                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                    lineNumber: 1109,
                                    columnNumber: 29
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                    className: "text-right",
                                    children: "Giá trị hàng đổi"
                                }, void 0, false, {
                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                    lineNumber: 1110,
                                    columnNumber: 29
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                    className: "text-right",
                                    children: "Chênh lệch"
                                }, void 0, false, {
                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                    lineNumber: 1111,
                                    columnNumber: 29
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                    className: "w-10"
                                }, void 0, false, {
                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                    lineNumber: 1112,
                                    columnNumber: 29
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/orders/order-detail-page.tsx",
                            lineNumber: 1101,
                            columnNumber: 25
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/features/orders/order-detail-page.tsx",
                        lineNumber: 1100,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableBody"], {
                        children: salesReturnsForOrder.map((returnSlip)=>{
                            const isExpanded = expandedReturnId === returnSlip.systemId;
                            const totalReturnQty = returnSlip.items.reduce((sum, item)=>sum + item.returnQuantity, 0);
                            const totalExchangeQty = returnSlip.exchangeItems?.reduce((sum, item)=>sum + item.quantity, 0) || 0;
                            const exchangeOrder = returnSlip.exchangeOrderSystemId ? orders.find((o)=>o.systemId === returnSlip.exchangeOrderSystemId) : null;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableRow"], {
                                        onClick: ()=>setExpandedReturnId(isExpanded ? null : returnSlip.systemId),
                                        className: "cursor-pointer hover:bg-muted/50",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                    variant: "ghost",
                                                    size: "icon",
                                                    className: "h-8 w-8",
                                                    children: isExpanded ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                        className: "h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                        lineNumber: 1127,
                                                        columnNumber: 63
                                                    }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                                        className: "h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                        lineNumber: 1127,
                                                        columnNumber: 101
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, void 0, false, {
                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                    lineNumber: 1126,
                                                    columnNumber: 45
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                lineNumber: 1125,
                                                columnNumber: 41
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    href: `/returns/${returnSlip.systemId}`,
                                                    onClick: (e)=>e.stopPropagation(),
                                                    className: "font-medium text-primary hover:underline",
                                                    children: returnSlip.id
                                                }, void 0, false, {
                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                    lineNumber: 1131,
                                                    columnNumber: 45
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                lineNumber: 1130,
                                                columnNumber: 41
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-body-xs font-medium ${returnSlip.isReceived ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`,
                                                    children: returnSlip.isReceived ? 'Đã nhận' : 'Chưa nhận'
                                                }, void 0, false, {
                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                    lineNumber: 1140,
                                                    columnNumber: 45
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                lineNumber: 1139,
                                                columnNumber: 41
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(returnSlip.returnDate)
                                            }, void 0, false, {
                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                lineNumber: 1148,
                                                columnNumber: 41
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                className: "text-center",
                                                children: totalReturnQty
                                            }, void 0, false, {
                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                lineNumber: 1149,
                                                columnNumber: 41
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                className: "text-right font-medium",
                                                children: formatCurrency(returnSlip.totalReturnValue)
                                            }, void 0, false, {
                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                lineNumber: 1150,
                                                columnNumber: 41
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                children: exchangeOrder ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    href: `/orders/${exchangeOrder.systemId}`,
                                                    onClick: (e)=>e.stopPropagation(),
                                                    className: "text-primary hover:underline",
                                                    children: exchangeOrder.id
                                                }, void 0, false, {
                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                    lineNumber: 1153,
                                                    columnNumber: 49
                                                }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-muted-foreground",
                                                    children: "-"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                    lineNumber: 1161,
                                                    columnNumber: 49
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                lineNumber: 1151,
                                                columnNumber: 41
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                className: "text-center",
                                                children: totalExchangeQty > 0 ? totalExchangeQty : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-muted-foreground",
                                                    children: "-"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                    lineNumber: 1165,
                                                    columnNumber: 88
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                lineNumber: 1164,
                                                columnNumber: 41
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                className: "text-right font-medium",
                                                children: returnSlip.grandTotalNew > 0 ? formatCurrency(returnSlip.grandTotalNew) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-muted-foreground",
                                                    children: "-"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                    lineNumber: 1168,
                                                    columnNumber: 120
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                lineNumber: 1167,
                                                columnNumber: 41
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                className: "text-right font-semibold",
                                                children: (()=>{
                                                    // Tính số tiền thực tế đã hoàn/thu
                                                    const totalRefunded = (returnSlip.refunds || []).reduce((sum, r)=>sum + (r.amount || 0), 0) || returnSlip.refundAmount || 0;
                                                    const totalPaid = (returnSlip.payments || []).reduce((sum, p)=>sum + (p.amount || 0), 0);
                                                    const actualAmount = totalPaid - totalRefunded;
                                                    // Nếu không có hoàn tiền và không có thanh toán → hiển thị dấu "-"
                                                    if (totalRefunded === 0 && totalPaid === 0) {
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-muted-foreground",
                                                            children: "-"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                                            lineNumber: 1179,
                                                            columnNumber: 60
                                                        }, ("TURBOPACK compile-time value", void 0));
                                                    }
                                                    // Có hoàn tiền → hiển thị số âm (màu xanh)
                                                    if (totalRefunded > 0) {
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-green-600",
                                                            children: [
                                                                "-",
                                                                formatCurrency(totalRefunded)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                                            lineNumber: 1184,
                                                            columnNumber: 60
                                                        }, ("TURBOPACK compile-time value", void 0));
                                                    }
                                                    // Có thanh toán từ khách → hiển thị số dương (màu vàng)
                                                    if (totalPaid > 0) {
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-amber-600",
                                                            children: formatCurrency(totalPaid)
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                                            lineNumber: 1189,
                                                            columnNumber: 60
                                                        }, ("TURBOPACK compile-time value", void 0));
                                                    }
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-muted-foreground",
                                                        children: "-"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                        lineNumber: 1192,
                                                        columnNumber: 56
                                                    }, ("TURBOPACK compile-time value", void 0));
                                                })()
                                            }, void 0, false, {
                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                lineNumber: 1170,
                                                columnNumber: 41
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                    variant: "ghost",
                                                    size: "icon",
                                                    className: "h-8 w-8",
                                                    onClick: (e)=>handlePrintReturn(e, returnSlip),
                                                    title: "In phiếu trả hàng",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__["Printer"], {
                                                        className: "h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                        lineNumber: 1203,
                                                        columnNumber: 49
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, void 0, false, {
                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                    lineNumber: 1196,
                                                    columnNumber: 45
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                lineNumber: 1195,
                                                columnNumber: 41
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                        lineNumber: 1124,
                                        columnNumber: 37
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    isExpanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableRow"], {
                                        className: "bg-muted/50 hover:bg-muted/50",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                            colSpan: 11,
                                            className: "p-4",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                className: "font-semibold mb-2",
                                                                children: "Chi tiết hàng trả"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                lineNumber: 1212,
                                                                columnNumber: 57
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "border rounded-md bg-background",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Table"], {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHeader"], {
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableRow"], {
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                                                                        className: "w-12",
                                                                                        children: "STT"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                        lineNumber: 1217,
                                                                                        columnNumber: 73
                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                                                                        className: "w-16 text-center",
                                                                                        children: "Ảnh"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                        lineNumber: 1218,
                                                                                        columnNumber: 73
                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                                                                        children: "Tên sản phẩm"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                        lineNumber: 1219,
                                                                                        columnNumber: 73
                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                                                                        className: "text-center",
                                                                                        children: "Số lượng"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                        lineNumber: 1220,
                                                                                        columnNumber: 73
                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                                                                        className: "text-right",
                                                                                        children: "Đơn giá trả"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                        lineNumber: 1221,
                                                                                        columnNumber: 73
                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                                                                        className: "text-right",
                                                                                        children: "Thành tiền"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                        lineNumber: 1222,
                                                                                        columnNumber: 73
                                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                lineNumber: 1216,
                                                                                columnNumber: 69
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                            lineNumber: 1215,
                                                                            columnNumber: 65
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableBody"], {
                                                                            children: returnSlip.items.map((item, index)=>{
                                                                                const product = allProducts.find((p)=>p.systemId === item.productSystemId);
                                                                                const productType = getProductTypeLabel?.(item.productSystemId) || '---';
                                                                                const isCombo = product?.type === 'combo';
                                                                                const comboKey = `return-${returnSlip.systemId}-${item.productSystemId}`;
                                                                                const isComboExpanded = expandedCombos[comboKey] ?? false;
                                                                                const comboChildren = isCombo && product?.comboItems ? product.comboItems : [];
                                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableRow"], {
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                                                                    className: "text-center text-muted-foreground",
                                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                        className: "flex items-center justify-center gap-1",
                                                                                                        children: [
                                                                                                            isCombo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                                                                type: "button",
                                                                                                                variant: "ghost",
                                                                                                                size: "icon",
                                                                                                                className: "h-6 w-6 p-0",
                                                                                                                onClick: (e)=>{
                                                                                                                    e.stopPropagation();
                                                                                                                    toggleComboRow(comboKey);
                                                                                                                },
                                                                                                                children: isComboExpanded ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                                                                                    className: "h-4 w-4 text-muted-foreground"
                                                                                                                }, void 0, false, {
                                                                                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                                    lineNumber: 1251,
                                                                                                                    columnNumber: 105
                                                                                                                }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                                                                                                    className: "h-4 w-4 text-muted-foreground"
                                                                                                                }, void 0, false, {
                                                                                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                                    lineNumber: 1253,
                                                                                                                    columnNumber: 105
                                                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                                lineNumber: 1240,
                                                                                                                columnNumber: 97
                                                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                children: index + 1
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                                lineNumber: 1257,
                                                                                                                columnNumber: 93
                                                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                        lineNumber: 1238,
                                                                                                        columnNumber: 89
                                                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                    lineNumber: 1237,
                                                                                                    columnNumber: 85
                                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ProductThumbnailCell, {
                                                                                                        productSystemId: item.productSystemId,
                                                                                                        product: product,
                                                                                                        productName: item.productName,
                                                                                                        size: "sm",
                                                                                                        onPreview: onPreview
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                        lineNumber: 1261,
                                                                                                        columnNumber: 89
                                                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                    lineNumber: 1260,
                                                                                                    columnNumber: 85
                                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                        className: "flex flex-col gap-0.5",
                                                                                                        children: [
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                                className: "flex items-center gap-2",
                                                                                                                children: [
                                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                                                                        href: `/products/${item.productSystemId}`,
                                                                                                                        className: "font-medium text-primary hover:underline",
                                                                                                                        children: item.productName
                                                                                                                    }, void 0, false, {
                                                                                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                                        lineNumber: 1272,
                                                                                                                        columnNumber: 97
                                                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                                                    isCombo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                        className: "text-[10px] px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground font-semibold",
                                                                                                                        children: "COMBO"
                                                                                                                    }, void 0, false, {
                                                                                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                                        lineNumber: 1279,
                                                                                                                        columnNumber: 101
                                                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                                                    "n                                                                                            "
                                                                                                                ]
                                                                                                            }, void 0, true, {
                                                                                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                                lineNumber: 1271,
                                                                                                                columnNumber: 93
                                                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                                className: "flex items-center gap-1 text-body-xs text-muted-foreground flex-wrap",
                                                                                                                children: [
                                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                        children: productType
                                                                                                                    }, void 0, false, {
                                                                                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                                        lineNumber: 1284,
                                                                                                                        columnNumber: 97
                                                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                        children: "-"
                                                                                                                    }, void 0, false, {
                                                                                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                                        lineNumber: 1285,
                                                                                                                        columnNumber: 97
                                                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                                                                        href: `/products/${item.productSystemId}`,
                                                                                                                        className: "text-primary hover:underline",
                                                                                                                        children: item.productId
                                                                                                                    }, void 0, false, {
                                                                                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                                        lineNumber: 1286,
                                                                                                                        columnNumber: 97
                                                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                                                    item.note && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                                                                        children: [
                                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sticky$2d$note$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__StickyNote$3e$__["StickyNote"], {
                                                                                                                                className: "h-3 w-3 text-amber-600 ml-1"
                                                                                                                            }, void 0, false, {
                                                                                                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                                                lineNumber: 1294,
                                                                                                                                columnNumber: 105
                                                                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                                className: "text-amber-600 italic",
                                                                                                                                children: item.note
                                                                                                                            }, void 0, false, {
                                                                                                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                                                lineNumber: 1295,
                                                                                                                                columnNumber: 105
                                                                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                                                                        ]
                                                                                                                    }, void 0, true)
                                                                                                                ]
                                                                                                            }, void 0, true, {
                                                                                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                                lineNumber: 1283,
                                                                                                                columnNumber: 93
                                                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                        lineNumber: 1270,
                                                                                                        columnNumber: 89
                                                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                    lineNumber: 1269,
                                                                                                    columnNumber: 85
                                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                                                                    className: "text-center",
                                                                                                    children: item.returnQuantity
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                    lineNumber: 1301,
                                                                                                    columnNumber: 85
                                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                                                                    className: "text-right",
                                                                                                    children: formatCurrency(item.unitPrice)
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                    lineNumber: 1302,
                                                                                                    columnNumber: 85
                                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                                                                    className: "text-right font-medium",
                                                                                                    children: formatCurrency(item.totalValue)
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                    lineNumber: 1303,
                                                                                                    columnNumber: 85
                                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                            lineNumber: 1236,
                                                                                            columnNumber: 81
                                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                                        isCombo && isComboExpanded && comboChildren.map((comboItem, childIndex)=>{
                                                                                            const childProduct = allProducts.find((p)=>p.systemId === comboItem.productSystemId);
                                                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableRow"], {
                                                                                                className: "bg-muted/40",
                                                                                                children: [
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                                                                        className: "text-center text-muted-foreground pl-8",
                                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                            className: "text-muted-foreground/60",
                                                                                                            children: "└"
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                            lineNumber: 1311,
                                                                                                            columnNumber: 97
                                                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                        lineNumber: 1310,
                                                                                                        columnNumber: 93
                                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ProductThumbnailCell, {
                                                                                                            productSystemId: comboItem.productSystemId,
                                                                                                            product: childProduct,
                                                                                                            productName: childProduct?.name || comboItem.productName || 'Sản phẩm',
                                                                                                            size: "sm",
                                                                                                            onPreview: onPreview
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                            lineNumber: 1314,
                                                                                                            columnNumber: 97
                                                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                        lineNumber: 1313,
                                                                                                        columnNumber: 93
                                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                            className: "flex flex-col gap-0.5",
                                                                                                            children: [
                                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                    className: "font-medium text-foreground",
                                                                                                                    children: childProduct?.name || 'Sản phẩm không tồn tại'
                                                                                                                }, void 0, false, {
                                                                                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                                    lineNumber: 1324,
                                                                                                                    columnNumber: 101
                                                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                                                childProduct && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                                                                    href: `/products/${childProduct.systemId}`,
                                                                                                                    className: "text-body-xs text-primary hover:underline",
                                                                                                                    children: childProduct.id
                                                                                                                }, void 0, false, {
                                                                                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                                    lineNumber: 1328,
                                                                                                                    columnNumber: 105
                                                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                                                            ]
                                                                                                        }, void 0, true, {
                                                                                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                            lineNumber: 1323,
                                                                                                            columnNumber: 97
                                                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                        lineNumber: 1322,
                                                                                                        columnNumber: 93
                                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                                                                        className: "text-center text-muted-foreground",
                                                                                                        children: [
                                                                                                            "x",
                                                                                                            comboItem.quantity * item.returnQuantity
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                        lineNumber: 1337,
                                                                                                        columnNumber: 93
                                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                                                                        className: "text-right text-muted-foreground",
                                                                                                        children: "-"
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                        lineNumber: 1340,
                                                                                                        columnNumber: 93
                                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                                                                        className: "text-right text-muted-foreground",
                                                                                                        children: "-"
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                        lineNumber: 1341,
                                                                                                        columnNumber: 93
                                                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                                                ]
                                                                                            }, `${comboKey}-child-${childIndex}`, true, {
                                                                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                lineNumber: 1309,
                                                                                                columnNumber: 89
                                                                                            }, ("TURBOPACK compile-time value", void 0));
                                                                                        })
                                                                                    ]
                                                                                }, item.productSystemId, true, {
                                                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                    lineNumber: 1235,
                                                                                    columnNumber: 77
                                                                                }, ("TURBOPACK compile-time value", void 0));
                                                                            })
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                            lineNumber: 1225,
                                                                            columnNumber: 65
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableFooter"], {
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableRow"], {
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                                                        colSpan: 5,
                                                                                        className: "text-right font-semibold",
                                                                                        children: "Tổng cộng"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                        lineNumber: 1351,
                                                                                        columnNumber: 73
                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                                                        className: "text-right font-bold",
                                                                                        children: formatCurrency(returnSlip.totalReturnValue)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                        lineNumber: 1352,
                                                                                        columnNumber: 73
                                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                lineNumber: 1350,
                                                                                columnNumber: 69
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                            lineNumber: 1349,
                                                                            columnNumber: 65
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                    lineNumber: 1214,
                                                                    columnNumber: 61
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                lineNumber: 1213,
                                                                columnNumber: 57
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                        lineNumber: 1211,
                                                        columnNumber: 53
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    returnSlip.exchangeItems && returnSlip.exchangeItems.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                className: "font-semibold mb-2",
                                                                children: "Chi tiết hàng đổi"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                lineNumber: 1361,
                                                                columnNumber: 61
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "border rounded-md bg-background",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Table"], {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHeader"], {
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableRow"], {
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                                                                        className: "w-12",
                                                                                        children: "STT"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                        lineNumber: 1366,
                                                                                        columnNumber: 77
                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                                                                        className: "w-16 text-center",
                                                                                        children: "Ảnh"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                        lineNumber: 1367,
                                                                                        columnNumber: 77
                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                                                                        children: "Tên sản phẩm"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                        lineNumber: 1368,
                                                                                        columnNumber: 77
                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                                                                        className: "text-center",
                                                                                        children: "Số lượng"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                        lineNumber: 1369,
                                                                                        columnNumber: 77
                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                                                                        className: "text-right",
                                                                                        children: "Đơn giá"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                        lineNumber: 1370,
                                                                                        columnNumber: 77
                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                                                                        className: "text-right",
                                                                                        children: "Thành tiền"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                        lineNumber: 1371,
                                                                                        columnNumber: 77
                                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                lineNumber: 1365,
                                                                                columnNumber: 73
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                            lineNumber: 1364,
                                                                            columnNumber: 69
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableBody"], {
                                                                            children: returnSlip.exchangeItems.map((item, index)=>{
                                                                                const lineTotal = item.quantity * item.unitPrice - (item.discountType === 'percentage' ? item.quantity * item.unitPrice * item.discount / 100 : item.discount);
                                                                                const product = allProducts.find((p)=>p.systemId === item.productSystemId);
                                                                                const productType = getProductTypeLabel?.(item.productSystemId) || '---';
                                                                                const isCombo = product?.type === 'combo';
                                                                                const comboKey = `exchange-${returnSlip.systemId}-${item.productSystemId}`;
                                                                                const isComboExpanded = expandedCombos[comboKey] ?? false;
                                                                                const comboChildren = isCombo && product?.comboItems ? product.comboItems : [];
                                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableRow"], {
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                                                                    className: "text-center text-muted-foreground",
                                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                        className: "flex items-center justify-center gap-1",
                                                                                                        children: [
                                                                                                            isCombo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                                                                type: "button",
                                                                                                                variant: "ghost",
                                                                                                                size: "icon",
                                                                                                                className: "h-6 w-6 p-0",
                                                                                                                onClick: (e)=>{
                                                                                                                    e.stopPropagation();
                                                                                                                    toggleComboRow(comboKey);
                                                                                                                },
                                                                                                                children: isComboExpanded ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                                                                                    className: "h-4 w-4 text-muted-foreground"
                                                                                                                }, void 0, false, {
                                                                                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                                    lineNumber: 1401,
                                                                                                                    columnNumber: 109
                                                                                                                }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                                                                                                    className: "h-4 w-4 text-muted-foreground"
                                                                                                                }, void 0, false, {
                                                                                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                                    lineNumber: 1403,
                                                                                                                    columnNumber: 109
                                                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                                lineNumber: 1390,
                                                                                                                columnNumber: 101
                                                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                children: index + 1
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                                lineNumber: 1407,
                                                                                                                columnNumber: 97
                                                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                        lineNumber: 1388,
                                                                                                        columnNumber: 93
                                                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                    lineNumber: 1387,
                                                                                                    columnNumber: 89
                                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ProductThumbnailCell, {
                                                                                                        productSystemId: item.productSystemId,
                                                                                                        product: product,
                                                                                                        productName: item.productName,
                                                                                                        size: "sm",
                                                                                                        onPreview: onPreview
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                        lineNumber: 1411,
                                                                                                        columnNumber: 93
                                                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                    lineNumber: 1410,
                                                                                                    columnNumber: 89
                                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                        className: "flex flex-col gap-0.5",
                                                                                                        children: [
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                                className: "flex items-center gap-2",
                                                                                                                children: [
                                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                                                                        href: `/products/${item.productSystemId}`,
                                                                                                                        className: "font-medium text-primary hover:underline",
                                                                                                                        children: item.productName
                                                                                                                    }, void 0, false, {
                                                                                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                                        lineNumber: 1422,
                                                                                                                        columnNumber: 101
                                                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                                                    isCombo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                        className: "text-[10px] px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground font-semibold",
                                                                                                                        children: "COMBO"
                                                                                                                    }, void 0, false, {
                                                                                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                                        lineNumber: 1429,
                                                                                                                        columnNumber: 105
                                                                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                                                                ]
                                                                                                            }, void 0, true, {
                                                                                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                                lineNumber: 1421,
                                                                                                                columnNumber: 97
                                                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                                className: "flex items-center gap-1 text-body-xs text-muted-foreground flex-wrap",
                                                                                                                children: [
                                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                        children: productType
                                                                                                                    }, void 0, false, {
                                                                                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                                        lineNumber: 1435,
                                                                                                                        columnNumber: 101
                                                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                        children: "-"
                                                                                                                    }, void 0, false, {
                                                                                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                                        lineNumber: 1436,
                                                                                                                        columnNumber: 101
                                                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                                                                        href: `/products/${item.productSystemId}`,
                                                                                                                        className: "text-primary hover:underline",
                                                                                                                        children: item.productId
                                                                                                                    }, void 0, false, {
                                                                                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                                        lineNumber: 1437,
                                                                                                                        columnNumber: 101
                                                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                                                    item.note && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                                                                        children: [
                                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sticky$2d$note$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__StickyNote$3e$__["StickyNote"], {
                                                                                                                                className: "h-3 w-3 text-amber-600 ml-1"
                                                                                                                            }, void 0, false, {
                                                                                                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                                                lineNumber: 1445,
                                                                                                                                columnNumber: 109
                                                                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                                className: "text-amber-600 italic",
                                                                                                                                children: item.note
                                                                                                                            }, void 0, false, {
                                                                                                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                                                lineNumber: 1446,
                                                                                                                                columnNumber: 109
                                                                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                                                                        ]
                                                                                                                    }, void 0, true)
                                                                                                                ]
                                                                                                            }, void 0, true, {
                                                                                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                                lineNumber: 1434,
                                                                                                                columnNumber: 97
                                                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                        lineNumber: 1420,
                                                                                                        columnNumber: 93
                                                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                    lineNumber: 1419,
                                                                                                    columnNumber: 89
                                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                                                                    className: "text-center",
                                                                                                    children: item.quantity
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                    lineNumber: 1452,
                                                                                                    columnNumber: 89
                                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                                                                    className: "text-right",
                                                                                                    children: formatCurrency(item.unitPrice)
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                    lineNumber: 1453,
                                                                                                    columnNumber: 89
                                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                                                                    className: "text-right font-medium",
                                                                                                    children: formatCurrency(lineTotal)
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                    lineNumber: 1454,
                                                                                                    columnNumber: 89
                                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                            lineNumber: 1386,
                                                                                            columnNumber: 85
                                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                                        isCombo && isComboExpanded && comboChildren.map((comboItem, childIndex)=>{
                                                                                            const childProduct = allProducts.find((p)=>p.systemId === comboItem.productSystemId);
                                                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableRow"], {
                                                                                                className: "bg-muted/40",
                                                                                                children: [
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                                                                        className: "text-center text-muted-foreground pl-8",
                                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                            className: "text-muted-foreground/60",
                                                                                                            children: "└"
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                            lineNumber: 1462,
                                                                                                            columnNumber: 101
                                                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                        lineNumber: 1461,
                                                                                                        columnNumber: 97
                                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ProductThumbnailCell, {
                                                                                                            productSystemId: comboItem.productSystemId,
                                                                                                            product: childProduct,
                                                                                                            productName: childProduct?.name || comboItem.productName || 'Sản phẩm',
                                                                                                            size: "sm",
                                                                                                            onPreview: onPreview
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                            lineNumber: 1465,
                                                                                                            columnNumber: 101
                                                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                        lineNumber: 1464,
                                                                                                        columnNumber: 97
                                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                            className: "flex flex-col gap-0.5",
                                                                                                            children: [
                                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                    className: "font-medium text-foreground",
                                                                                                                    children: childProduct?.name || 'Sản phẩm không tồn tại'
                                                                                                                }, void 0, false, {
                                                                                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                                    lineNumber: 1475,
                                                                                                                    columnNumber: 105
                                                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                                                childProduct && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                                                                    href: `/products/${childProduct.systemId}`,
                                                                                                                    className: "text-body-xs text-primary hover:underline",
                                                                                                                    children: childProduct.id
                                                                                                                }, void 0, false, {
                                                                                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                                    lineNumber: 1479,
                                                                                                                    columnNumber: 109
                                                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                                                            ]
                                                                                                        }, void 0, true, {
                                                                                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                            lineNumber: 1474,
                                                                                                            columnNumber: 101
                                                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                        lineNumber: 1473,
                                                                                                        columnNumber: 97
                                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                                                                        className: "text-center text-muted-foreground",
                                                                                                        children: [
                                                                                                            "x",
                                                                                                            comboItem.quantity * item.quantity
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                        lineNumber: 1488,
                                                                                                        columnNumber: 97
                                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                                                                        className: "text-right text-muted-foreground",
                                                                                                        children: "-"
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                        lineNumber: 1491,
                                                                                                        columnNumber: 97
                                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                                                                        className: "text-right text-muted-foreground",
                                                                                                        children: "-"
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                        lineNumber: 1492,
                                                                                                        columnNumber: 97
                                                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                                                ]
                                                                                            }, `${comboKey}-child-${childIndex}`, true, {
                                                                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                                lineNumber: 1460,
                                                                                                columnNumber: 93
                                                                                            }, ("TURBOPACK compile-time value", void 0));
                                                                                        })
                                                                                    ]
                                                                                }, item.productSystemId, true, {
                                                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                    lineNumber: 1385,
                                                                                    columnNumber: 81
                                                                                }, ("TURBOPACK compile-time value", void 0));
                                                                            })
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                            lineNumber: 1374,
                                                                            columnNumber: 69
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableFooter"], {
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableRow"], {
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                                                        colSpan: 5,
                                                                                        className: "text-right font-semibold",
                                                                                        children: "Tổng cộng"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                        lineNumber: 1502,
                                                                                        columnNumber: 77
                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                                                        className: "text-right font-bold",
                                                                                        children: formatCurrency(returnSlip.grandTotalNew)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                        lineNumber: 1503,
                                                                                        columnNumber: 77
                                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                lineNumber: 1501,
                                                                                columnNumber: 73
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                            lineNumber: 1500,
                                                                            columnNumber: 69
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                    lineNumber: 1363,
                                                                    columnNumber: 65
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                lineNumber: 1362,
                                                                columnNumber: 61
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                        lineNumber: 1360,
                                                        columnNumber: 57
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                lineNumber: 1210,
                                                columnNumber: 49
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                            lineNumber: 1209,
                                            columnNumber: 45
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                        lineNumber: 1208,
                                        columnNumber: 41
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, returnSlip.systemId, true, {
                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                lineNumber: 1123,
                                columnNumber: 33
                            }, ("TURBOPACK compile-time value", void 0));
                        })
                    }, void 0, false, {
                        fileName: "[project]/features/orders/order-detail-page.tsx",
                        lineNumber: 1115,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/features/orders/order-detail-page.tsx",
                lineNumber: 1099,
                columnNumber: 17
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/features/orders/order-detail-page.tsx",
            lineNumber: 1098,
            columnNumber: 13
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/features/orders/order-detail-page.tsx",
        lineNumber: 1097,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s5(ReturnHistoryTab, "8GwCbMQ5VjzMWU0ewRk37zjcCeI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$hooks$2f$use$2d$all$2d$orders$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAllOrders"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$hooks$2f$use$2d$all$2d$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAllProducts"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$hooks$2f$use$2d$all$2d$branches$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBranchFinder"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$store$2d$info$2f$hooks$2f$use$2d$store$2d$info$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStoreInfo"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$print$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePrint"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$hooks$2f$use$2d$all$2d$customers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCustomerFinder"]
    ];
});
_c7 = ReturnHistoryTab;
function OrderDetailPage() {
    _s6();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    // React Query hooks for data fetching
    const { data: orders = [] } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$hooks$2f$use$2d$all$2d$orders$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAllOrders"])();
    const { findById: findOrderById, findByBusinessId: findOrderByBusinessId } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$hooks$2f$use$2d$all$2d$orders$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOrderFinder"])();
    const { update: updateOrder } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$hooks$2f$use$2d$order$2d$mutations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOrderMutations"])();
    const orderActions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$hooks$2f$use$2d$order$2d$actions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOrderActions"])();
    // ⚠️ Zustand store for complex order action methods - to be migrated to APIs
    const orderStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOrderStore"])();
    const { cancelOrder, addPayment, requestPackaging, confirmPackaging, cancelPackagingRequest, processInStorePickup, confirmPartnerShipment, dispatchFromWarehouse, completeDelivery, failDelivery, cancelDelivery, cancelDeliveryOnly, confirmInStorePickup, cancelGHTKShipment } = orderStore;
    const order = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "OrderDetailPage.useMemo[order]": ()=>{
            if (params.systemId) {
                const systemIdParam = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(params.systemId);
                const bySystemId = findOrderById(systemIdParam);
                if (bySystemId) {
                    return bySystemId;
                }
            }
            if (params.id) {
                return findOrderByBusinessId(params.id) ?? null;
            }
            return null;
        }
    }["OrderDetailPage.useMemo[order]"], [
        findOrderById,
        findOrderByBusinessId,
        params.id,
        params.systemId
    ]);
    console.log('🔍 [OrderDetail] lookup param:', params.systemId || params.id, 'foundOrder:', !!order, order ? {
        systemId: order.systemId,
        id: order.id
    } : null);
    const { findById: findProductById } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$hooks$2f$use$2d$all$2d$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductFinder"])();
    const { findById: findProductTypeById } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$inventory$2f$hooks$2f$use$2d$all$2d$product$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductTypeFinder"])();
    const { data: allSalesReturns } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$sales$2d$returns$2f$hooks$2f$use$2d$all$2d$sales$2d$returns$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAllSalesReturns"])();
    const { data: pricingPolicies } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pricing$2f$hooks$2f$use$2d$all$2d$pricing$2d$policies$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useAllPricingPolicies"])();
    const defaultPricingPolicy = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "OrderDetailPage.useMemo[defaultPricingPolicy]": ()=>(pricingPolicies ?? []).find({
                "OrderDetailPage.useMemo[defaultPricingPolicy]": (policy)=>policy.type === 'Bán hàng' && policy.isDefault
            }["OrderDetailPage.useMemo[defaultPricingPolicy]"])
    }["OrderDetailPage.useMemo[defaultPricingPolicy]"], [
        pricingPolicies
    ]);
    const { data: warranties } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$hooks$2f$use$2d$all$2d$warranties$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAllWarranties"])();
    const { data: allReceipts } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$receipts$2f$hooks$2f$use$2d$all$2d$receipts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAllReceipts"])();
    const { data: allPayments } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$payments$2f$hooks$2f$use$2d$all$2d$payments$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAllPayments"])();
    const { data: complaints } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$hooks$2f$use$2d$all$2d$complaints$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAllComplaints"])();
    const slaEngine = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$sla$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCustomerSlaEvaluation"])();
    const { data: branches } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$hooks$2f$use$2d$all$2d$branches$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAllBranches"])();
    const { findById: findBranchById } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$hooks$2f$use$2d$all$2d$branches$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBranchFinder"])();
    const { data: storeInfo } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$store$2d$info$2f$hooks$2f$use$2d$store$2d$info$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStoreInfo"])();
    const { print } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$print$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePrint"])();
    const { data: customers } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$hooks$2f$use$2d$all$2d$customers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAllCustomers"])();
    const customer = order ? customers.find((c)=>c.systemId === order.customerSystemId) : null;
    const orderBranch = order ? findBranchById?.(order.branchSystemId) : null;
    const { employee: authEmployee } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const currentEmployeeSystemId = authEmployee?.systemId ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('SYSTEM');
    const [isCopying, setIsCopying] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    // State for image preview in ReturnHistoryTab
    const [returnHistoryPreviewState, setReturnHistoryPreviewState] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]({
        open: false,
        image: '',
        title: ''
    });
    const handlePreview = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "OrderDetailPage.useCallback[handlePreview]": (image, title)=>{
            setReturnHistoryPreviewState({
                open: true,
                image,
                title
            });
        }
    }["OrderDetailPage.useCallback[handlePreview]"], []);
    const customerOrders = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "OrderDetailPage.useMemo[customerOrders]": ()=>{
            if (!customer) return [];
            return orders.filter({
                "OrderDetailPage.useMemo[customerOrders]": (o)=>o.customerSystemId === customer.systemId
            }["OrderDetailPage.useMemo[customerOrders]"]);
        }
    }["OrderDetailPage.useMemo[customerOrders]"], [
        customer?.systemId,
        orders
    ]);
    // Orders that create debt: status='Hoàn thành' OR deliveryStatus='Đã giao hàng' OR stockOutStatus='Xuất kho toàn bộ'
    const deliveredCustomerOrders = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "OrderDetailPage.useMemo[deliveredCustomerOrders]": ()=>customerOrders.filter({
                "OrderDetailPage.useMemo[deliveredCustomerOrders]": (o)=>o.status !== 'Đã hủy' && (o.status === 'Hoàn thành' || o.deliveryStatus === 'Đã giao hàng' || o.stockOutStatus === 'Xuất kho toàn bộ')
            }["OrderDetailPage.useMemo[deliveredCustomerOrders]"])
    }["OrderDetailPage.useMemo[deliveredCustomerOrders]"], [
        customerOrders
    ]);
    const customerOrderStats = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "OrderDetailPage.useMemo[customerOrderStats]": ()=>{
            if (!customer) {
                return {
                    totalSpent: order?.grandTotal || 0,
                    totalOrders: order ? 1 : 0,
                    lastOrderDate: order?.orderDate ?? null
                };
            }
            if (!customerOrders.length) {
                return {
                    totalSpent: customer.totalSpent ?? 0,
                    totalOrders: customer.totalOrders ?? 0,
                    lastOrderDate: customer.lastPurchaseDate ?? order?.orderDate ?? null
                };
            }
            let totalSpent = 0;
            let lastOrderDate = null;
            deliveredCustomerOrders.forEach({
                "OrderDetailPage.useMemo[customerOrderStats]": (o)=>{
                    totalSpent += o.grandTotal || 0;
                }
            }["OrderDetailPage.useMemo[customerOrderStats]"]);
            const recencySource = deliveredCustomerOrders.length ? deliveredCustomerOrders : customerOrders;
            recencySource.forEach({
                "OrderDetailPage.useMemo[customerOrderStats]": (o)=>{
                    if (!lastOrderDate || new Date(o.orderDate).getTime() > new Date(lastOrderDate).getTime()) {
                        lastOrderDate = o.orderDate;
                    }
                }
            }["OrderDetailPage.useMemo[customerOrderStats]"]);
            return {
                totalSpent,
                totalOrders: customerOrders.length,
                lastOrderDate: lastOrderDate ?? customer.lastPurchaseDate ?? order?.orderDate ?? null
            };
        }
    }["OrderDetailPage.useMemo[customerOrderStats]"], [
        customer,
        customerOrders,
        deliveredCustomerOrders,
        order?.grandTotal,
        order?.orderDate
    ]);
    const customerDebtBalance = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "OrderDetailPage.useMemo[customerDebtBalance]": ()=>{
            if (!customer) return 0;
            const transactions = [];
            deliveredCustomerOrders.forEach({
                "OrderDetailPage.useMemo[customerDebtBalance]": (o)=>{
                    // ✅ Use grandTotal (không trừ paidAmount) vì phiếu thu đã được tính riêng
                    transactions.push({
                        date: o.orderDate,
                        change: o.grandTotal || 0
                    });
                }
            }["OrderDetailPage.useMemo[customerDebtBalance]"]);
            allReceipts.filter({
                "OrderDetailPage.useMemo[customerDebtBalance]": (r)=>r.payerTypeName === 'Khách hàng' && r.payerName === customer.name
            }["OrderDetailPage.useMemo[customerDebtBalance]"]).forEach({
                "OrderDetailPage.useMemo[customerDebtBalance]": (receipt)=>{
                    transactions.push({
                        date: receipt.date,
                        change: -receipt.amount
                    });
                }
            }["OrderDetailPage.useMemo[customerDebtBalance]"]);
            allPayments.filter({
                "OrderDetailPage.useMemo[customerDebtBalance]": (p)=>p.recipientTypeName === 'Khách hàng' && p.recipientName === customer.name
            }["OrderDetailPage.useMemo[customerDebtBalance]"]).forEach({
                "OrderDetailPage.useMemo[customerDebtBalance]": (payment)=>{
                    transactions.push({
                        date: payment.date,
                        change: payment.amount
                    });
                }
            }["OrderDetailPage.useMemo[customerDebtBalance]"]);
            if (!transactions.length) {
                return customer.currentDebt ?? 0;
            }
            transactions.sort({
                "OrderDetailPage.useMemo[customerDebtBalance]": (a, b)=>new Date(a.date).getTime() - new Date(b.date).getTime()
            }["OrderDetailPage.useMemo[customerDebtBalance]"]);
            let balance = 0;
            transactions.forEach({
                "OrderDetailPage.useMemo[customerDebtBalance]": (entry)=>{
                    balance += entry.change;
                }
            }["OrderDetailPage.useMemo[customerDebtBalance]"]);
            return balance;
        }
    }["OrderDetailPage.useMemo[customerDebtBalance]"], [
        customer,
        deliveredCustomerOrders,
        allReceipts,
        allPayments
    ]);
    const customerWarranties = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "OrderDetailPage.useMemo[customerWarranties]": ()=>{
            if (!customer) return [];
            return warranties.filter({
                "OrderDetailPage.useMemo[customerWarranties]": (ticket)=>ticket.customerPhone === customer.phone
            }["OrderDetailPage.useMemo[customerWarranties]"]);
        }
    }["OrderDetailPage.useMemo[customerWarranties]"], [
        customer?.phone,
        warranties
    ]);
    const customerWarrantyCount = customerWarranties.length;
    const activeWarrantyCount = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "OrderDetailPage.useMemo[activeWarrantyCount]": ()=>{
            return customerWarranties.filter({
                "OrderDetailPage.useMemo[activeWarrantyCount]": (ticket)=>![
                        'returned',
                        'completed',
                        'cancelled'
                    ].includes(ticket.status)
            }["OrderDetailPage.useMemo[activeWarrantyCount]"]).length;
        }
    }["OrderDetailPage.useMemo[activeWarrantyCount]"], [
        customerWarranties
    ]);
    const customerComplaints = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "OrderDetailPage.useMemo[customerComplaints]": ()=>{
            if (!customer) return [];
            return complaints.filter({
                "OrderDetailPage.useMemo[customerComplaints]": (complaint)=>complaint.customerSystemId === customer.systemId
            }["OrderDetailPage.useMemo[customerComplaints]"]);
        }
    }["OrderDetailPage.useMemo[customerComplaints]"], [
        customer?.systemId,
        complaints
    ]);
    const customerComplaintCount = customerComplaints.length;
    const activeComplaintCount = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "OrderDetailPage.useMemo[activeComplaintCount]": ()=>{
            return customerComplaints.filter({
                "OrderDetailPage.useMemo[activeComplaintCount]": (complaint)=>complaint.status === 'pending' || complaint.status === 'investigating'
            }["OrderDetailPage.useMemo[activeComplaintCount]"]).length;
        }
    }["OrderDetailPage.useMemo[activeComplaintCount]"], [
        customerComplaints
    ]);
    const slaDisplay = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "OrderDetailPage.useMemo[slaDisplay]": ()=>{
            if (!customer) {
                return {
                    title: 'Đúng hạn',
                    detail: 'Chưa có dữ liệu SLA',
                    tone: 'secondary'
                };
            }
            const entry = slaEngine.index?.entries?.[customer.systemId];
            const alerts = entry?.alerts ?? [];
            if (!alerts.length) {
                return {
                    title: 'Đúng hạn',
                    detail: 'Không có cảnh báo',
                    tone: 'success'
                };
            }
            const sortedAlerts = [
                ...alerts
            ].sort({
                "OrderDetailPage.useMemo[slaDisplay].sortedAlerts": (a, b)=>new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime()
            }["OrderDetailPage.useMemo[slaDisplay].sortedAlerts"]);
            const nextAlert = sortedAlerts[0];
            const remaining = nextAlert.daysRemaining;
            const timeText = remaining === 0 ? 'Hôm nay' : remaining > 0 ? `Còn ${remaining} ngày` : `Trễ ${Math.abs(remaining)} ngày`;
            const tone = remaining < 0 ? 'destructive' : nextAlert.alertLevel === 'warning' ? 'warning' : 'secondary';
            return {
                title: nextAlert.slaName,
                detail: `${timeText}${nextAlert.targetDate ? ` • hạn ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(nextAlert.targetDate)}` : ''}`,
                tone
            };
        }
    }["OrderDetailPage.useMemo[slaDisplay]"], [
        customer,
        slaEngine.index
    ]);
    // Order breakdown by status
    const orderBreakdown = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "OrderDetailPage.useMemo[orderBreakdown]": ()=>{
            const pending = customerOrders.filter({
                "OrderDetailPage.useMemo[orderBreakdown]": (o)=>o.status === 'Đặt hàng'
            }["OrderDetailPage.useMemo[orderBreakdown]"]).length;
            const inProgress = customerOrders.filter({
                "OrderDetailPage.useMemo[orderBreakdown]": (o)=>o.status === 'Đang giao dịch'
            }["OrderDetailPage.useMemo[orderBreakdown]"]).length;
            const completed = customerOrders.filter({
                "OrderDetailPage.useMemo[orderBreakdown]": (o)=>o.status === 'Hoàn thành'
            }["OrderDetailPage.useMemo[orderBreakdown]"]).length;
            const cancelled = customerOrders.filter({
                "OrderDetailPage.useMemo[orderBreakdown]": (o)=>o.status === 'Đã hủy'
            }["OrderDetailPage.useMemo[orderBreakdown]"]).length;
            return {
                pending,
                inProgress,
                completed,
                cancelled
            };
        }
    }["OrderDetailPage.useMemo[orderBreakdown]"], [
        customerOrders
    ]);
    const customerMetrics = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "OrderDetailPage.useMemo[customerMetrics]": ()=>{
            const lastOrderDate = customerOrderStats.lastOrderDate;
            return [
                {
                    key: 'orders',
                    label: 'Tổng số đơn đặt',
                    value: formatNumber(customerOrderStats.totalOrders),
                    subValue: `${orderBreakdown.pending} đặt hàng, ${orderBreakdown.inProgress} đang giao dịch, ${orderBreakdown.completed} hoàn thành, ${orderBreakdown.cancelled} đã hủy`
                },
                {
                    key: 'warranty',
                    label: 'Tổng số lần bảo hành',
                    value: formatNumber(customerWarrantyCount),
                    badge: activeWarrantyCount > 0 ? {
                        label: `${activeWarrantyCount} chưa trả`,
                        tone: 'warning'
                    } : undefined,
                    link: customer ? `/warranty?customer=${encodeURIComponent(customer.systemId)}` : undefined
                },
                {
                    key: 'complaints',
                    label: 'Tổng số lần khiếu nại',
                    value: formatNumber(customerComplaintCount),
                    badge: activeComplaintCount > 0 ? {
                        label: `${activeComplaintCount} chưa xử lý`,
                        tone: 'destructive'
                    } : undefined,
                    link: customer ? `/complaints?customer=${encodeURIComponent(customer.systemId)}` : undefined
                },
                {
                    key: 'last-order',
                    label: 'Lần đặt đơn gần nhất',
                    value: lastOrderDate ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(lastOrderDate) : '---'
                },
                {
                    key: 'failed-delivery',
                    label: 'Giao hàng thất bại',
                    value: formatNumber(customer?.failedDeliveries ?? 0)
                },
                {
                    key: 'sla',
                    label: 'SLA',
                    value: slaDisplay.title,
                    subValue: slaDisplay.detail,
                    tone: slaDisplay.tone
                }
            ];
        }
    }["OrderDetailPage.useMemo[customerMetrics]"], [
        customerOrderStats.totalOrders,
        customerOrderStats.lastOrderDate,
        customer,
        orderBreakdown,
        customerWarrantyCount,
        customerComplaintCount,
        activeWarrantyCount,
        activeComplaintCount,
        slaDisplay
    ]);
    const handleCopyOrder = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "OrderDetailPage.useCallback[handleCopyOrder]": ()=>{
            if (!order || isCopying) {
                return;
            }
            setIsCopying(true);
            try {
                router.push(`/orders/new?copy=${order.systemId}`);
            } finally{
                // Component will unmount after navigation, but keep defensive reset to be safe when navigation fails
                setTimeout({
                    "OrderDetailPage.useCallback[handleCopyOrder]": ()=>setIsCopying(false)
                }["OrderDetailPage.useCallback[handleCopyOrder]"], 300);
            }
        }
    }["OrderDetailPage.useCallback[handleCopyOrder]"], [
        order,
        isCopying,
        router
    ]);
    // Customer Settings - React Query hooks
    const { findById: findCustomerTypeById } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$hooks$2f$use$2d$all$2d$customer$2d$settings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCustomerTypeFinder"])();
    const { findById: findCustomerGroupById } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$hooks$2f$use$2d$all$2d$customer$2d$settings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCustomerGroupFinder"])();
    const { findById: findCustomerSourceById } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$hooks$2f$use$2d$all$2d$customer$2d$settings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCustomerSourceFinder"])();
    const { findById: findEmployeeById } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$hooks$2f$use$2d$all$2d$employees$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEmployeeFinder"])();
    // Branding for print
    const { logoUrl } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$branding$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBranding"])();
    const getTypeName = (id)=>id ? findCustomerTypeById(id)?.name : undefined;
    const getGroupName = (id)=>id ? findCustomerGroupById(id)?.name : undefined;
    const getSourceName = (id)=>id ? findCustomerSourceById(id)?.name : undefined;
    const getEmployeeName = (id)=>id ? findEmployeeById((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(id))?.fullName : undefined;
    // Get salesperson employee for print
    const salespersonEmployee = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "OrderDetailPage.useMemo[salespersonEmployee]": ()=>{
            if (!order?.salespersonSystemId) return null;
            return findEmployeeById((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(order.salespersonSystemId));
        }
    }["OrderDetailPage.useMemo[salespersonEmployee]"], [
        order?.salespersonSystemId,
        findEmployeeById
    ]);
    const [isCancelAlertOpen, setIsCancelAlertOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    const [cancelReasonText, setCancelReasonText] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]('');
    const [restockItems, setRestockItems] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](true);
    const [isPaymentDialogOpen, setIsPaymentDialogOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    const [isCreateShipmentDialogOpen, setIsCreateShipmentDialogOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    const [isPackerSelectionOpen, setIsPackerSelectionOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    const [cancelPackagingState, setCancelPackagingState] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](null);
    const [cancelShipmentState, setCancelShipmentState] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](null);
    const [hasOrderWorkflowTemplate, setHasOrderWorkflowTemplate] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](true);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "OrderDetailPage.useEffect": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            try {
                const templates = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$workflow$2d$templates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__getWorkflowTemplatesSync__as__getWorkflowTemplates$3e$__["getWorkflowTemplates"])();
                const orderTemplates = templates.filter({
                    "OrderDetailPage.useEffect.orderTemplates": (t)=>t.name === 'orders'
                }["OrderDetailPage.useEffect.orderTemplates"]);
                setHasOrderWorkflowTemplate(orderTemplates.length > 0);
            } catch (error) {
                console.error('[OrderDetail] Failed to load workflow templates', error);
                setHasOrderWorkflowTemplate(true);
            }
        }
    }["OrderDetailPage.useEffect"], []);
    const resetCancelForm = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "OrderDetailPage.useCallback[resetCancelForm]": ()=>{
            setCancelReasonText('');
            setRestockItems(true);
        }
    }["OrderDetailPage.useCallback[resetCancelForm]"], []);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "OrderDetailPage.useEffect": ()=>{
            if (!isCancelAlertOpen) {
                resetCancelForm();
            }
        }
    }["OrderDetailPage.useEffect"], [
        isCancelAlertOpen,
        resetCancelForm
    ]);
    const salesReturnsForOrder = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "OrderDetailPage.useMemo[salesReturnsForOrder]": ()=>{
            if (!order) return [];
            return allSalesReturns.filter({
                "OrderDetailPage.useMemo[salesReturnsForOrder]": (sr)=>sr.orderSystemId === order.systemId
            }["OrderDetailPage.useMemo[salesReturnsForOrder]"]);
        }
    }["OrderDetailPage.useMemo[salesReturnsForOrder]"], [
        order,
        allSalesReturns
    ]);
    const totalReturnedValue = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "OrderDetailPage.useMemo[totalReturnedValue]": ()=>salesReturnsForOrder.reduce({
                "OrderDetailPage.useMemo[totalReturnedValue]": (sum, sr)=>sum + sr.totalReturnValue
            }["OrderDetailPage.useMemo[totalReturnedValue]"], 0)
    }["OrderDetailPage.useMemo[totalReturnedValue]"], [
        salesReturnsForOrder
    ]);
    // Tính tổng số tiền đã hoàn cho khách từ các phiếu trả hàng
    const totalRefundedFromReturns = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "OrderDetailPage.useMemo[totalRefundedFromReturns]": ()=>salesReturnsForOrder.reduce({
                "OrderDetailPage.useMemo[totalRefundedFromReturns]": (sum, sr)=>{
                    const refundFromArray = (sr.refunds || []).reduce({
                        "OrderDetailPage.useMemo[totalRefundedFromReturns].refundFromArray": (s, r)=>s + (r.amount || 0)
                    }["OrderDetailPage.useMemo[totalRefundedFromReturns].refundFromArray"], 0);
                    return sum + (refundFromArray || sr.refundAmount || 0);
                }
            }["OrderDetailPage.useMemo[totalRefundedFromReturns]"], 0)
    }["OrderDetailPage.useMemo[totalRefundedFromReturns]"], [
        salesReturnsForOrder
    ]);
    // Lấy các phiếu chi hoàn tiền liên quan đến đơn hàng này (từ sales returns)
    const refundPaymentsForOrder = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "OrderDetailPage.useMemo[refundPaymentsForOrder]": ()=>{
            if (!order) return [];
            return allPayments.filter({
                "OrderDetailPage.useMemo[refundPaymentsForOrder]": (p)=>p.status !== 'cancelled' && (p.linkedOrderSystemId === order.systemId || salesReturnsForOrder.some({
                        "OrderDetailPage.useMemo[refundPaymentsForOrder]": (sr)=>sr.paymentVoucherSystemIds?.includes(p.systemId)
                    }["OrderDetailPage.useMemo[refundPaymentsForOrder]"]))
            }["OrderDetailPage.useMemo[refundPaymentsForOrder]"]);
        }
    }["OrderDetailPage.useMemo[refundPaymentsForOrder]"], [
        order,
        allPayments,
        salesReturnsForOrder
    ]);
    const totalPaid = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "OrderDetailPage.useMemo[totalPaid]": ()=>(order?.payments || []).reduce({
                "OrderDetailPage.useMemo[totalPaid]": (sum, p)=>sum + p.amount
            }["OrderDetailPage.useMemo[totalPaid]"], 0)
    }["OrderDetailPage.useMemo[totalPaid]"], [
        order?.payments
    ]);
    // totalPaid: số tiền khách đã thanh toán
    // totalRefundedFromReturns: số tiền đã hoàn lại cho khách (từ sales returns)
    // netGrandTotal: công nợ thực tế sau khi trừ hàng trả
    // amountRemaining = netGrandTotal - totalPaid + totalRefundedFromReturns
    const netGrandTotal = Math.max(0, (order?.grandTotal || 0) - totalReturnedValue);
    const amountRemaining = netGrandTotal - totalPaid + totalRefundedFromReturns;
    const totalLineQuantity = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "OrderDetailPage.useMemo[totalLineQuantity]": ()=>{
            if (!order) return 0;
            return order.lineItems.reduce({
                "OrderDetailPage.useMemo[totalLineQuantity]": (sum, item)=>sum + item.quantity
            }["OrderDetailPage.useMemo[totalLineQuantity]"], 0);
        }
    }["OrderDetailPage.useMemo[totalLineQuantity]"], [
        order
    ]);
    const codPayments = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "OrderDetailPage.useMemo[codPayments]": ()=>(order?.payments || []).filter({
                "OrderDetailPage.useMemo[codPayments]": (p)=>p.method === 'Đối soát COD'
            }["OrderDetailPage.useMemo[codPayments]"])
    }["OrderDetailPage.useMemo[codPayments]"], [
        order?.payments
    ]);
    const directPayments = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "OrderDetailPage.useMemo[directPayments]": ()=>(order?.payments || []).filter({
                "OrderDetailPage.useMemo[directPayments]": (p)=>p.method !== 'Đối soát COD'
            }["OrderDetailPage.useMemo[directPayments]"])
    }["OrderDetailPage.useMemo[directPayments]"], [
        order?.payments
    ]);
    const totalActiveCod = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "OrderDetailPage.useMemo[totalActiveCod]": ()=>{
            if (!order?.packagings) return 0;
            return order.packagings.reduce({
                "OrderDetailPage.useMemo[totalActiveCod]": (sum, pkg)=>{
                    const activeCodStatuses = [
                        'Chờ lấy hàng',
                        'Đang giao hàng',
                        'Đã giao hàng'
                    ];
                    if (pkg.status !== 'Hủy đóng gói' && pkg.reconciliationStatus !== 'Đã đối soát' && pkg.deliveryStatus && activeCodStatuses.includes(pkg.deliveryStatus)) {
                        return sum + (pkg.codAmount || 0);
                    }
                    return sum;
                }
            }["OrderDetailPage.useMemo[totalActiveCod]"], 0);
        }
    }["OrderDetailPage.useMemo[totalActiveCod]"], [
        order
    ]);
    const totalCodAmount = totalActiveCod + codPayments.reduce((s, p)=>s + p.amount, 0);
    const payableAmount = Math.max(0, amountRemaining);
    const getProductTypeLabel = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "OrderDetailPage.useCallback[getProductTypeLabel]": (productSystemId)=>{
            const product = findProductById(productSystemId);
            if (!product) return '---';
            if (product.productTypeSystemId) {
                const productType = findProductTypeById(product.productTypeSystemId);
                if (productType?.name) {
                    return productType.name;
                }
            }
            if (product.type && productTypeFallbackLabels[product.type]) {
                return productTypeFallbackLabels[product.type];
            }
            return 'Hàng hóa';
        }
    }["OrderDetailPage.useCallback[getProductTypeLabel]"], [
        findProductById,
        findProductTypeById
    ]);
    const { costOfGoods, profit, totalDiscount } = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "OrderDetailPage.useMemo": ()=>{
            if (!order) return {
                costOfGoods: 0,
                profit: 0,
                totalDiscount: 0
            };
            const cost = order.lineItems.reduce({
                "OrderDetailPage.useMemo.cost": (sum, item)=>{
                    const product = findProductById(item.productSystemId);
                    return sum + (product?.costPrice || 0) * item.quantity;
                }
            }["OrderDetailPage.useMemo.cost"], 0);
            const discount = order.lineItems.reduce({
                "OrderDetailPage.useMemo.discount": (sum, item)=>{
                    const lineGross = item.unitPrice * item.quantity;
                    const discountAmount = item.discountType === 'percentage' ? lineGross * (item.discount / 100) : item.discount;
                    return sum + discountAmount * item.quantity;
                }
            }["OrderDetailPage.useMemo.discount"], 0);
            const profit = order.subtotal - cost;
            return {
                costOfGoods: cost,
                profit: profit,
                totalDiscount: discount
            };
        }
    }["OrderDetailPage.useMemo"], [
        order,
        findProductById
    ]);
    const isActionable = order?.status !== 'Hoàn thành' && order?.status !== 'Đã hủy';
    const activePackaging = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "OrderDetailPage.useMemo[activePackaging]": ()=>{
            if (!order || !order.packagings || order.packagings.length === 0) {
                return null;
            }
            return [
                ...order.packagings
            ].reverse().find({
                "OrderDetailPage.useMemo[activePackaging]": (p)=>p.status !== 'Hủy đóng gói'
            }["OrderDetailPage.useMemo[activePackaging]"]) || null;
        }
    }["OrderDetailPage.useMemo[activePackaging]"], [
        order
    ]);
    const existingPackerSystemId = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "OrderDetailPage.useMemo[existingPackerSystemId]": ()=>{
            if (!order) {
                return undefined;
            }
            const explicitPacker = order.assignedPackerSystemId || order.assignedPackerSystemId || order.packerId;
            if (explicitPacker) {
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(explicitPacker);
            }
            if (activePackaging?.assignedEmployeeId) {
                return activePackaging.assignedEmployeeId;
            }
            const fallbackPackaging = [
                ...order.packagings ?? []
            ].reverse().find({
                "OrderDetailPage.useMemo[existingPackerSystemId].fallbackPackaging": (pkg)=>pkg.assignedEmployeeId
            }["OrderDetailPage.useMemo[existingPackerSystemId].fallbackPackaging"]);
            return fallbackPackaging?.assignedEmployeeId;
        }
    }["OrderDetailPage.useMemo[existingPackerSystemId]"], [
        order,
        activePackaging
    ]);
    // Auto-sync GHTK status on page load
    const [isSyncing, setIsSyncing] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "OrderDetailPage.useEffect": ()=>{
            if (!order) return;
            const ghtkPackagings = order.packagings.filter({
                "OrderDetailPage.useEffect.ghtkPackagings": (p)=>p.carrier === 'GHTK' && p.trackingCode
            }["OrderDetailPage.useEffect.ghtkPackagings"]);
            if (ghtkPackagings.length === 0) return;
            setIsSyncing(true);
            // Dynamically import to avoid circular dependencies
            __turbopack_context__.A("[project]/lib/ghtk-sync-service.ts [app-client] (ecmascript, async loader)").then({
                "OrderDetailPage.useEffect": ({ ghtkSyncService })=>{
                    ghtkSyncService.syncOrder(order.systemId).catch({
                        "OrderDetailPage.useEffect": (error)=>{
                            console.error('[Order Detail] GHTK sync failed:', error);
                        }
                    }["OrderDetailPage.useEffect"]).finally({
                        "OrderDetailPage.useEffect": ()=>{
                            setIsSyncing(false);
                        }
                    }["OrderDetailPage.useEffect"]);
                }
            }["OrderDetailPage.useEffect"]);
        }
    }["OrderDetailPage.useEffect"], [
        order?.systemId
    ]);
    const handleConfirmCancel = async ()=>{
        if (!order) return;
        const finalReason = cancelReasonText.trim();
        if (!finalReason) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Vui lòng nhập lý do hủy đơn hàng.');
            return;
        }
        const cancelOptions = {
            reason: finalReason,
            restock: restockItems
        };
        // Check if order has active GHTK shipment that needs to be cancelled
        const ghtkPackaging = order.packagings.find((p)=>p.carrier === 'GHTK' && p.trackingCode && p.status !== 'Hủy đóng gói' && p.deliveryStatus !== 'Đã giao hàng' && p.deliveryStatus !== 'Đã hủy');
        if (ghtkPackaging && ghtkPackaging.trackingCode) {
            try {
                console.log('[Cancel Order] Attempting to cancel GHTK shipment first:', ghtkPackaging.trackingCode);
                const { cancelGHTKShipment } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOrderStore"].getState();
                const result = await cancelGHTKShipment(order.systemId, ghtkPackaging.systemId, ghtkPackaging.trackingCode);
                if (!result.success) {
                    // GHTK cancel failed, show toast with action to continue
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Không thể hủy vận đơn GHTK: ${result.message}`, {
                        description: 'Bạn có muốn tiếp tục hủy đơn hàng không?',
                        action: {
                            label: 'Tiếp tục',
                            onClick: ()=>{
                                cancelOrder(order.systemId, currentEmployeeSystemId, cancelOptions);
                                resetCancelForm();
                                setIsCancelAlertOpen(false);
                            }
                        },
                        cancel: {
                            label: 'Hủy bỏ',
                            onClick: ()=>{
                                setIsCancelAlertOpen(false);
                            }
                        }
                    });
                    return;
                }
            } catch (error) {
                console.error('[Cancel Order] GHTK cancel error:', error);
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Lỗi khi hủy vận đơn GHTK: ${error.message}`, {
                    description: 'Bạn có muốn tiếp tục hủy đơn hàng không?',
                    action: {
                        label: 'Tiếp tục',
                        onClick: ()=>{
                            cancelOrder(order.systemId, currentEmployeeSystemId, cancelOptions);
                            resetCancelForm();
                            setIsCancelAlertOpen(false);
                        }
                    },
                    cancel: {
                        label: 'Hủy bỏ',
                        onClick: ()=>{
                            setIsCancelAlertOpen(false);
                        }
                    }
                });
                return;
            }
        }
        // Proceed with order cancellation
        cancelOrder(order.systemId, currentEmployeeSystemId, cancelOptions);
        resetCancelForm();
        setIsCancelAlertOpen(false);
    };
    const handleAddPayment = (paymentData)=>{
        if (order) {
            addPayment(order.systemId, paymentData, currentEmployeeSystemId);
            setIsPaymentDialogOpen(false);
        }
    };
    const handleRequestPackaging = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "OrderDetailPage.useCallback[handleRequestPackaging]": (assignedEmployeeId)=>{
            if (order) {
                requestPackaging(order.systemId, currentEmployeeSystemId, assignedEmployeeId);
            }
        }
    }["OrderDetailPage.useCallback[handleRequestPackaging]"], [
        order,
        requestPackaging,
        currentEmployeeSystemId
    ]);
    const handleConfirmPackaging = (packagingSystemId)=>{
        if (order) {
            confirmPackaging(order.systemId, packagingSystemId, currentEmployeeSystemId);
        }
    };
    const handleCancelPackagingSubmit = (reason)=>{
        if (order && cancelPackagingState) {
            cancelPackagingRequest(order.systemId, cancelPackagingState.packagingSystemId, currentEmployeeSystemId, reason);
            setCancelPackagingState(null);
        }
    };
    const handleInStorePickup = (packagingSystemId)=>{
        if (order) {
            processInStorePickup(order.systemId, packagingSystemId);
        }
    };
    const handleShippingSubmit = (data)=>{
        if (order && activePackaging) {
            return confirmPartnerShipment(order.systemId, activePackaging.systemId, data);
        }
        return Promise.resolve({
            success: false,
            message: 'Đơn hàng không hợp lệ'
        });
    };
    const handleDispatch = (packagingSystemId)=>{
        if (order) {
            const pkg = order.packagings.find((p)=>p.systemId === packagingSystemId);
            if (pkg?.deliveryMethod === 'Nhận tại cửa hàng') {
                confirmInStorePickup(order.systemId, packagingSystemId, currentEmployeeSystemId);
            } else {
                dispatchFromWarehouse(order.systemId, packagingSystemId, currentEmployeeSystemId);
            }
        }
    };
    const handleCompleteDelivery = (packagingSystemId)=>{
        if (order) {
            completeDelivery(order.systemId, packagingSystemId, currentEmployeeSystemId);
        }
    };
    const handleFailDeliverySubmit = (reason)=>{
        if (order && cancelShipmentState) {
            failDelivery(order.systemId, cancelShipmentState.packagingSystemId, currentEmployeeSystemId, reason);
            setCancelShipmentState(null);
        }
    };
    // ✅ Hủy giao hàng - KHÔNG trả hàng về kho (hàng bị thất tung/shipper giữ)
    const handleCancelDeliveryOnly = async ()=>{
        if (order && cancelShipmentState) {
            const packaging = order.packagings.find((p)=>p.systemId === cancelShipmentState.packagingSystemId);
            const trackingCode = packaging?.trackingCode;
            // Nếu có tracking code GHTK, gọi API hủy trước
            if (trackingCode && trackingCode.startsWith('S')) {
                try {
                    const result = await cancelGHTKShipment(order.systemId, cancelShipmentState.packagingSystemId, trackingCode);
                    if (!result.success) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`⚠️ Không thể hủy vận đơn GHTK: ${result.message}\n\nVui lòng hủy trên hệ thống đối tác.`);
                        setCancelShipmentState(null);
                        return;
                    }
                } catch (error) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`⚠️ Lỗi khi hủy vận đơn GHTK: ${error.message || 'Không rõ lỗi'}\n\nVui lòng hủy trên hệ thống đối tác.`);
                    setCancelShipmentState(null);
                    return;
                }
            }
            // ✅ Chỉ update trạng thái, KHÔNG trả hàng về kho
            cancelDeliveryOnly(order.systemId, cancelShipmentState.packagingSystemId, currentEmployeeSystemId, "Hủy giao hàng");
            setCancelShipmentState(null);
        }
    };
    // ✅ Hủy giao và nhận lại hàng - TRẢ hàng về kho (đã nhận lại từ shipper)
    const handleCancelDeliveryAndRestock = async ()=>{
        if (order && cancelShipmentState) {
            const packaging = order.packagings.find((p)=>p.systemId === cancelShipmentState.packagingSystemId);
            const trackingCode = packaging?.trackingCode;
            // Nếu có tracking code GHTK, gọi API hủy trước
            if (trackingCode && trackingCode.startsWith('S')) {
                try {
                    const result = await cancelGHTKShipment(order.systemId, cancelShipmentState.packagingSystemId, trackingCode);
                    if (!result.success) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`⚠️ Không thể hủy vận đơn GHTK: ${result.message}\n\nVui lòng hủy trên hệ thống đối tác.`);
                        setCancelShipmentState(null);
                        return;
                    }
                } catch (error) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`⚠️ Lỗi khi hủy vận đơn GHTK: ${error.message || 'Không rõ lỗi'}\n\nVui lòng hủy trên hệ thống đối tác.`);
                    setCancelShipmentState(null);
                    return;
                }
            }
            // ✅ Update trạng thái + TRẢ hàng về kho
            cancelDelivery(order.systemId, cancelShipmentState.packagingSystemId, currentEmployeeSystemId, "Hủy giao và nhận lại hàng");
            setCancelShipmentState(null);
        }
    };
    const handleCancelGHTKShipment = async (packagingSystemId, trackingCode)=>{
        if (!order) return;
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].info('Đang hủy vận đơn GHTK...', {
            description: 'Lưu ý: Chỉ có thể hủy khi đơn chưa được lấy hàng.'
        });
        try {
            const result = await cancelGHTKShipment(order.systemId, packagingSystemId, trackingCode);
            if (result.success) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Đã hủy vận đơn GHTK thành công!');
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Lỗi: ${result.message}`);
            }
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Lỗi: ${error.message || 'Không thể hủy vận đơn'}`);
        }
    };
    const handleRequestPackagingClick = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "OrderDetailPage.useCallback[handleRequestPackagingClick]": ()=>{
            if (existingPackerSystemId) {
                handleRequestPackaging(existingPackerSystemId);
                return;
            }
            setIsPackerSelectionOpen(true);
        }
    }["OrderDetailPage.useCallback[handleRequestPackagingClick]"], [
        existingPackerSystemId,
        handleRequestPackaging,
        setIsPackerSelectionOpen
    ]);
    const headerActions = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "OrderDetailPage.useMemo[headerActions]": ()=>{
            if (!order) {
                return [];
            }
            const canReturn = order.status !== 'Đã hủy' && order.returnStatus !== 'Trả hàng toàn bộ' && order.stockOutStatus !== 'Chưa xuất kho';
            const canRequestPackaging = isActionable && (!activePackaging || activePackaging.deliveryStatus === 'Chờ giao lại');
            const canConfirmPackaging = activePackaging?.status === 'Chờ đóng gói';
            const canShip = activePackaging?.status === 'Đã đóng gói' && activePackaging?.deliveryStatus === 'Chờ lấy hàng' && order.stockOutStatus !== 'Chưa xuất kho';
            // ✅ Chỉ hiện nút Xuất kho khi đã đóng gói xong VÀ đã chọn hình thức giao hàng (theo yêu cầu user)
            const canStockOut = order.stockOutStatus === 'Chưa xuất kho' && order.status !== 'Đã hủy' && activePackaging?.status === 'Đã đóng gói' && !!activePackaging?.deliveryMethod;
            const actions = [];
            if (canStockOut) {
                actions.push(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                    size: "sm",
                    className: "h-9",
                    onClick: {
                        "OrderDetailPage.useMemo[headerActions]": ()=>{
                            if (activePackaging) {
                                handleDispatch(activePackaging.systemId);
                            } else {
                                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Vui lòng tạo yêu cầu đóng gói trước khi xuất kho');
                            }
                        }
                    }["OrderDetailPage.useMemo[headerActions]"],
                    children: "Xác nhận xuất kho"
                }, "stockout", false, {
                    fileName: "[project]/features/orders/order-detail-page.tsx",
                    lineNumber: 2233,
                    columnNumber: 17
                }, this));
            }
            if (canRequestPackaging) {
                actions.push(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                    size: "sm",
                    className: "h-9",
                    onClick: handleRequestPackagingClick,
                    children: "Yêu cầu đóng gói"
                }, "request-packaging", false, {
                    fileName: "[project]/features/orders/order-detail-page.tsx",
                    lineNumber: 2252,
                    columnNumber: 17
                }, this));
            }
            if (canConfirmPackaging) {
                actions.push(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                    size: "sm",
                    className: "h-9",
                    onClick: {
                        "OrderDetailPage.useMemo[headerActions]": ()=>{
                            if (activePackaging) {
                                handleConfirmPackaging(activePackaging.systemId);
                            } else {
                                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Không tìm thấy gói hàng cần đóng gói');
                            }
                        }
                    }["OrderDetailPage.useMemo[headerActions]"],
                    children: "Xác nhận đóng gói"
                }, "confirm-packaging", false, {
                    fileName: "[project]/features/orders/order-detail-page.tsx",
                    lineNumber: 2260,
                    columnNumber: 17
                }, this));
            }
            if (canShip) {
                actions.push(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                    size: "sm",
                    className: "h-9",
                    onClick: {
                        "OrderDetailPage.useMemo[headerActions]": ()=>{
                            if (activePackaging) {
                                handleDispatch(activePackaging.systemId);
                            } else {
                                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Không tìm thấy gói hàng để giao');
                            }
                        }
                    }["OrderDetailPage.useMemo[headerActions]"],
                    children: "Giao hàng"
                }, "ship", false, {
                    fileName: "[project]/features/orders/order-detail-page.tsx",
                    lineNumber: 2279,
                    columnNumber: 17
                }, this));
            }
            if (canReturn) {
                actions.push(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                    variant: "outline",
                    size: "sm",
                    className: "h-9",
                    onClick: {
                        "OrderDetailPage.useMemo[headerActions]": ()=>router.push(`/orders/${order.systemId}/return`)
                    }["OrderDetailPage.useMemo[headerActions]"],
                    children: "Hoàn trả hàng"
                }, "return", false, {
                    fileName: "[project]/features/orders/order-detail-page.tsx",
                    lineNumber: 2298,
                    columnNumber: 17
                }, this));
            }
            // Cho phép hủy đơn nếu:
            // - Chưa hủy
            // - Chưa có phiếu trả hàng (nếu đã trả hàng thì không được hủy vì sẽ gây rối stock và công nợ)
            const canCancelOrder = order.status !== 'Đã hủy' && (!order.returnStatus || order.returnStatus === 'Chưa trả hàng');
            if (canCancelOrder) {
                actions.push(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                    variant: "outline",
                    size: "sm",
                    className: "h-9 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground",
                    onClick: {
                        "OrderDetailPage.useMemo[headerActions]": ()=>setIsCancelAlertOpen(true)
                    }["OrderDetailPage.useMemo[headerActions]"],
                    children: "Hủy đơn hàng"
                }, "cancel", false, {
                    fileName: "[project]/features/orders/order-detail-page.tsx",
                    lineNumber: 2318,
                    columnNumber: 17
                }, this));
            }
            if (order.status !== 'Đã hủy') {
                actions.push(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                    variant: "outline",
                    size: "sm",
                    className: "h-9",
                    onClick: {
                        "OrderDetailPage.useMemo[headerActions]": ()=>router.push(`/orders/${order.systemId}/edit`)
                    }["OrderDetailPage.useMemo[headerActions]"],
                    children: "Sửa"
                }, "edit", false, {
                    fileName: "[project]/features/orders/order-detail-page.tsx",
                    lineNumber: 2332,
                    columnNumber: 17
                }, this));
            }
            return actions;
        }
    }["OrderDetailPage.useMemo[headerActions]"], [
        order,
        isActionable,
        router,
        setIsCancelAlertOpen,
        activePackaging,
        handleRequestPackagingClick
    ]);
    const displayStatus = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "OrderDetailPage.useMemo[displayStatus]": ()=>{
            if (!order) return undefined;
            // Fix for existing orders that are stuck in 'Đặt hàng' but have been dispatched
            if (order.status === 'Đặt hàng' && (order.stockOutStatus === 'Xuất kho toàn bộ' || order.deliveryStatus === 'Đang giao hàng' || order.deliveryStatus === 'Đã giao hàng')) {
                return 'Đang giao dịch';
            }
            return order.status;
        }
    }["OrderDetailPage.useMemo[displayStatus]"], [
        order
    ]);
    const headerBadge = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "OrderDetailPage.useMemo[headerBadge]": ()=>{
            if (!order || !displayStatus) {
                return undefined;
            }
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$components$2f$order$2d$print$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OrderPrintButton"], {
                        order: order,
                        customer: customer,
                        branch: orderBranch,
                        createdByEmployee: salespersonEmployee,
                        logoUrl: (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$branding$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFullLogoUrl"])(logoUrl)
                    }, void 0, false, {
                        fileName: "[project]/features/orders/order-detail-page.tsx",
                        lineNumber: 2362,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        variant: "outline",
                        size: "sm",
                        className: "h-7",
                        onClick: handleCopyOrder,
                        disabled: isCopying,
                        children: [
                            isCopying ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$spinner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Spinner"], {
                                className: "mr-2 h-4 w-4"
                            }, void 0, false, {
                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                lineNumber: 2377,
                                columnNumber: 25
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                                className: "mr-2 h-4 w-4"
                            }, void 0, false, {
                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                lineNumber: 2379,
                                columnNumber: 25
                            }, this),
                            "Sao chép"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/orders/order-detail-page.tsx",
                        lineNumber: 2369,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                        variant: statusVariants[displayStatus],
                        className: "uppercase tracking-wide",
                        children: displayStatus
                    }, void 0, false, {
                        fileName: "[project]/features/orders/order-detail-page.tsx",
                        lineNumber: 2383,
                        columnNumber: 17
                    }, this),
                    order.returnStatus === 'Trả hàng một phần' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                        variant: "outline",
                        className: "border-orange-500 text-orange-600 bg-orange-50",
                        children: "Trả hàng một phần"
                    }, void 0, false, {
                        fileName: "[project]/features/orders/order-detail-page.tsx",
                        lineNumber: 2387,
                        columnNumber: 21
                    }, this),
                    order.returnStatus === 'Trả hàng toàn bộ' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                        variant: "outline",
                        className: "border-red-500 text-red-600 bg-red-50",
                        children: "Trả hàng toàn bộ"
                    }, void 0, false, {
                        fileName: "[project]/features/orders/order-detail-page.tsx",
                        lineNumber: 2392,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/orders/order-detail-page.tsx",
                lineNumber: 2361,
                columnNumber: 13
            }, this);
        }
    }["OrderDetailPage.useMemo[headerBadge]"], [
        order,
        displayStatus,
        handleCopyOrder,
        isCopying,
        customer,
        orderBranch,
        salespersonEmployee,
        logoUrl
    ]);
    const breadcrumb = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "OrderDetailPage.useMemo[breadcrumb]": ()=>[
                {
                    label: 'Trang chủ',
                    href: '/',
                    isCurrent: false
                },
                {
                    label: 'Đơn hàng',
                    href: '/orders',
                    isCurrent: false
                },
                {
                    label: order?.id ? `Đơn ${order.id}` : 'Chi tiết',
                    href: order ? `/orders/${order.systemId}` : '/orders',
                    isCurrent: true
                }
            ]
    }["OrderDetailPage.useMemo[breadcrumb]"], [
        order
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$page$2d$header$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePageHeader"])({
        title: order ? `Đơn hàng ${order.id}` : 'Chi tiết đơn hàng',
        breadcrumb,
        badge: headerBadge,
        actions: headerActions
    });
    if (!order) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex h-full items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-2xl font-bold",
                        children: "Không tìm thấy đơn hàng."
                    }, void 0, false, {
                        fileName: "[project]/features/orders/order-detail-page.tsx",
                        lineNumber: 2417,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        onClick: ()=>router.push('/orders'),
                        className: "mt-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                className: "mr-2 h-4 w-4"
                            }, void 0, false, {
                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                lineNumber: 2419,
                                columnNumber: 25
                            }, this),
                            "Quay về danh sách đơn hàng"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/orders/order-detail-page.tsx",
                        lineNumber: 2418,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/orders/order-detail-page.tsx",
                lineNumber: 2416,
                columnNumber: 17
            }, this)
        }, void 0, false, {
            fileName: "[project]/features/orders/order-detail-page.tsx",
            lineNumber: 2415,
            columnNumber: 13
        }, this);
    }
    // ✅ Ưu tiên địa chỉ đã lưu trong đơn hàng, fallback về địa chỉ mặc định của khách hàng
    const shippingAddress = formatAddressObject(order.shippingAddress) || (customer ? getCustomerAddress(customer, 'shipping') : '');
    const billingAddress = formatAddressObject(order.billingAddress) || (customer ? getCustomerAddress(customer, 'billing') : '');
    const isBillingSameAsShipping = shippingAddress === billingAddress || !billingAddress;
    const renderMainPackagingActionButtons = ()=>{
        if (!isActionable) return null;
        const canRequestPackaging = !activePackaging || activePackaging.deliveryStatus === 'Chờ giao lại';
        if (canRequestPackaging) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                size: "sm",
                onClick: handleRequestPackagingClick,
                children: "Yêu cầu đóng gói"
            }, void 0, false, {
                fileName: "[project]/features/orders/order-detail-page.tsx",
                lineNumber: 2439,
                columnNumber: 20
            }, this);
        }
        return null;
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-4 md:space-y-6",
                children: [
                    isSyncing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                        className: "border-blue-200 bg-blue-50",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                            className: "p-3",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 text-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$spinner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Spinner"], {
                                        className: "h-4 w-4 text-blue-600"
                                    }, void 0, false, {
                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                        lineNumber: 2453,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-blue-900",
                                        children: "Đang đồng bộ trạng thái vận chuyển GHTK..."
                                    }, void 0, false, {
                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                        lineNumber: 2454,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                lineNumber: 2452,
                                columnNumber: 29
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/features/orders/order-detail-page.tsx",
                            lineNumber: 2451,
                            columnNumber: 25
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/features/orders/order-detail-page.tsx",
                        lineNumber: 2450,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                            className: "p-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatusStepper, {
                                order: order
                            }, void 0, false, {
                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                lineNumber: 2463,
                                columnNumber: 25
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/features/orders/order-detail-page.tsx",
                            lineNumber: 2462,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/features/orders/order-detail-page.tsx",
                        lineNumber: 2461,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 lg:grid-cols-10 gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                className: "lg:col-span-4 flex flex-col",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                        className: "flex-shrink-0",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                            className: "text-base font-semibold",
                                            children: "Thông tin khách hàng"
                                        }, void 0, false, {
                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                            lineNumber: 2472,
                                            columnNumber: 29
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                        lineNumber: 2471,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                        className: "flex-1",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "font-semibold text-primary cursor-pointer hover:underline text-lg",
                                                            onClick: ()=>router.push(`/customers/${customer?.systemId}`),
                                                            children: order.customerName
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                                            lineNumber: 2478,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1",
                                                            children: [
                                                                customer?.phone && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "font-medium text-foreground inline-flex items-center gap-1",
                                                                    children: [
                                                                        customer.phone,
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                                                                            className: "h-3 w-3 cursor-pointer text-muted-foreground hover:text-foreground",
                                                                            onClick: ()=>{
                                                                                navigator.clipboard.writeText(customer.phone);
                                                                                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Đã sao chép số điện thoại');
                                                                            }
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                            lineNumber: 2483,
                                                                            columnNumber: 49
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                    lineNumber: 2481,
                                                                    columnNumber: 45
                                                                }, this),
                                                                customer?.email && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "inline-flex items-center gap-1",
                                                                    children: [
                                                                        customer.email,
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                                                                            className: "h-3 w-3 cursor-pointer text-muted-foreground hover:text-foreground",
                                                                            onClick: ()=>{
                                                                                navigator.clipboard.writeText(customer.email);
                                                                                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Đã sao chép email');
                                                                            }
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                            lineNumber: 2492,
                                                                            columnNumber: 49
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                    lineNumber: 2490,
                                                                    columnNumber: 45
                                                                }, this),
                                                                customer?.taxCode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "inline-flex items-center gap-1",
                                                                    children: [
                                                                        "MST: ",
                                                                        customer.taxCode,
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                                                                            className: "h-3 w-3 cursor-pointer text-muted-foreground hover:text-foreground",
                                                                            onClick: ()=>{
                                                                                navigator.clipboard.writeText(customer.taxCode);
                                                                                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Đã sao chép mã số thuế');
                                                                            }
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                            lineNumber: 2501,
                                                                            columnNumber: 49
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                    lineNumber: 2499,
                                                                    columnNumber: 45
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                                            lineNumber: 2479,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                    lineNumber: 2477,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1",
                                                            children: "Địa chỉ giao hàng"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                                            lineNumber: 2512,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-start gap-1",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm flex-1",
                                                                    children: shippingAddress || 'Chưa có thông tin giao hàng'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                    lineNumber: 2514,
                                                                    columnNumber: 41
                                                                }, this),
                                                                shippingAddress && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                                                                    className: "h-3 w-3 cursor-pointer text-muted-foreground hover:text-foreground flex-shrink-0 mt-0.5",
                                                                    onClick: ()=>{
                                                                        navigator.clipboard.writeText(shippingAddress);
                                                                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Đã sao chép địa chỉ giao hàng');
                                                                    }
                                                                }, void 0, false, {
                                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                    lineNumber: 2516,
                                                                    columnNumber: 45
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                                            lineNumber: 2513,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                    lineNumber: 2511,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1",
                                                            children: "Địa chỉ nhận hóa đơn"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                                            lineNumber: 2526,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-start gap-1",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm flex-1",
                                                                    children: billingAddress || '-'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                    lineNumber: 2528,
                                                                    columnNumber: 41
                                                                }, this),
                                                                billingAddress && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                                                                    className: "h-3 w-3 cursor-pointer text-muted-foreground hover:text-foreground flex-shrink-0 mt-0.5",
                                                                    onClick: ()=>{
                                                                        navigator.clipboard.writeText(billingAddress);
                                                                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Đã sao chép địa chỉ hóa đơn');
                                                                    }
                                                                }, void 0, false, {
                                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                    lineNumber: 2530,
                                                                    columnNumber: 45
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                                            lineNumber: 2527,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                    lineNumber: 2525,
                                                    columnNumber: 33
                                                }, this),
                                                customer?.tags && customer.tags.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1",
                                                            children: "Tags"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                                            lineNumber: 2541,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-wrap gap-1",
                                                            children: customer.tags.map((tag, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                                    variant: "outline",
                                                                    className: "text-xs font-normal",
                                                                    children: tag
                                                                }, idx, false, {
                                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                    lineNumber: 2544,
                                                                    columnNumber: 49
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                                            lineNumber: 2542,
                                                            columnNumber: 41
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                    lineNumber: 2540,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-sm space-y-1.5 border-t border-border pt-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex justify-between",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-muted-foreground",
                                                                    children: "Nhóm KH:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                    lineNumber: 2553,
                                                                    columnNumber: 41
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "font-medium",
                                                                    children: getGroupName(customer?.customerGroup) || '---'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                    lineNumber: 2554,
                                                                    columnNumber: 41
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                                            lineNumber: 2552,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex justify-between",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-muted-foreground",
                                                                    children: "NV phụ trách:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                    lineNumber: 2557,
                                                                    columnNumber: 41
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "font-medium",
                                                                    children: getEmployeeName(customer?.accountManagerId) || '---'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                    lineNumber: 2558,
                                                                    columnNumber: 41
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                                            lineNumber: 2556,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex justify-between",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-muted-foreground",
                                                                    children: "Công nợ/Hạn mức:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                    lineNumber: 2561,
                                                                    columnNumber: 41
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "text-right",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                            href: `/customers/${customer?.systemId}?tab=debt`,
                                                                            className: "font-medium text-red-500 hover:underline cursor-pointer",
                                                                            children: formatCurrency(customerDebtBalance)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                            lineNumber: 2563,
                                                                            columnNumber: 45
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-muted-foreground mx-1",
                                                                            children: "/"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                            lineNumber: 2569,
                                                                            columnNumber: 45
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "font-medium",
                                                                            children: formatCurrency(customer?.maxDebt)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                            lineNumber: 2570,
                                                                            columnNumber: 45
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                    lineNumber: 2562,
                                                                    columnNumber: 41
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                                            lineNumber: 2560,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex justify-between",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-muted-foreground",
                                                                    children: "Tổng chi tiêu:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                    lineNumber: 2574,
                                                                    columnNumber: 41
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "font-medium",
                                                                    children: formatCurrency(customerOrderStats.totalSpent)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                    lineNumber: 2575,
                                                                    columnNumber: 41
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                                            lineNumber: 2573,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "border-t border-dashed my-2"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                                            lineNumber: 2577,
                                                            columnNumber: 37
                                                        }, this),
                                                        customerMetrics.map((metric)=>{
                                                            const toneClass = metric.tone === 'destructive' ? 'text-red-600' : metric.tone === 'warning' ? 'text-amber-600' : metric.tone === 'success' ? 'text-green-600' : 'text-foreground';
                                                            const ValueContent = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-2 justify-end",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('font-medium', toneClass, metric.link && 'hover:underline cursor-pointer'),
                                                                        children: metric.value
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                        lineNumber: 2588,
                                                                        columnNumber: 49
                                                                    }, this),
                                                                    metric.badge && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                                        variant: "secondary",
                                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('text-[11px] uppercase tracking-tight', metric.badge.tone === 'destructive' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-amber-100 text-amber-700 border-amber-200'),
                                                                        children: metric.badge.label
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                        lineNumber: 2590,
                                                                        columnNumber: 53
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                lineNumber: 2587,
                                                                columnNumber: 45
                                                            }, this);
                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-muted-foreground",
                                                                        children: [
                                                                            metric.label,
                                                                            ":"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                        lineNumber: 2606,
                                                                        columnNumber: 49
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "text-right space-y-0.5",
                                                                        children: [
                                                                            metric.link ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                                href: metric.link,
                                                                                className: "block",
                                                                                children: ValueContent
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                lineNumber: 2609,
                                                                                columnNumber: 57
                                                                            }, this) : ValueContent,
                                                                            metric.subValue && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "text-xs text-muted-foreground",
                                                                                children: metric.subValue
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                lineNumber: 2616,
                                                                                columnNumber: 57
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                        lineNumber: 2607,
                                                                        columnNumber: 49
                                                                    }, this)
                                                                ]
                                                            }, metric.key, true, {
                                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                lineNumber: 2605,
                                                                columnNumber: 45
                                                            }, this);
                                                        })
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                    lineNumber: 2551,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                            lineNumber: 2475,
                                            columnNumber: 29
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                        lineNumber: 2474,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                lineNumber: 2470,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "lg:col-span-3 space-y-3",
                                children: [
                                    !hasOrderWorkflowTemplate && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Alert"], {
                                        className: "border-amber-200 bg-amber-50 text-amber-900",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__["Info"], {
                                                className: "h-4 w-4 text-amber-600"
                                            }, void 0, false, {
                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                lineNumber: 2631,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertTitle"], {
                                                children: "Chưa cấu hình quy trình xử lý đơn hàng"
                                            }, void 0, false, {
                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                lineNumber: 2632,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDescription"], {
                                                children: [
                                                    "Thiết lập quy trình mặc định tại",
                                                    ' ',
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        href: "/settings/workflow-templates",
                                                        className: "font-semibold text-primary underline",
                                                        children: "Cài đặt > Quy trình"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                        lineNumber: 2635,
                                                        columnNumber: 37
                                                    }, this),
                                                    ' ',
                                                    "để đội vận hành có checklist thống nhất."
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                lineNumber: 2633,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                        lineNumber: 2630,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$components$2f$order$2d$workflow$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OrderWorkflowCard"], {
                                        order: order,
                                        onUpdateOrder: (systemId, updates)=>{
                                            orderStore.update((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(systemId), updates);
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                        lineNumber: 2642,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                lineNumber: 2628,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                className: "lg:col-span-3 flex flex-col h-full lg:h-auto",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                        className: "flex-shrink-0",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                            className: "text-base font-semibold",
                                            children: "Thông tin đơn hàng"
                                        }, void 0, false, {
                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                            lineNumber: 2653,
                                            columnNumber: 29
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                        lineNumber: 2652,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                        className: "text-sm space-y-3 overflow-y-auto flex-1 max-h-[400px] lg:max-h-none",
                                        style: {
                                            scrollbarWidth: 'thin',
                                            scrollbarColor: 'rgb(203 213 225) transparent'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$detail$2d$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DetailField"], {
                                                label: "Chính sách giá",
                                                value: defaultPricingPolicy?.name || 'Giá bán lẻ'
                                            }, void 0, false, {
                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                lineNumber: 2661,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$detail$2d$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DetailField"], {
                                                label: "Bán tại",
                                                value: order.branchName
                                            }, void 0, false, {
                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                lineNumber: 2662,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-muted-foreground min-w-[140px]",
                                                        children: "Bán bởi:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                        lineNumber: 2664,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        href: `/employees/${order.salespersonSystemId}`,
                                                        className: "text-primary hover:underline font-medium",
                                                        children: order.salesperson
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                        lineNumber: 2665,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                lineNumber: 2663,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$detail$2d$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DetailField"], {
                                                label: "Hẹn giao hàng",
                                                value: order.expectedDeliveryDate || '---'
                                            }, void 0, false, {
                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                lineNumber: 2669,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$detail$2d$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DetailField"], {
                                                label: "Nguồn",
                                                value: order.source || '---'
                                            }, void 0, false, {
                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                lineNumber: 2670,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$detail$2d$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DetailField"], {
                                                label: "Kênh bán hàng",
                                                value: "Khác"
                                            }, void 0, false, {
                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                lineNumber: 2671,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$detail$2d$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DetailField"], {
                                                label: "Ngày bán",
                                                value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(order.orderDate)
                                            }, void 0, false, {
                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                lineNumber: 2672,
                                                columnNumber: 29
                                            }, this),
                                            order.expectedPaymentMethod && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$detail$2d$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DetailField"], {
                                                label: "Hình thức thanh toán",
                                                value: order.expectedPaymentMethod
                                            }, void 0, false, {
                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                lineNumber: 2674,
                                                columnNumber: 33
                                            }, this),
                                            order.referenceUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-muted-foreground",
                                                        children: "Link đơn hàng:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                        lineNumber: 2678,
                                                        columnNumber: 37
                                                    }, this),
                                                    ' ',
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                        href: order.referenceUrl,
                                                        target: "_blank",
                                                        rel: "noopener noreferrer",
                                                        className: "text-blue-600 hover:underline",
                                                        children: order.referenceUrl
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                        lineNumber: 2679,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                lineNumber: 2677,
                                                columnNumber: 33
                                            }, this),
                                            order.externalReference && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$detail$2d$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DetailField"], {
                                                label: "Mã tham chiếu",
                                                value: order.externalReference
                                            }, void 0, false, {
                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                lineNumber: 2685,
                                                columnNumber: 33
                                            }, this),
                                            order.tags && order.tags.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-muted-foreground",
                                                        children: "Tags:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                        lineNumber: 2689,
                                                        columnNumber: 37
                                                    }, this),
                                                    ' ',
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex flex-wrap gap-1 mt-1",
                                                        children: order.tags.map((tag, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                                variant: "secondary",
                                                                className: "text-xs",
                                                                children: tag
                                                            }, idx, false, {
                                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                lineNumber: 2692,
                                                                columnNumber: 45
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                        lineNumber: 2690,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                lineNumber: 2688,
                                                columnNumber: 33
                                            }, this),
                                            order.serviceFees && order.serviceFees.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-muted-foreground",
                                                        children: "Phí dịch vụ:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                        lineNumber: 2699,
                                                        columnNumber: 37
                                                    }, this),
                                                    order.serviceFees.map((fee)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "ml-4 text-sm",
                                                            children: [
                                                                fee.name,
                                                                ": ",
                                                                fee.amount.toLocaleString(),
                                                                "đ"
                                                            ]
                                                        }, fee.id, true, {
                                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                                            lineNumber: 2701,
                                                            columnNumber: 41
                                                        }, this))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                lineNumber: 2698,
                                                columnNumber: 33
                                            }, this),
                                            order.notes && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-muted-foreground",
                                                        children: "Ghi chú:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                        lineNumber: 2709,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "mt-1 text-sm whitespace-pre-wrap",
                                                        children: order.notes
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                        lineNumber: 2710,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                lineNumber: 2708,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                variant: "link",
                                                className: "p-0 h-auto text-sm",
                                                onClick: ()=>{
                                                    const historyTab = document.querySelector('[value="history"]');
                                                    if (historyTab) {
                                                        historyTab.click();
                                                        setTimeout(()=>{
                                                            historyTab.scrollIntoView({
                                                                behavior: 'smooth',
                                                                block: 'start'
                                                            });
                                                        }, 100);
                                                    }
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    href: `/customers/${customer?.systemId}`,
                                                    className: "hover:underline",
                                                    children: "Xem lịch sử đơn hàng"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                    lineNumber: 2726,
                                                    columnNumber: 33
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                lineNumber: 2713,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                        lineNumber: 2655,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                lineNumber: 2651,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/orders/order-detail-page.tsx",
                        lineNumber: 2468,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2",
                                            children: [
                                                order.paymentStatus === 'Thanh toán toàn bộ' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                    className: "h-5 w-5 text-green-500 flex-shrink-0"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                    lineNumber: 2740,
                                                    columnNumber: 37
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$warning$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileWarning$3e$__["FileWarning"], {
                                                    className: "h-5 w-5 text-amber-500 flex-shrink-0"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                    lineNumber: 2742,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                                    className: "text-base font-semibold",
                                                    children: order.paymentStatus === 'Chưa thanh toán' ? 'Đơn hàng chờ thanh toán' : `Đơn hàng thanh toán ${order.paymentStatus.toLowerCase()}`
                                                }, void 0, false, {
                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                    lineNumber: 2744,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                            lineNumber: 2738,
                                            columnNumber: 29
                                        }, this),
                                        isActionable && payableAmount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            size: "sm",
                                            onClick: ()=>setIsPaymentDialogOpen(true),
                                            children: "Thanh toán"
                                        }, void 0, false, {
                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                            lineNumber: 2751,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                    lineNumber: 2737,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                lineNumber: 2736,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                className: "space-y-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-1 gap-2 bg-muted/50 p-3 sm:p-4 rounded-md text-sm",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-muted-foreground",
                                                        children: "Tổng tiền ĐH:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                        lineNumber: 2760,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-medium",
                                                        children: formatCurrency(order.grandTotal)
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                        lineNumber: 2761,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                lineNumber: 2759,
                                                columnNumber: 29
                                            }, this),
                                            totalReturnedValue > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-muted-foreground",
                                                        children: "Giá trị hàng bị trả lại:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                        lineNumber: 2765,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-medium text-amber-600",
                                                        children: [
                                                            "-",
                                                            formatCurrency(totalReturnedValue)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                        lineNumber: 2766,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                lineNumber: 2764,
                                                columnNumber: 33
                                            }, this),
                                            totalReturnedValue > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-muted-foreground font-semibold",
                                                        children: "Công nợ thực tế:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                        lineNumber: 2771,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-semibold",
                                                        children: formatCurrency(netGrandTotal)
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                        lineNumber: 2772,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                lineNumber: 2770,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-muted-foreground",
                                                        children: "Đã trả:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                        lineNumber: 2776,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-medium",
                                                        children: totalPaid > 0 ? formatCurrency(totalPaid) : '0'
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                        lineNumber: 2777,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                lineNumber: 2775,
                                                columnNumber: 29
                                            }, this),
                                            totalRefundedFromReturns > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-muted-foreground",
                                                        children: "Đã hoàn tiền (trả hàng):"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                        lineNumber: 2781,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-medium text-green-600",
                                                        children: [
                                                            "-",
                                                            formatCurrency(totalRefundedFromReturns)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                        lineNumber: 2782,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                lineNumber: 2780,
                                                columnNumber: 33
                                            }, this),
                                            totalCodAmount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-muted-foreground",
                                                        children: "Thu hộ COD:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                        lineNumber: 2788,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-medium text-blue-600",
                                                        children: formatCurrency(totalCodAmount)
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                        lineNumber: 2789,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                lineNumber: 2787,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "border-t border-border my-1"
                                            }, void 0, false, {
                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                lineNumber: 2795,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-muted-foreground font-bold",
                                                        children: "Còn phải trả:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                        lineNumber: 2798,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("font-bold text-lg", amountRemaining > 0 ? 'text-red-500' : amountRemaining < 0 ? 'text-green-600' : 'text-foreground'),
                                                        children: amountRemaining >= 0 ? formatCurrency(amountRemaining) : formatCurrency(0)
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                        lineNumber: 2799,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                lineNumber: 2797,
                                                columnNumber: 29
                                            }, this),
                                            amountRemaining < 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between text-green-600",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-medium",
                                                        children: "Thừa tiền (cần hoàn thêm):"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                        lineNumber: 2806,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-bold",
                                                        children: formatCurrency(Math.abs(amountRemaining))
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                        lineNumber: 2807,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                lineNumber: 2805,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                        lineNumber: 2758,
                                        columnNumber: 25
                                    }, this),
                                    directPayments.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-2 pt-2",
                                        children: [
                                            ...directPayments
                                        ].reverse().map((payment, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$components$2f$payment$2d$info$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PaymentInfo"], {
                                                    payment: payment,
                                                    order: order
                                                }, void 0, false, {
                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                    lineNumber: 2816,
                                                    columnNumber: 41
                                                }, this)
                                            }, `direct-${payment.systemId}-${index}`, false, {
                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                lineNumber: 2815,
                                                columnNumber: 37
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                        lineNumber: 2813,
                                        columnNumber: 29
                                    }, this),
                                    (totalActiveCod > 0 || codPayments.length > 0) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-2 pt-2",
                                        children: [
                                            codPayments.length > 0 && [
                                                ...codPayments
                                            ].reverse().map((payment, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$components$2f$payment$2d$info$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PaymentInfo"], {
                                                        payment: payment,
                                                        order: order
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                        lineNumber: 2826,
                                                        columnNumber: 41
                                                    }, this)
                                                }, `cod-${payment.systemId}-${index}`, false, {
                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                    lineNumber: 2825,
                                                    columnNumber: 37
                                                }, this)),
                                            totalActiveCod > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "border rounded-md bg-background text-sm p-3 flex items-center justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "font-medium",
                                                                children: "Chờ đối soát"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                lineNumber: 2832,
                                                                columnNumber: 45
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-muted-foreground text-xs",
                                                                children: "Đối tác vận chuyển sẽ hoàn tiền sau khi đối soát"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                lineNumber: 2833,
                                                                columnNumber: 45
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                        lineNumber: 2831,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "font-semibold",
                                                        children: formatCurrency(totalActiveCod)
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                        lineNumber: 2835,
                                                        columnNumber: 41
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                lineNumber: 2830,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                        lineNumber: 2823,
                                        columnNumber: 29
                                    }, this),
                                    refundPaymentsForOrder.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-2 pt-2 border-t",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm font-medium text-muted-foreground pt-2",
                                                children: "Phiếu chi hoàn tiền"
                                            }, void 0, false, {
                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                lineNumber: 2844,
                                                columnNumber: 33
                                            }, this),
                                            [
                                                ...refundPaymentsForOrder
                                            ].reverse().map((refund, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "border rounded-md text-sm",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$collapsible$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Collapsible"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$collapsible$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CollapsibleTrigger"], {
                                                                asChild: true,
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "w-full p-3 flex items-center justify-between hover:bg-muted/50 rounded-md transition-colors cursor-pointer",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-2",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$down$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowDownLeft$3e$__["ArrowDownLeft"], {
                                                                                    className: "h-4 w-4 text-green-600"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                    lineNumber: 2851,
                                                                                    columnNumber: 53
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                                    href: `/payments/${refund.systemId}`,
                                                                                    onClick: (e)=>e.stopPropagation(),
                                                                                    className: "font-medium text-primary hover:underline",
                                                                                    children: refund.id
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                    lineNumber: 2852,
                                                                                    columnNumber: 53
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                            lineNumber: 2850,
                                                                            columnNumber: 49
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-3",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-muted-foreground",
                                                                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(refund.date)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                    lineNumber: 2861,
                                                                                    columnNumber: 53
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "font-semibold text-green-600",
                                                                                    children: [
                                                                                        "-",
                                                                                        formatCurrency(refund.amount)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                    lineNumber: 2862,
                                                                                    columnNumber: 53
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                                    variant: "ghost",
                                                                                    size: "icon",
                                                                                    className: "h-6 w-6",
                                                                                    onClick: (e)=>{
                                                                                        e.stopPropagation();
                                                                                        // Reuse handlePrintTransaction logic or similar
                                                                                        // Since we don't have handlePrintTransaction here, we need to implement it or pass it
                                                                                        // But wait, we are inside OrderDetailPage, we can access print function
                                                                                        // Let's implement inline or call a helper
                                                                                        const branch = findBranchById(order.branchSystemId);
                                                                                        const storeSettings = {
                                                                                            name: storeInfo?.brandName || storeInfo?.companyName,
                                                                                            address: storeInfo?.headquartersAddress,
                                                                                            phone: storeInfo?.hotline,
                                                                                            email: storeInfo?.email,
                                                                                            province: storeInfo?.province
                                                                                        };
                                                                                        const paymentData = {
                                                                                            code: refund.id,
                                                                                            createdAt: refund.date,
                                                                                            issuedAt: refund.date,
                                                                                            createdBy: findEmployeeById(refund.createdBy)?.fullName || refund.createdBy,
                                                                                            recipientName: order.customerName,
                                                                                            recipientPhone: typeof order.shippingAddress === 'object' ? order.shippingAddress?.phone : undefined,
                                                                                            recipientAddress: typeof order.shippingAddress === 'string' ? order.shippingAddress : order.shippingAddress?.formattedAddress,
                                                                                            recipientType: 'Khách hàng',
                                                                                            amount: refund.amount,
                                                                                            description: refund.description,
                                                                                            paymentMethod: refund.paymentMethodName,
                                                                                            documentRootCode: order.id,
                                                                                            note: refund.description,
                                                                                            location: branch ? {
                                                                                                name: branch.name,
                                                                                                address: branch.address,
                                                                                                province: branch.province
                                                                                            } : undefined
                                                                                        };
                                                                                        const printData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$payment$2e$mapper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mapPaymentToPrintData"])(paymentData, storeSettings);
                                                                                        printData['amount_text'] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["numberToWords"])(refund.amount);
                                                                                        printData['print_date'] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDateTime"])(new Date());
                                                                                        printData['print_time'] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatTime"])(new Date());
                                                                                        print('payment', {
                                                                                            data: printData
                                                                                        });
                                                                                    },
                                                                                    title: "In phiếu",
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__["Printer"], {
                                                                                        className: "h-4 w-4"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                        lineNumber: 2913,
                                                                                        columnNumber: 57
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                    lineNumber: 2863,
                                                                                    columnNumber: 53
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                                                    className: "h-4 w-4 text-muted-foreground"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                    lineNumber: 2915,
                                                                                    columnNumber: 53
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                            lineNumber: 2860,
                                                                            columnNumber: 49
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                    lineNumber: 2849,
                                                                    columnNumber: 49
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                lineNumber: 2848,
                                                                columnNumber: 45
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$collapsible$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CollapsibleContent"], {
                                                                className: "px-3 pb-3",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "grid grid-cols-2 gap-x-4 gap-y-2 text-sm pt-2 border-t",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-muted-foreground",
                                                                                    children: "Phương thức"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                    lineNumber: 2922,
                                                                                    columnNumber: 57
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "font-medium",
                                                                                    children: refund.paymentMethodName
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                    lineNumber: 2923,
                                                                                    columnNumber: 57
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                            lineNumber: 2921,
                                                                            columnNumber: 53
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-muted-foreground",
                                                                                    children: "Người tạo"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                    lineNumber: 2926,
                                                                                    columnNumber: 57
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "font-medium",
                                                                                    children: findEmployeeById(refund.createdBy)?.fullName || refund.createdBy
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                    lineNumber: 2927,
                                                                                    columnNumber: 57
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                            lineNumber: 2925,
                                                                            columnNumber: 53
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "col-span-2",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-muted-foreground",
                                                                                    children: "Diễn giải"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                    lineNumber: 2930,
                                                                                    columnNumber: 57
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "font-medium",
                                                                                    children: refund.description
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                                    lineNumber: 2931,
                                                                                    columnNumber: 57
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                            lineNumber: 2929,
                                                                            columnNumber: 53
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                    lineNumber: 2920,
                                                                    columnNumber: 49
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                lineNumber: 2919,
                                                                columnNumber: 45
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                        lineNumber: 2847,
                                                        columnNumber: 41
                                                    }, this)
                                                }, `refund-${refund.systemId}-${index}`, false, {
                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                    lineNumber: 2846,
                                                    columnNumber: 37
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                        lineNumber: 2843,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                lineNumber: 2757,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/orders/order-detail-page.tsx",
                        lineNumber: 2735,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                                                    className: "h-5 w-5 text-muted-foreground flex-shrink-0"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                    lineNumber: 2948,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                                    className: "text-base font-semibold",
                                                    children: "Đóng gói và Giao hàng"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                    lineNumber: 2949,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                            lineNumber: 2947,
                                            columnNumber: 29
                                        }, this),
                                        renderMainPackagingActionButtons()
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                    lineNumber: 2946,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                lineNumber: 2945,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                className: "space-y-4",
                                children: [
                                    order.packagings.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-center text-muted-foreground py-4",
                                        children: "Chưa có yêu cầu đóng gói."
                                    }, void 0, false, {
                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                        lineNumber: 2956,
                                        columnNumber: 29
                                    }, this),
                                    [
                                        ...order.packagings
                                    ].reverse().map((pkg)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$components$2f$packaging$2d$info$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PackagingInfo"], {
                                                order: order,
                                                packaging: pkg,
                                                isActionable: isActionable,
                                                onConfirmPackaging: ()=>handleConfirmPackaging(pkg.systemId),
                                                onCancelPackaging: ()=>setCancelPackagingState({
                                                        packagingSystemId: pkg.systemId
                                                    }),
                                                onDispatch: ()=>handleDispatch(pkg.systemId),
                                                onCompleteDelivery: ()=>handleCompleteDelivery(pkg.systemId),
                                                onOpenShipmentDialog: ()=>setIsCreateShipmentDialogOpen(true),
                                                onFailDelivery: ()=>setCancelShipmentState({
                                                        packagingSystemId: pkg.systemId,
                                                        type: 'fail'
                                                    }),
                                                onCancelDelivery: ()=>setCancelShipmentState({
                                                        packagingSystemId: pkg.systemId,
                                                        type: 'cancel'
                                                    }),
                                                onInStorePickup: ()=>handleInStorePickup(pkg.systemId),
                                                onCancelGHTKShipment: pkg.trackingCode ? ()=>handleCancelGHTKShipment(pkg.systemId, pkg.trackingCode) : undefined
                                            }, void 0, false, {
                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                lineNumber: 2962,
                                                columnNumber: 33
                                            }, this)
                                        }, pkg.systemId, false, {
                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                            lineNumber: 2961,
                                            columnNumber: 29
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                lineNumber: 2954,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/orders/order-detail-page.tsx",
                        lineNumber: 2944,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ProductInfoCard, {
                        order: order,
                        costOfGoods: costOfGoods,
                        profit: profit,
                        totalDiscount: totalDiscount,
                        salesReturns: allSalesReturns,
                        getProductTypeLabel: getProductTypeLabel
                    }, void 0, false, {
                        fileName: "[project]/features/orders/order-detail-page.tsx",
                        lineNumber: 2982,
                        columnNumber: 17
                    }, this),
                    salesReturnsForOrder.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                    className: "text-base font-semibold",
                                    children: [
                                        "Lịch sử trả hàng (",
                                        salesReturnsForOrder.length,
                                        ")"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                    lineNumber: 2995,
                                    columnNumber: 29
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                lineNumber: 2994,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ReturnHistoryTab, {
                                    order: order,
                                    salesReturnsForOrder: salesReturnsForOrder,
                                    getProductTypeLabel: getProductTypeLabel,
                                    onPreview: handlePreview
                                }, void 0, false, {
                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                    lineNumber: 3000,
                                    columnNumber: 29
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                lineNumber: 2999,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/orders/order-detail-page.tsx",
                        lineNumber: 2993,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DatabaseComments$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DatabaseComments"], {
                        entityType: "order",
                        entityId: order.systemId
                    }, void 0, false, {
                        fileName: "[project]/features/orders/order-detail-page.tsx",
                        lineNumber: 3010,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(OrderHistoryTab, {
                        order: order,
                        salesReturnsForOrder: salesReturnsForOrder
                    }, void 0, false, {
                        fileName: "[project]/features/orders/order-detail-page.tsx",
                        lineNumber: 3016,
                        columnNumber: 17
                    }, this),
                    order.packagings.some((p)=>p.deliveryMethod === 'Dịch vụ giao hàng' && p.status !== 'Hủy đóng gói') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$components$2f$shipping$2d$tracking$2d$tab$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ShippingTrackingTab"], {
                        order: order
                    }, void 0, false, {
                        fileName: "[project]/features/orders/order-detail-page.tsx",
                        lineNumber: 3020,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/orders/order-detail-page.tsx",
                lineNumber: 2447,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialog"], {
                open: isCancelAlertOpen,
                onOpenChange: setIsCancelAlertOpen,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogContent"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogHeader"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogTitle"], {
                                    children: "Xác nhận hủy đơn hàng"
                                }, void 0, false, {
                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                    lineNumber: 3027,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogDescription"], {
                                    className: "space-y-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    children: "Bạn có chắc chắn muốn hủy đơn hàng này không?"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                    lineNumber: 3030,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm",
                                                    children: "Khi hủy đơn hàng, hệ thống sẽ thực hiện các thay đổi sau:"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                    lineNumber: 3031,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                    className: "text-sm space-y-1 ml-4 list-disc",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: "Trả hàng về kho và cập nhật số lượng tồn kho"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                                            lineNumber: 3033,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: "Hủy các vận đơn liên quan (nếu có)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                                            lineNumber: 3034,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: "Hủy các phiếu thu thanh toán đơn hàng"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                                            lineNumber: 3035,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: "Hủy các phiếu thu đặt cọc shipper (nếu có)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                                            lineNumber: 3036,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: "Cập nhật công nợ khách hàng"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                                            lineNumber: 3037,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: "Cập nhật công nợ đối tác vận chuyển"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                                            lineNumber: 3038,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: "Hoàn lại khuyến mại và điểm tích lũy (nếu có)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                                            lineNumber: 3039,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                    lineNumber: 3032,
                                                    columnNumber: 33
                                                }, this),
                                                order && order.payments && order.payments.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-amber-600 font-medium",
                                                    children: "Lưu ý: Đơn hàng đã có thanh toán. Một phiếu chi hoàn tiền sẽ được tạo tự động."
                                                }, void 0, false, {
                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                    lineNumber: 3042,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "font-semibold text-destructive",
                                                    children: "Hành động này không thể hoàn tác!"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                    lineNumber: 3046,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                            lineNumber: 3029,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                    htmlFor: "cancel-reason-textarea",
                                                    className: "text-sm font-semibold",
                                                    children: "Lý do hủy đơn hàng"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                    lineNumber: 3050,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Textarea"], {
                                                    id: "cancel-reason-textarea",
                                                    value: cancelReasonText,
                                                    onChange: (event)=>setCancelReasonText(event.target.value),
                                                    placeholder: "Nhập rõ lý do hủy để đội vận hành nắm được...",
                                                    rows: 3
                                                }, void 0, false, {
                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                    lineNumber: 3053,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                            lineNumber: 3049,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                    className: "text-sm font-semibold",
                                                    children: "Tùy chọn bổ sung"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                    lineNumber: 3063,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-2",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-start gap-3 rounded-md border p-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Checkbox"], {
                                                                id: "cancel-restock-option",
                                                                checked: restockItems,
                                                                onCheckedChange: (checked)=>setRestockItems(checked === true)
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                lineNumber: 3066,
                                                                columnNumber: 41
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "space-y-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                                        htmlFor: "cancel-restock-option",
                                                                        className: "text-sm font-medium",
                                                                        children: [
                                                                            "Hoàn kho ",
                                                                            totalLineQuantity,
                                                                            " sản phẩm"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                        lineNumber: 3072,
                                                                        columnNumber: 45
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-xs text-muted-foreground",
                                                                        children: "Giữ tồn kho và số liệu chi phí chính xác sau khi hủy."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                        lineNumber: 3075,
                                                                        columnNumber: 45
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/features/orders/order-detail-page.tsx",
                                                                lineNumber: 3071,
                                                                columnNumber: 41
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/features/orders/order-detail-page.tsx",
                                                        lineNumber: 3065,
                                                        columnNumber: 37
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                                    lineNumber: 3064,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/orders/order-detail-page.tsx",
                                            lineNumber: 3062,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                    lineNumber: 3028,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/orders/order-detail-page.tsx",
                            lineNumber: 3026,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogFooter"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogCancel"], {
                                    children: "Không, giữ đơn hàng"
                                }, void 0, false, {
                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                    lineNumber: 3085,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogAction"], {
                                    onClick: handleConfirmCancel,
                                    className: "border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground",
                                    children: "Có, hủy đơn hàng"
                                }, void 0, false, {
                                    fileName: "[project]/features/orders/order-detail-page.tsx",
                                    lineNumber: 3086,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/orders/order-detail-page.tsx",
                            lineNumber: 3084,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/orders/order-detail-page.tsx",
                    lineNumber: 3025,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/orders/order-detail-page.tsx",
                lineNumber: 3024,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PaymentDialog, {
                isOpen: isPaymentDialogOpen,
                onOpenChange: setIsPaymentDialogOpen,
                onSubmit: handleAddPayment,
                amountDue: payableAmount
            }, void 0, false, {
                fileName: "[project]/features/orders/order-detail-page.tsx",
                lineNumber: 3093,
                columnNumber: 14
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CreateShipmentDialog, {
                isOpen: isCreateShipmentDialogOpen,
                onOpenChange: setIsCreateShipmentDialogOpen,
                onSubmit: handleShippingSubmit,
                order: order,
                customer: customer
            }, void 0, false, {
                fileName: "[project]/features/orders/order-detail-page.tsx",
                lineNumber: 3100,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PackerSelectionDialog, {
                isOpen: isPackerSelectionOpen,
                onOpenChange: setIsPackerSelectionOpen,
                onSubmit: handleRequestPackaging,
                ...existingPackerSystemId ? {
                    existingPackerSystemId
                } : {}
            }, void 0, false, {
                fileName: "[project]/features/orders/order-detail-page.tsx",
                lineNumber: 3108,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$components$2f$cancel$2d$packaging$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CancelPackagingDialog"], {
                isOpen: !!cancelPackagingState,
                onOpenChange: (open)=>!open && setCancelPackagingState(null),
                onConfirm: handleCancelPackagingSubmit
            }, void 0, false, {
                fileName: "[project]/features/orders/order-detail-page.tsx",
                lineNumber: 3115,
                columnNumber: 13
            }, this),
            cancelShipmentState?.type === 'fail' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$components$2f$delivery$2d$failure$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DeliveryFailureDialog"], {
                isOpen: true,
                onOpenChange: (open)=>!open && setCancelShipmentState(null),
                onConfirm: handleFailDeliverySubmit
            }, void 0, false, {
                fileName: "[project]/features/orders/order-detail-page.tsx",
                lineNumber: 3122,
                columnNumber: 17
            }, this),
            cancelShipmentState?.type === 'cancel' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$components$2f$cancel$2d$shipment$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CancelShipmentDialog"], {
                isOpen: true,
                onOpenChange: (open)=>!open && setCancelShipmentState(null),
                onCancelShipment: handleCancelDeliveryOnly,
                onCancelAndRestock: handleCancelDeliveryAndRestock
            }, void 0, false, {
                fileName: "[project]/features/orders/order-detail-page.tsx",
                lineNumber: 3129,
                columnNumber: 17
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$image$2d$preview$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ImagePreviewDialog"], {
                open: returnHistoryPreviewState.open,
                onOpenChange: (open)=>setReturnHistoryPreviewState((prev)=>({
                            ...prev,
                            open
                        })),
                images: [
                    returnHistoryPreviewState.image
                ],
                title: returnHistoryPreviewState.title
            }, void 0, false, {
                fileName: "[project]/features/orders/order-detail-page.tsx",
                lineNumber: 3138,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true);
}
_s6(OrderDetailPage, "MHtXIGFRCdvQ0XkuQ4iGQug3zNk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$hooks$2f$use$2d$all$2d$orders$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAllOrders"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$hooks$2f$use$2d$all$2d$orders$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOrderFinder"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$hooks$2f$use$2d$order$2d$mutations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOrderMutations"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$hooks$2f$use$2d$order$2d$actions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOrderActions"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOrderStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$hooks$2f$use$2d$all$2d$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductFinder"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$inventory$2f$hooks$2f$use$2d$all$2d$product$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductTypeFinder"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$sales$2d$returns$2f$hooks$2f$use$2d$all$2d$sales$2d$returns$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAllSalesReturns"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pricing$2f$hooks$2f$use$2d$all$2d$pricing$2d$policies$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useAllPricingPolicies"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$hooks$2f$use$2d$all$2d$warranties$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAllWarranties"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$receipts$2f$hooks$2f$use$2d$all$2d$receipts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAllReceipts"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$payments$2f$hooks$2f$use$2d$all$2d$payments$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAllPayments"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$hooks$2f$use$2d$all$2d$complaints$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAllComplaints"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$sla$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCustomerSlaEvaluation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$hooks$2f$use$2d$all$2d$branches$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAllBranches"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$hooks$2f$use$2d$all$2d$branches$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBranchFinder"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$store$2d$info$2f$hooks$2f$use$2d$store$2d$info$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStoreInfo"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$print$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePrint"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$hooks$2f$use$2d$all$2d$customers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAllCustomers"],
        __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$hooks$2f$use$2d$all$2d$customer$2d$settings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCustomerTypeFinder"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$hooks$2f$use$2d$all$2d$customer$2d$settings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCustomerGroupFinder"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$hooks$2f$use$2d$all$2d$customer$2d$settings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCustomerSourceFinder"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$hooks$2f$use$2d$all$2d$employees$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEmployeeFinder"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$branding$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBranding"],
        __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$page$2d$header$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePageHeader"]
    ];
});
_c8 = OrderDetailPage;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8;
__turbopack_context__.k.register(_c, "ProductThumbnailCell");
__turbopack_context__.k.register(_c1, "StatusStepper");
__turbopack_context__.k.register(_c2, "PaymentDialog");
__turbopack_context__.k.register(_c3, "CreateShipmentDialog");
__turbopack_context__.k.register(_c4, "PackerSelectionDialog");
__turbopack_context__.k.register(_c5, "OrderHistoryTab");
__turbopack_context__.k.register(_c6, "ProductInfoCard");
__turbopack_context__.k.register(_c7, "ReturnHistoryTab");
__turbopack_context__.k.register(_c8, "OrderDetailPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=features_orders_order-detail-page_tsx_30e15c5e._.js.map