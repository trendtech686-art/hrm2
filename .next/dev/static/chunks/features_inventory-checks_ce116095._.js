(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/features/inventory-checks/store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useInventoryCheckStore",
    ()=>useInventoryCheckStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-client] (ecmascript)");
// REMOVED: import { data as initialData } from './data'; // Mock data no longer used - database is source of truth
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$breadcrumb$2d$generator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/breadcrumb-generator.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/employees/store.ts [app-client] (ecmascript)");
;
;
;
;
;
// Helper to get current user info
const getCurrentUserInfo = ()=>{
    const currentUserSystemId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentUserSystemId"])();
    const employee = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEmployeeStore"].getState().data.find((e)=>e.systemId === currentUserSystemId);
    return {
        systemId: currentUserSystemId || 'SYSTEM',
        name: employee?.fullName || 'Hệ thống',
        avatar: employee?.avatarUrl
    };
};
// Helper to create history entry
const createHistoryEntry = (action, description, metadata)=>({
        id: crypto.randomUUID(),
        action,
        timestamp: new Date(),
        user: getCurrentUserInfo(),
        description,
        metadata
    });
const baseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCrudStore"])([], 'inventory-checks', {
    businessIdField: 'id',
    getCurrentUser: __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentUserSystemId"],
    apiEndpoint: '/api/inventory-checks'
});
// Register for breadcrumb auto-generation
(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$breadcrumb$2d$generator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["registerBreadcrumbStore"])('inventory-checks', ()=>baseStore.getState());
const augmentedMethods = {
    balanceCheck: async (systemId)=>{
        const state = baseStore.getState();
        const check = state.findById(systemId);
        if (!check || check.status !== 'draft') return;
        const currentUserSystemId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentUserSystemId"])();
        const currentEmployeeName = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEmployeeStore"].getState().data.find((e)=>e.systemId === currentUserSystemId)?.fullName || 'Hệ thống';
        // Update inventory for each item
        if (check.items && check.items.length > 0) {
            const [{ useProductStore }, { useStockHistoryStore }] = await Promise.all([
                __turbopack_context__.A("[project]/features/products/store.ts [app-client] (ecmascript, async loader)"),
                __turbopack_context__.A("[project]/features/stock-history/store.ts [app-client] (ecmascript, async loader)")
            ]);
            const productStore = useProductStore.getState();
            const stockHistoryStore = useStockHistoryStore.getState();
            check.items.forEach((item)=>{
                const difference = (item.actualQuantity ?? 0) - (item.systemQuantity ?? 0);
                if (difference === 0) return;
                productStore.updateInventory(item.productSystemId, check.branchSystemId, difference);
                const actionType = difference > 0 ? 'Nhập kho (Kiểm hàng)' : 'Xuất kho (Kiểm hàng)';
                stockHistoryStore.addEntry({
                    productId: item.productSystemId,
                    date: new Date().toISOString(),
                    employeeName: currentEmployeeName,
                    action: actionType,
                    quantityChange: difference,
                    newStockLevel: item.actualQuantity ?? 0,
                    documentId: check.id,
                    branchSystemId: check.branchSystemId,
                    branch: check.branchName || 'Chi nhánh'
                });
            });
        }
        // Add history entry for balance action
        const historyEntry = createHistoryEntry('status_changed', 'Đã cân bằng phiếu kiểm kho', {
            oldValue: 'Nháp',
            newValue: 'Đã cân bằng'
        });
        // Update check status with balanced user and timestamp
        state.update(systemId, {
            ...check,
            status: 'balanced',
            balancedAt: new Date().toISOString(),
            balancedBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(currentUserSystemId),
            activityHistory: [
                ...check.activityHistory || [],
                historyEntry
            ]
        });
    },
    cancelCheck: (systemId, reason)=>{
        const state = baseStore.getState();
        const check = state.findById(systemId);
        if (!check || check.status === 'cancelled') return;
        const statusLabel = check.status === 'draft' ? 'Nháp' : 'Đã cân bằng';
        const historyEntry = createHistoryEntry('cancelled', `Đã hủy phiếu kiểm kho${reason ? `: ${reason}` : ''}`, {
            oldValue: statusLabel,
            newValue: 'Đã hủy',
            note: reason
        });
        state.update(systemId, {
            ...check,
            status: 'cancelled',
            cancelledAt: new Date().toISOString(),
            cancelledBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentUserSystemId"])()),
            cancelledReason: reason ?? '',
            activityHistory: [
                ...check.activityHistory || [],
                historyEntry
            ]
        });
    }
};
const useInventoryCheckStore = ()=>{
    const state = baseStore();
    return {
        ...state,
        ...augmentedMethods
    };
};
useInventoryCheckStore.getState = ()=>{
    const state = baseStore.getState();
    return {
        ...state,
        ...augmentedMethods
    };
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/inventory-checks/columns.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getColumns",
    ()=>getColumns
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/checkbox.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$column$2d$header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/data-table/data-table-column-header.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis.js [app-client] (ecmascript) <export default as MoreHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pencil.js [app-client] (ecmascript) <export default as Pencil>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-x.js [app-client] (ecmascript) <export default as XCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/printer.js [app-client] (ecmascript) <export default as Printer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dropdown-menu.tsx [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
const formatDate = (d)=>d ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDateCustom"])(new Date(d), 'dd/MM/yyyy HH:mm') : '';
const getColumns = (onEdit, onCancel, onBalance, navigate, onPrint)=>[
        // 1 - Select
        {
            id: 'select',
            header: ({ isAllPageRowsSelected, isSomePageRowsSelected, onToggleAll })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Checkbox"], {
                    checked: isAllPageRowsSelected ? true : isSomePageRowsSelected ? 'indeterminate' : false,
                    onCheckedChange: (v)=>onToggleAll?.(!!v)
                }, void 0, false, {
                    fileName: "[project]/features/inventory-checks/columns.tsx",
                    lineNumber: 25,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            cell: ({ onToggleSelect, isSelected })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Checkbox"], {
                    checked: isSelected,
                    onCheckedChange: onToggleSelect
                }, void 0, false, {
                    fileName: "[project]/features/inventory-checks/columns.tsx",
                    lineNumber: 31,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            size: 48,
            meta: {
                displayName: 'Chọn',
                sticky: 'left'
            }
        },
        // 2 - ID (clickable)
        {
            id: 'id',
            accessorKey: 'id',
            header: ({ sorting, setSorting })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$column$2d$header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DataTableColumnHeader"], {
                    title: "Mã",
                    sortKey: "id",
                    isSorted: sorting?.id === 'id',
                    sortDirection: sorting?.desc ? 'desc' : 'asc',
                    onSort: ()=>setSorting?.((s)=>({
                                id: 'id',
                                desc: s.id === 'id' ? !s.desc : false
                            }))
                }, void 0, false, {
                    fileName: "[project]/features/inventory-checks/columns.tsx",
                    lineNumber: 42,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "font-medium text-primary cursor-pointer hover:underline",
                    onClick: ()=>navigate(`/inventory-checks/${row.systemId}`),
                    children: row.id
                }, void 0, false, {
                    fileName: "[project]/features/inventory-checks/columns.tsx",
                    lineNumber: 51,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            meta: {
                displayName: 'Mã phiếu'
            }
        },
        // 3 - Branch
        {
            id: 'branch',
            accessorKey: 'branchName',
            header: 'Chi nhánh',
            cell: ({ row })=>row.branchName,
            meta: {
                displayName: 'Chi nhánh'
            }
        },
        // 4 - Status
        {
            id: 'status',
            accessorKey: 'status',
            header: 'Trạng thái',
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                    variant: row.status === 'balanced' ? 'secondary' : row.status === 'draft' ? 'outline' : 'destructive',
                    children: row.status === 'draft' ? 'Nháp' : row.status === 'balanced' ? 'Đã cân bằng' : 'Đã hủy'
                }, void 0, false, {
                    fileName: "[project]/features/inventory-checks/columns.tsx",
                    lineNumber: 76,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            meta: {
                displayName: 'Trạng thái'
            }
        },
        // 5 - Created At
        {
            id: 'createdAt',
            accessorKey: 'createdAt',
            header: 'Ngày tạo',
            cell: ({ row })=>formatDate(row.createdAt),
            meta: {
                displayName: 'Ngày tạo'
            }
        },
        // 6 - Created By
        {
            id: 'createdBy',
            accessorKey: 'createdBy',
            header: 'Người tạo',
            cell: ({ row })=>row.createdBy,
            meta: {
                displayName: 'Người tạo'
            }
        },
        // 7 - Balanced At
        {
            id: 'balancedAt',
            accessorKey: 'balancedAt',
            header: 'Ngày cân bằng',
            cell: ({ row })=>formatDate(row.balancedAt),
            meta: {
                displayName: 'Ngày cân bằng'
            }
        },
        // 8 - Items count
        {
            id: 'itemsCount',
            header: 'Số dòng',
            cell: ({ row })=>row.items?.length ?? 0,
            meta: {
                displayName: 'Số dòng'
            }
        },
        // 9 - System qty total
        {
            id: 'systemQty',
            header: 'Tổng hệ thống',
            cell: ({ row })=>row.items?.reduce((s, i)=>s + (i.systemQuantity || 0), 0),
            meta: {
                displayName: 'Tổng hệ thống'
            }
        },
        // 10 - Actual qty total
        {
            id: 'actualQty',
            header: 'Tổng thực tế',
            cell: ({ row })=>row.items?.reduce((s, i)=>s + (i.actualQuantity || 0), 0),
            meta: {
                displayName: 'Tổng thực tế'
            }
        },
        // 11 - Difference total
        {
            id: 'difference',
            header: 'Chênh lệch',
            cell: ({ row })=>row.items?.reduce((s, i)=>s + ((i.actualQuantity || 0) - (i.systemQuantity || 0)), 0),
            meta: {
                displayName: 'Chênh lệch'
            }
        },
        // 12 - Item preview
        {
            id: 'itemPreview',
            header: 'Mô tả hàng',
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-[240px] truncate",
                    title: row.items?.map((i)=>i.productName).slice(0, 3).join(', '),
                    children: [
                        row.items?.map((i)=>i.productName).slice(0, 3).join(', '),
                        row.items && row.items.length > 3 ? '...' : ''
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/inventory-checks/columns.tsx",
                    lineNumber: 147,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            meta: {
                displayName: 'Mô tả hàng'
            }
        },
        // 13 - Note
        {
            id: 'note',
            accessorKey: 'note',
            header: 'Ghi chú',
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-[240px] truncate",
                    title: row.note,
                    children: row.note
                }, void 0, false, {
                    fileName: "[project]/features/inventory-checks/columns.tsx",
                    lineNumber: 160,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            meta: {
                displayName: 'Ghi chú'
            }
        },
        // 14 - Actions (sticky right)
        {
            id: 'actions',
            header: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center",
                    children: "Hành động"
                }, void 0, false, {
                    fileName: "[project]/features/inventory-checks/columns.tsx",
                    lineNumber: 168,
                    columnNumber: 19
                }, ("TURBOPACK compile-time value", void 0)),
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenu"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                                asChild: true,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "ghost",
                                    className: "h-8 w-8 p-0",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__["MoreHorizontal"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/features/inventory-checks/columns.tsx",
                                        lineNumber: 174,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/features/inventory-checks/columns.tsx",
                                    lineNumber: 173,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/features/inventory-checks/columns.tsx",
                                lineNumber: 172,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                                align: "end",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                        onClick: ()=>onPrint?.(row),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__["Printer"], {
                                                className: "mr-2 h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/features/inventory-checks/columns.tsx",
                                                lineNumber: 179,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            "In phiếu kiểm"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/inventory-checks/columns.tsx",
                                        lineNumber: 178,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                        onClick: ()=>onEdit(row),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__["Pencil"], {
                                                className: "mr-2 h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/features/inventory-checks/columns.tsx",
                                                lineNumber: 183,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            "Sửa"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/inventory-checks/columns.tsx",
                                        lineNumber: 182,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    row.status === 'draft' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                        onClick: ()=>onBalance(row),
                                        children: "Cân bằng"
                                    }, void 0, false, {
                                        fileName: "[project]/features/inventory-checks/columns.tsx",
                                        lineNumber: 187,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    row.status === 'draft' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                                                fileName: "[project]/features/inventory-checks/columns.tsx",
                                                lineNumber: 193,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                className: "text-destructive",
                                                onClick: ()=>onCancel(row),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"], {
                                                        className: "mr-2 h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/inventory-checks/columns.tsx",
                                                        lineNumber: 195,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    "Hủy phiếu"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/inventory-checks/columns.tsx",
                                                lineNumber: 194,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/inventory-checks/columns.tsx",
                                lineNumber: 177,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/inventory-checks/columns.tsx",
                        lineNumber: 171,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/features/inventory-checks/columns.tsx",
                    lineNumber: 170,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            meta: {
                displayName: 'Hành động',
                sticky: 'right'
            },
            size: 90
        }
    ];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/inventory-checks/card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "InventoryCheckCard",
    ()=>InventoryCheckCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-client] (ecmascript)");
;
;
;
;
function InventoryCheckCard({ item, onEdit, onBalance }) {
    const preview = item.items?.slice(0, 2).map((i)=>i.productName).join(', ');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-4 bg-white rounded shadow-sm",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-start justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "font-medium",
                                children: item.id
                            }, void 0, false, {
                                fileName: "[project]/features/inventory-checks/card.tsx",
                                lineNumber: 19,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-body-sm text-muted-foreground",
                                children: [
                                    item.branchName,
                                    " • ",
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDateCustom"])(new Date(item.createdAt), 'dd/MM/yyyy')
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/inventory-checks/card.tsx",
                                lineNumber: 20,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/inventory-checks/card.tsx",
                        lineNumber: 18,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                            children: item.status === 'draft' ? 'Nháp' : item.status === 'balanced' ? 'Đã cân bằng' : 'Đã hủy'
                        }, void 0, false, {
                            fileName: "[project]/features/inventory-checks/card.tsx",
                            lineNumber: 23,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/features/inventory-checks/card.tsx",
                        lineNumber: 22,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/inventory-checks/card.tsx",
                lineNumber: 17,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-2 text-body-sm text-muted-foreground",
                children: [
                    preview,
                    item.items && item.items.length > 2 ? ` +${item.items.length - 2} khác` : ''
                ]
            }, void 0, true, {
                fileName: "[project]/features/inventory-checks/card.tsx",
                lineNumber: 27,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-3 flex items-center gap-2",
                children: [
                    onEdit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        variant: "outline",
                        className: "h-9",
                        onClick: ()=>onEdit(item),
                        children: "Sửa"
                    }, void 0, false, {
                        fileName: "[project]/features/inventory-checks/card.tsx",
                        lineNumber: 34,
                        columnNumber: 11
                    }, this),
                    onBalance && item.status === 'draft' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        className: "h-9",
                        onClick: ()=>onBalance(item),
                        children: "Cân bằng"
                    }, void 0, false, {
                        fileName: "[project]/features/inventory-checks/card.tsx",
                        lineNumber: 39,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/inventory-checks/card.tsx",
                lineNumber: 32,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/inventory-checks/card.tsx",
        lineNumber: 16,
        columnNumber: 5
    }, this);
}
_c = InventoryCheckCard;
var _c;
__turbopack_context__.k.register(_c, "InventoryCheckCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/inventory-checks/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "InventoryChecksPage",
    ()=>InventoryChecksPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$router$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/router.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$inventory$2d$checks$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/inventory-checks/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$inventory$2d$checks$2f$columns$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/inventory-checks/columns.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$inventory$2d$checks$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/inventory-checks/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$responsive$2d$data$2d$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/data-table/responsive-data-table.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$faceted$2d$filter$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/data-table/data-table-faceted-filter.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$column$2d$toggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/data-table/data-table-column-toggle.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$page$2d$toolbar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/layout/page-toolbar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$page$2d$header$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/page-header-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$breakpoint$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/breakpoint-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.js [app-client] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/printer.js [app-client] (ecmascript) <export default as Printer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-x.js [app-client] (ecmascript) <export default as XCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$scale$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Scale$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/scale.js [app-client] (ecmascript) <export default as Scale>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-spreadsheet.js [app-client] (ecmascript) <export default as FileSpreadsheet>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$generic$2d$import$2d$dialog$2d$v2$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/shared/generic-import-dialog-v2.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$generic$2d$export$2d$dialog$2d$v2$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/shared/generic-export-dialog-v2.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$export$2f$configs$2f$inventory$2d$check$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/import-export/configs/inventory-check.config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$simple$2d$print$2d$options$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/shared/simple-print-options-dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/fuse.js/dist/fuse.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/alert-dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$store$2d$info$2f$store$2d$info$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/store-info/store-info-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$print$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/use-print.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/branches/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2f$inventory$2d$check$2d$print$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/print/inventory-check-print-helper.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$inventory$2d$check$2e$mapper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-mappers/inventory-check.mapper.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
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
function InventoryChecksPage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { isMobile } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$breakpoint$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBreakpoint"])();
    const { employee: currentUser } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const { data, balanceCheck, cancelCheck } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$inventory$2d$checks$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useInventoryCheckStore"])();
    const { info: storeInfo } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$store$2d$info$2f$store$2d$info$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStoreInfoStore"])();
    const { findById: findBranchById, data: branches } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBranchStore"])();
    const { print, printMultiple } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$print$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePrint"])();
    // Print dialog state
    const [isPrintDialogOpen, setIsPrintDialogOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    const [pendingPrintItems, setPendingPrintItems] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]([]);
    // Import/Export dialog state
    const [showImportDialog, setShowImportDialog] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    const [showExportDialog, setShowExportDialog] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    // States
    const [searchQuery, setSearchQuery] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]('');
    const [statusFilter, setStatusFilter] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]('all');
    const [pagination, setPagination] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]({
        pageIndex: 0,
        pageSize: 20
    });
    const [sorting, setSorting] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]({
        id: 'createdAt',
        desc: true
    });
    const [rowSelection, setRowSelection] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]({});
    const [columnVisibility, setColumnVisibility] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]({});
    const [columnOrder, setColumnOrder] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]([]);
    const [pinnedColumns, setPinnedColumns] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]([
        'select',
        'id'
    ]);
    const [mobileLoadedCount, setMobileLoadedCount] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](20);
    const [confirmState, setConfirmState] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](null);
    const [isConfirmLoading, setIsConfirmLoading] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    // Handlers
    const handleEdit = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "InventoryChecksPage.useCallback[handleEdit]": (item)=>{
            router.push(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$router$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ROUTES"].INVENTORY.INVENTORY_CHECK_EDIT.replace(':systemId', item.systemId));
        }
    }["InventoryChecksPage.useCallback[handleEdit]"], [
        router
    ]);
    const requestCancel = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "InventoryChecksPage.useCallback[requestCancel]": (item)=>{
            if (item.status !== 'draft') {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].info('Chỉ có thể hủy phiếu đang ở trạng thái Nháp');
                return;
            }
            setConfirmState({
                type: 'cancel',
                item
            });
        }
    }["InventoryChecksPage.useCallback[requestCancel]"], []);
    const requestBalance = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "InventoryChecksPage.useCallback[requestBalance]": (item)=>{
            setConfirmState({
                type: 'balance',
                item
            });
        }
    }["InventoryChecksPage.useCallback[requestBalance]"], []);
    const handlePrint = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "InventoryChecksPage.useCallback[handlePrint]": (item)=>{
            // Use helper to prepare print data
            const branch = findBranchById(item.branchSystemId);
            const storeSettings = branch ? {
                name: branch.name,
                address: branch.address || '',
                phone: branch.phone || '',
                email: '',
                province: branch.province || ''
            } : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2f$inventory$2d$check$2d$print$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createStoreSettings"])(storeInfo);
            const checkData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2f$inventory$2d$check$2d$print$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["convertInventoryCheckForPrint"])(item, {
                branch
            });
            print('inventory-check', {
                data: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$inventory$2d$check$2e$mapper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mapInventoryCheckToPrintData"])(checkData, storeSettings),
                lineItems: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$inventory$2d$check$2e$mapper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mapInventoryCheckLineItems"])(checkData.items)
            });
        }
    }["InventoryChecksPage.useCallback[handlePrint]"], [
        findBranchById,
        storeInfo,
        print
    ]);
    const handleConfirmAction = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "InventoryChecksPage.useCallback[handleConfirmAction]": async ()=>{
            if (!confirmState) return;
            setIsConfirmLoading(true);
            try {
                if (confirmState.type === 'cancel' && confirmState.item) {
                    cancelCheck((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(confirmState.item.systemId), 'Hủy từ danh sách');
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(`Đã hủy phiếu ${confirmState.item.id}`);
                }
                if (confirmState.type === 'balance' && confirmState.item) {
                    await balanceCheck((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(confirmState.item.systemId));
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(`Đã cân bằng phiếu ${confirmState.item.id}`);
                }
                if (confirmState.type === 'bulk-cancel' && confirmState.items) {
                    let successCount = 0;
                    confirmState.items.forEach({
                        "InventoryChecksPage.useCallback[handleConfirmAction]": (item)=>{
                            if (item.status === 'draft') {
                                cancelCheck((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(item.systemId), 'Hủy hàng loạt');
                                successCount++;
                            }
                        }
                    }["InventoryChecksPage.useCallback[handleConfirmAction]"]);
                    setRowSelection({});
                    if (successCount > 0) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(`Đã hủy ${successCount} phiếu kiểm hàng`);
                    } else {
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].info('Không có phiếu nào được hủy', {
                            description: 'Chỉ có thể hủy các phiếu đang ở trạng thái Nháp'
                        });
                    }
                }
                if (confirmState.type === 'bulk-balance' && confirmState.items) {
                    let successCount = 0;
                    for (const item of confirmState.items){
                        if (item.status === 'draft') {
                            await balanceCheck((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(item.systemId));
                            successCount++;
                        }
                    }
                    setRowSelection({});
                    if (successCount > 0) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(`Đã cân bằng ${successCount} phiếu kiểm hàng`);
                    } else {
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].info('Không có phiếu nào được cân bằng', {
                            description: 'Chỉ có thể cân bằng các phiếu đang ở trạng thái Nháp'
                        });
                    }
                }
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Không thể hoàn tất hành động, vui lòng thử lại');
            } finally{
                setIsConfirmLoading(false);
                setConfirmState(null);
            }
        }
    }["InventoryChecksPage.useCallback[handleConfirmAction]"], [
        balanceCheck,
        cancelCheck,
        confirmState,
        setRowSelection
    ]);
    // Columns
    const columns = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "InventoryChecksPage.useMemo[columns]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$inventory$2d$checks$2f$columns$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getColumns"])(handleEdit, requestCancel, requestBalance, {
                "InventoryChecksPage.useMemo[columns]": (path)=>router.push(path)
            }["InventoryChecksPage.useMemo[columns]"], handlePrint)
    }["InventoryChecksPage.useMemo[columns]"], [
        handleEdit,
        router,
        requestCancel,
        requestBalance,
        handlePrint
    ]);
    // Default column visibility - 15 columns for sticky scrollbar
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "InventoryChecksPage.useEffect": ()=>{
            if (!columns || columns.length === 0) return;
            const defaultVisibleColumns = [
                'id',
                'branch',
                'status',
                'createdAt',
                'createdBy',
                'balancedAt',
                'itemsCount',
                'systemQty',
                'actualQty',
                'difference',
                'itemPreview',
                'note'
            ];
            const initialVisibility = {};
            columns.forEach({
                "InventoryChecksPage.useEffect": (c)=>{
                    if (c.id === 'select' || c.id === 'actions') {
                        initialVisibility[c.id] = true;
                    } else {
                        initialVisibility[c.id] = defaultVisibleColumns.includes(c.id);
                    }
                }
            }["InventoryChecksPage.useEffect"]);
            setColumnVisibility(initialVisibility);
            setColumnOrder(columns.map({
                "InventoryChecksPage.useEffect": (c)=>c.id
            }["InventoryChecksPage.useEffect"]).filter(Boolean));
        }
    }["InventoryChecksPage.useEffect"], [
        columns
    ]);
    // Search & Filter with Fuse.js
    const fuse = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "InventoryChecksPage.useMemo[fuse]": ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](data, {
                keys: [
                    'id',
                    'branchName',
                    'createdBy',
                    'note'
                ],
                threshold: 0.3
            })
    }["InventoryChecksPage.useMemo[fuse]"], [
        data
    ]);
    const filteredData = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "InventoryChecksPage.useMemo[filteredData]": ()=>{
            let result = data;
            // Search
            if (searchQuery) {
                result = fuse.search(searchQuery).map({
                    "InventoryChecksPage.useMemo[filteredData]": (r)=>r.item
                }["InventoryChecksPage.useMemo[filteredData]"]);
            }
            // Status filter
            if (statusFilter !== 'all') {
                result = result.filter({
                    "InventoryChecksPage.useMemo[filteredData]": (item)=>item.status === statusFilter
                }["InventoryChecksPage.useMemo[filteredData]"]);
            }
            // Sorting
            if (sorting) {
                result = [
                    ...result
                ].sort({
                    "InventoryChecksPage.useMemo[filteredData]": (a, b)=>{
                        const aValue = a[sorting.id];
                        const bValue = b[sorting.id];
                        // Special handling for date columns
                        if (sorting.id === 'createdAt' || sorting.id === 'checkDate') {
                            const aTime = aValue ? new Date(aValue).getTime() : 0;
                            const bTime = bValue ? new Date(bValue).getTime() : 0;
                            return sorting.desc ? bTime - aTime : aTime - bTime;
                        }
                        if (aValue < bValue) return sorting.desc ? 1 : -1;
                        if (aValue > bValue) return sorting.desc ? -1 : 1;
                        return 0;
                    }
                }["InventoryChecksPage.useMemo[filteredData]"]);
            }
            return result;
        }
    }["InventoryChecksPage.useMemo[filteredData]"], [
        data,
        searchQuery,
        statusFilter,
        sorting,
        fuse
    ]);
    // Pagination
    const pageCount = Math.ceil(filteredData.length / pagination.pageSize);
    const paginatedData = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "InventoryChecksPage.useMemo[paginatedData]": ()=>{
            const start = pagination.pageIndex * pagination.pageSize;
            return filteredData.slice(start, start + pagination.pageSize);
        }
    }["InventoryChecksPage.useMemo[paginatedData]"], [
        filteredData,
        pagination
    ]);
    // Mobile infinite scroll
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "InventoryChecksPage.useEffect": ()=>{
            setMobileLoadedCount(20);
        }
    }["InventoryChecksPage.useEffect"], [
        searchQuery,
        statusFilter
    ]);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "InventoryChecksPage.useEffect": ()=>{
            if (!isMobile) return;
            const handleScroll = {
                "InventoryChecksPage.useEffect.handleScroll": ()=>{
                    const scrollPercentage = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100;
                    if (scrollPercentage > 80 && mobileLoadedCount < filteredData.length) {
                        setMobileLoadedCount({
                            "InventoryChecksPage.useEffect.handleScroll": (prev)=>Math.min(prev + 20, filteredData.length)
                        }["InventoryChecksPage.useEffect.handleScroll"]);
                    }
                }
            }["InventoryChecksPage.useEffect.handleScroll"];
            window.addEventListener('scroll', handleScroll);
            return ({
                "InventoryChecksPage.useEffect": ()=>window.removeEventListener('scroll', handleScroll)
            })["InventoryChecksPage.useEffect"];
        }
    }["InventoryChecksPage.useEffect"], [
        isMobile,
        mobileLoadedCount,
        filteredData.length
    ]);
    const displayData = isMobile ? filteredData.slice(0, mobileLoadedCount) : paginatedData;
    // Selected rows
    const allSelectedRows = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "InventoryChecksPage.useMemo[allSelectedRows]": ()=>Object.keys(rowSelection).filter({
                "InventoryChecksPage.useMemo[allSelectedRows]": (key)=>rowSelection[key]
            }["InventoryChecksPage.useMemo[allSelectedRows]"]).map({
                "InventoryChecksPage.useMemo[allSelectedRows]": (systemId)=>filteredData.find({
                        "InventoryChecksPage.useMemo[allSelectedRows]": (item)=>item.systemId === systemId
                    }["InventoryChecksPage.useMemo[allSelectedRows]"])
            }["InventoryChecksPage.useMemo[allSelectedRows]"]).filter(Boolean)
    }["InventoryChecksPage.useMemo[allSelectedRows]"], [
        rowSelection,
        filteredData
    ]);
    // Selected checks for export
    const selectedChecks = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "InventoryChecksPage.useMemo[selectedChecks]": ()=>{
            return data.filter({
                "InventoryChecksPage.useMemo[selectedChecks]": (c)=>rowSelection[c.systemId]
            }["InventoryChecksPage.useMemo[selectedChecks]"]);
        }
    }["InventoryChecksPage.useMemo[selectedChecks]"], [
        data,
        rowSelection
    ]);
    // Import handler
    const handleImport = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "InventoryChecksPage.useCallback[handleImport]": async (importedChecks, mode, _branchId)=>{
            let addedCount = 0;
            let updatedCount = 0;
            let skippedCount = 0;
            const errors = [];
            const storeState = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$inventory$2d$checks$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useInventoryCheckStore"].getState();
            importedChecks.forEach({
                "InventoryChecksPage.useCallback[handleImport]": (check, index)=>{
                    try {
                        const existing = data.find({
                            "InventoryChecksPage.useCallback[handleImport].existing": (c)=>c.id.toLowerCase() === (check.id || '').toLowerCase()
                        }["InventoryChecksPage.useCallback[handleImport].existing"]);
                        if (existing) {
                            if (mode === 'update-only' || mode === 'upsert') {
                                storeState.update((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(existing.systemId), {
                                    ...existing,
                                    ...check,
                                    systemId: existing.systemId
                                });
                                updatedCount++;
                            } else {
                                skippedCount++;
                            }
                        } else {
                            if (mode === 'insert-only' || mode === 'upsert') {
                                storeState.add(check);
                                addedCount++;
                            } else {
                                skippedCount++;
                            }
                        }
                    } catch (error) {
                        errors.push({
                            row: index + 1,
                            message: error.message
                        });
                    }
                }
            }["InventoryChecksPage.useCallback[handleImport]"]);
            if (addedCount > 0 || updatedCount > 0) {
                const messages = [];
                if (addedCount > 0) messages.push(`${addedCount} phiếu kiểm kê mới`);
                if (updatedCount > 0) messages.push(`${updatedCount} phiếu cập nhật`);
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(`Đã import: ${messages.join(', ')}`);
            }
            return {
                success: addedCount + updatedCount,
                failed: errors.length,
                inserted: addedCount,
                updated: updatedCount,
                skipped: skippedCount,
                errors
            };
        }
    }["InventoryChecksPage.useCallback[handleImport]"], [
        data
    ]);
    // Bulk print - open dialog
    const handleBulkPrint = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "InventoryChecksPage.useCallback[handleBulkPrint]": ()=>{
            if (allSelectedRows.length === 0) return;
            setPendingPrintItems(allSelectedRows);
            setIsPrintDialogOpen(true);
        }
    }["InventoryChecksPage.useCallback[handleBulkPrint]"], [
        allSelectedRows
    ]);
    // Handle print confirm from dialog
    const handlePrintConfirm = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "InventoryChecksPage.useCallback[handlePrintConfirm]": (options)=>{
            const { branchSystemId, paperSize } = options;
            const printOptionsList = pendingPrintItems.map({
                "InventoryChecksPage.useCallback[handlePrintConfirm].printOptionsList": (item)=>{
                    const branch = branchSystemId ? findBranchById(branchSystemId) : findBranchById(item.branchSystemId);
                    const storeSettings = branch ? {
                        name: branch.name,
                        address: branch.address || '',
                        phone: branch.phone || '',
                        email: '',
                        province: branch.province || ''
                    } : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2f$inventory$2d$check$2d$print$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createStoreSettings"])(storeInfo);
                    const checkData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2f$inventory$2d$check$2d$print$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["convertInventoryCheckForPrint"])(item, {
                        branch
                    });
                    return {
                        data: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$inventory$2d$check$2e$mapper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mapInventoryCheckToPrintData"])(checkData, storeSettings),
                        lineItems: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$inventory$2d$check$2e$mapper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mapInventoryCheckLineItems"])(checkData.items),
                        paperSize
                    };
                }
            }["InventoryChecksPage.useCallback[handlePrintConfirm].printOptionsList"]);
            printMultiple('inventory-check', printOptionsList);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Đã gửi lệnh in', {
                description: pendingPrintItems.map({
                    "InventoryChecksPage.useCallback[handlePrintConfirm]": (i)=>i.id
                }["InventoryChecksPage.useCallback[handlePrintConfirm]"]).join(', ')
            });
            setRowSelection({});
            setPendingPrintItems([]);
        }
    }["InventoryChecksPage.useCallback[handlePrintConfirm]"], [
        pendingPrintItems,
        findBranchById,
        storeInfo,
        printMultiple
    ]);
    // Bulk cancel
    const handleBulkCancel = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "InventoryChecksPage.useCallback[handleBulkCancel]": ()=>{
            if (allSelectedRows.length === 0) return;
            const draftItems = allSelectedRows.filter({
                "InventoryChecksPage.useCallback[handleBulkCancel].draftItems": (item)=>item.status === 'draft'
            }["InventoryChecksPage.useCallback[handleBulkCancel].draftItems"]);
            if (draftItems.length === 0) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].info('Không có phiếu nào có thể hủy', {
                    description: 'Chỉ có thể hủy các phiếu đang ở trạng thái Nháp'
                });
                return;
            }
            setConfirmState({
                type: 'bulk-cancel',
                items: draftItems
            });
        }
    }["InventoryChecksPage.useCallback[handleBulkCancel]"], [
        allSelectedRows
    ]);
    // Bulk balance
    const handleBulkBalance = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "InventoryChecksPage.useCallback[handleBulkBalance]": ()=>{
            if (allSelectedRows.length === 0) return;
            const draftItems = allSelectedRows.filter({
                "InventoryChecksPage.useCallback[handleBulkBalance].draftItems": (item)=>item.status === 'draft'
            }["InventoryChecksPage.useCallback[handleBulkBalance].draftItems"]);
            if (draftItems.length === 0) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].info('Không có phiếu nào có thể cân bằng', {
                    description: 'Chỉ có thể cân bằng các phiếu đang ở trạng thái Nháp'
                });
                return;
            }
            setConfirmState({
                type: 'bulk-balance',
                items: draftItems
            });
        }
    }["InventoryChecksPage.useCallback[handleBulkBalance]"], [
        allSelectedRows
    ]);
    // Bulk actions
    const bulkActions = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "InventoryChecksPage.useMemo[bulkActions]": ()=>[
                {
                    label: 'In phiếu kiểm',
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__["Printer"],
                    onSelect: handleBulkPrint
                },
                {
                    label: 'Cân bằng',
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$scale$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Scale$3e$__["Scale"],
                    onSelect: handleBulkBalance
                },
                {
                    label: 'Hủy phiếu',
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"],
                    onSelect: handleBulkCancel,
                    variant: 'destructive'
                }
            ]
    }["InventoryChecksPage.useMemo[bulkActions]"], [
        handleBulkPrint,
        handleBulkBalance,
        handleBulkCancel
    ]);
    // Header actions - Chỉ giữ action chính
    const headerActions = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "InventoryChecksPage.useMemo[headerActions]": ()=>[
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                    className: "h-9",
                    onClick: {
                        "InventoryChecksPage.useMemo[headerActions]": ()=>router.push(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$router$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ROUTES"].INVENTORY.INVENTORY_CHECK_NEW)
                    }["InventoryChecksPage.useMemo[headerActions]"],
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                            className: "mr-2 h-4 w-4"
                        }, void 0, false, {
                            fileName: "[project]/features/inventory-checks/page.tsx",
                            lineNumber: 435,
                            columnNumber: 7
                        }, this),
                        "Tạo phiếu kiểm hàng"
                    ]
                }, "add", true, {
                    fileName: "[project]/features/inventory-checks/page.tsx",
                    lineNumber: 434,
                    columnNumber: 5
                }, this)
            ]
    }["InventoryChecksPage.useMemo[headerActions]"], [
        router
    ]);
    const confirmDialogCopy = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "InventoryChecksPage.useMemo[confirmDialogCopy]": ()=>{
            if (!confirmState) return null;
            switch(confirmState.type){
                case 'cancel':
                    return {
                        title: 'Hủy phiếu kiểm hàng',
                        description: `Bạn có chắc muốn hủy phiếu ${confirmState.item?.id}? Phiếu sẽ chuyển sang trạng thái Đã hủy.`,
                        confirmLabel: 'Hủy phiếu'
                    };
                case 'balance':
                    return {
                        title: 'Cân bằng phiếu kiểm hàng',
                        description: `Sau khi cân bằng, tồn kho hệ thống sẽ cập nhật theo số thực tế của phiếu ${confirmState.item?.id}. Tiếp tục?`,
                        confirmLabel: 'Cân bằng ngay'
                    };
                case 'bulk-cancel':
                    return {
                        title: 'Hủy nhiều phiếu kiểm hàng',
                        description: `Bạn sắp hủy ${confirmState.items?.length ?? 0} phiếu kiểm hàng đã chọn. Chỉ các phiếu đang ở trạng thái Nháp mới được hủy.`,
                        confirmLabel: `Hủy ${confirmState.items?.length ?? 0} phiếu`
                    };
                case 'bulk-balance':
                    return {
                        title: 'Cân bằng nhiều phiếu kiểm hàng',
                        description: `Bạn sắp cân bằng ${confirmState.items?.length ?? 0} phiếu kiểm hàng. Tồn kho hệ thống sẽ được cập nhật theo số thực tế.`,
                        confirmLabel: `Cân bằng ${confirmState.items?.length ?? 0} phiếu`
                    };
                default:
                    return null;
            }
        }
    }["InventoryChecksPage.useMemo[confirmDialogCopy]"], [
        confirmState
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$page$2d$header$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePageHeader"])({
        title: 'Danh sách kiểm hàng',
        breadcrumb: [
            {
                label: 'Trang chủ',
                href: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$router$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ROUTES"].DASHBOARD,
                isCurrent: false
            },
            {
                label: 'Kiểm hàng',
                href: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$router$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ROUTES"].INVENTORY.INVENTORY_CHECKS,
                isCurrent: true
            }
        ],
        actions: headerActions
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-4",
        children: [
            !isMobile && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$page$2d$toolbar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PageToolbar"], {
                leftActions: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "outline",
                            size: "sm",
                            onClick: ()=>setShowImportDialog(true),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__["FileSpreadsheet"], {
                                    className: "mr-2 h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/features/inventory-checks/page.tsx",
                                    lineNumber: 490,
                                    columnNumber: 17
                                }, void 0),
                                "Nhập file"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/inventory-checks/page.tsx",
                            lineNumber: 489,
                            columnNumber: 15
                        }, void 0),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "outline",
                            size: "sm",
                            onClick: ()=>setShowExportDialog(true),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                    className: "mr-2 h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/features/inventory-checks/page.tsx",
                                    lineNumber: 494,
                                    columnNumber: 17
                                }, void 0),
                                "Xuất Excel"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/inventory-checks/page.tsx",
                            lineNumber: 493,
                            columnNumber: 15
                        }, void 0)
                    ]
                }, void 0, true),
                rightActions: columns && columns.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$column$2d$toggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DataTableColumnCustomizer"], {
                    columns: columns,
                    columnVisibility: columnVisibility,
                    setColumnVisibility: setColumnVisibility,
                    columnOrder: columnOrder,
                    setColumnOrder: setColumnOrder,
                    pinnedColumns: pinnedColumns,
                    setPinnedColumns: setPinnedColumns
                }, void 0, false, {
                    fileName: "[project]/features/inventory-checks/page.tsx",
                    lineNumber: 501,
                    columnNumber: 15
                }, void 0) : null
            }, void 0, false, {
                fileName: "[project]/features/inventory-checks/page.tsx",
                lineNumber: 486,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-2 md:flex-row md:items-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                        placeholder: "Tìm kiếm theo mã, chi nhánh, người tạo...",
                        value: searchQuery,
                        onChange: (e)=>setSearchQuery(e.target.value),
                        className: "h-9 max-w-sm"
                    }, void 0, false, {
                        fileName: "[project]/features/inventory-checks/page.tsx",
                        lineNumber: 517,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$faceted$2d$filter$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DataTableFacetedFilter"], {
                        title: "Trạng thái",
                        selectedValues: new Set(statusFilter === 'all' ? [] : [
                            statusFilter
                        ]),
                        onSelectedValuesChange: (values)=>setStatusFilter(values.size === 0 ? 'all' : Array.from(values)[0]),
                        options: [
                            {
                                label: 'Nháp',
                                value: 'draft'
                            },
                            {
                                label: 'Đã cân bằng',
                                value: 'balanced'
                            },
                            {
                                label: 'Đã hủy',
                                value: 'cancelled'
                            }
                        ]
                    }, void 0, false, {
                        fileName: "[project]/features/inventory-checks/page.tsx",
                        lineNumber: 523,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/inventory-checks/page.tsx",
                lineNumber: 516,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$responsive$2d$data$2d$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResponsiveDataTable"], {
                columns: columns,
                data: displayData,
                renderMobileCard: (item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$inventory$2d$checks$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InventoryCheckCard"], {
                        item: item,
                        onEdit: handleEdit,
                        onBalance: requestBalance
                    }, void 0, false, {
                        fileName: "[project]/features/inventory-checks/page.tsx",
                        lineNumber: 540,
                        columnNumber: 11
                    }, void 0),
                pageCount: pageCount,
                pagination: pagination,
                setPagination: setPagination,
                rowCount: filteredData.length,
                rowSelection: rowSelection,
                setRowSelection: setRowSelection,
                allSelectedRows: allSelectedRows,
                bulkActions: bulkActions,
                showBulkDeleteButton: false,
                sorting: sorting,
                setSorting: setSorting,
                columnVisibility: columnVisibility,
                setColumnVisibility: setColumnVisibility,
                columnOrder: columnOrder,
                setColumnOrder: setColumnOrder,
                pinnedColumns: pinnedColumns,
                setPinnedColumns: setPinnedColumns,
                emptyTitle: "Không có phiếu kiểm hàng",
                emptyDescription: "Tạo phiếu kiểm hàng đầu tiên để bắt đầu"
            }, void 0, false, {
                fileName: "[project]/features/inventory-checks/page.tsx",
                lineNumber: 536,
                columnNumber: 7
            }, this),
            isMobile && mobileLoadedCount < filteredData.length && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "py-6 text-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-center gap-2 text-muted-foreground",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"
                        }, void 0, false, {
                            fileName: "[project]/features/inventory-checks/page.tsx",
                            lineNumber: 571,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-body-sm",
                            children: "Đang tải thêm..."
                        }, void 0, false, {
                            fileName: "[project]/features/inventory-checks/page.tsx",
                            lineNumber: 572,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/inventory-checks/page.tsx",
                    lineNumber: 570,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/inventory-checks/page.tsx",
                lineNumber: 569,
                columnNumber: 9
            }, this),
            isMobile && mobileLoadedCount >= filteredData.length && filteredData.length > 20 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "py-6 text-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-body-sm text-muted-foreground",
                    children: [
                        "Đã hiển thị tất cả ",
                        filteredData.length,
                        " kết quả"
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/inventory-checks/page.tsx",
                    lineNumber: 579,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/inventory-checks/page.tsx",
                lineNumber: 578,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialog"], {
                open: !!confirmState,
                onOpenChange: (open)=>{
                    if (!open && !isConfirmLoading) {
                        setConfirmState(null);
                    }
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogContent"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogHeader"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogTitle"], {
                                    children: confirmDialogCopy?.title
                                }, void 0, false, {
                                    fileName: "[project]/features/inventory-checks/page.tsx",
                                    lineNumber: 592,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogDescription"], {
                                    children: confirmDialogCopy?.description
                                }, void 0, false, {
                                    fileName: "[project]/features/inventory-checks/page.tsx",
                                    lineNumber: 593,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/inventory-checks/page.tsx",
                            lineNumber: 591,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogFooter"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogCancel"], {
                                    className: "h-9",
                                    disabled: isConfirmLoading,
                                    children: "Hủy"
                                }, void 0, false, {
                                    fileName: "[project]/features/inventory-checks/page.tsx",
                                    lineNumber: 598,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogAction"], {
                                    className: "h-9",
                                    disabled: isConfirmLoading,
                                    onClick: handleConfirmAction,
                                    children: isConfirmLoading ? 'Đang xử lý...' : confirmDialogCopy?.confirmLabel ?? 'Đồng ý'
                                }, void 0, false, {
                                    fileName: "[project]/features/inventory-checks/page.tsx",
                                    lineNumber: 601,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/inventory-checks/page.tsx",
                            lineNumber: 597,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/inventory-checks/page.tsx",
                    lineNumber: 590,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/inventory-checks/page.tsx",
                lineNumber: 585,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$simple$2d$print$2d$options$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SimplePrintOptionsDialog"], {
                open: isPrintDialogOpen,
                onOpenChange: setIsPrintDialogOpen,
                onConfirm: handlePrintConfirm,
                selectedCount: pendingPrintItems.length,
                title: "In phiếu kiểm hàng"
            }, void 0, false, {
                fileName: "[project]/features/inventory-checks/page.tsx",
                lineNumber: 613,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$generic$2d$import$2d$dialog$2d$v2$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GenericImportDialogV2"], {
                open: showImportDialog,
                onOpenChange: setShowImportDialog,
                config: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$export$2f$configs$2f$inventory$2d$check$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inventoryCheckImportExportConfig"],
                branches: branches.map((b)=>({
                        systemId: b.systemId,
                        name: b.name
                    })),
                existingData: data,
                onImport: handleImport,
                currentUser: {
                    name: currentUser?.fullName || 'Hệ thống',
                    systemId: currentUser?.systemId || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('SYSTEM')
                }
            }, void 0, false, {
                fileName: "[project]/features/inventory-checks/page.tsx",
                lineNumber: 622,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$generic$2d$export$2d$dialog$2d$v2$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GenericExportDialogV2"], {
                open: showExportDialog,
                onOpenChange: setShowExportDialog,
                config: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$export$2f$configs$2f$inventory$2d$check$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inventoryCheckImportExportConfig"],
                allData: data,
                filteredData: filteredData,
                currentPageData: paginatedData,
                selectedData: selectedChecks,
                currentUser: {
                    name: currentUser?.fullName || 'Hệ thống',
                    systemId: currentUser?.systemId || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('SYSTEM')
                }
            }, void 0, false, {
                fileName: "[project]/features/inventory-checks/page.tsx",
                lineNumber: 636,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/inventory-checks/page.tsx",
        lineNumber: 483,
        columnNumber: 5
    }, this);
}
_s(InventoryChecksPage, "qY+9EzQ7xYd8J032hNrih7v8P2g=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$breakpoint$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBreakpoint"],
        __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$inventory$2d$checks$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useInventoryCheckStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$store$2d$info$2f$store$2d$info$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStoreInfoStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBranchStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$print$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePrint"],
        __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$page$2d$header$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePageHeader"]
    ];
});
_c = InventoryChecksPage;
var _c;
__turbopack_context__.k.register(_c, "InventoryChecksPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=features_inventory-checks_ce116095._.js.map