module.exports = [
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
"[project]/components/settings/SettingsPlaceholder.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SettingsPlaceholder",
    ()=>SettingsPlaceholder
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$inbox$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Inbox$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/inbox.js [app-rsc] (ecmascript) <export default as Inbox>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/card.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-rsc] (ecmascript)");
;
;
;
;
function SettingsPlaceholder({ title, description, icon: Icon = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$inbox$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Inbox$3e$__["Inbox"], action, secondaryAction, children, className, contentClassName }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Card"], {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])('border-dashed border-muted-foreground/40 shadow-none', className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardHeader"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-12 w-12 rounded-full bg-muted flex items-center justify-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                className: "h-5 w-5 text-muted-foreground"
                            }, void 0, false, {
                                fileName: "[project]/components/settings/SettingsPlaceholder.tsx",
                                lineNumber: 36,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/settings/SettingsPlaceholder.tsx",
                            lineNumber: 35,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardTitle"], {
                                    className: "text-h5 font-semibold",
                                    children: title
                                }, void 0, false, {
                                    fileName: "[project]/components/settings/SettingsPlaceholder.tsx",
                                    lineNumber: 39,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardDescription"], {
                                    children: description
                                }, void 0, false, {
                                    fileName: "[project]/components/settings/SettingsPlaceholder.tsx",
                                    lineNumber: 40,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/settings/SettingsPlaceholder.tsx",
                            lineNumber: 38,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/settings/SettingsPlaceholder.tsx",
                    lineNumber: 34,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/settings/SettingsPlaceholder.tsx",
                lineNumber: 33,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardContent"], {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])('space-y-4 text-sm text-muted-foreground', contentClassName),
                children: [
                    children ?? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "Chức năng này đang được phát triển. Vui lòng quay lại sau."
                    }, void 0, false, {
                        fileName: "[project]/components/settings/SettingsPlaceholder.tsx",
                        lineNumber: 46,
                        columnNumber: 11
                    }, this),
                    (action || secondaryAction) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-2",
                        children: [
                            action,
                            secondaryAction
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/settings/SettingsPlaceholder.tsx",
                        lineNumber: 49,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/settings/SettingsPlaceholder.tsx",
                lineNumber: 44,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/settings/SettingsPlaceholder.tsx",
        lineNumber: 32,
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
"[project]/features/settings/taxes-page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TaxesPage",
    ()=>TaxesPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$SettingsPlaceholder$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/settings/SettingsPlaceholder.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$use$2d$settings$2d$page$2d$header$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/use-settings-page-header.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/card.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$receipt$2d$cent$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__ReceiptCent$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/receipt-cent.js [app-rsc] (ecmascript) <export default as ReceiptCent>");
;
;
;
;
;
function TaxesPage() {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$use$2d$settings$2d$page$2d$header$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useSettingsPageHeader"])({
        title: 'Thuế'
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Card"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardContent"], {
            className: "p-6",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$SettingsPlaceholder$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SettingsPlaceholder"], {
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$receipt$2d$cent$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__ReceiptCent$3e$__["ReceiptCent"],
                title: "Quản lý thuế",
                description: "Chức năng đang được phát triển",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: "Module thuế sẽ hỗ trợ khai báo thuế suất đầu vào/đầu ra, map sản phẩm và đồng bộ với chứng từ bán hàng. Chúng tôi đang triển khai bảng thuế linh hoạt trước khi mở cho người dùng."
                }, void 0, false, {
                    fileName: "[project]/features/settings/taxes-page.tsx",
                    lineNumber: 20,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/settings/taxes-page.tsx",
                lineNumber: 15,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/features/settings/taxes-page.tsx",
            lineNumber: 14,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/features/settings/taxes-page.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
}),
"[project]/features/settings/taxes-page.tsx [app-rsc] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/features/settings/taxes-page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=_da6d7ab1._.js.map