(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/features/settings/use-settings-page-header.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useSettingsPageHeader",
    ()=>useSettingsPageHeader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings-2.js [app-client] (ecmascript) <export default as Settings2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$page$2d$header$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/page-header-context.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
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
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const { title, icon, docLink, breadcrumb, ...rest } = options;
    const normalizedDocLink = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "useSettingsPageHeader.useMemo[normalizedDocLink]": ()=>{
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
        }
    }["useSettingsPageHeader.useMemo[normalizedDocLink]"], [
        docLink
    ]);
    const decoratedTitle = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "useSettingsPageHeader.useMemo[decoratedTitle]": ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "inline-flex items-center gap-2",
                children: [
                    icon ?? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings2$3e$__["Settings2"], {
                        className: "h-5 w-5 text-muted-foreground",
                        "aria-hidden": "true"
                    }, void 0, false, {
                        fileName: "[project]/features/settings/use-settings-page-header.tsx",
                        lineNumber: 40,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
            }, this)
    }["useSettingsPageHeader.useMemo[decoratedTitle]"], [
        icon,
        title
    ]);
    const normalizedBreadcrumb = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "useSettingsPageHeader.useMemo[normalizedBreadcrumb]": ()=>{
            const custom = (breadcrumb ?? []).map({
                "useSettingsPageHeader.useMemo[normalizedBreadcrumb].custom": (item)=>({
                        ...item,
                        href: item.href || pathname
                    })
            }["useSettingsPageHeader.useMemo[normalizedBreadcrumb].custom"]);
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
            return merged.map({
                "useSettingsPageHeader.useMemo[normalizedBreadcrumb]": (item, index)=>({
                        ...item,
                        isCurrent: index === merged.length - 1
                    })
            }["useSettingsPageHeader.useMemo[normalizedBreadcrumb]"]);
        }
    }["useSettingsPageHeader.useMemo[normalizedBreadcrumb]"], [
        breadcrumb,
        pathname,
        title
    ]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$page$2d$header$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePageHeader"])({
        ...rest,
        breadcrumb: normalizedBreadcrumb,
        title: decoratedTitle,
        docLink: normalizedDocLink
    });
}
_s(useSettingsPageHeader, "r5Bo0I/5rInfgy8zopcGsMUA8Tk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$page$2d$header$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePageHeader"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/order.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Đơn bán hàng - TipTap compatible
 * 
 * QUAN TRỌNG - Quy tắc template:
 * 1. Bảng chứa {line_stt} là bảng line items - sẽ được lặp theo số sản phẩm
 * 2. Các bảng khác là bảng thông tin - không lặp
 * 3. Sử dụng inline styles để đảm bảo hiển thị đúng khi in
 * 
 * CHUẨN TEMPLATE v2 (2025-12-08):
 * - Header: Logo trái + Store info phải (dạng table)
 * - Title: Căn giữa, border-bottom
 * - Info table: Label 22% nền xám
 * - Product table: table-layout fixed, responsive
 * - Summary: 250px căn phải
 * - Footer: border-top dashed, font nhỏ
 */ __turbopack_context__.s([
    "ORDER_TEMPLATE",
    ()=>ORDER_TEMPLATE
]);
const ORDER_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER: Logo trái + Thông tin cửa hàng phải -->
<table style="width: 100%; margin-bottom: 12px; border-collapse: collapse;">
  <tr>
    <td style="width: 70px; vertical-align: top; padding-right: 10px;">{store_logo}</td>
    <td style="vertical-align: top;">
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
      <div style="font-size: 11px; color: #333;">{store_address}</div>
      <div style="font-size: 11px; color: #333;">ĐT: {store_phone_number} | Email: {store_email}</div>
    </td>
  </tr>
</table>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 12px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 8px;">HÓA ĐƠN BÁN HÀNG</h2>
<div style="text-align: center; margin-bottom: 12px; font-size: 11px;">
  <div>Số: <strong>{order_code}</strong></div>
  <div>Ngày: {created_on} {created_on_time}</div>
</div>

<!-- THÔNG TIN KHÁCH HÀNG -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Khách hàng:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;"><strong>{customer_name}</strong></td>
      <td style="padding: 4px 6px; width: 18%; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Mã KH:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{customer_code}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Điện thoại:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{customer_phone_number}</td>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Nhóm KH:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{customer_group}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Địa chỉ:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;" colspan="3">{billing_address}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">ĐC giao hàng:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;" colspan="3">{shipping_address}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">NV bán:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{account_name}</td>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Trạng thái:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{order_status}</td>
    </tr>
  </tbody>
</table>

<!-- BẢNG SẢN PHẨM - Responsive với table-layout fixed -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: center; width: 28px; font-size: 10px;">STT</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: left; font-size: 10px;">Tên sản phẩm</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: center; width: 32px; font-size: 10px;">ĐVT</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: center; width: 28px; font-size: 10px;">SL</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: right; width: 65px; font-size: 10px;">Đơn giá</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: right; width: 50px; font-size: 10px;">VAT</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: right; width: 45px; font-size: 10px;">CK</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: right; width: 70px; font-size: 10px;">Thành tiền</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: center; font-size: 10px;">{line_stt}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; font-size: 10px; word-wrap: break-word;">{line_product_name}<br><small style="color: #666;">{line_variant}</small></td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: center; font-size: 10px;">{line_unit}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: center; font-size: 10px; font-weight: bold;">{line_quantity}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: right; font-size: 10px;">{line_price}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: right; font-size: 10px;">{line_tax_amount}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: right; font-size: 10px;">{line_discount_amount}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: right; font-size: 10px;">{line_amount}</td>
    </tr>
  </tbody>
</table>

<!-- BẢNG TỔNG GIÁ TRỊ -->
<table style="width: 250px; margin-left: auto; border-collapse: collapse; margin-bottom: 10px;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Tổng số lượng:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; width: 85px; font-size: 11px;"><strong>{total_quantity}</strong></td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Tổng tiền hàng:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px;">{total}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Chiết khấu:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px;">{total_discount}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Thuế:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px;">{total_tax}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Phí giao hàng:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px;">{delivery_fee}</td>
    </tr>
    <tr style="background: #f5f5f5;">
      <td style="padding: 5px 6px; border: 1px solid #333; font-size: 11px;"><strong>TỔNG CỘNG:</strong></td>
      <td style="padding: 5px 6px; border: 1px solid #333; text-align: right; font-size: 11px;"><strong>{total_amount}</strong></td>
    </tr>
  </tbody>
</table>

<!-- BẰNG CHỮ -->
<p style="margin: 8px 0; font-size: 11px;"><strong>Bằng chữ:</strong> <em>{total_text}</em></p>

<!-- THANH TOÁN -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Phương thức TT:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{payment_name}</td>
      <td style="padding: 4px 6px; width: 18%; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">TT thanh toán:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{payment_status}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Khách đưa:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{payment_customer}</td>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Tiền thừa:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{money_return}</td>
    </tr>
  </tbody>
</table>

<!-- GHI CHÚ -->
<div style="margin: 8px 0; padding: 8px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">
  <strong>Ghi chú:</strong> {order_note}
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 25px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 8px; vertical-align: top;">
        <div style="font-weight: bold; font-size: 11px;">Người mua hàng</div>
        <div style="color: #888; font-size: 10px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 50px;"></div>
        <div style="font-size: 11px;">{customer_name}</div>
      </td>
      <td style="width: 50%; text-align: center; padding: 8px; vertical-align: top;">
        <div style="font-weight: bold; font-size: 11px;">Người bán hàng</div>
        <div style="color: #888; font-size: 10px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 50px;"></div>
        <div style="font-size: 11px;">{account_name}</div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 10px; color: #666;">
  <div>Cảm ơn quý khách đã mua hàng!</div>
  <div>Hotline: {store_phone_number} | In lúc: {print_date} {print_time}</div>
</div>

</div>
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/quote.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu báo giá / Đơn tạm tính - TipTap compatible
 * Cập nhật: Thiết kế đen trắng cho máy in
 */ __turbopack_context__.s([
    "QUOTE_TEMPLATE",
    ()=>QUOTE_TEMPLATE
]);
const QUOTE_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="width: 80px; vertical-align: top;">{store_logo}</td>
    <td style="vertical-align: top;">
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
      <div>{store_address}</div>
      <div>ĐT: {store_phone_number} | Email: {store_email}</div>
    </td>
  </tr>
</table>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU BÁO GIÁ</h2>
<div style="text-align: center; margin-bottom: 10px;">
  <div>Số: <strong>{order_code}</strong></div>
  <div>Ngày: {created_on} {created_on_time}</div>
  <div style="font-style: italic;">Hiệu lực đến: {issued_on}</div>
</div>

<!-- THÔNG TIN KHÁCH HÀNG -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Khách hàng:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{customer_name}</strong></td>
      <td style="padding: 5px; width: 15%; background: #f5f5f5; border: 1px solid #333;">Mã KH:</td>
      <td style="padding: 5px; border: 1px solid #333;">{customer_code}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Điện thoại:</td>
      <td style="padding: 5px; border: 1px solid #333;">{customer_phone_number}</td>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Email:</td>
      <td style="padding: 5px; border: 1px solid #333;">{customer_email}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Địa chỉ:</td>
      <td style="padding: 5px; border: 1px solid #333;" colspan="3">{billing_address}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Nhân viên:</td>
      <td style="padding: 5px; border: 1px solid #333;">{account_name}</td>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Chính sách giá:</td>
      <td style="padding: 5px; border: 1px solid #333;">{price_list_name}</td>
    </tr>
  </tbody>
</table>

<!-- BẢNG SẢN PHẨM -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 40px;">STT</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: left;">Tên sản phẩm</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 60px;">ĐVT</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 50px;">SL</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: right; width: 100px;">Đơn giá</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: right; width: 80px;">CK</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: right; width: 110px;">Thành tiền</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_stt}</td>
      <td style="padding: 6px; border: 1px solid #333;">{line_product_name}<br><small>{line_variant}</small></td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_unit}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_quantity}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: right;">{line_price}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: right;">{line_discount_amount}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: right;">{line_amount}</td>
    </tr>
  </tbody>
</table>

<!-- TỔNG GIÁ TRỊ -->
<table style="width: 250px; margin-left: auto; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Tổng tiền hàng:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right; width: 120px;">{total}</td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Chiết khấu:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;">{total_discount}</td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Thuế VAT:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;">{total_tax}</td>
    </tr>
    <tr style="background: #f5f5f5;">
      <td style="padding: 5px; border: 1px solid #333;"><strong>TỔNG CỘNG:</strong></td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;"><strong>{total_amount}</strong></td>
    </tr>
  </tbody>
</table>

<p style="margin: 10px 0;"><strong>Bằng chữ:</strong> <em>{total_text}</em></p>

<!-- GHI CHÚ -->
<div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {order_note}
</div>

<!-- ĐIỀU KHOẢN -->
<div style="margin-bottom: 10px; padding: 10px; border: 1px solid #333; font-size: 11px;">
  <strong>Điều khoản:</strong>
  <ul style="margin: 5px 0 0 15px; padding: 0;">
    <li>Báo giá có hiệu lực trong 7 ngày kể từ ngày lập</li>
    <li>Giá trên chưa bao gồm phí vận chuyển (nếu có)</li>
    <li>Thanh toán: Theo thỏa thuận</li>
  </ul>
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 10px;">
        <strong>Khách hàng</strong><br>
        <em>(Ký xác nhận đồng ý)</em><br>
        <div style="height: 50px;"></div>
        {customer_name}
      </td>
      <td style="width: 50%; text-align: center; padding: 10px;">
        <strong>Nhân viên báo giá</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
        {account_name}
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333;">
  <p style="margin: 5px 0;">Cảm ơn Quý khách đã quan tâm!</p>
  <p style="margin: 5px 0;">Liên hệ: {store_phone_number}</p>

  <div style="font-size: 10px; color: #666; margin-top: 5px;">In lúc: {print_date} {print_time}</div></div>

</div>
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/receipt.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu thu - TipTap compatible
 * Cập nhật: Thiết kế đen trắng cho máy in
 */ __turbopack_context__.s([
    "RECEIPT_TEMPLATE",
    ()=>RECEIPT_TEMPLATE
]);
const RECEIPT_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="width: 80px; vertical-align: top;">{store_logo}</td>
    <td style="vertical-align: top;">
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
      <div>{store_address}</div>
    </td>
  </tr>
</table>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU THU</h2>
<div style="text-align: center; margin-bottom: 10px;">
  <div>Số: <strong>{receipt_voucher_code}</strong></div>
  <div>Ngày: {created_on}</div>
</div>

<!-- MÃ VẠCH -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="text-align: center; padding: 10px; border: 1px solid #333; background: #f5f5f5;">
      <div style="margin-bottom: 8px;">{receipt_barcode}</div>
      <div style="font-family: monospace;">{receipt_voucher_code}</div>
    </td>
  </tr>
</table>

<!-- THÔNG TIN PHIẾU THU -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Người nộp tiền:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{object_name}</strong></td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Địa chỉ:</td>
      <td style="padding: 5px; border: 1px solid #333;">{object_address}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Lý do nộp:</td>
      <td style="padding: 5px; border: 1px solid #333;">{description}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Hình thức thanh toán:</td>
      <td style="padding: 5px; border: 1px solid #333;">{payment_method}</td>
    </tr>
  </tbody>
</table>

<!-- SỐ TIỀN -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="text-align: center; padding: 15px; border: 2px solid #333;">
      <div style="margin-bottom: 8px;">Số tiền</div>
      <div style="font-size: 24px; font-weight: bold;">{amount}</div>
      <div style="font-style: italic; margin-top: 8px;">({amount_text})</div>
    </td>
  </tr>
</table>

<!-- GHI CHÚ -->
<div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {note}
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Người nộp tiền</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
        {object_name}
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Thủ quỹ</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Người lập phiếu</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
        {account_name}
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 11px;">
  In lúc: {print_date} {print_time}
</div>

</div>
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/payment.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu chi - TipTap compatible
 * Cập nhật: Thiết kế đen trắng cho máy in
 */ __turbopack_context__.s([
    "PAYMENT_TEMPLATE",
    ()=>PAYMENT_TEMPLATE
]);
const PAYMENT_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="width: 80px; vertical-align: top;">{store_logo}</td>
    <td style="vertical-align: top;">
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
      <div>{store_address}</div>
    </td>
  </tr>
</table>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU CHI</h2>
<div style="text-align: center; margin-bottom: 10px;">
  <div>Số: <strong>{payment_voucher_code}</strong></div>
  <div>Ngày: {created_on}</div>
</div>

<!-- MÃ VẠCH -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="text-align: center; padding: 10px; border: 1px solid #333; background: #f5f5f5;">
      <div style="margin-bottom: 8px;">{payment_barcode}</div>
      <div style="font-family: monospace;">{payment_voucher_code}</div>
    </td>
  </tr>
</table>

<!-- THÔNG TIN PHIẾU CHI -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Người nhận tiền:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{object_name}</strong></td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Địa chỉ:</td>
      <td style="padding: 5px; border: 1px solid #333;">{object_address}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Lý do chi:</td>
      <td style="padding: 5px; border: 1px solid #333;">{description}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Hình thức thanh toán:</td>
      <td style="padding: 5px; border: 1px solid #333;">{payment_method}</td>
    </tr>
  </tbody>
</table>

<!-- SỐ TIỀN -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="text-align: center; padding: 15px; border: 2px solid #333;">
      <div style="margin-bottom: 8px;">Số tiền</div>
      <div style="font-size: 24px; font-weight: bold;">{amount}</div>
      <div style="font-style: italic; margin-top: 8px;">({amount_text})</div>
    </td>
  </tr>
</table>

<!-- GHI CHÚ -->
<div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {note}
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Người nhận tiền</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
        {object_name}
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Thủ quỹ</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Người lập phiếu</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
        {account_name}
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 11px;">
  In lúc: {print_date} {print_time}
</div>

</div>
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/warranty.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu bảo hành - TipTap compatible
 * Cập nhật: Thiết kế đen trắng cho máy in
 */ __turbopack_context__.s([
    "WARRANTY_TEMPLATE",
    ()=>WARRANTY_TEMPLATE
]);
const WARRANTY_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="width: 80px; vertical-align: top;">{store_logo}</td>
    <td style="vertical-align: top;">
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
      <div>{store_address}</div>
      <div>Hotline: <strong>{store_phone_number}</strong></div>
    </td>
  </tr>
</table>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU BẢO HÀNH</h2>
<div style="text-align: center; margin-bottom: 10px;">
  <div>Mã phiếu: <strong>{warranty_code}</strong></div>
  <div>Ngày: {created_on}</div>
</div>

<!-- THÔNG TIN KHÁCH HÀNG -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Khách hàng:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{customer_name}</strong></td>
      <td style="padding: 5px; width: 15%; background: #f5f5f5; border: 1px solid #333;">SĐT:</td>
      <td style="padding: 5px; border: 1px solid #333;">{customer_phone_number}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Địa chỉ:</td>
      <td style="padding: 5px; border: 1px solid #333;" colspan="3">{customer_address}</td>
    </tr>
  </tbody>
</table>

<!-- THÔNG TIN SẢN PHẨM BẢO HÀNH -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed; border: 2px solid #333;">
  <tbody>
    <tr>
      <td style="padding: 8px; width: 25%; background: #f5f5f5; border: 1px solid #333;">Sản phẩm:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{product_name}</strong></td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333;">Serial/IMEI:</td>
      <td style="padding: 8px; border: 1px solid #333; font-family: monospace; font-size: 14px;">{serial_number}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333;">Thời hạn BH:</td>
      <td style="padding: 8px; border: 1px solid #333;">{warranty_duration}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333;">Ngày hết hạn:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{warranty_expired_on}</strong></td>
    </tr>
  </tbody>
</table>

<!-- QUY ĐỊNH BẢO HÀNH -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tr>
    <td style="width: 50%; padding: 10px; border: 1px solid #333; vertical-align: top;">
      <strong>ĐƯỢC BẢO HÀNH:</strong>
      <div style="padding-left: 10px; margin-top: 5px;">
        <div>- Còn trong thời hạn bảo hành</div>
        <div>- Tem bảo hành còn nguyên vẹn</div>
        <div>- Hư hỏng do lỗi kỹ thuật từ NSX</div>
      </div>
    </td>
    <td style="width: 50%; padding: 10px; border: 1px solid #333; vertical-align: top;">
      <strong>TỪ CHỐI BẢO HÀNH:</strong>
      <div style="padding-left: 10px; margin-top: 5px;">
        <div>- Rơi vỡ, trầy xước, biến dạng</div>
        <div>- Vào nước, ẩm, cháy, nổ</div>
        <div>- Tự ý tháo lắp, sửa chữa</div>
        <div>- Sử dụng sai cách, cố ý làm hư</div>
      </div>
    </td>
  </tr>
</table>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 10px;">
        <strong>Khách hàng</strong><br>
        <em>(Ký xác nhận)</em><br>
        <div style="height: 50px;"></div>
        {customer_name}
      </td>
      <td style="width: 50%; text-align: center; padding: 10px;">
        <strong>Nhân viên</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
        {account_name}
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 11px;">
  Cảm ơn quý khách đã tin tưởng sử dụng dịch vụ của chúng tôi!

  <div style="font-size: 10px; color: #666; margin-top: 5px;">In lúc: {print_date} {print_time}</div></div>

</div>
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/inventory-check.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu kiểm kho - TipTap compatible
 * Cập nhật: Thiết kế đen trắng cho máy in
 */ __turbopack_context__.s([
    "INVENTORY_CHECK_TEMPLATE",
    ()=>INVENTORY_CHECK_TEMPLATE
]);
const INVENTORY_CHECK_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="width: 80px; vertical-align: top;">{store_logo}</td>
    <td style="vertical-align: top;">
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
      <div>{store_address}</div>
    </td>
  </tr>
</table>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU KIỂM KHO</h2>
<div style="text-align: center; margin-bottom: 10px;">
  <div>Mã phiếu: <strong>{inventory_code}</strong></div>
  <div>Ngày kiểm: {created_on}</div>
</div>

<!-- THÔNG TIN KHO -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Kho kiểm:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{location_name}</strong></td>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Trạng thái:</td>
      <td style="padding: 5px; border: 1px solid #333;">{inventory_status}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Người kiểm:</td>
      <td style="padding: 5px; border: 1px solid #333;" colspan="3">{account_name}</td>
    </tr>
  </tbody>
</table>

<!-- BẢNG SẢN PHẨM -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 40px;">STT</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 100px;">Mã SP</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: left;">Tên sản phẩm</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 70px;">Tồn kho</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 70px;">Thực tế</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 60px;">Lệch</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: left; width: 100px;">Ghi chú</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_stt}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center; font-family: monospace;">{line_variant_code}</td>
      <td style="padding: 6px; border: 1px solid #333;">{line_product_name}<br><small>{line_variant}</small></td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_on_hand}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center; font-weight: bold;">{line_real_quantity}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center; font-weight: bold;">{line_difference}</td>
      <td style="padding: 6px; border: 1px solid #333; font-size: 11px;">{line_note}</td>
    </tr>
  </tbody>
</table>

<!-- TỔNG KẾT -->
<table style="width: 250px; margin-left: auto; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Tổng số SP kiểm:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right; width: 80px;"><strong>{total_items}</strong></td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Chênh lệch (thừa):</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;"><strong>+{total_surplus}</strong></td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Chênh lệch (thiếu):</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;"><strong>-{total_shortage}</strong></td>
    </tr>
  </tbody>
</table>

<!-- GHI CHÚ -->
<div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {note}
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 10px;">
        <strong>Người kiểm kho</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
        {account_name}
      </td>
      <td style="width: 50%; text-align: center; padding: 10px;">
        <strong>Thủ kho</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 11px;">
  In lúc: {print_date} {print_time}
</div>

</div>
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/stock-transfer.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu chuyển kho - TipTap compatible
 * Cập nhật: Thiết kế đen trắng cho máy in
 */ __turbopack_context__.s([
    "STOCK_TRANSFER_TEMPLATE",
    ()=>STOCK_TRANSFER_TEMPLATE
]);
const STOCK_TRANSFER_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="width: 80px; vertical-align: top;">{store_logo}</td>
    <td style="vertical-align: top;">
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
      <div>{store_address}</div>
    </td>
  </tr>
</table>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU CHUYỂN KHO</h2>
<div style="text-align: center; margin-bottom: 10px;">
  <div>Mã phiếu: <strong>{transfer_code}</strong></div>
  <div>Ngày: {created_on}</div>
</div>

<!-- THÔNG TIN CHUYỂN KHO -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 10px; width: 45%; border: 2px solid #333; text-align: center;">
        <div style="font-size: 12px;">KHO XUẤT</div>
        <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{source_location_name}</div>
      </td>
      <td style="padding: 10px; text-align: center; font-size: 20px; width: 10%;">--&gt;</td>
      <td style="padding: 10px; width: 45%; border: 2px solid #333; text-align: center;">
        <div style="font-size: 12px;">KHO NHẬP</div>
        <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{target_location_name}</div>
      </td>
    </tr>
  </tbody>
</table>

<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Trạng thái:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{status}</strong></td>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Người tạo:</td>
      <td style="padding: 5px; border: 1px solid #333;">{account_name}</td>
    </tr>
  </tbody>
</table>

<!-- BẢNG SẢN PHẨM -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 40px;">STT</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 100px;">Mã SP</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: left;">Tên sản phẩm</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 60px;">ĐVT</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 80px;">Số lượng</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 40px;">OK</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_stt}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center; font-family: monospace;">{line_variant_code}</td>
      <td style="padding: 6px; border: 1px solid #333;">{line_product_name}<br><small>{line_variant}</small></td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_unit}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center; font-weight: bold;">{line_quantity}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;"><div style="width: 16px; height: 16px; border: 1px solid #333; margin: 0 auto;"></div></td>
    </tr>
  </tbody>
</table>

<!-- TỔNG CỘNG -->
<table style="width: 250px; margin-left: auto; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr style="background: #f5f5f5;">
      <td style="padding: 5px; border: 1px solid #333;"><strong>Tổng số lượng:</strong></td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;"><strong>{total_quantity}</strong></td>
    </tr>
  </tbody>
</table>

<!-- GHI CHÚ -->
<div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {note}
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Người lập phiếu</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
        {account_name}
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Thủ kho xuất</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Thủ kho nhập</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 11px;">
  In lúc: {print_date} {print_time}
</div>

</div>
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/sales-return.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu trả hàng - TipTap compatible
 * Cập nhật: Thiết kế đen trắng cho máy in
 */ __turbopack_context__.s([
    "SALES_RETURN_TEMPLATE",
    ()=>SALES_RETURN_TEMPLATE
]);
const SALES_RETURN_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="width: 80px; vertical-align: top;">{store_logo}</td>
    <td style="vertical-align: top;">
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
      <div>{store_address}</div>
    </td>
  </tr>
</table>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU TRẢ HÀNG</h2>
<div style="text-align: center; margin-bottom: 10px;">
  <div>Số: <strong>{order_return_code}</strong></div>
  <div>Đơn hàng gốc: <strong>{order_code}</strong></div>
  <div>Ngày: {created_on}</div>
</div>

<!-- THÔNG TIN KHÁCH HÀNG -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Khách hàng:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{customer_name}</strong></td>
      <td style="padding: 5px; width: 15%; background: #f5f5f5; border: 1px solid #333;">SĐT:</td>
      <td style="padding: 5px; border: 1px solid #333;">{customer_phone_number}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Lý do trả:</td>
      <td style="padding: 5px; border: 1px solid #333;" colspan="3"><strong>{reason_return}</strong></td>
    </tr>
  </tbody>
</table>

<!-- BẢNG SẢN PHẨM TRẢ -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 40px;">STT</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 100px;">Mã SP</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: left;">Tên sản phẩm</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 60px;">ĐVT</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 60px;">SL Trả</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: right; width: 100px;">Đơn giá</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: right; width: 110px;">Thành tiền</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_stt}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center; font-family: monospace;">{line_variant_code}</td>
      <td style="padding: 6px; border: 1px solid #333;">{line_product_name}<br><small>{line_variant}</small></td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_unit}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center; font-weight: bold;">{line_quantity}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: right;">{line_price}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: right;">{line_total}</td>
    </tr>
  </tbody>
</table>

<!-- TỔNG TIỀN HOÀN -->
<table style="width: 250px; margin-left: auto; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Tổng số lượng trả:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right; width: 100px;"><strong>{total_quantity}</strong></td>
    </tr>
    <tr style="background: #f5f5f5;">
      <td style="padding: 5px; border: 1px solid #333;"><strong>TỔNG TIỀN HOÀN:</strong></td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;"><strong>{total}</strong></td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Trạng thái hoàn:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;">{refund_status}</td>
    </tr>
  </tbody>
</table>

<!-- GHI CHÚ -->
<div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {note}
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 10px;">
        <strong>Khách hàng</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
        {customer_name}
      </td>
      <td style="width: 50%; text-align: center; padding: 10px;">
        <strong>Người nhận hàng trả</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
        {account_name}
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 11px;">
  Hotline: {store_phone_number}

  <div style="font-size: 10px; color: #666; margin-top: 5px;">In lúc: {print_date} {print_time}</div></div>

</div>
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/purchase-order.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Đơn đặt hàng nhập - TipTap compatible
 * Cập nhật: Thiết kế đen trắng cho máy in
 */ __turbopack_context__.s([
    "PURCHASE_ORDER_TEMPLATE",
    ()=>PURCHASE_ORDER_TEMPLATE
]);
const PURCHASE_ORDER_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="width: 80px; vertical-align: top;">{store_logo}</td>
    <td style="vertical-align: top;">
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
      <div>{store_address}</div>
    </td>
  </tr>
</table>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 10px;">ĐƠN ĐẶT HÀNG NHẬP</h2>
<div style="text-align: center; margin-bottom: 10px;">
  <div>Số: <strong>{order_supplier_code}</strong></div>
  <div>Ngày: {created_on}</div>
</div>

<!-- THÔNG TIN NHÀ CUNG CẤP -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Nhà cung cấp:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{supplier_name}</strong></td>
      <td style="padding: 5px; width: 15%; background: #f5f5f5; border: 1px solid #333;">Mã NCC:</td>
      <td style="padding: 5px; border: 1px solid #333; font-family: monospace;">{supplier_code}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Điện thoại:</td>
      <td style="padding: 5px; border: 1px solid #333;">{supplier_phone_number}</td>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Email:</td>
      <td style="padding: 5px; border: 1px solid #333;">{supplier_email}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Địa chỉ:</td>
      <td style="padding: 5px; border: 1px solid #333;" colspan="3">{supplier_address}</td>
    </tr>
  </tbody>
</table>

<!-- BẢNG SẢN PHẨM -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 40px;">STT</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 100px;">Mã SP</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: left;">Tên sản phẩm</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 60px;">ĐVT</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 60px;">SL Đặt</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: right; width: 100px;">Đơn giá</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: right; width: 110px;">Thành tiền</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_stt}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center; font-family: monospace;">{line_variant_code}</td>
      <td style="padding: 6px; border: 1px solid #333;">{line_product_name}<br><small>{line_variant}</small></td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_unit}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_ordered_quantity}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: right;">{line_price}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: right;">{line_total}</td>
    </tr>
  </tbody>
</table>

<!-- TỔNG TIỀN -->
<table style="width: 250px; margin-left: auto; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Tổng tiền hàng:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right; width: 100px;">{total}</td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Chiết khấu:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;">{discount}</td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Thuế VAT:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;">{tax_vat}</td>
    </tr>
    <tr style="background: #f5f5f5;">
      <td style="padding: 5px; border: 1px solid #333;"><strong>TỔNG CỘNG:</strong></td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;"><strong>{total_order}</strong></td>
    </tr>
  </tbody>
</table>

<!-- GHI CHÚ -->
<div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {note}
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 10px;">
        <strong>Người lập đơn</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
        {account_name}
      </td>
      <td style="width: 50%; text-align: center; padding: 10px;">
        <strong>Duyệt đơn</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 11px;">
  In lúc: {print_date} {print_time}
</div>

</div>
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/packing.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu đóng gói - TipTap compatible
 * Cập nhật: 2025-12-08 - Responsive + Chuẩn hóa
 */ __turbopack_context__.s([
    "PACKING_TEMPLATE",
    ()=>PACKING_TEMPLATE
]);
const PACKING_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<table style="width: 100%; margin-bottom: 12px; border-collapse: collapse;">
  <tr>
    <td style="width: 70px; vertical-align: top; padding-right: 10px;">{store_logo}</td>
    <td style="vertical-align: top;">
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
      <div style="font-size: 11px; color: #333;">{store_address}</div>
    </td>
  </tr>
</table>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 12px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 8px;">PHIẾU ĐÓNG GÓI</h2>
<div style="text-align: center; margin-bottom: 12px; font-size: 11px;">
  <div>Mã: <strong>{fulfillment_code}</strong> | Đơn hàng: <strong>{order_code}</strong></div>
  <div>Ngày: {created_on}</div>
</div>

<!-- THÔNG TIN -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Khách hàng:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;"><strong>{customer_name}</strong></td>
      <td style="padding: 4px 6px; width: 15%; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">SĐT:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{customer_phone_number}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Địa chỉ giao:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;" colspan="3">{shipping_address}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">NV được gán:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;" colspan="3">{assigned_employee}</td>
    </tr>
  </tbody>
</table>

<!-- BẢNG SẢN PHẨM - Responsive -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: center; width: 28px; font-size: 10px;">STT</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: center; width: 70px; font-size: 10px;">Mã SP</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: left; font-size: 10px;">Tên sản phẩm</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: center; width: 35px; font-size: 10px;">SL</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: center; width: 55px; font-size: 10px;">Vị trí</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: left; width: 70px; font-size: 10px;">Ghi chú</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: center; width: 28px; font-size: 10px;">OK</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: center; font-size: 10px;">{line_stt}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: center; font-family: monospace; font-size: 9px;">{line_variant_code}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; font-size: 10px; word-wrap: break-word;">{line_product_name}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: center; font-weight: bold; font-size: 11px;">{line_quantity}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: center; font-size: 10px;">{bin_location}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; font-size: 9px;">{line_note}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: center;"><div style="width: 14px; height: 14px; border: 1px solid #333; margin: 0 auto;"></div></td>
    </tr>
  </tbody>
</table>

<!-- TỔNG CỘNG VÀ COD -->
<table style="width: 220px; margin-left: auto; border-collapse: collapse; margin-bottom: 10px;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Tổng số lượng:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; width: 75px; font-size: 11px;"><strong>{total_quantity}</strong></td>
    </tr>
    <tr style="background: #f5f5f5;">
      <td style="padding: 5px 6px; border: 1px solid #333; font-size: 11px;"><strong>COD - THU HỘ:</strong></td>
      <td style="padding: 5px 6px; border: 1px solid #333; text-align: right; font-size: 11px;"><strong>{cod}</strong></td>
    </tr>
  </tbody>
</table>

<!-- GHI CHÚ -->
<div style="margin: 8px 0; padding: 8px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">
  <strong>Ghi chú đóng gói:</strong> {packing_note}
</div>
<div style="margin: 8px 0; padding: 8px; border: 1px solid #333; font-size: 11px;">
  <strong>Ghi chú đơn hàng:</strong> {order_note}
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 25px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 8px; vertical-align: top;">
        <div style="font-weight: bold; font-size: 11px;">Người đóng gói</div>
        <div style="color: #888; font-size: 10px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 50px;"></div>
        <div style="font-size: 11px;">{account_name}</div>
      </td>
      <td style="width: 50%; text-align: center; padding: 8px; vertical-align: top;">
        <div style="font-weight: bold; font-size: 11px;">Kiểm tra</div>
        <div style="color: #888; font-size: 10px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 50px;"></div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 10px; color: #666;">
  In lúc: {print_date} {print_time}
</div>

</div>
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/delivery.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu giao hàng - TipTap compatible
 * Cập nhật: 2025-12-08 - Responsive + Chuẩn hóa
 */ __turbopack_context__.s([
    "DELIVERY_TEMPLATE",
    ()=>DELIVERY_TEMPLATE
]);
const DELIVERY_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<table style="width: 100%; margin-bottom: 12px; border-collapse: collapse;">
  <tr>
    <td style="width: 70px; vertical-align: top; padding-right: 10px;">{store_logo}</td>
    <td style="vertical-align: top;">
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
      <div style="font-size: 11px; color: #333;">{store_address}</div>
      <div style="font-size: 11px; color: #333;">ĐT: {store_phone_number}</div>
    </td>
  </tr>
</table>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 12px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 8px;">PHIẾU GIAO HÀNG</h2>
<div style="text-align: center; margin-bottom: 12px; font-size: 11px;">
  <div>Mã: <strong>{delivery_code}</strong> | Đơn hàng: <strong>{order_code}</strong></div>
  <div>Ngày: {created_on} {created_on_time}</div>
</div>

<!-- MÃ VẠCH VẬN ĐƠN -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="text-align: center; padding: 8px; border: 1px solid #333; background: #f5f5f5;">
      <div style="margin-bottom: 5px;">{shipment_barcode}</div>
      <div style="font-size: 14px; font-weight: bold; font-family: monospace;">{tracking_number}</div>
      <div style="font-size: 10px;">Đối tác: {carrier_name}</div>
    </td>
  </tr>
</table>

<!-- THÔNG TIN NGƯỜI NHẬN -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Người nhận:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;"><strong>{receiver_name}</strong></td>
      <td style="padding: 4px 6px; width: 15%; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">SĐT:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{receiver_phone}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Địa chỉ giao:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;" colspan="3">{shipping_address}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">NV giao hàng:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{shipper_name}</td>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Trạng thái:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{delivery_status}</td>
    </tr>
  </tbody>
</table>

<!-- BẢNG SẢN PHẨM - Responsive -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: center; width: 28px; font-size: 10px;">STT</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: center; width: 70px; font-size: 10px;">Mã SP</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: left; font-size: 10px;">Tên sản phẩm</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: center; width: 32px; font-size: 10px;">ĐVT</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: center; width: 30px; font-size: 10px;">SL</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: right; width: 60px; font-size: 10px;">Đơn giá</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: right; width: 70px; font-size: 10px;">Thành tiền</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: center; font-size: 10px;">{line_stt}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: center; font-family: monospace; font-size: 9px;">{line_variant_code}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; font-size: 10px; word-wrap: break-word;">{line_product_name}<br><small style="color: #666;">{line_variant}</small></td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: center; font-size: 10px;">{line_unit}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: center; font-weight: bold; font-size: 11px;">{line_quantity}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: right; font-size: 10px;">{line_price}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: right; font-size: 10px;">{line_amount}</td>
    </tr>
  </tbody>
</table>

<!-- TỔNG GIÁ TRỊ -->
<table style="width: 250px; margin-left: auto; border-collapse: collapse; margin-bottom: 10px;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Tổng số lượng:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; width: 85px; font-size: 11px;"><strong>{total_quantity}</strong></td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Tổng tiền hàng:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px;">{total}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Phí vận chuyển:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px;">{delivery_fee}</td>
    </tr>
    <tr style="background: #f5f5f5;">
      <td style="padding: 5px 6px; border: 1px solid #333; font-size: 11px;"><strong>COD - THU HỘ:</strong></td>
      <td style="padding: 5px 6px; border: 1px solid #333; text-align: right; font-size: 11px;"><strong>{cod_amount}</strong></td>
    </tr>
  </tbody>
</table>

<!-- GHI CHÚ -->
<div style="margin: 8px 0; padding: 8px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">
  <strong>Ghi chú:</strong> {note}
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 25px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 8px; vertical-align: top;">
        <div style="font-weight: bold; font-size: 11px;">Người giao</div>
        <div style="color: #888; font-size: 10px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 50px;"></div>
        <div style="font-size: 11px;">{shipper_name}</div>
      </td>
      <td style="width: 50%; text-align: center; padding: 8px; vertical-align: top;">
        <div style="font-weight: bold; font-size: 11px;">Người nhận</div>
        <div style="color: #888; font-size: 10px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 50px;"></div>
        <div style="font-size: 11px;">{receiver_name}</div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 10px; color: #666;">
  <div>Cảm ơn quý khách!</div>
  <div>Hotline: {store_phone_number} | In lúc: {print_date} {print_time}</div>
</div>

</div>
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/shipping-label.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Nhãn giao hàng - TipTap compatible
 * Cập nhật: Thiết kế đen trắng cho máy in
 */ __turbopack_context__.s([
    "SHIPPING_LABEL_TEMPLATE",
    ()=>SHIPPING_LABEL_TEMPLATE,
    "SHIPPING_LABEL_TEMPLATE_LARGE",
    ()=>SHIPPING_LABEL_TEMPLATE_LARGE,
    "SHIPPING_LABEL_TEMPLATE_SMALL",
    ()=>SHIPPING_LABEL_TEMPLATE_SMALL
]);
const SHIPPING_LABEL_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 13px; line-height: 1.4; max-width: 400px; margin: 0 auto; border: 2px solid #333; padding: 15px;">

<!-- HEADER -->
<div style="text-align: center; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 2px dashed #333;">
  <div style="font-size: 14px; font-weight: bold;">{store_name}</div>
  <div style="font-size: 12px;">{store_phone_number}</div>
</div>

<!-- MÃ VẬN ĐƠN -->
<div style="text-align: center; margin-bottom: 10px; padding: 10px; background: #f5f5f5;">
  <div style="margin-bottom: 8px;">{shipment_barcode}</div>
  <div style="font-size: 18px; font-weight: bold; font-family: monospace;">{shipment_code}</div>
  <div style="font-size: 12px;">Đơn: {order_code}</div>
</div>

<!-- NGƯỜI GỬI -->
<div style="margin-bottom: 10px; padding: 8px; background: #f5f5f5;">
  <div style="font-weight: bold; font-size: 11px;">Gửi:</div>
  <div><strong>{store_name}</strong></div>
  <div style="font-size: 11px;">{store_address}</div>
</div>

<!-- NGƯỜI NHẬN -->
<div style="margin-bottom: 10px; padding: 10px; border: 1px solid #333;">
  <div style="font-weight: bold; font-size: 11px;">Nhận:</div>
  <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{customer_name}</div>
  <div style="font-size: 14px; font-weight: bold;">{customer_phone_number}</div>
  <div style="font-size: 12px;">{shipping_address}</div>
</div>

<!-- THÔNG TIN KIỆN -->
<table style="width: 100%; margin-bottom: 10px; border-collapse: collapse;">
  <tr>
    <td style="text-align: center; padding: 8px; background: #f5f5f5; width: 50%; border: 1px solid #333;">
      <div style="font-size: 11px;">Số lượng</div>
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{total_quantity}</div>
    </td>
    <td style="text-align: center; padding: 8px; background: #f5f5f5; width: 50%; border: 1px solid #333;">
      <div style="font-size: 11px;">Khối lượng</div>
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{total_weight_g}g</div>
    </td>
  </tr>
</table>

<!-- COD -->
<div style="text-align: center; padding: 12px; border: 2px solid #333; margin-bottom: 10px;">
  <div style="font-size: 12px; font-weight: bold;">THU HỘ (COD)</div>
  <div style="font-size: 22px; font-weight: bold;">{cod}</div>
</div>

<!-- GHI CHÚ -->
<div style="font-size: 11px;">
  <strong>Ghi chú:</strong> {note}
</div>

</div>
`;
const SHIPPING_LABEL_TEMPLATE_SMALL = `
<div style="font-family: Arial, sans-serif; font-size: 11px; line-height: 1.3; max-width: 300px; padding: 10px; border: 1px solid #333;">
  <div style="text-align: center; margin-bottom: 8px;">{shipment_barcode}</div>
  <div style="text-align: center; font-weight: bold; font-family: monospace; margin-bottom: 10px;">{shipment_code}</div>
  <div style="border-top: 1px dashed #333; padding-top: 8px;">
    <div><strong>{customer_name}</strong></div>
    <div>{customer_phone_number}</div>
    <div style="font-size: 10px;">{shipping_address}</div>
  </div>
  <div style="text-align: center; margin-top: 10px; padding: 5px; background: #f5f5f5; font-weight: bold;">
    COD: {cod}
  </div>
</div>
`;
const SHIPPING_LABEL_TEMPLATE_LARGE = `
<div style="font-family: Arial, sans-serif; font-size: 13px; line-height: 1.4; max-width: 500px; margin: 0 auto; border: 3px solid #333; padding: 20px;">

<!-- HEADER -->
<div style="text-align: center; margin-bottom: 10px; padding-bottom: 15px; border-bottom: 2px solid #333;">
  <div style="font-size: 18px; font-weight: bold;">{store_name}</div>
  <div>{store_phone_number}</div>
</div>

<!-- MÃ VẠCH + QR -->
<table style="width: 100%; margin-bottom: 20px;">
  <tr>
    <td style="text-align: center; width: 60%;">{shipment_barcode}</td>
    <td style="text-align: center; width: 40%;">{shipment_qrcode}</td>
  </tr>
</table>

<div style="text-align: center; margin-bottom: 20px;">
  <div style="font-size: 28px; font-weight: bold; font-family: monospace;">{shipment_code}</div>
  <div>Đơn: {order_code}</div>
</div>

<!-- NGƯỜI GỬI / NHẬN -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
  <tr>
    <td style="padding: 15px; background: #f5f5f5; border: 1px solid #333; vertical-align: top; width: 50%;">
      <div style="font-weight: bold; margin-bottom: 5px;">NGƯỜI GỬI</div>
      <div><strong>{store_name}</strong></div>
      <div>{store_phone_number}</div>
      <div style="font-size: 11px;">{store_address}</div>
    </td>
    <td style="padding: 15px; border: 2px solid #333; vertical-align: top; width: 50%;">
      <div style="font-weight: bold; margin-bottom: 5px;">NGƯỜI NHẬN</div>
      <div style="font-size: 16px;"><strong>{customer_name}</strong></div>
      <div style="font-size: 15px; font-weight: bold;">{customer_phone_number}</div>
      <div style="font-size: 12px;">{shipping_address}</div>
    </td>
  </tr>
</table>

<!-- THÔNG TIN KIỆN -->
<table style="width: 100%; margin-bottom: 10px; border-collapse: collapse;">
  <tr>
    <td style="text-align: center; padding: 15px; background: #f5f5f5; width: 50%; border: 1px solid #333;">
      <div style="font-size: 12px;">Số lượng</div>
      <div style="font-size: 24px; font-weight: bold;">{total_quantity}</div>
    </td>
    <td style="text-align: center; padding: 15px; background: #f5f5f5; width: 50%; border: 1px solid #333;">
      <div style="font-size: 12px;">Khối lượng</div>
      <div style="font-size: 24px; font-weight: bold;">{total_weight_kg} kg</div>
    </td>
  </tr>
</table>

<!-- COD -->
<div style="text-align: center; padding: 20px; border: 3px solid #333; margin-bottom: 10px;">
  <div style="font-size: 14px; font-weight: bold;">THU HỘ (COD)</div>
  <div style="font-size: 32px; font-weight: bold;">{cod}</div>
</div>

<!-- GHI CHÚ -->
<div style="padding: 10px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {note}
</div>

</div>
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/product-label.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Tem phụ sản phẩm (product label)
 * Thiết kế theo mẫu tem phụ nhập khẩu chuẩn
 */ __turbopack_context__.s([
    "PRODUCT_LABEL_TEMPLATE",
    ()=>PRODUCT_LABEL_TEMPLATE
]);
const PRODUCT_LABEL_TEMPLATE = `
<div style="font-family: 'Inter', Arial, sans-serif; width: 320px; background: #fff; padding: 16px; line-height: 1.5; font-size: 13px; color: #111;">
  <!-- TÊN SẢN PHẨM -->
  <div style="margin-bottom: 12px;">
    <span style="font-weight: 700;">TÊN SẢN PHẨM:</span> {product_name_vat}
  </div>

  <!-- THƯƠNG HIỆU & ĐỊA CHỈ SẢN XUẤT -->
  <div style="margin-bottom: 8px;">
    <span style="font-weight: 700;">Thương Hiệu:</span> {product_brand}. <span style="font-weight: 700;">Địa chỉ sản xuất:</span> {product_origin}
  </div>

  <!-- HƯỚNG DẪN SỬ DỤNG -->
  <div style="margin-bottom: 8px;">
    <span style="font-weight: 700;">Hướng Dẫn sử dụng:</span> {product_usage_guide}
  </div>

  <!-- ĐƠN VỊ NHẬP KHẨU -->
  <div style="margin-bottom: 8px;">
    <span style="font-weight: 700;">ĐƠN VỊ NHẬP KHẨU:</span> {product_importer_name}
  </div>

  <!-- ĐỊA CHỈ NHẬP KHẨU -->
  <div style="margin-bottom: 12px;">
    <span style="font-weight: 700;">Địa chỉ:</span> {product_importer_address}
  </div>

  <!-- BARCODE -->
  <div style="display: flex; align-items: center; gap: 12px; padding-top: 8px; border-top: 1px dashed #ccc;">
    <div style="flex: 1;">
      {product_barcode_image}
      <div style="font-size: 11px; margin-top: 2px;">{product_barcode}</div>
    </div>
  </div>
</div>
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/stock-in.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu nhập kho - TipTap compatible
 * Cập nhật: Thiết kế đen trắng cho máy in
 */ __turbopack_context__.s([
    "STOCK_IN_TEMPLATE",
    ()=>STOCK_IN_TEMPLATE
]);
const STOCK_IN_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="width: 80px; vertical-align: top;">{store_logo}</td>
    <td style="vertical-align: top;">
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
      <div>{store_address}</div>
    </td>
  </tr>
</table>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU NHẬP KHO</h2>
<div style="text-align: center; margin-bottom: 10px;">
  <div>Mã: <strong>{stock_in_code}</strong></div>
  <div>Đơn đặt hàng: <strong>{order_supplier_code}</strong></div>
  <div>Ngày: {created_on}</div>
</div>

<!-- THÔNG TIN NHẬP KHO -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Kho nhập:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{location_name}</strong></td>
      <td style="padding: 5px; width: 15%; background: #f5f5f5; border: 1px solid #333;">Trạng thái:</td>
      <td style="padding: 5px; border: 1px solid #333;">{stock_in_status}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Nhà cung cấp:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{supplier_name}</strong></td>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Mã NCC:</td>
      <td style="padding: 5px; border: 1px solid #333; font-family: monospace;">{supplier_code}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Người tạo:</td>
      <td style="padding: 5px; border: 1px solid #333;" colspan="3">{account_name}</td>
    </tr>
  </tbody>
</table>

<!-- BẢNG SẢN PHẨM -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 35px;">STT</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 90px;">Mã SP</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: left;">Tên sản phẩm</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 50px;">ĐVT</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 55px;">SL Đặt</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 55px;">SL Nhập</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: right; width: 90px;">Đơn giá</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: right; width: 100px;">Thành tiền</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_stt}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center; font-family: monospace;">{line_variant_code}</td>
      <td style="padding: 6px; border: 1px solid #333;">{line_product_name}<br><small>{line_variant}</small></td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_unit}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_ordered_quantity}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center; font-weight: bold;">{line_received_quantity}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: right;">{line_price}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: right;">{line_total}</td>
    </tr>
  </tbody>
</table>

<!-- TỔNG TIỀN -->
<table style="width: 250px; margin-left: auto; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Tổng tiền hàng:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right; width: 100px;">{total}</td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Chiết khấu:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;">{discount}</td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Thuế VAT:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;">{tax_vat}</td>
    </tr>
    <tr style="background: #f5f5f5;">
      <td style="padding: 5px; border: 1px solid #333;"><strong>TỔNG CỘNG:</strong></td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;"><strong>{total_order}</strong></td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Đã thanh toán:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;">{paid}</td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Còn phải trả:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;"><strong>{remaining}</strong></td>
    </tr>
  </tbody>
</table>

<!-- GHI CHÚ -->
<div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {note}
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Người giao</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Thủ kho</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Người lập</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
        {account_name}
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 11px;">
  In lúc: {print_date} {print_time}
</div>

</div>
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/supplier-return.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu trả hàng NCC - TipTap compatible
 * Cập nhật: Thiết kế đen trắng cho máy in
 */ __turbopack_context__.s([
    "SUPPLIER_RETURN_TEMPLATE",
    ()=>SUPPLIER_RETURN_TEMPLATE
]);
const SUPPLIER_RETURN_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="width: 80px; vertical-align: top;">{store_logo}</td>
    <td style="vertical-align: top;">
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
      <div>{store_address}</div>
    </td>
  </tr>
</table>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU TRẢ HÀNG NHÀ CUNG CẤP</h2>
<div style="text-align: center; margin-bottom: 10px;">
  <div>Mã: <strong>{return_supplier_code}</strong></div>
  <div>Ngày: {created_on}</div>
</div>

<!-- THÔNG TIN NHÀ CUNG CẤP -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Nhà cung cấp:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{supplier_name}</strong></td>
      <td style="padding: 5px; width: 15%; background: #f5f5f5; border: 1px solid #333;">Mã NCC:</td>
      <td style="padding: 5px; border: 1px solid #333; font-family: monospace;">{supplier_code}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Điện thoại:</td>
      <td style="padding: 5px; border: 1px solid #333;">{supplier_phone_number}</td>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Email:</td>
      <td style="padding: 5px; border: 1px solid #333;">{supplier_email}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Địa chỉ:</td>
      <td style="padding: 5px; border: 1px solid #333;" colspan="3">{supplier_address}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Lý do trả:</td>
      <td style="padding: 5px; border: 1px solid #333;" colspan="3"><strong>{reason_return}</strong></td>
    </tr>
  </tbody>
</table>

<!-- BẢNG SẢN PHẨM TRẢ -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 40px;">STT</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 100px;">Mã SP</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: left;">Tên sản phẩm</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 60px;">ĐVT</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 60px;">SL Trả</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: right; width: 100px;">Đơn giá</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: right; width: 110px;">Thành tiền</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_stt}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center; font-family: monospace;">{line_variant_code}</td>
      <td style="padding: 6px; border: 1px solid #333;">{line_product_name}<br><small>{line_variant}</small></td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_unit}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center; font-weight: bold;">{line_quantity}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: right;">{line_price}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: right;">{line_total}</td>
    </tr>
  </tbody>
</table>

<!-- TỔNG GIÁ TRỊ -->
<table style="width: 250px; margin-left: auto; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr style="background: #f5f5f5;">
      <td style="padding: 8px; border: 1px solid #333;"><strong>TỔNG GIÁ TRỊ TRẢ:</strong></td>
      <td style="padding: 8px; border: 1px solid #333; text-align: right; width: 100px;"><strong>{total_order}</strong></td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Đã nhận hoàn:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;">{refunded}</td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Còn phải nhận:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;"><strong>{remaining}</strong></td>
    </tr>
  </tbody>
</table>

<!-- GHI CHÚ -->
<div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {note}
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Đại diện NCC</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Thủ kho</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Người lập</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
        {account_name}
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 11px;">
  In lúc: {print_date} {print_time}
</div>

</div>
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/complaint.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu khiếu nại - TipTap compatible
 * Cập nhật: Thiết kế đen trắng cho máy in
 */ __turbopack_context__.s([
    "COMPLAINT_TEMPLATE",
    ()=>COMPLAINT_TEMPLATE
]);
const COMPLAINT_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="width: 80px; vertical-align: top;">{store_logo}</td>
    <td style="vertical-align: top;">
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
      <div>{store_address}</div>
      <div>Hotline: <strong>{store_phone_number}</strong></div>
    </td>
  </tr>
</table>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU KHIẾU NẠI</h2>
<div style="text-align: center; margin-bottom: 10px;">
  <div>Mã phiếu: <strong>{complaint_code}</strong></div>
  <div>Ngày: {created_on}</div>
</div>

<!-- THÔNG TIN KHÁCH HÀNG -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Khách hàng:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{customer_name}</strong></td>
      <td style="padding: 5px; width: 15%; background: #f5f5f5; border: 1px solid #333;">SĐT:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{customer_phone_number}</strong></td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Email:</td>
      <td style="padding: 5px; border: 1px solid #333;">{customer_email}</td>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Địa chỉ:</td>
      <td style="padding: 5px; border: 1px solid #333;">{customer_address}</td>
    </tr>
  </tbody>
</table>

<!-- THÔNG TIN ĐƠN HÀNG -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Mã đơn hàng:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{order_code}</strong></td>
      <td style="padding: 5px; width: 15%; background: #f5f5f5; border: 1px solid #333;">Ngày mua:</td>
      <td style="padding: 5px; border: 1px solid #333;">{order_date}</td>
    </tr>
  </tbody>
</table>

<!-- NỘI DUNG KHIẾU NẠI -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed; border: 2px solid #333;">
  <tbody>
    <tr>
      <td style="padding: 8px; width: 25%; background: #f5f5f5; border: 1px solid #333;">Loại khiếu nại:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{complaint_type}</strong></td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333;">Sản phẩm:</td>
      <td style="padding: 8px; border: 1px solid #333;">{line_product_name} - <small>{line_variant}</small></td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333;">Mô tả vấn đề:</td>
      <td style="padding: 8px; border: 1px solid #333;">{complaint_description}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333;">Yêu cầu của KH:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{customer_request}</strong></td>
    </tr>
  </tbody>
</table>

<!-- XỬ LÝ KHIẾU NẠI -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Trạng thái:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{complaint_status}</strong></td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Phương án xử lý:</td>
      <td style="padding: 5px; border: 1px solid #333;">{resolution}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Người xử lý:</td>
      <td style="padding: 5px; border: 1px solid #333;">{assignee_name}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Ngày hoàn thành:</td>
      <td style="padding: 5px; border: 1px solid #333;">{resolved_on}</td>
    </tr>
  </tbody>
</table>

<!-- GHI CHÚ -->
<div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {complaint_note}
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Khách hàng</strong><br>
        <em>(Ký xác nhận)</em><br>
        <div style="height: 50px;"></div>
        {customer_name}
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Người xử lý</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
        {assignee_name}
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Quản lý</strong><br>
        <em>(Ký duyệt)</em><br>
        <div style="height: 50px;"></div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 11px;">
  Cảm ơn quý khách đã phản hồi. Chúng tôi sẽ xử lý trong thời gian sớm nhất!

  <div style="font-size: 10px; color: #666; margin-top: 5px;">In lúc: {print_date} {print_time}</div></div>

</div>
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/penalty.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu phạt - TipTap compatible
 * Cập nhật: Thiết kế đen trắng cho máy in
 */ __turbopack_context__.s([
    "PENALTY_TEMPLATE",
    ()=>PENALTY_TEMPLATE
]);
const PENALTY_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="width: 80px; vertical-align: top;">{store_logo}</td>
    <td style="vertical-align: top;">
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
      <div>{store_address}</div>
    </td>
  </tr>
</table>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU XỬ PHẠT</h2>
<div style="text-align: center; margin-bottom: 10px;">
  <div>Số: <strong>{penalty_code}</strong></div>
  <div>Ngày: {created_on}</div>
</div>

<!-- THÔNG TIN NGƯỜI BỊ PHẠT -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Họ và tên:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{employee_name}</strong></td>
      <td style="padding: 5px; width: 15%; background: #f5f5f5; border: 1px solid #333;">Mã NV:</td>
      <td style="padding: 5px; border: 1px solid #333; font-family: monospace;">{employee_code}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Bộ phận:</td>
      <td style="padding: 5px; border: 1px solid #333;">{department_name}</td>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Chức vụ:</td>
      <td style="padding: 5px; border: 1px solid #333;">{position_name}</td>
    </tr>
  </tbody>
</table>

<!-- NỘI DUNG VI PHẠM -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Loại vi phạm:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{violation_type}</strong></td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Ngày vi phạm:</td>
      <td style="padding: 5px; border: 1px solid #333;">{violation_date}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Mô tả vi phạm:</td>
      <td style="padding: 5px; border: 1px solid #333;">{violation_description}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Bằng chứng:</td>
      <td style="padding: 5px; border: 1px solid #333;">{evidence}</td>
    </tr>
  </tbody>
</table>

<!-- HÌNH THỨC XỬ PHẠT -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed; border: 2px solid #333;">
  <tbody>
    <tr>
      <td style="padding: 8px; width: 30%; background: #f5f5f5; border: 1px solid #333;">Hình thức:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{penalty_type}</strong></td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333;">Lần vi phạm:</td>
      <td style="padding: 8px; border: 1px solid #333;">Lần thứ <strong>{violation_count}</strong></td>
    </tr>
    <tr style="background: #f5f5f5;">
      <td style="padding: 12px; border: 1px solid #333;"><strong>SỐ TIỀN PHẠT:</strong></td>
      <td style="padding: 12px; border: 1px solid #333; font-size: 18px; font-weight: bold;">{penalty_amount}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #333;">Bằng chữ:</td>
      <td style="padding: 8px; border: 1px solid #333; font-style: italic;">{penalty_amount_text}</td>
    </tr>
  </tbody>
</table>

<!-- GHI CHÚ -->
<div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {penalty_note}
</div>

<!-- CĂN CỨ PHÁP LÝ -->
<div style="margin: 10px 0; padding: 10px; border: 1px solid #333; font-size: 12px;">
  <strong>Căn cứ pháp lý:</strong> Theo quy định nội bộ công ty và Bộ luật Lao động Việt Nam.
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Người vi phạm</strong><br>
        <em>(Ký xác nhận)</em><br>
        <div style="height: 50px;"></div>
        {employee_name}
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Trưởng bộ phận</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Giám đốc</strong><br>
        <em>(Ký duyệt)</em><br>
        <div style="height: 50px;"></div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 11px;">
  Phiếu này được lập thành 02 bản, mỗi bên giữ 01 bản có giá trị như nhau.

  <div style="font-size: 10px; color: #666; margin-top: 5px;">In lúc: {print_date} {print_time}</div></div>

</div>
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/cost-adjustment.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu điều chỉnh giá vốn - TipTap compatible
 * Cập nhật: Thiết kế đen trắng cho máy in
 */ __turbopack_context__.s([
    "COST_ADJUSTMENT_TEMPLATE",
    ()=>COST_ADJUSTMENT_TEMPLATE
]);
const COST_ADJUSTMENT_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="width: 80px; vertical-align: top;">{store_logo}</td>
    <td style="vertical-align: top;">
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
      <div>{store_address}</div>
      <div>ĐT: {store_phone}</div>
    </td>
  </tr>
</table>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 16px; font-weight: bold; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU ĐIỀU CHỈNH GIÁ VỐN</h2>
<div style="text-align: center; margin-bottom: 15px;">
  <div>Số: <strong>{adjustment_code}</strong></div>
  <div>Ngày: {created_on} {created_on_time}</div>
</div>

<!-- THÔNG TIN CHI NHÁNH -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 5px; width: 25%; background: #f5f5f5; border: 1px solid #333;">Chi nhánh:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{location_name}</strong></td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Địa chỉ:</td>
      <td style="padding: 5px; border: 1px solid #333;">{location_address}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Lý do điều chỉnh:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{reason}</strong></td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Trạng thái:</td>
      <td style="padding: 5px; border: 1px solid #333;">{status}</td>
    </tr>
  </tbody>
</table>

<!-- DANH SÁCH SẢN PHẨM -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 11px;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 6px; border: 1px solid #333; text-align: center; width: 30px;">STT</th>
      <th style="padding: 6px; border: 1px solid #333; text-align: left;">Mã SP</th>
      <th style="padding: 6px; border: 1px solid #333; text-align: left;">Tên sản phẩm</th>
      <th style="padding: 6px; border: 1px solid #333; text-align: center; width: 50px;">ĐVT</th>
      <th style="padding: 6px; border: 1px solid #333; text-align: right;">Giá vốn cũ</th>
      <th style="padding: 6px; border: 1px solid #333; text-align: right;">Giá vốn mới</th>
      <th style="padding: 6px; border: 1px solid #333; text-align: right;">Chênh lệch</th>
    </tr>
  </thead>
  <tbody>
    <tr data-line-item>
      <td style="padding: 5px; border: 1px solid #333; text-align: center;">{line_stt}</td>
      <td style="padding: 5px; border: 1px solid #333; font-family: monospace;">{line_variant_code}</td>
      <td style="padding: 5px; border: 1px solid #333;">{line_product_name}</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: center;">{line_unit}</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;">{line_old_price}</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;">{line_new_price}</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;">{line_difference}</td>
    </tr>
  </tbody>
</table>

<!-- TỔNG KẾT -->
<table style="width: 50%; margin-left: auto; border-collapse: collapse; margin-bottom: 15px;">
  <tbody>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Tổng số sản phẩm:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;"><strong>{total_items}</strong></td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Tổng tăng giá vốn:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right; color: green;">{total_increase}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Tổng giảm giá vốn:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right; color: red;">{total_decrease}</td>
    </tr>
    <tr style="font-weight: bold; font-size: 13px;">
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333;">CHÊNH LỆCH:</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: right;">{total_difference}</td>
    </tr>
  </tbody>
</table>

<!-- GHI CHÚ -->
<div style="margin: 15px 0; padding: 10px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {note}
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center;">
        <strong>Người lập phiếu</strong>
        <div style="margin-top: 50px; font-style: italic;">{account_name}</div>
      </td>
      <td style="width: 50%; text-align: center;">
        <strong>Người xác nhận</strong>
        <div style="margin-top: 50px; font-style: italic;">{confirmed_by}</div>
      </td>
    </tr>
  </tbody>
</table>

<!-- NGÀY IN -->
<div style="text-align: right; margin-top: 20px; font-size: 10px; color: #666;">
  In ngày: {print_date} {print_time}
</div>

</div>
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/payroll.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Payroll Template - Bảng lương
 * Mẫu in mặc định theo chuẩn TEMPLATE v2
 * 
 * QUAN TRỌNG - Quy tắc template:
 * 1. Bảng chứa {line_stt} hoặc {line_index} là bảng line items - sẽ được lặp theo số nhân viên
 * 2. Các bảng khác là bảng thông tin - không lặp
 * 3. Sử dụng inline styles để đảm bảo hiển thị đúng khi in
 * 
 * CHUẨN TEMPLATE v2 (2025-12-08):
 * - Header: Logo trái + Store info phải (dạng table)
 * - Title: Căn giữa, border-bottom
 * - Info table: Label 22% nền xám
 * - Product table: table-layout fixed, responsive
 * - Summary: 280px căn phải
 * - Footer: border-top dashed, font nhỏ
 */ __turbopack_context__.s([
    "PAYROLL_TEMPLATE",
    ()=>PAYROLL_TEMPLATE
]);
const PAYROLL_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 900px; margin: 0 auto; padding: 10px;">

<!-- HEADER: Logo trái + Thông tin cửa hàng phải -->
<table style="width: 100%; margin-bottom: 12px; border-collapse: collapse;">
  <tr>
    <td style="width: 70px; vertical-align: top; padding-right: 10px;">{store_logo}</td>
    <td style="vertical-align: top;">
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
      <div style="font-size: 11px; color: #333;">{store_address}</div>
      <div style="font-size: 11px; color: #333;">ĐT: {store_phone_number} | Email: {store_email}</div>
    </td>
  </tr>
</table>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 12px 0 5px 0; font-size: 16px; font-weight: bold; border-bottom: 2px solid #333; padding-bottom: 8px;">BẢNG LƯƠNG TỔNG HỢP</h2>
<div style="text-align: center; margin-bottom: 12px; font-size: 12px;">
  <div><strong>{batch_title}</strong></div>
  <div>Mã: <strong>{batch_code}</strong> | Kỳ lương: <strong>{pay_period}</strong></div>
</div>

<!-- THÔNG TIN BẢNG LƯƠNG -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 20%; border: 1px solid #333; font-size: 11px;">Trạng thái:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;"><strong>{batch_status}</strong></td>
      <td style="padding: 4px 6px; width: 20%; border: 1px solid #333; font-size: 11px;">Ngày thanh toán:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{payroll_date}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Tháng chấm công:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{reference_months}</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Số nhân viên:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;"><strong>{total_employees}</strong> người</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Người lập:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{created_by}</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Ngày lập:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{created_on}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Ghi chú:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;" colspan="3">{notes}</td>
    </tr>
  </tbody>
</table>

<!-- BẢNG CHI TIẾT LƯƠNG TỪNG NHÂN VIÊN - Table layout fixed -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: center; width: 28px; font-size: 10px;">STT</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: left; width: 58px; font-size: 10px;">Mã NV</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: left; font-size: 10px;">Họ tên</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: left; width: 80px; font-size: 10px;">Phòng ban</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: right; width: 72px; font-size: 10px;">Thu nhập</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: right; width: 55px; font-size: 10px;">Bảo hiểm</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: right; width: 60px; font-size: 10px;">Thuế TNCN</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: right; width: 72px; font-size: 10px; font-weight: bold;">Thực lĩnh</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: center; font-size: 10px;">{line_stt}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; font-size: 10px;">{employee_code}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; font-size: 10px; word-wrap: break-word;">{employee_name}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; font-size: 10px; word-wrap: break-word;">{department_name}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: right; font-size: 10px;">{earnings}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: right; font-size: 10px;">{total_insurance}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: right; font-size: 10px;">{personal_income_tax}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: right; font-size: 10px; font-weight: bold;">{net_pay}</td>
    </tr>
  </tbody>
</table>

<!-- BẢNG TỔNG KẾT -->
<table style="width: 300px; margin-left: auto; border-collapse: collapse; margin-bottom: 10px;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Tổng thu nhập:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; width: 120px; font-size: 11px;">{total_earnings}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Tổng bảo hiểm (NV):</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px;">{total_insurance}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Tổng thuế TNCN:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px;">{total_tax}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Tổng khấu trừ:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px;">{total_deductions}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Đóng góp (DN):</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px;">{total_contributions}</td>
    </tr>
    <tr>
      <td style="padding: 5px 6px; border: 1px solid #333; font-size: 12px; font-weight: bold; background: #f0f0f0;">TỔNG THỰC LĨNH:</td>
      <td style="padding: 5px 6px; border: 1px solid #333; text-align: right; font-size: 12px; font-weight: bold; background: #f0f0f0;">{total_net}</td>
    </tr>
  </tbody>
</table>

<!-- BẰNG CHỮ -->
<p style="font-style: italic; margin: 10px 0; font-size: 11px;">
  <strong>Bằng chữ:</strong> {total_net_text}
</p>

<!-- FOOTER: Chữ ký -->
<table style="width: 100%; margin-top: 25px; border-collapse: collapse;">
  <tr>
    <td style="width: 33%; text-align: center; padding: 5px; vertical-align: top;">
      <div style="font-weight: bold; margin-bottom: 50px; font-size: 11px;">Người lập</div>
      <div style="font-size: 11px;">{created_by}</div>
    </td>
    <td style="width: 33%; text-align: center; padding: 5px; vertical-align: top;">
      <div style="font-weight: bold; margin-bottom: 50px; font-size: 11px;">Kế toán trưởng</div>
      <div style="font-size: 11px;"></div>
    </td>
    <td style="width: 33%; text-align: center; padding: 5px; vertical-align: top;">
      <div style="font-weight: bold; margin-bottom: 50px; font-size: 11px;">Giám đốc</div>
      <div style="font-size: 11px;"></div>
    </td>
  </tr>
</table>

<!-- NGÀY IN -->
<div style="margin-top: 15px; padding-top: 8px; border-top: 1px dashed #ccc; font-size: 10px; color: #666; text-align: right;">
  Ngày in: {print_date} {print_time}
</div>

</div>
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/payslip.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Payslip Template - Phiếu lương cá nhân
 * Mẫu in mặc định theo chuẩn TEMPLATE v2
 * 
 * QUAN TRỌNG - Quy tắc template:
 * 1. Bảng chứa {line_stt} là bảng line items - sẽ được lặp theo số components
 * 2. Các bảng khác là bảng thông tin - không lặp
 * 3. Sử dụng inline styles để đảm bảo hiển thị đúng khi in
 * 
 * CHUẨN TEMPLATE v2 (2025-12-08):
 * - Header: Logo trái + Store info phải (dạng table)
 * - Title: Căn giữa, border-bottom
 * - Info table: Label 22% nền xám
 * - Component table: table-layout fixed, responsive
 * - Summary: 280px căn phải
 * - Footer: border-top dashed, font nhỏ
 */ __turbopack_context__.s([
    "PAYSLIP_TEMPLATE",
    ()=>PAYSLIP_TEMPLATE
]);
const PAYSLIP_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 700px; margin: 0 auto; padding: 10px;">

<!-- HEADER: Logo trái + Thông tin cửa hàng phải -->
<table style="width: 100%; margin-bottom: 12px; border-collapse: collapse;">
  <tr>
    <td style="width: 70px; vertical-align: top; padding-right: 10px;">{store_logo}</td>
    <td style="vertical-align: top;">
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
      <div style="font-size: 11px; color: #333;">{store_address}</div>
      <div style="font-size: 11px; color: #333;">ĐT: {store_phone_number} | Email: {store_email}</div>
    </td>
  </tr>
</table>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 12px 0 5px 0; font-size: 16px; font-weight: bold; border-bottom: 2px solid #333; padding-bottom: 8px;">PHIẾU LƯƠNG</h2>
<div style="text-align: center; margin-bottom: 12px; font-size: 12px;">
  <div>Kỳ lương: <strong>{pay_period}</strong></div>
  <div>Mã phiếu: <strong>{payslip_code}</strong></div>
</div>

<!-- THÔNG TIN NHÂN VIÊN -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; border: 1px solid #333; font-size: 11px; background: #f5f5f5;">Mã nhân viên:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;"><strong>{employee_code}</strong></td>
      <td style="padding: 4px 6px; width: 22%; border: 1px solid #333; font-size: 11px; background: #f5f5f5;">Họ và tên:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;"><strong>{employee_name}</strong></td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px; background: #f5f5f5;">Phòng ban:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{department_name}</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px; background: #f5f5f5;">Chức vụ:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{position}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px; background: #f5f5f5;">Bảng lương:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;" colspan="3">{batch_title} ({batch_code})</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px; background: #f5f5f5;">Ngày thanh toán:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{payroll_date}</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px; background: #f5f5f5;">Kỳ lương:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{pay_period}</td>
    </tr>
  </tbody>
</table>

<!-- THÔNG TIN CHẤM CÔNG -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; background: #f8f9fa;">
  <tbody>
    <tr>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; width: 25%; background: #e8e8e8; font-weight: bold;">Ngày công</td>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; width: 25%; text-align: center;"><strong>{work_days}</strong> / {standard_work_days}</td>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; width: 25%; background: #e8e8e8; font-weight: bold;">Nghỉ phép</td>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; width: 25%; text-align: center;">{leave_days} ngày</td>
    </tr>
    <tr>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; background: #e8e8e8; font-weight: bold;">Tổng giờ OT</td>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; text-align: center; color: #0066cc;"><strong>{ot_hours}h</strong></td>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; background: #e8e8e8; font-weight: bold;">Vắng không phép</td>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; text-align: center;">{absent_days} ngày</td>
    </tr>
    <tr>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; background: #e8e8e8;">OT ngày thường</td>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; text-align: center;">{ot_hours_weekday}h</td>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; background: #e8e8e8;">Đi trễ/Về sớm</td>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; text-align: center;">{late_arrivals} lần / {early_departures} lần</td>
    </tr>
    <tr>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; background: #e8e8e8;">OT cuối tuần</td>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; text-align: center;">{ot_hours_weekend}h</td>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; background: #e8e8e8;">OT ngày lễ</td>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; text-align: center;">{ot_hours_holiday}h</td>
    </tr>
  </tbody>
</table>

<!-- CHI TIẾT CÁC THÀNH PHẦN LƯƠNG (LINE ITEMS) -->
<h4 style="margin: 15px 0 8px 0; font-size: 12px; font-weight: bold; border-bottom: 1px solid #333; padding-bottom: 4px;">I. CHI TIẾT THU NHẬP</h4>
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
  <thead>
    <tr style="background: #e8e8e8;">
      <th style="padding: 5px 6px; border: 1px solid #333; text-align: center; font-size: 11px; width: 30px;">STT</th>
      <th style="padding: 5px 6px; border: 1px solid #333; text-align: left; font-size: 11px; width: 140px;">Tên thành phần</th>
      <th style="padding: 5px 6px; border: 1px solid #333; text-align: left; font-size: 11px;">Chi tiết tính</th>
      <th style="padding: 5px 6px; border: 1px solid #333; text-align: right; font-size: 11px; width: 110px;">Số tiền</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: center; font-size: 10px;">{line_stt}</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 10px;">{component_name}</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 10px; color: #555;">{component_formula}</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 10px; font-weight: bold;">{component_amount}</td>
    </tr>
  </tbody>
  <tfoot>
    <tr style="background: #f5f5f5;">
      <td colspan="3" style="padding: 5px 6px; border: 1px solid #333; font-size: 11px; font-weight: bold;">Tổng thu nhập (Gross)</td>
      <td style="padding: 5px 6px; border: 1px solid #333; text-align: right; font-size: 11px; font-weight: bold;">{total_earnings}</td>
    </tr>
  </tfoot>
</table>

<!-- CÁC KHOẢN KHẤU TRỪ -->
<h4 style="margin: 15px 0 8px 0; font-size: 12px; font-weight: bold; border-bottom: 1px solid #333; padding-bottom: 4px;">II. CÁC KHOẢN KHẤU TRỪ</h4>
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
  <thead>
    <tr style="background: #e8e8e8;">
      <th style="padding: 5px 6px; border: 1px solid #333; text-align: left; font-size: 11px;">Khoản mục</th>
      <th style="padding: 5px 6px; border: 1px solid #333; text-align: right; font-size: 11px; width: 120px;">Số tiền</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px; padding-left: 10px;">BHXH (8%)</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px; color: #c00;">{bhxh_amount}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px; padding-left: 10px;">BHYT (1.5%)</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px; color: #c00;">{bhyt_amount}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px; padding-left: 10px;">BHTN (1%)</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px; color: #c00;">{bhtn_amount}</td>
    </tr>
    <tr style="background: #fff5f5;">
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px; font-weight: bold;">Tổng bảo hiểm (10.5%)</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px; font-weight: bold; color: #c00;">{total_insurance}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px; padding-left: 10px;">Thuế TNCN</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px; color: #c00;">{personal_income_tax}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px; padding-left: 10px;">Khấu trừ phạt</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px; color: #c00;">{penalty_deductions}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px; padding-left: 10px;">Khấu trừ khác</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px; color: #c00;">{other_deductions}</td>
    </tr>
  </tbody>
  <tfoot>
    <tr style="background: #fff5f5;">
      <td style="padding: 5px 6px; border: 1px solid #333; font-size: 11px; font-weight: bold;">Tổng khấu trừ</td>
      <td style="padding: 5px 6px; border: 1px solid #333; text-align: right; font-size: 11px; font-weight: bold; color: #c00;">{total_deductions}</td>
    </tr>
  </tfoot>
</table>

<!-- TÍNH THUẾ TNCN (Tham khảo) -->
<h4 style="margin: 15px 0 8px 0; font-size: 12px; font-weight: bold; border-bottom: 1px solid #333; padding-bottom: 4px;">III. TÍNH THUẾ TNCN</h4>
<p style="font-size: 10px; color: #666; margin: 0 0 8px 0; font-style: italic;">Công thức: Thu nhập chịu thuế = Tổng thu nhập - BH (NV đóng) - Giảm trừ gia cảnh</p>
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px; width: 60%;">Mức giảm trừ bản thân (theo luật thuế TNCN)</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px; color: #666;">{personal_deduction}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Mức giảm trừ người phụ thuộc ({dependents_count} người × 4.400.000)</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px; color: #666;">{dependent_deduction}</td>
    </tr>
    <tr style="background: #f5f5f5;">
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px; font-weight: bold;">→ Thu nhập chịu thuế</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px; font-weight: bold;">{taxable_income}</td>
    </tr>
    <tr style="background: #fff5f5;">
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px; font-weight: bold;">→ Thuế TNCN phải nộp</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px; font-weight: bold; color: #c00;">{personal_income_tax}</td>
    </tr>
  </tbody>
</table>

<!-- THỰC LĨNH -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
  <tbody>
    <tr style="background: #d4edda;">
      <td style="padding: 8px 10px; border: 2px solid #333; font-size: 14px; font-weight: bold; width: 50%;">THỰC LĨNH</td>
      <td style="padding: 8px 10px; border: 2px solid #333; text-align: right; font-size: 14px; font-weight: bold; color: #155724;">{net_pay}</td>
    </tr>
  </tbody>
</table>

<!-- BẰNG CHỮ -->
<p style="font-style: italic; margin: 10px 0; font-size: 11px; padding: 8px; border: 1px solid #333; background: #fffde7;">
  <strong>Số tiền bằng chữ:</strong> {net_pay_text}
</p>

<!-- FOOTER: Chữ ký -->
<table style="width: 100%; margin-top: 25px; border-collapse: collapse;">
  <tr>
    <td style="width: 50%; text-align: center; padding: 5px; vertical-align: top;">
      <div style="font-weight: bold; margin-bottom: 50px; font-size: 11px;">Người lập phiếu</div>
      <div style="font-size: 11px;"></div>
    </td>
    <td style="width: 50%; text-align: center; padding: 5px; vertical-align: top;">
      <div style="font-weight: bold; margin-bottom: 50px; font-size: 11px;">Người nhận</div>
      <div style="font-size: 11px;">{employee_name}</div>
    </td>
  </tr>
</table>

<!-- NGÀY IN -->
<div style="margin-top: 15px; padding-top: 8px; border-top: 1px dashed #ccc; font-size: 10px; color: #666; text-align: right;">
  Ngày in: {print_date} {print_time}
</div>

</div>
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/supplier-order.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Đơn đặt hàng nhập (Extended) - TipTap compatible
 */ __turbopack_context__.s([
    "SUPPLIER_ORDER_TEMPLATE",
    ()=>SUPPLIER_ORDER_TEMPLATE
]);
const SUPPLIER_ORDER_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<div style="text-align: center; margin-bottom: 10px;">
  <div style="margin-bottom: 5px;">{store_logo}</div>
  <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
  <div style="color: #666;">{store_address}</div>
  <div style="color: #666;">ĐT: {store_phone_number}</div>
</div>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 20px 0 10px 0; font-size: 18px; text-transform: uppercase; border-bottom: 2px solid #333; padding-bottom: 10px;">ĐƠN ĐẶT HÀNG NHẬP</h2>
<div style="text-align: center; margin-bottom: 20px;">
  <div style="font-size: 14px;">Số: <strong>{order_supplier_code}</strong></div>
  <div>Ngày: {created_on} {created_on_time}</div>
</div>

<!-- THÔNG TIN NHÀ CUNG CẤP -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 8px; width: 20%; background: #f5f5f5; border: 1px solid #ddd; font-weight: bold;">Nhà cung cấp:</td>
      <td style="padding: 8px; border: 1px solid #ddd;"><strong>{supplier_name}</strong></td>
      <td style="padding: 8px; width: 15%; background: #f5f5f5; border: 1px solid #ddd; font-weight: bold;">Mã NCC:</td>
      <td style="padding: 8px; border: 1px solid #ddd;">{supplier_code}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #ddd; font-weight: bold;">Điện thoại:</td>
      <td style="padding: 8px; border: 1px solid #ddd;">{supplier_phone_number}</td>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #ddd; font-weight: bold;">Email:</td>
      <td style="padding: 8px; border: 1px solid #ddd;">{supplier_email}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #ddd; font-weight: bold;">Địa chỉ:</td>
      <td style="padding: 8px; border: 1px solid #ddd;" colspan="3">{supplier_address}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #ddd; font-weight: bold;">Kho nhập:</td>
      <td style="padding: 8px; border: 1px solid #ddd;">{location_name}</td>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #ddd; font-weight: bold;">Ngày giao dự kiến:</td>
      <td style="padding: 8px; border: 1px solid #ddd;">{expected_on}</td>
    </tr>
  </tbody>
</table>

<!-- BẢNG SẢN PHẨM -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 40px;">STT</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 100px;">Mã SP</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: left;">Tên sản phẩm</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 60px;">ĐVT</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 60px;">SL Đặt</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: right; width: 100px;">Đơn giá</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: right; width: 110px;">Thành tiền</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px; border: 1px solid #333; text-align: center;">{line_stt}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; font-family: monospace;">{line_variant_code}</td>
      <td style="padding: 8px; border: 1px solid #333;">{line_product_name}<br><small style="color: #666;">{line_variant}</small></td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center;">{line_unit}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; font-weight: bold;">{line_quantity}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: right;">{line_price}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: right;">{line_amount}</td>
    </tr>
  </tbody>
</table>

<!-- TỔNG GIÁ TRỊ -->
<table style="width: 250px; margin-left: auto; border-collapse: collapse; margin-bottom: 20px;">
  <tbody>
    <tr>
      <td style="padding: 8px; border: 1px solid #333;">Tổng tiền hàng:</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: right; width: 120px;">{total}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #333;">Chiết khấu:</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: right;">{total_discount}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #333;">Thuế VAT:</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: right;">{total_tax}</td>
    </tr>
    <tr style="background: #f5f5f5;">
      <td style="padding: 10px; border: 1px solid #333; font-weight: bold; font-size: 14px;">TỔNG CỘNG:</td>
      <td style="padding: 10px; border: 1px solid #333; text-align: right; font-weight: bold; font-size: 14px;">{total_amount}</td>
    </tr>
  </tbody>
</table>

<!-- GHI CHÚ -->
<div style="margin-bottom: 20px; padding: 12px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {note}
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 40px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">NGƯỜI LẬP ĐƠN</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 60px;"></div>
        <div>{account_name}</div>
      </td>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">PHÊ DUYỆT</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 60px;"></div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="margin-top: 15px; padding-top: 8px; border-top: 1px dashed #ccc; font-size: 10px; color: #666; text-align: center;">
  In lúc: {print_date} {print_time}
</div>

</div>
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/return-order.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Đơn trả hàng (Extended) - TipTap compatible
 */ __turbopack_context__.s([
    "RETURN_ORDER_TEMPLATE",
    ()=>RETURN_ORDER_TEMPLATE
]);
const RETURN_ORDER_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<div style="text-align: center; margin-bottom: 10px;">
  <div style="margin-bottom: 5px;">{store_logo}</div>
  <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
  <div style="color: #666;">{store_address}</div>
  <div style="color: #666;">ĐT: {store_phone_number}</div>
</div>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 20px 0 10px 0; font-size: 18px; text-transform: uppercase; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU TRẢ HÀNG</h2>
<div style="text-align: center; margin-bottom: 20px;">
  <div style="font-size: 14px;">Số: <strong>{return_code}</strong></div>
  <div>Ngày: {created_on} {created_on_time}</div>
  <div>Đơn hàng gốc: <strong>{order_code}</strong></div>
</div>

<!-- THÔNG TIN KHÁCH HÀNG -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 8px; width: 20%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Khách hàng:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{customer_name}</strong></td>
      <td style="padding: 8px; width: 15%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Mã KH:</td>
      <td style="padding: 8px; border: 1px solid #333;">{customer_code}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Điện thoại:</td>
      <td style="padding: 8px; border: 1px solid #333;">{customer_phone_number}</td>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Email:</td>
      <td style="padding: 8px; border: 1px solid #333;">{customer_email}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Lý do trả:</td>
      <td style="padding: 8px; border: 1px solid #333;" colspan="3"><strong>{reason}</strong></td>
    </tr>
  </tbody>
</table>

<!-- BẢNG SẢN PHẨM TRẢ -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 40px;">STT</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 100px;">Mã SP</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: left;">Tên sản phẩm</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 60px;">ĐVT</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 60px;">SL Trả</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: right; width: 100px;">Đơn giá</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: right; width: 110px;">Thành tiền</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px; border: 1px solid #333; text-align: center;">{line_stt}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; font-family: monospace;">{line_variant_code}</td>
      <td style="padding: 8px; border: 1px solid #333;">{line_product_name}<br><small style="color: #666;">{line_variant}</small></td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center;">{line_unit}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; font-weight: bold;">{line_quantity}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: right;">{line_price}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: right;">{line_amount}</td>
    </tr>
  </tbody>
</table>

<!-- TỔNG GIÁ TRỊ HOÀN -->
<table style="width: 250px; margin-left: auto; border-collapse: collapse; margin-bottom: 20px;">
  <tbody>
    <tr>
      <td style="padding: 8px; border: 1px solid #333;">Tổng số lượng trả:</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: right; width: 120px;"><strong>{total_quantity}</strong></td>
    </tr>
    <tr style="background: #f5f5f5;">
      <td style="padding: 10px; border: 1px solid #333; font-weight: bold; font-size: 14px;">TỔNG TIỀN HOÀN:</td>
      <td style="padding: 10px; border: 1px solid #333; text-align: right; font-weight: bold; font-size: 14px;">{total_amount}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #333;">Bằng chữ:</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: right; font-style: italic;">{total_text}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #333;">Trạng thái hoàn tiền:</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: right;"><strong>{refund_status}</strong></td>
    </tr>
  </tbody>
</table>

<!-- GHI CHÚ -->
<div style="margin-bottom: 20px; padding: 12px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {note}
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 40px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">KHÁCH HÀNG</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 60px;"></div>
        <div>{customer_name}</div>
      </td>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">NGƯỜI NHẬN HÀNG</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 60px;"></div>
        <div>{account_name}</div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="margin-top: 15px; padding-top: 8px; border-top: 1px dashed #ccc; font-size: 10px; color: #666; text-align: center;">
  In lúc: {print_date} {print_time}
</div>

</div>
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/handover.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu bàn giao (Extended) - TipTap compatible
 */ __turbopack_context__.s([
    "HANDOVER_TEMPLATE",
    ()=>HANDOVER_TEMPLATE
]);
const HANDOVER_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<div style="text-align: center; margin-bottom: 10px;">
  <div style="margin-bottom: 5px;">{store_logo}</div>
  <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
  <div style="color: #666;">{store_address}</div>
</div>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 20px 0 10px 0; font-size: 18px; text-transform: uppercase; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU BÀN GIAO</h2>
<div style="text-align: center; margin-bottom: 20px;">
  <div style="font-size: 14px;">Số: <strong>{handover_code}</strong></div>
  <div>Ngày: {created_on} {created_on_time}</div>
</div>

<!-- THÔNG TIN BÀN GIAO -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 8px; width: 20%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Người bàn giao:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{from_employee}</strong></td>
      <td style="padding: 8px; width: 20%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Bộ phận:</td>
      <td style="padding: 8px; border: 1px solid #333;">{from_department}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Người nhận:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{to_employee}</strong></td>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Bộ phận:</td>
      <td style="padding: 8px; border: 1px solid #333;">{to_department}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Loại bàn giao:</td>
      <td style="padding: 8px; border: 1px solid #333;">{handover_type}</td>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Trạng thái:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{status}</strong></td>
    </tr>
  </tbody>
</table>

<!-- BẢNG NỘI DUNG BÀN GIAO -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 40px;">STT</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: left;">Nội dung bàn giao</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 80px;">Số lượng</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 100px;">Tình trạng</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: left; width: 150px;">Ghi chú</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px; border: 1px solid #333; text-align: center;">{line_stt}</td>
      <td style="padding: 8px; border: 1px solid #333;">{line_description}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; font-weight: bold;">{line_quantity}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center;">{line_condition}</td>
      <td style="padding: 8px; border: 1px solid #333;">{line_note}</td>
    </tr>
  </tbody>
</table>

<!-- GHI CHÚ CHUNG -->
<div style="margin-bottom: 20px; padding: 12px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {note}
</div>

<!-- CAM KẾT -->
<div style="margin-bottom: 20px; padding: 12px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Cam kết:</strong> Hai bên đã kiểm tra và xác nhận đầy đủ các nội dung bàn giao trên. Người nhận cam kết bảo quản và sử dụng đúng mục đích.
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 40px;">
  <tbody>
    <tr>
      <td style="width: 33%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">NGƯỜI BÀN GIAO</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 60px;"></div>
        <div>{from_employee}</div>
      </td>
      <td style="width: 33%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">NGƯỜI NHẬN</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 60px;"></div>
        <div>{to_employee}</div>
      </td>
      <td style="width: 33%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">XÁC NHẬN</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 60px;"></div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; color: #666; font-size: 11px;">
  Phiếu này được lập thành 02 bản, mỗi bên giữ 01 bản có giá trị như nhau.

  <div style="font-size: 10px; color: #666; margin-top: 5px;">In lúc: {print_date} {print_time}</div></div>

</div>
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/refund-confirmation.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu xác nhận hoàn (Extended) - TipTap compatible
 */ __turbopack_context__.s([
    "REFUND_CONFIRMATION_TEMPLATE",
    ()=>REFUND_CONFIRMATION_TEMPLATE
]);
const REFUND_CONFIRMATION_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<div style="text-align: center; margin-bottom: 10px;">
  <div style="margin-bottom: 5px;">{store_logo}</div>
  <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
  <div style="color: #666;">{store_address}</div>
  <div style="color: #666;">ĐT: {store_phone_number}</div>
</div>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 20px 0 10px 0; font-size: 18px; text-transform: uppercase; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU XÁC NHẬN HOÀN TIỀN</h2>
<div style="text-align: center; margin-bottom: 20px;">
  <div style="font-size: 14px;">Số: <strong>{refund_code}</strong></div>
  <div>Ngày: {created_on} {created_on_time}</div>
</div>

<!-- THÔNG TIN HOÀN TIỀN -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 8px; width: 25%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Mã đơn hàng gốc:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{order_code}</strong></td>
      <td style="padding: 8px; width: 20%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Ngày đặt:</td>
      <td style="padding: 8px; border: 1px solid #333;">{order_date}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Mã phiếu trả:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{return_code}</strong></td>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Ngày trả:</td>
      <td style="padding: 8px; border: 1px solid #333;">{return_date}</td>
    </tr>
  </tbody>
</table>

<!-- THÔNG TIN KHÁCH HÀNG -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 8px; width: 25%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Khách hàng:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{customer_name}</strong></td>
      <td style="padding: 8px; width: 20%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Điện thoại:</td>
      <td style="padding: 8px; border: 1px solid #333;">{customer_phone_number}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Lý do hoàn:</td>
      <td style="padding: 8px; border: 1px solid #333;" colspan="3">{refund_reason}</td>
    </tr>
  </tbody>
</table>

<!-- CHI TIẾT HOÀN TIỀN -->
<div style="background: #f5f5f5; border: 2px solid #333; padding: 20px; margin-bottom: 20px; text-align: center;">
  <div style="font-size: 14px; color: #666; margin-bottom: 10px;">SỐ TIỀN HOÀN</div>
  <div style="font-size: 28px; font-weight: bold;">{refund_amount}</div>
  <div style="font-style: italic; color: #666; margin-top: 5px;">({refund_amount_text})</div>
</div>

<!-- THÔNG TIN HOÀN -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 8px; width: 25%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Hình thức hoàn:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{refund_method}</strong></td>
      <td style="padding: 8px; width: 20%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Trạng thái:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{refund_status}</strong></td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Ngày hoàn tiền:</td>
      <td style="padding: 8px; border: 1px solid #333;">{refunded_on}</td>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Người xử lý:</td>
      <td style="padding: 8px; border: 1px solid #333;">{account_name}</td>
    </tr>
  </tbody>
</table>

<!-- THÔNG TIN TÀI KHOẢN (nếu chuyển khoản) -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 8px; width: 25%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Ngân hàng:</td>
      <td style="padding: 8px; border: 1px solid #333;">{bank_name}</td>
      <td style="padding: 8px; width: 20%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Chi nhánh:</td>
      <td style="padding: 8px; border: 1px solid #333;">{bank_branch}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Số tài khoản:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{bank_account}</strong></td>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Chủ tài khoản:</td>
      <td style="padding: 8px; border: 1px solid #333;">{bank_account_name}</td>
    </tr>
  </tbody>
</table>

<!-- GHI CHÚ -->
<div style="margin-bottom: 20px; padding: 12px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {note}
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 40px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">KHÁCH HÀNG</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký xác nhận đã nhận tiền)</div>
        <div style="height: 60px;"></div>
        <div>{customer_name}</div>
      </td>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">NGƯỜI XỬ LÝ</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 60px;"></div>
        <div>{account_name}</div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="margin-top: 15px; padding-top: 8px; border-top: 1px dashed #ccc; font-size: 10px; color: #666; text-align: center;">
  In lúc: {print_date} {print_time}
</div>

</div>
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/packing-guide.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu hướng dẫn đóng gói (Extended) - TipTap compatible
 */ __turbopack_context__.s([
    "PACKING_GUIDE_TEMPLATE",
    ()=>PACKING_GUIDE_TEMPLATE
]);
const PACKING_GUIDE_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<div style="text-align: center; margin-bottom: 10px;">
  <div style="margin-bottom: 5px;">{store_logo}</div>
  <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
</div>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 20px 0 10px 0; font-size: 18px; text-transform: uppercase; border-bottom: 2px solid #333; padding-bottom: 10px;">HƯỚNG DẪN ĐÓNG GÓI</h2>
<div style="text-align: center; margin-bottom: 20px;">
  <div style="font-size: 14px;">Đơn hàng: <strong>{order_code}</strong></div>
  <div>Ngày: {created_on}</div>
</div>

<!-- THÔNG TIN NGƯỜI NHẬN -->
<div style="background: #f5f5f5; border: 1px solid #333; padding: 15px; margin-bottom: 20px;">
  <div style="font-weight: bold; margin-bottom: 10px;">THÔNG TIN GIAO HÀNG</div>
  <table style="width: 100%;">
    <tbody>
      <tr>
        <td style="padding: 5px 0; width: 120px;"><strong>Người nhận:</strong></td>
        <td>{customer_name}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Điện thoại:</strong></td>
        <td>{customer_phone_number}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Địa chỉ:</strong></td>
        <td>{shipping_address}</td>
      </tr>
    </tbody>
  </table>
</div>

<!-- CHECKLIST ĐÓNG GÓI -->
<div style="background: #f5f5f5; border: 1px solid #333; padding: 15px; margin-bottom: 20px;">
  <div style="font-weight: bold; margin-bottom: 10px;">CHECKLIST ĐÓNG GÓI</div>
  <table style="width: 100%;">
    <tbody>
      <tr><td style="padding: 5px 0;">[ ] Kiểm tra đầy đủ sản phẩm theo danh sách</td></tr>
      <tr><td style="padding: 5px 0;">[ ] Kiểm tra tình trạng sản phẩm</td></tr>
      <tr><td style="padding: 5px 0;">[ ] Bọc chống sốc cho sản phẩm dễ vỡ</td></tr>
      <tr><td style="padding: 5px 0;">[ ] Đóng gói chắc chắn, dán kín</td></tr>
      <tr><td style="padding: 5px 0;">[ ] Dán nhãn giao hàng</td></tr>
      <tr><td style="padding: 5px 0;">[ ] Kèm hóa đơn/phiếu giao hàng</td></tr>
    </tbody>
  </table>
</div>

<!-- DANH SÁCH SẢN PHẨM -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 40px;">STT</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 100px;">Mã SP</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: left;">Tên sản phẩm</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 60px;">SL</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 100px;">Vị trí kho</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 60px;">Đã lấy</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px; border: 1px solid #333; text-align: center;">{line_stt}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; font-family: monospace;">{line_variant_code}</td>
      <td style="padding: 8px; border: 1px solid #333;">{line_product_name}<br><small style="color: #666;">{line_variant}</small></td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; font-weight: bold; font-size: 16px;">{line_quantity}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center;">{bin_location}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; font-size: 20px;">[ ]</td>
    </tr>
  </tbody>
</table>

<!-- TỔNG QUAN -->
<table style="width: 250px; margin-left: auto; border-collapse: collapse; margin-bottom: 20px;">
  <tbody>
    <tr style="background: #f5f5f5;">
      <td style="padding: 10px; border: 1px solid #333; font-weight: bold;">Tổng số lượng:</td>
      <td style="padding: 10px; border: 1px solid #333; text-align: right; font-weight: bold; font-size: 16px;">{total_quantity}</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #333;">COD thu hộ:</td>
      <td style="padding: 10px; border: 1px solid #333; text-align: right; font-weight: bold;">{cod}</td>
    </tr>
  </tbody>
</table>

<!-- LƯU Ý ĐẶC BIỆT -->
<div style="background: #f5f5f5; border: 1px solid #333; padding: 15px; margin-bottom: 20px;">
  <div style="font-weight: bold; margin-bottom: 10px;">LƯU Ý ĐẶC BIỆT</div>
  <div>{packing_note}</div>
  <div style="margin-top: 10px; padding-top: 10px; border-top: 1px dashed #333;">
    <strong>Ghi chú đơn hàng:</strong> {order_note}
  </div>
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">NGƯỜI ĐÓNG GÓI</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 50px;"></div>
        <div>{account_name}</div>
      </td>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">KIỂM TRA</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 50px;"></div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 10px; color: #666;">
  In lúc: {print_date} {print_time}
</div>

</div>
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/sales-summary.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu tổng kết bán hàng (Extended) - TipTap compatible
 */ __turbopack_context__.s([
    "SALES_SUMMARY_TEMPLATE",
    ()=>SALES_SUMMARY_TEMPLATE
]);
const SALES_SUMMARY_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<div style="text-align: center; margin-bottom: 10px;">
  <div style="margin-bottom: 5px;">{store_logo}</div>
  <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
  <div style="color: #666;">Chi nhánh: {location_name}</div>
</div>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 20px 0 10px 0; font-size: 18px; text-transform: uppercase; border-bottom: 2px solid #333; padding-bottom: 10px;">BÁO CÁO TỔNG KẾT BÁN HÀNG</h2>
<div style="text-align: center; margin-bottom: 20px;">
  <div style="font-size: 14px;">Kỳ báo cáo: <strong>{period}</strong></div>
  <div>Từ ngày: {from_date} - Đến ngày: {to_date}</div>
  <div>Người lập: {account_name} | Ngày lập: {created_on}</div>
</div>

<!-- THỐNG KÊ TỔNG QUAN -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
  <tbody>
    <tr>
      <td style="width: 25%; padding: 15px; text-align: center; background: #f5f5f5; border: 1px solid #333;">
        <div style="font-size: 12px; color: #666;">Tổng đơn hàng</div>
        <div style="font-size: 24px; font-weight: bold;">{total_orders}</div>
      </td>
      <td style="width: 25%; padding: 15px; text-align: center; background: #f5f5f5; border: 1px solid #333;">
        <div style="font-size: 12px; color: #666;">Doanh thu</div>
        <div style="font-size: 24px; font-weight: bold;">{total_revenue}</div>
      </td>
      <td style="width: 25%; padding: 15px; text-align: center; background: #f5f5f5; border: 1px solid #333;">
        <div style="font-size: 12px; color: #666;">Chiết khấu</div>
        <div style="font-size: 24px; font-weight: bold;">{total_discount}</div>
      </td>
      <td style="width: 25%; padding: 15px; text-align: center; background: #f5f5f5; border: 1px solid #333;">
        <div style="font-size: 12px; color: #666;">Trả hàng</div>
        <div style="font-size: 24px; font-weight: bold;">{total_returns}</div>
      </td>
    </tr>
  </tbody>
</table>

<!-- CHI TIẾT DOANH THU -->
<div style="background: #f5f5f5; border: 1px solid #333; padding: 15px; margin-bottom: 20px;">
  <div style="font-weight: bold; margin-bottom: 10px; font-size: 14px;">CHI TIẾT DOANH THU</div>
  <table style="width: 100%; border-collapse: collapse;">
    <tbody>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #333;">Doanh thu bán hàng:</td>
        <td style="padding: 8px; border-bottom: 1px solid #333; text-align: right; font-weight: bold;">{sales_revenue}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #333;">Phí giao hàng thu được:</td>
        <td style="padding: 8px; border-bottom: 1px solid #333; text-align: right;">{delivery_revenue}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #333;">Thuế VAT:</td>
        <td style="padding: 8px; border-bottom: 1px solid #333; text-align: right;">{total_tax}</td>
      </tr>
      <tr style="background: #f5f5f5;">
        <td style="padding: 10px; font-weight: bold; font-size: 14px;">TỔNG DOANH THU:</td>
        <td style="padding: 10px; text-align: right; font-weight: bold; font-size: 16px;">{total_revenue}</td>
      </tr>
    </tbody>
  </table>
</div>

<!-- THỐNG KÊ THANH TOÁN -->
<div style="background: #f5f5f5; border: 1px solid #333; padding: 15px; margin-bottom: 20px;">
  <div style="font-weight: bold; margin-bottom: 10px; font-size: 14px;">THỐNG KÊ THANH TOÁN</div>
  <table style="width: 100%; border-collapse: collapse;">
    <tbody>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #333;">Tiền mặt:</td>
        <td style="padding: 8px; border-bottom: 1px solid #333; text-align: right; font-weight: bold;">{cash_amount}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #333;">Chuyển khoản:</td>
        <td style="padding: 8px; border-bottom: 1px solid #333; text-align: right;">{bank_transfer_amount}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #333;">Thẻ tín dụng:</td>
        <td style="padding: 8px; border-bottom: 1px solid #333; text-align: right;">{card_amount}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #333;">Ví điện tử:</td>
        <td style="padding: 8px; border-bottom: 1px solid #333; text-align: right;">{ewallet_amount}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #333;">COD:</td>
        <td style="padding: 8px; border-bottom: 1px solid #333; text-align: right;">{cod_amount}</td>
      </tr>
      <tr style="background: #f5f5f5;">
        <td style="padding: 10px; font-weight: bold;">TỔNG THU:</td>
        <td style="padding: 10px; text-align: right; font-weight: bold; font-size: 14px;">{total_collected}</td>
      </tr>
    </tbody>
  </table>
</div>

<!-- TOP SẢN PHẨM BÁN CHẠY -->
<div style="margin-bottom: 20px;">
  <div style="font-weight: bold; margin-bottom: 10px; color: #333; font-size: 14px;">TOP SẢN PHẨM BÁN CHẠY</div>
  <table style="width: 100%; border-collapse: collapse;">
    <thead>
      <tr style="background: #f5f5f5;">
        <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 40px;">STT</th>
        <th style="padding: 10px; border: 1px solid #333; text-align: left;">Sản phẩm</th>
        <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 80px;">SL bán</th>
        <th style="padding: 10px; border: 1px solid #333; text-align: right; width: 120px;">Doanh thu</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding: 8px; border: 1px solid #333; text-align: center;">{line_stt}</td>
        <td style="padding: 8px; border: 1px solid #333;">{line_product_name}</td>
        <td style="padding: 8px; border: 1px solid #333; text-align: center; font-weight: bold;">{line_quantity}</td>
        <td style="padding: 8px; border: 1px solid #333; text-align: right;">{line_amount}</td>
      </tr>
    </tbody>
  </table>
</div>

<!-- GHI CHÚ -->
<div style="margin-bottom: 20px; padding: 12px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {note}
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 40px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">NGƯỜI LẬP BÁO CÁO</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 60px;"></div>
        <div>{account_name}</div>
      </td>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">QUẢN LÝ XÁC NHẬN</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 60px;"></div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="margin-top: 15px; padding-top: 8px; border-top: 1px dashed #ccc; font-size: 10px; color: #666; text-align: center;">
  In lúc: {print_date} {print_time}
</div>

</div>
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/warranty-request.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu yêu cầu bảo hành (Extended) - TipTap compatible
 */ __turbopack_context__.s([
    "WARRANTY_REQUEST_TEMPLATE",
    ()=>WARRANTY_REQUEST_TEMPLATE
]);
const WARRANTY_REQUEST_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<div style="text-align: center; margin-bottom: 10px;">
  <div style="margin-bottom: 5px;">{store_logo}</div>
  <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
  <div style="color: #666;">{store_address}</div>
  <div style="color: #666;">Hotline: {store_phone_number}</div>
</div>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 20px 0 10px 0; font-size: 18px; text-transform: uppercase; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU YÊU CẦU BẢO HÀNH</h2>
<div style="text-align: center; margin-bottom: 20px;">
  <div style="font-size: 14px;">Số: <strong>{warranty_request_code}</strong></div>
  <div>Ngày tiếp nhận: {created_on} {created_on_time}</div>
</div>

<!-- THÔNG TIN KHÁCH HÀNG -->
<div style="background: #f5f5f5; border: 1px solid #333; padding: 15px; margin-bottom: 20px;">
  <div style="font-weight: bold; margin-bottom: 10px;">THÔNG TIN KHÁCH HÀNG</div>
  <table style="width: 100%;">
    <tbody>
      <tr>
        <td style="padding: 5px 0; width: 25%;"><strong>Họ tên:</strong></td>
        <td style="padding: 5px 0;"><strong>{customer_name}</strong></td>
        <td style="padding: 5px 0; width: 20%;"><strong>Mã KH:</strong></td>
        <td style="padding: 5px 0;">{customer_code}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Điện thoại:</strong></td>
        <td style="padding: 5px 0;">{customer_phone_number}</td>
        <td style="padding: 5px 0;"><strong>Email:</strong></td>
        <td style="padding: 5px 0;">{customer_email}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Địa chỉ:</strong></td>
        <td style="padding: 5px 0;" colspan="3">{customer_address}</td>
      </tr>
    </tbody>
  </table>
</div>

<!-- THÔNG TIN SẢN PHẨM -->
<div style="background: #f5f5f5; border: 1px solid #333; padding: 15px; margin-bottom: 20px;">
  <div style="font-weight: bold; margin-bottom: 10px;">THÔNG TIN SẢN PHẨM BẢO HÀNH</div>
  <table style="width: 100%;">
    <tbody>
      <tr>
        <td style="padding: 5px 0; width: 25%;"><strong>Sản phẩm:</strong></td>
        <td style="padding: 5px 0;"><strong>{product_name}</strong></td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Mã SP:</strong></td>
        <td style="padding: 5px 0;">{product_code}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Serial/IMEI:</strong></td>
        <td style="padding: 5px 0;"><strong>{serial_number}</strong></td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Mã đơn hàng gốc:</strong></td>
        <td style="padding: 5px 0;">{order_code}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Ngày mua:</strong></td>
        <td style="padding: 5px 0;">{purchase_date}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Thời hạn BH:</strong></td>
        <td style="padding: 5px 0;">{warranty_duration}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Hết hạn BH:</strong></td>
        <td style="padding: 5px 0;"><strong>{warranty_expired_on}</strong></td>
      </tr>
    </tbody>
  </table>
</div>

<!-- TÌNH TRẠNG LỖI -->
<div style="background: #f5f5f5; border: 1px solid #333; padding: 15px; margin-bottom: 20px;">
  <div style="font-weight: bold; margin-bottom: 10px;">TÌNH TRẠNG LỖI</div>
  <table style="width: 100%;">
    <tbody>
      <tr>
        <td style="padding: 5px 0; width: 25%;"><strong>Loại lỗi:</strong></td>
        <td style="padding: 5px 0;"><strong>{issue_type}</strong></td>
      </tr>
      <tr>
        <td style="padding: 5px 0; vertical-align: top;"><strong>Mô tả lỗi:</strong></td>
        <td style="padding: 5px 0;">{issue_description}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Tình trạng máy:</strong></td>
        <td style="padding: 5px 0;">{device_condition}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Phụ kiện kèm:</strong></td>
        <td style="padding: 5px 0;">{accessories}</td>
      </tr>
    </tbody>
  </table>
</div>

<!-- TRẠNG THÁI XỬ LÝ -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
  <tbody>
    <tr>
      <td style="padding: 8px; width: 25%; background: #f5f5f5; border: 1px solid #d9d9d9; font-weight: bold;">Trạng thái:</td>
      <td style="padding: 8px; border: 1px solid #d9d9d9;"><strong style="color: #eb2f96;">{status}</strong></td>
      <td style="padding: 8px; width: 25%; background: #f5f5f5; border: 1px solid #d9d9d9; font-weight: bold;">Ưu tiên:</td>
      <td style="padding: 8px; border: 1px solid #d9d9d9;">{priority}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #d9d9d9; font-weight: bold;">Người tiếp nhận:</td>
      <td style="padding: 8px; border: 1px solid #d9d9d9;">{received_by}</td>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #d9d9d9; font-weight: bold;">Kỹ thuật viên:</td>
      <td style="padding: 8px; border: 1px solid #d9d9d9;">{technician_name}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #d9d9d9; font-weight: bold;">Dự kiến hoàn thành:</td>
      <td style="padding: 8px; border: 1px solid #d9d9d9;" colspan="3">{expected_completion_date}</td>
    </tr>
  </tbody>
</table>

<!-- GHI CHÚ -->
<div style="margin-bottom: 20px; padding: 12px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {note}
</div>

<!-- QUY ĐỊNH BẢO HÀNH -->
<div style="margin-bottom: 20px; padding: 12px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">
  <strong>QUY ĐỊNH BẢO HÀNH:</strong>
  <ul style="margin: 5px 0 0 15px; padding: 0;">
    <li>Thời gian xử lý: 7-14 ngày làm việc (tùy mức độ lỗi)</li>
    <li>Khách hàng vui lòng mang theo phiếu này khi nhận máy</li>
    <li>Cửa hàng không chịu trách nhiệm nếu máy không được nhận trong 30 ngày</li>
    <li>Hotline hỗ trợ: {store_phone_number}</li>
  </ul>
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">KHÁCH HÀNG</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký xác nhận)</div>
        <div style="height: 50px;"></div>
        <div>{customer_name}</div>
      </td>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">NHÂN VIÊN TIẾP NHẬN</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 50px;"></div>
        <div>{received_by}</div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="margin-top: 15px; padding-top: 8px; border-top: 1px dashed #ccc; font-size: 10px; color: #666; text-align: center;">
  In lúc: {print_date} {print_time}
</div>

</div>
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/packing-request.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu yêu cầu đóng gói (Extended) - TipTap compatible
 */ __turbopack_context__.s([
    "PACKING_REQUEST_TEMPLATE",
    ()=>PACKING_REQUEST_TEMPLATE
]);
const PACKING_REQUEST_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<div style="text-align: center; margin-bottom: 10px;">
  <div style="margin-bottom: 5px;">{store_logo}</div>
  <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
  <div style="color: #666;">Kho: {location_name}</div>
</div>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 20px 0 10px 0; font-size: 18px; text-transform: uppercase; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU YÊU CẦU ĐÓNG GÓI</h2>
<div style="text-align: center; margin-bottom: 20px;">
  <div style="font-size: 14px;">Mã yêu cầu: <strong>{packing_request_code}</strong></div>
  <div>Đơn hàng: <strong>{order_code}</strong></div>
  <div>Ngày tạo: {created_on} {created_on_time}</div>
</div>

<!-- ĐỘ ƯU TIÊN -->
<div style="text-align: center; margin-bottom: 20px;">
  <span style="background: #f5f5f5; border: 1px solid #333; padding: 8px 20px; font-weight: bold; font-size: 14px;">
    ĐỘ ƯU TIÊN: {priority}
  </span>
</div>

<!-- THÔNG TIN GIAO HÀNG -->
<div style="background: #f5f5f5; border: 1px solid #333; padding: 15px; margin-bottom: 20px;">
  <div style="font-weight: bold; margin-bottom: 10px;">THÔNG TIN GIAO HÀNG</div>
  <table style="width: 100%;">
    <tbody>
      <tr>
        <td style="padding: 5px 0; width: 25%;"><strong>Người nhận:</strong></td>
        <td style="padding: 5px 0;"><strong>{customer_name}</strong></td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Điện thoại:</strong></td>
        <td style="padding: 5px 0;">{customer_phone_number}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Địa chỉ:</strong></td>
        <td style="padding: 5px 0;">{shipping_address}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Đơn vị VC:</strong></td>
        <td style="padding: 5px 0;">{carrier_name}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Dịch vụ:</strong></td>
        <td style="padding: 5px 0;">{service_name}</td>
      </tr>
    </tbody>
  </table>
</div>

<!-- DANH SÁCH SẢN PHẨM CẦN ĐÓNG GÓI -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 40px;">STT</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 100px;">Mã SP</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: left;">Tên sản phẩm</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 60px;">SL</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 100px;">Vị trí kho</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 60px;">Lấy</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px; border: 1px solid #333; text-align: center;">{line_stt}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; font-family: monospace;">{line_variant_code}</td>
      <td style="padding: 8px; border: 1px solid #333;">{line_product_name}<br><small style="color: #666;">{line_variant}</small></td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; font-weight: bold; font-size: 16px;">{line_quantity}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; font-weight: bold;">{bin_location}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; font-size: 20px;">[ ]</td>
    </tr>
  </tbody>
</table>

<!-- THỐNG KÊ -->
<table style="width: 250px; margin-left: auto; border-collapse: collapse; margin-bottom: 20px;">
  <tbody>
    <tr>
      <td style="padding: 10px; border: 1px solid #333; background: #f5f5f5; font-weight: bold;">Tổng số lượng:</td>
      <td style="padding: 10px; border: 1px solid #333; text-align: right; font-weight: bold; font-size: 16px;">{total_quantity}</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #333;">Tổng khối lượng:</td>
      <td style="padding: 10px; border: 1px solid #333; text-align: right;">{total_weight} g</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #333;">COD thu hộ:</td>
      <td style="padding: 10px; border: 1px solid #333; text-align: right; font-weight: bold;">{cod}</td>
    </tr>
  </tbody>
</table>

<!-- YÊU CẦU ĐẶC BIỆT -->
<div style="background: #f5f5f5; border: 1px solid #333; padding: 15px; margin-bottom: 20px;">
  <div style="font-weight: bold; margin-bottom: 10px;">YÊU CẦU ĐẶC BIỆT</div>
  <div>{special_request}</div>
</div>

<!-- GHI CHÚ -->
<div style="margin-bottom: 20px; padding: 12px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú đóng gói:</strong> {packing_note}
</div>

<!-- TRẠNG THÁI -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
  <tbody>
    <tr>
      <td style="padding: 8px; width: 25%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Trạng thái:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{status}</strong></td>
      <td style="padding: 8px; width: 25%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Người được gán:</td>
      <td style="padding: 8px; border: 1px solid #333;">{assigned_employee}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Thời hạn:</td>
      <td style="padding: 8px; border: 1px solid #333;" colspan="3"><strong>{deadline}</strong></td>
    </tr>
  </tbody>
</table>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">NGƯỜI ĐÓNG GÓI</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 50px;"></div>
      </td>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">KIỂM TRA</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 50px;"></div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 10px; color: #666;">
  In lúc: {print_date} {print_time}
</div>

</div>
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/attendance.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Attendance Template - Bảng chấm công
 * Mẫu in mặc định cho bảng chấm công
 * 
 * CHUẨN TEMPLATE v3 (2025-12-10):
 * - Dạng DỌC (portrait) - mỗi nhân viên 1 tờ A4
 * - Compact: Chia 2 nửa tháng theo chiều ngang
 * - Font nhỏ gọn, vừa 1 trang
 */ // Template cho BÁO CÁO CÁ NHÂN (mỗi nhân viên 1 trang)
__turbopack_context__.s([
    "ATTENDANCE_SUMMARY_TEMPLATE",
    ()=>ATTENDANCE_SUMMARY_TEMPLATE,
    "ATTENDANCE_TEMPLATE",
    ()=>ATTENDANCE_TEMPLATE
]);
const ATTENDANCE_TEMPLATE = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: Arial, sans-serif; 
      font-size: 9px; 
      line-height: 1.2;
      padding: 8mm;
    }
    @page { size: A4 portrait; margin: 8mm; }
    .page-break { page-break-after: always; }
    
    .header { 
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      gap: 10px;
    }
    .store-logo {
      max-width: 40px;
      max-height: 40px;
    }
    .store-info-container { flex: 1; }
    .store-name { 
      font-size: 11px; 
      font-weight: bold; 
    }
    .store-info { 
      font-size: 8px; 
      color: #333;
    }
    
    .title { 
      font-size: 13px; 
      font-weight: bold; 
      text-align: center;
      margin: 8px 0 4px 0;
      text-transform: uppercase;
    }
    .subtitle {
      font-size: 11px;
      text-align: center;
      margin-bottom: 8px;
      font-weight: bold;
    }
    
    .employee-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      padding: 6px 10px;
      background: #f0f0f0;
      border-radius: 3px;
      font-size: 9px;
    }
    .info-group { display: flex; gap: 20px; }
    .info-item strong { font-weight: bold; }
    
    .legend {
      margin: 6px 0;
      font-size: 8px;
      color: #666;
    }
    .legend span { margin-right: 10px; }
    
    .tables-container {
      display: flex;
      gap: 8px;
    }
    .half-month {
      flex: 1;
    }
    .half-month h4 {
      font-size: 9px;
      text-align: center;
      margin-bottom: 4px;
      background: #333;
      color: white;
      padding: 3px;
    }
    
    table { 
      width: 100%; 
      border-collapse: collapse; 
      font-size: 8px;
    }
    th, td { 
      border: 1px solid #999; 
      padding: 2px 3px; 
      text-align: center;
    }
    th { 
      background: #e0e0e0; 
      font-weight: bold;
      font-size: 7px;
    }
    .col-day { width: 22px; }
    .col-dow { width: 22px; }
    .col-status { width: 28px; }
    .col-time { width: 38px; font-size: 7px; }
    
    .summary-section {
      margin: 10px 0;
      display: flex;
      gap: 10px;
    }
    .summary-box {
      flex: 1;
      padding: 6px 10px;
      background: #f5f5f5;
      border-radius: 3px;
      border: 1px solid #ddd;
      display: flex;
      justify-content: space-between;
      font-size: 9px;
    }
    .summary-box strong {
      font-size: 11px;
    }
    
    .footer { 
      margin-top: 15px;
      display: flex;
      justify-content: space-between;
    }
    .signature-box {
      width: 30%;
      text-align: center;
    }
    .signature-title {
      font-weight: bold;
      font-size: 9px;
      margin-bottom: 35px;
    }
    .signature-line {
      border-top: 1px dotted #333;
      padding-top: 3px;
      font-size: 8px;
    }
    
    .print-date {
      font-size: 8px;
      color: #666;
      text-align: right;
      margin-top: 10px;
    }
    
    @media print {
      body { padding: 5mm; }
    }
  </style>
</head>
<body>
  {{#line_items}}
  <div class="employee-page">
    <!-- Header -->
    <div class="header">
      <img src="{store_logo}" class="store-logo" onerror="this.style.display='none'">
      <div class="store-info-container">
        <div class="store-name">{store_name}</div>
        <div class="store-info">{store_address} | ĐT: {store_phone_number}</div>
      </div>
    </div>

    <div class="title">BẢNG CHẤM CÔNG CÁ NHÂN</div>
    <div class="subtitle">Tháng {month_year}</div>

    <!-- Thông tin nhân viên -->
    <div class="employee-info">
      <div class="info-group">
        <div class="info-item"><strong>Mã NV:</strong> {employee_code}</div>
        <div class="info-item"><strong>Họ tên:</strong> {employee_name}</div>
      </div>
      <div class="info-group">
        <div class="info-item"><strong>Phòng ban:</strong> {department_name}</div>
      </div>
    </div>

    <!-- Chú thích -->
    <div class="legend">
      <span>✓ Có mặt</span>
      <span>X Vắng</span>
      <span>P Nghỉ phép</span>
      <span>½ Nửa ngày</span>
      <span>L Nghỉ lễ</span>
      <span>- Cuối tuần/Chưa đến</span>
    </div>

    <!-- 2 bảng song song: Nửa đầu + Nửa cuối tháng -->
    <div class="tables-container">
      <!-- Nửa đầu tháng (1-15) -->
      <div class="half-month">
        <h4>Ngày 1 - 15</h4>
        <table>
          <thead>
            <tr>
              <th class="col-day">Ngày</th>
              <th class="col-dow">Thứ</th>
              <th class="col-status">TT</th>
              <th class="col-time">Vào</th>
              <th class="col-time">Ra</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>1</td><td>{dow_1}</td><td>{day_1}</td><td>{checkin_1}</td><td>{checkout_1}</td></tr>
            <tr><td>2</td><td>{dow_2}</td><td>{day_2}</td><td>{checkin_2}</td><td>{checkout_2}</td></tr>
            <tr><td>3</td><td>{dow_3}</td><td>{day_3}</td><td>{checkin_3}</td><td>{checkout_3}</td></tr>
            <tr><td>4</td><td>{dow_4}</td><td>{day_4}</td><td>{checkin_4}</td><td>{checkout_4}</td></tr>
            <tr><td>5</td><td>{dow_5}</td><td>{day_5}</td><td>{checkin_5}</td><td>{checkout_5}</td></tr>
            <tr><td>6</td><td>{dow_6}</td><td>{day_6}</td><td>{checkin_6}</td><td>{checkout_6}</td></tr>
            <tr><td>7</td><td>{dow_7}</td><td>{day_7}</td><td>{checkin_7}</td><td>{checkout_7}</td></tr>
            <tr><td>8</td><td>{dow_8}</td><td>{day_8}</td><td>{checkin_8}</td><td>{checkout_8}</td></tr>
            <tr><td>9</td><td>{dow_9}</td><td>{day_9}</td><td>{checkin_9}</td><td>{checkout_9}</td></tr>
            <tr><td>10</td><td>{dow_10}</td><td>{day_10}</td><td>{checkin_10}</td><td>{checkout_10}</td></tr>
            <tr><td>11</td><td>{dow_11}</td><td>{day_11}</td><td>{checkin_11}</td><td>{checkout_11}</td></tr>
            <tr><td>12</td><td>{dow_12}</td><td>{day_12}</td><td>{checkin_12}</td><td>{checkout_12}</td></tr>
            <tr><td>13</td><td>{dow_13}</td><td>{day_13}</td><td>{checkin_13}</td><td>{checkout_13}</td></tr>
            <tr><td>14</td><td>{dow_14}</td><td>{day_14}</td><td>{checkin_14}</td><td>{checkout_14}</td></tr>
            <tr><td>15</td><td>{dow_15}</td><td>{day_15}</td><td>{checkin_15}</td><td>{checkout_15}</td></tr>
          </tbody>
        </table>
      </div>

      <!-- Nửa cuối tháng (16-31) -->
      <div class="half-month">
        <h4>Ngày 16 - 31</h4>
        <table>
          <thead>
            <tr>
              <th class="col-day">Ngày</th>
              <th class="col-dow">Thứ</th>
              <th class="col-status">TT</th>
              <th class="col-time">Vào</th>
              <th class="col-time">Ra</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>16</td><td>{dow_16}</td><td>{day_16}</td><td>{checkin_16}</td><td>{checkout_16}</td></tr>
            <tr><td>17</td><td>{dow_17}</td><td>{day_17}</td><td>{checkin_17}</td><td>{checkout_17}</td></tr>
            <tr><td>18</td><td>{dow_18}</td><td>{day_18}</td><td>{checkin_18}</td><td>{checkout_18}</td></tr>
            <tr><td>19</td><td>{dow_19}</td><td>{day_19}</td><td>{checkin_19}</td><td>{checkout_19}</td></tr>
            <tr><td>20</td><td>{dow_20}</td><td>{day_20}</td><td>{checkin_20}</td><td>{checkout_20}</td></tr>
            <tr><td>21</td><td>{dow_21}</td><td>{day_21}</td><td>{checkin_21}</td><td>{checkout_21}</td></tr>
            <tr><td>22</td><td>{dow_22}</td><td>{day_22}</td><td>{checkin_22}</td><td>{checkout_22}</td></tr>
            <tr><td>23</td><td>{dow_23}</td><td>{day_23}</td><td>{checkin_23}</td><td>{checkout_23}</td></tr>
            <tr><td>24</td><td>{dow_24}</td><td>{day_24}</td><td>{checkin_24}</td><td>{checkout_24}</td></tr>
            <tr><td>25</td><td>{dow_25}</td><td>{day_25}</td><td>{checkin_25}</td><td>{checkout_25}</td></tr>
            <tr><td>26</td><td>{dow_26}</td><td>{day_26}</td><td>{checkin_26}</td><td>{checkout_26}</td></tr>
            <tr><td>27</td><td>{dow_27}</td><td>{day_27}</td><td>{checkin_27}</td><td>{checkout_27}</td></tr>
            <tr><td>28</td><td>{dow_28}</td><td>{day_28}</td><td>{checkin_28}</td><td>{checkout_28}</td></tr>
            <tr><td>29</td><td>{dow_29}</td><td>{day_29}</td><td>{checkin_29}</td><td>{checkout_29}</td></tr>
            <tr><td>30</td><td>{dow_30}</td><td>{day_30}</td><td>{checkin_30}</td><td>{checkout_30}</td></tr>
            <tr><td>31</td><td>{dow_31}</td><td>{day_31}</td><td>{checkin_31}</td><td>{checkout_31}</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Tổng kết -->
    <div class="summary-section">
      <div class="summary-box"><span>Ngày công:</span> <strong>{work_days}</strong></div>
      <div class="summary-box"><span>Nghỉ phép:</span> <strong>{leave_days}</strong></div>
      <div class="summary-box"><span>Vắng mặt:</span> <strong>{absent_days}</strong></div>
      <div class="summary-box"><span>Đi trễ:</span> <strong>{late_arrivals}</strong></div>
      <div class="summary-box"><span>Về sớm:</span> <strong>{early_departures}</strong></div>
      <div class="summary-box"><span>Giờ làm thêm:</span> <strong>{ot_hours}h</strong></div>
    </div>

    <!-- Chữ ký -->
    <div class="footer">
      <div class="signature-box">
        <div class="signature-title">Nhân viên</div>
        <div class="signature-line">(Ký, ghi rõ họ tên)</div>
      </div>
      <div class="signature-box">
        <div class="signature-title">Trưởng phòng</div>
        <div class="signature-line">(Ký, ghi rõ họ tên)</div>
      </div>
      <div class="signature-box">
        <div class="signature-title">Giám đốc</div>
        <div class="signature-line">(Ký, đóng dấu)</div>
      </div>
    </div>

    <div class="print-date">Ngày in: {print_date}</div>
  </div>
  <div class="page-break"></div>
  {{/line_items}}
</body>
</html>`;
const ATTENDANCE_SUMMARY_TEMPLATE = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: Arial, sans-serif; 
      font-size: 8px; 
      line-height: 1.2;
      padding: 5mm;
    }
    @page { size: A4 landscape; margin: 5mm; }
    
    .header { 
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      gap: 10px;
    }
    .store-logo {
      max-width: 40px;
      max-height: 40px;
    }
    .store-name { 
      font-size: 11px; 
      font-weight: bold; 
    }
    .store-info { 
      font-size: 8px; 
      color: #333;
    }
    
    .title { 
      font-size: 14px; 
      font-weight: bold; 
      text-align: center;
      margin: 5px 0;
      text-transform: uppercase;
    }
    .subtitle {
      font-size: 10px;
      text-align: center;
      margin-bottom: 8px;
    }
    
    .legend {
      font-size: 7px;
      margin-bottom: 5px;
      color: #666;
    }
    
    table { 
      width: 100%; 
      border-collapse: collapse; 
      font-size: 7px;
    }
    th, td { 
      border: 1px solid #999; 
      padding: 2px; 
      text-align: center;
    }
    th { 
      background: #e0e0e0; 
      font-weight: bold;
    }
    .col-name { 
      text-align: left; 
      padding-left: 3px !important;
      min-width: 80px;
    }
    
    .summary {
      margin-top: 8px;
      font-size: 9px;
    }
    
    .footer { 
      margin-top: 15px;
      display: flex;
      justify-content: space-between;
    }
    .signature-box {
      width: 25%;
      text-align: center;
    }
    .signature-title {
      font-weight: bold;
      font-size: 9px;
      margin-bottom: 30px;
    }
    
    .print-date {
      font-size: 7px;
      color: #666;
      text-align: right;
      margin-top: 8px;
    }
  </style>
</head>
<body>
  <div class="header">
    <img src="{store_logo}" class="store-logo" onerror="this.style.display='none'">
    <div>
      <div class="store-name">{store_name}</div>
      <div class="store-info">{store_address}</div>
    </div>
  </div>

  <div class="title">BẢNG CHẤM CÔNG TỔNG HỢP</div>
  <div class="subtitle">Tháng {month_year} | Phòng ban: {department_name}</div>

  <div class="legend">
    ✓ = Có mặt | X = Vắng | P = Nghỉ phép | ½ = Nửa ngày | L = Nghỉ lễ | - = Cuối tuần
  </div>

  <table>
    <thead>
      <tr>
        <th rowspan="2">STT</th>
        <th rowspan="2">Mã NV</th>
        <th rowspan="2" class="col-name">Họ và tên</th>
        <th colspan="4">Tổng kết</th>
        <th colspan="31">Ngày trong tháng</th>
      </tr>
      <tr>
        <th>Công</th>
        <th>Phép</th>
        <th>Vắng</th>
        <th>OT</th>
        <th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th>
        <th>8</th><th>9</th><th>10</th><th>11</th><th>12</th><th>13</th><th>14</th><th>15</th>
        <th>16</th><th>17</th><th>18</th><th>19</th><th>20</th><th>21</th><th>22</th>
        <th>23</th><th>24</th><th>25</th><th>26</th><th>27</th><th>28</th><th>29</th><th>30</th><th>31</th>
      </tr>
    </thead>
    <tbody>
      {{#line_items}}
      <tr>
        <td>{line_index}</td>
        <td>{employee_code}</td>
        <td class="col-name">{employee_name}</td>
        <td>{work_days}</td>
        <td>{leave_days}</td>
        <td>{absent_days}</td>
        <td>{ot_hours}</td>
        <td>{day_1}</td><td>{day_2}</td><td>{day_3}</td><td>{day_4}</td><td>{day_5}</td><td>{day_6}</td><td>{day_7}</td>
        <td>{day_8}</td><td>{day_9}</td><td>{day_10}</td><td>{day_11}</td><td>{day_12}</td><td>{day_13}</td><td>{day_14}</td><td>{day_15}</td>
        <td>{day_16}</td><td>{day_17}</td><td>{day_18}</td><td>{day_19}</td><td>{day_20}</td><td>{day_21}</td><td>{day_22}</td>
        <td>{day_23}</td><td>{day_24}</td><td>{day_25}</td><td>{day_26}</td><td>{day_27}</td><td>{day_28}</td><td>{day_29}</td><td>{day_30}</td><td>{day_31}</td>
      </tr>
      {{/line_items}}
    </tbody>
  </table>

  <div class="summary">
    <strong>Tổng cộng:</strong> {total_employees} nhân viên | 
    {total_work_days} công | {total_leave_days} phép | {total_absent_days} vắng | {total_ot_hours}h OT
  </div>

  <div class="footer">
    <div class="signature-box">
      <div class="signature-title">Người lập</div>
    </div>
    <div class="signature-box">
      <div class="signature-title">Kế toán</div>
    </div>
    <div class="signature-box">
      <div class="signature-title">Trưởng phòng</div>
    </div>
    <div class="signature-box">
      <div class="signature-title">Giám đốc</div>
    </div>
  </div>

  <div class="print-date">Ngày in: {print_date}</div>
</body>
</html>`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_TEMPLATES",
    ()=>DEFAULT_TEMPLATES,
    "EXTENDED_TEMPLATES",
    ()=>EXTENDED_TEMPLATES,
    "getAllTemplateTypes",
    ()=>getAllTemplateTypes,
    "getDefaultTemplate",
    ()=>getDefaultTemplate
]);
// =============================================
// EXPORT ALL DEFAULT TEMPLATES
// =============================================
// MAIN TEMPLATES (16 loại chính)
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$order$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/order.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$quote$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/quote.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$receipt$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/receipt.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$payment$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/payment.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$warranty$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/warranty.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$inventory$2d$check$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/inventory-check.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$stock$2d$transfer$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/stock-transfer.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$sales$2d$return$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/sales-return.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$purchase$2d$order$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/purchase-order.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$packing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/packing.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$delivery$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/delivery.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$shipping$2d$label$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/shipping-label.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$product$2d$label$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/product-label.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$stock$2d$in$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/stock-in.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$supplier$2d$return$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/supplier-return.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$complaint$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/complaint.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$penalty$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/penalty.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$cost$2d$adjustment$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/cost-adjustment.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$payroll$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/payroll.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$payslip$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/payslip.ts [app-client] (ecmascript)");
// EXTENDED TEMPLATES (8 loại mở rộng - MỚI)
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$supplier$2d$order$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/supplier-order.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$return$2d$order$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/return-order.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$handover$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/handover.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$refund$2d$confirmation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/refund-confirmation.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$packing$2d$guide$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/packing-guide.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$sales$2d$summary$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/sales-summary.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$warranty$2d$request$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/warranty-request.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$packing$2d$request$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/packing-request.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$attendance$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/attendance.ts [app-client] (ecmascript)");
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
const DEFAULT_TEMPLATES = {
    'order': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$order$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ORDER_TEMPLATE"],
    'quote': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$quote$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QUOTE_TEMPLATE"],
    'receipt': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$receipt$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RECEIPT_TEMPLATE"],
    'payment': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$payment$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PAYMENT_TEMPLATE"],
    'warranty': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$warranty$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WARRANTY_TEMPLATE"],
    'inventory-check': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$inventory$2d$check$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INVENTORY_CHECK_TEMPLATE"],
    'stock-transfer': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$stock$2d$transfer$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STOCK_TRANSFER_TEMPLATE"],
    'sales-return': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$sales$2d$return$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SALES_RETURN_TEMPLATE"],
    'purchase-order': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$purchase$2d$order$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PURCHASE_ORDER_TEMPLATE"],
    'packing': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$packing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PACKING_TEMPLATE"],
    'delivery': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$delivery$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DELIVERY_TEMPLATE"],
    'shipping-label': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$shipping$2d$label$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SHIPPING_LABEL_TEMPLATE"],
    'product-label': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$product$2d$label$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PRODUCT_LABEL_TEMPLATE"],
    'stock-in': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$stock$2d$in$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STOCK_IN_TEMPLATE"],
    'supplier-return': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$supplier$2d$return$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SUPPLIER_RETURN_TEMPLATE"],
    'complaint': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$complaint$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["COMPLAINT_TEMPLATE"],
    'penalty': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$penalty$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PENALTY_TEMPLATE"],
    'leave': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$penalty$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PENALTY_TEMPLATE"],
    'cost-adjustment': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$cost$2d$adjustment$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["COST_ADJUSTMENT_TEMPLATE"],
    'handover': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$handover$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HANDOVER_TEMPLATE"],
    'payroll': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$payroll$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PAYROLL_TEMPLATE"],
    'payslip': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$payslip$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PAYSLIP_TEMPLATE"],
    'attendance': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$attendance$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ATTENDANCE_TEMPLATE"]
};
const EXTENDED_TEMPLATES = {
    'supplier-order': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$supplier$2d$order$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SUPPLIER_ORDER_TEMPLATE"],
    'return-order': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$return$2d$order$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RETURN_ORDER_TEMPLATE"],
    'refund-confirmation': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$refund$2d$confirmation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["REFUND_CONFIRMATION_TEMPLATE"],
    'packing-guide': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$packing$2d$guide$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PACKING_GUIDE_TEMPLATE"],
    'sales-summary': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$sales$2d$summary$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SALES_SUMMARY_TEMPLATE"],
    'warranty-request': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$warranty$2d$request$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WARRANTY_REQUEST_TEMPLATE"],
    'packing-request': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$packing$2d$request$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PACKING_REQUEST_TEMPLATE"]
};
function getDefaultTemplate(type) {
    if (type in DEFAULT_TEMPLATES) {
        return DEFAULT_TEMPLATES[type];
    }
    if (type in EXTENDED_TEMPLATES) {
        return EXTENDED_TEMPLATES[type];
    }
    return '';
}
function getAllTemplateTypes() {
    return [
        ...Object.keys(DEFAULT_TEMPLATES),
        ...Object.keys(EXTENDED_TEMPLATES)
    ];
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/default-templates.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// Re-export từ templates/index.ts - các template mới đã được tối ưu với inline styles
// Các template này tương thích với TipTap editor và preview
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/index.ts [app-client] (ecmascript) <locals>");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePrintTemplateStore",
    ()=>usePrintTemplateStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$default$2d$templates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/features/settings/printer/default-templates.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/index.ts [app-client] (ecmascript) <locals>");
;
;
const getTemplateKey = (type, size, branchId)=>branchId ? `${type}-${size}-${branchId}` : `${type}-${size}`;
// API sync helper
async function syncTemplateToAPI(template, action) {
    try {
        const response = await fetch('/api/settings/print-templates', {
            method: action === 'create' ? 'POST' : action === 'delete' ? 'DELETE' : 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(template)
        });
        return response.ok;
    } catch (error) {
        console.error('syncTemplateToAPI error:', error);
        return false;
    }
}
const usePrintTemplateStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((set, get)=>({
        templates: {},
        defaultSizes: {},
        initialized: false,
        getTemplate: (type, size, branchId)=>{
            const state = get();
            const key = getTemplateKey(type, size, branchId);
            // Thử tìm template cho branch cụ thể
            const branchTemplate = state.templates[key];
            if (branchTemplate && branchTemplate.content && branchTemplate.content.trim() !== '') {
                // Auto-reset payroll templates nếu phát hiện dùng syntax cũ
                // - {{#line_items}} : Mustache syntax không được hỗ trợ
                // - {line_index} : biến cũ, phải dùng {line_stt}
                if ((type === 'payroll' || type === 'payslip') && (branchTemplate.content.includes('{{#line_items}}') || branchTemplate.content.includes('{line_index}'))) {
                    // Template đang dùng syntax cũ không được hỗ trợ -> reset về mặc định
                    return {
                        id: `template-${key}`,
                        type,
                        name: type === 'payroll' ? 'Bảng lương' : 'Phiếu lương',
                        content: (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getDefaultTemplate"])(type),
                        paperSize: size,
                        isActive: true,
                        updatedAt: new Date().toISOString()
                    };
                }
                return branchTemplate;
            }
            // Nếu không có template cho branch, tìm template chung
            const generalKey = getTemplateKey(type, size);
            const generalTemplate = state.templates[generalKey];
            if (branchId && generalTemplate && generalTemplate.content && generalTemplate.content.trim() !== '') {
                // Auto-reset payroll templates nếu phát hiện dùng syntax cũ
                if ((type === 'payroll' || type === 'payslip') && (generalTemplate.content.includes('{{#line_items}}') || generalTemplate.content.includes('{line_index}'))) {
                    return {
                        id: `template-${key}`,
                        type,
                        name: type === 'payroll' ? 'Bảng lương' : 'Phiếu lương',
                        content: (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getDefaultTemplate"])(type),
                        paperSize: size,
                        isActive: true,
                        updatedAt: new Date().toISOString()
                    };
                }
                return generalTemplate;
            }
            // Return default template if not exists or empty
            // Đây là điểm quan trọng: nếu chưa có template hoặc template trống
            // thì sử dụng mẫu mặc định của hệ thống
            return {
                id: `template-${key}`,
                type,
                name: type === 'order' ? 'Mẫu hóa đơn bán hàng' : 'Mẫu in',
                content: (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getDefaultTemplate"])(type),
                paperSize: size,
                isActive: true,
                updatedAt: new Date().toISOString()
            };
        },
        updateTemplate: (type, size, content, branchId)=>{
            const key = getTemplateKey(type, size, branchId);
            set((state)=>{
                const current = state.templates[key] || {
                    id: `template-${key}`,
                    type,
                    name: 'Mẫu in',
                    content: (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getDefaultTemplate"])(type),
                    paperSize: size,
                    isActive: true,
                    updatedAt: new Date().toISOString()
                };
                return {
                    templates: {
                        ...state.templates,
                        [key]: {
                            ...current,
                            content,
                            updatedAt: new Date().toISOString()
                        }
                    }
                };
            });
        },
        updateTemplateAllBranches: (type, size, content)=>{
            // Lưu template chung (không có branchId) - sẽ áp dụng cho tất cả chi nhánh
            const key = getTemplateKey(type, size);
            set((state)=>{
                // Xóa tất cả template cụ thể của các branch cho type và size này
                const newTemplates = {
                    ...state.templates
                };
                Object.keys(newTemplates).forEach((k)=>{
                    if (k.startsWith(`${type}-${size}-`)) {
                        delete newTemplates[k];
                    }
                });
                return {
                    templates: {
                        ...newTemplates,
                        [key]: {
                            id: `template-${key}`,
                            type,
                            name: 'Mẫu in',
                            content,
                            paperSize: size,
                            isActive: true,
                            updatedAt: new Date().toISOString()
                        }
                    }
                };
            });
        },
        resetTemplate: (type, size, branchId)=>{
            const key = getTemplateKey(type, size, branchId);
            set((state)=>({
                    templates: {
                        ...state.templates,
                        [key]: {
                            id: `template-${key}`,
                            type,
                            name: 'Mẫu mặc định',
                            content: (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getDefaultTemplate"])(type),
                            paperSize: size,
                            isActive: true,
                            updatedAt: new Date().toISOString()
                        }
                    }
                }));
        },
        setDefaultSize: (type, size)=>{
            set((state)=>({
                    defaultSizes: {
                        ...state.defaultSizes,
                        [type]: size
                    }
                }));
        },
        getDefaultSize: (type)=>{
            const state = get();
            return state.defaultSizes[type] || 'A4';
        },
        loadFromAPI: async ()=>{
            if (get().initialized) return;
            try {
                const response = await fetch('/api/settings/print-templates');
                if (response.ok) {
                    const json = await response.json();
                    if (json.data) {
                        set({
                            templates: json.data.templates || {},
                            defaultSizes: json.data.defaultSizes || {},
                            initialized: true
                        });
                    }
                }
            } catch (error) {
                console.error('loadFromAPI error:', error);
            }
            set({
                initialized: true
            });
        }
    }));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/types.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PAPER_SIZES",
    ()=>PAPER_SIZES,
    "TEMPLATE_TYPES",
    ()=>TEMPLATE_TYPES
]);
const TEMPLATE_TYPES = [
    {
        value: 'order',
        label: 'Đơn bán hàng'
    },
    {
        value: 'quote',
        label: 'Phiếu đơn tạm tính'
    },
    {
        value: 'sales-return',
        label: 'Đơn đổi trả hàng'
    },
    {
        value: 'packing',
        label: 'Phiếu đóng gói'
    },
    {
        value: 'delivery',
        label: 'Phiếu giao hàng'
    },
    {
        value: 'shipping-label',
        label: 'Nhãn giao hàng'
    },
    {
        value: 'product-label',
        label: 'Tem phụ sản phẩm'
    },
    {
        value: 'purchase-order',
        label: 'Đơn đặt hàng nhập'
    },
    {
        value: 'stock-in',
        label: 'Phiếu nhập kho'
    },
    {
        value: 'stock-transfer',
        label: 'Phiếu chuyển kho'
    },
    {
        value: 'inventory-check',
        label: 'Phiếu kiểm kho'
    },
    {
        value: 'cost-adjustment',
        label: 'Phiếu điều chỉnh giá vốn'
    },
    {
        value: 'receipt',
        label: 'Phiếu thu'
    },
    {
        value: 'payment',
        label: 'Phiếu chi'
    },
    {
        value: 'warranty',
        label: 'Phiếu bảo hành'
    },
    {
        value: 'supplier-return',
        label: 'Phiếu trả hàng NCC'
    },
    {
        value: 'complaint',
        label: 'Phiếu khiếu nại'
    },
    {
        value: 'penalty',
        label: 'Phiếu phạt'
    },
    {
        value: 'payroll',
        label: 'Bảng lương'
    },
    {
        value: 'payslip',
        label: 'Phiếu lương'
    },
    {
        value: 'attendance',
        label: 'Bảng chấm công'
    }
];
const PAPER_SIZES = [
    {
        value: 'A4',
        label: 'Khổ A4'
    },
    {
        value: 'A5',
        label: 'Khổ A5'
    },
    {
        value: 'A6',
        label: 'Khổ A6'
    },
    {
        value: 'K80',
        label: 'Khổ K80 (Máy in nhiệt)'
    },
    {
        value: 'K57',
        label: 'Khổ K57 (Máy in nhiệt nhỏ)'
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/preview/_shared.preview.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Dữ liệu preview dùng chung cho tất cả loại mẫu in
 * Bao gồm: Thông tin cửa hàng, chi nhánh, người tạo
 */ __turbopack_context__.s([
    "SHARED_PREVIEW_DATA",
    ()=>SHARED_PREVIEW_DATA
]);
const SHARED_PREVIEW_DATA = {
    // === THÔNG TIN CỬA HÀNG ===
    '{store_logo}': '<img src="https://placehold.co/120x60?text=LOGO" alt="Logo" style="max-height:60px"/>',
    '{store_name}': 'Cửa hàng Thời trang TrendTech',
    '{store_address}': '123 Nguyễn Văn Linh, Đà Nẵng',
    '{store_phone_number}': '0905 123 456',
    '{store_email}': 'contact@trendtech.vn',
    '{store_fax}': '0236 3333 555',
    '{store_province}': 'Đà Nẵng',
    // === THÔNG TIN CHI NHÁNH ===
    '{location_name}': 'Chi nhánh Hải Châu',
    '{location_address}': '789 Trần Phú, Hải Châu, Đà Nẵng',
    '{location_province}': 'Đà Nẵng',
    '{location_phone_number}': '0236 3333 666',
    '{location_country}': 'Việt Nam',
    // === NGƯỜI TẠO ===
    '{account_name}': 'Trần Văn B',
    '{assignee_name}': 'Nguyễn Thị C'
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/preview/order.preview.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ORDER_PREVIEW_DATA",
    ()=>ORDER_PREVIEW_DATA
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$_shared$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/preview/_shared.preview.ts [app-client] (ecmascript)");
;
const ORDER_PREVIEW_DATA = {
    // Kế thừa dữ liệu chung
    ...__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$_shared$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SHARED_PREVIEW_DATA"],
    // === THÔNG TIN ĐƠN HÀNG ===
    '{order_code}': 'DH000123',
    '{order_qr_code}': '<img src="https://placehold.co/100x100?text=QR" alt="QR" style="width:100px;height:100px"/>',
    '{bar_code(code)}': '<img src="https://placehold.co/150x50?text=BARCODE" alt="Barcode" style="height:50px"/>',
    '{created_on}': '05/12/2025',
    '{created_on_time}': '10:30',
    '{created_on_text}': 'Ngày 05 tháng 12 năm 2025',
    '{modified_on}': '05/12/2025',
    '{modified_on_time}': '14:20',
    '{issued_on}': '05/12/2025',
    '{issued_on_time}': '10:30',
    '{issued_on_text}': 'Ngày 05 tháng 12 năm 2025',
    '{shipped_on}': '06/12/2025',
    '{ship_on_min}': '06/12/2025',
    '{ship_on_max}': '08/12/2025',
    '{source}': 'Website',
    '{channel}': 'Online',
    '{reference}': 'REF-2025-001',
    '{bar_code(reference_number)}': '<img src="https://placehold.co/150x50?text=REF-CODE" alt="Ref Barcode" style="height:50px"/>',
    '{tag}': 'VIP, Ưu tiên',
    '{currency_name}': 'VND',
    '{tax_treatment}': 'Giá đã bao gồm thuế',
    '{price_list_name}': 'Bảng giá lẻ',
    '{expected_payment_method}': 'COD',
    '{expected_delivery_type}': 'Giao hàng nhanh',
    '{weight_g}': '500',
    '{weight_kg}': '0.5',
    // === TRẠNG THÁI ===
    '{order_status}': 'Đang giao dịch',
    '{payment_status}': 'Chưa thanh toán',
    '{fulfillment_status}': 'Chờ đóng gói',
    '{packed_status}': 'Chưa đóng gói',
    '{return_status}': 'Không trả',
    // === THÔNG TIN KHÁCH HÀNG ===
    '{customer_name}': 'Nguyễn Văn A',
    '{customer_code}': 'KH00456',
    '{customer_phone_number}': '0912 345 678',
    '{customer_phone_number_hide}': '0912 *** 678',
    '{customer_email}': 'nguyenvana@email.com',
    '{customer_group}': 'Khách VIP',
    '{customer_card}': 'Thẻ Vàng',
    '{customer_contact}': 'Nguyễn Văn A',
    '{customer_contact_phone_number}': '0912 345 678',
    '{customer_contact_phone_number_hide}': '0912 *** 678',
    '{customer_tax_number}': '0123456789',
    '{billing_address}': '456 Lê Duẩn, Đà Nẵng',
    '{shipping_address}': '456 Lê Duẩn, Quận Hải Châu, Đà Nẵng',
    '{shipping_address:full_name}': 'Nguyễn Văn A',
    '{shipping_address:phone_number}': '0912 345 678',
    '{shipping_address:phone_number_hide}': '0912 *** 678',
    // === ĐIỂM TÍCH LŨY ===
    '{customer_point}': '1,500',
    '{customer_point_used}': '100',
    '{customer_point_new}': '50',
    '{customer_point_before_create_invoice}': '1,550',
    '{customer_point_after_create_invoice}': '1,500',
    // === NỢ KHÁCH HÀNG ===
    '{customer_debt}': '2,000,000',
    '{customer_debt_text}': 'Hai triệu đồng',
    '{customer_debt_prev}': '1,000,000',
    '{customer_debt_prev_text}': 'Một triệu đồng',
    '{debt_before_create_invoice}': '1,000,000',
    '{debt_before_create_invoice_text}': 'Một triệu đồng',
    '{debt_after_create_invoice}': '2,000,000',
    '{debt_after_create_invoice_text}': 'Hai triệu đồng',
    '{total_amount_and_debt_before_create_invoice}': '1,990,000',
    '{total_amount_and_debt_before_create_invoice_text}': 'Một triệu chín trăm chín mươi nghìn đồng',
    // === THÔNG TIN SẢN PHẨM (LINE ITEMS) ===
    '{line_stt}': '1',
    '{line_product_name}': 'Áo thun Polo nam',
    '{line_variant}': 'Size L - Màu xanh',
    '{line_variant_code}': 'ATP-L-XANH',
    '{line_variant_barcode}': '8935123456789',
    '{line_variant_barcode_image}': '<img src="https://placehold.co/150x50?text=BARCODE" alt="Barcode" style="height:50px"/>',
    '{line_variant_options}': 'Size: L, Màu: Xanh',
    '{line_image}': '<img src="https://placehold.co/60x60?text=SP" alt="Product" style="width:60px;height:60px"/>',
    '{line_unit}': 'Cái',
    '{line_quantity}': '2',
    '{line_price}': '250,000',
    '{line_price_after_discount}': '237,500',
    '{line_price_discount}': '237,500',
    '{line_discount_rate}': '5%',
    '{line_discount_amount}': '25,000',
    '{line_tax_rate}': '10%',
    '{line_tax_amount}': '47,500',
    '{line_tax_included}': 'Có',
    '{line_tax_exclude}': '225,000',
    '{line_amount}': '475,000',
    '{line_amount_none_discount}': '500,000',
    '{line_note}': 'Size vừa vặn',
    '{line_brand}': 'TrendTech',
    '{line_category}': 'Áo thun nam',
    '{line_product_description}': 'Áo thun Polo nam cao cấp, chất liệu cotton 100%',
    '{line_promotion_or_loyalty}': 'Hàng KM',
    '{line_weight_g}': '250',
    '{line_weight_kg}': '0.25',
    // === LINE ITEMS - BẢO HÀNH ===
    '{term_name}': '12 tháng',
    '{term_number}': '12',
    '{term_name_combo}': '6 tháng',
    '{term_number_combo}': '6',
    // === LINE ITEMS - LÔ HÀNG ===
    '{lots_number_code1}': 'LOT2025001',
    '{lots_number_code2}': 'LOT2025001 - 2',
    '{lots_number_code3}': 'LOT2025001 - 01/12/2025 - 01/12/2026',
    '{lots_number_code4}': 'LOT2025001 - 01/12/2025 - 01/12/2026 - 2',
    '{lots_number_combo}': 'LOT-COMBO-001',
    // === LINE ITEMS - KHÁC ===
    '{composite_details}': 'Áo x1, Quần x1',
    '{packsizes}': 'Thùng 10 cái',
    '{bin_location}': 'Kệ A1-01',
    '{serials}': 'SN001, SN002',
    '{total_line_item_discount}': '25,000',
    // === TỔNG GIÁ TRỊ ===
    '{total_quantity}': '3',
    '{total}': '950,000',
    '{total_none_discount}': '1,000,000',
    '{total_discount}': '50,000',
    '{product_discount}': '25,000',
    '{order_discount}': '25,000',
    '{order_discount_rate}': '2.5%',
    '{order_discount_value}': '25,000',
    '{discount_details}': 'CK sản phẩm: 25,000; CK đơn hàng: 25,000',
    '{total_tax}': '90,000',
    '{total_extra_tax}': '15,000',
    '{total_tax_included_line}': '75,000',
    '{total_amount_before_tax}': '900,000',
    '{total_amount_after_tax}': '990,000',
    '{delivery_fee}': '0',
    '{total_amount}': '990,000',
    '{total_text}': 'Chín trăm chín mươi nghìn đồng',
    '{total_remain}': '990,000',
    '{total_remain_text}': 'Chín trăm chín mươi nghìn đồng',
    // === THANH TOÁN ===
    '{payment_name}': 'Tiền mặt',
    '{payments}': 'Tiền mặt: 990,000',
    '{payment_qr}': '<img src="https://placehold.co/120x120?text=QR-PAY" alt="QR Payment" style="width:120px;height:120px"/>',
    '{payment_customer}': '1,000,000',
    '{money_return}': '10,000',
    // === KHUYẾN MẠI ===
    '{promotion_name}': 'Khuyến mãi cuối năm',
    '{promotion_code}': 'CUOINAM2025',
    // === GHI CHÚ ===
    '{order_note}': 'Giao hàng trước 5h chiều',
    // === TỰ ĐỘNG THÊM TỪ TEMPLATE ===
    '{account_name}': 'Trần Văn B'
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/preview/receipt.preview.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RECEIPT_PREVIEW_DATA",
    ()=>RECEIPT_PREVIEW_DATA
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$_shared$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/preview/_shared.preview.ts [app-client] (ecmascript)");
;
const RECEIPT_PREVIEW_DATA = {
    // Kế thừa dữ liệu chung
    ...__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$_shared$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SHARED_PREVIEW_DATA"],
    // === THÔNG TIN PHIẾU THU ===
    '{receipt_code}': 'PT000567',
    '{receipt_voucher_code}': 'PT000567',
    '{created_on}': '05/12/2025',
    '{issued_on}': '05/12/2025',
    '{issued_on_time}': '10:30',
    '{counted}': 'Có',
    '{group_name}': 'Thu tiền bán hàng',
    '{reference}': 'DH000123',
    '{document_root_code}': 'DH000123',
    '{payment_method}': 'Tiền mặt',
    '{payment_method_name}': 'Tiền mặt',
    // === THÔNG TIN NGƯỜI NỘP ===
    '{payer_name}': 'Nguyễn Văn A',
    '{payer_phone}': '0912 345 678',
    '{payer_address}': '456 Lê Duẩn, Đà Nẵng',
    '{object_name}': 'Nguyễn Văn A',
    '{object_phone_number}': '0912 345 678',
    '{object_address}': '456 Lê Duẩn, Đà Nẵng',
    '{object_type}': 'Khách hàng',
    '{customer_name}': 'Nguyễn Văn A',
    '{customer_code}': 'KH000123',
    '{customer_phone_number}': '0912 345 678',
    '{customer_address}': '456 Lê Duẩn, Đà Nẵng',
    // === SỐ TIỀN ===
    '{amount}': '5,000,000',
    '{receipt_amount}': '5,000,000',
    '{total_text}': 'Năm triệu đồng chẵn',
    '{amount_text}': 'Năm triệu đồng chẵn',
    // === LÝ DO ===
    '{reason}': 'Thanh toán tiền hàng đợt 1',
    '{note}': 'Thanh toán tiền hàng đợt 1 - Đơn hàng DH000123',
    // === NỢ KHÁCH HÀNG ===
    '{customer_debt}': '2,000,000',
    '{customer_debt_text}': 'Hai triệu đồng',
    '{customer_debt_prev}': '7,000,000',
    '{customer_debt_prev_text}': 'Bảy triệu đồng',
    '{customer_debt_before_create_receipt}': '7,000,000',
    '{customer_debt_before_create_receipt_text}': 'Bảy triệu đồng',
    '{customer_debt_after_create_receipt}': '2,000,000',
    '{customer_debt_after_create_receipt_text}': 'Hai triệu đồng',
    '{debt_before}': '7,000,000',
    '{debt_after}': '2,000,000',
    // === NỢ NHÀ CUNG CẤP ===
    '{supplier_debt}': '0',
    '{supplier_debt_text}': 'Không đồng',
    '{supplier_debt_prev}': '0',
    '{supplier_debt_prev_text}': 'Không đồng',
    '{supplier_debt_before_create_receipt}': '0',
    '{supplier_debt_before_create_receipt_text}': 'Không đồng',
    '{supplier_debt_after_create_receipt}': '0',
    '{supplier_debt_after_create_receipt_text}': 'Không đồng',
    // === TỰ ĐỘNG THÊM TỪ TEMPLATE ===
    '{receipt_barcode}': '<img src="https://placehold.co/150x50?text=PT-BARCODE" alt="Barcode" style="height:50px"/>',
    '{description}': 'Thanh toán đơn hàng',
    '{account_name}': 'Trần Văn B'
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/preview/payment.preview.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PAYMENT_PREVIEW_DATA",
    ()=>PAYMENT_PREVIEW_DATA
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$_shared$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/preview/_shared.preview.ts [app-client] (ecmascript)");
;
const PAYMENT_PREVIEW_DATA = {
    // Kế thừa dữ liệu chung
    ...__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$_shared$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SHARED_PREVIEW_DATA"],
    // === THÔNG TIN PHIẾU CHI ===
    '{payment_code}': 'PC000890',
    '{payment_voucher_code}': 'PC000890',
    '{created_on}': '05/12/2025',
    '{issued_on}': '05/12/2025',
    '{issued_on_time}': '14:00',
    '{counted}': 'Có',
    '{group_name}': 'Chi trả nhà cung cấp',
    '{reference}': 'PO000456',
    '{document_root_code}': 'PO000456',
    '{payment_method}': 'Chuyển khoản',
    '{payment_method_name}': 'Chuyển khoản',
    // === THÔNG TIN NGƯỜI NHẬN ===
    '{receiver_name}': 'Công ty Vận chuyển ABC',
    '{receiver_phone}': '0236 5555 666',
    '{receiver_address}': 'KCN Hòa Khánh, Đà Nẵng',
    '{object_name}': 'Công ty Vận chuyển ABC',
    '{object_phone_number}': '0236 5555 666',
    '{object_address}': 'KCN Hòa Khánh, Đà Nẵng',
    '{object_type}': 'Nhà cung cấp',
    '{supplier_name}': 'Công ty Vận chuyển ABC',
    '{supplier_code}': 'NCC002',
    '{supplier_phone_number}': '0236 5555 666',
    '{supplier_address}': 'KCN Hòa Khánh, Đà Nẵng',
    // === SỐ TIỀN ===
    '{amount}': '2,500,000',
    '{payment_amount}': '2,500,000',
    '{total_text}': 'Hai triệu năm trăm nghìn đồng chẵn',
    '{amount_text}': 'Hai triệu năm trăm nghìn đồng chẵn',
    // === LÝ DO ===
    '{reason}': 'Thanh toán phí vận chuyển',
    '{note}': 'Thanh toán phí vận chuyển tháng 11',
    // === NỢ KHÁCH HÀNG ===
    '{customer_debt}': '0',
    '{customer_debt_text}': 'Không đồng',
    '{customer_debt_prev}': '0',
    '{customer_debt_prev_text}': 'Không đồng',
    '{customer_debt_before_create_payment}': '0',
    '{customer_debt_before_create_payment_text}': 'Không đồng',
    '{customer_debt_after_create_payment}': '0',
    '{customer_debt_after_create_payment_text}': 'Không đồng',
    // === NỢ NHÀ CUNG CẤP ===
    '{supplier_debt}': '0',
    '{supplier_debt_text}': 'Không đồng',
    '{supplier_debt_prev}': '2,500,000',
    '{supplier_debt_prev_text}': 'Hai triệu năm trăm nghìn đồng',
    '{supplier_debt_before_create_payment}': '2,500,000',
    '{supplier_debt_before_create_payment_text}': 'Hai triệu năm trăm nghìn đồng',
    '{supplier_debt_after_create_payment}': '0',
    '{supplier_debt_after_create_payment_text}': 'Không đồng',
    '{debt_before}': '2,500,000',
    '{debt_after}': '0',
    // === TỰ ĐỘNG THÊM TỪ TEMPLATE ===
    '{payment_barcode}': '<img src="https://placehold.co/150x50?text=PC-BARCODE" alt="Barcode" style="height:50px"/>',
    '{description}': 'Thanh toán đơn hàng',
    '{account_name}': 'Trần Văn B'
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/preview/warranty.preview.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WARRANTY_PREVIEW_DATA",
    ()=>WARRANTY_PREVIEW_DATA
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$_shared$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/preview/_shared.preview.ts [app-client] (ecmascript)");
;
const WARRANTY_PREVIEW_DATA = {
    // Kế thừa dữ liệu chung
    ...__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$_shared$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SHARED_PREVIEW_DATA"],
    // === THÔNG TIN PHIẾU BẢO HÀNH ===
    '{warranty_code}': 'BH000111',
    '{warranty_card_code}': 'BH000111',
    '{created_on}': '05/12/2025',
    '{modified_on}': '05/12/2025',
    '{status}': 'Đang xử lý',
    '{claim_status}': 'Chờ duyệt',
    // === THÔNG TIN KHÁCH HÀNG ===
    '{customer_name}': 'Trần Thị B',
    '{customer_code}': 'KH000456',
    '{customer_phone_number}': '0987 654 321',
    '{customer_address}': '789 Nguyễn Tri Phương, Đà Nẵng',
    '{customer_address1}': '789 Nguyễn Tri Phương, Đà Nẵng',
    '{customer_group}': 'Khách thường',
    // === THÔNG TIN ĐƠN HÀNG ===
    '{order_code}': 'DH000100',
    // === THÔNG TIN SẢN PHẨM BẢO HÀNH ===
    '{product_name}': 'Điện thoại Samsung Galaxy S24 Ultra',
    '{serial_number}': 'IMEI: 352456789012345',
    '{warranty_duration}': '24 tháng',
    '{warranty_expired_on}': '05/12/2027',
    // === THÔNG TIN SẢN PHẨM LINE ===
    '{line_stt}': '1',
    '{line_product_name}': 'Điện thoại Samsung Galaxy S24 Ultra',
    '{line_variant}': '256GB - Titan Black',
    '{line_variant_name}': '256GB - Titan Black',
    '{line_variant_sku}': 'SS-S24U-256-BLK',
    '{line_variant_barcode}': '8806094598483',
    '{serials}': 'IMEI: 352456789012345',
    '{term_name}': '24 tháng',
    '{term_number}': '24',
    '{warranty_period_days}': '730',
    '{start_date}': '05/12/2025',
    '{end_date}': '05/12/2027',
    // === TỰ ĐỘNG THÊM TỪ TEMPLATE ===
    '{account_name}': 'Trần Văn B'
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/preview/inventory-check.preview.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "INVENTORY_CHECK_PREVIEW_DATA",
    ()=>INVENTORY_CHECK_PREVIEW_DATA
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$_shared$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/preview/_shared.preview.ts [app-client] (ecmascript)");
;
const INVENTORY_CHECK_PREVIEW_DATA = {
    // Kế thừa dữ liệu chung
    ...__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$_shared$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SHARED_PREVIEW_DATA"],
    // === THÔNG TIN ĐƠN KIỂM ===
    '{inventory_code}': 'KK000222',
    '{code}': 'KK000222',
    '{created_on}': '05/12/2025',
    '{created_on_time}': '09:00',
    '{modified_on}': '05/12/2025',
    '{modified_on_time}': '10:30',
    '{adjusted_on}': '05/12/2025',
    '{adjusted_on_time}': '10:00',
    '{inventory_status}': 'Đã cân bằng',
    '{status}': 'Đã cân bằng',
    '{reason}': 'Kiểm kê định kỳ cuối tháng',
    '{note}': 'Kiểm kê toàn bộ kho hàng tháng 12/2025',
    // === THÔNG TIN KHO ===
    '{location_name}': 'Kho Tổng - Trụ sở chính',
    '{location_address}': '123 Nguyễn Văn Linh, Đà Nẵng',
    // === THÔNG TIN SẢN PHẨM ===
    '{line_stt}': '1',
    '{line_variant_code}': 'ATP-L-XANH',
    '{line_product_name}': 'Áo thun Polo nam',
    '{line_variant}': 'Size L - Màu xanh',
    '{line_variant_name}': 'Size L - Màu xanh',
    '{line_variant_barcode}': '8935123456789',
    '{line_variant_options}': 'Size: L, Màu: Xanh',
    '{line_brand}': 'TrendTech',
    '{line_category}': 'Áo thun nam',
    '{line_unit}': 'Cái',
    '{line_on_hand}': '100',
    '{line_stock_quantity}': '100',
    '{line_real_quantity}': '98',
    '{line_after_quantity}': '98',
    '{line_difference}': '-2',
    '{line_change_quantity}': '-2',
    '{line_note}': 'Hư hỏng do ẩm',
    '{line_reason}': 'Hư hỏng do ẩm',
    // === TỔNG KẾT ===
    '{total}': '98',
    '{total_items}': '15',
    '{total_surplus}': '3',
    '{total_shortage}': '5',
    // === TỰ ĐỘNG THÊM TỪ TEMPLATE ===
    '{account_name}': 'Trần Văn B'
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/preview/stock-transfer.preview.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "STOCK_TRANSFER_PREVIEW_DATA",
    ()=>STOCK_TRANSFER_PREVIEW_DATA
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$_shared$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/preview/_shared.preview.ts [app-client] (ecmascript)");
;
const STOCK_TRANSFER_PREVIEW_DATA = {
    // Kế thừa dữ liệu chung
    ...__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$_shared$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SHARED_PREVIEW_DATA"],
    // === THÔNG TIN PHIẾU CHUYỂN HÀNG ===
    '{transfer_code}': 'CK000333',
    '{order_code}': 'CK000333',
    '{created_on}': '05/12/2025',
    '{created_on_time}': '08:00',
    '{modified_on}': '05/12/2025',
    '{modified_on_time}': '09:30',
    '{shipped_on}': '05/12/2025',
    '{shipped_on_time}': '09:00',
    '{received_on}': '05/12/2025',
    '{received_on_time}': '14:00',
    '{status}': 'Đã nhận',
    '{reference}': 'REF-CK-001',
    '{note}': 'Chuyển hàng bổ sung cho chi nhánh',
    '{weight_g}': '5000',
    '{weight_kg}': '5',
    // === THÔNG TIN CHI NHÁNH ===
    '{source_location_name}': 'Kho Tổng - Trụ sở chính',
    '{source_location_address}': '123 Nguyễn Văn Linh, Đà Nẵng',
    '{target_location_name}': 'Kho Chi nhánh 1 - Hải Châu',
    '{destination_location_name}': 'Kho Chi nhánh 1 - Hải Châu',
    '{destination_location_address}': '456 Lê Duẩn, Đà Nẵng',
    // === THÔNG TIN SẢN PHẨM ===
    '{line_stt}': '1',
    '{line_variant_code}': 'ATP-L-XANH',
    '{line_product_name}': 'Áo thun Polo nam',
    '{line_variant}': 'Size L - Màu xanh',
    '{line_variant_name}': 'Size L - Màu xanh',
    '{line_variant_barcode}': '8935123456789',
    '{line_variant_options}': 'Size: L, Màu: Xanh',
    '{line_brand}': 'TrendTech',
    '{line_category}': 'Áo thun nam',
    '{line_unit}': 'Cái',
    '{line_quantity}': '50',
    '{line_price}': '150,000',
    '{line_amount}': '7,500,000',
    '{line_weight_g}': '250',
    '{line_weight_kg}': '0.25',
    '{line_variant_image}': '<img src="https://placehold.co/60x60?text=SP" alt="Product" style="width:60px;height:60px"/>',
    '{serials}': 'SN001, SN002, SN003',
    '{lots_number_code1}': 'LOT2025001',
    '{lots_number_code2}': 'LOT2025001 - 50',
    '{lots_number_code3}': 'LOT2025001 - 01/12/2025 - 01/12/2026',
    '{lots_number_code4}': 'LOT2025001 - 01/12/2025 - 01/12/2026 - 50',
    // === THÔNG TIN GIỎ HÀNG ===
    '{receipt_quantity}': '50',
    '{change_quantity}': '0',
    '{line_amount_received}': '7,500,000',
    // === TỔNG GIÁ TRỊ ===
    '{total_quantity}': '50',
    '{total_amount_transfer}': '7,500,000',
    '{total_fee_amount}': '100,000',
    '{total_receipt_quantity}': '50',
    '{total_amount_receipt}': '7,500,000',
    // === TỰ ĐỘNG THÊM TỪ TEMPLATE ===
    '{account_name}': 'Trần Văn B'
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/preview/stock-in.preview.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "STOCK_IN_PREVIEW_DATA",
    ()=>STOCK_IN_PREVIEW_DATA
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$_shared$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/preview/_shared.preview.ts [app-client] (ecmascript)");
;
const STOCK_IN_PREVIEW_DATA = {
    // Kế thừa dữ liệu chung
    ...__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$_shared$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SHARED_PREVIEW_DATA"],
    // === THÔNG TIN PHIẾU NHẬP KHO ===
    '{stock_in_code}': 'NK000999',
    '{receipt_code}': 'NK000999',
    '{purchase_order_code}': 'PO000555',
    '{created_on}': '05/12/2025',
    '{modified_on}': '05/12/2025',
    '{received_on}': '05/12/2025',
    '{received_on_time}': '10:00',
    '{stock_in_status}': 'Đã nhập',
    '{reference}': 'REF-NK-001',
    '{note}': 'Nhập hàng đợt 1 tháng 12',
    // === THÔNG TIN NHÀ CUNG CẤP ===
    '{supplier_name}': 'Công ty May Mặc Việt',
    '{supplier_code}': 'NCC001',
    '{supplier_phone}': '0236 3333 444',
    '{supplier_phone_number}': '0236 3333 444',
    '{supplier_email}': 'contact@maymacviet.vn',
    '{supplier_address}': 'KCN Hòa Khánh, Đà Nẵng',
    '{supplier_debt}': '15,000,000',
    '{supplier_debt_text}': 'Mười lăm triệu đồng',
    '{supplier_debt_prev}': '0',
    '{supplier_debt_prev_text}': 'Không đồng',
    // === THÔNG TIN KHO ===
    '{location_name}': 'Kho Tổng - Trụ sở chính',
    '{location_address}': '123 Nguyễn Văn Linh, Đà Nẵng',
    // === THÔNG TIN SẢN PHẨM ===
    '{line_stt}': '1',
    '{line_variant_code}': 'ATP-L-XANH',
    '{line_product_name}': 'Áo thun Polo nam',
    '{line_variant}': 'Size L - Màu xanh',
    '{line_variant_name}': 'Size L - Màu xanh',
    '{line_variant_barcode}': '8935123456789',
    '{line_variant_options}': 'Size: L, Màu: Xanh',
    '{line_brand}': 'TrendTech',
    '{line_category}': 'Áo thun nam',
    '{line_unit}': 'Cái',
    '{line_quantity}': '100',
    '{line_price}': '150,000',
    '{line_discount_rate}': '0%',
    '{line_discount_amount}': '0',
    '{line_tax_rate}': '10%',
    '{line_tax}': 'VAT 10%',
    '{line_tax_amount}': '1,500,000',
    '{line_amount}': '16,500,000',
    '{line_total}': '16,500,000',
    '{bin_location}': 'Kệ A1-01',
    '{serials}': 'SN001 - SN100',
    // === TỔNG GIÁ TRỊ ===
    '{total_quantity}': '100',
    '{total}': '15,000,000',
    '{total_tax}': '1,500,000',
    '{total_discounts}': '0',
    '{total_discount}': '0',
    '{total_price}': '16,500,000',
    '{total_order}': '16,500,000',
    '{total_amount}': '16,500,000',
    '{total_amount_text}': 'Mười sáu triệu năm trăm nghìn đồng',
    '{total_text}': 'Mười sáu triệu năm trăm nghìn đồng',
    '{total_landed_costs}': '500,000',
    // === TỰ ĐỘNG THÊM TỪ TEMPLATE ===
    '{order_supplier_code}': 'PO000456',
    '{account_name}': 'Trần Văn B',
    '{line_ordered_quantity}': '10',
    '{line_received_quantity}': '10',
    '{discount}': '50,000',
    '{tax_vat}': '10%',
    '{paid}': '1,000,000',
    '{remaining}': '500,000'
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/preview/sales-return.preview.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SALES_RETURN_PREVIEW_DATA",
    ()=>SALES_RETURN_PREVIEW_DATA
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$_shared$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/preview/_shared.preview.ts [app-client] (ecmascript)");
;
const SALES_RETURN_PREVIEW_DATA = {
    // Kế thừa dữ liệu chung
    ...__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$_shared$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SHARED_PREVIEW_DATA"],
    // === THÔNG TIN ĐƠN TRẢ HÀNG ===
    '{return_code}': 'TH000444',
    '{order_return_code}': 'TH000444',
    '{order_code}': 'DH000123',
    '{order_qr_code}': '<img src="https://placehold.co/100x100?text=QR" alt="QR" style="width:100px;height:100px"/>',
    '{bar_code(code)}': '<img src="https://placehold.co/150x50?text=BARCODE" alt="Barcode" style="height:50px"/>',
    '{bar_code(reference_number)}': '<img src="https://placehold.co/150x50?text=REF" alt="Ref" style="height:50px"/>',
    '{created_on}': '05/12/2025',
    '{created_on_time}': '14:00',
    '{modified_on}': '05/12/2025',
    '{modified_on_time}': '14:30',
    '{issued_on}': '05/12/2025',
    '{issued_on_time}': '14:00',
    '{source}': 'Tại cửa hàng',
    '{channel}': 'Offline',
    '{reference}': 'REF-TH-001',
    '{tag}': 'Trả hàng',
    '{return_reason}': 'Sản phẩm bị lỗi đường may',
    '{reason_return}': 'Khách đổi size do mua nhầm',
    // === TRẠNG THÁI ===
    '{return_status}': 'Đã hoàn thành',
    '{order_status}': 'Đã hoàn thành',
    '{payment_status}': 'Đã hoàn tiền',
    '{fulfillment_status}': 'Đã nhận hàng',
    '{packed_status}': 'Không áp dụng',
    '{expected_payment_method}': 'Tiền mặt',
    '{expected_delivery_type}': 'Nhận tại cửa hàng',
    // === THÔNG TIN KHÁCH HÀNG ===
    '{customer_code}': 'KH00456',
    '{customer_name}': 'Nguyễn Văn A',
    '{customer_contact}': 'Nguyễn Văn A',
    '{customer_phone_number}': '0912 345 678',
    '{customer_email}': 'nguyenvana@email.com',
    '{customer_address}': '456 Lê Duẩn, Đà Nẵng',
    '{customer_point}': '1,500',
    '{customer_card}': 'Thẻ Vàng',
    '{customer_tax_number}': '0123456789',
    '{billing_address}': '456 Lê Duẩn, Đà Nẵng',
    '{shipping_address}': '456 Lê Duẩn, Quận Hải Châu, Đà Nẵng',
    '{shipping_address:full_name}': 'Nguyễn Văn A',
    '{shipping_address:phone_number}': '0912 345 678',
    '{ship_on_min}': '05/12/2025',
    '{ship_on_max}': '05/12/2025',
    '{price_list_name}': 'Bảng giá lẻ',
    '{currency_name}': 'VND',
    // === NỢ KHÁCH HÀNG ===
    '{customer_debt}': '1,750,000',
    '{customer_debt_text}': 'Một triệu bảy trăm năm mươi nghìn đồng',
    '{customer_debt_prev}': '2,000,000',
    '{customer_debt_prev_text}': 'Hai triệu đồng',
    // === THÔNG TIN SẢN PHẨM TRẢ ===
    '{line_stt}': '1',
    '{line_variant_code}': 'ATP-L-XANH',
    '{line_product_name}': 'Áo thun Polo nam',
    '{line_variant}': 'Size L - Màu xanh',
    '{line_variant_barcode}': '8935123456790',
    '{line_variant_options}': 'Size: L, Màu: Xanh',
    '{line_unit}': 'Cái',
    '{line_quantity}': '1',
    '{line_price}': '250,000',
    '{line_price_after_discount}': '250,000',
    '{line_discount_rate}': '0%',
    '{line_discount_amount}': '0',
    '{line_tax_rate}': '0%',
    '{line_tax_amount}': '0',
    '{line_tax_included}': 'Không',
    '{line_tax_exclude}': '250,000',
    '{line_amount}': '250,000',
    '{line_total}': '250,000',
    '{line_amount_none_discount}': '250,000',
    '{line_note}': 'Sản phẩm bị lỗi đường may',
    '{line_brand}': 'TrendTech',
    '{line_category}': 'Áo thun nam',
    '{line_promotion_or_loyalty}': '',
    '{total_line_item_discount}': '0',
    '{serials}': 'SN123456',
    '{lots_number_code1}': '',
    '{lots_number_code2}': '',
    '{lots_number_code3}': '',
    '{lots_number_code4}': '',
    // === THÔNG TIN SẢN PHẨM TRẢ (alias) ===
    '{return_line_stt}': '1',
    '{return_line_variant_code}': 'ATP-L-XANH',
    '{return_line_product_name}': 'Áo thun Polo nam',
    '{return_line_variant}': 'Size L - Màu xanh',
    '{return_line_unit}': 'Cái',
    '{return_line_quantity}': '1',
    '{return_line_price}': '250,000',
    '{return_line_amount}': '250,000',
    '{return_line_note}': 'Sản phẩm bị lỗi đường may',
    '{return_serials}': 'SN123456',
    // === TỔNG GIÁ TRỊ ===
    '{total_quantity}': '1',
    '{return_total_quantity}': '1',
    '{total}': '250,000',
    '{total_order}': '250,000',
    '{total_none_discount}': '250,000',
    '{total_discount}': '0',
    '{product_discount}': '0',
    '{order_discount}': '0',
    '{order_discount_rate}': '0%',
    '{order_discount_value}': '0',
    '{total_tax}': '0',
    '{total_extra_tax}': '0',
    '{total_tax_included_line}': '0',
    '{total_amount_before_tax}': '250,000',
    '{total_amount_after_tax}': '250,000',
    '{delivery_fee}': '0',
    '{total_amount}': '250,000',
    '{return_total_amount}': '250,000',
    '{refund_amount}': '250,000',
    '{total_order_exchange_amount}': '0',
    '{total_text}': 'Hai trăm năm mươi nghìn đồng',
    '{total_remain}': '0',
    '{money_return}': '0',
    '{payment_customer}': '0',
    '{payment_name}': 'Tiền mặt',
    '{order_exchange_payment_note}': 'Đổi hàng tương đương',
    '{promotion_name}': '',
    '{promotion_code}': '',
    '{order_note}': 'Khách đổi size do mua nhầm',
    '{note}': 'Khách đổi size do mua nhầm',
    // === TỰ ĐỘNG THÊM TỪ TEMPLATE ===
    '{refund_status}': 'Đã hoàn tiền',
    '{account_name}': 'Trần Văn B'
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/preview/purchase-order.preview.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PURCHASE_ORDER_PREVIEW_DATA",
    ()=>PURCHASE_ORDER_PREVIEW_DATA
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$_shared$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/preview/_shared.preview.ts [app-client] (ecmascript)");
;
const PURCHASE_ORDER_PREVIEW_DATA = {
    // Kế thừa dữ liệu chung
    ...__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$_shared$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SHARED_PREVIEW_DATA"],
    // === THÔNG TIN ĐƠN ĐẶT HÀNG NHẬP ===
    '{po_code}': 'PO000555',
    '{order_supplier_code}': 'PO000555',
    '{status}': 'Đang nhập hàng',
    '{po_status}': 'Đang nhập hàng',
    '{created_on}': '05/12/2025',
    '{due_on}': '10/12/2025',
    '{expected_date}': '10/12/2025',
    '{completed_on}': '',
    '{ended_on}': '',
    '{cancelled_on}': '',
    '{activated_account_name}': 'Trần Văn B',
    '{weight_g}': '25000',
    '{weight_kg}': '25',
    '{note}': 'Giao hàng trong tuần',
    '{tags}': 'Nhập gấp, Hàng mới',
    // === THÔNG TIN NHÀ CUNG CẤP ===
    '{supplier_name}': 'Công ty May Mặc Việt',
    '{supplier_code}': 'NCC001',
    '{supplier_phone}': '0236 3333 444',
    '{supplier_phone_number}': '0236 3333 444',
    '{supplier_email}': 'contact@maymacviet.vn',
    '{supplier_address}': 'KCN Hòa Khánh, Đà Nẵng',
    '{supplier_debt}': '15,000,000',
    '{supplier_debt_prev}': '0',
    '{supplier_debt_text}': 'Mười lăm triệu đồng',
    '{supplier_debt_prev_text}': 'Không đồng',
    // === THÔNG TIN SẢN PHẨM ===
    '{line_stt}': '1',
    '{line_title}': 'Áo thun Polo nam - Size L - Màu xanh',
    '{line_variant_code}': 'ATP-L-XANH',
    '{line_product_name}': 'Áo thun Polo nam',
    '{line_variant}': 'Size L - Màu xanh',
    '{line_variant_name}': 'Size L - Màu xanh',
    '{line_variant_barcode}': '8935123456789',
    '{line_category}': 'Áo thun nam',
    '{line_unit}': 'Cái',
    '{line_note}': 'Hàng chất lượng cao',
    '{line_quantity}': '100',
    '{line_received_quantity}': '50',
    '{line_price}': '150,000',
    '{line_price_after_discount}': '142,500',
    '{line_discount_rate}': '5%',
    '{line_discount_amount}': '750,000',
    '{line_tax_exclude}': '142,500',
    '{line_tax_included}': '156,750',
    '{line_tax_amount}': '1,425,000',
    '{line_amount}': '15,675,000',
    '{line_total}': '15,675,000',
    '{line_weight_g}': '250',
    '{line_weight_kg}': '0.25',
    // === TỔNG GIÁ TRỊ ===
    '{total_quantity}': '100',
    '{total_line_amount}': '15,000,000',
    '{total}': '15,000,000',
    '{total_discounts}': '750,000',
    '{total_discount}': '750,000',
    '{total_discounts_rate}': '5%',
    '{total_discounts_value}': '750,000',
    '{total_tax}': '1,425,000',
    '{total_tax_included_line}': '0',
    '{total_amount_before_tax}': '14,250,000',
    '{total_amount_after_tax}': '15,675,000',
    '{total_price}': '15,675,000',
    '{total_order}': '15,675,000',
    '{total_amount}': '15,675,000',
    '{total_line_amount_text}': 'Mười lăm triệu sáu trăm bảy mươi lăm nghìn đồng',
    '{total_amount_text}': 'Mười lăm triệu sáu trăm bảy mươi lăm nghìn đồng',
    '{total_text}': 'Mười lăm triệu sáu trăm bảy mươi lăm nghìn đồng',
    // === TỰ ĐỘNG THÊM TỪ TEMPLATE ===
    '{line_ordered_quantity}': '10',
    '{discount}': '50,000',
    '{tax_vat}': '10%',
    '{account_name}': 'Trần Văn B'
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/preview/packing.preview.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PACKING_PREVIEW_DATA",
    ()=>PACKING_PREVIEW_DATA
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$_shared$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/preview/_shared.preview.ts [app-client] (ecmascript)");
;
const PACKING_PREVIEW_DATA = {
    // Kế thừa dữ liệu chung
    ...__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$_shared$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SHARED_PREVIEW_DATA"],
    // === THÔNG TIN GÓI HÀNG ===
    '{packing_code}': 'DG000123',
    '{order_code}': 'DH000123',
    '{created_on}': '05/12/2025',
    '{created_on_time}': '10:00',
    '{modified_on}': '05/12/2025',
    '{modified_on_time}': '10:30',
    '{packed_on}': '05/12/2025',
    '{packed_on_time}': '10:15',
    '{shipped_on}': '',
    '{shipped_on_time}': '',
    '{packing_status}': 'Đã đóng gói',
    '{fulfillment_status}': 'Đã đóng gói',
    '{package_note}': 'Gói kỹ, hàng dễ nhăn',
    '{order_note}': 'Giao hàng trước 5h chiều',
    '{note}': 'Gói kỹ, hàng dễ nhăn',
    // === THÔNG TIN KHÁCH HÀNG ===
    '{customer_name}': 'Nguyễn Văn A',
    '{customer_code}': 'KH000123',
    '{customer_phone_number}': '0912 345 678',
    '{customer_phone_number_hide}': '0912 *** 678',
    '{customer_email}': 'nguyenvana@email.com',
    '{customer_address}': '456 Lê Duẩn, Đà Nẵng',
    '{billing_address}': '456 Lê Duẩn, Đà Nẵng',
    '{shipping_address}': '456 Lê Duẩn, Quận Hải Châu, TP. Đà Nẵng',
    // === THÔNG TIN SẢN PHẨM ===
    '{line_stt}': '1',
    '{line_variant_code}': 'ATP-L-XANH',
    '{line_product_name}': 'Áo thun Polo nam',
    '{line_variant}': 'Size L - Màu xanh',
    '{line_variant_barcode}': '8935123456789',
    '{line_variant_options}': 'Size: L, Màu: Xanh',
    '{line_product_category}': 'Áo thun nam',
    '{line_product_brand}': 'TrendTech',
    '{line_unit}': 'Cái',
    '{line_quantity}': '2',
    '{line_price}': '250,000',
    '{line_price_after_discount}': '237,500',
    '{line_discount_rate}': '5%',
    '{line_discount_amount}': '25,000',
    '{line_tax_rate}': '10%',
    '{line_tax}': 'VAT 10%',
    '{line_tax_amount}': '47,500',
    '{line_tax_included}': 'Có',
    '{line_tax_exclude}': '225,000',
    '{line_amount}': '475,000',
    '{line_total}': '475,000',
    '{line_note}': 'Size vừa vặn',
    '{line_composite_variant_code}': '',
    '{line_composite_variant_name}': '',
    '{line_composite_unit}': '',
    '{line_composite_quantity}': '',
    '{serials}': 'SN001, SN002',
    '{lots_number_code1}': 'LOT2025001',
    '{lots_number_code2}': 'LOT2025001 - 2',
    '{lots_number_code3}': 'LOT2025001 - 01/12/2025 - 01/12/2026',
    '{lots_number_code4}': 'LOT2025001 - 01/12/2025 - 01/12/2026 - 2',
    // === TỔNG GIÁ TRỊ ===
    '{total_quantity}': '3',
    '{total}': '950,000',
    '{total_tax}': '90,000',
    '{total_amount_before_tax}': '900,000',
    '{total_amount_after_tax}': '990,000',
    '{total_amount}': '990,000',
    '{total_order}': '990,000',
    '{fulfillment_discount}': '50,000',
    '{total_amount_text}': 'Chín trăm chín mươi nghìn đồng',
    '{total_extra_tax}': '15,000',
    '{total_tax_included_line}': '75,000',
    // === TỰ ĐỘNG THÊM TỪ TEMPLATE ===
    '{fulfillment_code}': 'FUL000123',
    '{assigned_employee}': 'Nguyễn Thị C',
    '{bin_location}': 'Kệ A1-02',
    '{cod}': '470,000',
    '{packing_note}': 'Đóng gói cẩn thận',
    '{account_name}': 'Trần Văn B'
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/preview/quote.preview.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "QUOTE_PREVIEW_DATA",
    ()=>QUOTE_PREVIEW_DATA
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$_shared$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/preview/_shared.preview.ts [app-client] (ecmascript)");
;
const QUOTE_PREVIEW_DATA = {
    // Kế thừa dữ liệu chung
    ...__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$_shared$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SHARED_PREVIEW_DATA"],
    // === THÔNG TIN BÁO GIÁ ===
    '{quote_code}': 'BG000777',
    '{hand_over_code}': 'BG000777',
    '{created_on}': '05/12/2025',
    '{printed_on}': '05/12/2025',
    '{valid_until}': '15/12/2025',
    '{quantity}': '2',
    '{current_account_name}': 'Trần Văn B',
    '{note}': 'Báo giá có hiệu lực trong 10 ngày kể từ ngày lập',
    // === THÔNG TIN KHÁCH HÀNG ===
    '{customer_name}': 'Nguyễn Văn A',
    '{customer_code}': 'KH000123',
    '{customer_phone_number}': '0912 345 678',
    '{customer_email}': 'nguyenvana@email.com',
    '{customer_address}': '456 Lê Duẩn, Quận Hải Châu, Đà Nẵng',
    '{billing_address}': '456 Lê Duẩn, Quận Hải Châu, Đà Nẵng',
    // === THÔNG TIN SẢN PHẨM ===
    '{line_stt}': '1',
    '{line_variant_code}': 'ATP-L-XANH',
    '{line_product_name}': 'Áo thun Polo nam',
    '{line_variant}': 'Size L - Màu xanh',
    '{line_unit}': 'Cái',
    '{line_quantity}': '2',
    '{line_price}': '250,000',
    '{line_discount_amount}': '25,000',
    '{line_total}': '475,000',
    '{line_amount}': '475,000',
    // === THÔNG TIN GIAO HÀNG ===
    '{shipping_provider_name}': 'Giao hàng tiết kiệm',
    '{service_name}': 'Giao hàng nhanh',
    '{freight_payer}': 'Người nhận',
    '{total_freight_amount}': '50,000',
    '{total_cod}': '990,000',
    '{city}': 'Đà Nẵng',
    '{district}': 'Hải Châu',
    // === THÔNG TIN ĐƠN HÀNG ===
    '{order_code}': 'DH000123',
    '{shipment_code}': 'GHTK123456',
    '{shipping_name}': 'Nguyễn Văn A',
    '{shipping_phone}': '0912 345 678',
    '{shipping_phone_hide}': '0912 *** 678',
    '{shipping_address}': '456 Lê Duẩn, Quận Hải Châu, TP. Đà Nẵng',
    '{cod}': '990,000',
    '{freight_amount}': '25,000',
    // === TỔNG GIÁ TRỊ ===
    '{total_quantity}': '3',
    '{total}': '950,000',
    '{total_discount}': '50,000',
    '{total_order}': '990,000',
    '{total_amount}': '990,000',
    '{total_text}': 'Chín trăm chín mươi nghìn đồng',
    // === TỰ ĐỘNG THÊM TỪ TEMPLATE ===
    '{created_on_time}': '14:30',
    '{issued_on}': '05/12/2025',
    '{account_name}': 'Trần Văn B',
    '{price_list_name}': 'Bảng giá lẻ',
    '{total_tax}': '50,000',
    '{order_note}': 'Khách VIP - ưu tiên giao'
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/preview/delivery.preview.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELIVERY_PREVIEW_DATA",
    ()=>DELIVERY_PREVIEW_DATA
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$_shared$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/preview/_shared.preview.ts [app-client] (ecmascript)");
;
const DELIVERY_PREVIEW_DATA = {
    // Kế thừa dữ liệu chung
    ...__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$_shared$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SHARED_PREVIEW_DATA"],
    // === THÔNG TIN PHIẾU GIAO ===
    '{delivery_code}': 'GH000888',
    '{receipt_voucher_code}': 'GH000888',
    '{created_on}': '05/12/2025',
    '{created_on_time}': '14:00',
    '{issued_on}': '05/12/2025',
    '{issued_on_time}': '14:00',
    '{counted}': 'Có',
    '{group_name}': 'Giao hàng',
    '{reference}': 'DH000123',
    '{order_code}': 'DH000123',
    '{document_root_code}': 'DH000123',
    '{delivery_status}': 'Đang giao',
    '{status}': 'Đang giao',
    '{payment_method_name}': 'COD',
    // === THÔNG TIN KHÁCH HÀNG ===
    '{customer_name}': 'Nguyễn Văn A',
    '{customer_code}': 'KH000123',
    '{customer_phone_number}': '0912 345 678',
    '{customer_address}': '456 Lê Duẩn, Quận Hải Châu, Đà Nẵng',
    '{shipping_address}': '456 Lê Duẩn, Quận Hải Châu, Đà Nẵng',
    '{customer_group}': 'Khách VIP',
    '{object_name}': 'Nguyễn Văn A',
    '{object_phone_number}': '0912 345 678',
    '{object_address}': '456 Lê Duẩn, Quận Hải Châu, Đà Nẵng',
    '{object_type}': 'Khách hàng',
    // === THÔNG TIN SẢN PHẨM ===
    '{line_stt}': '1',
    '{line_variant_code}': 'ATP-L-XANH',
    '{line_product_name}': 'Áo thun Polo nam',
    '{line_variant}': 'Size L - Màu xanh',
    '{line_variant_name}': 'Size L - Màu xanh',
    '{line_unit}': 'Cái',
    '{line_quantity}': '2',
    '{line_price}': '250,000',
    '{line_total}': '500,000',
    '{line_amount}': '500,000',
    '{line_variant_barcode}': '8935123456789',
    '{line_brand}': 'TrendTech',
    '{line_category}': 'Áo thun nam',
    '{line_weight_g}': '250',
    '{line_weight_kg}': '0.25',
    '{line_variant_image}': '<img src="https://placehold.co/60x60?text=SP" alt="Product" style="width:60px;height:60px"/>',
    // === SỐ TIỀN ===
    '{amount}': '990,000',
    '{total_quantity}': '3',
    '{total_order}': '990,000',
    '{total_amount}': '990,000',
    '{cod}': '990,000',
    '{total_text}': 'Chín trăm chín mươi nghìn đồng',
    '{total_weight_g}': '750',
    '{total_weight_kg}': '0.75',
    // === NỢ KHÁCH HÀNG ===
    '{customer_debt}': '990,000',
    '{customer_debt_text}': 'Chín trăm chín mươi nghìn đồng',
    '{customer_debt_prev}': '0',
    '{customer_debt_prev_text}': 'Không đồng',
    '{customer_debt_before_create_receipt}': '0',
    '{customer_debt_before_create_receipt_text}': 'Không đồng',
    '{customer_debt_after_create_receipt}': '990,000',
    '{customer_debt_after_create_receipt_text}': 'Chín trăm chín mươi nghìn đồng',
    // === NỢ NHÀ CUNG CẤP ===
    '{supplier_debt}': '0',
    '{supplier_debt_text}': 'Không đồng',
    '{supplier_debt_prev}': '0',
    '{supplier_debt_prev_text}': 'Không đồng',
    '{supplier_debt_before_create_receipt}': '0',
    '{supplier_debt_before_create_receipt_text}': 'Không đồng',
    '{supplier_debt_after_create_receipt}': '0',
    '{supplier_debt_after_create_receipt_text}': 'Không đồng',
    // === NGƯỜI GỬI/NHẬN ===
    '{shipper_name}': 'Nguyễn Văn Shipper',
    '{shipper_phone_number}': '0909 888 777',
    // === GHI CHÚ ===
    '{note}': 'Giao giờ hành chính, gọi trước 30 phút',
    '{delivery_note}': 'Giao giờ hành chính, gọi trước 30 phút',
    // === TỰ ĐỘNG THÊM TỪ TEMPLATE ===
    '{shipment_barcode}': '<img src="https://placehold.co/150x50?text=BARCODE" alt="Barcode" style="height:50px"/>',
    '{tracking_number}': 'VD123456789',
    '{carrier_name}': 'Giao Hàng Nhanh',
    '{receiver_name}': 'Nguyễn Văn A',
    '{receiver_phone}': '0912 345 678',
    '{total}': '500,000',
    '{delivery_fee}': '30,000',
    '{cod_amount}': '470,000'
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/preview/shipping-label.preview.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SHIPPING_LABEL_PREVIEW_DATA",
    ()=>SHIPPING_LABEL_PREVIEW_DATA
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$_shared$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/preview/_shared.preview.ts [app-client] (ecmascript)");
;
const SHIPPING_LABEL_PREVIEW_DATA = {
    // Kế thừa dữ liệu chung
    ...__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$_shared$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SHARED_PREVIEW_DATA"],
    // === THÔNG TIN ĐƠN HÀNG ===
    '{order_code}': 'DH000123',
    '{order_qr_code}': '<img src="https://placehold.co/80x80?text=QR" alt="QR" style="width:80px;height:80px"/>',
    '{order_bar_code}': '<img src="https://placehold.co/150x50?text=BARCODE" alt="Barcode" style="height:50px"/>',
    '{created_on}': '05/12/2025',
    '{created_on_time}': '10:00',
    '{modified_on}': '05/12/2025',
    '{modified_on_time}': '10:30',
    '{received_on}': '',
    '{received_on_time}': '',
    '{packed_on}': '05/12/2025',
    '{packed_on_time}': '10:15',
    '{shipped_on_time}': '',
    '{status}': 'Chờ giao',
    '{pushing_status}': 'Đã đẩy đơn',
    // === THÔNG TIN VẬN CHUYỂN ===
    '{tracking_number}': 'GHTK123456789',
    '{tracking_number_qr_code}': '<img src="https://placehold.co/80x80?text=QR-VD" alt="QR" style="width:80px;height:80px"/>',
    '{tracking_number_bar_code}': '<img src="https://placehold.co/150x50?text=VD-CODE" alt="Barcode" style="height:50px"/>',
    '{delivery_type}': 'Giao hàng nhanh',
    '{delivery_service_provider}': 'Giao hàng tiết kiệm',
    '{service_name}': 'Giao hàng nhanh',
    '{partner_type}': 'Đối tác vận chuyển',
    '{partner_phone_number}': '1900 636 636',
    '{packing_weight}': '0.5 kg',
    '{creator_name}': 'Trần Văn B',
    '{route_code_se}': 'DN-HC-001',
    '{sorting_code}': 'BC001',
    '{sorting_code_bar_code}': '<img src="https://placehold.co/150x50?text=BC001" alt="Barcode" style="height:50px"/>',
    // === VNPOST ===
    '{vnpost_crm_code}': 'CRM123456',
    '{vnpost_crm_bar_code}': '<img src="https://placehold.co/150x50?text=CRM" alt="Barcode" style="height:50px"/>',
    // === THÔNG TIN KHÁCH HÀNG ===
    '{customer_name}': 'NGUYỄN VĂN A',
    '{customer_phone_number}': '0912 345 678',
    '{customer_phone_number_hide}': '0912 *** 678',
    '{customer_email}': 'nguyenvana@email.com',
    '{receiver_name}': 'NGUYỄN VĂN A',
    '{receiver_phone}': '0912 345 678',
    '{receiver_phone_hide}': '0912 *** 678',
    '{shipping_address}': '456 Lê Duẩn, Quận Hải Châu, TP. Đà Nẵng',
    '{billing_address}': '456 Lê Duẩn, Đà Nẵng',
    '{city}': 'Đà Nẵng',
    '{district}': 'Hải Châu',
    '{ship_on_min}': '06/12/2025',
    '{ship_on_max}': '08/12/2025',
    '{shipper_deposits}': '0',
    '{reason_cancel}': '',
    // === TỔNG GIÁ TRỊ ===
    '{total_quantity}': '3',
    '{total}': '950,000',
    '{total_tax}': '90,000',
    '{delivery_fee}': '30,000',
    '{cod_amount}': '990,000',
    '{total_amount}': '990,000',
    '{fulfillment_discount}': '50,000',
    '{freight_amount}': '25,000',
    '{shipment_note}': 'Hàng dễ vỡ - Xin nhẹ tay',
    // === TỰ ĐỘNG THÊM TỪ TEMPLATE ===
    '{shipment_barcode}': '<img src="https://placehold.co/150x50?text=BARCODE" alt="Barcode" style="height:50px"/>',
    '{shipment_code}': 'VD123456789',
    '{total_weight_g}': '500',
    '{cod}': '470,000',
    '{note}': 'Gọi trước khi giao',
    '{shipment_qrcode}': '<img src="https://placehold.co/100x100?text=QR" alt="QR" style="width:100px"/>',
    '{total_weight_kg}': '0.5'
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/preview/product-label.preview.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PRODUCT_LABEL_PREVIEW_DATA",
    ()=>PRODUCT_LABEL_PREVIEW_DATA
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$_shared$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/preview/_shared.preview.ts [app-client] (ecmascript)");
;
const PRODUCT_LABEL_PREVIEW_DATA = {
    ...__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$_shared$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SHARED_PREVIEW_DATA"],
    // Thông tin sản phẩm cơ bản
    '{product_name}': 'Chuột có dây Hoco GM19',
    '{product_name_vat}': 'Chuột có dây dùng cho máy tính, chất liệu bằng nhựa, sử dụng điện áp 5V/1A qua cổng sạc usb. Nhãn hiệu: Hoco. Model: GM19. Mới 100%',
    '{product_sku}': 'HOCO-GM19',
    '{product_unit}': 'Cái',
    '{product_brand}': 'HOCO',
    '{product_category}': 'Phụ kiện máy tính',
    '{product_weight}': '150g',
    '{product_origin}': 'Trung Quốc',
    // Thông tin nhập khẩu
    '{product_importer_name}': 'CÔNG TY TNHH XUẤT NHẬP KHẨU VÀ DỊCH VỤ TRƯỜNG THỊNH',
    '{product_importer_address}': 'Số 5, Ngõ 85 đường Tổ Sơn, Phường Chi Lăng, Thành Phố Lạng Sơn, Tỉnh Lạng Sơn, Việt Nam',
    '{product_usage_guide}': 'Bên Trong bao bì SP',
    // Ngày & lô
    '{product_lot_number}': 'LOT-2412-A1',
    '{product_mfg_date}': '05/12/2025',
    '{product_expiry_date}': '05/12/2027',
    // Giá & mã
    '{product_price}': '125.000 đ',
    '{product_barcode}': '8938505974190',
    '{product_barcode_image}': '<img src="https://barcodeapi.org/api/128/8938505974190" style="height:48px" alt="barcode"/>',
    '{product_qr_code}': '<img src="https://quickchart.io/qr?text=HOCO-GM19&size=96" style="width:96px;height:96px" alt="qr"/>',
    // Mô tả (legacy)
    '{product_short_description}': 'Chuột có dây USB Hoco GM19',
    '{product_description}': 'Chuột có dây dùng cho máy tính, chất liệu nhựa cao cấp.',
    '{product_storage_instructions}': 'Bảo quản nơi khô ráo, tránh nhiệt cao.',
    '{product_ingredients}': ''
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/preview/supplier-return.preview.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SUPPLIER_RETURN_PREVIEW_DATA",
    ()=>SUPPLIER_RETURN_PREVIEW_DATA
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$_shared$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/preview/_shared.preview.ts [app-client] (ecmascript)");
;
const SUPPLIER_RETURN_PREVIEW_DATA = {
    // Kế thừa dữ liệu chung
    ...__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$_shared$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SHARED_PREVIEW_DATA"],
    // === THÔNG TIN PHIẾU HOÀN TRẢ ===
    '{return_supplier_code}': 'THNCC000111',
    '{refund_code}': 'THNCC000111',
    '{purchase_order_code}': 'PO000555',
    '{created_on}': '05/12/2025',
    '{modified_on}': '05/12/2025',
    '{reference}': 'REF-THNCC-001',
    '{reason_return}': 'Hàng lỗi từ nhà sản xuất - đường may không đạt chuẩn',
    '{note}': 'Hàng lỗi từ nhà sản xuất - đường may không đạt chuẩn',
    // === THÔNG TIN NHÀ CUNG CẤP ===
    '{supplier_name}': 'Công ty May Mặc Việt',
    '{supplier_code}': 'NCC001',
    '{supplier_address}': 'KCN Hòa Khánh, Đà Nẵng',
    '{supplier_address1}': 'KCN Hòa Khánh, Đà Nẵng',
    '{supplier_phone_number}': '0236 3333 444',
    '{supplier_email}': 'contact@maymacviet.vn',
    // === THÔNG TIN SẢN PHẨM ===
    '{line_stt}': '1',
    '{line_variant_code}': 'ATP-L-XANH',
    '{line_variant_sku}': 'ATP-L-XANH',
    '{line_product_name}': 'Áo thun Polo nam',
    '{line_variant}': 'Size L - Màu xanh (lỗi đường may)',
    '{line_variant_name}': 'Size L - Màu xanh (lỗi đường may)',
    '{line_variant_barcode}': '8935123456789',
    '{line_unit}': 'Cái',
    '{line_quantity}': '5',
    '{line_price}': '150,000',
    '{line_price_after_discount}': '150,000',
    '{line_discount_rate}': '0%',
    '{line_discount_amount}': '0',
    '{line_amount}': '750,000',
    '{line_total}': '750,000',
    '{line_amount_none_discount}': '750,000',
    '{tax_lines_rate}': '10%',
    '{serials}': 'SN001, SN002, SN003, SN004, SN005',
    '{lots_number_code1}': 'LOT2025001',
    '{lots_number_code2}': 'LOT2025001 - 5',
    '{lots_number_code3}': 'LOT2025001 - 01/12/2025 - 01/12/2026',
    '{lots_number_code4}': 'LOT2025001 - 01/12/2025 - 01/12/2026 - 5',
    // === TỔNG GIÁ TRỊ ===
    '{total_quantity}': '5',
    '{total_order}': '750,000',
    '{total_amount}': '750,000',
    '{total_tax}': '75,000',
    '{total_landed_costs}': '50,000',
    '{total_discounts}': '0',
    '{total_price}': '825,000',
    '{discrepancy_price}': '0',
    '{discrepancy_reason}': '',
    '{refunded}': '0',
    '{remaining}': '825,000',
    '{transaction_refund_amount}': '825,000',
    '{transaction_refund_method_name}': 'Chuyển khoản',
    '{transaction_refund_method_amount}': '825,000',
    // === TỰ ĐỘNG THÊM TỪ TEMPLATE ===
    '{account_name}': 'Trần Văn B'
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/preview/complaint.preview.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "COMPLAINT_PREVIEW_DATA",
    ()=>COMPLAINT_PREVIEW_DATA
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$_shared$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/preview/_shared.preview.ts [app-client] (ecmascript)");
;
const COMPLAINT_PREVIEW_DATA = {
    // Kế thừa dữ liệu chung
    ...__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$_shared$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SHARED_PREVIEW_DATA"],
    // === THÔNG TIN PHIẾU ===
    '{complaint_code}': 'KN000123',
    '{created_on}': '05/12/2025',
    '{created_on_time}': '09:00',
    // === THÔNG TIN KHÁCH HÀNG ===
    '{customer_name}': 'Nguyễn Văn A',
    '{customer_code}': 'KH00456',
    '{customer_phone_number}': '0912 345 678',
    '{customer_email}': 'nguyenvana@email.com',
    '{customer_address}': '456 Lê Duẩn, Đà Nẵng',
    // === THÔNG TIN ĐƠN HÀNG LIÊN QUAN ===
    '{order_code}': 'DH000100',
    '{order_date}': '01/12/2025',
    // === NỘI DUNG KHIẾU NẠI ===
    '{complaint_type}': 'Sản phẩm lỗi',
    '{complaint_description}': 'Sản phẩm bị rách đường may sau 2 ngày sử dụng',
    '{customer_request}': 'Đổi sản phẩm mới hoặc hoàn tiền',
    '{line_product_name}': 'Áo thun Polo nam',
    '{line_variant}': 'Size L - Màu xanh',
    '{line_variant_code}': 'ATP-L-XANH',
    // === XỬ LÝ KHIẾU NẠI ===
    '{complaint_status}': 'Đã xử lý',
    '{resolution}': 'Đổi sản phẩm mới cho khách hàng',
    '{assignee_name}': 'Trần Văn B - Nhân viên CSKH',
    '{resolved_on}': '06/12/2025',
    '{complaint_note}': 'Khách hàng hài lòng với cách xử lý'
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/preview/penalty.preview.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PENALTY_PREVIEW_DATA",
    ()=>PENALTY_PREVIEW_DATA
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$_shared$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/preview/_shared.preview.ts [app-client] (ecmascript)");
;
const PENALTY_PREVIEW_DATA = {
    // Kế thừa dữ liệu chung (chỉ lấy thông tin cửa hàng)
    '{store_logo}': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$_shared$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SHARED_PREVIEW_DATA"]['{store_logo}'],
    '{store_name}': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$_shared$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SHARED_PREVIEW_DATA"]['{store_name}'],
    '{store_address}': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$_shared$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SHARED_PREVIEW_DATA"]['{store_address}'],
    '{account_name}': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$_shared$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SHARED_PREVIEW_DATA"]['{account_name}'],
    // === THÔNG TIN PHIẾU ===
    '{penalty_code}': 'XP000045',
    '{created_on}': '05/12/2025',
    '{created_on_time}': '08:30',
    // === THÔNG TIN NHÂN VIÊN ===
    '{employee_name}': 'Lê Văn C',
    '{employee_code}': 'NV00123',
    '{department_name}': 'Bộ phận Bán hàng',
    '{position_name}': 'Nhân viên kinh doanh',
    // === NỘI DUNG VI PHẠM ===
    '{violation_type}': 'Vi phạm nội quy',
    '{violation_date}': '04/12/2025',
    '{violation_description}': 'Đi làm muộn quá 30 phút không có lý do chính đáng',
    '{evidence}': 'Hệ thống chấm công ghi nhận',
    '{violation_count}': '2',
    // === HÌNH THỨC XỬ PHẠT ===
    '{penalty_type}': 'Trừ lương',
    '{penalty_amount}': '200,000',
    '{penalty_amount_text}': 'Hai trăm nghìn đồng',
    '{penalty_note}': 'Nhân viên đã ký nhận và cam kết không tái phạm'
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/preview/cost-adjustment.preview.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "COST_ADJUSTMENT_LINE_ITEMS_PREVIEW",
    ()=>COST_ADJUSTMENT_LINE_ITEMS_PREVIEW,
    "COST_ADJUSTMENT_PREVIEW_DATA",
    ()=>COST_ADJUSTMENT_PREVIEW_DATA
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$_shared$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/preview/_shared.preview.ts [app-client] (ecmascript)");
;
const COST_ADJUSTMENT_PREVIEW_DATA = {
    // Kế thừa dữ liệu chung (chỉ lấy thông tin cửa hàng)
    '{store_logo}': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$_shared$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SHARED_PREVIEW_DATA"]['{store_logo}'],
    '{store_name}': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$_shared$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SHARED_PREVIEW_DATA"]['{store_name}'],
    '{store_address}': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$_shared$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SHARED_PREVIEW_DATA"]['{store_address}'],
    '{store_phone}': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$_shared$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SHARED_PREVIEW_DATA"]['{store_phone}'] || '0909 123 456',
    '{account_name}': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$_shared$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SHARED_PREVIEW_DATA"]['{account_name}'],
    '{print_date}': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$_shared$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SHARED_PREVIEW_DATA"]['{print_date}'],
    '{print_time}': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$_shared$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SHARED_PREVIEW_DATA"]['{print_time}'],
    // === THÔNG TIN PHIẾU ===
    '{adjustment_code}': 'DCGV000012',
    '{code}': 'DCGV000012',
    '{created_on}': '15/01/2025',
    '{created_on_time}': '09:30',
    '{confirmed_on}': '15/01/2025',
    '{cancelled_on}': '',
    '{status}': 'Đã xác nhận',
    '{reason}': 'Cập nhật giá nhập kho mới',
    '{note}': 'Điều chỉnh theo đợt nhập hàng T1/2025',
    // === THÔNG TIN CHI NHÁNH ===
    '{location_name}': 'Chi nhánh Quận 1',
    '{location_address}': '123 Nguyễn Huệ, Q.1, TP.HCM',
    '{location_province}': 'TP. Hồ Chí Minh',
    // === NGƯỜI XÁC NHẬN ===
    '{confirmed_by}': 'Trần Văn B',
    // === TỔNG CỘNG ===
    '{total_items}': '3',
    '{total_difference}': '850,000',
    '{total_increase}': '1,050,000',
    '{total_decrease}': '200,000'
};
const COST_ADJUSTMENT_LINE_ITEMS_PREVIEW = [
    {
        '{line_stt}': '1',
        '{line_variant_code}': 'SP001',
        '{line_product_name}': 'Áo thun nam cotton',
        '{line_variant_name}': 'Đen - L',
        '{line_variant_barcode}': '8934567890123',
        '{line_unit}': 'Cái',
        '{line_old_price}': '120,000',
        '{line_new_price}': '150,000',
        '{line_difference}': '+30,000',
        '{line_on_hand}': '25',
        '{line_total_difference}': '750,000',
        '{line_reason}': 'Giá nhập tăng',
        '{line_brand}': 'Uniqlo',
        '{line_category}': 'Áo thun'
    },
    {
        '{line_stt}': '2',
        '{line_variant_code}': 'SP002',
        '{line_product_name}': 'Quần jean nam',
        '{line_variant_name}': 'Xanh đậm - 32',
        '{line_variant_barcode}': '8934567890456',
        '{line_unit}': 'Cái',
        '{line_old_price}': '350,000',
        '{line_new_price}': '380,000',
        '{line_difference}': '+30,000',
        '{line_on_hand}': '10',
        '{line_total_difference}': '300,000',
        '{line_reason}': 'Cập nhật giá mới',
        '{line_brand}': 'Levi\'s',
        '{line_category}': 'Quần jean'
    },
    {
        '{line_stt}': '3',
        '{line_variant_code}': 'SP003',
        '{line_product_name}': 'Áo khoác gió',
        '{line_variant_name}': 'Đỏ - XL',
        '{line_variant_barcode}': '8934567890789',
        '{line_unit}': 'Cái',
        '{line_old_price}': '450,000',
        '{line_new_price}': '430,000',
        '{line_difference}': '-20,000',
        '{line_on_hand}': '10',
        '{line_total_difference}': '-200,000',
        '{line_reason}': 'Điều chỉnh giảm',
        '{line_brand}': 'Nike',
        '{line_category}': 'Áo khoác'
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/preview/payroll.preview.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PAYROLL_PREVIEW_DATA",
    ()=>PAYROLL_PREVIEW_DATA,
    "PAYROLL_PREVIEW_LINE_ITEMS",
    ()=>PAYROLL_PREVIEW_LINE_ITEMS
]);
/**
 * Payroll Preview Data - Bảng lương
 * Dữ liệu mẫu cho preview mẫu in bảng lương
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$_shared$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/preview/_shared.preview.ts [app-client] (ecmascript)");
;
const PAYROLL_PREVIEW_DATA = {
    ...__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$_shared$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SHARED_PREVIEW_DATA"],
    // Thông tin bảng lương
    '{batch_code}': 'PL-2024-12-001',
    '{batch_title}': 'Bảng lương tháng 12/2024',
    '{batch_status}': 'Đã khóa',
    '{pay_period}': '12/2024',
    '{pay_period_start}': '01/12/2024',
    '{pay_period_end}': '31/12/2024',
    '{payroll_date}': '05/01/2025',
    '{reference_months}': '2024-12',
    '{created_on}': '02/01/2025',
    '{created_by}': 'Nguyễn Văn A',
    '{locked_on}': '05/01/2025',
    '{locked_by}': 'Trần Văn B',
    '{notes}': 'Bảng lương tháng 12/2024',
    // Tổng kết
    '{total_employees}': '15',
    '{total_gross}': '450,000,000',
    '{total_gross_text}': 'Bốn trăm năm mươi triệu đồng',
    '{total_earnings}': '500,000,000',
    '{total_deductions}': '30,000,000',
    '{total_contributions}': '20,000,000',
    '{total_net}': '450,000,000',
    '{total_net_text}': 'Bốn trăm năm mươi triệu đồng'
};
const PAYROLL_PREVIEW_LINE_ITEMS = [
    {
        '{line_index}': '1',
        '{employee_code}': 'NV001',
        '{employee_name}': 'Nguyễn Văn A',
        '{department_name}': 'Kỹ thuật',
        '{earnings}': '35,000,000',
        '{deductions}': '2,000,000',
        '{contributions}': '1,500,000',
        '{net_pay}': '31,500,000'
    },
    {
        '{line_index}': '2',
        '{employee_code}': 'NV002',
        '{employee_name}': 'Trần Thị B',
        '{department_name}': 'Kinh doanh',
        '{earnings}': '28,000,000',
        '{deductions}': '1,500,000',
        '{contributions}': '1,200,000',
        '{net_pay}': '25,300,000'
    },
    {
        '{line_index}': '3',
        '{employee_code}': 'NV003',
        '{employee_name}': 'Lê Văn C',
        '{department_name}': 'Nhân sự',
        '{earnings}': '25,000,000',
        '{deductions}': '1,200,000',
        '{contributions}': '1,000,000',
        '{net_pay}': '22,800,000'
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/preview/attendance.preview.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ATTENDANCE_PREVIEW_DATA",
    ()=>ATTENDANCE_PREVIEW_DATA,
    "ATTENDANCE_PREVIEW_LINE_ITEMS",
    ()=>ATTENDANCE_PREVIEW_LINE_ITEMS
]);
/**
 * Attendance Preview Data - Bảng chấm công
 * Dữ liệu mẫu cho preview mẫu in bảng chấm công
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$_shared$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/preview/_shared.preview.ts [app-client] (ecmascript)");
;
const ATTENDANCE_PREVIEW_DATA = {
    ...__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$_shared$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SHARED_PREVIEW_DATA"],
    // Thông tin bảng chấm công
    '{month_year}': '12/2024',
    '{month}': '12',
    '{year}': '2024',
    '{department_name}': 'Tất cả phòng ban',
    '{is_locked}': 'Đã khóa',
    '{created_on}': '01/01/2025',
    '{created_by}': 'Nguyễn Văn A',
    // Tổng kết
    '{total_employees}': '15',
    '{total_work_days}': '330',
    '{total_leave_days}': '12',
    '{total_absent_days}': '3',
    '{total_late_arrivals}': '8',
    '{total_early_departures}': '5',
    '{total_ot_hours}': '45'
};
const ATTENDANCE_PREVIEW_LINE_ITEMS = [
    {
        '{line_index}': '1',
        '{employee_code}': 'NV001',
        '{employee_name}': 'Nguyễn Văn A',
        '{department_name}': 'Kỹ thuật',
        '{work_days}': '22',
        '{leave_days}': '0',
        '{absent_days}': '0',
        '{late_arrivals}': '1',
        '{early_departures}': '0',
        '{ot_hours}': '5',
        '{day_1}': '✓',
        '{day_2}': '✓',
        '{day_3}': '✓',
        '{day_4}': '✓',
        '{day_5}': '✓',
        '{day_6}': '-',
        '{day_7}': '-'
    },
    {
        '{line_index}': '2',
        '{employee_code}': 'NV002',
        '{employee_name}': 'Trần Thị B',
        '{department_name}': 'Kinh doanh',
        '{work_days}': '21',
        '{leave_days}': '1',
        '{absent_days}': '0',
        '{late_arrivals}': '2',
        '{early_departures}': '1',
        '{ot_hours}': '3',
        '{day_1}': '✓',
        '{day_2}': 'P',
        '{day_3}': '✓',
        '{day_4}': '✓',
        '{day_5}': '✓',
        '{day_6}': '-',
        '{day_7}': '-'
    },
    {
        '{line_index}': '3',
        '{employee_code}': 'NV003',
        '{employee_name}': 'Lê Văn C',
        '{department_name}': 'Nhân sự',
        '{work_days}': '20',
        '{leave_days}': '1',
        '{absent_days}': '1',
        '{late_arrivals}': '0',
        '{early_departures}': '0',
        '{ot_hours}': '0',
        '{day_1}': '✓',
        '{day_2}': '✓',
        '{day_3}': 'X',
        '{day_4}': '✓',
        '{day_5}': 'P',
        '{day_6}': '-',
        '{day_7}': '-'
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/preview/don-nhap-hang.preview.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DON_NHAP_HANG_PREVIEW",
    ()=>DON_NHAP_HANG_PREVIEW
]);
/**
 * Preview data for Đơn nhập hàng (don-nhap-hang)
 * Dữ liệu mẫu cho Phiếu đơn nhập hàng
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$_shared$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/preview/_shared.preview.ts [app-client] (ecmascript)");
;
const DON_NHAP_HANG_PREVIEW = {
    ...__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$_shared$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SHARED_PREVIEW_DATA"],
    // Thông tin đơn nhập
    purchase_order_code: 'PO-2024-001234',
    modified_on: '05/12/2024',
    received_on: '04/12/2024',
    received_on_time: '14:30',
    due_on: '10/12/2024',
    supplier_name: 'Công ty TNHH Cung ứng ABC',
    supplier_code: 'NCC-001',
    supplier_phone: '028 3456 7890',
    supplier_email: 'contact@supplierabc.com',
    supplier_address: '123 Nguyễn Văn Linh, Quận 7, TP.HCM',
    billing_address: '456 Lê Văn Việt, Quận 9, TP.HCM',
    supplier_debt_text: 'Năm mươi triệu đồng',
    supplier_debt_prev_text: 'Hai mươi triệu đồng',
    weight_g: '5,000',
    weight_kg: '5',
    tags: 'Nhập kho, Hàng mới',
    total_transaction_amount: '30,000,000',
    total_remain: '20,000,000',
    created_on: '01/12/2024',
    modified_on_time: '10:15',
    reference: 'REF-NH-001234',
    created_on_time: '09:00',
    due_on_time: '17:00',
    status: 'Đã nhập kho',
    received_status: 'Đã nhận đủ',
    financial_status: 'Đã thanh toán một phần',
    refund_status: 'Chưa hoàn',
    refund_transaction_status: 'Chưa hoàn tiền',
    supplier_debt: '50,000,000',
    supplier_debt_prev: '20,000,000',
    assignee_name: 'Trần Văn B',
    note: 'Ghi chú đơn nhập hàng mẫu',
    // Thông tin sản phẩm
    line_stt: '1',
    line_unit: 'Cái',
    line_discount_rate: '5',
    line_note: 'Hàng mới nhập',
    line_quantity: '100',
    line_variant_barcode: '8936012345678',
    line_product_name: 'Áo thun nam cao cấp',
    line_variant_options: 'Trắng / XL',
    line_brand: 'Fashion Brand',
    line_tax_rate: '10',
    line_weight_kg: '0.2',
    line_weight_g: '200',
    lots_number_code1: 'LOT-2024-001',
    lots_number_code2: 'LOT-2024-001 - 100',
    lots_number_code3: 'LOT-2024-001 - 01/12/2024 - 01/12/2025',
    lots_number_code4: 'LOT-2024-001 - 01/12/2024 - 01/12/2025 - 100',
    line_tax_exclude: '450,000',
    line_price_after_discount: '427,500',
    line_title: 'Áo thun nam cao cấp - Trắng / XL',
    line_tax: 'VAT 10%',
    line_discount_amount: '22,500',
    line_price: '450,000',
    line_amount: '42,750,000',
    line_variant_code: 'ATN-001-WH-XL',
    line_variant_name: 'Trắng / XL',
    line_category: 'Áo thun',
    line_tax_amount: '4,275,000',
    serials: 'SN001, SN002, SN003',
    line_tax_included: '495,000',
    // Tổng giá trị
    total_quantity: '100',
    total_tax: '4,275,000',
    total_amount_transaction: '30,000,000',
    total_discounts_value: '2,250,000',
    total_amount_text: 'Năm mươi triệu hai trăm năm mươi nghìn đồng',
    total_landed_costs: '1,000,000',
    total_amount_before_tax: '42,750,000',
    payments: 'Tiền mặt: 20,000,000 | Chuyển khoản: 10,000,000',
    product_discount: '2,250,000',
    total_price: '50,250,000',
    total: '45,000,000',
    total_discounts_rate: '5',
    total_discounts: '2,250,000',
    total_extra_tax: '4,275,000',
    total_tax_included_line: '4,275,000',
    total_amount_after_tax: '50,250,000'
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/preview/don-tra-hang.preview.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DON_TRA_HANG_PREVIEW",
    ()=>DON_TRA_HANG_PREVIEW
]);
/**
 * Preview data for Đơn trả hàng (don-tra-hang)
 * Dữ liệu mẫu cho Phiếu đơn trả hàng (khách trả)
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$_shared$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/preview/_shared.preview.ts [app-client] (ecmascript)");
;
const DON_TRA_HANG_PREVIEW = {
    ...__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$_shared$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SHARED_PREVIEW_DATA"],
    // Thông tin cửa hàng (bổ sung)
    order_return_code: 'DTH-2024-001234',
    // Thông tin đơn hàng
    customer_name: 'Nguyễn Văn A',
    order_code: 'DH-2024-005678',
    modified_on: '05/12/2024',
    note: 'Khách đổi size áo',
    reason_return: 'Sản phẩm không đúng size',
    refund_status: 'Đã hoàn tiền',
    customer_phone_number: '0901 234 567',
    customer_group: 'Khách VIP',
    billing_address: '456 Nguyễn Huệ, Quận 1, TP.HCM',
    created_on: '04/12/2024',
    received_on: '05/12/2024',
    reference: 'REF-TH-001234',
    status: 'Đã hoàn thành',
    // Thông tin giỏ hàng
    line_stt: '1',
    line_unit: 'Cái',
    line_variant_code: 'ATN-001-BL-L',
    line_quantity: '2',
    line_price: '350,000',
    line_brand: 'Fashion Brand',
    line_product_name: 'Áo thun nam basic',
    line_note: 'Trả do không vừa size',
    line_variant: 'Đen / L',
    line_amount: '700,000',
    serials: 'SN-TH001, SN-TH002',
    line_variant_options: 'Đen / L',
    // Tổng giá trị
    total_quantity: '2',
    total_amount: '700,000'
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/preview/phieu-ban-giao.preview.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PHIEU_BAN_GIAO_PREVIEW",
    ()=>PHIEU_BAN_GIAO_PREVIEW
]);
/**
 * Preview data for Phiếu bàn giao (phieu-ban-giao)
 * Dữ liệu mẫu cho Phiếu bàn giao đơn hàng cho shipper
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$_shared$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/preview/_shared.preview.ts [app-client] (ecmascript)");
;
const PHIEU_BAN_GIAO_PREVIEW = {
    ...__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$_shared$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SHARED_PREVIEW_DATA"],
    // Thông tin
    hand_over_code: 'BG-2024-001234',
    shipping_provider_name: 'Giao Hàng Nhanh',
    service_name: 'Giao hàng tiêu chuẩn',
    total_cod: '5,500,000',
    order_code: 'DH-2024-005678',
    shipping_name: 'Trần Văn B',
    shipping_phone: '0912 345 678',
    shipping_phone_hide: '0912 *** 678',
    printed_on: '05/12/2024',
    freight_amount: '30,000',
    district: 'Quận 7',
    quantity: '5',
    current_account_name: 'Nhân viên A',
    shipment_code: 'GHN-123456789',
    shipping_address: '789 Nguyễn Thị Thập, Quận 7, TP.HCM',
    cod: '1,100,000',
    note: 'Giao hàng trước 17h',
    city: 'TP. Hồ Chí Minh',
    freight_payer: 'Người nhận',
    total_freight_amount: '150,000'
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/preview/phieu-xac-nhan-hoan.preview.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PHIEU_XAC_NHAN_HOAN_PREVIEW",
    ()=>PHIEU_XAC_NHAN_HOAN_PREVIEW
]);
/**
 * Preview data for Phiếu xác nhận hoàn (phieu-xac-nhan-hoan)
 * Dữ liệu mẫu cho Phiếu xác nhận hoàn hàng từ shipper
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$_shared$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/preview/_shared.preview.ts [app-client] (ecmascript)");
;
const PHIEU_XAC_NHAN_HOAN_PREVIEW = {
    ...__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$_shared$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SHARED_PREVIEW_DATA"],
    // Thông tin
    hand_over_code: 'XNH-2024-001234',
    shipping_provider_name: 'Giao Hàng Tiết Kiệm',
    service_name: 'Giao hàng nhanh',
    total_cod: '2,200,000',
    order_code: 'DH-2024-005679',
    shipping_name: 'Lê Văn C',
    shipping_phone: '0923 456 789',
    shipping_phone_hide: '0923 *** 789',
    printed_on: '05/12/2024',
    district: 'Quận Bình Thạnh',
    quantity: '2',
    current_account_name: 'Nhân viên B',
    shipment_code: 'GHTK-987654321',
    shipping_address: '321 Điện Biên Phủ, Quận Bình Thạnh, TP.HCM',
    cod: '1,100,000',
    note: 'Khách không nhận hàng - hoàn lại',
    city: 'TP. Hồ Chí Minh'
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/preview/phieu-tong-ket-ban-hang.preview.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PHIEU_TONG_KET_BAN_HANG_PREVIEW",
    ()=>PHIEU_TONG_KET_BAN_HANG_PREVIEW
]);
/**
 * Preview data for Phiếu tổng kết bán hàng (phieu-tong-ket-ban-hang)
 * Dữ liệu mẫu cho Phiếu tổng kết bán hàng theo ngày/ca
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$_shared$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/preview/_shared.preview.ts [app-client] (ecmascript)");
;
const PHIEU_TONG_KET_BAN_HANG_PREVIEW = {
    ...__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$_shared$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SHARED_PREVIEW_DATA"],
    // Thông tin
    date_print: '05/12/2024',
    time_print: '23:30',
    time_filter: '05/12/2024',
    source_name: 'Bán tại quầy',
    total_quantity_order_finished: '45',
    total_quantity_line_item_fulfillment: '156',
    total_quantity_line_item_return: '3',
    total_line_amount: '78,500,000',
    total_order_payment: '75,200,000',
    total_order_return_payment: '1,050,000',
    total_real_receipt: '74,150,000',
    real_receipt_cash: '35,000,000',
    real_receipt_transfer: '25,000,000',
    real_receipt_mpos: '10,000,000',
    real_receipt_cod: '3,150,000',
    real_receipt_online: '1,000,000',
    debt: '3,300,000',
    receipt_in_day: '80,000,000',
    receipt_cash: '38,000,000',
    receipt_transfer: '27,000,000',
    receipt_mpos: '11,000,000',
    receipt_cod: '3,000,000',
    receipt_online: '1,000,000',
    payment_in_day: '5,850,000',
    payment_cash: '3,000,000',
    payment_transfer: '2,500,000',
    payment_mpos: '350,000',
    // Chi tiết đơn hàng bán
    stt_order_finish: '1',
    order_code: 'DH-2024-005678',
    amount_order_finished: '1,750,000',
    discount_order_finished: '87,500',
    tax_order_finished: '166,250',
    total_order_finished: '1,828,750',
    // Chi tiết hàng bán
    stt_item_fulfillment: '1',
    sku_fulfillment: 'ATN-001-WH-XL',
    variant_name_fulfillment: 'Áo thun nam - Trắng / XL',
    quantity_item_fulfilment: '5',
    amount_item_fulfilment: '1,750,000',
    // Chi tiết hàng trả
    stt_item_return: '1',
    sku_return: 'ATN-002-BL-M',
    variant_name_return: 'Áo thun nam - Đen / M',
    quantity_item_return: '1',
    amount_item_return: '350,000',
    // Phương thức thanh toán
    payment_method_name: 'Tiền mặt',
    payment_method_amount: '35,000,000'
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/preview/phieu-huong-dan-dong-goi.preview.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PHIEU_HUONG_DAN_DONG_GOI_PREVIEW",
    ()=>PHIEU_HUONG_DAN_DONG_GOI_PREVIEW
]);
/**
 * Preview data for Phiếu hướng dẫn đóng gói (phieu-huong-dan-dong-goi)
 * Dữ liệu mẫu cho Phiếu hướng dẫn đóng gói hàng
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$_shared$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/preview/_shared.preview.ts [app-client] (ecmascript)");
;
const PHIEU_HUONG_DAN_DONG_GOI_PREVIEW = {
    ...__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$_shared$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SHARED_PREVIEW_DATA"],
    // Thông tin phiếu hướng dẫn đóng gói
    created_on: '05/12/2024',
    list_order_code: 'DH-001234, DH-001235, DH-001236',
    account_phone: '0901 234 567',
    created_on_time: '08:30',
    account_email: 'nhanvien@company.com',
    // Thông tin giỏ hàng
    line_stt: '1',
    line_variant_sku: 'ATN-001-WH-XL',
    line_variant_barcode: '8936012345678',
    line_unit: 'Cái',
    note_of_store: 'Đóng gói cẩn thận, hàng dễ vỡ',
    line_variant_qrcode: '[QR Code]',
    line_brand: 'Fashion Brand',
    line_image: '[Ảnh sản phẩm]',
    composite_details: 'Áo thun x1, Quần jean x1',
    line_product_name: 'Áo thun nam cao cấp',
    line_variant_name: 'Trắng / XL',
    line_variant_options: 'Trắng / XL',
    line_quantity: '10',
    bin_location: 'Kệ A1-01',
    line_category: 'Áo thun',
    line_product_description: 'Áo thun nam chất liệu cotton 100%',
    lineitem_note: 'Kiểm tra kỹ size trước khi đóng gói',
    // Tổng giá trị
    total: '3,500,000',
    total_product_quantity: '15',
    order_note: 'Giao hàng trước 17h, gọi trước khi giao'
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/preview/phieu-yeu-cau-dong-goi.preview.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PHIEU_YEU_CAU_DONG_GOI_PREVIEW",
    ()=>PHIEU_YEU_CAU_DONG_GOI_PREVIEW
]);
/**
 * Preview data for Phiếu yêu cầu đóng gói (phieu-yeu-cau-dong-goi)
 * Dữ liệu mẫu cho Phiếu yêu cầu đóng gói đơn hàng
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$_shared$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/preview/_shared.preview.ts [app-client] (ecmascript)");
;
const PHIEU_YEU_CAU_DONG_GOI_PREVIEW = {
    ...__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$_shared$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SHARED_PREVIEW_DATA"],
    // Thông tin đóng gói
    code: 'DG-2024-001234',
    packed_processing_account_name: 'Nhân viên kho B',
    cancel_account_name: '',
    assignee_name: 'Nhân viên kho A',
    shipping_address: '789 Nguyễn Thị Thập, Quận 7, TP.HCM',
    customer_name: 'Nguyễn Văn A',
    customer_phone_number: '0901 234 567',
    customer_phone_number_hide: '0901 *** 567',
    customer_email: 'nguyenvana@email.com',
    status: 'Đang đóng gói',
    'bar_code(code)': '[Barcode DG-2024-001234]',
    created_on: '05/12/2024',
    created_on_time: '09:00',
    packed_on: '05/12/2024',
    packed_on_time: '10:30',
    cancel_date: '',
    ship_on_min: '06/12/2024',
    ship_on_max: '08/12/2024',
    order_code: 'DH-2024-005678',
    'bar_code(order_code)': '[Barcode DH-2024-005678]',
    order_note: 'Giao hàng trước 17h, gọi trước khi giao',
    // Thông tin giỏ hàng
    line_stt: '1',
    line_unit: 'Cái',
    line_discount_rate: '10',
    line_note: 'Kiểm tra kỹ chất lượng',
    line_quantity: '3',
    line_tax_rate: '10',
    line_variant: 'Trắng / XL',
    lots_number_code1: 'LOT-2024-001',
    lots_number_code2: 'LOT-2024-001 - 3',
    lots_number_code3: 'LOT-2024-001 - 01/12/2024 - 01/12/2025',
    lots_number_code4: 'LOT-2024-001 - 01/12/2024 - 01/12/2025 - 3',
    line_product_name: 'Áo thun nam cao cấp',
    line_tax: 'VAT 10%',
    line_discount_amount: '105,000',
    line_price: '350,000',
    line_amount: '945,000',
    line_variant_code: 'ATN-001-WH-XL',
    // Tổng giá trị
    total_quantity: '5',
    total_tax: '94,500',
    fulfillment_discount: '175,000',
    total: '1,750,000'
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/preview/phieu-yeu-cau-bao-hanh.preview.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PHIEU_YEU_CAU_BAO_HANH_PREVIEW",
    ()=>PHIEU_YEU_CAU_BAO_HANH_PREVIEW
]);
/**
 * Preview data for Phiếu yêu cầu bảo hành (phieu-yeu-cau-bao-hanh)
 * Dữ liệu mẫu cho Phiếu yêu cầu bảo hành sản phẩm
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$_shared$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/preview/_shared.preview.ts [app-client] (ecmascript)");
;
const PHIEU_YEU_CAU_BAO_HANH_PREVIEW = {
    ...__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$_shared$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SHARED_PREVIEW_DATA"],
    // Thông tin phiếu yêu cầu
    warranty_claim_card_code: 'YCBH-2024-001234',
    modified_on: '05/12/2024',
    created_on: '04/12/2024',
    reference: 'Khách hàng gọi hotline báo lỗi sản phẩm',
    customer_name: 'Nguyễn Văn A',
    customer_phone_number: '0901 234 567',
    customer_address1: '123 Nguyễn Huệ, Quận 1, TP.HCM',
    customer_group: 'Khách VIP',
    tag: 'Bảo hành, Ưu tiên',
    // Thông tin sản phẩm
    line_stt: '1',
    line_product_name: 'Điện thoại Samsung Galaxy S24',
    line_variant_name: 'Đen / 256GB',
    line_variant_sku: 'SS-S24-BK-256',
    line_variant_barcode: '8936012345999',
    serials: 'IMEI-123456789012345',
    warranty_card_code: 'PBH-2024-005678',
    line_quantity: '1',
    line_type: 'Sửa chữa',
    line_received_on: '10/12/2024',
    line_status: 'Đang xử lý',
    line_expense_title: 'Phí kiểm tra',
    line_expense_amount: '100,000',
    line_expense_total_amount: '100,000',
    // Tổng giá trị
    total_quantity: '1',
    total_amount: '100,000'
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/preview/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EXTENDED_PREVIEW_DATA",
    ()=>EXTENDED_PREVIEW_DATA,
    "PREVIEW_DATA",
    ()=>PREVIEW_DATA
]);
// Import từng file preview - 16 loại chính
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$order$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/preview/order.preview.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$receipt$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/preview/receipt.preview.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$payment$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/preview/payment.preview.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$warranty$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/preview/warranty.preview.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$inventory$2d$check$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/preview/inventory-check.preview.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$stock$2d$transfer$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/preview/stock-transfer.preview.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$stock$2d$in$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/preview/stock-in.preview.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$sales$2d$return$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/preview/sales-return.preview.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$purchase$2d$order$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/preview/purchase-order.preview.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$packing$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/preview/packing.preview.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$quote$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/preview/quote.preview.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$delivery$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/preview/delivery.preview.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$shipping$2d$label$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/preview/shipping-label.preview.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$product$2d$label$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/preview/product-label.preview.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$supplier$2d$return$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/preview/supplier-return.preview.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$complaint$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/preview/complaint.preview.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$penalty$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/preview/penalty.preview.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$cost$2d$adjustment$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/preview/cost-adjustment.preview.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$payroll$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/preview/payroll.preview.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$attendance$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/preview/attendance.preview.ts [app-client] (ecmascript)");
// Import 8 loại mở rộng (extended templates)
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$don$2d$nhap$2d$hang$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/preview/don-nhap-hang.preview.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$don$2d$tra$2d$hang$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/preview/don-tra-hang.preview.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$phieu$2d$ban$2d$giao$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/preview/phieu-ban-giao.preview.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$phieu$2d$xac$2d$nhan$2d$hoan$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/preview/phieu-xac-nhan-hoan.preview.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$phieu$2d$tong$2d$ket$2d$ban$2d$hang$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/preview/phieu-tong-ket-ban-hang.preview.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$phieu$2d$huong$2d$dan$2d$dong$2d$goi$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/preview/phieu-huong-dan-dong-goi.preview.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$phieu$2d$yeu$2d$cau$2d$dong$2d$goi$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/preview/phieu-yeu-cau-dong-goi.preview.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$phieu$2d$yeu$2d$cau$2d$bao$2d$hanh$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/preview/phieu-yeu-cau-bao-hanh.preview.ts [app-client] (ecmascript)");
// Re-export shared data for external use
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$_shared$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/preview/_shared.preview.ts [app-client] (ecmascript)");
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
const PREVIEW_DATA = {
    'order': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$order$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ORDER_PREVIEW_DATA"],
    'receipt': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$receipt$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RECEIPT_PREVIEW_DATA"],
    'payment': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$payment$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PAYMENT_PREVIEW_DATA"],
    'warranty': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$warranty$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WARRANTY_PREVIEW_DATA"],
    'inventory-check': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$inventory$2d$check$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INVENTORY_CHECK_PREVIEW_DATA"],
    'stock-transfer': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$stock$2d$transfer$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STOCK_TRANSFER_PREVIEW_DATA"],
    'stock-in': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$stock$2d$in$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STOCK_IN_PREVIEW_DATA"],
    'sales-return': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$sales$2d$return$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SALES_RETURN_PREVIEW_DATA"],
    'purchase-order': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$purchase$2d$order$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PURCHASE_ORDER_PREVIEW_DATA"],
    'packing': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$packing$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PACKING_PREVIEW_DATA"],
    'quote': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$quote$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QUOTE_PREVIEW_DATA"],
    'delivery': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$delivery$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DELIVERY_PREVIEW_DATA"],
    'shipping-label': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$shipping$2d$label$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SHIPPING_LABEL_PREVIEW_DATA"],
    'product-label': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$product$2d$label$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PRODUCT_LABEL_PREVIEW_DATA"],
    'supplier-return': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$supplier$2d$return$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SUPPLIER_RETURN_PREVIEW_DATA"],
    'complaint': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$complaint$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["COMPLAINT_PREVIEW_DATA"],
    'penalty': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$penalty$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PENALTY_PREVIEW_DATA"],
    'leave': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$penalty$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PENALTY_PREVIEW_DATA"],
    'cost-adjustment': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$cost$2d$adjustment$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["COST_ADJUSTMENT_PREVIEW_DATA"],
    'handover': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$phieu$2d$ban$2d$giao$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PHIEU_BAN_GIAO_PREVIEW"],
    'payroll': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$payroll$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PAYROLL_PREVIEW_DATA"],
    'payslip': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$payroll$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PAYROLL_PREVIEW_DATA"],
    'attendance': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$attendance$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ATTENDANCE_PREVIEW_DATA"]
};
;
;
;
const EXTENDED_PREVIEW_DATA = {
    'don-nhap-hang': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$don$2d$nhap$2d$hang$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DON_NHAP_HANG_PREVIEW"],
    'don-tra-hang': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$don$2d$tra$2d$hang$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DON_TRA_HANG_PREVIEW"],
    'phieu-ban-giao': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$phieu$2d$ban$2d$giao$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PHIEU_BAN_GIAO_PREVIEW"],
    'phieu-xac-nhan-hoan': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$phieu$2d$xac$2d$nhan$2d$hoan$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PHIEU_XAC_NHAN_HOAN_PREVIEW"],
    'phieu-tong-ket-ban-hang': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$phieu$2d$tong$2d$ket$2d$ban$2d$hang$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PHIEU_TONG_KET_BAN_HANG_PREVIEW"],
    'phieu-huong-dan-dong-goi': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$phieu$2d$huong$2d$dan$2d$dong$2d$goi$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PHIEU_HUONG_DAN_DONG_GOI_PREVIEW"],
    'phieu-yeu-cau-dong-goi': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$phieu$2d$yeu$2d$cau$2d$dong$2d$goi$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PHIEU_YEU_CAU_DONG_GOI_PREVIEW"],
    'phieu-yeu-cau-bao-hanh': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$phieu$2d$yeu$2d$cau$2d$bao$2d$hanh$2e$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PHIEU_YEU_CAU_BAO_HANH_PREVIEW"]
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/preview-data.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
/**
 * @deprecated File này đã được migrate sang thư mục preview/
 * Giữ lại để tương thích ngược, sẽ xóa trong phiên bản sau
 * 
 * Import mới: import { PREVIEW_DATA } from './preview';
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/features/settings/printer/preview/index.ts [app-client] (ecmascript) <locals>");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/variables/don-ban-hang.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DON_BAN_HANG_VARIABLES",
    ()=>DON_BAN_HANG_VARIABLES
]);
const DON_BAN_HANG_VARIABLES = [
    // Thông tin cửa hàng
    {
        key: '{store_logo}',
        label: 'Logo cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_address}',
        label: 'Địa chỉ cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_email}',
        label: 'Email cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_fax}',
        label: 'Số Fax',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{location_address}',
        label: 'Địa chỉ chi nhánh',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_province}',
        label: 'Tỉnh thành (cửa hàng)',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_name}',
        label: 'Tên cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_phone_number}',
        label: 'SĐT cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{print_date}',
        label: 'Ngày in',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{print_time}',
        label: 'Giờ in',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{location_name}',
        label: 'Tên chi nhánh',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{location_province}',
        label: 'Tỉnh thành (chi nhánh)',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{location_phone_number}',
        label: 'SĐT chi nhánh',
        group: 'Thông tin cửa hàng'
    },
    // Thông tin đơn hàng
    {
        key: '{order_code}',
        label: 'Mã đơn hàng',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{order_qr_code}',
        label: 'Mã đơn hàng dạng QR code',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{bar_code(code)}',
        label: 'Mã đơn hàng dạng mã vạch',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{modified_on}',
        label: 'Ngày cập nhật',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{modified_on_time}',
        label: 'Thời gian cập nhật',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{ship_on_min}',
        label: 'Ngày hẹn giao hàng từ',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{ship_on_max}',
        label: 'Thời gian hẹn giao hàng đến',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{assignee_name}',
        label: 'Người phụ trách',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{customer_name}',
        label: 'Tên khách hàng',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{customer_contact}',
        label: 'Liên hệ khách hàng',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{customer_contact_phone_number}',
        label: 'SĐT liên hệ khách hàng',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{customer_contact_phone_number_hide}',
        label: 'SĐT liên hệ khách hàng - ẩn 4 số giữa',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{customer_group}',
        label: 'Nhóm khách hàng',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{shipping_address}',
        label: 'Địa chỉ giao hàng',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{customer_phone_number}',
        label: 'SĐT khách hàng',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{customer_phone_number_hide}',
        label: 'SĐT khách hàng - ẩn 4 số giữa',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{customer_point}',
        label: 'Điểm hiện tại',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{customer_point_used}',
        label: 'Điểm đã thanh toán cho hóa đơn',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{customer_point_new}',
        label: 'Điểm tích được khi mua hàng',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{customer_point_before_create_invoice}',
        label: 'Điểm trước khi mua hàng',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{customer_point_after_create_invoice}',
        label: 'Điểm sau khi mua hàng',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{currency_name}',
        label: 'Tiền tệ',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{tax_treatment}',
        label: 'Giá đã bao gồm thuế',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{fulfillment_status}',
        label: 'Trạng thái giao hàng',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{packed_status}',
        label: 'Trạng thái đóng gói',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{return_status}',
        label: 'Trạng thái trả hàng',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{customer_debt_text}',
        label: 'Nợ KH bằng chữ',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{customer_tax_number}',
        label: 'Mã số thuế của KH',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{expected_delivery_type}',
        label: 'Vận chuyển dự kiến',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{weight_g}',
        label: 'Tổng khối lượng đơn hàng (g)',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{weight_kg}',
        label: 'Tổng khối lượng đơn hàng (kg)',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{issued_on_text}',
        label: 'Ngày chứng từ dạng chữ',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{shipping_address:full_name}',
        label: 'Người nhận',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{shipping_address:phone_number}',
        label: 'SĐT người nhận',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{shipping_address:phone_number_hide}',
        label: 'SĐT người nhận - ẩn 4 số giữa',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{created_on}',
        label: 'Ngày tạo',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{source}',
        label: 'Nguồn',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{bar_code(reference_number)}',
        label: 'Tham chiếu dạng mã vạch',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{issued_on}',
        label: 'Ngày chứng từ',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{account_name}',
        label: 'Người tạo',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{issued_on_time}',
        label: 'Thời gian chứng từ',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{created_on_time}',
        label: 'Thời gian tạo',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{customer_code}',
        label: 'Mã khách hàng',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{customer_debt}',
        label: 'Nợ hiện tại',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{debt_before_create_invoice}',
        label: 'Nợ trước khi mua hàng',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{debt_before_create_invoice_text}',
        label: 'Nợ trước khi mua hàng bằng chữ',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{debt_after_create_invoice}',
        label: 'Nợ sau khi mua hàng',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{debt_after_create_invoice_text}',
        label: 'Nợ sau khi mua hàng bằng chữ',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{billing_address}',
        label: 'Địa chỉ gửi hóa đơn',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{customer_email}',
        label: 'Email khách hàng',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{reference}',
        label: 'Tham chiếu',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{customer_card}',
        label: 'Hạng thẻ',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{price_list_name}',
        label: 'Chính sách giá',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{order_status}',
        label: 'Trạng thái đơn hàng',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{tag}',
        label: 'Thẻ Tag',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{payment_status}',
        label: 'Trạng thái thanh toán',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{customer_debt_prev}',
        label: 'Nợ cũ',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{customer_debt_prev_text}',
        label: 'Nợ cũ KH bằng chữ',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{expected_payment_method}',
        label: 'Thanh toán dự kiến',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{channel}',
        label: 'Kênh bán hàng',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{shipped_on}',
        label: 'Ngày xuất kho',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{created_on_text}',
        label: 'Ngày tạo dạng chữ',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{total_amount_and_debt_before_create_invoice}',
        label: 'Nợ và đơn hàng mới',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{total_amount_and_debt_before_create_invoice_text}',
        label: 'Nợ và đơn hàng mới bằng chữ',
        group: 'Thông tin đơn hàng'
    },
    // Thông tin giỏ hàng
    {
        key: '{line_stt}',
        label: 'STT',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_variant_code}',
        label: 'Mã phiên bản sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_tax_rate}',
        label: 'Thuế theo %',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_discount_rate}',
        label: 'Chiết khấu sản phẩm %',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_note}',
        label: 'Ghi chú sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_quantity}',
        label: 'Số lượng sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_unit}',
        label: 'Đơn vị tính',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_price_after_discount}',
        label: 'Giá sau chiết khấu trên 1 sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_promotion_or_loyalty}',
        label: 'Hàng tích điểm, KM',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_tax_included}',
        label: 'Giá đã bao gồm thuế',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_brand}',
        label: 'Thương hiệu sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_weight_g}',
        label: 'Tổng khối lượng sản phẩm (g)',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_weight_kg}',
        label: 'Tổng khối lượng sản phẩm (kg)',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{term_number}',
        label: 'Thời hạn bảo hành',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{lots_number_code2}',
        label: 'Mã lô - Số lượng bán sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{lots_number_code4}',
        label: 'Mã lô - NSX - NHH - Số lượng bán sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{composite_details}',
        label: 'Thành phần combo',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{packsizes}',
        label: 'Đơn vị quy đổi',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{lots_number_combo}',
        label: 'Mã lô-date thành phần trong combo',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_image}',
        label: 'Ảnh phiên bản sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_variant_barcode_image}',
        label: 'Mã vạch sản phẩm (dạng ảnh)',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{total_line_item_discount}',
        label: 'Tổng chiết khấu sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_product_name}',
        label: 'Tên sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_variant}',
        label: 'Tên phiên bản sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_tax_amount}',
        label: 'Thuế',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_discount_amount}',
        label: 'Chiết khấu sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_price}',
        label: 'Giá bán',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_price_discount}',
        label: 'Giá bán sau/trước chiết khấu',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_amount}',
        label: 'Thành tiền',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_variant_barcode}',
        label: 'Mã Barcode',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_amount_none_discount}',
        label: 'Tiền hàng (Giá * SL)',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_variant_options}',
        label: 'Thuộc tính sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_category}',
        label: 'Loại sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{serials}',
        label: 'Serial',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{term_name}',
        label: 'Chính sách bảo hành',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{bin_location}',
        label: 'Điểm lưu kho',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{lots_number_code1}',
        label: 'Mã lô sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{lots_number_code3}',
        label: 'Mã lô - NSX - NHH sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_tax_exclude}',
        label: 'Giá chưa bao gồm thuế',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_product_description}',
        label: 'Mô tả sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{term_name_combo}',
        label: 'Chính sách bảo hành thành phần combo',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{term_number_combo}',
        label: 'Thời hạn bảo hành thành phần combo',
        group: 'Thông tin giỏ hàng'
    },
    // Tổng giá trị
    {
        key: '{total_quantity}',
        label: 'Tổng số lượng',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_amount}',
        label: 'Tổng tiền',
        group: 'Tổng giá trị'
    },
    {
        key: '{money_return}',
        label: 'Tổng tiền trả lại',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_text}',
        label: 'Tổng tiền bằng chữ',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_tax}',
        label: 'Tổng thuế',
        group: 'Tổng giá trị'
    },
    {
        key: '{delivery_fee}',
        label: 'Phí giao hàng',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_remain}',
        label: 'Tiền còn lại khách phải trả',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_remain_text}',
        label: 'Tiền còn lại khách phải trả bằng chữ',
        group: 'Tổng giá trị'
    },
    {
        key: '{payment_name}',
        label: 'Phương thức thanh toán',
        group: 'Tổng giá trị'
    },
    {
        key: '{payments}',
        label: 'Tên phương thức thanh toán: Số tiền thanh toán',
        group: 'Tổng giá trị'
    },
    {
        key: '{payment_qr}',
        label: 'Mã QR thanh toán',
        group: 'Tổng giá trị'
    },
    {
        key: '{promotion_name}',
        label: 'Tên khuyến mại',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_amount_before_tax}',
        label: 'Tổng tiền trước thuế',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_amount_after_tax}',
        label: 'Tổng tiền sau thuế',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_discount}',
        label: 'Tổng chiết khấu của sản phẩm và đơn hàng',
        group: 'Tổng giá trị'
    },
    {
        key: '{product_discount}',
        label: 'Chiết khấu sản phẩm',
        group: 'Tổng giá trị'
    },
    {
        key: '{payment_customer}',
        label: 'Tổng tiền khách đưa',
        group: 'Tổng giá trị'
    },
    {
        key: '{total}',
        label: 'Tổng tiền hàng',
        group: 'Tổng giá trị'
    },
    {
        key: '{discount_details}',
        label: 'Chiết khấu chi tiết',
        group: 'Tổng giá trị'
    },
    {
        key: '{order_note}',
        label: 'Ghi chú đơn hàng',
        group: 'Tổng giá trị'
    },
    {
        key: '{order_discount_rate}',
        label: 'Chiết khấu đơn hàng theo %',
        group: 'Tổng giá trị'
    },
    {
        key: '{order_discount_value}',
        label: 'Chiết khấu đơn hàng theo giá trị',
        group: 'Tổng giá trị'
    },
    {
        key: '{order_discount}',
        label: 'Chiết khấu đơn hàng',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_none_discount}',
        label: 'Tổng tiền (Đơn giá * SL)',
        group: 'Tổng giá trị'
    },
    {
        key: '{promotion_code}',
        label: 'Mã chương trình khuyến mại',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_extra_tax}',
        label: 'Tổng thuế phải trả thêm',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_tax_included_line}',
        label: 'Tổng thuế đã bao gồm trong sản phẩm',
        group: 'Tổng giá trị'
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/variables/don-dat-hang-nhap.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DON_DAT_HANG_NHAP_VARIABLES",
    ()=>DON_DAT_HANG_NHAP_VARIABLES
]);
const DON_DAT_HANG_NHAP_VARIABLES = [
    // Thông tin cửa hàng
    {
        key: '{store_logo}',
        label: 'Logo cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_address}',
        label: 'Địa chỉ cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_email}',
        label: 'Email cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_fax}',
        label: 'Số Fax',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{location_address}',
        label: 'Địa chỉ chi nhánh',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_name}',
        label: 'Tên cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_phone_number}',
        label: 'SĐT cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_province}',
        label: 'Tỉnh thành (cửa hàng)',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{print_date}',
        label: 'Ngày in',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{print_time}',
        label: 'Giờ in',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{location_name}',
        label: 'Tên chi nhánh',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{location_province}',
        label: 'Tỉnh thành (chi nhánh)',
        group: 'Thông tin cửa hàng'
    },
    // Thông tin đơn đặt hàng nhập
    {
        key: '{order_supplier_code}',
        label: 'Mã đơn',
        group: 'Thông tin đơn đặt hàng nhập'
    },
    {
        key: '{status}',
        label: 'Trạng thái',
        group: 'Thông tin đơn đặt hàng nhập'
    },
    {
        key: '{created_on}',
        label: 'Ngày tạo',
        group: 'Thông tin đơn đặt hàng nhập'
    },
    {
        key: '{due_on}',
        label: 'Ngày nhập dự kiến',
        group: 'Thông tin đơn đặt hàng nhập'
    },
    {
        key: '{completed_on}',
        label: 'Ngày hoàn thành',
        group: 'Thông tin đơn đặt hàng nhập'
    },
    {
        key: '{ended_on}',
        label: 'Ngày kết thúc',
        group: 'Thông tin đơn đặt hàng nhập'
    },
    {
        key: '{cancelled_on}',
        label: 'Ngày hủy',
        group: 'Thông tin đơn đặt hàng nhập'
    },
    {
        key: '{supplier_name}',
        label: 'Tên NCC',
        group: 'Thông tin đơn đặt hàng nhập'
    },
    {
        key: '{supplier_code}',
        label: 'Mã NCC',
        group: 'Thông tin đơn đặt hàng nhập'
    },
    {
        key: '{supplier_phone}',
        label: 'SĐT NCC',
        group: 'Thông tin đơn đặt hàng nhập'
    },
    {
        key: '{supplier_email}',
        label: 'Email NCC',
        group: 'Thông tin đơn đặt hàng nhập'
    },
    {
        key: '{supplier_address}',
        label: 'Địa chỉ NCC',
        group: 'Thông tin đơn đặt hàng nhập'
    },
    {
        key: '{supplier_debt}',
        label: 'Nợ nhà cung cấp',
        group: 'Thông tin đơn đặt hàng nhập'
    },
    {
        key: '{supplier_debt_prev}',
        label: 'Nợ cũ nhà cung cấp',
        group: 'Thông tin đơn đặt hàng nhập'
    },
    {
        key: '{supplier_debt_text}',
        label: 'Nợ NCC bằng chữ',
        group: 'Thông tin đơn đặt hàng nhập'
    },
    {
        key: '{supplier_debt_prev_text}',
        label: 'Nợ cũ NCC bằng chữ',
        group: 'Thông tin đơn đặt hàng nhập'
    },
    {
        key: '{activated_account_name}',
        label: 'Nhân viên tạo đơn',
        group: 'Thông tin đơn đặt hàng nhập'
    },
    {
        key: '{assignee_name}',
        label: 'Nhân viên phụ trách NCC',
        group: 'Thông tin đơn đặt hàng nhập'
    },
    {
        key: '{weight_kg}',
        label: 'Tổng khối lượng đơn nhập hàng (kg)',
        group: 'Thông tin đơn đặt hàng nhập'
    },
    {
        key: '{weight_g}',
        label: 'Tổng khối lượng đơn nhập hàng (g)',
        group: 'Thông tin đơn đặt hàng nhập'
    },
    // Thông tin sản phẩm
    {
        key: '{line_stt}',
        label: 'STT',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_title}',
        label: 'Tên hàng',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_unit}',
        label: 'Đơn vị tính',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_note}',
        label: 'Ghi chú sản phẩm',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_quantity}',
        label: 'Số lượng đặt',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_received_quantity}',
        label: 'Số lượng nhập',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_variant_code}',
        label: 'Mã phiên bản sản phẩm',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_variant_name}',
        label: 'Tên phiên bản sản phẩm',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_variant_barcode}',
        label: 'Mã Barcode',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_category}',
        label: 'Loại sản phẩm',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_price}',
        label: 'Giá nhập',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_price_after_discount}',
        label: 'Giá nhập sau chiết khấu',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_discount_amount}',
        label: 'Chiết khấu sản phẩm',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_amount}',
        label: 'Thành tiền',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_tax_exclude}',
        label: 'Giá chưa bao gồm thuế',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_tax_included}',
        label: 'Giá đã bao gồm thuế',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_tax_amount}',
        label: 'Thuế (giá trị)',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_weight_g}',
        label: 'Tổng khối lượng sản phẩm (g)',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_weight_kg}',
        label: 'Tổng khối lượng sản phẩm (kg)',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_discount_rate}',
        label: 'Chiết khấu sản phẩm %',
        group: 'Thông tin sản phẩm'
    },
    // Tổng giá trị
    {
        key: '{total_quantity}',
        label: 'Tổng số lượng',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_tax}',
        label: 'Tổng thuế',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_line_amount_text}',
        label: 'Tổng tiền bằng chữ',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_price}',
        label: 'Tổng tiền',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_line_amount}',
        label: 'Tổng tiền hàng',
        group: 'Tổng giá trị'
    },
    {
        key: '{note}',
        label: 'Ghi chú',
        group: 'Tổng giá trị'
    },
    {
        key: '{tags}',
        label: 'Tags',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_discounts}',
        label: 'Chiết khấu đơn nhập',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_discounts_rate}',
        label: 'Chiết khấu đơn nhập (%)',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_discounts_value}',
        label: 'Chiết khấu đơn nhập (giá trị)',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_tax_included_line}',
        label: 'Tổng thuế đã bao gồm trong sản phẩm',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_amount_before_tax}',
        label: 'Tổng tiền trước thuế',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_amount_after_tax}',
        label: 'Tổng tiền sau thuế',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_amount_text}',
        label: 'Tổng tiền bằng chữ',
        group: 'Tổng giá trị'
    },
    // === TỰ ĐỘNG THÊM TỪ TEMPLATE ===
    {
        key: '{account_name}',
        label: 'Người tạo',
        group: 'Thông tin khác'
    },
    {
        key: '{discount}',
        label: 'Chiết khấu',
        group: 'Tổng kết'
    },
    {
        key: '{line_ordered_quantity}',
        label: 'Số lượng đặt',
        group: 'Chi tiết sản phẩm'
    },
    {
        key: '{line_product_name}',
        label: 'Tên sản phẩm',
        group: 'Chi tiết sản phẩm'
    },
    {
        key: '{line_total}',
        label: 'Thành tiền',
        group: 'Chi tiết sản phẩm'
    },
    {
        key: '{line_variant}',
        label: 'Phiên bản sản phẩm',
        group: 'Chi tiết sản phẩm'
    },
    {
        key: '{supplier_phone_number}',
        label: 'SĐT nhà cung cấp',
        group: 'Thông tin nhà cung cấp'
    },
    {
        key: '{tax_vat}',
        label: 'Thuế VAT',
        group: 'Thông tin khác'
    },
    {
        key: '{total_order}',
        label: 'Tổng đơn hàng',
        group: 'Tổng kết'
    },
    {
        key: '{total}',
        label: 'Tổng cộng',
        group: 'Tổng kết'
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/variables/don-doi-tra-hang.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DON_DOI_TRA_HANG_VARIABLES",
    ()=>DON_DOI_TRA_HANG_VARIABLES
]);
const DON_DOI_TRA_HANG_VARIABLES = [
    // Thông tin cửa hàng
    {
        key: '{store_logo}',
        label: 'Logo cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_address}',
        label: 'Địa chỉ cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_email}',
        label: 'Email cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_fax}',
        label: 'Số Fax',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{location_address}',
        label: 'Địa chỉ chi nhánh',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_name}',
        label: 'Tên cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_phone_number}',
        label: 'SĐT cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_province}',
        label: 'Tỉnh thành (cửa hàng)',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{print_date}',
        label: 'Ngày in',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{print_time}',
        label: 'Giờ in',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{location_name}',
        label: 'Tên chi nhánh',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{location_province}',
        label: 'Tỉnh thành (chi nhánh)',
        group: 'Thông tin cửa hàng'
    },
    // Thông tin đơn hàng
    {
        key: '{order_code}',
        label: 'Mã đơn hàng',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{order_qr_code}',
        label: 'Mã đơn hàng dạng QR code',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{bar_code(code)}',
        label: 'Mã đơn hàng dạng mã vạch',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{order_return_code}',
        label: 'Mã đơn trả hàng',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{ship_on_min}',
        label: 'Ngày hẹn giao hàng từ',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{ship_on_max}',
        label: 'Thời gian hẹn giao hàng đến',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{assignee_name}',
        label: 'Người phụ trách',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{expected_delivery_type}',
        label: 'Vận chuyển dự kiến',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{shipping_address:full_name}',
        label: 'Người nhận',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{shipping_address:phone_number}',
        label: 'SĐT người nhận',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{shipping_address}',
        label: 'Địa chỉ nhận',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{customer_debt}',
        label: 'Nợ hiện tại',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{customer_debt_text}',
        label: 'Nợ KH bằng chữ',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{customer_debt_prev}',
        label: 'Nợ cũ',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{customer_debt_prev_text}',
        label: 'Nợ cũ KH bằng chữ',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{created_on}',
        label: 'Ngày tạo',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{created_on_time}',
        label: 'Thời gian tạo',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{modified_on}',
        label: 'Ngày cập nhật',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{modified_on_time}',
        label: 'Thời gian cập nhật',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{issued_on}',
        label: 'Ngày chứng từ',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{issued_on_time}',
        label: 'Thời gian chứng từ',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{source}',
        label: 'Nguồn',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{channel}',
        label: 'Kênh bán hàng',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{bar_code(reference_number)}',
        label: 'Tham chiếu dạng mã vạch',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{reference}',
        label: 'Tham chiếu',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{tag}',
        label: 'Thẻ Tag',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{order_status}',
        label: 'Trạng thái đơn hàng',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{fulfillment_status}',
        label: 'Trạng thái giao hàng',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{packed_status}',
        label: 'Trạng thái đóng gói',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{return_status}',
        label: 'Trạng thái trả hàng',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{payment_status}',
        label: 'Trạng thái thanh toán',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{expected_payment_method}',
        label: 'Thanh toán dự kiến',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{price_list_name}',
        label: 'Chính sách giá',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{currency_name}',
        label: 'Tiền tệ',
        group: 'Thông tin đơn hàng'
    },
    // Thông tin khách hàng
    {
        key: '{customer_code}',
        label: 'Mã khách hàng',
        group: 'Thông tin khách hàng'
    },
    {
        key: '{customer_name}',
        label: 'Tên khách hàng',
        group: 'Thông tin khách hàng'
    },
    {
        key: '{customer_contact}',
        label: 'Liên hệ khách hàng',
        group: 'Thông tin khách hàng'
    },
    {
        key: '{billing_address}',
        label: 'Địa chỉ gửi hóa đơn',
        group: 'Thông tin khách hàng'
    },
    {
        key: '{customer_phone_number}',
        label: 'SĐT khách hàng',
        group: 'Thông tin khách hàng'
    },
    {
        key: '{customer_email}',
        label: 'Email khách hàng',
        group: 'Thông tin khách hàng'
    },
    {
        key: '{customer_point}',
        label: 'Điểm của khách hàng',
        group: 'Thông tin khách hàng'
    },
    {
        key: '{customer_card}',
        label: 'Hạng thẻ',
        group: 'Thông tin khách hàng'
    },
    {
        key: '{customer_tax_number}',
        label: 'Mã số thuế của KH',
        group: 'Thông tin khách hàng'
    },
    // Thông tin giỏ hàng
    {
        key: '{line_stt}',
        label: 'STT',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_variant_code}',
        label: 'Mã phiên bản sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_tax_rate}',
        label: 'Thuế theo %',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_discount_rate}',
        label: 'Chiết khấu sản phẩm %',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_note}',
        label: 'Ghi chú sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_quantity}',
        label: 'Số lượng sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_unit}',
        label: 'Đơn vị tính',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_price_after_discount}',
        label: 'Giá sau chiết khấu trên 1 sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_promotion_or_loyalty}',
        label: 'Hàng tích điểm, KM',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_tax_included}',
        label: 'Giá đã bao gồm thuế',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_brand}',
        label: 'Thương hiệu sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{total_line_item_discount}',
        label: 'Tổng chiết khấu sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{lots_number_code2}',
        label: 'Mã lô - Số lượng bán sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{lots_number_code4}',
        label: 'Mã lô - NSX - NHH - Số lượng bán sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_product_name}',
        label: 'Tên sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_variant}',
        label: 'Tên phiên bản sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_tax_amount}',
        label: 'Thuế',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_discount_amount}',
        label: 'Chiết khấu sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_price}',
        label: 'Giá bán',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_amount}',
        label: 'Thành tiền',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_variant_barcode}',
        label: 'Mã Barcode',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_amount_none_discount}',
        label: 'Tiền hàng (Giá * SL)',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_variant_options}',
        label: 'Thuộc tính sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_category}',
        label: 'Loại sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{serials}',
        label: 'Serial',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{lots_number_code1}',
        label: 'Mã lô sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{lots_number_code3}',
        label: 'Mã lô - NSX - NHH sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_tax_exclude}',
        label: 'Giá chưa bao gồm thuế',
        group: 'Thông tin giỏ hàng'
    },
    // Thông tin giỏ hàng trả
    {
        key: '{return_line_stt}',
        label: 'STT',
        group: 'Thông tin giỏ hàng trả'
    },
    {
        key: '{return_line_unit}',
        label: 'Đơn vị tính',
        group: 'Thông tin giỏ hàng trả'
    },
    {
        key: '{return_line_variant_code}',
        label: 'Mã phiên bản',
        group: 'Thông tin giỏ hàng trả'
    },
    {
        key: '{return_line_quantity}',
        label: 'Số lượng sản phẩm',
        group: 'Thông tin giỏ hàng trả'
    },
    {
        key: '{return_line_price}',
        label: 'Giá bán',
        group: 'Thông tin giỏ hàng trả'
    },
    {
        key: '{return_line_product_name}',
        label: 'Tên hàng',
        group: 'Thông tin giỏ hàng trả'
    },
    {
        key: '{return_line_note}',
        label: 'Ghi chú sản phẩm',
        group: 'Thông tin giỏ hàng trả'
    },
    {
        key: '{return_line_variant}',
        label: 'Tên phiên bản',
        group: 'Thông tin giỏ hàng trả'
    },
    {
        key: '{return_line_amount}',
        label: 'Thành tiền',
        group: 'Thông tin giỏ hàng trả'
    },
    {
        key: '{return_serials}',
        label: 'Serial',
        group: 'Thông tin giỏ hàng trả'
    },
    // Tổng giá trị
    {
        key: '{return_total_quantity}',
        label: 'Tổng số lượng sản phẩm trả',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_quantity}',
        label: 'Tổng số lượng hàng mua',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_order_exchange_amount}',
        label: 'Tổng tiền cần thanh toán',
        group: 'Tổng giá trị'
    },
    {
        key: '{money_return}',
        label: 'Tổng tiền trả lại',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_text}',
        label: 'Tổng tiền bằng chữ',
        group: 'Tổng giá trị'
    },
    {
        key: '{order_note}',
        label: 'Ghi chú',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_remain}',
        label: 'Tiền còn lại khách phải trả',
        group: 'Tổng giá trị'
    },
    {
        key: '{payment_name}',
        label: 'Phương thức thanh toán',
        group: 'Tổng giá trị'
    },
    {
        key: '{promotion_name}',
        label: 'Tên khuyến mại',
        group: 'Tổng giá trị'
    },
    {
        key: '{promotion_code}',
        label: 'Mã chương trình khuyến mại',
        group: 'Tổng giá trị'
    },
    {
        key: '{order_discount}',
        label: 'Chiết khấu đơn hàng',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_amount_before_tax}',
        label: 'Tổng tiền trước thuế',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_amount_after_tax}',
        label: 'Tổng tiền sau thuế',
        group: 'Tổng giá trị'
    },
    {
        key: '{return_total_amount}',
        label: 'Tổng tiền hoàn trả',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_amount}',
        label: 'Tổng tiền mua',
        group: 'Tổng giá trị'
    },
    {
        key: '{order_exchange_payment_note}',
        label: 'Nội dung thanh toán (Khách phải trả/Cần trả khách)',
        group: 'Tổng giá trị'
    },
    {
        key: '{payment_customer}',
        label: 'Tổng tiền khách đưa',
        group: 'Tổng giá trị'
    },
    {
        key: '{total}',
        label: 'Tổng tiền hàng',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_none_discount}',
        label: 'Tổng tiền (Đơn giá * SL)',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_discount}',
        label: 'Tổng chiết khấu của sản phẩm và đơn hàng',
        group: 'Tổng giá trị'
    },
    {
        key: '{product_discount}',
        label: 'Chiết khấu sản phẩm',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_tax}',
        label: 'Tổng thuế',
        group: 'Tổng giá trị'
    },
    {
        key: '{delivery_fee}',
        label: 'Phí giao hàng',
        group: 'Tổng giá trị'
    },
    {
        key: '{order_discount_rate}',
        label: 'Chiết khấu đơn hàng theo %',
        group: 'Tổng giá trị'
    },
    {
        key: '{order_discount_value}',
        label: 'Chiết khấu đơn hàng theo giá trị',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_extra_tax}',
        label: 'Tổng thuế phải trả thêm',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_tax_included_line}',
        label: 'Tổng thuế đã bao gồm trong sản phẩm',
        group: 'Tổng giá trị'
    },
    // === TỰ ĐỘNG THÊM TỪ TEMPLATE ===
    {
        key: '{account_name}',
        label: 'Người tạo',
        group: 'Thông tin khác'
    },
    {
        key: '{line_total}',
        label: 'Thành tiền',
        group: 'Chi tiết sản phẩm'
    },
    {
        key: '{note}',
        label: 'Ghi chú',
        group: 'Thông tin khác'
    },
    {
        key: '{reason_return}',
        label: 'Lý do trả hàng',
        group: 'Thông tin trả hàng'
    },
    {
        key: '{refund_status}',
        label: 'Trạng thái hoàn tiền',
        group: 'Thông tin hoàn tiền'
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/variables/don-nhap-hang.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DON_NHAP_HANG_VARIABLES",
    ()=>DON_NHAP_HANG_VARIABLES
]);
const DON_NHAP_HANG_VARIABLES = [
    // Thông tin cửa hàng
    {
        key: '{store_logo}',
        label: 'Logo cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_address}',
        label: 'Địa chỉ cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_email}',
        label: 'Email cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_fax}',
        label: 'Số Fax',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{location_address}',
        label: 'Địa chỉ chi nhánh',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_name}',
        label: 'Tên cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_phone_number}',
        label: 'SĐT cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_province}',
        label: 'Tỉnh thành (cửa hàng)',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{print_date}',
        label: 'Ngày in',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{print_time}',
        label: 'Giờ in',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{location_name}',
        label: 'Tên chi nhánh',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{location_province}',
        label: 'Tỉnh thành (chi nhánh)',
        group: 'Thông tin cửa hàng'
    },
    // Thông tin đơn nhập
    {
        key: '{purchase_order_code}',
        label: 'Mã đơn nhập',
        group: 'Thông tin đơn nhập'
    },
    {
        key: '{modified_on}',
        label: 'Ngày cập nhật',
        group: 'Thông tin đơn nhập'
    },
    {
        key: '{received_on}',
        label: 'Ngày nhận',
        group: 'Thông tin đơn nhập'
    },
    {
        key: '{received_on_time}',
        label: 'Thời gian nhận',
        group: 'Thông tin đơn nhập'
    },
    {
        key: '{due_on}',
        label: 'Ngày hẹn giao',
        group: 'Thông tin đơn nhập'
    },
    {
        key: '{supplier_name}',
        label: 'Tên NCC',
        group: 'Thông tin đơn nhập'
    },
    {
        key: '{supplier_code}',
        label: 'Mã NCC',
        group: 'Thông tin đơn nhập'
    },
    {
        key: '{supplier_phone}',
        label: 'SĐT NCC',
        group: 'Thông tin đơn nhập'
    },
    {
        key: '{supplier_email}',
        label: 'Email NCC',
        group: 'Thông tin đơn nhập'
    },
    {
        key: '{supplier_address}',
        label: 'Địa chỉ NCC',
        group: 'Thông tin đơn nhập'
    },
    {
        key: '{billing_address}',
        label: 'Địa chỉ giao hóa đơn',
        group: 'Thông tin đơn nhập'
    },
    {
        key: '{supplier_debt_text}',
        label: 'Nợ NCC bằng chữ',
        group: 'Thông tin đơn nhập'
    },
    {
        key: '{supplier_debt_prev_text}',
        label: 'Nợ cũ NCC bằng chữ',
        group: 'Thông tin đơn nhập'
    },
    {
        key: '{weight_g}',
        label: 'Tổng khối lượng đơn nhập hàng (g)',
        group: 'Thông tin đơn nhập'
    },
    {
        key: '{weight_kg}',
        label: 'Tổng khối lượng đơn nhập hàng (kg)',
        group: 'Thông tin đơn nhập'
    },
    {
        key: '{tags}',
        label: 'Tags',
        group: 'Thông tin đơn nhập'
    },
    {
        key: '{total_transaction_amount}',
        label: 'Tổng tiền đã thanh toán',
        group: 'Thông tin đơn nhập'
    },
    {
        key: '{total_remain}',
        label: 'Tổng tiền còn phải trả',
        group: 'Thông tin đơn nhập'
    },
    {
        key: '{created_on}',
        label: 'Ngày tạo',
        group: 'Thông tin đơn nhập'
    },
    {
        key: '{modified_on_time}',
        label: 'Thời gian cập nhật',
        group: 'Thông tin đơn nhập'
    },
    {
        key: '{reference}',
        label: 'Tham chiếu',
        group: 'Thông tin đơn nhập'
    },
    {
        key: '{created_on_time}',
        label: 'Thời gian tạo',
        group: 'Thông tin đơn nhập'
    },
    {
        key: '{due_on_time}',
        label: 'Thời gian hẹn giao',
        group: 'Thông tin đơn nhập'
    },
    {
        key: '{status}',
        label: 'Trạng thái',
        group: 'Thông tin đơn nhập'
    },
    {
        key: '{received_status}',
        label: 'Trạng thái nhập kho',
        group: 'Thông tin đơn nhập'
    },
    {
        key: '{financial_status}',
        label: 'Trạng thái thanh toán',
        group: 'Thông tin đơn nhập'
    },
    {
        key: '{refund_status}',
        label: 'Trạng thái hoàn hàng',
        group: 'Thông tin đơn nhập'
    },
    {
        key: '{refund_transaction_status}',
        label: 'Trạng thái hoàn tiền',
        group: 'Thông tin đơn nhập'
    },
    {
        key: '{supplier_debt}',
        label: 'Nợ nhà cung cấp',
        group: 'Thông tin đơn nhập'
    },
    {
        key: '{supplier_debt_prev}',
        label: 'Nợ cũ NCC',
        group: 'Thông tin đơn nhập'
    },
    {
        key: '{account_name}',
        label: 'Nhân viên tạo',
        group: 'Thông tin đơn nhập'
    },
    {
        key: '{assignee_name}',
        label: 'Nhân viên phụ trách NCC',
        group: 'Thông tin đơn nhập'
    },
    {
        key: '{note}',
        label: 'Ghi chú',
        group: 'Thông tin đơn nhập'
    },
    // Thông tin sản phẩm
    {
        key: '{line_stt}',
        label: 'STT',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_unit}',
        label: 'Đơn vị tính',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_discount_rate}',
        label: 'Chiết khấu sản phẩm %',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_note}',
        label: 'Ghi chú sản phẩm',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_quantity}',
        label: 'Số lượng sản phẩm',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_variant_barcode}',
        label: 'Mã Barcode',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_product_name}',
        label: 'Tên sản phẩm',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_variant_options}',
        label: 'Thuộc tính sản phẩm',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_brand}',
        label: 'Thương hiệu sản phẩm',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_tax_rate}',
        label: 'Thuế (%)',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_weight_kg}',
        label: 'Tổng khối lượng sản phẩm (kg)',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{lots_number_code1}',
        label: 'Mã lô sản phẩm',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{lots_number_code3}',
        label: 'Mã lô - NSX - NHH sản phẩm',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_tax_exclude}',
        label: 'Giá chưa bao gồm thuế',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_price_after_discount}',
        label: 'Giá nhập sau chiết khấu',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_title}',
        label: 'Tên hàng',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_tax}',
        label: 'Loại thuế theo từng mặt hàng',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_discount_amount}',
        label: 'Chiết khấu sản phẩm',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_price}',
        label: 'Giá nhập',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_amount}',
        label: 'Thành tiền',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_variant_code}',
        label: 'Mã phiên bản sản phẩm',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_variant_name}',
        label: 'Tên phiên bản sản phẩm',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_category}',
        label: 'Loại sản phẩm',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_tax_amount}',
        label: 'Thuế (giá trị)',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{serials}',
        label: 'Serial',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_weight_g}',
        label: 'Tổng khối lượng sản phẩm (g)',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{lots_number_code2}',
        label: 'Mã lô - Số lượng bán sản phẩm',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{lots_number_code4}',
        label: 'Mã lô - NSX - NHH - Số lượng bán sản phẩm',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_tax_included}',
        label: 'Giá đã bao gồm thuế',
        group: 'Thông tin sản phẩm'
    },
    // Tổng giá trị
    {
        key: '{total_quantity}',
        label: 'Tổng số lượng',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_tax}',
        label: 'Tổng thuế',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_amount_transaction}',
        label: 'Tổng tiền trả lại',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_discounts_value}',
        label: 'Chiết khấu đơn nhập (giá trị)',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_amount_text}',
        label: 'Tổng tiền bằng chữ',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_landed_costs}',
        label: 'Tổng chi phí',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_amount_before_tax}',
        label: 'Tổng tiền trước thuế',
        group: 'Tổng giá trị'
    },
    {
        key: '{payments}',
        label: 'Tên phương thức thanh toán: Số tiền thanh toán',
        group: 'Tổng giá trị'
    },
    {
        key: '{product_discount}',
        label: 'Chiết khấu sản phẩm',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_price}',
        label: 'Tổng tiền',
        group: 'Tổng giá trị'
    },
    {
        key: '{total}',
        label: 'Tổng tiền hàng',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_discounts_rate}',
        label: 'Chiết khấu đơn nhập (%)',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_discounts}',
        label: 'Chiết khấu đơn nhập',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_extra_tax}',
        label: 'Tổng thuế phải trả thêm',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_tax_included_line}',
        label: 'Tổng thuế đã bao gồm trong sản phẩm',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_amount_after_tax}',
        label: 'Tổng tiền sau thuế',
        group: 'Tổng giá trị'
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/variables/don-tra-hang.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DON_TRA_HANG_VARIABLES",
    ()=>DON_TRA_HANG_VARIABLES
]);
const DON_TRA_HANG_VARIABLES = [
    // Thông tin cửa hàng
    {
        key: '{store_logo}',
        label: 'Logo cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_address}',
        label: 'Địa chỉ cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_email}',
        label: 'Email cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{location_name}',
        label: 'Tên chi nhánh',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{location_address}',
        label: 'Địa chỉ chi nhánh',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{order_return_code}',
        label: 'Mã đơn trả',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_name}',
        label: 'Tên cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_phone_number}',
        label: 'SĐT cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_province}',
        label: 'Tỉnh thành (cửa hàng)',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{print_date}',
        label: 'Ngày in',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{print_time}',
        label: 'Giờ in',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{location_province}',
        label: 'Tỉnh thành (chi nhánh)',
        group: 'Thông tin cửa hàng'
    },
    // Thông tin đơn hàng
    {
        key: '{customer_name}',
        label: 'Tên khách hàng',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{order_code}',
        label: 'Mã đơn hàng',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{modified_on}',
        label: 'Ngày cập nhật',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{note}',
        label: 'Ghi chú',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{reason_return}',
        label: 'Lý do',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{refund_status}',
        label: 'Trạng thái hoàn tiền',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{customer_phone_number}',
        label: 'SĐT khách hàng',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{customer_group}',
        label: 'Nhóm khách hàng',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{billing_address}',
        label: 'Địa chỉ gửi hóa đơn',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{created_on}',
        label: 'Ngày tạo',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{received_on}',
        label: 'Ngày nhận',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{reference}',
        label: 'Tham chiếu',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{status}',
        label: 'Trạng thái đơn trả',
        group: 'Thông tin đơn hàng'
    },
    // Thông tin giỏ hàng
    {
        key: '{line_stt}',
        label: 'STT',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_unit}',
        label: 'Đơn vị tính',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_variant_code}',
        label: 'Mã phiên bản',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_quantity}',
        label: 'Số lượng sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_price}',
        label: 'Giá bán',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_brand}',
        label: 'Thương hiệu sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_product_name}',
        label: 'Tên hàng',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_note}',
        label: 'Ghi chú sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_variant}',
        label: 'Tên phiên bản',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_amount}',
        label: 'Thành tiền',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{serials}',
        label: 'Serial',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_variant_options}',
        label: 'Thuộc tính sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    // Tổng giá trị
    {
        key: '{total_quantity}',
        label: 'Tổng số lượng',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_amount}',
        label: 'Tổng tiền trả khách',
        group: 'Tổng giá trị'
    },
    // === TỰ ĐỘNG THÊM TỪ TEMPLATE ===
    {
        key: '{account_name}',
        label: 'Người tạo',
        group: 'Thông tin khác'
    },
    {
        key: '{created_on_time}',
        label: 'Giờ tạo',
        group: 'Thông tin khác'
    },
    {
        key: '{customer_code}',
        label: 'Mã khách hàng',
        group: 'Thông tin khách hàng'
    },
    {
        key: '{customer_email}',
        label: 'Email khách hàng',
        group: 'Thông tin khách hàng'
    },
    {
        key: '{reason}',
        label: 'Lý do',
        group: 'Thông tin khác'
    },
    {
        key: '{return_code}',
        label: 'Mã đơn trả hàng',
        group: 'Thông tin trả hàng'
    },
    {
        key: '{total_text}',
        label: 'Tổng tiền bằng chữ',
        group: 'Tổng kết'
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/variables/nhan-giao-hang.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NHAN_GIAO_HANG_VARIABLES",
    ()=>NHAN_GIAO_HANG_VARIABLES
]);
const NHAN_GIAO_HANG_VARIABLES = [
    // Thông tin cửa hàng
    {
        key: '{store_logo}',
        label: 'Logo cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_address}',
        label: 'Địa chỉ cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_email}',
        label: 'Email cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{location_name}',
        label: 'Tên chi nhánh',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{location_address}',
        label: 'Địa chỉ chi nhánh',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_name}',
        label: 'Tên cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_phone_number}',
        label: 'SĐT cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_province}',
        label: 'Tỉnh thành (cửa hàng)',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{print_date}',
        label: 'Ngày in',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{print_time}',
        label: 'Giờ in',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{location_phone_number}',
        label: 'Số điện thoại chi nhánh',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{location_province}',
        label: 'Tỉnh thành (chi nhánh)',
        group: 'Thông tin cửa hàng'
    },
    // Thông tin đơn hàng
    {
        key: '{order_code}',
        label: 'Mã đơn hàng',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{order_qr_code}',
        label: 'Mã đơn hàng dạng QR code',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{order_bar_code}',
        label: 'Mã đơn hàng dạng mã vạch',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{modified_on}',
        label: 'Ngày cập nhật',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{received_on}',
        label: 'Ngày nhận',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{modified_on_time}',
        label: 'Thời gian cập nhật',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{received_on_time}',
        label: 'Thời gian nhận',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{customer_name}',
        label: 'Tên khách hàng',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{shipping_address}',
        label: 'Giao hàng đến',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{customer_phone_number}',
        label: 'SĐT khách hàng',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{delivery_type}',
        label: 'Phương thức vận chuyển',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{tracking_number}',
        label: 'Mã vận đơn',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{tracking_number_qr_code}',
        label: 'Mã vận đơn dạng QR code',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{tracking_number_bar_code}',
        label: 'Mã vận đơn dạng mã vạch',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{ship_on_min}',
        label: 'Ngày hẹn giao từ',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{status}',
        label: 'Trạng thái',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{city}',
        label: 'Tỉnh thành giao hàng',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{partner_type}',
        label: 'Loại đối tác',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{shipper_deposits}',
        label: 'Số tiền cọc trước',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{reason_cancel}',
        label: 'Lý do hủy đơn',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{account_name}',
        label: 'Nhân viên tạo đơn',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{created_on}',
        label: 'Ngày tạo',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{vnpost_crm_code}',
        label: 'Mã CRM VNPost',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{vnpost_crm_bar_code}',
        label: 'Mã CRM VNPost dạng mã vạch',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{packed_on}',
        label: 'Ngày đóng gói',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{packed_on_time}',
        label: 'Thời gian đóng gói',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{shipped_on_time}',
        label: 'Thời gian chuyển hàng',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{service_name}',
        label: 'Dịch vụ',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{billing_address}',
        label: 'Nơi giao hàng',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{customer_email}',
        label: 'Email khách hàng',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{delivery_service_provider}',
        label: 'Đối tác vận chuyển',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{receiver_name}',
        label: 'Người nhận',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{packing_weight}',
        label: 'Khối lượng đóng gói',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{creator_name}',
        label: 'Nhân viên tạo phiếu giao hàng',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{created_on_time}',
        label: 'Thời gian tạo',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{ship_on_max}',
        label: 'Ngày hẹn giao đến',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{district}',
        label: 'Quận huyện giao hàng',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{partner_phone_number}',
        label: 'Số ĐT đối tác',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{customer_phone_number_hide}',
        label: 'SĐT khách hàng - ẩn 4 số giữa',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{receiver_phone}',
        label: 'Số điện thoại người nhận',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{receiver_phone_hide}',
        label: 'Số điện thoại người nhận - ẩn 4 số giữa',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{pushing_status}',
        label: 'Trạng thái đẩy đơn',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{route_code_se}',
        label: 'Mã phân tuyến Sapo Express',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{sorting_code}',
        label: 'Mã định danh bưu cục',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{sorting_code_bar_code}',
        label: 'Mã định danh dạng mã vạch',
        group: 'Thông tin đơn hàng'
    },
    // Tổng giá trị
    {
        key: '{total_quantity}',
        label: 'Tổng số lượng',
        group: 'Tổng giá trị'
    },
    {
        key: '{total}',
        label: 'Tổng tiền hàng',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_tax}',
        label: 'Tổng thuế',
        group: 'Tổng giá trị'
    },
    {
        key: '{delivery_fee}',
        label: 'Phí giao hàng',
        group: 'Tổng giá trị'
    },
    {
        key: '{shipment_note}',
        label: 'Ghi chú',
        group: 'Tổng giá trị'
    },
    {
        key: '{cod_amount}',
        label: 'Tiền thu hộ',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_amount}',
        label: 'Khách phải trả',
        group: 'Tổng giá trị'
    },
    {
        key: '{fulfillment_discount}',
        label: 'Chiết khấu',
        group: 'Tổng giá trị'
    },
    {
        key: '{freight_amount}',
        label: 'Phí trả shipper',
        group: 'Tổng giá trị'
    },
    // === TỰ ĐỘNG THÊM TỪ TEMPLATE ===
    {
        key: '{cod}',
        label: 'Tiền thu hộ (COD)',
        group: 'Thông tin khác'
    },
    {
        key: '{note}',
        label: 'Ghi chú',
        group: 'Thông tin khác'
    },
    {
        key: '{shipment_barcode}',
        label: 'Mã vạch vận đơn',
        group: 'Thông tin vận chuyển'
    },
    {
        key: '{shipment_code}',
        label: 'Mã vận đơn',
        group: 'Thông tin vận chuyển'
    },
    {
        key: '{shipment_qrcode}',
        label: 'QR code vận đơn',
        group: 'Thông tin vận chuyển'
    },
    {
        key: '{total_weight_g}',
        label: 'Tổng khối lượng (g)',
        group: 'Tổng kết'
    },
    {
        key: '{total_weight_kg}',
        label: 'Tổng khối lượng (kg)',
        group: 'Tổng kết'
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/variables/phieu-ban-giao.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PHIEU_BAN_GIAO_VARIABLES",
    ()=>PHIEU_BAN_GIAO_VARIABLES
]);
const PHIEU_BAN_GIAO_VARIABLES = [
    // === THÔNG TIN CỬA HÀNG (auto từ getStoreData) ===
    {
        key: '{store_logo}',
        label: 'Logo cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_name}',
        label: 'Tên cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_address}',
        label: 'Địa chỉ cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_phone_number}',
        label: 'SĐT cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_email}',
        label: 'Email cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{print_date}',
        label: 'Ngày in',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{print_time}',
        label: 'Giờ in',
        group: 'Thông tin cửa hàng'
    },
    // === THÔNG TIN PHIẾU BÀN GIAO ===
    {
        key: '{handover_code}',
        label: 'Mã phiếu bàn giao',
        group: 'Thông tin phiếu'
    },
    {
        key: '{created_on}',
        label: 'Ngày tạo',
        group: 'Thông tin phiếu'
    },
    {
        key: '{created_on_time}',
        label: 'Giờ tạo',
        group: 'Thông tin phiếu'
    },
    {
        key: '{handover_type}',
        label: 'Loại bàn giao',
        group: 'Thông tin phiếu'
    },
    {
        key: '{status}',
        label: 'Trạng thái',
        group: 'Thông tin phiếu'
    },
    {
        key: '{note}',
        label: 'Ghi chú',
        group: 'Thông tin phiếu'
    },
    {
        key: '{account_name}',
        label: 'Người tạo phiếu',
        group: 'Thông tin phiếu'
    },
    // === THÔNG TIN NGƯỜI BÀN GIAO ===
    {
        key: '{from_employee}',
        label: 'Tên người bàn giao',
        group: 'Người bàn giao'
    },
    {
        key: '{from_employee_code}',
        label: 'Mã người bàn giao',
        group: 'Người bàn giao'
    },
    {
        key: '{from_department}',
        label: 'Bộ phận người bàn giao',
        group: 'Người bàn giao'
    },
    {
        key: '{from_position}',
        label: 'Chức vụ người bàn giao',
        group: 'Người bàn giao'
    },
    // === THÔNG TIN NGƯỜI NHẬN ===
    {
        key: '{to_employee}',
        label: 'Tên người nhận',
        group: 'Người nhận'
    },
    {
        key: '{to_employee_code}',
        label: 'Mã người nhận',
        group: 'Người nhận'
    },
    {
        key: '{to_department}',
        label: 'Bộ phận người nhận',
        group: 'Người nhận'
    },
    {
        key: '{to_position}',
        label: 'Chức vụ người nhận',
        group: 'Người nhận'
    },
    // === CHI TIẾT BÀN GIAO (Line items) ===
    {
        key: '{line_stt}',
        label: 'STT',
        group: 'Chi tiết bàn giao'
    },
    {
        key: '{line_item_code}',
        label: 'Mã tài sản',
        group: 'Chi tiết bàn giao'
    },
    {
        key: '{line_item_name}',
        label: 'Tên tài sản',
        group: 'Chi tiết bàn giao'
    },
    {
        key: '{line_description}',
        label: 'Mô tả',
        group: 'Chi tiết bàn giao'
    },
    {
        key: '{line_serial}',
        label: 'Số serial',
        group: 'Chi tiết bàn giao'
    },
    {
        key: '{line_quantity}',
        label: 'Số lượng',
        group: 'Chi tiết bàn giao'
    },
    {
        key: '{line_unit}',
        label: 'Đơn vị',
        group: 'Chi tiết bàn giao'
    },
    {
        key: '{line_condition}',
        label: 'Tình trạng',
        group: 'Chi tiết bàn giao'
    },
    {
        key: '{line_value}',
        label: 'Giá trị',
        group: 'Chi tiết bàn giao'
    },
    {
        key: '{line_note}',
        label: 'Ghi chú',
        group: 'Chi tiết bàn giao'
    },
    // === TỔNG KẾT ===
    {
        key: '{total_items}',
        label: 'Tổng số mục',
        group: 'Tổng kết'
    },
    {
        key: '{total_quantity}',
        label: 'Tổng số lượng',
        group: 'Tổng kết'
    },
    {
        key: '{total_value}',
        label: 'Tổng giá trị',
        group: 'Tổng kết'
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/variables/phieu-bao-hanh.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PHIEU_BAO_HANH_VARIABLES",
    ()=>PHIEU_BAO_HANH_VARIABLES
]);
const PHIEU_BAO_HANH_VARIABLES = [
    // Thông tin cửa hàng
    {
        key: '{store_logo}',
        label: 'Logo cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_name}',
        label: 'Tên cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_phone_number}',
        label: 'SĐT cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_address}',
        label: 'Địa chỉ cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_email}',
        label: 'Email cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{location_name}',
        label: 'Tên chi nhánh',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{location_address}',
        label: 'Địa chỉ chi nhánh',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_province}',
        label: 'Tỉnh thành (cửa hàng)',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{location_province}',
        label: 'Tỉnh thành (chi nhánh)',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{print_date}',
        label: 'Ngày in',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{print_time}',
        label: 'Giờ in',
        group: 'Thông tin cửa hàng'
    },
    // Thông tin phiếu bảo hành
    {
        key: '{account_name}',
        label: 'Tên nhân viên tạo',
        group: 'Thông tin phiếu bảo hành'
    },
    {
        key: '{warranty_card_code}',
        label: 'Mã phiếu bảo hành',
        group: 'Thông tin phiếu bảo hành'
    },
    {
        key: '{modified_on}',
        label: 'Ngày cập nhật',
        group: 'Thông tin phiếu bảo hành'
    },
    {
        key: '{created_on}',
        label: 'Ngày tạo',
        group: 'Thông tin phiếu bảo hành'
    },
    {
        key: '{status}',
        label: 'Trạng thái',
        group: 'Thông tin phiếu bảo hành'
    },
    {
        key: '{customer_name}',
        label: 'Tên khách hàng',
        group: 'Thông tin phiếu bảo hành'
    },
    {
        key: '{customer_phone_number}',
        label: 'SĐT khách hàng',
        group: 'Thông tin phiếu bảo hành'
    },
    {
        key: '{customer_address1}',
        label: 'Địa chỉ khách hàng',
        group: 'Thông tin phiếu bảo hành'
    },
    {
        key: '{customer_group}',
        label: 'Nhóm khách hàng',
        group: 'Thông tin phiếu bảo hành'
    },
    {
        key: '{order_code}',
        label: 'Mã đơn hàng',
        group: 'Thông tin phiếu bảo hành'
    },
    {
        key: '{claim_status}',
        label: 'Trạng thái yêu cầu',
        group: 'Thông tin phiếu bảo hành'
    },
    // Thông tin sản phẩm
    {
        key: '{line_stt}',
        label: 'STT',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_product_name}',
        label: 'Tên sản phẩm',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_variant_name}',
        label: 'Tên phiên bản sản phẩm',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_variant_sku}',
        label: 'Mã SKU',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_variant_barcode}',
        label: 'Mã Barcode',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{serials}',
        label: 'Mã serial',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{term_name}',
        label: 'Tên chính sách bảo hành',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{term_number}',
        label: 'Thời hạn bảo hành',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{warranty_period_days}',
        label: 'Thời hạn bảo hành quy ra ngày',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{start_date}',
        label: 'Ngày bắt đầu',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{end_date}',
        label: 'Ngày hết hạn',
        group: 'Thông tin sản phẩm'
    },
    // === TỰ ĐỘNG THÊM TỪ TEMPLATE ===
    {
        key: '{customer_address}',
        label: 'Địa chỉ khách hàng',
        group: 'Thông tin khách hàng'
    },
    {
        key: '{product_name}',
        label: 'Tên sản phẩm',
        group: 'Thông tin khác'
    },
    {
        key: '{serial_number}',
        label: 'Số serial',
        group: 'Thông tin khác'
    },
    {
        key: '{warranty_code}',
        label: 'Mã phiếu bảo hành',
        group: 'Thông tin bảo hành'
    },
    {
        key: '{warranty_duration}',
        label: 'Thời hạn bảo hành',
        group: 'Thông tin bảo hành'
    },
    {
        key: '{warranty_expired_on}',
        label: 'Ngày hết bảo hành',
        group: 'Thông tin bảo hành'
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/variables/phieu-chi.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PHIEU_CHI_VARIABLES",
    ()=>PHIEU_CHI_VARIABLES
]);
const PHIEU_CHI_VARIABLES = [
    // Thông tin cửa hàng
    {
        key: '{store_logo}',
        label: 'Logo cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_address}',
        label: 'Địa chỉ cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_email}',
        label: 'Email cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{location_name}',
        label: 'Tên chi nhánh',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{location_address}',
        label: 'Địa chỉ chi nhánh',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_name}',
        label: 'Tên cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_phone_number}',
        label: 'SĐT cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_province}',
        label: 'Tỉnh thành (cửa hàng)',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{location_province}',
        label: 'Tỉnh thành (chi nhánh)',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{print_date}',
        label: 'Ngày in',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{print_time}',
        label: 'Giờ in',
        group: 'Thông tin cửa hàng'
    },
    // Thông tin
    {
        key: '{payment_voucher_code}',
        label: 'Mã',
        group: 'Thông tin'
    },
    {
        key: '{object_name}',
        label: 'Tên người nhận',
        group: 'Thông tin'
    },
    {
        key: '{object_phone_number}',
        label: 'SĐT người nhận',
        group: 'Thông tin'
    },
    {
        key: '{total_text}',
        label: 'Số tiền bằng chữ',
        group: 'Thông tin'
    },
    {
        key: '{note}',
        label: 'Ghi chú',
        group: 'Thông tin'
    },
    {
        key: '{account_name}',
        label: 'Người tạo phiếu',
        group: 'Thông tin'
    },
    {
        key: '{group_name}',
        label: 'Loại phiếu chi',
        group: 'Thông tin'
    },
    {
        key: '{created_on}',
        label: 'Ngày tạo',
        group: 'Thông tin'
    },
    {
        key: '{counted}',
        label: 'Hạch toán KQKD',
        group: 'Thông tin'
    },
    {
        key: '{customer_debt_before_create_payment}',
        label: 'Nợ KH trước khi tạo phiếu',
        group: 'Thông tin'
    },
    {
        key: '{customer_debt_before_create_payment_text}',
        label: 'Nợ KH trước khi tạo phiếu bằng chữ',
        group: 'Thông tin'
    },
    {
        key: '{customer_debt_after_create_payment}',
        label: 'Nợ KH sau khi tạo phiếu',
        group: 'Thông tin'
    },
    {
        key: '{customer_debt_after_create_payment_text}',
        label: 'Nợ KH sau khi tạo phiếu bằng chữ',
        group: 'Thông tin'
    },
    {
        key: '{supplier_debt_before_create_payment}',
        label: 'Nợ NCC trước khi tạo phiếu',
        group: 'Thông tin'
    },
    {
        key: '{supplier_debt_before_create_payment_text}',
        label: 'Nợ NCC trước khi tạo phiếu bằng chữ',
        group: 'Thông tin'
    },
    {
        key: '{supplier_debt_after_create_payment}',
        label: 'Nợ NCC sau khi tạo phiếu',
        group: 'Thông tin'
    },
    {
        key: '{supplier_debt_after_create_payment_text}',
        label: 'Nợ NCC sau khi tạo phiếu bằng chữ',
        group: 'Thông tin'
    },
    {
        key: '{issued_on}',
        label: 'Ngày ghi nhận',
        group: 'Thông tin'
    },
    {
        key: '{object_address}',
        label: 'Địa chỉ người nhận',
        group: 'Thông tin'
    },
    {
        key: '{amount}',
        label: 'Số tiền',
        group: 'Thông tin'
    },
    {
        key: '{reference}',
        label: 'Tham chiếu',
        group: 'Thông tin'
    },
    {
        key: '{issued_on_time}',
        label: 'Thời gian ghi nhận',
        group: 'Thông tin'
    },
    {
        key: '{payment_method_name}',
        label: 'Phương thức thanh toán',
        group: 'Thông tin'
    },
    {
        key: '{object_type}',
        label: 'Loại người nhận',
        group: 'Thông tin'
    },
    {
        key: '{document_root_code}',
        label: 'Chứng từ gốc',
        group: 'Thông tin'
    },
    {
        key: '{supplier_debt}',
        label: 'Nợ nhà cung cấp hiện tại',
        group: 'Thông tin'
    },
    {
        key: '{supplier_debt_text}',
        label: 'Nợ nhà cung cấp hiện tại bằng chữ',
        group: 'Thông tin'
    },
    {
        key: '{supplier_debt_prev}',
        label: 'Nợ cũ nhà cung cấp',
        group: 'Thông tin'
    },
    {
        key: '{supplier_debt_prev_text}',
        label: 'Nợ cũ nhà cung cấp bằng chữ',
        group: 'Thông tin'
    },
    {
        key: '{customer_debt}',
        label: 'Nợ khách hàng hiện tại',
        group: 'Thông tin'
    },
    {
        key: '{customer_debt_text}',
        label: 'Nợ khách hàng hiện tại bằng chữ',
        group: 'Thông tin'
    },
    {
        key: '{customer_debt_prev}',
        label: 'Nợ cũ khách hàng',
        group: 'Thông tin'
    },
    {
        key: '{customer_debt_prev_text}',
        label: 'Nợ cũ khách hàng bằng chữ',
        group: 'Thông tin'
    },
    // === TỰ ĐỘNG THÊM TỪ TEMPLATE ===
    {
        key: '{amount_text}',
        label: 'Số tiền bằng chữ',
        group: 'Tổng kết'
    },
    {
        key: '{description}',
        label: 'Diễn giải',
        group: 'Thông tin khác'
    },
    {
        key: '{payment_barcode}',
        label: 'Mã vạch phiếu chi',
        group: 'Thông tin thanh toán'
    },
    {
        key: '{payment_method}',
        label: 'Phương thức thanh toán',
        group: 'Thông tin thanh toán'
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/variables/phieu-chuyen-hang.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PHIEU_CHUYEN_HANG_VARIABLES",
    ()=>PHIEU_CHUYEN_HANG_VARIABLES
]);
const PHIEU_CHUYEN_HANG_VARIABLES = [
    // Thông tin cửa hàng
    {
        key: '{store_logo}',
        label: 'Logo cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_address}',
        label: 'Địa chỉ cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_email}',
        label: 'Email cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_fax}',
        label: 'Số Fax',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{location_address}',
        label: 'Địa chỉ chi nhánh',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_name}',
        label: 'Tên cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_phone_number}',
        label: 'SĐT cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_province}',
        label: 'Tỉnh thành (cửa hàng)',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{location_name}',
        label: 'Tên chi nhánh',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{location_province}',
        label: 'Tỉnh thành (chi nhánh)',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{print_date}',
        label: 'Ngày in',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{print_time}',
        label: 'Giờ in',
        group: 'Thông tin cửa hàng'
    },
    // Thông tin phiếu chuyển hàng
    {
        key: '{order_code}',
        label: 'Mã phiếu',
        group: 'Thông tin phiếu chuyển hàng'
    },
    {
        key: '{modified_on}',
        label: 'Ngày cập nhật',
        group: 'Thông tin phiếu chuyển hàng'
    },
    {
        key: '{shipped_on}',
        label: 'Ngày chuyển',
        group: 'Thông tin phiếu chuyển hàng'
    },
    {
        key: '{modified_on_time}',
        label: 'Thời gian cập nhật',
        group: 'Thông tin phiếu chuyển hàng'
    },
    {
        key: '{shipped_on_time}',
        label: 'Thời gian chuyển',
        group: 'Thông tin phiếu chuyển hàng'
    },
    {
        key: '{source_location_name}',
        label: 'Tên chi nhánh chuyển',
        group: 'Thông tin phiếu chuyển hàng'
    },
    {
        key: '{source_location_address}',
        label: 'Địa chỉ chi nhánh chuyển',
        group: 'Thông tin phiếu chuyển hàng'
    },
    {
        key: '{reference}',
        label: 'Tham chiếu',
        group: 'Thông tin phiếu chuyển hàng'
    },
    {
        key: '{account_name}',
        label: 'Người tạo',
        group: 'Thông tin phiếu chuyển hàng'
    },
    {
        key: '{weight_g}',
        label: 'Tổng khối lượng chuyển hàng (g)',
        group: 'Thông tin phiếu chuyển hàng'
    },
    {
        key: '{created_on}',
        label: 'Ngày tạo',
        group: 'Thông tin phiếu chuyển hàng'
    },
    {
        key: '{note}',
        label: 'Ghi chú',
        group: 'Thông tin phiếu chuyển hàng'
    },
    {
        key: '{received_on}',
        label: 'Ngày nhận',
        group: 'Thông tin phiếu chuyển hàng'
    },
    {
        key: '{created_on_time}',
        label: 'Thời gian tạo',
        group: 'Thông tin phiếu chuyển hàng'
    },
    {
        key: '{received_on_time}',
        label: 'Thời gian nhận',
        group: 'Thông tin phiếu chuyển hàng'
    },
    {
        key: '{destination_location_name}',
        label: 'Tên chi nhánh nhận',
        group: 'Thông tin phiếu chuyển hàng'
    },
    {
        key: '{destination_location_address}',
        label: 'Địa chỉ chi nhánh nhận',
        group: 'Thông tin phiếu chuyển hàng'
    },
    {
        key: '{status}',
        label: 'Trạng thái',
        group: 'Thông tin phiếu chuyển hàng'
    },
    {
        key: '{weight_kg}',
        label: 'Tổng khối lượng chuyển hàng (kg)',
        group: 'Thông tin phiếu chuyển hàng'
    },
    // Thông tin sản phẩm
    {
        key: '{line_stt}',
        label: 'STT',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_variant_code}',
        label: 'Mã phiên bản sản phẩm',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_quantity}',
        label: 'Số lượng sản phẩm',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_variant_options}',
        label: 'Thuộc tính sản phẩm',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_brand}',
        label: 'Thương hiệu sản phẩm',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_unit}',
        label: 'Đơn vị tính',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_price}',
        label: 'Đơn giá',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_amount}',
        label: 'Thành tiền',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_weight_g}',
        label: 'Tổng khối lượng sản phẩm (g)',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_product_name}',
        label: 'Tên sản phẩm',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_variant_name}',
        label: 'Tên phiên bản sản phẩm',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_variant_barcode}',
        label: 'Mã Barcode',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_category}',
        label: 'Loại sản phẩm',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{serials}',
        label: 'Serial',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{lots_number_code1}',
        label: 'Mã lô sản phẩm',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{lots_number_code2}',
        label: 'Mã lô - Số lượng bán sản phẩm',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{lots_number_code3}',
        label: 'Mã lô - NSX - NHH sản phẩm',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{lots_number_code4}',
        label: 'Mã lô - NSX - NHH - Số lượng bán sản phẩm',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_variant_image}',
        label: 'Ảnh phiên bản sản phẩm',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_weight_kg}',
        label: 'Tổng khối lượng sản phẩm (kg)',
        group: 'Thông tin sản phẩm'
    },
    // Thông tin giỏ hàng
    {
        key: '{receipt_quantity}',
        label: 'Số lượng nhận',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{change_quantity}',
        label: 'Số lượng chênh lệch',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_amount_received}',
        label: 'Thành tiền nhận',
        group: 'Thông tin giỏ hàng'
    },
    // Tổng giá trị
    {
        key: '{total_quantity}',
        label: 'Tổng số lượng',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_amount_transfer}',
        label: 'Tổng giá trị chuyển',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_fee_amount}',
        label: 'Tổng chi phí chuyển hàng',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_receipt_quantity}',
        label: 'Tổng số lượng nhận',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_amount_receipt}',
        label: 'Tổng giá trị nhận',
        group: 'Tổng giá trị'
    },
    // === TỰ ĐỘNG THÊM TỪ TEMPLATE ===
    {
        key: '{line_variant}',
        label: 'Phiên bản sản phẩm',
        group: 'Chi tiết sản phẩm'
    },
    {
        key: '{target_location_name}',
        label: 'Chi nhánh nhận',
        group: 'Thông tin khác'
    },
    {
        key: '{transfer_code}',
        label: 'Mã phiếu chuyển kho',
        group: 'Thông tin chuyển kho'
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/variables/phieu-don-tam-tinh.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PHIEU_DON_TAM_TINH_VARIABLES",
    ()=>PHIEU_DON_TAM_TINH_VARIABLES
]);
const PHIEU_DON_TAM_TINH_VARIABLES = [
    // Thông tin cửa hàng
    {
        key: '{store_logo}',
        label: 'Logo cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_address}',
        label: 'Địa chỉ cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_email}',
        label: 'Email cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_fax}',
        label: 'Số Fax',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{location_address}',
        label: 'Địa chỉ chi nhánh',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_province}',
        label: 'Tỉnh thành (cửa hàng)',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_name}',
        label: 'Tên cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_phone_number}',
        label: 'SĐT cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{location_name}',
        label: 'Tên chi nhánh',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{location_province}',
        label: 'Tỉnh thành (chi nhánh)',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{location_phone_number}',
        label: 'SĐT chi nhánh',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{print_date}',
        label: 'Ngày in',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{print_time}',
        label: 'Giờ in',
        group: 'Thông tin cửa hàng'
    },
    // Thông tin đơn hàng
    {
        key: '{order_code}',
        label: 'Mã đơn hàng',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{order_qr_code}',
        label: 'Mã đơn hàng dạng QR code',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{bar_code(code)}',
        label: 'Mã đơn hàng dạng mã vạch',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{modified_on}',
        label: 'Ngày cập nhật',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{modified_on_time}',
        label: 'Thời gian cập nhật',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{ship_on_min}',
        label: 'Ngày hẹn giao hàng từ',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{ship_on_max}',
        label: 'Thời gian hẹn giao hàng đến',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{assignee_name}',
        label: 'Người phụ trách',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{customer_name}',
        label: 'Tên khách hàng',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{customer_contact}',
        label: 'Liên hệ khách hàng',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{customer_contact_phone_number}',
        label: 'SĐT liên hệ khách hàng',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{customer_contact_phone_number_hide}',
        label: 'SĐT liên hệ khách hàng - ẩn 4 số giữa',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{customer_group}',
        label: 'Nhóm khách hàng',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{shipping_address}',
        label: 'Địa chỉ giao hàng',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{customer_phone_number}',
        label: 'SĐT khách hàng',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{customer_phone_number_hide}',
        label: 'SĐT khách hàng - ẩn 4 số giữa',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{customer_point}',
        label: 'Điểm hiện tại',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{customer_point_used}',
        label: 'Điểm đã thanh toán cho hóa đơn',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{customer_point_new}',
        label: 'Điểm tích được khi mua hàng',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{customer_point_before_create_invoice}',
        label: 'Điểm trước khi mua hàng',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{customer_point_after_create_invoice}',
        label: 'Điểm sau khi mua hàng',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{currency_name}',
        label: 'Tiền tệ',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{tax_treatment}',
        label: 'Giá đã bao gồm thuế',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{fulfillment_status}',
        label: 'Trạng thái giao hàng',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{packed_status}',
        label: 'Trạng thái đóng gói',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{return_status}',
        label: 'Trạng thái trả hàng',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{customer_debt_text}',
        label: 'Nợ KH bằng chữ',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{customer_tax_number}',
        label: 'Mã số thuế của KH',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{expected_delivery_type}',
        label: 'Vận chuyển dự kiến',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{weight_g}',
        label: 'Tổng khối lượng đơn hàng (g)',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{weight_kg}',
        label: 'Tổng khối lượng đơn hàng (kg)',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{issued_on_text}',
        label: 'Ngày chứng từ dạng chữ',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{shipping_address:full_name}',
        label: 'Người nhận',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{shipping_address:phone_number}',
        label: 'SĐT người nhận',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{shipping_address:phone_number_hide}',
        label: 'SĐT người nhận - ẩn 4 số giữa',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{created_on}',
        label: 'Ngày tạo',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{source}',
        label: 'Nguồn',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{bar_code(reference_number)}',
        label: 'Tham chiếu dạng mã vạch',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{issued_on}',
        label: 'Ngày chứng từ',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{account_name}',
        label: 'Người tạo',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{issued_on_time}',
        label: 'Thời gian chứng từ',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{created_on_time}',
        label: 'Thời gian tạo',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{customer_code}',
        label: 'Mã khách hàng',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{customer_debt}',
        label: 'Nợ hiện tại',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{debt_before_create_invoice}',
        label: 'Nợ trước khi mua hàng',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{debt_before_create_invoice_text}',
        label: 'Nợ trước khi mua hàng bằng chữ',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{debt_after_create_invoice}',
        label: 'Nợ sau khi mua hàng',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{debt_after_create_invoice_text}',
        label: 'Nợ sau khi mua hàng bằng chữ',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{billing_address}',
        label: 'Địa chỉ gửi hóa đơn',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{customer_email}',
        label: 'Email khách hàng',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{reference}',
        label: 'Tham chiếu',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{customer_card}',
        label: 'Hạng thẻ',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{price_list_name}',
        label: 'Chính sách giá',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{order_status}',
        label: 'Trạng thái đơn hàng',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{tag}',
        label: 'Thẻ Tag',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{payment_status}',
        label: 'Trạng thái thanh toán',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{customer_debt_prev}',
        label: 'Nợ cũ',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{customer_debt_prev_text}',
        label: 'Nợ cũ KH bằng chữ',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{expected_payment_method}',
        label: 'Thanh toán dự kiến',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{channel}',
        label: 'Kênh bán hàng',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{shipped_on}',
        label: 'Ngày xuất kho',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{created_on_text}',
        label: 'Ngày tạo dạng chữ',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{total_amount_and_debt_before_create_invoice}',
        label: 'Nợ và đơn hàng mới',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{total_amount_and_debt_before_create_invoice_text}',
        label: 'Nợ và đơn hàng mới bằng chữ',
        group: 'Thông tin đơn hàng'
    },
    // Thông tin giỏ hàng
    {
        key: '{line_stt}',
        label: 'STT',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_variant_code}',
        label: 'Mã phiên bản sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_tax_rate}',
        label: 'Thuế theo %',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_discount_rate}',
        label: 'Chiết khấu sản phẩm %',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_note}',
        label: 'Ghi chú sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_quantity}',
        label: 'Số lượng sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_unit}',
        label: 'Đơn vị tính',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_price_after_discount}',
        label: 'Giá sau chiết khấu trên 1 sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_promotion_or_loyalty}',
        label: 'Hàng tích điểm, KM',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_tax_included}',
        label: 'Giá đã bao gồm thuế',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_brand}',
        label: 'Thương hiệu sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_weight_g}',
        label: 'Tổng khối lượng sản phẩm (g)',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_weight_kg}',
        label: 'Tổng khối lượng sản phẩm (kg)',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{term_number}',
        label: 'Thời hạn bảo hành',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{lots_number_code2}',
        label: 'Mã lô - Số lượng bán sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{lots_number_code4}',
        label: 'Mã lô - NSX -NHH - Số lượng bán sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{composite_details}',
        label: 'Thành phần combo',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{packsizes}',
        label: 'Đơn vị quy đổi',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{lots_number_combo}',
        label: 'Mã lô-date thành phần trong combo',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_image}',
        label: 'Ảnh phiên bản sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_variant_barcode_image}',
        label: 'Mã vạch sản phẩm (dạng ảnh)',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{total_line_item_discount}',
        label: 'Tổng chiết khấu sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_product_name}',
        label: 'Tên sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_variant}',
        label: 'Tên phiên bản sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_tax_amount}',
        label: 'Thuế',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_discount_amount}',
        label: 'Chiết khấu sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_price}',
        label: 'Giá bán',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_price_discount}',
        label: 'Giá bán sau/trước chiết khấu',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_amount}',
        label: 'Thành tiền',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_variant_barcode}',
        label: 'Mã Barcode',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_amount_none_discount}',
        label: 'Tiền hàng (Giá * SL)',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_variant_options}',
        label: 'Thuộc tính sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_category}',
        label: 'Loại sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{serials}',
        label: 'Serial',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{term_name}',
        label: 'Chính sách bảo hành',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{bin_location}',
        label: 'Điểm lưu kho',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{lots_number_code1}',
        label: 'Mã lô sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{lots_number_code3}',
        label: 'Mã lô - NSX - NHH sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_tax_exclude}',
        label: 'Giá chưa bao gồm thuế',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_product_description}',
        label: 'Mô tả sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{term_name_combo}',
        label: 'Chính sách bảo hành thành phần combo',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{term_number_combo}',
        label: 'Thời hạn bảo hành thành phần combo',
        group: 'Thông tin giỏ hàng'
    },
    // Tổng giá trị
    {
        key: '{total_quantity}',
        label: 'Tổng số lượng',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_amount}',
        label: 'Tổng tiền',
        group: 'Tổng giá trị'
    },
    {
        key: '{money_return}',
        label: 'Tổng tiền trả lại',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_text}',
        label: 'Tổng tiền bằng chữ',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_tax}',
        label: 'Tổng thuế',
        group: 'Tổng giá trị'
    },
    {
        key: '{delivery_fee}',
        label: 'Phí giao hàng',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_remain}',
        label: 'Tiền còn lại khách phải trả',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_remain_text}',
        label: 'Tiền còn lại khách phải trả bằng chữ',
        group: 'Tổng giá trị'
    },
    {
        key: '{payment_name}',
        label: 'Phương thức thanh toán',
        group: 'Tổng giá trị'
    },
    {
        key: '{payments}',
        label: 'Tên phương thức thanh toán: Số tiền thanh toán',
        group: 'Tổng giá trị'
    },
    {
        key: '{payment_qr}',
        label: 'Mã QR thanh toán',
        group: 'Tổng giá trị'
    },
    {
        key: '{promotion_name}',
        label: 'Tên khuyến mại',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_amount_before_tax}',
        label: 'Tổng tiền trước thuế',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_amount_after_tax}',
        label: 'Tổng tiền sau thuế',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_discount}',
        label: 'Tổng chiết khấu của sản phẩm và đơn hàng',
        group: 'Tổng giá trị'
    },
    {
        key: '{product_discount}',
        label: 'Chiết khấu sản phẩm',
        group: 'Tổng giá trị'
    },
    {
        key: '{payment_customer}',
        label: 'Tổng tiền khách đưa',
        group: 'Tổng giá trị'
    },
    {
        key: '{total}',
        label: 'Tổng tiền hàng',
        group: 'Tổng giá trị'
    },
    {
        key: '{discount_details}',
        label: 'Chiết khấu chi tiết',
        group: 'Tổng giá trị'
    },
    {
        key: '{order_note}',
        label: 'Ghi chú',
        group: 'Tổng giá trị'
    },
    {
        key: '{order_discount_rate}',
        label: 'Chiết khấu đơn hàng theo %',
        group: 'Tổng giá trị'
    },
    {
        key: '{order_discount_value}',
        label: 'Chiết khấu đơn hàng theo giá trị',
        group: 'Tổng giá trị'
    },
    {
        key: '{order_discount}',
        label: 'Chiết khấu đơn hàng',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_none_discount}',
        label: 'Tổng tiền (Đơn giá * SL)',
        group: 'Tổng giá trị'
    },
    {
        key: '{promotion_code}',
        label: 'Mã chương trình khuyến mại',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_extra_tax}',
        label: 'Tổng thuế phải trả thêm',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_tax_included_line}',
        label: 'Tổng thuế đã bao gồm trong sản phẩm',
        group: 'Tổng giá trị'
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/variables/phieu-dong-goi.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PHIEU_DONG_GOI_VARIABLES",
    ()=>PHIEU_DONG_GOI_VARIABLES
]);
const PHIEU_DONG_GOI_VARIABLES = [
    // Thông tin cửa hàng
    {
        key: '{store_logo}',
        label: 'Logo cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_address}',
        label: 'Địa chỉ cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_email}',
        label: 'Email cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_fax}',
        label: 'Số Fax',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{location_province}',
        label: 'Tỉnh thành (chi nhánh)',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{location_country}',
        label: 'Quốc gia (chi nhánh)',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_name}',
        label: 'Tên cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_phone_number}',
        label: 'SĐT cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_province}',
        label: 'Tỉnh thành (cửa hàng)',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{location_name}',
        label: 'Tên chi nhánh',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{print_date}',
        label: 'Ngày in',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{print_time}',
        label: 'Giờ in',
        group: 'Thông tin cửa hàng'
    },
    // Thông tin gói hàng
    {
        key: '{order_code}',
        label: 'Mã đơn hàng',
        group: 'Thông tin gói hàng'
    },
    {
        key: '{modified_on}',
        label: 'Ngày cập nhật',
        group: 'Thông tin gói hàng'
    },
    {
        key: '{shipped_on}',
        label: 'Ngày chuyển hàng',
        group: 'Thông tin gói hàng'
    },
    {
        key: '{shipped_on_time}',
        label: 'Thời gian chuyển hàng',
        group: 'Thông tin gói hàng'
    },
    {
        key: '{billing_address}',
        label: 'Địa chỉ gửi hóa đơn',
        group: 'Thông tin gói hàng'
    },
    {
        key: '{shipping_address}',
        label: 'Giao hàng đến',
        group: 'Thông tin gói hàng'
    },
    {
        key: '{customer_email}',
        label: 'Email khách hàng',
        group: 'Thông tin gói hàng'
    },
    {
        key: '{package_note}',
        label: 'Ghi chú',
        group: 'Thông tin gói hàng'
    },
    {
        key: '{created_on_time}',
        label: 'Thời gian tạo',
        group: 'Thông tin gói hàng'
    },
    {
        key: '{customer_name}',
        label: 'Tên khách hàng',
        group: 'Thông tin gói hàng'
    },
    {
        key: '{created_on}',
        label: 'Ngày tạo',
        group: 'Thông tin gói hàng'
    },
    {
        key: '{modified_on_time}',
        label: 'Thời gian cập nhật',
        group: 'Thông tin gói hàng'
    },
    {
        key: '{packed_on}',
        label: 'Ngày đóng gói',
        group: 'Thông tin gói hàng'
    },
    {
        key: '{packed_on_time}',
        label: 'Thời gian đóng gói',
        group: 'Thông tin gói hàng'
    },
    {
        key: '{order_note}',
        label: 'Ghi chú đơn hàng',
        group: 'Thông tin gói hàng'
    },
    {
        key: '{fulfillment_status}',
        label: 'Trạng thái',
        group: 'Thông tin gói hàng'
    },
    {
        key: '{customer_phone_number}',
        label: 'SĐT khách hàng',
        group: 'Thông tin gói hàng'
    },
    {
        key: '{customer_phone_number_hide}',
        label: 'SĐT khách hàng - ẩn 4 số giữa',
        group: 'Thông tin gói hàng'
    },
    // Thông tin giỏ hàng
    {
        key: '{line_stt}',
        label: 'STT',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_variant_code}',
        label: 'Mã phiên bản sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_unit}',
        label: 'Đơn vị tính',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_discount_rate}',
        label: 'Chiết khấu sản phẩm %',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_note}',
        label: 'Ghi chú sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_product_category}',
        label: 'Loại sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_quantity}',
        label: 'Số lượng sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_tax_rate}',
        label: '% Thuế',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_variant_barcode}',
        label: 'Mã vạch phiên bản sp',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_price_after_discount}',
        label: 'Giá sau chiết khấu/sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{lots_number_code1}',
        label: 'Mã lô sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{lots_number_code3}',
        label: 'Mã lô - NSX - NHH sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_composite_variant_code}',
        label: 'Mã thành phần combo',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_composite_variant_name}',
        label: 'Tên thành phần combo',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_tax_exclude}',
        label: 'Giá chưa bao gồm thuế',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_product_name}',
        label: 'Tên sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_variant}',
        label: 'Tên phiên bản sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_tax}',
        label: 'Loại thuế theo từng mặt hàng',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_discount_amount}',
        label: 'Chiết khấu sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_price}',
        label: 'Giá bán',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_product_brand}',
        label: 'Nhãn hiệu',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_amount}',
        label: 'Thành tiền',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_variant_options}',
        label: 'Thuộc tính sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_tax_amount}',
        label: 'Thuế (giá trị)',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{serials}',
        label: 'Serial',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{lots_number_code2}',
        label: 'Mã lô - Số lượng bán sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{lots_number_code4}',
        label: 'Mã lô - NSX - NHH - Số lượng bán sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_composite_unit}',
        label: 'ĐV thành phần combo',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_composite_quantity}',
        label: 'SL thành phần combo',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_tax_included}',
        label: 'Giá đã bao gồm thuế',
        group: 'Thông tin giỏ hàng'
    },
    // Tổng giá trị
    {
        key: '{total}',
        label: 'Tổng tiền hàng',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_tax}',
        label: 'Tổng thuế',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_quantity}',
        label: 'Tổng số lượng',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_amount_before_tax}',
        label: 'Tổng tiền trước thuế',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_amount_after_tax}',
        label: 'Tổng tiền sau thuế',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_amount}',
        label: 'Khách phải trả',
        group: 'Tổng giá trị'
    },
    {
        key: '{fulfillment_discount}',
        label: 'Chiết khấu',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_amount_text}',
        label: 'Tổng tiền bằng chữ',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_extra_tax}',
        label: 'Tổng thuế phải trả thêm',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_tax_included_line}',
        label: 'Tổng thuế đã bao gồm trong sản phẩm',
        group: 'Tổng giá trị'
    },
    // === TỰ ĐỘNG THÊM TỪ TEMPLATE ===
    {
        key: '{account_name}',
        label: 'Người tạo',
        group: 'Thông tin khác'
    },
    {
        key: '{assigned_employee}',
        label: 'Nhân viên được gán',
        group: 'Thông tin khác'
    },
    {
        key: '{bin_location}',
        label: 'Vị trí kho',
        group: 'Thông tin khác'
    },
    {
        key: '{cod}',
        label: 'Tiền thu hộ (COD)',
        group: 'Thông tin khác'
    },
    {
        key: '{fulfillment_code}',
        label: 'Mã giao hàng',
        group: 'Thông tin khác'
    },
    {
        key: '{packing_note}',
        label: 'Ghi chú đóng gói',
        group: 'Thông tin đóng gói'
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/variables/phieu-giao-hang.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PHIEU_GIAO_HANG_VARIABLES",
    ()=>PHIEU_GIAO_HANG_VARIABLES
]);
const PHIEU_GIAO_HANG_VARIABLES = [
    // Thông tin cửa hàng
    {
        key: '{store_logo}',
        label: 'Logo cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_name}',
        label: 'Tên cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_address}',
        label: 'Địa chỉ cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_phone_number}',
        label: 'SĐT cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_email}',
        label: 'Email cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_province}',
        label: 'Tỉnh thành (cửa hàng)',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{location_name}',
        label: 'Tên chi nhánh',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{location_address}',
        label: 'Địa chỉ chi nhánh',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{location_phone_number}',
        label: 'SĐT chi nhánh',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{location_province}',
        label: 'Tỉnh thành (chi nhánh)',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{print_date}',
        label: 'Ngày in',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{print_time}',
        label: 'Giờ in',
        group: 'Thông tin cửa hàng'
    },
    // Thông tin phiếu giao hàng
    {
        key: '{delivery_code}',
        label: 'Mã phiếu giao hàng',
        group: 'Thông tin phiếu giao hàng'
    },
    {
        key: '{order_code}',
        label: 'Mã đơn hàng',
        group: 'Thông tin phiếu giao hàng'
    },
    {
        key: '{order_qr_code}',
        label: 'Mã đơn hàng dạng QR',
        group: 'Thông tin phiếu giao hàng'
    },
    {
        key: '{order_bar_code}',
        label: 'Mã đơn hàng dạng mã vạch',
        group: 'Thông tin phiếu giao hàng'
    },
    {
        key: '{created_on}',
        label: 'Ngày tạo',
        group: 'Thông tin phiếu giao hàng'
    },
    {
        key: '{created_on_time}',
        label: 'Thời gian tạo',
        group: 'Thông tin phiếu giao hàng'
    },
    {
        key: '{shipped_on}',
        label: 'Ngày giao hàng',
        group: 'Thông tin phiếu giao hàng'
    },
    {
        key: '{shipped_on_time}',
        label: 'Thời gian giao hàng',
        group: 'Thông tin phiếu giao hàng'
    },
    {
        key: '{account_name}',
        label: 'Người tạo phiếu',
        group: 'Thông tin phiếu giao hàng'
    },
    {
        key: '{shipper_name}',
        label: 'Nhân viên giao hàng',
        group: 'Thông tin phiếu giao hàng'
    },
    {
        key: '{delivery_status}',
        label: 'Trạng thái giao hàng',
        group: 'Thông tin phiếu giao hàng'
    },
    {
        key: '{note}',
        label: 'Ghi chú',
        group: 'Thông tin phiếu giao hàng'
    },
    // Thông tin vận chuyển
    {
        key: '{tracking_number}',
        label: 'Mã vận đơn',
        group: 'Thông tin vận chuyển'
    },
    {
        key: '{tracking_number_qr_code}',
        label: 'Mã vận đơn dạng QR',
        group: 'Thông tin vận chuyển'
    },
    {
        key: '{tracking_number_bar_code}',
        label: 'Mã vận đơn dạng mã vạch',
        group: 'Thông tin vận chuyển'
    },
    {
        key: '{shipment_barcode}',
        label: 'Mã vạch vận đơn',
        group: 'Thông tin vận chuyển'
    },
    {
        key: '{shipment_qrcode}',
        label: 'QR code vận đơn',
        group: 'Thông tin vận chuyển'
    },
    {
        key: '{carrier_name}',
        label: 'Đối tác vận chuyển',
        group: 'Thông tin vận chuyển'
    },
    {
        key: '{partner_name}',
        label: 'Tên đối tác',
        group: 'Thông tin vận chuyển'
    },
    {
        key: '{delivery_type}',
        label: 'Phương thức vận chuyển',
        group: 'Thông tin vận chuyển'
    },
    {
        key: '{service_name}',
        label: 'Dịch vụ vận chuyển',
        group: 'Thông tin vận chuyển'
    },
    // Thông tin khách hàng / Người nhận
    {
        key: '{customer_name}',
        label: 'Tên khách hàng',
        group: 'Thông tin người nhận'
    },
    {
        key: '{customer_code}',
        label: 'Mã khách hàng',
        group: 'Thông tin người nhận'
    },
    {
        key: '{customer_phone_number}',
        label: 'SĐT khách hàng',
        group: 'Thông tin người nhận'
    },
    {
        key: '{customer_phone_number_hide}',
        label: 'SĐT khách hàng - ẩn 4 số giữa',
        group: 'Thông tin người nhận'
    },
    {
        key: '{customer_email}',
        label: 'Email khách hàng',
        group: 'Thông tin người nhận'
    },
    {
        key: '{receiver_name}',
        label: 'Tên người nhận',
        group: 'Thông tin người nhận'
    },
    {
        key: '{receiver_phone}',
        label: 'SĐT người nhận',
        group: 'Thông tin người nhận'
    },
    {
        key: '{receiver_phone_hide}',
        label: 'SĐT người nhận - ẩn 4 số giữa',
        group: 'Thông tin người nhận'
    },
    {
        key: '{shipping_address}',
        label: 'Địa chỉ giao hàng',
        group: 'Thông tin người nhận'
    },
    {
        key: '{city}',
        label: 'Tỉnh/Thành phố',
        group: 'Thông tin người nhận'
    },
    {
        key: '{district}',
        label: 'Quận/Huyện',
        group: 'Thông tin người nhận'
    },
    {
        key: '{ward}',
        label: 'Phường/Xã',
        group: 'Thông tin người nhận'
    },
    // Thông tin sản phẩm giao
    {
        key: '{line_stt}',
        label: 'STT',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_variant_code}',
        label: 'Mã phiên bản',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_product_name}',
        label: 'Tên sản phẩm',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_variant}',
        label: 'Tên phiên bản',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_variant_barcode}',
        label: 'Mã Barcode',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_unit}',
        label: 'Đơn vị tính',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_quantity}',
        label: 'Số lượng giao',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_price}',
        label: 'Đơn giá',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_amount}',
        label: 'Thành tiền',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_weight}',
        label: 'Khối lượng',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_note}',
        label: 'Ghi chú sản phẩm',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{serials}',
        label: 'Serial',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{lots_number_code1}',
        label: 'Mã lô',
        group: 'Thông tin sản phẩm'
    },
    // Tổng giá trị
    {
        key: '{total_quantity}',
        label: 'Tổng số lượng giao',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_weight}',
        label: 'Tổng khối lượng',
        group: 'Tổng giá trị'
    },
    {
        key: '{total}',
        label: 'Tổng tiền hàng',
        group: 'Tổng giá trị'
    },
    {
        key: '{delivery_fee}',
        label: 'Phí giao hàng',
        group: 'Tổng giá trị'
    },
    {
        key: '{cod_amount}',
        label: 'Tiền thu hộ (COD)',
        group: 'Tổng giá trị'
    },
    {
        key: '{cod_amount_text}',
        label: 'Tiền thu hộ bằng chữ',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_amount}',
        label: 'Tổng cộng',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_text}',
        label: 'Tổng tiền bằng chữ',
        group: 'Tổng giá trị'
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/variables/phieu-huong-dan-dong-goi.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PHIEU_HUONG_DAN_DONG_GOI_VARIABLES",
    ()=>PHIEU_HUONG_DAN_DONG_GOI_VARIABLES
]);
const PHIEU_HUONG_DAN_DONG_GOI_VARIABLES = [
    // Thông tin cửa hàng
    {
        key: '{store_logo}',
        label: 'Logo cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_address}',
        label: 'Địa chỉ cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_email}',
        label: 'Email cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_name}',
        label: 'Tên cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_phone_number}',
        label: 'SĐT cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{print_date}',
        label: 'Ngày in',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{print_time}',
        label: 'Giờ in',
        group: 'Thông tin cửa hàng'
    },
    // Thông tin phiếu hướng dẫn đóng gói
    {
        key: '{created_on}',
        label: 'Ngày tạo',
        group: 'Thông tin phiếu hướng dẫn đóng gói'
    },
    {
        key: '{list_order_code}',
        label: 'Danh sách đơn hàng áp dụng',
        group: 'Thông tin phiếu hướng dẫn đóng gói'
    },
    {
        key: '{account_phone}',
        label: 'SĐT nhân viên phụ trách',
        group: 'Thông tin phiếu hướng dẫn đóng gói'
    },
    {
        key: '{created_on_time}',
        label: 'Thời gian tạo',
        group: 'Thông tin phiếu hướng dẫn đóng gói'
    },
    {
        key: '{account_name}',
        label: 'Tên nhân viên phụ trách',
        group: 'Thông tin phiếu hướng dẫn đóng gói'
    },
    {
        key: '{account_email}',
        label: 'Email nhân viên phụ trách',
        group: 'Thông tin phiếu hướng dẫn đóng gói'
    },
    // Thông tin giỏ hàng
    {
        key: '{line_stt}',
        label: 'STT',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_variant_sku}',
        label: 'Mã phiên bản sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_variant_barcode}',
        label: 'Mã vạch phiên bản sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_unit}',
        label: 'Đơn vị tính',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{note_of_store}',
        label: 'Ghi chú',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_variant_qrcode}',
        label: 'Mã QR phiên bản sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_brand}',
        label: 'Thương hiệu sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_image}',
        label: 'Ảnh phiên bản sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{location_name}',
        label: 'Chi nhánh',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{composite_details}',
        label: 'Thành phần combo',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_product_name}',
        label: 'Tên sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_variant_name}',
        label: 'Tên phiên bản sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_variant_options}',
        label: 'Thuộc tính sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_quantity}',
        label: 'Số lượng sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{bin_location}',
        label: 'Điểm lưu kho',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_category}',
        label: 'Loại sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_product_description}',
        label: 'Mô tả sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{lineitem_note}',
        label: 'Ghi chú sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    // Tổng giá trị
    {
        key: '{total}',
        label: 'Tổng tiền hàng',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_product_quantity}',
        label: 'Tổng số mặt hàng',
        group: 'Tổng giá trị'
    },
    {
        key: '{order_note}',
        label: 'Ghi chú đơn hàng',
        group: 'Tổng giá trị'
    },
    // === TỰ ĐỘNG THÊM TỪ TEMPLATE ===
    {
        key: '{cod}',
        label: 'Tiền thu hộ (COD)',
        group: 'Thông tin khác'
    },
    {
        key: '{customer_name}',
        label: 'Tên khách hàng',
        group: 'Thông tin khách hàng'
    },
    {
        key: '{customer_phone_number}',
        label: 'SĐT khách hàng',
        group: 'Thông tin khách hàng'
    },
    {
        key: '{line_variant_code}',
        label: 'Mã phiên bản',
        group: 'Chi tiết sản phẩm'
    },
    {
        key: '{line_variant}',
        label: 'Phiên bản sản phẩm',
        group: 'Chi tiết sản phẩm'
    },
    {
        key: '{order_code}',
        label: 'Mã đơn hàng',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{packing_note}',
        label: 'Ghi chú đóng gói',
        group: 'Thông tin đóng gói'
    },
    {
        key: '{shipping_address}',
        label: 'Địa chỉ giao hàng',
        group: 'Thông tin vận chuyển'
    },
    {
        key: '{total_quantity}',
        label: 'Tổng số lượng',
        group: 'Tổng kết'
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/variables/phieu-kiem-hang.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PHIEU_KIEM_HANG_VARIABLES",
    ()=>PHIEU_KIEM_HANG_VARIABLES
]);
const PHIEU_KIEM_HANG_VARIABLES = [
    // Thông tin cửa hàng
    {
        key: '{store_logo}',
        label: 'Logo cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_address}',
        label: 'Địa chỉ cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_email}',
        label: 'Email cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{location_address}',
        label: 'Địa chỉ chi nhánh',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_name}',
        label: 'Tên cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_phone_number}',
        label: 'SĐT cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_province}',
        label: 'Tỉnh thành (cửa hàng)',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{location_name}',
        label: 'Tên chi nhánh',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{location_province}',
        label: 'Tỉnh thành (chi nhánh)',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{print_date}',
        label: 'Ngày in',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{print_time}',
        label: 'Giờ in',
        group: 'Thông tin cửa hàng'
    },
    // Thông tin đơn kiểm
    {
        key: '{code}',
        label: 'Mã code',
        group: 'Thông tin đơn kiểm'
    },
    {
        key: '{modified_on}',
        label: 'Ngày cập nhật',
        group: 'Thông tin đơn kiểm'
    },
    {
        key: '{note}',
        label: 'Ghi chú',
        group: 'Thông tin đơn kiểm'
    },
    {
        key: '{modified_on_time}',
        label: 'Thời gian cập nhật',
        group: 'Thông tin đơn kiểm'
    },
    {
        key: '{adjusted_on_time}',
        label: 'Thời gian kiểm hàng',
        group: 'Thông tin đơn kiểm'
    },
    {
        key: '{created_on}',
        label: 'Ngày tạo',
        group: 'Thông tin đơn kiểm'
    },
    {
        key: '{reason}',
        label: 'Lý do',
        group: 'Thông tin đơn kiểm'
    },
    {
        key: '{adjusted_on}',
        label: 'Ngày kiểm hàng',
        group: 'Thông tin đơn kiểm'
    },
    {
        key: '{created_on_time}',
        label: 'Thời gian tạo',
        group: 'Thông tin đơn kiểm'
    },
    {
        key: '{status}',
        label: 'Trạng thái kiểm hàng',
        group: 'Thông tin đơn kiểm'
    },
    // Thông tin giỏ hàng
    {
        key: '{line_stt}',
        label: 'STT',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_variant_code}',
        label: 'Mã phiên bản sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_after_quantity}',
        label: 'Số lượng sau kiểm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_stock_quantity}',
        label: 'Tồn kho',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_variant_barcode}',
        label: 'Mã Barcode',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_variant_options}',
        label: 'Thuộc tính sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_brand}',
        label: 'Thương hiệu sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_product_name}',
        label: 'Tên sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_variant_name}',
        label: 'Tên phiên bản sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_change_quantity}',
        label: 'Số lượng chênh lệch',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_reason}',
        label: 'Lý do từng mặt hàng',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_category}',
        label: 'Loại sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_unit}',
        label: 'Đơn vị tính',
        group: 'Thông tin giỏ hàng'
    },
    // Tổng giá trị
    {
        key: '{total}',
        label: 'Tổng số lượng',
        group: 'Tổng giá trị'
    },
    // === TỰ ĐỘNG THÊM TỪ TEMPLATE ===
    {
        key: '{account_name}',
        label: 'Người tạo',
        group: 'Thông tin khác'
    },
    {
        key: '{inventory_code}',
        label: 'Mã phiếu kiểm kho',
        group: 'Thông tin kiểm kho'
    },
    {
        key: '{inventory_status}',
        label: 'Trạng thái kiểm kho',
        group: 'Thông tin kiểm kho'
    },
    {
        key: '{line_difference}',
        label: 'Chênh lệch',
        group: 'Chi tiết sản phẩm'
    },
    {
        key: '{line_note}',
        label: 'Ghi chú sản phẩm',
        group: 'Chi tiết sản phẩm'
    },
    {
        key: '{line_on_hand}',
        label: 'Tồn kho hiện tại',
        group: 'Chi tiết sản phẩm'
    },
    {
        key: '{line_real_quantity}',
        label: 'Số lượng thực tế',
        group: 'Chi tiết sản phẩm'
    },
    {
        key: '{line_variant}',
        label: 'Phiên bản sản phẩm',
        group: 'Chi tiết sản phẩm'
    },
    {
        key: '{total_items}',
        label: 'Tổng số mặt hàng',
        group: 'Tổng kết'
    },
    {
        key: '{total_shortage}',
        label: 'Tổng thiếu',
        group: 'Tổng kết'
    },
    {
        key: '{total_surplus}',
        label: 'Tổng thừa',
        group: 'Tổng kết'
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/variables/phieu-nhap-kho.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PHIEU_NHAP_KHO_VARIABLES",
    ()=>PHIEU_NHAP_KHO_VARIABLES
]);
const PHIEU_NHAP_KHO_VARIABLES = [
    // Thông tin cửa hàng
    {
        key: '{store_logo}',
        label: 'Logo cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_address}',
        label: 'Địa chỉ cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_email}',
        label: 'Email cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_fax}',
        label: 'Số Fax',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{location_address}',
        label: 'Địa chỉ chi nhánh',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{account_name}',
        label: 'Tên người tạo',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_name}',
        label: 'Tên cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_phone_number}',
        label: 'SĐT cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_province}',
        label: 'Tỉnh thành (cửa hàng)',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{location_name}',
        label: 'Tên chi nhánh',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{location_province}',
        label: 'Tỉnh thành (chi nhánh)',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{print_date}',
        label: 'Ngày in',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{print_time}',
        label: 'Giờ in',
        group: 'Thông tin cửa hàng'
    },
    // Thông tin đơn hàng
    {
        key: '{purchase_order_code}',
        label: 'Mã đơn nhập hàng',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{modified_on}',
        label: 'Ngày cập nhật',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{received_on_time}',
        label: 'Thời gian nhập kho',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{supplier_name}',
        label: 'Tên NCC',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{supplier_code}',
        label: 'Mã NCC',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{supplier_debt_text}',
        label: 'Nợ NCC bằng chữ',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{supplier_debt_prev_text}',
        label: 'Nợ cũ NCC bằng chữ',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{supplier_phone}',
        label: 'SĐT NCC',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{created_on}',
        label: 'Ngày tạo',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{received_on}',
        label: 'Ngày nhập kho',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{receipt_code}',
        label: 'Mã phiếu nhập kho',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{note}',
        label: 'Ghi chú',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{supplier_debt}',
        label: 'Nợ NCC',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{supplier_debt_prev}',
        label: 'Nợ cũ NCC',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{supplier_email}',
        label: 'Email NCC',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{reference}',
        label: 'Tham chiếu',
        group: 'Thông tin đơn hàng'
    },
    // Thông tin giỏ hàng
    {
        key: '{line_stt}',
        label: 'STT',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_variant_code}',
        label: 'Mã phiên bản sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_unit}',
        label: 'Đơn vị tính',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_discount_rate}',
        label: 'Chiết khấu sản phẩm %',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_variant_barcode}',
        label: 'Mã Barcode',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{bin_location}',
        label: 'Điểm lưu kho',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_quantity}',
        label: 'Số lượng sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_variant_options}',
        label: 'Thuộc tính sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_brand}',
        label: 'Thương hiệu sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_tax_rate}',
        label: 'Thuế (%)',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_product_name}',
        label: 'Tên sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_variant_name}',
        label: 'Tên phiên bản sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_tax}',
        label: 'Loại thuế theo từng mặt hàng',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_discount_amount}',
        label: 'Chiết khấu sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_price}',
        label: 'Giá bán',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_amount}',
        label: 'Thành tiền',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_category}',
        label: 'Loại sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{serials}',
        label: 'Serial',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_tax_amount}',
        label: 'Thuế (giá trị)',
        group: 'Thông tin giỏ hàng'
    },
    // Tổng giá trị
    {
        key: '{total_quantity}',
        label: 'Tổng số lượng',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_tax}',
        label: 'Tổng thuế',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_discounts}',
        label: 'Tổng chiết khấu',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_amount_text}',
        label: 'Tổng tiền bằng chữ',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_price}',
        label: 'Tổng tiền',
        group: 'Tổng giá trị'
    },
    {
        key: '{total}',
        label: 'Tổng tiền hàng',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_landed_costs}',
        label: 'Tổng chi phí',
        group: 'Tổng giá trị'
    },
    // === TỰ ĐỘNG THÊM TỪ TEMPLATE ===
    {
        key: '{discount}',
        label: 'Chiết khấu',
        group: 'Tổng kết'
    },
    {
        key: '{line_ordered_quantity}',
        label: 'Số lượng đặt',
        group: 'Chi tiết sản phẩm'
    },
    {
        key: '{line_received_quantity}',
        label: 'Số lượng nhận',
        group: 'Chi tiết sản phẩm'
    },
    {
        key: '{line_total}',
        label: 'Thành tiền',
        group: 'Chi tiết sản phẩm'
    },
    {
        key: '{line_variant}',
        label: 'Phiên bản sản phẩm',
        group: 'Chi tiết sản phẩm'
    },
    {
        key: '{order_supplier_code}',
        label: 'Mã đơn nhà cung cấp',
        group: 'Thông tin nhà cung cấp'
    },
    {
        key: '{paid}',
        label: 'Đã thanh toán',
        group: 'Thông tin khác'
    },
    {
        key: '{remaining}',
        label: 'Còn lại',
        group: 'Thông tin khác'
    },
    {
        key: '{stock_in_code}',
        label: 'Mã phiếu nhập kho',
        group: 'Thông tin kho'
    },
    {
        key: '{stock_in_status}',
        label: 'Trạng thái nhập kho',
        group: 'Thông tin kho'
    },
    {
        key: '{tax_vat}',
        label: 'Thuế VAT',
        group: 'Thông tin khác'
    },
    {
        key: '{total_order}',
        label: 'Tổng đơn hàng',
        group: 'Tổng kết'
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/variables/phieu-thu.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PHIEU_THU_VARIABLES",
    ()=>PHIEU_THU_VARIABLES
]);
const PHIEU_THU_VARIABLES = [
    // Thông tin cửa hàng
    {
        key: '{store_logo}',
        label: 'Logo cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_address}',
        label: 'Địa chỉ cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_email}',
        label: 'Email cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{location_name}',
        label: 'Tên chi nhánh',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{location_address}',
        label: 'Địa chỉ chi nhánh',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_name}',
        label: 'Tên cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_phone_number}',
        label: 'SĐT cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_province}',
        label: 'Tỉnh thành (cửa hàng)',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{location_province}',
        label: 'Tỉnh thành (chi nhánh)',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{print_date}',
        label: 'Ngày in',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{print_time}',
        label: 'Giờ in',
        group: 'Thông tin cửa hàng'
    },
    // Thông tin
    {
        key: '{receipt_voucher_code}',
        label: 'Mã',
        group: 'Thông tin'
    },
    {
        key: '{object_name}',
        label: 'Tên người nộp',
        group: 'Thông tin'
    },
    {
        key: '{object_phone_number}',
        label: 'SĐT người nộp',
        group: 'Thông tin'
    },
    {
        key: '{total_text}',
        label: 'Số tiền bằng chữ',
        group: 'Thông tin'
    },
    {
        key: '{note}',
        label: 'Ghi chú',
        group: 'Thông tin'
    },
    {
        key: '{account_name}',
        label: 'Người tạo phiếu',
        group: 'Thông tin'
    },
    {
        key: '{group_name}',
        label: 'Loại phiếu thu',
        group: 'Thông tin'
    },
    {
        key: '{created_on}',
        label: 'Ngày tạo',
        group: 'Thông tin'
    },
    {
        key: '{counted}',
        label: 'Hạch toán KQKD',
        group: 'Thông tin'
    },
    {
        key: '{customer_debt_before_create_receipt}',
        label: 'Nợ KH trước khi tạo phiếu',
        group: 'Thông tin'
    },
    {
        key: '{customer_debt_before_create_receipt_text}',
        label: 'Nợ KH trước khi tạo phiếu bằng chữ',
        group: 'Thông tin'
    },
    {
        key: '{customer_debt_after_create_receipt}',
        label: 'Nợ KH sau khi tạo phiếu',
        group: 'Thông tin'
    },
    {
        key: '{customer_debt_after_create_receipt_text}',
        label: 'Nợ KH sau khi tạo phiếu bằng chữ',
        group: 'Thông tin'
    },
    {
        key: '{supplier_debt_before_create_receipt}',
        label: 'Nợ NCC trước khi tạo phiếu',
        group: 'Thông tin'
    },
    {
        key: '{supplier_debt_before_create_receipt_text}',
        label: 'Nợ NCC trước khi tạo phiếu bằng chữ',
        group: 'Thông tin'
    },
    {
        key: '{supplier_debt_after_create_receipt}',
        label: 'Nợ NCC sau khi tạo phiếu',
        group: 'Thông tin'
    },
    {
        key: '{supplier_debt_after_create_receipt_text}',
        label: 'Nợ NCC sau khi tạo phiếu bằng chữ',
        group: 'Thông tin'
    },
    {
        key: '{issued_on}',
        label: 'Ngày ghi nhận',
        group: 'Thông tin'
    },
    {
        key: '{object_address}',
        label: 'Địa chỉ người nộp',
        group: 'Thông tin'
    },
    {
        key: '{amount}',
        label: 'Số tiền',
        group: 'Thông tin'
    },
    {
        key: '{reference}',
        label: 'Tham chiếu',
        group: 'Thông tin'
    },
    {
        key: '{issued_on_time}',
        label: 'Thời gian ghi nhận',
        group: 'Thông tin'
    },
    {
        key: '{payment_method_name}',
        label: 'Phương thức thanh toán',
        group: 'Thông tin'
    },
    {
        key: '{object_type}',
        label: 'Loại người nộp',
        group: 'Thông tin'
    },
    {
        key: '{document_root_code}',
        label: 'Chứng từ gốc',
        group: 'Thông tin'
    },
    {
        key: '{supplier_debt}',
        label: 'Nợ nhà cung cấp hiện tại',
        group: 'Thông tin'
    },
    {
        key: '{supplier_debt_text}',
        label: 'Nợ nhà cung cấp hiện tại bằng chữ',
        group: 'Thông tin'
    },
    {
        key: '{supplier_debt_prev}',
        label: 'Nợ cũ nhà cung cấp',
        group: 'Thông tin'
    },
    {
        key: '{supplier_debt_prev_text}',
        label: 'Nợ cũ nhà cung cấp bằng chữ',
        group: 'Thông tin'
    },
    {
        key: '{customer_debt}',
        label: 'Nợ khách hàng hiện tại',
        group: 'Thông tin'
    },
    {
        key: '{customer_debt_text}',
        label: 'Nợ khách hàng hiện tại bằng chữ',
        group: 'Thông tin'
    },
    {
        key: '{customer_debt_prev}',
        label: 'Nợ cũ khách hàng',
        group: 'Thông tin'
    },
    {
        key: '{customer_debt_prev_text}',
        label: 'Nợ cũ khách hàng bằng chữ',
        group: 'Thông tin'
    },
    // === TỰ ĐỘNG THÊM TỪ TEMPLATE ===
    {
        key: '{amount_text}',
        label: 'Số tiền bằng chữ',
        group: 'Tổng kết'
    },
    {
        key: '{description}',
        label: 'Diễn giải',
        group: 'Thông tin khác'
    },
    {
        key: '{payment_method}',
        label: 'Phương thức thanh toán',
        group: 'Thông tin thanh toán'
    },
    {
        key: '{receipt_barcode}',
        label: 'Mã vạch phiếu thu',
        group: 'Thông tin khác'
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/variables/phieu-tong-ket-ban-hang.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PHIEU_TONG_KET_BAN_HANG_VARIABLES",
    ()=>PHIEU_TONG_KET_BAN_HANG_VARIABLES
]);
const PHIEU_TONG_KET_BAN_HANG_VARIABLES = [
    // Thông tin
    {
        key: '{store_logo}',
        label: 'Logo cửa hàng',
        group: 'Thông tin'
    },
    {
        key: '{location_name}',
        label: 'Tên chi nhánh',
        group: 'Thông tin'
    },
    {
        key: '{account_name}',
        label: 'Tên nhân viên',
        group: 'Thông tin'
    },
    {
        key: '{store_name}',
        label: 'Tên cửa hàng',
        group: 'Thông tin'
    },
    {
        key: '{store_address}',
        label: 'Địa chỉ cửa hàng',
        group: 'Thông tin'
    },
    {
        key: '{store_phone_number}',
        label: 'Số ĐT cửa hàng',
        group: 'Thông tin'
    },
    {
        key: '{store_email}',
        label: 'Email cửa hàng',
        group: 'Thông tin'
    },
    {
        key: '{date_print}',
        label: 'Ngày in',
        group: 'Thông tin'
    },
    {
        key: '{time_print}',
        label: 'Thời gian in',
        group: 'Thông tin'
    },
    {
        key: '{print_date}',
        label: 'Ngày in (chuẩn)',
        group: 'Thông tin'
    },
    {
        key: '{print_time}',
        label: 'Giờ in (chuẩn)',
        group: 'Thông tin'
    },
    {
        key: '{time_filter}',
        label: 'Ngày lọc',
        group: 'Thông tin'
    },
    {
        key: '{source_name}',
        label: 'Nguồn bán hàng',
        group: 'Thông tin'
    },
    {
        key: '{total_quantity_order_finished}',
        label: 'Số đơn hàng bán ra',
        group: 'Thông tin'
    },
    {
        key: '{total_quantity_line_item_fulfillment}',
        label: 'Số lượng hàng bán ra',
        group: 'Thông tin'
    },
    {
        key: '{total_quantity_line_item_return}',
        label: 'Số lượng hàng trả lại',
        group: 'Thông tin'
    },
    {
        key: '{total_line_amount}',
        label: 'Doanh thu',
        group: 'Thông tin'
    },
    {
        key: '{total_order_payment}',
        label: 'Khách thanh toán',
        group: 'Thông tin'
    },
    {
        key: '{total_order_return_payment}',
        label: 'Hoàn lại khách',
        group: 'Thông tin'
    },
    {
        key: '{total_real_receipt}',
        label: 'Thực thu',
        group: 'Thông tin'
    },
    {
        key: '{real_receipt_cash}',
        label: 'Thực thu tiền mặt',
        group: 'Thông tin'
    },
    {
        key: '{real_receipt_transfer}',
        label: 'Thực thu chuyển khoản',
        group: 'Thông tin'
    },
    {
        key: '{real_receipt_mpos}',
        label: 'Thực thu quẹt thẻ',
        group: 'Thông tin'
    },
    {
        key: '{real_receipt_cod}',
        label: 'Thực thu COD',
        group: 'Thông tin'
    },
    {
        key: '{real_receipt_online}',
        label: 'Thực thu online',
        group: 'Thông tin'
    },
    {
        key: '{debt}',
        label: 'Nợ còn lại phải thu',
        group: 'Thông tin'
    },
    {
        key: '{receipt_in_day}',
        label: 'Tổng thu',
        group: 'Thông tin'
    },
    {
        key: '{receipt_cash}',
        label: 'Tổng thu tiền mặt',
        group: 'Thông tin'
    },
    {
        key: '{receipt_transfer}',
        label: 'Tổng thu chuyển khoản',
        group: 'Thông tin'
    },
    {
        key: '{receipt_mpos}',
        label: 'Tổng thu quẹt thẻ',
        group: 'Thông tin'
    },
    {
        key: '{receipt_cod}',
        label: 'Tổng thu COD',
        group: 'Thông tin'
    },
    {
        key: '{receipt_online}',
        label: 'Tổng thu online',
        group: 'Thông tin'
    },
    {
        key: '{payment_in_day}',
        label: 'Tổng chi',
        group: 'Thông tin'
    },
    {
        key: '{payment_cash}',
        label: 'Tổng chi tiền mặt',
        group: 'Thông tin'
    },
    {
        key: '{payment_transfer}',
        label: 'Tổng chi chuyển khoản',
        group: 'Thông tin'
    },
    {
        key: '{payment_mpos}',
        label: 'Tổng chi quẹt thẻ',
        group: 'Thông tin'
    },
    {
        key: '{stt_order_finish}',
        label: 'STT đơn hàng bán',
        group: 'Thông tin'
    },
    {
        key: '{order_code}',
        label: 'Mã đơn',
        group: 'Thông tin'
    },
    {
        key: '{amount_order_finished}',
        label: 'Tiền hàng',
        group: 'Thông tin'
    },
    {
        key: '{discount_order_finished}',
        label: 'Chiết khấu',
        group: 'Thông tin'
    },
    {
        key: '{tax_order_finished}',
        label: 'Thuế',
        group: 'Thông tin'
    },
    {
        key: '{total_order_finished}',
        label: 'Doanh thu',
        group: 'Thông tin'
    },
    {
        key: '{stt_item_fulfillment}',
        label: 'STT đơn hàng bán',
        group: 'Thông tin'
    },
    {
        key: '{sku_fulfillment}',
        label: 'Mã SKU hàng bán',
        group: 'Thông tin'
    },
    {
        key: '{variant_name_fulfillment}',
        label: 'Tên hàng bán',
        group: 'Thông tin'
    },
    {
        key: '{quantity_item_fulfilment}',
        label: 'SL hàng bán',
        group: 'Thông tin'
    },
    {
        key: '{amount_item_fulfilment}',
        label: 'Giá trị hàng bán',
        group: 'Thông tin'
    },
    {
        key: '{stt_item_return}',
        label: 'STT hàng trả lại',
        group: 'Thông tin'
    },
    {
        key: '{sku_return}',
        label: 'Mã SKU hàng trả',
        group: 'Thông tin'
    },
    {
        key: '{variant_name_return}',
        label: 'Tên hàng trả',
        group: 'Thông tin'
    },
    {
        key: '{quantity_item_return}',
        label: 'SL hàng trả',
        group: 'Thông tin'
    },
    {
        key: '{amount_item_return}',
        label: 'Giá trị hàng trả',
        group: 'Thông tin'
    },
    {
        key: '{payment_method_name}',
        label: 'Tên hình thức thanh toán',
        group: 'Thông tin'
    },
    {
        key: '{payment_method_amount}',
        label: 'Giá trị thanh toán theo hình thức',
        group: 'Thông tin'
    },
    // === TỰ ĐỘNG THÊM TỪ TEMPLATE ===
    {
        key: '{bank_transfer_amount}',
        label: 'Tiền chuyển khoản',
        group: 'Tổng kết'
    },
    {
        key: '{card_amount}',
        label: 'Tiền thẻ',
        group: 'Tổng kết'
    },
    {
        key: '{cash_amount}',
        label: 'Tiền mặt',
        group: 'Tổng kết'
    },
    {
        key: '{cod_amount}',
        label: 'Tiền COD',
        group: 'Tổng kết'
    },
    {
        key: '{created_on}',
        label: 'Ngày tạo',
        group: 'Thông tin khác'
    },
    {
        key: '{delivery_revenue}',
        label: 'Doanh thu giao hàng',
        group: 'Thông tin khác'
    },
    {
        key: '{ewallet_amount}',
        label: 'Tiền ví điện tử',
        group: 'Tổng kết'
    },
    {
        key: '{from_date}',
        label: 'Từ ngày',
        group: 'Thông tin khác'
    },
    {
        key: '{line_amount}',
        label: 'Thành tiền',
        group: 'Chi tiết sản phẩm'
    },
    {
        key: '{line_product_name}',
        label: 'Tên sản phẩm',
        group: 'Chi tiết sản phẩm'
    },
    {
        key: '{line_quantity}',
        label: 'Số lượng',
        group: 'Chi tiết sản phẩm'
    },
    {
        key: '{line_stt}',
        label: 'STT',
        group: 'Chi tiết sản phẩm'
    },
    {
        key: '{note}',
        label: 'Ghi chú',
        group: 'Thông tin khác'
    },
    {
        key: '{period}',
        label: 'Kỳ báo cáo',
        group: 'Thông tin khác'
    },
    {
        key: '{sales_revenue}',
        label: 'Doanh thu bán hàng',
        group: 'Thông tin khác'
    },
    {
        key: '{to_date}',
        label: 'Đến ngày',
        group: 'Thông tin khác'
    },
    {
        key: '{total_collected}',
        label: 'Tổng thu',
        group: 'Tổng kết'
    },
    {
        key: '{total_discount}',
        label: 'Tổng chiết khấu',
        group: 'Tổng kết'
    },
    {
        key: '{total_orders}',
        label: 'Tổng số đơn',
        group: 'Tổng kết'
    },
    {
        key: '{total_returns}',
        label: 'Tổng trả hàng',
        group: 'Tổng kết'
    },
    {
        key: '{total_revenue}',
        label: 'Tổng doanh thu',
        group: 'Tổng kết'
    },
    {
        key: '{total_tax}',
        label: 'Tổng thuế',
        group: 'Tổng kết'
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/variables/phieu-tra-hang-ncc.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PHIEU_TRA_HANG_NCC_VARIABLES",
    ()=>PHIEU_TRA_HANG_NCC_VARIABLES
]);
const PHIEU_TRA_HANG_NCC_VARIABLES = [
    // Thông tin cửa hàng
    {
        key: '{store_logo}',
        label: 'Logo cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_address}',
        label: 'Địa chỉ cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_email}',
        label: 'Email cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{location_name}',
        label: 'Tên chi nhánh',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{location_address}',
        label: 'Địa chỉ chi nhánh',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_name}',
        label: 'Tên cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_phone_number}',
        label: 'SĐT cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_province}',
        label: 'Tỉnh thành (cửa hàng)',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{location_province}',
        label: 'Tỉnh thành (chi nhánh)',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{print_date}',
        label: 'Ngày in',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{print_time}',
        label: 'Giờ in',
        group: 'Thông tin cửa hàng'
    },
    // Thông tin hoàn trả
    {
        key: '{supplier_name}',
        label: 'Tên nhà cung cấp',
        group: 'Thông tin hoàn trả'
    },
    {
        key: '{supplier_code}',
        label: 'Mã nhà cung cấp',
        group: 'Thông tin hoàn trả'
    },
    {
        key: '{supplier_address1}',
        label: 'Địa chỉ nhà cung cấp',
        group: 'Thông tin hoàn trả'
    },
    {
        key: '{account_name}',
        label: 'Tên nhân viên tạo',
        group: 'Thông tin hoàn trả'
    },
    {
        key: '{created_on}',
        label: 'Ngày tạo',
        group: 'Thông tin hoàn trả'
    },
    {
        key: '{note}',
        label: 'Lý do hoàn trả',
        group: 'Thông tin hoàn trả'
    },
    {
        key: '{supplier_phone_number}',
        label: 'SĐT nhà cung cấp',
        group: 'Thông tin hoàn trả'
    },
    {
        key: '{purchase_order_code}',
        label: 'Mã đơn nhập hàng',
        group: 'Thông tin hoàn trả'
    },
    {
        key: '{refund_code}',
        label: 'Mã phiếu hoàn trả',
        group: 'Thông tin hoàn trả'
    },
    {
        key: '{modified_on}',
        label: 'Ngày cập nhật',
        group: 'Thông tin hoàn trả'
    },
    {
        key: '{reference}',
        label: 'Tham chiếu',
        group: 'Thông tin hoàn trả'
    },
    // Thông tin giỏ hàng
    {
        key: '{line_stt}',
        label: 'STT',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_variant_sku}',
        label: 'Mã SKU',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_unit}',
        label: 'Đơn vị tính',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_quantity}',
        label: 'Số lượng sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_price}',
        label: 'Giá bán',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_discount_rate}',
        label: 'Chiết khấu sản phẩm %',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_price_after_discount}',
        label: 'Giá sau chiết khấu trên 1 sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{tax_lines_rate}',
        label: 'Mức thuế sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{lots_number_code2}',
        label: 'Mã lô - Số lượng trả',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{lots_number_code4}',
        label: 'Mã lô - NSX - NHH - Số lượng trả',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_product_name}',
        label: 'Tên hàng',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_variant_name}',
        label: 'Tên phiên bản',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_variant_barcode}',
        label: 'Mã Barcode',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_amount}',
        label: 'Thành tiền',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{serials}',
        label: 'Serial',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_discount_amount}',
        label: 'Chiết khấu sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_amount_none_discount}',
        label: 'Tiền hàng (Giá * SL)',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{lots_number_code1}',
        label: 'Mã lô sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{lots_number_code3}',
        label: 'Mã lô - NSX - NHH sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    // Tổng giá trị
    {
        key: '{total_quantity}',
        label: 'Tổng số lượng',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_amount}',
        label: 'Giá trị hàng trả',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_tax}',
        label: 'Tổng thuế',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_landed_costs}',
        label: 'Chi phí hoàn lại',
        group: 'Tổng giá trị'
    },
    {
        key: '{transaction_refund_method_name}',
        label: 'Tên PTTT',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_discounts}',
        label: 'Chiết khấu đơn',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_price}',
        label: 'Tổng giá trị hàng trả',
        group: 'Tổng giá trị'
    },
    {
        key: '{discrepancy_price}',
        label: 'Tổng giá trị hàng trả điều chỉnh',
        group: 'Tổng giá trị'
    },
    {
        key: '{discrepancy_reason}',
        label: 'Lý do giảm trừ',
        group: 'Tổng giá trị'
    },
    {
        key: '{transaction_refund_amount}',
        label: 'Tổng tiền NCC hoàn lại',
        group: 'Tổng giá trị'
    },
    {
        key: '{transaction_refund_method_amount}',
        label: 'Giá trị PTTT',
        group: 'Tổng giá trị'
    },
    // === TỰ ĐỘNG THÊM TỪ TEMPLATE ===
    {
        key: '{line_total}',
        label: 'Thành tiền',
        group: 'Chi tiết sản phẩm'
    },
    {
        key: '{line_variant_code}',
        label: 'Mã phiên bản',
        group: 'Chi tiết sản phẩm'
    },
    {
        key: '{line_variant}',
        label: 'Phiên bản sản phẩm',
        group: 'Chi tiết sản phẩm'
    },
    {
        key: '{reason_return}',
        label: 'Lý do trả hàng',
        group: 'Thông tin trả hàng'
    },
    {
        key: '{refunded}',
        label: 'Đã hoàn tiền',
        group: 'Thông tin hoàn tiền'
    },
    {
        key: '{remaining}',
        label: 'Còn lại',
        group: 'Thông tin khác'
    },
    {
        key: '{return_supplier_code}',
        label: 'Mã phiếu trả NCC',
        group: 'Thông tin nhà cung cấp'
    },
    {
        key: '{supplier_address}',
        label: 'Địa chỉ NCC',
        group: 'Thông tin nhà cung cấp'
    },
    {
        key: '{supplier_email}',
        label: 'Email NCC',
        group: 'Thông tin nhà cung cấp'
    },
    {
        key: '{total_order}',
        label: 'Tổng đơn hàng',
        group: 'Tổng kết'
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/variables/phieu-xac-nhan-hoan.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PHIEU_XAC_NHAN_HOAN_VARIABLES",
    ()=>PHIEU_XAC_NHAN_HOAN_VARIABLES
]);
const PHIEU_XAC_NHAN_HOAN_VARIABLES = [
    // Thông tin cửa hàng
    {
        key: '{store_logo}',
        label: 'Logo cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_name}',
        label: 'Tên cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_address}',
        label: 'Địa chỉ cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{location_name}',
        label: 'Tên chi nhánh',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{location_address}',
        label: 'Địa chỉ chi nhánh',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_phone_number}',
        label: 'SĐT cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{print_date}',
        label: 'Ngày in',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{print_time}',
        label: 'Giờ in',
        group: 'Thông tin cửa hàng'
    },
    // Thông tin
    {
        key: '{hand_over_code}',
        label: 'Mã phiếu',
        group: 'Thông tin'
    },
    {
        key: '{shipping_provider_name}',
        label: 'Đối tác giao hàng',
        group: 'Thông tin'
    },
    {
        key: '{service_name}',
        label: 'Dịch vụ',
        group: 'Thông tin'
    },
    {
        key: '{total_cod}',
        label: 'Tổng tiền thu hộ',
        group: 'Thông tin'
    },
    {
        key: '{order_code}',
        label: 'Mã đơn hàng',
        group: 'Thông tin'
    },
    {
        key: '{shipping_name}',
        label: 'Tên người nhận đơn',
        group: 'Thông tin'
    },
    {
        key: '{shipping_phone}',
        label: 'Số điện thoại người nhận',
        group: 'Thông tin'
    },
    {
        key: '{shipping_phone_hide}',
        label: 'Số điện thoại người nhận - ẩn 4 số giữa',
        group: 'Thông tin'
    },
    {
        key: '{printed_on}',
        label: 'Ngày in phiếu',
        group: 'Thông tin'
    },
    {
        key: '{district}',
        label: 'Quận/Huyện giao đến',
        group: 'Thông tin'
    },
    {
        key: '{quantity}',
        label: 'Số lượng đơn',
        group: 'Thông tin'
    },
    {
        key: '{current_account_name}',
        label: 'Tên nhân viên',
        group: 'Thông tin'
    },
    {
        key: '{shipment_code}',
        label: 'Mã vận đơn',
        group: 'Thông tin'
    },
    {
        key: '{shipping_address}',
        label: 'Địa chỉ giao hàng',
        group: 'Thông tin'
    },
    {
        key: '{cod}',
        label: 'Tiền thu hộ',
        group: 'Thông tin'
    },
    {
        key: '{note}',
        label: 'Ghi chú',
        group: 'Thông tin'
    },
    {
        key: '{city}',
        label: 'Tỉnh/Thành phố giao',
        group: 'Thông tin'
    },
    // === TỰ ĐỘNG THÊM TỪ TEMPLATE ===
    {
        key: '{account_name}',
        label: 'Người tạo',
        group: 'Thông tin khác'
    },
    {
        key: '{bank_account_name}',
        label: 'Tên tài khoản ngân hàng',
        group: 'Thông tin thanh toán'
    },
    {
        key: '{bank_account}',
        label: 'Số tài khoản',
        group: 'Thông tin thanh toán'
    },
    {
        key: '{bank_branch}',
        label: 'Chi nhánh ngân hàng',
        group: 'Thông tin thanh toán'
    },
    {
        key: '{bank_name}',
        label: 'Tên ngân hàng',
        group: 'Thông tin thanh toán'
    },
    {
        key: '{created_on_time}',
        label: 'Giờ tạo',
        group: 'Thông tin khác'
    },
    {
        key: '{created_on}',
        label: 'Ngày tạo',
        group: 'Thông tin khác'
    },
    {
        key: '{customer_name}',
        label: 'Tên khách hàng',
        group: 'Thông tin khách hàng'
    },
    {
        key: '{customer_phone_number}',
        label: 'SĐT khách hàng',
        group: 'Thông tin khách hàng'
    },
    {
        key: '{order_date}',
        label: 'Ngày đặt hàng',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{refund_amount_text}',
        label: 'Số tiền hoàn bằng chữ',
        group: 'Tổng kết'
    },
    {
        key: '{refund_amount}',
        label: 'Số tiền hoàn',
        group: 'Tổng kết'
    },
    {
        key: '{refund_code}',
        label: 'Mã phiếu hoàn',
        group: 'Thông tin hoàn tiền'
    },
    {
        key: '{refund_method}',
        label: 'Phương thức hoàn tiền',
        group: 'Thông tin hoàn tiền'
    },
    {
        key: '{refund_reason}',
        label: 'Lý do hoàn tiền',
        group: 'Thông tin hoàn tiền'
    },
    {
        key: '{refund_status}',
        label: 'Trạng thái hoàn tiền',
        group: 'Thông tin hoàn tiền'
    },
    {
        key: '{refunded_on}',
        label: 'Ngày hoàn tiền',
        group: 'Thông tin hoàn tiền'
    },
    {
        key: '{return_code}',
        label: 'Mã đơn trả hàng',
        group: 'Thông tin trả hàng'
    },
    {
        key: '{return_date}',
        label: 'Ngày trả hàng',
        group: 'Thông tin trả hàng'
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/variables/phieu-yeu-cau-bao-hanh.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PHIEU_YEU_CAU_BAO_HANH_VARIABLES",
    ()=>PHIEU_YEU_CAU_BAO_HANH_VARIABLES
]);
const PHIEU_YEU_CAU_BAO_HANH_VARIABLES = [
    // Thông tin cửa hàng
    {
        key: '{store_logo}',
        label: 'Logo cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_name}',
        label: 'Tên cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_phone_number}',
        label: 'SĐT cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_address}',
        label: 'Địa chỉ cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_email}',
        label: 'Email cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{location_name}',
        label: 'Tên chi nhánh',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{location_address}',
        label: 'Địa chỉ chi nhánh',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_province}',
        label: 'Tỉnh thành (cửa hàng)',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{location_province}',
        label: 'Tỉnh thành (chi nhánh)',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{print_date}',
        label: 'Ngày in',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{print_time}',
        label: 'Giờ in',
        group: 'Thông tin cửa hàng'
    },
    // Thông tin phiếu yêu cầu
    {
        key: '{account_name}',
        label: 'Tên nhân viên tạo',
        group: 'Thông tin phiếu yêu cầu'
    },
    {
        key: '{warranty_claim_card_code}',
        label: 'Mã phiếu yêu cầu bảo hành',
        group: 'Thông tin phiếu yêu cầu'
    },
    {
        key: '{modified_on}',
        label: 'Ngày cập nhật',
        group: 'Thông tin phiếu yêu cầu'
    },
    {
        key: '{created_on}',
        label: 'Ngày tạo',
        group: 'Thông tin phiếu yêu cầu'
    },
    {
        key: '{reference}',
        label: 'Ghi chú',
        group: 'Thông tin phiếu yêu cầu'
    },
    {
        key: '{customer_name}',
        label: 'Tên khách hàng',
        group: 'Thông tin phiếu yêu cầu'
    },
    {
        key: '{customer_phone_number}',
        label: 'SĐT khách hàng',
        group: 'Thông tin phiếu yêu cầu'
    },
    {
        key: '{customer_address1}',
        label: 'Địa chỉ khách hàng',
        group: 'Thông tin phiếu yêu cầu'
    },
    {
        key: '{customer_group}',
        label: 'Nhóm khách hàng',
        group: 'Thông tin phiếu yêu cầu'
    },
    {
        key: '{tag}',
        label: 'Thẻ tag',
        group: 'Thông tin phiếu yêu cầu'
    },
    // Thông tin sản phẩm
    {
        key: '{line_stt}',
        label: 'STT',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_product_name}',
        label: 'Tên sản phẩm',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_variant_name}',
        label: 'Tên phiên bản sản phẩm',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_variant_sku}',
        label: 'Mã SKU',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_variant_barcode}',
        label: 'Mã Barcode',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{serials}',
        label: 'Mã serial',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{warranty_card_code}',
        label: 'Mã phiếu bảo hành',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_quantity}',
        label: 'Số lượng sản phẩm',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_type}',
        label: 'Loại yêu cầu',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_received_on}',
        label: 'Ngày hẹn trả',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_status}',
        label: 'Trạng thái',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_expense_title}',
        label: 'Tên chi phí/ dịch vụ',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_expense_amount}',
        label: 'Giá trị chi phí/ dịch vụ',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{line_expense_total_amount}',
        label: 'Tổng chi phí trên sản phẩm',
        group: 'Thông tin sản phẩm'
    },
    // Tổng giá trị
    {
        key: '{total_quantity}',
        label: 'Tổng số lượng',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_amount}',
        label: 'Tổng tiền khách trả',
        group: 'Tổng giá trị'
    },
    // === TỰ ĐỘNG THÊM TỪ TEMPLATE ===
    {
        key: '{accessories}',
        label: 'Phụ kiện kèm theo',
        group: 'Thông tin khác'
    },
    {
        key: '{created_on_time}',
        label: 'Giờ tạo',
        group: 'Thông tin khác'
    },
    {
        key: '{customer_address}',
        label: 'Địa chỉ khách hàng',
        group: 'Thông tin khách hàng'
    },
    {
        key: '{customer_code}',
        label: 'Mã khách hàng',
        group: 'Thông tin khách hàng'
    },
    {
        key: '{customer_email}',
        label: 'Email khách hàng',
        group: 'Thông tin khách hàng'
    },
    {
        key: '{device_condition}',
        label: 'Tình trạng thiết bị',
        group: 'Thông tin khác'
    },
    {
        key: '{expected_completion_date}',
        label: 'Ngày dự kiến hoàn thành',
        group: 'Thông tin khác'
    },
    {
        key: '{issue_description}',
        label: 'Mô tả sự cố',
        group: 'Thông tin khác'
    },
    {
        key: '{issue_type}',
        label: 'Loại sự cố',
        group: 'Thông tin khác'
    },
    {
        key: '{note}',
        label: 'Ghi chú',
        group: 'Thông tin khác'
    },
    {
        key: '{order_code}',
        label: 'Mã đơn hàng',
        group: 'Thông tin đơn hàng'
    },
    {
        key: '{priority}',
        label: 'Độ ưu tiên',
        group: 'Thông tin khác'
    },
    {
        key: '{product_code}',
        label: 'Mã sản phẩm',
        group: 'Thông tin khác'
    },
    {
        key: '{product_name}',
        label: 'Tên sản phẩm',
        group: 'Thông tin khác'
    },
    {
        key: '{purchase_date}',
        label: 'Ngày mua',
        group: 'Thông tin khác'
    },
    {
        key: '{received_by}',
        label: 'Người tiếp nhận',
        group: 'Thông tin khác'
    },
    {
        key: '{serial_number}',
        label: 'Số serial',
        group: 'Thông tin khác'
    },
    {
        key: '{status}',
        label: 'Trạng thái',
        group: 'Thông tin khác'
    },
    {
        key: '{technician_name}',
        label: 'Kỹ thuật viên',
        group: 'Thông tin khác'
    },
    {
        key: '{warranty_duration}',
        label: 'Thời hạn bảo hành',
        group: 'Thông tin bảo hành'
    },
    {
        key: '{warranty_expired_on}',
        label: 'Ngày hết bảo hành',
        group: 'Thông tin bảo hành'
    },
    {
        key: '{warranty_request_code}',
        label: 'Mã yêu cầu bảo hành',
        group: 'Thông tin bảo hành'
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/variables/phieu-yeu-cau-dong-goi.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PHIEU_YEU_CAU_DONG_GOI_VARIABLES",
    ()=>PHIEU_YEU_CAU_DONG_GOI_VARIABLES
]);
const PHIEU_YEU_CAU_DONG_GOI_VARIABLES = [
    // Thông tin cửa hàng
    {
        key: '{store_logo}',
        label: 'Logo cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_address}',
        label: 'Địa chỉ cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_email}',
        label: 'Email cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_fax}',
        label: 'Số Fax',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{location_address}',
        label: 'Địa chỉ chi nhánh',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_name}',
        label: 'Tên cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_phone_number}',
        label: 'SĐT cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_province}',
        label: 'Tỉnh thành (cửa hàng)',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{location_name}',
        label: 'Tên chi nhánh',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{location_province}',
        label: 'Tỉnh thành (chi nhánh)',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{print_date}',
        label: 'Ngày in',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{print_time}',
        label: 'Giờ in',
        group: 'Thông tin cửa hàng'
    },
    // Thông tin đóng gói
    {
        key: '{code}',
        label: 'Mã đóng gói',
        group: 'Thông tin đóng gói'
    },
    {
        key: '{account_name}',
        label: 'Nhân viên yêu đóng gói',
        group: 'Thông tin đóng gói'
    },
    {
        key: '{packed_processing_account_name}',
        label: 'Nhân viên xác nhận đóng gói',
        group: 'Thông tin đóng gói'
    },
    {
        key: '{cancel_account_name}',
        label: 'Nhân viên hủy đóng gói',
        group: 'Thông tin đóng gói'
    },
    {
        key: '{assignee_name}',
        label: 'Nhân viên được gán cho đóng gói',
        group: 'Thông tin đóng gói'
    },
    {
        key: '{shipping_address}',
        label: 'Địa chỉ giao hàng',
        group: 'Thông tin đóng gói'
    },
    {
        key: '{customer_name}',
        label: 'Tên khách hàng',
        group: 'Thông tin đóng gói'
    },
    {
        key: '{customer_phone_number}',
        label: 'SĐT khách hàng',
        group: 'Thông tin đóng gói'
    },
    {
        key: '{customer_phone_number_hide}',
        label: 'SĐT khách hàng - ẩn 4 số giữa',
        group: 'Thông tin đóng gói'
    },
    {
        key: '{customer_email}',
        label: 'Email khách hàng',
        group: 'Thông tin đóng gói'
    },
    {
        key: '{status}',
        label: 'Trạng thái đóng gói',
        group: 'Thông tin đóng gói'
    },
    {
        key: '{bar_code(code)}',
        label: 'Mã đóng gói dạng mã vạch',
        group: 'Thông tin đóng gói'
    },
    {
        key: '{created_on}',
        label: 'Ngày tạo đóng gói',
        group: 'Thông tin đóng gói'
    },
    {
        key: '{created_on_time}',
        label: 'Thời gian tạo đóng gói',
        group: 'Thông tin đóng gói'
    },
    {
        key: '{packed_on}',
        label: 'Ngày xác nhận đóng gói',
        group: 'Thông tin đóng gói'
    },
    {
        key: '{packed_on_time}',
        label: 'Thời gian xác nhận đóng gói',
        group: 'Thông tin đóng gói'
    },
    {
        key: '{cancel_date}',
        label: 'Ngày hủy đóng gói',
        group: 'Thông tin đóng gói'
    },
    {
        key: '{ship_on_min}',
        label: 'Ngày hẹn giao hàng từ',
        group: 'Thông tin đóng gói'
    },
    {
        key: '{ship_on_max}',
        label: 'Ngày hẹn giao hàng đến',
        group: 'Thông tin đóng gói'
    },
    {
        key: '{order_code}',
        label: 'Mã đơn hàng',
        group: 'Thông tin đóng gói'
    },
    {
        key: '{bar_code(order_code)}',
        label: 'Mã đơn hàng dạng mã vạch',
        group: 'Thông tin đóng gói'
    },
    {
        key: '{order_note}',
        label: 'Ghi chú đơn hàng',
        group: 'Thông tin đóng gói'
    },
    // Thông tin giỏ hàng
    {
        key: '{line_stt}',
        label: 'STT',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_unit}',
        label: 'Đơn vị tính',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_discount_rate}',
        label: 'Chiết khấu sản phẩm %',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_note}',
        label: 'Ghi chú sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_quantity}',
        label: 'Số lượng sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_tax_rate}',
        label: '% Thuế',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_variant}',
        label: 'Tên phiên bản sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{lots_number_code2}',
        label: 'Mã lô - Số lượng bán sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{lots_number_code4}',
        label: 'Mã lô - NSX -NHH - Số lượng bán sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_product_name}',
        label: 'Tên sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_tax}',
        label: 'Loại thuế theo từng mặt hàng',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_discount_amount}',
        label: 'Chiết khấu sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_price}',
        label: 'Giá bán',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_amount}',
        label: 'Thành tiền',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{line_variant_code}',
        label: 'Mã sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{lots_number_code1}',
        label: 'Mã lô sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    {
        key: '{lots_number_code3}',
        label: 'Mã lô - NSX - NHH sản phẩm',
        group: 'Thông tin giỏ hàng'
    },
    // Tổng giá trị
    {
        key: '{total_quantity}',
        label: 'Tổng số lượng',
        group: 'Tổng giá trị'
    },
    {
        key: '{total_tax}',
        label: 'Tổng thuế',
        group: 'Tổng giá trị'
    },
    {
        key: '{fulfillment_discount}',
        label: 'Chiết khấu',
        group: 'Tổng giá trị'
    },
    {
        key: '{total}',
        label: 'Tổng tiền hàng',
        group: 'Tổng giá trị'
    },
    // === TỰ ĐỘNG THÊM TỪ TEMPLATE ===
    {
        key: '{assigned_employee}',
        label: 'Nhân viên được gán',
        group: 'Thông tin khác'
    },
    {
        key: '{bin_location}',
        label: 'Vị trí kho',
        group: 'Thông tin khác'
    },
    {
        key: '{carrier_name}',
        label: 'Tên đơn vị vận chuyển',
        group: 'Thông tin khác'
    },
    {
        key: '{cod}',
        label: 'Tiền thu hộ (COD)',
        group: 'Thông tin khác'
    },
    {
        key: '{deadline}',
        label: 'Hạn hoàn thành',
        group: 'Thông tin khác'
    },
    {
        key: '{packing_note}',
        label: 'Ghi chú đóng gói',
        group: 'Thông tin đóng gói'
    },
    {
        key: '{packing_request_code}',
        label: 'Mã yêu cầu đóng gói',
        group: 'Thông tin đóng gói'
    },
    {
        key: '{priority}',
        label: 'Độ ưu tiên',
        group: 'Thông tin khác'
    },
    {
        key: '{service_name}',
        label: 'Tên dịch vụ',
        group: 'Thông tin khác'
    },
    {
        key: '{special_request}',
        label: 'Yêu cầu đặc biệt',
        group: 'Thông tin khác'
    },
    {
        key: '{total_weight}',
        label: 'Tổng khối lượng',
        group: 'Tổng kết'
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/variables/phieu-khieu-nai.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PHIEU_KHIEU_NAI_VARIABLES",
    ()=>PHIEU_KHIEU_NAI_VARIABLES
]);
const PHIEU_KHIEU_NAI_VARIABLES = [
    // Thông tin cửa hàng
    {
        key: '{store_logo}',
        label: 'Logo cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_name}',
        label: 'Tên cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_address}',
        label: 'Địa chỉ cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_phone_number}',
        label: 'SĐT cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_email}',
        label: 'Email cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{print_date}',
        label: 'Ngày in',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{print_time}',
        label: 'Giờ in',
        group: 'Thông tin cửa hàng'
    },
    // Thông tin phiếu
    {
        key: '{complaint_code}',
        label: 'Mã phiếu khiếu nại',
        group: 'Thông tin phiếu'
    },
    {
        key: '{created_on}',
        label: 'Ngày tạo',
        group: 'Thông tin phiếu'
    },
    {
        key: '{created_on_time}',
        label: 'Thời gian tạo',
        group: 'Thông tin phiếu'
    },
    // Thông tin khách hàng
    {
        key: '{customer_name}',
        label: 'Tên khách hàng',
        group: 'Thông tin khách hàng'
    },
    {
        key: '{customer_code}',
        label: 'Mã khách hàng',
        group: 'Thông tin khách hàng'
    },
    {
        key: '{customer_phone_number}',
        label: 'SĐT khách hàng',
        group: 'Thông tin khách hàng'
    },
    {
        key: '{customer_email}',
        label: 'Email khách hàng',
        group: 'Thông tin khách hàng'
    },
    {
        key: '{customer_address}',
        label: 'Địa chỉ khách hàng',
        group: 'Thông tin khách hàng'
    },
    // Thông tin đơn hàng liên quan
    {
        key: '{order_code}',
        label: 'Mã đơn hàng',
        group: 'Đơn hàng liên quan'
    },
    {
        key: '{order_date}',
        label: 'Ngày đặt hàng',
        group: 'Đơn hàng liên quan'
    },
    // Nội dung khiếu nại
    {
        key: '{complaint_type}',
        label: 'Loại khiếu nại',
        group: 'Nội dung khiếu nại'
    },
    {
        key: '{complaint_description}',
        label: 'Mô tả vấn đề',
        group: 'Nội dung khiếu nại'
    },
    {
        key: '{customer_request}',
        label: 'Yêu cầu của khách hàng',
        group: 'Nội dung khiếu nại'
    },
    {
        key: '{line_product_name}',
        label: 'Tên sản phẩm',
        group: 'Nội dung khiếu nại'
    },
    {
        key: '{line_variant}',
        label: 'Phiên bản sản phẩm',
        group: 'Nội dung khiếu nại'
    },
    {
        key: '{line_variant_code}',
        label: 'Mã sản phẩm',
        group: 'Nội dung khiếu nại'
    },
    // Xử lý khiếu nại
    {
        key: '{complaint_status}',
        label: 'Trạng thái xử lý',
        group: 'Xử lý khiếu nại'
    },
    {
        key: '{resolution}',
        label: 'Phương án xử lý',
        group: 'Xử lý khiếu nại'
    },
    {
        key: '{assignee_name}',
        label: 'Người xử lý',
        group: 'Xử lý khiếu nại'
    },
    {
        key: '{resolved_on}',
        label: 'Ngày hoàn thành',
        group: 'Xử lý khiếu nại'
    },
    {
        key: '{complaint_note}',
        label: 'Ghi chú',
        group: 'Xử lý khiếu nại'
    },
    // Người tạo
    {
        key: '{account_name}',
        label: 'Người tạo phiếu',
        group: 'Người tạo'
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/variables/phieu-phat.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PHIEU_PHAT_VARIABLES",
    ()=>PHIEU_PHAT_VARIABLES
]);
const PHIEU_PHAT_VARIABLES = [
    // Thông tin cửa hàng
    {
        key: '{store_logo}',
        label: 'Logo cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_name}',
        label: 'Tên cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_address}',
        label: 'Địa chỉ cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{print_date}',
        label: 'Ngày in',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{print_time}',
        label: 'Giờ in',
        group: 'Thông tin cửa hàng'
    },
    // Thông tin phiếu
    {
        key: '{penalty_code}',
        label: 'Mã phiếu phạt',
        group: 'Thông tin phiếu'
    },
    {
        key: '{created_on}',
        label: 'Ngày lập',
        group: 'Thông tin phiếu'
    },
    {
        key: '{created_on_time}',
        label: 'Thời gian lập',
        group: 'Thông tin phiếu'
    },
    // Thông tin nhân viên
    {
        key: '{employee_name}',
        label: 'Họ tên nhân viên',
        group: 'Thông tin nhân viên'
    },
    {
        key: '{employee_code}',
        label: 'Mã nhân viên',
        group: 'Thông tin nhân viên'
    },
    {
        key: '{department_name}',
        label: 'Bộ phận',
        group: 'Thông tin nhân viên'
    },
    {
        key: '{position_name}',
        label: 'Chức vụ',
        group: 'Thông tin nhân viên'
    },
    // Nội dung vi phạm
    {
        key: '{violation_type}',
        label: 'Loại vi phạm',
        group: 'Nội dung vi phạm'
    },
    {
        key: '{violation_date}',
        label: 'Ngày vi phạm',
        group: 'Nội dung vi phạm'
    },
    {
        key: '{violation_description}',
        label: 'Mô tả vi phạm',
        group: 'Nội dung vi phạm'
    },
    {
        key: '{evidence}',
        label: 'Bằng chứng',
        group: 'Nội dung vi phạm'
    },
    {
        key: '{violation_count}',
        label: 'Lần vi phạm thứ',
        group: 'Nội dung vi phạm'
    },
    // Hình thức xử phạt
    {
        key: '{penalty_type}',
        label: 'Hình thức phạt',
        group: 'Hình thức xử phạt'
    },
    {
        key: '{penalty_amount}',
        label: 'Số tiền phạt',
        group: 'Hình thức xử phạt'
    },
    {
        key: '{penalty_amount_text}',
        label: 'Số tiền phạt bằng chữ',
        group: 'Hình thức xử phạt'
    },
    {
        key: '{penalty_note}',
        label: 'Ghi chú',
        group: 'Hình thức xử phạt'
    },
    // Người lập
    {
        key: '{account_name}',
        label: 'Người lập phiếu',
        group: 'Người lập'
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/variables/phieu-dieu-chinh-gia-von.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PHIEU_DIEU_CHINH_GIA_VON_VARIABLES",
    ()=>PHIEU_DIEU_CHINH_GIA_VON_VARIABLES
]);
const PHIEU_DIEU_CHINH_GIA_VON_VARIABLES = [
    // Thông tin cửa hàng
    {
        key: '{store_logo}',
        label: 'Logo cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_name}',
        label: 'Tên cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_address}',
        label: 'Địa chỉ cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_phone}',
        label: 'SĐT cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{print_date}',
        label: 'Ngày in',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{print_time}',
        label: 'Giờ in',
        group: 'Thông tin cửa hàng'
    },
    // Thông tin phiếu
    {
        key: '{adjustment_code}',
        label: 'Mã phiếu điều chỉnh',
        group: 'Thông tin phiếu'
    },
    {
        key: '{code}',
        label: 'Mã phiếu',
        group: 'Thông tin phiếu'
    },
    {
        key: '{created_on}',
        label: 'Ngày lập',
        group: 'Thông tin phiếu'
    },
    {
        key: '{created_on_time}',
        label: 'Thời gian lập',
        group: 'Thông tin phiếu'
    },
    {
        key: '{confirmed_on}',
        label: 'Ngày xác nhận',
        group: 'Thông tin phiếu'
    },
    {
        key: '{cancelled_on}',
        label: 'Ngày hủy',
        group: 'Thông tin phiếu'
    },
    {
        key: '{status}',
        label: 'Trạng thái',
        group: 'Thông tin phiếu'
    },
    {
        key: '{reason}',
        label: 'Lý do điều chỉnh',
        group: 'Thông tin phiếu'
    },
    {
        key: '{note}',
        label: 'Ghi chú',
        group: 'Thông tin phiếu'
    },
    // Thông tin chi nhánh
    {
        key: '{location_name}',
        label: 'Tên chi nhánh',
        group: 'Chi nhánh'
    },
    {
        key: '{location_address}',
        label: 'Địa chỉ chi nhánh',
        group: 'Chi nhánh'
    },
    {
        key: '{location_province}',
        label: 'Tỉnh/Thành phố',
        group: 'Chi nhánh'
    },
    // Người lập/xác nhận
    {
        key: '{account_name}',
        label: 'Người lập phiếu',
        group: 'Người lập'
    },
    {
        key: '{confirmed_by}',
        label: 'Người xác nhận',
        group: 'Người lập'
    },
    // Thông tin dòng (line items)
    {
        key: '{line_stt}',
        label: 'STT',
        group: 'Chi tiết sản phẩm'
    },
    {
        key: '{line_variant_code}',
        label: 'Mã SP',
        group: 'Chi tiết sản phẩm'
    },
    {
        key: '{line_product_name}',
        label: 'Tên sản phẩm',
        group: 'Chi tiết sản phẩm'
    },
    {
        key: '{line_variant_name}',
        label: 'Tên phiên bản',
        group: 'Chi tiết sản phẩm'
    },
    {
        key: '{line_variant_barcode}',
        label: 'Mã vạch',
        group: 'Chi tiết sản phẩm'
    },
    {
        key: '{line_unit}',
        label: 'Đơn vị tính',
        group: 'Chi tiết sản phẩm'
    },
    {
        key: '{line_old_price}',
        label: 'Giá vốn cũ',
        group: 'Chi tiết sản phẩm'
    },
    {
        key: '{line_new_price}',
        label: 'Giá vốn mới',
        group: 'Chi tiết sản phẩm'
    },
    {
        key: '{line_difference}',
        label: 'Chênh lệch',
        group: 'Chi tiết sản phẩm'
    },
    {
        key: '{line_on_hand}',
        label: 'Tồn kho',
        group: 'Chi tiết sản phẩm'
    },
    {
        key: '{line_total_difference}',
        label: 'Tổng chênh lệch',
        group: 'Chi tiết sản phẩm'
    },
    {
        key: '{line_reason}',
        label: 'Lý do (dòng)',
        group: 'Chi tiết sản phẩm'
    },
    {
        key: '{line_brand}',
        label: 'Thương hiệu',
        group: 'Chi tiết sản phẩm'
    },
    {
        key: '{line_category}',
        label: 'Danh mục',
        group: 'Chi tiết sản phẩm'
    },
    // Tổng cộng
    {
        key: '{total_items}',
        label: 'Tổng số sản phẩm',
        group: 'Tổng cộng'
    },
    {
        key: '{total_difference}',
        label: 'Tổng chênh lệch',
        group: 'Tổng cộng'
    },
    {
        key: '{total_increase}',
        label: 'Tổng tăng giá vốn',
        group: 'Tổng cộng'
    },
    {
        key: '{total_decrease}',
        label: 'Tổng giảm giá vốn',
        group: 'Tổng cộng'
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/variables/tem-phu-san-pham.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TEM_PHU_SAN_PHAM_VARIABLES",
    ()=>TEM_PHU_SAN_PHAM_VARIABLES
]);
const TEM_PHU_SAN_PHAM_VARIABLES = [
    // Thông tin sản phẩm cơ bản
    {
        key: '{product_name}',
        label: 'Tên sản phẩm',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{product_name_vat}',
        label: 'Tên sản phẩm VAT (đầy đủ)',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{product_sku}',
        label: 'SKU / Mã sản phẩm',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{product_unit}',
        label: 'Đơn vị tính',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{product_brand}',
        label: 'Thương hiệu',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{product_category}',
        label: 'Danh mục',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{product_weight}',
        label: 'Khối lượng / Quy cách',
        group: 'Thông tin sản phẩm'
    },
    {
        key: '{product_origin}',
        label: 'Xuất xứ / Địa chỉ sản xuất',
        group: 'Thông tin sản phẩm'
    },
    // Thông tin nhập khẩu
    {
        key: '{product_importer_name}',
        label: 'Đơn vị nhập khẩu',
        group: 'Thông tin nhập khẩu'
    },
    {
        key: '{product_importer_address}',
        label: 'Địa chỉ nhập khẩu',
        group: 'Thông tin nhập khẩu'
    },
    {
        key: '{product_usage_guide}',
        label: 'Hướng dẫn sử dụng',
        group: 'Thông tin nhập khẩu'
    },
    // Ngày tháng & lô
    {
        key: '{product_lot_number}',
        label: 'Số lô',
        group: 'Ngày & lô'
    },
    {
        key: '{product_mfg_date}',
        label: 'Ngày sản xuất (NSX)',
        group: 'Ngày & lô'
    },
    {
        key: '{product_expiry_date}',
        label: 'Hạn sử dụng (HSD)',
        group: 'Ngày & lô'
    },
    // Giá & mã
    {
        key: '{product_price}',
        label: 'Giá bán hiển thị',
        group: 'Giá & mã'
    },
    {
        key: '{product_barcode}',
        label: 'Mã vạch (text)',
        group: 'Giá & mã'
    },
    {
        key: '{product_barcode_image}',
        label: 'Mã vạch (ảnh)',
        group: 'Giá & mã'
    },
    {
        key: '{product_qr_code}',
        label: 'QR sản phẩm (ảnh)',
        group: 'Giá & mã'
    },
    // Thông tin cửa hàng
    {
        key: '{store_logo}',
        label: 'Logo cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_name}',
        label: 'Tên cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_address}',
        label: 'Địa chỉ cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_phone_number}',
        label: 'SĐT cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    // Mô tả & bảo quản (legacy)
    {
        key: '{product_short_description}',
        label: 'Mô tả ngắn',
        group: 'Mô tả'
    },
    {
        key: '{product_description}',
        label: 'Mô tả chi tiết',
        group: 'Mô tả'
    },
    {
        key: '{product_storage_instructions}',
        label: 'Hướng dẫn bảo quản',
        group: 'Mô tả'
    },
    {
        key: '{product_ingredients}',
        label: 'Thành phần',
        group: 'Mô tả'
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/variables/bang-luong.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BANG_LUONG_LINE_ITEM_VARIABLES",
    ()=>BANG_LUONG_LINE_ITEM_VARIABLES,
    "BANG_LUONG_VARIABLES",
    ()=>BANG_LUONG_VARIABLES,
    "PHIEU_LUONG_COMPONENT_VARIABLES",
    ()=>PHIEU_LUONG_COMPONENT_VARIABLES,
    "PHIEU_LUONG_VARIABLES",
    ()=>PHIEU_LUONG_VARIABLES
]);
const BANG_LUONG_VARIABLES = [
    // Thông tin cửa hàng
    {
        key: '{store_logo}',
        label: 'Logo cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_name}',
        label: 'Tên cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_address}',
        label: 'Địa chỉ cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_phone_number}',
        label: 'SĐT cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_email}',
        label: 'Email cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_province}',
        label: 'Tỉnh thành',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{print_date}',
        label: 'Ngày in',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{print_time}',
        label: 'Giờ in',
        group: 'Thông tin cửa hàng'
    },
    // Thông tin bảng lương
    {
        key: '{batch_code}',
        label: 'Mã bảng lương',
        group: 'Thông tin bảng lương'
    },
    {
        key: '{batch_title}',
        label: 'Tiêu đề bảng lương',
        group: 'Thông tin bảng lương'
    },
    {
        key: '{batch_status}',
        label: 'Trạng thái',
        group: 'Thông tin bảng lương'
    },
    {
        key: '{pay_period}',
        label: 'Kỳ lương',
        group: 'Thông tin bảng lương'
    },
    {
        key: '{pay_period_start}',
        label: 'Ngày bắt đầu kỳ',
        group: 'Thông tin bảng lương'
    },
    {
        key: '{pay_period_end}',
        label: 'Ngày kết thúc kỳ',
        group: 'Thông tin bảng lương'
    },
    {
        key: '{payroll_date}',
        label: 'Ngày thanh toán',
        group: 'Thông tin bảng lương'
    },
    {
        key: '{reference_months}',
        label: 'Tháng tham chiếu',
        group: 'Thông tin bảng lương'
    },
    {
        key: '{created_on}',
        label: 'Ngày tạo',
        group: 'Thông tin bảng lương'
    },
    {
        key: '{created_by}',
        label: 'Người tạo',
        group: 'Thông tin bảng lương'
    },
    {
        key: '{locked_on}',
        label: 'Ngày khóa',
        group: 'Thông tin bảng lương'
    },
    {
        key: '{locked_by}',
        label: 'Người khóa',
        group: 'Thông tin bảng lương'
    },
    {
        key: '{notes}',
        label: 'Ghi chú',
        group: 'Thông tin bảng lương'
    },
    // Tổng kết
    {
        key: '{total_employees}',
        label: 'Tổng số nhân viên',
        group: 'Tổng kết'
    },
    {
        key: '{total_gross}',
        label: 'Tổng thu nhập',
        group: 'Tổng kết'
    },
    {
        key: '{total_gross_text}',
        label: 'Tổng thu nhập (chữ)',
        group: 'Tổng kết'
    },
    {
        key: '{total_earnings}',
        label: 'Tổng khoản cộng',
        group: 'Tổng kết'
    },
    {
        key: '{total_deductions}',
        label: 'Tổng khoản trừ',
        group: 'Tổng kết'
    },
    {
        key: '{total_contributions}',
        label: 'Tổng đóng góp',
        group: 'Tổng kết'
    },
    {
        key: '{total_net}',
        label: 'Tổng thực lĩnh',
        group: 'Tổng kết'
    },
    {
        key: '{total_net_text}',
        label: 'Tổng thực lĩnh (chữ)',
        group: 'Tổng kết'
    }
];
const PHIEU_LUONG_VARIABLES = [
    // Thông tin cửa hàng
    {
        key: '{store_logo}',
        label: 'Logo cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_name}',
        label: 'Tên cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_address}',
        label: 'Địa chỉ cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_phone_number}',
        label: 'SĐT cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_email}',
        label: 'Email cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{print_date}',
        label: 'Ngày in',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{print_time}',
        label: 'Giờ in',
        group: 'Thông tin cửa hàng'
    },
    // Thông tin phiếu lương
    {
        key: '{payslip_code}',
        label: 'Mã phiếu lương',
        group: 'Thông tin phiếu lương'
    },
    {
        key: '{batch_code}',
        label: 'Mã bảng lương',
        group: 'Thông tin phiếu lương'
    },
    {
        key: '{batch_title}',
        label: 'Tiêu đề bảng lương',
        group: 'Thông tin phiếu lương'
    },
    {
        key: '{pay_period}',
        label: 'Kỳ lương',
        group: 'Thông tin phiếu lương'
    },
    {
        key: '{payroll_date}',
        label: 'Ngày thanh toán',
        group: 'Thông tin phiếu lương'
    },
    // Thông tin nhân viên
    {
        key: '{employee_code}',
        label: 'Mã nhân viên',
        group: 'Thông tin nhân viên'
    },
    {
        key: '{employee_name}',
        label: 'Tên nhân viên',
        group: 'Thông tin nhân viên'
    },
    {
        key: '{department_name}',
        label: 'Phòng ban',
        group: 'Thông tin nhân viên'
    },
    {
        key: '{position}',
        label: 'Chức vụ',
        group: 'Thông tin nhân viên'
    },
    // Chi tiết lương
    {
        key: '{total_earnings}',
        label: 'Tổng thu nhập',
        group: 'Chi tiết lương'
    },
    {
        key: '{total_deductions}',
        label: 'Tổng khấu trừ',
        group: 'Chi tiết lương'
    },
    {
        key: '{total_contributions}',
        label: 'Tổng đóng góp',
        group: 'Chi tiết lương'
    },
    {
        key: '{taxable_income}',
        label: 'Thu nhập chịu thuế',
        group: 'Chi tiết lương'
    },
    {
        key: '{social_insurance_base}',
        label: 'Lương tính BHXH',
        group: 'Chi tiết lương'
    },
    {
        key: '{penalty_deductions}',
        label: 'Khấu trừ phạt',
        group: 'Chi tiết lương'
    },
    {
        key: '{other_deductions}',
        label: 'Khấu trừ khác',
        group: 'Chi tiết lương'
    },
    {
        key: '{net_pay}',
        label: 'Thực lĩnh',
        group: 'Chi tiết lương'
    },
    {
        key: '{net_pay_text}',
        label: 'Thực lĩnh (chữ)',
        group: 'Chi tiết lương'
    },
    // Bảo hiểm chi tiết
    {
        key: '{total_insurance}',
        label: 'Tổng bảo hiểm NV đóng',
        group: 'Bảo hiểm'
    },
    {
        key: '{bhxh_amount}',
        label: 'BHXH (8%)',
        group: 'Bảo hiểm'
    },
    {
        key: '{bhyt_amount}',
        label: 'BHYT (1.5%)',
        group: 'Bảo hiểm'
    },
    {
        key: '{bhtn_amount}',
        label: 'BHTN (1%)',
        group: 'Bảo hiểm'
    },
    // Giảm trừ gia cảnh
    {
        key: '{personal_deduction}',
        label: 'Giảm trừ bản thân',
        group: 'Giảm trừ'
    },
    {
        key: '{dependent_deduction}',
        label: 'Giảm trừ người phụ thuộc',
        group: 'Giảm trừ'
    },
    {
        key: '{dependents_count}',
        label: 'Số người phụ thuộc',
        group: 'Giảm trừ'
    },
    // Thuế TNCN
    {
        key: '{personal_income_tax}',
        label: 'Thuế TNCN',
        group: 'Thuế'
    }
];
const BANG_LUONG_LINE_ITEM_VARIABLES = [
    {
        key: '{line_stt}',
        label: 'STT',
        group: 'Dòng chi tiết'
    },
    {
        key: '{employee_code}',
        label: 'Mã NV',
        group: 'Dòng chi tiết'
    },
    {
        key: '{employee_name}',
        label: 'Tên NV',
        group: 'Dòng chi tiết'
    },
    {
        key: '{department_name}',
        label: 'Phòng ban',
        group: 'Dòng chi tiết'
    },
    {
        key: '{earnings}',
        label: 'Thu nhập',
        group: 'Dòng chi tiết'
    },
    {
        key: '{deductions}',
        label: 'Khấu trừ',
        group: 'Dòng chi tiết'
    },
    {
        key: '{contributions}',
        label: 'Đóng góp',
        group: 'Dòng chi tiết'
    },
    {
        key: '{net_pay}',
        label: 'Thực lĩnh',
        group: 'Dòng chi tiết'
    }
];
const PHIEU_LUONG_COMPONENT_VARIABLES = [
    {
        key: '{line_stt}',
        label: 'STT',
        group: 'Dòng thành phần lương'
    },
    {
        key: '{component_code}',
        label: 'Mã',
        group: 'Dòng thành phần lương'
    },
    {
        key: '{component_name}',
        label: 'Tên thành phần',
        group: 'Dòng thành phần lương'
    },
    {
        key: '{component_category}',
        label: 'Loại',
        group: 'Dòng thành phần lương'
    },
    {
        key: '{component_amount}',
        label: 'Số tiền',
        group: 'Dòng thành phần lương'
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/variables/bang-cham-cong.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BANG_CHAM_CONG_LINE_ITEM_VARIABLES",
    ()=>BANG_CHAM_CONG_LINE_ITEM_VARIABLES,
    "BANG_CHAM_CONG_VARIABLES",
    ()=>BANG_CHAM_CONG_VARIABLES,
    "CHI_TIET_CHAM_CONG_LINE_ITEM_VARIABLES",
    ()=>CHI_TIET_CHAM_CONG_LINE_ITEM_VARIABLES,
    "CHI_TIET_CHAM_CONG_VARIABLES",
    ()=>CHI_TIET_CHAM_CONG_VARIABLES
]);
const BANG_CHAM_CONG_VARIABLES = [
    // Thông tin cửa hàng
    {
        key: '{store_logo}',
        label: 'Logo cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_name}',
        label: 'Tên cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_address}',
        label: 'Địa chỉ cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_phone_number}',
        label: 'SĐT cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_email}',
        label: 'Email cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_province}',
        label: 'Tỉnh thành',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{print_date}',
        label: 'Ngày in',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{print_time}',
        label: 'Giờ in',
        group: 'Thông tin cửa hàng'
    },
    // Thông tin bảng chấm công
    {
        key: '{month_year}',
        label: 'Tháng/Năm',
        group: 'Thông tin bảng chấm công'
    },
    {
        key: '{month}',
        label: 'Tháng',
        group: 'Thông tin bảng chấm công'
    },
    {
        key: '{year}',
        label: 'Năm',
        group: 'Thông tin bảng chấm công'
    },
    {
        key: '{department_name}',
        label: 'Phòng ban',
        group: 'Thông tin bảng chấm công'
    },
    {
        key: '{is_locked}',
        label: 'Trạng thái khóa',
        group: 'Thông tin bảng chấm công'
    },
    {
        key: '{created_on}',
        label: 'Ngày tạo',
        group: 'Thông tin bảng chấm công'
    },
    {
        key: '{created_by}',
        label: 'Người tạo',
        group: 'Thông tin bảng chấm công'
    },
    // Tổng kết
    {
        key: '{total_employees}',
        label: 'Tổng số nhân viên',
        group: 'Tổng kết'
    },
    {
        key: '{total_work_days}',
        label: 'Tổng ngày công',
        group: 'Tổng kết'
    },
    {
        key: '{total_leave_days}',
        label: 'Tổng ngày nghỉ',
        group: 'Tổng kết'
    },
    {
        key: '{total_absent_days}',
        label: 'Tổng ngày vắng',
        group: 'Tổng kết'
    },
    {
        key: '{total_late_arrivals}',
        label: 'Tổng lần đi trễ',
        group: 'Tổng kết'
    },
    {
        key: '{total_early_departures}',
        label: 'Tổng lần về sớm',
        group: 'Tổng kết'
    },
    {
        key: '{total_ot_hours}',
        label: 'Tổng giờ tăng ca',
        group: 'Tổng kết'
    }
];
const BANG_CHAM_CONG_LINE_ITEM_VARIABLES = [
    {
        key: '{line_index}',
        label: 'STT',
        group: 'Dòng chi tiết'
    },
    {
        key: '{employee_code}',
        label: 'Mã NV',
        group: 'Dòng chi tiết'
    },
    {
        key: '{employee_name}',
        label: 'Tên NV',
        group: 'Dòng chi tiết'
    },
    {
        key: '{department_name}',
        label: 'Phòng ban',
        group: 'Dòng chi tiết'
    },
    {
        key: '{work_days}',
        label: 'Ngày công',
        group: 'Dòng chi tiết'
    },
    {
        key: '{leave_days}',
        label: 'Ngày nghỉ',
        group: 'Dòng chi tiết'
    },
    {
        key: '{absent_days}',
        label: 'Ngày vắng',
        group: 'Dòng chi tiết'
    },
    {
        key: '{late_arrivals}',
        label: 'Đi trễ',
        group: 'Dòng chi tiết'
    },
    {
        key: '{early_departures}',
        label: 'Về sớm',
        group: 'Dòng chi tiết'
    },
    {
        key: '{ot_hours}',
        label: 'Giờ làm thêm',
        group: 'Dòng chi tiết'
    },
    // Các ngày trong tháng (day_1 đến day_31)
    ...Array.from({
        length: 31
    }, (_, i)=>({
            key: `{day_${i + 1}}`,
            label: `Ngày ${i + 1}`,
            group: 'Ngày trong tháng'
        }))
];
const CHI_TIET_CHAM_CONG_VARIABLES = [
    // Thông tin cửa hàng
    {
        key: '{store_logo}',
        label: 'Logo cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_name}',
        label: 'Tên cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{store_address}',
        label: 'Địa chỉ cửa hàng',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{print_date}',
        label: 'Ngày in',
        group: 'Thông tin cửa hàng'
    },
    {
        key: '{print_time}',
        label: 'Giờ in',
        group: 'Thông tin cửa hàng'
    },
    // Thông tin nhân viên
    {
        key: '{employee_code}',
        label: 'Mã nhân viên',
        group: 'Thông tin nhân viên'
    },
    {
        key: '{employee_name}',
        label: 'Tên nhân viên',
        group: 'Thông tin nhân viên'
    },
    {
        key: '{department_name}',
        label: 'Phòng ban',
        group: 'Thông tin nhân viên'
    },
    // Thông tin kỳ
    {
        key: '{month_year}',
        label: 'Tháng/Năm',
        group: 'Thông tin kỳ'
    },
    // Tổng kết cá nhân
    {
        key: '{work_days}',
        label: 'Ngày công',
        group: 'Tổng kết'
    },
    {
        key: '{leave_days}',
        label: 'Ngày nghỉ',
        group: 'Tổng kết'
    },
    {
        key: '{absent_days}',
        label: 'Ngày vắng',
        group: 'Tổng kết'
    },
    {
        key: '{late_arrivals}',
        label: 'Đi trễ',
        group: 'Tổng kết'
    },
    {
        key: '{early_departures}',
        label: 'Về sớm',
        group: 'Tổng kết'
    },
    {
        key: '{ot_hours}',
        label: 'Giờ tăng ca',
        group: 'Tổng kết'
    }
];
const CHI_TIET_CHAM_CONG_LINE_ITEM_VARIABLES = [
    {
        key: '{line_index}',
        label: 'STT',
        group: 'Dòng chi tiết ngày'
    },
    {
        key: '{day}',
        label: 'Ngày',
        group: 'Dòng chi tiết ngày'
    },
    {
        key: '{day_of_week}',
        label: 'Thứ',
        group: 'Dòng chi tiết ngày'
    },
    {
        key: '{status}',
        label: 'Trạng thái',
        group: 'Dòng chi tiết ngày'
    },
    {
        key: '{check_in}',
        label: 'Giờ vào',
        group: 'Dòng chi tiết ngày'
    },
    {
        key: '{check_out}',
        label: 'Giờ ra',
        group: 'Dòng chi tiết ngày'
    },
    {
        key: '{ot_check_in}',
        label: 'OT vào',
        group: 'Dòng chi tiết ngày'
    },
    {
        key: '{ot_check_out}',
        label: 'OT ra',
        group: 'Dòng chi tiết ngày'
    },
    {
        key: '{notes}',
        label: 'Ghi chú',
        group: 'Dòng chi tiết ngày'
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/variables/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EXTENDED_TEMPLATE_VARIABLES",
    ()=>EXTENDED_TEMPLATE_VARIABLES,
    "TEMPLATE_VARIABLES",
    ()=>TEMPLATE_VARIABLES,
    "getGroupedVariablesForTemplateType",
    ()=>getGroupedVariablesForTemplateType,
    "getVariablesForTemplateType",
    ()=>getVariablesForTemplateType
]);
// Import all variable files
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$variables$2f$don$2d$ban$2d$hang$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/variables/don-ban-hang.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$variables$2f$don$2d$dat$2d$hang$2d$nhap$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/variables/don-dat-hang-nhap.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$variables$2f$don$2d$doi$2d$tra$2d$hang$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/variables/don-doi-tra-hang.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$variables$2f$don$2d$nhap$2d$hang$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/variables/don-nhap-hang.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$variables$2f$don$2d$tra$2d$hang$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/variables/don-tra-hang.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$variables$2f$nhan$2d$giao$2d$hang$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/variables/nhan-giao-hang.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$variables$2f$phieu$2d$ban$2d$giao$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/variables/phieu-ban-giao.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$variables$2f$phieu$2d$bao$2d$hanh$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/variables/phieu-bao-hanh.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$variables$2f$phieu$2d$chi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/variables/phieu-chi.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$variables$2f$phieu$2d$chuyen$2d$hang$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/variables/phieu-chuyen-hang.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$variables$2f$phieu$2d$don$2d$tam$2d$tinh$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/variables/phieu-don-tam-tinh.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$variables$2f$phieu$2d$dong$2d$goi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/variables/phieu-dong-goi.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$variables$2f$phieu$2d$giao$2d$hang$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/variables/phieu-giao-hang.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$variables$2f$phieu$2d$huong$2d$dan$2d$dong$2d$goi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/variables/phieu-huong-dan-dong-goi.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$variables$2f$phieu$2d$kiem$2d$hang$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/variables/phieu-kiem-hang.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$variables$2f$phieu$2d$nhap$2d$kho$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/variables/phieu-nhap-kho.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$variables$2f$phieu$2d$thu$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/variables/phieu-thu.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$variables$2f$phieu$2d$tong$2d$ket$2d$ban$2d$hang$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/variables/phieu-tong-ket-ban-hang.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$variables$2f$phieu$2d$tra$2d$hang$2d$ncc$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/variables/phieu-tra-hang-ncc.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$variables$2f$phieu$2d$xac$2d$nhan$2d$hoan$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/variables/phieu-xac-nhan-hoan.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$variables$2f$phieu$2d$yeu$2d$cau$2d$bao$2d$hanh$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/variables/phieu-yeu-cau-bao-hanh.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$variables$2f$phieu$2d$yeu$2d$cau$2d$dong$2d$goi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/variables/phieu-yeu-cau-dong-goi.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$variables$2f$phieu$2d$khieu$2d$nai$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/variables/phieu-khieu-nai.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$variables$2f$phieu$2d$phat$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/variables/phieu-phat.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$variables$2f$phieu$2d$dieu$2d$chinh$2d$gia$2d$von$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/variables/phieu-dieu-chinh-gia-von.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$variables$2f$tem$2d$phu$2d$san$2d$pham$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/variables/tem-phu-san-pham.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$variables$2f$bang$2d$luong$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/variables/bang-luong.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$variables$2f$bang$2d$cham$2d$cong$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/variables/bang-cham-cong.ts [app-client] (ecmascript)");
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
const TEMPLATE_VARIABLES = {
    'order': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$variables$2f$don$2d$ban$2d$hang$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DON_BAN_HANG_VARIABLES"],
    'quote': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$variables$2f$phieu$2d$don$2d$tam$2d$tinh$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PHIEU_DON_TAM_TINH_VARIABLES"],
    'sales-return': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$variables$2f$don$2d$doi$2d$tra$2d$hang$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DON_DOI_TRA_HANG_VARIABLES"],
    'packing': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$variables$2f$phieu$2d$dong$2d$goi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PHIEU_DONG_GOI_VARIABLES"],
    'delivery': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$variables$2f$phieu$2d$giao$2d$hang$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PHIEU_GIAO_HANG_VARIABLES"],
    'shipping-label': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$variables$2f$nhan$2d$giao$2d$hang$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NHAN_GIAO_HANG_VARIABLES"],
    'product-label': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$variables$2f$tem$2d$phu$2d$san$2d$pham$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TEM_PHU_SAN_PHAM_VARIABLES"],
    'purchase-order': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$variables$2f$don$2d$dat$2d$hang$2d$nhap$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DON_DAT_HANG_NHAP_VARIABLES"],
    'stock-in': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$variables$2f$phieu$2d$nhap$2d$kho$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PHIEU_NHAP_KHO_VARIABLES"],
    'stock-transfer': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$variables$2f$phieu$2d$chuyen$2d$hang$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PHIEU_CHUYEN_HANG_VARIABLES"],
    'inventory-check': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$variables$2f$phieu$2d$kiem$2d$hang$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PHIEU_KIEM_HANG_VARIABLES"],
    'receipt': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$variables$2f$phieu$2d$thu$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PHIEU_THU_VARIABLES"],
    'payment': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$variables$2f$phieu$2d$chi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PHIEU_CHI_VARIABLES"],
    'warranty': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$variables$2f$phieu$2d$bao$2d$hanh$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PHIEU_BAO_HANH_VARIABLES"],
    'supplier-return': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$variables$2f$phieu$2d$tra$2d$hang$2d$ncc$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PHIEU_TRA_HANG_NCC_VARIABLES"],
    'complaint': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$variables$2f$phieu$2d$khieu$2d$nai$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PHIEU_KHIEU_NAI_VARIABLES"],
    'penalty': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$variables$2f$phieu$2d$phat$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PHIEU_PHAT_VARIABLES"],
    'leave': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$variables$2f$phieu$2d$phat$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PHIEU_PHAT_VARIABLES"],
    'cost-adjustment': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$variables$2f$phieu$2d$dieu$2d$chinh$2d$gia$2d$von$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PHIEU_DIEU_CHINH_GIA_VON_VARIABLES"],
    'handover': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$variables$2f$phieu$2d$ban$2d$giao$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PHIEU_BAN_GIAO_VARIABLES"],
    'payroll': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$variables$2f$bang$2d$luong$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BANG_LUONG_VARIABLES"],
    'payslip': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$variables$2f$bang$2d$luong$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PHIEU_LUONG_VARIABLES"],
    'attendance': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$variables$2f$bang$2d$cham$2d$cong$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BANG_CHAM_CONG_VARIABLES"]
};
const EXTENDED_TEMPLATE_VARIABLES = {
    'don-nhap-hang': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$variables$2f$don$2d$nhap$2d$hang$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DON_NHAP_HANG_VARIABLES"],
    'don-tra-hang': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$variables$2f$don$2d$tra$2d$hang$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DON_TRA_HANG_VARIABLES"],
    'phieu-ban-giao': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$variables$2f$phieu$2d$ban$2d$giao$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PHIEU_BAN_GIAO_VARIABLES"],
    'phieu-xac-nhan-hoan': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$variables$2f$phieu$2d$xac$2d$nhan$2d$hoan$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PHIEU_XAC_NHAN_HOAN_VARIABLES"],
    'phieu-tong-ket-ban-hang': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$variables$2f$phieu$2d$tong$2d$ket$2d$ban$2d$hang$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PHIEU_TONG_KET_BAN_HANG_VARIABLES"],
    'phieu-huong-dan-dong-goi': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$variables$2f$phieu$2d$huong$2d$dan$2d$dong$2d$goi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PHIEU_HUONG_DAN_DONG_GOI_VARIABLES"],
    'phieu-yeu-cau-dong-goi': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$variables$2f$phieu$2d$yeu$2d$cau$2d$dong$2d$goi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PHIEU_YEU_CAU_DONG_GOI_VARIABLES"],
    'phieu-yeu-cau-bao-hanh': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$variables$2f$phieu$2d$yeu$2d$cau$2d$bao$2d$hanh$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PHIEU_YEU_CAU_BAO_HANH_VARIABLES"],
    'bang-luong': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$variables$2f$bang$2d$luong$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BANG_LUONG_VARIABLES"],
    'phieu-luong': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$variables$2f$bang$2d$luong$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PHIEU_LUONG_VARIABLES"],
    'bang-cham-cong': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$variables$2f$bang$2d$cham$2d$cong$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BANG_CHAM_CONG_VARIABLES"],
    'chi-tiet-cham-cong': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$variables$2f$bang$2d$cham$2d$cong$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CHI_TIET_CHAM_CONG_VARIABLES"]
};
function getVariablesForTemplateType(type) {
    return TEMPLATE_VARIABLES[type] || [];
}
function getGroupedVariablesForTemplateType(type) {
    const variables = getVariablesForTemplateType(type);
    return variables.reduce((acc, variable)=>{
        const group = variable.group || 'Khác';
        if (!acc[group]) {
            acc[group] = [];
        }
        acc[group].push(variable);
        return acc;
    }, {});
}
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/id-utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "extractCounterFromBusinessId",
    ()=>extractCounterFromBusinessId,
    "extractCounterFromSystemId",
    ()=>extractCounterFromSystemId,
    "findNextAvailableBusinessId",
    ()=>findNextAvailableBusinessId,
    "formatIdForDisplay",
    ()=>formatIdForDisplay,
    "generateBusinessId",
    ()=>generateBusinessId,
    "generateSuggestedIds",
    ()=>generateSuggestedIds,
    "generateSystemId",
    ()=>generateSystemId,
    "getMaxBusinessIdCounter",
    ()=>getMaxBusinessIdCounter,
    "getMaxSystemIdCounter",
    ()=>getMaxSystemIdCounter,
    "isBusinessIdUnique",
    ()=>isBusinessIdUnique,
    "isValidIdFormat",
    ()=>isValidIdFormat,
    "sanitizeBusinessId",
    ()=>sanitizeBusinessId
]);
/**
 * ID Utilities
 * Helpers for generating and validating IDs (systemId & business id)
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/smart-prefix.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-config.ts [app-client] (ecmascript)");
;
;
function generateSystemId(entityType, counter) {
    const config = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ID_CONFIG"][entityType];
    if (!config) {
        throw new Error(`No configuration found for entity type: ${entityType}`);
    }
    const prefix = config.systemIdPrefix;
    const digitCount = config.digitCount || 6;
    return `${prefix}${String(counter).padStart(digitCount, '0')}`;
}
function generateBusinessId(entityType, counter, customId) {
    // If user provided custom ID, validate and return it
    if (customId && customId.trim()) {
        const sanitized = sanitizeBusinessId(customId);
        if (!sanitized) {
            throw new Error('Mã không hợp lệ! Chỉ được phép sử dụng chữ cái và số.');
        }
        return sanitized;
    }
    // Otherwise, auto-generate
    const prefix = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPrefix"])(entityType);
    return `${prefix}${String(counter).padStart(6, '0')}`;
}
function sanitizeBusinessId(id) {
    if (!id || typeof id !== 'string') return null;
    // Remove all special characters, keep only alphanumeric
    const cleaned = id.trim().replace(/[^a-zA-Z0-9]/g, '');
    if (!cleaned) return null;
    // Convert to uppercase for consistency
    return cleaned.toUpperCase();
}
function isBusinessIdUnique(id, existingIds, currentId) {
    if (!id) return false;
    const normalizedId = id.toUpperCase();
    const normalizedCurrentId = currentId?.toUpperCase();
    return !existingIds.some((existingId)=>{
        // ✅ Filter out empty/undefined IDs
        if (!existingId || existingId.trim() === '') return false;
        const normalizedExisting = existingId.toUpperCase();
        // Skip self-comparison in edit mode
        if (normalizedCurrentId && normalizedExisting === normalizedCurrentId) {
            return false;
        }
        return normalizedExisting === normalizedId;
    });
}
function extractCounterFromSystemId(systemId, prefix) {
    if (!systemId || typeof systemId !== 'string') return 0;
    // Try different digit counts (most entities use 6 digits, some use 7-8)
    const regex8 = new RegExp(`^${prefix}(\\d{8})$`);
    const regex7 = new RegExp(`^${prefix}(\\d{7})$`);
    const regex6 = new RegExp(`^${prefix}(\\d{6})$`);
    const match8 = systemId.match(regex8);
    if (match8) return parseInt(match8[1], 10);
    const match7 = systemId.match(regex7);
    if (match7) return parseInt(match7[1], 10);
    const match6 = systemId.match(regex6);
    if (match6) return parseInt(match6[1], 10);
    return 0;
}
function extractCounterFromBusinessId(businessId, prefix) {
    if (!businessId || typeof businessId !== 'string') return 0;
    const regex = new RegExp(`^${prefix}(\\d+)$`);
    const match = businessId.match(regex);
    return match ? parseInt(match[1], 10) : 0;
}
function getMaxSystemIdCounter(items, prefix) {
    if (!items || !Array.isArray(items)) return 0;
    let maxCounter = 0;
    items.forEach((item)=>{
        if (!item || !item.systemId) return;
        const counter = extractCounterFromSystemId(item.systemId, prefix);
        if (counter > maxCounter) {
            maxCounter = counter;
        }
    });
    return maxCounter;
}
function getMaxBusinessIdCounter(items, prefix) {
    if (!items || !Array.isArray(items)) return 0;
    let maxCounter = 0;
    items.forEach((item)=>{
        if (!item || !item.id) return;
        const counter = extractCounterFromBusinessId(item.id, prefix);
        if (counter > maxCounter) {
            maxCounter = counter;
        }
    });
    return maxCounter;
}
function formatIdForDisplay(id) {
    // Match pattern: PREFIX followed by numbers
    const match = id.match(/^([A-Z]+)(\d+)$/);
    if (!match) return id;
    const [, prefix, numbers] = match;
    return `${prefix}-${numbers}`;
}
function isValidIdFormat(id) {
    if (!id || typeof id !== 'string') return false;
    // Only alphanumeric characters allowed
    const regex = /^[A-Z0-9]+$/i;
    return regex.test(id);
}
function generateSuggestedIds(entityType, counter, count = 3) {
    const suggestions = [];
    const prefix = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPrefix"])(entityType);
    for(let i = 0; i < count; i++){
        suggestions.push(`${prefix}${String(counter + i + 1).padStart(6, '0')}`);
    }
    return suggestions;
}
function findNextAvailableBusinessId(prefix, existingIds, startCounter, digitCount = 6) {
    let counter = startCounter;
    let nextId;
    // Keep incrementing until we find a unique ID
    do {
        counter++;
        nextId = `${prefix}${String(counter).padStart(digitCount, '0')}`;
    }while (existingIds.some((id)=>id === nextId))
    return {
        nextId,
        updatedCounter: counter
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/store-factory.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createCrudStore",
    ()=>createCrudStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
// persist, createJSONStorage removed - database is now source of truth
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/smart-prefix.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-config.ts [app-client] (ecmascript)");
;
;
;
;
const SYSTEM_FALLBACK_ID = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSystemId"])('SYS000000');
const asSystemIdFallback = ()=>SYSTEM_FALLBACK_ID;
// ✅ API Sync helper for store-factory
async function syncToAPI(apiEndpoint, action, data, systemId) {
    try {
        const endpoint = action === 'create' ? apiEndpoint : `${apiEndpoint}/${systemId || data.systemId}`;
        const method = action === 'create' ? 'POST' : action === 'update' ? 'PATCH' : action === 'delete' ? 'DELETE' : 'PATCH'; // restore uses PATCH
        const response = await fetch(endpoint, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: action !== 'delete' ? JSON.stringify(data) : undefined
        });
        if (!response.ok) {
            console.warn(`[Store Factory API] ${action} failed for ${apiEndpoint}:`, response.status);
        }
        return response.ok;
    } catch (error) {
        console.error(`[Store Factory API] ${action} error for ${apiEndpoint}:`, error);
        return false;
    }
}
const createCrudStore = (_initialData, entityType, options)=>{
    const businessPrefix = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPrefix"])(entityType); // Vietnamese prefix for Business ID (NV, KH, DH)
    const config = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ID_CONFIG"][entityType];
    const systemIdPrefix = config?.systemIdPrefix || entityType.toUpperCase(); // English prefix for SystemId (EMP, CUSTOMER, ORDER)
    const businessIdField = options?.businessIdField ?? 'id';
    // const persistKey = options?.persistKey; // @deprecated - No longer used
    const getCurrentUser = options?.getCurrentUser;
    const apiEndpoint = options?.apiEndpoint;
    // ✅ CHANGED: Start with empty array - database is source of truth
    // Mock data files (data.ts) are NO LONGER USED for runtime
    const normalizedInitialData = [];
    const storeConfig = (set, get)=>({
            data: normalizedInitialData,
            // ✅ Counters start at 0 - will be initialized from API via loadFromAPI()
            _counters: {
                systemId: 0,
                businessId: 0
            },
            _initialized: false,
            add: (item)=>{
                // ✅ Get counters from state (persisted)
                const currentCounters = get()._counters;
                const newSystemIdCounter = currentCounters.systemId + 1;
                const newSystemId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSystemId"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateSystemId"])(entityType, newSystemIdCounter));
                // Generate or validate Business ID (if field exists)
                let finalItem = {
                    ...item
                };
                let newBusinessIdCounter = currentCounters.businessId;
                if (businessIdField in item) {
                    const customId = item[businessIdField];
                    const existingIds = get().data.map((d)=>d[businessIdField]);
                    // ✅ If customId provided, validate uniqueness
                    if (customId && customId.trim()) {
                        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isBusinessIdUnique"])(customId, existingIds)) {
                            throw new Error(`Mã "${customId}" đã tồn tại! Vui lòng sử dụng mã khác.`);
                        }
                        finalItem[businessIdField] = customId.trim().toUpperCase();
                    } else {
                        // ✅ Auto-generate with findNextAvailableBusinessId
                        const digitCount = 6; // All entities use 6 digits
                        const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findNextAvailableBusinessId"])(businessPrefix, existingIds, newBusinessIdCounter, digitCount);
                        finalItem[businessIdField] = result.nextId;
                        newBusinessIdCounter = result.updatedCounter;
                    }
                }
                const now = new Date().toISOString();
                const currentUser = getCurrentUser?.();
                const newItem = {
                    ...finalItem,
                    systemId: newSystemId,
                    createdAt: finalItem.createdAt || now,
                    updatedAt: now,
                    createdBy: finalItem.createdBy || currentUser,
                    updatedBy: currentUser
                };
                // ✅ Update both data and counters atomically
                set((state)=>({
                        data: [
                            ...state.data,
                            newItem
                        ],
                        _counters: {
                            systemId: newSystemIdCounter,
                            businessId: newBusinessIdCounter
                        }
                    }));
                // ✅ Sync to API in background
                if (apiEndpoint) {
                    syncToAPI(apiEndpoint, 'create', newItem).catch(console.error);
                }
                return newItem;
            },
            addMultiple: (items)=>set((state)=>{
                    const now = new Date().toISOString();
                    const currentUser = getCurrentUser?.();
                    const newItems = [];
                    const digitCount = 6; // All entities use 6 digits
                    // ✅ Start from current counters
                    let currentSystemIdCounter = state._counters.systemId;
                    let currentBusinessIdCounter = state._counters.businessId;
                    items.forEach((item)=>{
                        // ✅ Generate SystemId from current counter
                        currentSystemIdCounter++;
                        const newSystemId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSystemId"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateSystemId"])(entityType, currentSystemIdCounter));
                        // Generate or validate Business ID (if field exists)
                        let finalItem = {
                            ...item
                        };
                        if (businessIdField in item) {
                            const customId = item[businessIdField];
                            // Collect existing IDs (from state + already added in this batch)
                            const existingIds = [
                                ...state.data.map((d)=>d[businessIdField]),
                                ...newItems.map((d)=>d[businessIdField])
                            ];
                            // ✅ If customId provided, validate uniqueness
                            if (customId && customId.trim()) {
                                if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isBusinessIdUnique"])(customId, existingIds)) {
                                    throw new Error(`Mã "${customId}" đã tồn tại! Vui lòng sử dụng mã khác.`);
                                }
                                finalItem[businessIdField] = customId.trim().toUpperCase();
                            } else {
                                // ✅ Auto-generate with findNextAvailableBusinessId
                                const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findNextAvailableBusinessId"])(businessPrefix, existingIds, currentBusinessIdCounter, digitCount);
                                finalItem[businessIdField] = result.nextId;
                                currentBusinessIdCounter = result.updatedCounter;
                            }
                        }
                        newItems.push({
                            ...finalItem,
                            systemId: newSystemId,
                            createdAt: now,
                            updatedAt: now,
                            createdBy: currentUser,
                            updatedBy: currentUser
                        });
                    });
                    // ✅ Update both data and counters
                    const result = {
                        data: [
                            ...state.data,
                            ...newItems
                        ],
                        _counters: {
                            systemId: currentSystemIdCounter,
                            businessId: currentBusinessIdCounter
                        }
                    };
                    // ✅ Sync to API in background (batch)
                    if (apiEndpoint) {
                        newItems.forEach((item)=>{
                            syncToAPI(apiEndpoint, 'create', item).catch(console.error);
                        });
                    }
                    return result;
                }),
            update: (systemId, updatedItem)=>{
                // Validate unique business ID (case-insensitive, skip self)
                if (businessIdField in updatedItem) {
                    const businessId = updatedItem[businessIdField];
                    const existingIds = get().data.filter((d)=>d.systemId !== systemId).map((d)=>d[businessIdField]);
                    if (businessId && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isBusinessIdUnique"])(businessId, existingIds)) {
                        throw new Error(`Mã "${businessId}" đã tồn tại! Vui lòng sử dụng mã khác.`);
                    }
                }
                const now = new Date().toISOString();
                const currentUser = getCurrentUser?.();
                set((state)=>({
                        data: state.data.map((item)=>item.systemId === systemId ? {
                                ...item,
                                ...updatedItem,
                                updatedAt: now,
                                updatedBy: currentUser
                            } : item)
                    }));
                // ✅ Sync to API in background
                if (apiEndpoint) {
                    const fullItem = get().data.find((item)=>item.systemId === systemId);
                    if (fullItem) {
                        syncToAPI(apiEndpoint, 'update', fullItem, systemId).catch(console.error);
                    }
                }
            },
            remove: (systemId)=>{
                // Soft delete - mark as deleted
                const now = new Date().toISOString();
                set((state)=>({
                        data: state.data.map((item)=>item.systemId === systemId ? {
                                ...item,
                                isDeleted: true,
                                deletedAt: now
                            } : item)
                    }));
                // ✅ Sync to API in background
                if (apiEndpoint) {
                    const item = get().data.find((item)=>item.systemId === systemId);
                    if (item) {
                        syncToAPI(apiEndpoint, 'update', {
                            ...item,
                            isDeleted: true,
                            deletedAt: now
                        }, systemId).catch(console.error);
                    }
                }
            },
            hardDelete: (systemId)=>{
                // Permanent delete - remove from array
                set((state)=>({
                        data: state.data.filter((item)=>item.systemId !== systemId)
                    }));
                // ✅ Sync to API in background
                if (apiEndpoint) {
                    syncToAPI(apiEndpoint, 'delete', {
                        systemId
                    }, systemId).catch(console.error);
                }
            },
            restore: (systemId)=>{
                // Restore soft-deleted item
                set((state)=>({
                        data: state.data.map((item)=>item.systemId === systemId ? {
                                ...item,
                                isDeleted: false,
                                deletedAt: null
                            } : item)
                    }));
                // ✅ Sync to API in background
                if (apiEndpoint) {
                    const item = get().data.find((item)=>item.systemId === systemId);
                    if (item) {
                        syncToAPI(apiEndpoint, 'restore', {
                            ...item,
                            isDeleted: false,
                            deletedAt: null
                        }, systemId).catch(console.error);
                    }
                }
            },
            getActive: ()=>get().data.filter((item)=>!item.isDeleted),
            getDeleted: ()=>get().data.filter((item)=>item.isDeleted),
            findById: (id)=>get().data.find((item)=>item.systemId === id || item.id === id),
            // ✅ Load data from database API - OPTIMIZED: No more limit=10000!
            // This is now only used for counter initialization, NOT for loading all data
            // Use React Query hooks for data fetching with proper pagination
            loadFromAPI: async ()=>{
                if (!apiEndpoint) return;
                if (get()._initialized) return;
                try {
                    // Only fetch minimal data needed to initialize counters
                    // Actual data loading should be done via React Query hooks
                    const response = await fetch(`${apiEndpoint}?limit=1&sortBy=systemId&sortOrder=desc`, {
                        credentials: 'include'
                    });
                    if (response.ok) {
                        const json = await response.json();
                        const pagination = json.pagination || {};
                        const lastItem = json.data?.[0];
                        // Initialize counters from the latest item (highest IDs)
                        const newCounters = {
                            systemId: lastItem ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMaxSystemIdCounter"])([
                                lastItem
                            ], systemIdPrefix) : 0,
                            businessId: lastItem && options?.businessIdField ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMaxBusinessIdCounter"])([
                                lastItem
                            ], businessPrefix) : 0
                        };
                        set({
                            data: [],
                            _counters: newCounters,
                            _initialized: true
                        });
                        console.log(`[Store Factory] ${apiEndpoint} initialized. Total records: ${pagination.total || 'unknown'}`);
                    }
                } catch (error) {
                    console.error(`[Store Factory] loadFromAPI error for ${apiEndpoint}:`, error);
                    // Still mark as initialized to prevent infinite retry
                    set({
                        _initialized: true
                    });
                }
            }
        });
    // ✅ SIMPLIFIED: No localStorage persistence, database is source of truth
    // Data is loaded via ApiSyncProvider on app init
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])(storeConfig);
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/branches/store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useBranchStore",
    ()=>useBranchStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-client] (ecmascript)");
;
const baseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCrudStore"])([], 'branches', {
    apiEndpoint: '/api/branches'
});
const setDefault = (systemId)=>{
    baseStore.setState((state)=>({
            data: state.data.map((branch)=>({
                    ...branch,
                    isDefault: branch.systemId === systemId
                }))
        }));
};
const originalAdd = baseStore.getState().add;
const originalUpdate = baseStore.getState().update;
baseStore.setState({
    add: (item)=>{
        const result = originalAdd(item);
        if (item.isDefault) {
            setDefault(result.systemId);
        }
        return result;
    },
    update: (systemId, updatedItem)=>{
        originalUpdate(systemId, updatedItem);
        if (updatedItem.isDefault) {
            setDefault(systemId);
        }
    }
});
const enhanceState = (state)=>({
        ...state,
        setDefault
    });
const useBranchStoreBase = ()=>enhanceState(baseStore());
useBranchStoreBase.getState = ()=>enhanceState(baseStore.getState());
const useBranchStore = useBranchStoreBase;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/select.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Select",
    ()=>Select,
    "SelectContent",
    ()=>SelectContent,
    "SelectGroup",
    ()=>SelectGroup,
    "SelectItem",
    ()=>SelectItem,
    "SelectLabel",
    ()=>SelectLabel,
    "SelectScrollDownButton",
    ()=>SelectScrollDownButton,
    "SelectScrollUpButton",
    ()=>SelectScrollUpButton,
    "SelectSeparator",
    ()=>SelectSeparator,
    "SelectTrigger",
    ()=>SelectTrigger,
    "SelectValue",
    ()=>SelectValue
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-select/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-up.js [app-client] (ecmascript) <export default as ChevronUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$modal$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/modal-context.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
const Select = ({ value, defaultValue, ...props })=>{
    const controlledProps = {};
    if (value !== undefined) {
        controlledProps.value = value;
    }
    if (defaultValue !== undefined) {
        controlledProps.defaultValue = defaultValue;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        ...props,
        ...controlledProps
    }, void 0, false, {
        fileName: "[project]/components/ui/select.tsx",
        lineNumber: 26,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
_c = Select;
Select.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"].displayName;
const SelectGroup = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"];
const SelectValue = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Value"];
const SelectTrigger = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c1 = ({ className, children, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1", className),
        ...props,
        children: [
            children,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                asChild: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                    className: "h-4 w-4 opacity-50"
                }, void 0, false, {
                    fileName: "[project]/components/ui/select.tsx",
                    lineNumber: 48,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/components/ui/select.tsx",
                lineNumber: 47,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/select.tsx",
        lineNumber: 38,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c2 = SelectTrigger;
SelectTrigger.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"].displayName;
const SelectScrollUpButton = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollUpButton"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex cursor-default items-center justify-center py-1", className),
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__["ChevronUp"], {
            className: "h-4 w-4"
        }, void 0, false, {
            fileName: "[project]/components/ui/select.tsx",
            lineNumber: 66,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/components/ui/select.tsx",
        lineNumber: 58,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c3 = SelectScrollUpButton;
SelectScrollUpButton.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollUpButton"].displayName;
const SelectScrollDownButton = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollDownButton"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex cursor-default items-center justify-center py-1", className),
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
            className: "h-4 w-4"
        }, void 0, false, {
            fileName: "[project]/components/ui/select.tsx",
            lineNumber: 83,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/components/ui/select.tsx",
        lineNumber: 75,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c4 = SelectScrollDownButton;
SelectScrollDownButton.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollDownButton"].displayName;
const SelectContent = /*#__PURE__*/ _s(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c5 = _s(({ className, children, position = "popper", ...props }, ref)=>{
    _s();
    const modalId = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"]();
    const [isOpen, setIsOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    const { zIndex } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$modal$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useModal"])(modalId, isOpen, 'select');
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "SelectContent.useEffect": ()=>{
            const content = ref && 'current' in ref ? ref.current : null;
            if (!content) return;
            const observer = new MutationObserver({
                "SelectContent.useEffect": (mutations)=>{
                    mutations.forEach({
                        "SelectContent.useEffect": (mutation)=>{
                            if (mutation.type === 'attributes' && mutation.attributeName === 'data-state') {
                                const target = mutation.target;
                                const state = target.getAttribute('data-state');
                                setIsOpen(state === 'open');
                            }
                        }
                    }["SelectContent.useEffect"]);
                }
            }["SelectContent.useEffect"]);
            observer.observe(content, {
                attributes: true,
                attributeFilter: [
                    'data-state'
                ]
            });
            return ({
                "SelectContent.useEffect": ()=>observer.disconnect()
            })["SelectContent.useEffect"];
        }
    }["SelectContent.useEffect"], [
        ref
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
            ref: ref,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative max-h-[--radix-select-content-available-height] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-select-content-transform-origin]", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className),
            style: {
                zIndex
            },
            position: position,
            ...props,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SelectScrollUpButton, {}, void 0, false, {
                    fileName: "[project]/components/ui/select.tsx",
                    lineNumber: 130,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Viewport"], {
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("p-1", position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"),
                    children: children
                }, void 0, false, {
                    fileName: "[project]/components/ui/select.tsx",
                    lineNumber: 131,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SelectScrollDownButton, {}, void 0, false, {
                    fileName: "[project]/components/ui/select.tsx",
                    lineNumber: 140,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/components/ui/select.tsx",
            lineNumber: 118,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/components/ui/select.tsx",
        lineNumber: 117,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
}, "oXfM6F2HxOqs+JkgAgmCu2d1dJo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$modal$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useModal"]
    ];
})), "oXfM6F2HxOqs+JkgAgmCu2d1dJo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$modal$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useModal"]
    ];
});
_c6 = SelectContent;
SelectContent.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"].displayName;
const SelectLabel = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c7 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("py-1.5 pl-8 pr-2 text-sm font-semibold", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/select.tsx",
        lineNumber: 151,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c8 = SelectLabel;
SelectLabel.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"].displayName;
const SelectItem = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c9 = ({ className, children, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Item"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ItemIndicator"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                        className: "h-4 w-4"
                    }, void 0, false, {
                        fileName: "[project]/components/ui/select.tsx",
                        lineNumber: 173,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/components/ui/select.tsx",
                    lineNumber: 172,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/components/ui/select.tsx",
                lineNumber: 171,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ItemText"], {
                children: children
            }, void 0, false, {
                fileName: "[project]/components/ui/select.tsx",
                lineNumber: 177,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/select.tsx",
        lineNumber: 163,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c10 = SelectItem;
SelectItem.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Item"].displayName;
const SelectSeparator = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c11 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("-mx-1 my-1 h-px bg-muted", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/select.tsx",
        lineNumber: 186,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c12 = SelectSeparator;
SelectSeparator.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"].displayName;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11, _c12;
__turbopack_context__.k.register(_c, "Select");
__turbopack_context__.k.register(_c1, "SelectTrigger$React.forwardRef");
__turbopack_context__.k.register(_c2, "SelectTrigger");
__turbopack_context__.k.register(_c3, "SelectScrollUpButton");
__turbopack_context__.k.register(_c4, "SelectScrollDownButton");
__turbopack_context__.k.register(_c5, "SelectContent$React.forwardRef");
__turbopack_context__.k.register(_c6, "SelectContent");
__turbopack_context__.k.register(_c7, "SelectLabel$React.forwardRef");
__turbopack_context__.k.register(_c8, "SelectLabel");
__turbopack_context__.k.register(_c9, "SelectItem$React.forwardRef");
__turbopack_context__.k.register(_c10, "SelectItem");
__turbopack_context__.k.register(_c11, "SelectSeparator$React.forwardRef");
__turbopack_context__.k.register(_c12, "SelectSeparator");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
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
"[project]/components/ui/checkbox.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Checkbox",
    ()=>Checkbox
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$checkbox$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-checkbox/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
;
const Checkbox = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, checked, defaultChecked, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$checkbox$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground", className),
        ...props,
        ...checked !== undefined ? {
            checked
        } : {},
        ...defaultChecked !== undefined ? {
            defaultChecked
        } : {},
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$checkbox$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Indicator"], {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center justify-center text-current"),
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                className: "h-4 w-4"
            }, void 0, false, {
                fileName: "[project]/components/ui/checkbox.tsx",
                lineNumber: 31,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/components/ui/checkbox.tsx",
            lineNumber: 28,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/components/ui/checkbox.tsx",
        lineNumber: 18,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c1 = Checkbox;
Checkbox.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$checkbox$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"].displayName;
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Checkbox$React.forwardRef");
__turbopack_context__.k.register(_c1, "Checkbox");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/label.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Label",
    ()=>Label
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$label$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-label/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
;
const labelVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");
const Label = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$label$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(labelVariants(), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/label.tsx",
        lineNumber: 16,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c1 = Label;
Label.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$label$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"].displayName;
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Label$React.forwardRef");
__turbopack_context__.k.register(_c1, "Label");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/dialog.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-dialog/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$modal$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/modal-context.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
// Use the original Dialog component
const Dialog = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"];
// Create a Context to pass ID through the Dialog component tree
const DialogContext = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"]("");
// Provider component that accepts an ID
const DialogProvider = ({ id, children })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DialogContext.Provider, {
        value: id,
        children: children
    }, void 0, false, {
        fileName: "[project]/components/ui/dialog.tsx",
        lineNumber: 16,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
_c = DialogProvider;
const DialogTrigger = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"];
const DialogPortal = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"];
const DialogClose = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Close"];
const DialogOverlay = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Overlay"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dialog.tsx",
        lineNumber: 29,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c1 = DialogOverlay;
DialogOverlay.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Overlay"].displayName;
const DialogContent = /*#__PURE__*/ _s(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c2 = _s(({ className, children, id: propId, open, ...props }, ref)=>{
    _s();
    // Use either the prop id or the id from context
    const contextId = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"](DialogContext);
    const id = propId || contextId || `dialog-${__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"]()}`;
    // Register with our modal context using the open prop
    const { zIndex } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$modal$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useModal"])(id, !!open, 'dialog');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DialogPortal, {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DialogOverlay, {
                style: {
                    zIndex: zIndex - 1
                }
            }, void 0, false, {
                fileName: "[project]/components/ui/dialog.tsx",
                lineNumber: 57,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
                ref: ref,
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("dialog-content fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-border bg-background p-6 shadow-lg sm:rounded-lg", className),
                style: {
                    zIndex
                },
                ...props,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DialogProvider, {
                    id: id,
                    children: [
                        children,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Close"], {
                            "aria-label": "Đóng",
                            className: "absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    className: "h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/components/ui/dialog.tsx",
                                    lineNumber: 73,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
}, "IeLBPFI31n0GTVSq28zxfMRan5E=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$modal$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useModal"]
    ];
})), "IeLBPFI31n0GTVSq28zxfMRan5E=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$modal$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useModal"]
    ];
});
_c3 = DialogContent;
DialogContent.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"].displayName;
const DialogHeader = ({ className, ...props })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col space-y-1.5 text-center sm:text-left", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dialog.tsx",
        lineNumber: 87,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
_c4 = DialogHeader;
DialogHeader.displayName = "DialogHeader";
const DialogFooter = ({ className, ...props })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dialog.tsx",
        lineNumber: 101,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
_c5 = DialogFooter;
DialogFooter.displayName = "DialogFooter";
const DialogTitle = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c6 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Title"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-lg font-semibold leading-none tracking-tight", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dialog.tsx",
        lineNumber: 115,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c7 = DialogTitle;
DialogTitle.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Title"].displayName;
const DialogDescription = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c8 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Description"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-sm text-muted-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dialog.tsx",
        lineNumber: 130,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c9 = DialogDescription;
DialogDescription.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Description"].displayName;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9;
__turbopack_context__.k.register(_c, "DialogProvider");
__turbopack_context__.k.register(_c1, "DialogOverlay");
__turbopack_context__.k.register(_c2, "DialogContent$React.forwardRef");
__turbopack_context__.k.register(_c3, "DialogContent");
__turbopack_context__.k.register(_c4, "DialogHeader");
__turbopack_context__.k.register(_c5, "DialogFooter");
__turbopack_context__.k.register(_c6, "DialogTitle$React.forwardRef");
__turbopack_context__.k.register(_c7, "DialogTitle");
__turbopack_context__.k.register(_c8, "DialogDescription$React.forwardRef");
__turbopack_context__.k.register(_c9, "DialogDescription");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/separator.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Separator",
    ()=>Separator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$separator$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-separator/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
const Separator = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, orientation = "horizontal", decorative = true, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$separator$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        ref: ref,
        decorative: decorative,
        orientation: orientation,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("shrink-0 bg-border", orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/separator.tsx",
        lineNumber: 16,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0)));
_c1 = Separator;
Separator.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$separator$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"].displayName;
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Separator$React.forwardRef");
__turbopack_context__.k.register(_c1, "Separator");
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
    if (__TURBOPACK__import$2e$meta__.env?.DEV) {
        return '/api';
    }
    return __TURBOPACK__import$2e$meta__.env?.VITE_API_BASE_URL || 'http://localhost:3001/api';
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
        } catch (error) {
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
"[project]/features/settings/printer/print-templates-page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PrintTemplatesPage",
    ()=>PrintTemplatesPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/printer.js [app-client] (ecmascript) <export default as Printer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/save.js [app-client] (ecmascript) <export default as Save>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$code$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Code$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/code.js [app-client] (ecmascript) <export default as Code>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bold$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bold$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bold.js [app-client] (ecmascript) <export default as Bold>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$italic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Italic$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/italic.js [app-client] (ecmascript) <export default as Italic>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$strikethrough$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Strikethrough$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/strikethrough.js [app-client] (ecmascript) <export default as Strikethrough>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$underline$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Underline$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/underline.js [app-client] (ecmascript) <export default as Underline>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$table$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Table$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/table.js [app-client] (ecmascript) <export default as Table>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/image.js [app-client] (ecmascript) <export default as Image>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$text$2d$align$2d$start$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlignLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/text-align-start.js [app-client] (ecmascript) <export default as AlignLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$text$2d$align$2d$center$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlignCenter$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/text-align-center.js [app-client] (ecmascript) <export default as AlignCenter>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$text$2d$align$2d$end$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlignRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/text-align-end.js [app-client] (ecmascript) <export default as AlignRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$text$2d$align$2d$justify$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlignJustify$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/text-align-justify.js [app-client] (ecmascript) <export default as AlignJustify>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__List$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/list.js [app-client] (ecmascript) <export default as List>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2d$ordered$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ListOrdered$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/list-ordered.js [app-client] (ecmascript) <export default as ListOrdered>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$quote$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Quote$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/quote.js [app-client] (ecmascript) <export default as Quote>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$undo$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Undo$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/undo.js [app-client] (ecmascript) <export default as Undo>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$redo$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Redo$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/redo.js [app-client] (ecmascript) <export default as Redo>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/minus.js [app-client] (ecmascript) <export default as Minus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rows$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Rows$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/rows-2.js [app-client] (ecmascript) <export default as Rows>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$columns$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Columns$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/columns-2.js [app-client] (ecmascript) <export default as Columns>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Link2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/link-2.js [app-client] (ecmascript) <export default as Link2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/upload.js [app-client] (ecmascript) <export default as Upload>");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$use$2d$settings$2d$page$2d$header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/use-settings-page-header.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/types.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/features/settings/printer/preview-data.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/features/settings/printer/preview/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$variables$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/features/settings/printer/variables/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/branches/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/select.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/textarea.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/checkbox.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/label.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dropdown-menu.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$scroll$2d$area$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/scroll-area.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$separator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/separator.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$file$2d$upload$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/file-upload-api.ts [app-client] (ecmascript)");
// TipTap imports
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$react$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/react/dist/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$starter$2d$kit$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/starter-kit/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$underline$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/extension-underline/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$text$2d$align$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/extension-text-align/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$table$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/extension-table/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$table$2d$row$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/extension-table-row/dist/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$table$2d$cell$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/extension-table-cell/dist/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$table$2d$header$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/extension-table-header/dist/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$text$2d$style$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/extension-text-style/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$color$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/extension-color/dist/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$highlight$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/extension-highlight/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$image$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/extension-image/dist/index.js [app-client] (ecmascript)");
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
// Use template types from types.ts
const TEMPLATE_TYPES = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TEMPLATE_TYPES"];
const PAPER_SIZES = [
    {
        value: 'A4',
        label: 'Khổ in A4'
    },
    {
        value: 'A5',
        label: 'Khổ in A5'
    },
    {
        value: 'A6',
        label: 'Khổ in A6'
    },
    {
        value: 'K80',
        label: 'Khổ in K80'
    },
    {
        value: 'K57',
        label: 'Khổ in K57'
    }
];
const FONT_SIZES = [
    {
        value: '10px',
        label: '10'
    },
    {
        value: '12px',
        label: '12'
    },
    {
        value: '14px',
        label: '14'
    },
    {
        value: '16px',
        label: '16'
    },
    {
        value: '18px',
        label: '18'
    },
    {
        value: '20px',
        label: '20'
    },
    {
        value: '24px',
        label: '24'
    },
    {
        value: '28px',
        label: '28'
    },
    {
        value: '32px',
        label: '32'
    }
];
const TEXT_COLORS = [
    {
        value: '#000000',
        label: 'Đen'
    },
    {
        value: '#dc2626',
        label: 'Đỏ'
    },
    {
        value: '#ea580c',
        label: 'Cam'
    },
    {
        value: '#ca8a04',
        label: 'Vàng đậm'
    },
    {
        value: '#16a34a',
        label: 'Xanh lá'
    },
    {
        value: '#2563eb',
        label: 'Xanh dương'
    },
    {
        value: '#7c3aed',
        label: 'Tím'
    }
];
const HIGHLIGHT_COLORS = [
    {
        value: '#fef08a',
        label: 'Vàng'
    },
    {
        value: '#bbf7d0',
        label: 'Xanh lá nhạt'
    },
    {
        value: '#bfdbfe',
        label: 'Xanh dương nhạt'
    },
    {
        value: '#fecaca',
        label: 'Đỏ nhạt'
    },
    {
        value: '#e9d5ff',
        label: 'Tím nhạt'
    }
];
function PrintTemplatesPage() {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$use$2d$settings$2d$page$2d$header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSettingsPageHeader"])({
        title: 'Tùy chỉnh mẫu in',
        subtitle: 'Tùy chỉnh các mẫu in hóa đơn, phiếu thu chi, bảo hành...',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__["Printer"], {
            className: "h-5 w-5"
        }, void 0, false, {
            fileName: "[project]/features/settings/printer/print-templates-page.tsx",
            lineNumber: 149,
            columnNumber: 11
        }, this)
    });
    const { updateTemplate, updateTemplateAllBranches, resetTemplate, getTemplate, setDefaultSize, getDefaultSize } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePrintTemplateStore"])();
    const branchStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBranchStore"])();
    const branches = branchStore.data;
    const defaultBranch = branches.find((b)=>b.isDefault) || branches[0];
    const [selectedBranch, setSelectedBranch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(defaultBranch?.systemId || '');
    const [selectedType, setSelectedType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('order');
    const [selectedSize, setSelectedSize] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "PrintTemplatesPage.useState": ()=>getDefaultSize('order')
    }["PrintTemplatesPage.useState"]);
    const [content, setContent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [previewHtml, setPreviewHtml] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [isDefaultSize, setIsDefaultSize] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showExitDialog, setShowExitDialog] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showVariablesDialog, setShowVariablesDialog] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [searchVar, setSearchVar] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [copiedVar, setCopiedVar] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isHtmlMode, setIsHtmlMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isUploading, setIsUploading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const fileInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [contextMenu, setContextMenu] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showImageUrlDialog, setShowImageUrlDialog] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [imageUrl, setImageUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [showResetDialog, setShowResetDialog] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [originalContent, setOriginalContent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(''); // Track original content for dirty check
    // Handle context menu (right-click) - chỉ hiển thị khi ở trong bảng
    const handleContextMenu = (e)=>{
        if (isHtmlMode) return;
        // Chỉ hiển thị context menu khi cursor ở trong bảng
        if (editor?.isActive('table')) {
            e.preventDefault();
            setContextMenu({
                x: e.clientX,
                y: e.clientY
            });
        }
    };
    // Close context menu
    const closeContextMenu = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PrintTemplatesPage.useCallback[closeContextMenu]": ()=>{
            setContextMenu(null);
        }
    }["PrintTemplatesPage.useCallback[closeContextMenu]"], []);
    // Close context menu when clicking outside
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PrintTemplatesPage.useEffect": ()=>{
            const handleClick = {
                "PrintTemplatesPage.useEffect.handleClick": ()=>closeContextMenu()
            }["PrintTemplatesPage.useEffect.handleClick"];
            const handleKeyDown = {
                "PrintTemplatesPage.useEffect.handleKeyDown": (e)=>{
                    if (e.key === 'Escape') closeContextMenu();
                }
            }["PrintTemplatesPage.useEffect.handleKeyDown"];
            if (contextMenu) {
                document.addEventListener('click', handleClick);
                document.addEventListener('keydown', handleKeyDown);
                return ({
                    "PrintTemplatesPage.useEffect": ()=>{
                        document.removeEventListener('click', handleClick);
                        document.removeEventListener('keydown', handleKeyDown);
                    }
                })["PrintTemplatesPage.useEffect"];
            }
        }
    }["PrintTemplatesPage.useEffect"], [
        contextMenu,
        closeContextMenu
    ]);
    // Initialize TipTap editor
    const editor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$react$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useEditor"])({
        immediatelyRender: false,
        extensions: [
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$starter$2d$kit$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].configure({
                heading: {
                    levels: [
                        1,
                        2,
                        3,
                        4
                    ]
                }
            }),
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$underline$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$text$2d$align$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].configure({
                types: [
                    'heading',
                    'paragraph'
                ]
            }),
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$table$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Table"].configure({
                resizable: true
            }),
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$table$2d$row$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"],
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$table$2d$header$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"],
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$table$2d$cell$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"],
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$text$2d$style$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextStyle"],
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$text$2d$style$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"],
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$highlight$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].configure({
                multicolor: true
            }),
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$image$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
        ],
        content: '',
        onUpdate: {
            "PrintTemplatesPage.useEditor[editor]": ({ editor })=>{
                if (!isHtmlMode) {
                    const newContent = editor.getHTML();
                    setContent(newContent);
                    setHasUnsavedChanges(newContent !== originalContent);
                }
            }
        }["PrintTemplatesPage.useEditor[editor]"]
    });
    // Load default size when type changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PrintTemplatesPage.useEffect": ()=>{
            const defaultSize = getDefaultSize(selectedType);
            setSelectedSize(defaultSize);
            setIsDefaultSize(true); // Vì đang load khổ mặc định
        }
    }["PrintTemplatesPage.useEffect"], [
        selectedType,
        getDefaultSize
    ]);
    // Load template content when type or size changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PrintTemplatesPage.useEffect": ()=>{
            const template = getTemplate(selectedType, selectedSize, selectedBranch);
            setContent(template.content);
            setOriginalContent(template.content);
            setHasUnsavedChanges(false);
            if (editor && !isHtmlMode) {
                editor.commands.setContent(template.content);
            }
        }
    }["PrintTemplatesPage.useEffect"], [
        selectedType,
        selectedSize,
        selectedBranch,
        getTemplate,
        editor,
        isHtmlMode
    ]);
    // Check if current size is default size
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PrintTemplatesPage.useEffect": ()=>{
            const defaultSize = getDefaultSize(selectedType);
            setIsDefaultSize(selectedSize === defaultSize);
        }
    }["PrintTemplatesPage.useEffect"], [
        selectedSize,
        selectedType,
        getDefaultSize
    ]);
    // Update preview when content changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PrintTemplatesPage.useEffect": ()=>{
            let html = content;
            const data = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$preview$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["PREVIEW_DATA"][selectedType];
            if (data) {
                Object.entries(data).forEach({
                    "PrintTemplatesPage.useEffect": ([key, value])=>{
                        html = html.split(key).join(value);
                    }
                }["PrintTemplatesPage.useEffect"]);
            }
            setPreviewHtml(html);
        }
    }["PrintTemplatesPage.useEffect"], [
        content,
        selectedType
    ]);
    // Handle save for current branch
    const handleSave = ()=>{
        updateTemplate(selectedType, selectedSize, content, selectedBranch);
        if (isDefaultSize) {
            setDefaultSize(selectedType, selectedSize);
        }
        setOriginalContent(content);
        setHasUnsavedChanges(false);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Đã lưu mẫu in thành công');
    };
    // Handle save for all branches
    const handleSaveAllBranches = ()=>{
        updateTemplateAllBranches(selectedType, selectedSize, content);
        if (isDefaultSize) {
            setDefaultSize(selectedType, selectedSize);
        }
        setOriginalContent(content);
        setHasUnsavedChanges(false);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Đã lưu và áp dụng mẫu in cho tất cả chi nhánh');
    };
    // Handle exit with unsaved changes check
    const handleExit = ()=>{
        if (hasUnsavedChanges) {
            setShowExitDialog(true);
        } else {
            window.history.back();
        }
    };
    // Confirm exit without saving
    const confirmExit = ()=>{
        setShowExitDialog(false);
        window.history.back();
    };
    // Handle default size checkbox change
    const handleDefaultSizeChange = (checked)=>{
        setIsDefaultSize(checked);
        if (checked) {
            setDefaultSize(selectedType, selectedSize);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(`Đã đặt ${selectedSize} làm khổ in mặc định cho ${TEMPLATE_TYPES.find((t)=>t.value === selectedType)?.label}`);
        }
    };
    const handleReset = ()=>{
        setShowResetDialog(true);
    };
    // Confirm reset template
    const confirmReset = ()=>{
        resetTemplate(selectedType, selectedSize);
        const template = getTemplate(selectedType, selectedSize);
        setContent(template.content);
        if (editor) {
            editor.commands.setContent(template.content);
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Đã khôi phục mẫu mặc định');
        setShowResetDialog(false);
    };
    // Toggle HTML/WYSIWYG mode
    const toggleHtmlMode = ()=>{
        if (isHtmlMode && editor) {
            // Switching from HTML to WYSIWYG - apply HTML content to editor
            editor.commands.setContent(content);
        } else if (!isHtmlMode && editor) {
            // Switching from WYSIWYG to HTML - get HTML from editor
            setContent(editor.getHTML());
        }
        setIsHtmlMode(!isHtmlMode);
    };
    // Handle HTML textarea change
    const handleHtmlChange = (value)=>{
        setContent(value);
    };
    const handlePrint = ()=>{
        // Tạo iframe ẩn để in trực tiếp không mở tab mới
        const printFrame = document.createElement('iframe');
        printFrame.style.position = 'absolute';
        printFrame.style.top = '-10000px';
        printFrame.style.left = '-10000px';
        document.body.appendChild(printFrame);
        const printDoc = printFrame.contentDocument || printFrame.contentWindow?.document;
        if (printDoc) {
            printDoc.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>In thử - ${TEMPLATE_TYPES.find((t)=>t.value === selectedType)?.label}</title>
          <style>
            * { box-sizing: border-box; }
            body { 
              font-family: 'Times New Roman', Times, serif;
              font-size: 13px;
              line-height: 1.5;
              margin: 0;
              padding: 20px;
              color: #000;
            }
            h1, h2, h3, h4 { margin: 0.5em 0; }
            h2 { font-size: 18px; font-weight: bold; }
            p { margin: 0.3em 0; }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 10px 0;
            }
            th, td { 
              border: 1px solid #333; 
              padding: 6px 8px; 
              text-align: left;
              vertical-align: top;
            }
            th { 
              background: #f0f0f0; 
              font-weight: bold;
            }
            strong { font-weight: bold; }
            em { font-style: italic; }
            hr { border: none; border-top: 1px solid #333; margin: 10px 0; }
            ul { margin: 0.5em 0; padding-left: 25px; list-style-type: disc; }
            ol { margin: 0.5em 0; padding-left: 25px; list-style-type: decimal; }
            li { margin: 0.2em 0; display: list-item; }
            img { max-width: 100%; height: auto; }
            @media print { 
              body { padding: 0; } 
              @page { margin: 15mm; }
            }
          </style>
        </head>
        <body>${previewHtml}</body>
        </html>
      `);
            printDoc.close();
            // Đợi load xong rồi in - chỉ gọi 1 lần
            setTimeout(()=>{
                printFrame.contentWindow?.print();
                // Xóa iframe sau khi in
                setTimeout(()=>{
                    if (document.body.contains(printFrame)) {
                        document.body.removeChild(printFrame);
                    }
                }, 1000);
            }, 100);
        }
    };
    const insertVariable = (variable)=>{
        if (isHtmlMode) {
            // Insert at cursor position in textarea
            const textarea = document.querySelector('textarea');
            if (textarea) {
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const newContent = content.substring(0, start) + variable + content.substring(end);
                setContent(newContent);
                // Focus and set cursor after inserted variable
                setTimeout(()=>{
                    textarea.focus();
                    textarea.setSelectionRange(start + variable.length, start + variable.length);
                }, 0);
            } else {
                setContent(content + variable);
            }
        } else if (editor) {
            // Insert in TipTap editor at cursor position
            editor.chain().focus().insertContent(variable).run();
        }
        setCopiedVar(variable);
        setTimeout(()=>setCopiedVar(null), 1500);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(`Đã thêm: ${variable}`);
    };
    // Add image from URL - show dialog
    const addImage = ()=>{
        setShowImageUrlDialog(true);
    };
    // Confirm insert image from URL
    const confirmAddImage = ()=>{
        if (imageUrl && editor) {
            editor.chain().focus().setImage({
                src: imageUrl
            }).run();
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Đã chèn hình ảnh');
        }
        setImageUrl('');
        setShowImageUrlDialog(false);
    };
    // Upload image handler
    const handleImageUpload = async (file)=>{
        if (!file || !editor) return;
        // Validate file type
        if (!file.type.startsWith('image/')) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Chỉ hỗ trợ file hình ảnh');
            return;
        }
        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Kích thước file không được vượt quá 5MB');
            return;
        }
        setIsUploading(true);
        try {
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$file$2d$upload$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FileUploadAPI"].uploadPrintTemplateImage(file);
            editor.chain().focus().setImage({
                src: result.url
            }).run();
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Đã tải hình ảnh lên thành công');
        } catch (error) {
            console.error('Upload error:', error);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Không thể tải hình ảnh lên');
        } finally{
            setIsUploading(false);
        }
    };
    // Handle file input change
    const handleFileInputChange = (e)=>{
        const file = e.target.files?.[0];
        if (file) {
            handleImageUpload(file);
        }
        // Reset input
        if (e.target) {
            e.target.value = '';
        }
    };
    // Handle paste event for images
    const handlePaste = async (e)=>{
        const items = e.clipboardData?.items;
        if (!items) return;
        for(let i = 0; i < items.length; i++){
            if (items[i].type.indexOf('image') !== -1) {
                e.preventDefault();
                const file = items[i].getAsFile();
                if (file) {
                    await handleImageUpload(file);
                }
                break;
            }
        }
    };
    // Handle drop event for images
    const handleDrop = async (e)=>{
        const files = e.dataTransfer?.files;
        if (!files || files.length === 0) return;
        const file = files[0];
        if (file.type.startsWith('image/')) {
            e.preventDefault();
            await handleImageUpload(file);
        }
    };
    // Trigger file input click
    const triggerImageUpload = ()=>{
        fileInputRef.current?.click();
    };
    // Filter variables by search
    const filteredVariables = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$variables$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["TEMPLATE_VARIABLES"][selectedType]?.filter((v)=>searchVar === '' || v.key.toLowerCase().includes(searchVar.toLowerCase()) || v.label.toLowerCase().includes(searchVar.toLowerCase())) || [];
    // Group variables by group
    const groupedVariables = filteredVariables.reduce((acc, v)=>{
        const group = v.group || 'Khác';
        if (!acc[group]) acc[group] = [];
        acc[group].push(v);
        return acc;
    }, {});
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                type: "file",
                ref: fileInputRef,
                accept: "image/*",
                onChange: handleFileInputChange,
                className: "hidden"
            }, void 0, false, {
                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                lineNumber: 568,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-end justify-between gap-4 flex-wrap",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-end gap-6 flex-wrap",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-1.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                        className: "text-sm font-medium",
                                        children: "Chọn mẫu in"
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                        lineNumber: 580,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                                        value: selectedType,
                                        onValueChange: (v)=>setSelectedType(v),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                                className: "w-[200px]",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectValue"], {}, void 0, false, {
                                                    fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                    lineNumber: 583,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                lineNumber: 582,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectContent"], {
                                                children: TEMPLATE_TYPES.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                        value: item.value,
                                                        children: item.label
                                                    }, item.value, false, {
                                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                        lineNumber: 587,
                                                        columnNumber: 19
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                lineNumber: 585,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                        lineNumber: 581,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                lineNumber: 579,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-1.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                        className: "text-sm font-medium",
                                        children: "Chọn chi nhánh áp dụng"
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                        lineNumber: 596,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                                        value: selectedBranch,
                                        onValueChange: setSelectedBranch,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                                className: "w-[200px]",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectValue"], {}, void 0, false, {
                                                    fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                    lineNumber: 599,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                lineNumber: 598,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectContent"], {
                                                children: branches.map((branch)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                        value: branch.systemId,
                                                        children: branch.isDefault ? `${branch.name} (mặc định)` : branch.name
                                                    }, branch.systemId, false, {
                                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                        lineNumber: 603,
                                                        columnNumber: 19
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                lineNumber: 601,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                        lineNumber: 597,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                lineNumber: 595,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-1.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                        className: "text-sm font-medium",
                                        children: "Chọn khổ in"
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                        lineNumber: 612,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                                        value: selectedSize,
                                        onValueChange: (v)=>setSelectedSize(v),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                                className: "w-[160px]",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectValue"], {}, void 0, false, {
                                                    fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                    lineNumber: 615,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                lineNumber: 614,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectContent"], {
                                                children: PAPER_SIZES.map((size)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                        value: size.value,
                                                        children: size.label
                                                    }, size.value, false, {
                                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                        lineNumber: 619,
                                                        columnNumber: 19
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                lineNumber: 617,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                        lineNumber: 613,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                lineNumber: 611,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 pb-0.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Checkbox"], {
                                        id: "default-size",
                                        checked: isDefaultSize,
                                        onCheckedChange: (checked)=>handleDefaultSizeChange(!!checked)
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                        lineNumber: 628,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                        htmlFor: "default-size",
                                        className: "text-sm cursor-pointer",
                                        children: "Đặt làm khổ in mặc định"
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                        lineNumber: 633,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                lineNumber: 627,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                        lineNumber: 578,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "outline",
                                onClick: handleExit,
                                children: "Thoát"
                            }, void 0, false, {
                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                lineNumber: 641,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "outline",
                                onClick: handleSaveAllBranches,
                                children: "Lưu & áp dụng tất cả chi nhánh"
                            }, void 0, false, {
                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                lineNumber: 644,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                onClick: handleSave,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__["Save"], {
                                        className: "h-4 w-4 mr-2"
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                        lineNumber: 648,
                                        columnNumber: 13
                                    }, this),
                                    "Lưu"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                lineNumber: 647,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                        lineNumber: 640,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                lineNumber: 577,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex gap-4 h-[calc(100vh-14rem)]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 flex flex-col border border-border rounded-lg overflow-hidden bg-background",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-1 px-3 py-2 border-b bg-muted/30 flex-wrap",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: isHtmlMode ? "default" : "outline",
                                        size: "sm",
                                        className: "h-8 gap-1.5 text-xs",
                                        onClick: toggleHtmlMode,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$code$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Code$3e$__["Code"], {
                                                className: "h-3.5 w-3.5"
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                lineNumber: 667,
                                                columnNumber: 15
                                            }, this),
                                            "Mã HTML"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                        lineNumber: 661,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$separator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"], {
                                        orientation: "vertical",
                                        className: "h-6 mx-1"
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                        lineNumber: 671,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "ghost",
                                        size: "sm",
                                        className: "h-8 w-8 p-0",
                                        onClick: ()=>editor?.chain().focus().undo().run(),
                                        disabled: !editor?.can().undo() || isHtmlMode,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$undo$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Undo$3e$__["Undo"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                            lineNumber: 681,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                        lineNumber: 674,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "ghost",
                                        size: "sm",
                                        className: "h-8 w-8 p-0",
                                        onClick: ()=>editor?.chain().focus().redo().run(),
                                        disabled: !editor?.can().redo() || isHtmlMode,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$redo$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Redo$3e$__["Redo"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                            lineNumber: 690,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                        lineNumber: 683,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$separator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"], {
                                        orientation: "vertical",
                                        className: "h-6 mx-1"
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                        lineNumber: 693,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenu"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                                                asChild: true,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                    variant: "ghost",
                                                    size: "sm",
                                                    className: "h-8 text-xs text-muted-foreground",
                                                    disabled: isHtmlMode,
                                                    children: [
                                                        "Định dạng ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                            className: "h-3 w-3 ml-1"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                            lineNumber: 704,
                                                            columnNumber: 29
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                    lineNumber: 698,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                lineNumber: 697,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                        onClick: ()=>editor?.chain().focus().setParagraph().run(),
                                                        children: "Đoạn văn"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                        lineNumber: 708,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                        onClick: ()=>editor?.chain().focus().toggleHeading({
                                                                level: 1
                                                            }).run(),
                                                        children: "Tiêu đề 1"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                        lineNumber: 711,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                        onClick: ()=>editor?.chain().focus().toggleHeading({
                                                                level: 2
                                                            }).run(),
                                                        children: "Tiêu đề 2"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                        lineNumber: 714,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                        onClick: ()=>editor?.chain().focus().toggleHeading({
                                                                level: 3
                                                            }).run(),
                                                        children: "Tiêu đề 3"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                        lineNumber: 717,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                        onClick: ()=>editor?.chain().focus().toggleHeading({
                                                                level: 4
                                                            }).run(),
                                                        children: "Tiêu đề 4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                        lineNumber: 720,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                lineNumber: 707,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                        lineNumber: 696,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenu"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                                                asChild: true,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                    variant: "ghost",
                                                    size: "sm",
                                                    className: "h-8 px-2 relative",
                                                    disabled: isHtmlMode,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-sm font-bold",
                                                            children: "A"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                            lineNumber: 735,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-current"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                            lineNumber: 736,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                            className: "h-3 w-3 ml-0.5"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                            lineNumber: 737,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                    lineNumber: 729,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                lineNumber: 728,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                                                children: [
                                                    TEXT_COLORS.map((color)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                            onClick: ()=>editor?.chain().focus().setColor(color.value).run(),
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "w-4 h-4 rounded mr-2",
                                                                    style: {
                                                                        backgroundColor: color.value
                                                                    }
                                                                }, void 0, false, {
                                                                    fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                                    lineNumber: 746,
                                                                    columnNumber: 21
                                                                }, this),
                                                                color.label
                                                            ]
                                                        }, color.value, true, {
                                                            fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                            lineNumber: 742,
                                                            columnNumber: 19
                                                        }, this)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                        lineNumber: 753,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                        onClick: ()=>editor?.chain().focus().unsetColor().run(),
                                                        children: "Xóa màu chữ"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                        lineNumber: 754,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                lineNumber: 740,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                        lineNumber: 727,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenu"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                                                asChild: true,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                    variant: "ghost",
                                                    size: "sm",
                                                    className: "h-8 px-2",
                                                    disabled: isHtmlMode,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-sm font-bold bg-yellow-200 px-1",
                                                            children: "A"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                            lineNumber: 769,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                            className: "h-3 w-3 ml-0.5"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                            lineNumber: 770,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                    lineNumber: 763,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                lineNumber: 762,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                                                children: [
                                                    HIGHLIGHT_COLORS.map((color)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                            onClick: ()=>editor?.chain().focus().toggleHighlight({
                                                                    color: color.value
                                                                }).run(),
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "w-4 h-4 rounded mr-2",
                                                                    style: {
                                                                        backgroundColor: color.value
                                                                    }
                                                                }, void 0, false, {
                                                                    fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                                    lineNumber: 779,
                                                                    columnNumber: 21
                                                                }, this),
                                                                color.label
                                                            ]
                                                        }, color.value, true, {
                                                            fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                            lineNumber: 775,
                                                            columnNumber: 19
                                                        }, this)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                        lineNumber: 786,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                        onClick: ()=>editor?.chain().focus().unsetHighlight().run(),
                                                        children: "Xóa highlight"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                        lineNumber: 787,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                lineNumber: 773,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                        lineNumber: 761,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$separator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"], {
                                        orientation: "vertical",
                                        className: "h-6 mx-1"
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                        lineNumber: 793,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenu"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                                                asChild: true,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                    variant: "ghost",
                                                    size: "sm",
                                                    className: "h-8 px-2",
                                                    disabled: isHtmlMode || isUploading,
                                                    children: [
                                                        isUploading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                            lineNumber: 805,
                                                            columnNumber: 21
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__["Image"], {
                                                            className: "h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                            lineNumber: 807,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                            className: "h-3 w-3 ml-0.5"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                            lineNumber: 809,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                    lineNumber: 798,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                lineNumber: 797,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                        onClick: triggerImageUpload,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                                                                className: "h-4 w-4 mr-2"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                                lineNumber: 814,
                                                                columnNumber: 19
                                                            }, this),
                                                            "Tải ảnh lên"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                        lineNumber: 813,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                        onClick: addImage,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Link2$3e$__["Link2"], {
                                                                className: "h-4 w-4 mr-2"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                                lineNumber: 818,
                                                                columnNumber: 19
                                                            }, this),
                                                            "Chèn URL ảnh"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                        lineNumber: 817,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                lineNumber: 812,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                        lineNumber: 796,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenu"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                                                asChild: true,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                    variant: "ghost",
                                                    size: "sm",
                                                    className: "h-8 px-2",
                                                    disabled: isHtmlMode,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$table$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Table$3e$__["Table"], {
                                                            className: "h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                            lineNumber: 833,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                            className: "h-3 w-3 ml-0.5"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                            lineNumber: 834,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                    lineNumber: 827,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                lineNumber: 826,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                        onClick: ()=>editor?.chain().focus().insertTable({
                                                                rows: 3,
                                                                cols: 3,
                                                                withHeaderRow: true
                                                            }).run(),
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$table$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Table$3e$__["Table"], {
                                                                className: "h-4 w-4 mr-2"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                                lineNumber: 841,
                                                                columnNumber: 19
                                                            }, this),
                                                            "Chèn bảng 3x3"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                        lineNumber: 838,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                        onClick: ()=>editor?.chain().focus().insertTable({
                                                                rows: 4,
                                                                cols: 4,
                                                                withHeaderRow: true
                                                            }).run(),
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$table$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Table$3e$__["Table"], {
                                                                className: "h-4 w-4 mr-2"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                                lineNumber: 847,
                                                                columnNumber: 19
                                                            }, this),
                                                            "Chèn bảng 4x4"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                        lineNumber: 844,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                        onClick: ()=>editor?.chain().focus().insertTable({
                                                                rows: 5,
                                                                cols: 5,
                                                                withHeaderRow: true
                                                            }).run(),
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$table$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Table$3e$__["Table"], {
                                                                className: "h-4 w-4 mr-2"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                                lineNumber: 853,
                                                                columnNumber: 19
                                                            }, this),
                                                            "Chèn bảng 5x5"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                        lineNumber: 850,
                                                        columnNumber: 17
                                                    }, this),
                                                    editor?.isActive('table') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                                                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                                lineNumber: 858,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                                onClick: ()=>editor?.chain().focus().addColumnAfter().run(),
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$columns$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Columns$3e$__["Columns"], {
                                                                        className: "h-4 w-4 mr-2"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                                        lineNumber: 860,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    "Thêm cột"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                                lineNumber: 859,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                                onClick: ()=>editor?.chain().focus().addRowAfter().run(),
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rows$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Rows$3e$__["Rows"], {
                                                                        className: "h-4 w-4 mr-2"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                                        lineNumber: 864,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    "Thêm hàng"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                                lineNumber: 863,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                                onClick: ()=>editor?.chain().focus().deleteColumn().run(),
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__["Minus"], {
                                                                        className: "h-4 w-4 mr-2"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                                        lineNumber: 868,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    "Xóa cột"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                                lineNumber: 867,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                                onClick: ()=>editor?.chain().focus().deleteRow().run(),
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__["Minus"], {
                                                                        className: "h-4 w-4 mr-2"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                                        lineNumber: 872,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    "Xóa hàng"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                                lineNumber: 871,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                                onClick: ()=>editor?.chain().focus().deleteTable().run(),
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                                        className: "h-4 w-4 mr-2"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                                        lineNumber: 876,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    "Xóa bảng"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                                lineNumber: 875,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                lineNumber: 837,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                        lineNumber: 825,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$separator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"], {
                                        orientation: "vertical",
                                        className: "h-6 mx-1"
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                        lineNumber: 884,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "ghost",
                                        size: "sm",
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-8 w-8 p-0", editor?.isActive('bold') && "bg-muted"),
                                        onClick: ()=>editor?.chain().focus().toggleBold().run(),
                                        disabled: isHtmlMode,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bold$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bold$3e$__["Bold"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                            lineNumber: 894,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                        lineNumber: 887,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "ghost",
                                        size: "sm",
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-8 w-8 p-0", editor?.isActive('italic') && "bg-muted"),
                                        onClick: ()=>editor?.chain().focus().toggleItalic().run(),
                                        disabled: isHtmlMode,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$italic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Italic$3e$__["Italic"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                            lineNumber: 903,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                        lineNumber: 896,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "ghost",
                                        size: "sm",
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-8 w-8 p-0", editor?.isActive('strike') && "bg-muted"),
                                        onClick: ()=>editor?.chain().focus().toggleStrike().run(),
                                        disabled: isHtmlMode,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$strikethrough$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Strikethrough$3e$__["Strikethrough"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                            lineNumber: 912,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                        lineNumber: 905,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "ghost",
                                        size: "sm",
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-8 w-8 p-0", editor?.isActive('underline') && "bg-muted"),
                                        onClick: ()=>editor?.chain().focus().toggleUnderline().run(),
                                        disabled: isHtmlMode,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$underline$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Underline$3e$__["Underline"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                            lineNumber: 921,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                        lineNumber: 914,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1"
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                        lineNumber: 925,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "outline",
                                        size: "sm",
                                        className: "h-8 text-xs",
                                        onClick: handleReset,
                                        children: "Sử dụng mẫu có sẵn"
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                        lineNumber: 928,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"], {
                                        open: showVariablesDialog,
                                        onOpenChange: setShowVariablesDialog,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogTrigger"], {
                                                asChild: true,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                    size: "sm",
                                                    className: "h-8 text-xs",
                                                    children: "Thêm từ khóa"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                    lineNumber: 934,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                lineNumber: 933,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogContent"], {
                                                className: "max-w-3xl max-h-[80vh]",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogHeader"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogTitle"], {
                                                                children: "Danh sách từ khóa"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                                lineNumber: 940,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm text-muted-foreground",
                                                                children: "Từ khóa được chọn sẽ được thêm tại vị trí con trỏ chuột trên màn hình Sửa mẫu in."
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                                lineNumber: 941,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                        lineNumber: 939,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "relative",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                                className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                                lineNumber: 948,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                                placeholder: "Tìm kiếm từ khóa",
                                                                value: searchVar,
                                                                onChange: (e)=>setSearchVar(e.target.value),
                                                                className: "pl-9"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                                lineNumber: 949,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                        lineNumber: 947,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$scroll$2d$area$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollArea"], {
                                                        className: "h-[50vh] pr-4",
                                                        children: Object.entries(groupedVariables).map(([group, vars])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "mb-6",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                        className: "font-semibold text-sm mb-3 text-center",
                                                                        children: group
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                                        lineNumber: 960,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "grid grid-cols-2 gap-x-8 gap-y-2",
                                                                        children: vars.map((variable)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "flex items-center justify-between py-1.5 border-b",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "flex-1 min-w-0",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                className: "text-sm truncate",
                                                                                                children: variable.label
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                                                                lineNumber: 968,
                                                                                                columnNumber: 31
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                                                                                className: "text-xs text-muted-foreground",
                                                                                                children: variable.key
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                                                                lineNumber: 969,
                                                                                                columnNumber: 31
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                                                        lineNumber: 967,
                                                                                        columnNumber: 29
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                                        size: "sm",
                                                                                        variant: "outline",
                                                                                        className: "h-7 text-xs ml-2 shrink-0",
                                                                                        onClick: ()=>{
                                                                                            insertVariable(variable.key);
                                                                                            setShowVariablesDialog(false);
                                                                                        },
                                                                                        children: copiedVar === variable.key ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                                                            className: "h-3 w-3"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                                                            lineNumber: 981,
                                                                                            columnNumber: 33
                                                                                        }, this) : 'Chọn'
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                                                        lineNumber: 971,
                                                                                        columnNumber: 29
                                                                                    }, this)
                                                                                ]
                                                                            }, variable.key, true, {
                                                                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                                                lineNumber: 963,
                                                                                columnNumber: 27
                                                                            }, this))
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                                        lineNumber: 961,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, group, true, {
                                                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                                lineNumber: 959,
                                                                columnNumber: 21
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                        lineNumber: 957,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                lineNumber: 938,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                        lineNumber: 932,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                lineNumber: 659,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-1 px-3 py-1.5 border-b bg-muted/20",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "ghost",
                                        size: "sm",
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-7 w-7 p-0", editor?.isActive('bulletList') && "bg-muted"),
                                        onClick: ()=>editor?.chain().focus().toggleBulletList().run(),
                                        disabled: isHtmlMode,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__List$3e$__["List"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                            lineNumber: 1005,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                        lineNumber: 998,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "ghost",
                                        size: "sm",
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-7 w-7 p-0", editor?.isActive('orderedList') && "bg-muted"),
                                        onClick: ()=>editor?.chain().focus().toggleOrderedList().run(),
                                        disabled: isHtmlMode,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2d$ordered$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ListOrdered$3e$__["ListOrdered"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                            lineNumber: 1014,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                        lineNumber: 1007,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$separator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"], {
                                        orientation: "vertical",
                                        className: "h-5 mx-1"
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                        lineNumber: 1017,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "ghost",
                                        size: "sm",
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-7 w-7 p-0", editor?.isActive('blockquote') && "bg-muted"),
                                        onClick: ()=>editor?.chain().focus().toggleBlockquote().run(),
                                        disabled: isHtmlMode,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$quote$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Quote$3e$__["Quote"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                            lineNumber: 1026,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                        lineNumber: 1019,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$separator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"], {
                                        orientation: "vertical",
                                        className: "h-5 mx-1"
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                        lineNumber: 1029,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "ghost",
                                        size: "sm",
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-7 w-7 p-0", editor?.isActive({
                                            textAlign: 'left'
                                        }) && "bg-muted"),
                                        onClick: ()=>editor?.chain().focus().setTextAlign('left').run(),
                                        disabled: isHtmlMode,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$text$2d$align$2d$start$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlignLeft$3e$__["AlignLeft"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                            lineNumber: 1038,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                        lineNumber: 1031,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "ghost",
                                        size: "sm",
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-7 w-7 p-0", editor?.isActive({
                                            textAlign: 'center'
                                        }) && "bg-muted"),
                                        onClick: ()=>editor?.chain().focus().setTextAlign('center').run(),
                                        disabled: isHtmlMode,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$text$2d$align$2d$center$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlignCenter$3e$__["AlignCenter"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                            lineNumber: 1047,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                        lineNumber: 1040,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "ghost",
                                        size: "sm",
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-7 w-7 p-0", editor?.isActive({
                                            textAlign: 'right'
                                        }) && "bg-muted"),
                                        onClick: ()=>editor?.chain().focus().setTextAlign('right').run(),
                                        disabled: isHtmlMode,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$text$2d$align$2d$end$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlignRight$3e$__["AlignRight"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                            lineNumber: 1056,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                        lineNumber: 1049,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "ghost",
                                        size: "sm",
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-7 w-7 p-0", editor?.isActive({
                                            textAlign: 'justify'
                                        }) && "bg-muted"),
                                        onClick: ()=>editor?.chain().focus().setTextAlign('justify').run(),
                                        disabled: isHtmlMode,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$text$2d$align$2d$justify$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlignJustify$3e$__["AlignJustify"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                            lineNumber: 1065,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                        lineNumber: 1058,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$separator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"], {
                                        orientation: "vertical",
                                        className: "h-5 mx-1"
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                        lineNumber: 1068,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "ghost",
                                        size: "sm",
                                        className: "h-7 px-2 text-xs",
                                        onClick: ()=>editor?.chain().focus().setHorizontalRule().run(),
                                        disabled: isHtmlMode,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__["Minus"], {
                                                className: "h-4 w-4 mr-1"
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                lineNumber: 1077,
                                                columnNumber: 15
                                            }, this),
                                            "Đường kẻ"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                        lineNumber: 1070,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                lineNumber: 997,
                                columnNumber: 11
                            }, this),
                            isHtmlMode ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Textarea"], {
                                value: content,
                                onChange: (e)=>handleHtmlChange(e.target.value),
                                className: "flex-1 resize-none border-0 rounded-none focus-visible:ring-0 font-mono text-sm p-4",
                                spellCheck: false,
                                placeholder: "Nhập mã HTML cho mẫu in..."
                            }, void 0, false, {
                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                lineNumber: 1084,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 overflow-auto p-4 relative",
                                onContextMenu: handleContextMenu,
                                onPaste: handlePaste,
                                onDrop: handleDrop,
                                onDragOver: (e)=>e.preventDefault(),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$react$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["EditorContent"], {
                                        editor: editor,
                                        className: "prose prose-sm max-w-none min-h-full focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[400px]"
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                        lineNumber: 1099,
                                        columnNumber: 15
                                    }, this),
                                    contextMenu && editor?.isActive('table') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "fixed z-50 bg-popover border border-border rounded-md shadow-lg py-1 min-w-[180px]",
                                        style: {
                                            left: contextMenu.x,
                                            top: contextMenu.y
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "px-2 py-1.5 text-xs font-semibold text-muted-foreground border-b border-border mb-1",
                                                children: "Thao tác bảng"
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                lineNumber: 1110,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "w-full px-3 py-1.5 text-sm flex items-center gap-2 hover:bg-accent",
                                                onClick: ()=>{
                                                    editor?.chain().focus().addColumnBefore().run();
                                                    closeContextMenu();
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$columns$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Columns$3e$__["Columns"], {
                                                        className: "h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                        lineNumber: 1117,
                                                        columnNumber: 21
                                                    }, this),
                                                    " Thêm cột trước"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                lineNumber: 1113,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "w-full px-3 py-1.5 text-sm flex items-center gap-2 hover:bg-accent",
                                                onClick: ()=>{
                                                    editor?.chain().focus().addColumnAfter().run();
                                                    closeContextMenu();
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$columns$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Columns$3e$__["Columns"], {
                                                        className: "h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                        lineNumber: 1123,
                                                        columnNumber: 21
                                                    }, this),
                                                    " Thêm cột sau"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                lineNumber: 1119,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "w-full px-3 py-1.5 text-sm flex items-center gap-2 hover:bg-accent",
                                                onClick: ()=>{
                                                    editor?.chain().focus().deleteColumn().run();
                                                    closeContextMenu();
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__["Minus"], {
                                                        className: "h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                        lineNumber: 1129,
                                                        columnNumber: 21
                                                    }, this),
                                                    " Xóa cột"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                lineNumber: 1125,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "border-t border-border my-1"
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                lineNumber: 1131,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "w-full px-3 py-1.5 text-sm flex items-center gap-2 hover:bg-accent",
                                                onClick: ()=>{
                                                    editor?.chain().focus().addRowBefore().run();
                                                    closeContextMenu();
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rows$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Rows$3e$__["Rows"], {
                                                        className: "h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                        lineNumber: 1136,
                                                        columnNumber: 21
                                                    }, this),
                                                    " Thêm hàng trước"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                lineNumber: 1132,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "w-full px-3 py-1.5 text-sm flex items-center gap-2 hover:bg-accent",
                                                onClick: ()=>{
                                                    editor?.chain().focus().addRowAfter().run();
                                                    closeContextMenu();
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rows$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Rows$3e$__["Rows"], {
                                                        className: "h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                        lineNumber: 1142,
                                                        columnNumber: 21
                                                    }, this),
                                                    " Thêm hàng sau"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                lineNumber: 1138,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "w-full px-3 py-1.5 text-sm flex items-center gap-2 hover:bg-accent",
                                                onClick: ()=>{
                                                    editor?.chain().focus().deleteRow().run();
                                                    closeContextMenu();
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__["Minus"], {
                                                        className: "h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                        lineNumber: 1148,
                                                        columnNumber: 21
                                                    }, this),
                                                    " Xóa hàng"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                lineNumber: 1144,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "border-t border-border my-1"
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                lineNumber: 1150,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "w-full px-3 py-1.5 text-sm flex items-center gap-2 hover:bg-accent",
                                                onClick: ()=>{
                                                    editor?.chain().focus().mergeCells().run();
                                                    closeContextMenu();
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$table$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Table$3e$__["Table"], {
                                                        className: "h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                        lineNumber: 1155,
                                                        columnNumber: 21
                                                    }, this),
                                                    " Gộp ô"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                lineNumber: 1151,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "w-full px-3 py-1.5 text-sm flex items-center gap-2 hover:bg-accent",
                                                onClick: ()=>{
                                                    editor?.chain().focus().splitCell().run();
                                                    closeContextMenu();
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$table$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Table$3e$__["Table"], {
                                                        className: "h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                        lineNumber: 1161,
                                                        columnNumber: 21
                                                    }, this),
                                                    " Tách ô"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                lineNumber: 1157,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "border-t border-border my-1"
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                lineNumber: 1163,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "w-full px-3 py-1.5 text-sm flex items-center gap-2 hover:bg-accent text-destructive",
                                                onClick: ()=>{
                                                    editor?.chain().focus().deleteTable().run();
                                                    closeContextMenu();
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                        className: "h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                        lineNumber: 1168,
                                                        columnNumber: 21
                                                    }, this),
                                                    " Xóa bảng"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                                lineNumber: 1164,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                        lineNumber: 1106,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                lineNumber: 1092,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                        lineNumber: 657,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-[45%] flex flex-col border rounded-lg overflow-hidden bg-background",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between px-4 py-3 border-b bg-muted/30",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-lg font-medium",
                                        children: "Bản xem trước"
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                        lineNumber: 1180,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "outline",
                                        size: "sm",
                                        onClick: handlePrint,
                                        children: "In thử"
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                        lineNumber: 1181,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                lineNumber: 1179,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$scroll$2d$area$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollArea"], {
                                className: "flex-1 bg-white",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-6",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("mx-auto", selectedSize === 'A4' ? "max-w-[210mm]" : selectedSize === 'A5' ? "max-w-[148mm]" : selectedSize === 'K80' ? "max-w-[80mm]" : "max-w-[57mm]"),
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            dangerouslySetInnerHTML: {
                                                __html: previewHtml
                                            },
                                            className: "print-preview-content"
                                        }, void 0, false, {
                                            fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                            lineNumber: 1198,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                        lineNumber: 1189,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                    lineNumber: 1188,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                lineNumber: 1187,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                        lineNumber: 1177,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                lineNumber: 655,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                children: `
        .print-preview-content {
          font-family: Arial, sans-serif;
          font-size: 13px;
          line-height: 1.5;
          color: #000;
        }
        .print-preview-content table {
          width: 100%;
          border-collapse: collapse;
        }
        .print-preview-content th, 
        .print-preview-content td {
          padding: 6px 8px;
          border: 1px solid #ddd;
        }
        .print-preview-content th {
          background: #f5f5f5;
          font-weight: 600;
        }
        .print-preview-content .text-center { text-align: center; }
        .print-preview-content .text-right { text-align: right; }
        .print-preview-content .text-left { text-align: left; }
        .print-preview-content .font-bold { font-weight: bold; }
        .print-preview-content .uppercase { text-transform: uppercase; }
        .print-preview-content .header { text-align: center; margin-bottom: 20px; }
        .print-preview-content .company-name { font-size: 16px; font-weight: bold; text-transform: uppercase; }
        .print-preview-content .title { font-size: 20px; font-weight: bold; text-transform: uppercase; margin: 15px 0; }
        .print-preview-content .info-table { width: 100%; margin-bottom: 20px; }
        .print-preview-content .info-table td { border: none; padding: 4px 0; }
        .print-preview-content .signature-section { margin-top: 40px; display: flex; justify-content: space-between; }
        .print-preview-content .signature-box { text-align: center; width: 45%; }
        .print-preview-content .signature-title { font-weight: 600; margin-bottom: 60px; }
        .print-preview-content .signature-note { font-style: italic; font-size: 12px; color: #666; }
        .print-preview-content ul { list-style-type: disc; padding-left: 25px; margin: 0.5em 0; }
        .print-preview-content ol { list-style-type: decimal; padding-left: 25px; margin: 0.5em 0; }
        .print-preview-content li { display: list-item; margin: 0.2em 0; }
        
        /* TipTap Editor Styles */
        .ProseMirror {
          min-height: 400px;
          outline: none;
        }
        .ProseMirror p {
          margin: 0.5em 0;
        }
        .ProseMirror table {
          border-collapse: collapse;
          margin: 1em 0;
          overflow: hidden;
          table-layout: fixed;
          width: 100%;
        }
        .ProseMirror table td,
        .ProseMirror table th {
          border: 1px solid #ddd;
          box-sizing: border-box;
          min-width: 1em;
          padding: 6px 8px;
          position: relative;
          vertical-align: top;
        }
        .ProseMirror table th {
          background-color: #f5f5f5;
          font-weight: bold;
          text-align: left;
        }
        .ProseMirror table .selectedCell:after {
          background: rgba(200, 200, 255, 0.4);
          content: "";
          left: 0; right: 0; top: 0; bottom: 0;
          pointer-events: none;
          position: absolute;
          z-index: 2;
        }
        .ProseMirror table .column-resize-handle {
          background-color: #adf;
          bottom: -2px;
          position: absolute;
          right: -2px;
          pointer-events: none;
          top: 0;
          width: 4px;
        }
        .ProseMirror blockquote {
          border-left: 3px solid #ddd;
          margin: 1em 0;
          padding-left: 1em;
          color: #666;
        }
        .ProseMirror ul {
          padding-left: 25px;
          margin: 0.5rem 0;
          list-style-type: disc;
        }
        .ProseMirror ol {
          padding-left: 25px;
          margin: 0.5rem 0;
          list-style-type: decimal;
        }
        .ProseMirror li {
          display: list-item;
        }
        .ProseMirror hr {
          border: none;
          border-top: 1px solid #ddd;
          margin: 1em 0;
        }
        .ProseMirror img {
          max-width: 100%;
          height: auto;
        }
        .ProseMirror mark {
          border-radius: 0.25em;
          box-decoration-break: clone;
          padding: 0.1em 0.25em;
        }
      `
            }, void 0, false, {
                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                lineNumber: 1208,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"], {
                open: showImageUrlDialog,
                onOpenChange: setShowImageUrlDialog,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogContent"], {
                    className: "sm:max-w-md",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogHeader"], {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogTitle"], {
                                children: "Chèn URL hình ảnh"
                            }, void 0, false, {
                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                lineNumber: 1331,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                            lineNumber: 1330,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-4 py-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                            htmlFor: "imageUrl",
                                            children: "Nhập URL hình ảnh"
                                        }, void 0, false, {
                                            fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                            lineNumber: 1335,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                            id: "imageUrl",
                                            value: imageUrl,
                                            onChange: (e)=>setImageUrl(e.target.value),
                                            placeholder: "https://example.com/image.jpg"
                                        }, void 0, false, {
                                            fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                            lineNumber: 1336,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                    lineNumber: 1334,
                                    columnNumber: 13
                                }, this),
                                imageUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "border border-border rounded-lg p-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-muted-foreground mb-2",
                                            children: "Xem trước:"
                                        }, void 0, false, {
                                            fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                            lineNumber: 1345,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            src: imageUrl,
                                            alt: "Preview",
                                            className: "max-h-32 mx-auto",
                                            onError: (e)=>{
                                                e.target.style.display = 'none';
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                            lineNumber: 1346,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                    lineNumber: 1344,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                            lineNumber: 1333,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-end gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "outline",
                                    onClick: ()=>{
                                        setImageUrl('');
                                        setShowImageUrlDialog(false);
                                    },
                                    children: "Huỷ"
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                    lineNumber: 1358,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    onClick: confirmAddImage,
                                    disabled: !imageUrl,
                                    children: "OK"
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                    lineNumber: 1361,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                            lineNumber: 1357,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                    lineNumber: 1329,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                lineNumber: 1328,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"], {
                open: showResetDialog,
                onOpenChange: setShowResetDialog,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogContent"], {
                    className: "sm:max-w-md",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogHeader"], {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogTitle"], {
                                children: "Sử dụng mẫu có sẵn"
                            }, void 0, false, {
                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                lineNumber: 1372,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                            lineNumber: 1371,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "py-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "Bạn có chắc chắn muốn sử dụng mẫu có sẵn? Nội dung hiện tại sẽ bị thay thế."
                            }, void 0, false, {
                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                lineNumber: 1375,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                            lineNumber: 1374,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-end gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "outline",
                                    onClick: ()=>setShowResetDialog(false),
                                    children: "Huỷ"
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                    lineNumber: 1378,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    onClick: confirmReset,
                                    children: "OK"
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                    lineNumber: 1381,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                            lineNumber: 1377,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                    lineNumber: 1370,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                lineNumber: 1369,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"], {
                open: showExitDialog,
                onOpenChange: setShowExitDialog,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogContent"], {
                    className: "sm:max-w-md",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogHeader"], {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogTitle"], {
                                children: "Thay đổi chưa được lưu"
                            }, void 0, false, {
                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                lineNumber: 1392,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                            lineNumber: 1391,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "py-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "Bạn có thay đổi chưa được lưu. Bạn có chắc chắn muốn thoát không?"
                            }, void 0, false, {
                                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                lineNumber: 1395,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                            lineNumber: 1394,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-end gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "outline",
                                    onClick: ()=>setShowExitDialog(false),
                                    children: "Tiếp tục chỉnh sửa"
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                    lineNumber: 1398,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "destructive",
                                    onClick: confirmExit,
                                    children: "Thoát không lưu"
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                    lineNumber: 1401,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    onClick: ()=>{
                                        handleSave();
                                        setShowExitDialog(false);
                                        window.history.back();
                                    },
                                    children: "Lưu và thoát"
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                                    lineNumber: 1404,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                            lineNumber: 1397,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                    lineNumber: 1390,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/settings/printer/print-templates-page.tsx",
                lineNumber: 1389,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/settings/printer/print-templates-page.tsx",
        lineNumber: 566,
        columnNumber: 5
    }, this);
}
_s(PrintTemplatesPage, "M2gJrdJ7ZGPoQy0xSxcnpkH5OnU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$use$2d$settings$2d$page$2d$header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSettingsPageHeader"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePrintTemplateStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBranchStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$react$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useEditor"]
    ];
});
_c = PrintTemplatesPage;
var _c;
__turbopack_context__.k.register(_c, "PrintTemplatesPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/(authenticated)/settings/print-templates/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$print$2d$templates$2d$page$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/print-templates-page.tsx [app-client] (ecmascript)");
'use client';
;
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$print$2d$templates$2d$page$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PrintTemplatesPage"];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_35bd2e24._.js.map