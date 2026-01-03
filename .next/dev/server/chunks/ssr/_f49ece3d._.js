module.exports = [
"[project]/lib/id-types.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Type-safe ID System
 * 
 * Prevents mixing systemId with business ID at compile time
 */ // Branded types for type safety
__turbopack_context__.s([
    "asBusinessId",
    ()=>asBusinessId,
    "asSystemId",
    ()=>asSystemId,
    "buildEntityLink",
    ()=>buildEntityLink,
    "ensureBusinessId",
    ()=>ensureBusinessId,
    "ensureSystemId",
    ()=>ensureSystemId,
    "getDisplayId",
    ()=>getDisplayId,
    "isBusinessIdFormat",
    ()=>isBusinessIdFormat,
    "isSystemIdFormat",
    ()=>isSystemIdFormat,
    "parseId",
    ()=>parseId
]);
function asSystemId(id) {
    return id;
}
function asBusinessId(id) {
    return id;
}
function isSystemIdFormat(id) {
    // SystemId: 8 digits + prefix (e.g., NV00000001, VOUCHER00000123)
    return /^[A-Z]+\d{8}$/.test(id);
}
function isBusinessIdFormat(id) {
    // Business ID: shorter, variable length (e.g., NV001, PT000001)
    return /^[A-Z]+\d{3,6}$/.test(id);
}
function parseId(id) {
    if (isSystemIdFormat(id)) {
        return {
            type: 'system',
            value: asSystemId(id)
        };
    }
    if (isBusinessIdFormat(id)) {
        return {
            type: 'business',
            value: asBusinessId(id)
        };
    }
    throw new Error(`Invalid ID format: ${id}`);
}
function buildEntityLink(path, entity) {
    return path.replace(':systemId', entity.systemId);
}
function getDisplayId(entity) {
    return entity.id;
}
function ensureSystemId(id, context) {
    if (!isSystemIdFormat(id)) {
        console.warn(`[ensureSystemId] Invalid SystemId format: "${id}"${context ? ` in ${context}` : ''}`);
    }
    return asSystemId(id);
}
function ensureBusinessId(id, context) {
    if (!isBusinessIdFormat(id)) {
        console.warn(`[ensureBusinessId] Invalid BusinessId format: "${id}"${context ? ` in ${context}` : ''}`);
    }
    return asBusinessId(id);
}
}),
"[project]/lib/types/prisma-extended.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Extended Prisma Types with Relations
 * 
 * Các type mở rộng từ Prisma model với relations được include.
 * Sử dụng khi cần access nested data từ Prisma queries với include.
 * 
 * MIGRATION NOTE: Đang trong quá trình migrate từ app types sang Prisma types.
 * File này export cả Prisma types (với hậu tố Model/WithItems) và alias types cho compatibility.
 */ __turbopack_context__.s([
    "ASSIGNEE_ROLES",
    ()=>ASSIGNEE_ROLES,
    "DEFAULT_PKGX_SETTINGS",
    ()=>DEFAULT_PKGX_SETTINGS,
    "PAPER_SIZES",
    ()=>PAPER_SIZES,
    "PAYMENT_CATEGORY_LABELS",
    ()=>PAYMENT_CATEGORY_LABELS,
    "PAYMENT_STATUS_LABELS",
    ()=>PAYMENT_STATUS_LABELS,
    "PREDEFINED_WEBSITES",
    ()=>PREDEFINED_WEBSITES,
    "RECEIPT_CATEGORY_LABELS",
    ()=>RECEIPT_CATEGORY_LABELS,
    "RECEIPT_STATUS_LABELS",
    ()=>RECEIPT_STATUS_LABELS,
    "RESOLUTION_LABELS",
    ()=>RESOLUTION_LABELS,
    "SETTLEMENT_STATUS_LABELS",
    ()=>SETTLEMENT_STATUS_LABELS,
    "SETTLEMENT_TYPE_LABELS",
    ()=>SETTLEMENT_TYPE_LABELS,
    "SYNC_INTERVAL_OPTIONS",
    ()=>SYNC_INTERVAL_OPTIONS,
    "TASK_PRIORITIES",
    ()=>TASK_PRIORITIES,
    "TASK_STATUSES",
    ()=>TASK_STATUSES,
    "TEMPLATE_TYPES",
    ()=>TEMPLATE_TYPES,
    "WARRANTY_SETTLEMENT_STATUS_COLORS",
    ()=>WARRANTY_SETTLEMENT_STATUS_COLORS,
    "WARRANTY_SETTLEMENT_STATUS_LABELS",
    ()=>WARRANTY_SETTLEMENT_STATUS_LABELS,
    "WARRANTY_STATUS_COLORS",
    ()=>WARRANTY_STATUS_COLORS,
    "WARRANTY_STATUS_LABELS",
    ()=>WARRANTY_STATUS_LABELS,
    "WARRANTY_STATUS_TRANSITIONS",
    ()=>WARRANTY_STATUS_TRANSITIONS,
    "canTransitionStatus",
    ()=>canTransitionStatus,
    "complaintPriorityColors",
    ()=>complaintPriorityColors,
    "complaintPriorityLabels",
    ()=>complaintPriorityLabels,
    "complaintResolutionLabels",
    ()=>complaintResolutionLabels,
    "complaintStatusColors",
    ()=>complaintStatusColors,
    "complaintStatusLabels",
    ()=>complaintStatusLabels,
    "complaintTypeColors",
    ()=>complaintTypeColors,
    "complaintTypeLabels",
    ()=>complaintTypeLabels,
    "complaintVerificationColors",
    ()=>complaintVerificationColors,
    "complaintVerificationLabels",
    ()=>complaintVerificationLabels,
    "createEmptyAddress",
    ()=>createEmptyAddress,
    "getActiveWebsites",
    ()=>getActiveWebsites,
    "getComplaintResolutionLabel",
    ()=>getComplaintResolutionLabel,
    "getComplaintStatusLabel",
    ()=>getComplaintStatusLabel,
    "getComplaintTypeLabel",
    ()=>getComplaintTypeLabel,
    "getNextAllowedStatuses",
    ()=>getNextAllowedStatuses,
    "getWebsiteByCode",
    ()=>getWebsiteByCode,
    "getWebsiteColor",
    ()=>getWebsiteColor,
    "getWebsiteName",
    ()=>getWebsiteName,
    "isThreeLevelAddress",
    ()=>isThreeLevelAddress,
    "isTwoLevelAddress",
    ()=>isTwoLevelAddress,
    "penaltyCategoryColors",
    ()=>penaltyCategoryColors,
    "penaltyCategoryLabels",
    ()=>penaltyCategoryLabels,
    "penaltyStatusColors",
    ()=>penaltyStatusColors,
    "penaltyStatusLabels",
    ()=>penaltyStatusLabels
]);
function isTwoLevelAddress(address) {
    return address.inputLevel === '2-level';
}
function isThreeLevelAddress(address) {
    return address.inputLevel === '3-level';
}
function createEmptyAddress(level) {
    const base = {
        street: '',
        province: '',
        provinceId: '',
        district: '',
        districtId: 0,
        ward: '',
        wardId: ''
    };
    return {
        ...base,
        inputLevel: level
    };
}
const PAYMENT_STATUS_LABELS = {
    completed: 'Hoàn thành',
    cancelled: 'Đã hủy'
};
const PAYMENT_CATEGORY_LABELS = {
    purchase: 'Mua hàng',
    complaint_refund: 'Hoàn tiền khiếu nại',
    warranty_refund: 'Hoàn tiền bảo hành',
    salary: 'Chi lương',
    expense: 'Chi phí',
    supplier_payment: 'Thanh toán NCC',
    other: 'Khác'
};
const RECEIPT_STATUS_LABELS = {
    completed: 'Hoàn thành',
    cancelled: 'Đã hủy'
};
const RECEIPT_CATEGORY_LABELS = {
    sale: 'Bán hàng',
    complaint_penalty: 'Phạt nhân viên',
    warranty_additional: 'Thu thêm bảo hành',
    customer_payment: 'Thu tiền khách',
    other: 'Khác'
};
const TASK_PRIORITIES = [
    'Thấp',
    'Trung bình',
    'Cao',
    'Khẩn cấp',
    'low',
    'medium',
    'high',
    'urgent'
];
const TASK_STATUSES = [
    'Chưa bắt đầu',
    'Đang thực hiện',
    'Đang chờ',
    'Chờ duyệt',
    'Chờ xử lý',
    'Hoàn thành',
    'Đã hủy'
];
const ASSIGNEE_ROLES = [
    'owner',
    'contributor',
    'reviewer'
];
const WARRANTY_STATUS_LABELS = {
    incomplete: 'Chưa đầy đủ',
    pending: 'Chưa xử lý',
    processed: 'Đã xử lý',
    returned: 'Đã trả',
    completed: 'Kết thúc',
    cancelled: 'Đã hủy'
};
const WARRANTY_STATUS_COLORS = {
    incomplete: 'bg-orange-100 text-orange-800',
    pending: 'bg-yellow-100 text-yellow-800',
    processed: 'bg-green-100 text-green-800',
    returned: 'bg-gray-100 text-gray-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800 line-through'
};
const WARRANTY_SETTLEMENT_STATUS_LABELS = {
    pending: 'Chưa thanh toán',
    partial: 'Thanh toán một phần',
    completed: 'Đã thanh toán'
};
const WARRANTY_SETTLEMENT_STATUS_COLORS = {
    pending: 'bg-red-100 text-red-800',
    partial: 'bg-orange-100 text-orange-800',
    completed: 'bg-green-100 text-green-800'
};
const RESOLUTION_LABELS = {
    return: 'Trả lại',
    replace: 'Đổi mới',
    deduct: 'Trừ tiền',
    out_of_stock: 'Hết hàng'
};
const SETTLEMENT_TYPE_LABELS = {
    cash: 'Trả tiền mặt',
    transfer: 'Chuyển khoản',
    debt: 'Ghi công nợ',
    voucher: 'Tạo voucher',
    order_deduction: 'Trừ vào tiền hàng',
    mixed: 'Kết hợp nhiều phương thức'
};
const SETTLEMENT_STATUS_LABELS = {
    pending: 'Chưa bù trừ',
    partial: 'Bù trừ 1 phần',
    completed: 'Đã hoàn thành',
    cancelled: 'Đã hủy'
};
const WARRANTY_STATUS_TRANSITIONS = {
    incomplete: [
        'pending'
    ],
    pending: [
        'processed'
    ],
    processed: [
        'returned'
    ],
    returned: [
        'completed'
    ],
    completed: [],
    cancelled: []
};
function canTransitionStatus(currentStatus, newStatus) {
    return WARRANTY_STATUS_TRANSITIONS[currentStatus].includes(newStatus);
}
function getNextAllowedStatuses(currentStatus) {
    return WARRANTY_STATUS_TRANSITIONS[currentStatus];
}
const complaintTypeLabels = {
    "wrong-product": "Sai hàng",
    "missing-items": "Thiếu hàng",
    "wrong-packaging": "Đóng gói sai quy cách",
    "warehouse-defect": "Trả hàng lỗi do kho",
    "product-condition": "Phàn nàn về tình trạng hàng"
};
const complaintTypeColors = {
    "wrong-product": "bg-red-500/10 text-red-700 border-red-200",
    "missing-items": "bg-orange-500/10 text-orange-700 border-orange-200",
    "wrong-packaging": "bg-yellow-500/10 text-yellow-700 border-yellow-200",
    "warehouse-defect": "bg-purple-500/10 text-purple-700 border-purple-200",
    "product-condition": "bg-pink-500/10 text-pink-700 border-pink-200"
};
const complaintStatusLabels = {
    pending: "Chờ xử lý",
    investigating: "Đang kiểm tra",
    resolved: "Đã giải quyết",
    cancelled: "Đã hủy",
    ended: "Kết thúc"
};
const complaintStatusColors = {
    pending: "bg-gray-500/10 text-gray-700 border-gray-200",
    investigating: "bg-blue-500/10 text-blue-700 border-blue-200",
    resolved: "bg-green-500/10 text-green-700 border-green-200",
    cancelled: "bg-red-500/10 text-red-700 border-red-200",
    ended: "bg-purple-500/10 text-purple-700 border-purple-200"
};
const complaintResolutionLabels = {
    refund: "Trừ tiền vào đơn hàng",
    "return-shipping": "Gửi trả hàng (shop chịu phí)",
    "advice-only": "Tư vấn/Hỗ trợ",
    replacement: "Đổi sản phẩm",
    rejected: "Từ chối khiếu nại"
};
const complaintVerificationLabels = {
    "verified-correct": "Xác nhận đúng",
    "verified-incorrect": "Xác nhận sai",
    "pending-verification": "Chưa xác minh"
};
const complaintVerificationColors = {
    "verified-correct": "bg-red-500/10 text-red-700 border-red-200",
    "verified-incorrect": "bg-green-500/10 text-green-700 border-green-200",
    "pending-verification": "bg-gray-500/10 text-gray-700 border-gray-200"
};
const complaintPriorityLabels = {
    low: "Thấp",
    medium: "Trung bình",
    high: "Cao",
    urgent: "Khẩn cấp"
};
const complaintPriorityColors = {
    low: "bg-gray-500/10 text-gray-700 border-gray-200",
    medium: "bg-blue-500/10 text-blue-700 border-blue-200",
    high: "bg-orange-500/10 text-orange-700 border-orange-200",
    urgent: "bg-red-500/10 text-red-700 border-red-200"
};
function getComplaintTypeLabel(type) {
    return complaintTypeLabels[type];
}
function getComplaintStatusLabel(status) {
    return complaintStatusLabels[status];
}
function getComplaintResolutionLabel(resolution) {
    return complaintResolutionLabels[resolution];
}
const penaltyStatusLabels = {
    'Chưa thanh toán': 'Chưa thanh toán',
    'Đã thanh toán': 'Đã thanh toán',
    'Đã hủy': 'Đã hủy'
};
const penaltyStatusColors = {
    'Chưa thanh toán': 'bg-yellow-500/10 text-yellow-700 border-yellow-200',
    'Đã thanh toán': 'bg-green-500/10 text-green-700 border-green-200',
    'Đã hủy': 'bg-gray-500/10 text-gray-700 border-gray-200'
};
const penaltyCategoryLabels = {
    complaint: 'Khiếu nại',
    attendance: 'Chấm công',
    performance: 'Hiệu suất',
    other: 'Khác'
};
const penaltyCategoryColors = {
    complaint: 'bg-red-500/10 text-red-700 border-red-200',
    attendance: 'bg-orange-500/10 text-orange-700 border-orange-200',
    performance: 'bg-blue-500/10 text-blue-700 border-blue-200',
    other: 'bg-gray-500/10 text-gray-700 border-gray-200'
};
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
const PREDEFINED_WEBSITES = [
    {
        code: 'pkgx',
        name: 'Phụ kiện giá xưởng',
        shortName: 'PKGX',
        description: 'Website phukiengiaxuong.com.vn',
        baseUrl: 'https://phukiengiaxuong.com.vn',
        adminUrl: 'https://phukiengiaxuong.com.vn/admin',
        apiUrl: 'https://phukiengiaxuong.com.vn/admin/api_product_hrm_v1.php',
        platform: 'ecshop',
        isActive: true,
        sortOrder: 1,
        color: '#ef4444',
        features: {
            syncProducts: true,
            syncCategories: true,
            syncBrands: true,
            syncInventory: true,
            syncPrices: true,
            syncSeo: true,
            uploadImages: true
        }
    },
    {
        code: 'trendtech',
        name: 'Trendtech',
        shortName: 'Trendtech',
        description: 'Website Trendtech (sắp ra mắt)',
        baseUrl: '',
        platform: 'custom',
        isActive: true,
        sortOrder: 2,
        color: '#3b82f6',
        features: {
            syncProducts: true,
            syncCategories: true,
            syncBrands: true,
            syncInventory: true,
            syncPrices: true,
            syncSeo: true,
            uploadImages: true
        }
    }
];
function getWebsiteByCode(code) {
    return PREDEFINED_WEBSITES.find((w)=>w.code === code);
}
function getActiveWebsites() {
    return PREDEFINED_WEBSITES.filter((w)=>w.isActive).sort((a, b)=>a.sortOrder - b.sortOrder);
}
function getWebsiteName(code) {
    const website = getWebsiteByCode(code);
    return website?.name || code.toUpperCase();
}
function getWebsiteColor(code) {
    const website = getWebsiteByCode(code);
    return website?.color || '#6b7280';
}
const DEFAULT_PKGX_SETTINGS = {
    apiUrl: '',
    apiKey: '',
    enabled: false,
    categories: [],
    brands: [],
    priceMapping: {
        shopPrice: null,
        marketPrice: null,
        partnerPrice: null,
        acePrice: null,
        dealPrice: null
    },
    categoryMappings: [],
    brandMappings: [],
    syncSettings: {
        autoSyncEnabled: false,
        intervalMinutes: 60,
        syncInventory: true,
        syncPrice: true,
        syncSeo: false,
        syncOnProductUpdate: false,
        notifyOnError: true
    },
    logs: [],
    pkgxProducts: [],
    pkgxProductsLastFetch: undefined
};
const SYNC_INTERVAL_OPTIONS = [
    {
        value: 15,
        label: '15 phút'
    },
    {
        value: 30,
        label: '30 phút'
    },
    {
        value: 60,
        label: '1 giờ'
    },
    {
        value: 120,
        label: '2 giờ'
    },
    {
        value: 240,
        label: '4 giờ'
    }
];
}),
"[project]/lib/print-service.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PrintService",
    ()=>PrintService,
    "default",
    ()=>__TURBOPACK__default__export__,
    "formatCurrency",
    ()=>formatCurrency,
    "formatDate",
    ()=>formatDate,
    "formatDateTime",
    ()=>formatDateTime,
    "formatTime",
    ()=>formatTime,
    "generateLineItemsHtml",
    ()=>generateLineItemsHtml,
    "generatePrintHtml",
    ()=>generatePrintHtml,
    "getGeneralSettings",
    ()=>getGeneralSettings,
    "getPreviewHtml",
    ()=>getPreviewHtml,
    "getStoreData",
    ()=>getStoreData,
    "getStoreLogo",
    ()=>getStoreLogo,
    "hidePhoneMiddle",
    ()=>hidePhoneMiddle,
    "numberToWords",
    ()=>numberToWords,
    "printDocument",
    ()=>printDocument,
    "replaceVariables",
    ()=>replaceVariables
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$settings$2d$cache$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/settings-cache.ts [app-ssr] (ecmascript)");
;
;
;
function getGeneralSettings() {
    try {
        const settings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$settings$2d$cache$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getGeneralSettingsSync"])();
        return {
            companyName: settings.storeName,
            companyAddress: settings.storeAddress,
            phoneNumber: settings.storePhone,
            storeName: settings.storeName,
            storeAddress: settings.storeAddress,
            storePhone: settings.storePhone,
            logoUrl: settings.logoUrl
        };
    } catch (_e) {}
    return null;
}
function getStoreLogo(storeInfoLogo) {
    if (storeInfoLogo) return storeInfoLogo;
    try {
        const settings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$settings$2d$cache$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getGeneralSettingsSync"])();
        return settings.logoUrl || undefined;
    } catch (_e) {}
    return undefined;
}
function formatCurrency(amount) {
    if (amount === undefined || amount === null) return '0';
    return new Intl.NumberFormat('vi-VN').format(amount);
}
function numberToWords(amount) {
    if (!amount || amount === 0) return 'Không đồng';
    const units = [
        '',
        'một',
        'hai',
        'ba',
        'bốn',
        'năm',
        'sáu',
        'bảy',
        'tám',
        'chín'
    ];
    const positions = [
        '',
        'nghìn',
        'triệu',
        'tỷ',
        'nghìn tỷ',
        'triệu tỷ'
    ];
    const readThreeDigits = (num)=>{
        const hundred = Math.floor(num / 100);
        const ten = Math.floor(num % 100 / 10);
        const unit = num % 10;
        let result = '';
        if (hundred > 0) {
            result += units[hundred] + ' trăm ';
        }
        if (ten > 1) {
            result += units[ten] + ' mươi ';
            if (unit === 1) {
                result += 'mốt ';
            } else if (unit === 5) {
                result += 'lăm ';
            } else if (unit > 0) {
                result += units[unit] + ' ';
            }
        } else if (ten === 1) {
            result += 'mười ';
            if (unit === 5) {
                result += 'lăm ';
            } else if (unit > 0) {
                result += units[unit] + ' ';
            }
        } else if (ten === 0 && hundred > 0 && unit > 0) {
            result += 'lẻ ' + units[unit] + ' ';
        } else if (unit > 0) {
            result += units[unit] + ' ';
        }
        return result.trim();
    };
    let result = '';
    let num = Math.abs(Math.round(amount));
    let posIndex = 0;
    while(num > 0){
        const threeDigits = num % 1000;
        if (threeDigits > 0) {
            const words = readThreeDigits(threeDigits);
            result = words + ' ' + positions[posIndex] + ' ' + result;
        }
        num = Math.floor(num / 1000);
        posIndex++;
    }
    result = result.trim();
    // Capitalize first letter
    result = result.charAt(0).toUpperCase() + result.slice(1) + ' đồng';
    if (amount < 0) {
        result = 'Âm ' + result;
    }
    return result;
}
function hidePhoneMiddle(phone) {
    if (!phone) return '';
    if (phone.length < 6) return phone;
    const start = phone.slice(0, 3);
    const end = phone.slice(-3);
    return `${start}****${end}`;
}
function formatDate(date) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDateForDisplay"])(date);
}
function formatTime(date) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTimeForDisplay"])(date);
}
function formatDateTime(date) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDateTimeForDisplay"])(date);
}
// ============================================
// PRINT SERVICE
// ============================================
/**
 * CSS styles cho in ấn
 */ const PRINT_STYLES = `
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
`;
function replaceVariables(template, data) {
    let result = template;
    // Replace các biến đơn lẻ
    Object.entries(data).forEach(([key, value])=>{
        // Nếu không phải array (line items), replace trực tiếp
        if (!Array.isArray(value)) {
            const placeholder = key.startsWith('{') ? key : `{${key}}`;
            const stringValue = value?.toString() || '';
            result = result.split(placeholder).join(stringValue);
        }
    });
    return result;
}
function generateLineItemsHtml(templateRow, items, startIndex = 1) {
    return items.map((item, index)=>{
        let row = templateRow;
        // Replace {line_stt} với số thứ tự
        row = row.replace(/{line_stt}/g, (startIndex + index).toString());
        // Replace các biến line_* khác
        Object.entries(item).forEach(([key, value])=>{
            const placeholder = key.startsWith('{') ? key : `{${key}}`;
            const stringValue = value?.toString() || '';
            row = row.split(placeholder).join(stringValue);
        });
        return row;
    }).join('\n');
}
function generatePrintHtml(templateType, data, branchId) {
    const store = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePrintTemplateStore"].getState();
    const defaultSize = store.getDefaultSize(templateType);
    const template = store.getTemplate(templateType, defaultSize, branchId);
    let html = template.content;
    // Replace variables
    html = replaceVariables(html, data);
    return html;
}
function printDocument(templateType, data, options) {
    const store = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePrintTemplateStore"].getState();
    const paperSize = options?.paperSize || store.getDefaultSize(templateType);
    const template = store.getTemplate(templateType, paperSize, options?.branchId);
    // Generate HTML content
    const html = replaceVariables(template.content, data);
    // Tạo iframe ẩn để in
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'absolute';
    printFrame.style.top = '-10000px';
    printFrame.style.left = '-10000px';
    document.body.appendChild(printFrame);
    const printDoc = printFrame.contentDocument || printFrame.contentWindow?.document;
    if (printDoc) {
        const title = options?.title || `In ${templateType}`;
        printDoc.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <style>${PRINT_STYLES}</style>
      </head>
      <body>${html}</body>
      </html>
    `);
        printDoc.close();
        // Đợi load xong rồi in
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
}
function getPreviewHtml(templateType, data, options) {
    const store = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePrintTemplateStore"].getState();
    const paperSize = options?.paperSize || store.getDefaultSize(templateType);
    const template = store.getTemplate(templateType, paperSize, options?.branchId);
    return replaceVariables(template.content, data);
}
function getStoreData(settings) {
    const now = new Date();
    const logo = getStoreLogo(settings.logo);
    return {
        '{store_logo}': logo ? `<img src="${logo}" alt="Logo" style="max-height:60px"/>` : '',
        '{store_name}': settings.name || '',
        '{store_address}': settings.address || '',
        '{store_phone_number}': settings.phone || '',
        '{hotline}': settings.hotline || settings.phone || '',
        '{store_hotline}': settings.hotline || settings.phone || '',
        '{store_email}': settings.email || '',
        '{store_fax}': settings.fax || '',
        '{store_website}': settings.website || '',
        '{store_tax_code}': settings.taxCode || '',
        // Print timestamp - always inject current time
        '{print_date}': formatDate(now),
        '{print_time}': formatTime(now)
    };
}
const PrintService = {
    formatCurrency,
    numberToWords,
    formatDate,
    formatTime,
    formatDateTime,
    replaceVariables,
    generateLineItemsHtml,
    generatePrintHtml,
    printDocument,
    getPreviewHtml,
    getStoreData,
    getStoreLogo
};
const __TURBOPACK__default__export__ = PrintService;
}),
"[project]/lib/use-print.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePrint",
    ()=>usePrint
]);
/**
 * Hook để sử dụng Print Service trong các component
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-service.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/store.ts [app-ssr] (ecmascript)");
;
;
;
/**
 * Kiểm tra giá trị có "empty" không (null, undefined, '', '0', 0)
 */ function isEmptyValue(value) {
    if (value === undefined || value === null || value === '') return true;
    // Coi '0' và các biến thể như empty
    const strValue = String(value).trim();
    if (strValue === '0' || strValue === '0đ' || strValue === '0 đ') return true;
    return false;
}
/**
 * Xử lý các điều kiện trong template
 * Hỗ trợ:
 * - {{#if has_tax}}...{{/if}} - Điều kiện boolean
 * - {{#if_empty {field}}}...{{/if_empty}} - Nếu field rỗng
 * - {{#if_not_empty {field}}}...{{/if_not_empty}} - Nếu field không rỗng
 * - {{#if_gt {field} value}}...{{/if_gt}} - Nếu field > value (greater than)
 */ function processConditionals(html, data, _lineItems) {
    let result = html;
    // 1. Xử lý {{#if_not_empty {field}}}...{{/if_not_empty}}
    const ifNotEmptyPattern = /\{\{#if_not_empty\s+\{([^}]+)\}\}\}([\s\S]*?)\{\{\/if_not_empty\}\}/gi;
    result = result.replace(ifNotEmptyPattern, (match, field, content)=>{
        const key = `{${field}}`;
        const value = data[key];
        if (!isEmptyValue(value)) {
            return content;
        }
        return '';
    });
    // 2. Xử lý {{#if_empty {field}}}...{{/if_empty}}
    const ifEmptyPattern = /\{\{#if_empty\s+\{([^}]+)\}\}\}([\s\S]*?)\{\{\/if_empty\}\}/gi;
    result = result.replace(ifEmptyPattern, (match, field, content)=>{
        const key = `{${field}}`;
        const value = data[key];
        if (isEmptyValue(value)) {
            return content;
        }
        return '';
    });
    // 3. Xử lý {{#if_gt {field} value}}...{{/if_gt}} (greater than 0)
    const ifGtPattern = /\{\{#if_gt\s+\{([^}]+)\}\s+(\d+)\}\}([\s\S]*?)\{\{\/if_gt\}\}/gi;
    result = result.replace(ifGtPattern, (match, field, compareValue, content)=>{
        const key = `{${field}}`;
        const value = data[key];
        // Parse số từ giá trị (loại bỏ dấu chấm, đ, etc.)
        const numValue = parseFloat((value || '0').toString().replace(/[^\d.-]/g, ''));
        const numCompare = parseFloat(compareValue);
        if (numValue > numCompare) {
            return content;
        }
        return '';
    });
    // 4. Xử lý {{#if has_tax}}...{{/if}} - Boolean conditions
    // has_tax = true nếu total_tax > 0
    const hasTax = !isEmptyValue(data['{total_tax}']);
    const hasDiscount = !isEmptyValue(data['{total_discount}']);
    const hasDeliveryFee = !isEmptyValue(data['{delivery_fee}']);
    const hasNote = !isEmptyValue(data['{order_note}']);
    const booleanConditions = {
        'has_tax': hasTax,
        'has_discount': hasDiscount,
        'has_delivery_fee': hasDeliveryFee,
        'has_note': hasNote,
        'has_shipping_address': !isEmptyValue(data['{shipping_address}']),
        'has_customer_email': !isEmptyValue(data['{customer_email}']),
        'has_customer_phone': !isEmptyValue(data['{customer_phone_number}'])
    };
    // Xử lý {{#if condition}}...{{/if}}
    const ifPattern = /\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/gi;
    result = result.replace(ifPattern, (match, condition, content)=>{
        if (booleanConditions[condition]) {
            return content;
        }
        return '';
    });
    // 5. Xử lý {{#unless condition}}...{{/unless}} (ngược lại với if)
    const unlessPattern = /\{\{#unless\s+(\w+)\}\}([\s\S]*?)\{\{\/unless\}\}/gi;
    result = result.replace(unlessPattern, (match, condition, content)=>{
        if (!booleanConditions[condition]) {
            return content;
        }
        return '';
    });
    return result;
}
/**
 * Xử lý điều kiện cho line items
 * Ví dụ: {{#line_if_not_empty {line_tax_amount}}}...{{/line_if_not_empty}}
 */ function processLineItemConditionals(rowHtml, item) {
    let result = rowHtml;
    // Xử lý {{#line_if_not_empty {field}}}...{{/line_if_not_empty}}
    const lineIfNotEmptyPattern = /\{\{#line_if_not_empty\s+\{([^}]+)\}\}\}([\s\S]*?)\{\{\/line_if_not_empty\}\}/gi;
    result = result.replace(lineIfNotEmptyPattern, (match, field, content)=>{
        const key = `{${field}}`;
        const value = item[key];
        if (!isEmptyValue(value)) {
            return content;
        }
        return '';
    });
    // Xử lý {{#line_if_empty {field}}}...{{/line_if_empty}}
    const lineIfEmptyPattern = /\{\{#line_if_empty\s+\{([^}]+)\}\}\}([\s\S]*?)\{\{\/line_if_empty\}\}/gi;
    result = result.replace(lineIfEmptyPattern, (match, field, content)=>{
        const key = `{${field}}`;
        const value = item[key];
        if (isEmptyValue(value)) {
            return content;
        }
        return '';
    });
    return result;
}
function usePrint(currentBranchId) {
    const templateStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePrintTemplateStore"])();
    const [isLoading] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](false);
    const getTemplateContent = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((type, paperSize, branchId)=>{
        // Xác định paperSize sử dụng
        const size = paperSize || templateStore.getDefaultSize(type);
        const branch = branchId || currentBranchId;
        // Lấy template
        const template = templateStore.getTemplate(type, size, branch);
        if (template?.content) {
            return template.content;
        }
        // Fallback: thử lấy template không có branch
        const defaultTemplate = templateStore.getTemplate(type, size);
        return defaultTemplate?.content || null;
    }, [
        templateStore,
        currentBranchId
    ]);
    const processTemplate = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((templateContent, data, lineItems)=>{
        // Bước 1: Xử lý line items nếu có
        let html = templateContent;
        console.log('[processTemplate] Starting, lineItems count:', lineItems?.length);
        if (lineItems && lineItems.length > 0) {
            // === XỬ LÝ CÚ PHÁP {{#line_items}}...{{/line_items}} ===
            // Dành cho template lặp toàn bộ section (mỗi employee 1 page)
            const lineItemsBlockPattern = /\{\{#line_items\}\}([\s\S]*?)\{\{\/line_items\}\}/gi;
            const lineItemsBlockMatch = html.match(lineItemsBlockPattern);
            console.log('[processTemplate] Block match found:', !!lineItemsBlockMatch, lineItemsBlockMatch?.length);
            if (lineItemsBlockMatch && lineItemsBlockMatch.length > 0) {
                // Có block {{#line_items}} - lặp cả block cho mỗi item
                html = html.replace(lineItemsBlockPattern, (match, blockContent)=>{
                    return lineItems.map((item, index)=>{
                        let itemHtml = blockContent;
                        // Thêm {line_index}
                        itemHtml = itemHtml.replace(/\{line_index\}/g, String(index + 1));
                        // Replace các biến từ item (line item data)
                        Object.entries(item).forEach(([key, value])=>{
                            const placeholder = key.startsWith('{') ? key : `{${key}}`;
                            const regex = new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g');
                            itemHtml = itemHtml.replace(regex, value?.toString() || '');
                        });
                        // Replace các biến global (data) cho mỗi item page
                        Object.entries(data).forEach(([key, value])=>{
                            const placeholder = key.startsWith('{') ? key : `{${key}}`;
                            const regex = new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g');
                            itemHtml = itemHtml.replace(regex, value?.toString() || '');
                        });
                        return itemHtml;
                    }).join('\n');
                });
            // Đã xử lý xong line items theo block mode, skip table mode
            } else {
                // === XỬ LÝ TABLE MODE (cũ) ===
                // Tìm tất cả các table trong template
                const tablePattern = /<table[^>]*>[\s\S]*?<\/table>/gi;
                const tables = html.match(tablePattern);
                if (tables) {
                    // Tìm table chứa {line_stt} - đây là bảng line items
                    const lineItemsTable = tables.find((table)=>table.includes('{line_stt}'));
                    if (lineItemsTable) {
                        // Tìm tbody trong table này
                        const tbodyMatch = lineItemsTable.match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/i);
                        // Nếu không có tbody, có thể table chỉ có tr trực tiếp
                        // (một số template không dùng thead/tbody)
                        if (!tbodyMatch) {
                            // Tìm tất cả tr trong table (trừ tr trong thead)
                            const theadMatch = lineItemsTable.match(/<thead[^>]*>[\s\S]*?<\/thead>/i);
                            let tableWithoutThead = lineItemsTable;
                            if (theadMatch) {
                                tableWithoutThead = lineItemsTable.replace(theadMatch[0], '');
                            }
                            // Tìm tr chứa {line_stt}
                            const rowPattern = /<tr[^>]*>[\s\S]*?\{line_stt\}[\s\S]*?<\/tr>/i;
                            const rowMatch = tableWithoutThead.match(rowPattern);
                            if (rowMatch) {
                                const templateRow = rowMatch[0];
                                // Tạo các row mới từ template
                                const rowsHtml = lineItems.map((item)=>{
                                    let row = templateRow;
                                    // Xử lý điều kiện cho line item trước
                                    row = processLineItemConditionals(row, item);
                                    Object.entries(item).forEach(([key, value])=>{
                                        const placeholder = key.startsWith('{') ? key : `{${key}}`;
                                        const regex = new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g');
                                        row = row.replace(regex, value?.toString() || '');
                                    });
                                    return row;
                                }).join('\n    ');
                                // Thay thế row mẫu bằng các rows mới
                                const newTable = lineItemsTable.replace(templateRow, rowsHtml);
                                html = html.replace(lineItemsTable, newTable);
                            }
                        } else {
                            // Có tbody - xử lý như cũ
                            const tbodyContent = tbodyMatch[1];
                            // Tìm TẤT CẢ các row trong tbody
                            const allRowsPattern = /<tr[^>]*>[\s\S]*?<\/tr>/gi;
                            const allRows = tbodyContent.match(allRowsPattern);
                            if (allRows && allRows.length > 0) {
                                // Tìm row chứa {line_stt} - đây là row mẫu
                                const templateRow = allRows.find((row)=>row.includes('{line_stt}')) || allRows[0];
                                // Tạo các row mới từ template
                                const rowsHtml = lineItems.map((item)=>{
                                    let row = templateRow;
                                    // Xử lý điều kiện cho line item trước
                                    row = processLineItemConditionals(row, item);
                                    // Replace từng biến trong item
                                    Object.entries(item).forEach(([key, value])=>{
                                        const placeholder = key.startsWith('{') ? key : `{${key}}`;
                                        const regex = new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g');
                                        row = row.replace(regex, value?.toString() || '');
                                    });
                                    return row;
                                }).join('\n    ');
                                // Tạo tbody mới
                                const newTbody = `<tbody>\n    ${rowsHtml}\n  </tbody>`;
                                // Thay thế tbody cũ trong table
                                const newTable = lineItemsTable.replace(tbodyMatch[0], newTbody);
                                // Thay thế table cũ bằng table mới trong html
                                html = html.replace(lineItemsTable, newTable);
                            }
                        }
                    }
                }
            } // End of else (TABLE MODE)
        }
        // Bước 2: Xử lý các điều kiện (conditionals)
        html = processConditionals(html, data, lineItems);
        // Bước 3: Thay thế các biến còn lại
        html = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["replaceVariables"])(html, data);
        return html;
    }, []);
    const print = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((type, options)=>{
        const { data, lineItems, paperSize, branchId } = options;
        console.log('[usePrint] Starting print for type:', type);
        console.log('[usePrint] Data keys:', Object.keys(data));
        console.log('[usePrint] LineItems count:', lineItems?.length || 0);
        // Lấy template content
        const size = paperSize || templateStore.getDefaultSize(type);
        const templateContent = getTemplateContent(type, size, branchId);
        if (!templateContent) {
            console.error(`[usePrint] No template found for type: ${type}`);
            return;
        }
        console.log('[usePrint] Template found, length:', templateContent.length);
        // Xử lý template
        let html;
        try {
            html = processTemplate(templateContent, data, lineItems);
            console.log('[usePrint] Template processed, html length:', html.length);
        } catch (err) {
            console.error('[usePrint] Error processing template:', err);
            return;
        }
        // Tạo iframe ẩn để in
        const printFrame = document.createElement('iframe');
        printFrame.style.position = 'absolute';
        printFrame.style.top = '-10000px';
        printFrame.style.left = '-10000px';
        document.body.appendChild(printFrame);
        const printDoc = printFrame.contentDocument || printFrame.contentWindow?.document;
        if (printDoc) {
            // CSS cơ bản cho print - giống với Settings preview
            const printCSS = `
        body { font-family: Arial, sans-serif; font-size: 12px; line-height: 1.5; }
        table { width: 100%; border-collapse: collapse; margin: 8px 0; }
        th, td { border: 1px solid #333; padding: 6px 8px; }
        th { background-color: #f5f5f5; font-weight: bold; }
        .text-center, [style*="text-align: center"] { text-align: center; }
        .text-right, [style*="text-align: right"] { text-align: right; }
        img { max-width: 100%; height: auto; }
        h1, h2, h3 { margin: 8px 0; }
        p { margin: 4px 0; }
      `;
            printDoc.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>In ${type}</title>
          <style>${printCSS}</style>
        </head>
        <body>${html}</body>
        </html>
      `);
            printDoc.close();
            // Đợi load xong rồi in
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
    }, [
        templateStore,
        getTemplateContent,
        processTemplate
    ]);
    /**
   * In nhiều tài liệu cùng lúc - gộp thành 1 document với page break giữa các tài liệu
   */ const printMultiple = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((type, optionsList)=>{
        if (optionsList.length === 0) return;
        // Lấy template content (dùng paperSize của item đầu tiên hoặc default)
        const firstOptions = optionsList[0];
        const size = firstOptions.paperSize || templateStore.getDefaultSize(type);
        const templateContent = getTemplateContent(type, size, firstOptions.branchId);
        if (!templateContent) {
            console.error(`[usePrint] No template found for type: ${type}`);
            return;
        }
        // Xử lý từng document và gộp lại với page break
        const allHtmlParts = optionsList.map((options, index)=>{
            const html = processTemplate(templateContent, options.data, options.lineItems);
            // Thêm page break sau mỗi document (trừ document cuối)
            if (index < optionsList.length - 1) {
                return `<div class="print-page" style="page-break-after: always; break-after: page;">${html}</div>`;
            }
            return `<div class="print-page-last">${html}</div>`;
        });
        const combinedHtml = allHtmlParts.join('\n');
        // Tạo iframe ẩn để in
        const printFrame = document.createElement('iframe');
        printFrame.style.position = 'absolute';
        printFrame.style.top = '-10000px';
        printFrame.style.left = '-10000px';
        document.body.appendChild(printFrame);
        const printDoc = printFrame.contentDocument || printFrame.contentWindow?.document;
        if (printDoc) {
            // CSS cơ bản cho print với page break
            const printCSS = `
        * { box-sizing: border-box; }
        body { font-family: Arial, sans-serif; font-size: 12px; line-height: 1.5; margin: 0; padding: 0; }
        table { width: 100%; border-collapse: collapse; margin: 8px 0; }
        th, td { border: 1px solid #333; padding: 6px 8px; }
        th { background-color: #f5f5f5; font-weight: bold; }
        .text-center, [style*="text-align: center"] { text-align: center; }
        .text-right, [style*="text-align: right"] { text-align: right; }
        img { max-width: 100%; height: auto; }
        h1, h2, h3 { margin: 8px 0; }
        p { margin: 4px 0; }
        .print-page { 
          page-break-after: always !important; 
          break-after: page !important;
          page-break-inside: avoid;
        }
        .print-page-last { 
          page-break-after: auto; 
        }
        @media print {
          .print-page { 
            page-break-after: always !important; 
            break-after: page !important;
          }
          .print-page-last { 
            page-break-after: auto; 
          }
        }
      `;
            printDoc.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>In ${optionsList.length} ${type}</title>
          <style>${printCSS}</style>
        </head>
        <body>${combinedHtml}</body>
        </html>
      `);
            printDoc.close();
            // Đợi load xong rồi in
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
    }, [
        templateStore,
        getTemplateContent,
        processTemplate
    ]);
    /**
   * In nhiều loại tài liệu khác nhau cùng lúc - gộp thành 1 popup duy nhất
   * Ví dụ: In đơn hàng + phiếu giao hàng + phiếu đóng gói trong 1 lần
   */ const printMixedDocuments = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((documents)=>{
        if (documents.length === 0) return;
        // Xử lý từng document và gộp lại với page break
        const allHtmlParts = [];
        documents.forEach((doc, docIndex)=>{
            const { type, options } = doc;
            const { data, lineItems, paperSize, branchId } = options;
            // Lấy template content cho loại này
            const size = paperSize || templateStore.getDefaultSize(type);
            const templateContent = getTemplateContent(type, size, branchId);
            if (!templateContent) {
                console.warn(`[printMixedDocuments] No template found for type: ${type}, skipping`);
                return;
            }
            const html = processTemplate(templateContent, data, lineItems);
            // Thêm page break sau mỗi document (trừ document cuối)
            if (docIndex < documents.length - 1) {
                allHtmlParts.push(`<div class="print-page" style="page-break-after: always; break-after: page;">${html}</div>`);
            } else {
                allHtmlParts.push(`<div class="print-page-last">${html}</div>`);
            }
        });
        if (allHtmlParts.length === 0) {
            console.error('[printMixedDocuments] No documents to print');
            return;
        }
        const combinedHtml = allHtmlParts.join('\n');
        // Tạo iframe ẩn để in
        const printFrame = document.createElement('iframe');
        printFrame.style.position = 'absolute';
        printFrame.style.top = '-10000px';
        printFrame.style.left = '-10000px';
        document.body.appendChild(printFrame);
        const printDoc = printFrame.contentDocument || printFrame.contentWindow?.document;
        if (printDoc) {
            // CSS cơ bản cho print với page break
            const printCSS = `
        * { box-sizing: border-box; }
        body { font-family: Arial, sans-serif; font-size: 12px; line-height: 1.5; margin: 0; padding: 0; }
        table { width: 100%; border-collapse: collapse; margin: 8px 0; }
        th, td { border: 1px solid #333; padding: 6px 8px; }
        th { background-color: #f5f5f5; font-weight: bold; }
        .text-center, [style*="text-align: center"] { text-align: center; }
        .text-right, [style*="text-align: right"] { text-align: right; }
        img { max-width: 100%; height: auto; }
        h1, h2, h3 { margin: 8px 0; }
        p { margin: 4px 0; }
        .print-page { 
          page-break-after: always !important; 
          break-after: page !important;
          page-break-inside: avoid;
        }
        .print-page-last { 
          page-break-after: auto; 
        }
        @media print {
          .print-page { 
            page-break-after: always !important; 
            break-after: page !important;
          }
          .print-page-last { 
            page-break-after: auto; 
          }
        }
      `;
            printDoc.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>In ${documents.length} tài liệu</title>
          <style>${printCSS}</style>
        </head>
        <body>${combinedHtml}</body>
        </html>
      `);
            printDoc.close();
            // Đợi load xong rồi in
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
    }, [
        templateStore,
        getTemplateContent,
        processTemplate
    ]);
    const getPreview = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((type, options)=>{
        const { data, lineItems, paperSize, branchId } = options;
        // Lấy template content
        const templateContent = getTemplateContent(type, paperSize, branchId);
        if (!templateContent) {
            return '<p style="color: red;">Không tìm thấy mẫu in</p>';
        }
        // Xử lý template
        return processTemplate(templateContent, data, lineItems);
    }, [
        getTemplateContent,
        processTemplate
    ]);
    const hasTemplate = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((type, paperSize)=>{
        const size = paperSize || templateStore.getDefaultSize(type);
        const template = templateStore.getTemplate(type, size, currentBranchId);
        return !!template?.content;
    }, [
        templateStore,
        currentBranchId
    ]);
    const getAvailableSizes = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((type)=>{
        const sizes = [
            'K57',
            'K80',
            'A4',
            'A5'
        ];
        return sizes.filter((size)=>{
            const template = templateStore.getTemplate(type, size, currentBranchId);
            return !!template?.content;
        });
    }, [
        templateStore,
        currentBranchId
    ]);
    const getDefaultSize = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((type)=>{
        return templateStore.getDefaultSize(type);
    }, [
        templateStore
    ]);
    return {
        print,
        printMultiple,
        printMixedDocuments,
        getPreview,
        hasTemplate,
        getAvailableSizes,
        getDefaultSize,
        isLoading
    };
}
}),
"[project]/lib/print-mappers/complaint.mapper.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mapComplaintLineItems",
    ()=>mapComplaintLineItems,
    "mapComplaintToPrintData",
    ()=>mapComplaintToPrintData
]);
/**
 * Complaint Mapper - Phiếu khiếu nại
 * Đồng bộ với variables/phieu-khieu-nai.ts
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-service.ts [app-ssr] (ecmascript)");
;
const COMPLAINT_STATUS_MAP = {
    'new': 'Mới',
    'investigating': 'Đang xử lý',
    'resolved': 'Đã giải quyết',
    'closed': 'Đã đóng',
    'cancelled': 'Đã hủy'
};
const COMPLAINT_TYPE_MAP = {
    'missing-items': 'Thiếu hàng',
    'damaged-items': 'Hàng hư hỏng',
    'wrong-items': 'Sai hàng',
    'late-delivery': 'Giao hàng chậm',
    'service-quality': 'Chất lượng dịch vụ',
    'other': 'Khác'
};
function mapComplaintToPrintData(complaint, storeSettings) {
    const phone = complaint.customerPhoneHide ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hidePhoneMiddle"])(complaint.customerPhone || '') : complaint.customerPhone || '';
    const statusVi = COMPLAINT_STATUS_MAP[complaint.status || ''] || complaint.status || '';
    const typeVi = COMPLAINT_TYPE_MAP[complaint.complaintType || ''] || complaint.complaintType || '';
    return {
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getStoreData"])(storeSettings),
        // === THÔNG TIN CHI NHÁNH ===
        '{location_name}': complaint.location?.name || storeSettings.name || '',
        '{location_address}': complaint.location?.address || storeSettings.address || '',
        '{location_province}': complaint.location?.province || '',
        '{location_phone}': complaint.location?.phone || storeSettings.phone || '',
        '{store_province}': storeSettings.province || '',
        // === THÔNG TIN PHIẾU KHIẾU NẠI ===
        '{complaint_code}': complaint.code,
        '{created_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(complaint.createdAt),
        '{created_on_time}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTime"])(complaint.createdAt),
        '{modified_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(complaint.modifiedAt),
        '{account_name}': complaint.createdBy || '',
        // === THÔNG TIN KHÁCH HÀNG ===
        '{customer_name}': complaint.customerName,
        '{customer_code}': complaint.customerCode || '',
        '{customer_phone}': phone,
        '{customer_phone_number}': phone,
        '{customer_phone_hide}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hidePhoneMiddle"])(complaint.customerPhone || ''),
        '{customer_email}': complaint.customerEmail || '',
        '{customer_address}': complaint.customerAddress || '',
        '{customer_group}': complaint.customerGroup || '',
        // === THÔNG TIN ĐƠN HÀNG LIÊN QUAN ===
        '{order_code}': complaint.orderCode || '',
        '{order_date}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(complaint.orderCreatedAt),
        '{order_created_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(complaint.orderCreatedAt),
        '{order_total}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(complaint.orderTotal),
        // === THÔNG TIN KHIẾU NẠI ===
        '{complaint_type}': typeVi,
        '{complaint_category}': complaint.category || '',
        '{complaint_priority}': complaint.priority || '',
        '{complaint_source}': complaint.source || '',
        '{complaint_subject}': complaint.subject,
        '{complaint_description}': complaint.description,
        '{customer_request}': complaint.customerRequest || '',
        // === SẢN PHẨM LIÊN QUAN ===
        '{line_product_name}': complaint.productName || '',
        '{line_variant}': complaint.variantName || '',
        '{line_variant_code}': complaint.variantCode || '',
        // === TRẠNG THÁI & XỬ LÝ ===
        '{complaint_status}': statusVi,
        '{status}': statusVi,
        '{assigned_to}': complaint.assignedTo || '',
        '{assignee_name}': complaint.assignedTo || '',
        '{resolution}': complaint.resolution || '',
        '{resolution_note}': complaint.resolutionNote || '',
        '{resolved_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(complaint.resolvedAt),
        '{resolved_on_time}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTime"])(complaint.resolvedAt),
        '{response_deadline}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(complaint.responseDeadline),
        // === CHI PHÍ BỒI THƯỜNG ===
        '{compensation_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(complaint.compensationAmount),
        '{compensation_amount_text}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["numberToWords"])(complaint.compensationAmount || 0),
        '{note}': complaint.note || '',
        '{complaint_note}': complaint.note || ''
    };
}
function mapComplaintLineItems(items) {
    if (!items) return [];
    return items.map((item, index)=>({
            '{line_stt}': (index + 1).toString(),
            '{line_product_name}': item.productName,
            '{line_variant_code}': item.variantCode || '',
            '{line_quantity}': item.quantity?.toString() || '',
            '{line_issue}': item.issue || '',
            '{line_resolution}': item.resolution || ''
        }));
}
}),
"[project]/lib/print/complaint-print-helper.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * Complaint Print Helper
 * Helpers để chuẩn bị dữ liệu in cho phiếu khiếu nại
 */ __turbopack_context__.s([
    "convertComplaintForPrint",
    ()=>convertComplaintForPrint,
    "createStoreSettings",
    ()=>createStoreSettings
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$complaint$2e$mapper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-mappers/complaint.mapper.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-service.ts [app-ssr] (ecmascript)");
;
;
function convertComplaintForPrint(complaint, options = {}) {
    const { branch, customer, creator, assignee } = options;
    // Map trạng thái sang tiếng Việt
    const statusMap = {
        'open': 'Mở',
        'new': 'Mới',
        'in_progress': 'Đang xử lý',
        'investigating': 'Đang xác minh',
        'resolved': 'Đã giải quyết',
        'closed': 'Đã đóng',
        'cancelled': 'Đã hủy'
    };
    const priorityMap = {
        'low': 'Thấp',
        'medium': 'Trung bình',
        'high': 'Cao',
        'urgent': 'Khẩn cấp'
    };
    const typeMap = {
        'product': 'Sản phẩm',
        'service': 'Dịch vụ',
        'delivery': 'Giao hàng',
        'payment': 'Thanh toán',
        'missing-items': 'Thiếu hàng',
        'damaged-items': 'Hàng hư hỏng',
        'wrong-items': 'Sai hàng',
        'late-delivery': 'Giao hàng chậm',
        'service-quality': 'Chất lượng dịch vụ',
        'other': 'Khác'
    };
    // Format địa chỉ khách hàng
    const customerFirstAddress = customer?.addresses?.[0];
    const customerAddressString = customerFirstAddress ? [
        customerFirstAddress.street,
        customerFirstAddress.ward,
        customerFirstAddress.district,
        customerFirstAddress.province
    ].filter(Boolean).join(', ') : complaint.customerAddress || '';
    // Determine code - can be id or code field
    const codeValue = complaint.id || complaint.code || '';
    // Determine subject
    const subjectValue = complaint.subject || `Khiếu nại đơn hàng ${complaint.orderCode || complaint.orderId || ''}`;
    // Determine order code
    const orderCodeValue = complaint.orderCode || complaint.orderId;
    // Convert affected products to items array
    const items = complaint.affectedProducts ? complaint.affectedProducts.map((item)=>({
            productName: item.productName,
            variantCode: item.productId,
            quantity: (item.quantityMissing || 0) + (item.quantityDefective || 0) + (item.quantityExcess || 0),
            issue: item.issueType,
            resolution: item.resolutionType
        })) : undefined;
    return {
        // Thông tin cơ bản
        code: codeValue,
        createdAt: complaint.createdAt || '',
        modifiedAt: complaint.updatedAt,
        createdBy: creator?.fullName || complaint.createdByName,
        resolvedAt: complaint.resolvedAt,
        // Trạng thái
        status: complaint.status ? statusMap[complaint.status] || complaint.status : undefined,
        priority: complaint.priority ? priorityMap[complaint.priority] || complaint.priority : undefined,
        complaintType: complaint.type ? typeMap[complaint.type] || complaint.type : undefined,
        category: complaint.category,
        // Phụ trách - không fallback về ID
        assignedTo: assignee?.fullName || complaint.assigneeName || '',
        // Chi nhánh
        location: branch ? {
            name: branch.name,
            address: branch.address,
            province: branch.province
        } : complaint.branchName ? {
            name: complaint.branchName
        } : undefined,
        // Thông tin đơn hàng gốc
        orderCode: orderCodeValue,
        // Khách hàng
        customerName: customer?.name || complaint.customerName || '',
        customerCode: customer?.id,
        customerPhone: customer?.phone || complaint.customerPhone,
        customerEmail: customer?.email || complaint.customerEmail,
        customerAddress: customerAddressString,
        // Nội dung khiếu nại
        subject: subjectValue,
        description: complaint.description || '',
        resolution: complaint.resolution || complaint.proposedSolution,
        resolutionNote: complaint.resolutionNote,
        note: complaint.investigationNote || complaint.note,
        // Danh sách sản phẩm
        items
    };
}
function createStoreSettings(storeInfo) {
    // Fallback lấy từ general-settings nếu storeInfo trống
    const generalSettings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getGeneralSettings"])();
    return {
        name: storeInfo?.companyName || storeInfo?.brandName || generalSettings?.companyName || '',
        address: storeInfo?.headquartersAddress || generalSettings?.companyAddress || '',
        phone: storeInfo?.hotline || generalSettings?.phoneNumber || '',
        email: storeInfo?.email || generalSettings?.email || '',
        website: storeInfo?.website,
        taxCode: storeInfo?.taxCode,
        province: storeInfo?.province,
        logo: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getStoreLogo"])(storeInfo?.logo)
    };
}
;
}),
"[project]/lib/id-utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/smart-prefix.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-config.ts [app-ssr] (ecmascript)");
;
;
function generateSystemId(entityType, counter) {
    const config = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ID_CONFIG"][entityType];
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
    const prefix = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getPrefix"])(entityType);
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
    const prefix = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getPrefix"])(entityType);
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
}),
"[project]/lib/store-factory.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createCrudStore",
    ()=>createCrudStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
