(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/ui/textarea.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Textarea",
    ()=>Textarea
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
;
const Textarea = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, ...props }, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
        ref: ref,
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/textarea.tsx",
        lineNumber: 10,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = Textarea;
Textarea.displayName = "Textarea";
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Textarea$React.forwardRef");
__turbopack_context__.k.register(_c1, "Textarea");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/progress.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Progress",
    ()=>Progress
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
;
const Progress = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, value, ...props }, ref)=>{
    const progressValue = value ?? 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        role: "progressbar",
        "aria-valuenow": progressValue,
        "aria-valuemin": 0,
        "aria-valuemax": 100,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative h-4 w-full overflow-hidden rounded-full bg-secondary", className),
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "h-full w-full flex-1 bg-primary transition-all",
            style: {
                transform: `translateX(-${100 - progressValue}%)`
            }
        }, void 0, false, {
            fileName: "[project]/components/ui/progress.tsx",
            lineNumber: 26,
            columnNumber: 9
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/components/ui/progress.tsx",
        lineNumber: 14,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = Progress;
Progress.displayName = "Progress";
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Progress$React.forwardRef");
__turbopack_context__.k.register(_c1, "Progress");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/alert.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Alert",
    ()=>Alert,
    "AlertDescription",
    ()=>AlertDescription,
    "AlertTitle",
    ()=>AlertTitle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
const alertVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground", {
    variants: {
        variant: {
            default: "bg-background text-foreground",
            destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"
        }
    },
    defaultVariants: {
        variant: "default"
    }
});
const Alert = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, variant, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        role: "alert",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(alertVariants({
            variant
        }), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/alert.tsx",
        lineNumber: 26,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c1 = Alert;
Alert.displayName = "Alert";
const AlertTitle = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c2 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h5", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("mb-1 font-medium leading-none tracking-tight", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/alert.tsx",
        lineNumber: 39,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c3 = AlertTitle;
AlertTitle.displayName = "AlertTitle";
const AlertDescription = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c4 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-sm [&_p]:leading-relaxed", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/alert.tsx",
        lineNumber: 51,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c5 = AlertDescription;
AlertDescription.displayName = "AlertDescription";
;
var _c, _c1, _c2, _c3, _c4, _c5;
__turbopack_context__.k.register(_c, "Alert$React.forwardRef");
__turbopack_context__.k.register(_c1, "Alert");
__turbopack_context__.k.register(_c2, "AlertTitle$React.forwardRef");
__turbopack_context__.k.register(_c3, "AlertTitle");
__turbopack_context__.k.register(_c4, "AlertDescription$React.forwardRef");
__turbopack_context__.k.register(_c5, "AlertDescription");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/radio-group.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RadioGroup",
    ()=>RadioGroup,
    "RadioGroupItem",
    ()=>RadioGroupItem
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
'use client';
;
;
const RadioGroupContext = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"](undefined);
const useRadioGroup = ()=>{
    _s();
    const context = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"](RadioGroupContext);
    if (!context) {
        throw new Error("useRadioGroup must be used within a RadioGroup");
    }
    return context;
};
_s(useRadioGroup, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
// --- RadioGroup ---
const RadioGroup = /*#__PURE__*/ _s1(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = _s1(({ className, children, value, defaultValue, onValueChange, name, ...props }, ref)=>{
    _s1();
    const [internalValue, setInternalValue] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](defaultValue);
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;
    const handleValueChange = (newValue)=>{
        if (!isControlled) {
            setInternalValue(newValue);
        }
        if (onValueChange) {
            onValueChange(newValue);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RadioGroupContext.Provider, {
        value: {
            value: currentValue,
            onValueChange: handleValueChange,
            name
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            ref: ref,
            role: "radiogroup",
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("grid gap-2", className),
            ...props,
            children: children
        }, void 0, false, {
            fileName: "[project]/components/ui/radio-group.tsx",
            lineNumber: 48,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/components/ui/radio-group.tsx",
        lineNumber: 47,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
}, "d2NLwGQqashc9uQuwvF6mBPsoMM=")), "d2NLwGQqashc9uQuwvF6mBPsoMM=");
_c1 = RadioGroup;
RadioGroup.displayName = "RadioGroup";
// --- RadioGroupItem ---
const RadioGroupItem = /*#__PURE__*/ _s2(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c2 = _s2(({ className, value, children: _children, ...props }, ref)=>{
    _s2();
    const { value: selectedValue, onValueChange, name } = useRadioGroup();
    const isChecked = selectedValue === value;
    const id = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"]();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        ref: ref,
        id: id,
        type: "button",
        role: "radio",
        "aria-checked": isChecked,
        "data-state": isChecked ? "checked" : "unchecked",
        onClick: ()=>onValueChange(value),
        name: name,
        value: value,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", className),
        ...props,
        children: isChecked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-2.5 w-2.5 rounded-full bg-current text-current"
            }, void 0, false, {
                fileName: "[project]/components/ui/radio-group.tsx",
                lineNumber: 84,
                columnNumber: 11
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/components/ui/radio-group.tsx",
            lineNumber: 83,
            columnNumber: 9
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/components/ui/radio-group.tsx",
        lineNumber: 66,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
}, "TEWcGQhD+ub0m2NnEEOxDVbm0K8=", false, function() {
    return [
        useRadioGroup
    ];
})), "TEWcGQhD+ub0m2NnEEOxDVbm0K8=", false, function() {
    return [
        useRadioGroup
    ];
});
_c3 = RadioGroupItem;
RadioGroupItem.displayName = "RadioGroupItem";
;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "RadioGroup$React.forwardRef");
__turbopack_context__.k.register(_c1, "RadioGroup");
__turbopack_context__.k.register(_c2, "RadioGroupItem$React.forwardRef");
__turbopack_context__.k.register(_c3, "RadioGroupItem");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/tabs.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-tabs/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
const Tabs = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"];
const TabsList = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["List"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("inline-flex h-9 items-center justify-center rounded-md bg-muted p-1", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/tabs.tsx",
        lineNumber: 12,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c1 = TabsList;
TabsList.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["List"].displayName;
const TabsTrigger = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c2 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium text-muted-foreground ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/tabs.tsx",
        lineNumber: 27,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c3 = TabsTrigger;
TabsTrigger.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"].displayName;
const TabsContent = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c4 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/tabs.tsx",
        lineNumber: 42,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c5 = TabsContent;
TabsContent.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"].displayName;
;
var _c, _c1, _c2, _c3, _c4, _c5;
__turbopack_context__.k.register(_c, "TabsList$React.forwardRef");
__turbopack_context__.k.register(_c1, "TabsList");
__turbopack_context__.k.register(_c2, "TabsTrigger$React.forwardRef");
__turbopack_context__.k.register(_c3, "TabsTrigger");
__turbopack_context__.k.register(_c4, "TabsContent$React.forwardRef");
__turbopack_context__.k.register(_c5, "TabsContent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/import-export/import-export-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "selectExportLogs",
    ()=>selectExportLogs,
    "selectExportLogsByEntity",
    ()=>selectExportLogsByEntity,
    "selectImportLogs",
    ()=>selectImportLogs,
    "selectImportLogsByEntity",
    ()=>selectImportLogsByEntity,
    "useImportExportStore",
    ()=>useImportExportStore
]);
/**
 * Import/Export Store
 * 
 * Lưu lịch sử import/export với Zustand persist (localStorage)
 * Khi migrate sang Next.js, sẽ chuyển sang API
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
;
const MAX_LOGS = 200; // Giới hạn để tránh localStorage quá tải
// Generate simple ID
const generateLogId = (prefix)=>{
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `${prefix}_${timestamp}_${random}`;
};
const useImportExportStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((set, get)=>({
        importLogs: [],
        exportLogs: [],
        initialized: false,
        addImportLog: (log)=>{
            const id = generateLogId('IMP');
            const newLog = {
                ...log,
                id
            };
            set((state)=>({
                    importLogs: [
                        newLog,
                        ...state.importLogs
                    ].slice(0, MAX_LOGS)
                }));
            return id;
        },
        addExportLog: (log)=>{
            const id = generateLogId('EXP');
            const newLog = {
                ...log,
                id
            };
            set((state)=>({
                    exportLogs: [
                        newLog,
                        ...state.exportLogs
                    ].slice(0, MAX_LOGS)
                }));
            return id;
        },
        getLogsByEntity: (entityType)=>({
                imports: get().importLogs.filter((l)=>l.entityType === entityType),
                exports: get().exportLogs.filter((l)=>l.entityType === entityType)
            }),
        getRecentLogs: (limit = 50)=>{
            const all = [
                ...get().importLogs.map((l)=>({
                        ...l,
                        _type: 'import'
                    })),
                ...get().exportLogs.map((l)=>({
                        ...l,
                        _type: 'export'
                    }))
            ];
            return all.sort((a, b)=>new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime()).slice(0, limit);
        },
        getImportLogById: (id)=>{
            return get().importLogs.find((l)=>l.id === id);
        },
        getExportLogById: (id)=>{
            return get().exportLogs.find((l)=>l.id === id);
        },
        deleteLog: (id, type)=>{
            if (type === 'import') {
                set((state)=>({
                        importLogs: state.importLogs.filter((l)=>l.id !== id)
                    }));
            } else {
                set((state)=>({
                        exportLogs: state.exportLogs.filter((l)=>l.id !== id)
                    }));
            }
        },
        clearLogs: (entityType)=>{
            if (entityType) {
                set((state)=>({
                        importLogs: state.importLogs.filter((l)=>l.entityType !== entityType),
                        exportLogs: state.exportLogs.filter((l)=>l.entityType !== entityType)
                    }));
            } else {
                set({
                    importLogs: [],
                    exportLogs: []
                });
            }
        },
        loadFromAPI: async ()=>{
            if (get().initialized) return;
            try {
                const response = await fetch('/api/import-export-logs?limit=500');
                if (response.ok) {
                    const json = await response.json();
                    const data = json.data || {};
                    set({
                        importLogs: data.importLogs || [],
                        exportLogs: data.exportLogs || [],
                        initialized: true
                    });
                }
            } catch (error) {
                console.error('[Import Export Store] loadFromAPI error:', error);
            }
        }
    }));
const selectImportLogs = (state)=>state.importLogs;
const selectExportLogs = (state)=>state.exportLogs;
const selectImportLogsByEntity = (entityType)=>(state)=>state.importLogs.filter((l)=>l.entityType === entityType);
const selectExportLogsByEntity = (entityType)=>(state)=>state.exportLogs.filter((l)=>l.entityType === entityType); // ============================================
 // FUTURE: API Service (Next.js migration)
 // ============================================
 // 
 // export async function saveImportLog(log: Omit<ImportLogEntry, 'id'>) {
 //   return fetch('/api/import-export/logs', {
 //     method: 'POST',
 //     headers: { 'Content-Type': 'application/json' },
 //     body: JSON.stringify({ type: 'import', ...log }),
 //   }).then(r => r.json());
 // }
 // 
 // export async function getImportExportLogs(params: {
 //   entityType?: string;
 //   type?: 'import' | 'export';
 //   limit?: number;
 // }) {
 //   const query = new URLSearchParams(params as Record<string, string>);
 //   return fetch(`/api/import-export/logs?${query}`).then(r => r.json());
 // }
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/import-export/employee-mapping-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "saveMappingsFromAutoMap",
    ()=>saveMappingsFromAutoMap,
    "useEmployeeMappingStore",
    ()=>useEmployeeMappingStore
]);
/**
 * Employee Mapping Store
 * 
 * Lưu mapping giữa tên NV máy chấm công → Mã NV hệ thống
 * Mapping được lưu để tái sử dụng cho các lần import sau
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
;
// Generate simple ID
const generateMappingId = ()=>{
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 6);
    return `MAP_${timestamp}_${random}`;
};
/**
 * Normalize tên để so sánh (lowercase, remove diacritics, trim)
 */ function normalizeName(name) {
    return name.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/đ/g, 'd').replace(/Đ/g, 'D').replace(/\s+/g, ' '); // Normalize spaces
}
/**
 * Check if two names match (fuzzy matching)
 */ function namesMatch(machineName, systemName) {
    const normalizedMachine = normalizeName(machineName);
    const normalizedSystem = normalizeName(systemName);
    // Exact match
    if (normalizedMachine === normalizedSystem) return true;
    // Machine name is part of system name
    if (normalizedSystem.includes(normalizedMachine)) return true;
    // System name parts match machine name
    const systemParts = normalizedSystem.split(' ');
    const machineParts = normalizedMachine.split(' ');
    // Check if all machine parts are in system name
    const allPartsMatch = machineParts.every((part)=>systemParts.some((sp)=>sp === part || sp.includes(part) || part.includes(sp)));
    if (allPartsMatch && machineParts.length >= 2) return true;
    // Check last name + first name match
    // VD: "duc dat" matches "Nguyễn Đức Đạt" (đức đạt)
    if (systemParts.length >= 2 && machineParts.length >= 2) {
        const systemLastParts = systemParts.slice(-2).join(' ');
        if (normalizedMachine === systemLastParts) return true;
    }
    return false;
}
const useEmployeeMappingStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((set, get)=>({
        mappings: [],
        initialized: false,
        addMapping: (entry)=>{
            const id = generateMappingId();
            const now = new Date().toISOString();
            const newEntry = {
                ...entry,
                id,
                createdAt: now,
                updatedAt: now
            };
            set((state)=>({
                    mappings: [
                        ...state.mappings,
                        newEntry
                    ]
                }));
            return id;
        },
        updateMapping: (id, updates)=>{
            set((state)=>({
                    mappings: state.mappings.map((m)=>m.id === id ? {
                            ...m,
                            ...updates,
                            updatedAt: new Date().toISOString()
                        } : m)
                }));
        },
        deleteMapping: (id)=>{
            set((state)=>({
                    mappings: state.mappings.filter((m)=>m.id !== id)
                }));
        },
        addMappings: (entries)=>{
            const now = new Date().toISOString();
            const newEntries = entries.map((entry)=>({
                    ...entry,
                    id: generateMappingId(),
                    createdAt: now,
                    updatedAt: now
                }));
            set((state)=>({
                    mappings: [
                        ...state.mappings,
                        ...newEntries
                    ]
                }));
        },
        clearMappings: ()=>{
            set({
                mappings: []
            });
        },
        findByMachineName: (machineName)=>{
            const normalized = normalizeName(machineName);
            return get().mappings.find((m)=>normalizeName(m.machineName) === normalized);
        },
        findByMachineId: (machineId)=>{
            return get().mappings.find((m)=>m.machineEmployeeId === machineId);
        },
        findBySystemId: (systemId)=>{
            return get().mappings.find((m)=>m.systemEmployeeId === systemId);
        },
        autoMapEmployees: (machineNames, systemEmployees)=>{
            const mapped = [];
            const unmapped = [];
            const existingMappings = get().mappings;
            for (const machineName of machineNames){
                // 1. Check existing mapping first
                const existingMapping = existingMappings.find((m)=>normalizeName(m.machineName) === normalizeName(machineName));
                if (existingMapping) {
                    mapped.push({
                        machineName,
                        systemId: existingMapping.systemEmployeeId,
                        systemName: existingMapping.systemEmployeeName
                    });
                    continue;
                }
                // 2. Try to auto-match with system employees
                const matchedEmployee = systemEmployees.find((emp)=>namesMatch(machineName, emp.fullName));
                if (matchedEmployee) {
                    mapped.push({
                        machineName,
                        systemId: matchedEmployee.businessId,
                        systemName: matchedEmployee.fullName
                    });
                } else {
                    unmapped.push(machineName);
                }
            }
            return {
                mapped,
                unmapped
            };
        },
        loadFromAPI: async ()=>{
            if (get().initialized) return;
            try {
                // NOTE: Employee mappings are typically small dataset
                const response = await fetch('/api/employee-mappings?limit=100');
                if (response.ok) {
                    const json = await response.json();
                    const data = json.data || [];
                    if (data.length > 0) {
                        set({
                            mappings: data,
                            initialized: true
                        });
                    } else {
                        set({
                            initialized: true
                        });
                    }
                }
            } catch (error) {
                console.error('[Employee Mapping Store] loadFromAPI error:', error);
            }
        }
    }));
function saveMappingsFromAutoMap(autoMapResult, machineIds) {
    const store = useEmployeeMappingStore.getState();
    const newMappings = autoMapResult.mapped.filter((m)=>!store.findByMachineName(m.machineName)) // Skip existing
    .map((m)=>({
            machineEmployeeId: machineIds.get(m.machineName) || 0,
            machineName: m.machineName,
            systemEmployeeId: m.systemId,
            systemEmployeeName: m.systemName
        }));
    if (newMappings.length > 0) {
        store.addMappings(newMappings);
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/import-export/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Import/Export Utilities
 * 
 * Các hàm tiện ích cho import/export:
 * - Preview (rà soát) dữ liệu trước khi import
 * - Validate fields và rows
 * - Transform data
 */ __turbopack_context__.s([
    "checkUniqueFields",
    ()=>checkUniqueFields,
    "formatFileSize",
    ()=>formatFileSize,
    "generateExportFileName",
    ()=>generateExportFileName,
    "previewImportData",
    ()=>previewImportData,
    "transformExportRow",
    ()=>transformExportRow,
    "transformImportRow",
    ()=>transformImportRow,
    "validateField",
    ()=>validateField
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-client] (ecmascript)");
;
function previewImportData(rawRows, config, existingData, mode = 'upsert', branchSystemId) {
    const rows = [];
    let validCount = 0;
    let warningCount = 0;
    let errorCount = 0;
    let duplicateCount = 0;
    // 0. Pre-process all rows if defined (for fill-down logic, multi-row grouping)
    let processedRawRows = rawRows;
    if (config.preProcessRows) {
        processedRawRows = config.preProcessRows(rawRows);
    }
    processedRawRows.forEach((rawData, index)=>{
        const rowErrors = [];
        const rowWarnings = [];
        // 0.5. Apply preTransformRawRow if defined (normalize/merge raw columns)
        let normalizedRawData = rawData;
        if (config.preTransformRawRow) {
            normalizedRawData = config.preTransformRawRow(rawData);
        }
        // 1. Transform raw data to typed data
        let transformedData = transformImportRow(normalizedRawData, config.fields);
        // 1.5. Apply postTransformRow if defined (enrich data, lookup IDs, etc.)
        if (config.postTransformRow) {
            transformedData = config.postTransformRow(transformedData, index, branchSystemId);
        }
        // 2. Validate từng field theo config
        for (const field of config.fields){
            if (field.hidden) continue; // Skip hidden fields
            const value = transformedData[field.key];
            const fieldErrors = validateField(value, field, transformedData);
            // Separate warnings from errors (warnings start with [Warning])
            fieldErrors.forEach((err)=>{
                if (err.message.startsWith('[Warning]')) {
                    rowWarnings.push({
                        ...err,
                        message: err.message.replace('[Warning] ', '')
                    });
                } else {
                    rowErrors.push(err);
                }
            });
        }
        // 3. Validate row-level (custom validation) - pass mode so it can skip duplicate checks in upsert
        if (config.validateRow) {
            const rowLevelErrors = config.validateRow(transformedData, index, existingData, mode);
            rowLevelErrors.forEach((err)=>{
                if (err.message.startsWith('[Warning]')) {
                    rowWarnings.push({
                        ...err,
                        message: err.message.replace('[Warning] ', '')
                    });
                } else {
                    rowErrors.push(err);
                }
            });
        }
        // 4. Check existing record (upsert logic)
        let existingRecord = null;
        let isExisting = false;
        let status = 'valid';
        if (config.findExisting) {
            existingRecord = config.findExisting(transformedData, existingData);
        } else if (config.upsertKey) {
            // Default: find by upsertKey
            const businessId = transformedData[config.upsertKey];
            existingRecord = existingData.find((e)=>e[config.upsertKey] === businessId) || null;
        }
        isExisting = existingRecord !== null;
        // 5. Determine status based on mode and validation
        if (rowErrors.length > 0) {
            status = 'error';
            errorCount++;
        } else if (isExisting) {
            if (mode === 'insert-only') {
                status = 'duplicate';
                duplicateCount++;
            } else if (mode === 'update-only' || mode === 'upsert') {
                status = 'will-update';
                if (rowWarnings.length > 0) {
                    status = 'warning';
                    warningCount++;
                } else {
                    validCount++;
                }
            }
        } else {
            if (mode === 'update-only') {
                status = 'error';
                errorCount++;
                rowErrors.push({
                    message: 'Không tìm thấy record để cập nhật'
                });
            } else if (mode === 'insert-only' || mode === 'upsert') {
                status = 'will-insert';
                if (rowWarnings.length > 0) {
                    status = 'warning';
                    warningCount++;
                } else {
                    validCount++;
                }
            }
        }
        rows.push({
            rowNumber: index + 2,
            rawData,
            transformedData: rowErrors.length > 0 ? null : transformedData,
            status,
            errors: rowErrors,
            warnings: rowWarnings,
            isExisting,
            existingRecord: existingRecord || undefined
        });
    });
    return {
        rows,
        totalRows: rawRows.length,
        validCount,
        warningCount,
        errorCount,
        duplicateCount,
        isValid: validCount + warningCount > 0
    };
}
function validateField(value, field, row) {
    const errors = [];
    const fieldKey = field.key;
    // Check required
    if (field.required && (value === undefined || value === null || value === '')) {
        errors.push({
            field: fieldKey,
            message: `${field.label} là bắt buộc`
        });
        return errors; // Skip other validations if required field is empty
    }
    // Skip validation if value is empty and not required
    if (value === undefined || value === null || value === '') {
        return errors;
    }
    // Type-specific validation
    switch(field.type){
        case 'email':
            if (typeof value === 'string' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                errors.push({
                    field: fieldKey,
                    message: `${field.label} không đúng định dạng email`
                });
            }
            break;
        case 'phone':
            if (typeof value === 'string') {
                const cleaned = value.replace(/\s/g, '');
                if (!/^0\d{9,10}$/.test(cleaned)) {
                    errors.push({
                        field: fieldKey,
                        message: `${field.label} không đúng định dạng SĐT`
                    });
                }
            }
            break;
        case 'number':
            if (typeof value !== 'number' && isNaN(Number(value))) {
                errors.push({
                    field: fieldKey,
                    message: `${field.label} phải là số`
                });
            }
            break;
        case 'date':
            if (typeof value === 'string') {
                const date = new Date(value);
                if (isNaN(date.getTime())) {
                    errors.push({
                        field: fieldKey,
                        message: `${field.label} không đúng định dạng ngày`
                    });
                }
            }
            break;
        case 'enum':
            if (field.enumValues && !field.enumValues.includes(String(value))) {
                errors.push({
                    field: fieldKey,
                    message: `${field.label} phải là một trong: ${field.enumValues.join(', ')}`
                });
            }
            break;
        case 'boolean':
            {
                const boolValues = [
                    'true',
                    'false',
                    '1',
                    '0',
                    'yes',
                    'no',
                    'có',
                    'không'
                ];
                if (typeof value === 'string' && !boolValues.includes(value.toLowerCase())) {
                    errors.push({
                        field: fieldKey,
                        message: `${field.label} phải là Có/Không`
                    });
                }
                break;
            }
    }
    // Custom validator
    if (field.validator) {
        const customError = field.validator(value, row);
        if (customError && customError !== true) {
            errors.push({
                field: fieldKey,
                message: customError
            });
        }
    }
    return errors;
}
// ============================================
// DATA TRANSFORMATION
// ============================================
/**
 * Set nested value in object using dot notation key
 * e.g., setNestedValue(obj, 'permanentAddress.street', '123 ABC')
 */ function setNestedValue(obj, path, value) {
    const keys = path.split('.');
    let current = obj;
    for(let i = 0; i < keys.length - 1; i++){
        const key = keys[i];
        if (current[key] === undefined) {
            current[key] = {};
        }
        current = current[key];
    }
    current[keys[keys.length - 1]] = value;
}
/**
 * Get nested value from object using dot notation key
 * e.g., getNestedValue(obj, 'permanentAddress.street')
 */ function getNestedValue(obj, path) {
    if (!obj || typeof obj !== 'object') return undefined;
    const keys = path.split('.');
    let current = obj;
    for (const key of keys){
        if (current === undefined || current === null) return undefined;
        current = current[key];
    }
    return current;
}
function transformImportRow(row, fields) {
    const result = {};
    for (const field of fields){
        const key = field.key;
        let value = row[field.label] ?? row[key]; // Try label first, then key
        // Apply import transform
        if (field.importTransform && value !== undefined) {
            value = field.importTransform(value);
        } else {
            // Default transforms
            switch(field.type){
                case 'number':
                    value = value !== undefined && value !== '' ? Number(value) || 0 : undefined;
                    break;
                case 'boolean':
                    if (typeof value === 'string') {
                        value = [
                            'true',
                            '1',
                            'yes',
                            'có'
                        ].includes(value.toLowerCase());
                    }
                    break;
                case 'date':
                    // Excel serial date → ISO string
                    if (typeof value === 'number') {
                        const date = new Date((value - 25569) * 86400 * 1000);
                        value = date.toISOString().split('T')[0];
                    }
                    break;
            }
        }
        // Apply default value if empty
        if ((value === undefined || value === null || value === '') && field.defaultValue !== undefined) {
            value = field.defaultValue;
        }
        if (value !== undefined && value !== '') {
            // Support nested keys like 'permanentAddress.street'
            if (key.includes('.')) {
                setNestedValue(result, key, value);
            } else {
                result[key] = value;
            }
        }
    }
    return result;
}
function transformExportRow(row, fields, selectedColumns) {
    const result = {};
    for (const field of fields){
        // Skip if not selected
        if (selectedColumns && !selectedColumns.includes(field.key)) {
            continue;
        }
        // Skip if not exportable
        if (field.exportable === false) {
            continue;
        }
        const key = field.key;
        // Support nested keys like 'permanentAddress.street'
        let value = key.includes('.') ? getNestedValue(row, key) : row[key];
        // Apply export transform
        if (field.exportTransform && value !== undefined) {
            value = field.exportTransform(value);
        } else if (field.transform && value !== undefined) {
            // Also use 'transform' for display purposes
            value = field.transform(value);
        } else {
            // Default transforms
            switch(field.type){
                case 'date':
                    if (value) {
                        value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDateForDisplay"])(value);
                    }
                    break;
                case 'boolean':
                    value = value ? 'Có' : 'Không';
                    break;
            }
        }
        result[field.label] = value;
    }
    return result;
}
function checkUniqueFields(row, uniqueFields, existingData, currentBusinessId) {
    const errors = [];
    for (const field of uniqueFields){
        const value = row[field];
        if (!value) continue;
        const duplicate = existingData.find((e)=>{
            // Skip if same record (updating)
            if (currentBusinessId && e[field] === currentBusinessId) {
                return false;
            }
            return e[field] === value;
        });
        if (duplicate) {
            errors.push({
                field: field,
                message: `${field} đã được sử dụng`
            });
        }
    }
    return errors;
}
function generateExportFileName(entityDisplayName, scope) {
    const date = new Date().toISOString().split('T')[0];
    const scopeLabel = scope === 'all' ? 'TatCa' : scope === 'current-page' ? 'TrangHienTai' : 'DaLoc';
    return `${entityDisplayName.replace(/\s+/g, '_')}_${scopeLabel}_${date}.xlsx`;
}
function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = [
        'B',
        'KB',
        'MB',
        'GB'
    ];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/import-export/attendance-parser.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getAvailableSheets",
    ()=>getAvailableSheets,
    "parseAttendanceFile",
    ()=>parseAttendanceFile,
    "parseWorkDays",
    ()=>parseWorkDays,
    "previewSheet",
    ()=>previewSheet
]);
/**
 * Attendance Parser
 * 
 * Parser riêng cho file từ máy chấm công
 * File có format đặc biệt: header phức tạp, merged cells, etc.
 * 
 * Cấu trúc file t11.xls:
 * - Sheet "Bảng tổng hợp chấm công": Tổng hợp theo tháng (DÙNG CHÍNH)
 * - Row 0: Tiêu đề
 * - Row 1: Ngày thống kê (VD: "Ngày thống kê:2025-11-01~2025-11-30")
 * - Row 2-3: Headers
 * - Row 4+: Dữ liệu nhân viên
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/xlsx/xlsx.mjs [app-client] (ecmascript)");
;
function parseAttendanceFile(file) {
    try {
        const workbook = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["read"](file, {
            type: 'array'
        });
        // Tìm sheet "Bảng tổng hợp chấm công"
        const sheetName = 'Bảng tổng hợp chấm công';
        const sheet = workbook.Sheets[sheetName];
        if (!sheet) {
            return {
                success: false,
                data: [],
                month: 0,
                year: 0,
                dateRange: {
                    from: '',
                    to: ''
                },
                errors: [
                    {
                        row: 0,
                        message: `Không tìm thấy sheet "${sheetName}"`
                    }
                ]
            };
        }
        // Convert to array
        const rawData = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils"].sheet_to_json(sheet, {
            header: 1
        });
        // Parse date range từ row 1
        const dateRangeRow = rawData[1];
        const dateRange = parseDateRange(dateRangeRow?.[0] || '');
        // Parse data từ row 4 trở đi
        const data = [];
        const errors = [];
        for(let i = 4; i < rawData.length; i++){
            const row = rawData[i];
            if (!row || row.length === 0) continue;
            // Skip if no employee ID
            const machineId = row[0];
            if (machineId === undefined || machineId === null || machineId === '') continue;
            try {
                const parsed = parseAttendanceRow(row, i + 1); // Excel row = index + 1
                data.push(parsed);
            } catch (err) {
                errors.push({
                    row: i + 1,
                    message: err instanceof Error ? err.message : 'Lỗi không xác định'
                });
            }
        }
        return {
            success: errors.length === 0,
            data,
            month: dateRange.month,
            year: dateRange.year,
            dateRange: {
                from: dateRange.from,
                to: dateRange.to
            },
            errors
        };
    } catch (err) {
        return {
            success: false,
            data: [],
            month: 0,
            year: 0,
            dateRange: {
                from: '',
                to: ''
            },
            errors: [
                {
                    row: 0,
                    message: `Lỗi đọc file: ${err instanceof Error ? err.message : 'Unknown'}`
                }
            ]
        };
    }
}
/**
 * Parse date range từ string "Ngày thống kê:2025-11-01~2025-11-30"
 */ function parseDateRange(text) {
    const match = text.match(/(\d{4}-\d{2}-\d{2})~(\d{4}-\d{2}-\d{2})/);
    if (match) {
        const from = match[1];
        const to = match[2];
        const [year, month] = from.split('-').map(Number);
        return {
            from,
            to,
            month,
            year
        };
    }
    // Default to current month
    const now = new Date();
    return {
        from: '',
        to: '',
        month: now.getMonth() + 1,
        year: now.getFullYear()
    };
}
/**
 * Parse một dòng dữ liệu nhân viên
 * 
 * Cột trong file:
 * A (0): Mã NV (máy)
 * B (1): Họ tên
 * C (2): Phòng ban
 * D (3): TG làm việc chuẩn
 * E (4): TG làm việc thực tế
 * F (5): Đến muộn (lần)
 * G (6): Đến muộn (phút)
 * H (7): Về sớm (lần)
 * I (8): Về sớm (phút)
 * J (9): Tăng ca bình thường
 * K (10): Tăng ca đặc biệt
 * L (11): Số ngày (chuẩn/thực)
 * M (12): Công tác
 * N (13): Nghỉ không phép
 * O (14): Nghỉ phép
 */ function parseAttendanceRow(row, _excelRow) {
    const getNumber = (value)=>{
        if (value === undefined || value === null || value === '') return 0;
        const num = Number(value);
        return isNaN(num) ? 0 : num;
    };
    const getString = (value)=>{
        if (value === undefined || value === null) return '';
        return String(value).trim();
    };
    return {
        machineEmployeeId: getNumber(row[0]),
        employeeName: getString(row[1]),
        department: getString(row[2]),
        standardHours: getNumber(row[3]),
        actualHours: getNumber(row[4]),
        lateCount: getNumber(row[5]),
        lateMinutes: getNumber(row[6]),
        earlyLeaveCount: getNumber(row[7]),
        earlyLeaveMinutes: getNumber(row[8]),
        overtimeNormal: getNumber(row[9]),
        overtimeSpecial: getNumber(row[10]),
        workDays: getString(row[11]),
        businessTrip: getNumber(row[12]),
        absentWithoutLeave: getNumber(row[13]),
        paidLeave: getNumber(row[14])
    };
}
function parseWorkDays(workDays) {
    const cleaned = workDays.replace(/\s/g, '');
    const match = cleaned.match(/(\d+)\/(\d+)/);
    if (match) {
        return {
            standard: parseInt(match[1], 10),
            actual: parseInt(match[2], 10)
        };
    }
    return {
        standard: 0,
        actual: 0
    };
}
function getAvailableSheets(file) {
    const workbook = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["read"](file, {
        type: 'array'
    });
    return workbook.SheetNames;
}
function previewSheet(file, sheetName, maxRows = 10) {
    const workbook = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["read"](file, {
        type: 'array'
    });
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) return [];
    const data = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils"].sheet_to_json(sheet, {
        header: 1
    });
    return data.slice(0, maxRows);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/provinces/store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useProvinceStore",
    ()=>useProvinceStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-client] (ecmascript)");
;
;
;
// Data is now loaded from API instead of static files to reduce bundle size (~3MB)
const API_BASE = '/api/administrative-units';
// Initialize with empty arrays - data will be loaded from API
const normalizedProvinces = [];
const normalizedDistricts = [];
const normalizedWards = [];
// Track loading state across all data types
let dataLoadedState = {
    provinces: false,
    districts: false,
    wards: false
};
const provinceBaseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCrudStore"])(normalizedProvinces, 'provinces', {
    businessIdField: 'id',
    persistKey: 'hrm-provinces',
    getCurrentUser: __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentUserSystemId"]
});
const districtBaseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCrudStore"])(normalizedDistricts, 'districts', {
    persistKey: 'hrm-districts',
    getCurrentUser: __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentUserSystemId"]
});
const wardBaseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCrudStore"])(normalizedWards, 'wards', {
    persistKey: 'hrm-wards',
    getCurrentUser: __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentUserSystemId"]
});
function resetProvinceData(next) {
    provinceBaseStore.setState((state)=>({
            ...state,
            data: [],
            _counters: {
                systemId: 0,
                businessId: 0
            }
        }));
    if (next.length) {
        provinceBaseStore.getState().addMultiple(next);
    }
}
function replaceTwoLevelWards(next) {
    const retained = wardBaseStore.getState().data.filter((ward)=>ward.level !== '2-level');
    wardBaseStore.setState((state)=>({
            ...state,
            data: retained
        }));
    if (next.length) {
        const sanitized = next.map((ward)=>({
                ...ward,
                level: '2-level'
            }));
        wardBaseStore.getState().addMultiple(sanitized);
    }
}
function applyAdministrativeImport(payload) {
    resetProvinceData(payload.provinces);
    replaceTwoLevelWards(payload.wards);
}
// Track loading state
let loadingPromise = null;
const useProvinceStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((set, get)=>{
    provinceBaseStore.subscribe((state)=>set({
            data: state.data
        }));
    districtBaseStore.subscribe((state)=>set({
            districts: state.data
        }));
    wardBaseStore.subscribe((state)=>set({
            wards: state.data
        }));
    return {
        data: provinceBaseStore.getState().data,
        districts: districtBaseStore.getState().data,
        wards: wardBaseStore.getState().data,
        isLoading: false,
        isLoaded: false,
        // Load data from API (database) instead of static files
        loadData: async ()=>{
            // Return existing promise if already loading
            if (loadingPromise) return loadingPromise;
            // Skip if already loaded
            if (dataLoadedState.provinces && dataLoadedState.districts && dataLoadedState.wards) {
                set({
                    isLoaded: true
                });
                return;
            }
            set({
                isLoading: true
            });
            loadingPromise = (async ()=>{
                try {
                    // Fetch all data from API in parallel
                    const [provincesRes, districtsRes, wardsRes] = await Promise.all([
                        fetch(`${API_BASE}/provinces`),
                        fetch(`${API_BASE}/districts`),
                        // Fetch wards with large limit to get all
                        fetch(`${API_BASE}/wards?limit=20000`)
                    ]);
                    if (!provincesRes.ok || !districtsRes.ok || !wardsRes.ok) {
                        throw new Error('Failed to fetch administrative data from API');
                    }
                    const [provincesJson, districtsJson, wardsJson] = await Promise.all([
                        provincesRes.json(),
                        districtsRes.json(),
                        wardsRes.json()
                    ]);
                    const provinces = provincesJson.data || [];
                    const districts = districtsJson.data || [];
                    const wards = wardsJson.data || [];
                    // Update base stores with loaded data
                    provinceBaseStore.setState((state)=>({
                            ...state,
                            data: provinces
                        }));
                    districtBaseStore.setState((state)=>({
                            ...state,
                            data: districts
                        }));
                    wardBaseStore.setState((state)=>({
                            ...state,
                            data: wards
                        }));
                    // Mark all data as loaded
                    dataLoadedState = {
                        provinces: true,
                        districts: true,
                        wards: true
                    };
                    set({
                        isLoading: false,
                        isLoaded: true
                    });
                } catch (error) {
                    console.error('Failed to load administrative data from API:', error);
                    set({
                        isLoading: false
                    });
                } finally{
                    loadingPromise = null;
                }
            })();
            return loadingPromise;
        },
        add: (province)=>provinceBaseStore.getState().add(province),
        addMultiple: (provinces)=>provinceBaseStore.getState().addMultiple(provinces),
        update: (systemId, province)=>provinceBaseStore.getState().update(systemId, province),
        remove: (systemId)=>provinceBaseStore.getState().remove(systemId),
        findById: (systemId)=>provinceBaseStore.getState().findById(systemId),
        addWard: (ward)=>wardBaseStore.getState().add(ward),
        updateWard: (systemId, ward)=>wardBaseStore.getState().update(systemId, ward),
        removeWard: (systemId)=>wardBaseStore.getState().remove(systemId),
        addDistrict: (district)=>districtBaseStore.getState().add(district),
        updateDistrict: (systemId, district)=>districtBaseStore.getState().update(systemId, district),
        removeDistrict: (systemId)=>districtBaseStore.getState().remove(systemId),
        getWards2Level: ()=>get().wards.filter((ward)=>ward.level === '2-level'),
        getWards2LevelByProvinceId: (provinceId)=>get().wards.filter((ward)=>ward.level === '2-level' && ward.provinceId === provinceId),
        getWards3Level: ()=>get().wards.filter((ward)=>ward.level === '3-level'),
        getWards3LevelByProvinceId: (provinceId)=>get().wards.filter((ward)=>ward.level === '3-level' && ward.provinceId === provinceId),
        getWards3LevelByDistrictId: (districtId)=>get().wards.filter((ward)=>ward.level === '3-level' && ward.districtId === districtId),
        getDistricts3LevelByProvinceId: (provinceId)=>get().districts.filter((district)=>district.provinceId === provinceId),
        getWardsByProvinceId: (provinceId)=>get().wards.filter((ward)=>ward.provinceId === provinceId),
        getDistrictsByProvinceId: (provinceId)=>get().districts.filter((district)=>district.provinceId === provinceId),
        getWardsByDistrictId: (districtId)=>get().wards.filter((ward)=>ward.districtId === districtId),
        getDistrictById: (districtId)=>get().districts.find((district)=>district.id === districtId),
        getProvinceById: (provinceId)=>get().data.find((province)=>province.id === provinceId),
        getWardById: (wardId)=>get().wards.find((ward)=>ward.id === wardId),
        importAdministrativeUnits: (payload)=>applyAdministrativeImport(payload)
    };
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/import-export/address-lookup.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "enrichEmployeeAddresses",
    ()=>enrichEmployeeAddresses,
    "findDistrictByName",
    ()=>findDistrictByName,
    "findProvinceByName",
    ()=>findProvinceByName,
    "findWardByName",
    ()=>findWardByName,
    "lookupAddressIds",
    ()=>lookupAddressIds
]);
/**
 * Address Lookup Helper for Import
 * 
 * Chuyển đổi tên địa chỉ thành ID để form edit có thể populate đúng dropdown
 * 
 * LƯU Ý QUAN TRỌNG:
 * - Dữ liệu 2-level: 34 tỉnh mới (provinces-data) + wards-2level-data
 * - Dữ liệu 3-level: 63 tỉnh cũ (wards-3level-data có provinceName riêng)
 * - Cần lookup từ WARD trước để lấy đúng provinceId/districtId từ ward data
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$provinces$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/provinces/store.ts [app-client] (ecmascript)");
;
// Common aliases for provinces
// KEY = name in provinces-data (TP HCM, Hà Nội, etc.)
// VALUES = all possible variants including 3-level names
const PROVINCE_ALIASES = {
    'TP HCM': [
        'tp hcm',
        'tphcm',
        'hcm',
        'sai gon',
        'saigon',
        'thanh pho ho chi minh',
        'tp ho chi minh',
        'ho chi minh',
        'thành phố hồ chí minh'
    ],
    'Hà Nội': [
        'ha noi',
        'hanoi',
        'hn',
        'thanh pho ha noi',
        'tp ha noi',
        'thành phố hà nội'
    ],
    'Đà Nẵng': [
        'da nang',
        'danang',
        'thanh pho da nang',
        'tp da nang',
        'thành phố đà nẵng'
    ],
    'Hải Phòng': [
        'hai phong',
        'haiphong',
        'hp',
        'thanh pho hai phong',
        'tp hai phong',
        'thành phố hải phòng'
    ],
    'Cần Thơ': [
        'can tho',
        'cantho',
        'thanh pho can tho',
        'tp can tho',
        'thành phố cần thơ'
    ]
};
/**
 * Normalize tên để so sánh (bỏ dấu, lowercase)
 */ function normalizeText(text) {
    return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').trim();
}
/**
 * So sánh 2 string đã normalize
 */ function matchText(a, b) {
    return normalizeText(a) === normalizeText(b);
}
function findProvinceByName(provinceName) {
    if (!provinceName) return null;
    const store = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$provinces$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProvinceStore"].getState();
    const provinces = store.data;
    // Exact match first
    let found = provinces.find((p)=>p.name === provinceName);
    if (found) return {
        id: found.id,
        name: found.name
    };
    // Normalized match
    found = provinces.find((p)=>matchText(p.name, provinceName));
    if (found) return {
        id: found.id,
        name: found.name
    };
    // Try alias match
    const normalizedInput = normalizeText(provinceName);
    for (const [standardName, aliases] of Object.entries(PROVINCE_ALIASES)){
        if (aliases.some((alias)=>alias === normalizedInput || normalizedInput.includes(alias) || alias.includes(normalizedInput))) {
            found = provinces.find((p)=>p.name === standardName);
            if (found) return {
                id: found.id,
                name: found.name
            };
        }
    }
    // Partial match (contains) - last resort
    found = provinces.find((p)=>normalizeText(p.name).includes(normalizedInput) || normalizedInput.includes(normalizeText(p.name)));
    return found ? {
        id: found.id,
        name: found.name
    } : null;
}
/**
 * Remove common prefixes from district/ward names for better matching
 */ function removeCommonPrefixes(text) {
    const prefixes = [
        'quan ',
        'huyen ',
        'thi xa ',
        'thanh pho ',
        'tp ',
        'phuong ',
        'xa ',
        'thi tran ',
        'tt '
    ];
    const normalized = normalizeText(text);
    for (const prefix of prefixes){
        if (normalized.startsWith(prefix)) {
            return normalized.slice(prefix.length);
        }
    }
    return normalized;
}
function findDistrictByName(districtName, provinceId) {
    if (!districtName || !provinceId) return null;
    const store = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$provinces$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProvinceStore"].getState();
    const districts = store.districts.filter((d)=>d.provinceId === provinceId);
    // Exact match first
    let found = districts.find((d)=>d.name === districtName);
    if (found) return {
        id: found.id,
        name: found.name
    };
    // Normalized match
    found = districts.find((d)=>matchText(d.name, districtName));
    if (found) return {
        id: found.id,
        name: found.name
    };
    // Try matching without prefixes
    const inputWithoutPrefix = removeCommonPrefixes(districtName);
    found = districts.find((d)=>{
        const dbWithoutPrefix = removeCommonPrefixes(d.name);
        return dbWithoutPrefix === inputWithoutPrefix;
    });
    if (found) return {
        id: found.id,
        name: found.name
    };
    // Partial match - last resort
    const normalizedInput = normalizeText(districtName);
    found = districts.find((d)=>normalizeText(d.name).includes(normalizedInput) || normalizedInput.includes(normalizeText(d.name)));
    return found ? {
        id: found.id,
        name: found.name
    } : null;
}
function findWardByName(wardName, provinceId, districtId, inputLevel) {
    if (!wardName || !provinceId) return null;
    const store = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$provinces$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProvinceStore"].getState();
    let wards = store.wards.filter((w)=>w.provinceId === provinceId);
    // Filter by level
    if (inputLevel === '3-level' && districtId) {
        wards = wards.filter((w)=>w.level === '3-level' && w.districtId === districtId);
    } else if (inputLevel === '2-level') {
        wards = wards.filter((w)=>w.level === '2-level');
    }
    // Exact match first
    let found = wards.find((w)=>w.name === wardName);
    if (found) {
        return {
            id: found.id,
            name: found.name,
            districtId: found.districtId,
            districtName: found.districtName
        };
    }
    // Normalized match
    found = wards.find((w)=>matchText(w.name, wardName));
    if (found) {
        return {
            id: found.id,
            name: found.name,
            districtId: found.districtId,
            districtName: found.districtName
        };
    }
    // Try matching without prefixes
    const inputWithoutPrefix = removeCommonPrefixes(wardName);
    found = wards.find((w)=>{
        const dbWithoutPrefix = removeCommonPrefixes(w.name);
        return dbWithoutPrefix === inputWithoutPrefix;
    });
    if (found) {
        return {
            id: found.id,
            name: found.name,
            districtId: found.districtId,
            districtName: found.districtName
        };
    }
    // Partial match - last resort
    const normalizedInput = normalizeText(wardName);
    found = wards.find((w)=>normalizeText(w.name).includes(normalizedInput) || normalizedInput.includes(normalizeText(w.name)));
    return found ? {
        id: found.id,
        name: found.name,
        districtId: found.districtId,
        districtName: found.districtName
    } : null;
}
function lookupAddressIds(address) {
    if (!address) return null;
    if (!address.street && !address.province && !address.ward) return null;
    const inputLevel = address.inputLevel || '3-level';
    const store = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$provinces$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProvinceStore"].getState();
    console.log('[lookupAddressIds] Input address:', address);
    console.log('[lookupAddressIds] inputLevel:', inputLevel);
    let provinceId = address.provinceId || '';
    let provinceName = address.province || '';
    let districtId = address.districtId || 0;
    let districtName = address.district || '';
    let wardId = address.wardId || '';
    let wardName = address.ward || '';
    // === STRATEGY: Lookup từ ward trước (có đầy đủ thông tin) ===
    if (address.ward) {
        const allWards = store.wards;
        const _normalizedWardInput = normalizeText(address.ward);
        const wardWithoutPrefix = removeCommonPrefixes(address.ward);
        // Filter wards by level
        const wardsOfLevel = allWards.filter((w)=>inputLevel === '2-level' ? w.level === '2-level' : w.level === '3-level');
        // Try to find ward matching name AND province/district context
        let foundWard = wardsOfLevel.find((w)=>{
            const nameMatch = w.name === address.ward || matchText(w.name, address.ward) || removeCommonPrefixes(w.name) === wardWithoutPrefix;
            if (!nameMatch) return false;
            // If province name provided, check if it matches ward's province
            if (address.province) {
                const normalizedProvince = normalizeText(address.province);
                const wardProvince = normalizeText(w.provinceName || '');
                // Check various matching patterns
                if (!wardProvince.includes(normalizedProvince) && !normalizedProvince.includes(wardProvince) && !matchProvinceAlias(address.province, w.provinceName || '')) {
                    return false;
                }
            }
            // If district name provided (3-level), check if it matches
            if (inputLevel === '3-level' && address.district && w.districtName) {
                const normalizedDistrict = normalizeText(address.district);
                const wardDistrict = normalizeText(w.districtName);
                const districtWithoutPrefix = removeCommonPrefixes(address.district);
                const wardDistrictWithoutPrefix = removeCommonPrefixes(w.districtName);
                if (!wardDistrict.includes(normalizedDistrict) && !normalizedDistrict.includes(wardDistrict) && wardDistrictWithoutPrefix !== districtWithoutPrefix) {
                    return false;
                }
            }
            return true;
        });
        // If not found with context, try just by ward name
        if (!foundWard) {
            foundWard = wardsOfLevel.find((w)=>w.name === address.ward || matchText(w.name, address.ward) || removeCommonPrefixes(w.name) === wardWithoutPrefix);
        }
        if (foundWard) {
            console.log('[lookupAddressIds] Found ward:', foundWard);
            wardId = foundWard.id;
            wardName = foundWard.name;
            // IMPORTANT: Get provinceId from provinces-data (not from ward's provinceId)
            // because ward data might have different provinceId (e.g. "00" vs "24" for HCM)
            const provinceFromData = findProvinceByName(foundWard.provinceName || address.province || '');
            if (provinceFromData) {
                provinceId = provinceFromData.id;
                provinceName = provinceFromData.name;
            } else {
                // Fallback to ward's data if not found in provinces-data
                provinceId = foundWard.provinceId;
                provinceName = foundWard.provinceName || address.province || '';
            }
            if (foundWard.districtId) {
                districtId = foundWard.districtId;
                districtName = foundWard.districtName || address.district || '';
            }
        } else {
            console.log('[lookupAddressIds] Ward NOT FOUND for:', address.ward);
        }
    }
    // === Fallback: If no ward found, try province lookup ===
    if (!wardId && address.province) {
        const province = findProvinceByName(address.province);
        if (province) {
            provinceId = province.id;
            provinceName = province.name;
        }
        // Try district lookup if province found
        if (provinceId && address.district && inputLevel === '3-level') {
            const district = findDistrictByName(address.district, provinceId);
            if (district) {
                districtId = district.id;
                districtName = district.name;
            }
        }
    }
    console.log('[lookupAddressIds] Result:', {
        provinceId,
        provinceName,
        districtId,
        districtName,
        wardId,
        wardName
    });
    return {
        street: address.street || '',
        province: provinceName,
        provinceId: provinceId,
        district: districtName,
        districtId: districtId,
        ward: wardName,
        wardId: wardId,
        inputLevel: inputLevel
    };
}
/**
 * Check if province names match (including aliases)
 */ function matchProvinceAlias(input, dbName) {
    const normalizedInput = normalizeText(input);
    const normalizedDb = normalizeText(dbName);
    // Direct match
    if (normalizedInput === normalizedDb) return true;
    // Check aliases
    for (const [standardName, aliases] of Object.entries(PROVINCE_ALIASES)){
        const normalizedStandard = normalizeText(standardName);
        const inputIsAlias = aliases.some((a)=>a === normalizedInput || normalizedInput.includes(a));
        const dbIsStandard = normalizedDb === normalizedStandard || normalizedDb.includes(normalizedStandard);
        const dbIsAlias = aliases.some((a)=>normalizedDb.includes(a));
        if (inputIsAlias && (dbIsStandard || dbIsAlias)) return true;
        if (dbIsAlias && normalizedInput === normalizedStandard) return true;
    }
    return false;
}
function enrichEmployeeAddresses(data) {
    const result = {
        ...data
    };
    console.log('[Address Lookup] Input:', {
        permanentAddress: data.permanentAddress,
        temporaryAddress: data.temporaryAddress
    });
    if (data.permanentAddress) {
        const enriched = lookupAddressIds(data.permanentAddress);
        console.log('[Address Lookup] permanentAddress enriched:', enriched);
        if (enriched) {
            result.permanentAddress = enriched;
        }
    }
    if (data.temporaryAddress) {
        const enriched = lookupAddressIds(data.temporaryAddress);
        console.log('[Address Lookup] temporaryAddress enriched:', enriched);
        if (enriched) {
            result.temporaryAddress = enriched;
        }
    }
    return result;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/import-export/configs/employee.config.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "employeeConfig",
    ()=>employeeConfig,
    "employeeFields",
    ()=>employeeFields,
    "employeeImportExportConfig",
    ()=>employeeImportExportConfig
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$export$2f$address$2d$lookup$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/import-export/address-lookup.ts [app-client] (ecmascript)");
;
function parseEmployeeAddresses(rawRow) {
    const addresses = [];
    // Địa chỉ thường trú
    const permanentProvince = rawRow['Tỉnh/TP thường trú'];
    const permanentWard = rawRow['Phường/Xã thường trú'];
    const permanentStreet = rawRow['Số nhà, đường thường trú'];
    if (permanentProvince || permanentWard || permanentStreet) {
        addresses.push({
            type: 'permanent',
            province: String(permanentProvince || ''),
            ward: String(permanentWard || ''),
            street: String(permanentStreet || '')
        });
    }
    // Địa chỉ tạm trú
    const temporaryProvince = rawRow['Tỉnh/TP tạm trú'];
    const temporaryWard = rawRow['Phường/Xã tạm trú'];
    const temporaryStreet = rawRow['Số nhà, đường tạm trú'];
    if (temporaryProvince || temporaryWard || temporaryStreet) {
        addresses.push({
            type: 'temporary',
            province: String(temporaryProvince || ''),
            ward: String(temporaryWard || ''),
            street: String(temporaryStreet || '')
        });
    }
    return addresses;
}
/**
 * Normalize raw row từ template
 * Convert địa chỉ thường trú/tạm trú thành permanentAddress/temporaryAddress
 */ function normalizeEmployeeRawRow(rawRow) {
    const result = {
        ...rawRow
    };
    const parsedAddresses = parseEmployeeAddresses(rawRow);
    for (const addr of parsedAddresses){
        if (addr.type === 'permanent') {
            // Địa chỉ thường trú -> permanentAddress
            result['__permanentAddress__'] = {
                province: addr.province,
                ward: addr.ward,
                street: addr.street,
                inputLevel: '2-level'
            };
        } else if (addr.type === 'temporary') {
            // Địa chỉ tạm trú -> temporaryAddress
            result['__temporaryAddress__'] = {
                province: addr.province,
                ward: addr.ward,
                street: addr.street,
                inputLevel: '2-level'
            };
        }
    }
    return result;
}
// Field definitions cho Employee - ĐẦY ĐỦ tất cả fields
// CHỈ BẮT BUỘC: id (Mã nhân viên) và fullName (Họ và tên)
const employeeFields = [
    // ===== THÔNG TIN CƠ BẢN =====
    {
        key: 'id',
        label: 'Mã nhân viên (*)',
        required: true,
        type: 'string',
        exportGroup: 'Thông tin cơ bản',
        example: 'NV001'
    },
    {
        key: 'fullName',
        label: 'Họ và tên (*)',
        required: true,
        type: 'string',
        exportGroup: 'Thông tin cơ bản',
        example: 'Nguyễn Văn A'
    },
    {
        key: 'gender',
        label: 'Giới tính',
        required: false,
        type: 'string',
        exportGroup: 'Thông tin cơ bản',
        example: 'male'
    },
    {
        key: 'dateOfBirth',
        label: 'Ngày sinh',
        required: false,
        type: 'date',
        exportGroup: 'Thông tin cơ bản',
        example: '1990-01-15'
    },
    {
        key: 'placeOfBirth',
        label: 'Nơi sinh',
        required: false,
        type: 'string',
        exportGroup: 'Thông tin cơ bản',
        example: 'Hà Nội'
    },
    {
        key: 'nationality',
        label: 'Quốc tịch',
        required: false,
        type: 'string',
        exportGroup: 'Thông tin cơ bản',
        example: 'Việt Nam'
    },
    {
        key: 'religion',
        label: 'Tôn giáo',
        required: false,
        type: 'string',
        exportGroup: 'Thông tin cơ bản',
        example: 'Không'
    },
    {
        key: 'maritalStatus',
        label: 'Tình trạng hôn nhân',
        required: false,
        type: 'string',
        exportGroup: 'Thông tin cơ bản',
        example: 'single'
    },
    {
        key: 'avatar',
        label: 'Ảnh đại diện',
        required: false,
        type: 'string',
        exportGroup: 'Thông tin cơ bản',
        hidden: true
    },
    // ===== THÔNG TIN ĐĂNG NHẬP =====
    {
        key: 'workEmail',
        label: 'Email công ty',
        required: false,
        type: 'string',
        exportGroup: 'Thông tin đăng nhập',
        example: 'nguyenvana@company.com',
        validator: (value)=>{
            if (!value) return true;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(String(value)) || 'Email không hợp lệ';
        }
    },
    {
        key: 'password',
        label: 'Mật khẩu',
        required: false,
        type: 'string',
        exportGroup: 'Thông tin đăng nhập',
        example: '********',
        hidden: true
    },
    {
        key: 'role',
        label: 'Vai trò hệ thống (*Mặc định: employee)',
        required: false,
        type: 'string',
        exportGroup: 'Thông tin đăng nhập',
        example: 'employee',
        defaultValue: 'employee'
    },
    // ===== GIẤY TỜ TÙY THÂN =====
    {
        key: 'nationalId',
        label: 'CMND/CCCD',
        required: false,
        type: 'string',
        exportGroup: 'Giấy tờ tùy thân',
        example: '012345678901'
    },
    {
        key: 'nationalIdIssueDate',
        label: 'Ngày cấp CMND/CCCD',
        required: false,
        type: 'date',
        exportGroup: 'Giấy tờ tùy thân',
        example: '2020-01-15'
    },
    {
        key: 'nationalIdIssuePlace',
        label: 'Nơi cấp CMND/CCCD',
        required: false,
        type: 'string',
        exportGroup: 'Giấy tờ tùy thân',
        example: 'CA TP Hà Nội'
    },
    {
        key: 'personalTaxId',
        label: 'Mã số thuế cá nhân',
        required: false,
        type: 'string',
        exportGroup: 'Giấy tờ tùy thân',
        example: '0123456789'
    },
    {
        key: 'socialInsuranceNumber',
        label: 'Số sổ BHXH',
        required: false,
        type: 'string',
        exportGroup: 'Giấy tờ tùy thân',
        example: '1234567890'
    },
    // ===== LIÊN HỆ =====
    {
        key: 'personalEmail',
        label: 'Email cá nhân',
        required: false,
        type: 'string',
        exportGroup: 'Liên hệ',
        example: 'nguyenvana@gmail.com',
        validator: (value)=>{
            if (!value) return true;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(String(value)) || 'Email không hợp lệ';
        }
    },
    {
        key: 'phone',
        label: 'Số điện thoại',
        required: false,
        type: 'string',
        exportGroup: 'Liên hệ',
        example: '0901234567'
    },
    // ===== ĐỊA CHỈ THƯỜNG TRÚ (hệ thống 2 cấp) =====
    {
        key: 'permanentAddress.province',
        label: 'Tỉnh/TP thường trú',
        required: false,
        type: 'string',
        exportGroup: 'Địa chỉ thường trú',
        example: 'Hà Nội'
    },
    {
        key: 'permanentAddress.ward',
        label: 'Phường/Xã thường trú',
        required: false,
        type: 'string',
        exportGroup: 'Địa chỉ thường trú',
        example: 'Phường Điện Biên'
    },
    {
        key: 'permanentAddress.street',
        label: 'Số nhà, đường thường trú',
        required: false,
        type: 'string',
        exportGroup: 'Địa chỉ thường trú',
        example: '123 Đường ABC'
    },
    // ===== ĐỊA CHỈ TẠM TRÚ (hệ thống 2 cấp) =====
    {
        key: 'temporaryAddress.province',
        label: 'Tỉnh/TP tạm trú',
        required: false,
        type: 'string',
        exportGroup: 'Địa chỉ tạm trú',
        example: 'Hà Nội'
    },
    {
        key: 'temporaryAddress.ward',
        label: 'Phường/Xã tạm trú',
        required: false,
        type: 'string',
        exportGroup: 'Địa chỉ tạm trú',
        example: 'Phường Cống Vị'
    },
    {
        key: 'temporaryAddress.street',
        label: 'Số nhà, đường tạm trú',
        required: false,
        type: 'string',
        exportGroup: 'Địa chỉ tạm trú',
        example: '456 Đường XYZ'
    },
    // ===== LIÊN HỆ KHẨN CẤP =====
    {
        key: 'emergencyContactName',
        label: 'Người liên hệ khẩn cấp',
        required: false,
        type: 'string',
        exportGroup: 'Liên hệ khẩn cấp',
        example: 'Nguyễn Văn B'
    },
    {
        key: 'emergencyContactPhone',
        label: 'SĐT khẩn cấp',
        required: false,
        type: 'string',
        exportGroup: 'Liên hệ khẩn cấp',
        example: '0908765432'
    },
    // ===== CÔNG VIỆC =====
    {
        key: 'departmentId',
        label: 'Mã phòng ban',
        required: false,
        type: 'string',
        exportGroup: 'Công việc',
        example: 'PB001'
    },
    {
        key: 'departmentName',
        label: 'Tên phòng ban',
        required: false,
        type: 'string',
        exportGroup: 'Công việc',
        example: 'Phòng Kinh doanh'
    },
    {
        key: 'department',
        label: 'Bộ phận',
        required: false,
        type: 'string',
        exportGroup: 'Công việc',
        example: 'Kinh doanh'
    },
    {
        key: 'positionId',
        label: 'Mã chức vụ',
        required: false,
        type: 'string',
        exportGroup: 'Công việc',
        example: 'CV001'
    },
    {
        key: 'positionName',
        label: 'Tên chức vụ',
        required: false,
        type: 'string',
        exportGroup: 'Công việc',
        example: 'Trưởng phòng'
    },
    {
        key: 'jobTitle',
        label: 'Chức danh',
        required: false,
        type: 'string',
        exportGroup: 'Công việc',
        example: 'Nhân viên kinh doanh'
    },
    {
        key: 'employeeType',
        label: 'Loại nhân viên',
        required: false,
        type: 'string',
        exportGroup: 'Công việc',
        example: 'Chính thức'
    },
    {
        key: 'employmentStatus',
        label: 'Trạng thái làm việc (*Mặc định: Đang làm việc)',
        required: false,
        type: 'string',
        exportGroup: 'Công việc',
        example: 'Đang làm việc',
        defaultValue: 'Đang làm việc'
    },
    {
        key: 'status',
        label: 'Trạng thái (*Mặc định: active)',
        required: false,
        type: 'string',
        exportGroup: 'Công việc',
        example: 'active',
        defaultValue: 'active'
    },
    {
        key: 'hireDate',
        label: 'Ngày tuyển dụng',
        required: false,
        type: 'date',
        exportGroup: 'Công việc',
        example: '2023-01-01'
    },
    {
        key: 'startDate',
        label: 'Ngày bắt đầu làm việc',
        required: false,
        type: 'date',
        exportGroup: 'Công việc',
        example: '2023-01-15'
    },
    {
        key: 'endDate',
        label: 'Ngày kết thúc',
        required: false,
        type: 'date',
        exportGroup: 'Công việc',
        example: ''
    },
    {
        key: 'terminationDate',
        label: 'Ngày nghỉ việc',
        required: false,
        type: 'date',
        exportGroup: 'Công việc',
        example: ''
    },
    {
        key: 'reasonForLeaving',
        label: 'Lý do nghỉ việc',
        required: false,
        type: 'string',
        exportGroup: 'Công việc',
        example: ''
    },
    {
        key: 'branchSystemId',
        label: 'Mã chi nhánh',
        required: false,
        type: 'string',
        exportGroup: 'Công việc',
        example: 'CN001'
    },
    // ===== THỬ VIỆC & HỢP ĐỒNG =====
    {
        key: 'probationEndDate',
        label: 'Ngày kết thúc thử việc',
        required: false,
        type: 'date',
        exportGroup: 'Thử việc & Hợp đồng',
        example: '2023-03-31'
    },
    {
        key: 'contractNumber',
        label: 'Số hợp đồng',
        required: false,
        type: 'string',
        exportGroup: 'Thử việc & Hợp đồng',
        example: 'HD-2023-001'
    },
    {
        key: 'contractType',
        label: 'Loại hợp đồng',
        required: false,
        type: 'string',
        exportGroup: 'Thử việc & Hợp đồng',
        example: 'definite'
    },
    {
        key: 'contractStartDate',
        label: 'Ngày bắt đầu HĐ',
        required: false,
        type: 'date',
        exportGroup: 'Thử việc & Hợp đồng',
        example: '2023-04-01'
    },
    {
        key: 'contractEndDate',
        label: 'Ngày kết thúc HĐ',
        required: false,
        type: 'date',
        exportGroup: 'Thử việc & Hợp đồng',
        example: '2024-03-31'
    },
    // ===== THỜI GIAN LÀM VIỆC =====
    {
        key: 'workingHoursPerDay',
        label: 'Số giờ/ngày (*Mặc định: 8)',
        required: false,
        type: 'number',
        exportGroup: 'Thời gian làm việc',
        example: '8',
        defaultValue: 8
    },
    {
        key: 'workingDaysPerWeek',
        label: 'Số ngày/tuần (*Mặc định: 5)',
        required: false,
        type: 'number',
        exportGroup: 'Thời gian làm việc',
        example: '5',
        defaultValue: 5
    },
    {
        key: 'shiftType',
        label: 'Ca làm việc',
        required: false,
        type: 'string',
        exportGroup: 'Thời gian làm việc',
        example: 'day'
    },
    // ===== LƯƠNG & THU NHẬP =====
    {
        key: 'baseSalary',
        label: 'Lương cơ bản',
        required: false,
        type: 'number',
        exportGroup: 'Lương & Thu nhập',
        example: '15000000'
    },
    {
        key: 'socialInsuranceSalary',
        label: 'Lương đóng BHXH',
        required: false,
        type: 'number',
        exportGroup: 'Lương & Thu nhập',
        example: '10000000'
    },
    {
        key: 'positionAllowance',
        label: 'Phụ cấp chức vụ',
        required: false,
        type: 'number',
        exportGroup: 'Lương & Thu nhập',
        example: '2000000'
    },
    {
        key: 'mealAllowance',
        label: 'Phụ cấp ăn trưa',
        required: false,
        type: 'number',
        exportGroup: 'Lương & Thu nhập',
        example: '730000'
    },
    {
        key: 'otherAllowances',
        label: 'Phụ cấp khác',
        required: false,
        type: 'number',
        exportGroup: 'Lương & Thu nhập',
        example: '500000'
    },
    {
        key: 'numberOfDependents',
        label: 'Số người phụ thuộc',
        required: false,
        type: 'number',
        exportGroup: 'Lương & Thu nhập',
        example: '1'
    },
    // ===== NGÂN HÀNG =====
    {
        key: 'bankAccountNumber',
        label: 'Số tài khoản',
        required: false,
        type: 'string',
        exportGroup: 'Ngân hàng',
        example: '1234567890123'
    },
    {
        key: 'bankName',
        label: 'Ngân hàng',
        required: false,
        type: 'string',
        exportGroup: 'Ngân hàng',
        example: 'Vietcombank'
    },
    {
        key: 'bankBranch',
        label: 'Chi nhánh',
        required: false,
        type: 'string',
        exportGroup: 'Ngân hàng',
        example: 'CN Hà Nội'
    },
    // ===== NGHỈ PHÉP =====
    {
        key: 'annualLeaveBalance',
        label: 'Số ngày phép còn',
        required: false,
        type: 'number',
        exportGroup: 'Nghỉ phép',
        example: '12'
    },
    {
        key: 'leaveTaken',
        label: 'Số ngày đã nghỉ (*Mặc định: 0)',
        required: false,
        type: 'number',
        exportGroup: 'Nghỉ phép',
        example: '3',
        defaultValue: 0
    },
    {
        key: 'paidLeaveTaken',
        label: 'Nghỉ phép có lương',
        required: false,
        type: 'number',
        exportGroup: 'Nghỉ phép',
        example: '2'
    },
    {
        key: 'unpaidLeaveTaken',
        label: 'Nghỉ phép không lương',
        required: false,
        type: 'number',
        exportGroup: 'Nghỉ phép',
        example: '1'
    },
    {
        key: 'annualLeaveTaken',
        label: 'Nghỉ phép năm đã dùng',
        required: false,
        type: 'number',
        exportGroup: 'Nghỉ phép',
        example: '5'
    },
    // ===== ĐÁNH GIÁ =====
    {
        key: 'performanceRating',
        label: 'Đánh giá hiệu suất',
        required: false,
        type: 'number',
        exportGroup: 'Đánh giá',
        example: '4'
    },
    {
        key: 'lastReviewDate',
        label: 'Ngày đánh giá gần nhất',
        required: false,
        type: 'date',
        exportGroup: 'Đánh giá',
        example: '2023-12-15'
    },
    {
        key: 'nextReviewDate',
        label: 'Ngày đánh giá tiếp theo',
        required: false,
        type: 'date',
        exportGroup: 'Đánh giá',
        example: '2024-06-15'
    },
    // ===== KỸ NĂNG & CHỨNG CHỈ =====
    {
        key: 'skills',
        label: 'Kỹ năng',
        required: false,
        type: 'string',
        exportGroup: 'Kỹ năng & Chứng chỉ',
        example: 'Excel, PowerPoint, Quản lý dự án',
        transform: (value)=>{
            if (Array.isArray(value)) return value.join(', ');
            return value;
        },
        reverseTransform: (value)=>{
            if (typeof value === 'string') {
                return value.split(',').map((s)=>s.trim()).filter(Boolean);
            }
            return value;
        }
    },
    {
        key: 'certifications',
        label: 'Chứng chỉ',
        required: false,
        type: 'string',
        exportGroup: 'Kỹ năng & Chứng chỉ',
        example: 'PMP, IELTS 7.0',
        transform: (value)=>{
            if (Array.isArray(value)) return value.join(', ');
            return value;
        },
        reverseTransform: (value)=>{
            if (typeof value === 'string') {
                return value.split(',').map((s)=>s.trim()).filter(Boolean);
            }
            return value;
        }
    },
    // ===== SƠ ĐỒ TỔ CHỨC =====
    {
        key: 'managerId',
        label: 'Mã quản lý trực tiếp',
        required: false,
        type: 'string',
        exportGroup: 'Sơ đồ tổ chức',
        example: 'NV000'
    },
    // ===== HỌC VẤN =====
    {
        key: 'educationLevel',
        label: 'Trình độ học vấn',
        required: false,
        type: 'string',
        exportGroup: 'Học vấn',
        example: 'Đại học'
    },
    {
        key: 'major',
        label: 'Chuyên ngành',
        required: false,
        type: 'string',
        exportGroup: 'Học vấn',
        example: 'Quản trị kinh doanh'
    },
    {
        key: 'graduationYear',
        label: 'Năm tốt nghiệp',
        required: false,
        type: 'number',
        exportGroup: 'Học vấn',
        example: '2018'
    },
    {
        key: 'school',
        label: 'Trường',
        required: false,
        type: 'string',
        exportGroup: 'Học vấn',
        example: 'Đại học Kinh tế Quốc dân'
    },
    // ===== GHI CHÚ =====
    {
        key: 'notes',
        label: 'Ghi chú',
        required: false,
        type: 'string',
        exportGroup: 'Khác',
        example: ''
    },
    // ===== DỮ LIỆU HỆ THỐNG (hidden, không import) =====
    {
        key: 'systemId',
        label: 'System ID',
        required: false,
        type: 'string',
        exportGroup: 'Hệ thống',
        hidden: true
    },
    {
        key: 'avatarUrl',
        label: 'URL ảnh đại diện',
        required: false,
        type: 'string',
        exportGroup: 'Hệ thống',
        hidden: true
    },
    {
        key: 'createdAt',
        label: 'Ngày tạo',
        required: false,
        type: 'date',
        exportGroup: 'Hệ thống',
        hidden: true
    },
    {
        key: 'updatedAt',
        label: 'Ngày cập nhật',
        required: false,
        type: 'date',
        exportGroup: 'Hệ thống',
        hidden: true
    }
];
/**
 * Post-transform để xử lý địa chỉ thường trú và tạm trú
 * Được tạo bởi normalizeEmployeeRawRow từ các cột:
 * - __permanentAddress__: Địa chỉ thường trú
 * - __temporaryAddress__: Địa chỉ tạm trú
 */ function processEmployeeAddresses(row) {
    const result = {
        ...row
    };
    const rawData = row;
    // Xử lý địa chỉ thường trú
    const permanentRaw = rawData['__permanentAddress__'];
    if (permanentRaw && (permanentRaw.province || permanentRaw.ward || permanentRaw.street)) {
        // Enrich with IDs using address lookup
        const enriched = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$export$2f$address$2d$lookup$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["enrichEmployeeAddresses"])({
            permanentAddress: {
                province: permanentRaw.province || '',
                ward: permanentRaw.ward || '',
                street: permanentRaw.street || '',
                inputLevel: permanentRaw.inputLevel || '2-level'
            }
        });
        if (enriched.permanentAddress) {
            result.permanentAddress = enriched.permanentAddress;
        }
        // Remove temporary field
        delete result['__permanentAddress__'];
    }
    // Xử lý địa chỉ tạm trú
    const temporaryRaw = rawData['__temporaryAddress__'];
    if (temporaryRaw && (temporaryRaw.province || temporaryRaw.ward || temporaryRaw.street)) {
        // Enrich with IDs using address lookup
        const enriched = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$export$2f$address$2d$lookup$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["enrichEmployeeAddresses"])({
            temporaryAddress: {
                province: temporaryRaw.province || '',
                ward: temporaryRaw.ward || '',
                street: temporaryRaw.street || '',
                inputLevel: temporaryRaw.inputLevel || '2-level'
            }
        });
        if (enriched.temporaryAddress) {
            result.temporaryAddress = enriched.temporaryAddress;
        }
        // Remove temporary field
        delete result['__temporaryAddress__'];
    }
    return result;
}
const employeeConfig = {
    entityType: 'employees',
    entityDisplayName: 'Nhân viên',
    fields: employeeFields,
    upsertKey: 'id',
    templateFileName: 'mau-import-nhan-vien.xlsx',
    // Pre-transform: Normalize raw row từ template mới (merge 2-level/3-level columns)
    preTransformRawRow: normalizeEmployeeRawRow,
    // Post-transform: Process addresses and lookup IDs
    postTransformRow: processEmployeeAddresses
};
const employeeImportExportConfig = employeeConfig;
;
const __TURBOPACK__default__export__ = employeeConfig;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/import-export/configs/attendance.config.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Attendance Import/Export Config
 * 
 * Cấu hình import chấm công từ máy CC
 * 
 * ⚠️ LƯU Ý: File từ máy CC có format đặc biệt
 * - Sheet "Bảng tổng hợp chấm công"
 * - Header phức tạp (2 dòng, merged cells)
 * - Mã NV máy CC khác mã NV hệ thống → cần mapping
 */ __turbopack_context__.s([
    "attendanceFields",
    ()=>attendanceFields,
    "attendanceImportExportConfig",
    ()=>attendanceImportExportConfig
]);
// ============================================
// FIELD DEFINITIONS
// ============================================
const attendanceFields = [
    {
        key: 'machineEmployeeId',
        label: 'Mã NV (máy) (*)',
        required: true,
        type: 'number',
        example: '1',
        exportGroup: 'Thông tin NV',
        defaultSelected: true
    },
    {
        key: 'employeeName',
        label: 'Họ tên (*)',
        required: true,
        type: 'string',
        example: 'nguyen van a',
        exportGroup: 'Thông tin NV',
        defaultSelected: true
    },
    {
        key: 'department',
        label: 'Phòng ban',
        type: 'string',
        example: 'CÔNG TY',
        exportGroup: 'Thông tin NV'
    },
    {
        key: 'standardHours',
        label: 'Giờ chuẩn',
        type: 'number',
        example: '160',
        exportGroup: 'Thời gian',
        defaultSelected: true
    },
    {
        key: 'actualHours',
        label: 'Giờ thực tế',
        type: 'number',
        example: '145.28',
        exportGroup: 'Thời gian',
        defaultSelected: true
    },
    {
        key: 'lateCount',
        label: 'Đến muộn (lần)',
        type: 'number',
        example: '3',
        exportGroup: 'Đến muộn/Về sớm',
        defaultSelected: true
    },
    {
        key: 'lateMinutes',
        label: 'Đến muộn (phút)',
        type: 'number',
        example: '97',
        exportGroup: 'Đến muộn/Về sớm',
        defaultSelected: true
    },
    {
        key: 'earlyLeaveCount',
        label: 'Về sớm (lần)',
        type: 'number',
        example: '2',
        exportGroup: 'Đến muộn/Về sớm'
    },
    {
        key: 'earlyLeaveMinutes',
        label: 'Về sớm (phút)',
        type: 'number',
        example: '36',
        exportGroup: 'Đến muộn/Về sớm'
    },
    {
        key: 'overtimeNormal',
        label: 'Tăng ca thường (giờ)',
        type: 'number',
        example: '6.55',
        exportGroup: 'Tăng ca',
        defaultSelected: true
    },
    {
        key: 'overtimeSpecial',
        label: 'Tăng ca đặc biệt (giờ)',
        type: 'number',
        example: '43.5',
        exportGroup: 'Tăng ca'
    },
    {
        key: 'workDays',
        label: 'Ngày công (chuẩn/thực)',
        type: 'string',
        example: '20/19',
        exportGroup: 'Ngày công',
        defaultSelected: true
    },
    {
        key: 'businessTrip',
        label: 'Công tác (ngày)',
        type: 'number',
        example: '2',
        exportGroup: 'Nghỉ phép'
    },
    {
        key: 'absentWithoutLeave',
        label: 'Nghỉ không phép (ngày)',
        type: 'number',
        example: '1',
        exportGroup: 'Nghỉ phép',
        defaultSelected: true
    },
    {
        key: 'paidLeave',
        label: 'Nghỉ phép (ngày)',
        type: 'number',
        example: '0',
        exportGroup: 'Nghỉ phép'
    }
];
const attendanceImportExportConfig = {
    entityType: 'attendance',
    entityDisplayName: 'Chấm công (từ máy CC)',
    // Template - dùng file gốc từ máy CC
    templateFileName: 'Mau_ChamCong_MayCC.xls',
    templateDownloadUrl: '/templates/Mau_ChamCong_MayCC.xls',
    // ⚠️ SPECIAL: Custom parser
    customParser: true,
    sourceSheetName: 'Bảng tổng hợp chấm công',
    headerRowIndex: 2,
    dataStartRowIndex: 4,
    // Fields
    fields: attendanceFields,
    // ⚠️ KHÔNG dùng upsertKey thông thường
    // Vì máy CC dùng mã 1,2,3... không phải NV000001
    upsertKey: undefined,
    // Thay vào đó: Composite key cho upsert
    compositeKey: [
        'employeeSystemId',
        'month',
        'year'
    ],
    // Employee mapping
    requireEmployeeMapping: true,
    mappingField: 'employeeName',
    // Upsert config
    allowUpdate: true,
    allowInsert: true,
    // Preview config
    requirePreview: true,
    stopOnFirstError: false,
    maxErrorsAllowed: 0,
    maxRows: 100,
    // Validation
    validateRow: (row, _index, _existingData)=>{
        const errors = [];
        // Check tên không rỗng
        if (!row.employeeName || row.employeeName.trim() === '') {
            errors.push({
                field: 'employeeName',
                message: 'Họ tên không được trống'
            });
        }
        // Check giờ thực tế không âm
        if (row.actualHours < 0) {
            errors.push({
                field: 'actualHours',
                message: 'Giờ thực tế không được âm'
            });
        }
        // Check giờ thực tế không vượt quá chuẩn + tăng ca quá nhiều
        const maxHours = row.standardHours + 100; // Tối đa 100 giờ tăng ca/tháng
        if (row.actualHours > maxHours) {
            errors.push({
                field: 'actualHours',
                message: `Giờ thực tế (${row.actualHours}h) vượt quá giới hạn (${maxHours}h)`
            });
        }
        // Check số phút đến muộn hợp lý
        if (row.lateMinutes > 0 && row.lateCount === 0) {
            errors.push({
                field: 'lateCount',
                message: 'Có phút đến muộn nhưng số lần = 0'
            });
        }
        return errors;
    },
    // After import hook
    afterImport: (results)=>{
        console.log(`Import chấm công hoàn tất:
      - Thêm mới: ${results.inserted.length}
      - Cập nhật: ${results.updated.length}
      - Lỗi: ${results.failed.length}
      - Bỏ qua: ${results.skipped.length}`);
    }
};
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/import-export/configs/customer.config.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "customerFields",
    ()=>customerFields,
    "customerImportExportConfig",
    ()=>customerImportExportConfig,
    "default",
    ()=>__TURBOPACK__default__export__
]);
const customerFields = [
    // ===== THÔNG TIN CƠ BẢN =====
    {
        key: 'id',
        label: 'Mã khách hàng',
        required: false,
        type: 'string',
        exportGroup: 'Thông tin cơ bản',
        example: 'KH000001'
    },
    {
        key: 'name',
        label: 'Tên khách hàng (*)',
        required: true,
        type: 'string',
        exportGroup: 'Thông tin cơ bản',
        example: 'Công ty TNHH ABC'
    },
    {
        key: 'status',
        label: 'Trạng thái',
        required: false,
        type: 'enum',
        enumValues: [
            'Đang giao dịch',
            'Ngừng Giao Dịch'
        ],
        enumLabels: {
            'Đang giao dịch': 'Đang giao dịch',
            'Ngừng Giao Dịch': 'Ngừng giao dịch'
        },
        exportGroup: 'Thông tin cơ bản',
        example: 'Đang giao dịch',
        defaultValue: 'Đang giao dịch'
    },
    {
        key: 'phone',
        label: 'Số điện thoại',
        required: false,
        type: 'phone',
        exportGroup: 'Thông tin cơ bản',
        example: '0901234567',
        validator: (value)=>{
            if (!value) return null;
            const phone = String(value).replace(/\s/g, '');
            if (!/^0\d{9,10}$/.test(phone)) {
                return '[Warning] Số điện thoại không đúng định dạng';
            }
            return null;
        }
    },
    {
        key: 'email',
        label: 'Email',
        required: false,
        type: 'email',
        exportGroup: 'Thông tin cơ bản',
        example: 'contact@abc.com',
        validator: (value)=>{
            if (!value) return null;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(String(value))) {
                return 'Email không hợp lệ';
            }
            return null;
        }
    },
    {
        key: 'type',
        label: 'Loại khách hàng',
        required: false,
        type: 'string',
        exportGroup: 'Thông tin cơ bản',
        example: 'Doanh nghiệp'
    },
    {
        key: 'customerGroup',
        label: 'Nhóm khách hàng',
        required: false,
        type: 'string',
        exportGroup: 'Thông tin cơ bản',
        example: 'Khách sỉ'
    },
    {
        key: 'lifecycleStage',
        label: 'Giai đoạn vòng đời',
        required: false,
        type: 'string',
        exportGroup: 'Thông tin cơ bản',
        example: 'Khách mới'
    },
    {
        key: 'source',
        label: 'Nguồn khách hàng',
        required: false,
        type: 'string',
        exportGroup: 'Thông tin cơ bản',
        example: 'Facebook'
    },
    {
        key: 'notes',
        label: 'Ghi chú',
        required: false,
        type: 'string',
        exportGroup: 'Thông tin cơ bản',
        example: 'Khách hàng tiềm năng'
    },
    // ===== THÔNG TIN DOANH NGHIỆP =====
    {
        key: 'company',
        label: 'Tên công ty / HKD',
        required: false,
        type: 'string',
        exportGroup: 'Thông tin doanh nghiệp',
        example: 'Công ty TNHH ABC'
    },
    {
        key: 'taxCode',
        label: 'Mã số thuế',
        required: false,
        type: 'string',
        exportGroup: 'Thông tin doanh nghiệp',
        example: '0123456789',
        validator: (value)=>{
            if (!value) return null;
            const taxCode = String(value);
            if (!/^\d{10}(\d{3})?$/.test(taxCode)) {
                return '[Warning] Mã số thuế phải có 10 hoặc 13 số';
            }
            return null;
        }
    },
    {
        key: 'representative',
        label: 'Người đại diện',
        required: false,
        type: 'string',
        exportGroup: 'Thông tin doanh nghiệp',
        example: 'Nguyễn Văn A'
    },
    {
        key: 'position',
        label: 'Chức vụ',
        required: false,
        type: 'string',
        exportGroup: 'Thông tin doanh nghiệp',
        example: 'Giám đốc'
    },
    {
        key: 'bankName',
        label: 'Ngân hàng',
        required: false,
        type: 'string',
        exportGroup: 'Thông tin doanh nghiệp',
        example: 'Vietcombank'
    },
    {
        key: 'bankAccount',
        label: 'Số tài khoản',
        required: false,
        type: 'string',
        exportGroup: 'Thông tin doanh nghiệp',
        example: '0123456789'
    },
    // ===== THANH TOÁN & GIÁ =====
    {
        key: 'paymentTerms',
        label: 'Hạn thanh toán',
        required: false,
        type: 'string',
        exportGroup: 'Thanh toán & Giá',
        example: 'NET15'
    },
    {
        key: 'creditRating',
        label: 'Xếp hạng tín dụng',
        required: false,
        type: 'string',
        exportGroup: 'Thanh toán & Giá',
        example: 'AAA'
    },
    {
        key: 'currentDebt',
        label: 'Công nợ hiện tại',
        required: false,
        type: 'number',
        exportGroup: 'Thanh toán & Giá',
        example: '0',
        importTransform: (value)=>{
            if (!value) return 0;
            const num = Number(String(value).replace(/[,.\s]/g, ''));
            return isNaN(num) ? 0 : num;
        },
        exportTransform: (value)=>{
            if (!value) return '0';
            return Number(value).toLocaleString('vi-VN');
        }
    },
    {
        key: 'maxDebt',
        label: 'Hạn mức công nợ',
        required: false,
        type: 'number',
        exportGroup: 'Thanh toán & Giá',
        example: '50000000',
        importTransform: (value)=>{
            if (!value) return undefined;
            const num = Number(String(value).replace(/[,.\s]/g, ''));
            return isNaN(num) ? undefined : num;
        },
        exportTransform: (value)=>{
            if (!value) return '';
            return Number(value).toLocaleString('vi-VN');
        }
    },
    {
        key: 'allowCredit',
        label: 'Cho phép công nợ',
        required: false,
        type: 'boolean',
        exportGroup: 'Thanh toán & Giá',
        example: 'Có',
        importTransform: (value)=>{
            if (!value) return undefined;
            const str = String(value).toLowerCase();
            return str === 'có' || str === 'yes' || str === 'true' || str === '1';
        },
        exportTransform: (value)=>value ? 'Có' : 'Không'
    },
    {
        key: 'pricingLevel',
        label: 'Bảng giá áp dụng',
        required: false,
        type: 'enum',
        enumValues: [
            'Retail',
            'Wholesale',
            'VIP',
            'Partner'
        ],
        enumLabels: {
            'Retail': 'Bán lẻ',
            'Wholesale': 'Bán sỉ',
            'VIP': 'VIP',
            'Partner': 'Đối tác'
        },
        exportGroup: 'Thanh toán & Giá',
        example: 'Retail'
    },
    {
        key: 'defaultDiscount',
        label: 'Chiết khấu mặc định (%)',
        required: false,
        type: 'number',
        exportGroup: 'Thanh toán & Giá',
        example: '5',
        validator: (value)=>{
            if (!value) return null;
            const num = Number(value);
            if (num < 0 || num > 100) {
                return 'Chiết khấu phải từ 0 đến 100%';
            }
            return null;
        }
    },
    // ===== PHÂN LOẠI & QUẢN LÝ =====
    {
        key: 'accountManagerName',
        label: 'Nhân viên phụ trách',
        required: false,
        type: 'string',
        exportGroup: 'Phân loại & Quản lý',
        example: 'Nguyễn Văn B'
    },
    {
        key: 'campaign',
        label: 'Chiến dịch',
        required: false,
        type: 'string',
        exportGroup: 'Phân loại & Quản lý',
        example: 'Summer Sale 2024'
    },
    {
        key: 'tags',
        label: 'Thẻ (Tags)',
        required: false,
        type: 'string',
        exportGroup: 'Phân loại & Quản lý',
        example: 'VIP, Ưu tiên',
        importTransform: (value)=>{
            if (!value) return undefined;
            return String(value).split(',').map((s)=>s.trim()).filter(Boolean);
        },
        exportTransform: (value)=>{
            if (!value || !Array.isArray(value)) return '';
            return value.join(', ');
        }
    },
    // ===== SOCIAL MEDIA =====
    {
        key: 'zaloPhone',
        label: 'Zalo',
        required: false,
        type: 'phone',
        exportGroup: 'Social Media',
        example: '0901234567'
    },
    // ===== HỆ THỐNG (hidden) =====
    {
        key: 'systemId',
        label: 'System ID',
        required: false,
        type: 'string',
        exportGroup: 'Hệ thống',
        hidden: true
    },
    {
        key: 'createdAt',
        label: 'Ngày tạo',
        required: false,
        type: 'date',
        exportGroup: 'Hệ thống',
        hidden: true
    },
    {
        key: 'updatedAt',
        label: 'Ngày cập nhật',
        required: false,
        type: 'date',
        exportGroup: 'Hệ thống',
        hidden: true
    }
];
const customerImportExportConfig = {
    entityType: 'customers',
    entityDisplayName: 'Khách hàng',
    fields: customerFields,
    upsertKey: 'id',
    templateFileName: 'mau-import-khach-hang.xlsx',
    requireBranch: false,
    // Pre-transform raw row (normalize column names)
    preTransformRawRow: (rawRow)=>{
        const normalized = {};
        // Map từ label tiếng Việt sang key
        const labelToKey = {};
        customerFields.forEach((field)=>{
            labelToKey[field.label.toLowerCase()] = field.key;
            // Also map without (*) marker
            const labelWithoutStar = field.label.replace(/\s*\(\*\)\s*$/, '').toLowerCase();
            labelToKey[labelWithoutStar] = field.key;
        });
        Object.entries(rawRow).forEach(([key, value])=>{
            // Normalize Excel header: strip (*) marker and lowercase
            const normalizedExcelHeader = key.replace(/\s*\(\*\)\s*$/, '').toLowerCase();
            const normalizedKey = labelToKey[normalizedExcelHeader] || labelToKey[key.toLowerCase()] || key;
            normalized[normalizedKey] = value;
        });
        return normalized;
    },
    // Post-transform row (set defaults, enrich data)
    postTransformRow: (row)=>{
        return {
            ...row,
            status: row.status || 'Đang giao dịch',
            pricingLevel: row.pricingLevel || 'Retail',
            currentDebt: row.currentDebt ?? 0,
            defaultDiscount: row.defaultDiscount ?? 0,
            tags: row.tags || []
        };
    },
    // Validate row level (check duplicate taxCode)
    // Skip duplicate check in upsert/update mode since we're updating existing records
    validateRow: (row, _index, existingData, mode)=>{
        const errors = [];
        // Check unique taxCode - only in insert-only mode
        // In upsert/update mode, duplicate is expected and allowed
        if (row.taxCode && mode === 'insert-only') {
            const duplicate = existingData.find((c)=>c.taxCode === row.taxCode && c.id !== row.id);
            if (duplicate) {
                errors.push({
                    field: 'taxCode',
                    message: `Mã số thuế đã được sử dụng bởi ${duplicate.name} (${duplicate.id})`
                });
            }
        }
        return errors;
    }
};
const __TURBOPACK__default__export__ = customerImportExportConfig;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/pricing/data.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "data",
    ()=>data
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/seed-audit.ts [app-client] (ecmascript)");
;
;
const data = [
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PP000001'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('10'),
        name: '10',
        description: 'Giá mặc định',
        type: 'Bán hàng',
        isDefault: true,
        isActive: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-05T08:00:00Z'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PP000002'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('GIANHAP'),
        name: 'Giá nhập',
        description: 'Giá nhập hàng từ nhà cung cấp',
        type: 'Nhập hàng',
        isDefault: true,
        isActive: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-06T08:00:00Z'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PP000003'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('BANLE'),
        name: 'Giá bán lẻ',
        description: 'Giá bán cho khách lẻ',
        type: 'Bán hàng',
        isDefault: false,
        isActive: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-07T08:00:00Z'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PP000004'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('BANBUON'),
        name: 'Giá bán buôn',
        description: 'Giá bán sỉ cho đại lý',
        type: 'Bán hàng',
        isDefault: false,
        isActive: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-08T08:00:00Z'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PP000005'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('SHOPEE'),
        name: 'shopee',
        description: 'Giá bán trên Shopee',
        type: 'Bán hàng',
        isDefault: false,
        isActive: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-09T08:00:00Z'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PP000006'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('TIKTOK'),
        name: 'tiktok',
        description: 'Giá bán trên TikTok',
        type: 'Bán hàng',
        isDefault: false,
        isActive: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-10T08:00:00Z'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PP000007'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('ACE'),
        name: 'ace',
        description: 'Giá bán ACE',
        type: 'Bán hàng',
        isDefault: false,
        isActive: false,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-11T08:00:00Z'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PP000008'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('IDWEB'),
        name: 'idweb',
        description: 'Giá bán web',
        type: 'Bán hàng',
        isDefault: false,
        isActive: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-12T08:00:00Z'
        })
    }
];
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
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pricing$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pricing/data.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-client] (ecmascript)");
;
;
;
const baseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCrudStore"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pricing$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["data"], 'pricing-settings', {
    businessIdField: 'id',
    persistKey: 'hrm-pricing-policy-storage',
    getCurrentUser: __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentUserSystemId"]
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-client] (ecmascript)");
;
;
;
const generateId = ()=>crypto.randomUUID();
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
const useProductTypeStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        data: initialData,
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
        getActive: ()=>{
            return get().data.filter((item)=>!item.isDeleted && item.isActive !== false);
        }
    }), {
    name: 'product-type-storage'
}));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/import-export/configs/product.config.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "productFields",
    ()=>productFields,
    "productImportExportConfig",
    ()=>productImportExportConfig
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pricing$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pricing/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$inventory$2f$product$2d$type$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/inventory/product-type-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-client] (ecmascript)");
;
;
;
/**
 * Product Import/Export Configuration
 * Theo chuẩn ImportExportConfig để dùng với GenericImportDialogV2 và GenericExportDialogV2
 */ // Helper: Get all pricing policies
const getAllPricingPolicies = ()=>{
    return __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pricing$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePricingPolicyStore"].getState().data;
};
// ===== PRODUCT TYPE HELPERS =====
// Helper: Get all active product types from settings
const getAllProductTypes = ()=>{
    return __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$inventory$2f$product$2d$type$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductTypeStore"].getState().getActive();
};
// Helper: Get ProductType systemId from name (tên loại sản phẩm)
const getProductTypeSystemIdByName = (name)=>{
    if (!name) return null;
    const productTypes = getAllProductTypes();
    const normalizedName = name.toLowerCase().trim();
    // Tìm theo tên chính xác (case-insensitive)
    const productType = productTypes.find((pt)=>pt.name.toLowerCase() === normalizedName || pt.id.toLowerCase() === normalizedName);
    return productType?.systemId || null;
};
// Helper: Get ProductType name from systemId
const getProductTypeNameById = (systemId)=>{
    if (!systemId) return '';
    const productTypes = getAllProductTypes();
    const productType = productTypes.find((pt)=>pt.systemId === systemId);
    return productType?.name || '';
};
// Helper: Get default ProductType systemId
const getDefaultProductTypeSystemId = ()=>{
    const productTypes = getAllProductTypes();
    const defaultType = productTypes.find((pt)=>pt.isDefault);
    return defaultType?.systemId || productTypes[0]?.systemId || null;
};
// Helper: Map enum type ('physical', 'service', 'digital') to ProductType systemId
// Fallback khi user import bằng type cũ
const getProductTypeSystemIdByEnumType = (enumType)=>{
    if (!enumType) return getDefaultProductTypeSystemId();
    const productTypes = getAllProductTypes();
    const normalizedType = String(enumType).toLowerCase().trim();
    // Map từ enum type sang tên tiếng Việt để tìm ProductType
    const typeNameMapping = {
        'physical': [
            'hàng hóa',
            'hang hoa',
            'physical',
            'hàng hoá'
        ],
        'service': [
            'dịch vụ',
            'dich vu',
            'service'
        ],
        'digital': [
            'digital',
            'sản phẩm số',
            'san pham so',
            'kỹ thuật số',
            'ky thuat so'
        ],
        'combo': [
            'combo',
            'bộ sản phẩm',
            'bo san pham'
        ]
    };
    for (const [_enumKey, names] of Object.entries(typeNameMapping)){
        if (names.includes(normalizedType)) {
            // Tìm ProductType có tên match với một trong các aliases
            const productType = productTypes.find((pt)=>names.some((name)=>pt.name.toLowerCase().includes(name) || name.includes(pt.name.toLowerCase())));
            if (productType) return productType.systemId;
        }
    }
    // Fallback: tìm trực tiếp theo tên
    const productType = productTypes.find((pt)=>pt.name.toLowerCase().includes(normalizedType) || normalizedType.includes(pt.name.toLowerCase()));
    return productType?.systemId || getDefaultProductTypeSystemId();
};
// ===== PRICING POLICY HELPERS =====
// Helper: Get pricing policy systemId from code (id) OR name
// Hỗ trợ nhiều format cột giá trong Excel:
// - "Giá: Giá bán lẻ" hoặc "Giá: BANLE" (có prefix "Giá:")
// - "Giá bán lẻ" hoặc "BANLE" (không có prefix)
const getPricingPolicySystemId = (columnName)=>{
    const policies = getAllPricingPolicies();
    // Normalize: bỏ prefix "Giá:" hoặc "Gia:" nếu có
    let normalizedName = columnName.trim();
    const pricePrefix = /^(giá|gia)\s*:\s*/i;
    if (pricePrefix.test(normalizedName)) {
        normalizedName = normalizedName.replace(pricePrefix, '').trim();
    }
    const upperName = normalizedName.toUpperCase();
    // Tìm theo id (mã bảng giá) trước
    const policyById = policies.find((p)=>p.id.toUpperCase() === upperName);
    if (policyById) return policyById.systemId;
    // Tìm theo name (tên bảng giá)
    const policyByName = policies.find((p)=>p.name.toUpperCase() === upperName);
    if (policyByName) return policyByName.systemId;
    // Tìm theo name chứa (partial match)
    const policyByPartialName = policies.find((p)=>p.name.toUpperCase().includes(upperName) || upperName.includes(p.name.toUpperCase()));
    if (policyByPartialName) return policyByPartialName.systemId;
    return null;
};
// Helper: Get pricing policy code (id) from systemId  
const _getPricingPolicyCode = (systemId)=>{
    const policies = getAllPricingPolicies();
    const policy = policies.find((p)=>p.systemId === systemId);
    return policy?.id || systemId;
};
// Helper: Get pricing policy name from systemId  
const _getPricingPolicyName = (systemId)=>{
    const policies = getAllPricingPolicies();
    const policy = policies.find((p)=>p.systemId === systemId);
    return policy?.name || systemId;
};
// Helper: Check if a column name matches a pricing policy (by id or name)
const _isPricingPolicyColumn = (columnName)=>{
    return getPricingPolicySystemId(columnName) !== null;
};
const productFields = [
    // ===== THÔNG TIN CƠ BẢN =====
    {
        key: 'id',
        label: 'Mã sản phẩm',
        required: false,
        type: 'string',
        exportGroup: 'Thông tin cơ bản',
        example: 'SP000001'
    },
    {
        key: 'name',
        label: 'Tên sản phẩm (*)',
        required: true,
        type: 'string',
        exportGroup: 'Thông tin cơ bản',
        example: 'Áo sơ mi nam'
    },
    {
        key: 'sku',
        label: 'SKU',
        required: false,
        type: 'string',
        exportGroup: 'Thông tin cơ bản',
        example: 'ASM-001'
    },
    {
        key: 'barcode',
        label: 'Mã vạch',
        required: false,
        type: 'string',
        exportGroup: 'Thông tin cơ bản',
        example: '8934567890123'
    },
    {
        key: 'type',
        label: 'Loại SP (Hệ thống)',
        required: false,
        type: 'enum',
        enumValues: [
            'physical',
            'service',
            'digital'
        ],
        enumLabels: {
            'physical': 'Hàng hóa',
            'service': 'Dịch vụ',
            'digital': 'Sản phẩm số'
        },
        exportGroup: 'Thông tin cơ bản',
        example: 'Hàng hóa',
        defaultValue: 'physical',
        hidden: true,
        importTransform: (value)=>{
            if (!value) return 'physical';
            const str = String(value).toLowerCase().trim();
            // Map tiếng Việt sang English
            if (str === 'hàng hóa' || str === 'hang hoa' || str === 'physical' || str === 'hàng hoá') return 'physical';
            if (str === 'dịch vụ' || str === 'dich vu' || str === 'service') return 'service';
            if (str === 'sản phẩm số' || str === 'san pham so' || str === 'kỹ thuật số' || str === 'digital' || str === 'ky thuat so') return 'digital';
            if (str === 'combo' || str === 'bộ sản phẩm' || str === 'bo san pham') return 'combo';
            return 'physical';
        },
        validator: (value)=>{
            if (value === 'combo') {
                return 'Không hỗ trợ import sản phẩm Combo. Vui lòng tạo Combo trực tiếp trong hệ thống.';
            }
            return null;
        }
    },
    // NEW: Loại sản phẩm từ Settings (ProductType) - Khuyến khích dùng thay cho field "type" cũ
    {
        key: 'productTypeSystemId',
        label: 'Loại sản phẩm',
        required: false,
        type: 'string',
        exportGroup: 'Thông tin cơ bản',
        example: 'Hàng hóa',
        importTransform: (value)=>{
            if (!value) return undefined;
            const str = String(value).trim();
            if (!str) return undefined;
            // Trước tiên thử tìm theo tên/id trong ProductType settings
            const systemId = getProductTypeSystemIdByName(str);
            if (systemId) return systemId;
            // Fallback: map từ enum type cũ
            const enumSystemId = getProductTypeSystemIdByEnumType(str);
            return enumSystemId || undefined;
        },
        exportTransform: (value)=>{
            // Export ra tên loại SP thay vì systemId
            return getProductTypeNameById(value);
        },
        validator: (value)=>{
            if (!value) return null; // Optional field
            const str = String(value).trim();
            if (!str) return null;
            // Validate: tên loại SP phải tồn tại trong settings
            const systemId = getProductTypeSystemIdByName(str);
            if (!systemId) {
                // Fallback check enum type
                const enumSystemId = getProductTypeSystemIdByEnumType(str);
                if (!enumSystemId) {
                    return `Loại sản phẩm "${str}" không tồn tại trong hệ thống. Vui lòng kiểm tra danh sách loại SP trong Cài đặt > Kho hàng.`;
                }
            }
            return null;
        }
    },
    {
        key: 'status',
        label: 'Trạng thái',
        required: false,
        type: 'enum',
        enumValues: [
            'active',
            'inactive',
            'discontinued'
        ],
        enumLabels: {
            'active': 'Đang kinh doanh',
            'inactive': 'Ngừng kinh doanh',
            'discontinued': 'Ngừng nhập'
        },
        exportGroup: 'Thông tin cơ bản',
        example: 'Đang kinh doanh',
        defaultValue: 'active',
        importTransform: (value)=>{
            if (!value) return 'active';
            const str = String(value).toLowerCase().trim();
            // Map tiếng Việt sang English
            if (str === 'đang kinh doanh' || str === 'dang kinh doanh' || str === 'active') return 'active';
            if (str === 'ngừng kinh doanh' || str === 'ngung kinh doanh' || str === 'inactive') return 'inactive';
            if (str === 'ngừng nhập' || str === 'ngung nhap' || str === 'discontinued') return 'discontinued';
            return 'active';
        }
    },
    {
        key: 'unit',
        label: 'Đơn vị tính',
        required: false,
        type: 'string',
        exportGroup: 'Thông tin cơ bản',
        example: 'Cái',
        defaultValue: 'Cái'
    },
    {
        key: 'categories',
        label: 'Danh mục',
        required: false,
        type: 'string',
        exportGroup: 'Thông tin cơ bản',
        example: 'Thời trang > Áo nam; Sale > Hot deal',
        importTransform: (value)=>{
            if (!value) return undefined;
            const str = String(value).trim();
            if (!str) return undefined;
            // Split by semicolon to get multiple categories, each category can have multi-level with >
            return str.split(';').map((s)=>s.trim()).filter(Boolean);
        },
        exportTransform: (value)=>{
            const categories = value;
            return categories?.join('; ') || '';
        }
    },
    // Legacy single category field (backward compatibility)
    {
        key: 'category',
        label: 'Danh mục (cũ)',
        required: false,
        type: 'string',
        exportGroup: 'Thông tin cơ bản',
        hidden: true,
        example: 'Thời trang > Áo nam > Áo sơ mi'
    },
    {
        key: 'description',
        label: 'Mô tả',
        required: false,
        type: 'string',
        exportGroup: 'Thông tin cơ bản',
        example: 'Áo sơ mi nam cao cấp'
    },
    {
        key: 'shortDescription',
        label: 'Mô tả ngắn',
        required: false,
        type: 'string',
        exportGroup: 'Thông tin cơ bản',
        example: 'Áo sơ mi nam'
    },
    // ===== HÌNH ẢNH =====
    // NOTE: Hình ảnh được upload lên server trước, sau đó import đường dẫn
    // Format: /products/{ma_sp}/{ten_file}.jpg hoặc URL đầy đủ
    {
        key: 'thumbnailImage',
        label: 'Ảnh đại diện',
        required: false,
        type: 'string',
        exportGroup: 'Hình ảnh',
        example: '/products/SP001/main.jpg',
        validator: (value)=>{
            if (!value) return null; // Optional
            const str = String(value).trim();
            // Cho phép: /path/to/file.ext hoặc http(s)://...
            if (!str.startsWith('/') && !str.startsWith('http')) {
                return 'Đường dẫn ảnh phải bắt đầu bằng / hoặc http(s)://';
            }
            // Check extension
            const validExts = [
                '.jpg',
                '.jpeg',
                '.png',
                '.gif',
                '.webp',
                '.svg'
            ];
            const hasValidExt = validExts.some((ext)=>str.toLowerCase().endsWith(ext));
            if (!hasValidExt && !str.includes('?')) {
                return 'Định dạng ảnh không hợp lệ (jpg, png, gif, webp, svg)';
            }
            return null;
        }
    },
    {
        key: 'galleryImages',
        label: 'Ảnh bộ sưu tập',
        required: false,
        type: 'string',
        exportGroup: 'Hình ảnh',
        example: '/products/SP001/1.jpg, /products/SP001/2.jpg',
        importTransform: (value)=>{
            if (!value) return undefined;
            const str = String(value).trim();
            if (!str) return undefined;
            return str.split(/[,;|]/).map((s)=>s.trim()).filter(Boolean);
        },
        exportTransform: (value)=>{
            const images = value;
            return images?.join(', ') || '';
        },
        validator: (value)=>{
            if (!value) return null;
            const str = String(value).trim();
            if (!str) return null;
            const paths = str.split(/[,;|]/).map((s)=>s.trim()).filter(Boolean);
            const validExts = [
                '.jpg',
                '.jpeg',
                '.png',
                '.gif',
                '.webp',
                '.svg'
            ];
            for (const path of paths){
                if (!path.startsWith('/') && !path.startsWith('http')) {
                    return `Đường dẫn "${path}" phải bắt đầu bằng / hoặc http(s)://`;
                }
                const hasValidExt = validExts.some((ext)=>path.toLowerCase().endsWith(ext));
                if (!hasValidExt && !path.includes('?')) {
                    return `Đường dẫn "${path}" có định dạng ảnh không hợp lệ`;
                }
            }
            return null;
        }
    },
    // ===== VIDEO LINKS =====
    {
        key: 'videoLinks',
        label: 'Video link',
        required: false,
        type: 'string',
        exportGroup: 'Media',
        example: 'https://youtube.com/watch?v=xxx; https://drive.google.com/file/xxx',
        importTransform: (value)=>{
            if (!value) return undefined;
            const str = String(value).trim();
            if (!str) return undefined;
            return str.split(/[,;|]/).map((s)=>s.trim()).filter(Boolean);
        },
        exportTransform: (value)=>{
            const links = value;
            return links?.join('; ') || '';
        },
        validator: (value)=>{
            if (!value) return null;
            const str = String(value).trim();
            if (!str) return null;
            const links = str.split(/[,;|]/).map((s)=>s.trim()).filter(Boolean);
            for (const link of links){
                if (!link.startsWith('http')) {
                    return `Link "${link}" phải bắt đầu bằng http:// hoặc https://`;
                }
                // Kiểm tra domain hợp lệ (YouTube, TikTok, Drive, Vimeo, etc.)
                const validDomains = [
                    'youtube.com',
                    'youtu.be',
                    'tiktok.com',
                    'drive.google.com',
                    'vimeo.com',
                    'facebook.com',
                    'fb.watch'
                ];
                const isValidDomain = validDomains.some((domain)=>link.includes(domain));
                if (!isValidDomain) {
                    // Cho phép các domain khác nhưng cảnh báo
                    console.warn(`Link "${link}" không thuộc các nền tảng video phổ biến`);
                }
            }
            return null;
        }
    },
    // ===== GIÁ =====
    {
        key: 'costPrice',
        label: 'Giá vốn',
        required: false,
        type: 'number',
        exportGroup: 'Giá',
        example: '150000',
        importTransform: (value)=>{
            if (!value) return 0;
            const num = Number(String(value).replace(/[,.\s]/g, ''));
            return isNaN(num) ? 0 : num;
        }
    },
    {
        key: 'sellingPrice',
        label: 'Giá bán',
        required: false,
        type: 'number',
        exportGroup: 'Giá',
        example: '250000',
        importTransform: (value)=>{
            if (!value) return 0;
            const num = Number(String(value).replace(/[,.\s]/g, ''));
            return isNaN(num) ? 0 : num;
        }
    },
    {
        key: 'minPrice',
        label: 'Giá tối thiểu',
        required: false,
        type: 'number',
        exportGroup: 'Giá',
        example: '200000',
        importTransform: (value)=>{
            if (!value) return undefined;
            const num = Number(String(value).replace(/[,.\s]/g, ''));
            return isNaN(num) ? undefined : num;
        }
    },
    {
        key: 'taxRate',
        label: 'Thuế suất (%)',
        required: false,
        type: 'number',
        exportGroup: 'Giá',
        example: '10',
        importTransform: (value)=>{
            if (!value) return undefined;
            const num = Number(String(value).replace(/[%\s]/g, ''));
            return isNaN(num) ? undefined : num;
        }
    },
    // NOTE: Giá theo bảng giá (prices) được xử lý động trong preTransformRawRow
    // User tạo cột với tên = mã bảng giá (VD: PL_10, BANLE, VIP...)
    // Hệ thống tự detect và gom vào field prices
    // ===== TỒN KHO =====
    // NOTE: initialStock chỉ áp dụng khi TẠO MỚI sản phẩm (mode insert-only)
    // Tồn kho sau đó được quản lý qua phiếu nhập/xuất/kiểm kê
    {
        key: 'initialStock',
        label: 'Tồn kho ban đầu',
        required: false,
        type: 'number',
        exportGroup: 'Tồn kho',
        example: '100',
        importTransform: (value)=>{
            if (!value) return undefined;
            const num = Number(String(value).replace(/[,.\s]/g, ''));
            return isNaN(num) || num < 0 ? undefined : num;
        }
    },
    {
        key: 'isStockTracked',
        label: 'Theo dõi tồn kho',
        required: false,
        type: 'boolean',
        exportGroup: 'Tồn kho',
        example: 'Có',
        defaultValue: true,
        importTransform: (value)=>{
            if (!value) return true;
            const str = String(value).toLowerCase();
            return str === 'có' || str === 'yes' || str === 'true' || str === '1';
        }
    },
    {
        key: 'reorderLevel',
        label: 'Mức đặt hàng lại',
        required: false,
        type: 'number',
        exportGroup: 'Tồn kho',
        example: '10',
        importTransform: (value)=>{
            if (!value) return undefined;
            const num = Number(String(value).replace(/[,.\s]/g, ''));
            return isNaN(num) ? undefined : num;
        }
    },
    {
        key: 'safetyStock',
        label: 'Tồn kho an toàn',
        required: false,
        type: 'number',
        exportGroup: 'Tồn kho',
        example: '5',
        importTransform: (value)=>{
            if (!value) return undefined;
            const num = Number(String(value).replace(/[,.\s]/g, ''));
            return isNaN(num) ? undefined : num;
        }
    },
    {
        key: 'maxStock',
        label: 'Tồn kho tối đa',
        required: false,
        type: 'number',
        exportGroup: 'Tồn kho',
        example: '100',
        importTransform: (value)=>{
            if (!value) return undefined;
            const num = Number(String(value).replace(/[,.\s]/g, ''));
            return isNaN(num) ? undefined : num;
        }
    },
    // ===== VẬT LÝ =====
    {
        key: 'weight',
        label: 'Trọng lượng',
        required: false,
        type: 'number',
        exportGroup: 'Vật lý',
        example: '200',
        importTransform: (value)=>{
            if (!value) return undefined;
            const num = Number(String(value).replace(/[,.\s]/g, ''));
            return isNaN(num) ? undefined : num;
        }
    },
    {
        key: 'weightUnit',
        label: 'Đơn vị trọng lượng',
        required: false,
        type: 'enum',
        enumValues: [
            'g',
            'kg'
        ],
        exportGroup: 'Vật lý',
        example: 'g',
        defaultValue: 'g'
    },
    // ===== BẢO HÀNH =====
    {
        key: 'warrantyPeriodMonths',
        label: 'Bảo hành (tháng)',
        required: false,
        type: 'number',
        exportGroup: 'Bảo hành',
        example: '12',
        importTransform: (value)=>{
            if (!value) return undefined;
            const num = Number(String(value).replace(/[,.\s]/g, ''));
            return isNaN(num) ? undefined : num;
        }
    },
    // ===== KÍCH THƯỚC =====
    {
        key: 'dimensions',
        label: 'Kích thước (DxRxC cm)',
        required: false,
        type: 'string',
        exportGroup: 'Vật lý',
        example: '30x20x10',
        importTransform: (value)=>{
            if (!value) return undefined;
            const str = String(value).trim();
            const match = str.match(/^(\d+(?:\.\d+)?)\s*[xX×]\s*(\d+(?:\.\d+)?)\s*[xX×]\s*(\d+(?:\.\d+)?)$/);
            if (match) {
                return {
                    length: parseFloat(match[1]),
                    width: parseFloat(match[2]),
                    height: parseFloat(match[3])
                };
            }
            return undefined;
        },
        exportTransform: (value)=>{
            const dims = value;
            if (dims && typeof dims === 'object' && 'length' in dims) {
                return `${dims.length || 0}x${dims.width || 0}x${dims.height || 0}`;
            }
            return '';
        }
    },
    // ===== THÔNG TIN MỞ RỘNG =====
    {
        key: 'ktitle',
        label: 'Tiêu đề SEO',
        required: false,
        type: 'string',
        exportGroup: 'Mô tả',
        example: 'Áo sơ mi nam cao cấp | Thời trang ABC'
    },
    {
        key: 'seoDescription',
        label: 'Mô tả SEO',
        required: false,
        type: 'string',
        exportGroup: 'Mô tả',
        example: 'Áo sơ mi nam chất liệu cotton cao cấp...'
    },
    {
        key: 'subCategories',
        label: 'Danh mục phụ',
        required: false,
        type: 'string',
        exportGroup: 'Phân loại',
        example: 'Slim fit > Form ôm; Cotton > Cao cấp',
        importTransform: (value)=>{
            if (!value) return undefined;
            const str = String(value).trim();
            if (!str) return undefined;
            // Split by semicolon to get multiple sub-categories
            return str.split(';').map((s)=>s.trim()).filter(Boolean);
        },
        exportTransform: (value)=>{
            const subCategories = value;
            return subCategories?.join('; ') || '';
        }
    },
    // Legacy single subCategory field (backward compatibility)
    {
        key: 'subCategory',
        label: 'Danh mục phụ (cũ)',
        required: false,
        type: 'string',
        exportGroup: 'Phân loại',
        hidden: true,
        example: 'Áo sơ mi > Dài tay > Slim fit'
    },
    {
        key: 'tags',
        label: 'Tags',
        required: false,
        type: 'string',
        exportGroup: 'Phân loại',
        example: 'nam,công sở,cotton',
        importTransform: (value)=>{
            if (!value) return undefined;
            const str = String(value).trim();
            return str.split(/[,;]/).map((s)=>s.trim()).filter(Boolean);
        },
        exportTransform: (value)=>{
            const tags = value;
            return tags?.join(', ') || '';
        }
    },
    {
        key: 'pkgxId',
        label: 'ID PKGX',
        required: false,
        type: 'number',
        exportGroup: 'Thông tin cơ bản',
        example: '12345',
        importTransform: (value)=>{
            if (!value) return undefined;
            const num = Number(String(value).replace(/[,.\s]/g, ''));
            return isNaN(num) || num <= 0 ? undefined : num;
        }
    },
    {
        key: 'trendtechId',
        label: 'ID Trendtech',
        required: false,
        type: 'number',
        exportGroup: 'Thông tin cơ bản',
        example: '67890',
        importTransform: (value)=>{
            if (!value) return undefined;
            const num = Number(String(value).replace(/[,.\s]/g, ''));
            return isNaN(num) || num <= 0 ? undefined : num;
        }
    },
    {
        key: 'warehouseLocation',
        label: 'Vị trí kho',
        required: false,
        type: 'string',
        exportGroup: 'Tồn kho',
        example: 'A1-01'
    },
    // ===== GIÁ BỔ SUNG =====
    {
        key: 'lastPurchasePrice',
        label: 'Giá nhập gần nhất',
        required: false,
        type: 'number',
        exportGroup: 'Giá',
        example: '140000',
        importTransform: (value)=>{
            if (!value) return undefined;
            const num = Number(String(value).replace(/[,.\s]/g, ''));
            return isNaN(num) ? undefined : num;
        }
    },
    // ===== THÔNG TIN TEM =====
    {
        key: 'nameVat',
        label: 'Tên VAT',
        required: false,
        type: 'string',
        exportGroup: 'Tem phụ',
        example: 'Áo sơ mi nam cotton'
    },
    {
        key: 'origin',
        label: 'Xuất xứ',
        required: false,
        type: 'string',
        exportGroup: 'Tem phụ',
        example: 'Việt Nam'
    },
    {
        key: 'usageGuide',
        label: 'Hướng dẫn sử dụng',
        required: false,
        type: 'string',
        exportGroup: 'Tem phụ',
        example: 'Giặt máy ở nhiệt độ thấp'
    },
    {
        key: 'importerName',
        label: 'Đơn vị nhập khẩu',
        required: false,
        type: 'string',
        exportGroup: 'Tem phụ',
        example: 'Công ty TNHH ABC'
    },
    {
        key: 'importerAddress',
        label: 'Địa chỉ nhập khẩu',
        required: false,
        type: 'string',
        exportGroup: 'Tem phụ',
        example: '123 Nguyễn Văn A, Q.1, TP.HCM'
    },
    // ===== E-COMMERCE (bán hàng website) =====
    // Slug chung (legacy - không khuyến khích dùng nữa)
    {
        key: 'slug',
        label: 'Slug (URL)',
        required: false,
        type: 'string',
        exportGroup: 'E-commerce',
        hidden: true,
        example: 'ao-so-mi-nam-trang-oxford',
        importTransform: (value)=>{
            if (!value) return undefined;
            // Convert to URL-friendly slug
            return String(value).trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove diacritics
            .replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        }
    },
    // Slug riêng cho PKGX website
    {
        key: 'pkgxSlug',
        label: 'Slug PKGX',
        required: false,
        type: 'string',
        exportGroup: 'E-commerce PKGX',
        example: 'ao-so-mi-nam-trang-oxford',
        importTransform: (value)=>{
            if (!value) return undefined;
            // Convert to URL-friendly slug
            return String(value).trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove diacritics
            .replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        }
    },
    // Slug riêng cho Trendtech website
    {
        key: 'trendtechSlug',
        label: 'Slug Trendtech',
        required: false,
        type: 'string',
        exportGroup: 'E-commerce Trendtech',
        example: 'ao-so-mi-nam-trang-oxford',
        importTransform: (value)=>{
            if (!value) return undefined;
            // Convert to URL-friendly slug
            return String(value).trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove diacritics
            .replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        }
    },
    {
        key: 'isPublished',
        label: 'Đăng web',
        required: false,
        type: 'boolean',
        exportGroup: 'E-commerce',
        example: 'Có',
        defaultValue: false,
        importTransform: (value)=>{
            if (value === undefined || value === null || value === '') return false;
            const str = String(value).toLowerCase().trim();
            return str === 'có' || str === 'yes' || str === '1' || str === 'true' || str === 'x';
        },
        exportTransform: (value)=>value ? 'Có' : 'Không'
    },
    {
        key: 'isFeatured',
        label: 'Nổi bật',
        required: false,
        type: 'boolean',
        exportGroup: 'E-commerce',
        example: 'Có',
        defaultValue: false,
        importTransform: (value)=>{
            if (value === undefined || value === null || value === '') return false;
            const str = String(value).toLowerCase().trim();
            return str === 'có' || str === 'yes' || str === '1' || str === 'true' || str === 'x';
        },
        exportTransform: (value)=>value ? 'Có' : 'Không'
    },
    {
        key: 'isNewArrival',
        label: 'Mới về',
        required: false,
        type: 'boolean',
        exportGroup: 'E-commerce',
        example: 'Có',
        defaultValue: false,
        importTransform: (value)=>{
            if (value === undefined || value === null || value === '') return false;
            const str = String(value).toLowerCase().trim();
            return str === 'có' || str === 'yes' || str === '1' || str === 'true' || str === 'x';
        },
        exportTransform: (value)=>value ? 'Có' : 'Không'
    },
    {
        key: 'isBestSeller',
        label: 'Bán chạy',
        required: false,
        type: 'boolean',
        exportGroup: 'E-commerce',
        example: 'Có',
        defaultValue: false,
        importTransform: (value)=>{
            if (value === undefined || value === null || value === '') return false;
            const str = String(value).toLowerCase().trim();
            return str === 'có' || str === 'yes' || str === '1' || str === 'true' || str === 'x';
        },
        exportTransform: (value)=>value ? 'Có' : 'Không'
    },
    {
        key: 'isOnSale',
        label: 'Đang giảm giá',
        required: false,
        type: 'boolean',
        exportGroup: 'E-commerce',
        example: 'Có',
        defaultValue: false,
        importTransform: (value)=>{
            if (value === undefined || value === null || value === '') return false;
            const str = String(value).toLowerCase().trim();
            return str === 'có' || str === 'yes' || str === '1' || str === 'true' || str === 'x';
        },
        exportTransform: (value)=>value ? 'Có' : 'Không'
    },
    {
        key: 'sortOrder',
        label: 'Thứ tự hiển thị',
        required: false,
        type: 'number',
        exportGroup: 'E-commerce',
        example: '1',
        importTransform: (value)=>{
            if (!value) return undefined;
            const num = Number(String(value).replace(/[,.\s]/g, ''));
            return isNaN(num) ? undefined : num;
        }
    },
    {
        key: 'publishedAt',
        label: 'Ngày đăng web',
        required: false,
        type: 'date',
        exportGroup: 'E-commerce',
        example: '2024-01-15'
    },
    // ===== PHÂN TÍCH BÁN HÀNG =====
    {
        key: 'totalSold',
        label: 'Tổng đã bán',
        required: false,
        type: 'number',
        exportGroup: 'Phân tích',
        hidden: true,
        importTransform: (value)=>{
            if (!value) return undefined;
            const num = Number(String(value).replace(/[,.\s]/g, ''));
            return isNaN(num) ? undefined : num;
        }
    },
    {
        key: 'totalRevenue',
        label: 'Tổng doanh thu',
        required: false,
        type: 'number',
        exportGroup: 'Phân tích',
        hidden: true,
        importTransform: (value)=>{
            if (!value) return undefined;
            const num = Number(String(value).replace(/[,.\s]/g, ''));
            return isNaN(num) ? undefined : num;
        }
    },
    {
        key: 'lastSoldDate',
        label: 'Ngày bán gần nhất',
        required: false,
        type: 'date',
        exportGroup: 'Phân tích',
        hidden: true
    },
    {
        key: 'viewCount',
        label: 'Lượt xem',
        required: false,
        type: 'number',
        exportGroup: 'Phân tích',
        hidden: true,
        importTransform: (value)=>{
            if (!value) return undefined;
            const num = Number(String(value).replace(/[,.\s]/g, ''));
            return isNaN(num) ? undefined : num;
        }
    },
    // ===== VÒNG ĐỜI SẢN PHẨM =====
    {
        key: 'launchedDate',
        label: 'Ngày ra mắt',
        required: false,
        type: 'date',
        exportGroup: 'Vòng đời',
        example: '2024-01-15'
    },
    {
        key: 'lastPurchaseDate',
        label: 'Ngày nhập gần nhất',
        required: false,
        type: 'date',
        exportGroup: 'Vòng đời',
        hidden: true
    },
    {
        key: 'discontinuedDate',
        label: 'Ngày ngừng kinh doanh',
        required: false,
        type: 'date',
        exportGroup: 'Vòng đời',
        example: '2025-12-31'
    },
    // ===== HỆ THỐNG (hidden) =====
    {
        key: 'systemId',
        label: 'System ID',
        required: false,
        type: 'string',
        exportGroup: 'Hệ thống',
        hidden: true
    },
    {
        key: 'createdAt',
        label: 'Ngày tạo',
        required: false,
        type: 'date',
        exportGroup: 'Hệ thống',
        hidden: true
    },
    {
        key: 'updatedAt',
        label: 'Ngày cập nhật',
        required: false,
        type: 'date',
        exportGroup: 'Hệ thống',
        hidden: true
    }
];
const productImportExportConfig = {
    entityType: 'products',
    entityDisplayName: 'Sản phẩm',
    fields: productFields,
    upsertKey: 'id',
    templateFileName: 'mau-import-san-pham.xlsx',
    requireBranch: true,
    // Pre-transform raw row (normalize column names + detect pricing columns)
    preTransformRawRow: (rawRow)=>{
        const normalized = {};
        const prices = {};
        // Map từ label tiếng Việt sang key
        const labelToKey = {};
        productFields.forEach((field)=>{
            labelToKey[field.label.toLowerCase()] = field.key;
            // Also map without (*) marker
            const labelWithoutStar = field.label.replace(/\s*\(\*\)\s*$/, '').toLowerCase();
            labelToKey[labelWithoutStar] = field.key;
        });
        Object.entries(rawRow).forEach(([key, value])=>{
            // Normalize Excel header: strip (*) marker and lowercase
            const normalizedExcelHeader = key.replace(/\s*\(\*\)\s*$/, '').toLowerCase();
            // Check if this column is a pricing policy code (e.g., PL_10, BANLE, VIP)
            const policySystemId = getPricingPolicySystemId(key);
            if (policySystemId && value !== undefined && value !== null && value !== '') {
                // This is a pricing column - parse price value
                const priceValue = Number(String(value).replace(/[,.\s]/g, ''));
                if (!isNaN(priceValue) && priceValue > 0) {
                    prices[policySystemId] = priceValue;
                }
            } else {
                // Normal field - map to key
                const normalizedKey = labelToKey[normalizedExcelHeader] || labelToKey[key.toLowerCase()] || key;
                normalized[normalizedKey] = value;
            }
        });
        // Add prices if any pricing columns were found
        if (Object.keys(prices).length > 0) {
            normalized.prices = prices;
        }
        return normalized;
    },
    // Post-transform row (set defaults, enrich data)
    // NOTE: branchSystemId được truyền từ import dialog để xử lý tồn kho ban đầu
    postTransformRow: (row, _index, branchSystemId)=>{
        // Xử lý tồn kho ban đầu - chỉ áp dụng khi có initialStock và branchSystemId
        let inventoryByBranch = row.inventoryByBranch || {};
        const initialStock = row.initialStock;
        if (initialStock !== undefined && initialStock > 0 && branchSystemId) {
            inventoryByBranch = {
                ...inventoryByBranch,
                [branchSystemId]: initialStock
            };
        }
        // Remove initialStock from final data (không lưu vào Product)
        const { initialStock: _removed, ...cleanRow } = row;
        // Auto-set productTypeSystemId nếu chưa có
        // Ưu tiên: productTypeSystemId > type enum mapping > default
        let productTypeSystemIdStr = cleanRow.productTypeSystemId;
        if (!productTypeSystemIdStr && cleanRow.type) {
            // Map từ type enum sang productTypeSystemId
            productTypeSystemIdStr = getProductTypeSystemIdByEnumType(cleanRow.type) || undefined;
        }
        if (!productTypeSystemIdStr) {
            // Fallback: lấy default ProductType
            productTypeSystemIdStr = getDefaultProductTypeSystemId() || undefined;
        }
        // Cast to SystemId if we have a value
        const productTypeSystemId = productTypeSystemIdStr ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(productTypeSystemIdStr) : undefined;
        return {
            ...cleanRow,
            type: cleanRow.type || 'physical',
            productTypeSystemId,
            status: cleanRow.status || 'active',
            unit: cleanRow.unit || 'Cái',
            costPrice: cleanRow.costPrice ?? 0,
            sellingPrice: cleanRow.sellingPrice ?? 0,
            isStockTracked: cleanRow.isStockTracked ?? true,
            prices: cleanRow.prices || {},
            inventoryByBranch,
            committedByBranch: cleanRow.committedByBranch || {},
            inTransitByBranch: cleanRow.inTransitByBranch || {}
        };
    },
    // Validate row level (check duplicate SKU/barcode + warnings)
    validateRow: (row, _index, existingData, mode)=>{
        const errors = [];
        const rowWithInitialStock = row;
        // Check unique SKU - only in insert-only mode
        if (row.sku && mode === 'insert-only') {
            const duplicate = existingData.find((p)=>p.sku === row.sku && p.id !== row.id);
            if (duplicate) {
                errors.push({
                    field: 'sku',
                    message: `SKU đã được sử dụng bởi ${duplicate.name} (${duplicate.id})`
                });
            }
        }
        // Check unique barcode - only in insert-only mode
        if (row.barcode && mode === 'insert-only') {
            const duplicate = existingData.find((p)=>p.barcode === row.barcode && p.id !== row.id);
            if (duplicate) {
                errors.push({
                    field: 'barcode',
                    message: `Mã vạch đã được sử dụng bởi ${duplicate.name} (${duplicate.id})`
                });
            }
        }
        // Cảnh báo: initialStock chỉ có tác dụng khi tạo mới
        if (rowWithInitialStock.initialStock !== undefined && rowWithInitialStock.initialStock > 0) {
            if (mode === 'update-only') {
                errors.push({
                    field: 'initialStock',
                    message: 'Tồn kho ban đầu sẽ bị BỎ QUA vì đang ở chế độ Cập nhật',
                    type: 'warning'
                });
            } else if (mode === 'upsert') {
                // Check if product exists
                const exists = existingData.find((p)=>p.id === row.id);
                if (exists) {
                    errors.push({
                        field: 'initialStock',
                        message: `SP đã tồn tại - tồn kho ban đầu sẽ BỎ QUA (giữ nguyên tồn kho hiện tại)`,
                        type: 'warning'
                    });
                }
            }
        }
        // Cảnh báo giá bán < giá vốn
        if (row.costPrice && row.sellingPrice && row.costPrice > row.sellingPrice) {
            errors.push({
                field: 'sellingPrice',
                message: `Giá bán (${row.sellingPrice?.toLocaleString()}) thấp hơn giá vốn (${row.costPrice?.toLocaleString()})`,
                type: 'warning'
            });
        }
        return errors;
    }
};
const __TURBOPACK__default__export__ = productImportExportConfig;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/import-export/configs/brand.config.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "brandFieldGroups",
    ()=>brandFieldGroups,
    "brandFields",
    ()=>brandFields,
    "brandImportExportConfig",
    ()=>brandImportExportConfig
]);
const brandFields = [
    // === Basic Info ===
    {
        key: 'id',
        label: 'Mã thương hiệu (*)',
        type: 'string',
        required: true,
        exportGroup: 'Thông tin cơ bản',
        exportable: true,
        example: 'BRAND001',
        validator: (value)=>{
            if (!value || String(value).trim() === '') {
                return 'Mã thương hiệu là bắt buộc';
            }
            return null;
        }
    },
    {
        key: 'name',
        label: 'Tên thương hiệu (*)',
        type: 'string',
        required: true,
        exportGroup: 'Thông tin cơ bản',
        exportable: true,
        example: 'Apple',
        validator: (value)=>{
            if (!value || String(value).trim() === '') {
                return 'Tên thương hiệu là bắt buộc';
            }
            return null;
        }
    },
    {
        key: 'description',
        label: 'Mô tả',
        type: 'string',
        required: false,
        exportGroup: 'Thông tin cơ bản',
        exportable: true,
        example: 'Thương hiệu công nghệ hàng đầu thế giới'
    },
    {
        key: 'website',
        label: 'Website',
        type: 'string',
        required: false,
        exportGroup: 'Thông tin cơ bản',
        exportable: true,
        example: 'https://www.apple.com',
        validator: (value)=>{
            if (value && typeof value === 'string') {
                const trimmed = value.trim();
                if (trimmed && !trimmed.match(/^https?:\/\/.+/i)) {
                    return 'Website phải bắt đầu bằng http:// hoặc https://';
                }
            }
            return null;
        }
    },
    {
        key: 'logo',
        label: 'Logo URL',
        type: 'string',
        required: false,
        exportGroup: 'Thông tin cơ bản',
        exportable: true,
        example: 'https://example.com/logo.png'
    },
    // === SEO Fields ===
    {
        key: 'seoTitle',
        label: 'SEO Title',
        type: 'string',
        required: false,
        exportGroup: 'SEO & Mô tả',
        exportable: true,
        example: 'Apple - Thương hiệu công nghệ cao cấp'
    },
    {
        key: 'metaDescription',
        label: 'Meta Description',
        type: 'string',
        required: false,
        exportGroup: 'SEO & Mô tả',
        exportable: true,
        example: 'Apple Inc. là tập đoàn công nghệ đa quốc gia...'
    },
    {
        key: 'seoKeywords',
        label: 'SEO Keywords',
        type: 'string',
        required: false,
        exportGroup: 'SEO & Mô tả',
        exportable: true,
        example: 'apple, iphone, macbook, công nghệ'
    },
    {
        key: 'shortDescription',
        label: 'Mô tả ngắn',
        type: 'string',
        required: false,
        exportGroup: 'SEO & Mô tả',
        exportable: true,
        example: 'Thương hiệu công nghệ hàng đầu từ Mỹ'
    },
    {
        key: 'longDescription',
        label: 'Mô tả chi tiết',
        type: 'string',
        required: false,
        exportGroup: 'SEO & Mô tả',
        exportable: true,
        example: '<p>Apple Inc. được thành lập năm 1976...</p>'
    },
    // === Settings ===
    {
        key: 'isActive',
        label: 'Trạng thái',
        type: 'boolean',
        required: false,
        exportGroup: 'Cài đặt',
        exportable: true,
        example: 'Hoạt động',
        importTransform: (value)=>{
            if (typeof value === 'boolean') return value;
            if (typeof value === 'number') return value === 1;
            const strValue = String(value).toLowerCase().trim();
            return strValue === 'true' || strValue === '1' || strValue === 'hoạt động' || strValue === 'hoat dong' || strValue === 'có' || strValue === 'co' || strValue === 'yes' || strValue === 'active';
        },
        exportTransform: (value)=>value ? 'Hoạt động' : 'Ngừng'
    }
];
const brandFieldGroups = {
    'Thông tin cơ bản': 'Thông tin cơ bản',
    'SEO & Mô tả': 'SEO & Mô tả',
    'Cài đặt': 'Cài đặt'
};
const brandImportExportConfig = {
    entityType: 'brands',
    entityDisplayName: 'Thương hiệu',
    fields: brandFields,
    // Template file
    templateFileName: 'Mau_Nhap_Thuong_Hieu.xlsx',
    sheetName: 'Thương hiệu',
    // Upsert config - dùng id làm key
    upsertKey: 'id',
    allowUpdate: true,
    allowInsert: true,
    // Max rows
    maxRows: 500,
    // Row-level transform after all field transforms
    postTransformRow: (row)=>{
        // Ensure isActive defaults to true for new brands
        if (row.isActive === undefined) {
            row.isActive = true;
        }
        return row;
    },
    // Validate entire row
    validateRow: (row, _index, _existingData, _mode)=>{
        const errors = [];
        if (!row.id || String(row.id).trim() === '') {
            errors.push({
                field: 'id',
                message: 'Mã thương hiệu là bắt buộc'
            });
        }
        if (!row.name || String(row.name).trim() === '') {
            errors.push({
                field: 'name',
                message: 'Tên thương hiệu là bắt buộc'
            });
        }
        return errors;
    }
};
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-client] (ecmascript)");
;
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
const rawData = [
    // Level 0 - Root categories
    {
        systemId: 'CATEGORY000001',
        id: 'DM000001',
        name: 'Điện tử',
        description: 'Thiết bị điện tử, phụ kiện điện thoại',
        color: '#3b82f6',
        sortOrder: 1,
        path: 'Điện tử',
        level: 0,
        isActive: true,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        systemId: 'CATEGORY000002',
        id: 'DM000002',
        name: 'Phụ kiện điện thoại',
        description: 'Ốp lưng, cường lực, sạc cáp',
        color: '#6366f1',
        sortOrder: 1,
        parentId: 'CATEGORY000001',
        path: 'Điện tử > Phụ kiện điện thoại',
        level: 1,
        isActive: true,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        systemId: 'CATEGORY000003',
        id: 'DM000003',
        name: 'Ốp lưng',
        description: 'Ốp lưng các loại',
        color: '#8b5cf6',
        sortOrder: 1,
        parentId: 'CATEGORY000002',
        path: 'Điện tử > Phụ kiện điện thoại > Ốp lưng',
        level: 2,
        isActive: true,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        systemId: 'CATEGORY000004',
        id: 'DM000004',
        name: 'Cường lực',
        description: 'Kính cường lực, dán màn hình',
        color: '#a855f7',
        sortOrder: 2,
        parentId: 'CATEGORY000002',
        path: 'Điện tử > Phụ kiện điện thoại > Cường lực',
        level: 2,
        isActive: true,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        systemId: 'CATEGORY000005',
        id: 'DM000005',
        name: 'Sạc & Cáp',
        description: 'Củ sạc, dây cáp các loại',
        color: '#c084fc',
        sortOrder: 3,
        parentId: 'CATEGORY000002',
        path: 'Điện tử > Phụ kiện điện thoại > Sạc & Cáp',
        level: 2,
        isActive: true,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        systemId: 'CATEGORY000006',
        id: 'DM000006',
        name: 'Tai nghe',
        description: 'Tai nghe có dây, bluetooth',
        color: '#22d3ee',
        sortOrder: 2,
        parentId: 'CATEGORY000001',
        path: 'Điện tử > Tai nghe',
        level: 1,
        isActive: true,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        systemId: 'CATEGORY000007',
        id: 'DM000007',
        name: 'Tai nghe Bluetooth',
        description: 'Airpods, TWS các loại',
        color: '#06b6d4',
        sortOrder: 1,
        parentId: 'CATEGORY000006',
        path: 'Điện tử > Tai nghe > Tai nghe Bluetooth',
        level: 2,
        isActive: true,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        systemId: 'CATEGORY000008',
        id: 'DM000008',
        name: 'Tai nghe có dây',
        description: 'Tai nghe jack 3.5mm, Type-C',
        color: '#14b8a6',
        sortOrder: 2,
        parentId: 'CATEGORY000006',
        path: 'Điện tử > Tai nghe > Tai nghe có dây',
        level: 2,
        isActive: true,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        systemId: 'CATEGORY000009',
        id: 'DM000009',
        name: 'Loa & Âm thanh',
        description: 'Loa bluetooth, soundbar',
        color: '#10b981',
        sortOrder: 3,
        parentId: 'CATEGORY000001',
        path: 'Điện tử > Loa & Âm thanh',
        level: 1,
        isActive: true,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    // Level 0 - Thời trang
    {
        systemId: 'CATEGORY000010',
        id: 'DM000010',
        name: 'Thời trang',
        description: 'Quần áo, giày dép, phụ kiện',
        color: '#ec4899',
        sortOrder: 2,
        path: 'Thời trang',
        level: 0,
        isActive: true,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        systemId: 'CATEGORY000011',
        id: 'DM000011',
        name: 'Đồng hồ',
        description: 'Đồng hồ nam, nữ, smartwatch',
        color: '#f472b6',
        sortOrder: 1,
        parentId: 'CATEGORY000010',
        path: 'Thời trang > Đồng hồ',
        level: 1,
        isActive: true,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        systemId: 'CATEGORY000012',
        id: 'DM000012',
        name: 'Túi xách',
        description: 'Túi xách, balo',
        color: '#f9a8d4',
        sortOrder: 2,
        parentId: 'CATEGORY000010',
        path: 'Thời trang > Túi xách',
        level: 1,
        isActive: true,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    // Level 0 - Gia dụng
    {
        systemId: 'CATEGORY000013',
        id: 'DM000013',
        name: 'Gia dụng',
        description: 'Đồ gia dụng, nội thất',
        color: '#f97316',
        sortOrder: 3,
        path: 'Gia dụng',
        level: 0,
        isActive: true,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        systemId: 'CATEGORY000014',
        id: 'DM000014',
        name: 'Đèn chiếu sáng',
        description: 'Đèn bàn, đèn LED',
        color: '#fb923c',
        sortOrder: 1,
        parentId: 'CATEGORY000013',
        path: 'Gia dụng > Đèn chiếu sáng',
        level: 1,
        isActive: true,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        systemId: 'CATEGORY000015',
        id: 'DM000015',
        name: 'Quạt',
        description: 'Quạt mini, quạt bàn',
        color: '#fdba74',
        sortOrder: 2,
        parentId: 'CATEGORY000013',
        path: 'Gia dụng > Quạt',
        level: 1,
        isActive: true,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];
const initialData = rawData.map((item)=>({
        ...item,
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(item.systemId),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])(item.id),
        parentId: 'parentId' in item && item.parentId ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(item.parentId) : undefined
    }));
const INITIAL_COUNTER = rawData.length;
const useProductCategoryStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        data: initialData,
        counter: INITIAL_COUNTER,
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
        isBusinessIdExists: (id)=>get().data.some((item)=>String(item.id) === id)
    }), {
    name: 'product-category-storage'
}));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/import-export/configs/category.config.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "categoryFieldGroups",
    ()=>categoryFieldGroups,
    "categoryFields",
    ()=>categoryFields,
    "categoryImportExportConfig",
    ()=>categoryImportExportConfig
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$inventory$2f$product$2d$category$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/inventory/product-category-store.ts [app-client] (ecmascript)");
;
/**
 * Product Category Import/Export Configuration
 * Theo chuẩn ImportExportConfig để dùng với GenericImportDialogV2 và GenericExportDialogV2
 */ // ===== CATEGORY HELPERS =====
// Helper: Get all categories for parent lookup
const getAllCategories = ()=>{
    return __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$inventory$2f$product$2d$category$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductCategoryStore"].getState().data.filter((c)=>!c.isDeleted);
};
// Helper: Get parent category systemId from name or path
const getParentCategorySystemId = (value)=>{
    if (!value || String(value).trim() === '') return null;
    const categories = getAllCategories();
    const normalizedValue = String(value).trim().toLowerCase();
    // Try exact match by name first
    const byName = categories.find((c)=>c.name.toLowerCase() === normalizedValue || c.id.toLowerCase() === normalizedValue);
    if (byName) return byName.systemId;
    // Try match by path (e.g., "Điện tử > Máy tính")
    const byPath = categories.find((c)=>c.path?.toLowerCase() === normalizedValue);
    if (byPath) return byPath.systemId;
    return null;
};
// Helper: Get parent category display name from systemId
const getParentCategoryName = (systemId)=>{
    if (!systemId) return '';
    const categories = getAllCategories();
    const parent = categories.find((c)=>c.systemId === systemId);
    return parent?.name || '';
};
const categoryFields = [
    // === Basic Info ===
    {
        key: 'id',
        label: 'Mã danh mục (*)',
        type: 'string',
        required: true,
        exportGroup: 'Thông tin cơ bản',
        exportable: true,
        example: 'CAT001',
        validator: (value)=>{
            if (!value || String(value).trim() === '') {
                return 'Mã danh mục là bắt buộc';
            }
            return null;
        }
    },
    {
        key: 'name',
        label: 'Tên danh mục (*)',
        type: 'string',
        required: true,
        exportGroup: 'Thông tin cơ bản',
        exportable: true,
        example: 'Điện thoại',
        validator: (value)=>{
            if (!value || String(value).trim() === '') {
                return 'Tên danh mục là bắt buộc';
            }
            return null;
        }
    },
    {
        key: 'slug',
        label: 'Slug',
        type: 'string',
        required: false,
        exportGroup: 'Thông tin cơ bản',
        exportable: true,
        example: 'dien-thoai'
    },
    // === Hierarchy ===
    {
        key: 'parentId',
        label: 'Danh mục cha',
        type: 'string',
        required: false,
        exportGroup: 'Phân cấp',
        exportable: true,
        example: 'Điện tử',
        importTransform: (value)=>{
            if (!value) return undefined;
            const systemId = getParentCategorySystemId(String(value));
            return systemId || undefined;
        },
        exportTransform: (value)=>{
            // Value is the parentId systemId
            return getParentCategoryName(value);
        }
    },
    {
        key: 'path',
        label: 'Đường dẫn',
        type: 'string',
        required: false,
        exportGroup: 'Phân cấp',
        exportable: true,
        hidden: true,
        example: 'Điện tử > Điện thoại'
    },
    {
        key: 'level',
        label: 'Cấp độ',
        type: 'number',
        required: false,
        exportGroup: 'Phân cấp',
        exportable: true,
        hidden: true,
        example: '1'
    },
    // === Display ===
    {
        key: 'color',
        label: 'Màu sắc',
        type: 'string',
        required: false,
        exportGroup: 'Hiển thị',
        exportable: true,
        example: '#3b82f6'
    },
    {
        key: 'icon',
        label: 'Icon',
        type: 'string',
        required: false,
        exportGroup: 'Hiển thị',
        exportable: true,
        example: '📱'
    },
    {
        key: 'thumbnailImage',
        label: 'Ảnh đại diện',
        type: 'string',
        required: false,
        exportGroup: 'Hiển thị',
        exportable: true,
        example: 'https://example.com/category.jpg'
    },
    {
        key: 'sortOrder',
        label: 'Thứ tự',
        type: 'number',
        required: false,
        exportGroup: 'Hiển thị',
        exportable: true,
        example: '1',
        importTransform: (value)=>{
            if (value === undefined || value === null || value === '') return 0;
            const num = Number(value);
            return isNaN(num) ? 0 : num;
        }
    },
    // === SEO Fields ===
    {
        key: 'seoTitle',
        label: 'SEO Title',
        type: 'string',
        required: false,
        exportGroup: 'SEO & Mô tả',
        exportable: true,
        example: 'Điện thoại chính hãng - Giá tốt nhất'
    },
    {
        key: 'metaDescription',
        label: 'Meta Description',
        type: 'string',
        required: false,
        exportGroup: 'SEO & Mô tả',
        exportable: true,
        example: 'Mua điện thoại chính hãng giá tốt nhất...'
    },
    {
        key: 'seoKeywords',
        label: 'SEO Keywords',
        type: 'string',
        required: false,
        exportGroup: 'SEO & Mô tả',
        exportable: true,
        example: 'điện thoại, smartphone, iphone, samsung'
    },
    {
        key: 'shortDescription',
        label: 'Mô tả ngắn',
        type: 'string',
        required: false,
        exportGroup: 'SEO & Mô tả',
        exportable: true,
        example: 'Danh mục điện thoại di động các hãng'
    },
    {
        key: 'longDescription',
        label: 'Mô tả chi tiết',
        type: 'string',
        required: false,
        exportGroup: 'SEO & Mô tả',
        exportable: true,
        example: '<p>Điện thoại di động từ các thương hiệu...</p>'
    },
    // === Settings ===
    {
        key: 'isActive',
        label: 'Trạng thái',
        type: 'boolean',
        required: false,
        exportGroup: 'Cài đặt',
        exportable: true,
        example: 'Hoạt động',
        importTransform: (value)=>{
            if (typeof value === 'boolean') return value;
            if (typeof value === 'number') return value === 1;
            const strValue = String(value).toLowerCase().trim();
            return strValue === 'true' || strValue === '1' || strValue === 'hoạt động' || strValue === 'hoat dong' || strValue === 'có' || strValue === 'co' || strValue === 'yes' || strValue === 'active';
        },
        exportTransform: (value)=>value ? 'Hoạt động' : 'Ngừng'
    }
];
const categoryFieldGroups = {
    'Thông tin cơ bản': 'Thông tin cơ bản',
    'Phân cấp': 'Phân cấp',
    'Hiển thị': 'Hiển thị',
    'SEO & Mô tả': 'SEO & Mô tả',
    'Cài đặt': 'Cài đặt'
};
const categoryImportExportConfig = {
    entityType: 'categories',
    entityDisplayName: 'Danh mục sản phẩm',
    fields: categoryFields,
    // Template file
    templateFileName: 'Mau_Nhap_Danh_Muc.xlsx',
    sheetName: 'Danh mục',
    // Upsert config - dùng id làm key
    upsertKey: 'id',
    allowUpdate: true,
    allowInsert: true,
    // Max rows
    maxRows: 500,
    // Row-level transform after all field transforms
    postTransformRow: (row)=>{
        // Ensure isActive defaults to true for new categories
        if (row.isActive === undefined) {
            row.isActive = true;
        }
        // Default sortOrder to 0
        if (row.sortOrder === undefined) {
            row.sortOrder = 0;
        }
        // Generate slug from name if not provided
        if (!row.slug && row.name) {
            row.slug = String(row.name).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove diacritics
            .replace(/đ/g, 'd').replace(/Đ/g, 'D').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
        }
        return row;
    },
    // Validate entire row
    validateRow: (row, _index, _existingData, _mode)=>{
        const errors = [];
        if (!row.id || String(row.id).trim() === '') {
            errors.push({
                field: 'id',
                message: 'Mã danh mục là bắt buộc'
            });
        }
        if (!row.name || String(row.name).trim() === '') {
            errors.push({
                field: 'name',
                message: 'Tên danh mục là bắt buộc'
            });
        }
        return errors;
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/customers/data.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "data",
    ()=>data
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-client] (ecmascript)");
;
const data = [
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])("CUST000001"),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])("KH000001"),
        name: "Công ty Cổ phần Bất động sản Hưng Thịnh",
        email: "info@hungthinhcorp.vn",
        phone: "0901112233",
        company: "Hưng Thịnh Corp",
        status: "Đang giao dịch",
        taxCode: "0301234567",
        zaloPhone: "0901112233",
        currentDebt: 30000000,
        maxDebt: 50000000,
        accountManagerId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000002"),
        accountManagerName: "Trần Thị Bình",
        createdAt: "2024-03-10",
        updatedAt: "2025-10-21T09:30:00Z",
        createdBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000002"),
        updatedBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000002"),
        totalOrders: 2,
        totalSpent: 42000000,
        totalQuantityPurchased: 5,
        totalQuantityReturned: 0,
        lastPurchaseDate: "2025-09-20",
        failedDeliveries: 3,
        lastContactDate: "2025-10-18",
        nextFollowUpDate: "2025-11-05",
        followUpReason: "Đôn đốc ký phụ lục hợp đồng",
        followUpAssigneeId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000002"),
        followUpAssigneeName: "Trần Thị Bình",
        // New fields
        source: "Referral",
        campaign: "Q3-2024-Real-Estate",
        paymentTerms: "NET30",
        creditRating: "AA",
        allowCredit: true,
        defaultDiscount: 5,
        pricingLevel: "Wholesale",
        tags: [
            "VIP",
            "Bất động sản",
            "Khách hàng lớn"
        ],
        contacts: [
            {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])("KHCT000001"),
                name: "Nguyễn Văn A",
                role: "Giám đốc",
                phone: "0901112233",
                email: "a.nguyen@hungthinhcorp.vn",
                isPrimary: true
            },
            {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])("KHCT000002"),
                name: "Trần Thị B",
                role: "Kế toán",
                phone: "0901112244",
                email: "b.tran@hungthinhcorp.vn",
                isPrimary: false
            }
        ],
        social: {
            website: "https://hungthinhcorp.vn",
            facebook: "HungThinhCorp"
        },
        contract: {
            number: "HĐ-2024-001",
            startDate: "2024-01-01",
            endDate: "2025-12-31",
            value: 500000000,
            status: "Active"
        },
        // Debt Tracking
        debtTransactions: [
            {
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])("DT000001"),
                orderId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])("ORD000123"),
                orderDate: "2025-09-20",
                amount: 30000000,
                dueDate: "2025-10-20",
                isPaid: false,
                remainingAmount: 30000000,
                notes: "Đơn hàng thiết bị văn phòng"
            }
        ],
        debtReminders: [
            {
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])("REM000001"),
                reminderDate: "2025-10-21",
                reminderType: "Gọi điện",
                reminderBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000002"),
                reminderByName: "Trần Thị Bình",
                customerResponse: "Hứa trả",
                promisePaymentDate: "2025-10-27",
                notes: "KH đang chờ thanh toán từ khách của họ, hứa trả trong tuần này",
                createdAt: "2025-10-21T09:30:00Z"
            }
        ]
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])("CUST000002"),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])("KH000002"),
        name: "Chuỗi cà phê The Coffee House",
        email: "contact@thecoffeehouse.vn",
        phone: "02871087088",
        company: "The Coffee House",
        status: "Đang giao dịch",
        taxCode: "0313222173",
        zaloPhone: "0902888999",
        currentDebt: 0,
        maxDebt: 100000000,
        accountManagerId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000007"),
        accountManagerName: "Đỗ Hùng",
        createdAt: "2024-01-25",
        updatedAt: "2025-10-10T08:15:00Z",
        createdBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000007"),
        updatedBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000007"),
        totalOrders: 5,
        totalSpent: 156000000,
        totalQuantityPurchased: 15,
        totalQuantityReturned: 0,
        lastPurchaseDate: "2025-10-10",
        failedDeliveries: 0,
        lastContactDate: "2025-10-15",
        nextFollowUpDate: "2025-12-01",
        followUpAssigneeId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000007"),
        followUpAssigneeName: "Đỗ Hùng",
        // New fields
        source: "Website",
        campaign: "Online-Marketing-2024",
        paymentTerms: "NET15",
        creditRating: "AAA",
        allowCredit: true,
        defaultDiscount: 10,
        pricingLevel: "VIP",
        tags: [
            "F&B",
            "Chuỗi",
            "Khách hàng thân thiết"
        ],
        contacts: [
            {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])("KHCT000003"),
                name: "Nguyễn Thị Thu",
                role: "Purchasing Manager",
                phone: "0902888999",
                email: "thu.nguyen@thecoffeehouse.vn",
                isPrimary: true
            }
        ],
        social: {
            website: "https://thecoffeehouse.vn",
            facebook: "TheCoffeeHouseVN",
            linkedin: "the-coffee-house"
        },
        // Debt Tracking - Không có nợ
        debtTransactions: [],
        debtReminders: []
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])("CUST000003"),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])("KH000003"),
        name: "Anh Trần Minh Hoàng",
        email: "tmhoang.dev@gmail.com",
        phone: "0987123456",
        company: "Khách lẻ",
        status: "Đang giao dịch",
        zaloPhone: "0987123456",
        currentDebt: 0,
        maxDebt: 10000000,
        accountManagerId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000006"),
        accountManagerName: "Vũ Thị Giang",
        createdAt: "2025-08-01",
        updatedAt: "2025-08-01T10:00:00Z",
        createdBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000006"),
        updatedBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000006"),
        totalOrders: 1,
        totalSpent: 8000000,
        totalQuantityPurchased: 1,
        totalQuantityReturned: 0,
        lastPurchaseDate: "2025-08-01",
        failedDeliveries: 0,
        // New fields
        source: "Social",
        paymentTerms: "COD",
        allowCredit: false,
        pricingLevel: "Retail",
        tags: [
            "Khách lẻ"
        ],
        // Debt Tracking - Không có nợ
        debtTransactions: [],
        debtReminders: []
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])("CUST000004"),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])("KH000004"),
        name: "Shop thời trang GenZ Style",
        email: "genzstyle@fashion.com",
        phone: "0918765432",
        company: "GenZ Style",
        status: "Ngừng Giao Dịch",
        taxCode: "0398765432",
        zaloPhone: "0918765432",
        currentDebt: 500000,
        maxDebt: 20000000,
        accountManagerId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000009"),
        accountManagerName: "Trịnh Văn Khoa",
        createdAt: "2023-11-15",
        updatedAt: "2024-09-20T16:30:00Z",
        createdBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000009"),
        updatedBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000009"),
        totalOrders: 3,
        totalSpent: 12500000,
        totalQuantityPurchased: 8,
        totalQuantityReturned: 2,
        lastPurchaseDate: "2024-06-30",
        failedDeliveries: 1,
        // New fields
        source: "Partner",
        campaign: "Fashion-Partner-2023",
        paymentTerms: "NET7",
        creditRating: "C",
        allowCredit: false,
        pricingLevel: "Retail",
        tags: [
            "Thời trang",
            "Nợ xấu",
            "Tạm ngưng"
        ],
        // Debt Tracking - Nợ xấu 490 ngày!
        debtTransactions: [
            {
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])("DT000002"),
                orderId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])("ORD000045"),
                orderDate: "2024-06-15",
                amount: 500000,
                dueDate: "2024-06-22",
                isPaid: false,
                remainingAmount: 500000,
                notes: "Đơn hàng phụ kiện thời trang"
            }
        ],
        debtReminders: [
            {
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])("REM000002"),
                reminderDate: "2024-07-01",
                reminderType: "Gọi điện",
                reminderBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000009"),
                reminderByName: "Trịnh Văn Khoa",
                customerResponse: "Không liên lạc được",
                notes: "Gọi nhiều lần không nghe máy",
                createdAt: "2024-07-01T14:00:00Z"
            },
            {
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])("REM000003"),
                reminderDate: "2024-08-15",
                reminderType: "Email",
                reminderBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000009"),
                reminderByName: "Trịnh Văn Khoa",
                customerResponse: "Không liên lạc được",
                notes: "Email gửi nhưng không phản hồi",
                createdAt: "2024-08-15T10:00:00Z"
            },
            {
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])("REM000004"),
                reminderDate: "2024-09-20",
                reminderType: "Gặp trực tiếp",
                reminderBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000009"),
                reminderByName: "Trịnh Văn Khoa",
                customerResponse: "Từ chối",
                notes: "KH gặp khó khăn tài chính, từ chối thanh toán. Đề xuất xử lý pháp lý",
                createdAt: "2024-09-20T16:30:00Z"
            }
        ]
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/customers/lifecycle-utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "calculateLifecycleStage",
    ()=>calculateLifecycleStage,
    "getLifecycleStageVariant",
    ()=>getLifecycleStageVariant,
    "updateAllCustomerLifecycleStages",
    ()=>updateAllCustomerLifecycleStages
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-client] (ecmascript)");
;
const calculateLifecycleStage = (customer)=>{
    const totalOrders = customer.totalOrders || 0;
    const totalSpent = customer.totalSpent || 0;
    const lastPurchaseDate = customer.lastPurchaseDate;
    // Nếu chưa mua lần nào
    if (totalOrders === 0) {
        return "Khách tiềm năng";
    }
    // Tính số ngày từ lần mua cuối
    const daysSinceLastPurchase = lastPurchaseDate ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDaysDiff"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentDate"])(), new Date(lastPurchaseDate)) : Infinity;
    // Khách đã mất (không mua > 365 ngày)
    if (daysSinceLastPurchase > 365) {
        return "Mất khách";
    }
    // Không hoạt động (không mua > 180 ngày)
    if (daysSinceLastPurchase > 180) {
        return "Không hoạt động";
    }
    // Khách VIP: Top 10% spending (>= 50 triệu) và mua >= 5 lần
    if (totalSpent >= 50_000_000 && totalOrders >= 5) {
        return "Khách VIP";
    }
    // Khách thân thiết: Mua >= 5 lần
    if (totalOrders >= 5) {
        return "Khách thân thiết";
    }
    // Khách quay lại: Mua 2-4 lần
    if (totalOrders >= 2) {
        return "Khách quay lại";
    }
    // Khách mới: Mua lần đầu
    return "Khách mới";
};
const getLifecycleStageVariant = (stage)=>{
    switch(stage){
        case "Khách VIP":
            return "success";
        case "Khách thân thiết":
            return "success";
        case "Khách quay lại":
            return "default";
        case "Khách mới":
            return "secondary";
        case "Khách tiềm năng":
            return "secondary";
        case "Không hoạt động":
            return "warning";
        case "Mất khách":
            return "destructive";
        default:
            return "secondary";
    }
};
const updateAllCustomerLifecycleStages = (customers)=>{
    return customers.map((customer)=>({
            ...customer,
            lifecycleStage: calculateLifecycleStage(customer)
        }));
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/customers/credit-utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "canCreateOrder",
    ()=>canCreateOrder,
    "getCreditAlertBadgeVariant",
    ()=>getCreditAlertBadgeVariant,
    "getCreditAlertLevel",
    ()=>getCreditAlertLevel,
    "getCreditAlertText",
    ()=>getCreditAlertText,
    "getHighRiskDebtCustomers",
    ()=>getHighRiskDebtCustomers
]);
const getCreditAlertLevel = (customer)=>{
    const currentDebt = customer.currentDebt || 0;
    const maxDebt = customer.maxDebt || 0;
    // Nếu không có hạn mức hoặc hạn mức = 0, không cảnh báo
    if (maxDebt === 0) return 'safe';
    const debtRatio = currentDebt / maxDebt * 100;
    if (debtRatio >= 100) return 'exceeded'; // Vượt hạn mức
    if (debtRatio >= 90) return 'danger'; // >= 90%
    if (debtRatio >= 70) return 'warning'; // >= 70%
    return 'safe'; // < 70%
};
const getCreditAlertBadgeVariant = (level)=>{
    switch(level){
        case 'exceeded':
        case 'danger':
            return 'destructive';
        case 'warning':
            return 'warning';
        case 'safe':
            return 'success';
        default:
            return 'secondary';
    }
};
const getCreditAlertText = (level)=>{
    switch(level){
        case 'exceeded':
            return 'Vượt hạn mức';
        case 'danger':
            return 'Sắp vượt hạn';
        case 'warning':
            return 'Cần theo dõi';
        case 'safe':
            return 'An toàn';
        default:
            return '';
    }
};
const canCreateOrder = (customer, orderAmount)=>{
    const currentDebt = customer.currentDebt || 0;
    const maxDebt = customer.maxDebt || 0;
    // Nếu không cho phép công nợ và có công nợ hiện tại
    if (!customer.allowCredit && currentDebt > 0) {
        return {
            allowed: false,
            reason: 'Khách hàng không được phép công nợ và còn nợ cũ'
        };
    }
    // Nếu có hạn mức công nợ
    if (maxDebt > 0) {
        const newDebt = currentDebt + orderAmount;
        if (newDebt > maxDebt) {
            return {
                allowed: false,
                reason: `Đơn hàng này sẽ vượt hạn mức công nợ (${formatCurrency(newDebt)} / ${formatCurrency(maxDebt)})`
            };
        }
    }
    return {
        allowed: true
    };
};
const getHighRiskDebtCustomers = (customers)=>{
    return customers.filter((customer)=>{
        const level = getCreditAlertLevel(customer);
        return level === 'danger' || level === 'exceeded';
    }).sort((a, b)=>{
        const ratioA = (a.currentDebt || 0) / (a.maxDebt || 1) * 100;
        const ratioB = (b.currentDebt || 0) / (b.maxDebt || 1) * 100;
        return ratioB - ratioA; // Sort by ratio descending
    });
};
/**
 * Helper format currency
 */ const formatCurrency = (value)=>{
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(value);
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/customers/intelligence-utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "calculateChurnRisk",
    ()=>calculateChurnRisk,
    "calculateHealthScore",
    ()=>calculateHealthScore,
    "calculateRFMScores",
    ()=>calculateRFMScores,
    "getCustomerSegment",
    ()=>getCustomerSegment,
    "getHealthScoreLevel",
    ()=>getHealthScoreLevel,
    "getSegmentBadgeVariant",
    ()=>getSegmentBadgeVariant,
    "getSegmentLabel",
    ()=>getSegmentLabel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-client] (ecmascript)");
;
const calculateRFMScores = (customer, allCustomers)=>{
    // Recency: Số ngày từ lần mua cuối
    const daysSinceLastPurchase = customer.lastPurchaseDate ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDaysDiff"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentDate"])(), new Date(customer.lastPurchaseDate)) : 999999;
    // Frequency: Tổng số đơn hàng
    const frequency = customer.totalOrders || 0;
    // Monetary: Tổng chi tiêu
    const monetary = customer.totalSpent || 0;
    // Calculate percentiles for scoring
    const allRecencies = allCustomers.map((c)=>c.lastPurchaseDate ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDaysDiff"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentDate"])(), new Date(c.lastPurchaseDate)) : 999999).sort((a, b)=>a - b);
    const allFrequencies = allCustomers.map((c)=>c.totalOrders || 0).sort((a, b)=>b - a);
    const allMonetary = allCustomers.map((c)=>c.totalSpent || 0).sort((a, b)=>b - a);
    // Score Recency (lower is better, so invert)
    const recencyScore = getScore(daysSinceLastPurchase, allRecencies, true);
    // Score Frequency (higher is better)
    const frequencyScore = getScore(frequency, allFrequencies, false);
    // Score Monetary (higher is better)
    const monetaryScore = getScore(monetary, allMonetary, false);
    return {
        recency: recencyScore,
        frequency: frequencyScore,
        monetary: monetaryScore
    };
};
/**
 * Helper: Tính score 1-5 dựa trên percentile
 */ const getScore = (value, sortedValues, invert)=>{
    const index = sortedValues.indexOf(value);
    if (index === -1) return 1;
    const percentile = index / sortedValues.length * 100;
    let score;
    if (percentile >= 80) score = 5;
    else if (percentile >= 60) score = 4;
    else if (percentile >= 40) score = 3;
    else if (percentile >= 20) score = 2;
    else score = 1;
    // Invert for recency (lower days = better)
    if (invert) {
        score = 6 - score;
    }
    return score;
};
const getCustomerSegment = (rfm)=>{
    const { recency: R, frequency: F, monetary: M } = rfm;
    // Champions: RFM 5-5-5, 5-4-5, 4-5-5, 5-5-4
    if (R >= 4 && F >= 4 && M >= 4 && (R === 5 || F === 5)) {
        return 'Champions';
    }
    // Loyal Customers: RFM 4-4-4, 4-5-4, 5-4-4, 4-4-5
    if (R >= 4 && F >= 4 && M >= 4) {
        return 'Loyal Customers';
    }
    // Potential Loyalist: High frequency, good recency
    if (R >= 3 && F >= 3 && M >= 3) {
        return 'Potential Loyalist';
    }
    // New Customers: High recency, low frequency
    if (R >= 4 && F <= 2) {
        return 'New Customers';
    }
    // Promising: Good recency, moderate frequency
    if (R >= 3 && F >= 2 && F <= 3) {
        return 'Promising';
    }
    // Need Attention: Moderate scores
    if (R === 3 && F === 2) {
        return 'Need Attention';
    }
    // About To Sleep: Low frequency, moderate recency
    if ((R === 3 || R === 2) && F <= 2) {
        return 'About To Sleep';
    }
    // Cannot Lose Them: Low recency but high value
    if (R === 1 && F >= 4 && M >= 4) {
        return 'Cannot Lose Them';
    }
    // At Risk: Low recency, good history
    if (R <= 2 && F >= 3) {
        return 'At Risk';
    }
    // Hibernating: Low recency and frequency
    if (R <= 2 && F <= 2 && M >= 2) {
        return 'Hibernating';
    }
    // Lost: Lowest scores
    return 'Lost';
};
const getSegmentBadgeVariant = (segment)=>{
    switch(segment){
        case 'Champions':
        case 'Loyal Customers':
            return 'success';
        case 'Potential Loyalist':
        case 'Promising':
            return 'default';
        case 'New Customers':
            return 'secondary';
        case 'Need Attention':
        case 'About To Sleep':
            return 'warning';
        case 'At Risk':
        case 'Cannot Lose Them':
        case 'Hibernating':
        case 'Lost':
            return 'destructive';
        default:
            return 'secondary';
    }
};
const getSegmentLabel = (segment)=>{
    const labels = {
        'Champions': 'Xuất sắc',
        'Loyal Customers': 'Trung thành',
        'Potential Loyalist': 'Tiềm năng cao',
        'New Customers': 'Khách mới',
        'Promising': 'Hứa hẹn',
        'Need Attention': 'Cần quan tâm',
        'About To Sleep': 'Sắp ngủ đông',
        'At Risk': 'Có nguy cơ',
        'Cannot Lose Them': 'Không thể mất',
        'Hibernating': 'Ngủ đông',
        'Lost': 'Đã mất'
    };
    return labels[segment];
};
const calculateHealthScore = (customer)=>{
    let score = 0;
    // 1. Recency - Thời gian mua gần nhất (30 points)
    const daysSinceLastPurchase = customer.lastPurchaseDate ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDaysDiff"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentDate"])(), new Date(customer.lastPurchaseDate)) : Infinity;
    if (daysSinceLastPurchase <= 7) score += 30;
    else if (daysSinceLastPurchase <= 30) score += 25;
    else if (daysSinceLastPurchase <= 60) score += 20;
    else if (daysSinceLastPurchase <= 90) score += 15;
    else if (daysSinceLastPurchase <= 180) score += 10;
    else if (daysSinceLastPurchase <= 365) score += 5;
    // 2. Frequency - Tần suất mua (25 points)
    const totalOrders = customer.totalOrders || 0;
    if (totalOrders >= 20) score += 25;
    else if (totalOrders >= 10) score += 20;
    else if (totalOrders >= 5) score += 15;
    else if (totalOrders >= 3) score += 10;
    else if (totalOrders >= 1) score += 5;
    // 3. Monetary - Tổng chi tiêu (30 points)
    const totalSpent = customer.totalSpent || 0;
    if (totalSpent >= 500_000_000) score += 30;
    else if (totalSpent >= 200_000_000) score += 25;
    else if (totalSpent >= 100_000_000) score += 20;
    else if (totalSpent >= 50_000_000) score += 15;
    else if (totalSpent >= 20_000_000) score += 10;
    else if (totalSpent >= 5_000_000) score += 5;
    // 4. Payment Behavior - Hành vi thanh toán (15 points)
    // Dựa trên tỷ lệ nợ hiện tại so với hạn mức
    if (customer.maxDebt && customer.maxDebt > 0) {
        const debtRatio = (customer.currentDebt || 0) / customer.maxDebt;
        if (debtRatio <= 0.2) score += 15;
        else if (debtRatio <= 0.4) score += 12;
        else if (debtRatio <= 0.6) score += 8;
        else if (debtRatio <= 0.8) score += 4;
    // > 80% = 0 điểm
    } else {
        // Không có hạn mức công nợ → xem như thanh toán tốt
        score += 15;
    }
    return Math.min(100, score);
};
const getHealthScoreLevel = (score)=>{
    if (score >= 80) return {
        level: 'excellent',
        label: 'Xuất sắc',
        variant: 'success'
    };
    if (score >= 60) return {
        level: 'good',
        label: 'Tốt',
        variant: 'default'
    };
    if (score >= 40) return {
        level: 'fair',
        label: 'Trung bình',
        variant: 'warning'
    };
    if (score >= 20) return {
        level: 'poor',
        label: 'Yếu',
        variant: 'destructive'
    };
    return {
        level: 'critical',
        label: 'Nguy hiểm',
        variant: 'destructive'
    };
};
const calculateChurnRisk = (customer)=>{
    const daysSinceLastPurchase = customer.lastPurchaseDate ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDaysDiff"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentDate"])(), new Date(customer.lastPurchaseDate)) : Infinity;
    const totalOrders = customer.totalOrders || 0;
    // Nếu khách mới (chưa có đơn hoặc chỉ 1 đơn), dùng default 30 ngày
    // Nếu khách cũ, tính dựa trên thời gian từ createdAt đến lastPurchaseDate / số đơn
    let avgDaysBetweenOrders = 30; // Default
    if (totalOrders > 1 && customer.createdAt && customer.lastPurchaseDate) {
        const customerAge = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDaysDiff"])(new Date(customer.lastPurchaseDate), new Date(customer.createdAt));
        avgDaysBetweenOrders = Math.max(7, customerAge / (totalOrders - 1)); // Tối thiểu 7 ngày
    }
    // Khách vừa mua hàng gần đây (< 7 ngày) = low risk
    if (daysSinceLastPurchase <= 7) {
        return {
            risk: 'low',
            label: 'Nguy cơ thấp',
            variant: 'success',
            reason: 'Khách hàng đang hoạt động tốt'
        };
    }
    // High risk: Không mua > 2x thời gian trung bình hoặc > 365 ngày
    if (daysSinceLastPurchase > avgDaysBetweenOrders * 2 || daysSinceLastPurchase > 365) {
        return {
            risk: 'high',
            label: 'Nguy cơ cao',
            variant: 'destructive',
            reason: `Không mua hàng ${Math.floor(daysSinceLastPurchase)} ngày, vượt quá 2x chu kỳ trung bình`
        };
    }
    // Medium risk: Không mua > 1.5x thời gian trung bình hoặc > 180 ngày
    if (daysSinceLastPurchase > avgDaysBetweenOrders * 1.5 || daysSinceLastPurchase > 180) {
        return {
            risk: 'medium',
            label: 'Nguy cơ trung bình',
            variant: 'warning',
            reason: `Không mua hàng ${Math.floor(daysSinceLastPurchase)} ngày, đang giảm tần suất`
        };
    }
    // Low risk
    return {
        risk: 'low',
        label: 'Nguy cơ thấp',
        variant: 'success',
        reason: 'Khách hàng đang hoạt động tốt'
    };
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/customers/debt-tracking-utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "calculateDaysOverdue",
    ()=>calculateDaysOverdue,
    "calculateDaysUntilDue",
    ()=>calculateDaysUntilDue,
    "calculateDebtTrackingInfo",
    ()=>calculateDebtTrackingInfo,
    "calculateDueDate",
    ()=>calculateDueDate,
    "calculateTotalDueSoonDebt",
    ()=>calculateTotalDueSoonDebt,
    "calculateTotalOverdueDebt",
    ()=>calculateTotalOverdueDebt,
    "formatCurrency",
    ()=>formatCurrency,
    "formatDebtDate",
    ()=>formatDebtDate,
    "getDebtStatus",
    ()=>getDebtStatus,
    "getDebtStatusVariant",
    ()=>getDebtStatusVariant,
    "getDueSoonCustomers",
    ()=>getDueSoonCustomers,
    "getOverdueDebtCustomers",
    ()=>getOverdueDebtCustomers,
    "parsePaymentTerms",
    ()=>parsePaymentTerms
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-client] (ecmascript)");
;
const calculateDueDate = (orderDate, paymentTermsDays)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toISODate"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addDays"])(new Date(orderDate), paymentTermsDays));
};
const parsePaymentTerms = (paymentTerms)=>{
    if (!paymentTerms) return 0;
    const match = paymentTerms.match(/NET(\d+)/i);
    if (match) {
        return parseInt(match[1], 10);
    }
    if (paymentTerms.toUpperCase() === 'COD') {
        return 0; // COD = thanh toán ngay
    }
    return 30; // Default 30 ngày
};
const calculateDaysOverdue = (dueDate)=>{
    const days = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDaysDiff"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentDate"])(), new Date(dueDate));
    return days > 0 ? days : 0;
};
const calculateDaysUntilDue = (dueDate)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDaysDiff"])(new Date(dueDate), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentDate"])());
};
const getDebtStatus = (dueDate, hasDebt)=>{
    if (!hasDebt) return null;
    const daysUntilDue = calculateDaysUntilDue(dueDate);
    // Chưa đến hạn
    if (daysUntilDue > 3) return "Chưa đến hạn";
    // Sắp đến hạn (1-3 ngày)
    if (daysUntilDue >= 1 && daysUntilDue <= 3) return "Sắp đến hạn";
    // Đến hạn hôm nay
    if (daysUntilDue === 0) return "Đến hạn hôm nay";
    // Quá hạn
    const daysOverdue = Math.abs(daysUntilDue);
    if (daysOverdue >= 1 && daysOverdue <= 7) return "Quá hạn 1-7 ngày";
    if (daysOverdue >= 8 && daysOverdue <= 15) return "Quá hạn 8-15 ngày";
    if (daysOverdue >= 16 && daysOverdue <= 30) return "Quá hạn 16-30 ngày";
    return "Quá hạn > 30 ngày";
};
const getDebtStatusVariant = (status)=>{
    if (!status) return 'secondary';
    switch(status){
        case "Chưa đến hạn":
            return "secondary";
        case "Sắp đến hạn":
            return "default";
        case "Đến hạn hôm nay":
            return "warning";
        case "Quá hạn 1-7 ngày":
            return "warning";
        case "Quá hạn 8-15 ngày":
        case "Quá hạn 16-30 ngày":
        case "Quá hạn > 30 ngày":
            return "destructive";
        default:
            return "secondary";
    }
};
const calculateDebtTrackingInfo = (customer)=>{
    const debtTransactions = customer.debtTransactions || [];
    const unpaidTransactions = debtTransactions.filter((t)=>!t.isPaid);
    if (unpaidTransactions.length === 0 || !customer.currentDebt || customer.currentDebt === 0) {
        return {
            maxDaysOverdue: 0,
            debtStatus: null
        };
    }
    // Tìm giao dịch có dueDate sớm nhất (nợ lâu nhất)
    const oldestTransaction = unpaidTransactions.reduce((oldest, current)=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isDateBefore"])(new Date(current.dueDate), new Date(oldest.dueDate)) ? current : oldest;
    });
    const oldestDebtDueDate = oldestTransaction.dueDate;
    const maxDaysOverdue = calculateDaysOverdue(oldestDebtDueDate);
    const debtStatus = getDebtStatus(oldestDebtDueDate, true);
    return {
        oldestDebtDueDate,
        maxDaysOverdue,
        debtStatus
    };
};
const getOverdueDebtCustomers = (customers)=>{
    return customers.filter((c)=>{
        const info = calculateDebtTrackingInfo(c);
        return info.maxDaysOverdue > 0; // Chỉ lấy KH quá hạn
    }).sort((a, b)=>{
        const infoA = calculateDebtTrackingInfo(a);
        const infoB = calculateDebtTrackingInfo(b);
        // Sắp xếp theo số ngày quá hạn (giảm dần)
        return (infoB.maxDaysOverdue || 0) - (infoA.maxDaysOverdue || 0);
    });
};
const getDueSoonCustomers = (customers)=>{
    return customers.filter((c)=>{
        const info = calculateDebtTrackingInfo(c);
        if (!info.oldestDebtDueDate) return false;
        const daysUntil = calculateDaysUntilDue(info.oldestDebtDueDate);
        return daysUntil >= 1 && daysUntil <= 3;
    }).sort((a, b)=>{
        const infoA = calculateDebtTrackingInfo(a);
        const infoB = calculateDebtTrackingInfo(b);
        const daysA = infoA.oldestDebtDueDate ? calculateDaysUntilDue(infoA.oldestDebtDueDate) : 999;
        const daysB = infoB.oldestDebtDueDate ? calculateDaysUntilDue(infoB.oldestDebtDueDate) : 999;
        return daysA - daysB; // Sắp xếp theo ngày đến hạn (tăng dần)
    });
};
const calculateTotalOverdueDebt = (customers)=>{
    return getOverdueDebtCustomers(customers).reduce((sum, c)=>sum + (c.currentDebt || 0), 0);
};
const calculateTotalDueSoonDebt = (customers)=>{
    return getDueSoonCustomers(customers).reduce((sum, c)=>sum + (c.currentDebt || 0), 0);
};
const formatDebtDate = (dateString)=>{
    if (!dateString) return '-';
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(dateString);
};
const formatCurrency = (value)=>{
    if (typeof value !== 'number') return '0 ₫';
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(value);
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/customers/store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCustomerStore",
    ()=>useCustomerStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/customers/data.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$lifecycle$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/customers/lifecycle-utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$credit$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/customers/credit-utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$intelligence$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/customers/intelligence-utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$debt$2d$tracking$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/customers/debt-tracking-utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/fuse.js/dist/fuse.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/activity-history-helper.ts [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
;
const baseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCrudStore"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["data"], 'customers', {
    businessIdField: 'id',
    persistKey: 'hrm-customers',
    getCurrentUser: __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentUserSystemId"]
});
// Augmented methods
const augmentedMethods = {
    searchCustomers: async (query, page, limit = 20)=>{
        return new Promise((resolve)=>{
            setTimeout(()=>{
                const allCustomers = baseStore.getState().data;
                // Create fresh Fuse instance with current data (avoid stale data)
                const fuse = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](allCustomers, {
                    keys: [
                        'name',
                        'id',
                        'phone'
                    ],
                    threshold: 0.3
                });
                const results = query ? fuse.search(query).map((r)=>r.item) : allCustomers;
                const start = (page - 1) * limit;
                const end = start + limit;
                const paginatedItems = results.slice(start, end);
                resolve({
                    items: paginatedItems.map((c)=>({
                            value: c.systemId,
                            label: c.name
                        })),
                    hasNextPage: end < results.length
                });
            }, 300);
        });
    },
    updateDebt: (systemId, amountChange)=>{
        baseStore.setState((state)=>({
                data: state.data.map((customer)=>{
                    if (customer.systemId === systemId) {
                        return {
                            ...customer,
                            currentDebt: (customer.currentDebt || 0) + amountChange
                        };
                    }
                    return customer;
                })
            }));
    },
    incrementOrderStats: (systemId, orderValue)=>{
        const allCustomers = baseStore.getState().getActive();
        baseStore.setState((state)=>({
                data: state.data.map((customer)=>{
                    if (customer.systemId === systemId) {
                        const updatedCustomer = {
                            ...customer,
                            totalOrders: (customer.totalOrders || 0) + 1,
                            totalSpent: (customer.totalSpent || 0) + orderValue,
                            lastPurchaseDate: new Date().toISOString().split('T')[0]
                        };
                        // Auto-update intelligence after order stats change
                        const rfmScores = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$intelligence$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateRFMScores"])(updatedCustomer, allCustomers);
                        const segment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$intelligence$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCustomerSegment"])(rfmScores);
                        const healthScore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$intelligence$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateHealthScore"])(updatedCustomer);
                        const churnRisk = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$intelligence$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateChurnRisk"])(updatedCustomer).risk;
                        const lifecycleStage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$lifecycle$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateLifecycleStage"])(updatedCustomer);
                        return {
                            ...updatedCustomer,
                            rfmScores,
                            segment,
                            healthScore,
                            churnRisk,
                            lifecycleStage
                        };
                    }
                    return customer;
                })
            }));
    },
    decrementOrderStats: (systemId, orderValue)=>{
        const allCustomers = baseStore.getState().getActive();
        baseStore.setState((state)=>({
                data: state.data.map((customer)=>{
                    if (customer.systemId === systemId) {
                        const updatedCustomer = {
                            ...customer,
                            totalOrders: Math.max(0, (customer.totalOrders || 0) - 1),
                            totalSpent: Math.max(0, (customer.totalSpent || 0) - orderValue)
                        };
                        // Auto-update intelligence after order stats change
                        const rfmScores = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$intelligence$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateRFMScores"])(updatedCustomer, allCustomers);
                        const segment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$intelligence$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCustomerSegment"])(rfmScores);
                        const healthScore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$intelligence$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateHealthScore"])(updatedCustomer);
                        const churnRisk = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$intelligence$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateChurnRisk"])(updatedCustomer).risk;
                        const lifecycleStage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$lifecycle$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateLifecycleStage"])(updatedCustomer);
                        return {
                            ...updatedCustomer,
                            rfmScores,
                            segment,
                            healthScore,
                            churnRisk,
                            lifecycleStage
                        };
                    }
                    return customer;
                })
            }));
    },
    incrementReturnStats: (systemId, quantity)=>{
        baseStore.setState((state)=>({
                data: state.data.map((customer)=>{
                    if (customer.systemId === systemId) {
                        return {
                            ...customer,
                            totalQuantityReturned: (customer.totalQuantityReturned || 0) + quantity
                        };
                    }
                    return customer;
                })
            }));
    },
    incrementFailedDeliveryStats: (systemId)=>{
        baseStore.setState((state)=>({
                data: state.data.map((customer)=>{
                    if (customer.systemId === systemId) {
                        return {
                            ...customer,
                            failedDeliveries: (customer.failedDeliveries || 0) + 1
                        };
                    }
                    return customer;
                })
            }));
    },
    addDebtTransaction: (systemId, transaction)=>{
        baseStore.setState((state)=>({
                data: state.data.map((customer)=>{
                    if (customer.systemId === systemId) {
                        const currentTransactions = customer.debtTransactions || [];
                        // Avoid duplicates
                        if (currentTransactions.some((t)=>t.orderId === transaction.orderId)) {
                            return customer;
                        }
                        const outstandingAmount = Math.max(transaction.remainingAmount ?? transaction.amount ?? 0, 0);
                        return {
                            ...customer,
                            currentDebt: Math.max(0, (customer.currentDebt || 0) + outstandingAmount),
                            debtTransactions: [
                                ...currentTransactions,
                                transaction
                            ]
                        };
                    }
                    return customer;
                })
            }));
    },
    updateDebtTransactionPayment: (systemId, orderId, amountPaid)=>{
        baseStore.setState((state)=>({
                data: state.data.map((customer)=>{
                    if (customer.systemId === systemId && customer.debtTransactions) {
                        let debtDelta = 0;
                        const updatedTransactions = customer.debtTransactions.map((t)=>{
                            if (t.orderId !== orderId) {
                                return t;
                            }
                            const currentPaid = t.paidAmount || 0;
                            const currentRemaining = t.remainingAmount ?? Math.max(t.amount - currentPaid, 0);
                            let appliedAmount = amountPaid;
                            if (appliedAmount > 0) {
                                appliedAmount = Math.min(appliedAmount, currentRemaining);
                            } else if (appliedAmount < 0) {
                                appliedAmount = Math.max(appliedAmount, -currentPaid);
                            }
                            const newPaidAmount = currentPaid + appliedAmount;
                            const recalculatedRemaining = Math.max(t.amount - newPaidAmount, 0);
                            debtDelta -= appliedAmount;
                            return {
                                ...t,
                                paidAmount: newPaidAmount,
                                remainingAmount: recalculatedRemaining,
                                isPaid: recalculatedRemaining <= 0,
                                paidDate: recalculatedRemaining <= 0 ? new Date().toISOString().split('T')[0] : t.paidDate
                            };
                        });
                        return {
                            ...customer,
                            currentDebt: Math.max(0, (customer.currentDebt || 0) + debtDelta),
                            debtTransactions: updatedTransactions
                        };
                    }
                    return customer;
                })
            }));
    },
    removeDebtTransaction: (systemId, orderId)=>{
        baseStore.setState((state)=>({
                data: state.data.map((customer)=>{
                    if (customer.systemId === systemId && customer.debtTransactions) {
                        const transaction = customer.debtTransactions.find((t)=>t.orderId === orderId);
                        const outstanding = transaction ? Math.max(transaction.remainingAmount ?? transaction.amount - (transaction.paidAmount || 0), 0) : 0;
                        return {
                            ...customer,
                            currentDebt: Math.max(0, (customer.currentDebt || 0) - outstanding),
                            debtTransactions: customer.debtTransactions.filter((t)=>t.orderId !== orderId)
                        };
                    }
                    return customer;
                })
            }));
    },
    // Add debt reminder (3.3)
    addDebtReminder: (systemId, reminder)=>{
        baseStore.setState((state)=>({
                data: state.data.map((customer)=>{
                    if (customer.systemId === systemId) {
                        const currentReminders = customer.debtReminders || [];
                        return {
                            ...customer,
                            debtReminders: [
                                ...currentReminders,
                                reminder
                            ]
                        };
                    }
                    return customer;
                })
            }));
    },
    // Update debt reminder (3.3)
    updateDebtReminder: (systemId, reminderId, updates)=>{
        baseStore.setState((state)=>({
                data: state.data.map((customer)=>{
                    if (customer.systemId === systemId && customer.debtReminders) {
                        return {
                            ...customer,
                            debtReminders: customer.debtReminders.map((r)=>r.systemId === reminderId ? {
                                    ...r,
                                    ...updates
                                } : r)
                        };
                    }
                    return customer;
                })
            }));
    },
    // Remove debt reminder (3.3)
    removeDebtReminder: (systemId, reminderId)=>{
        baseStore.setState((state)=>({
                data: state.data.map((customer)=>{
                    if (customer.systemId === systemId && customer.debtReminders) {
                        return {
                            ...customer,
                            debtReminders: customer.debtReminders.filter((r)=>r.systemId !== reminderId)
                        };
                    }
                    return customer;
                })
            }));
    },
    // Override add to auto-calculate lifecycle stage and log activity
    add: (customer)=>{
        const userInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentUserInfo"])();
        const customerWithLifecycle = {
            ...customer,
            lifecycleStage: (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$lifecycle$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateLifecycleStage"])(customer)
        };
        const newCustomer = baseStore.getState().add(customerWithLifecycle);
        // Add activity history entry
        const historyEntry = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCreatedEntry"])(userInfo, `${userInfo.name} đã tạo khách hàng ${newCustomer.name} (${newCustomer.id})`);
        baseStore.getState().update(newCustomer.systemId, {
            ...newCustomer,
            activityHistory: [
                historyEntry
            ]
        });
        return newCustomer;
    },
    // Override update to auto-calculate lifecycle stage and log activity
    update: (systemId, updatedCustomer)=>{
        console.log('[CustomerStore] update called:', {
            systemId,
            updatedCustomer
        });
        const userInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentUserInfo"])();
        const existingCustomer = baseStore.getState().data.find((c)=>c.systemId === systemId);
        const historyEntries = [];
        if (existingCustomer) {
            // Track status changes
            if (existingCustomer.status !== updatedCustomer.status) {
                historyEntries.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createStatusChangedEntry"])(userInfo, existingCustomer.status, updatedCustomer.status, `${userInfo.name} đã đổi trạng thái từ "${existingCustomer.status}" sang "${updatedCustomer.status}"`));
            }
            // Track field changes
            const fieldsToTrack = [
                {
                    key: 'name',
                    label: 'Tên khách hàng'
                },
                {
                    key: 'email',
                    label: 'Email'
                },
                {
                    key: 'phone',
                    label: 'Số điện thoại'
                },
                {
                    key: 'company',
                    label: 'Công ty'
                },
                {
                    key: 'taxCode',
                    label: 'Mã số thuế'
                },
                {
                    key: 'representative',
                    label: 'Người đại diện'
                },
                {
                    key: 'type',
                    label: 'Loại khách hàng'
                },
                {
                    key: 'customerGroup',
                    label: 'Nhóm khách hàng'
                },
                {
                    key: 'lifecycleStage',
                    label: 'Giai đoạn vòng đời'
                },
                {
                    key: 'maxDebt',
                    label: 'Hạn mức công nợ'
                },
                {
                    key: 'paymentTerms',
                    label: 'Điều khoản thanh toán'
                },
                {
                    key: 'creditRating',
                    label: 'Xếp hạng tín dụng'
                },
                {
                    key: 'pricingLevel',
                    label: 'Mức giá'
                },
                {
                    key: 'defaultDiscount',
                    label: 'Chiết khấu mặc định'
                },
                {
                    key: 'accountManagerId',
                    label: 'Nhân viên phụ trách'
                }
            ];
            const changes = [];
            for (const field of fieldsToTrack){
                const oldVal = existingCustomer[field.key];
                const newVal = updatedCustomer[field.key];
                if (oldVal !== newVal && !(oldVal === undefined && newVal === undefined)) {
                    // Skip if it's the status field (already tracked above)
                    if (field.key === 'status') continue;
                    const oldDisplay = oldVal !== undefined && oldVal !== null && oldVal !== '' ? String(oldVal) : '(trống)';
                    const newDisplay = newVal !== undefined && newVal !== null && newVal !== '' ? String(newVal) : '(trống)';
                    changes.push(`${field.label}: ${oldDisplay} → ${newDisplay}`);
                }
            }
            if (changes.length > 0) {
                historyEntries.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createUpdatedEntry"])(userInfo, `${userInfo.name} đã cập nhật: ${changes.join(', ')}`));
            }
        }
        const customerWithLifecycle = {
            ...updatedCustomer,
            lifecycleStage: (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$lifecycle$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateLifecycleStage"])(updatedCustomer),
            activityHistory: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["appendHistoryEntry"])(existingCustomer?.activityHistory, ...historyEntries)
        };
        console.log('[CustomerStore] Calling baseStore.update with:', customerWithLifecycle);
        // Call the update function from baseStore directly
        baseStore.getState().update(systemId, customerWithLifecycle);
        console.log('[CustomerStore] State after update:', baseStore.getState().data.find((c)=>c.systemId === systemId));
    },
    // Get customers with high debt risk
    getHighRiskDebtCustomers: ()=>{
        const activeCustomers = baseStore.getState().getActive();
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$credit$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getHighRiskDebtCustomers"])(activeCustomers);
    },
    // Batch update customer intelligence (RFM, health score, churn risk)
    updateCustomerIntelligence: ()=>{
        const allCustomers = baseStore.getState().getActive();
        baseStore.setState((state)=>({
                data: state.data.map((customer)=>{
                    if (customer.isDeleted) return customer;
                    // Calculate RFM
                    const rfmScores = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$intelligence$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateRFMScores"])(customer, allCustomers);
                    const segment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$intelligence$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCustomerSegment"])(rfmScores);
                    // Calculate health score
                    const healthScore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$intelligence$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateHealthScore"])(customer);
                    // Calculate churn risk
                    const churnRisk = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$intelligence$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateChurnRisk"])(customer).risk;
                    // Calculate lifecycle stage
                    const lifecycleStage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$lifecycle$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateLifecycleStage"])(customer);
                    return {
                        ...customer,
                        rfmScores,
                        segment,
                        healthScore,
                        churnRisk,
                        lifecycleStage
                    };
                })
            }));
    },
    // Get customers by segment
    getCustomersBySegment: (segment)=>{
        return baseStore.getState().getActive().filter((c)=>c.segment === segment);
    },
    // Get customers with overdue debt
    getOverdueDebtCustomers: ()=>{
        const activeCustomers = baseStore.getState().getActive();
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$debt$2d$tracking$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getOverdueDebtCustomers"])(activeCustomers);
    },
    // Get customers with debt due soon
    getDueSoonCustomers: ()=>{
        const activeCustomers = baseStore.getState().getActive();
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$debt$2d$tracking$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDueSoonCustomers"])(activeCustomers);
    },
    removeMany: (systemIds)=>{
        if (!systemIds.length) return;
        const deletedAtTimestamp = new Date().toISOString();
        baseStore.setState((state)=>({
                data: state.data.map((customer)=>systemIds.includes(customer.systemId) ? {
                        ...customer,
                        isDeleted: true,
                        deletedAt: deletedAtTimestamp
                    } : customer)
            }));
    },
    updateManyStatus: (systemIds, status)=>{
        if (!systemIds.length) return;
        baseStore.setState((state)=>({
                data: state.data.map((customer)=>systemIds.includes(customer.systemId) ? {
                        ...customer,
                        status
                    } : customer)
            }));
    },
    restoreMany: (systemIds)=>{
        if (!systemIds.length) return;
        baseStore.setState((state)=>({
                data: state.data.map((customer)=>systemIds.includes(customer.systemId) ? {
                        ...customer,
                        isDeleted: false,
                        deletedAt: null
                    } : customer)
            }));
    }
};
let cachedBaseState = null;
let cachedCombinedState = null;
const getCombinedState = (state)=>{
    if (cachedBaseState !== state || !cachedCombinedState) {
        cachedBaseState = state;
        cachedCombinedState = {
            ...state,
            ...augmentedMethods
        };
    }
    return cachedCombinedState;
};
const boundStore = baseStore;
const useCustomerStore = (selector, equalityFn)=>{
    if (selector) {
        if (equalityFn) {
            return boundStore((state)=>selector(getCombinedState(state)), equalityFn);
        }
        return boundStore((state)=>selector(getCombinedState(state)));
    }
    return boundStore((state)=>getCombinedState(state));
};
useCustomerStore.getState = ()=>{
    return getCombinedState(baseStore.getState());
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/employees/data.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "data",
    ()=>data
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-client] (ecmascript)");
;
/**
 * Helper functions to create EmployeeAddress
 * - 2-cấp: Tỉnh/TP → Phường/Xã (bỏ Quận/Huyện)
 * - 3-cấp: Tỉnh/TP → Quận/Huyện → Phường/Xã (đầy đủ)
 */ const createAddress2Level = (street, ward, province, provinceId = '79', wardId = '')=>({
        street,
        province,
        provinceId,
        district: '',
        districtId: 0,
        ward,
        wardId,
        inputLevel: '2-level'
    });
const createAddress3Level = (street, district, ward, province, provinceId = '79', districtId = 0, wardId = '')=>({
        street,
        province,
        provinceId,
        district,
        districtId,
        ward,
        wardId,
        inputLevel: '3-level'
    });
const SEED_AUTHOR = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000001');
const buildAuditFields = (createdAt, createdBy = SEED_AUTHOR)=>({
        createdAt,
        updatedAt: createdAt,
        createdBy,
        updatedBy: createdBy
    });
const data = [
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000001')),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('1'),
        fullName: 'Nguyễn Văn A',
        workEmail: 'nva@example.com',
        personalEmail: 'nva.personal@gmail.com',
        phone: '0901234567',
        gender: 'Nam',
        dob: '1990-01-01',
        permanentAddress: createAddress2Level('123 ABC', 'Phường Bến Nghé', 'TP.HCM', '79'),
        temporaryAddress: null,
        jobTitle: 'Giám đốc',
        department: 'Kinh doanh',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        hireDate: '2020-01-01',
        baseSalary: 35000000,
        numberOfDependents: 2,
        employmentStatus: 'Đang làm việc',
        employeeType: 'Chính thức',
        leaveTaken: 0,
        paidLeaveTaken: 0,
        unpaidLeaveTaken: 0,
        annualLeaveTaken: 0,
        annualLeaveBalance: 12,
        role: 'Admin',
        password: 'admin123',
        ...buildAuditFields('2024-01-05T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000002')),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('2'),
        fullName: 'Trần Thị B',
        workEmail: 'ttb@example.com',
        personalEmail: 'ttb.personal@gmail.com',
        phone: '0912345678',
        gender: 'Nữ',
        dob: '1992-02-02',
        permanentAddress: createAddress2Level('456 XYZ', 'Phường Thảo Điền', 'TP.HCM', '79'),
        temporaryAddress: null,
        jobTitle: 'Trưởng phòng',
        department: 'Kinh doanh',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        hireDate: '2019-01-01',
        baseSalary: 25000000,
        numberOfDependents: 1,
        employmentStatus: 'Đang làm việc',
        employeeType: 'Chính thức',
        leaveTaken: 5,
        paidLeaveTaken: 4,
        unpaidLeaveTaken: 1,
        annualLeaveTaken: 4,
        annualLeaveBalance: 8,
        role: 'Manager',
        password: 'manager123',
        ...buildAuditFields('2024-02-05T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000003')),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('3'),
        fullName: 'Lê Văn C',
        workEmail: 'lvc@example.com',
        personalEmail: 'lvc.personal@gmail.com',
        phone: '0923456789',
        gender: 'Nam',
        dob: '1995-03-03',
        permanentAddress: createAddress3Level('789 DEF', 'Quận 3', 'Phường 9', 'TP.HCM', '79', 762),
        temporaryAddress: null,
        jobTitle: 'Kỹ sư',
        department: 'Kỹ thuật',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('CN000002'),
        hireDate: '2021-01-01',
        baseSalary: 18000000,
        numberOfDependents: 0,
        employmentStatus: 'Đang làm việc',
        employeeType: 'Chính thức',
        leaveTaken: 2,
        paidLeaveTaken: 2,
        unpaidLeaveTaken: 0,
        annualLeaveTaken: 2,
        annualLeaveBalance: 10,
        role: 'Warehouse',
        password: 'warehouse123',
        ...buildAuditFields('2024-03-05T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000004')),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('4'),
        fullName: 'Võ Thị F',
        workEmail: 'vtf@example.com',
        personalEmail: 'vtf.personal@gmail.com',
        phone: '0934567890',
        gender: 'Nữ',
        dob: '1993-04-04',
        permanentAddress: createAddress2Level('321 GHI', 'Phường Tân Phú', 'TP.HCM', '79'),
        temporaryAddress: null,
        jobTitle: 'Trưởng nhóm',
        department: 'Kinh doanh',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        hireDate: '2020-06-01',
        baseSalary: 20000000,
        numberOfDependents: 1,
        employmentStatus: 'Đang làm việc',
        employeeType: 'Chính thức',
        leaveTaken: 3,
        paidLeaveTaken: 2,
        unpaidLeaveTaken: 1,
        annualLeaveTaken: 2,
        annualLeaveBalance: 9,
        role: 'Sales',
        password: 'sales123',
        ...buildAuditFields('2024-04-05T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000005'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('5'),
        fullName: 'Lê Văn Kho',
        workEmail: 'lvk@example.com',
        personalEmail: 'lvk.personal@gmail.com',
        phone: '0945678901',
        gender: 'Nam',
        dob: '1991-05-15',
        permanentAddress: createAddress3Level('45 Nguyễn Trãi', 'Quận 5', 'Phường 3', 'TP.HCM', '79', 763),
        temporaryAddress: null,
        jobTitle: 'Nhân viên kho',
        department: 'Kỹ thuật',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        hireDate: '2021-03-01',
        baseSalary: 12000000,
        numberOfDependents: 0,
        employmentStatus: 'Đang làm việc',
        employeeType: 'Chính thức',
        leaveTaken: 1,
        paidLeaveTaken: 1,
        unpaidLeaveTaken: 0,
        annualLeaveTaken: 1,
        annualLeaveBalance: 11,
        role: 'Warehouse',
        password: 'warehouse123',
        ...buildAuditFields('2024-05-05T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000006'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('6'),
        fullName: 'Phạm Văn D',
        workEmail: 'pvd@example.com',
        personalEmail: 'pvd.personal@gmail.com',
        phone: '0956789012',
        gender: 'Nam',
        dob: '1988-06-20',
        permanentAddress: createAddress2Level('78 Lê Lợi', 'Phường Bến Thành', 'TP.HCM', '79'),
        temporaryAddress: null,
        jobTitle: 'Nhân viên bán hàng',
        department: 'Kinh doanh',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('CN000002'),
        hireDate: '2019-08-15',
        baseSalary: 15000000,
        numberOfDependents: 2,
        employmentStatus: 'Đang làm việc',
        employeeType: 'Chính thức',
        leaveTaken: 4,
        paidLeaveTaken: 3,
        unpaidLeaveTaken: 1,
        annualLeaveTaken: 3,
        annualLeaveBalance: 9,
        role: 'Sales',
        password: 'sales123',
        ...buildAuditFields('2024-06-05T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('7'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('NV000007'),
        fullName: 'Hoàng Thị E',
        workEmail: 'hte@example.com',
        personalEmail: 'hte.personal@gmail.com',
        phone: '0967890123',
        gender: 'Nữ',
        dob: '1994-07-10',
        permanentAddress: createAddress3Level('112 Hai Bà Trưng', 'Quận 1', 'Phường Đa Kao', 'TP.HCM', '79', 760),
        temporaryAddress: null,
        jobTitle: 'Kế toán',
        department: 'Nhân sự',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        hireDate: '2020-02-01',
        baseSalary: 16000000,
        numberOfDependents: 0,
        employmentStatus: 'Đang làm việc',
        employeeType: 'Chính thức',
        leaveTaken: 2,
        paidLeaveTaken: 2,
        unpaidLeaveTaken: 0,
        annualLeaveTaken: 2,
        annualLeaveBalance: 10,
        role: 'Admin',
        password: 'accountant123',
        ...buildAuditFields('2024-07-05T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000008'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('8'),
        fullName: 'Nguyễn Văn G',
        workEmail: 'nvg@example.com',
        personalEmail: 'nvg.personal@gmail.com',
        phone: '0978901234',
        gender: 'Nam',
        dob: '1996-08-25',
        permanentAddress: createAddress2Level('234 Võ Văn Tần', 'Phường 5', 'TP.HCM', '79'),
        temporaryAddress: null,
        jobTitle: 'Nhân viên IT',
        department: 'Kỹ thuật',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        hireDate: '2022-01-10',
        baseSalary: 18000000,
        numberOfDependents: 0,
        employmentStatus: 'Đang làm việc',
        employeeType: 'Chính thức',
        leaveTaken: 0,
        paidLeaveTaken: 0,
        unpaidLeaveTaken: 0,
        annualLeaveTaken: 0,
        annualLeaveBalance: 12,
        role: 'Admin',
        password: 'staff123',
        ...buildAuditFields('2024-08-05T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000009'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('9'),
        fullName: 'Trần Thị H',
        workEmail: 'tth@example.com',
        personalEmail: 'tth.personal@gmail.com',
        phone: '0989012345',
        gender: 'Nữ',
        dob: '1997-09-05',
        permanentAddress: createAddress3Level('567 Nguyễn Đình Chiểu', 'Quận 3', 'Phường 5', 'TP.HCM', '79', 762),
        temporaryAddress: null,
        jobTitle: 'Nhân viên CSKH',
        department: 'Kinh doanh',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('CN000002'),
        hireDate: '2021-06-01',
        baseSalary: 13000000,
        numberOfDependents: 0,
        employmentStatus: 'Đang làm việc',
        employeeType: 'Chính thức',
        leaveTaken: 3,
        paidLeaveTaken: 2,
        unpaidLeaveTaken: 1,
        annualLeaveTaken: 2,
        annualLeaveBalance: 10,
        role: 'Sales',
        password: 'staff123',
        ...buildAuditFields('2024-09-05T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000010'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('10'),
        fullName: 'Đỗ Văn I',
        workEmail: 'dvi@example.com',
        personalEmail: 'dvi.personal@gmail.com',
        phone: '0990123456',
        gender: 'Nam',
        dob: '1989-10-12',
        permanentAddress: createAddress2Level('890 Cách Mạng Tháng 8', 'Phường 12', 'TP.HCM', '79'),
        temporaryAddress: null,
        jobTitle: 'Trưởng kho',
        department: 'Kỹ thuật',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        hireDate: '2018-04-01',
        baseSalary: 22000000,
        numberOfDependents: 3,
        employmentStatus: 'Đang làm việc',
        employeeType: 'Chính thức',
        leaveTaken: 6,
        paidLeaveTaken: 5,
        unpaidLeaveTaken: 1,
        annualLeaveTaken: 5,
        annualLeaveBalance: 7,
        role: 'Warehouse',
        password: 'warehouse123',
        ...buildAuditFields('2024-10-05T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000011'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('11'),
        fullName: 'Lý Thị K',
        workEmail: 'ltk@example.com',
        personalEmail: 'ltk.personal@gmail.com',
        phone: '0901234568',
        gender: 'Nữ',
        dob: '1995-11-18',
        permanentAddress: createAddress3Level('123 Trần Hưng Đạo', 'Quận 5', 'Phường 7', 'TP.HCM', '79', 763),
        temporaryAddress: null,
        jobTitle: 'Nhân viên Marketing',
        department: 'Marketing',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        hireDate: '2022-03-15',
        baseSalary: 14000000,
        numberOfDependents: 0,
        employmentStatus: 'Đang làm việc',
        employeeType: 'Chính thức',
        leaveTaken: 1,
        paidLeaveTaken: 1,
        unpaidLeaveTaken: 0,
        annualLeaveTaken: 1,
        annualLeaveBalance: 11,
        role: 'Sales',
        password: 'staff123',
        ...buildAuditFields('2024-11-05T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000012'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('12'),
        fullName: 'Bùi Văn L',
        workEmail: 'bvl@example.com',
        personalEmail: 'bvl.personal@gmail.com',
        phone: '0912345679',
        gender: 'Nam',
        dob: '1993-12-22',
        permanentAddress: createAddress2Level('456 Lý Thường Kiệt', 'Phường 14', 'TP.HCM', '79'),
        temporaryAddress: null,
        jobTitle: 'Nhân viên giao hàng',
        department: 'Kinh doanh',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('CN000002'),
        hireDate: '2020-09-01',
        baseSalary: 11000000,
        numberOfDependents: 1,
        employmentStatus: 'Đang làm việc',
        employeeType: 'Chính thức',
        leaveTaken: 2,
        paidLeaveTaken: 2,
        unpaidLeaveTaken: 0,
        annualLeaveTaken: 2,
        annualLeaveBalance: 10,
        role: 'Warehouse',
        password: 'delivery123',
        ...buildAuditFields('2024-12-05T08:00:00Z')
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/repositories/in-memory-repository.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createInMemoryRepository",
    ()=>createInMemoryRepository
]);
const createInMemoryRepository = (stateGetter)=>{
    const getStore = ()=>stateGetter();
    const ensureEntity = (systemId)=>{
        const entity = getStore().findById(systemId);
        if (!entity) {
            throw new Error(`Không tìm thấy entity với systemId=${systemId}`);
        }
        return entity;
    };
    return {
        async list () {
            return [
                ...getStore().data
            ];
        },
        async getById (systemId) {
            return getStore().findById(systemId);
        },
        async create (payload) {
            return getStore().add(payload);
        },
        async update (systemId, payload) {
            ensureEntity(systemId);
            getStore().update(systemId, payload);
            return ensureEntity(systemId);
        },
        async softDelete (systemId) {
            ensureEntity(systemId);
            getStore().remove(systemId);
        },
        async restore (systemId) {
            ensureEntity(systemId);
            getStore().restore(systemId);
            return getStore().findById(systemId);
        },
        async hardDelete (systemId) {
            ensureEntity(systemId);
            getStore().hardDelete(systemId);
        }
    };
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/employees/store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "employeeRepository",
    ()=>employeeRepository,
    "useEmployeeStore",
    ()=>useEmployeeStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/employees/data.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/fuse.js/dist/fuse.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$breadcrumb$2d$generator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/breadcrumb-generator.ts [app-client] (ecmascript)"); // ✅ NEW
var __TURBOPACK__imported__module__$5b$project$5d2f$repositories$2f$in$2d$memory$2d$repository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/repositories/in-memory-repository.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/activity-history-helper.ts [app-client] (ecmascript)");
;
;
;
;
;
;
;
const baseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCrudStore"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["data"], 'employees', {
    businessIdField: 'id',
    persistKey: 'hrm-employees',
    getCurrentUser: __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentUserSystemId"]
});
// ✅ Wrap add method to include activity history
const originalAdd = baseStore.getState().add;
const wrappedAdd = (item)=>{
    const userInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentUserInfo"])();
    const historyEntry = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createHistoryEntry"])('created', `${userInfo.name} đã tạo hồ sơ nhân viên ${item.fullName} (${item.id})`, userInfo);
    const newEmployee = originalAdd({
        ...item,
        activityHistory: [
            historyEntry
        ]
    });
    return newEmployee;
};
// ✅ Wrap update method to include activity history
const originalUpdate = baseStore.getState().update;
const wrappedUpdate = (systemId, updates)=>{
    const currentEmployee = baseStore.getState().data.find((e)=>e.systemId === systemId);
    if (!currentEmployee) return;
    const userInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentUserInfo"])();
    const historyEntries = [];
    // Track important field changes
    const trackedFields = [
        {
            key: 'fullName',
            label: 'họ tên'
        },
        {
            key: 'jobTitle',
            label: 'chức danh'
        },
        {
            key: 'department',
            label: 'phòng ban'
        },
        {
            key: 'employmentStatus',
            label: 'trạng thái làm việc'
        },
        {
            key: 'employeeType',
            label: 'loại nhân viên'
        },
        {
            key: 'baseSalary',
            label: 'lương cơ bản'
        },
        {
            key: 'phone',
            label: 'số điện thoại'
        },
        {
            key: 'workEmail',
            label: 'email công việc'
        },
        {
            key: 'role',
            label: 'vai trò'
        }
    ];
    trackedFields.forEach(({ key, label })=>{
        if (updates[key] !== undefined && updates[key] !== currentEmployee[key]) {
            const oldValue = currentEmployee[key];
            const newValue = updates[key];
            // Format values for display
            let oldDisplay = oldValue;
            let newDisplay = newValue;
            if (key === 'baseSalary') {
                oldDisplay = new Intl.NumberFormat('vi-VN').format(oldValue) + 'đ';
                newDisplay = new Intl.NumberFormat('vi-VN').format(newValue) + 'đ';
            }
            historyEntries.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createHistoryEntry"])('updated', `${userInfo.name} đã cập nhật ${label}: "${oldDisplay || '(trống)'}" → "${newDisplay}"`, userInfo, {
                field: key,
                oldValue,
                newValue
            }));
        }
    });
    // If status changed specifically
    if (updates.employmentStatus && updates.employmentStatus !== currentEmployee.employmentStatus) {
        historyEntries.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createHistoryEntry"])('status_changed', `${userInfo.name} đã thay đổi trạng thái làm việc từ "${currentEmployee.employmentStatus}" thành "${updates.employmentStatus}"`, userInfo, {
            field: 'employmentStatus',
            oldValue: currentEmployee.employmentStatus,
            newValue: updates.employmentStatus
        }));
    }
    // If no specific changes tracked, add generic update entry
    if (historyEntries.length === 0) {
        historyEntries.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createHistoryEntry"])('updated', `${userInfo.name} đã cập nhật thông tin nhân viên`, userInfo));
    }
    const updatedHistory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["appendHistoryEntry"])(currentEmployee.activityHistory, ...historyEntries);
    originalUpdate(systemId, {
        ...updates,
        activityHistory: updatedHistory
    });
};
// ✅ Override base store methods
baseStore.setState({
    add: wrappedAdd,
    update: wrappedUpdate
});
const employeeRepository = (0, __TURBOPACK__imported__module__$5b$project$5d2f$repositories$2f$in$2d$memory$2d$repository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createInMemoryRepository"])(()=>baseStore.getState());
const persistence = {
    create: (payload)=>employeeRepository.create(payload),
    update: (systemId, payload)=>employeeRepository.update(systemId, payload),
    softDelete: (systemId)=>employeeRepository.softDelete(systemId),
    restore: (systemId)=>employeeRepository.restore(systemId),
    hardDelete: (systemId)=>employeeRepository.hardDelete(systemId)
};
// ✅ Register for breadcrumb auto-generation
(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$breadcrumb$2d$generator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["registerBreadcrumbStore"])('employees', ()=>baseStore.getState());
// Augmented methods
const augmentedMethods = {
    // FIX: Changed `page: number = 1` to `page: number` to make it a required parameter, matching Combobox prop type.
    // ✅ CRITICAL FIX: Create fresh Fuse instance on each search to avoid stale data
    searchEmployees: async (query, page, limit = 20)=>{
        return new Promise((resolve)=>{
            setTimeout(()=>{
                const allEmployees = baseStore.getState().data;
                // ✅ Create fresh Fuse instance with current data
                const fuse = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](allEmployees, {
                    keys: [
                        'fullName',
                        'id',
                        'phone',
                        'personalEmail',
                        'workEmail'
                    ],
                    threshold: 0.3
                });
                const results = query ? fuse.search(query).map((r)=>r.item) : allEmployees;
                const start = (page - 1) * limit;
                const end = start + limit;
                const paginatedItems = results.slice(start, end);
                resolve({
                    items: paginatedItems.map((e)=>({
                            value: e.systemId,
                            label: e.fullName
                        })),
                    hasNextPage: end < results.length
                });
            }, 300);
        });
    },
    permanentDelete: async (systemId)=>{
        await persistence.hardDelete(systemId);
    }
};
const useEmployeeStoreHook = ()=>{
    const state = baseStore();
    return {
        ...state,
        ...augmentedMethods,
        persistence
    };
};
const useEmployeeStore = useEmployeeStoreHook;
// Export getState for non-hook usage
useEmployeeStore.getState = ()=>{
    const state = baseStore.getState();
    return {
        ...state,
        ...augmentedMethods,
        persistence
    };
};
useEmployeeStore.persistence = persistence;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/import-export/configs/order.config.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Order Import/Export Configuration
 * 
 * Import đơn hàng với các đặc điểm:
 * - Multi-line: Mỗi sản phẩm 1 dòng, các dòng cùng Mã đơn sẽ được gộp thành 1 Order
 * - Lookup khách hàng theo Mã KH (id field)
 * - Lookup sản phẩm theo SKU
 * - Trạng thái mặc định: "Đặt hàng"
 * - Lấy địa chỉ giao hàng từ khách hàng
 * - Không import phí ship, chiết khấu
 */ __turbopack_context__.s([
    "flattenOrdersForExport",
    ()=>flattenOrdersForExport,
    "orderFieldGroups",
    ()=>orderFieldGroups,
    "orderFields",
    ()=>orderFields,
    "orderImportExportConfig",
    ()=>orderImportExportConfig
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/customers/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/products/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/branches/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/employees/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-client] (ecmascript)");
;
;
;
;
;
// ============================================
// HELPER FUNCTIONS
// ============================================
/**
 * Lookup khách hàng theo Mã KH (id field)
 */ const findCustomerById = (customerId)=>{
    if (!customerId) return undefined;
    const customers = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCustomerStore"].getState().data;
    const normalizedId = String(customerId).trim().toUpperCase();
    return customers.find((c)=>c.id.toUpperCase() === normalizedId || c.systemId.toUpperCase() === normalizedId);
};
/**
 * Lookup sản phẩm theo SKU
 */ const findProductBySku = (sku)=>{
    if (!sku) return undefined;
    const products = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductStore"].getState().data;
    const normalizedSku = String(sku).trim().toUpperCase();
    return products.find((p)=>p.id.toUpperCase() === normalizedSku || p.sku?.toUpperCase() === normalizedSku || p.systemId.toUpperCase() === normalizedSku);
};
/**
 * Lookup chi nhánh theo tên hoặc mã
 */ const findBranch = (branchIdOrName)=>{
    if (!branchIdOrName) return undefined;
    const branches = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBranchStore"].getState().data;
    const normalized = String(branchIdOrName).trim().toLowerCase();
    return branches.find((b)=>b.id.toLowerCase() === normalized || b.name.toLowerCase() === normalized || b.systemId.toLowerCase() === normalized);
};
/**
 * Lookup nhân viên theo tên hoặc mã
 */ const findEmployee = (employeeIdOrName)=>{
    if (!employeeIdOrName) return undefined;
    const employees = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEmployeeStore"].getState().data;
    const normalized = String(employeeIdOrName).trim().toLowerCase();
    return employees.find((e)=>e.id.toLowerCase() === normalized || e.fullName.toLowerCase() === normalized || e.systemId.toLowerCase() === normalized);
};
/**
 * Get default branch
 */ const getDefaultBranch = ()=>{
    const branches = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBranchStore"].getState().data;
    return branches.find((b)=>b.isDefault) || branches[0];
};
/**
 * Get default shipping address from customer
 */ const getCustomerShippingAddress = (customer)=>{
    if (!customer) return undefined;
    // Tìm địa chỉ mặc định hoặc địa chỉ đầu tiên
    const defaultAddr = customer.addresses?.find((a)=>a.isDefault || a.isDefaultShipping) || customer.addresses?.[0];
    if (defaultAddr) {
        const formattedAddress = [
            defaultAddr.street,
            defaultAddr.ward,
            defaultAddr.district,
            defaultAddr.province
        ].filter(Boolean).join(', ');
        return {
            street: defaultAddr.street,
            ward: defaultAddr.ward,
            district: defaultAddr.district,
            province: defaultAddr.province,
            contactName: customer.name,
            phone: customer.phone,
            formattedAddress
        };
    }
    return undefined;
};
const orderFields = [
    // ===== Thông tin đơn hàng =====
    {
        key: 'orderId',
        label: 'Mã đơn hàng (*)',
        type: 'string',
        required: true,
        example: 'DH001',
        group: 'Đơn hàng',
        defaultSelected: true
    },
    {
        key: 'customerId',
        label: 'Mã khách hàng (*)',
        type: 'string',
        required: true,
        example: 'KH001',
        group: 'Đơn hàng',
        defaultSelected: true
    },
    {
        key: 'branchName',
        label: 'Chi nhánh',
        type: 'string',
        required: false,
        example: 'Chi nhánh Hà Nội',
        group: 'Đơn hàng',
        defaultSelected: true,
        validator: (value)=>{
            if (value && String(value).trim() !== '') {
                const branch = findBranch(String(value));
                if (!branch) {
                    return `Không tìm thấy chi nhánh "${value}"`;
                }
            }
            return true;
        }
    },
    {
        key: 'salespersonName',
        label: 'Nhân viên bán hàng',
        type: 'string',
        required: false,
        example: 'Nguyễn Văn A',
        group: 'Đơn hàng',
        defaultSelected: true,
        validator: (value)=>{
            if (value && String(value).trim() !== '') {
                const employee = findEmployee(String(value));
                if (!employee) {
                    return `Không tìm thấy nhân viên "${value}"`;
                }
            }
            return true;
        }
    },
    {
        key: 'orderDate',
        label: 'Ngày đặt hàng',
        type: 'date',
        required: false,
        example: '19/12/2024',
        group: 'Đơn hàng',
        defaultSelected: true
    },
    {
        key: 'source',
        label: 'Nguồn đơn',
        type: 'string',
        required: false,
        example: 'Website',
        group: 'Đơn hàng',
        defaultSelected: false
    },
    {
        key: 'tags',
        label: 'Tags',
        type: 'string',
        required: false,
        example: 'VIP, Gấp',
        group: 'Đơn hàng',
        defaultSelected: false
    },
    {
        key: 'orderNote',
        label: 'Ghi chú đơn hàng',
        type: 'string',
        required: false,
        example: 'Giao buổi sáng',
        group: 'Đơn hàng',
        defaultSelected: true
    },
    // ===== Thông tin sản phẩm =====
    {
        key: 'productSku',
        label: 'SKU sản phẩm (*)',
        type: 'string',
        required: true,
        example: 'SP001',
        group: 'Sản phẩm',
        defaultSelected: true,
        validator: (value)=>{
            if (!value || String(value).trim() === '') {
                return 'SKU sản phẩm không được để trống';
            }
            const product = findProductBySku(String(value));
            if (!product) {
                return `Không tìm thấy sản phẩm với SKU "${value}"`;
            }
            return true;
        }
    },
    {
        key: 'quantity',
        label: 'Số lượng (*)',
        type: 'number',
        required: true,
        example: '2',
        group: 'Sản phẩm',
        defaultSelected: true,
        validator: (value)=>{
            const qty = Number(value);
            if (isNaN(qty) || qty <= 0) {
                return 'Số lượng phải là số dương';
            }
            return true;
        },
        importTransform: (value)=>{
            const num = Number(value);
            return isNaN(num) ? 1 : Math.max(1, Math.floor(num));
        }
    },
    {
        key: 'unitPrice',
        label: 'Đơn giá',
        type: 'number',
        required: false,
        example: '150000',
        group: 'Sản phẩm',
        defaultSelected: true,
        importTransform: (value)=>{
            if (value === undefined || value === null || value === '') return undefined;
            const num = Number(value);
            return isNaN(num) ? undefined : Math.max(0, num);
        }
    },
    {
        key: 'lineNote',
        label: 'Ghi chú SP',
        type: 'string',
        required: false,
        example: 'Màu đỏ',
        group: 'Sản phẩm',
        defaultSelected: false
    }
];
const orderFieldGroups = [
    {
        id: 'order-info',
        label: 'Thông tin đơn hàng',
        columns: [
            {
                key: 'id',
                label: 'Mã đơn hàng',
                defaultSelected: true
            },
            {
                key: 'orderDate',
                label: 'Ngày đặt',
                defaultSelected: true
            },
            {
                key: 'status',
                label: 'Trạng thái',
                defaultSelected: true
            },
            {
                key: 'source',
                label: 'Nguồn đơn',
                defaultSelected: false
            },
            {
                key: 'tags',
                label: 'Tags',
                defaultSelected: false
            },
            {
                key: 'notes',
                label: 'Ghi chú',
                defaultSelected: false
            }
        ]
    },
    {
        id: 'customer-info',
        label: 'Thông tin khách hàng',
        columns: [
            {
                key: 'customerId',
                label: 'Mã KH',
                defaultSelected: true
            },
            {
                key: 'customerName',
                label: 'Tên khách hàng',
                defaultSelected: true
            },
            {
                key: 'customerPhone',
                label: 'SĐT khách',
                defaultSelected: true
            },
            {
                key: 'shippingAddress',
                label: 'Địa chỉ giao',
                defaultSelected: true
            }
        ]
    },
    {
        id: 'product-info',
        label: 'Thông tin sản phẩm',
        columns: [
            {
                key: 'productSku',
                label: 'SKU',
                defaultSelected: true
            },
            {
                key: 'productName',
                label: 'Tên sản phẩm',
                defaultSelected: true
            },
            {
                key: 'quantity',
                label: 'Số lượng',
                defaultSelected: true
            },
            {
                key: 'unitPrice',
                label: 'Đơn giá',
                defaultSelected: true
            },
            {
                key: 'lineTotal',
                label: 'Thành tiền',
                defaultSelected: true
            },
            {
                key: 'lineNote',
                label: 'Ghi chú SP',
                defaultSelected: false
            }
        ]
    },
    {
        id: 'payment-info',
        label: 'Thanh toán',
        columns: [
            {
                key: 'subtotal',
                label: 'Tạm tính',
                defaultSelected: true
            },
            {
                key: 'shippingFee',
                label: 'Phí ship',
                defaultSelected: false
            },
            {
                key: 'orderDiscount',
                label: 'Chiết khấu',
                defaultSelected: false
            },
            {
                key: 'grandTotal',
                label: 'Tổng tiền',
                defaultSelected: true
            },
            {
                key: 'paidAmount',
                label: 'Đã thanh toán',
                defaultSelected: true
            },
            {
                key: 'paymentStatus',
                label: 'Trạng thái TT',
                defaultSelected: true
            }
        ]
    },
    {
        id: 'delivery-info',
        label: 'Vận chuyển',
        columns: [
            {
                key: 'deliveryMethod',
                label: 'Phương thức giao',
                defaultSelected: true
            },
            {
                key: 'deliveryStatus',
                label: 'Trạng thái giao',
                defaultSelected: true
            },
            {
                key: 'trackingCode',
                label: 'Mã vận đơn',
                defaultSelected: false
            },
            {
                key: 'carrier',
                label: 'ĐVVC',
                defaultSelected: false
            }
        ]
    },
    {
        id: 'branch-staff',
        label: 'Chi nhánh & Nhân viên',
        columns: [
            {
                key: 'branchName',
                label: 'Chi nhánh',
                defaultSelected: true
            },
            {
                key: 'salesperson',
                label: 'Nhân viên bán',
                defaultSelected: true
            }
        ]
    }
];
const orderImportExportConfig = {
    entityType: 'orders',
    entityDisplayName: 'Đơn hàng',
    fields: orderFields,
    templateFileName: 'Mau_Nhap_Don_Hang.xlsx',
    sheetName: 'Đơn hàng',
    // Import settings
    upsertKey: 'id',
    allowUpdate: false,
    allowInsert: true,
    requirePreview: true,
    maxRows: 1000,
    maxErrorsAllowed: 0,
    // Pre-process: Fill empty orderId/customerId from previous row
    // User must fill orderId + customerId on first row of each order
    // Subsequent product rows can leave them empty → will inherit from previous row
    preProcessRows: (rows)=>{
        const importRows = rows;
        let currentOrderId = '';
        let currentCustomerId = '';
        for (const row of importRows){
            // If orderId is provided, use it and update current
            if (row.orderId?.trim()) {
                currentOrderId = row.orderId.trim();
                // Also update customerId if provided on the same row
                if (row.customerId?.trim()) {
                    currentCustomerId = row.customerId.trim();
                }
            } else if (currentOrderId) {
                // Fill from previous row's orderId (for subsequent product lines)
                row.orderId = currentOrderId;
            }
            // Note: if orderId is empty and no previous orderId → validation will catch it
            // Fill customerId if empty (inherit from previous row)
            if (!row.customerId?.trim() && currentCustomerId) {
                row.customerId = currentCustomerId;
            } else if (row.customerId?.trim()) {
                currentCustomerId = row.customerId.trim();
            }
        }
        return importRows;
    },
    // Validate row (after pre-processing)
    validateRow: (row, _index, existingData, mode)=>{
        const errors = [];
        const importRow = row;
        // Check required fields - orderId must be filled on first row of each order
        if (!importRow.orderId) {
            errors.push({
                field: 'orderId',
                message: 'Mã đơn hàng không được để trống (bắt buộc điền ở dòng đầu của mỗi đơn)'
            });
        }
        if (!importRow.customerId) {
            errors.push({
                field: 'customerId',
                message: 'Mã khách hàng không được để trống (điền ở dòng đầu của mỗi đơn)'
            });
        }
        if (!importRow.productSku) {
            errors.push({
                field: 'productSku',
                message: 'SKU sản phẩm không được để trống'
            });
        }
        // Validate customer
        if (importRow.customerId) {
            const customer = findCustomerById(importRow.customerId);
            if (!customer) {
                errors.push({
                    field: 'customerId',
                    message: `Không tìm thấy khách hàng "${importRow.customerId}"`
                });
            }
        }
        // Validate product
        if (importRow.productSku) {
            const product = findProductBySku(importRow.productSku);
            if (!product) {
                errors.push({
                    field: 'productSku',
                    message: `Không tìm thấy sản phẩm "${importRow.productSku}"`
                });
            }
        }
        // Validate branch if provided
        if (importRow.branchName) {
            const branch = findBranch(importRow.branchName);
            if (!branch) {
                errors.push({
                    field: 'branchName',
                    message: `Không tìm thấy chi nhánh "${importRow.branchName}"`
                });
            }
        }
        // Validate salesperson if provided
        if (importRow.salespersonName) {
            const employee = findEmployee(importRow.salespersonName);
            if (!employee) {
                errors.push({
                    field: 'salespersonName',
                    message: `Không tìm thấy nhân viên "${importRow.salespersonName}"`
                });
            }
        }
        // Validate quantity
        if (importRow.quantity !== undefined) {
            const qty = Number(importRow.quantity);
            if (isNaN(qty) || qty <= 0) {
                errors.push({
                    field: 'quantity',
                    message: 'Số lượng phải là số dương'
                });
            }
        }
        // Check duplicate order ID in existing data (only in insert-only mode)
        if (mode === 'insert-only' && importRow.orderId) {
            const duplicate = existingData.find((o)=>o.id.toUpperCase() === importRow.orderId.toUpperCase());
            if (duplicate) {
                errors.push({
                    field: 'orderId',
                    message: `Mã đơn hàng "${importRow.orderId}" đã tồn tại`
                });
            }
        }
        return errors;
    },
    // Transform: Group rows by orderId and build Order objects
    // This is handled in postTransformRow and beforeImport
    beforeImport: async (data)=>{
        // data here is actually OrderImportRow[] after field transforms
        const importRows = data;
        // Group rows by orderId
        const orderMap = new Map();
        for (const row of importRows){
            const orderId = row.orderId?.trim().toUpperCase();
            if (!orderId) continue;
            if (!orderMap.has(orderId)) {
                const customer = findCustomerById(row.customerId);
                const branch = row.branchName ? findBranch(row.branchName) : getDefaultBranch();
                const employee = row.salespersonName ? findEmployee(row.salespersonName) : undefined;
                orderMap.set(orderId, {
                    rows: [],
                    customer,
                    branch,
                    employee
                });
            }
            orderMap.get(orderId).rows.push(row);
        }
        // Build Order objects
        const orders = [];
        const now = new Date().toISOString();
        for (const [orderId, { rows, customer, branch, employee }] of orderMap.entries()){
            if (!customer || rows.length === 0) continue;
            // Build line items
            const lineItems = [];
            for (const row of rows){
                const product = findProductBySku(row.productSku);
                if (!product) continue;
                const quantity = Math.max(1, Math.floor(Number(row.quantity) || 1));
                const unitPrice = row.unitPrice ?? product.sellingPrice ?? product.costPrice ?? 0;
                lineItems.push({
                    productSystemId: product.systemId,
                    productId: product.id,
                    productName: product.name,
                    quantity,
                    unitPrice,
                    discount: 0,
                    discountType: 'fixed',
                    note: row.lineNote
                });
            }
            if (lineItems.length === 0) continue;
            // Calculate totals
            const subtotal = lineItems.reduce((sum, item)=>{
                return sum + item.unitPrice * item.quantity;
            }, 0);
            // Get first row for order-level data
            const firstRow = rows[0];
            // Parse order date
            let orderDate = now;
            if (firstRow.orderDate) {
                const parsed = new Date(firstRow.orderDate);
                if (!isNaN(parsed.getTime())) {
                    orderDate = parsed.toISOString();
                }
            }
            // Build shipping address from customer
            const shippingAddress = getCustomerShippingAddress(customer);
            // Parse tags
            const tags = firstRow.tags ? firstRow.tags.split(',').map((t)=>t.trim()).filter(Boolean) : undefined;
            const order = {
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(''),
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])(orderId),
                customerSystemId: customer.systemId,
                customerName: customer.name,
                branchSystemId: branch?.systemId || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(''),
                branchName: branch?.name || '',
                salespersonSystemId: employee?.systemId || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(''),
                salesperson: employee?.fullName || '',
                orderDate,
                // Statuses - all new orders start with "Đặt hàng"
                status: 'Đặt hàng',
                paymentStatus: 'Chưa thanh toán',
                deliveryStatus: 'Chờ đóng gói',
                printStatus: 'Chưa in',
                stockOutStatus: 'Chưa xuất kho',
                returnStatus: 'Chưa trả hàng',
                deliveryMethod: 'Dịch vụ giao hàng',
                // Address
                shippingAddress,
                // Line items
                lineItems,
                // Totals (no discount, no shipping fee from import)
                subtotal,
                shippingFee: 0,
                tax: 0,
                grandTotal: subtotal,
                paidAmount: 0,
                codAmount: 0,
                // Arrays
                payments: [],
                packagings: [],
                // Optional fields
                notes: firstRow.orderNote,
                source: firstRow.source,
                tags,
                // Timestamps
                createdAt: now,
                updatedAt: now
            };
            orders.push(order);
        }
        return orders;
    }
};
function flattenOrdersForExport(orders) {
    const rows = [];
    for (const order of orders){
        // Get customer info
        const customer = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCustomerStore"].getState().findById(order.customerSystemId);
        // Get latest packaging for tracking info
        const latestPackaging = order.packagings?.[order.packagings.length - 1];
        for (const item of order.lineItems){
            rows.push({
                // Order info
                id: order.id,
                orderDate: order.orderDate,
                status: order.status,
                source: order.source || '',
                tags: order.tags?.join(', ') || '',
                notes: order.notes || '',
                // Customer info
                customerId: customer?.id || '',
                customerName: order.customerName,
                customerPhone: customer?.phone || '',
                shippingAddress: typeof order.shippingAddress === 'string' ? order.shippingAddress : order.shippingAddress?.formattedAddress || '',
                // Product info
                productSku: item.productId,
                productName: item.productName,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                lineTotal: item.unitPrice * item.quantity,
                lineNote: item.note || '',
                // Payment info
                subtotal: order.subtotal,
                shippingFee: order.shippingFee,
                orderDiscount: order.orderDiscount || 0,
                grandTotal: order.grandTotal,
                paidAmount: order.paidAmount,
                paymentStatus: order.paymentStatus,
                // Delivery info
                deliveryMethod: order.deliveryMethod,
                deliveryStatus: order.deliveryStatus,
                trackingCode: latestPackaging?.trackingCode || '',
                carrier: latestPackaging?.carrier || '',
                // Branch & Staff
                branchName: order.branchName,
                salesperson: order.salesperson
            });
        }
    }
    return rows;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/import-export/configs/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
/**
 * Import/Export Configs - Index
 * 
 * Re-export tất cả configs
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$export$2f$configs$2f$employee$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/import-export/configs/employee.config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$export$2f$configs$2f$attendance$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/import-export/configs/attendance.config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$export$2f$configs$2f$customer$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/import-export/configs/customer.config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$export$2f$configs$2f$product$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/import-export/configs/product.config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$export$2f$configs$2f$brand$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/import-export/configs/brand.config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$export$2f$configs$2f$category$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/import-export/configs/category.config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$export$2f$configs$2f$order$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/import-export/configs/order.config.ts [app-client] (ecmascript)");
;
;
;
;
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/import-export/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * Import/Export System - Main Exports
 */ // Types
__turbopack_context__.s([]);
// Store
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$export$2f$import$2d$export$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/import-export/import-export-store.ts [app-client] (ecmascript)");
// Employee Mapping Store
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$export$2f$employee$2d$mapping$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/import-export/employee-mapping-store.ts [app-client] (ecmascript)");
// Utils
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$export$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/import-export/utils.ts [app-client] (ecmascript)");
// Attendance Parser
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$export$2f$attendance$2d$parser$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/import-export/attendance-parser.ts [app-client] (ecmascript)");
// Configs
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$export$2f$configs$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/import-export/configs/index.ts [app-client] (ecmascript) <locals>");
;
;
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/api-config.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * API Configuration Utilities
 * 
 * Centralized configuration for API endpoints.
 * All API URLs should use these utilities instead of hardcoding.
 */ /**
 * Get the API base URL from environment variables
 * Falls back to localhost:3001 for development
 */ __turbopack_context__.s([
    "getApiBaseUrl",
    ()=>getApiBaseUrl,
    "getApiUrl",
    ()=>getApiUrl,
    "getBaseUrl",
    ()=>getBaseUrl,
    "getFileUrl",
    ()=>getFileUrl
]);
const __TURBOPACK__import$2e$meta__ = {
    get url () {
        return `file://${__turbopack_context__.P("lib/api-config.ts")}`;
    }
};
function getApiBaseUrl() {
    // Use relative path to leverage Vite proxy in development
    // This avoids CORS issues when frontend (5173) talks to backend (3001)
    const meta = __TURBOPACK__import$2e$meta__;
    if (meta.env?.DEV) {
        return '/api';
    }
    return meta.env?.VITE_API_BASE_URL || 'http://localhost:3001/api';
}
function getBaseUrl() {
    const apiUrl = getApiBaseUrl();
    return apiUrl.replace('/api', '');
}
function getFileUrl(relativePath) {
    if (!relativePath) return '';
    // If already a full URL, return as is
    if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
        return relativePath;
    }
    // Build full URL
    const baseUrl = getBaseUrl();
    return `${baseUrl}${relativePath}`;
}
function getApiUrl(endpoint) {
    const apiBaseUrl = getApiBaseUrl();
    return `${apiBaseUrl}${endpoint}`;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/file-upload-api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FileUploadAPI",
    ()=>FileUploadAPI
]);
// API client để giao tiếp với server - Staging System
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-config.ts [app-client] (ecmascript)");
;
const API_BASE_URL = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getApiBaseUrl"])();
class FileUploadAPI {
    // Upload files vào staging (tạm thời)
    static async uploadToStaging(files, sessionId) {
        const formData = new FormData();
        files.forEach((file)=>{
            formData.append('files', file);
        });
        // CRITICAL FIX: sessionId in FormData doesn't work with multer
        // Send via query params instead
        const url = sessionId ? `${API_BASE_URL}/staging/upload?sessionId=${encodeURIComponent(sessionId)}` : `${API_BASE_URL}/staging/upload`;
        console.log('📤 Uploading to:', url);
        console.log('📦 Files:', files.map((f)=>`${f.name} (${(f.size / 1024).toFixed(1)}KB)`));
        let response;
        try {
            response = await fetch(url, {
                method: 'POST',
                body: formData
            });
        } catch (fetchError) {
            console.error('❌ Network fetch failed:', fetchError);
            throw new Error(`Không thể kết nối đến server (${API_BASE_URL}). Vui lòng kiểm tra server có đang chạy.`);
        }
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Server error:', response.status, errorText);
            throw new Error(`Server error (${response.status}): ${errorText}`);
        }
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || 'Staging upload failed');
        }
        return {
            files: result.files,
            sessionId: result.sessionId
        };
    }
    // Confirm staging files → permanent với smart filename
    // NOTE: entitySystemId MUST be immutable (systemId) to avoid broken references
    static async confirmStagingFiles(sessionId, entitySystemId, documentType, documentName, metadata) {
        const response = await fetch(`${API_BASE_URL}/staging/confirm/${sessionId}/${entitySystemId}/${documentType}/${encodeURIComponent(documentName)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                metadata
            })
        });
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || 'Confirm failed');
        }
        return result.files;
    }
    // Lấy staging files theo session
    static async getStagingFiles(sessionId) {
        const response = await fetch(`${API_BASE_URL}/staging/files/${sessionId}`);
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || 'Failed to fetch staging files');
        }
        return result.files;
    }
    // Xóa staging files (cancel)
    static async deleteStagingFiles(sessionId) {
        const response = await fetch(`${API_BASE_URL}/staging/${sessionId}`, {
            method: 'DELETE'
        });
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || 'Delete staging failed');
        }
    }
    // Upload files lên server (legacy - direct permanent)
    // NOTE: employeeId MUST be the systemId (immutable), NOT the business ID
    static async uploadFiles(employeeId, documentType, documentName, files) {
        const formData = new FormData();
        files.forEach((file)=>{
            formData.append('files', file);
        });
        const response = await fetch(`${API_BASE_URL}/upload/${employeeId}/${documentType}/${encodeURIComponent(documentName)}`, {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || 'Upload failed');
        }
        return result.files;
    }
    // Lấy danh sách file permanent
    // NOTE: employeeId MUST be the systemId (immutable), NOT the business ID
    static async getFiles(employeeId, documentType) {
        try {
            const url = documentType ? `${API_BASE_URL}/files/${employeeId}/${documentType}` : `${API_BASE_URL}/files/${employeeId}`;
            const response = await fetch(url);
            // Check if response is ok
            if (!response.ok) {
                return []; // Return empty array instead of throwing
            }
            const result = await response.json();
            if (!result.success) {
                return []; // Return empty array instead of throwing
            }
            return result.files || [];
        } catch (_error) {
            return []; // Return empty array on network error
        }
    }
    // Xóa file permanent
    static async deleteFile(fileId) {
        const response = await fetch(`${API_BASE_URL}/files/${fileId}`, {
            method: 'DELETE'
        });
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || 'Delete failed');
        }
    }
    // Lấy URL file để hiển thị (bao gồm staging và permanent)
    static getFileUrl(file) {
        // ✅ Return relative path to use Vite proxy - avoid CORS
        // Server already returns relative path like /api/staging/files/...
        return file.url;
    }
    // Thống kê storage (chỉ permanent files)
    static async getStorageInfo() {
        const response = await fetch(`${API_BASE_URL}/storage/info`);
        const result = await response.json();
        if (!result.success) {
            throw new Error('Failed to get storage info');
        }
        return result.stats;
    }
    // Helper: Generate session ID cho staging
    static generateSessionId() {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    static async getProductFiles(productId) {
        return this.getFiles(productId, 'products');
    }
    // Get customer files (images)
    static async getCustomerFiles(customerId) {
        try {
            const response = await fetch(`${API_BASE_URL}/files/customers/${customerId}`);
            if (!response.ok) {
                return [];
            }
            const result = await response.json();
            if (!result.success) {
                return [];
            }
            return result.files || [];
        } catch (error) {
            console.error('Failed to get customer files:', error);
            return [];
        }
    }
    // Get customer contract files
    static async getCustomerContractFiles(customerId) {
        try {
            const response = await fetch(`${API_BASE_URL}/files/customers/${customerId}/contracts`);
            if (!response.ok) {
                return [];
            }
            const result = await response.json();
            if (!result.success) {
                return [];
            }
            return result.files || [];
        } catch (error) {
            console.error('Failed to get customer contract files:', error);
            return [];
        }
    }
    // Confirm customer contract files from staging to permanent
    static async confirmCustomerContractFiles(sessionId, customerId, customerData) {
        const response = await fetch(`${API_BASE_URL}/staging/confirm/${sessionId}/customers/${customerId}/contracts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                customerData
            })
        });
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || 'Confirm customer contract files failed');
        }
        return result.files;
    }
    // Confirm customer images from staging to permanent
    static async confirmCustomerImages(sessionId, customerId, customerData) {
        const response = await fetch(`${API_BASE_URL}/staging/confirm/${sessionId}/customers/${customerId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                customerData
            })
        });
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || 'Confirm customer images failed');
        }
        return result.files;
    }
    // Confirm warranty images from staging to permanent
    static async confirmWarrantyImages(sessionId, warrantyId, imageType, warrantyData) {
        const response = await fetch(`${API_BASE_URL}/staging/confirm/${sessionId}/warranty/${warrantyId}/${imageType}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                warrantyData
            })
        });
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || 'Confirm warranty images failed');
        }
        return result.files;
    }
    // Delete staging session (cleanup on cancel)
    static async deleteStagingSession(sessionId) {
        const response = await fetch(`${API_BASE_URL}/staging/${sessionId}`, {
            method: 'DELETE'
        });
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || 'Delete staging session failed');
        }
    }
    /**
   * Upload ảnh từ TipTap Editor vào STAGING
   * Ảnh sẽ được move sang permanent khi entity được save
   * 
   * @param file - File ảnh cần upload
   * @param sessionId - Session ID để group các ảnh cùng editor
   * @returns StagingFile với URL tạm thời
   */ static async uploadEditorImageToStaging(file, sessionId) {
        const result = await FileUploadAPI.uploadToStaging([
            file
        ], sessionId);
        return {
            file: result.files[0],
            sessionId: result.sessionId
        };
    }
    /**
   * Confirm ảnh editor từ staging sang permanent
   * Đồng thời replace staging URLs trong HTML content bằng permanent URLs
   * 
   * @param sessionId - Editor staging session
   * @param entityId - ID của entity (category, product, etc.)
   * @param entityType - Loại entity ('categories', 'products', etc.)
   * @param htmlContent - Nội dung HTML cần update URLs
   * @returns Updated HTML với permanent URLs
   */ static async confirmEditorImages(sessionId, entityId, entityType, htmlContent) {
        // Confirm staging files
        const confirmedFiles = await FileUploadAPI.confirmStagingFiles(sessionId, entityId, entityType, 'editor-images', {
            source: 'tiptap-editor'
        });
        // Replace staging URLs with permanent URLs in HTML
        let updatedHtml = htmlContent;
        for (const file of confirmedFiles){
            // Staging URL pattern: /api/staging/preview/{sessionId}/{filename}
            // Find and replace with permanent URL
            const stagingPattern = new RegExp(`/api/staging/preview/[^/]+/${file.filename.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g');
            updatedHtml = updatedHtml.replace(stagingPattern, file.url);
        }
        return {
            html: updatedHtml,
            files: confirmedFiles
        };
    }
    static async uploadCommentImage(file) {
        const formData = new FormData();
        formData.append('image', file);
        const response = await fetch(`${API_BASE_URL}/comments/upload-image`, {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        if (!response.ok || !result.success) {
            throw new Error(result.message || 'Upload ảnh bình luận thất bại');
        }
        return FileUploadAPI.mapDirectUpload(result.file, file.name);
    }
    static async uploadPrintTemplateImage(file) {
        const formData = new FormData();
        formData.append('image', file);
        const response = await fetch(`${API_BASE_URL}/print-templates/upload-image`, {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        if (!response.ok || !result.success) {
            throw new Error(result.message || 'Upload ảnh mẫu in thất bại');
        }
        return FileUploadAPI.mapDirectUpload(result.file, file.name);
    }
    static async uploadComplaintCommentImage(complaintId, file) {
        const formData = new FormData();
        formData.append('image', file);
        const response = await fetch(`${API_BASE_URL}/complaints/${complaintId}/comments/upload`, {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        if (!response.ok || !result.success) {
            throw new Error(result.message || 'Upload ảnh khiếu nại thất bại');
        }
        return FileUploadAPI.mapDirectUpload(result.file, file.name);
    }
    static async uploadTaskEvidence(taskId, files) {
        if (files.length === 0) {
            return [];
        }
        const formData = new FormData();
        files.forEach((file)=>formData.append('files', file));
        const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/evidence`, {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        if (!response.ok || !result.success) {
            throw new Error(result.message || 'Upload bằng chứng công việc thất bại');
        }
        return (result.files || []).map((file, index)=>FileUploadAPI.mapDirectUpload(file, files[index]?.name || `evidence-${index}`));
    }
    static mapDirectUpload(file, fallbackName) {
        return {
            id: file.id,
            name: file.originalName || file.name || fallbackName,
            size: file.size || file.filesize || 0,
            type: file.mimetype || file.type || 'application/octet-stream',
            url: file.url,
            uploadedAt: file.uploadedAt || new Date().toISOString()
        };
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/shared/excel-file-dropzone.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ExcelFileDropzone",
    ()=>ExcelFileDropzone
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * ExcelFileDropzone
 * 
 * Component kéo thả file Excel cho import
 * - Hỗ trợ kéo thả
 * - Upload lên server staging (tùy chọn)
 * - Preview file đã chọn
 * - Validate file Excel
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$dropzone$2f$dist$2f$es$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/react-dropzone/dist/es/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-spreadsheet.js [app-client] (ecmascript) <export default as FileSpreadsheet>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/upload.js [app-client] (ecmascript) <export default as Upload>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-client] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-client] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$file$2d$upload$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/file-upload-api.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
// ============================================
// HELPERS
// ============================================
const formatFileSize = (bytes)=>{
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = [
        'Bytes',
        'KB',
        'MB',
        'GB'
    ];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
const isExcelFile = (file)=>{
    const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
    ];
    const validExtensions = [
        '.xlsx',
        '.xls'
    ];
    return validTypes.includes(file.type) || validExtensions.some((ext)=>file.name.toLowerCase().endsWith(ext));
};
function ExcelFileDropzone({ value, onChange, uploadToServer = false, sessionId, onSessionChange, maxSize = 10 * 1024 * 1024, className, disabled = false }) {
    _s();
    const [isUploading, setIsUploading] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    const [currentSessionId, setCurrentSessionId] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](sessionId || '');
    // Update session ID when prop changes
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "ExcelFileDropzone.useEffect": ()=>{
            if (sessionId) {
                setCurrentSessionId(sessionId);
            }
        }
    }["ExcelFileDropzone.useEffect"], [
        sessionId
    ]);
    const handleUploadToServer = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "ExcelFileDropzone.useCallback[handleUploadToServer]": async (file)=>{
            if (!uploadToServer) return null;
            try {
                setIsUploading(true);
                const result = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$file$2d$upload$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FileUploadAPI"].uploadToStaging([
                    file
                ], currentSessionId || undefined);
                if (result.sessionId && result.sessionId !== currentSessionId) {
                    setCurrentSessionId(result.sessionId);
                    onSessionChange?.(result.sessionId);
                }
                return result.files[0] || null;
            } catch (error) {
                console.error('Upload error:', error);
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Không thể upload file lên server');
                return null;
            } finally{
                setIsUploading(false);
            }
        }
    }["ExcelFileDropzone.useCallback[handleUploadToServer]"], [
        uploadToServer,
        currentSessionId,
        onSessionChange
    ]);
    const onDrop = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "ExcelFileDropzone.useCallback[onDrop]": async (acceptedFiles, rejectedFiles)=>{
            // Handle rejected files
            if (rejectedFiles.length > 0) {
                rejectedFiles.forEach({
                    "ExcelFileDropzone.useCallback[onDrop]": (rejection)=>{
                        const { file, errors } = rejection;
                        errors.forEach({
                            "ExcelFileDropzone.useCallback[onDrop]": (error)=>{
                                switch(error.code){
                                    case 'file-too-large':
                                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`File "${file.name}" quá lớn`, {
                                            description: `Kích thước tối đa: ${formatFileSize(maxSize)}`
                                        });
                                        break;
                                    case 'file-invalid-type':
                                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`File "${file.name}" không đúng định dạng`, {
                                            description: 'Chỉ chấp nhận file Excel (.xlsx, .xls)'
                                        });
                                        break;
                                    default:
                                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Lỗi: ${error.message}`);
                                }
                            }
                        }["ExcelFileDropzone.useCallback[onDrop]"]);
                    }
                }["ExcelFileDropzone.useCallback[onDrop]"]);
                return;
            }
            // Handle accepted file (only take first one)
            const file = acceptedFiles[0];
            if (!file) return;
            // Validate Excel
            if (!isExcelFile(file)) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Vui lòng chọn file Excel (.xlsx hoặc .xls)');
                return;
            }
            // Create initial state
            const newExcelFile = {
                file,
                status: uploadToServer ? 'uploading' : 'selected'
            };
            onChange(newExcelFile);
            // Upload to server if required
            if (uploadToServer) {
                const serverFile = await handleUploadToServer(file);
                if (serverFile) {
                    onChange({
                        file,
                        serverFile,
                        status: 'uploaded'
                    });
                } else {
                    onChange({
                        file,
                        status: 'error',
                        errorMessage: 'Không thể upload file'
                    });
                }
            }
        }
    }["ExcelFileDropzone.useCallback[onDrop]"], [
        maxSize,
        uploadToServer,
        onChange,
        handleUploadToServer
    ]);
    const handleRemove = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "ExcelFileDropzone.useCallback[handleRemove]": ()=>{
            onChange(null);
        }
    }["ExcelFileDropzone.useCallback[handleRemove]"], [
        onChange
    ]);
    const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$dropzone$2f$dist$2f$es$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useDropzone"])({
        onDrop,
        accept: {
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
                '.xlsx'
            ],
            'application/vnd.ms-excel': [
                '.xls'
            ]
        },
        maxSize,
        maxFiles: 1,
        disabled: disabled || isUploading,
        multiple: false
    });
    // ============================================
    // RENDER
    // ============================================
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('space-y-3', className),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            ...getRootProps(),
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('relative rounded-lg border-2 border-dashed p-8 text-center cursor-pointer', 'transition-all duration-200 ease-in-out', 'hover:border-primary/50 hover:bg-primary/5', isDragActive && 'border-primary bg-primary/10', isDragAccept && 'border-green-500 bg-green-50', isDragReject && 'border-red-500 bg-red-50', (disabled || isUploading) && 'opacity-50 cursor-not-allowed pointer-events-none', value && 'border-solid border-primary/30 bg-primary/5'),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    ...getInputProps()
                }, void 0, false, {
                    fileName: "[project]/components/shared/excel-file-dropzone.tsx",
                    lineNumber: 222,
                    columnNumber: 9
                }, this),
                isUploading ? // Uploading state
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col items-center gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                            className: "h-10 w-10 text-primary animate-spin"
                        }, void 0, false, {
                            fileName: "[project]/components/shared/excel-file-dropzone.tsx",
                            lineNumber: 227,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm font-medium",
                                    children: "Đang tải lên..."
                                }, void 0, false, {
                                    fileName: "[project]/components/shared/excel-file-dropzone.tsx",
                                    lineNumber: 229,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-muted-foreground",
                                    children: "Vui lòng đợi"
                                }, void 0, false, {
                                    fileName: "[project]/components/shared/excel-file-dropzone.tsx",
                                    lineNumber: 230,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/shared/excel-file-dropzone.tsx",
                            lineNumber: 228,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/shared/excel-file-dropzone.tsx",
                    lineNumber: 226,
                    columnNumber: 11
                }, this) : value ? // File selected state
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col items-center gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__["FileSpreadsheet"], {
                                    className: "h-12 w-12 text-green-600"
                                }, void 0, false, {
                                    fileName: "[project]/components/shared/excel-file-dropzone.tsx",
                                    lineNumber: 237,
                                    columnNumber: 15
                                }, this),
                                value.status === 'uploaded' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                    className: "absolute -bottom-1 -right-1 h-5 w-5 text-green-600 bg-white rounded-full"
                                }, void 0, false, {
                                    fileName: "[project]/components/shared/excel-file-dropzone.tsx",
                                    lineNumber: 239,
                                    columnNumber: 17
                                }, this),
                                value.status === 'error' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                    className: "absolute -bottom-1 -right-1 h-5 w-5 text-red-500 bg-white rounded-full"
                                }, void 0, false, {
                                    fileName: "[project]/components/shared/excel-file-dropzone.tsx",
                                    lineNumber: 242,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/shared/excel-file-dropzone.tsx",
                            lineNumber: 236,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm font-medium truncate max-w-[250px]",
                                    children: value.file.name
                                }, void 0, false, {
                                    fileName: "[project]/components/shared/excel-file-dropzone.tsx",
                                    lineNumber: 246,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-muted-foreground",
                                    children: [
                                        formatFileSize(value.file.size),
                                        value.status === 'uploaded' && ' • Đã tải lên server',
                                        value.status === 'error' && ` • ${value.errorMessage || 'Lỗi'}`
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/shared/excel-file-dropzone.tsx",
                                    lineNumber: 247,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/shared/excel-file-dropzone.tsx",
                            lineNumber: 245,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            type: "button",
                            variant: "ghost",
                            size: "sm",
                            onClick: (e)=>{
                                e.stopPropagation();
                                handleRemove();
                            },
                            className: "text-muted-foreground hover:text-destructive",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    className: "h-4 w-4 mr-1"
                                }, void 0, false, {
                                    fileName: "[project]/components/shared/excel-file-dropzone.tsx",
                                    lineNumber: 263,
                                    columnNumber: 15
                                }, this),
                                "Xóa và chọn file khác"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/shared/excel-file-dropzone.tsx",
                            lineNumber: 253,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/shared/excel-file-dropzone.tsx",
                    lineNumber: 235,
                    columnNumber: 11
                }, this) : // Empty state
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col items-center gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('p-4 rounded-full', isDragActive ? 'bg-primary/20' : 'bg-muted'),
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('h-8 w-8', isDragActive ? 'text-primary' : 'text-muted-foreground')
                            }, void 0, false, {
                                fileName: "[project]/components/shared/excel-file-dropzone.tsx",
                                lineNumber: 274,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/shared/excel-file-dropzone.tsx",
                            lineNumber: 270,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm font-medium",
                                    children: isDragActive ? 'Thả file vào đây' : 'Kéo thả file Excel vào đây'
                                }, void 0, false, {
                                    fileName: "[project]/components/shared/excel-file-dropzone.tsx",
                                    lineNumber: 280,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-muted-foreground",
                                    children: [
                                        "hoặc click để chọn file • Tối đa ",
                                        formatFileSize(maxSize)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/shared/excel-file-dropzone.tsx",
                                    lineNumber: 283,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/shared/excel-file-dropzone.tsx",
                            lineNumber: 279,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2 text-xs text-muted-foreground",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__["FileSpreadsheet"], {
                                    className: "h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/components/shared/excel-file-dropzone.tsx",
                                    lineNumber: 288,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "Chấp nhận .xlsx, .xls"
                                }, void 0, false, {
                                    fileName: "[project]/components/shared/excel-file-dropzone.tsx",
                                    lineNumber: 289,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/shared/excel-file-dropzone.tsx",
                            lineNumber: 287,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/shared/excel-file-dropzone.tsx",
                    lineNumber: 269,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/shared/excel-file-dropzone.tsx",
            lineNumber: 209,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/shared/excel-file-dropzone.tsx",
        lineNumber: 207,
        columnNumber: 5
    }, this);
}
_s(ExcelFileDropzone, "IFPNtFyxTVv9ihU8h+m2tagSQeM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$dropzone$2f$dist$2f$es$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useDropzone"]
    ];
});
_c = ExcelFileDropzone;
var _c;
__turbopack_context__.k.register(_c, "ExcelFileDropzone");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/shared/generic-import-dialog-v2.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GenericImportDialogV2",
    ()=>GenericImportDialogV2
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * GenericImportDialog V2
 * 
 * Enhanced import dialog with:
 * - Preview step with data table
 * - Upsert mode (insert/update/upsert)
 * - Stop on error option
 * - Import history logging
 * - Better field configuration support
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/upload.js [app-client] (ecmascript) <export default as Upload>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.js [app-client] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-client] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-client] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-x.js [app-client] (ecmascript) <export default as XCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-client] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevrons$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronsLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevrons-left.js [app-client] (ecmascript) <export default as ChevronsLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevrons$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronsRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevrons-right.js [app-client] (ecmascript) <export default as ChevronsRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings-2.js [app-client] (ecmascript) <export default as Settings2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-client] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pencil.js [app-client] (ecmascript) <export default as Pencil>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/label.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/textarea.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/select.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$progress$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/progress.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$scroll$2d$area$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/scroll-area.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/alert.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/checkbox.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$radio$2d$group$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/radio-group.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/table.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/tabs.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/popover.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/tooltip.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/xlsx/xlsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$export$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/import-export/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$export$2f$import$2d$export$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/import-export/import-export-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$export$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/import-export/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$excel$2d$file$2d$dropzone$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/shared/excel-file-dropzone.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/branches/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pricing$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pricing/store.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
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
const EditableCell = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"](_s(function EditableCell({ cellValue, fieldKey, fieldLabel, fieldRequired, onSave }) {
    _s();
    const [isOpen, setIsOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    const [editValue, setEditValue] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](cellValue);
    const [error, setError] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]('');
    // Reset value when opening
    const handleOpenChange = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "EditableCell.EditableCell.useCallback[handleOpenChange]": (open)=>{
            if (open) {
                setEditValue(cellValue);
                setError('');
            }
            setIsOpen(open);
        }
    }["EditableCell.EditableCell.useCallback[handleOpenChange]"], [
        cellValue
    ]);
    const handleSave = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "EditableCell.EditableCell.useCallback[handleSave]": ()=>{
            // Basic validation
            if (fieldRequired && !editValue.trim()) {
                setError(`${fieldLabel} là bắt buộc`);
                return;
            }
            onSave(fieldKey, editValue);
            setIsOpen(false);
        }
    }["EditableCell.EditableCell.useCallback[handleSave]"], [
        editValue,
        fieldKey,
        fieldLabel,
        fieldRequired,
        onSave
    ]);
    const handleKeyDown = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "EditableCell.EditableCell.useCallback[handleKeyDown]": (e)=>{
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSave();
            } else if (e.key === 'Escape') {
                setIsOpen(false);
            }
        }
    }["EditableCell.EditableCell.useCallback[handleKeyDown]"], [
        handleSave
    ]);
    const isLongText = editValue.length > 50 || editValue.includes('\n');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Popover"], {
        open: isOpen,
        onOpenChange: handleOpenChange,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PopoverTrigger"], {
                asChild: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    className: "w-full h-full px-4 py-2 text-left relative flex items-center gap-2 group transition-colors cursor-pointer hover:bg-muted/50",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "block truncate flex-1",
                            children: cellValue || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-muted-foreground italic",
                                children: "—"
                            }, void 0, false, {
                                fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                lineNumber: 157,
                                columnNumber: 27
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                            lineNumber: 156,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__["Pencil"], {
                            className: "h-3 w-3 flex-shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                        }, void 0, false, {
                            fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                            lineNumber: 159,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                    lineNumber: 152,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                lineNumber: 151,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PopoverContent"], {
                className: "w-[300px] p-3",
                align: "start",
                sideOffset: 4,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-1.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                    className: "text-xs font-medium text-muted-foreground",
                                    children: [
                                        fieldLabel,
                                        " ",
                                        fieldRequired && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-destructive",
                                            children: "*"
                                        }, void 0, false, {
                                            fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                            lineNumber: 170,
                                            columnNumber: 46
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                    lineNumber: 169,
                                    columnNumber: 13
                                }, this),
                                isLongText ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Textarea"], {
                                    autoFocus: true,
                                    value: editValue,
                                    onChange: (e)=>{
                                        setEditValue(e.target.value);
                                        setError('');
                                    },
                                    onKeyDown: (e)=>{
                                        if (e.key === 'Enter' && e.ctrlKey) {
                                            e.preventDefault();
                                            handleSave();
                                        } else if (e.key === 'Escape') {
                                            setIsOpen(false);
                                        }
                                    },
                                    placeholder: `Nhập ${fieldLabel.toLowerCase()}...`,
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("min-h-[80px] resize-y", error && "border-destructive"),
                                    rows: 3
                                }, void 0, false, {
                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                    lineNumber: 173,
                                    columnNumber: 15
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                    autoFocus: true,
                                    value: editValue,
                                    onChange: (e)=>{
                                        setEditValue(e.target.value);
                                        setError('');
                                    },
                                    onKeyDown: handleKeyDown,
                                    placeholder: `Nhập ${fieldLabel.toLowerCase()}...`,
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-9", error && "border-destructive")
                                }, void 0, false, {
                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                    lineNumber: 193,
                                    columnNumber: 15
                                }, this),
                                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-destructive",
                                    children: error
                                }, void 0, false, {
                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                    lineNumber: 206,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                            lineNumber: 168,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-end gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    type: "button",
                                    variant: "ghost",
                                    size: "sm",
                                    onClick: ()=>setIsOpen(false),
                                    className: "h-8 px-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                            className: "h-4 w-4 mr-1"
                                        }, void 0, false, {
                                            fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                            lineNumber: 217,
                                            columnNumber: 15
                                        }, this),
                                        "Hủy"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                    lineNumber: 210,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    type: "button",
                                    size: "sm",
                                    onClick: handleSave,
                                    className: "h-8 px-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                            className: "h-4 w-4 mr-1"
                                        }, void 0, false, {
                                            fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                            lineNumber: 226,
                                            columnNumber: 15
                                        }, this),
                                        "Lưu"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                    lineNumber: 220,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                            lineNumber: 209,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                    lineNumber: 167,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                lineNumber: 162,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
        lineNumber: 150,
        columnNumber: 5
    }, this);
}, "/905z5Qom6vX0+UhwkvQvM2GtRo="));
_c = EditableCell;
function PreviewTableRowComponent({ row, isSelected, isUnselectable, visibleFields, onToggleSelection, onCellSave, getStatusBadge }) {
    const isErrorRow = row.status === 'error';
    const isDuplicateRow = row.status === 'duplicate';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableRow"], {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(!isSelected && !isUnselectable && "opacity-50", isErrorRow && "bg-destructive/5", isDuplicateRow && "bg-muted/50"),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                className: "sticky left-0 bg-card z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Checkbox"], {
                    checked: isSelected,
                    onCheckedChange: ()=>onToggleSelection(row.rowNumber),
                    disabled: isUnselectable,
                    "aria-label": `Chọn dòng ${row.rowNumber}`
                }, void 0, false, {
                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                    lineNumber: 271,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                lineNumber: 270,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                className: "font-medium sticky left-10 bg-card z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]",
                children: row.rowNumber
            }, void 0, false, {
                fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                lineNumber: 278,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                className: "sticky left-24 bg-card z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]",
                children: getStatusBadge(row.status, row.errors, row.warnings)
            }, void 0, false, {
                fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                lineNumber: 281,
                columnNumber: 7
            }, this),
            visibleFields.map((field)=>{
                const fieldKey = field.key;
                const cellValue = String(row.rawData[fieldKey] ?? row.rawData[field.label] ?? '');
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                    className: "whitespace-nowrap p-0 max-w-[200px]",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EditableCell, {
                        cellValue: cellValue,
                        fieldKey: fieldKey,
                        fieldLabel: field.label,
                        fieldRequired: field.required,
                        onSave: (fk, newVal)=>onCellSave(row.rowNumber, fk, newVal)
                    }, void 0, false, {
                        fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                        lineNumber: 293,
                        columnNumber: 13
                    }, this)
                }, fieldKey, false, {
                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                    lineNumber: 289,
                    columnNumber: 11
                }, this);
            })
        ]
    }, void 0, true, {
        fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
        lineNumber: 263,
        columnNumber: 5
    }, this);
}
_c1 = PreviewTableRowComponent;
// Memoize the row component to prevent unnecessary re-renders
const PreviewTableRow = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"](PreviewTableRowComponent);
_c2 = PreviewTableRow;
function GenericImportDialogV2({ open, onOpenChange, config, branches: branchesProp, requireBranch = false, defaultBranchId, existingData = [], onImport, currentUser }) {
    _s1();
    // Store
    const addImportLog = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$export$2f$import$2d$export$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useImportExportStore"])({
        "GenericImportDialogV2.useImportExportStore[addImportLog]": (state)=>state.addImportLog
    }["GenericImportDialogV2.useImportExportStore[addImportLog]"]);
    // Auto-fetch branches if not provided
    const { data: storeBranches } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBranchStore"])();
    const branches = branchesProp || storeBranches.map((b)=>({
            systemId: b.systemId,
            name: b.name,
            isDefault: b.isDefault
        }));
    // Get default branch from settings (isDefault = true) or fallback to prop
    const defaultBranch = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "GenericImportDialogV2.useMemo[defaultBranch]": ()=>{
            if (defaultBranchId) return defaultBranchId;
            const defaultFromSettings = storeBranches.find({
                "GenericImportDialogV2.useMemo[defaultBranch].defaultFromSettings": (b)=>b.isDefault === true
            }["GenericImportDialogV2.useMemo[defaultBranch].defaultFromSettings"]);
            return defaultFromSettings?.systemId || '';
        }
    }["GenericImportDialogV2.useMemo[defaultBranch]"], [
        defaultBranchId,
        storeBranches
    ]);
    // State
    const [step, setStep] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]('upload');
    const [selectedBranchId, setSelectedBranchId] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](defaultBranch);
    const [branchError, setBranchError] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]('');
    const [excelFile, setExcelFile] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](null);
    const [importMode, setImportMode] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]('upsert');
    // Preview state
    const [previewResult, setPreviewResult] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](null);
    const [previewTab, setPreviewTab] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]('all');
    const [previewPage, setPreviewPage] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](0);
    const [previewPageSize, setPreviewPageSize] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](20);
    // Row selection state (for preview step)
    const [selectedRows, setSelectedRows] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](new Set());
    // Import state
    const [_isImporting, setIsImporting] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    const [importProgress, setImportProgress] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](0);
    const [importResult, setImportResult] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](null);
    // Auto-fill chi nhánh mặc định khi mở dialog hoặc khi store load xong
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "GenericImportDialogV2.useEffect": ()=>{
            if (open && !selectedBranchId && defaultBranch) {
                setSelectedBranchId(defaultBranch);
            }
        }
    }["GenericImportDialogV2.useEffect"], [
        open,
        defaultBranch,
        selectedBranchId
    ]);
    // Reset when dialog closes
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "GenericImportDialogV2.useEffect": ()=>{
            if (!open) {
                setTimeout({
                    "GenericImportDialogV2.useEffect": ()=>{
                        setStep('upload');
                        setSelectedBranchId(defaultBranch);
                        setBranchError('');
                        setExcelFile(null);
                        setImportMode('upsert');
                        setPreviewResult(null);
                        setPreviewTab('all');
                        setPreviewPage(0);
                        setPreviewPageSize(20);
                        setSelectedRows(new Set());
                        setIsImporting(false);
                        setImportProgress(0);
                        setImportResult(null);
                    }
                }["GenericImportDialogV2.useEffect"], 200);
            }
        }
    }["GenericImportDialogV2.useEffect"], [
        open,
        defaultBranch,
        defaultBranchId
    ]);
    // Initialize selected rows when preview result changes (select all valid rows by default)
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "GenericImportDialogV2.useEffect": ()=>{
            if (previewResult) {
                const validRowNumbers = new Set(previewResult.rows.filter({
                    "GenericImportDialogV2.useEffect": (r)=>r.status === 'valid' || r.status === 'warning' || r.status === 'will-update' || r.status === 'will-insert'
                }["GenericImportDialogV2.useEffect"]).map({
                    "GenericImportDialogV2.useEffect": (r)=>r.rowNumber
                }["GenericImportDialogV2.useEffect"]));
                setSelectedRows(validRowNumbers);
            }
        }
    }["GenericImportDialogV2.useEffect"], [
        previewResult
    ]);
    // Re-validate when import mode changes (need to recalculate statuses)
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "GenericImportDialogV2.useEffect": ()=>{
            if (previewResult && step === 'preview') {
                // Get raw data from current preview result
                const rawData = previewResult.rows.map({
                    "GenericImportDialogV2.useEffect.rawData": (r)=>r.rawData
                }["GenericImportDialogV2.useEffect.rawData"]);
                // Re-run validation with new mode
                const revalidatedResult = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$export$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["previewImportData"])(rawData, config, existingData, importMode, selectedBranchId);
                setPreviewResult(revalidatedResult);
            }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["GenericImportDialogV2.useEffect"], [
        importMode
    ]); // Only re-run when mode changes
    // Get visible fields for preview table - show ALL non-hidden fields
    const visibleFields = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "GenericImportDialogV2.useMemo[visibleFields]": ()=>{
            return config.fields.filter({
                "GenericImportDialogV2.useMemo[visibleFields]": (f)=>!f.hidden
            }["GenericImportDialogV2.useMemo[visibleFields]"]);
        }
    }["GenericImportDialogV2.useMemo[visibleFields]"], [
        config.fields
    ]);
    // Filtered preview rows based on current tab
    const filteredPreviewRows = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "GenericImportDialogV2.useMemo[filteredPreviewRows]": ()=>{
            if (!previewResult) return [];
            switch(previewTab){
                case 'valid':
                    return previewResult.rows.filter({
                        "GenericImportDialogV2.useMemo[filteredPreviewRows]": (r)=>r.status === 'valid' || r.status === 'will-insert' || r.status === 'will-update'
                    }["GenericImportDialogV2.useMemo[filteredPreviewRows]"]);
                case 'error':
                    return previewResult.rows.filter({
                        "GenericImportDialogV2.useMemo[filteredPreviewRows]": (r)=>r.status === 'error'
                    }["GenericImportDialogV2.useMemo[filteredPreviewRows]"]);
                case 'warning':
                    return previewResult.rows.filter({
                        "GenericImportDialogV2.useMemo[filteredPreviewRows]": (r)=>r.status === 'warning' || r.status === 'duplicate'
                    }["GenericImportDialogV2.useMemo[filteredPreviewRows]"]);
                default:
                    return previewResult.rows;
            }
        }
    }["GenericImportDialogV2.useMemo[filteredPreviewRows]"], [
        previewResult,
        previewTab
    ]);
    // ============================================
    // ROW SELECTION & INLINE EDIT HANDLERS
    // ============================================
    // Toggle single row selection - memoized to prevent unnecessary re-renders
    const handleToggleRowSelection = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "GenericImportDialogV2.useCallback[handleToggleRowSelection]": (rowNumber)=>{
            setSelectedRows({
                "GenericImportDialogV2.useCallback[handleToggleRowSelection]": (prev)=>{
                    const next = new Set(prev);
                    if (next.has(rowNumber)) {
                        next.delete(rowNumber);
                    } else {
                        next.add(rowNumber);
                    }
                    return next;
                }
            }["GenericImportDialogV2.useCallback[handleToggleRowSelection]"]);
        }
    }["GenericImportDialogV2.useCallback[handleToggleRowSelection]"], []);
    // Toggle all rows in current filtered view
    const handleToggleAllRows = (checked)=>{
        if (!previewResult) return;
        const currentFilteredRowNumbers = filteredPreviewRows.map((r)=>r.rowNumber);
        setSelectedRows((prev)=>{
            const next = new Set(prev);
            if (checked) {
                // Add all filtered rows that are not error status
                currentFilteredRowNumbers.forEach((rowNum)=>{
                    const row = previewResult.rows.find((r)=>r.rowNumber === rowNum);
                    if (row && row.status !== 'error') {
                        next.add(rowNum);
                    }
                });
            } else {
                // Remove all filtered rows
                currentFilteredRowNumbers.forEach((rowNum)=>next.delete(rowNum));
            }
            return next;
        });
    };
    // Check if all filtered rows are selected
    const isAllFilteredSelected = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "GenericImportDialogV2.useMemo[isAllFilteredSelected]": ()=>{
            if (!previewResult || filteredPreviewRows.length === 0) return false;
            const selectableRows = filteredPreviewRows.filter({
                "GenericImportDialogV2.useMemo[isAllFilteredSelected].selectableRows": (r)=>r.status !== 'error'
            }["GenericImportDialogV2.useMemo[isAllFilteredSelected].selectableRows"]);
            if (selectableRows.length === 0) return false;
            return selectableRows.every({
                "GenericImportDialogV2.useMemo[isAllFilteredSelected]": (r)=>selectedRows.has(r.rowNumber)
            }["GenericImportDialogV2.useMemo[isAllFilteredSelected]"]);
        }
    }["GenericImportDialogV2.useMemo[isAllFilteredSelected]"], [
        previewResult,
        filteredPreviewRows,
        selectedRows
    ]);
    // Handle cell save from EditableCell component
    // Use useCallback to prevent unnecessary re-renders
    const handleCellSave = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "GenericImportDialogV2.useCallback[handleCellSave]": (rowNumber, fieldKey, newValue)=>{
            if (!previewResult) return;
            // Update the raw data
            const updatedRawData = previewResult.rows.map({
                "GenericImportDialogV2.useCallback[handleCellSave].updatedRawData": (row)=>{
                    if (row.rowNumber === rowNumber) {
                        return {
                            ...row.rawData,
                            [fieldKey]: newValue
                        };
                    }
                    return row.rawData;
                }
            }["GenericImportDialogV2.useCallback[handleCellSave].updatedRawData"]);
            // Use startTransition to keep UI responsive during revalidation
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["startTransition"]({
                "GenericImportDialogV2.useCallback[handleCellSave]": ()=>{
                    // Re-run full validation to update row statuses
                    const revalidatedResult = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$export$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["previewImportData"])(updatedRawData, config, existingData, importMode, selectedBranchId);
                    setPreviewResult(revalidatedResult);
                    // Update selected rows - keep previously selected rows that are still valid
                    setSelectedRows({
                        "GenericImportDialogV2.useCallback[handleCellSave]": (prev)=>{
                            const newSelected = new Set();
                            revalidatedResult.rows.forEach({
                                "GenericImportDialogV2.useCallback[handleCellSave]": (row)=>{
                                    // Keep selected if was selected and still valid (not error/duplicate)
                                    if (prev.has(row.rowNumber) && row.status !== 'error' && row.status !== 'duplicate') {
                                        newSelected.add(row.rowNumber);
                                    }
                                }
                            }["GenericImportDialogV2.useCallback[handleCellSave]"]);
                            // Auto-select the edited row if it's now valid (not error/duplicate)
                            const editedRow = revalidatedResult.rows.find({
                                "GenericImportDialogV2.useCallback[handleCellSave].editedRow": (r)=>r.rowNumber === rowNumber
                            }["GenericImportDialogV2.useCallback[handleCellSave].editedRow"]);
                            if (editedRow && editedRow.status !== 'error' && editedRow.status !== 'duplicate') {
                                newSelected.add(editedRow.rowNumber);
                            }
                            return newSelected;
                        }
                    }["GenericImportDialogV2.useCallback[handleCellSave]"]);
                    // Show appropriate message
                    const editedRow = revalidatedResult.rows.find({
                        "GenericImportDialogV2.useCallback[handleCellSave].editedRow": (r)=>r.rowNumber === rowNumber
                    }["GenericImportDialogV2.useCallback[handleCellSave].editedRow"]);
                    if (editedRow?.status === 'error') {
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].info('Đã cập nhật. Dòng vẫn có lỗi khác.');
                    } else if (editedRow?.status === 'duplicate') {
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].info('Đã cập nhật. Dòng vẫn bị trùng.');
                    } else {
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Đã cập nhật thành công');
                    }
                }
            }["GenericImportDialogV2.useCallback[handleCellSave]"]);
        }
    }["GenericImportDialogV2.useCallback[handleCellSave]"], [
        previewResult,
        config,
        existingData,
        importMode,
        selectedBranchId
    ]);
    // ============================================
    // HANDLERS
    // ============================================
    const handleDownloadTemplate = ()=>{
        try {
            // Create template with headers only
            const headers = {};
            const visibleFields = config.fields.filter((field)=>!field.hidden);
            visibleFields.forEach((field)=>{
                headers[field.key] = field.label;
            });
            // ===== DYNAMIC PRICING COLUMNS (chỉ cho products) =====
            const pricingColumns = [];
            if (config.entityType === 'products') {
                const pricingPolicies = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pricing$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePricingPolicyStore"].getState().data.filter((p)=>p.isActive);
                pricingPolicies.forEach((policy)=>{
                    const key = `price_${policy.systemId}`;
                    const label = `Giá: ${policy.name}`;
                    headers[key] = label;
                    pricingColumns.push({
                        key,
                        label,
                        example: policy.type === 'Bán hàng' ? '250000' : '150000'
                    });
                });
            }
            // Sample row: Example values (dữ liệu mẫu từ field.example)
            // Note: Required fields are marked with (*) in the label
            const exampleRow = {};
            visibleFields.forEach((field)=>{
                if (field.example) {
                    exampleRow[field.key] = field.example;
                } else if (field.defaultValue !== undefined) {
                    // Fallback to defaultValue or enumLabels
                    if (field.enumLabels && field.defaultValue) {
                        exampleRow[field.key] = field.enumLabels[field.defaultValue] || field.defaultValue;
                    } else {
                        exampleRow[field.key] = field.defaultValue;
                    }
                } else {
                    exampleRow[field.key] = '';
                }
            });
            // Add pricing columns examples
            pricingColumns.forEach((col)=>{
                exampleRow[col.key] = col.example;
            });
            // Combine all column keys
            const allColumnKeys = [
                ...Object.keys(headers).filter((k)=>!k.startsWith('price_')),
                ...pricingColumns.map((c)=>c.key)
            ];
            // Tạo worksheet với 1 dòng mẫu (không cần dòng hướng dẫn Bắt buộc/Tùy chọn)
            const ws = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils"].json_to_sheet([
                exampleRow
            ], {
                header: allColumnKeys
            });
            // Rename headers to Vietnamese
            const range = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils"].decode_range(ws['!ref']);
            for(let C = range.s.c; C <= range.e.c; ++C){
                const address = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils"].encode_col(C) + "1";
                if (ws[address]) {
                    const fieldKey = ws[address].v;
                    ws[address].v = headers[fieldKey] || fieldKey;
                }
            }
            const wb = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils"].book_new();
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils"].book_append_sheet(wb, ws, 'Data');
            // Auto-size columns based on header length and example values
            const allFields = [
                ...visibleFields,
                ...pricingColumns.map((c)=>({
                        label: c.label,
                        example: c.example
                    }))
            ];
            const colWidths = allFields.map((field)=>{
                const headerLen = field.label.length;
                const exampleLen = String(field.example || '').length;
                return {
                    wch: Math.min(40, Math.max(12, headerLen + 3, exampleLen + 2))
                };
            });
            ws['!cols'] = colWidths;
            const fileName = config.templateFileName || `Mau_Nhap_${config.entityDisplayName}.xlsx`;
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["writeFile"](wb, fileName);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Đã tải file mẫu');
        } catch (error) {
            console.error('Error generating template:', error);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Có lỗi khi tạo file mẫu');
        }
    };
    const handleParseAndPreview = async ()=>{
        if (!excelFile) return;
        if (requireBranch && !selectedBranchId) {
            setBranchError('Vui lòng chọn chi nhánh');
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Vui lòng chọn chi nhánh');
            return;
        }
        setBranchError('');
        try {
            const data = await excelFile.file.arrayBuffer();
            const workbook = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["read"](data);
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils"].sheet_to_json(worksheet, {
                defval: ''
            });
            if (jsonData.length === 0) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('File không có dữ liệu');
                return;
            }
            // Create header map (Vietnamese → field key)
            // Support both with and without (*) marker
            const headerMap = {};
            config.fields.forEach((field)=>{
                if (!field.hidden) {
                    const label = field.label.toLowerCase();
                    const labelWithoutStar = label.replace(/\s*\(\*\)\s*$/, '');
                    headerMap[label] = field.key;
                    headerMap[labelWithoutStar] = field.key;
                }
            });
            // Map data - normalize Excel headers by stripping (*) and lowercasing
            const mappedData = jsonData.map((row)=>{
                const mappedRow = {};
                Object.entries(row).forEach(([vnKey, value])=>{
                    const normalizedKey = vnKey.toLowerCase().replace(/\s*\(\*\)\s*$/, '');
                    const fieldKey = headerMap[normalizedKey] || headerMap[vnKey.toLowerCase()] || vnKey;
                    mappedRow[fieldKey] = value;
                });
                return mappedRow;
            });
            // Preview with validation
            const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$export$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["previewImportData"])(mappedData, config, existingData, importMode, selectedBranchId);
            setPreviewResult(result);
            setPreviewPage(0);
            setStep('preview');
        } catch (error) {
            console.error('Error parsing file:', error);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Không thể đọc file. Vui lòng kiểm tra định dạng file.');
        }
    };
    const handleImport = async ()=>{
        if (!previewResult) return;
        // Note: Errors will be skipped, details saved to import history
        setStep('import');
        setIsImporting(true);
        setImportProgress(0);
        try {
            // Get selected valid rows only (must be selected AND have valid status)
            const validRows = previewResult.rows.filter((r)=>selectedRows.has(r.rowNumber) && // Must be selected
                (r.status === 'valid' || r.status === 'warning' || r.status === 'will-update' || r.status === 'will-insert')).map((r)=>r.transformedData).filter((d)=>d !== null);
            if (validRows.length === 0) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Không có dữ liệu được chọn để nhập');
                setStep('preview');
                setIsImporting(false);
                return;
            }
            // Simulate progress
            const progressInterval = setInterval(()=>{
                setImportProgress((prev)=>Math.min(prev + 5, 90));
            }, 100);
            // Import
            const result = await onImport(validRows, importMode, selectedBranchId || undefined);
            clearInterval(progressInterval);
            setImportProgress(100);
            setImportResult(result);
            setIsImporting(false);
            // Log to store
            const branch = branches?.find((b)=>b.systemId === selectedBranchId);
            addImportLog({
                entityType: config.entityType,
                entityDisplayName: config.entityDisplayName,
                fileName: excelFile?.file.name || 'unknown',
                fileSize: excelFile?.file.size || 0,
                totalRows: validRows.length,
                successCount: result.success,
                errorCount: result.failed,
                skippedCount: result.skipped,
                insertedCount: result.inserted,
                updatedCount: result.updated,
                mode: importMode,
                performedBy: currentUser?.name || 'System',
                performedById: currentUser?.systemId || '',
                performedAt: new Date().toISOString(),
                branchId: selectedBranchId || undefined,
                branchName: branch?.name,
                errors: result.errors.slice(0, 50).map((e)=>({
                        row: e.row,
                        message: e.message
                    })),
                status: result.failed === 0 ? 'success' : result.success > 0 ? 'partial' : 'failed'
            });
            setStep('result');
            if (result.failed === 0) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(`Đã nhập thành công ${result.success} ${config.entityDisplayName}`);
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].warning(`Đã nhập ${result.success} ${config.entityDisplayName}, ${result.failed} lỗi`);
            }
        } catch (error) {
            console.error('Import error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Có lỗi khi nhập dữ liệu';
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(errorMessage);
            setStep('preview');
            setIsImporting(false);
        }
    };
    // ============================================
    // PREVIEW DATA HELPERS
    // ============================================
    const paginatedPreviewRows = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "GenericImportDialogV2.useMemo[paginatedPreviewRows]": ()=>{
            const start = previewPage * previewPageSize;
            return filteredPreviewRows.slice(start, start + previewPageSize);
        }
    }["GenericImportDialogV2.useMemo[paginatedPreviewRows]"], [
        filteredPreviewRows,
        previewPage,
        previewPageSize
    ]);
    const previewPageCount = Math.ceil(filteredPreviewRows.length / previewPageSize);
    // Memoized getStatusBadge to prevent re-renders
    const getStatusBadge = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "GenericImportDialogV2.useCallback[getStatusBadge]": (status, errors, warnings)=>{
            const badge = ({
                "GenericImportDialogV2.useCallback[getStatusBadge].badge": ()=>{
                    switch(status){
                        case 'valid':
                        case 'will-insert':
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                variant: "default",
                                children: "Hợp lệ"
                            }, void 0, false, {
                                fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                lineNumber: 852,
                                columnNumber: 18
                            }, this);
                        case 'will-update':
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                variant: "secondary",
                                children: "Cập nhật"
                            }, void 0, false, {
                                fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                lineNumber: 854,
                                columnNumber: 18
                            }, this);
                        case 'error':
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                variant: "destructive",
                                children: "Lỗi"
                            }, void 0, false, {
                                fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                lineNumber: 856,
                                columnNumber: 18
                            }, this);
                        case 'warning':
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                variant: "outline",
                                children: "Cảnh báo"
                            }, void 0, false, {
                                fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                lineNumber: 858,
                                columnNumber: 18
                            }, this);
                        case 'duplicate':
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                variant: "outline",
                                children: "Trùng"
                            }, void 0, false, {
                                fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                lineNumber: 860,
                                columnNumber: 18
                            }, this);
                        default:
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                variant: "outline",
                                children: status
                            }, void 0, false, {
                                fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                lineNumber: 862,
                                columnNumber: 18
                            }, this);
                    }
                }
            })["GenericImportDialogV2.useCallback[getStatusBadge].badge"]();
            // Show tooltip with error/warning details
            const messages = [
                ...errors || [],
                ...warnings || []
            ];
            if (messages.length > 0) {
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TooltipProvider"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TooltipTrigger"], {
                                asChild: true,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "cursor-help",
                                    children: badge
                                }, void 0, false, {
                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                    lineNumber: 873,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                lineNumber: 872,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TooltipContent"], {
                                side: "right",
                                className: "max-w-xs",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    className: "text-xs space-y-1",
                                    children: messages.map({
                                        "GenericImportDialogV2.useCallback[getStatusBadge]": (m, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                className: "flex items-start gap-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-destructive",
                                                        children: "•"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                        lineNumber: 879,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: m.field ? `${m.field}: ${m.message}` : m.message
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                        lineNumber: 880,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, i, true, {
                                                fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                lineNumber: 878,
                                                columnNumber: 19
                                            }, this)
                                    }["GenericImportDialogV2.useCallback[getStatusBadge]"])
                                }, void 0, false, {
                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                    lineNumber: 876,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                lineNumber: 875,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                        lineNumber: 871,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                    lineNumber: 870,
                    columnNumber: 9
                }, this);
            }
            return badge;
        }
    }["GenericImportDialogV2.useCallback[getStatusBadge]"], []);
    // ============================================
    // RENDER
    // ============================================
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"], {
        open: open,
        onOpenChange: onOpenChange,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogContent"], {
            className: "max-w-6xl max-h-[90vh] overflow-hidden flex flex-col",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogHeader"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogTitle"], {
                            className: "flex items-center gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                                    className: "h-5 w-5"
                                }, void 0, false, {
                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                    lineNumber: 902,
                                    columnNumber: 13
                                }, this),
                                "Nhập ",
                                config.entityDisplayName,
                                " từ Excel"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                            lineNumber: 901,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogDescription"], {
                            children: [
                                step === 'upload' && 'Chọn file và cấu hình import',
                                step === 'preview' && 'Rà soát dữ liệu trước khi nhập',
                                step === 'import' && 'Đang nhập dữ liệu...',
                                step === 'result' && 'Kết quả nhập dữ liệu'
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                            lineNumber: 905,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                    lineNumber: 900,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-1 overflow-auto",
                    children: [
                        step === 'upload' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-4 p-1",
                            children: [
                                branches && branches.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                            htmlFor: "branch",
                                            children: [
                                                "Chọn chi nhánh ",
                                                requireBranch && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-destructive",
                                                    children: "*"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                    lineNumber: 921,
                                                    columnNumber: 54
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                            lineNumber: 920,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                                            value: selectedBranchId,
                                            onValueChange: (value)=>{
                                                setSelectedBranchId(value);
                                                setBranchError('');
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                                    id: "branch",
                                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(branchError && "border-destructive"),
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectValue"], {
                                                        placeholder: "-- Chọn chi nhánh --"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                        lineNumber: 931,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                    lineNumber: 930,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectContent"], {
                                                    children: branches.map((branch)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                            value: branch.systemId,
                                                            children: branch.name
                                                        }, branch.systemId, false, {
                                                            fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                            lineNumber: 935,
                                                            columnNumber: 25
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                    lineNumber: 933,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                            lineNumber: 923,
                                            columnNumber: 19
                                        }, this),
                                        branchError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-destructive",
                                            children: branchError
                                        }, void 0, false, {
                                            fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                            lineNumber: 942,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                    lineNumber: 919,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2 text-sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-muted-foreground",
                                            children: "Chưa có file mẫu?"
                                        }, void 0, false, {
                                            fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                            lineNumber: 949,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            variant: "link",
                                            size: "sm",
                                            onClick: handleDownloadTemplate,
                                            className: "h-auto p-0 text-primary",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                                    className: "mr-1 h-3 w-3"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                    lineNumber: 956,
                                                    columnNumber: 19
                                                }, this),
                                                "Tải file mẫu"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                            lineNumber: 950,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                    lineNumber: 948,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$excel$2d$file$2d$dropzone$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ExcelFileDropzone"], {
                                    value: excelFile,
                                    onChange: setExcelFile,
                                    uploadToServer: false
                                }, void 0, false, {
                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                    lineNumber: 962,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "rounded-lg border p-4 space-y-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings2$3e$__["Settings2"], {
                                                    className: "h-5 w-5"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                    lineNumber: 971,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "font-semibold",
                                                    children: "Tùy chọn Import"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                    lineNumber: 972,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                            lineNumber: 970,
                                            columnNumber: 17
                                        }, this),
                                        config.upsertKey && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                    children: "Chế độ Import"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                    lineNumber: 978,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$radio$2d$group$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RadioGroup"], {
                                                    value: importMode,
                                                    onValueChange: (v)=>setImportMode(v),
                                                    className: "flex gap-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center space-x-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$radio$2d$group$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RadioGroupItem"], {
                                                                    value: "insert-only",
                                                                    id: "insert-only"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                                    lineNumber: 985,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                                    htmlFor: "insert-only",
                                                                    className: "font-normal cursor-pointer",
                                                                    children: "Chỉ thêm mới"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                                    lineNumber: 986,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                            lineNumber: 984,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center space-x-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$radio$2d$group$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RadioGroupItem"], {
                                                                    value: "update-only",
                                                                    id: "update-only"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                                    lineNumber: 991,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                                    htmlFor: "update-only",
                                                                    className: "font-normal cursor-pointer",
                                                                    children: "Chỉ cập nhật"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                                    lineNumber: 992,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                            lineNumber: 990,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center space-x-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$radio$2d$group$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RadioGroupItem"], {
                                                                    value: "upsert",
                                                                    id: "upsert"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                                    lineNumber: 997,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                                    htmlFor: "upsert",
                                                                    className: "font-normal cursor-pointer",
                                                                    children: "Thêm mới + Cập nhật"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                                    lineNumber: 998,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                            lineNumber: 996,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                    lineNumber: 979,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-muted-foreground",
                                                    children: [
                                                        importMode === 'insert-only' && 'Bỏ qua các bản ghi đã tồn tại',
                                                        importMode === 'update-only' && 'Chỉ cập nhật bản ghi đã tồn tại, bỏ qua bản ghi mới',
                                                        importMode === 'upsert' && 'Cập nhật bản ghi đã tồn tại, thêm mới bản ghi chưa có'
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                    lineNumber: 1003,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                            lineNumber: 977,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-muted-foreground border-t pt-3",
                                            children: "💡 Các dòng lỗi sẽ bị bỏ qua, chỉ import dòng hợp lệ. Chi tiết lỗi được lưu trong lịch sử import."
                                        }, void 0, false, {
                                            fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                            lineNumber: 1012,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                    lineNumber: 969,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                            lineNumber: 916,
                            columnNumber: 13
                        }, this),
                        step === 'preview' && previewResult && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-4 p-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-4 gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "rounded-lg border p-3 text-center",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-2xl font-bold",
                                                    children: previewResult.totalRows
                                                }, void 0, false, {
                                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                    lineNumber: 1025,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-xs text-muted-foreground",
                                                    children: "Tổng dòng"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                    lineNumber: 1026,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                            lineNumber: 1024,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "rounded-lg border p-3 text-center",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-2xl font-bold text-green-600",
                                                    children: previewResult.validCount
                                                }, void 0, false, {
                                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                    lineNumber: 1029,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-xs text-muted-foreground",
                                                    children: "Hợp lệ"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                    lineNumber: 1030,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                            lineNumber: 1028,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "rounded-lg border p-3 text-center",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-2xl font-bold text-destructive",
                                                    children: previewResult.errorCount
                                                }, void 0, false, {
                                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                    lineNumber: 1033,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-xs text-muted-foreground",
                                                    children: "Lỗi"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                    lineNumber: 1034,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                            lineNumber: 1032,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "rounded-lg border p-3 text-center",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-2xl font-bold text-amber-600",
                                                    children: previewResult.warningCount
                                                }, void 0, false, {
                                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                    lineNumber: 1037,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-xs text-muted-foreground",
                                                    children: "Cảnh báo"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                    lineNumber: 1038,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                            lineNumber: 1036,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                    lineNumber: 1023,
                                    columnNumber: 15
                                }, this),
                                previewResult.errorCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Alert"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                            lineNumber: 1045,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertTitle"], {
                                            children: [
                                                "Có ",
                                                previewResult.errorCount,
                                                " dòng lỗi"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                            lineNumber: 1046,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDescription"], {
                                            children: [
                                                "Các dòng lỗi sẽ được bỏ qua khi import. Chỉ ",
                                                previewResult.validCount + previewResult.warningCount,
                                                " dòng hợp lệ sẽ được nhập. Chi tiết lỗi sẽ được lưu trong lịch sử."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                            lineNumber: 1047,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                    lineNumber: 1044,
                                    columnNumber: 17
                                }, this),
                                previewResult.isValid && previewResult.errorCount === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Alert"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                            lineNumber: 1057,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertTitle"], {
                                            children: "Dữ liệu hợp lệ"
                                        }, void 0, false, {
                                            fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                            lineNumber: 1058,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDescription"], {
                                            children: [
                                                "Tất cả ",
                                                previewResult.totalRows,
                                                " dòng đều hợp lệ. Bạn có thể tiến hành nhập dữ liệu."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                            lineNumber: 1059,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                    lineNumber: 1056,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between text-sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-muted-foreground",
                                            children: [
                                                "Đã chọn ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-medium text-foreground",
                                                    children: selectedRows.size
                                                }, void 0, false, {
                                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                    lineNumber: 1068,
                                                    columnNumber: 27
                                                }, this),
                                                " / ",
                                                previewResult.totalRows,
                                                " dòng để nhập"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                            lineNumber: 1067,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-xs text-muted-foreground",
                                            children: "💡 Hover vào ô rồi click vào ô để sửa nội dung"
                                        }, void 0, false, {
                                            fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                            lineNumber: 1070,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                    lineNumber: 1066,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tabs"], {
                                    value: previewTab,
                                    onValueChange: (v)=>{
                                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["startTransition"](()=>{
                                            setPreviewTab(v);
                                            setPreviewPage(0);
                                        });
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabsList"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabsTrigger"], {
                                                    value: "all",
                                                    children: [
                                                        "Tất cả (",
                                                        previewResult.totalRows,
                                                        ")"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                    lineNumber: 1083,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabsTrigger"], {
                                                    value: "valid",
                                                    children: [
                                                        "Hợp lệ (",
                                                        previewResult.validCount,
                                                        ")"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                    lineNumber: 1086,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabsTrigger"], {
                                                    value: "error",
                                                    children: [
                                                        "Lỗi (",
                                                        previewResult.errorCount,
                                                        ")"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                    lineNumber: 1089,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabsTrigger"], {
                                                    value: "warning",
                                                    children: [
                                                        "Cảnh báo (",
                                                        previewResult.warningCount,
                                                        ")"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                    lineNumber: 1092,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                            lineNumber: 1082,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabsContent"], {
                                            value: previewTab,
                                            className: "mt-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "rounded-md border overflow-hidden",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "overflow-auto max-h-[300px]",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "min-w-max",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Table"], {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHeader"], {
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableRow"], {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                                                                    className: "w-10 sticky left-0 bg-card z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]",
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Checkbox"], {
                                                                                        checked: isAllFilteredSelected,
                                                                                        onCheckedChange: handleToggleAllRows,
                                                                                        "aria-label": "Chọn tất cả"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                                                        lineNumber: 1105,
                                                                                        columnNumber: 33
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                                                    lineNumber: 1104,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                                                                    className: "w-14 sticky left-10 bg-card z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]",
                                                                                    children: "Dòng"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                                                    lineNumber: 1111,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                                                                    className: "w-20 sticky left-24 bg-card z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]",
                                                                                    children: "Trạng thái"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                                                    lineNumber: 1112,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                visibleFields.map((field)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                                                                        className: "min-w-[120px] max-w-[200px] whitespace-nowrap",
                                                                                        children: field.label
                                                                                    }, field.key, false, {
                                                                                        fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                                                        lineNumber: 1114,
                                                                                        columnNumber: 33
                                                                                    }, this))
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                                            lineNumber: 1103,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                                        lineNumber: 1102,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableBody"], {
                                                                        children: paginatedPreviewRows.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableRow"], {
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                                                colSpan: visibleFields.length + 3,
                                                                                className: "text-center py-8 text-muted-foreground",
                                                                                children: "Không có dữ liệu"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                                                lineNumber: 1123,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                                            lineNumber: 1122,
                                                                            columnNumber: 31
                                                                        }, this) : paginatedPreviewRows.map((row)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PreviewTableRow, {
                                                                                row: row,
                                                                                isSelected: selectedRows.has(row.rowNumber),
                                                                                isUnselectable: row.status === 'error' || row.status === 'duplicate',
                                                                                visibleFields: visibleFields,
                                                                                onToggleSelection: handleToggleRowSelection,
                                                                                onCellSave: handleCellSave,
                                                                                getStatusBadge: getStatusBadge
                                                                            }, row.rowNumber, false, {
                                                                                fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                                                lineNumber: 1132,
                                                                                columnNumber: 33
                                                                            }, this))
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                                        lineNumber: 1120,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                                lineNumber: 1101,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                            lineNumber: 1100,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                        lineNumber: 1099,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                    lineNumber: 1098,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between mt-4 pt-4 border-t",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-4",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "text-sm text-muted-foreground",
                                                                    children: [
                                                                        "Hiển thị ",
                                                                        filteredPreviewRows.length > 0 ? previewPage * previewPageSize + 1 : 0,
                                                                        " - ",
                                                                        Math.min((previewPage + 1) * previewPageSize, filteredPreviewRows.length),
                                                                        " / ",
                                                                        filteredPreviewRows.length,
                                                                        " dòng"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                                    lineNumber: 1153,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-2",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                                                                        value: String(previewPageSize),
                                                                        onValueChange: (v)=>{
                                                                            setPreviewPageSize(Number(v));
                                                                            setPreviewPage(0);
                                                                        },
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                                                                className: "w-[100px] h-8",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectValue"], {}, void 0, false, {
                                                                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                                                    lineNumber: 1159,
                                                                                    columnNumber: 29
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                                                lineNumber: 1158,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectContent"], {
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                                        value: "10",
                                                                                        children: "10 dòng"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                                                        lineNumber: 1162,
                                                                                        columnNumber: 29
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                                        value: "20",
                                                                                        children: "20 dòng"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                                                        lineNumber: 1163,
                                                                                        columnNumber: 29
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                                        value: "50",
                                                                                        children: "50 dòng"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                                                        lineNumber: 1164,
                                                                                        columnNumber: 29
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                                        value: "100",
                                                                                        children: "100 dòng"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                                                        lineNumber: 1165,
                                                                                        columnNumber: 29
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                                                lineNumber: 1161,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                                        lineNumber: 1157,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                                    lineNumber: 1156,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                            lineNumber: 1152,
                                                            columnNumber: 21
                                                        }, this),
                                                        previewPageCount > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-sm text-muted-foreground",
                                                                    children: [
                                                                        "Trang ",
                                                                        previewPage + 1,
                                                                        "/",
                                                                        previewPageCount
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                                    lineNumber: 1172,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                    variant: "outline",
                                                                    size: "sm",
                                                                    onClick: ()=>setPreviewPage(0),
                                                                    disabled: previewPage === 0,
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevrons$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronsLeft$3e$__["ChevronsLeft"], {
                                                                        className: "h-4 w-4"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                                        lineNumber: 1181,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                                    lineNumber: 1175,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                    variant: "outline",
                                                                    size: "sm",
                                                                    onClick: ()=>setPreviewPage((p)=>Math.max(0, p - 1)),
                                                                    disabled: previewPage === 0,
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                                                                        className: "h-4 w-4"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                                        lineNumber: 1189,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                                    lineNumber: 1183,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                    variant: "outline",
                                                                    size: "sm",
                                                                    onClick: ()=>setPreviewPage((p)=>Math.min(previewPageCount - 1, p + 1)),
                                                                    disabled: previewPage >= previewPageCount - 1,
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                                                        className: "h-4 w-4"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                                        lineNumber: 1197,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                                    lineNumber: 1191,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                    variant: "outline",
                                                                    size: "sm",
                                                                    onClick: ()=>setPreviewPage(previewPageCount - 1),
                                                                    disabled: previewPage >= previewPageCount - 1,
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevrons$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronsRight$3e$__["ChevronsRight"], {
                                                                        className: "h-4 w-4"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                                        lineNumber: 1205,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                                    lineNumber: 1199,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                            lineNumber: 1171,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                    lineNumber: 1151,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                            lineNumber: 1097,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                    lineNumber: 1076,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                            lineNumber: 1021,
                            columnNumber: 13
                        }, this),
                        step === 'import' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-4 py-12 text-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                    className: "mx-auto h-12 w-12 text-primary animate-spin"
                                }, void 0, false, {
                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                    lineNumber: 1218,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-lg font-semibold",
                                    children: "Đang nhập dữ liệu..."
                                }, void 0, false, {
                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                    lineNumber: 1219,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-muted-foreground",
                                    children: "Vui lòng đợi"
                                }, void 0, false, {
                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                    lineNumber: 1220,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$progress$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Progress"], {
                                    value: importProgress,
                                    className: "w-full max-w-md mx-auto"
                                }, void 0, false, {
                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                    lineNumber: 1221,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-muted-foreground",
                                    children: [
                                        importProgress,
                                        "%"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                    lineNumber: 1222,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                            lineNumber: 1217,
                            columnNumber: 13
                        }, this),
                        step === 'result' && importResult && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-6 py-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-center",
                                    children: [
                                        importResult.failed === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                            className: "mx-auto h-16 w-16 text-green-600 mb-4"
                                        }, void 0, false, {
                                            fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                            lineNumber: 1231,
                                            columnNumber: 19
                                        }, this) : importResult.success > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                            className: "mx-auto h-16 w-16 text-amber-600 mb-4"
                                        }, void 0, false, {
                                            fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                            lineNumber: 1233,
                                            columnNumber: 19
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"], {
                                            className: "mx-auto h-16 w-16 text-destructive mb-4"
                                        }, void 0, false, {
                                            fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                            lineNumber: 1235,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-xl font-semibold mb-2",
                                            children: importResult.failed === 0 ? 'Nhập dữ liệu thành công!' : importResult.success > 0 ? 'Nhập dữ liệu hoàn tất' : 'Nhập dữ liệu thất bại'
                                        }, void 0, false, {
                                            fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                            lineNumber: 1237,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                    lineNumber: 1229,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-3 gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "rounded-lg border p-4 text-center",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-3xl font-bold text-green-600",
                                                    children: importResult.success
                                                }, void 0, false, {
                                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                    lineNumber: 1245,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-sm text-muted-foreground",
                                                    children: "Thành công"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                    lineNumber: 1246,
                                                    columnNumber: 19
                                                }, this),
                                                importResult.inserted > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-xs text-muted-foreground",
                                                    children: [
                                                        "(",
                                                        importResult.inserted,
                                                        " mới, ",
                                                        importResult.updated,
                                                        " cập nhật)"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                    lineNumber: 1248,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                            lineNumber: 1244,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "rounded-lg border p-4 text-center",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-3xl font-bold text-destructive",
                                                    children: importResult.failed
                                                }, void 0, false, {
                                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                    lineNumber: 1254,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-sm text-muted-foreground",
                                                    children: "Thất bại"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                    lineNumber: 1255,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                            lineNumber: 1253,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "rounded-lg border p-4 text-center",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-3xl font-bold text-muted-foreground",
                                                    children: importResult.skipped
                                                }, void 0, false, {
                                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                    lineNumber: 1258,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-sm text-muted-foreground",
                                                    children: "Bỏ qua"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                    lineNumber: 1259,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                            lineNumber: 1257,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                    lineNumber: 1243,
                                    columnNumber: 15
                                }, this),
                                importResult.errors.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Alert"], {
                                    variant: "destructive",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                            lineNumber: 1266,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertTitle"], {
                                            children: "Chi tiết lỗi"
                                        }, void 0, false, {
                                            fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                            lineNumber: 1267,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDescription"], {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$scroll$2d$area$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollArea"], {
                                                className: "h-[150px] mt-2",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-1",
                                                    children: importResult.errors.map((error, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-sm",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                    children: [
                                                                        "Dòng ",
                                                                        error.row,
                                                                        ":"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                                    lineNumber: 1273,
                                                                    columnNumber: 29
                                                                }, this),
                                                                " ",
                                                                error.message
                                                            ]
                                                        }, idx, true, {
                                                            fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                            lineNumber: 1272,
                                                            columnNumber: 27
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                    lineNumber: 1270,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                                lineNumber: 1269,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                            lineNumber: 1268,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                    lineNumber: 1265,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                            lineNumber: 1228,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                    lineNumber: 913,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogFooter"], {
                    children: [
                        step === 'upload' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "outline",
                                    onClick: ()=>onOpenChange(false),
                                    children: "Đóng"
                                }, void 0, false, {
                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                    lineNumber: 1288,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    onClick: handleParseAndPreview,
                                    disabled: !excelFile || requireBranch && !selectedBranchId,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                            className: "mr-2 h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                            lineNumber: 1295,
                                            columnNumber: 17
                                        }, this),
                                        "Rà soát"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                    lineNumber: 1291,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true),
                        step === 'preview' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "outline",
                                    onClick: ()=>setStep('upload'),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                                            className: "mr-2 h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                            lineNumber: 1304,
                                            columnNumber: 17
                                        }, this),
                                        "Quay lại"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                    lineNumber: 1303,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    onClick: handleImport,
                                    disabled: selectedRows.size === 0,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                                            className: "mr-2 h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                            lineNumber: 1311,
                                            columnNumber: 17
                                        }, this),
                                        "Nhập ",
                                        selectedRows.size,
                                        " dòng"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                                    lineNumber: 1307,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true),
                        step === 'result' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            onClick: ()=>onOpenChange(false),
                            children: "Đóng"
                        }, void 0, false, {
                            fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                            lineNumber: 1318,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
                    lineNumber: 1285,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
            lineNumber: 899,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/shared/generic-import-dialog-v2.tsx",
        lineNumber: 898,
        columnNumber: 5
    }, this);
}
_s1(GenericImportDialogV2, "b1PAtzTw9f6qZwnZ1OoceR3H7d0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$export$2f$import$2d$export$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useImportExportStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBranchStore"]
    ];
});
_c3 = GenericImportDialogV2;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "EditableCell");
__turbopack_context__.k.register(_c1, "PreviewTableRowComponent");
__turbopack_context__.k.register(_c2, "PreviewTableRow");
__turbopack_context__.k.register(_c3, "GenericImportDialogV2");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/shared/generic-export-dialog-v2.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GenericExportDialogV2",
    ()=>GenericExportDialogV2
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * GenericExportDialog V2
 * 
 * Enhanced export dialog with:
 * - Column selection with groups
 * - Scope options (all/filtered/current-page/selected)
 * - Export history logging
 * - File size estimation
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.js [app-client] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-spreadsheet.js [app-client] (ecmascript) <export default as FileSpreadsheet>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/label.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$radio$2d$group$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/radio-group.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/checkbox.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$scroll$2d$area$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/scroll-area.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$separator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/separator.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/xlsx/xlsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$export$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/import-export/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$export$2f$import$2d$export$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/import-export/import-export-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$export$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/import-export/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pricing$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pricing/store.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
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
function GenericExportDialogV2({ open, onOpenChange, config, allData, filteredData, currentPageData, selectedData, appliedFilters, currentUser }) {
    _s();
    // Store
    const addExportLog = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$export$2f$import$2d$export$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useImportExportStore"])({
        "GenericExportDialogV2.useImportExportStore[addExportLog]": (state)=>state.addExportLog
    }["GenericExportDialogV2.useImportExportStore[addExportLog]"]);
    // State
    const [exportScope, setExportScope] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]('filtered');
    const [selectedColumns, setSelectedColumns] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]([]);
    const [isExporting, setIsExporting] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    // Initialize selected columns from config (all non-hidden fields)
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "GenericExportDialogV2.useEffect": ()=>{
            if (open && selectedColumns.length === 0) {
                const defaultColumns = config.fields.filter({
                    "GenericExportDialogV2.useEffect.defaultColumns": (f)=>!f.hidden && f.exportable !== false
                }["GenericExportDialogV2.useEffect.defaultColumns"]).map({
                    "GenericExportDialogV2.useEffect.defaultColumns": (f)=>f.key
                }["GenericExportDialogV2.useEffect.defaultColumns"]);
                setSelectedColumns(defaultColumns);
            }
        }
    }["GenericExportDialogV2.useEffect"], [
        open,
        config.fields,
        selectedColumns.length
    ]);
    // Reset scope when dialog opens
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "GenericExportDialogV2.useEffect": ()=>{
            if (open) {
                // Default to filtered if has filters, else all
                if (filteredData.length < allData.length) {
                    setExportScope('filtered');
                } else if (selectedData.length > 0) {
                    setExportScope('selected');
                } else {
                    setExportScope('all');
                }
            }
        }
    }["GenericExportDialogV2.useEffect"], [
        open,
        allData.length,
        filteredData.length,
        selectedData.length
    ]);
    // Group fields by category
    const groupedFields = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "GenericExportDialogV2.useMemo[groupedFields]": ()=>{
            const groups = {};
            config.fields.forEach({
                "GenericExportDialogV2.useMemo[groupedFields]": (field)=>{
                    if (field.hidden || field.exportable === false) return;
                    const group = field.group || field.exportGroup || 'Khác';
                    if (!groups[group]) {
                        groups[group] = [];
                    }
                    groups[group].push(field);
                }
            }["GenericExportDialogV2.useMemo[groupedFields]"]);
            // ===== DYNAMIC PRICING COLUMNS (chỉ cho products) =====
            if (config.entityType === 'products') {
                const pricingPolicies = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pricing$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePricingPolicyStore"].getState().data.filter({
                    "GenericExportDialogV2.useMemo[groupedFields].pricingPolicies": (p)=>p.isActive
                }["GenericExportDialogV2.useMemo[groupedFields].pricingPolicies"]);
                if (pricingPolicies.length > 0) {
                    const pricingFields = pricingPolicies.map({
                        "GenericExportDialogV2.useMemo[groupedFields].pricingFields": (policy)=>({
                                key: `_price_${policy.systemId}`,
                                label: `Giá: ${policy.name}`,
                                type: 'number',
                                exportGroup: 'Bảng giá',
                                group: 'Bảng giá',
                                // Custom transform to extract price from prices object
                                exportTransform: ({
                                    "GenericExportDialogV2.useMemo[groupedFields].pricingFields": (value, row)=>{
                                        const product = row;
                                        return product?.prices?.[policy.systemId] ?? '';
                                    }
                                })["GenericExportDialogV2.useMemo[groupedFields].pricingFields"]
                            })
                    }["GenericExportDialogV2.useMemo[groupedFields].pricingFields"]);
                    groups['Bảng giá'] = pricingFields;
                }
            }
            return groups;
        }
    }["GenericExportDialogV2.useMemo[groupedFields]"], [
        config.fields,
        config.entityType
    ]);
    // Exportable fields (non-hidden) - including dynamic pricing fields
    const exportableFields = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "GenericExportDialogV2.useMemo[exportableFields]": ()=>{
            const staticFields = config.fields.filter({
                "GenericExportDialogV2.useMemo[exportableFields].staticFields": (f)=>!f.hidden && f.exportable !== false
            }["GenericExportDialogV2.useMemo[exportableFields].staticFields"]);
            // Add dynamic pricing fields for products
            if (config.entityType === 'products') {
                const pricingPolicies = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pricing$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePricingPolicyStore"].getState().data.filter({
                    "GenericExportDialogV2.useMemo[exportableFields].pricingPolicies": (p)=>p.isActive
                }["GenericExportDialogV2.useMemo[exportableFields].pricingPolicies"]);
                const pricingFields = pricingPolicies.map({
                    "GenericExportDialogV2.useMemo[exportableFields].pricingFields": (policy)=>({
                            key: `_price_${policy.systemId}`,
                            label: `Giá: ${policy.name}`,
                            type: 'number',
                            exportGroup: 'Bảng giá',
                            group: 'Bảng giá'
                        })
                }["GenericExportDialogV2.useMemo[exportableFields].pricingFields"]);
                return [
                    ...staticFields,
                    ...pricingFields
                ];
            }
            return staticFields;
        }
    }["GenericExportDialogV2.useMemo[exportableFields]"], [
        config.fields,
        config.entityType
    ]);
    // Data count by scope
    const getDataByScope = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "GenericExportDialogV2.useCallback[getDataByScope]": (scope)=>{
            switch(scope){
                case 'all':
                    return allData;
                case 'filtered':
                    return filteredData;
                case 'current-page':
                    return currentPageData;
                case 'selected':
                    return selectedData;
            }
        }
    }["GenericExportDialogV2.useCallback[getDataByScope]"], [
        allData,
        filteredData,
        currentPageData,
        selectedData
    ]);
    const dataToExport = getDataByScope(exportScope);
    // ============================================
    // HANDLERS
    // ============================================
    const handleToggleColumn = (columnKey)=>{
        setSelectedColumns((prev)=>prev.includes(columnKey) ? prev.filter((k)=>k !== columnKey) : [
                ...prev,
                columnKey
            ]);
    };
    const handleToggleGroup = (groupFields)=>{
        const groupKeys = groupFields.map((f)=>f.key);
        const allSelected = groupKeys.every((k)=>selectedColumns.includes(k));
        if (allSelected) {
            setSelectedColumns((prev)=>prev.filter((k)=>!groupKeys.includes(k)));
        } else {
            setSelectedColumns((prev)=>[
                    ...new Set([
                        ...prev,
                        ...groupKeys
                    ])
                ]);
        }
    };
    const handleToggleAll = ()=>{
        if (selectedColumns.length === exportableFields.length) {
            setSelectedColumns([]);
        } else {
            setSelectedColumns(exportableFields.map((f)=>f.key));
        }
    };
    const handleExport = async ()=>{
        if (selectedColumns.length === 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Vui lòng chọn ít nhất 1 cột để xuất');
            return;
        }
        if (dataToExport.length === 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Không có dữ liệu để xuất');
            return;
        }
        setIsExporting(true);
        try {
            // Get selected fields config (including dynamic pricing fields)
            const staticSelectedFields = config.fields.filter((f)=>selectedColumns.includes(f.key));
            // Add dynamic pricing fields for products (prepared but handled inline in transform)
            let _allSelectedFieldsFinal = [
                ...staticSelectedFields
            ];
            const selectedPriceColumns = selectedColumns.filter((k)=>k.startsWith('_price_'));
            if (config.entityType === 'products' && selectedPriceColumns.length > 0) {
                const pricingPolicies = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pricing$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePricingPolicyStore"].getState().data.filter((p)=>p.isActive);
                const pricingFields = selectedPriceColumns.map((colKey)=>{
                    const systemId = colKey.replace('_price_', '');
                    const policy = pricingPolicies.find((p)=>p.systemId === systemId);
                    return {
                        key: colKey,
                        label: `Giá: ${policy?.name || systemId}`,
                        type: 'number',
                        exportGroup: 'Bảng giá'
                    };
                });
                _allSelectedFieldsFinal = [
                    ..._allSelectedFieldsFinal,
                    ...pricingFields
                ];
            }
            // Transform data (with special handling for pricing columns)
            const transformedData = dataToExport.map((item)=>{
                const row = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$export$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transformExportRow"])(item, staticSelectedFields);
                // Add pricing columns for products
                if (config.entityType === 'products' && selectedPriceColumns.length > 0) {
                    const product = item;
                    const pricingPolicies = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pricing$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePricingPolicyStore"].getState().data.filter((p)=>p.isActive);
                    selectedPriceColumns.forEach((colKey)=>{
                        const systemId = colKey.replace('_price_', '');
                        const policy = pricingPolicies.find((p)=>p.systemId === systemId);
                        const label = `Giá: ${policy?.name || systemId}`;
                        row[label] = product?.prices?.[systemId] ?? '';
                    });
                }
                return row;
            });
            // Create workbook
            const ws = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils"].json_to_sheet(transformedData);
            const wb = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils"].book_new();
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils"].book_append_sheet(wb, ws, 'Data');
            // Auto-size columns
            const maxWidth = 50;
            const colWidths = Object.keys(transformedData[0] || {}).map((key)=>({
                    wch: Math.min(maxWidth, Math.max(key.length + 2, ...transformedData.slice(0, 100).map((row)=>String(row[key] || '').length)))
                }));
            ws['!cols'] = colWidths;
            // Generate filename
            const fileName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$export$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateExportFileName"])(config.entityType, exportScope);
            // Write file and get blob for size
            const wbout = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["write"](wb, {
                bookType: 'xlsx',
                type: 'array'
            });
            const blob = new Blob([
                wbout
            ], {
                type: 'application/octet-stream'
            });
            // Download
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            // Log to store
            addExportLog({
                entityType: config.entityType,
                entityDisplayName: config.entityDisplayName,
                fileName,
                fileSize: blob.size,
                totalRows: dataToExport.length,
                scope: exportScope,
                columnsExported: selectedColumns,
                filters: appliedFilters,
                performedBy: currentUser.name,
                performedById: currentUser.systemId,
                performedAt: new Date().toISOString(),
                status: 'success'
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Xuất file thành công', {
                description: `Đã xuất ${dataToExport.length} ${config.entityDisplayName}`
            });
            onOpenChange(false);
        } catch (error) {
            console.error('Export error:', error);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Có lỗi khi xuất file');
        } finally{
            setIsExporting(false);
        }
    };
    // ============================================
    // RENDER
    // ============================================
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"], {
        open: open,
        onOpenChange: onOpenChange,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogContent"], {
            className: "max-w-2xl max-h-[90vh] overflow-hidden flex flex-col",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogHeader"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogTitle"], {
                            className: "flex items-center gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__["FileSpreadsheet"], {
                                    className: "h-5 w-5"
                                }, void 0, false, {
                                    fileName: "[project]/components/shared/generic-export-dialog-v2.tsx",
                                    lineNumber: 351,
                                    columnNumber: 13
                                }, this),
                                "Xuất ",
                                config.entityDisplayName,
                                " ra Excel"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/shared/generic-export-dialog-v2.tsx",
                            lineNumber: 350,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogDescription"], {
                            children: "Chọn phạm vi và các cột cần xuất"
                        }, void 0, false, {
                            fileName: "[project]/components/shared/generic-export-dialog-v2.tsx",
                            lineNumber: 354,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/shared/generic-export-dialog-v2.tsx",
                    lineNumber: 349,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-1 overflow-auto space-y-6 p-1",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                    className: "text-base font-semibold",
                                    children: "Giới hạn kết quả xuất"
                                }, void 0, false, {
                                    fileName: "[project]/components/shared/generic-export-dialog-v2.tsx",
                                    lineNumber: 362,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$radio$2d$group$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RadioGroup"], {
                                    value: exportScope,
                                    onValueChange: (v)=>setExportScope(v),
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center space-x-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$radio$2d$group$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RadioGroupItem"], {
                                                            value: "all",
                                                            id: "scope-all"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/shared/generic-export-dialog-v2.tsx",
                                                            lineNumber: 370,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                            htmlFor: "scope-all",
                                                            className: "font-normal cursor-pointer",
                                                            children: "Tất cả dữ liệu"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/shared/generic-export-dialog-v2.tsx",
                                                            lineNumber: 371,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/shared/generic-export-dialog-v2.tsx",
                                                    lineNumber: 369,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                    variant: "secondary",
                                                    children: allData.length
                                                }, void 0, false, {
                                                    fileName: "[project]/components/shared/generic-export-dialog-v2.tsx",
                                                    lineNumber: 375,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/shared/generic-export-dialog-v2.tsx",
                                            lineNumber: 368,
                                            columnNumber: 15
                                        }, this),
                                        filteredData.length < allData.length && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center space-x-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$radio$2d$group$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RadioGroupItem"], {
                                                            value: "filtered",
                                                            id: "scope-filtered"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/shared/generic-export-dialog-v2.tsx",
                                                            lineNumber: 381,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                            htmlFor: "scope-filtered",
                                                            className: "font-normal cursor-pointer",
                                                            children: "Kết quả đã lọc"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/shared/generic-export-dialog-v2.tsx",
                                                            lineNumber: 382,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/shared/generic-export-dialog-v2.tsx",
                                                    lineNumber: 380,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                    variant: "secondary",
                                                    children: filteredData.length
                                                }, void 0, false, {
                                                    fileName: "[project]/components/shared/generic-export-dialog-v2.tsx",
                                                    lineNumber: 386,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/shared/generic-export-dialog-v2.tsx",
                                            lineNumber: 379,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center space-x-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$radio$2d$group$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RadioGroupItem"], {
                                                            value: "current-page",
                                                            id: "scope-page"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/shared/generic-export-dialog-v2.tsx",
                                                            lineNumber: 392,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                            htmlFor: "scope-page",
                                                            className: "font-normal cursor-pointer",
                                                            children: "Trang hiện tại"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/shared/generic-export-dialog-v2.tsx",
                                                            lineNumber: 393,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/shared/generic-export-dialog-v2.tsx",
                                                    lineNumber: 391,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                    variant: "secondary",
                                                    children: currentPageData.length
                                                }, void 0, false, {
                                                    fileName: "[project]/components/shared/generic-export-dialog-v2.tsx",
                                                    lineNumber: 397,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/shared/generic-export-dialog-v2.tsx",
                                            lineNumber: 390,
                                            columnNumber: 15
                                        }, this),
                                        selectedData.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center space-x-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$radio$2d$group$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RadioGroupItem"], {
                                                            value: "selected",
                                                            id: "scope-selected"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/shared/generic-export-dialog-v2.tsx",
                                                            lineNumber: 403,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                            htmlFor: "scope-selected",
                                                            className: "font-normal cursor-pointer",
                                                            children: "Các dòng đã chọn"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/shared/generic-export-dialog-v2.tsx",
                                                            lineNumber: 404,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/shared/generic-export-dialog-v2.tsx",
                                                    lineNumber: 402,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                    variant: "default",
                                                    children: selectedData.length
                                                }, void 0, false, {
                                                    fileName: "[project]/components/shared/generic-export-dialog-v2.tsx",
                                                    lineNumber: 408,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/shared/generic-export-dialog-v2.tsx",
                                            lineNumber: 401,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/shared/generic-export-dialog-v2.tsx",
                                    lineNumber: 363,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/shared/generic-export-dialog-v2.tsx",
                            lineNumber: 361,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$separator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"], {}, void 0, false, {
                            fileName: "[project]/components/shared/generic-export-dialog-v2.tsx",
                            lineNumber: 414,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                            className: "text-base font-semibold",
                                            children: [
                                                "Chọn cột xuất (",
                                                selectedColumns.length,
                                                "/",
                                                exportableFields.length,
                                                ")"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/shared/generic-export-dialog-v2.tsx",
                                            lineNumber: 419,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            variant: "outline",
                                            size: "sm",
                                            onClick: handleToggleAll,
                                            children: selectedColumns.length === exportableFields.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'
                                        }, void 0, false, {
                                            fileName: "[project]/components/shared/generic-export-dialog-v2.tsx",
                                            lineNumber: 422,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/shared/generic-export-dialog-v2.tsx",
                                    lineNumber: 418,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$scroll$2d$area$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollArea"], {
                                    className: "h-[280px] rounded-md border p-4",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-4",
                                        children: Object.entries(groupedFields).map(([group, fields])=>{
                                            const groupKeys = fields.map((f)=>f.key);
                                            const selectedCount = groupKeys.filter((k)=>selectedColumns.includes(k)).length;
                                            const allSelected = selectedCount === fields.length;
                                            const someSelected = selectedCount > 0 && selectedCount < fields.length;
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center space-x-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Checkbox"], {
                                                                id: `group-${group}`,
                                                                checked: allSelected,
                                                                // @ts-expect-error - indeterminate is valid HTML attribute
                                                                ref: (el)=>el && (el.indeterminate = someSelected),
                                                                onCheckedChange: ()=>handleToggleGroup(fields)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/shared/generic-export-dialog-v2.tsx",
                                                                lineNumber: 442,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                                htmlFor: `group-${group}`,
                                                                className: "text-sm font-semibold text-muted-foreground cursor-pointer",
                                                                children: [
                                                                    group,
                                                                    " (",
                                                                    selectedCount,
                                                                    "/",
                                                                    fields.length,
                                                                    ")"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/shared/generic-export-dialog-v2.tsx",
                                                                lineNumber: 449,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/shared/generic-export-dialog-v2.tsx",
                                                        lineNumber: 441,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "grid grid-cols-2 gap-2 ml-6",
                                                        children: fields.map((field)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center space-x-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Checkbox"], {
                                                                        id: field.key,
                                                                        checked: selectedColumns.includes(field.key),
                                                                        onCheckedChange: ()=>handleToggleColumn(field.key)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/shared/generic-export-dialog-v2.tsx",
                                                                        lineNumber: 459,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                                        htmlFor: field.key,
                                                                        className: "text-sm font-normal cursor-pointer",
                                                                        children: [
                                                                            field.label,
                                                                            field.required && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-destructive",
                                                                                children: "*"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/shared/generic-export-dialog-v2.tsx",
                                                                                lineNumber: 469,
                                                                                columnNumber: 50
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/shared/generic-export-dialog-v2.tsx",
                                                                        lineNumber: 464,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, field.key, true, {
                                                                fileName: "[project]/components/shared/generic-export-dialog-v2.tsx",
                                                                lineNumber: 458,
                                                                columnNumber: 27
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/shared/generic-export-dialog-v2.tsx",
                                                        lineNumber: 456,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, group, true, {
                                                fileName: "[project]/components/shared/generic-export-dialog-v2.tsx",
                                                lineNumber: 440,
                                                columnNumber: 21
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/components/shared/generic-export-dialog-v2.tsx",
                                        lineNumber: 432,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/shared/generic-export-dialog-v2.tsx",
                                    lineNumber: 431,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/shared/generic-export-dialog-v2.tsx",
                            lineNumber: 417,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-lg bg-muted p-3 text-sm space-y-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-muted-foreground",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: "Sẽ xuất:"
                                        }, void 0, false, {
                                            fileName: "[project]/components/shared/generic-export-dialog-v2.tsx",
                                            lineNumber: 484,
                                            columnNumber: 15
                                        }, this),
                                        " ",
                                        dataToExport.length,
                                        " ",
                                        config.entityDisplayName,
                                        " với ",
                                        selectedColumns.length,
                                        " cột"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/shared/generic-export-dialog-v2.tsx",
                                    lineNumber: 483,
                                    columnNumber: 13
                                }, this),
                                selectedColumns.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-muted-foreground",
                                    children: [
                                        "Cột: ",
                                        selectedColumns.slice(0, 5).map((k)=>{
                                            const field = config.fields.find((f)=>f.key === k);
                                            return field?.label || k;
                                        }).join(', '),
                                        selectedColumns.length > 5 && ` và ${selectedColumns.length - 5} cột khác`
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/shared/generic-export-dialog-v2.tsx",
                                    lineNumber: 487,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/shared/generic-export-dialog-v2.tsx",
                            lineNumber: 482,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/shared/generic-export-dialog-v2.tsx",
                    lineNumber: 359,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogFooter"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "outline",
                            onClick: ()=>onOpenChange(false),
                            disabled: isExporting,
                            children: "Hủy"
                        }, void 0, false, {
                            fileName: "[project]/components/shared/generic-export-dialog-v2.tsx",
                            lineNumber: 499,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            onClick: handleExport,
                            disabled: selectedColumns.length === 0 || dataToExport.length === 0 || isExporting,
                            children: isExporting ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                        className: "mr-2 h-4 w-4 animate-spin"
                                    }, void 0, false, {
                                        fileName: "[project]/components/shared/generic-export-dialog-v2.tsx",
                                        lineNumber: 508,
                                        columnNumber: 17
                                    }, this),
                                    "Đang xuất..."
                                ]
                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                        className: "mr-2 h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/components/shared/generic-export-dialog-v2.tsx",
                                        lineNumber: 513,
                                        columnNumber: 17
                                    }, this),
                                    "Xuất Excel (",
                                    dataToExport.length,
                                    ")"
                                ]
                            }, void 0, true)
                        }, void 0, false, {
                            fileName: "[project]/components/shared/generic-export-dialog-v2.tsx",
                            lineNumber: 502,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/shared/generic-export-dialog-v2.tsx",
                    lineNumber: 498,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/shared/generic-export-dialog-v2.tsx",
            lineNumber: 348,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/shared/generic-export-dialog-v2.tsx",
        lineNumber: 347,
        columnNumber: 5
    }, this);
}
_s(GenericExportDialogV2, "zCasjsnnfdcGmuApDkKcELIXInU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$export$2f$import$2d$export$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useImportExportStore"]
    ];
});
_c = GenericExportDialogV2;
var _c;
__turbopack_context__.k.register(_c, "GenericExportDialogV2");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/import-export/configs/cost-adjustment.config.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Cost Adjustment Import/Export Configuration
 * 
 * Nhập/Xuất phiếu điều chỉnh giá vốn
 * 
 * FORMAT:
 * - Multi-line: 1 phiếu điều chỉnh có thể có nhiều dòng sản phẩm
 * - Các dòng cùng Mã phiếu sẽ được nhóm thành 1 phiếu
 */ __turbopack_context__.s([
    "costAdjustmentFields",
    ()=>costAdjustmentFields,
    "costAdjustmentImportExportConfig",
    ()=>costAdjustmentImportExportConfig,
    "flattenCostAdjustmentsForExport",
    ()=>flattenCostAdjustmentsForExport
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/products/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/employees/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-client] (ecmascript)");
;
;
;
// ============================================
// HELPER FUNCTIONS
// ============================================
const getProductStore = ()=>__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductStore"].getState();
const getEmployeeStore = ()=>__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEmployeeStore"].getState();
const findProduct = (identifier)=>{
    if (!identifier) return undefined;
    const store = getProductStore();
    const normalized = identifier.trim().toUpperCase();
    const byId = store.data.find((p)=>p.id.toUpperCase() === normalized);
    if (byId) return byId;
    const bySku = store.data.find((p)=>p.sku?.toUpperCase() === normalized);
    return bySku;
};
const findEmployee = (name)=>{
    if (!name) return undefined;
    const store = getEmployeeStore();
    const normalized = name.trim().toLowerCase();
    return store.data.find((e)=>e.fullName?.toLowerCase().includes(normalized));
};
const costAdjustmentFields = [
    // Phiếu điều chỉnh
    {
        key: 'adjustmentId',
        label: 'Mã phiếu (*)',
        type: 'string',
        required: true,
        example: 'DCGV001',
        group: 'Phiếu điều chỉnh',
        defaultSelected: true
    },
    {
        key: 'type',
        label: 'Loại',
        type: 'string',
        required: false,
        example: 'manual',
        group: 'Phiếu điều chỉnh'
    },
    {
        key: 'status',
        label: 'Trạng thái',
        type: 'string',
        required: false,
        example: 'draft',
        group: 'Phiếu điều chỉnh'
    },
    {
        key: 'createdDate',
        label: 'Ngày tạo',
        type: 'string',
        required: false,
        example: '2024-01-15',
        group: 'Phiếu điều chỉnh',
        defaultSelected: true
    },
    {
        key: 'createdByName',
        label: 'Người tạo',
        type: 'string',
        required: false,
        example: 'Nguyễn Văn A',
        group: 'Phiếu điều chỉnh'
    },
    {
        key: 'reason',
        label: 'Lý do chung',
        type: 'string',
        required: false,
        example: 'Cập nhật giá vốn theo thị trường',
        group: 'Phiếu điều chỉnh'
    },
    {
        key: 'note',
        label: 'Ghi chú',
        type: 'string',
        required: false,
        example: 'Điều chỉnh tháng 1/2024',
        group: 'Phiếu điều chỉnh'
    },
    {
        key: 'referenceCode',
        label: 'Mã tham chiếu',
        type: 'string',
        required: false,
        example: 'REF001',
        group: 'Phiếu điều chỉnh'
    },
    // Sản phẩm
    {
        key: 'productIdOrSku',
        label: 'Mã SP/SKU (*)',
        type: 'string',
        required: true,
        example: 'SP001',
        group: 'Sản phẩm',
        defaultSelected: true
    },
    {
        key: 'oldCostPrice',
        label: 'Giá vốn cũ (*)',
        type: 'number',
        required: true,
        example: '100000',
        group: 'Sản phẩm',
        defaultSelected: true
    },
    {
        key: 'newCostPrice',
        label: 'Giá vốn mới (*)',
        type: 'number',
        required: true,
        example: '120000',
        group: 'Sản phẩm',
        defaultSelected: true
    },
    {
        key: 'itemReason',
        label: 'Lý do SP',
        type: 'string',
        required: false,
        example: 'Tăng giá nhập',
        group: 'Sản phẩm'
    }
];
// ============================================
// STATUS & TYPE MAPPING
// ============================================
const STATUS_MAP = {
    'draft': 'draft',
    'Nháp': 'draft',
    'confirmed': 'confirmed',
    'Đã xác nhận': 'confirmed',
    'Xác nhận': 'confirmed',
    'cancelled': 'cancelled',
    'Đã hủy': 'cancelled'
};
const TYPE_MAP = {
    'manual': 'manual',
    'Thủ công': 'manual',
    'import': 'import',
    'Từ đơn nhập': 'import',
    'batch': 'batch',
    'Hàng loạt': 'batch'
};
const costAdjustmentImportExportConfig = {
    entityType: 'cost-adjustments',
    entityDisplayName: 'Điều chỉnh giá vốn',
    fields: costAdjustmentFields,
    templateFileName: 'Mau_Dieu_Chinh_Gia_Von.xlsx',
    sheetName: 'DieuChinhGiaVon',
    // Import settings
    upsertKey: 'id',
    allowUpdate: false,
    allowInsert: true,
    requirePreview: true,
    maxRows: 2000,
    maxErrorsAllowed: 0,
    // Fill-down for multi-line
    preProcessRows: (rows)=>{
        let lastAdjustmentId = '';
        let lastType = '';
        let lastStatus = '';
        let lastCreatedDate = '';
        let lastCreatedBy = '';
        let lastReason = '';
        let lastNote = '';
        return rows.map((row)=>{
            if (row.adjustmentId) {
                lastAdjustmentId = String(row.adjustmentId);
                lastType = String(row.type || '');
                lastStatus = String(row.status || '');
                lastCreatedDate = String(row.createdDate || '');
                lastCreatedBy = String(row.createdByName || '');
                lastReason = String(row.reason || '');
                lastNote = String(row.note || '');
            }
            return {
                ...row,
                adjustmentId: row.adjustmentId || lastAdjustmentId,
                type: row.type || lastType,
                status: row.status || lastStatus,
                createdDate: row.createdDate || lastCreatedDate,
                createdByName: row.createdByName || lastCreatedBy,
                reason: row.reason || lastReason,
                note: row.note || lastNote
            };
        });
    },
    // Validate each row
    validateRow: (row, _index, existingData, mode)=>{
        const errors = [];
        const importRow = row;
        if (!importRow.adjustmentId) {
            errors.push({
                field: 'adjustmentId',
                message: 'Mã phiếu không được để trống'
            });
        }
        if (!importRow.productIdOrSku) {
            errors.push({
                field: 'productIdOrSku',
                message: 'Mã SP không được để trống'
            });
        }
        if (importRow.oldCostPrice === undefined || importRow.oldCostPrice < 0) {
            errors.push({
                field: 'oldCostPrice',
                message: 'Giá vốn cũ không hợp lệ'
            });
        }
        if (importRow.newCostPrice === undefined || importRow.newCostPrice < 0) {
            errors.push({
                field: 'newCostPrice',
                message: 'Giá vốn mới không hợp lệ'
            });
        }
        // Check duplicate
        if (mode === 'insert-only' && importRow.adjustmentId) {
            const duplicate = existingData.find((a)=>a.id.toUpperCase() === importRow.adjustmentId.toUpperCase());
            if (duplicate) {
            // Warning only - same adjustment can have multiple lines
            }
        }
        return errors;
    },
    // Transform: Group rows by adjustmentId and build CostAdjustment objects
    beforeImport: async (data)=>{
        const importRows = data;
        // Group rows by adjustmentId
        const adjustmentMap = new Map();
        for (const row of importRows){
            const adjustmentId = row.adjustmentId?.trim();
            if (!adjustmentId) continue;
            if (!adjustmentMap.has(adjustmentId)) {
                adjustmentMap.set(adjustmentId, []);
            }
            adjustmentMap.get(adjustmentId).push(row);
        }
        // Build CostAdjustment objects
        const adjustments = [];
        const now = new Date().toISOString();
        for (const [adjustmentId, rows] of adjustmentMap.entries()){
            if (rows.length === 0) continue;
            const firstRow = rows[0];
            // Lookup creator
            const creator = findEmployee(firstRow.createdByName || '');
            // Build items
            const items = [];
            for (const row of rows){
                if (!row.productIdOrSku) continue;
                const product = findProduct(row.productIdOrSku || '');
                const oldCostPrice = Number(row.oldCostPrice) || 0;
                const newCostPrice = Number(row.newCostPrice) || 0;
                const adjustmentAmount = newCostPrice - oldCostPrice;
                const adjustmentPercent = oldCostPrice > 0 ? adjustmentAmount / oldCostPrice * 100 : 0;
                items.push({
                    productSystemId: product?.systemId || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(''),
                    productId: product?.id || row.productIdOrSku || '',
                    productName: product?.name || row.productName || '',
                    productImage: product?.images?.[0],
                    oldCostPrice,
                    newCostPrice,
                    adjustmentAmount,
                    adjustmentPercent: Math.round(adjustmentPercent * 100) / 100,
                    reason: row.itemReason
                });
            }
            if (items.length === 0) continue;
            // Map status and type
            const status = STATUS_MAP[firstRow.status || ''] || 'draft';
            const type = TYPE_MAP[firstRow.type || ''] || 'manual';
            // Build CostAdjustment object
            const adjustment = {
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(''),
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])(adjustmentId),
                type,
                status,
                items,
                note: firstRow.note,
                reason: firstRow.reason,
                referenceCode: firstRow.referenceCode,
                createdDate: firstRow.createdDate || now,
                createdBySystemId: creator?.systemId || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(''),
                createdByName: creator?.fullName || firstRow.createdByName || '',
                createdAt: now,
                updatedAt: now
            };
            adjustments.push(adjustment);
        }
        return adjustments;
    }
};
function flattenCostAdjustmentsForExport(adjustments) {
    const rows = [];
    for (const adjustment of adjustments){
        for(let i = 0; i < adjustment.items.length; i++){
            const item = adjustment.items[i];
            rows.push({
                adjustmentId: i === 0 ? adjustment.id : '',
                type: i === 0 ? adjustment.type : '',
                status: i === 0 ? adjustment.status : '',
                createdDate: i === 0 ? adjustment.createdDate instanceof Date ? adjustment.createdDate.toISOString() : adjustment.createdDate ?? '' : '',
                createdByName: i === 0 ? adjustment.createdByName ?? undefined : '',
                reason: i === 0 ? adjustment.reason : '',
                note: i === 0 ? adjustment.note : '',
                referenceCode: i === 0 ? adjustment.referenceCode : '',
                productIdOrSku: item.productId,
                productName: item.productName,
                oldCostPrice: item.oldCostPrice,
                newCostPrice: item.newCostPrice,
                itemReason: item.reason
            });
        }
    }
    return rows;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/cost-adjustments/components/cost-adjustments-import-export-dialogs.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CostAdjustmentExportDialog",
    ()=>CostAdjustmentExportDialog,
    "CostAdjustmentImportDialog",
    ()=>CostAdjustmentImportDialog
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// ✅ These imports are only loaded when this wrapper component is dynamically imported
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$generic$2d$import$2d$dialog$2d$v2$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/shared/generic-import-dialog-v2.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$generic$2d$export$2d$dialog$2d$v2$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/shared/generic-export-dialog-v2.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$export$2f$configs$2f$cost$2d$adjustment$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/import-export/configs/cost-adjustment.config.ts [app-client] (ecmascript)");
'use client';
;
;
;
;
function CostAdjustmentImportDialog({ open, onOpenChange, existingData, branches, onImport, currentUser }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$generic$2d$import$2d$dialog$2d$v2$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GenericImportDialogV2"], {
        open: open,
        onOpenChange: onOpenChange,
        config: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$export$2f$configs$2f$cost$2d$adjustment$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["costAdjustmentImportExportConfig"],
        branches: branches,
        existingData: existingData,
        onImport: onImport,
        currentUser: currentUser
    }, void 0, false, {
        fileName: "[project]/features/cost-adjustments/components/cost-adjustments-import-export-dialogs.tsx",
        lineNumber: 41,
        columnNumber: 5
    }, this);
}
_c = CostAdjustmentImportDialog;
function CostAdjustmentExportDialog({ open, onOpenChange, allData, filteredData, currentPageData, selectedData, currentUser }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$generic$2d$export$2d$dialog$2d$v2$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GenericExportDialogV2"], {
        open: open,
        onOpenChange: onOpenChange,
        config: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$export$2f$configs$2f$cost$2d$adjustment$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["costAdjustmentImportExportConfig"],
        allData: allData,
        filteredData: filteredData,
        currentPageData: currentPageData,
        selectedData: selectedData,
        currentUser: currentUser
    }, void 0, false, {
        fileName: "[project]/features/cost-adjustments/components/cost-adjustments-import-export-dialogs.tsx",
        lineNumber: 73,
        columnNumber: 5
    }, this);
}
_c1 = CostAdjustmentExportDialog;
var _c, _c1;
__turbopack_context__.k.register(_c, "CostAdjustmentImportDialog");
__turbopack_context__.k.register(_c1, "CostAdjustmentExportDialog");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/cost-adjustments/components/cost-adjustments-import-export-dialogs.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/features/cost-adjustments/components/cost-adjustments-import-export-dialogs.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=_ebe56e22._.js.map