// persist, createJSONStorage removed - database is now source of truth
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/smart-prefix.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-config.ts [app-ssr] (ecmascript)");
;
;
;
;
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
    const businessPrefix = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getPrefix"])(entityType); // Vietnamese prefix for Business ID (NV, KH, DH)
    const config = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ID_CONFIG"][entityType];
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
                const newSystemId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createSystemId"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateSystemId"])(entityType, newSystemIdCounter));
                // Generate or validate Business ID (if field exists)
                const finalItem = {
                    ...item
                };
                let newBusinessIdCounter = currentCounters.businessId;
                if (businessIdField in item) {
                    const customId = item[businessIdField];
                    const existingIds = get().data.map((d)=>d[businessIdField]);
                    // ✅ If customId provided, validate uniqueness
                    if (customId && customId.trim()) {
                        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isBusinessIdUnique"])(customId, existingIds)) {
                            throw new Error(`Mã "${customId}" đã tồn tại! Vui lòng sử dụng mã khác.`);
                        }
                        finalItem[businessIdField] = customId.trim().toUpperCase();
                    } else {
                        // ✅ Auto-generate with findNextAvailableBusinessId
                        const digitCount = 6; // All entities use 6 digits
                        const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findNextAvailableBusinessId"])(businessPrefix, existingIds, newBusinessIdCounter, digitCount);
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
                        const newSystemId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createSystemId"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateSystemId"])(entityType, currentSystemIdCounter));
                        // Generate or validate Business ID (if field exists)
                        const finalItem = {
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
                                if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isBusinessIdUnique"])(customId, existingIds)) {
                                    throw new Error(`Mã "${customId}" đã tồn tại! Vui lòng sử dụng mã khác.`);
                                }
                                finalItem[businessIdField] = customId.trim().toUpperCase();
                            } else {
                                // ✅ Auto-generate with findNextAvailableBusinessId
                                const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findNextAvailableBusinessId"])(businessPrefix, existingIds, currentBusinessIdCounter, digitCount);
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
                    if (businessId && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isBusinessIdUnique"])(businessId, existingIds)) {
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
                            systemId: lastItem ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getMaxSystemIdCounter"])([
                                lastItem
                            ], systemIdPrefix) : 0,
                            businessId: lastItem && options?.businessIdField ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getMaxBusinessIdCounter"])([
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
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])(storeConfig);
};
}),
"[project]/lib/seed-audit.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_SEED_AUTHOR",
    ()=>DEFAULT_SEED_AUTHOR,
    "buildSeedAuditFields",
    ()=>buildSeedAuditFields
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
;
const DEFAULT_SEED_AUTHOR = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000001');
const buildSeedAuditFields = ({ createdAt, createdBy = DEFAULT_SEED_AUTHOR, updatedAt, updatedBy })=>({
        createdAt,
        updatedAt: updatedAt ?? createdAt,
        createdBy,
        updatedBy: updatedBy ?? createdBy
    });
}),
"[project]/hooks/use-print-options.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePrintOptions",
    ()=>usePrintOptions,
    "useSimplePrintOptions",
    ()=>useSimplePrintOptions
]);
/**
 * Hook để quản lý print options
 * Sử dụng database (user preferences) làm source of truth
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-ssr] (ecmascript)");
;
;
const API_BASE = '/api/user-preferences';
const SAVE_DEBOUNCE_DELAY = 500;
const PRINT_OPTIONS_KEY = 'print-options-default';
const DEFAULT_PRINT_OPTIONS = {
    branchSystemId: '',
    paperSize: 'A4',
    printOrder: true,
    printDelivery: false,
    printPacking: false,
    printShippingLabel: false
};
function usePrintOptions() {
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const [options, setOptionsState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(DEFAULT_PRINT_OPTIONS);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const saveTimeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const lastSavedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])('');
    // Load from database
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const loadOptions = async ()=>{
            try {
                if (user?.systemId) {
                    const res = await fetch(`${API_BASE}?userId=${user.systemId}&key=${encodeURIComponent(PRINT_OPTIONS_KEY)}`);
                    if (res.ok) {
                        const data = await res.json();
                        if (data && data.value) {
                            setOptionsState({
                                ...DEFAULT_PRINT_OPTIONS,
                                ...data.value
                            });
                            lastSavedRef.current = JSON.stringify(data.value);
                        }
                    }
                }
            } catch (error) {
                console.error('Error loading print options:', error);
            } finally{
                setIsLoading(false);
            }
        };
        loadOptions();
    }, [
        user?.systemId
    ]);
    // Cleanup timeout on unmount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        return ()=>{
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, []);
    // Update options - save to database with debounce
    const setOptions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((newOptions)=>{
        setOptionsState(newOptions);
        if (user?.systemId) {
            const newValueStr = JSON.stringify(newOptions);
            if (newValueStr === lastSavedRef.current) {
                return;
            }
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
            saveTimeoutRef.current = setTimeout(()=>{
                lastSavedRef.current = newValueStr;
                fetch(API_BASE, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userId: user.systemId,
                        key: PRINT_OPTIONS_KEY,
                        value: newOptions,
                        category: 'ui'
                    })
                }).catch((error)=>{
                    console.error('Error saving print options:', error);
                });
            }, SAVE_DEBOUNCE_DELAY);
        }
    }, [
        user?.systemId
    ]);
    return [
        options,
        setOptions,
        isLoading
    ];
}
const SIMPLE_PRINT_OPTIONS_KEY = 'simple-print-options-default';
const DEFAULT_SIMPLE_PRINT_OPTIONS = {
    branchSystemId: '',
    paperSize: 'A4'
};
function useSimplePrintOptions() {
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const [options, setOptionsState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(DEFAULT_SIMPLE_PRINT_OPTIONS);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const saveTimeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const lastSavedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])('');
    // Load from database
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const loadOptions = async ()=>{
            try {
                if (user?.systemId) {
                    const res = await fetch(`${API_BASE}?userId=${user.systemId}&key=${encodeURIComponent(SIMPLE_PRINT_OPTIONS_KEY)}`);
                    if (res.ok) {
                        const data = await res.json();
                        if (data && data.value) {
                            setOptionsState({
                                ...DEFAULT_SIMPLE_PRINT_OPTIONS,
                                ...data.value
                            });
                            lastSavedRef.current = JSON.stringify(data.value);
                        }
                    }
                }
            } catch (error) {
                console.error('Error loading simple print options:', error);
            } finally{
                setIsLoading(false);
            }
        };
        loadOptions();
    }, [
        user?.systemId
    ]);
    // Cleanup timeout on unmount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        return ()=>{
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, []);
    // Update options - save to database with debounce
    const setOptions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((newOptions)=>{
        setOptionsState(newOptions);
        if (user?.systemId) {
            const newValueStr = JSON.stringify(newOptions);
            if (newValueStr === lastSavedRef.current) {
                return;
            }
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
            saveTimeoutRef.current = setTimeout(()=>{
                lastSavedRef.current = newValueStr;
                fetch(API_BASE, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userId: user.systemId,
                        key: SIMPLE_PRINT_OPTIONS_KEY,
                        value: newOptions,
                        category: 'ui'
                    })
                }).catch((error)=>{
                    console.error('Error saving simple print options:', error);
                });
            }, SAVE_DEBOUNCE_DELAY);
        }
    }, [
        user?.systemId
    ]);
    return [
        options,
        setOptions,
        isLoading
    ];
}
}),
"[project]/hooks/use-public-tracking-settings.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_TRACKING_SETTINGS",
    ()=>DEFAULT_TRACKING_SETTINGS,
    "getComplaintsTrackingSettingsSync",
    ()=>getComplaintsTrackingSettingsSync,
    "getWarrantyTrackingSettingsSync",
    ()=>getWarrantyTrackingSettingsSync,
    "initComplaintsTrackingSettings",
    ()=>initComplaintsTrackingSettings,
    "initWarrantyTrackingSettings",
    ()=>initWarrantyTrackingSettings,
    "useComplaintsTrackingSettings",
    ()=>useComplaintsTrackingSettings,
    "useWarrantyTrackingSettings",
    ()=>useWarrantyTrackingSettings
]);
/**
 * usePublicTrackingSettings - React Query Hooks
 * 
 * Replaces localStorage for public tracking settings:
 * - warranty-public-tracking-settings
 * - complaints-public-tracking-settings
 * 
 * @see docs/LOCALSTORAGE-TO-DATABASE-MIGRATION.md
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lodash$2f$debounce$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lodash/debounce.js [app-ssr] (ecmascript)");
;
;
const DEFAULT_TRACKING_SETTINGS = {
    enabled: false,
    allowCustomerComments: false,
    showEmployeeName: true,
    showTimeline: true
};
// ============================================================================
// In-memory cache for sync access
// ============================================================================
let warrantyTrackingCache = null;
let complaintsTrackingCache = null;
// ============================================================================
// API functions
// ============================================================================
const PREFERENCE_CATEGORY = 'tracking-settings';
const WARRANTY_KEY = 'warranty-public-tracking';
const COMPLAINTS_KEY = 'complaints-public-tracking';
async function loadFromAPI(key) {
    try {
        const response = await fetch(`/api/user-preferences?category=${PREFERENCE_CATEGORY}&key=${key}`);
        if (response.ok) {
            const data = await response.json();
            if (data.value) {
                return {
                    ...DEFAULT_TRACKING_SETTINGS,
                    ...data.value
                };
            }
        }
    } catch (error) {
        console.error(`[usePublicTrackingSettings] Failed to load ${key}:`, error);
    }
    return DEFAULT_TRACKING_SETTINGS;
}
async function saveToAPI(key, settings) {
    try {
        await fetch('/api/user-preferences', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                category: PREFERENCE_CATEGORY,
                key,
                value: settings
            })
        });
    } catch (error) {
        console.error(`[usePublicTrackingSettings] Failed to save ${key}:`, error);
    }
}
function useWarrantyTrackingSettings() {
    const [settings, setSettings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(warrantyTrackingCache || DEFAULT_TRACKING_SETTINGS);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(!warrantyTrackingCache);
    const [isSaving, setIsSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // Load from API on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (warrantyTrackingCache) {
            setSettings(warrantyTrackingCache);
            setIsLoading(false);
            return;
        }
        loadFromAPI(WARRANTY_KEY).then((loaded)=>{
            warrantyTrackingCache = loaded;
            setSettings(loaded);
            setIsLoading(false);
        });
    }, []);
    // Debounced save
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedSave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lodash$2f$debounce$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(async (newSettings)=>{
        setIsSaving(true);
        await saveToAPI(WARRANTY_KEY, newSettings);
        setIsSaving(false);
    }, 500), []);
    const updateSettings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((newSettings)=>{
        warrantyTrackingCache = newSettings;
        setSettings(newSettings);
        debouncedSave(newSettings);
    }, [
        debouncedSave
    ]);
    const updateField = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((key, value)=>{
        const newSettings = {
            ...settings,
            [key]: value
        };
        updateSettings(newSettings);
    }, [
        settings,
        updateSettings
    ]);
    return {
        settings,
        setSettings: updateSettings,
        updateField,
        isLoading,
        isSaving
    };
}
function useComplaintsTrackingSettings() {
    const [settings, setSettings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(complaintsTrackingCache || DEFAULT_TRACKING_SETTINGS);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(!complaintsTrackingCache);
    const [isSaving, setIsSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // Load from API on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (complaintsTrackingCache) {
            setSettings(complaintsTrackingCache);
            setIsLoading(false);
            return;
        }
        loadFromAPI(COMPLAINTS_KEY).then((loaded)=>{
            complaintsTrackingCache = loaded;
            setSettings(loaded);
            setIsLoading(false);
        });
    }, []);
    // Debounced save
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedSave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lodash$2f$debounce$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(async (newSettings)=>{
        setIsSaving(true);
        await saveToAPI(COMPLAINTS_KEY, newSettings);
        setIsSaving(false);
    }, 500), []);
    const updateSettings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((newSettings)=>{
        complaintsTrackingCache = newSettings;
        setSettings(newSettings);
        debouncedSave(newSettings);
    }, [
        debouncedSave
    ]);
    const updateField = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((key, value)=>{
        const newSettings = {
            ...settings,
            [key]: value
        };
        updateSettings(newSettings);
    }, [
        settings,
        updateSettings
    ]);
    return {
        settings,
        setSettings: updateSettings,
        updateField,
        isLoading,
        isSaving
    };
}
function getWarrantyTrackingSettingsSync() {
    if (!warrantyTrackingCache) {
        // Trigger async load
        loadFromAPI(WARRANTY_KEY).then((loaded)=>{
            warrantyTrackingCache = loaded;
        });
        return DEFAULT_TRACKING_SETTINGS;
    }
    return warrantyTrackingCache;
}
function getComplaintsTrackingSettingsSync() {
    if (!complaintsTrackingCache) {
        // Trigger async load
        loadFromAPI(COMPLAINTS_KEY).then((loaded)=>{
            complaintsTrackingCache = loaded;
        });
        return DEFAULT_TRACKING_SETTINGS;
    }
    return complaintsTrackingCache;
}
async function initWarrantyTrackingSettings() {
    if (!warrantyTrackingCache) {
        warrantyTrackingCache = await loadFromAPI(WARRANTY_KEY);
    }
    return warrantyTrackingCache;
}
async function initComplaintsTrackingSettings() {
    if (!complaintsTrackingCache) {
        complaintsTrackingCache = await loadFromAPI(COMPLAINTS_KEY);
    }
    return complaintsTrackingCache;
}
}),
];

//# sourceMappingURL=_f49ece3d._.js.map